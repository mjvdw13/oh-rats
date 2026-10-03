// Every rat in the house, modelled and lit with the clay renderer:
//   on four legs:  the House Rat, the Ninja Rat and the very round Chonky Rat
//   on two legs:   the Slingshot Rat, the Spitball Rat and the big Pack Rat
// Nobody bleeds here: hits knock out tufts of fur, and beaten rats flop over
// with X'd-out eyes.
import { PixelCanvas, mix, darken, lighten } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT, skeleton, body } from '../lib/rig.js';
import { sheet, flash } from '../lib/sprite.js';

const OUT = (name) => `assets/sprites/monsters/${name}.png`;
const RENDER = { light: [-0.5, -0.6, 0.62], ambient: 0.36, aoStrength: 0.45 };
// Softer, less speckled fur than the default material: cleaner and brighter.
const FUR = { ...MAT.fur, grain: 0.1 };

const PINK = C('flesh', 0.6);
const TOOTH = C('beige', 0.98);
const BROWN = mix(C('wood', 0.52), C('gray', 0.55), 0.35);
const GRAY = C('gray', 0.6);
const OLD = mix(C('gray', 0.55), C('wood', 0.5), 0.3);
const BLACK = C('gray', 0.12);

/** Rotate a canvas around (px, py) (for flopping over). */
function rotateCanvas(src, a, px, py) {
  const out = new PixelCanvas(src.w, src.h);
  const ca = Math.cos(-a);
  const sa = Math.sin(-a);
  for (let y = 0; y < src.h; y++) {
    for (let x = 0; x < src.w; x++) {
      const dx = x + 0.5 - px;
      const dy = y + 0.5 - py;
      const col = src.get(Math.floor(px + dx * ca - dy * sa), Math.floor(py + dx * sa + dy * ca));
      if (col) out.set(x, y, col);
    }
  }
  return out;
}

/** Little cartoon X for knocked-out eyes, drawn straight onto a canvas. */
function xEye(c, x, y, col = C('gray', 0.06)) {
  for (const [dx, dy] of [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]]) c.set(x + dx, y + dy, col);
}

/** Dizzy stars circling a knocked-out head. */
function stars(c, x, y, r, phase = 0) {
  for (let k = 0; k < 3; k++) {
    const a = phase + (k / 3) * Math.PI * 2;
    const sx = Math.round(x + Math.cos(a) * r);
    const sy = Math.round(y + Math.sin(a) * r * 0.35);
    c.set(sx, sy, G('yellow', 1));
    c.set(sx - 1, sy, G('yellow', 0.6));
    c.set(sx + 1, sy, G('yellow', 0.6));
    c.set(sx, sy - 1, G('yellow', 0.6));
    c.set(sx, sy + 1, G('yellow', 0.6));
  }
}

// ------------------------------------------------------------------ on four legs

/**
 * A rat scampering toward the viewer in a 48x32 frame.
 * o: { fur, bob, legs: [l, r], sway, bite, pain, dead, headband }
 */
