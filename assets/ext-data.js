/* Extensions: the data. Skin packs and configs people share, kept in
   Firestore (see firestore.rules, "extensions"):

     projects/{id}            one skin pack or config: its details and standing
     projects/{id}/skins/{s}  a skin pack's skins, one PNG each
     projects/{id}/versions/{v}  a config's versions, newest last

   Every file is checked here before it is sent, and again by the rules:
   skins and icons must be PNGs (an icon is redrawn as one), configs must be
   FightBot YAML. Nothing else can be uploaded. */

import { db } from "./firebase.js";
import {
  collection, doc, getDoc, getDocs, query, where, limit, addDoc, updateDoc, deleteDoc,
  writeBatch, serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

export const KINDS = {
  skins: {
    one: "skin pack", label: "Skins", icon: "🧍",
    cats: [["players", "Players"], ["robots", "Robots"], ["mobs", "Mobs and monsters"], ["warriors", "Knights and warriors"],
           ["holiday", "Holidays"], ["other", "Other"]]
  },
  configs: {
    one: "config", label: "Configs", icon: "⚙",
    cats: [["pvp", "PvP"], ["scripted", "Scripted and filming"], ["events", "Events"], ["minigames", "Minigames"],
           ["training", "Practice and training"], ["other", "Other"]]
  }
};
export const catLabel = (kind, c) => ((KINDS[kind] || { cats: [] }).cats.find(x => x[0] === c) || [, "Other"])[1];

export const LIMITS = { title: [3, 60], summary: 140, about: 6000, version: 24, fb: 16, reason: 500, note: 1000,
  skinName: 32, skins: 2000, yaml: 200000, icon: 60000, png: 24000 };

const P = () => collection(db, "projects");
const ms = t => !t ? 0 : typeof t.toMillis === "function" ? t.toMillis() : typeof t.seconds === "number" ? t.seconds * 1000 : +t || 0;
const asProject = d => Object.assign({ id: d.id }, d.data(), {
  created: ms(d.data().createdAt), updated: ms(d.data().updatedAt)
});

// ── reading ─────────────────────────────────────────────────────────────

/** What everyone sees: the live ones of a kind (sorted here, so no index is needed). */
export async function listLive(kind) {
  const snap = await getDocs(query(P(), where("kind", "==", kind), where("status", "==", "live"), limit(500)));
  return snap.docs.map(asProject);
}

export async function listMine(uid) {
  const snap = await getDocs(query(P(), where("owner", "==", uid), limit(200)));
  return snap.docs.map(asProject);
}

/** For the site's owner: what's waiting, or taken down. */
export async function listByStatus(status) {
  const snap = await getDocs(query(P(), where("status", "==", status), limit(200)));
  return snap.docs.map(asProject);
}

export async function getProject(id) {
  const d = await getDoc(doc(db, "projects", id));
  return d.exists() ? asProject(d) : null;
}

export async function getSkins(id) {
  const snap = await getDocs(query(collection(db, "projects", id, "skins"), limit(LIMITS.skins)));
  return snap.docs.map(d => Object.assign({ id: d.id }, d.data(), { at: ms(d.data().at) }))
    .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true, sensitivity: "base" }));
}

export async function getVersions(id) {
  const snap = await getDocs(query(collection(db, "projects", id, "versions"), limit(100)));
  return snap.docs.map(d => Object.assign({ id: d.id }, d.data(), { at: ms(d.data().at) })).sort((a, b) => b.at - a.at);
}

// ── writing ─────────────────────────────────────────────────────────────

const clip = (s, n) => String(s || "").trim().slice(0, n);

