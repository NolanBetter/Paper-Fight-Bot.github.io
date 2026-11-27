/* Extensions: browsing skin packs and configs, and sharing your own.
   The tabs: Extensions (on the way), Skins, Configs, and Yours once you're in. */

import { segmented, ago, shortNum, longDate, el, loadingLine } from "./ui.js";
import { KINDS, catLabel, listLive, listMine, createProject, addVersion, setCount, onAuth, askSignIn } from "./ext-data.js";
import { openForm } from "./ext-form.js";

const $ = id => document.getElementById(id);
const TABS = ["extensions", "skins", "configs", "mine"];
let tab = TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "skins";
let who = { ready: false };
const cache = {};          // kind -> projects (this visit)
let tabs;

const head = name => {
  const img = el("img", { className: "ex-head", width: 22, height: 22, alt: "", loading: "lazy" });
  img.onerror = () => { img.onerror = () => { img.hidden = true; }; img.src = "https://minotar.net/helm/" + encodeURIComponent(name) + "/22.png"; };
  img.src = "https://mc-heads.net/avatar/" + encodeURIComponent(name) + "/22";
  return img;
};

export function iconOf(p, size = 64) {
  if (p.icon && p.icon.startsWith("data:image/png;base64,")) return el("img", { className: "ex-icon", src: p.icon, alt: "", width: size, height: size });
  return el("span", { className: "ex-icon none " + p.kind, ariaHidden: "true", textContent: (KINDS[p.kind] || {}).icon || "?" });
}

const STATUS = { live: ["Live", "new"], removed: ["Taken down", "bad"], pending: ["Waiting for approval", "pre"] };

function card(p, mine) {
  const k = KINDS[p.kind] || KINDS.skins;
  const a = el("a", { className: "ex-card glass", href: "project.html?id=" + encodeURIComponent(p.id) },
    iconOf(p),
    el("div", { className: "ex-body" },
      el("h3", { textContent: p.title }),
      p.summary ? el("p", { className: "ex-sum", textContent: p.summary }) : null,
      el("p", { className: "ex-by" }, p.ownerName ? head(p.ownerName) : null, el("span", { textContent: p.ownerName ? "by " + p.ownerName : "by a player" })),
      el("div", { className: "ex-chips" },
        mine ? el("span", { className: "chip " + STATUS[p.status][1], textContent: STATUS[p.status][0] }) : null,
        mine ? el("span", { className: "chip", textContent: k.label }) : null,
        el("span", { className: "chip", textContent: catLabel(p.kind, p.category) }),
        p.kind === "skins" ? el("span", { className: "chip", textContent: p.count === 1 ? "1 skin" : p.count + " skins" }) : null,
        p.kind === "configs" && p.fb ? el("span", { className: "chip", textContent: "FightBot " + p.fb }) : null,
        el("span", { className: "chip quiet", textContent: "⬇ " + shortNum(p.downloads || 0) }),
        el("span", { className: "chip quiet", title: longDate(p.updated || p.created), textContent: ago(p.updated || p.created || Date.now()) }))));
  return a;
}

function empty(text, action) {
  return el("div", { className: "glass ex-empty" }, el("p", { textContent: text }), action || null);
}

async function show() {
  const grid = $("exGrid");
  const wip = tab === "extensions";
  $("exWip").hidden = !wip;
  $("exTools").hidden = wip || tab === "mine";
  grid.hidden = wip;
  shareButton();
  if (wip) return;
  if (location.hash.slice(1) !== tab) history.replaceState(null, "", "#" + tab);

  if (tab === "mine") {
    if (!who.user) { grid.replaceChildren(empty("Sign in to see what you've shared.")); return; }
    grid.replaceChildren(loadingLine("Loading what you've shared…"));
    try {
      const mine = (await listMine(who.user.uid)).sort((a, b) => b.updated - a.updated);
      grid.replaceChildren(...(mine.length ? mine.map(p => card(p, true))
        : [empty("You haven't shared anything yet. Pick Skins or Configs, then Share.")]));
    } catch (e) { grid.replaceChildren(empty(failed(e))); }
    return;
  }

  // the kinds for this tab
  const cat = $("exCat");
  const want = cat.dataset.kind === tab ? cat.value : "";
  cat.replaceChildren(el("option", { value: "", textContent: "Every kind" }),
    ...KINDS[tab].cats.map(([v, l]) => el("option", { value: v, textContent: l })));
  cat.dataset.kind = tab;
  cat.value = want;

  if (!cache[tab]) {
    grid.replaceChildren(loadingLine("Loading " + KINDS[tab].label.toLowerCase() + "…"));
    try { cache[tab] = await listLive(tab); }
    catch (e) { grid.replaceChildren(empty(failed(e))); return; }
  }
  draw();
}

