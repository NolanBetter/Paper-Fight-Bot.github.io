/* The server editor's screens.
   ---------------------------------------------------------------------------
   Everything that talks to the server lives in ../assets/fightbot-web.js.
   This file is only the five tabs and their forms. The protocol is written
   up in FightBot-WebEditor-Spec.md.

   Nothing else runs on this page on purpose: the link in the address bar is
   the key to someone's server, so no analytics, no widgets, and none of the
   site's own scripts (which load Firebase from another domain).
   --------------------------------------------------------------------------- */

import { connectFromLink, toWav } from "../assets/fightbot-web.js";

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
const tabs = ["settings", "bots", "skins", "voice", "debug"];
let current = "settings";

function setConn(text, kind) {
  const c = $("conn");
  c.textContent = text;
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
    setConn("No link", "bad");
    return;
  }

  try {
    ed = await connectFromLink(hash, {
      onState: (name, data) => { if (name === "bots") showBots(data); },
      onEvent: (name, data) => {
        if (name === "debug.lines") liveLines(data);
        else if (name === "paused") resume();
      },
      onClose: why => {
        setConn("Closed", "bad");
        forgetLink();
        clearInterval(endsTimer);
        $("ends").textContent = "";
        $("finish").hidden = true;
        $("tabs").hidden = true;
        for (const t of tabs) $("tab-" + t).hidden = true;
        $("savebar").hidden = true;
        $("start").hidden = false;
        $("startTitle").textContent = "The editor closed";
        $("startMsg").textContent = "It closed because " + why + ".";
        $("howTo").hidden = false;
        toast("The editor closed: " + why + ".", true);
      },
      onConnection: ok => {
        if (!ed || ed.closed) return;
        setConn(ok ? "Connected" : "Reconnecting…", ok ? "ok" : "wait");
        if (ok) resume();   // whatever was running before the drop
      }
    });
  } catch (e) {
    setConn("Not connected", "bad");
    $("startTitle").textContent = "Could not open the editor";
    $("startMsg").textContent = e.message;
    if (/expired|closed|isn't a FightBot|won't talk to/.test(e.message)) {
      forgetLink();
      $("howTo").hidden = false;
    }
    return;
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
  $("start").hidden = true;
  $("tabs").hidden = false;
  show("settings");
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
  if (!ed || ed.closed) return;
  watch();
  // the live log only runs while you can see it
  if (leaving === "debug" && name !== "debug" && $("liveTail").checked) {
    $("liveTail").checked = false;
    ed.liveDebug(false).catch(() => {});
  }
  const load = { settings: loadSettings, bots: loadBots, skins: loadSkins, voice: loadVoice, debug: loadDebug }[name];
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
  if (current === "debug" && $("liveTail").checked) ed.liveDebug(true).catch(() => {});
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

// ============================================================== settings

let cfg = null, edits = {};

/** "mace.dive-height" reads better as "Dive height". */
const pretty = key => {
  const last = key.split(".").slice(-1)[0].replace(/-/g, " ");
  return last.charAt(0).toUpperCase() + last.slice(1);
};

async function loadSettings() {
  cfg = await ed.getConfig();
  edits = {};
  renderSettings();
}

function renderSettings() {
  const box = $("sections");
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
    box.append(el("details", { class: "ed-sec", open: find ? true : undefined },
      el("summary", {}, el("span", { text: section || "Settings" })), body));
  }

  if (!groups.size) {
    box.append(el("p", { class: "lede", text: find ? "No setting matches that." : "This server sent no settings." }));
  }
  updateSavebar();
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
    input = el("input", { type: "checkbox", disabled, "aria-label": e.key });
    input.checked = !!value;
    input.addEventListener("change", () => changed(input.checked));

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
$("undo").addEventListener("click", () => { edits = {}; renderSettings(); });

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
      renderSettings();
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

let botNames = [];

async function loadBots() { showBots(await ed.listBots()); }

/** A bot's face, cut out of its skin image with CSS. */
function face(texture) {
  const f = el("div", { class: "ed-face", role: "img", "aria-label": "skin" });
  if (texture) f.style.backgroundImage = "url(https://textures.minecraft.net/texture/" + texture + ")";
  return f;
}

function showBots(data) {
  const bots = (data && data.bots) || [];
  botNames = bots.map(b => b.name);
  fillBotSelect();
  if (current !== "bots") return;

  $("botCount").textContent = bots.length + (bots.length === 1 ? " bot" : " bots")
    + (data && data.at ? " · " + new Date(data.at).toLocaleTimeString() : "");

  const box = $("bots");
  box.replaceChildren();
  if (!bots.length) {
    box.append(el("p", { class: "lede", text: "No bots right now. /fightbot spawn makes one." }));
    return;
  }

  for (const b of bots) {
    const pct = b.maxHealth ? Math.max(0, Math.min(100, (b.health / b.maxHealth) * 100)) : 0;

    const voice = el("select", { class: "ed-input", disabled: readOnly, "aria-label": "voice chat for " + b.name },
      ...["talks", "muted", "no-mod"].map(p => el("option", { value: p, text: "voice: " + p })));
    voice.value = b.voice || "no-mod";
    voice.addEventListener("change", () => ed.setPresence(b.name, voice.value).then(
      () => toast(b.name + ": voice " + voice.value),
      e => toast(e.message, true)));

    const where = [
      b.doing + (b.targets && b.targets.length ? " " + b.targets.join(", ") : ""),
      b.route || null,
      b.world + " " + Math.round(b.x) + " " + Math.round(b.y) + " " + Math.round(b.z),
      b.group ? "group " + b.group : null,
      b.holding ? "holding " + b.holding.toLowerCase().replace(/_/g, " ") : null
    ].filter(Boolean).join(" · ");

    box.append(el("div", { class: "ed-bot" },
      face(b.skin),
      el("div", { class: "nm" }, b.name, el("small", { text: "  " + b.ping + " ms" })),
      el("div", { class: "ed-hp", title: b.health + " of " + b.maxHealth + " health" },
        el("i", { style: "width:" + pct + "%" })),
      el("div", { class: "what", text: where }),
      el("div", { class: "acts" },
        el("button", { class: "btn ghost sm", disabled: readOnly, text: "Stop",
          onclick: () => ed.stopBot(b.name).then(
            r => toast(b.name + (r.stopped ? " stopped " + r.stopped : " was not doing anything")),
            e => toast(e.message, true)) }),
        el("button", { class: "btn sm", disabled: readOnly, text: "Remove",
          onclick: () => confirm("Remove " + b.name + "?")
            && ed.removeBot(b.name).then(showBots, e => toast(e.message, true)) }),
        voice)));
  }
}

function fillBotSelect() {
  const s = $("voiceBot");
  const keep = s.value;
  s.replaceChildren(
    ...botNames.map(n => el("option", { value: n, text: n })),
    el("option", { value: "--all", text: "every bot" }));
  if (keep) s.value = keep;
}

// ================================================================= skins

async function loadSkins() { showSkins(await ed.listSkins()); }

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
    t.append(el("tr", {}, el("td", { class: "muted", text: "No skins in the folder yet." })));
    return;
  }
  for (const f of d.files) {
    t.append(el("tr", {},
      el("td", {}, el("b", { text: f.file })),
      el("td", { class: "muted", text: f.kind === "image"
        ? (f.signed ? "signed, ready" : "waiting to be signed") + " · " + kb(f.bytes)
        : "signed (.yml)" }),
      el("td", { class: "acts" },
        el("button", { class: "btn ghost sm", disabled: readOnly, text: "Delete",
          onclick: () => confirm("Delete " + f.file + "?")
            && ed.deleteSkin(f.file).then(showSkins, e => toast(e.message, true)) }))));
  }
}

