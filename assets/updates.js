/* The Updates page: every FightBot release, newest first, with its changelog.

   It all comes from Modrinth's public API, the same place the home page gets
   its version number - so a new release is here the moment it's published,
   with nothing to copy across. Nothing is sent: one read of the project's
   version list, no sign in.

   Each release ships as two builds under one number: "6.4.10" for Paper and
   "6.4.10-spigot" for Spigot. They're shown as one release with both
   downloads. */

import { renderMarkdown } from "./md.js";

const API = "https://api.modrinth.com/v2/project/paper-fight-bot/version";
const PAGE = "https://modrinth.com/plugin/paper-fight-bot";

const $ = id => document.getElementById(id);
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

const base = v => String(v || "").replace(/-spigot$/i, "");

/** 6.4.10 after 6.4.9, and 6.0.0 after its betas. */
function compare(a, b) {
  const pa = base(a).split(/[.-]/), pb = base(b).split(/[.-]/);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? "", y = pb[i] ?? "";
    const nx = /^\d+$/.test(x), ny = /^\d+$/.test(y);
    if (nx && ny) { if (+x !== +y) return +x - +y; continue; }
    if (x === y) continue;
    if (x === "") return 1;          // 6.0.0 is newer than 6.0.0-beta2
    if (y === "") return -1;
    return x < y ? -1 : 1;
  }
  return 0;
}

const when = iso => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const short = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K" : String(n);

/** The one-line summary under a changelog's title: the first paragraph that isn't the "two builds" note. */
function leadOf(md) {
  const paras = String(md || "").replace(/\r\n?/g, "\n").split(/\n\s*\n/);
  for (const p of paras) {
    const t = p.trim();
    if (!t || /^#/.test(t) || /^[-*|>]/.test(t) || /^Released as/i.test(t)) continue;
    const plain = t.replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ");
    return plain.length > 200 ? plain.slice(0, 197).replace(/\s+\S*$/, "") + "…" : plain;
  }
  return "";
}

/** Minecraft versions as a short range: 1.20.5 to 26.3. */
function range(list) {
  const mc = (list || []).filter(v => /^\d+(\.\d+)+$/.test(v)).sort(compare);
  if (!mc.length) return "";
  return mc.length === 1 ? mc[0] : mc[0] + " to " + mc[mc.length - 1];
}

function group(versions) {
  const byBase = new Map();
  for (const v of versions) {
    const key = base(v.version_number);
    if (!byBase.has(key)) byBase.set(key, { version: key, builds: [], published: v.date_published, type: "release", downloads: 0, mc: [] });
    const g = byBase.get(key);
    g.builds.push(v);
    g.downloads += v.downloads || 0;
    if (v.date_published < g.published) g.published = v.date_published;
    if (v.version_type !== "release") g.type = v.version_type;
    g.mc.push(...(v.game_versions || []));
  }
  const out = [...byBase.values()];
  for (const g of out) {
    g.paper = g.builds.find(b => !/-spigot$/i.test(b.version_number));
    g.spigot = g.builds.find(b => /-spigot$/i.test(b.version_number));
    const main = g.paper || g.spigot;
    g.changelog = (main && main.changelog) || (g.spigot && g.spigot.changelog) || "";
    g.lead = leadOf(g.changelog);
    g.search = (g.version + " " + g.changelog).toLowerCase();
  }
  return out.sort((a, b) => compare(b.version, a.version));
}

function fileOf(build) {
  if (!build || !build.files || !build.files.length) return null;
  return build.files.find(f => f.primary) || build.files[0];
}

function release(g, open) {
  const chips = el("span", { class: "up-chips" });
  if (open) chips.append(el("span", { class: "chip new", text: "Newest" }));
  if (g.type !== "release") chips.append(el("span", { class: "chip pre", text: g.type === "beta" ? "Beta" : "Test build" }));
  if (g.paper) chips.append(el("span", { class: "chip", text: "Paper" }));
  if (g.spigot) chips.append(el("span", { class: "chip", text: "Spigot" }));
  const mc = range(g.mc);
  if (mc) chips.append(el("span", { class: "chip", text: "Minecraft " + mc }));
  if (g.downloads) chips.append(el("span", { class: "chip", text: short(g.downloads) + " downloads" }));

  const body = el("div", { class: "up-body" });
  const d = el("details", { class: "up", id: "v" + g.version.replace(/[^0-9a-z]+/gi, "-") },
    el("summary", {},
      el("span", { class: "up-v", text: g.version }),
      el("span", { class: "up-lead", text: g.lead }),
      el("span", { class: "up-when", text: when(g.published) }),
      chips),
    body);

  // The changelog is only turned into a page when someone opens it
  let drawn = false;
  const draw = () => {
    if (drawn) return;
    drawn = true;
    body.innerHTML = renderMarkdown(g.changelog || "No notes were written for this one.");
    const dl = el("div", { class: "up-dl" });
    for (const [label, b] of [["Download for Paper", g.paper], ["Download for Spigot", g.spigot]]) {
      const f = fileOf(b);
      if (f) dl.append(el("a", { class: "btn ghost", href: f.url, rel: "noopener", text: label }));
    }
    dl.append(el("a", { class: "btn ghost", href: PAGE + "/version/" + encodeURIComponent((g.paper || g.spigot).version_number), rel: "noopener", text: "On Modrinth" }));
    body.append(dl);
  };
  d.addEventListener("toggle", () => { if (d.open) draw(); });
  if (open) { d.open = true; draw(); }
  return d;
}

async function main() {
  const list = $("upList"), count = $("upCount"), find = $("upFind");
  let groups;
  try {
    const r = await fetch(API, { cache: "no-store" });
    if (!r.ok) throw new Error("Modrinth answered " + r.status);
    const data = await r.json();
    if (!Array.isArray(data) || !data.length) throw new Error("no releases came back");
    groups = group(data);
  } catch (e) {
    list.replaceChildren(el("div", { class: "glass up-empty" },
      el("h3", { text: "The list couldn't load" }),
      el("p", { text: "Modrinth didn't answer just now, so the releases can't be shown here. Try again in a minute, or read them on Modrinth." }),
      el("a", { class: "btn ghost", href: PAGE + "/changelog", rel: "noopener", text: "Changelog on Modrinth" })));
    count.textContent = "";
    return;
  }

  // a link to one release (updates.html#v6-4-10) opens that one instead of the newest
  const wanted = location.hash.replace(/^#/, "");
  const nodes = groups.map((g, i) => release(g, wanted ? false : i === 0));
  list.replaceChildren(...nodes);
  if (wanted) {
    const hit = document.getElementById(wanted);
    if (hit) { hit.open = true; hit.scrollIntoView({ block: "start" }); }
  }

  const say = n => { count.textContent = n === groups.length ? groups.length + " releases" : n + " of " + groups.length + " releases"; };
  say(groups.length);
  find.disabled = false;
  find.addEventListener("input", () => {
    const q = find.value.trim().toLowerCase();
    let shown = 0;
    groups.forEach((g, i) => {
      const hit = !q || g.search.includes(q);
      nodes[i].hidden = !hit;
      if (hit) shown++;
    });
    say(shown);
    $("upNone").hidden = shown > 0;
  });
}

main();
