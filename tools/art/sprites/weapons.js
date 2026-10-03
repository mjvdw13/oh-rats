// First-person weapon sprites ("psprites"), modelled and lit like the
// monsters, held in your own zombie-rat paws: greenish fur with stitches,
// pink paws and little claws. Drawn at screen resolution and anchored
// bottom-centre. Frame layouts match src/content/weapons/*.js.
import { darken, lighten, mix } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT } from '../lib/model.js';
import { sheet, flash } from '../lib/sprite.js';

const W = (name) => `assets/sprites/weapons/${name}.png`;
const ZFUR = mix(C('toxic', 0.5), C('gray', 0.52), 0.45);
const PAW = mix(C('flesh', 0.6), C('toxic', 0.6), 0.25);
const CLAW = C('beige', 0.9);
const BONE = C('beige', 0.86);
const FUR = { ...MAT.fur, grain: 0.12 };
const RENDER = { light: [-0.55, -0.7, 0.5], ambient: 0.36, aoStrength: 0.5, bounce: 0.05 };

/** A furry zombie-rat forearm with stitches, entering from off-screen. */
function arm(m, from, to, r = 9) {
  m.capsule(...from, ...to, r, r * 0.72, ZFUR, FUR);
  // Stitches across a patched-up seam.
  const t = 0.45;
  const [sx, sy] = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]) + Math.PI / 2;
  for (let k = -2; k <= 2; k++) {
    const along = [Math.cos(ang + Math.PI / 2) * k * 3, Math.sin(ang + Math.PI / 2) * k * 3];
    m.stroke(sx + along[0] - Math.cos(ang) * 3, sy + along[1] - Math.sin(ang) * 3, sx + along[0] + Math.cos(ang) * 3, sy + along[1] + Math.sin(ang) * 3, 0.9, C('gray', 0.12));
  }
  m.stroke(sx - Math.cos(ang + Math.PI / 2) * 8, sy - Math.sin(ang + Math.PI / 2) * 8, sx + Math.cos(ang + Math.PI / 2) * 8, sy + Math.sin(ang + Math.PI / 2) * 8, 1, darken(ZFUR, 0.35));
  return to;
}

/** A gripping rat paw: pink palm, four little fingers with claws curling toward `dir`. */
function grip(m, x, y, z, r = 7, dir = 1) {
  m.ellipsoid(x, y, z, r, r * 0.85, r * 0.8, PAW, MAT.flesh);
  for (let k = 0; k < 4; k++) {
    const fy = y - r * 0.55 + k * r * 0.38;
    const tip = [x - dir * r * 0.8, fy + r * 0.12, z + r * 0.75];
    m.capsule(x - dir * r * 0.1, fy, z + r * 0.5, ...tip, r * 0.22, r * 0.18, darken(PAW, 0.05), MAT.flesh);
    m.capsule(...tip, tip[0] - dir * r * 0.25, tip[1] + r * 0.2, tip[2], r * 0.1, r * 0.04, CLAW, MAT.bone);
  }
}

// ------------------------------------------------------------------ claws

function clawPaw(m, x, y, flip, spread = 0) {
  const s = flip ? -1 : 1;
  arm(m, [x + s * 24, y + 48, 18], [x, y + 8, 6], 12);
  m.ellipsoid(x, y + 3, 8, 9, 7, 6, PAW, MAT.flesh);
  for (let f = -2; f <= 2; f++) {
    const fx = x + f * 4.3 + s * spread * f;
    const tip = y - 9 - (2 - Math.abs(f)) * 2.2;
    m.capsule(x + f * 3, y, 10, fx, tip, 12, 2.1, 1.5, PAW, MAT.flesh);
    m.capsule(fx, tip, 12, fx + f * 0.4, tip - 4, 13, 1, 0.3, CLAW, MAT.bone);
  }
}

function clawsFrame(right = [116, 50], left = [42, 56], { swipe = false, spread = 0 } = {}) {
  const m = new Model(160, 80, { seed: 101 });
  clawPaw(m, left[0], left[1], true);
  clawPaw(m, right[0], right[1], false, spread);
  const c = m.render(RENDER);
  if (swipe) {
    for (let k = 0; k < 4; k++) {
      c.line(118 - k * 2, 18 + k * 6, 52, 30 + k * 7, G('tube', 1));
      c.line(116 - k * 2, 19 + k * 6, 56, 31 + k * 7, C('gray', 0.75));
    }
  }
  return c;
}

