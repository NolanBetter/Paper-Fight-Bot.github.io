/* Extensions: one skin pack or config.

   Anyone: look through it, see a skin in 3D, download one skin, all of them
   as a .zip, or the config. Whoever shared it: change the details, add and
   take away skins (drop a whole folder of PNGs at once), upload a new version
   of a config, delete it. The site's owner: take it down with a reason; once
   it's fixed and sent back, approve it (or keep it down). */

import { segmented, ago, shortNum, longDate, el, loadingLine } from "./ui.js";
import {
  KINDS, catLabel, LIMITS, getProject, getSkins, getVersions, saveDetails, setCount, askApproval, takeDown, approve,
  countDownload, addSkins, renameSkin, deleteSkin, addVersion, deleteProject, readSkin, headCanvas, readConfigFile,
  skinNameOf, onAuth, askSignIn
} from "./ext-data.js";
import { openForm, ask } from "./ext-form.js";
import { read, compare, asYaml, scrub, looksLikeFightBot } from "./fbconfig.js";
import { makeZip, bytesOf, saveFile } from "./zip.js";
import { renderMarkdown } from "./md.js";
import { skinModel } from "../editor/skin3d.js";

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const ID = params.get("id") || "";
let who = { ready: false };
let p = null;            // the project
let skins = null, versions = null;
let defaults = null;     // FightBot's own config, read

