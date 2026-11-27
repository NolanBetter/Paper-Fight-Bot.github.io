/* Small pieces of interface shared by the download page and Extensions.

   segmented(): a row of buttons where one is picked, with a lens of glass that
   slides to the one you pick (the same lens as the bar along the top). Works
   with the keyboard: arrows move along, and the pick follows. */

export function segmented(root, onPick) {
  const buttons = () => [...root.querySelectorAll("button[role=radio], button[role=tab]")];
  let lens = root.querySelector(".seg-lens");
  if (!lens) {
    lens = document.createElement("span");
    lens.className = "seg-lens";
    lens.setAttribute("aria-hidden", "true");
    root.prepend(lens);
  }
  const attr = b => (b.getAttribute("role") === "tab" ? "aria-selected" : "aria-checked");
  const current = () => buttons().find(b => b.getAttribute(attr(b)) === "true") || buttons()[0];
  const place = () => {
    const b = current();
    if (!b || !b.offsetWidth) return;
    lens.style.width = b.offsetWidth + "px";
    lens.style.height = b.offsetHeight + "px";
    lens.style.transform = "translate(" + b.offsetLeft + "px," + b.offsetTop + "px)";
  };
  const pick = (b, quiet) => {
    for (const x of buttons()) {
      const on = x === b;
      x.setAttribute(attr(x), String(on));
      x.tabIndex = on ? 0 : -1;
    }
    place();
    if (!quiet && onPick) onPick(b);
  };
  root.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (b && root.contains(b) && b !== current()) pick(b);
  });
  root.addEventListener("keydown", e => {
    const all = buttons(), i = all.indexOf(document.activeElement);
    if (i < 0) return;
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = all[(i + step + all.length) % all.length];
    next.focus();
    pick(next);
  });
  // the first time, no slide: it's just there
  root.classList.add("still");
  pick(current(), true);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("still")));
  addEventListener("resize", place, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  return {
    set(value, key = "type") { const b = buttons().find(x => x.dataset[key] === value); if (b) pick(b, true); },
    get(key = "type") { const b = current(); return b ? b.dataset[key] : null; },
    place
  };
}

/** "3 days ago", "just now" - with the exact date for a title. */
export function ago(ms) {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [u, n] of units) {
    if (s >= n) { const v = Math.floor(s / n); return v + " " + u + (v === 1 ? "" : "s") + " ago"; }
  }
  return "just now";
}

export const shortNum = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K" : String(n);

export const longDate = ms => new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

export function el(tag, props, ...kids) {
  const e = Object.assign(document.createElement(tag), props || {});
  for (const k of kids) if (k != null && k !== false) e.append(k);
  return e;
}

/** A line of text with a spinning sword, for anything still loading. */
export function loadingLine(text) {
  return el("p", { className: "loading" },
    Object.assign(document.createElement("span"), { className: "sword", ariaHidden: "true" }),
    el("span", { textContent: text }));
}

/** The version number without "-spigot" (both builds of a release share it). */
export const baseVersion = v => String(v || "").replace(/-spigot$/i, "");

/** 6.4.10 after 6.4.9, 1.21.1 after 1.21, and 6.0.0 after its betas. */
export function compareVersions(a, b) {
  const pa = baseVersion(a).split(/[.-]/), pb = baseVersion(b).split(/[.-]/);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? "", y = pb[i] ?? "";
    const nx = /^\d+$/.test(x), ny = /^\d+$/.test(y);
    if (nx && ny) { if (+x !== +y) return +x - +y; continue; }
    if (x === y) continue;
    if (x === "") return ny ? -1 : 1;
    if (y === "") return nx ? 1 : -1;
    if (nx !== ny) return nx ? 1 : -1;
    return x.localeCompare(y, "en", { numeric: true });
  }
  return 0;
}

/** Minecraft versions as "1.20.5 to 26.3" (release versions only, no snapshots). */
export function mcRange(list) {
  const mc = (list || []).filter(v => /^\d+(\.\d+)+$/.test(v)).sort(compareVersions);
  if (!mc.length) return "";
  return mc.length === 1 ? mc[0] : mc[0] + " to " + mc[mc.length - 1];
}