function clawsSheet() {
  return sheet([clawsFrame(), clawsFrame([132, 38], undefined, { spread: 0.6 }), clawsFrame([80, 34], undefined, { swipe: true, spread: 0.8 }), clawsFrame([100, 46])]);
}

// ------------------------------------------------------------------ bone shotgun

/** A knobbly bone from a to b (radius r0 -> r1) with rounded joint ends. */
function boneRod(m, a, b, r0, r1, col = BONE) {
  m.capsule(...a, ...b, r0, r1, col, MAT.bone);
  for (const [p, r] of [[a, r0], [b, r1]]) {
    m.sphere(p[0] - r * 0.55, p[1], p[2], r * 0.85, col, MAT.bone);
    m.sphere(p[0] + r * 0.55, p[1], p[2], r * 0.85, col, MAT.bone);
  }
}

function boneShotgunFrame({ fire = false, pump = 0, kick = 0 } = {}) {
  const m = new Model(128, 96, { seed: 107 });
  const cx = 64;
  const top = 9 + kick;
  const lerp = (a, b, t) => a + (b - a) * t;
  // A little cartoon skull for a stock, then a big femur for a barrel and a
  // string of vertebrae for the magazine. Tied together with string.
  m.ellipsoid(cx + 2, 92 + kick, 28, 16, 10, 8, BONE, MAT.bone);
  for (const side of [-1, 1]) {
    m.dent(cx + 2 + side * 6, 90 + kick, 4, 3, 1.8);
    m.paint(cx + 2 + side * 6, 90 + kick, 3.4, 2.6, C('gray', 0.1));
  }
  for (let k = 0; k < 10; k++) {
    const t = k / 10;
    const y = lerp(88, top + 16, t);
    const x = lerp(cx + 10, cx + 4, t);
    m.ellipsoid(x, y, lerp(24, 7, t), lerp(5.4, 2.6, t), lerp(3.4, 1.6, t), 3, k % 2 ? BONE : darken(BONE, 0.08), MAT.bone);
  }
  boneRod(m, [cx - 4, 92, 30], [cx - 0.5, top + 2, 4], 7.5, 3.8);
  // The hollow end of the barrel.
  m.paint(cx - 0.5, top + 0.8, 2.6, 1.8, C('gray', 0.04));
  // String lashings.
  for (const y of [70, 40]) m.stroke(cx - 9, y + kick, cx + 14, y + kick, 1.4, C('blood', 0.55), MAT.cloth);
  // The pump: a curved rib, slid toward us when racked.
  const py = 46 + pump;
  for (let k = 0; k < 3; k++) {
    const y = py + k * 6;
    m.capsule(cx - 12, y + 4, 22, cx + 2, y, 24, 2.6, 2.6, BONE, MAT.bone);
    m.capsule(cx + 2, y, 24, cx + 16, y + 4, 22, 2.6, 2.6, BONE, MAT.bone);
  }
  // Paws: the left cups the pump, the right holds the skull grip.
  arm(m, [6, 122, 30], [cx - 18, py + 18, 34], 10);
  grip(m, cx - 15, py + 12, 36, 8, 1);
  arm(m, [126, 124, 26], [cx + 32, 94, 30], 10);
  grip(m, cx + 28, 90, 32, 8.5, -1);
  const c = m.render(RENDER);
  if (fire) flash(c, cx - 0.5, top - 3, 16, G('yellow', 1), G('yellow', 0.4));
  return c;
}

function boneShotgunSheet() {
  return sheet([boneShotgunFrame(), boneShotgunFrame({ fire: true, kick: 2 }), boneShotgunFrame({ kick: 8 }), boneShotgunFrame({ pump: 14 }), boneShotgunFrame({ pump: 26 })]);
}

// ------------------------------------------------------------------ rubber band gatling

const PENCIL = C('yellow', 0.72);

