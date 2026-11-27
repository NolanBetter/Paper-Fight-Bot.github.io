/* The download page: FightBot's own version of its Modrinth page.

   Everything comes from Modrinth's public API - the project (downloads,
   followers, when it was last updated) and every version with its files - so
   a new release is here the moment it is on Modrinth. The files themselves
   come straight from Modrinth's servers; nothing is copied anywhere.

   Two builds of every release: the plain one for Paper and Purpur, and the
   one whose version ends in -spigot for Spigot and CraftBukkit 26.1+. */

import { segmented, ago, shortNum, longDate, el, baseVersion, compareVersions, mcRange } from "./ui.js";

const API = "https://api.modrinth.com/v2/project/paper-fight-bot";
const PAGE = 15;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private window */ } }
};

const $ = id => document.getElementById(id);
const isMc = v => /^\d+(\.\d+)+$/.test(v);
const typeOf = v => /-spigot$/i.test(v.version_number) ? "spigot" : "paper";
const TYPE = { paper: "Paper", spigot: "Spigot" };
const SERVER = { paper: "Paper and Purpur", spigot: "Spigot and CraftBukkit" };

function fileOf(v) {
  const files = v.files || [];
  return files.find(f => f.primary) || files[0] || null;
}
const size = b => !b ? "" : b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
const anchor = v => "updates.html#v" + baseVersion(v.version_number).replace(/[^0-9a-z]+/gi, "-");

let versions = [];       // newest first
let filter = { type: "", mc: "", betas: false, page: 0 };

