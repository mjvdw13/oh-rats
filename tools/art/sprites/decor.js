// Scenery around the house: furniture, toys, laundry, a TV, and the big
// bottle of soda that goes KA-BLOOSH when you shoot it.
import { PixelCanvas, mix, lighten, darken } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT } from '../lib/model.js';
import { box, cylinder, flat, ellipse } from '../lib/props.js';
import { sheet, flash } from '../lib/sprite.js';
import { rng } from '../lib/noise.js';
import { puddle } from '../lib/rig.js';

const D = (name) => `assets/sprites/decor/${name}.png`;
const RENDER = { light: [-0.5, -0.65, 0.58], ambient: 0.36, aoStrength: 0.45 };
const shadow = (m, cx, cy, rx) => flat(m, cx, cy, rx, rx * 0.22, C('gray', 0.1), MAT.cloth, -30);
const CLOTH = { ...MAT.cloth, grain: 0.06 };

function model(w, h, seed, build) {
  const m = new Model(w, h, { seed });
  build(m);
  return m.render(RENDER);
}

// ------------------------------------------------------------------ living room and kitchen

const couch = () =>
  model(64, 40, 301, (m) => {
    shadow(m, 32, 38, 28);
    const col = C('green', 0.5);
    m.slab([[6, 6], [58, 6], [60, 24], [4, 24]], -4, col, CLOTH, { bevel: 4, thickness: 3 }); // back
    for (const x of [18, 46]) m.ellipsoid(x, 26, 6, 13, 6, 6, lighten(col, 0.08), CLOTH); // seat cushions
    for (const x of [5, 59]) m.capsule(x, 16, 8, x, 30, 8, 5, 5, darken(col, 0.05), CLOTH); // arms
    m.slab([[6, 30], [58, 30], [58, 35], [6, 35]], 6, darken(col, 0.12), CLOTH, { bevel: 2 });
    for (const x of [9, 55]) m.capsule(x, 35, 6, x, 38, 6, 1.2, 1, C('wood', 0.3), MAT.wood);
    m.ellipsoid(14, 16, 4, 5, 4, 3, C('yellow', 0.75), CLOTH); // a throw pillow
  });

const kitchenChair = () =>
  model(32, 40, 303, (m) => {
    shadow(m, 16, 38.5, 11);
    const wood = C('wood', 0.55);
    for (const x of [7, 25]) m.capsule(x, 2, -2, x, 38, 2, 1.4, 1.4, wood, MAT.wood); // back legs
    for (const y of [5, 11]) m.capsule(7, y, -1, 25, y, -1, 1.2, 1.2, wood, MAT.wood); // back slats
    m.slab([[5, 22], [27, 22], [28, 26], [4, 26]], 4, lighten(wood, 0.08), MAT.wood, { bevel: 1.2, tilt: [0, -1.4] });
    for (const x of [6, 26]) m.capsule(x, 26, 6, x, 38, 7, 1.4, 1.4, wood, MAT.wood);
    m.ellipsoid(16, 22, 6, 8, 2, 5, C('blood', 0.62), CLOTH); // a seat cushion
  });

const table = () =>
  model(56, 32, 305, (m) => {
    shadow(m, 28, 30.5, 24);
    const wood = C('wood', 0.52);
    for (const x of [6, 50]) m.capsule(x, 12, 4, x, 30, 6, 1.8, 1.6, darken(wood, 0.1), MAT.wood);
    m.slab([[2, 8], [54, 8], [56, 13], [0, 13]], 6, wood, MAT.wood, { bevel: 1.5 });
    m.slab([[3, 4], [53, 4], [54, 8], [2, 8]], 5, lighten(wood, 0.1), MAT.wood, { bevel: 1, tilt: [0, -2] });
    // A fruit bowl and a cup.
    m.ellipsoid(22, 4, 8, 6, 2.6, 4, C('beige', 0.92), MAT.plastic);
    for (const [x, col] of [[19, C('blood', 0.62)], [23, C('orange', 0.7)], [25, C('yellow', 0.8)]]) m.sphere(x, 2, 9, 2, col, MAT.plastic);
    cylinder(m, 38, 1, 6, 2, C('sky', 0.6), MAT.plastic);
  });

