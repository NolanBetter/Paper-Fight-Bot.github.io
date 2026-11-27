/* Extensions: the form for sharing a skin pack or config, and for changing
   its details later. One <dialog>, built here, used by both pages. */

import { el } from "./ui.js";
import { KINDS, LIMITS, makeIcon, readConfigFile } from "./ext-data.js";
import { read, looksLikeFightBot, scrub } from "./fbconfig.js";

let dialog = null;

/**
 * Open the form.
 * @param kind     "skins" or "configs"
 * @param project  its details now, to change them - or null for a new one
 * @param save     async (fields) => { ... } - throw to show an error
 *                 fields: { title, summary, about, icon, version, fb, category, yaml?, blanked? }
 */
export function openForm(kind, project, save) {
  if (dialog) dialog.remove();
  const meta = KINDS[kind];
  const isNew = !project;
  const cfg = kind === "configs";
  let icon = project ? project.icon || "" : "";
  let yaml = null, blanked = [];

  const input = (id, max, place, value) => el("input", { id, className: "ed-input", maxLength: max, placeholder: place || "", value: value || "" });
  const title = input("fTitle", LIMITS.title[1], cfg ? "Practice arena" : "Robot army", project && project.title);
  title.required = true; title.minLength = LIMITS.title[0];
  const summary = input("fSummary", LIMITS.summary, cfg ? "Bots that hit hard and never give up" : "Forty shiny robots for your bots", project && project.summary);
  const cat = el("select", { id: "fCat" }, ...meta.cats.map(([v, l]) => el("option", { value: v, textContent: l })));
  cat.value = project ? project.category || "other" : meta.cats[0][0];
  const version = input("fVersion", LIMITS.version, "1.0", project && project.version);
  const fb = input("fFb", LIMITS.fb, "6.4.11", project && project.fb);
  const about = el("textarea", { id: "fAbout", className: "ed-input", rows: 5, maxLength: LIMITS.about, value: (project && project.about) || "" });
  const note = el("p", { className: "form-note", hidden: true });
  const say = (t, bad) => { note.textContent = t || ""; note.hidden = !t; note.classList.toggle("bad", !!bad); };

  // the icon: any picture, made into a small PNG here
  const iconBtn = el("button", { type: "button", className: "icon-btn", ariaLabel: "Pick an icon" });
  const iconFile = el("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/gif", hidden: true });
  const iconClear = el("button", { type: "button", className: "dd-link", textContent: "Take the icon off", hidden: !icon });
  const showIcon = () => {
    iconBtn.replaceChildren(icon ? el("img", { src: icon, alt: "" }) : el("span", { textContent: "Add an icon" }));
    iconClear.hidden = !icon;
  };
  iconBtn.addEventListener("click", () => iconFile.click());
  iconFile.addEventListener("change", async () => {
    const f = iconFile.files[0];
    iconFile.value = "";
    if (!f) return;
    try { icon = await makeIcon(f); showIcon(); say(""); } catch (e) { say(e.message, true); }
  });
  iconClear.addEventListener("click", () => { icon = ""; showIcon(); });
  showIcon();

  // a config: the file, read and checked as soon as it's picked
  const file = el("input", { type: "file", id: "fFile", accept: ".yml,.yaml", className: "filepick" });
  const fileNote = el("p", { className: "hint", innerHTML: 'Found in <code class="cmd">plugins/FightBot/config.yml</code>. API keys and secrets in it are blanked before it\'s shared.' });
  file.addEventListener("change", async () => {
    yaml = null; blanked = [];
    const f = file.files[0];
    if (!f) return;
    try {
      const text = await readConfigFile(f);
      const r = read(text);
      if (!looksLikeFightBot(r)) throw new Error("That doesn't look like a FightBot config.yml.");
      const s = scrub(text);
      yaml = s.text; blanked = s.blanked;
      if (r.version && !fb.value) fb.value = r.version;
      fileNote.textContent = r.values.size + " settings read" + (r.version ? ", written by FightBot " + r.version : "") + "."
        + (blanked.length ? " Blanked so they stay yours: " + blanked.join(", ") + "." : "");
      fileNote.classList.remove("bad");
    } catch (e) {
      file.value = "";
      fileNote.textContent = e.message || "That file couldn't be read.";
      fileNote.classList.add("bad");
    }
  });

  const go = el("button", { type: "submit", className: "btn", textContent: isNew ? "Share it" : "Save" });
  const cancel = el("button", { type: "button", className: "btn ghost", textContent: "Cancel" });
  const x = el("button", { type: "button", className: "x", ariaLabel: "Close", textContent: "×" });
  const lab = (text, ctl, extra) => el("label", {}, text, extra || null, ctl);
  const form = el("form", { className: "modal-in form-grid", noValidate: true },
    el("div", { className: "modal-head" }, el("h2", { textContent: isNew ? "Share a " + meta.one : "Change its details" }), x),
    el("div", { className: "icon-pick" }, iconBtn, iconFile,
      el("div", {}, el("p", { className: "hint", textContent: "An icon is optional. Any picture works: it's cropped square and made small." }), iconClear)),
    lab("Name", title),
    lab("One line about it", summary),
    el("div", { className: "two" },
      lab("Kind", el("span", { className: "sel" }, cat)),
      cfg ? lab("FightBot version it's for", fb) : lab("Version", version)),
    cfg && isNew ? el("div", { className: "cfg-file" }, lab("Your config.yml", file), fileNote) : null,
    cfg ? lab("Its own version", version, el("span", { className: "opt", textContent: " (optional)" })) : null,
    lab("More about it", about, el("span", { className: "opt", textContent: " (optional, Markdown works)" })),
    note,
    el("div", { className: "modal-foot" }, cancel, go));

  dialog = el("dialog", { className: "modal" }, form);
  document.body.append(dialog);
  const close = () => { dialog.close(); };
  x.addEventListener("click", close);
  cancel.addEventListener("click", close);
  dialog.addEventListener("close", () => { dialog.remove(); dialog = null; });
  dialog.addEventListener("click", e => { if (e.target === dialog) close(); });   // a click outside the box

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const t = title.value.trim();
    if (t.length < LIMITS.title[0]) { say("Give it a name, three letters or more.", true); title.focus(); return; }
    if (cfg && isNew && !yaml) { say("Pick your config.yml.", true); file.focus(); return; }
    go.disabled = true;
    say(isNew ? "Sharing it…" : "Saving…");
    try {
      await save({ title: t, summary: summary.value, about: about.value, icon, version: version.value, fb: fb.value,
        category: cat.value, yaml, blanked });
      close();
    } catch (err) {
      console.error(err);
      say(err.code === "permission-denied" ? "That wasn't allowed. Sign in again, and check everything fits." : (err.message || "That didn't save."), true);
      go.disabled = false;
    }
  });

  dialog.showModal();
  setTimeout(() => title.focus(), 30);
}