const mine = () => !!(p && who.user && p.owner === who.user.uid);
const boss = () => !!who.owner;
const fileName = s => String(s || "skin").replace(/[\\/:*?"<>|]+/g, " ").trim() || "skin";

const headImg = name => {
  const img = el("img", { className: "ex-head", width: 26, height: 26, alt: "" });
  img.onerror = () => { img.onerror = () => { img.hidden = true; }; img.src = "https://minotar.net/helm/" + encodeURIComponent(name) + "/26.png"; };
  img.src = "https://mc-heads.net/avatar/" + encodeURIComponent(name) + "/26";
  return img;
};
const iconOf = (pr, size) => pr.icon && pr.icon.startsWith("data:image/png;base64,")
  ? el("img", { className: "ex-icon", src: pr.icon, alt: "", width: size, height: size })
  : el("span", { className: "ex-icon none " + pr.kind, ariaHidden: "true", textContent: (KINDS[pr.kind] || {}).icon || "?" });

function toast(text, bad) {
  const t = el("div", { className: "toast" + (bad ? " bad" : ""), role: "status", textContent: text });
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add("in"));
  setTimeout(() => { t.classList.remove("in"); setTimeout(() => t.remove(), 400); }, bad ? 6000 : 3200);
}
const oops = (e, what) => {
  console.error(e);
  toast((what || "That didn't work") + (e && e.code === "permission-denied" ? ": not allowed." : ". Try again."), true);
};

// ── loading ─────────────────────────────────────────────────────────────

async function load() {
  if (!/^[A-Za-z0-9]{10,40}$/.test(ID)) return gone("That link is missing which pack or config to show.");
  try { p = await getProject(ID); }
  catch (e) {
    // not live, and not yours: the rules won't even say it's there
    if (e && e.code === "permission-denied") return gone(who.user ? "This isn't up at the moment." : "This isn't up at the moment. If it's yours, sign in to see it.", !who.user);
    return gone("That didn't load. Check your connection and try again.");
  }
  if (!p) return gone("This has been deleted, or the link is wrong.");
  document.title = p.title + " — Paper Fight Bot";
  draw();
  try {
    if (p.kind === "skins") skins = await getSkins(ID);
    else {
      [versions, defaults] = await Promise.all([getVersions(ID),
        fetch("assets/fightbot-config.yml").then(r => r.ok ? r.text() : "").then(t => read(t)).catch(() => null)]);
    }
  } catch (e) { console.error(e); skins = skins || []; versions = versions || []; }
  draw();
}

function gone(text, signIn) {
  const box = el("div", { className: "glass ex-empty" }, el("p", { textContent: text }));
  if (signIn) {
    const b = el("button", { type: "button", className: "btn ghost sm", textContent: "Sign in" });
    b.addEventListener("click", () => askSignIn());
    box.append(b);
  }
  $("pjBody").replaceChildren(box);
}

// ── the page ────────────────────────────────────────────────────────────

function draw() {
  const k = KINDS[p.kind];
  const body = $("pjBody");
  const parts = [];

  // where it stands, for whoever shared it and the site's owner
  if (p.status !== "live" && (mine() || boss())) parts.push(standing());

  const actions = el("div", { className: "pj-actions" });
  if (p.kind === "skins") {
    const all = el("button", { type: "button", className: "btn", disabled: !skins || !skins.length });
    all.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="dl-ico"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg><span>Download all (.zip)</span>';
    all.addEventListener("click", zipAll);
    actions.append(all);
  } else {
    const v = versions && versions[0];
    const dl = el("button", { type: "button", className: "btn", disabled: !v });
    dl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="dl-ico"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg><span>Download config.yml</span>';
    dl.addEventListener("click", () => v && saveConfig(v));
    actions.append(dl);
  }
  if (mine()) {
    actions.append(button("Change details", "ghost", editDetails), button("Delete", "ghost danger-text", remove));
  }
  if (boss() && p.status === "live") actions.append(button("Take it down", "ghost danger-text", () => moderate("removed")));

  parts.push(el("div", { className: "pj-top glass" },
    iconOf(p, 112),
    el("div", { className: "pj-about" },
      el("p", { className: "pj-kind", textContent: k.label.replace(/s$/, "") + " · " + catLabel(p.kind, p.category) }),
      el("h1", { textContent: p.title }),
      p.summary ? el("p", { className: "pj-sum", textContent: p.summary }) : null,
      el("p", { className: "pj-by" }, p.ownerName ? headImg(p.ownerName) : null, el("span", { textContent: p.ownerName ? "by " + p.ownerName : "by a player" })),
      el("div", { className: "ex-chips" },
        p.kind === "skins" ? el("span", { className: "chip", textContent: (p.count === 1 ? "1 skin" : p.count + " skins") }) : null,
        p.kind === "configs" && p.fb ? el("span", { className: "chip new", textContent: "FightBot " + p.fb }) : null,
        p.version ? el("span", { className: "chip", textContent: "Version " + p.version }) : null,
        el("span", { className: "chip quiet", textContent: "⬇ " + shortNum(p.downloads || 0) + " downloads" }),
        el("span", { className: "chip quiet", title: longDate(p.updated || p.created), textContent: "Updated " + ago(p.updated || p.created || Date.now()) })),
      actions)));

  if (p.kind === "skins") parts.push(skinSection());
  else parts.push(configSection());

  if (p.about) {
    const a = el("div", { className: "pj-text glass" }, el("h2", { textContent: "About it" }));
    const md = el("div", { className: "md" });
    md.innerHTML = renderMarkdown(p.about);
    a.append(md);
    parts.push(a);
  }
  body.replaceChildren(...parts);
}

function button(text, kind, fn) {
  const b = el("button", { type: "button", className: "btn " + (kind || ""), textContent: text });
  b.addEventListener("click", fn);
  return b;
}

/** Taken down, or waiting: the reason, and what to do about it. */
function standing() {
  const box = el("div", { className: "pj-standing " + p.status });
  if (p.status === "removed") {
    box.append(el("h2", { textContent: "This was taken down" }),
      el("p", { className: "why" }, el("b", { textContent: "Why: " }), p.reason || "No reason was given."),
      el("p", { textContent: mine() ? "Only you and the site's owner can see it now. Fix what's wrong, then send it to be approved." : "Only its owner and you can see it." }));
    const row = el("div", { className: "row" });
    if (mine()) row.append(button("Send it for approval", "", async () => {
      try { await askApproval(ID); p.status = "pending"; draw(); toast("Sent. You'll see it go live once it's approved."); }
      catch (e) { oops(e, "That wasn't sent"); }
    }));
    if (boss()) row.append(button("Put it back up", "ghost", () => moderate("live")));
    box.append(row);
  } else if (p.status === "pending") {
    box.append(el("h2", { textContent: "Waiting for approval" }),
      p.reason ? el("p", { className: "why" }, el("b", { textContent: "It was taken down for: " }), p.reason) : null,
      el("p", { textContent: mine() ? "You sent it back to be looked at. Until it's approved, only you and the site's owner can see it." : "Its owner fixed it and sent it back." }));
    if (boss()) box.append(el("div", { className: "row" },
      button("Approve", "", () => moderate("live")), button("Keep it down", "ghost danger-text", () => moderate("removed"))));
  }
  return box;
}

async function moderate(to) {
  if (to === "removed") {
    const why = await ask({ title: p.status === "live" ? "Take it down" : "Keep it down",
      text: "Whoever shared it will see this, and can fix it and send it back.", field: "What's wrong with it?",
      confirm: p.status === "live" ? "Take it down" : "Keep it down", danger: true, min: 3, max: LIMITS.reason });
    if (why == null) return;
    try { await takeDown(ID, why); p.status = "removed"; p.reason = why; draw(); toast("Taken down."); }
    catch (e) { oops(e, "That wasn't taken down"); }
  } else {
    try { await approve(ID); p.status = "live"; p.reason = ""; draw(); toast("Approved: it's live."); }
    catch (e) { oops(e, "That wasn't approved"); }
  }
}

function editDetails() {
  openForm(p.kind, p, async f => {
    await saveDetails(ID, f, who.name || p.ownerName);
    Object.assign(p, { title: f.title.trim(), summary: f.summary.trim(), about: f.about.trim(), icon: f.icon,
      version: f.version.trim(), fb: f.fb.trim(), category: f.category, ownerName: who.name || p.ownerName, updated: Date.now() });
    draw();
    toast("Saved.");
  });
}

async function remove() {
  const ok = await ask({ title: "Delete " + p.title + "?", text: "It's gone for good" + (p.kind === "skins" ? ", every skin in it too." : ", every version of it too."),
    confirm: "Delete it", danger: true });
  if (ok == null) return;
  try { await deleteProject(ID); location.href = "extensions.html#mine"; }
  catch (e) { oops(e, "That wasn't deleted"); }
}

// ── skins ───────────────────────────────────────────────────────────────

function skinSection() {
  const sec = el("div", { className: "pj-skins" });
  if (mine()) sec.append(dropZone());
  if (!skins) { sec.append(loadingLine("Loading the skins…")); return sec; }
  if (!skins.length) {
    sec.append(el("div", { className: "glass ex-empty" }, el("p", { textContent: mine() ? "No skins in it yet. Drop some above." : "There are no skins in this pack yet." })));
    return sec;
  }
  const find = el("input", { type: "search", className: "ed-input", placeholder: "Find a skin" });
  const grid = el("div", { className: "sk-grid" });
  const tiles = skins.map(s => {
    const t = el("button", { type: "button", className: "sk-tile", title: s.name },
      headCanvas(s.png, 56), el("span", { className: "sk-name", textContent: s.name }),
      s.slim ? el("span", { className: "sk-slim", textContent: "slim" }) : null);
    t.addEventListener("click", () => viewSkin(s));
    t.dataset.name = s.name.toLowerCase();
    return t;
  });
  grid.append(...tiles);
  find.addEventListener("input", () => {
    const q = find.value.trim().toLowerCase();
    for (const t of tiles) t.hidden = !!q && !t.dataset.name.includes(q);
  });
  sec.append(el("div", { className: "sk-head-row" }, el("h2", { textContent: skins.length === 1 ? "1 skin" : skins.length + " skins" }),
    skins.length > 12 ? find : null,
    el("p", { className: "hint", textContent: "Pick one to see it in 3D and download it." })), grid);
  return sec;
}

function dropZone() {
  const pick = el("input", { type: "file", accept: ".png,image/png", multiple: true, hidden: true });
  const folder = el("input", { type: "file", hidden: true, multiple: true });
  folder.setAttribute("webkitdirectory", "");
  const status = el("p", { className: "drop-status", hidden: true, ariaLive: "polite" });
  const bar = el("div", { className: "drop-bar", hidden: true }, el("span"));
  const files = el("button", { type: "button", className: "btn ghost sm", textContent: "Pick skins" });
  const dir = el("button", { type: "button", className: "btn ghost sm", textContent: "Pick a folder" });
  files.addEventListener("click", () => pick.click());
  dir.addEventListener("click", () => folder.click());
  const zone = el("div", { className: "drop glass", tabIndex: -1 },
    el("p", { className: "drop-big", textContent: "Drop skins here" }),
    el("p", { className: "hint", textContent: "64×64 PNG skins, as many as you like - a whole folder at once. Each is checked and added on its own." }),
    el("div", { className: "row" }, files, dir), bar, status, pick, folder);
  const take = list => addFiles([...list], status, bar);
  pick.addEventListener("change", () => { take(pick.files); pick.value = ""; });
  folder.addEventListener("change", () => { take(folder.files); folder.value = ""; });
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("over"); });
  zone.addEventListener("dragleave", e => { if (!zone.contains(e.relatedTarget)) zone.classList.remove("over"); });
  zone.addEventListener("drop", async e => {
    e.preventDefault();
    zone.classList.remove("over");
    take(await droppedFiles(e.dataTransfer));
  });
  if (params.get("new") === "1" && !skins) setTimeout(() => zone.scrollIntoView({ block: "center" }), 300);
  return zone;
}