function gatlingFrame({ fire = 0 } = {}) {
  const m = new Model(128, 96, { seed: 109 });
  const cx = 64;
  const spin = fire * (Math.PI / 3);
  // A pencil-sharpener drum with a crank, six pencils spinning around its axis.
  m.ellipsoid(cx, 86, 22, 22, 13, 12, C('blood', 0.6), MAT.plastic);
  m.paint(cx, 80, 12, 3, C('steel', 0.8), MAT.metal);
  for (let k = 0; k < 6; k++) {
    const a = spin + (k / 6) * Math.PI * 2;
    const ox = Math.cos(a) * 7;
    const oz = Math.sin(a) * 5;
    const far = [cx + ox * 0.45, 14 + oz * 0.2, 6 + oz * 0.4];
    const near = [cx + ox, 74, 22 + oz];
    m.capsule(...near, ...far, 3, 1.8, oz > 0 ? PENCIL : darken(PENCIL, 0.18), MAT.wood);
    m.sphere(...far, 1.7, C('beige', 0.8), MAT.wood); // sharpened tip
  }
  m.capsule(cx, 12, 6, cx, 14, 6, 1.2, 1.2, C('gray', 0.2), MAT.metal);
  // A belt of colourful rubber bands feeding in from the side.
  const bands = [C('blood', 0.6), C('sky', 0.6), C('green', 0.6), C('yellow', 0.8), C('purple', 0.6)];
  for (let k = 0; k < 6; k++) m.ellipsoid(cx + 22 + k * 5, 88 + k * 2, 18, 3, 2, 2, bands[(k + fire) % bands.length], MAT.plastic);
  // Crank handle on the left.
  m.capsule(cx - 22, 84, 24, cx - 30, 78 + fire * 4, 26, 1.6, 1.6, C('steel', 0.7), MAT.metal);
  arm(m, [4, 124, 30], [cx - 30, 84 + fire * 4, 32], 10);
  grip(m, cx - 30, 80 + fire * 4, 34, 7.5, 1);
  arm(m, [126, 124, 26], [cx + 26, 96, 30], 10);
  grip(m, cx + 22, 92, 32, 8, -1);
  const c = m.render(RENDER);
  if (fire) {
    flash(c, cx, 10, 8, G('pale', 1), G('yellow', 0.6), fire * 3);
    c.ring(cx + (fire === 1 ? -6 : 6), 6, 3, 1, C('blood', 0.7)); // a flying band
  }
  return c;
}

function gatlingSheet() {
  return sheet([gatlingFrame(), gatlingFrame({ fire: 1 }), gatlingFrame({ fire: 2 })]);
}

// ------------------------------------------------------------------ soda bazooka

function bazookaFrame({ fire = false, kick = 0 } = {}) {
  const m = new Model(128, 96, { seed: 113 });
  const cx = 66;
  // A cardboard tube patched with duct tape, a soda can poking out the front.
  const tube = C('wood', 0.66);
  m.capsule(cx + 12, 110, 34, cx + 2, 20 + kick, 6, 15, 9, tube, { ...MAT.paper, grain: 0.1 });
  for (const t of [0.25, 0.6]) {
    const y = 110 - (110 - 20 - kick) * t;
    const x = cx + 12 - 10 * t;
    m.paint(x, y, 15 - t * 6, 3.4, C('gray', 0.7), MAT.plastic);
  }
  m.paint(cx + 6, 66, 6, 10, C('sky', 0.6)); // a sticker
  m.paint(cx + 2, 22 + kick, 8.4, 5.6, C('gray', 0.08)); // the open end
  if (!fire) {
    m.ellipsoid(cx + 2, 25 + kick, 7, 6.4, 4.2, 2, C('blood', 0.62), MAT.metal);
    m.paint(cx + 2, 24 + kick, 3, 1.4, C('steel', 0.85), MAT.metal);
  }
  // Paws: left steadies the tube, right on the trigger grip below.
  arm(m, [4, 120, 30], [cx - 18, 64, 34], 10);
  grip(m, cx - 13, 60, 36, 8, 1);
  m.slab([[cx + 16, 82], [cx + 26, 82], [cx + 28, 96], [cx + 18, 96]], 30, C('gray', 0.25), MAT.plastic, { bevel: 2 });
  arm(m, [126, 124, 26], [cx + 30, 96, 30], 10);
  grip(m, cx + 24, 88, 34, 8, -1);
  const c = m.render(RENDER);
  if (fire) {
    flash(c, cx + 2, 16 + kick, 18, G('pale', 1), C('beige', 0.95), 4);
    flash(c, cx + 2, 16 + kick, 9, G('yellow', 1), G('pale', 1), 8);
  }
  return c;
}

