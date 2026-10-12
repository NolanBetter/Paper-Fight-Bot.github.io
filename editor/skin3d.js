/* A Minecraft skin as a model you can turn around.
   ---------------------------------------------------------------------------
   No WebGL and no library: every face of every box is a div with the skin as
   its background, cropped to that face's square of the image and scaled up
   with image-rendering: pixelated. The browser's own 3D transforms do the
   rest, which keeps this page's strict Content-Security-Policy intact — the
   image is the only thing fetched, and a data: URL works just as well as one
   from textures.minecraft.net.

   The second layer (hat, jacket, sleeves, trousers) is the same boxes again,
   a little bigger, exactly as the game draws them.
   --------------------------------------------------------------------------- */

const el = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") e.className = v;
    else if (k === "text") e.textContent = v;
    else if (k === "style") e.style.cssText = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) e.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids) if (kid) e.append(kid);
  return e;
};

/* Where each face of each box lives on the skin image, in skin pixels.
   This is Minecraft's own layout: the same one you see if you open a skin
   in an image editor. */
const faces = (x, y, w, h, d) => ({
  top:    { u: x + d,         v: y,     w, h: d },
  bottom: { u: x + d + w,     v: y,     w, h: d },
  right:  { u: x,             v: y + d, w: d, h },
  front:  { u: x + d,         v: y + d, w, h },
  left:   { u: x + d + w,     v: y + d, w: d, h },
  back:   { u: x + d + w + d, v: y + d, w, h }
});

/** Every part of the body: its size, where it sits, and its two layers.
    x grows to the right of the screen, y downwards, origin at the waist. */
function parts(slim) {
  const aw = slim ? 3 : 4;          // a slim arm is one pixel narrower
  const ax = 4 + aw / 2;            // ...so it hangs a little closer in
  return [
    { id: "head", w: 8, h: 8, d: 8, x: 0, y: -16, z: 0,
      skin: faces(0, 0, 8, 8, 8), over: faces(32, 0, 8, 8, 8), grow: 0.5 },
    { id: "body", w: 8, h: 12, d: 4, x: 0, y: -6, z: 0,
      skin: faces(16, 16, 8, 12, 4), over: faces(16, 32, 8, 12, 4), grow: 0.25 },
    { id: "armR", w: aw, h: 12, d: 4, x: -ax, y: -6, z: 0,
      skin: faces(40, 16, aw, 12, 4), over: faces(40, 32, aw, 12, 4), grow: 0.25 },
    { id: "armL", w: aw, h: 12, d: 4, x: ax, y: -6, z: 0,
      skin: faces(32, 48, aw, 12, 4), over: faces(48, 48, aw, 12, 4), grow: 0.25,
      // an old 64×32 skin has no left side: it wears the right arm mirrored
      old: faces(40, 16, aw, 12, 4), mirror: true },
    { id: "legR", w: 4, h: 12, d: 4, x: -2, y: 6, z: 0,
      skin: faces(0, 16, 4, 12, 4), over: faces(0, 32, 4, 12, 4), grow: 0.25 },
    { id: "legL", w: 4, h: 12, d: 4, x: 2, y: 6, z: 0,
      skin: faces(16, 48, 4, 12, 4), over: faces(0, 48, 4, 12, 4), grow: 0.25,
      old: faces(0, 16, 4, 12, 4), mirror: true }
  ];
}

const SIDES = ["top", "bottom", "right", "front", "left", "back"];

/** One box of the model, as six divs facing six ways. */
function box(part, uv, { s, texW, texH, grow = 0, mirror = false }) {
  const w = (part.w + grow * 2) * s;
  const h = (part.h + grow * 2) * s;
  const d = (part.d + grow * 2) * s;
  // the crop has to grow with the box, or the face would show the wrong pixels
  const k = s * (part.w + grow * 2) / part.w;

  const wrap = el("div", { class: "sk-box", "aria-hidden": "true" });
  wrap.style.width = w + "px";
  wrap.style.height = h + "px";
  // x and y are measured from the box's corner (it is pinned at the model's
  // middle), but z is not: the faces are already placed either side of the
  // box's own centre plane, so moving it back by half its depth would push
  // the head behind the body.
  wrap.style.transform = "translate3d("
    + (part.x * s - w / 2) + "px," + (part.y * s - h / 2) + "px," + (part.z * s) + "px)";

  for (const side of SIDES) {
    const r = uv[side];
    const fw = side === "right" || side === "left" ? d : w;
    const fh = side === "top" || side === "bottom" ? d : h;
    const f = el("div", { class: "sk-face" });
    f.style.width = fw + "px";
    f.style.height = fh + "px";
    f.style.backgroundSize = (texW * k) + "px " + (texH * k) + "px";
    f.style.backgroundPosition = (-r.u * k) + "px " + (-r.v * k) + "px";

    // put it on the right side of the box, facing outwards
    const place = {
      front:  "translateZ(" + (d / 2) + "px)",
      back:   "rotateY(180deg) translateZ(" + (d / 2) + "px)",
      right:  "rotateY(-90deg) translateZ(" + (w / 2) + "px)",
      left:   "rotateY(90deg) translateZ(" + (w / 2) + "px)",
      top:    "rotateX(90deg) translateZ(" + (h / 2) + "px)",
      // the underside is drawn looking down, so it is upside down from below
      bottom: "rotateX(-90deg) translateZ(" + (h / 2) + "px) scaleY(-1)"
    }[side];
    // a mirrored limb (old skins) is its other arm, turned inside out
    const flip = mirror && (side === "front" || side === "back"
      || side === "top" || side === "bottom") ? " scaleX(-1)" : "";
    // Centre it with margins, not with a translate on the end of the
    // transform: a translate there happens before the rotation and swings
    // the face out sideways instead of leaving it on the box.
    f.style.marginLeft = (-fw / 2) + "px";
    f.style.marginTop = (-fh / 2) + "px";
    f.style.transform = place + flip;
    wrap.append(f);
  }
  return wrap;
}

