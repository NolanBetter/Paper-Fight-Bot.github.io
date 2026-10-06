/* fightbot-web.js - the FightBot web editor's connection to a server.
 *
 * Protocol v1, matching FightBot 5.17.0's /fightbot web. No dependencies:
 * fetch, EventSource, WebCrypto and CompressionStream, all built into
 * browsers (and Node 22 with --experimental-eventsource, for tests).
 *
 * How it works, in one paragraph: /fightbot web gives the admin a link like
 *   https://www.fightmc.xyz/editor/#k=<43 characters>
 * The part after k= is a random 32-byte secret. From it both sides work out
 * a session id (where on the relay to meet) and an AES-256-GCM key. The
 * page and the server never talk directly: both read and write JSON on a
 * Firebase Realtime Database (the "relay") over its REST API, and every
 * message is sealed with the key, so the relay only ever holds ciphertext.
 * The page writes requests to inbox/<sid> and follows sessions/<sid>, where
 * the server writes replies and events (up/) and snapshots (state/).
 *
 * Usage:
 *   import { connectFromLink } from "./fightbot-web.js";
 *   const ed = await connectFromLink(location.hash, {
 *     onEvent: (name, data) => {},      // "debug.lines", "paused"
 *     onState: (name, data) => {},      // "bots" (while watching), "status"
 *     onConnection: (ok) => {},         // the live connection dropped (false) or is back (true)
 *     onClose: (why) => {},             // for good: the link ended
 *   });
 *   const status = ed.status;                       // from the server's hello
 *   const cfg = await ed.request("config.get");
 *   await ed.request("config.set", { values: { "crit-chance": 0.5 } });
 *
 * Every request either resolves with the reply's data or rejects with an
 * Error whose message is written for people (show it as it is).
 */

export const PROTOCOL = 1;
export const DEFAULT_RELAY = "https://pfbwebsite-45ce2-default-rtdb.firebaseio.com";
const ROOT = "fightbot-web/v1/sessions/";
const INBOX = "fightbot-web/v1/inbox/";   // what the page sends, kept apart so it isn't sent back to the page
/** Nothing real unpacks to more than this - a bigger one is dropped. */
const MAX_UNPACKED = 32 * 1048576;
const GONE = "This link has expired or was closed. Type /fightbot web in game for a new one.";
const enc = new TextEncoder();
const dec = new TextDecoder();

// ── bytes and text ───────────────────────────────────────────────────