function ratFrame(o = {}) {
  const m = new Model(48, 32, { seed: 61 });
  const fur = o.fur ?? BROWN;
  const belly = lighten(fur, 0.18);
  const bob = o.bob ?? 0;
  const cx = 24;
  if (o.dead) {
    // Flat on its back, feet in the air.
    m.ellipsoid(cx, 25, 0, 12, 4.5, 5, fur, FUR);
    m.ellipsoid(cx + 11, 25, 1, 5, 3.6, 4, fur, FUR);
    m.ellipsoid(cx - 1, 23, 2, 7, 2.5, 3, belly, FUR);
    for (const x of [16, 21, 27, 32]) m.capsule(x, 22, 2, x + 1, 16 + (x % 2), 3, 0.8, 0.6, PINK, MAT.flesh);
    for (let k = 0; k < 8; k++) m.capsule(cx - 11 - k * 1.3, 26 - Math.sin(k * 0.7) * 1.5, 0, cx - 12.3 - k * 1.3, 26 - Math.sin((k + 1) * 0.7) * 1.5, 0, 0.7, 0.6, PINK, MAT.flesh);
    const c = m.render(RENDER);
    xEye(c, cx + 12, 24);
    if (o.stars) stars(c, cx + 11, 18, 6, o.stars);
    return c;
  }
  // Tail.
  const sway = o.sway ?? 0;
  for (let k = 0; k < 12; k++) {
    const p = (t) => [cx + 8 + t * 15, 16 - Math.sin(t * Math.PI + sway) * 6 - t * 3 + bob, -3 - t * 2];
    m.capsule(...p(k / 12), ...p((k + 1) / 12), 1 - (k / 12) * 0.5, 1 - ((k + 1) / 12) * 0.5, PINK, MAT.flesh);
  }
  m.ellipsoid(cx + 3, 15 + bob, -2, 10.5, 7.5, 7, fur, FUR);
  // Legs.
  for (const [lx, lift] of [[cx - 7, o.legs?.[0] ?? 0], [cx + 9, o.legs?.[1] ?? 0]]) {
    m.capsule(lx, 19 + bob, 1, lx, 27 - lift, 3, 1.5, 1.1, darken(fur, 0.2), FUR);
    m.ellipsoid(lx, 28 - lift, 4, 1.8, 0.9, 1.8, PINK, MAT.flesh);
  }
  // Head toward the viewer.
  m.ellipsoid(cx - 2, 19 + bob, 4, 7.5, 6.2, 6, fur, FUR);
  m.ellipsoid(cx - 2, 23 + bob, 8, 4, 3.2, 4, belly, FUR);
  for (const side of [-1, 1]) {
    m.ellipsoid(cx - 2 + side * 5.8, 12.5 + bob, 3, 2.8, 3, 1.2, fur, FUR);
    m.paint(cx - 2 + side * 5.8, 12.5 + bob, 1.8, 2, PINK, MAT.flesh);
    m.dent(cx - 2 + side * 5.8, 12.5 + bob, 1.6, 1.8, 1);
  }
  if (o.headband) {
    m.stroke(cx - 9, 15.5 + bob, cx + 5, 15.5 + bob, 2, C('blood', 0.62), MAT.cloth);
    m.capsule(cx + 5, 15 + bob, 2, cx + 11, 13 + bob + Math.sin(sway) * 2, 1, 0.9, 0.7, C('blood', 0.62), MAT.cloth);
    m.capsule(cx + 5, 16 + bob, 2, cx + 10, 18 + bob + Math.cos(sway) * 2, 1, 0.9, 0.7, C('blood', 0.55), MAT.cloth);
  }
  // Beady eyes: red for regular rats, sharp white for ninjas.
  for (const side of [-1, 1]) {
    m.paint(cx - 2 + side * 3, 18.6 + bob, 1.1, 1, C('gray', 0.04));
    m.paint(cx - 2 + side * 3 - 0.4, 18.2 + bob, 0.5, 0.5, o.headband ? G('pale', 1) : G('red', 1), MAT.glow);
  }
  m.sphere(cx - 2, 22 + bob, 11.5, 1.2, C('flesh', 0.5), MAT.flesh);
  if (o.bite) {
    m.dent(cx - 2, 26 + bob, 3, 2.2, 1.5);
    m.paint(cx - 2, 26 + bob, 2.6, 2, C('blood', 0.25));
    m.paint(cx - 3, 24.6 + bob, 0.5, 1, TOOTH);
    m.paint(cx - 1, 24.6 + bob, 0.5, 1, TOOTH);
  } else {
    m.paint(cx - 2.5, 25.4 + bob, 1, 1, TOOTH);
  }
  const c = m.render(RENDER);
  if (o.pain) for (const [x, y] of [[cx + 6, 9 + bob], [cx - 10, 11 + bob]]) c.set(x, y, lighten(fur, 0.4));
  for (const side of [-1, 1]) {
    c.line(cx - 2 + side * 3, 23.5 + bob, cx - 2 + side * 11, 21.5 + bob, C('gray', 0.75));
    c.line(cx - 2 + side * 3, 24.5 + bob, cx - 2 + side * 11, 25.5 + bob, C('gray', 0.65));
  }
  return c;
}