/** Is this one of Alex's narrower arms? Only knowable by looking at the
    pixels, which needs the image to allow it — a data: URL always does, and
    Mojang's textures usually do. Null means "could not tell". */
export function detectSlim(url) {
  return new Promise(ok => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        if (img.naturalWidth !== 64 || img.naturalHeight !== 64) return ok(false);
        const c = document.createElement("canvas");
        c.width = 64; c.height = 64;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        const at = (x, y) => g.getImageData(x, y, 1, 1).data[3];
        // these two pixels are part of a wide arm and empty on a narrow one
        ok(at(47, 20) === 0 && at(55, 20) === 0);
      } catch (e) {
        ok(null);                     // the image would not let us look
      }
    };
    img.onerror = () => ok(null);
    img.src = url;
  });
}

/**
 * Build the model.
 * @param url      the skin image: https://textures.minecraft.net/texture/… or a data: URL
 * @param opts     { slim, layers, height (px of the whole figure), label }
 * @returns an element, with .setSlim(), .setLayers(), .spin() and .reset() on it
 */
export function skinModel(url, { slim = false, layers = true, height = 300, label = "skin" } = {}) {
  let texW = 64, texH = 64;         // until the real image says otherwise
  let isSlim = !!slim, showLayers = !!layers;
  const s = height / 32;            // the figure is 32 skin pixels tall

  const model = el("div", { class: "sk-model" });
  // the boxes are placed from the middle of this, so it needs a real size of
  // its own — without one they spill out over the rest of the card
  model.style.width = (16 * s) + "px";     // arm, body, arm
  model.style.height = (32 * s) + "px";    // head to heel
  const stage = el("div", { class: "sk-stage" }, model);
  const root = el("div", { class: "sk-3d", role: "img", "aria-label": label, tabindex: "0" }, stage);

  function build() {
    model.replaceChildren();
    for (const p of parts(isSlim)) {
      const old = texH === 32 && p.old;
      model.append(box(p, old || p.skin, { s, texW, texH, mirror: !!old && !!p.mirror }));
      // an old skin has only the hat as a second layer
      if (showLayers && (texH === 64 || p.id === "head")) {
        model.append(box(p, p.over, { s, texW, texH, grow: p.grow }));
      }
    }
    for (const f of model.querySelectorAll(".sk-face")) f.style.backgroundImage = "url(" + url + ")";
  }

  // ---- turning it around
  let yaw = 28, pitch = -8, spinning = false, raf = 0;
  const draw = () => {
    model.style.transform = "translateY(" + (4 * s) + "px) rotateX(" + pitch + "deg) rotateY(" + yaw + "deg)";
  };
  const tick = () => { yaw = (yaw + 0.45) % 360; draw(); raf = requestAnimationFrame(tick); };

  function spin(on) {
    spinning = on === undefined ? !spinning : !!on;
    cancelAnimationFrame(raf);
    if (spinning) raf = requestAnimationFrame(tick);
    return spinning;
  }

  let drag = null;
  root.addEventListener("pointerdown", e => {
    drag = { x: e.clientX, y: e.clientY };
    root.setPointerCapture(e.pointerId);
    root.classList.add("dragging");
    if (spinning) spin(false);
  });
  root.addEventListener("pointermove", e => {
    if (!drag) return;
    yaw += (e.clientX - drag.x) * 0.6;
    pitch = Math.max(-60, Math.min(60, pitch - (e.clientY - drag.y) * 0.4));
    drag = { x: e.clientX, y: e.clientY };
    draw();
  });
  const letGo = () => { drag = null; root.classList.remove("dragging"); };
  root.addEventListener("pointerup", letGo);
  root.addEventListener("pointercancel", letGo);

  root.addEventListener("keydown", e => {
    const step = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[e.key];
    if (step) {
      yaw += step[0];
      pitch = Math.max(-60, Math.min(60, pitch + step[1]));
      draw();
      e.preventDefault();
    } else if (e.key === "Home") {
      yaw = 28; pitch = -8; draw(); e.preventDefault();
    }
  });

  // ---- the real image decides the layout (64×64 or an old 64×32)
  const img = new Image();
  img.onload = () => {
    texW = img.naturalWidth || 64;
    texH = img.naturalHeight || 64;
    root.classList.remove("sk-waiting");
    build();
  };
  img.onerror = () => {
    root.classList.remove("sk-waiting");
    root.classList.add("sk-nope");
  };
  root.classList.add("sk-waiting");
  img.src = url;

  build();
  draw();

  root.setSlim = v => { isSlim = !!v; build(); };
  root.setLayers = v => { showLayers = !!v; build(); };
  root.spin = spin;
  root.stop = () => { cancelAnimationFrame(raf); spinning = false; };
  root.reset = () => { yaw = 28; pitch = -8; draw(); };
  root.isOld = () => texH === 32;
  return root;
}