export function b64url(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function unb64url(text) {
  const t = text.replace(/-/g, "+").replace(/_/g, "/");
  const s = atob(t + "===".slice((t.length + 3) % 4));
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

/** Plain (not url-safe) base64, for uploading files. */
export function b64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

async function sha256(label, secret) {
  const buf = new Uint8Array(enc.encode(label).length + secret.length);
  buf.set(enc.encode(label), 0);
  buf.set(secret, enc.encode(label).length);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", buf));
}

/** Run bytes through a (de)compression stream - giving up past MAX_UNPACKED. */
async function pipe(bytes, stream) {
  const reader = new Blob([bytes]).stream().pipeThrough(stream).getReader();
  const parts = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_UNPACKED) {
      reader.cancel().catch(() => {});
      throw new Error("too big to unpack");
    }
    parts.push(value);
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}

// ── the link ─────────────────────────────────────────────────────────

/**
 * Read the secret (and a relay, when the server uses its own) out of the
 * link's #fragment: "#k=<secret>" or "#k=<secret>&r=<relay url>".
 */
export function parseLink(hashOrUrl) {
  const frag = String(hashOrUrl).includes("#") ? String(hashOrUrl).split("#").slice(1).join("#") : String(hashOrUrl);
  const params = new URLSearchParams(frag);
  const k = params.get("k");
  if (!k || !/^[A-Za-z0-9_-]{43}$/.test(k)) throw new Error("This isn't a FightBot editor link - type /fightbot web in game for a new one.");
  const relay = params.get("r");
  if (relay && !/^(https:\/\/[a-z0-9.-]+\.(firebaseio\.com|firebasedatabase\.app)|http:\/\/(127\.0\.0\.1|localhost)(:\d+)?)\/?$/i.test(relay)) {
    throw new Error("That link names a relay this page won't talk to.");
  }
  return { secret: unb64url(k), relay: relay || null };
}

// ── sealing (must match WebEditor.seal in FightBot) ──────────────────
// sealed = base64url( 0x01 | flags (1 = gzip) | 12-byte IV | AES-256-GCM ciphertext+tag )
// with "<sid>/<channel>" as the associated data. Channels: "down" (page to
// server), "up" (server to page), "state/<name>" (server's snapshots).

class Seal {
  static async make(secret) {
    const s = new Seal();
    s.sid = b64url(await sha256("fightbot-web sid", secret)).slice(0, 24);
    s.key = await crypto.subtle.importKey("raw", await sha256("fightbot-web key", secret), "AES-GCM", false, ["encrypt", "decrypt"]);
    return s;
  }

  async seal(channel, message) {
    let plain = enc.encode(JSON.stringify(message));
    let flags = 0;
    if (plain.length > 1024) {
      plain = await pipe(plain, new CompressionStream("gzip"));
      flags = 1;
    }
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: enc.encode(this.sid + "/" + channel), tagLength: 128 }, this.key, plain));
    const out = new Uint8Array(14 + ct.length);
    out[0] = 1;
    out[1] = flags;
    out.set(iv, 2);
    out.set(ct, 14);
    return b64url(out);
  }

  async unseal(channel, sealed) {
    const b = unb64url(sealed);
    if (b.length < 30 || b[0] !== 1) throw new Error("not a sealed message");
    let plain = new Uint8Array(await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b.subarray(2, 14), additionalData: enc.encode(this.sid + "/" + channel), tagLength: 128 },
      this.key, b.subarray(14)));
    if (b[1] & 1) plain = await pipe(plain, new DecompressionStream("gzip"));
    return JSON.parse(dec.decode(plain));
  }
}

// ── the relay, over REST ─────────────────────────────────────────────

class Relay {
  constructor(base) {
    this.base = base.replace(/\/+$/, "");
  }

  url(path, query) {
    return this.base + "/" + path + ".json" + (query ? "?" + query : "");
  }

  /** One REST call. Errors carry .status when the relay answered (401 = not allowed: the session is gone). */
  async call(method, path, body, query, timeout = 30000) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const r = await fetch(this.url(path, query), {
        method,
        headers: body === undefined ? {} : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        signal: ctl.signal,
      });
      const text = await r.text();
      if (!r.ok) {
        const err = new Error("The relay said " + r.status + (text ? ": " + text.slice(0, 200) : ""));
        err.status = r.status;
        throw err;
      }
      return text ? JSON.parse(text) : null;
    } catch (e) {
      if (e && e.name === "AbortError") throw new Error("The relay took too long to answer.");
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  get(path) { return this.call("GET", path); }
  post(path, value, timeout) { return this.call("POST", path, value, undefined, timeout); }
  remove(path) { return this.call("DELETE", path, undefined, "print=silent"); }

  /**
   * Follow a path: onChange(path, data, kind) for each "put" (and "patch").
   * onStatus says how the connection is: "ok", "lost" (the browser is
   * reconnecting) or "refused" (the relay turned it away - maybe the session
   * is gone; it's tried again, with a growing wait). Returns a stop function.
   */
  follow(path, onChange, onStatus) {
    let es = null, stopped = false, delay = 1000, timer = null;
    const status = (s) => { if (!stopped && onStatus) onStatus(s); };
    const reopen = () => {
      if (stopped) return;
      try { es && es.close(); } catch (e) { /* closing anyway */ }
      clearTimeout(timer);
      timer = setTimeout(open, delay);
      delay = Math.min(30000, delay * 2);
    };
    const open = () => {
      if (stopped) return;
      es = new EventSource(this.url(path));
      const handle = (e) => {
        delay = 1000;
        let m;
        try { m = JSON.parse(e.data); } catch (err) { return; }
        if (m && typeof m === "object" && typeof m.path === "string") onChange(m.path, m.data, e.type);
      };
      es.addEventListener("open", () => status("ok"));
      es.addEventListener("put", handle);
      es.addEventListener("patch", handle);
      // The relay's rules stopped letting this be read (the session went), or it signed us out
      es.addEventListener("cancel", () => { reopen(); status("refused"); });
      es.addEventListener("auth_revoked", () => { reopen(); status("refused"); });
      es.onerror = () => {
        // CLOSED: an HTTP error, which the browser won't retry by itself. Otherwise it's retrying.
        if (es.readyState === 2) { reopen(); status("refused"); }
        else status("lost");
      };
    };
    open();
    return () => {
      stopped = true;
      clearTimeout(timer);
      try { es && es.close(); } catch (e) { /* closing anyway */ }
    };
  }
}

