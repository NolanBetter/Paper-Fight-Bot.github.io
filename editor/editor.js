/* The server editor's screens.
   ---------------------------------------------------------------------------
   Everything that talks to the server lives in ../assets/fightbot-web.js.
   This file is only the tabs and their forms. The protocol is written up in
   FightBot-WebEditor-Spec.md.

   Nothing else runs on this page on purpose: the link in the address bar is
   the key to someone's server, so no analytics, no widgets, and none of the
   site's own scripts (which load Firebase from another domain).
   --------------------------------------------------------------------------- */

import { connectFromLink, toWav, playable, parseLink, findRelay, b64url, unb64url }
  from "../assets/fightbot-web.js";

const $ = id => document.getElementById(id);

/** Small DOM builder. Anything starting with "on" becomes a listener. */
const el = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") e.className = v;
    else if (k === "text") e.textContent = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) e.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids) if (kid !== null && kid !== undefined) e.append(kid);
  return e;
};

let toastTimer;
function toast(msg, err = false) {
  const t = $("toast");
  t.textContent = msg;
  t.className = "ed-toast" + (err ? " err" : "");
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, err ? 9000 : 4500);
}

const kb = n => n < 1024 ? n + " B"
  : n < 1048576 ? (n / 1024).toFixed(1) + " KB"
  : (n / 1048576).toFixed(1) + " MB";

const slug = s => s.toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");

/** A true/false switch. Blocky, big, and it says ON or OFF in words, so the
    colour is never the only thing telling you the answer. */
function mcSwitch({ checked = false, disabled = false, label, id, onChange } = {}) {
  const input = el("input", { type: "checkbox", disabled, id, "aria-label": label });
  input.checked = !!checked;
  const word = el("span", { class: "word", text: checked ? "ON" : "OFF" });
  const wrap = el("label", { class: "mc-sw" + (disabled ? " disabled" : "") },
    input,
    el("span", { class: "track" }, el("span", { class: "knob" })),
    word);
  input.addEventListener("change", () => {
    word.textContent = input.checked ? "ON" : "OFF";
    if (onChange) onChange(input.checked);
  });
  wrap.input = input;
  return wrap;
}

// ------------------------------------------------------------- the secret
// It stays with this page alone: taken out of the address bar (so out of
// history, screenshots and anything the browser syncs) and kept in this
// history entry's state, which — unlike sessionStorage — the site's other
// pages cannot read. A reload or Back still has it.

let hash = "";
if (location.hash.includes("k=")) {
  hash = location.hash;
  history.replaceState({ fbweb: hash }, "", location.pathname + location.search);
} else if (history.state && typeof history.state.fbweb === "string") {
  hash = history.state.fbweb;
}
try { sessionStorage.removeItem("fbweb"); } catch (e) { /* an older page may have left one */ }
const forgetLink = () => {
  try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* nothing to do */ }
};

// ---------------------------------------------------------------- state

let ed = null, status = null, readOnly = false;
let lists = null;                 // groups, routes, kits, saves, players, worlds
let botList = [];                 // the last bots we were sent

/** Minecraft names do not care about case, and FightBot may hold a group
    member as "pixelmaster38" while the bot on the server calls itself
    "PixelMaster38". Match names the way the game does, or the same bot shows
    up twice: once as a missing member, once as one you could add. */
const same = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();
const findBot = n => botList.find(x => same(x.name, n));
const listHas = (list, n) => (list || []).some(x => same(x, n));
const tabs = ["settings", "bots", "teams", "skins", "voice", "debug"];
let current = "settings";

function setConn(text, kind, busy) {
  const c = $("conn");
  c.replaceChildren();
  if (busy) c.append(el("span", { class: "sword", "aria-hidden": "true" }));
  c.append(document.createTextNode(text));
  c.className = "ed-pill " + kind;
}

/** How much longer this link lasts, refreshed while the page is open. The
    short form goes in the strip; the whole story is in its tooltip. */
let endsTimer = null;
function showEnds() {
  const box = $("ends");
  if (!status || !status.endsAt) { box.textContent = ""; return; }
  const left = status.endsAt - Date.now();
  if (left <= 0) {
    box.textContent = "link has run out";
    box.title = "Type /fightbot web in game for a new link.";
    return;
  }
  const mins = Math.round(left / 60000);
  const h = Math.floor(mins / 60);
  box.textContent = (h ? h + "h " + (mins % 60) + "m" : mins + "m") + " left";
  box.title = "This link stops working at " + new Date(status.endsAt).toLocaleTimeString()
    + (status.idleMinutes ? ", or after " + status.idleMinutes + " minutes unused" : "") + ".";
}

async function start() {
  if (!hash.includes("k=")) {
    $("startTitle").textContent = "This page needs a link";
    $("startMsg").textContent = "The editor only opens with the one-off link FightBot gives you, "
      + "so nobody else can reach your server.";
    $("howTo").hidden = false;
    $("startSpin").hidden = true;
    setConn("No link", "bad");
    return;
  }

  // A /fbp web link lists a whole network instead of being one server.
  try {
    const where = parseLink(hash);
    const look = await peekSession(where.secret, where.relay);
    if (look.network) {
      net = look.list;
      net.onNetwork = data => { netData = data; drawServers(); };
      net.onGone = listGone;
      showNetwork(look.network);
      return;                       // nothing is open until they pick one
    }
  } catch (e) {
    // not a link at all, or the relay would not talk: the editor says so
  }

  await openServer(hash);
}

/** Connect to one server and show its editor. */
async function openServer(link) {
  try {
    ed = await connectFromLink(link, {
      onState: (name, data) => { if (name === "bots") showBots(data); },
      onEvent: (name, data) => {
        if (name === "debug.lines") liveLines(data);
        else if (name === "paused") resume();
      },
      onClose: why => {
        if (switching) return;      // we let go of it on purpose
        setConn("Closed", "bad");
        if (netData) {
          if (picked) serverState.set(picked, "closed");
          drawServers();
        } else {
          forgetLink();
        }
        clearInterval(endsTimer);
        $("ends").textContent = "";
        $("finish").hidden = true;
        $("tabs").hidden = true;
        for (const t of tabs) $("tab-" + t).hidden = true;
        $("savebar").hidden = true;
        $("cmdCard").hidden = true;
        $("start").hidden = false;
        $("startSpin").hidden = true;
        $("startTitle").textContent = netData ? picked + "'s editor closed" : "The editor closed";
        $("startMsg").textContent = "It closed because " + why + "."
          + (netData ? " The other servers keep working \u2014 pick one above." : "");
        $("howTo").hidden = !!netData;
        toast("The editor closed: " + why + ".", true);
      },
      onConnection: ok => {
        if (!ed || ed.closed) return;
        setConn(ok ? "Connected" : "Reconnecting…", ok ? "ok" : "wait");
        if (ok) resume();   // whatever was running before the drop
      }
    });
  } catch (e) {
    $("startSpin").hidden = true;
    setConn("Not connected", "bad");
    $("startTitle").textContent = netData ? "Could not open " + picked : "Could not open the editor";
    $("startMsg").textContent = e.message;
    if (/expired|closed|isn't a FightBot|won't talk to/.test(e.message)) {
      if (!netData) forgetLink();
      $("howTo").hidden = !!netData;
    }
    return false;
  }

  status = ed.status;
  readOnly = !!status.readOnly;
  setConn("Connected", "ok");
  const line = [
    "FightBot " + status.fightbot,
    status.server,
    status.players + (status.maxPlayers ? "/" + status.maxPlayers : "") + " playing",
    status.bots + (status.bots === 1 ? " bot" : " bots"),
    status.tps ? status.tps + " TPS" : null
  ].filter(Boolean).join(" · ");
  $("server").textContent = line;
  $("server").title = line + (status.openedBy ? "\nOpened by " + status.openedBy : "");
  showEnds();
  endsTimer = setInterval(showEnds, 30000);
  $("finish").hidden = false;
  $("readonly").hidden = !readOnly;
  $("startSpin").hidden = true;
  $("start").hidden = true;
  $("tabs").hidden = false;

  loadLists().catch(() => { /* pickers fall back to what bots.list gives */ });
  show("settings");
  return true;
}

// ============================================ one link for a whole network
/* /fbp web on a proxy hands out a "list session": an ordinary session whose
   only content is two snapshots naming every server and its own link.

   Nothing listens on a list session's inbox, and the spec is explicit that the
   page must not send it anything — but the library always says hello when it
   connects. So the list is read with the small reader below instead: it opens
   the stream, unseals the snapshots and writes nothing at all. The derivation
   and the unsealing are section 5 of the spec, the same as the library's. */