/** Files dropped, folders and all (folders are read through, one level after another). */
async function droppedFiles(dt) {
  const items = [...(dt.items || [])].map(i => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
  if (!items.length) return [...(dt.files || [])];
  const out = [];
  const walk = async entry => {
    if (out.length > LIMITS.skins) return;
    if (entry.isFile) { out.push(await new Promise(ok => entry.file(ok, () => ok(null)))); return; }
    if (entry.isDirectory) {
      const reader = entry.createReader();
      for (;;) {
        const batch = await new Promise(ok => reader.readEntries(ok, () => ok([])));
        if (!batch.length) break;
        for (const e of batch) await walk(e);
      }
    }
  };
  for (const e of items) await walk(e);
  return out.filter(Boolean);
}

let adding = false;
async function addFiles(list, status, bar) {
  if (adding) return;
  const files = list.filter(f => /\.png$/i.test(f.name));
  const skipped = list.length - files.length;
  if (!files.length) {
    status.hidden = false;
    status.textContent = list.length ? "None of those are PNGs - skins are PNG files." : "";
    return;
  }
  const room = LIMITS.skins - (skins ? skins.length : 0);
  adding = true;
  status.hidden = false; bar.hidden = false;
  status.textContent = "Checking " + files.length + " file" + (files.length === 1 ? "" : "s") + "…";
  const good = [], bad = [];
  for (const f of files.slice(0, room)) {
    const r = await readSkin(f);
    if (r.error) bad.push(r.name + " " + r.error); else good.push(r);
  }
  const fill = bar.firstChild;
  const res = good.length ? await addSkins(ID, good, (done, total) => {
    fill.style.width = Math.round(done / total * 100) + "%";
    status.textContent = "Adding skins: " + done + " of " + total;
  }) : { done: 0, bad: 0 };
  try { skins = await getSkins(ID); await setCount(ID, skins.length); p.count = skins.length; p.updated = Date.now(); }
  catch (e) { console.error(e); }
  adding = false;
  const msg = [];
  if (res.done) msg.push((res.done === 1 ? "1 skin" : res.done + " skins") + " added.");
  if (res.bad) msg.push(res.bad + " didn't save.");
  if (bad.length) msg.push(bad.length + " left out: " + bad.slice(0, 4).join("; ") + (bad.length > 4 ? "; and " + (bad.length - 4) + " more" : "") + ".");
  if (skipped) msg.push(skipped + " weren't PNGs.");
  if (files.length > room) msg.push("A pack holds " + LIMITS.skins + " skins at most.");
  draw();
  toast(msg.join(" ") || "Nothing was added.", !res.done);
}

/** One skin in 3D, to download (and for its owner, to rename or take out). */
function viewSkin(s) {
  const model = skinModel(s.png, { slim: s.slim, height: 300, label: s.name + " in 3D" });
  const name = el("h2", { textContent: s.name });
  const dl = button("Download " + fileName(s.name) + ".png", "", () => {
    saveFile(new Blob([bytesOf(s.png)], { type: "image/png" }), fileName(s.name) + ".png");
    countDownload(ID);
  });
  const x = el("button", { type: "button", className: "x", ariaLabel: "Close", textContent: "×" });
  const arms = el("label", { className: "tick" }, el("input", { type: "checkbox", checked: !!s.slim }), el("span", { className: "tick-box", ariaHidden: "true" }), "Slim arms");
  arms.querySelector("input").addEventListener("change", e => model.setSlim(e.target.checked));
  const foot = el("div", { className: "modal-foot" }, dl);
  const d = el("dialog", { className: "modal sk-view" },
    el("div", { className: "modal-in" },
      el("div", { className: "modal-head" }, name, x),
      model,
      el("p", { className: "sk-tip", textContent: "Drag to turn it round." }),
      el("div", { className: "row center" }, arms),
      foot));
  if (mine()) {
    foot.prepend(button("Rename", "ghost", async () => {
      const n = await ask({ title: "Rename it", field: "Its name", confirm: "Rename", min: 1, max: LIMITS.skinName, value: s.name });
      if (n == null || !n.trim()) return;
      try {
        await renameSkin(ID, s.id, n.trim(), s.png, arms.querySelector("input").checked);
        s.name = n.trim().slice(0, LIMITS.skinName); s.slim = arms.querySelector("input").checked; name.textContent = s.name;
        draw(); toast("Renamed.");
      } catch (e) { oops(e, "That wasn't renamed"); }
    }), button("Take it out", "ghost danger-text", async () => {
      try {
        await deleteSkin(ID, s.id);
        skins = skins.filter(x2 => x2.id !== s.id);
        await setCount(ID, skins.length); p.count = skins.length;
        d.close(); draw(); toast(s.name + " taken out.");
      } catch (e) { oops(e, "That wasn't taken out"); }
    }));
  }
  document.body.append(d);
  x.addEventListener("click", () => d.close());
  d.addEventListener("click", e => { if (e.target === d) d.close(); });
  d.addEventListener("close", () => { model.stop(); d.remove(); });
  d.showModal();
  model.spin(true);
}

async function zipAll() {
  if (!skins || !skins.length) return;
  const files = skins.map(s => ({ name: fileName(s.name) + ".png", bytes: bytesOf(s.png) }));
  saveFile(makeZip(files), fileName(p.title) + ".zip");
  countDownload(ID);
}

// ── configs ─────────────────────────────────────────────────────────────

let cfgTab = "changes";
let showing = null;      // the version being looked at

function configSection() {
  const sec = el("div", { className: "pj-cfg" });
  if (!versions) { sec.append(loadingLine("Loading the config…")); return sec; }
  if (!versions.length) { sec.append(el("div", { className: "glass ex-empty" }, el("p", { textContent: "There's no config in this yet." }))); return sec; }
  const v = showing && versions.find(x => x.id === showing.id) || versions[0];
  showing = v;
  const tabs = el("div", { className: "seg", role: "tablist", ariaLabel: "What to show" },
    ...[["changes", "What it changes"], ["full", "The whole file"], ["versions", "Versions (" + versions.length + ")"]].map(([t, l]) => {
      const b = el("button", { type: "button", role: "tab", textContent: l });
      b.dataset.tab = t;
      b.setAttribute("aria-selected", String(t === cfgTab));
      return b;
    }));
  const panel = el("div", { className: "cfg-panel" });
  sec.append(el("div", { className: "cfg-bar" }, tabs,
    v !== versions[0] ? el("span", { className: "chip pre", textContent: "Looking at an older version: " + (v.label || longDate(v.at)) }) : null), panel);
  const fill = () => {
    if (cfgTab === "changes") panel.replaceChildren(changes(v));
    else if (cfgTab === "full") panel.replaceChildren(whole(v));
    else panel.replaceChildren(versionList());
  };
  requestAnimationFrame(() => segmented(tabs, b => { cfgTab = b.dataset.tab; fill(); }));
  fill();
  return sec;
}

function codeBox(lines, cls) {
  const pre = el("pre", { className: "code " + (cls || "") });
  for (const l of lines) {
    const row = el("span", { className: "ln " + (l.kind || "") });
    if (l.n) row.append(el("i", { textContent: l.n }));
    row.append(el("span", { textContent: l.text }));
    if (l.note) row.append(el("em", { textContent: "  # " + l.note }));
    pre.append(row);
  }
  return pre;
}

function copyButton(text) {
  const b = el("button", { type: "button", className: "btn ghost sm", textContent: "Copy" });
  b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(text); b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1600); }
    catch (e) { toast("Your browser wouldn't let that be copied.", true); }
  });
  return b;
}