function houseplant() {
  const r = rng(7);
  return model(32, 48, 307, (m) => {
    shadow(m, 16, 46.5, 9);
    cylinder(m, 16, 34, 46, 6.5, C('orange', 0.55), MAT.plastic, { open: true, inside: C('wood', 0.2) });
    m.paint(16, 40, 6.6, 1, C('beige', 0.9));
    for (let k = 0; k < 18; k++) {
      const a = r.range(-1.3, 1.3) - Math.PI / 2;
      const len = r.range(12, 26);
      const tip = [16 + Math.cos(a) * len * 0.7, 34 + Math.sin(a) * len, r.range(0, 6)];
      m.capsule(16, 34, 2, tip[0], tip[1], tip[2], 0.7, 0.5, C('green', 0.45), MAT.wood);
      m.ellipsoid(tip[0], tip[1], tip[2], 2.8, 1.7, 1.6, r.chance(0.5) ? C('green', 0.55) : C('green', 0.68), CLOTH);
    }
  });
}

function floorLamp() {
  const c = model(24, 56, 309, (m) => {
    shadow(m, 12, 54.5, 7);
    m.ellipsoid(12, 53, 2, 6, 1.6, 4, C('yellow', 0.5), MAT.brass);
    m.capsule(12, 14, 2, 12, 53, 2, 0.9, 0.9, C('yellow', 0.55), MAT.brass);
    m.slab([[6, 2], [18, 2], [21, 15], [3, 15]], 4, C('beige', 0.95), CLOTH, { bevel: 1.5 });
  });
  // The shade glows.
  for (let y = 4; y < 15; y++) for (let x = 6 - (y - 4) * 0.2; x < 18 + (y - 4) * 0.2; x++) if (c.get(Math.floor(x), y)) c.set(x, y, y > 12 ? G('pale', 1) : G('lamp', 1));
  return c;
}

function ceilingLamp() {
  const c = model(48, 16, 311, (m) => {
    m.capsule(24, 0, 0, 24, 5, 0, 0.8, 0.8, C('gray', 0.5), MAT.metal);
    m.ellipsoid(24, 8, 2, 14, 5, 6, C('beige', 0.95), MAT.glass);
  });
  for (let x = 13; x < 36; x++) c.set(x, 12, G('lamp', 1));
  for (let x = 16; x < 33; x++) c.set(x, 11, G('pale', 1));
  return c;
}

function tv() {
  const shows = [
    (c) => { c.rect(9, 9, 22, 16, G('cyan', 0.6)); c.ellipse(20, 20, 5, 3, G('green', 0.8)); c.rect(14, 12, 4, 3, G('yellow', 1)); },
    (c) => { c.rect(9, 9, 22, 16, G('magenta', 0.5)); c.rect(13, 15, 14, 5, G('yellow', 0.8)); },
    (c) => { c.rect(9, 9, 22, 16, G('cyan', 0.3)); for (let k = 0; k < 4; k++) c.rect(10 + k * 5, 12, 3, 10, [G('red', 1), G('yellow', 1), G('green', 1), G('cyan', 1)][k]); },
  ];
  return sheet(shows.map((show) => {
    const c = model(40, 40, 313, (m) => {
      shadow(m, 20, 38.5, 16);
      box(m, 5, 6, 30, 22, 4, C('gray', 0.25), MAT.plastic, { topCol: C('gray', 0.32) });
      box(m, 8, 30, 24, 8, 2, C('wood', 0.45), MAT.wood);
      m.capsule(14, 2, -2, 10, -4, -2, 0.5, 0.5, C('steel', 0.7), MAT.metal); // rabbit ears
      m.capsule(26, 2, -2, 31, -4, -2, 0.5, 0.5, C('steel', 0.7), MAT.metal);
    });
    show(c);
    return c;
  }));
}

const trashCan = () =>
  model(24, 32, 315, (m) => {
    shadow(m, 12, 30.5, 9);
    cylinder(m, 12, 9, 30, 8, C('steel', 0.7), MAT.metal, { topCol: C('steel', 0.82) });
    m.paint(12, 16, 8.2, 0.8, C('steel', 0.5));
    m.ellipsoid(12, 7, 4, 9, 3, 5, C('steel', 0.78), MAT.metal); // lid
    m.capsule(9, 4, 5, 15, 4, 5, 0.8, 0.8, C('steel', 0.6), MAT.metal);
    m.ellipsoid(8, 5, 2, 3, 2, 2, C('yellow', 0.78), MAT.plastic); // a banana peel poking out
  });

// ------------------------------------------------------------------ playroom and bedrooms

