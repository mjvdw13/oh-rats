// The sky outside: a sunny day over the neighbourhood. 512x128, seamless
// horizontally, with the horizon near the bottom.
import { PixelCanvas, mix, lighten } from '../lib/canvas.js';
import { fbm, hash2, rng, seedFrom } from '../lib/noise.js';
import { C } from '../lib/pal.js';

const W = 512;
const H = 128;

function daySky() {
  const c = new PixelCanvas(W, H);
  const r = rng(seedFrom('sky-day'));
  const clouds = fbm(seedFrom('clouds'), W, { cells: 8, octaves: 4, sizeY: H, cellsY: 2 });
  c.each((x, y) => {
    const base = mix(C('sky', 0.55), C('sky', 0.95), y / (H - 1));
    const k = clouds(x, y) - (y / H) * 0.25;
    return k > 0.58 ? lighten(base, Math.min(0.9, (k - 0.58) * 6)) : base;
  });
  // Rolling hills, then trees and the neighbours' rooftops.
  for (let x = 0; x < W; x++) {
    const hill = Math.round(104 + Math.sin((x / W) * Math.PI * 6) * 5 + Math.sin((x / W) * Math.PI * 14) * 2);
    for (let y = hill; y < H; y++) c.set(x, y, C('green', 0.45 - (y - hill) * 0.006));
  }
  let x = 0;
  while (x < W) {
    if (r.chance(0.4)) {
      // A house: walls and a pointy roof.
      const w = r.int(26, 40);
      const top = r.int(84, 92);
      const wall = [C('beige', 0.8), C('sky', 0.7), C('yellow', 0.7), C('flesh', 0.75)][r.int(0, 3)];
      for (let yy = top; yy < H; yy++) for (let xx = x; xx < x + w; xx++) c.set(xx % W, yy, wall);
      for (let k = 0; k <= w / 2 + 2; k++) {
        for (let xx = x - 2 + k; xx < x + w + 2 - k; xx++) c.set(xx % W, top - k * 0.6, C('blood', 0.45));
      }
      c.set((x + 6) % W, top + 8, C('sky', 0.4));
      c.set((x + 7) % W, top + 8, C('sky', 0.4));
      x += w + r.int(6, 20);
    } else {
      // A round tree.
      const cx = x + 8;
      const cy = r.int(86, 96);
      for (let yy = cy; yy < H; yy++) {
        c.set(cx % W, yy, C('wood', 0.3));
        c.set((cx + 1) % W, yy, C('wood', 0.3));
      }
      const rad = r.int(6, 10);
      for (let yy = -rad; yy <= rad; yy++) {
        for (let xx = -rad; xx <= rad; xx++) {
          if (xx * xx + yy * yy > rad * rad) continue;
          c.set((cx + xx + W) % W, cy - rad / 2 + yy, C('green', 0.4 + (hash2(xx, yy, cx) > 0.7 ? 0.1 : 0) - yy * 0.008));
        }
      }
      x += rad * 2 + r.int(2, 12);
    }
  }
  return c;
}

export default [{ name: 'sky-day', out: 'assets/textures/sky-day.png', draw: daySky, dither: 12 }];