async function main() {
  const [project, list] = await Promise.all([
    fetch(API, { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(API + "/version", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null)
  ]);
  if (project) showProject(project);
  if (!Array.isArray(list)) return failed();
  versions = list.map(v => ({
    raw: v,
    number: v.version_number,
    name: v.name || v.version_number,
    type: typeOf(v),
    channel: v.version_type || "release",
    mc: (v.game_versions || []).filter(isMc).sort(compareVersions),
    at: Date.parse(v.date_published) || 0,
    downloads: v.downloads || 0,
    file: fileOf(v)
  })).filter(v => v.file).sort((a, b) => b.at - a.at);
  if (!versions.length) return failed();
  getPanel();
  table();
}

function showProject(p) {
  if (p.icon_url && /^https:\/\/cdn\.modrinth\.com\//.test(p.icon_url)) {
    const img = $("dlIcon");
    img.onerror = () => { img.onerror = null; img.src = "assets/logo.png"; };
    img.src = p.icon_url;
  }
  if (typeof p.downloads === "number") document.querySelectorAll("[data-downloads]").forEach(e => e.textContent = shortNum(p.downloads));
  if (typeof p.followers === "number") $("dlFollows").textContent = shortNum(p.followers);
  const up = Date.parse(p.updated);
  if (up) { $("dlUpdated").textContent = ago(up); $("dlUpdated").title = longDate(up); }
}

function failed() {
  const msg = () => el("div", { className: "glass up-empty" },
    el("p", { style: "margin:0 0 12px", textContent: "Modrinth didn't answer, so the versions can't be listed right now." }),
    el("a", { className: "btn ghost sm", href: "https://modrinth.com/plugin/paper-fight-bot/versions", textContent: "Download from Modrinth instead" }));
  $("dlPick").replaceChildren(msg());
  $("dlTable").replaceChildren(msg());
  $("dlMc").replaceChildren(el("option", { textContent: "Not available" }));
}

// ── Get FightBot: the one build for your server ─────────────────────────

let pickType = store.get("dl.type") === "spigot" ? "spigot" : "paper";
let typeSeg;

function getPanel() {
  typeSeg = segmented($("dlType"), b => { pickType = b.dataset.type; store.set("dl.type", pickType); fillMc(); pick(); });
  typeSeg.set(pickType);
  $("dlMc").addEventListener("change", () => { store.set("dl.mc", $("dlMc").value); pick(); });
  fillMc();
  pick();
}

/** The Minecraft versions this build has ever supported, newest first. */
function mcFor(type) {
  const all = new Set();
  for (const v of versions) if (v.type === type) v.mc.forEach(m => all.add(m));
  return [...all].sort(compareVersions).reverse();
}

function fillMc() {
  const sel = $("dlMc");
  const want = sel.value && sel.value !== "Loading…" ? sel.value : store.get("dl.mc");
  const list = mcFor(pickType);
  sel.replaceChildren(...list.map(m => el("option", { value: m, textContent: "Minecraft " + m })));
  sel.disabled = !list.length;
  if (want && list.includes(want)) sel.value = want;
}

function pick() {
  const mc = $("dlMc").value;
  const fits = versions.filter(v => v.type === pickType && v.mc.includes(mc));
  const best = fits.find(v => v.channel === "release") || fits[0];
  const box = $("dlPick");
  if (!best) {
    box.replaceChildren(el("p", { className: "dl-none", textContent: "No " + TYPE[pickType] + " build for Minecraft " + mc + "." }));
    return;
  }
  const f = best.file;
  const newest = versions.find(v => v.type === pickType && v.channel === "release");
  const old = newest && best !== newest && compareVersions(best.number, newest.number) < 0;
  box.replaceChildren(el("div", { className: "dl-card" + (box.dataset.shown ? " swap" : "") },
    el("div", { className: "dl-card-top" },
      el("span", { className: "dl-v", textContent: baseVersion(best.number) }),
      el("span", { className: "chip" + (best.channel === "release" ? " new" : " pre"), textContent: best.channel === "release" ? "Release" : cap(best.channel) }),
      el("span", { className: "chip", textContent: "For " + SERVER[pickType] })),
    el("p", { className: "dl-meta" },
      el("span", { textContent: "Minecraft " + mcRange(best.mc) }), " · ",
      el("span", { title: longDate(best.at), textContent: "out " + ago(best.at) }), " · ",
      el("span", { textContent: shortNum(best.downloads) + " downloads" })),
    old ? el("p", { className: "dl-old", textContent: "This is the last build for Minecraft " + mc + ". Newer versions of FightBot need a newer Minecraft." }) : null,
    el("div", { className: "dl-actions" },
      dlButton(f, "Download " + (f.filename || "the jar")),
      el("a", { className: "btn ghost", href: anchor(best), textContent: "What's new" })),
    el("p", { className: "dl-file", textContent: [f.filename, size(f.size)].filter(Boolean).join(" · ") })));
  box.dataset.shown = "1";
}

function dlButton(f, label, small) {
  const a = el("a", { className: "btn" + (small ? " sm" : ""), href: f.url, rel: "nofollow" });
  a.setAttribute("download", f.filename || "");
  a.insertAdjacentHTML("afterbegin", '<svg viewBox="0 0 24 24" aria-hidden="true" class="dl-ico"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>');
  a.append(el("span", { textContent: label }));
  return a;
}

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ── All versions ────────────────────────────────────────────────────────

function table() {
  segmented($("dlFType"), b => { filter.type = b.dataset.type; filter.page = 0; fillFilterMc(); draw(); });
  $("dlFMc").addEventListener("change", () => { filter.mc = $("dlFMc").value; filter.page = 0; draw(); });
  $("dlBetas").addEventListener("change", () => { filter.betas = $("dlBetas").checked; filter.page = 0; draw(); });
  fillFilterMc();
  draw();
  if (location.hash === "#all") $("all").scrollIntoView();
}

function fillFilterMc() {
  const sel = $("dlFMc");
  const keep = sel.value;
  const all = new Set();
  for (const v of versions) if (!filter.type || v.type === filter.type) v.mc.forEach(m => all.add(m));
  const list = [...all].sort(compareVersions).reverse();
  sel.replaceChildren(el("option", { value: "", textContent: "Any Minecraft version" }),
    ...list.map(m => el("option", { value: m, textContent: "Minecraft " + m })));
  sel.value = list.includes(keep) ? keep : "";
  filter.mc = sel.value;
}

function draw() {
  const rows = versions.filter(v =>
    (!filter.type || v.type === filter.type) &&
    (!filter.mc || v.mc.includes(filter.mc)) &&
    (filter.betas || v.channel === "release"));
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  filter.page = Math.min(filter.page, pages - 1);
  const shown = rows.slice(filter.page * PAGE, filter.page * PAGE + PAGE);
  $("dlCount").textContent = rows.length === 1 ? "1 version" : rows.length + " versions";

  const head = el("div", { className: "dl-row dl-th", role: "row" },
    ...["Version", "Minecraft", "Published", "Downloads", ""].map(t => el("span", { role: "columnheader", textContent: t })));
  const body = shown.map(v => el("div", { className: "dl-row", role: "row" },
    el("span", { className: "dl-name", role: "cell" },
      el("a", { href: anchor(v), className: "dl-num", textContent: v.number }),
      el("span", { className: "dl-tags" },
        el("span", { className: "chip" + (v.channel === "release" ? "" : " pre"), textContent: v.channel === "release" ? "Release" : cap(v.channel) }),
        el("span", { className: "chip", textContent: TYPE[v.type] }))),
    el("span", { role: "cell", className: "dl-mc", textContent: mcRange(v.mc) || "—" }),
    el("span", { role: "cell", className: "dl-when", title: longDate(v.at), textContent: ago(v.at) }),
    el("span", { role: "cell", className: "dl-count", textContent: shortNum(v.downloads) }),
    el("span", { role: "cell", className: "dl-go" }, dlButton(v.file, "Download", true))));
  $("dlTable").replaceChildren(head, ...(body.length ? body : [el("p", { className: "dl-none", textContent: "No versions match. Try Any Minecraft version, or show betas." })]));

  const nav = $("dlPages");
  nav.replaceChildren();
  if (pages > 1) {
    const go = (p, label, cur) => {
      const b = el("button", { type: "button", className: "pg" + (cur ? " on" : ""), textContent: label, disabled: p < 0 || p >= pages });
      if (cur) b.setAttribute("aria-current", "page");
      b.addEventListener("click", () => { filter.page = p; draw(); $("all").scrollIntoView({ behavior: "smooth" }); });
      return b;
    };
    nav.append(go(filter.page - 1, "Back"));
    for (let p = 0; p < pages; p++) {
      if (pages > 7 && p > 0 && p < pages - 1 && Math.abs(p - filter.page) > 1) {
        if (!nav.lastChild.classList.contains("gap")) nav.append(el("span", { className: "pg gap", textContent: "…" }));
        continue;
      }
      nav.append(go(p, String(p + 1), p === filter.page));
    }
    nav.append(go(filter.page + 1, "Next"));
  }
}

main();