const teddyBear = () =>
  model(32, 32, 317, (m) => {
    shadow(m, 16, 30.5, 11);
    const fur = C('wood', 0.6);
    const fluff = { ...MAT.fur, grain: 0.12 };
    m.ellipsoid(16, 22, 0, 9, 8, 7, fur, fluff); // sitting body
    for (const x of [9, 23]) m.ellipsoid(x, 27, 4, 3.4, 3, 4, fur, fluff); // feet
    for (const x of [7, 25]) m.ellipsoid(x, 19, 3, 3, 4.5, 3, fur, fluff); // arms
    m.ellipsoid(16, 21, 5, 5, 5, 3, lighten(fur, 0.2), fluff);
    m.sphere(16, 10, 2, 7, fur, fluff); // head
    for (const x of [10, 22]) m.sphere(x, 4.5, 0, 2.6, fur, fluff);
    m.ellipsoid(16, 12.5, 7, 3, 2.2, 2, lighten(fur, 0.25), fluff);
    m.paint(16, 11.5, 1, 0.7, C('gray', 0.1));
    m.paint(13.4, 9, 0.8, 0.8, C('gray', 0.08));
    m.paint(18.6, 9, 0.8, 0.8, C('gray', 0.08));
    m.stroke(12, 16.5, 20, 16.5, 1.4, C('blood', 0.6)); // bow tie
  });

function toyBlocks() {
  const c = model(32, 24, 319, (m) => {
    shadow(m, 16, 22.5, 14);
    box(m, 3, 13, 9, 9, 3, C('blood', 0.62), MAT.wood);
    box(m, 13, 13, 9, 9, 3, C('sky', 0.6), MAT.wood);
    box(m, 23, 14, 7, 8, 3, C('green', 0.6), MAT.wood);
    box(m, 8, 3, 9, 9, 3, C('yellow', 0.78), MAT.wood);
  });
  for (const [x, y, ch] of [[6, 16, 'A'], [16, 16, 'B'], [25, 17, 'C'], [11, 6, 'D']]) {
    // Fat letters on the blocks.
    const glyph = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110' }[ch];
    for (let k = 0; k < 15; k++) if (glyph[k] === '1') c.set(x + (k % 3), y + Math.floor(k / 3), C('beige', 0.98));
  }
  return c;
}

const toyCar = () =>
  model(40, 24, 321, (m) => {
    shadow(m, 20, 22.5, 16);
    m.slab([[4, 12], [36, 12], [37, 19], [3, 19]], 6, C('blood', 0.62), MAT.plastic, { bevel: 2 });
    m.slab([[11, 5], [28, 5], [31, 12], [8, 12]], 4, C('blood', 0.66), MAT.plastic, { bevel: 1.5 });
    m.paint(15, 8.5, 3.5, 2.2, C('sky', 0.8), MAT.glass);
    m.paint(24, 8.5, 3.5, 2.2, C('sky', 0.8), MAT.glass);
    for (const x of [10, 30]) {
      m.sphere(x, 19, 8, 3.6, C('gray', 0.15), MAT.plastic);
      m.sphere(x, 19, 10, 1.4, C('steel', 0.8), MAT.metal);
    }
    m.paint(36, 14, 1, 1, C('yellow', 0.9));
  });

function sockPile() {
  const r = rng(13);
  return model(40, 16, 323, (m) => {
    const cols = [C('beige', 0.95), C('sky', 0.6), C('blood', 0.6), C('green', 0.6), C('yellow', 0.8)];
    for (let k = 0; k < 7; k++) {
      const x = r.range(6, 34);
      const y = r.range(9, 13);
      const a = r.range(-0.6, 0.6);
      m.capsule(x, y, k, x + Math.cos(a) * 7, y + Math.sin(a) * 2, k, 2.2, 2, cols[k % cols.length], CLOTH);
    }
  });
}

// ------------------------------------------------------------------ basement and laundry

const cardboardBox = () =>
  model(40, 40, 325, (m) => {
    shadow(m, 20, 38.5, 17);
    box(m, 4, 14, 32, 24, 8, C('wood', 0.62), MAT.paper, { topCol: C('wood', 0.7) });
    m.paint(20, 9, 15, 1.2, C('wood', 0.5)); // the flap seam
    m.paint(20, 9, 3, 5, C('gray', 0.72)); // tape
    m.paint(13, 26, 4, 3, C('beige', 0.9)); // a label
    m.paint(28, 30, 2.5, 2.5, C('wood', 0.45)); // arrow-ish stamp
  });