function quadSheet(o = {}) {
  return sheet([
    ratFrame({ ...o, bob: 0, legs: [2, 0], sway: 0 }),
    ratFrame({ ...o, bob: -1, legs: [0, 0], sway: 0.6 }),
    ratFrame({ ...o, bob: 0, legs: [0, 2], sway: 1.2 }),
    ratFrame({ ...o, bob: -2, bite: true, legs: [1, 1] }),
    ratFrame({ ...o, bob: 1, bite: true }),
    ratFrame({ ...o, bob: 0, pain: true, sway: 2 }),
    rotateCanvas(ratFrame({ ...o, pain: true }), 0.8, 24, 28),
    rotateCanvas(ratFrame({ ...o, pain: true }), 1.9, 24, 24),
    ratFrame({ ...o, dead: true, stars: 0.5 }),
    ratFrame({ ...o, dead: true }),
  ]);
}

// ------------------------------------------------------------------ chonky rat

/** A huge round rat in a 64x64 frame. o: { bob, squash, mouth 0..1, legs, pain, dead, roll } */
function chonkFrame(o = {}) {
  const m = new Model(64, 64, { seed: 67 });
  const fur = mix(C('wood', 0.5), C('orange', 0.4), 0.25);
  const belly = lighten(fur, 0.3);
  const bob = o.bob ?? 0;
  const sq = o.squash ?? 0;
  const cx = 32;
  const cy = 38 + bob;
  if (o.dead) {
    // Belly up, tiny feet in the air.
    m.ellipsoid(cx, 52, 0, 22, 10, 12, fur, FUR);
    m.ellipsoid(cx, 48, 4, 15, 7, 9, belly, FUR);
    for (const x of [-12, -5, 5, 12]) m.capsule(cx + x, 46, 4, cx + x * 1.1, 38, 5, 1.8, 1.4, PINK, MAT.flesh);
    m.ellipsoid(cx + 22, 52, 2, 7, 6, 6, fur, FUR);
    for (let k = 0; k < 10; k++) m.capsule(cx - 21 - k * 1.2, 56 - Math.sin(k * 0.6) * 2, 0, cx - 22.2 - k * 1.2, 56 - Math.sin((k + 1) * 0.6) * 2, 0, 1.2, 1.1, PINK, MAT.flesh);
    const c = m.render(RENDER);
    xEye(c, cx + 21, 50);
    xEye(c, cx + 25, 50);
    if (o.stars) stars(c, cx + 22, 41, 9, o.stars);
    return c;
  }
  // Tail behind.
  for (let k = 0; k < 12; k++) {
    const p = (t) => [cx + 12 + t * 18, cy + 6 - Math.sin(t * Math.PI) * 10, -12];
    m.capsule(...p(k / 12), ...p((k + 1) / 12), 1.8 - k * 0.08, 1.7 - k * 0.08, PINK, MAT.flesh);
  }
  // The round body (it squashes as it bounces along).
  m.ellipsoid(cx, cy, -2, 21 + sq, 17 - sq, 15, fur, FUR);
  m.ellipsoid(cx, cy + 5, 6, 13 + sq, 10 - sq, 9, belly, FUR);
  // Little feet.
  for (const [side, lift] of [[-1, o.legs?.[0] ?? 0], [1, o.legs?.[1] ?? 0]]) {
    m.ellipsoid(cx + side * 11, 55 - lift, 10, 4.5, 2.6, 4, PINK, MAT.flesh);
  }
  // Head on the front of the body.
  const hy = cy - 9;
  m.ellipsoid(cx, hy, 8, 11, 9, 9, fur, FUR);
  for (const side of [-1, 1]) {
    m.ellipsoid(cx + side * 10, hy - 9, 4, 5, 5, 2, fur, FUR);
    m.paint(cx + side * 10, hy - 9, 3.2, 3.2, PINK, MAT.flesh);
    m.dent(cx + side * 10, hy - 9, 3, 3, 1);
  }
  m.ellipsoid(cx, hy + 4, 15, 6, 4.5, 4, belly, FUR);
  m.sphere(cx, hy + 2, 19, 1.8, C('flesh', 0.5), MAT.flesh);
  for (const side of [-1, 1]) {
    const ex = cx + side * 4.5;
    m.paint(ex, hy - 2, 1.8, 1.8, C('gray', 0.04));
    m.paint(ex - 0.6, hy - 2.6, 0.7, 0.7, o.pain ? C('gray', 0.04) : G('pale', 1), MAT.glow);
    if (o.pain) m.stroke(ex - 2, hy - 2, ex + 2, hy - 2, 1, C('gray', 0.04));
  }
  // Mouth with big buck teeth (wide open when it bites).
  const mouth = o.mouth ?? 0;
  if (mouth > 0) {
    m.dent(cx, hy + 9, 5, 2 + mouth * 3, 1.6);
    m.paint(cx, hy + 9, 4.5, 1.5 + mouth * 3, C('blood', 0.3));
    m.paint(cx, hy + 10 + mouth * 2, 3, 1, C('flesh', 0.55));
  }
  m.slab([[cx - 2.2, hy + 6], [cx - 0.2, hy + 6], [cx - 0.2, hy + 10], [cx - 2.2, hy + 10]], 17, TOOTH, MAT.bone, { bevel: 0.6, thickness: 0.4 });
  m.slab([[cx + 0.2, hy + 6], [cx + 2.2, hy + 6], [cx + 2.2, hy + 10], [cx + 0.2, hy + 10]], 17, TOOTH, MAT.bone, { bevel: 0.6, thickness: 0.4 });
  const c = m.render(RENDER);
  for (const side of [-1, 1]) {
    c.line(cx + side * 4, hy + 5, cx + side * 16, hy + 2, C('gray', 0.8));
    c.line(cx + side * 4, hy + 6, cx + side * 16, hy + 7, C('gray', 0.7));
  }
  return o.roll ? rotateCanvas(c, o.roll, 32, 52) : c;
}

