/* Paper Fight Bot. Change CONFIG and every page follows. */

const CONFIG = {
  version:  "6.0.0",
  downloads: "1.2K",
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

  wikiFollow();
});

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
