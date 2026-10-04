// THE LUMBERJACK, the warehouse boss: a huge guy in a red plaid flannel shirt,
// jeans, work boots and a green beanie, with a bushy beard and a big orange
// chainsaw. He throws logs, and up close he swings the saw. Beat him and he
// gets dizzy, drops the chainsaw, sits down hard and falls asleep. Then the
// chainsaw is yours (it's a separate pickup: these frames don't have it).
import { mix } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT, skeleton, body } from '../lib/rig.js';
import { sheet } from '../lib/sprite.js';
import { stars, xEye } from './rats.js';
import { tinyText } from '../lib/tex.js';

const OUT = 'assets/sprites/monsters/lumberjack.png';
const RENDER = { light: [-0.5, -0.6, 0.62], ambient: 0.38, aoStrength: 0.45 };

const SKIN = C('skin', 0.66);
const FLANNEL = C('blood', 0.52);
const JEANS = C('navy', 0.72);
const BOOTS = C('wood', 0.3);
const BEARD = C('orange', 0.38);
const BEANIE = C('green', 0.42);
const SAW = C('orange', 0.62);
const BAR = C('steel', 0.78);
const SHIRT_MAT = { ...MAT.cloth, grain: 0.1 };

/** Offsets that follow the body as it topples (skeleton `fall`). */
function along(pose) {
  const a = -(pose.fall ?? 0);
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (p, dx, dy, dz = 0) => [p[0] + dx * c - dy * s, p[1] + dx * s + dy * c, p[2] + dz];
}

/**
 * A chainsaw: an orange motor with a black top handle, and a steel guide bar
 * from (x, y, z) running `len` pixels toward `angle` (screen radians). `k`
 * scales it; `phase` shifts the chain teeth so it looks like it's running.
 */
function chainsaw(m, x, y, z, angle, { len = 34, k = 1, phase = 0 } = {}) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  // The guide bar, with chain teeth along both edges.
  const tip = [x + dx * len * k, y + dy * len * k, z];
  m.capsule(x, y, z, ...tip, 3.4 * k, 2.8 * k, BAR, MAT.metal);
  for (let t = 0.12 + (phase % 2) * 0.05; t < 1; t += 0.1) {
    for (const side of [-1, 1]) {
      const px = x + dx * len * k * t + nx * side * 3 * k;
      const py = y + dy * len * k * t + ny * side * 3 * k;
      m.paint(px, py, 0.9 * k, 0.9 * k, C('gray', 0.15), MAT.metal);
    }
  }
  // The motor housing behind the bar, the top handle and the pull cord.
  const bx = x - dx * 9 * k;
  const by = y - dy * 9 * k;
  m.capsule(bx - dx * 7 * k, by - dy * 7 * k, z + 2, bx + dx * 3 * k, by + dy * 3 * k, z + 2, 7 * k, 6.4 * k, SAW, MAT.plastic);
  m.capsule(bx - dx * 4 * k - nx * 4 * k, by - dy * 4 * k - ny * 4 * k, z + 5, bx + dx * 2 * k - nx * 4 * k, by + dy * 2 * k - ny * 4 * k, z + 5, 2.6 * k, 2.6 * k, C('gray', 0.25), MAT.plastic); // the engine cover
  m.capsule(bx - dx * 6 * k + nx * 7 * k, by - dy * 6 * k + ny * 7 * k, z + 4, bx + dx * 5 * k + nx * 9 * k, by + dy * 5 * k + ny * 9 * k, z + 4, 1.6 * k, 1.6 * k, C('gray', 0.18), MAT.plastic);
  m.capsule(bx - dx * 10 * k, by - dy * 10 * k, z + 3, bx - dx * 14 * k, by - dy * 14 * k, z + 3, 2 * k, 2 * k, C('gray', 0.18), MAT.plastic); // rear handle
  m.paint(bx, by, 3 * k, 2 * k, C('gray', 0.2)); // the air vents
  m.paint(bx + dx * 2 * k, by + dy * 2 * k, 1.4 * k, 1.4 * k, C('beige', 0.95)); // a little logo
}