function bazookaSheet() {
  return sheet([bazookaFrame(), bazookaFrame({ fire: true, kick: 6 }), bazookaFrame({ kick: 12 })]);
}

// ------------------------------------------------------------------ mega microwave

function microwaveFrame({ led = 0, charge = 0, fire = false, kick = 0 } = {}) {
  const m = new Model(128, 96, { seed: 127 });
  const cx = 64;
  const y0 = 34 + kick;
  // The microwave, seen from behind and above: top, back and the control panel side.
  const body = C('beige', 0.88);
  m.slab([[cx - 34, y0], [cx + 30, y0], [cx + 38, y0 + 52], [cx - 40, y0 + 52]], 18, body, { ...MAT.plastic, spec: 0.3 }, { bevel: 4, thickness: 3, tilt: [0, -0.5] });
  m.slab([[cx - 30, y0 - 14], [cx + 26, y0 - 14], [cx + 30, y0 + 2], [cx - 34, y0 + 2]], 14, lighten(body, 0.06), MAT.plastic, { bevel: 2, thickness: 1, tilt: [0, -2] });
  // Control panel: a glowing display and keypad.
  m.slab([[cx + 8, y0 + 8], [cx + 30, y0 + 8], [cx + 33, y0 + 44], [cx + 10, y0 + 44]], 22, C('gray', 0.22), MAT.plastic, { bevel: 1.5 });
  m.paint(cx + 20, y0 + 13, 8, 3, G('green', led ? 1 : 0.6), MAT.glow);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) m.paint(cx + 14 + k * 6, y0 + 22 + r * 6, 1.8, 1.6, C('gray', 0.75), MAT.plastic);
  // Vent slots on the top.
  for (let k = 0; k < 5; k++) m.paint(cx - 22 + k * 7, y0 - 6, 2, 5, C('gray', 0.4));
  // Batteries taped to the side, and a coiled cord.
  for (let k = 0; k < 3; k++) m.capsule(cx - 38, y0 + 18 + k * 8, 24, cx - 22, y0 + 18 + k * 8, 24, 3.2, 3.2, C('orange', 0.6), MAT.metal);
  m.paint(cx - 30, y0 + 26, 9, 14, C('gray', 0.62), MAT.plastic);
  // Paws hug it from both sides.
  arm(m, [2, 120, 30], [cx - 40, y0 + 40, 30], 10);
  grip(m, cx - 40, y0 + 36, 32, 8, 1);
  arm(m, [126, 124, 26], [cx + 40, y0 + 40, 30], 10);
  grip(m, cx + 40, y0 + 36, 32, 8, -1);
  const c = m.render(RENDER);
  if (charge) {
    // Light leaks around the door at the far end.
    for (let x = cx - 30; x <= cx + 26; x++) c.set(x, y0 - 15, charge > 1 ? G('purple', 1) : G('purple', 0));
    flash(c, cx, y0 - 18, 6 + charge * 4, G('pale', 1), G('purple', 1), 3);
  }
  if (fire) flash(c, cx, y0 - 18, 24, G('pale', 1), G('purple', 1), 9);
  return c;
}

function microwaveSheet() {
  return sheet([microwaveFrame(), microwaveFrame({ led: 1 }), microwaveFrame({ led: 1, charge: 2 }), microwaveFrame({ fire: true, kick: 4 }), microwaveFrame({ kick: 10 })]);
}

export default [
  { name: 'claws', out: W('claws'), draw: clawsSheet, dither: 'fs' },
  { name: 'bone-shotgun', out: W('bone-shotgun'), draw: boneShotgunSheet, dither: 'fs' },
  { name: 'band-gatling', out: W('band-gatling'), draw: gatlingSheet, dither: 'fs' },
  { name: 'soda-bazooka', out: W('soda-bazooka'), draw: bazookaSheet, dither: 'fs' },
  { name: 'mega-microwave', out: W('mega-microwave'), draw: microwaveSheet, dither: 'fs' },
];

export { arm, grip, boneRod, ZFUR, PAW, BONE };
