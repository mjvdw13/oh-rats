// DAD, the boss: a giant (to a rat) in a fuzzy bathrobe, striped pyjamas and
// slippers, with glasses, a moustache and his morning coffee. He throws
// mousetraps. Beat him and he gets dizzy, topples over and falls asleep.
import { mix } from '../lib/canvas.js';
import { C } from '../lib/pal.js';
import { Model, MAT, skeleton, body } from '../lib/rig.js';
import { sheet } from '../lib/sprite.js';
import { stars, xEye } from './rats.js';
import { tinyText } from '../lib/tex.js';

const OUT = 'assets/sprites/monsters/dad.png';
const RENDER = { light: [-0.5, -0.6, 0.62], ambient: 0.38, aoStrength: 0.45 };

const SKIN = C('skin', 0.72);
const ROBE = C('sky', 0.45);
const ROBE_TRIM = C('beige', 0.92);
const PJ = C('beige', 0.9);
const PJ_STRIPE = C('blood', 0.55);
const SLIPPER = C('wood', 0.42);
const HAIR = C('wood', 0.25);
const ROBE_MAT = { ...MAT.cloth, grain: 0.12 };

/** Offsets that follow the body as it topples (skeleton `fall`). */
function along(pose) {
  const a = -(pose.fall ?? 0);
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (p, dx, dy, dz = 0) => [p[0] + dx * c - dy * s, p[1] + dx * s + dy * c, p[2] + dz];
}

/** A mousetrap: a wooden base with a metal snap bar. */
function mousetrap(m, x, y, z, k = 1) {
  m.slab([[x - 5 * k, y - 3 * k], [x + 5 * k, y - 3 * k], [x + 5 * k, y + 3 * k], [x - 5 * k, y + 3 * k]], z, C('wood', 0.62), MAT.wood, { bevel: 1, thickness: 1 });
  m.stroke(x - 4 * k, y - 2 * k, x + 4 * k, y - 2 * k, 0.8 * k, C('steel', 0.85), MAT.metal);
  m.stroke(x - 4 * k, y + 2 * k, x + 4 * k, y + 2 * k, 0.8 * k, C('steel', 0.85), MAT.metal);
  m.paint(x, y, 1.4 * k, 1 * k, C('yellow', 0.85)); // the cheese bait
}

/**
 * o: { mouth: 0..1, eyes: 'open'|'squint'|'x'|'closed', trap: 'hand'|'up'|null,
 *      mug: true, spill, dizzy, zzz }
 */