/** Where the relay is: the link's, else as fightmc.xyz says, else the built-in one. */
export async function findRelay(fromLink) {
  if (fromLink) return fromLink;
  try {
    const r = await fetch("/editor/relay.json", { cache: "no-cache" });
    if (r.ok) {
      const j = await r.json();
      if (j && typeof j.relay === "string" && j.relay.startsWith("https://")) return j.relay;
    }
  } catch (e) { /* the built-in one */ }
  return DEFAULT_RELAY;
}

// ── a connected editor ───────────────────────────────────────────────

export class Editor {
  constructor(relay, seal, handlers) {
    this.relay = relay;
    this.sealer = seal;
    this.handlers = handlers || {};
    this.base = ROOT + seal.sid;
    this.inbox = INBOX + seal.sid;
    this.pending = new Map();
    this.seenUp = new Set();
    this.closed = false;
    this.started = false;
    this.connected = false;
    this.checking = false;
    this.status = null;
    this.stops = [];
    this.pingTimer = null;
    // What arrives is handled one at a time, in the order it came (unsealing takes a moment)
    this.chain = Promise.resolve();
  }

  /** Run fn after everything that arrived before it. */
  queue(fn) {
    const p = this.chain.then(fn);
    this.chain = p.catch(() => {});
    return p;
  }