function chonkSheet() {
  return sheet([
    chonkFrame({ bob: 0, legs: [3, 0], squash: 1 }),
    chonkFrame({ bob: -3, legs: [0, 0], squash: -1 }),
    chonkFrame({ bob: 0, legs: [0, 3], squash: 1 }),
    chonkFrame({ bob: -2, mouth: 0.5 }),
    chonkFrame({ bob: -4, mouth: 1, squash: -2 }),
    chonkFrame({ bob: 0, pain: true, squash: 2 }),
    chonkFrame({ pain: true, mouth: 0.4, roll: 0.4 }),
    chonkFrame({ pain: true, mouth: 0.4, roll: 0.9, bob: 4 }),
    chonkFrame({ dead: true, stars: 0.4 }),
    chonkFrame({ dead: true }),
  ]);
}

// ------------------------------------------------------------------ on two legs

/** Offsets from a joint that follow the body when it topples over (skeleton `fall`). */
function along(pose) {
  const a = -(pose.fall ?? 0);
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (p, dx, dy, dz = 0) => [p[0] + dx * c - dy * s, p[1] + dx * s + dy * c, p[2] + dz];
}

/**
 * Model a rat standing up like a person. look: { fur, belly, height, build,
 * w, h, ko (knocked out), puff (cheeks), extras(m, J, at) }.
 */
