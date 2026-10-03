// The warehouse (episode 2): corrugated steel and painted cinder-block walls,
// pallet racks full of boxes, stacked crates, a roll-up dock door, polished
// concrete with yellow aisle lines, the asphalt outside the docks, and a roof
// of steel trusses with skylights, and a mouse hole in the cinder blocks.
import {
  texture, noiseFill, speckle, stain, drips, grimeGradient, bevel, rivet, tinyText, tinyTextWidth,
  C, mix, darken, lighten, hash2,
} from '../lib/tex.js';
import { G } from '../lib/pal.js';
import { mouseHole } from './house.js';

const T = (name) => `assets/textures/${name}.png`;

/** Ribbed sheet steel, painted. Ribs every 8px with a soft highlight. */
function corrugated() {
  const { c, r, seed } = texture('corrugated');
  noiseFill(c, seed, C('sky', 0.42), C('sky', 0.5), { cells: 3, grain: 0.06, contrast: 0.7 });
  c.eachOpaque((x, y, p) => {
    const k = Math.sin(((x % 8) / 8) * Math.PI * 2);
    return k > 0 ? lighten(p, k * 0.14) : darken(p, -k * 0.18);
  });
  // Girts with bolts, and a concrete curb at the bottom.
  for (const y of [0, 32]) {
    c.rect(0, y, 64, 1, C('sky', 0.25));
    for (let x = 4; x < 64; x += 16) rivet(c, x, y + 2, C('steel', 0.7));
  }
  drips(c, r, 3, C('orange', 0.35), { startY: 2, maxLen: 14, strength: 0.25 });
  c.rect(0, 58, 64, 6, C('concrete', 0.5));
  c.rect(0, 58, 64, 1, C('concrete', 0.7));
  grimeGradient(c, { bottom: 0.12, top: 0.05 });
  return c;
}

/** Painted cinder blocks with a yellow safety band and a grey lower half. */
function cinderblock(name = 'cinderblock') {
  const { c, seed } = texture(name);
  for (let y = 0; y < 64; y++) {
    const row = Math.floor(y / 8);
    const off = row % 2 ? 8 : 0;
    for (let x = 0; x < 64; x++) {
      const inX = (x + off) % 16;
      const inY = y % 8;
      const paint = y >= 40 && y < 44 ? C('yellow', 0.72) : y >= 44 ? C('steel', 0.55) : C('beige', 0.86);
      let col = mix(paint, darken(paint, 0.08), hash2(x, y, seed) * 0.6);
      if (inY === 0 || inX === 0) col = darken(paint, 0.22);
      else if (inY === 1) col = lighten(col, 0.08);
      c.set(x, y, col);
    }
  }
  speckle(c, seed, 0.08, 0.12);
  grimeGradient(c, { bottom: 0.15, top: 0 });
  return c;
}

/** A pallet rack: orange uprights, blue beams and boxes on two shelves. */
function rackBoxes() {
  const { c, r } = texture('rack-boxes');
  c.fill(C('gray', 0.08)); // the shadowy back of the rack
  const shelf = (y0, y1) => {
    let x = 5;
    while (x < 59) {
      const w = Math.min(59 - x, r.int(12, 20));
      const h = r.int(Math.max(8, (y1 - y0) - 12), y1 - y0 - 2);
      const col = r.pick([C('wood', 0.62), C('wood', 0.55), C('beige', 0.7)]);
      bevel(c, x, y1 - h, w, h, col, { depth: 1, hi: 0.2, lo: 0.3 });
      c.rect(x + Math.floor(w / 2) - 1, y1 - h, 2, Math.min(5, h), C('gray', 0.75)); // tape
      if (w > 12) c.rect(x + 2, y1 - h + 5, 5, 3, C('beige', 0.95)); // label
      x += w + 1;
    }
  };
  shelf(5, 28);
  shelf(37, 60);
  // Load beams.
  for (const y of [28, 60]) {
    c.rect(0, y, 64, 4, C('sky', 0.45));
    c.rect(0, y, 64, 1, C('sky', 0.7));
    c.rect(0, y + 3, 64, 1, C('sky', 0.25));
  }
  c.rect(0, 0, 64, 2, C('sky', 0.45));
  // Uprights (half at each edge, so neighbouring tiles join up).
  for (const x0 of [0, 60]) {
    c.rect(x0, 0, 4, 64, C('orange', 0.62));
    c.rect(x0 + (x0 ? 0 : 3), 0, 1, 64, C('orange', 0.35));
    for (let y = 4; y < 64; y += 6) c.set(x0 + 1 + (x0 ? 1 : 0), y, C('gray', 0.1));
  }
  return c;
}

/** Stacked wooden crates, stencilled CHEESE and FRAGILE. */
function crates() {
  const { c, seed } = texture('crates');
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const plank = Math.floor((y % 32) / 8);
      const tone = hash2(Math.floor(x / 32), plank + Math.floor(y / 32) * 4, seed) * 0.12;
      let col = C('wood', 0.56 + tone + Math.sin(x * 0.4 + plank * 3) * 0.02);
      if (y % 8 === 0) col = C('wood', 0.3);
      c.set(x, y, col);
    }
  }
  for (const [x0, y0] of [[0, 0], [32, 0], [0, 32], [32, 32]]) {
    bevel(c, x0, y0, 32, 32, C('wood', 0.42), { depth: 2, fill: false, hi: 0.2, lo: 0.4 });
    for (const [x, y] of [[x0 + 3, y0 + 3], [x0 + 27, y0 + 3], [x0 + 3, y0 + 27], [x0 + 27, y0 + 27]]) rivet(c, x, y, C('steel', 0.6));
  }
  const stencil = (text, x0, y0, col) => tinyText(c, text, x0 + 16 - Math.ceil(tinyTextWidth(text) / 2), y0 + 13, col);
  stencil('CHEESE', 0, 0, C('blood', 0.45));
  stencil('THIS', 32, 0, C('gray', 0.2));
  stencil('UP!', 32, 6, C('gray', 0.2));
  stencil('FRAGILE', 0, 32, C('blood', 0.45));
  stencil('CHEESE', 32, 32, C('blood', 0.45));
  grimeGradient(c, { bottom: 0.12, top: 0 });
  return c;
}