function laundryBasket() {
  const r = rng(17);
  return model(40, 32, 327, (m) => {
    shadow(m, 20, 30.5, 17);
    m.slab([[3, 12], [37, 12], [34, 30], [6, 30]], 4, C('sky', 0.62), MAT.plastic, { bevel: 2, thickness: 2 });
    for (let y = 15; y < 29; y += 4) for (let x = 7; x < 34; x += 4) m.dent(x, y, 1, 1.2, 1.5);
    const cols = [C('blood', 0.6), C('beige', 0.95), C('yellow', 0.78), C('green', 0.6)];
    for (let k = 0; k < 6; k++) m.ellipsoid(r.range(8, 32), r.range(7, 12), 6 + k, r.range(4, 7), 3, 3, cols[k % cols.length], CLOTH);
  });
}

function washingMachine() {
  return sheet([0, 1].map((f) => {
    const c = model(48, 56, 329, (m) => {
      shadow(m, 24, 54.5, 20);
      box(m, 4, 12, 40, 42, 6, C('beige', 0.94), MAT.plastic, { topCol: C('beige', 0.98) });
      m.slab([[6, 12], [42, 12], [42, 18], [6, 18]], 10, C('gray', 0.75), MAT.plastic, { bevel: 1 });
      m.slab(ellipse(24, 34, 12, 12, 24), 10, C('steel', 0.8), MAT.metal, { bevel: 2 });
      m.slab(ellipse(24, 34, 9, 9, 24), 11, C('sky', 0.55), MAT.glass, { bevel: 1.5 });
      // Socks tumbling in the window.
      const a = f * 1.4;
      m.paint(24 + Math.cos(a) * 4, 34 + Math.sin(a) * 4, 2.5, 1.6, C('blood', 0.6));
      m.paint(24 - Math.cos(a) * 4, 34 - Math.sin(a) * 4, 2.5, 1.6, C('yellow', 0.8));
    });
    c.set(36, 15, G('green', 1));
    c.set(38, 15, f ? G('green', 1) : C('gray', 0.4));
    return c;
  }));
}

const paintCans = () =>
  model(32, 24, 331, (m) => {
    shadow(m, 16, 22.5, 13);
    cylinder(m, 10, 9, 22, 6, C('steel', 0.72), MAT.metal, { topCol: C('steel', 0.85) });
    m.paint(10, 16, 6.1, 2.4, C('sky', 0.6));
    cylinder(m, 22, 11, 22, 5.5, C('steel', 0.72), MAT.metal, { topCol: C('steel', 0.85) });
    m.paint(22, 17, 5.6, 2.2, C('green', 0.6));
    m.capsule(22, 11, 11, 24, 15, 11, 0.8, 0.6, C('green', 0.6), MAT.plastic); // a drip
  });

function spaceHeater() {
  return sheet([0, 1, 2].map((f) => {
    const c = model(24, 40, 333, (m) => {
      shadow(m, 12, 38.5, 9);
      box(m, 3, 6, 18, 30, 3, C('beige', 0.9), MAT.plastic);
      m.slab([[3, 36], [21, 36], [22, 38], [2, 38]], 4, C('gray', 0.3), MAT.plastic, { bevel: 1 });
    });
    for (let y = 10; y < 32; y += 3) for (let x = 6; x < 18; x++) c.set(x, y, (x + y + f) % 4 ? G('red', 1) : G('yellow', 0.5));
    return c;
  }));
}