function failed(e) {
  console.error(e);
  return e && e.code === "permission-denied"
    ? "Extensions aren't switched on in Firebase yet. (Owner: paste the new firestore.rules - see FIREBASE-SETUP.md.)"
    : "That didn't load. Check your connection and try again.";
}

function draw() {
  const grid = $("exGrid");
  const q = $("exFind").value.trim().toLowerCase();
  const c = $("exCat").value;
  const sort = $("exSort").value;
  let list = (cache[tab] || []).filter(p =>
    (!c || p.category === c) &&
    (!q || (p.title + " " + (p.summary || "") + " " + (p.ownerName || "")).toLowerCase().includes(q)));
  list.sort(sort === "downloads" ? (a, b) => (b.downloads || 0) - (a.downloads || 0)
    : sort === "updated" ? (a, b) => b.updated - a.updated : (a, b) => b.created - a.created);
  if (!list.length) {
    const none = (cache[tab] || []).length === 0;
    grid.replaceChildren(empty(none ? "Nothing here yet. Be the first to share a " + KINDS[tab].one + "." : "Nothing matches that.",
      none ? shareLink() : null));
    return;
  }
  grid.replaceChildren(...list.map(p => card(p, false)));
}

function shareLink() {
  const b = el("button", { type: "button", className: "btn ghost sm", textContent: "Share a " + KINDS[tab].one });
  b.addEventListener("click", share);
  return b;
}

function shareButton() {
  const b = $("exShare");
  b.hidden = !(tab === "skins" || tab === "configs");
  if (!b.hidden) b.textContent = "Share a " + KINDS[tab].one;
}

function share() {
  if (!who.ready) return;
  if (!who.user) { askSignIn(); return; }
  const kind = tab === "configs" ? "configs" : "skins";
  openForm(kind, null, async f => {
    const id = await createProject(kind, Object.assign({ owner: who.user.uid }, f), who.name);
    if (kind === "configs") {
      await addVersion(id, { fb: f.fb, label: f.version, note: "First version", yaml: f.yaml });
      await setCount(id, 1);
    }
    location.href = "project.html?id=" + encodeURIComponent(id) + (kind === "skins" ? "&new=1" : "");
  });
}

// ── wiring ──────────────────────────────────────────────────────────────

tabs = segmented($("exTabs"), b => { tab = b.dataset.tab; show(); });
tabs.set(tab, "tab");
$("exShare").addEventListener("click", share);
$("exFind").addEventListener("input", draw);
$("exCat").addEventListener("change", draw);
$("exSort").addEventListener("change", draw);
addEventListener("hashchange", () => {
  const h = location.hash.slice(1);
  if (TABS.includes(h) && h !== tab) { tab = h; tabs.set(tab, "tab"); show(); }
});

let shown = false;
onAuth(a => {
  const was = who.user && who.user.uid;
  who = a;
  if (!a.ready) return;
  $("exMineTab").hidden = !a.user;
  tabs.place();
  if (tab === "mine" && !a.user && a.ready) { tab = "skins"; tabs.set(tab, "tab"); }
  if (!shown || (tab === "mine" && was !== (a.user && a.user.uid))) { shown = true; show(); }
});
// the lists don't need you signed in: start loading at once
if (tab !== "mine") { shown = true; show(); }