function changes(v) {
  const box = el("div", { className: "cfg-changes" });
  if (!defaults || !defaults.values.size) {
    box.append(el("p", { className: "hint", textContent: "FightBot's own config didn't load, so what this one changes can't be worked out. The whole file is under The whole file." }));
    return box;
  }
  const theirs = read(v.yaml);
  const c = compare(theirs, defaults);
  const lines = asYaml(c.changed, it => "default: " + (it.def === "" ? '""' : it.def));
  const text = lines.map(l => l.text).join("\n");
  box.append(el("div", { className: "cfg-head" },
    el("h2", { textContent: c.changed.length ? (c.changed.length === 1 ? "It changes 1 setting" : "It changes " + c.changed.length + " settings") : "It changes nothing" }),
    c.changed.length ? copyButton(text) : null),
    el("p", { className: "hint", textContent: "Compared with FightBot's own config today. Everything else is left as FightBot has it." }),
    c.changed.length ? codeBox(lines, "changes") : null);
  if (c.added.length) {
    box.append(el("details", { className: "cfg-more" },
      el("summary", { textContent: (c.added.length === 1 ? "1 setting is" : c.added.length + " settings are") + " new in FightBot since this config" + (theirs.version ? " (written by " + theirs.version + ")" : "") }),
      el("p", { className: "hint", textContent: "FightBot adds these by itself, with its defaults, the first time it loads this config." }),
      codeBox(c.added.map(path => ({ text: path, kind: "add" })))));
  }
  if (c.unknown.length) {
    box.append(el("details", { className: "cfg-more" },
      el("summary", { textContent: (c.unknown.length === 1 ? "1 setting" : c.unknown.length + " settings") + " FightBot doesn't have any more" }),
      el("p", { className: "hint", textContent: "Left over from an older FightBot, or a typo. FightBot ignores them." }),
      codeBox(c.unknown.map(u => ({ text: u.path + ": " + u.value, kind: "gone" })))));
  }
  return box;
}