/** A big plastic bottle of soda. Shoot it and it explodes in fizz. */
function sodaBottle() {
  const bottle = (shake) => model(24, 40, 335, (m) => {
    shadow(m, 12, 38.5, 8);
    m.capsule(12, 14, 4, 12, 35, 4, 7, 7, mix(C('wood', 0.3), C('blood', 0.3), 0.4), { ...MAT.glass, spec: 0.7 });
    m.capsule(12 + shake, 4, 4, 12, 14, 4, 2.6, 6, mix(C('wood', 0.3), C('blood', 0.3), 0.4), { ...MAT.glass, spec: 0.7 });
    m.capsule(12 + shake, 1, 4, 12 + shake, 4, 4, 2.6, 2.6, C('blood', 0.6), MAT.plastic); // cap
    m.paint(12, 22, 7.1, 4, C('blood', 0.62)); // label
    m.paint(12, 22, 4, 1.4, C('beige', 0.98));
    for (let k = 0; k < 4; k++) m.paint(9 + k * 2, 30 - k * 4, 0.5, 0.5, C('beige', 0.8)); // bubbles inside
  });
  const blast = (k) => {
    const c = new PixelCanvas(24, 40);
    if (k < 4) {
      flash(c, 12, 26 - k * 3, 6 + k * 3, G('pale', 1), k > 1 ? C('beige', 0.9) : G('yellow', 0.6), 5 + k);
      flash(c, 12, 26 - k * 3, 3 + k, G('yellow', 1), G('pale', 1), 2 + k);
    }
    if (k >= 2) {
      // A sticky puddle and the empty, squashed bottle.
      const m = new Model(24, 40, { seed: 337 });
      puddle(m, 12, 37, 11, 2, mix(C('wood', 0.3), C('blood', 0.3), 0.4), MAT.glass);
      m.capsule(5, 35, 2, 14, 34, 2, 3, 2.4, mix(C('wood', 0.35), C('blood', 0.3), 0.4), MAT.glass);
      const base = m.render(RENDER);
      base.blit(c, 0, 0);
      return base;
    }
    return c;
  };
  return sheet([bottle(0), bottle(0.6), blast(0), blast(1), blast(2), blast(3), blast(4)]);
}

const bones = () =>
  model(32, 16, 339, (m) => {
    // Chicken bones: someone had a snack.
    const B = C('beige', 0.9);
    m.capsule(6, 12, 2, 18, 10, 2, 1.2, 1.2, B, MAT.bone);
    for (const [x, y] of [[6, 12], [18, 10]]) {
      m.sphere(x - 0.8, y - 0.8, 3, 1.4, B, MAT.bone);
      m.sphere(x + 0.8, y + 0.8, 3, 1.4, B, MAT.bone);
    }
    m.capsule(20, 13, 1, 27, 11, 1, 1, 0.9, B, MAT.bone);
    m.sphere(27, 11, 2, 1.4, B, MAT.bone);
  });

const puddleDecor = () =>
  model(40, 8, 341, (m) => {
    puddle(m, 20, 4, 17, 2.6, C('sky', 0.75), MAT.glass);
  });

export default [
  { name: 'couch', out: D('couch'), draw: couch, dither: 'fs' },
  { name: 'kitchen-chair', out: D('kitchen-chair'), draw: kitchenChair, dither: 'fs' },
  { name: 'table', out: D('table'), draw: table, dither: 'fs' },
  { name: 'houseplant', out: D('houseplant'), draw: houseplant, dither: 'fs' },
  { name: 'floor-lamp', out: D('floor-lamp'), draw: floorLamp, dither: 'fs' },
  { name: 'ceiling-lamp', out: D('ceiling-lamp'), draw: ceilingLamp, dither: 'fs' },
  { name: 'tv', out: D('tv'), draw: tv, dither: 'fs' },
  { name: 'trash-can', out: D('trash-can'), draw: trashCan, dither: 'fs' },
  { name: 'teddy-bear', out: D('teddy-bear'), draw: teddyBear, dither: 'fs' },
  { name: 'toy-blocks', out: D('toy-blocks'), draw: toyBlocks, dither: 'fs' },
  { name: 'toy-car', out: D('toy-car'), draw: toyCar, dither: 'fs' },
  { name: 'sock-pile', out: D('sock-pile'), draw: sockPile, dither: 'fs' },
  { name: 'cardboard-box', out: D('cardboard-box'), draw: cardboardBox, dither: 'fs' },
  { name: 'laundry-basket', out: D('laundry-basket'), draw: laundryBasket, dither: 'fs' },
  { name: 'washing-machine', out: D('washing-machine'), draw: washingMachine, dither: 'fs' },
  { name: 'paint-cans', out: D('paint-cans'), draw: paintCans, dither: 'fs' },
  { name: 'space-heater', out: D('space-heater'), draw: spaceHeater, dither: 'fs' },
  { name: 'soda-bottle', out: D('soda-bottle'), draw: sodaBottle, dither: 'fs' },
  { name: 'bones', out: D('bones'), draw: bones, dither: 'fs' },
  { name: 'puddle', out: D('puddle'), draw: puddleDecor, dither: 'fs' },
];