/** A round log with bark and pale cut ends. */
function log(m, x0, y0, x1, y1, z, r) {
  m.capsule(x0, y0, z, x1, y1, z, r, r, C('wood', 0.38), { ...MAT.wood, grain: 0.3 });
  for (const [x, y] of [[x0, y0], [x1, y1]]) {
    m.ellipsoid(x, y, z + 0.5, r * 0.75, r * 0.75, r * 0.6, C('wood', 0.72), MAT.wood);
    m.paint(x, y, r * 0.3, r * 0.3, C('wood', 0.5));
  }
}

/**
 * o: { mouth: 0..1, eyes: 'open'|'squint'|'x'|'closed', saw: 'ready'|'raised'|'swing'|null,
 *      phase, logUp, logThrow, dizzy, zzz, dust }
 */
function lumberjackFrame(pose, o = {}) {
  const m = new Model(128, 128, { seed: 91 });
  const J = skeleton(128, 128, { hunch: 0.4, ...pose }, { height: 106, build: 1.4, shoulders: 8, hips: 4 });
  const at = along(pose);
  const s = J.s;
  const xy = (p, dx, dy) => at(p, dx * s, dy * s).slice(0, 2);
  body(m, J, {
    skin: SKIN,
    shirt: FLANNEL,
    shirtMat: SHIRT_MAT,
    pants: JEANS,
    shoes: BOOTS,
    sleeve: 'long',
    hands: SKIN,
    headShape: { rx: 4.6, ry: 5, rz: 4.6 },
    limbs: { thigh: 1.15, shin: 1.1, upper: 1.25, fore: 1.15 },
    clothes(mm, j) {
      // A barrel chest, then the plaid: dark bands over the red.
      mm.ellipsoid(...at(j.chest, 0, 1 * s, 1 * s), 7.4 * s, 6.4 * s, 5.2 * s, FLANNEL, SHIRT_MAT);
      const near = (c, ref) => Math.abs(c[0] - ref[0]) + Math.abs(c[1] - ref[1]) + Math.abs(c[2] - ref[2]) < 70;
      mm.tint((x, y, c) => {
        if (!near(c, FLANNEL)) return undefined;
        const band = (x + 64) % 10 < 3;
        const row = (y + 64) % 10 < 3;
        if (band && row) return mix(c, C('gray', 0.08), 0.7);
        if (band || row) return mix(c, C('gray', 0.12), 0.4);
        return undefined;
      });
      // Yellow suspenders and a belt.
      for (const side of [-1, 1]) mm.stroke(...xy(j.neck, side * 3.4, 2), ...xy(j.pelvis, side * 3.4, -2), 1.3 * s, C('yellow', 0.72), MAT.leather);
      mm.stroke(...xy(j.pelvis, -6, -2.4), ...xy(j.pelvis, 6, -2.4), 1.2 * s, C('wood', 0.25), MAT.leather);
    },
    face(mm, j) {
      const h = j.head;
      const f = (dx, dy) => xy(h, dx, dy);
      for (const side of [-1, 1]) {
        const [ex, ey] = f(side * 1.8, -0.5);
        if (o.eyes === 'x') continue;
        if (o.eyes === 'closed' || o.eyes === 'squint') mm.stroke(ex - 1.1 * s, ey, ex + 1.1 * s, ey + (o.eyes === 'squint' ? side * 0.6 : 0), 0.7 * s, C('gray', 0.1));
        else {
          mm.paint(ex, ey, 1 * s, 0.85 * s, C('beige', 0.98));
          mm.paint(ex, ey + 0.2, 0.5 * s, 0.55 * s, C('gray', 0.08));
        }
        mm.stroke(ex - side * 1.5 * s, ey - 1.7 * s, ex + side * 1.3 * s, ey - 1.1 * s, 0.9 * s, BEARD); // bushy eyebrows
      }
      // A big bushy beard over the jaw, with the mouth in it.
      mm.ellipsoid(...at(h, 0, 3.4 * s, 3 * s), 4.4 * s, 4.2 * s, 2.6 * s, BEARD, { ...MAT.hair, grain: 0.3 });
      mm.ellipsoid(...at(h, 0, 1.6 * s, 4.2 * s), 2.8 * s, 1 * s, 0.9 * s, BEARD, MAT.hair); // moustache
      const mouth = o.mouth ?? 0;
      if (mouth > 0) mm.paint(...f(0, 3), 1.3 * s, (0.35 + mouth * 0.9) * s, C('blood', 0.3));
      // The beanie, its folded brim and a pompom.
      mm.ellipsoid(...at(h, 0, -2.6 * s, -0.2), 4.8 * s, 3.4 * s, 4.8 * s, BEANIE, { ...MAT.cloth, grain: 0.2 });
      mm.capsule(...at(h, -4.6 * s, -1.6 * s, 1), ...at(h, 4.6 * s, -1.6 * s, 1), 1.4 * s, 1.4 * s, mix(BEANIE, C('beige', 0.9), 0.2), MAT.cloth);
      mm.sphere(...at(h, 0, -6.4 * s, 0), 1.8 * s, C('beige', 0.92), { ...MAT.cloth, grain: 0.3 });
    },
    held(mm, j) {
      if (o.saw === 'ready') {
        // Held across the body: motor at his right hip, bar pointing up and to his left.
        const [x, y, z] = j.handR;
        chainsaw(mm, x - 2, y - 6, z + 8, -2.4, { phase: o.phase, k: 1.05 });
      } else if (o.saw === 'raised') {
        const [x, y, z] = j.handR;
        chainsaw(mm, x + 4, y - 6, z + 6, -1.45, { phase: o.phase, k: 1.05 });
      } else if (o.saw === 'swing') {
        const [x, y, z] = j.handR;
        chainsaw(mm, x - 10, y + 4, z + 12, 2.9, { phase: o.phase, k: 1.1 });
      }
      if (o.logUp) {
        const [x, y, z] = j.handL;
        log(mm, x - 14, y - 4, x + 10, y - 8, z + 4, 4.5);
      }
      if (o.logThrow) {
        const [x, y, z] = j.handL;
        log(mm, x - 6, y - 2, x + 10, y + 6, z + 10, 4.5);
      }
    },
  });
  const c = m.render(RENDER);
  const h = J.head;
  if (o.eyes === 'x') for (const side of [-1, 1]) xEye(c, Math.round(xy(h, side * 1.8, -0.5)[0]), Math.round(xy(h, side * 1.8, -0.5)[1]), C('gray', 0.1));
  if (o.dust) {
    // Sawdust and sparks flying off the chain.
    const [x, y] = J.handR;
    for (let k = 0; k < 18; k++) {
      const a = k * 2.4 + o.dust;
      const d = 6 + ((k * 7) % 14);
      c.set(Math.round(x - 30 + Math.cos(a) * d), Math.round(y + 14 + Math.sin(a) * d * 0.6), k % 4 ? C('wood', 0.75) : G('yellow', 0.8));
    }
  }
  if (o.dizzy) stars(c, ...xy(h, 0, -9), 9 * s, o.dizzy);
  if (o.zzz) {
    const [zx, zy] = [Math.round(h[0]) + 4, Math.round(h[1]) - 18];
    tinyText(c, 'Z', zx, zy, C('beige', 0.98), { scale: 2 });
    if (o.zzz > 1) tinyText(c, 'Z', zx + 10, zy - 18, C('beige', 0.98), { scale: 3 });
  }
  return c;
}

