// The lumber yard behind the warehouse (E2M5, the Lumberjack's): walls of
// stacked logs, a red barn-board sawmill shed, and sawdust on the ground.
import { texture, noiseFill, speckle, grimeGradient, C, mix, darken, hash2 } from '../lib/tex.js';

const T = (name) => `assets/textures/${name}.png`;

/** A wall of logs stacked with their cut ends out. */
function logWall() {
  const { c, seed } = texture('log-wall');
  c.fill(C('wood', 0.18));
  const r = 8;
  for (let row = 0; row < 5; row++) {
    const cy = 6 + row * 13;
    const off = row % 2 ? 8 : 0;
    for (let k = -1; k < 5; k++) {
      const cx = off + k * 16 + 8;
      const rr = r - hash2(k, row, seed) * 1.5;
      for (let y = Math.floor(cy - rr - 1); y <= cy + rr + 1; y++) {
        for (let x = Math.floor(cx - rr - 1); x <= cx + rr + 1; x++) {
          const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
          if (d > rr) continue;
          const xx = ((x % 64) + 64) % 64;
          const yy = ((y % 64) + 64) % 64;
          let col;
          if (d > rr - 1.6) col = C('wood', 0.3); // bark
          else {
            const ring = Math.sin(d * 1.6) * 0.04;
            col = C('wood', 0.7 + ring - d * 0.012);
          }
          c.set(xx, yy, col);
        }
      }
      c.set(((Math.round(cx) % 64) + 64) % 64, cy, C('wood', 0.5));
    }
  }
  return c;
}

/** Red-painted barn boards, weathered. */
function barnWood() {
  const { c, seed } = texture('barn-wood');
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const board = Math.floor(x / 8);
      const tone = hash2(board, 0, seed) * 0.08;
      let col = C('blood', 0.46 + tone + Math.sin(y * 0.35 + board * 2) * 0.02);
      if (x % 8 === 0) col = C('blood', 0.22);
      if (hash2(x, y, seed) > 0.93) col = mix(col, C('wood', 0.6), 0.5); // worn paint
      c.set(x, y, col);
    }
  }
  // A white X brace, like a barn door.
  for (let k = 0; k < 64; k++) {
    for (const [x, y] of [[k, k], [63 - k, k]]) {
      c.set(x, y, C('beige', 0.88));
      c.set(Math.min(63, x + 1), y, C('beige', 0.8));
    }
  }
  grimeGradient(c, { bottom: 0.2, top: 0 });
  return c;
}

/** Packed dirt covered in sawdust and wood chips. */
function sawdust() {
  const { c, r, seed } = texture('sawdust');
  noiseFill(c, seed, C('wood', 0.62), C('wood', 0.74), { cells: 5, grain: 0.4, contrast: 1 });
  speckle(c, seed, 0.15, 0.2);
  for (let k = 0; k < 14; k++) {
    const x = r.int(0, 62);
    const y = r.int(0, 62);
    c.set(x, y, C('wood', 0.85));
    c.set(x + 1, y, C('wood', 0.8));
    c.set(x, y + 1, darken(C('wood', 0.6), 0.2));
  }
  return c;
}

export default [
  { name: 'log-wall', out: T('log-wall'), draw: logWall },
  { name: 'barn-wood', out: T('barn-wood'), draw: barnWood },
  { name: 'sawdust', out: T('sawdust'), draw: sawdust },
];