/** A roll-up loading-dock door: white slats, a window band and a hazard-striped bottom. */
function dockDoor() {
  const { c, seed } = texture('dock-door');
  noiseFill(c, seed, C('gray', 0.82), C('gray', 0.88), { cells: 2, grain: 0.04, contrast: 0.6 });
  for (let y = 0; y < 64; y += 6) {
    c.rect(0, y, 64, 1, C('gray', 0.6));
    c.rect(0, y + 1, 64, 1, C('gray', 0.95));
  }
  for (const x of [6, 26, 46]) {
    c.rect(x, 19, 12, 5, C('sky', 0.55));
    c.rect(x, 19, 12, 1, C('gray', 0.5));
    c.set(x + 2, 21, C('sky', 0.85));
  }
  for (let y = 54; y < 62; y++) for (let x = 0; x < 64; x++) c.set(x, y, ((x + y) >> 2) & 1 ? C('yellow', 0.75) : C('gray', 0.12));
  c.rect(0, 62, 64, 2, C('gray', 0.3));
  c.rect(28, 50, 8, 3, C('steel', 0.4)); // the handle
  return c;
}

/** Smooth, sealed concrete with saw-cut joints and tyre marks. */
function warehouseFloor(name = 'warehouse-floor') {
  const t = texture(name);
  const { c, r, seed } = t;
  noiseFill(c, seed, C('concrete', 0.55), C('concrete', 0.63), { cells: 5, grain: 0.15, contrast: 0.9 });
  speckle(c, seed, 0.06, 0.15);
  for (let i = 0; i < 2; i++) stain(c, r, { radius: r.range(4, 8), color: C('concrete', 0.35), strength: 0.3, ring: 0.05 });
  c.rect(0, 0, 64, 1, C('concrete', 0.4));
  c.rect(0, 0, 1, 64, C('concrete', 0.4));
  return c;
}

function floorStripe() {
  const c = warehouseFloor('floor-stripe');
  for (let y = 0; y < 64; y++) for (let x = 28; x < 36; x++) c.set(x, y, mix(C('yellow', 0.75), c.get(x, y), 0.15 + hash2(x, y, 3) * 0.15));
  return c;
}

function asphalt() {
  const { c, seed } = texture('asphalt');
  noiseFill(c, seed, C('gray', 0.22), C('gray', 0.3), { cells: 6, grain: 0.5, contrast: 1.1 });
  speckle(c, seed, 0.2, 0.3);
  return c;
}

/** The roof seen from below: corrugated panels and a steel truss. */
function roofTruss() {
  const { c, seed } = texture('roof-truss');
  noiseFill(c, seed, C('steel', 0.4), C('steel', 0.46), { cells: 3, grain: 0.05 });
  c.eachOpaque((x, y, p) => (y % 8 < 4 ? lighten(p, 0.06) : darken(p, 0.08)));
  for (let x = 0; x < 64; x++) {
    for (const y of [28, 29, 30, 31, 32, 33, 34, 35]) c.set(x, y, C('orange', y === 28 ? 0.7 : y === 35 ? 0.3 : 0.55));
  }
  c.line(0, 34, 31, 29, C('orange', 0.4));
  c.line(32, 29, 63, 34, C('orange', 0.4));
  return c;
}

function skylight() {
  const c = roofTruss();
  bevel(c, 6, 4, 52, 22, C('steel', 0.6), { depth: 2 });
  for (let y = 7; y < 23; y++) for (let x = 9; x < 55; x++) c.set(x, y, (x + y) % 11 === 0 ? G('tube', 1) : G('tube', 0));
  c.rect(31, 7, 2, 16, C('steel', 0.6));
  return c;
}

export default [
  { name: 'corrugated', out: T('corrugated'), draw: corrugated },
  { name: 'cinderblock', out: T('cinderblock'), draw: () => cinderblock() },
  { name: 'rack-boxes', out: T('rack-boxes'), draw: rackBoxes },
  { name: 'crates', out: T('crates'), draw: crates },
  { name: 'dock-door', out: T('dock-door'), draw: dockDoor },
  { name: 'warehouse-floor', out: T('warehouse-floor'), draw: () => warehouseFloor() },
  { name: 'floor-stripe', out: T('floor-stripe'), draw: floorStripe },
  { name: 'asphalt', out: T('asphalt'), draw: asphalt },
  { name: 'roof-truss', out: T('roof-truss'), draw: roofTruss },
  { name: 'skylight', out: T('skylight'), draw: skylight },
  { name: 'mouse-hole-block', out: T('mouse-hole-block'), draw: () => mouseHole('mouse-hole-block', false, cinderblock) },
  { name: 'mouse-hole-block-on', out: T('mouse-hole-block-on'), draw: () => mouseHole('mouse-hole-block-on', true, cinderblock) },
];