const enc = new TextEncoder(), dec = new TextDecoder();

async function sha256(label, secret) {
  const b = new Uint8Array(enc.encode(label).length + secret.length);
  b.set(enc.encode(label), 0);
  b.set(secret, enc.encode(label).length);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", b));
}

class ListSession {
  constructor(sid, key, base) {
    this.sid = sid;
    this.key = key;
    this.base = base;
    this.onNetwork = null;    // the server list changed
    this.onGone = null;       // the list itself has ended
    this.closed = false;
  }

  static async make(secret, relayFromLink) {
    const sid = b64url(await sha256("fightbot-web sid", secret)).slice(0, 24);
    const key = await crypto.subtle.importKey("raw", await sha256("fightbot-web key", secret),
      "AES-GCM", false, ["decrypt"]);
    const relay = (await findRelay(relayFromLink)).replace(/\/+$/, "");
    return new ListSession(sid, key, relay + "/fightbot-web/v1/sessions/" + sid);
  }

  async unseal(channel, sealed) {
    const b = unb64url(sealed);
    if (b.length < 30 || b[0] !== 1) throw new Error("not a sealed message");
    let plain = new Uint8Array(await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b.subarray(2, 14),
        additionalData: enc.encode(this.sid + "/" + channel), tagLength: 128 },
      this.key, b.subarray(14)));
    if (b[1] & 1) {
      plain = new Uint8Array(await new Response(
        new Blob([plain]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer());
    }
    return JSON.parse(dec.decode(plain));
  }

  /** Pull the snapshots out of whatever the stream just handed us. */
  async snapshots(state) {
    const out = {};
    for (const [name, v] of Object.entries(state || {})) {
      if (!v || typeof v.d !== "string") continue;
      try { out[name] = (await this.unseal("state/" + name, v.d)).data; }
      catch (e) { /* not from this session: ignore it */ }
    }
    return out;
  }

  /** Open the stream. first(state) is called once, with whatever is there. */
  listen(first) {
    if (this.closed) return;
    const es = new EventSource(this.base + ".json");
    this.es = es;
    let opened = false;

    const take = async e => {
      let m;
      try { m = JSON.parse(e.data); } catch (err) { return; }
      if (!m || typeof m.path !== "string") return;
      const parts = m.path.split("/").filter(Boolean);

      if (!parts.length) {
        if (m.data === null || typeof m.data !== "object") return this.gone();
        const snaps = await this.snapshots(m.data.state);
        if (!opened) { opened = true; if (first) first(snaps); }
        else if (snaps.network && this.onNetwork) this.onNetwork(snaps.network);
        return;
      }
      if (parts[0] !== "state") return;
      const state = parts.length === 1 ? m.data : (m.data ? { [parts[1]]: m.data } : null);
      if (!state) return;
      const snaps = await this.snapshots(state);
      if (snaps.network && this.onNetwork) this.onNetwork(snaps.network);
    };

    es.addEventListener("put", take);
    es.addEventListener("patch", take);
    // the relay turns away a session that is not there any more
    es.addEventListener("cancel", () => this.recheck());
    es.onerror = () => { if (es.readyState === 2) this.recheck(); };

    // nothing at all? treat it as an ordinary session and let the editor try
    this.firstTimer = setTimeout(() => { if (!opened) { opened = true; if (first) first({}); } }, 5000);
  }

  /** The stream was turned away. Gone for good, or just a wobble? */
  async recheck() {
    if (this.closed || this.checking) return;
    this.checking = true;
    try { this.es.close(); } catch (e) { /* closing anyway */ }
    try {
      const r = await fetch(this.base + "/meta.json", { cache: "no-store" });
      if (!r.ok) return this.gone();
      if (!(await r.json())) return this.gone();
      this.checking = false;
      setTimeout(() => this.listen(null), 1000);   // still there: pick it back up
    } catch (e) {
      this.gone();
    }
  }

  gone() {
    if (this.closed) return;
    this.stop();
    if (this.onGone) this.onGone();
  }

  stop() {
    this.closed = true;
    clearTimeout(this.firstTimer);
    try { this.es && this.es.close(); } catch (e) { /* closing anyway */ }
  }
}

/** Is this link a network list? Read only, and quick: the stream's first
    message carries the whole session, so there is nothing to wait around for. */
async function peekSession(secret, relayFromLink) {
  const list = await ListSession.make(secret, relayFromLink);
  const snaps = await new Promise(ok => list.listen(ok));
  const isList = !!(snaps.network || (snaps.status && snaps.status.network));
  if (!isList) { list.stop(); return { list: null, network: null }; }
  return { list, network: snaps.network || { servers: [] } };
}

// ---- the picker -------------------------------------------------------

let net = null;            // the list session, while one is open
let netData = null;        // { proxy, openedBy, expires, servers }
let picked = null;         // the server whose editor is showing
let switching = false;     // dropping a connection on purpose, not a close
let netOver = false;
let netTimer = null;
const serverState = new Map();   // name -> idle | opening | open | closed | failed

const STATE_WORDS = {
  idle: "ready",
  opening: "opening…",
  open: "open below",
  closed: "closed — /fightbot web on it for its own link",
  failed: "could not open"
};

function showNetwork(data) {
  netData = data;
  $("network").hidden = false;
  $("startSpin").hidden = true;
  $("startTitle").textContent = "Pick a server";
  $("startMsg").textContent = "This link covers every server on the network. "
    + "Choose one above and its editor opens here.";
  $("howTo").hidden = true;
  setConn("No server picked", "wait");
  $("finish").hidden = true;
  drawServers();
}

function drawServers() {
  const box = $("servers");
  box.replaceChildren();

  for (const s of (netData.servers || [])) {
    const state = s.error ? "failed" : (serverState.get(s.name) || "idle");
    const dead = !!s.error || state === "closed" || netOver;
    box.append(el("button", {
      class: "ed-srv" + (picked === s.name ? " on" : "") + (dead ? " off" : ""),
      type: "button", disabled: dead,
      "aria-current": picked === s.name ? "true" : null,
      onclick: () => pickServer(s)
    },
      el("span", { class: "nm", text: s.name }),
      el("span", { class: "sub", text: s.error || STATE_WORDS[state] })));
  }

  if (!(netData.servers || []).length) {
    box.append(empty("The proxy did not list any servers."));
  }

  const info = $("netInfo");
  if (netOver) {
    info.className = "ed-netinfo gone";
    info.textContent = "This network link has closed — type /fbp web on the proxy for a new one.";
    return;
  }
  info.className = "ed-netinfo";
  info.textContent = [
    netData.proxy,
    netData.openedBy ? "opened by " + netData.openedBy : null,
    netLeft()
  ].filter(Boolean).join(" · ");

  clearTimeout(netTimer);
  if (netData.expires) {
    const left = netData.expires - Date.now();
    if (left <= 0) listGone();
    else netTimer = setTimeout(() => drawServers(), Math.min(left, 30000));
  }
}

function netLeft() {
  if (!netData.expires) return null;
  const mins = Math.round((netData.expires - Date.now()) / 60000);
  if (mins <= 0) return "out of time";
  const h = Math.floor(mins / 60);
  return (h ? h + "h " + (mins % 60) + "m" : mins + "m") + " left on this link";
}

function listGone() {
  if (netOver) return;
  netOver = true;
  clearTimeout(netTimer);
  if (net) net.stop();
  drawServers();
  forgetLink();
  toast("This network link has closed — type /fbp web on the proxy for a new one.", true);
}

/** Let go of the server we were on, without ending its session. */
function dropServer() {
  if (!ed || ed.closed) { ed = null; return; }
  switching = true;
  ed.shutdown("switched to another server");   // no bye: its link keeps working
  switching = false;
  ed = null;
  if (picked) serverState.set(picked, "idle");
  clearInterval(endsTimer);
  watching = false;
  viewingBot = null;
  team = null;
  lists = null;
  botList = [];
  cfg = null;
  edits = {};
  chosen.clear();
  openSections.clear();
  $("cmdOut").replaceChildren();
  $("cmdCard").hidden = true;
  $("savebar").hidden = true;
  $("tabs").hidden = true;
  $("viewer").hidden = true;
  viewing = null;
  for (const t of tabs) $("tab-" + t).hidden = true;
}

async function pickServer(s) {
  if (s.error || netOver || picked === s.name) return;
  dropServer();
  picked = s.name;
  serverState.set(s.name, "opening");
  drawServers();

  $("startSpin").hidden = false;
  $("start").hidden = false;
  $("startTitle").textContent = "Opening " + s.name + "…";
  $("startMsg").textContent = "Connecting to that server.";

  const ok = await openServer(s.link);
  serverState.set(s.name, ok ? "open" : "failed");
  drawServers();
}