const slug = s => s.toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");

$("skinFile").addEventListener("change", () => {
  const f = $("skinFile").files[0];
  if (f && !$("skinName").value) $("skinName").value = slug(f.name.replace(/\.png$/i, ""));
});

$("skinUpload").addEventListener("click", async () => {
  const f = $("skinFile").files[0];
  if (!f) return toast("Pick a PNG first.", true);
  if (!$("skinName").value.trim()) return toast("Give it a name.", true);
  const btn = $("skinUpload");
  btn.disabled = true;
  try {
    const bytes = new Uint8Array(await f.arrayBuffer());
    if (bytes.length > 262144) return toast("That PNG is over 256 KB. A real skin is only a few KB.", true);
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
    toast(r.note || "Saved " + (r.saved || "it") + ".");
  } catch (e) {
    toast(e.message, true);
  } finally {
    btn.disabled = false;
  }
});

// ================================================================= voice

async function loadVoice() {
  if (!botNames.length) {
    try {
      const b = await ed.listBots();
      botNames = (b.bots || []).map(x => x.name);
      fillBotSelect();
    } catch (e) { /* the list still works without bots to play on */ }
  }
  showVoice(await ed.listVoice());
}

function showVoice(d) {
  $("voiceStatus").textContent = d.installed
    ? d.status
    : "Simple Voice Chat is not on this server, so lines can be added but bots cannot say them yet.";

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
          onclick: () => play(l.name) }))));
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
        el("button", { class: "btn ghost sm", disabled: readOnly, text: "Delete",
          onclick: () => confirm("Delete " + l.name + "?")
            && ed.deleteVoice(l.name).then(showVoice, e => toast(e.message, true)) }))));
  }

  if (!(d.builtIn || []).length && !(d.custom || []).length) {
    t.append(el("tr", {}, el("td", { class: "muted", text: "No lines yet." })));
  }
  if (!d.customEnabled) {
    t.append(el("tr", {}, el("td", { class: "muted",
      text: "Added lines are switched off in config.yml (voice.custom.enabled)." })));
  }
}

$("voiceFile").addEventListener("change", () => {
  const f = $("voiceFile").files[0];
  if (f && !$("voiceName").value) $("voiceName").value = slug(f.name.replace(/\.[^.]+$/, ""));
});

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

async function loadDebug() { showDebug(await ed.listDebug()); }

function showDebug(d) {
  $("debugState").textContent = d.enabled
    ? "Logging is ON" + (d.current ? " — writing " + d.current : "")
    : "Logging is off";
  const btn = $("debugToggle");
  btn.textContent = d.enabled ? "Turn off" : "Turn on";
  btn.disabled = readOnly;
  btn.onclick = () => ed.setDebug(!d.enabled).then(showDebug, e => toast(e.message, true));

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

$("liveTail").addEventListener("change", () => {
  ed.liveDebug($("liveTail").checked).catch(e => {
    $("liveTail").checked = false;
    toast(e.message, true);
  });
});

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