function biped(w, h, pose, look) {
  const m = new Model(w, h, { seed: look.seed ?? 31 });
  const J = skeleton(w, h, { hunch: 1.2, ...pose }, { height: look.height ?? 40, build: look.build ?? 1.15, shoulders: 6.2, hips: 3.6 });
  const at = along(pose);
  const s = J.s;
  // Cartoon proportions: a big head sitting a little higher than a person's.
  const hs = s * (look.headScale ?? 1.45);
  const headAt = (jj) => at(jj.head, 0, -(hs - s) * 3.2);
  const fur = look.fur;
  const belly = look.belly ?? lighten(fur, 0.25);
  // Tail: down from behind, along the floor and curling up at the tip.
  if ((pose.fall ?? 0) < 1) {
    const pts = [];
    for (let k = 0; k <= 12; k++) {
      const t = k / 12;
      pts.push(at(J.pelvis, (2 + t * 17) * s, (2 + Math.sin((Math.min(t, 0.8) / 0.8) * (Math.PI / 2)) * 19 - Math.max(0, t - 0.8) * 30) * s, -3 * s));
    }
    for (let k = 0; k < pts.length - 1; k++) m.capsule(...pts[k], ...pts[k + 1], (1.4 - k * 0.07) * s, (1.33 - k * 0.07) * s, PINK, MAT.flesh);
  }
  body(m, J, {
    skin: fur,
    skinMat: FUR,
    shirt: fur,
    shirtMat: FUR,
    pants: fur,
    pantsMat: FUR,
    shoes: PINK,
    shoeMat: MAT.flesh,
    sleeve: 'long',
    hands: PINK,
    limbs: { thigh: 1.15, shin: 0.9, upper: 0.85, fore: 0.8 },
    clothes(mm, j) {
      // A round, pear-shaped rat belly.
      mm.ellipsoid(...at(j.belly, 0, 1.5 * s, 0.6), 7 * s, 7 * s, 5 * s, fur, FUR);
      mm.paint(...at(j.belly, 0, 1.5 * s).slice(0, 2), 4.8 * s, 5.6 * s, belly, FUR);
      mm.paint(...at(j.chest, 0, 1.5).slice(0, 2), 3.6 * s, 3.6 * s, belly, FUR);
      look.clothes?.(mm, j, at);
    },
    head(mm, j) {
      const hd = headAt(j);
      const s = hs;
      const xy = (dx, dy) => at(hd, dx * s, dy * s).slice(0, 2);
      // Round head, big ears, a long snout pointing at you.
      mm.ellipsoid(...at(hd, 0, 0, 0), 5 * s, 4.6 * s, 4.6 * s, fur, FUR);
      for (const side of [-1, 1]) {
        const ear = at(hd, side * 4.6 * s, -4 * s, -1);
        mm.ellipsoid(...ear, 3 * s, 3.3 * s, 1.2 * s, fur, FUR);
        mm.paint(ear[0], ear[1], 1.9 * s, 2.2 * s, PINK, MAT.flesh);
        mm.dent(ear[0], ear[1], 1.8 * s, 2.1 * s, 1);
      }
      if (look.puff) for (const side of [-1, 1]) mm.ellipsoid(...at(hd, side * 3 * s, 2 * s, 2.5 * s), 2.6 * s, 2.2 * s, 2.4 * s, belly, FUR);
      mm.ellipsoid(...at(hd, 0, 2.2 * s, 3 * s), 2.6 * s, 2.3 * s, 3.2 * s, belly, FUR);
      mm.sphere(...at(hd, 0, 1.6 * s, 6.3 * s), 1 * s, C('flesh', 0.5), MAT.flesh);
      for (const side of [-1, 1]) {
        if (look.ko) continue;
        mm.paint(...xy(side * 2, -0.8), 0.95 * s, 0.95 * s, C('gray', 0.04));
        mm.dot(...xy(side * 2 - 0.4, -1.2), look.eye ?? G('red', 1), MAT.glow);
      }
      mm.slab([xy(-0.9, 4.2), xy(0.9, 4.2), xy(0.9, 6), xy(-0.9, 6)], hd[2] + 5.5 * s, TOOTH, MAT.bone, { bevel: 0.4, thickness: 0.3 });
      look.hat?.(mm, { ...j, head: hd, s }, at);
    },
    held: (mm, j) => look.held?.(mm, { ...j, mouth: at(headAt(j), 0, 4.6 * hs, 4 * hs) }, at),
  });
  const c = m.render(RENDER);
  // Whiskers and knocked-out eyes go straight onto the pixels.
  const hd = headAt(J);
  const p = (dx, dy) => at(hd, dx * hs, dy * hs);
  if ((pose.fall ?? 0) < 1.2) {
    for (const side of [-1, 1]) {
      c.line(...p(side * 2, 2).slice(0, 2), ...p(side * 5.5, 1.2).slice(0, 2), C('gray', 0.8));
      c.line(...p(side * 2, 2.8).slice(0, 2), ...p(side * 5.5, 3.6).slice(0, 2), C('gray', 0.7));
    }
  }
  if (look.ko) for (const side of [-1, 1]) xEye(c, ...p(side * 2, -0.8).slice(0, 2).map(Math.round));
  if (look.stars) stars(c, ...p(0, -6).slice(0, 2), 7 * hs, look.stars);
  look.after?.(c, { ...J, mouth: at(hd, 0, 4.6 * hs, 4 * hs) }, at);
  return c;
}