function show(name) {
  const leaving = current;
  current = name;
  for (const t of tabs) $("tab-" + t).hidden = t !== name;
  for (const b of document.querySelectorAll("#tabs button")) {
    const on = b.dataset.tab === name;
    b.setAttribute("aria-selected", on ? "true" : "false");
    b.classList.toggle("on", on);
  }
  // FightBot's answers belong to the two tabs that send it commands
  $("cmdCard").hidden = !((name === "bots" || name === "teams") && $("cmdOut").textContent.trim());

  if (!ed || ed.closed) return;
  watch();
  // the live log only runs while you can see it
  if (leaving === "debug" && name !== "debug" && liveOn()) setLive(false);

  const load = {
    settings: loadSettings, bots: loadBots, teams: loadTeams,
    skins: loadSkins, voice: loadVoice, debug: loadDebug
  }[name];
  load().catch(e => toast(e.message, true));
}

for (const b of document.querySelectorAll("#tabs button")) {
  b.addEventListener("click", () => show(b.dataset.tab));
}

// Bots are only watched while they are on screen and this window is in front —
// a hidden tab has no business pulling a snapshot every two seconds.
let watching = false;
function watch(force = false) {
  if (!ed || ed.closed) return;
  const want = current === "bots" && document.visibilityState === "visible";
  if (want === watching && !force) return;
  watching = want;
  ed.watchBots(want).catch(() => { watching = null; });
}

document.addEventListener("visibilitychange", () => {
  watch();
  if (document.visibilityState === "visible" && current === "bots" && ed && !ed.closed) {
    loadBots().catch(() => {});
  }
});

/** The server stops sending when it has not heard from the page for a while
    (a sleeping laptop, a throttled tab). Ask again for what is still wanted. */
function resume() {
  if (!ed || ed.closed) return;
  if (current === "bots" && document.visibilityState === "visible") watch(true);
  if (current === "debug" && liveOn()) ed.liveDebug(true).catch(() => {});
}

$("finish").addEventListener("click", async () => {
  if (!ed || ed.closed) return;
  if (!confirm("Close the editor? This link stops working — you can get another with /fightbot web.")) return;
  $("finish").disabled = true;
  await ed.close();
});

window.addEventListener("pagehide", () => {
  if (ed && !ed.closed && watching) ed.watchBots(false).catch(() => {});
});

// ====================================================== running commands

/** Everything the in-game menus do, the page does by sending the command.
    FightBot runs it as whoever opened the editor, with their permissions. */
async function run(line, { refresh = true } = {}) {
  if (readOnly) { toast("This server's editor is read-only, so it will not change anything.", true); return false; }
  try {
    const r = await ed.request("command", { line });
    say(r.command || line, r.output || []);
    if (refresh) await refreshAll();
    return true;
  } catch (e) {
    toast(e.message, true);
    return false;
  }
}

function say(command, out) {
  const box = $("cmdOut");
  box.append(document.createTextNode(
    "> /fightbot " + command + "\n" + (out.length ? out.join("\n") : "(nothing to say)") + "\n\n"));
  while (box.textContent.length > 40000 && box.firstChild && box.firstChild !== box.lastChild) {
    box.firstChild.remove();
  }
  $("cmdCard").hidden = !(current === "bots" || current === "teams");
  box.scrollTop = box.scrollHeight;
}

$("cmdClear").addEventListener("click", () => {
  $("cmdOut").replaceChildren();
  $("cmdCard").hidden = true;
});

/** After anything that changes things: the pickers and the bot list. */
async function refreshAll() {
  await loadLists().catch(() => {});
  if (current === "bots") await loadBots().catch(() => {});
  if (current === "teams") drawTeams();
  if (viewingBot) await loadBotSwitches(viewingBot).catch(() => {});
}

async function loadLists() {
  lists = await ed.request("lists");
  fillPickers();
  if (current === "teams") drawTeams();
}

// ---- the pickers ------------------------------------------------------

/** Rebuild a select, keeping what was chosen if it is still there. */
function options(id, items, { blank } = {}) {
  const s = $(id);
  if (!s) return;
  const keep = s.value;
  const all = (blank !== undefined ? [{ value: "", label: blank }] : []).concat(items);
  s.replaceChildren(...all.map(o => el("option", { value: o.value, text: o.label })));
  if (keep && all.some(o => o.value === keep)) s.value = keep;
  s.disabled = readOnly || !all.length;
}

const groupNames = () => Object.keys((lists && lists.groups) || {});
const routeNames = () => ((lists && lists.routes) || []).map(r => r.name);

/** "which bots": one of them, all of them, or a whole group. */
function whoList() {
  return botList.map(b => ({ value: b.name, label: b.name }))
    .concat([{ value: "--all", label: "every bot" }])
    .concat(groupNames().map(g => ({ value: "--group " + g, label: "group " + g })));
}

/** Anything a bot can be pointed at. */
function targetList(exclude) {
  const players = ((lists && lists.players) || []).map(p => ({ value: p, label: p + " (player)" }));
  const bots = botList.filter(b => !same(b.name, exclude)).map(b => ({ value: b.name, label: b.name + " (bot)" }));
  const groups = groupNames().map(g => ({ value: g, label: g + " (group)" }));
  return players.concat(bots, groups);
}

const slotList = rows => (rows || []).map(k =>
  ({ value: String(k.slot), label: k.slot + (k.label ? ": " + k.label : "") }));

/** Only the fixed selects live here. The group, route, kit and save screens
    build their own as they are drawn, so they are never stale. */
function fillPickers() {
  options("botTarget", targetList(viewingBot));
  options("botRoute", routeNames().map(r => ({ value: r, label: r })));
  options("botKit", slotList(lists && lists.kits));
  options("voiceBot", botList.map(b => ({ value: b.name, label: b.name }))
    .concat([{ value: "--all", label: "every bot" }]));
}

// ---- the little pieces the screens are built from ---------------------

/** What you last chose in each picker. Running a command redraws the screen it
    was on, and without this your choice would be thrown away every time. */
const chosen = new Map();

const picker = (items, label, key) => {
  const s = el("select", { class: "ed-input", disabled: readOnly || !items.length, "aria-label": label });
  s.replaceChildren(...items.map(o => el("option", { value: o.value, text: o.label })));
  if (key) {
    const was = chosen.get(key);
    if (was && items.some(o => o.value === was)) s.value = was;
    s.addEventListener("change", () => chosen.set(key, s.value));
  }
  return s;
};

const endPicker = key => picker(
  [{ value: "loop", label: "then loop" },
   { value: "back", label: "then walk back" },
   { value: "stop", label: "then stop" }],
  "at the end of the route", key);
const btn = (text, onclick) => el("button", { class: "btn sm", disabled: readOnly, text, onclick });
const ghost = (text, onclick) => el("button", { class: "btn ghost sm", disabled: readOnly, text, onclick });
const empty = text => el("div", { class: "ed-empty", text });

/** Put a spinning sword in a container while its list is on the way. Only
    when it is empty: redrawing a list you can already see should not flicker. */
function busy(box, what) {
  if (!box || box.firstChild) return;
  const line = el("div", { class: "ed-busy" },
    el("span", { class: "sword", "aria-hidden": "true" }), " " + what);
  box.replaceChildren(box.tagName === "TBODY"
    ? el("tr", {}, el("td", { colspan: "4" }, line))
    : line);
}

/** A row you click to open that thing's own screen. */
const pickRow = (title, sub, onClick) =>
  el("button", { class: "ed-pickrow", type: "button", onclick: onClick },
    el("span", { class: "nm", text: title }),
    el("span", { class: "sub", text: sub }));

// ============================================================== settings

let cfg = null, edits = {};

/** "mace.dive-height" reads better as "Dive height". */
const pretty = key => {
  const last = key.split(".").slice(-1)[0].replace(/-/g, " ");
  return last.charAt(0).toUpperCase() + last.slice(1);
};

async function loadSettings() {
  busy($("sections"), "Reading config.yml\u2026");
  cfg = await ed.getConfig();
  edits = {};
  renderSettings();
}

/** Which sections you had open. Saving rebuilds the whole list, and without
    this every one of them would snap shut — which also made the page shorter,
    so the browser dropped you at the bottom of it. */
const openSections = new Set();