function dadFrame(pose, o = {}) {
  const m = new Model(128, 128, { seed: 81 });
  const J = skeleton(128, 128, { hunch: 0.6, ...pose }, { height: 104, build: 1.3, shoulders: 7.4, hips: 3.8 });
  const at = along(pose);
  const s = J.s;
  const xy = (p, dx, dy) => at(p, dx * s, dy * s).slice(0, 2);
  body(m, J, {
    skin: SKIN,
    shirt: ROBE,
    shirtMat: ROBE_MAT,
    pants: PJ,
    shoes: SLIPPER,
    shoeMat: { ...MAT.fur, grain: 0.15 },
    sleeve: 'long',
    hands: SKIN,
    hair: HAIR,
    headShape: { rx: 4.6, ry: 5.2, rz: 4.6 },
    limbs: { thigh: 1.1, shin: 1, upper: 1.15, fore: 1.1 },
    clothes(mm, j) {
      // A big belly under the robe, the robe's skirt down to the knees.
      mm.ellipsoid(...at(j.belly, 0, 1 * s, 1.5 * s), 7.4 * s, 6.6 * s, 5.4 * s, ROBE, ROBE_MAT);
      mm.capsule(...at(j.pelvis, 0, 0, 0), ...at(j.pelvis, 0, 9 * s, 0), 6.6 * s, 7 * s, ROBE, ROBE_MAT);
      // Plaid on the robe, stripes on the pyjamas.
      const near = (c, ref) => Math.abs(c[0] - ref[0]) + Math.abs(c[1] - ref[1]) + Math.abs(c[2] - ref[2]) < 60;
      mm.tint((x, y, c) => {
        if (near(c, ROBE) && ((x + 64) % 12 < 2 || (y + 64) % 12 < 2)) return mix(c, C('navy', 0.6), 0.45);
        if (near(c, PJ) && (x + 64) % 6 < 2) return PJ_STRIPE;
        return undefined;
      });
      // Fluffy trim down the front, and the belt.
      mm.stroke(...xy(j.neck, -2.4, 0.6), ...xy(j.belly, 0.6, 2), 2 * s, ROBE_TRIM, ROBE_MAT);
      mm.stroke(...xy(j.neck, 2.4, 0.6), ...xy(j.belly, 0.6, 2), 2 * s, ROBE_TRIM, ROBE_MAT);
      mm.stroke(...xy(j.belly, 0.6, 2), ...xy(j.pelvis, 1, 9), 1.6 * s, ROBE_TRIM, ROBE_MAT);
      mm.stroke(...xy(j.belly, -7, 3), ...xy(j.belly, 7, 3), 1.4 * s, C('navy', 0.55), ROBE_MAT);
      mm.stroke(...xy(j.belly, 3, 3), ...xy(j.belly, 4.5, 8), 1 * s, C('navy', 0.55), ROBE_MAT);
    },
    face(mm, j) {
      const h = j.head;
      const f = (dx, dy) => xy(h, dx, dy);
      // Bald on top: paint the crown skin-coloured over the hair.
      mm.paint(...f(0, -3.6), 3.2 * s, 1.8 * s, SKIN, MAT.skin);
      // Eyes behind big glasses.
      for (const side of [-1, 1]) {
        const [ex, ey] = f(side * 1.8, -0.4);
        if (o.eyes === 'x') continue;
        if (o.eyes === 'closed' || o.eyes === 'squint') mm.stroke(ex - 1.2 * s, ey, ex + 1.2 * s, ey + (o.eyes === 'squint' ? side * 0.6 : 0), 0.7 * s, C('gray', 0.1));
        else {
          mm.paint(ex, ey, 1.1 * s, 0.9 * s, C('beige', 0.98));
          mm.paint(ex, ey + 0.2, 0.55 * s, 0.6 * s, C('gray', 0.08));
        }
        // Angry eyebrows.
        mm.stroke(ex - side * 1.4 * s, ey - 1.9 * s, ex + side * 1.2 * s, ey - 1.3 * s, 0.7 * s, HAIR);
      }
      // Moustache and mouth.
      mm.ellipsoid(...at(h, 0, 2.2 * s, 4.2 * s), 2.4 * s, 0.9 * s, 0.8 * s, HAIR, MAT.hair);
      const mouth = o.mouth ?? 0;
      if (mouth > 0) {
        mm.dent(...f(0, 3.6), 1.4 * s, (0.4 + mouth * 0.9) * s, 1.5);
        mm.paint(...f(0, 3.6), 1.3 * s, (0.35 + mouth * 0.85) * s, C('blood', 0.3));
      } else {
        mm.stroke(...f(-1.2, 3.5), ...f(1.2, 3.5), 0.5 * s, C('blood', 0.35));
      }
    },
    held(mm, j) {
      // Coffee mug in the left hand.
      if (o.mug !== false) {
        const [x, y, z] = j.handL;
        mm.capsule(x, y - 3, z + 3, x, y + 3, z + 3, 3.2, 3.2, C('beige', 0.95), MAT.plastic);
        mm.paint(x, y - 0.5, 2, 1.2, C('blood', 0.6)); // a heart on the mug
        mm.capsule(x - 4, y - 1, z + 2, x - 4, y + 2, z + 2, 1, 1, C('beige', 0.95), MAT.plastic);
        if (o.spill) mm.capsule(x + 2, y - 3, z + 4, x + 6, y - 9, z + 4, 1.4, 0.8, C('wood', 0.3), MAT.glass);
      }
      if (o.trap) {
        const [x, y, z] = j.handR;
        mousetrap(mm, x, y - (o.trap === 'up' ? 4 : 0), z + 4, 1);
      }
    },
  });
  // Glasses frames, drawn as rims over the eyes.
  const c = m.render(RENDER);
  const h = J.head;
  for (const side of [-1, 1]) {
    const [ex, ey] = xy(h, side * 1.8, -0.4);
    if (o.eyes === 'x') xEye(c, Math.round(ex), Math.round(ey), C('gray', 0.1));
    c.ring(ex, ey, 1.8 * s, 1, C('gray', 0.15));
  }
  const [bx, by] = xy(h, 0, -0.6);
  c.line(bx - 1, by, bx + 1, by, C('gray', 0.15));
  if (o.dizzy) stars(c, ...xy(h, 0, -7), 9 * s, o.dizzy);
  if (o.zzz) {
    // Snoring: Z's float up from his head (in screen space, whichever way he lies).
    const [zx, zy] = [Math.round(h[0]) + 4, Math.round(h[1]) - 18];
    tinyText(c, 'Z', zx, zy, C('beige', 0.98), { scale: 2 });
    if (o.zzz > 1) tinyText(c, 'Z', zx + 10, zy - 18, C('beige', 0.98), { scale: 3 });
  }
  return c;
}

