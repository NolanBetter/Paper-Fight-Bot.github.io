/* Paper Fight Bot. Change CONFIG and every page follows. */

const CONFIG = {
  version:  "6.4.11",      // what the pages say until Modrinth answers (see liveFromModrinth)
  downloads: "9.9K",
  minecraft: "1.20.5+",
  modrinth: "https://modrinth.com/plugin/paper-fight-bot",
  discord:  "https://discord.gg/Gc3TDyFup5",
  libs:     "https://www.spigotmc.org/resources/libs-disguises-free.81/"
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-version]").forEach(el => el.textContent = CONFIG.version);
  document.querySelectorAll("[data-downloads]").forEach(el => el.textContent = CONFIG.downloads);
  document.querySelectorAll("[data-tested]").forEach(el => el.textContent = CONFIG.minecraft);

  document.querySelectorAll("[data-modrinth]").forEach(el => el.href = CONFIG.modrinth);
  document.querySelectorAll("[data-discord]").forEach(el => el.href = CONFIG.discord);
  document.querySelectorAll("[data-libs]").forEach(el => el.href = CONFIG.libs);

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  wikiFollow();
  liveFromModrinth();
});

/* The bar along the top.
   - The page you are on sits in a lens of brighter glass, drawn into its link
     in the HTML so it is there on the first frame (and flows across to the new
     link when you change page, where the browser does view transitions). With
     a mouse, the lens slides after the pointer.
   - Drop-downs (Admin, your account) live in .bar-tools, filled in by app.js.
   - When the links don't fit, they fold away behind a Menu button and open as
     a panel under the bar. Escape, a tap outside or picking a link closes it.
     Without this script the links simply scroll in the bar. */
