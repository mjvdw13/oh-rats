// The warehouse's sorting room (E2M4): conveyor belts that run (and carry you
// along: see `push` in the legend), the big SORT-O-MATIC machine with blinking
// lights, and the chutes the boxes drop down.
import { texture, noiseFill, bevel, rivet, tinyText, tinyTextWidth, C, mix, PixelCanvas } from '../lib/tex.js';
import { G } from '../lib/pal.js';

const T = (name) => `assets/textures/${name}.png`;
const FRAMES = 4;

/**
 * A rubber belt with ridges across it and rollers showing at the edges,
 * animated to run toward `dir` ('n', 's', 'e' or 'w'). Floors map the
 * texture's x to the world's x and its y to the world's y.
 */
function conveyor(dir) {
  const out = new PixelCanvas(64 * FRAMES, 64);
  for (let f = 0; f < FRAMES; f++) {
    const { c, seed } = texture(`conveyor-${dir}`);
    // Draw a belt running south (+y), then turn it to face `dir`.
    const step = 16 / FRAMES;
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        if (x < 6 || x >= 58) {
          // The side rails: yellow, with a roller every 8 pixels.
          const roll = (y + f * 2) % 8 < 2;
          c.set(x, y, x === 5 || x === 58 ? C('gray', 0.12) : roll ? C('steel', 0.85) : C('yellow', 0.7));
          continue;
        }
        const v = (y - f * step + 64) % 16;
        let col = C('gray', 0.22 + ((x * 7 + y * 3 + seed) % 5) * 0.004);
        if (v < 2) col = C('gray', 0.36);
        else if (v === 2) col = C('gray', 0.12);
        c.set(x, y, col);
      }
    }
    const turned = new PixelCanvas(64, 64);
    turned.each((x, y) => {
      if (dir === 's') return c.get(x, y);
      if (dir === 'n') return c.get(63 - x, 63 - y);
      if (dir === 'e') return c.get(y, 63 - x);
      return c.get(63 - y, x); // 'w'
    });
    out.blit(turned, f * 64, 0);
  }
  return out;
}

/** The SORT-O-MATIC: a big grey-blue machine with dials and blinking lights. */
function machine() {
  const out = new PixelCanvas(64 * 2, 64);
  for (let f = 0; f < 2; f++) {
    const { c, seed } = texture('machine');
    noiseFill(c, seed, C('steel', 0.5), C('steel', 0.56), { cells: 2, grain: 0.05 });
    bevel(c, 0, 0, 64, 64, C('steel', 0.52), { depth: 2, fill: false });
    bevel(c, 6, 6, 52, 16, C('navy', 0.4), { depth: 1 });
    const label = 'SORT-O-MATIC';
    tinyText(c, label, 32 - Math.ceil(tinyTextWidth(label) / 2), 11, G('green', f ? 0.6 : 1));
    // Blinking lights.
    for (let k = 0; k < 6; k++) {
      const on = (k + f) % 2 === 0;
      const col = [G('red', 1), G('yellow', 0.8), G('green', 1)][k % 3];
      c.rect(8 + k * 8, 28, 5, 5, on ? col : mix(col, C('gray', 0.2), 0.7));
    }
    // Dials and a lever.
    for (const x of [16, 40]) {
      c.ellipse(x, 46, 6, 6, C('gray', 0.85));
      c.ellipse(x, 46, 5, 5, C('beige', 0.95));
      c.line(x, 46, x + (f ? 3 : -2), 42, C('blood', 0.55));
    }
    c.rect(52, 38, 3, 16, C('gray', 0.3));
    c.ellipse(53.5, 38, 3, 3, C('blood', 0.6));
    for (const [x, y] of [[3, 3], [60, 3], [3, 60], [60, 60]]) rivet(c, x, y, C('steel', 0.75));
    out.blit(c, f * 64, 0);
  }
  return out;
}

/** A box chute in a cinder-block wall, with rubber flaps over the opening. */
function chute() {
  const { c, seed } = texture('chute');
  noiseFill(c, seed, C('steel', 0.62), C('steel', 0.68), { cells: 2, grain: 0.05 });
  bevel(c, 8, 10, 48, 44, C('steel', 0.55), { depth: 2 });
  c.rect(12, 14, 40, 36, C('gray', 0.06));
  for (let x = 12; x < 52; x += 5) {
    c.rect(x, 14, 4, 30, C('gray', 0.18)); // the rubber flaps
    c.rect(x, 14, 1, 30, C('gray', 0.3));
  }
  // A hazard stripe across the top.
  for (let y = 2; y < 8; y++) for (let x = 0; x < 64; x++) c.set(x, y, ((x + y) >> 2) & 1 ? C('yellow', 0.75) : C('gray', 0.12));
  return c;
}

export default [
  ...['n', 's', 'e', 'w'].map((d) => ({ name: `conveyor-${d}`, out: T(`conveyor-${d}`), draw: () => conveyor(d) })),
  { name: 'machine', out: T('machine'), draw: machine },
  { name: 'chute', out: T('chute'), draw: chute },
];