function renderSettings({ keepPlace = false } = {}) {
  const box = $("sections");
  const y = window.scrollY;

  for (const d of document.querySelectorAll("details.ed-sec")) {
    const name = d.querySelector("summary span").textContent;
    if (d.open) openSections.add(name); else openSections.delete(name);
  }

  box.replaceChildren();
  const find = $("find").value.trim().toLowerCase();

  // config.yml's own order, grouped into its own sections
  const groups = new Map();
  for (const e of cfg.schema) {
    if (e.key === "config-version") continue;
    if (find && !(e.key + " " + (e.help || "") + " " + (e.note || "")).toLowerCase().includes(find)) continue;
    if (!groups.has(e.section)) groups.set(e.section, []);
    groups.get(e.section).push(e);
  }

  for (const [section, entries] of groups) {
    const body = el("div", { class: "body" });
    const help = entries[0].sectionHelp;
    if (help && !find) body.append(el("p", { class: "ed-sechelp", text: help }));
    for (const e of entries) body.append(settingRow(e));
    const title = section || "Settings";
    box.append(el("details", { class: "ed-sec", open: (find || openSections.has(title)) ? true : undefined },
      el("summary", {}, el("span", { text: title })), body));
  }

  if (!groups.size) {
    box.append(el("p", { class: "lede", text: find ? "No setting matches that." : "This server sent no settings." }));
  }
  updateSavebar();
  // Stay where you were reading. "instant" matters: the site sets
  // scroll-behavior:smooth, so without it the page glides off after a save.
  if (keepPlace) requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
}

function settingRow(e) {
  const row = el("div", { class: "setting", "data-key": e.key });
  const value = e.key in edits ? edits[e.key] : cfg.values[e.key];
  const disabled = readOnly || e.readOnly;
  let input;

  const changed = v => {
    const same = JSON.stringify(v) === JSON.stringify(cfg.values[e.key]);
    if (same) delete edits[e.key]; else edits[e.key] = v;
    row.classList.toggle("changed", !same);
    row.classList.remove("bad");
    const why = row.querySelector(".why");
    if (why) why.remove();
    updateSavebar();
  };

  if (e.type === "boolean") {
    input = mcSwitch({ checked: !!value, disabled, label: e.key, onChange: changed });

  } else if (e.type === "choice") {
    input = el("select", { class: "ed-input", disabled, "aria-label": e.key },
      ...(e.options || []).map(o => el("option", { value: o, text: o })));
    input.value = value;
    input.addEventListener("change", () => changed(input.value));

  } else if (e.type === "integer" || e.type === "number") {
    input = el("input", { type: "number", class: "ed-input", disabled, "aria-label": e.key,
      step: e.type === "integer" ? 1 : "any", min: e.min, max: e.max });
    input.value = value;
    input.addEventListener("input", () => { if (input.value !== "") changed(Number(input.value)); });

  } else if (e.type === "list") {
    input = el("textarea", { class: "ed-input", rows: 3, disabled, "aria-label": e.key,
      placeholder: "one per line" });
    input.value = (value || []).join("\n");
    input.addEventListener("input", () => changed(input.value.split("\n").map(s => s.trim()).filter(Boolean)));

  } else if (e.secret) {
    // the value itself never leaves the server: type to replace it
    input = el("input", { type: "password", class: "ed-input", disabled, autocomplete: "off",
      "aria-label": e.key, placeholder: cfg.secrets && cfg.secrets[e.key] ? "set — type to replace" : "not set" });
    input.addEventListener("input", () => changed(input.value));

  } else {
    input = el("input", { type: "text", class: "ed-input", disabled, "aria-label": e.key });
    input.value = value === undefined || value === null ? "" : value;
    input.addEventListener("input", () => changed(input.value));
  }

  const range = e.min !== undefined ? "  (" + e.min + "–" + e.max + ")" : "";
  row.append(
    el("div", {},
      el("div", { class: "name", text: pretty(e.key) + (e.readOnly ? " · read only" : "") }),
      el("div", { class: "key", text: e.key + range })),
    el("div", {}, input)
  );
  const help = [e.help, e.note].filter(Boolean).join("\n");
  if (help) row.append(el("p", { class: "help", text: help }));
  if (e.key in edits) row.classList.add("changed");
  return row;
}

function updateSavebar() {
  const n = Object.keys(edits).length;
  $("savebar").hidden = n === 0;
  $("saveCount").textContent = n === 1 ? "1 change not saved" : n + " changes not saved";
}

$("find").addEventListener("input", renderSettings);
$("openAll").addEventListener("click", () => {
  document.querySelectorAll("details.ed-sec").forEach(d => { d.open = true; });
});
$("undo").addEventListener("click", () => { edits = {}; renderSettings({ keepPlace: true }); });

$("save").addEventListener("click", async () => {
  $("save").disabled = true;
  try {
    const r = await ed.setConfig(edits);
    const rejected = r.rejected || {};
    if (Object.keys(rejected).length) {
      // all or nothing: nothing was written, so keep the edits and mark them
      for (const [key, why] of Object.entries(rejected)) {
        const row = document.querySelector('.setting[data-key="' + CSS.escape(key) + '"]');
        if (!row) continue;
        row.classList.add("bad");
        if (!row.querySelector(".why")) row.append(el("p", { class: "why", text: why }));
      }
      toast("Nothing was saved. Fix the settings marked in red and save again.", true);
    } else {
      cfg = r;
      edits = {};
      renderSettings({ keepPlace: true });
      toast(r.changed
        ? "Saved " + r.changed + (r.changed === 1 ? " setting" : " settings") + ". FightBot reloaded them."
          + (r.note ? " " + r.note : "")
        : "Nothing had changed.");
    }
  } catch (e) {
    toast(e.message, true);
  } finally {
    $("save").disabled = false;
  }
});

// ================================================================== bots

let viewingBot = null;

async function loadBots() {
  busy($("bots"), "Looking for bots on the server\u2026");
  showBots(await ed.listBots());
}

/** A bot's face, cut out of its skin image with CSS. The image comes from
    Mojang, so the box spins until it arrives rather than sitting blank. */
function face(texture, small) {
  const f = el("div", { class: "ed-face" + (small ? " sm" : ""), role: "img", "aria-label": "skin" });
  if (!texture) return f;

  const url = "https://textures.minecraft.net/texture/" + texture;
  const spin = el("span", { class: "sword waiting", "aria-hidden": "true" });
  f.append(spin);

  const img = new Image();
  img.onload = () => { f.style.backgroundImage = "url(" + url + ")"; spin.remove(); };
  img.onerror = () => spin.remove();   // no skin to show: the plain box is the answer
  img.src = url;
  return f;
}

const describe = b => [
  b.doing + (b.targets && b.targets.length ? " " + b.targets.join(", ") : ""),
  b.route || null,
  b.world + " " + Math.round(b.x) + " " + Math.round(b.y) + " " + Math.round(b.z),
  b.group ? "group " + b.group : null,
  b.holding && b.holding !== "AIR" ? "holding " + b.holding.toLowerCase().replace(/_/g, " ") : null
].filter(Boolean).join(" · ");

function showBots(data) {
  botList = (data && data.bots) || [];
  fillPickers();
  if (current !== "bots") return;

  // the one-bot panel keeps up with the snapshots too
  if (viewingBot) {
    const b = findBot(viewingBot);
    if (b) $("botInfo").textContent = describe(b);
    else { closeBot(); toast(viewingBot + " is not on the server any more."); }
  }

  $("botCount").textContent = botList.length + (botList.length === 1 ? " bot" : " bots")
    + (data && data.at ? " · " + new Date(data.at).toLocaleTimeString() : "");

  const box = $("bots");
  box.replaceChildren();
  if (!botList.length) {
    box.append(el("p", { class: "lede", text: "No bots right now. Spawn one above, or type /fightbot spawn in game." }));
    return;
  }

  for (const b of botList) {
    const pct = b.maxHealth ? Math.max(0, Math.min(100, (b.health / b.maxHealth) * 100)) : 0;

    const voice = el("select", { class: "ed-input", disabled: readOnly, "aria-label": "voice chat for " + b.name },
      ...["talks", "muted", "no-mod"].map(p => el("option", { value: p, text: "voice: " + p })));
    voice.value = b.voice || "no-mod";
    voice.addEventListener("change", () => ed.setPresence(b.name, voice.value).then(
      () => toast(b.name + ": voice " + voice.value),
      e => toast(e.message, true)));

    box.append(el("div", { class: "ed-bot" },
      face(b.skin),
      el("div", { class: "nm" }, b.name, el("small", { text: "  " + b.ping + " ms" })),
      el("div", { class: "ed-hp", title: b.health + " of " + b.maxHealth + " health" },
        el("i", { style: "width:" + pct + "%" })),
      el("div", { class: "what", text: describe(b) }),
      el("div", { class: "acts" },
        el("button", { class: "btn sm", text: "Open", onclick: () => openBot(b.name) }),
        el("button", { class: "btn ghost sm", disabled: readOnly, text: "Stop",
          onclick: () => ed.stopBot(b.name).then(
            r => toast(b.name + (r.stopped ? " stopped " + r.stopped : " was not doing anything")),
            e => toast(e.message, true)) }),
        el("button", { class: "btn sm danger", disabled: readOnly, text: "Remove",
          onclick: () => confirm("Remove " + b.name + "?")
            && ed.removeBot(b.name).then(showBots, e => toast(e.message, true)) }),
        voice)));
  }
}