function whole(v) {
  const theirs = read(v.yaml);
  const changedAt = new Set();
  if (defaults) for (const c of compare(theirs, defaults).changed) changedAt.add(c.line);
  const lines = v.yaml.replace(/\r\n?/g, "\n").split("\n").map((t, i) => ({ n: i + 1, text: t, kind: changedAt.has(i + 1) ? "hit" : /^\s*#/.test(t) ? "cm" : "" }));
  return el("div", {},
    el("div", { className: "cfg-head" },
      el("h2", { textContent: "config.yml" }),
      el("span", { className: "hint", textContent: (v.fb ? "For FightBot " + v.fb + " · " : "") + lines.length + " lines · changed settings are lit" }),
      copyButton(v.yaml)),
    codeBox(lines, "full"));
}

function versionList() {
  const box = el("div", { className: "cfg-versions" });
  if (mine()) box.append(uploadVersion());
  for (const v of versions) {
    const row = el("div", { className: "ver-row glass" + (v === showing ? " on" : "") },
      el("div", {},
        el("b", { textContent: v.label || "Version of " + longDate(v.at) }),
        el("p", { className: "hint" }, (v.fb ? "For FightBot " + v.fb + " · " : "") + ago(v.at)),
        v.note ? el("p", { className: "ver-note", textContent: v.note }) : null),
      el("div", { className: "row" },
        v === showing ? el("span", { className: "chip new", textContent: "Showing" }) : button("Show it", "ghost sm", () => { showing = v; cfgTab = "changes"; draw(); }),
        button("Download", "ghost sm", () => saveConfig(v))));
    box.append(row);
  }
  return box;
}

function uploadVersion() {
  const file = el("input", { type: "file", accept: ".yml,.yaml", className: "filepick" });
  const fb = el("input", { className: "ed-input", maxLength: LIMITS.fb, placeholder: "FightBot version", value: "" });
  const label = el("input", { className: "ed-input", maxLength: LIMITS.version, placeholder: "Its own version (optional)" });
  const note = el("input", { className: "ed-input", maxLength: LIMITS.note, placeholder: "What changed (optional)" });
  const say = el("p", { className: "hint" });
  let yaml = null;
  file.addEventListener("change", async () => {
    yaml = null;
    const f = file.files[0];
    if (!f) return;
    try {
      const text = await readConfigFile(f);
      const r = read(text);
      if (!looksLikeFightBot(r)) throw new Error("That doesn't look like a FightBot config.yml.");
      const s = scrub(text);
      yaml = s.text;
      if (r.version && !fb.value) fb.value = r.version;
      say.textContent = r.values.size + " settings read." + (s.blanked.length ? " Blanked so they stay yours: " + s.blanked.join(", ") + "." : "");
      say.classList.remove("bad");
    } catch (e) { file.value = ""; say.textContent = e.message; say.classList.add("bad"); }
  });
  const go = button("Upload this version", "", async () => {
    if (!yaml) { say.textContent = "Pick the config.yml first."; say.classList.add("bad"); return; }
    go.disabled = true;
    try {
      await addVersion(ID, { fb: fb.value || p.fb, label: label.value, note: note.value, yaml });
      versions = await getVersions(ID);
      await setCount(ID, versions.length);
      if (fb.value && fb.value !== p.fb) await saveDetails(ID, Object.assign({}, p, { fb: fb.value }), who.name || p.ownerName);
      p.fb = fb.value || p.fb; p.count = versions.length; p.updated = Date.now();
      showing = versions[0]; cfgTab = "changes";
      draw(); toast("New version up.");
    } catch (e) { go.disabled = false; oops(e, "That version wasn't uploaded"); }
  });
  return el("div", { className: "ver-new glass" },
    el("h3", { textContent: "Upload a new version" }),
    file, say,
    el("div", { className: "two" }, fb, label), note, el("div", { className: "row" }, go));
}

function saveConfig(v) {
  saveFile(new Blob([v.yaml], { type: "text/yaml" }), "config.yml");
  countDownload(ID);
}

// ── go ──────────────────────────────────────────────────────────────────

let started = false;
onAuth(a => {
  const before = who.user && who.user.uid;
  who = a;
  if (!a.ready) return;
  if (!started) { started = true; load(); return; }
  if (before !== (a.user && a.user.uid)) load();      // signed in or out: what you may see changes
  else if (p) draw();
});
