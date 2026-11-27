/* Approvals (Admin): uploads that were taken down, fixed, and sent back - and
   the ones still down. Only the site's owner gets anything back from the
   database here; anyone else sees a note saying so. */

import { segmented, ago, longDate, el, loadingLine } from "./ui.js";
import { KINDS, listByStatus, approve, takeDown, onAuth, askSignIn, LIMITS } from "./ext-data.js";
import { ask } from "./ext-form.js";

const $ = id => document.getElementById(id);
let which = "pending";
let who = { ready: false };

const iconOf = p => p.icon && p.icon.startsWith("data:image/png;base64,")
  ? el("img", { className: "ex-icon", src: p.icon, alt: "", width: 56, height: 56 })
  : el("span", { className: "ex-icon none " + p.kind, ariaHidden: "true", textContent: (KINDS[p.kind] || {}).icon || "?" });

async function show() {
  const list = $("apList");
  if (!who.user) {
    const b = el("button", { type: "button", className: "btn ghost sm", textContent: "Sign in" });
    b.addEventListener("click", () => askSignIn());
    list.replaceChildren(el("div", { className: "glass ex-empty" }, el("p", { textContent: "Sign in as the site's owner to see approvals." }), b));
    return;
  }
  if (!who.owner) { list.replaceChildren(el("div", { className: "glass ex-empty" }, el("p", { textContent: "Only the site's owner can see approvals." }))); return; }
  list.replaceChildren(loadingLine("Loading…"));
  let rows;
  try { rows = (await listByStatus(which)).sort((a, b) => b.updated - a.updated); }
  catch (e) { console.error(e); list.replaceChildren(el("div", { className: "glass ex-empty" }, el("p", { textContent: "That didn't load. Check the Firestore rules are the new ones." }))); return; }
  if (!rows.length) {
    list.replaceChildren(el("div", { className: "glass ex-empty" }, el("p", { textContent: which === "pending" ? "Nothing is waiting. 🎉" : "Nothing is taken down." })));
    return;
  }
  list.replaceChildren(...rows.map(p => row(p)));
}

function row(p) {
  const k = KINDS[p.kind] || KINDS.skins;
  const ok = el("button", { type: "button", className: "btn sm", textContent: which === "pending" ? "Approve" : "Put it back up" });
  const no = el("button", { type: "button", className: "btn ghost sm danger-text", textContent: "Keep it down" });
  const r = el("div", { className: "ap-row glass" },
    iconOf(p),
    el("div", { className: "ap-body" },
      el("a", { className: "ap-title", href: "project.html?id=" + encodeURIComponent(p.id), textContent: p.title }),
      el("p", { className: "hint" }, k.label.replace(/s$/, "") + " by " + (p.ownerName || "a player") + " · " + (which === "pending" ? "sent back " : "taken down ") + ago(p.updated)),
      p.reason ? el("p", { className: "ap-why" }, el("b", { textContent: "Taken down for: " }), p.reason) : null),
    el("div", { className: "row" }, ok, which === "pending" ? no : null));
  ok.addEventListener("click", async () => {
    ok.disabled = true;
    try { await approve(p.id); r.classList.add("done"); r.querySelector(".row").replaceChildren(el("span", { className: "chip new", textContent: "Live" })); refreshDot(); }
    catch (e) { console.error(e); ok.disabled = false; }
  });
  no.addEventListener("click", async () => {
    const why = await ask({ title: "Keep it down", text: "Whoever shared it will see this, and can fix it and send it back.",
      field: "What's still wrong?", confirm: "Keep it down", danger: true, min: 3, max: LIMITS.reason, value: p.reason || "" });
    if (why == null) return;
    try { await takeDown(p.id, why); r.classList.add("done"); r.querySelector(".row").replaceChildren(el("span", { className: "chip bad", textContent: "Kept down" })); refreshDot(); }
    catch (e) { console.error(e); }
  });
  return r;
}

const refreshDot = () => {};   // the bar follows waiting uploads live by itself

segmented($("apTabs"), b => { which = b.dataset.tab; show(); });
onAuth(a => { who = a; if (a.ready) show(); });