$("botsRefresh").addEventListener("click", () => refreshAll().catch(e => toast(e.message, true)));
$("allStop").addEventListener("click", () => run("stop --all"));

// Spawning bots is deliberately not here: that stays in game, with someone who
// has fightbot.use standing on the server.

// ---- one bot ----------------------------------------------------------

async function openBot(name) {
  viewingBot = name;
  $("botsAll").hidden = true;
  $("botPanel").hidden = false;
  $("botName").textContent = name;
  const b = findBot(name);
  $("botInfo").textContent = b ? describe(b) : "";
  fillPickers();
  for (const id of ["botFight", "botStop", "botRoam", "botPatrol", "botFree",
                    "botGiveKit", "botStoreKit", "botRemove"]) {
    const b = $(id);
    if (b) b.disabled = readOnly;
  }
  await loadBotSwitches(name);
}

function closeBot() {
  viewingBot = null;
  $("botPanel").hidden = true;
  $("botsAll").hidden = false;
  fillPickers();
}

$("botBack").addEventListener("click", closeBot);

$("botFight").addEventListener("click", () => {
  const t = $("botTarget").value;
  if (!t) return toast("Nobody to fight: no players, bots or groups.", true);
  run("fight " + viewingBot + " " + t);
});
$("botStop").addEventListener("click", () => run("stop " + viewingBot));
$("botRoam").addEventListener("click", () => {
  if (!$("botRoute").value) return toast("Make a route in game first.", true);
  run("roamingstart " + viewingBot + " " + $("botRoute").value + " " + $("botEnd").value);
});
$("botPatrol").addEventListener("click", () => {
  if (!$("botRoute").value) return toast("Make a route in game first.", true);
  run("patrollingstart " + viewingBot + " " + $("botRoute").value + " " + $("botEnd").value);
});
$("botFree").addEventListener("click", () => run("roamingfree " + viewingBot));
$("botGiveKit").addEventListener("click", () => {
  if (!$("botKit").value) return toast("No kits stored yet.", true);
  run("kit " + viewingBot + " " + $("botKit").value);
});
$("botStoreKit").addEventListener("click", () => {
  if (!$("botKit").value) return toast("No kit slot to store it in.", true);
  run("saveload " + viewingBot + " " + $("botKit").value);
});
$("botRemove").addEventListener("click", async () => {
  if (!confirm("Remove " + viewingBot + "?")) return;
  const name = viewingBot;
  closeBot();
  await run("remove " + name);
});

/** The switches from the bot's in-game settings screen. */
async function loadBotSwitches(name) {
  const box = $("botSwitches");
  // Only say "reading" the first time. Every command reloads these, and
  // blanking them each time made the whole list flicker.
  if (!box.firstChild) {
    box.append(el("p", { class: "lede" },
      el("span", { class: "sword", "aria-hidden": "true" }), " Reading its settings…"));
  }
  let r;
  try {
    r = await ed.request("bot.settings", { name });
  } catch (e) {
    box.replaceChildren(el("p", { class: "lede", text: e.message }));
    return;
  }
  if (!same(viewingBot, name)) return;   // they moved on while it loaded

  box.replaceChildren();
  const rows = r.settings || [];
  if (!rows.length) {
    box.append(el("p", { class: "lede", text: "This server sent no switches for this bot." }));
    return;
  }
  for (const s of rows) {
    box.append(el("div", { class: "ed-switch" + (s.own ? " own" : ""), "data-key": s.key },
      el("div", {},
        el("div", { class: "name", text: s.label || s.key }),
        s.what ? el("div", { class: "what", text: s.what }) : null,
        s.own
          ? el("button", { class: "btn ghost tiny", disabled: readOnly,
              text: "This bot only — follow the server again",
              onclick: () => flipBot(name, s.key, null) })
          : null),
      mcSwitch({ checked: !!s.value, disabled: readOnly, label: s.label || s.key,
        onChange: v => flipBot(name, s.key, v) })));
  }
}

async function flipBot(name, key, value) {
  if (readOnly) return;
  try {
    await ed.request("bot.settings", { name, key, value });
    toast(value === null ? "Back to the server's setting." : "Saved for " + name + ".");
  } catch (e) {
    toast(e.message, true);
  }
  await loadBotSwitches(name);
}

// ===================================================== groups, routes, kits
// Four short lists. Click one and it gets a screen of its own, the way the
// in-game menus work, rather than every control being on show at once.

let team = null;   // { kind: "group"|"route"|"kit"|"save", id, given }

async function loadTeams() {
  busy($("groups"), "Reading your groups\u2026");
  busy($("routes"), "Reading your routes\u2026");
  busy($("kits"), "Reading your kits\u2026");
  busy($("saves"), "Reading your saves\u2026");
  if (!lists) await loadLists();
  // the member heads and the pick lists both need to know who is actually here
  try { showBots(await ed.listBots()); } catch (e) { /* carry on with what we have */ }
  drawTeams();
}

function drawTeams() {
  if (team) { drawTeamPanel(); return; }

  const groups = Object.entries((lists && lists.groups) || {});
  $("groupCount").textContent = groups.length + (groups.length === 1 ? " group" : " groups");
  const g = $("groups");
  g.replaceChildren();
  if (!groups.length) g.append(empty("No groups yet. Make one below."));
  for (const [name, members] of groups) {
    g.append(pickRow(name,
      members.length ? members.length + (members.length === 1 ? " bot" : " bots") : "empty",
      () => openTeam("group", name)));
  }

  const routes = (lists && lists.routes) || [];
  $("routeCount").textContent = routes.length + (routes.length === 1 ? " route" : " routes");
  const r = $("routes");
  r.replaceChildren();
  if (!routes.length) {
    r.append(empty("No routes yet. Make one in game with /fightbot roamingroutecreate <name>."));
  }
  for (const route of routes) {
    const t = (route.targets || []).length;
    r.append(pickRow(route.name,
      (route.points || 0) + (route.points === 1 ? " point" : " points")
        + (t ? " · " + t + (t === 1 ? " target" : " targets") : ""),
      () => openTeam("route", route.name)));
  }

  const kits = (lists && lists.kits) || [];
  const kBox = $("kits");
  kBox.replaceChildren();
  if (!kits.length) {
    kBox.append(empty("No kits stored yet. Open a bot and store its gear in a slot."));
  }
  for (const row of kits) {
    kBox.append(pickRow("Slot " + row.slot, row.label || "(no label)",
      () => openTeam("kit", String(row.slot))));
  }

  // Saves spawn bots, so FightBot refuses every save command from the web.
  // They are listed here to be read, not opened.
  const saves = (lists && lists.saves) || [];
  const sBox = $("saves");
  sBox.replaceChildren();
  if (!saves.length) {
    sBox.append(empty("Nothing stored. Use /fightbot savegear <bot> <slot> in game."));
  }
  for (const row of saves) {
    sBox.append(el("div", { class: "ed-memrow read" },
      el("div", { class: "nm" }, "Slot " + row.slot,
        el("div", { class: "sub", text: row.label || "(no label)" })),
      el("span", { class: "sub", text: "/fightbot save " + row.slot })));
  }
}

function openTeam(kind, id) {
  team = { kind, id, given: new Set() };
  $("teamsAll").hidden = true;
  $("teamPanel").hidden = false;
  drawTeamPanel();
  window.scrollTo(0, 0);
}

function closeTeam() {
  team = null;
  $("teamPanel").hidden = true;
  $("teamsAll").hidden = false;
  drawTeams();
}

$("teamBack").addEventListener("click", closeTeam);

function drawTeamPanel() {
  if (!team) return;
  const body = $("teamBody");
  body.replaceChildren();
  if (team.kind === "group") groupPanel(body);
  else if (team.kind === "route") routePanel(body);
  else slotPanel(body);
}

/** A row with a bot's face, what it is doing, and one button. */
function botRow(name, label, onAction, quiet) {
  const b = findBot(name);
  return el("div", { class: "ed-memrow" },
    face(b && b.skin, true),
    // show the bot's own spelling of its name when it is here
    el("div", { class: "nm" }, b ? b.name : name,
      el("div", { class: "sub", text: b ? describe(b) : "not on the server right now" })),
    el("button", { class: "btn sm" + (quiet ? " ghost" : ""), disabled: readOnly,
      text: label, onclick: onAction }));
}