/** A new skin pack or config, live straight away. */
export async function createProject(kind, f, ownerName) {
  const ref = await addDoc(P(), {
    kind, title: clip(f.title, LIMITS.title[1]), summary: clip(f.summary, LIMITS.summary), about: clip(f.about, LIMITS.about),
    icon: f.icon || "", version: clip(f.version, LIMITS.version), fb: clip(f.fb, LIMITS.fb), category: f.category || "other",
    owner: f.owner, ownerName: ownerName || "", status: "live", reason: "", count: 0, downloads: 0,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function saveDetails(id, f, ownerName) {
  await updateDoc(doc(db, "projects", id), {
    title: clip(f.title, LIMITS.title[1]), summary: clip(f.summary, LIMITS.summary), about: clip(f.about, LIMITS.about),
    icon: f.icon || "", version: clip(f.version, LIMITS.version), fb: clip(f.fb, LIMITS.fb), category: f.category || "other",
    ownerName: ownerName || "", updatedAt: serverTimestamp()
  });
}

/** How many skins (or versions) it has, after adding or taking some away. */
export const setCount = (id, n) => updateDoc(doc(db, "projects", id), { count: n, updatedAt: serverTimestamp() });

/** Taken down and fixed: back to the site's owner to look at. */
export const askApproval = id => updateDoc(doc(db, "projects", id), { status: "pending", updatedAt: serverTimestamp() });

/** The site's owner: take it down (with a reason), or approve it. */
export const takeDown = (id, reason) => updateDoc(doc(db, "projects", id), { status: "removed", reason: clip(reason, LIMITS.reason), updatedAt: serverTimestamp() });
export const approve = id => updateDoc(doc(db, "projects", id), { status: "live", reason: "", updatedAt: serverTimestamp() });

/** One more download (once a visit, per pack). */
export function countDownload(id) {
  const k = "dl." + id;
  try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch (e) { /* private window */ }
  updateDoc(doc(db, "projects", id), { downloads: increment(1) }).catch(() => {});
}

/** Skins in, a few at a time. onEach(done, total) as they land. Returns how many went in. */
export async function addSkins(id, skins, onEach) {
  let done = 0, bad = 0;
  const queue = skins.slice();
  const work = async () => {
    while (queue.length) {
      const s = queue.shift();
      try {
        await addDoc(collection(db, "projects", id, "skins"), { name: s.name, png: s.png, slim: !!s.slim, at: serverTimestamp() });
        done++;
      } catch (e) { bad++; if (bad === 1) console.error(e); }
      if (onEach) onEach(done, skins.length, bad);
    }
  };
  await Promise.all([work(), work(), work(), work()]);
  return { done, bad };
}

export const renameSkin = (id, sid, name, png, slim) =>
  updateDoc(doc(db, "projects", id, "skins", sid), { name: clip(name, LIMITS.skinName), png, slim: !!slim, at: serverTimestamp() });
export const deleteSkin = (id, sid) => deleteDoc(doc(db, "projects", id, "skins", sid));

export async function addVersion(id, v) {
  await addDoc(collection(db, "projects", id, "versions"), {
    fb: clip(v.fb, LIMITS.fb), label: clip(v.label, LIMITS.version), note: clip(v.note, LIMITS.note), yaml: v.yaml, at: serverTimestamp()
  });
}

/** Everything in it first (the rules check the pack as each goes), then the pack. */
export async function deleteProject(id) {
  for (const sub of ["skins", "versions"]) {
    const snap = await getDocs(query(collection(db, "projects", id, sub), limit(LIMITS.skins)));
    for (let i = 0; i < snap.docs.length; i += 400) {
      const b = writeBatch(db);
      snap.docs.slice(i, i + 400).forEach(d => b.delete(d.ref));
      await b.commit();
    }
  }
  await deleteDoc(doc(db, "projects", id));
}

// ── files: checked and redrawn before anything is sent ──────────────────

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

async function isPng(file) {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  return PNG_SIG.every((b, i) => head[i] === b);
}

function loadImage(src) {
  return new Promise((ok, no) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => no(new Error("that image wouldn't open"));
    img.src = src;
  });
}

/** A file's name as a skin name: letters, numbers, spaces, - and _. */
export function skinNameOf(file) {
  const n = String(file.name || "skin").replace(/\.png$/i, "").replace(/[^A-Za-z0-9 _-]+/g, " ").replace(/\s+/g, " ").trim();
  return (n || "skin").slice(0, LIMITS.skinName);
}

/**
 * A skin from a file: a 64x64 (or old 64x32) PNG, redrawn so only the
 * picture itself is kept. { name, png, slim } or { error }.
 */
export async function readSkin(file) {
  const name = skinNameOf(file);
  if (!/\.png$/i.test(file.name || "") || !(await isPng(file))) return { name, error: "isn't a PNG" };
  if (file.size > 200000) return { name, error: "is too big to be a skin" };
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth, h = img.naturalHeight;
    if (w !== 64 || (h !== 64 && h !== 32)) return { name, error: "is " + w + "×" + h + " (skins are 64×64)" };
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const alpha = (x, y) => g.getImageData(x, y, 1, 1).data[3];
    const slim = h === 64 && alpha(47, 20) === 0 && alpha(55, 20) === 0;
    const png = c.toDataURL("image/png");
    if (png.length > LIMITS.png) return { name, error: "is too detailed to store" };
    return { name, png, slim };
  } catch (e) {
    return { name, error: "wouldn't open" };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** An icon from any picture: cropped square and redrawn as a small PNG. */
export async function makeIcon(file) {
  if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) throw new Error("Pick a PNG, JPG, WebP or GIF picture.");
  if (file.size > 8 * 1024 * 1024) throw new Error("That picture is over 8 MB. Pick a smaller one.");
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2, sy = (img.naturalHeight - side) / 2;
    // pixel art stays crisp; a photo is smoothed
    const pixel = side <= 64;
    for (const px of [128, 96, 64]) {
      const c = document.createElement("canvas");
      c.width = px; c.height = px;
      const g = c.getContext("2d");
      g.imageSmoothingEnabled = !pixel;
      g.imageSmoothingQuality = "high";
      g.drawImage(img, sx, sy, side, side, 0, 0, px, px);
      const out = c.toDataURL("image/png");
      if (out.length <= LIMITS.icon) return out;
    }
    throw new Error("That picture is too busy to make a small icon from. Try a simpler one.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** A config file's text: a .yml or .yaml, UTF-8, not too big. */
export async function readConfigFile(file) {
  if (!/\.ya?ml$/i.test(file.name || "")) throw new Error("That isn't a .yml file. Pick your config.yml.");
  if (file.size > LIMITS.yaml) throw new Error("That file is over 200 KB, far bigger than a FightBot config.");
  const text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
  if (/[\u0000-\u0008\u000e-\u001f]/.test(text)) throw new Error("That file has things in it that aren't text.");
  return text;
}

/** A skin's face (with its hat layer) drawn small, for lists. */
export function headCanvas(png, px = 48) {
  const c = document.createElement("canvas");
  c.width = px; c.height = px;
  c.className = "sk-head";
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  loadImage(png).then(img => {
    g.drawImage(img, 8, 8, 8, 8, 0, 0, px, px);
    g.drawImage(img, 40, 8, 8, 8, 0, 0, px, px);
  }).catch(() => {});
  return c;
}

/** Wait for app.js to know who is signed in; fn runs now and on every change. */
export function onAuth(fn) {
  const go = () => fn(window.pfbAuth || { ready: false });
  addEventListener("pfb:auth", go);
  go();
}

/** Ask the bar's drop-down to sign someone in. */
export const askSignIn = (step = "menu") => dispatchEvent(new CustomEvent("pfb:signin", { detail: { step } }));