  /** Ask the server something. Resolves with the reply's data; rejects with a readable Error. */
  async request(type, data = {}, { timeout = 30000 } = {}) {
    if (this.closed) throw new Error("The editor is closed - type /fightbot web in game for a new link.");
    const id = b64url(crypto.getRandomValues(new Uint8Array(9)));
    const sealed = await this.sealer.seal("down", { id, type, data });
    const reply = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("The server didn't answer. Is it still running, and is the link still open?"));
      }, timeout);
      this.pending.set(id, { resolve, reject, timer });
    });
    reply.catch(() => {});   // the answer can come back before the POST does - the caller still gets it
    try {
      await this.relay.post(this.inbox, { t: Date.now(), d: sealed }, timeout);
    } catch (e) {
      const p = this.pending.get(id);
      if (p) { clearTimeout(p.timer); this.pending.delete(id); }
      if (e.status === 401 || e.status === 403) {
        // Turned down: the session has ended (then the page is told it closed) - or this was too big
        this.checkStillOpen();
        throw new Error("The relay turned that down - the link may have ended, or it was too big.");
      }
      throw new Error("Couldn't reach the relay: " + e.message);
    }
    return reply;
  }

  async start() {
    let meta;
    try {
      meta = await this.relay.get(this.base + "/meta");
    } catch (e) {
      if (e.status === 401 || e.status === 403) throw new Error(GONE);
      throw new Error("Couldn't reach the relay: " + e.message);
    }
    if (!meta) throw new Error(GONE);
    if (meta.v !== PROTOCOL) throw new Error("This server's FightBot speaks editor version " + meta.v + " - this page speaks " + PROTOCOL + ". Update FightBot (or reload the page).");
    // One stream for the whole session: replies and events (up), snapshots (state), and the session itself
    this.stops.push(this.relay.follow(this.base, (path, data, kind) => this.onChange(path, data, kind), (s) => this.connection(s)));
    this.status = await this.request("hello", { page: PROTOCOL });
    this.started = true;
    // Keep the link alive while the page is open
    this.pingTimer = setInterval(() => this.request("ping").catch(() => {}), 60000);
    return this;
  }

  connection(state) {
    if (this.closed) return;
    const ok = state === "ok";
    if (state === "refused") this.checkStillOpen();
    if (ok !== this.connected) {
      this.connected = ok;
      this.handlers.onConnection && this.handlers.onConnection(ok);
      if (!ok) this.problem(new Error("Lost the connection to the relay - retrying."));
    }
  }

  /** The relay turned the stream away: is the session still there at all? */
  async checkStillOpen() {
    if (this.checking || this.closed) return;
    this.checking = true;
    try {
      const meta = await this.relay.get(this.base + "/meta");
      if (!meta) this.gone();
    } catch (e) {
      if (e.status === 401 || e.status === 403) this.gone();
      // Anything else: can't tell yet - the stream keeps trying
    } finally {
      this.checking = false;
    }
  }

  /** The session isn't on the relay any more - after anything still being unsealed (a "closed" says why). */
  gone() {
    this.queue(() => this.shutdown("the link has expired or was closed"));
  }

  problem(e) {
    this.handlers.onProblem && this.handlers.onProblem(e.message || String(e));
  }

  /** Something in the session changed. path is under it: "/", "/up/<id>", "/state/bots", ... */
  onChange(path, data, kind) {
    if (this.closed) return;
    const parts = path.split("/").filter(Boolean);
    if (kind === "patch") {
      // Children merged in: the same as each being put
      if (data && typeof data === "object") {
        for (const [k, v] of Object.entries(data)) this.onChange("/" + parts.concat(k.split("/").filter(Boolean)).join("/"), v, "put");
      }
      return;
    }
    if (!parts.length) {
      if (data === null || typeof data !== "object") {
        if (this.started) this.gone();   // the whole session was deleted
        return;
      }
      if (data.up && typeof data.up === "object") this.onUp(data.up);
      if (data.state && typeof data.state === "object") this.onStates(data.state);
      return;
    }
    const [top, name] = parts;
    if (top === "up") {
      if (!name) { if (data && typeof data === "object") this.onUp(data); }
      else if (parts.length === 2 && data) this.onUp({ [name]: data });
    } else if (top === "state") {
      if (!name) { if (data && typeof data === "object") this.onStates(data); }
      else if (parts.length === 2 && data) this.onStates({ [name]: data });
    }
    // "meta" is the session's details: nothing to do
  }

  onUp(batch) {
    for (const id of Object.keys(batch).sort()) {
      if (this.seenUp.has(id)) continue;
      const sealed = batch[id] && batch[id].d;
      if (typeof sealed !== "string") continue;
      this.seenUp.add(id);
      this.relay.remove(this.base + "/up/" + id).catch(() => {});
      this.queue(() => this.sealer.unseal("up", sealed).then((m) => this.deliver(m), () => { /* not from this session's server */ }));
    }
  }

  onStates(states) {
    for (const [name, v] of Object.entries(states)) {
      if (!v || typeof v.d !== "string") continue;
      this.queue(() => this.sealer.unseal("state/" + name, v.d).then(
        (m) => this.handlers.onState && this.handlers.onState(name, m.data), () => {}));
    }
  }

  deliver(m) {
    if (!m || this.closed) return;
    if (m.re !== undefined) {
      const p = this.pending.get(m.re);
      if (!p) return;
      this.pending.delete(m.re);
      clearTimeout(p.timer);
      if (m.ok) p.resolve(m.data);
      else p.reject(new Error(m.error || "The server said no."));
      return;
    }
    if (m.event) {
      if (m.event === "closed") this.shutdown(m.data && m.data.why ? m.data.why : "the server closed the editor");
      else this.handlers.onEvent && this.handlers.onEvent(m.event, m.data);
    }
  }

  shutdown(why) {
    if (this.closed) return;
    this.closed = true;
    clearInterval(this.pingTimer);
    for (const stop of this.stops) stop();
    for (const p of this.pending.values()) {
      clearTimeout(p.timer);
      p.reject(new Error("The editor closed: " + why));
    }
    this.pending.clear();
    this.handlers.onClose && this.handlers.onClose(why);
  }

  /** Close the editor for good (the link stops working). */
  async close() {
    try { await this.request("bye", {}, { timeout: 5000 }); } catch (e) { /* closing anyway */ }
    this.shutdown("closed");
  }

  // ── shortcuts ──────────────────────────────────────────────────────
  getConfig() { return this.request("config.get"); }
  setConfig(values) { return this.request("config.set", { values }); }
  listBots() { return this.request("bots.list"); }
  watchBots(on) { return this.request("bots.watch", { on }); }
  stopBot(name) { return this.request("bot.stop", { name }); }
  removeBot(name) { return this.request("bot.remove", { name }); }
  listSkins() { return this.request("skins.list"); }
  async uploadSkin(name, bytes, overwrite = false) {
    return this.request("skins.upload", { name, data: b64(new Uint8Array(bytes)), overwrite }, { timeout: 60000 });
  }
  deleteSkin(file) { return this.request("skins.delete", { file }); }
  listVoice() { return this.request("voice.list"); }
  async uploadVoice(name, ext, bytes, overwrite = false) {
    return this.request("voice.upload", { name, ext, data: b64(new Uint8Array(bytes)), overwrite }, { timeout: 120000 });
  }
  deleteVoice(name) { return this.request("voice.delete", { name }); }
  playVoice(line, bot) { return this.request("voice.play", { line, bot }); }
  setPresence(name, presence) { return this.request("voice.presence", { name, presence }); }
  listDebug() { return this.request("debug.list"); }
  getDebug(file, offset = 0, length = 262144) { return this.request("debug.get", { file, offset, length }); }
  liveDebug(on) { return this.request("debug.live", { on }); }
  setDebug(on) { return this.request("debug.set", { on }); }
}