const skinOf = name => {
  const b = findBot(name);
  return b ? b.skin : null;
};

const groupKey = name => groupNames().find(g => same(g, name)) || null;
const isGroup = name => !!groupKey(name);

/** A head for a bot or a player, a lettered tile for a whole group. */
const avatar = name => isGroup(name)
  ? el("div", { class: "ed-face sm tile", "aria-hidden": "true", text: name.slice(0, 1).toUpperCase() })
  : face(skinOf(name), true);

/** Is a route's target actually around at the moment? */
function targetState(name) {
  const bot = findBot(name);
  if (bot) return { here: true, what: "a bot, on the server now", skin: bot.skin };
  if (listHas(lists && lists.players, name)) {
    return { here: true, what: "a player, online now", skin: null };
  }
  const g = groupKey(name);
  if (g) {
    const n = lists.groups[g].length;
    return { here: n > 0, skin: null,
      what: n ? "a group, " + n + (n === 1 ? " bot in it" : " bots in it") : "a group, empty right now" };
  }
  return { here: false, skin: null, what: "not on the server right now" };
}

// ---- one group --------------------------------------------------------

function groupPanel(body) {
  const name = team.id;
  const members = (lists && lists.groups && lists.groups[name]) || null;
  if (!members) { closeTeam(); return; }   // it was deleted while open

  $("teamTitle").textContent = "Group: " + name;
  $("teamInfo").textContent = members.length
    ? members.length + (members.length === 1 ? " bot in it." : " bots in it.")
    : "Nothing in it yet.";

  body.append(el("h3", { class: "ed-sub", text: "In this group" }));
  const inBox = el("div", { class: "ed-rows" });
  if (!members.length) inBox.append(empty("Empty. Add a bot below."));
  for (const n of members) {
    inBox.append(botRow(n, "Take out", () => run("groupremove " + name + " " + n), true));
  }
  body.append(inBox);

  const free = botList.filter(b => !listHas(members, b.name));
  body.append(el("h3", { class: "ed-sub", text: "Add a bot" }));
  const addBox = el("div", { class: "ed-rows" });
  if (!free.length) {
    addBox.append(empty(botList.length
      ? "Every bot on the server is already in this group."
      : "No bots on the server. Spawn one in game with /fightbot spawn."));
  }
  for (const b of free) {
    addBox.append(botRow(b.name, b.group ? "Move it here" : "Add",
      () => run("groupadd " + name + " " + b.name)));
  }
  body.append(addBox);

  body.append(el("h3", { class: "ed-sub", text: "What this group does" }));

  const target = picker(targetList().filter(t => !same(t.value, name)), "who to fight", "group-target");
  body.append(el("div", { class: "ed-row" }, target,
    btn("Set them on this", () => target.value
      ? run("groupfight " + name + " " + target.value)
      : toast("Nobody to fight.", true)),
    ghost("Stop them", () => run("groupstop " + name))));

  const route = picker(routeNames().map(r => ({ value: r, label: r })), "route", "group-route");
  const end = endPicker("end");
  body.append(el("div", { class: "ed-row" }, route, end,
    btn("Walk the route", () => route.value
      ? run("roamingstart --group " + name + " " + route.value + " " + end.value)
      : toast("Make a route in game first.", true)),
    btn("Patrol it", () => route.value
      ? run("patrollingstart --group " + name + " " + route.value + " " + end.value)
      : toast("Make a route in game first.", true))));

  const kit = picker(slotList(lists && lists.kits), "kit", "group-kit");
  body.append(el("div", { class: "ed-row" }, kit,
    btn("Give them this kit", () => kit.value
      ? run("kit --group " + name + " " + kit.value)
      : toast("No kits stored yet.", true))));

  body.append(el("div", { class: "ed-danger" },
    el("button", { class: "btn sm danger", disabled: readOnly, text: "Delete this group",
      onclick: () => confirm("Delete the group " + name + "? Its bots are freed.")
        && run("groupdel " + name) })));
}

// ---- one route --------------------------------------------------------

function routePanel(body) {
  const route = ((lists && lists.routes) || []).find(r => r.name === team.id);
  if (!route) { closeTeam(); return; }

  $("teamTitle").textContent = "Route: " + route.name;
  $("teamInfo").textContent = (route.points || 0) + (route.points === 1 ? " point." : " points.")
    + " Points are placed in game, standing where you want each one.";

  const targets = route.targets || [];
  body.append(el("h3", { class: "ed-sub", text: "Who patrols on this route go after" }));
  body.append(el("p", { class: "lede", text:
    "FightBot drops a target that has gone by itself, so this list is who patrols are actually "
    + "hunting. Anything that slipped through is marked." }));

  const tBox = el("div", { class: "ed-rows" });
  if (!targets.length) tBox.append(empty("Nobody. Patrols on this route will not go after anyone."));
  for (const t of targets) {
    const st = targetState(t);
    tBox.append(el("div", { class: "ed-memrow" + (st.here ? "" : " gone") },
      avatar(t),
      el("div", { class: "nm" }, t, el("div", { class: "sub", text: st.what })),
      el("button", { class: "btn ghost sm", disabled: readOnly, text: "Remove",
        onclick: () => run("patrollingtargetdel " + route.name + " " + t) })));
  }
  body.append(tBox);

  const free = targetList().filter(t => !listHas(targets, t.value));
  body.append(el("h3", { class: "ed-sub", text: "Add a target" }));
  const aBox = el("div", { class: "ed-rows" });
  if (!free.length) aBox.append(empty("Nobody left to add."));
  for (const t of free) {
    aBox.append(el("div", { class: "ed-memrow" },
      avatar(t.value),
      el("div", { class: "nm" }, t.label),
      el("button", { class: "btn sm", disabled: readOnly, text: "Add",
        onclick: () => run("patrollingtargetadd " + route.name + " " + t.value) })));
  }
  body.append(aBox);

  body.append(el("h3", { class: "ed-sub", text: "Send bots along it" }));
  const who = picker(whoList(), "which bots", "route-who");
  const end = endPicker("end");
  body.append(el("div", { class: "ed-row" }, who, end));
  body.append(el("div", { class: "ed-row" },
    btn("Walk it", () => run("roamingstart " + who.value + " " + route.name + " " + end.value)),
    btn("Patrol it", () => run("patrollingstart " + who.value + " " + route.name + " " + end.value)),
    ghost("Stop them", () => run("roamingstop " + who.value))));

  body.append(el("div", { class: "ed-danger" },
    el("button", { class: "btn sm danger", disabled: readOnly, text: "Delete this route",
      onclick: () => confirm("Delete the route " + route.name + "? Bots walking it stop.")
        && run("roamingroutedel " + route.name) })));
}

// ---- one kit or save --------------------------------------------------

function slotPanel(body) {
  const row = ((lists && lists.kits) || []).find(r => String(r.slot) === team.id);
  if (!row) { closeTeam(); return; }

  $("teamTitle").textContent = "Kit " + row.slot;
  $("teamInfo").textContent = row.label || "(nothing stored in it yet)";

  {
    body.append(el("h3", { class: "ed-sub", text: "Give it to a bot" }));
    body.append(el("p", { class: "lede", text:
      "Click a bot and it takes the kit, replacing what it carries, then drops off this list. "
      + "A bot that is busy is skipped — stop it first." }));

    const box = el("div", { class: "ed-rows" });
    const left = botList.filter(b => !team.given.has(b.name.toLowerCase()));
    if (!left.length) {
      box.append(empty(botList.length ? "Every bot has had it." : "No bots on the server."));
    }
    for (const b of left) {
      box.append(botRow(b.name, "Give it", async () => {
        if (await run("kit " + b.name + " " + row.slot, { refresh: false })) {
          team.given.add(b.name.toLowerCase());
          drawTeamPanel();
        }
      }));
    }
    body.append(box);

    const g = picker(groupNames().map(n => ({ value: n, label: n })), "group", "kit-group");
    body.append(el("div", { class: "ed-row" },
      el("span", { class: "ed-lab", text: "Or a whole group" }), g,
      btn("Give it to them", () => g.value
        ? run("kit --group " + g.value + " " + row.slot)
        : toast("No groups yet.", true))));
  }

  const b = picker(botList.map(x => ({ value: x.name, label: x.name })), "bot", "slot-bot");
  body.append(el("h3", { class: "ed-sub", text: "Or store a bot's gear here instead" }));
  body.append(el("div", { class: "ed-row" }, b,
    btn("Store it", () => b.value
      ? run("saveload " + b.value + " " + row.slot)
      : toast("No bots on the server.", true))));

  body.append(el("div", { class: "ed-danger" },
    el("button", { class: "btn sm danger", disabled: readOnly, text: "Delete this kit",
      onclick: () => confirm("Delete kit " + row.slot + "?") && run("delload " + row.slot) })));
}