const STOMP = [
  { bob: 0, lean: -1.5, legL: { thigh: 20, knee: 22 }, legR: { thigh: -10, knee: 6 }, armL: { reach: [42, 66, 14] }, armR: { swing: 18, bend: 30 } },
  { bob: -2, legL: { thigh: 4, knee: 8 }, legR: { thigh: 4, knee: 8 }, armL: { reach: [42, 64, 14] }, armR: { swing: 0, bend: 30 } },
  { bob: 0, lean: 1.5, legL: { thigh: -10, knee: 6 }, legR: { thigh: 20, knee: 22 }, armL: { reach: [42, 66, 14] }, armR: { swing: -18, bend: 30 } },
  { bob: -2, legL: { thigh: 4, knee: 8 }, legR: { thigh: 4, knee: 8 }, armL: { reach: [42, 64, 14] }, armR: { swing: 0, bend: 30 } },
];

function dadSheet() {
  const wide = { legL: { thigh: 4, knee: 6, spread: 8 }, legR: { thigh: -4, knee: 4, spread: 8 }, armL: { reach: [42, 66, 14] } };
  const frames = STOMP.map((p) => dadFrame(p));
  frames.push(dadFrame({ ...wide, lean: -2, armR: { reach: [96, 22, 2] } }, { trap: 'up', mouth: 0.6 }));
  frames.push(dadFrame({ ...wide, lean: 2, armR: { reach: [76, 60, 26] } }, { trap: 'hand', mouth: 1 }));
  frames.push(dadFrame({ ...wide, armR: { spread: 20, swing: 10, bend: 40 } }, { mouth: 0.3 }));
  // Winding up a slipper stomp.
  frames.push(dadFrame({ ...wide, bob: -4, legR: { thigh: 50, knee: 70 }, armR: { spread: 40, swing: 0, bend: 30 } }, { mouth: 0.8 }));
  frames.push(dadFrame({ lean: -4, headTilt: -2, headLift: 2, armL: { reach: [36, 40, 14] }, armR: { spread: 60, swing: -10, bend: 40 }, legL: { thigh: 8, knee: 14 }, legR: { thigh: -6, knee: 4 } }, { eyes: 'squint', mouth: 0.9, spill: true }));
  // Beaten: dizzy, wobbling, then down for a nap.
  const wobble = { lean: 3, headTilt: 3, armL: { spread: 50, swing: 10, bend: 30 }, armR: { spread: 55, swing: -10, bend: 40 }, legL: { thigh: 8, knee: 14, spread: 10 }, legR: { thigh: -6, knee: 4, spread: 10 } };
  const lying = { ...wobble, armL: { spread: 80, swing: 0, bend: 20 }, armR: { spread: 70, swing: 0, bend: 20 } };
  frames.push(dadFrame(wobble, { eyes: 'x', mouth: 0.6, dizzy: 0.2, mug: false }));
  frames.push(dadFrame({ ...wobble, lean: -3, headTilt: -3 }, { eyes: 'x', mouth: 0.6, dizzy: 1.4, mug: false }));
  frames.push(dadFrame({ ...wobble, fall: 0.6 }, { eyes: 'x', mouth: 0.8, mug: false }));
  frames.push(dadFrame({ ...lying, fall: 1.2 }, { eyes: 'closed', mug: false }));
  frames.push(dadFrame({ ...lying, fall: 1.57 }, { eyes: 'closed', mug: false, zzz: 1 }));
  frames.push(dadFrame({ ...lying, fall: 1.57 }, { eyes: 'closed', mug: false, zzz: 2 }));
  return sheet(frames);
}

export default [{ name: 'dad', out: OUT, draw: dadSheet, dither: 'fs' }];

export { dadFrame, mousetrap };