/** Connect with the secret from a link. */
export async function connect({ secret, relay, ...handlers }) {
  const seal = await Seal.make(secret);
  const ed = new Editor(new Relay(await findRelay(relay)), seal, handlers);
  try {
    return await ed.start();
  } catch (e) {
    ed.closed = true;
    clearInterval(ed.pingTimer);
    for (const stop of ed.stops) stop();
    throw e;
  }
}

/** Connect straight from location.hash (or a whole link). */
export async function connectFromLink(hashOrUrl, handlers = {}) {
  const { secret, relay } = parseLink(hashOrUrl);
  return connect({ secret, relay, ...handlers });
}

// ── for the voice upload page (browsers only) ────────────────────────

/**
 * Turn any sound file the browser can play (m4a from a phone, ogg, webm,
 * flac...) into a 48 kHz mono 16-bit WAV that FightBot reads. Uses the
 * browser's own decoder; not available in Node.
 */
export async function toWav(arrayBuffer, maxSeconds = 60) {
  const ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
  const audio = await ctx.decodeAudioData(arrayBuffer.slice(0));
  ctx.close && ctx.close();
  const seconds = Math.min(audio.duration, maxSeconds);
  const off = new OfflineAudioContext(1, Math.ceil(seconds * 48000), 48000);
  const src = off.createBufferSource();
  src.buffer = audio;
  src.connect(off.destination);
  src.start();
  const out = await off.startRendering();
  const pcm = out.getChannelData(0);
  const data = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const w = (o, s) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
  w(0, "RIFF"); data.setUint32(4, 36 + pcm.length * 2, true); w(8, "WAVE");
  w(12, "fmt "); data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, 1, true);
  data.setUint32(24, 48000, true); data.setUint32(28, 96000, true); data.setUint16(32, 2, true); data.setUint16(34, 16, true);
  w(36, "data"); data.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) data.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 32767, true);
  return new Uint8Array(data.buffer);
}