$("groupCreate").addEventListener("click", async () => {
  const name = $("groupNew").value.trim();
  if (!name) return toast("Give the group a name first.", true);
  if (!/^[A-Za-z0-9_-]+$/.test(name)) return toast("Letters, numbers, - and _ only, with no spaces.", true);
  if (await run("groupcreate " + name)) {
    $("groupNew").value = "";
    openTeam("group", name);
  }
});

// ================================================================= skins

async function loadSkins() {
  busy($("skins"), "Reading the skins folder\u2026");
  showSkins(await ed.listSkins());
}

function showSkins(d) {
  $("skinStatus").textContent = [
    "Skin source: " + d.source + (d.folderMode ? "" : " — bots will not wear this folder until it is 'folder'"),
    d.signing ? "signing " + d.signDone + " of " + d.signTotal + "…" : null,
    d.signProblem || null,
    d.signFailed ? d.signFailed + " could not be signed" : null
  ].filter(Boolean).join(" · ");

  const t = $("skins");
  t.replaceChildren();
  if (!d.files.length) {
    t.append(el("tr", {}, el("td", { class: "muted", colspan: "3", text: "No skins in the folder yet." })));
    return;
  }
  for (const f of d.files) {
    t.append(el("tr", {},
      el("td", { class: "facecell" }, face(f.texture, true)),
      el("td", {}, el("b", { text: f.file })),
      el("td", { class: "muted", text: [
        f.kind === "image" ? (f.signed ? "signed, ready" : "waiting to be signed") : "signed (.yml)",
        kb(f.bytes),
        f.texture ? null : "no face to show yet"
      ].filter(Boolean).join(" · ") }),
      el("td", { class: "acts" },
        el("button", { class: "btn ghost sm", disabled: readOnly, text: "Delete",
          onclick: () => confirm("Delete " + f.file + "?")
            && ed.deleteSkin(f.file).then(showSkins, e => toast(e.message, true)) }))));
  }
}

/* Previewing what you picked happens entirely in the browser — nothing is
   sent until you press Upload. Images go in as data: URLs and sound as a
   blob:, which is exactly what this page's Content-Security-Policy allows. */

let skinOk = false;

$("skinFile").addEventListener("change", async () => {
  const f = $("skinFile").files[0];
  if (f && !$("skinName").value) $("skinName").value = slug(f.name.replace(/\.png$/i, ""));
  await showSkinPreview(f);
});

async function showSkinPreview(f) {
  const box = $("skinPreview");
  skinOk = false;
  box.replaceChildren();
  box.hidden = !f;
  if (!f) return;

  box.append(el("div", { class: "ed-busy" },
    el("span", { class: "sword", "aria-hidden": "true" }), " Looking at it\u2026"));

  let url, w, h;
  try {
    url = await new Promise((ok, no) => {
      const r = new FileReader();
      r.onload = () => ok(r.result);
      r.onerror = () => no(new Error("could not read it"));
      r.readAsDataURL(f);
    });
    ({ w, h } = await new Promise((ok, no) => {
      const i = new Image();
      i.onload = () => ok({ w: i.naturalWidth, h: i.naturalHeight });
      i.onerror = () => no(new Error("that is not an image this browser can open"));
      i.src = url;
    }));
  } catch (e) {
    box.replaceChildren(el("p", { class: "ed-bad", text: e.message }));
    return;
  }

  const rightSize = w === 64 && (h === 64 || h === 32);
  const tooBig = f.size > 262144;
  skinOk = rightSize && !tooBig;

  // the face, cut out the same way the bots' heads are
  const head = el("div", { class: "ed-face big", role: "img", "aria-label": "the face on this skin" });
  head.style.backgroundImage = "url(" + url + ")";

  const whole = el("img", { class: "ed-skinwhole", src: url,
    alt: "the whole skin image, " + w + " by " + h });

  box.replaceChildren(el("div", { class: "ed-preview" },
    head,
    whole,
    el("div", { class: "ed-previnfo" },
      el("div", { class: "name", text: f.name }),
      el("div", { class: "sub", text: w + " \u00d7 " + h + " \u00b7 " + kb(f.size) }),
      el("div", { class: rightSize ? "sub good" : "sub bad",
        text: rightSize ? "the right size for a skin" : "a skin has to be 64 \u00d7 64, or an old 64 \u00d7 32" }),
      tooBig ? el("div", { class: "sub bad", text: "over the 256 KB limit" }) : null)));
}

let voiceUrl = null;

$("voiceFile").addEventListener("change", () => {
  const f = $("voiceFile").files[0];
  if (f && !$("voiceName").value) $("voiceName").value = slug(f.name.replace(/\.[^.]+$/, ""));
  showVoicePreview(f);
});

function showVoicePreview(f) {
  const box = $("voicePreview");
  box.replaceChildren();
  if (voiceUrl) { URL.revokeObjectURL(voiceUrl); voiceUrl = null; }
  box.hidden = !f;
  if (!f) return;

  voiceUrl = URL.createObjectURL(f);
  const player = el("audio", { controls: true, src: voiceUrl, class: "ed-audio" });
  const info = el("div", { class: "ed-previnfo" },
    el("div", { class: "name", text: f.name }),
    el("div", { class: "sub", text: kb(f.size) + (f.size > 3 * 1048576 ? " \u00b7 over the 3 MB limit" : "") }));

  player.addEventListener("loadedmetadata", () => {
    const secs = Math.round(player.duration * 10) / 10;
    const max = voiceMax || 15;
    info.append(el("div", { class: secs > max ? "sub bad" : "sub good",
      text: secs + "s" + (secs > max ? " \u2014 lines are cut off after " + max + "s" : "") }));
  });
  player.addEventListener("error", () => {
    info.append(el("div", { class: "sub",
      text: "this browser cannot play it, so it will be converted to a WAV when you upload" }));
  });

  box.replaceChildren(el("div", { class: "ed-preview" }, player, info));
}

$("skinUpload").addEventListener("click", async () => {
  const f = $("skinFile").files[0];
  if (!f) return toast("Pick a PNG first.", true);
  if (!$("skinName").value.trim()) return toast("Give it a name.", true);
  const btn = $("skinUpload");
  btn.disabled = true;
  try {
    if (!skinOk) return toast("That image is not a 64 \u00d7 64 skin \u2014 see what is wrong under the picker.", true);
    const bytes = new Uint8Array(await f.arrayBuffer());
    let r;
    try {
      r = await ed.uploadSkin($("skinName").value.trim(), bytes);
    } catch (e) {
      if (!/already/.test(e.message) || !confirm(e.message + "\n\nReplace it?")) throw e;
      r = await ed.uploadSkin($("skinName").value.trim(), bytes, true);
    }
    showSkins(r);
    $("skinFile").value = "";
    $("skinName").value = "";
    showSkinPreview(null);
    toast(r.note || "Saved " + (r.saved || "it") + ".");
  } catch (e) {
    toast(e.message, true);
  } finally {
    btn.disabled = false;
  }
});

// ================================================================= voice

async function loadVoice() {
  busy($("lines"), "Reading the voice lines\u2026");
  if (!botList.length) {
    try { showBots(await ed.listBots()); } catch (e) { /* the list still works without bots */ }
  }
  showVoice(await ed.listVoice());
}

const heard = [];   // blob urls handed to <audio>, let go of on the next draw