const bar = (() => {
  const el = document.querySelector(".bar");
  const inner = el && el.querySelector(".bar-in");
  const nav = inner && inner.querySelector("nav");
  if (!nav || inner.querySelector(".menu-btn")) return null;

  // the page you're on, for pages whose HTML doesn't say (and its lens)
  if (!nav.querySelector('[aria-current="page"]')) {
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const a = [...nav.querySelectorAll("a")].find(x => (x.getAttribute("href") || "").toLowerCase() === here);
    if (a) a.setAttribute("aria-current", "page");
  }
  const home = nav.querySelector('[aria-current="page"]');
  if (home && !home.querySelector(".nav-hl")) {
    const hl = document.createElement("span");
    hl.className = "nav-hl"; hl.setAttribute("aria-hidden", "true");
    home.prepend(hl);
  }

  const tools = inner.querySelector(".bar-tools") || Object.assign(document.createElement("div"), { className: "bar-tools" });
  if (!tools.parentNode) nav.after(tools);
  nav.id = nav.id || "site-nav";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "menu-btn";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", nav.id);
  btn.innerHTML = '<span class="menu-ico" aria-hidden="true"></span>Menu';
  tools.after(btn);

  const closeAll = except => document.querySelectorAll(".dd.open").forEach(d => {
    if (d === except) return;
    d.classList.remove("open");
    const b = d.querySelector(".dd-btn");
    if (b) b.setAttribute("aria-expanded", "false");
  });
  const setMenu = open => {
    el.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    if (open) closeAll();
  };
  btn.addEventListener("click", () => setMenu(!el.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });

  // drop-downs: a .dd holds a .dd-btn and its .dd-panel
  document.addEventListener("click", e => {
    const b = e.target.closest(".dd-btn");
    if (b) {
      const d = b.closest(".dd");
      const open = !d.classList.contains("open");
      closeAll(d);
      d.classList.toggle("open", open);
      b.setAttribute("aria-expanded", String(open));
      if (open) {
        setMenu(false);
        const first = d.querySelector(".dd-panel input, .dd-panel .dd-item");
        if (first && matchMedia("(pointer:fine)").matches) setTimeout(() => first.focus({ preventScroll: true }), 60);
      }
      return;
    }
    // where the click was when it happened: a drop-down that redraws itself
    // (Sign in -> Log in) has already taken the clicked button off the page
    const path = e.composedPath ? e.composedPath() : [e.target];
    if (!path.some(n => n.classList && n.classList.contains("dd"))) closeAll();
    if (!path.includes(inner)) setMenu(false);
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const d = document.querySelector(".dd.open");
    if (d) { closeAll(); const b = d.querySelector(".dd-btn"); if (b) b.focus(); return; }
    if (el.classList.contains("open")) { setMenu(false); btn.focus(); }
  });

  // fold when the links don't fit: measured with them out, in one go, so nothing flickers
  // (with every animation held, or the menu would fade in and out each time)
  let lastW = -1;
  const fit = force => {
    if (force !== true && innerWidth === lastW) return;   // a phone's address bar sliding away is only height
    lastW = innerWidth;
    const was = el.classList.contains("folded");
    el.classList.add("measuring");
    el.classList.remove("folded");
    const need = nav.scrollWidth, have = nav.clientWidth;
    const fold = need > have + 1 || innerWidth < 520;
    el.classList.toggle("folded", fold);
    void nav.offsetWidth;
    el.classList.remove("measuring");
    if (!fold) setMenu(false);
    if (was !== fold) lensTo(null);
  };

  // the lens follows a mouse along the links, and settles back on yours
  const lens = home && home.querySelector(".nav-hl");
  const fine = matchMedia("(hover:hover) and (pointer:fine)");
  const lensTo = a => {
    if (!lens) return;
    if (!a || a === home || el.classList.contains("folded") || a.classList.contains("nav-dl")) {
      lens.style.transform = ""; lens.style.width = ""; return;
    }
    lens.style.width = a.offsetWidth + "px";
    lens.style.transform = "translateX(" + (a.offsetLeft - home.offsetLeft) + "px)";
  };
  if (lens) {
    nav.classList.add("lens");
    nav.addEventListener("pointerover", e => { if (fine.matches) lensTo(e.target.closest("a")); });
    nav.addEventListener("pointerleave", () => lensTo(null));
    nav.addEventListener("focusin", e => { if (e.target.matches(":focus-visible")) lensTo(e.target.closest("a")); });
    nav.addEventListener("focusout", () => lensTo(null));
  }

  fit(true);
  addEventListener("resize", () => fit(), { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fit(true));
  // app.js says when the drop-downs change size (Sign in -> your name)
  addEventListener("pfb:bar", () => fit(true));
  return { fit, closeAll };
})();

/* The newest release and the download count, straight from Modrinth's public
   API, so the home page never says an old version again. Only the numbers are
   read: nothing is sent, no sign in. If Modrinth doesn't answer, the pages keep
   what CONFIG says. The Spigot build ships under the same version number with
   "-spigot" on the end, so that suffix is left off. */
function liveFromModrinth() {
  const shows = document.querySelector("[data-version], [data-downloads]");
  if (!shows) return;
  const api = "https://api.modrinth.com/v2/project/paper-fight-bot";
  const short = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
    : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K" : String(n);

  fetch(api, { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(p => {
    if (!p || typeof p.downloads !== "number") return;
    document.querySelectorAll("[data-downloads]").forEach(el => el.textContent = short(p.downloads));
  }).catch(() => {});

  fetch(api + "/version", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(list => {
    if (!Array.isArray(list)) return;
    const rel = list.find(v => v.version_type === "release") || list[0];
    if (!rel || !rel.version_number) return;
    const v = String(rel.version_number).replace(/-spigot$/i, "");
    document.querySelectorAll("[data-version]").forEach(el => el.textContent = v);
  }).catch(() => {});
}

/* On the wiki, mark the section you are reading in the list down the side,
   and keep it in view as you go. The list is long enough to scroll on its
   own now, so without this you lose your place in it.

   Everything is looked up fresh each time, because the list and the sections
   are redrawn when the page's text comes down from Firebase. */
function wikiFollow() {
  if (!document.querySelector(".wiki-nav")) return;

  let waiting = false;
  const mark = () => {
    waiting = false;
    const heads = document.querySelectorAll(".wiki-body h2[id]");
    if (!heads.length) return;

    // the last heading that has gone past the top of the screen
    let here = heads[0].id;
    for (const h of heads) {
      if (h.getBoundingClientRect().top <= 120) here = h.id;
      else break;
    }
    // at the very bottom, the last section is the one being read
    const tall = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (window.innerHeight + window.scrollY >= tall - 4) {
      here = heads[heads.length - 1].id;
    }

    let on = null;
    for (const a of document.querySelectorAll(".wiki-nav a")) {
      const is = a.getAttribute("href") === "#" + here;
      a.classList.toggle("on", is);
      if (is) on = a;
    }
    // Keep it in sight inside the list. The list's own scrollbar is moved by
    // hand here: scrollIntoView would scroll the page as well, and fight
    // whatever the reader (or a click on one of these links) was doing.
    if (on) {
      const nav = on.closest(".wiki-nav");
      const a = on.getBoundingClientRect(), n = nav.getBoundingClientRect();
      if (a.top < n.top) nav.scrollTop += a.top - n.top;
      else if (a.bottom > n.bottom) nav.scrollTop += a.bottom - n.bottom;
    }
  };

  const soon = () => { if (!waiting) { waiting = true; requestAnimationFrame(mark); } };
  addEventListener("scroll", soon, { passive: true });
  addEventListener("resize", soon, { passive: true });
  // the wiki's own text arrives a moment later
  setTimeout(mark, 300);
  setTimeout(mark, 1500);
  mark();
}