const WALK = [
  { bob: 0, legL: { thigh: 22, knee: 26 }, legR: { thigh: -12, knee: 8 }, armL: { swing: -20, bend: 30 }, armR: { swing: 20, bend: 30 } },
  { bob: -1, legL: { thigh: 4, knee: 8 }, legR: { thigh: 4, knee: 8 }, armL: { swing: 0, bend: 30 }, armR: { swing: 0, bend: 30 } },
  { bob: 0, legL: { thigh: -12, knee: 8 }, legR: { thigh: 22, knee: 26 }, armL: { swing: 20, bend: 30 }, armR: { swing: -20, bend: 30 } },
  { bob: -1, legL: { thigh: 4, knee: 8 }, legR: { thigh: 4, knee: 8 }, armL: { swing: 0, bend: 30 }, armR: { swing: 0, bend: 30 } },
];

const PAIN = { lean: -2.5, headTilt: -1.5, headLift: 1, armL: { spread: 50, swing: 10, bend: 30 }, armR: { spread: 55, swing: -10, bend: 40 }, legL: { thigh: 8, knee: 14 }, legR: { thigh: -6, knee: 4 } };

/** Stagger, topple over sideways, then lie there seeing stars. */
function knockedOut(frame, n = 5) {
  const lying = { ...PAIN, armL: { spread: 70, swing: 0, bend: 20 }, armR: { spread: 70, swing: 0, bend: 20 }, legL: { thigh: 10, knee: 10, spread: 10 }, legR: { thigh: -6, knee: 6, spread: 10 } };
  const steps = [
    [PAIN, {}],
    [{ ...PAIN, fall: 0.6 }, {}],
    [{ ...lying, fall: 1.25 }, { ko: true }],
    [{ ...lying, fall: 1.57 }, { ko: true, stars: 0.3 }],
    [{ ...lying, fall: 1.57 }, { ko: true }],
  ];
  return steps.slice(0, n).map(([pose, extra]) => frame(pose, extra));
}

// The Slingshot Rat: brown, a red bandana, a wooden slingshot.
function slingshotFrame(pose, { aim = 0, fire = false, ...extra } = {}) {
  return biped(64, 64, pose, {
    fur: BROWN,
    seed: 33,
    ...extra,
    clothes(m, j, at) {
      const n = at(j.neck, 0, 1);
      m.ellipsoid(n[0], n[1], n[2] + 1.5, 4.2, 2, 3.4, C('blood', 0.6), MAT.cloth);
      m.paintPoly([at(j.chest, -2, -2).slice(0, 2), at(j.chest, 2, -2).slice(0, 2), at(j.chest, 0, 2.5).slice(0, 2)], C('blood', 0.6), MAT.cloth);
    },
    held(m, j) {
      const [x, y, z] = j.handL;
      // The slingshot's Y in the left hand, the band pulled back by the right.
      m.capsule(x, y + 3, z + 1, x, y - 1, z + 1, 0.8, 0.8, C('wood', 0.42), MAT.wood);
      m.capsule(x, y - 1, z + 1, x - 2.4, y - 5, z + 1, 0.7, 0.6, C('wood', 0.42), MAT.wood);
      m.capsule(x, y - 1, z + 1, x + 2.4, y - 5, z + 1, 0.7, 0.6, C('wood', 0.42), MAT.wood);
      if (aim) {
        const [rx, ry, rz] = j.handR;
        m.stroke(x - 2.4, y - 5, rx, ry, 0.5, C('blood', 0.5));
        m.stroke(x + 2.4, y - 5, rx, ry, 0.5, C('blood', 0.5));
        m.sphere(rx, ry, rz + 1, 1, C('gray', 0.5), MAT.metal);
      }
    },
    after(c, j) {
      if (fire) flash(c, j.handL[0], j.handL[1] - 4, 4, G('pale', 1), C('gray', 0.85));
    },
  });
}