function showVoice(d) {
  for (const u of heard.splice(0)) URL.revokeObjectURL(u);
  voiceMax = d.maxSeconds || 15;
  $("voiceStatus").textContent = d.installed
    ? d.status
    : "Simple Voice Chat is not on this server, so lines can be added but bots cannot say them yet.";

  /** Fetch the line and play it in this browser, to whoever is looking. */
  const listen = async (name, btn) => {
    const row = btn.closest("tr");
    const was = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Fetching\u2026";
    try {
      const got = await ed.getVoice(name);
      const url = playable(got);
      heard.push(url);
      const player = el("audio", { controls: true, src: url, class: "ed-audio",
        "aria-label": name });
      const cell = row.querySelector(".acts");
      const old = row.querySelector("audio");
      if (old) old.remove();
      cell.append(player);
      player.play().catch(() => { /* they can press play themselves */ });
    } catch (e) {
      toast(e.message, true);
    } finally {
      btn.disabled = false;
      btn.textContent = was;
    }
  };

  const play = name => ed.playVoice(name, $("voiceBot").value || "--all").then(
    r => toast(r.started + (r.started === 1 ? " bot is" : " bots are") + " saying " + name
      + (r.problems && r.problems.length ? " — " + r.problems[0] : "")),
    e => toast(e.message, true));

  const t = $("lines");
  t.replaceChildren();

  for (const l of d.builtIn || []) {
    t.append(el("tr", {},
      el("td", {}, el("b", { text: l.name })),
      el("td", { class: "muted", text: ["FightBot's own",
        l.speaker || null,
        l.sayOn && l.sayOn.length ? "says it on " + l.sayOn.join(", ") : null,
        l.seconds ? l.seconds + "s" : null].filter(Boolean).join(" · ") }),
      el("td", { class: "acts" },
        el("button", { class: "btn ghost sm", disabled: readOnly || !d.ready, text: "Play",
          onclick: () => play(l.name) }),
        el("button", { class: "btn ghost sm", text: "Listen",
          onclick: ev => listen(l.name, ev.currentTarget) }))));
  }

  for (const l of d.custom || []) {
    t.append(el("tr", {},
      el("td", {}, el("b", { text: l.name })),
      el("td", { class: "muted", text: l.problem
        ? "cannot play: " + l.problem
        : [l.file, (l.seconds == null ? "?" : l.seconds) + "s", kb(l.bytes)].join(" · ") }),
      el("td", { class: "acts" },
        el("button", { class: "btn ghost sm", disabled: readOnly || !d.ready || !!l.problem, text: "Play",
          onclick: () => play(l.name) }),
        el("button", { class: "btn ghost sm", disabled: !!l.problem, text: "Listen",
          onclick: ev => listen(l.name, ev.currentTarget) }),
        el("button", { class: "btn ghost sm", disabled: readOnly, text: "Delete",
          onclick: () => confirm("Delete " + l.name + "?")
            && ed.deleteVoice(l.name).then(showVoice, e => toast(e.message, true)) }))));
  }

  if (!(d.builtIn || []).length && !(d.custom || []).length) {
    t.append(el("tr", {}, el("td", { class: "muted", text: "No lines yet." })));
  }
  if (d.customEnabled === false) {
    t.append(el("tr", {}, el("td", { class: "muted",
      text: "Added lines are switched off in config.yml (voice.custom.enabled)." })));
  }
}

$("voiceUpload").addEventListener("click", async () => {
  const f = $("voiceFile").files[0];
  if (!f) return toast("Pick a sound file first.", true);
  if (!$("voiceName").value.trim()) return toast("Give the line a name.", true);
  const btn = $("voiceUpload");
  btn.disabled = true;
  try {
    let ext = (f.name.split(".").pop() || "").toLowerCase();
    let bytes = new Uint8Array(await f.arrayBuffer());

    if (ext !== "mp3" && ext !== "wav") {
      toast("Converting " + f.name + " in your browser…");
      try {
        bytes = await toWav(bytes.buffer, 60);
      } catch (e) {
        return toast("This browser cannot read " + f.name + ". Save it as an MP3 and upload that.", true);
      }
      ext = "wav";
    }
    if (bytes.length > 3 * 1048576) return toast("That is over 3 MB. Try a shorter clip.", true);

    const name = $("voiceName").value.trim();
    let r;
    try {
      r = await ed.uploadVoice(name, ext, bytes);
    } catch (e) {
      if (!/already/.test(e.message) || !confirm(e.message + "\n\nReplace it?")) throw e;
      r = await ed.uploadVoice(name, ext, bytes, true);
    }
    showVoice(r);
    $("voiceFile").value = "";
    $("voiceName").value = "";
    showVoicePreview(null);
    toast("Added " + (r.saved || name) + (r.seconds ? " (" + r.seconds + "s)" : "") + ".");
  } catch (e) {
    toast(e.message, true);
  } finally {
    btn.disabled = false;
  }
});

// ============================================================ debug logs

const PAGE = 262144;          // how much of a log to pull at a time
const LIVE_KEEP = 2097152;    // characters kept on screen while following live
let viewing = null, viewFrom = 0, liveChars = 0;
let voiceMax = 15;
let liveSwitch = null;

const liveOn = () => !!(liveSwitch && liveSwitch.input.checked);
function setLive(on) {
  if (liveSwitch) {
    liveSwitch.input.checked = on;
    liveSwitch.querySelector(".word").textContent = on ? "ON" : "OFF";
  }
  if (ed && !ed.closed) ed.liveDebug(on).catch(() => {});
}

async function loadDebug() {
  busy($("logs"), "Looking for debug logs\u2026");
  showDebug(await ed.listDebug());
}

function showDebug(d) {
  $("debugState").textContent = d.enabled
    ? "Logging is on" + (d.current ? " — writing " + d.current : "")
    : "Logging is off. Nothing is being written.";

  $("debugToggleRow").replaceChildren(
    el("span", { class: "ed-lab", text: "Write a debug log" }),
    mcSwitch({ checked: !!d.enabled, disabled: readOnly, label: "debug logging",
      onChange: on => ed.setDebug(on).then(showDebug, e => { toast(e.message, true); loadDebug(); }) }));

  const t = $("logs");
  t.replaceChildren();
  for (const f of d.files || []) {
    t.append(el("tr", {},
      el("td", {}, el("b", { text: f.file }), f.file === d.current
        ? el("span", { class: "muted", text: "  (being written now)" }) : null),
      el("td", { class: "muted", text: kb(f.bytes) }),
      el("td", { class: "muted", text: new Date(f.modified).toLocaleString() }),
      el("td", { class: "acts" },
        el("button", { class: "btn ghost sm", text: "View", onclick: () => view(f).catch(e => toast(e.message, true)) }),
        el("button", { class: "btn ghost sm", text: "Download", onclick: () => download(f).catch(e => toast(e.message, true)) }))));
  }
  if (!(d.files || []).length) {
    t.append(el("tr", {}, el("td", { class: "muted", text: "No logs yet. Turn logging on, then make the bug happen." })));
  }
}

/** Open a log at its end — the useful part — and page backwards from there. */
async function view(f) {
  viewing = f.file;
  $("viewer").hidden = false;
  $("viewName").textContent = f.file;

  if (!liveSwitch) {
    liveSwitch = mcSwitch({ id: "liveTail", label: "follow live", onChange: on => {
      ed.liveDebug(on).catch(e => { setLive(false); toast(e.message, true); });
    } });
    $("liveRow").replaceChildren(el("span", { class: "ed-lab", text: "Follow live" }), liveSwitch);
  }

  const r = await ed.getDebug(f.file, -PAGE, PAGE);
  viewFrom = r.offset;
  const pre = $("logText");
  pre.textContent = r.text;
  liveChars = r.text.length;
  $("loadMore").disabled = viewFrom <= 0;
  pre.scrollTop = pre.scrollHeight;
}

$("loadMore").addEventListener("click", async () => {
  if (!viewing || viewFrom <= 0) return;
  const btn = $("loadMore");
  btn.disabled = true;
  try {
    const from = Math.max(0, viewFrom - PAGE);
    const r = await ed.getDebug(viewing, from, viewFrom - from);
    viewFrom = from;
    $("logText").prepend(document.createTextNode(r.text));
    liveChars += r.text.length;
  } catch (e) {
    toast(e.message, true);
  } finally {
    btn.disabled = viewFrom <= 0;
  }
});

async function download(f) {
  const parts = [];
  for (let at = 0; at < f.bytes;) {
    const r = await ed.getDebug(f.file, at, 524288);
    if (!r.length) break;
    parts.push(r.text);
    at += r.length;
  }
  const url = URL.createObjectURL(new Blob(parts, { type: "text/plain" }));
  const a = el("a", { href: url, download: f.file });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** New lines while following live. Appended as text nodes, never by rewriting
    the whole log, so a long tail stays quick. */
function liveLines(d) {
  if (!viewing || !d || d.file !== viewing) return;
  const pre = $("logText");
  const atEnd = pre.scrollTop + pre.clientHeight >= pre.scrollHeight - 30;
  pre.append(document.createTextNode(d.text));
  liveChars += d.text.length;
  while (liveChars > LIVE_KEEP && pre.firstChild && pre.firstChild !== pre.lastChild) {
    liveChars -= pre.firstChild.textContent.length;
    pre.firstChild.remove();
    viewFrom = -1;              // the start is gone, so "load earlier" cannot line up
    $("loadMore").disabled = true;
  }
  if (atEnd) pre.scrollTop = pre.scrollHeight;
}

start();
