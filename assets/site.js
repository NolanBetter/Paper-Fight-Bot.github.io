/* Paper Fight Bot. Change CONFIG and every page follows. */

const CONFIG = {
  version:  "6.4.10",      // what the pages say until Modrinth answers (see liveFromModrinth)
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

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".bar nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href && href.toLowerCase() === here) a.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  mobileMenu();
  wikiFollow();
  liveFromModrinth();
});

/* On a phone the links don't fit in the bar, so they fold away behind a Menu
   button and open as a panel under it. Escape, a tap outside or picking a
   link closes it. Without this script the links simply scroll in the bar. */
function mobileMenu() {
  const bar = document.querySelector(".bar");
  const inner = bar && bar.querySelector(".bar-in");
  const nav = inner && inner.querySelector("nav");
  if (!nav || inner.querySelector(".menu-btn")) return;
  nav.id = nav.id || "site-nav";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "menu-btn";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", nav.id);
  btn.innerHTML = '<span class="menu-ico" aria-hidden="true"></span>Menu';
  inner.insertBefore(btn, nav);
  bar.classList.add("has-menu");
  const set = open => {
    bar.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  };
  btn.addEventListener("click", () => set(!bar.classList.contains("open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && bar.classList.contains("open")) { set(false); btn.focus(); } });
  document.addEventListener("click", e => { if (!inner.contains(e.target)) set(false); });
  nav.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
}

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