function slingshotSheet() {
  const frames = WALK.map((p) => slingshotFrame({ ...p, armL: { spread: 14, swing: 18, bend: 70 } }));
  const aim = { legL: { thigh: 4, knee: 6, spread: 8 }, legR: { thigh: -4, knee: 4, spread: 8 }, armL: { reach: [32, 30, 12] }, armR: { reach: [33, 33, 8] } };
  frames.push(slingshotFrame(aim, { aim: 1 }));
  frames.push(slingshotFrame({ ...aim, armR: { reach: [34, 31, 10] }, lean: -0.6 }, { fire: true }));
  frames.push(slingshotFrame(PAIN));
  frames.push(...knockedOut((p, e) => slingshotFrame(p, e)));
  return sheet(frames);
}

// The Spitball Rat: gray, a backwards cap, a bendy straw.
function spitballFrame(pose, { straw = 0, spit = false, puff = false, ...extra } = {}) {
  return biped(64, 64, pose, {
    fur: GRAY,
    seed: 35,
    puff,
    ...extra,
    hat(m, j, at) {
      const hd = j.head;
      const s = j.s;
      m.ellipsoid(...at(hd, 0, -3 * s, -0.5), 4.6 * s, 2.4 * s, 4.4 * s, C('sky', 0.5), MAT.cloth);
      m.ellipsoid(...at(hd, 0, -3.4 * s, -4.5 * s), 3.6 * s, 1.2 * s, 2.4 * s, C('sky', 0.42), MAT.cloth);
    },
    held(m, j) {
      const [x, y, z] = j.handR;
      if (straw) {
        // Up to the mouth, pointing out at the player.
        const h = j.mouth;
        const mx = h[0] - 1.5;
        const my = h[1] - 1;
        m.capsule(x, y, z + 1, mx + 2, my + 1, h[2] + 6, 0.7, 0.7, C('beige', 0.95), MAT.plastic);
        m.paint(mx + 1.5, my + 0.8, 0.7, 0.7, C('blood', 0.6));
      } else {
        m.capsule(x, y + 4, z + 1, x + 1, y - 4, z + 1, 0.7, 0.7, C('beige', 0.95), MAT.plastic);
        m.stroke(x, y + 2, x + 1, y - 2, 0.6, C('blood', 0.6));
      }
    },
    after(c, j) {
      if (spit) flash(c, j.mouth[0] + 1, j.mouth[1], 5, G('green', 1), G('green', 0.6));
    },
  });
}

function spitballSheet() {
  const frames = WALK.map((p) => spitballFrame(p));
  const blow = { legL: { thigh: 4, knee: 6, spread: 8 }, legR: { thigh: -4, knee: 4, spread: 8 }, armR: { reach: [34, 27, 10] }, armL: { spread: 18, swing: 0, bend: 40 } };
  frames.push(spitballFrame(blow, { puff: true }));
  frames.push(spitballFrame(blow, { puff: true, straw: 1 }));
  frames.push(spitballFrame({ ...blow, lean: -0.6 }, { straw: 1, spit: true }));
  frames.push(spitballFrame(PAIN));
  frames.push(...knockedOut((p, e) => spitballFrame(p, e)));
  return sheet(frames);
}