// He stomps along holding the saw across his body: both hands on it.
const HOLD = { armL: { reach: [50, 64, 22], hint: [1, 0.6, -0.2] }, armR: { reach: [76, 74, 18] } };
const WALK = [
  { bob: 0, lean: -1.5, legL: { thigh: 20, knee: 22 }, legR: { thigh: -10, knee: 6 }, ...HOLD },
  { bob: -2, legL: { thigh: 4, knee: 8 }, legR: { thigh: 4, knee: 8 }, ...HOLD },
  { bob: 0, lean: 1.5, legL: { thigh: -10, knee: 6 }, legR: { thigh: 20, knee: 22 }, ...HOLD },
  { bob: -2, legL: { thigh: 4, knee: 8 }, legR: { thigh: 4, knee: 8 }, ...HOLD },
];

function lumberjackSheet() {
  const wide = { legL: { thigh: 4, knee: 6, spread: 9 }, legR: { thigh: -4, knee: 4, spread: 9 } };
  const frames = WALK.map((p, i) => lumberjackFrame(p, { saw: 'ready', phase: i }));
  // Throwing a log: up over his head with his left hand, then hurled.
  frames.push(lumberjackFrame({ ...wide, lean: 2, armL: { reach: [40, 18, 4] }, armR: { reach: [80, 76, 16] } }, { saw: 'ready', logUp: true, mouth: 0.5 }));
  frames.push(lumberjackFrame({ ...wide, lean: -2, armL: { reach: [56, 58, 30] }, armR: { reach: [80, 76, 16] } }, { saw: 'ready', logThrow: true, mouth: 1 }));
  // The chainsaw: raised high and revving, then swung down.
  frames.push(lumberjackFrame({ ...wide, lean: 1, armL: { reach: [74, 50, 22] }, armR: { reach: [88, 52, 20] } }, { saw: 'raised', phase: 1, mouth: 1 }));
  frames.push(lumberjackFrame({ ...wide, bob: -3, lean: -2, armL: { reach: [54, 66, 28] }, armR: { reach: [72, 72, 28] } }, { saw: 'swing', phase: 0, mouth: 0.7, dust: 1 }));
  frames.push(lumberjackFrame({ ...wide, lean: -4, headTilt: -2, ...HOLD }, { saw: 'ready', eyes: 'squint', mouth: 0.9 }));
  // Beaten: dizzy and wobbling with the saw dropped, then down for a nap.
  const wobble = { lean: 3, headTilt: 3, armL: { spread: 50, swing: 10, bend: 30 }, armR: { spread: 55, swing: -10, bend: 40 }, legL: { thigh: 8, knee: 14, spread: 10 }, legR: { thigh: -6, knee: 4, spread: 10 } };
  const lying = { ...wobble, armL: { spread: 80, swing: 0, bend: 20 }, armR: { spread: 70, swing: 0, bend: 20 } };
  frames.push(lumberjackFrame(wobble, { eyes: 'x', mouth: 0.6, dizzy: 0.2 }));
  frames.push(lumberjackFrame({ ...wobble, lean: -3, headTilt: -3 }, { eyes: 'x', mouth: 0.6, dizzy: 1.4 }));
  frames.push(lumberjackFrame({ ...wobble, fall: 0.6 }, { eyes: 'x', mouth: 0.8 }));
  frames.push(lumberjackFrame({ ...lying, fall: 1.2 }, { eyes: 'closed' }));
  frames.push(lumberjackFrame({ ...lying, fall: 1.57 }, { eyes: 'closed', zzz: 1 }));
  frames.push(lumberjackFrame({ ...lying, fall: 1.57 }, { eyes: 'closed', zzz: 2 }));
  return sheet(frames);
}

export default [{ name: 'lumberjack', out: OUT, draw: lumberjackSheet, dither: 'fs' }];

export { lumberjackFrame, chainsaw, log };
