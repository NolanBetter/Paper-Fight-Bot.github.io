/* Reading FightBot's config.yml in the browser, for shared configs.

   FightBot's config is plain YAML: nested sections, "key: value" lines, a
   comment after most of them, and the odd list. read() turns one into
   { "combat.crit-chance": "0.30", ... } with the line each setting is on;
   compare() says which settings differ from FightBot's own defaults, which
   are new since the file was written, and which FightBot no longer has.

   scrub() blanks the settings that hold secrets (API keys, the network
   secret, a proxy's address) before a config is shared, so nobody gives
   theirs away by accident. */

/** The text after the last unquoted "#" that starts a comment, gone. */
function noComment(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === q && line[i - 1] !== "\\") q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === "#" && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}

/** A value as the plugin would read it: quotes off, lists as [a, b]. */
function scalar(raw) {
  let v = raw.trim();
  if (v.length >= 2 && v[0] === '"' && v[v.length - 1] === '"') {
    v = v.slice(1, -1).replace(/\\(["\\nt])/g, (m, c) => ({ n: "\n", t: "\t" }[c] || c));
  } else if (v.length >= 2 && v[0] === "'" && v[v.length - 1] === "'") {
    v = v.slice(1, -1).replace(/''/g, "'");
  } else if (v[0] === "[" && v[v.length - 1] === "]") {
    const inner = v.slice(1, -1).trim();
    v = "[" + (inner ? inner.split(",").map(x => scalar(x)).join(", ") : "") + "]";
  }
  return v;
}

/**
 * @returns { values: Map(path -> { value, line }), version, errors: [] }
 *   value is a string; a list comes out as "[a, b]"; a section as null.
 */
export function read(text) {
  const values = new Map();
  const errors = [];
  const stack = [];          // { indent, path }
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  let listAt = null;         // the setting whose "- items" are being read
  for (let n = 0; n < lines.length; n++) {
    const raw = lines[n];
    if (/\t/.test(raw.match(/^\s*/)[0])) { errors.push("line " + (n + 1) + " is indented with a tab"); continue; }
    const body = noComment(raw);
    if (!body.trim()) continue;
    const indent = body.match(/^ */)[0].length;
    const text2 = body.trim();
    if (text2.startsWith("- ") || text2 === "-") {
      if (!listAt) { errors.push("line " + (n + 1) + ": a list item with no setting above it"); continue; }
      const item = scalar(text2.slice(1));
      const cur = values.get(listAt);
      cur.items = cur.items || [];
      cur.items.push(item);
      cur.value = "[" + cur.items.join(", ") + "]";
      continue;
    }
    const m = text2.match(/^("[^"]*"|'[^']*'|[^:]+?)\s*:(?:\s+(.*))?$/);
    if (!m) { errors.push("line " + (n + 1) + " isn't a setting: " + text2.slice(0, 40)); continue; }
    const key = scalar(m[1]);
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const path = (stack.length ? stack[stack.length - 1].path + "." : "") + key;
    const rest = m[2] === undefined ? "" : m[2].trim();
    if (rest === "") {
      values.set(path, { value: null, line: n + 1 });
      stack.push({ indent, path });
      listAt = path;
    } else {
      values.set(path, { value: scalar(rest), line: n + 1 });
      listAt = null;
    }
  }
  // a section with nothing under it, and no list, is an empty value
  for (const [k, v] of values) {
    if (v.value === null && !v.items) {
      const kids = [...values.keys()].some(x => x.startsWith(k + "."));
      if (!kids) v.value = "";
    }
  }
  const ver = values.get("config-version");
  return { values, version: ver && ver.value ? String(ver.value) : "", errors };
}

/** Does this look like a FightBot config at all? */
export function looksLikeFightBot(r) {
  if (!r || r.values.size < 5) return false;
  const tops = ["combat", "formation", "identity", "orders", "groups", "movement", "cannon", "gear", "roaming", "config-version"];
  let hits = 0;
  for (const t of tops) if (r.values.has(t)) hits++;
  return hits >= 2;
}

const same = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  const na = Number(a), nb = Number(b);
  if (a !== "" && b !== "" && !isNaN(na) && !isNaN(nb)) return na === nb;     // 0.30 and 0.3
  return String(a).toLowerCase() === String(b).toLowerCase() && /^(true|false)$/i.test(a);
};

/**
 * Theirs against FightBot's defaults.
 * @returns { changed: [{ path, value, def }], added: [path] (FightBot has, they don't),
 *            unknown: [{ path, value }] (they have, FightBot doesn't) }
 */
export function compare(theirs, defaults) {
  const changed = [], added = [], unknown = [];
  for (const [path, d] of defaults.values) {
    if (path === "config-version") continue;
    const t = theirs.values.get(path);
    if (!t) { if (d.value !== null) added.push(path); continue; }
    if (d.value === null || t.value === null) continue;
    if (!same(t.value, d.value)) changed.push({ path, value: t.value, def: d.value, line: t.line });
  }
  for (const [path, t] of theirs.values) {
    if (path === "config-version" || t.value === null) continue;
    if (!defaults.values.has(path)) {
      // a setting under a section FightBot keeps open (names, lists of things) isn't unknown
      const parent = path.slice(0, path.lastIndexOf("."));
      const dp = defaults.values.get(parent);
      if (dp && dp.value === "") continue;
      unknown.push({ path, value: t.value, line: t.line });
    }
  }
  return { changed, added, unknown };
}

/** Settings as YAML again, nested under their sections - for the "what it changes" box. */
export function asYaml(items, note) {
  const out = [];
  let open = [];
  for (const it of items) {
    const parts = it.path.split(".");
    const keys = parts.slice(0, -1);
    let i = 0;
    while (i < open.length && i < keys.length && open[i] === keys[i]) i++;
    open = open.slice(0, i);
    for (; i < keys.length; i++) { out.push({ text: "  ".repeat(i) + keys[i] + ":", kind: "sec" }); open.push(keys[i]); }
    const v = it.value === "" ? '""' : /[:#]|^\s|\s$|^$/.test(it.value) && !/^\[.*\]$/.test(it.value) ? JSON.stringify(it.value) : it.value;
    out.push({ text: "  ".repeat(keys.length) + parts[parts.length - 1] + ": " + v, kind: "set", note: note ? note(it) : "" });
  }
  return out;
}

/** Settings that hold secrets - blanked before a config is shared. */
const SECRET = /(^|[.-])(api-key|key|secret|token|password|passwd|webhook)$/i;
const ALSO = new Set(["network.proxy", "web.relay", "ai.endpoint"]);

/**
 * The config with its secrets blanked, line by line (comments and layout kept).
 * @returns { text, blanked: [path] }
 */
export function scrub(text) {
  const r = read(text);
  const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
  const blanked = [];
  for (const [path, v] of r.values) {
    if (v.value === null || v.value === "" || /^(auto|""|'')$/i.test(v.value)) continue;
    if (!SECRET.test(path) && !ALSO.has(path)) continue;
    const i = v.line - 1;
    const line = lines[i];
    const colon = line.indexOf(":", line.search(/\S/));
    const tail = line.slice(colon + 1);
    const comment = noComment(tail) !== tail ? tail.slice(noComment(tail).length) : "";
    lines[i] = line.slice(0, colon + 1) + ' ""' + (comment ? "   " + comment.trim() : "");
    blanked.push(path);
  }
  return { text: lines.join("\n"), blanked };
}