// The Pack Rat: big and old, hauling a backpack stuffed with junk.
function packFrame(pose, { holding = null, ...extra } = {}) {
  return biped(80, 80, pose, {
    fur: OLD,
    height: 58,
    build: 1.35,
    seed: 37,
    ...extra,
    clothes(m, j, at) {
      // The backpack behind: shows above the shoulders and at the sides.
      const back = at(j.chest, 0, -1, -9);
      m.ellipsoid(...back, 11, 12, 6, C('green', 0.4), MAT.cloth);
      m.ellipsoid(...at(j.chest, 0, -11, -8), 9, 4, 5, C('green', 0.32), MAT.cloth);
      for (const side of [-1, 1]) m.stroke(...at(j.chest, side * 4, -6).slice(0, 2), ...at(j.belly, side * 4.5, 2).slice(0, 2), 1.6, C('wood', 0.3), MAT.leather);
      // Junk sticking out of the top: a spoon, a pencil, a sock, a bottle cap.
      m.capsule(...at(j.chest, -5, -12, -8), ...at(j.chest, -8, -22, -8), 0.8, 0.8, C('steel', 0.75), MAT.metal);
      m.ellipsoid(...at(j.chest, -8.6, -23, -8), 1.8, 2.4, 1, C('steel', 0.75), MAT.metal);
      m.capsule(...at(j.chest, 4, -12, -8), ...at(j.chest, 7, -21, -8), 0.9, 0.9, C('yellow', 0.72), MAT.wood);
      m.capsule(...at(j.chest, 1, -13, -7), ...at(j.chest, 2, -19, -7), 2, 1.8, C('blood', 0.62), MAT.cloth);
      m.ellipsoid(...at(j.chest, -1, -13, -6), 2.6, 1, 2.6, C('blood', 0.5), MAT.metal);
    },
    held(m, j) {
      if (!holding) return;
      const [x, y, z] = holding === 'up' ? [(j.handL[0] + j.handR[0]) / 2, Math.min(j.handL[1], j.handR[1]) - 4, j.handL[2] + 2] : j.handR;
      m.sphere(x, y, z + 3, 5.5, C('gray', 0.6), MAT.cloth);
      m.paint(x - 2, y - 2, 1.6, 1.6, C('blood', 0.6));
      m.paint(x + 2, y + 1, 1.6, 1.6, C('sky', 0.6));
      m.paint(x, y + 3, 1.6, 1.2, C('yellow', 0.8));
    },
  });
}

function packSheet() {
  const frames = WALK.map((p) => packFrame(p));
  const wide = { legL: { thigh: 4, knee: 6, spread: 10 }, legR: { thigh: -4, knee: 4, spread: 10 } };
  frames.push(packFrame({ ...wide, armL: { spread: 20, swing: 0, bend: 40 }, armR: { spread: 35, swing: -30, bend: 40 } }, { holding: 'hand' }));
  frames.push(packFrame({ ...wide, armL: { reach: [36, 14, 4] }, armR: { reach: [44, 14, 4] }, bob: -1 }, { holding: 'up' }));
  frames.push(packFrame({ ...wide, lean: 2, armL: { reach: [34, 40, 14] }, armR: { reach: [46, 40, 14] } }));
  frames.push(packFrame(PAIN));
  frames.push(...knockedOut((p, e) => packFrame(p, e)));
  return sheet(frames);
}

export default [
  { name: 'rat', out: OUT('rat'), draw: () => quadSheet(), dither: 'fs' },
  { name: 'ninja-rat', out: OUT('ninja-rat'), draw: () => quadSheet({ fur: BLACK, headband: true }), dither: 'fs' },
  { name: 'chonk', out: OUT('chonk'), draw: chonkSheet, dither: 'fs' },
  { name: 'slingshot-rat', out: OUT('slingshot-rat'), draw: slingshotSheet, dither: 'fs' },
  { name: 'spitball-rat', out: OUT('spitball-rat'), draw: spitballSheet, dither: 'fs' },
  { name: 'pack-rat', out: OUT('pack-rat'), draw: packSheet, dither: 'fs' },
];

export { ratFrame, chonkFrame, biped, WALK, PAIN, knockedOut, stars, xEye, rotateCanvas };
