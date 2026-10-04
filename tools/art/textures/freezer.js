// The warehouse's big freezer (E2M3): frosty white insulated panels, shelves of
// cheese wheels, a heavy freezer door, slippery-looking ice on the floor and
// cold tube lights in the ceiling.
import { texture, noiseFill, speckle, bevel, rivet, tinyText, tinyTextWidth, C, mix, lighten, hash2 } from '../lib/tex.js';
import { G } from '../lib/pal.js';

const T = (name) => `assets/textures/${name}.png`;

/** Frost creeping up from the bottom and down from the top. */
function frost(c, seed, { bottom = 14, top = 6 } = {}) {
  c.eachOpaque((x, y, p) => {
    const h = hash2(x, y, seed + 3);
    const fromBottom = (y - (63 - bottom)) / bottom;
    const fromTop = (top - y) / top;
    const t = Math.max(fromBottom, fromTop) + (h - 0.5) * 0.6;
    if (t <= 0) return undefined;
    return mix(p, C('gray', 0.98), Math.min(0.85, t));
  });
}

/** Insulated wall panels: white with a cold blue tint, seams and rivets. */
function freezerWall() {
  const { c, seed } = texture('freezer-wall');
  noiseFill(c, seed, mix(C('gray', 0.82), C('sky', 0.85), 0.35), mix(C('gray', 0.9), C('sky', 0.9), 0.3), { cells: 3, grain: 0.06, contrast: 0.6 });
  for (const x of [0, 32]) {
    c.rect(x, 0, 1, 64, C('sky', 0.55));
    c.rect(x + 1, 0, 1, 64, C('gray', 0.97));
    for (let y = 6; y < 64; y += 14) rivet(c, x + 4, y, C('steel', 0.75));
  }
  frost(c, seed);
  return c;
}

/** Steel shelves of big cheese wheels, frosty. */
function cheeseShelf() {
  const { c, r, seed } = texture('cheese-shelf');
  c.fill(C('navy', 0.5));
  for (const [y0, y1] of [[4, 29], [36, 61]]) {
    let x = 5;
    while (x < 58) {
      const w = r.int(12, 16);
      const h = r.int(9, 13);
      const cx = x + w / 2;
      // A wheel of cheese seen from the side: yellow with a waxy red rind band.
      for (let yy = y1 - h; yy < y1; yy++) {
        for (let xx = x; xx < x + w && xx < 59; xx++) {
          const edge = Math.abs(xx + 0.5 - cx) / (w / 2);
          if (edge > 1) continue;
          const shade = 0.8 - edge * edge * 0.25 + (yy === y1 - h ? 0.12 : 0);
          c.set(xx, yy, yy < y1 - h + 3 ? C('yellow', 0.92) : C('yellow', shade));
        }
      }
      c.rect(x + 1, y1 - Math.floor(h / 2), w - 2, 2, C('blood', 0.55));
      x += w + 2;
    }
    c.rect(0, y1, 64, 3, C('steel', 0.7));
    c.rect(0, y1, 64, 1, C('steel', 0.9));
  }
  for (const x0 of [0, 61]) c.rect(x0, 0, 3, 64, C('steel', 0.62));
  frost(c, seed, { bottom: 8, top: 4 });
  return c;
}

/** A thick freezer door with a big lever handle. */
function freezerDoor() {
  const { c, seed } = texture('freezer-door');
  noiseFill(c, seed, C('steel', 0.7), C('steel', 0.78), { cells: 2, grain: 0.05 });
  bevel(c, 0, 0, 64, 64, C('steel', 0.72), { depth: 3, fill: false });
  bevel(c, 8, 8, 48, 48, C('steel', 0.74), { depth: 1, fill: false });
  c.rect(46, 26, 6, 14, C('gray', 0.25)); // the handle
  c.rect(40, 30, 12, 4, C('gray', 0.3));
  c.rect(46, 26, 6, 1, C('gray', 0.5));
  const label = 'COLD!';
  tinyText(c, label, 32 - Math.ceil(tinyTextWidth(label) / 2), 14, C('sky', 0.4));
  frost(c, seed, { bottom: 10, top: 4 });
  return c;
}

/** Shiny pale-blue ice with cracks and a glare. */
function iceFloor() {
  const { c, r, seed } = texture('ice-floor');
  noiseFill(c, seed, C('sky', 0.78), C('sky', 0.92), { cells: 4, grain: 0.1, contrast: 1.2 });
  for (let i = 0; i < 5; i++) {
    let x = r.range(0, 64);
    let y = r.range(0, 64);
    let a = r.range(0, Math.PI * 2);
    for (let k = 0; k < 14; k++) {
      c.set(((Math.floor(x) % 64) + 64) % 64, ((Math.floor(y) % 64) + 64) % 64, C('gray', 0.98));
      a += r.range(-0.5, 0.5);
      x += Math.cos(a);
      y += Math.sin(a);
    }
  }
  speckle(c, seed, 0.03, 0.1);
  for (let k = 0; k < 10; k++) c.set(10 + k, 20 - k, lighten(C('sky', 0.95), 0.6)); // a glare
  return c;
}

function freezerCeiling(name = 'freezer-ceiling') {
  const { c, seed } = texture(name);
  noiseFill(c, seed, C('gray', 0.82), C('gray', 0.9), { cells: 3, grain: 0.1 });
  c.rect(0, 0, 64, 1, C('sky', 0.6));
  c.rect(0, 0, 1, 64, C('sky', 0.6));
  return c;
}

function freezerLight() {
  const c = freezerCeiling('freezer-light');
  bevel(c, 8, 26, 48, 12, C('steel', 0.7), { depth: 1 });
  for (let x = 10; x < 54; x++) for (const y of [29, 30, 31, 32, 33, 34]) c.set(x, y, y === 31 || y === 32 ? G('tube', 1) : G('tube', 0));
  return c;
}

export default [
  { name: 'freezer-wall', out: T('freezer-wall'), draw: freezerWall },
  { name: 'cheese-shelf', out: T('cheese-shelf'), draw: cheeseShelf },
  { name: 'freezer-door', out: T('freezer-door'), draw: freezerDoor },
  { name: 'ice-floor', out: T('ice-floor'), draw: iceFloor },
  { name: 'freezer-ceiling', out: T('freezer-ceiling'), draw: () => freezerCeiling() },
  { name: 'freezer-light', out: T('freezer-light'), draw: freezerLight },
];