/** A small "are you sure / why" box: resolves to the text typed (or "" if none was asked), or null. */
export function ask({ title, text, field, confirm, danger, min = 0, max = 500, value = "" }) {
  return new Promise(done => {
    const box = field ? el("textarea", { className: "ed-input", rows: 4, maxLength: max, placeholder: field, value }) : null;
    const note = el("p", { className: "form-note bad", hidden: true });
    const ok = el("button", { type: "submit", className: "btn" + (danger ? " danger" : ""), textContent: confirm || "OK" });
    const no = el("button", { type: "button", className: "btn ghost", textContent: "Cancel" });
    const form = el("form", { className: "modal-in form-grid sm", noValidate: true },
      el("div", { className: "modal-head" }, el("h2", { textContent: title })),
      text ? el("p", { className: "hint", style: "font-size:16.5px", textContent: text }) : null,
      box, note, el("div", { className: "modal-foot" }, no, ok));
    const d = el("dialog", { className: "modal" }, form);
    document.body.append(d);
    let answer = null;
    no.addEventListener("click", () => d.close());
    d.addEventListener("click", e => { if (e.target === d) d.close(); });
    d.addEventListener("close", () => { d.remove(); done(answer); });
    form.addEventListener("submit", e => {
      e.preventDefault();
      const v = box ? box.value.trim() : "";
      if (box && v.length < min) { note.textContent = "Say why, so they know what to fix."; note.hidden = false; box.focus(); return; }
      answer = v;
      d.close();
    });
    d.showModal();
    setTimeout(() => (box || ok).focus(), 30);
  });
}
