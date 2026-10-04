// Full-screen pictures (320x200): the title screen, the intermission maps (a
// dollhouse cut-away of the house, and one of the warehouse), the finale text backdrop and the end
// picture. Painted with the same clay renderer as the sprites, then dithered
// into the palette.
import { PixelCanvas, mix, lighten } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT } from '../lib/model.js';
import { fbm, hash2, rng, seedFrom, valueNoise } from '../lib/noise.js';
import { tinyText } from '../lib/tex.js';
import { ellipse } from '../lib/props.js';
import { smallGlyphs } from './fonts.js';
import { ratFace } from './face.js';
import { dadFrame } from '../sprites/dad.js';

const W = 320;
const H = 200;
const U = (name) => `assets/ui/${name}.png`;

/** Where the portrait sits on the title (keep in sync with titlePortrait in src/content/config.js). */
export const PORTRAIT = { x: 22, y: 64, w: 72, h: 90 };

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const norm3 = (x, y, z) => {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
};

/** Colour at t along [[t, rgb], ...] stops. */
function ramp(stops, t) {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i];
    if (t <= t1) {
      const [t0, c0] = stops[i - 1];
      return mix(c0, c1, (t - t0) / (t1 - t0 || 1));
    }
  }
  return stops[stops.length - 1][1];
}

/** Blend a colour into an existing pixel. */
function blend(c, x, y, col, a) {
  const p = c.get(x, y);
  if (!p || a <= 0) return;
  c.set(x, y, mix(p, col, clamp(a, 0, 1)));
}

/** Soft radial glow added over what is already painted. */
function glow(c, cx, cy, r, col, strength = 0.5) {
  for (let y = Math.floor(cy - r); y <= cy + r; y++) {
    for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / r;
      if (d < 1) blend(c, x, y, col, (1 - d) * (1 - d) * strength);
    }
  }
}

/** Text in the game's small 5x7 font. */
function smallText(c, text, x, y, col, { shadow, align = 'left' } = {}) {
  const glyphs = smallGlyphs();
  const width = text.length * 6 - 1;
  const x0 = align === 'center' ? Math.round(x - width / 2) : x;
  [...text].forEach((ch, i) => {
    const rows = glyphs.get(ch);
    if (!rows) return;
    rows.forEach((row, gy) => {
      for (let gx = 0; gx < 5; gx++) {
        if (row[gx] !== '#') continue;
        if (shadow) c.set(x0 + i * 6 + gx + 1, y + gy + 1, shadow);
        c.set(x0 + i * 6 + gx, y + gy, typeof col === 'function' ? col(gy / 6) : col);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// The logo: font glyphs scaled up, smoothed, bevelled with a distance field
// and shaded like a shiny wedge of golden cheese.

function textMask(text, scale) {
  const glyphs = smallGlyphs();
  const adv = 6 * scale;
  const w = text.length * adv - scale;
  const h = 7 * scale;
  const m = new Float32Array(w * h);
  [...text].forEach((ch, i) => {
    const rows = glyphs.get(ch);
    rows?.forEach((row, gy) => {
      for (let gx = 0; gx < 5; gx++) {
        if (row[gx] !== '#') continue;
        for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) m[(gy * scale + sy) * w + i * adv + gx * scale + sx] = 1;
      }
    });
  });
  return { w, h, m };
}

function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let k = -r; k <= r; k++) s += src[y * w + clamp(x + k, 0, w - 1)];
      tmp[y * w + x] = s / (2 * r + 1);
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let k = -r; k <= r; k++) s += tmp[clamp(y + k, 0, h - 1) * w + x];
      out[y * w + x] = s / (2 * r + 1);
    }
  }
  return out;
}

function dilate(src, w, h, r) {
  const out = new Float32Array(w * h);
  const R = Math.ceil(r);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let dy = -R; dy <= R && v < 1; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          if (dx * dx + dy * dy > r * r) continue;
          const xx = x + dx;
          const yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < w && yy < h && src[yy * w + xx] > v) v = src[yy * w + xx];
        }
      }
      out[y * w + x] = v;
    }
  }
  return out;
}

/** Chamfer distance from each inside pixel to the outside. */
function insideDistance(mask, w, h) {
  const d = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) d[i] = mask[i] ? 1e9 : 0;
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[y * w + x]);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (d[i]) d[i] = Math.min(d[i], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414);
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      if (d[i]) d[i] = Math.min(d[i], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414);
    }
  }
  return d;
}

const CHEESE = [
  [0, [255, 252, 220]],
  [0.3, [255, 226, 110]],
  [0.6, [244, 180, 40]],
  [0.85, [214, 120, 20]],
  [1, [255, 200, 90]],
];

function glint(c, x, y, len) {
  c.set(x, y, [255, 255, 255]);
  for (let k = 1; k <= len; k++) {
    const col = k === 1 ? G('pale', 1) : G('yellow', 0.8);
    for (const [dx, dy] of [[k, 0], [-k, 0], [0, k], [0, -k]]) if (c.opaque(x + dx, y + dy) || k === 1) c.set(x + dx, y + dy, col);
  }
}

export function cheeseLogo(text, scale, { bevel = 3.4, extrude = 5, seed = 7, stops = CHEESE, bold = 1.2 } = {}) {
  const pad = extrude + 3;
  const t = textMask(text, scale);
  const w = t.w + pad * 2;
  const h = t.h + pad * 2;
  let f = new Float32Array(w * h);
  for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) f[(y + pad) * w + x + pad] = t.m[y * t.w + x];
  // Embolden (joins the diagonal staircases), then round the corners off.
  f = dilate(f, w, h, bold);
  f = boxBlur(boxBlur(f, w, h, 1), w, h, 1);
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = f[i] > 0.5 ? 1 : 0;
  const dist = insideDistance(mask, w, h);
  const hgt = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : Math.min(1, dist[y * w + x] / bevel));
  const c = new PixelCanvas(w, h);
  // Extruded sides in rind orange, falling away down and to the right.
  for (let e = extrude; e >= 1; e--) {
    const k = 1 - e / extrude;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) c.set(x + e, y + e, mix(C('orange', 0.2), C('orange', 0.5), k));
  }
  const noise = valueNoise(seed, 4096, 4096);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      const gx = hgt(x + 1, y) - hgt(x - 1, y);
      const gy = hgt(x, y + 1) - hgt(x, y - 1);
      const [nx, ny] = norm3(-gx * 1.7, -gy * 1.7, 1);
      const ty = (y - pad) / t.h;
      let col = ramp(stops, clamp(ty * 0.9 + 0.05 + ny * 0.6 + nx * 0.12, 0, 1));
      const lit = clamp(1 + (-nx * 0.35 - ny * 0.45), 0.6, 1.25);
      col = col.map((v) => Math.min(255, v * lit));
      // Cheese holes.
      const hole = noise(x * 0.18, y * 0.18);
      if (hole > 0.78 && dist[y * w + x] > 2) col = mix(col, [196, 130, 20], 0.55);
      c.set(x, y, col);
    }
  }
  c.outline([40, 16, 4]);
  const corners = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (mask[y * w + x] && !mask[(y - 1) * w + x] && !mask[y * w + x - 1] && hash2(x, y, seed + 3) > 0.9) corners.push([x, y]);
    }
  }
  for (const [x, y] of corners.slice(0, 4)) glint(c, x + 1, y + 1, 3);
  return c;
}

// ---------------------------------------------------------------------------
// Scenery pieces.

/** A bright sky with puffy clouds down to `horizon`. */
function daySky(c, seed, horizon = 150) {
  const clouds = fbm(seed, 128, { cells: 5, octaves: 4 });
  for (let y = 0; y < horizon; y++) {
    for (let x = 0; x < W; x++) {
      const base = mix(C('sky', 0.55), C('sky', 0.92), y / horizon);
      const k = clouds(x % 128, (y * 2) % 128) - y / horizon * 0.25;
      c.set(x, y, k > 0.6 ? lighten(base, Math.min(0.9, (k - 0.6) * 5)) : base);
    }
  }
}

function lawn(c, top, seed) {
  for (let y = top; y < H; y++) {
    for (let x = 0; x < W; x++) c.set(x, y, C('green', 0.5 + hash2(x, y, seed) * 0.12 - (y - top) * 0.002));
  }
  const r = rng(seed);
  for (let k = 0; k < 30; k++) {
    const x = r.int(0, W - 1);
    const y = r.int(top + 2, H - 2);
    c.set(x, y, r.chance(0.5) ? C('beige', 0.98) : C('yellow', 0.9));
  }
}

/** The big house: yellow siding, a red roof, white windows. */
function house(c, x0, y0, w, h, seed) {
  const m = new Model(W, H, { seed });
  m.slab([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], 0, C('yellow', 0.78), MAT.wood, { bevel: 2, thickness: 1 });
  m.slab([[x0 - 8, y0 + 2], [x0 + w / 2, y0 - h * 0.55], [x0 + w + 8, y0 + 2]], 4, C('blood', 0.55), MAT.wood, { bevel: 3, thickness: 2 });
  m.slab([[x0 + w * 0.62, y0 - h * 0.45], [x0 + w * 0.72, y0 - h * 0.45], [x0 + w * 0.72, y0 - h * 0.22], [x0 + w * 0.62, y0 - h * 0.1]], 6, C('blood', 0.4), MAT.wood, { bevel: 1 }); // chimney
  const img = m.render({ light: [-0.5, -0.6, 0.6], ambient: 0.45 });
  c.blit(img, 0, 0);
  // Siding lines, windows and the door.
  for (let y = y0 + 4; y < y0 + h; y += 4) for (let x = x0 + 1; x < x0 + w - 1; x++) blend(c, x, y, C('yellow', 0.55), 0.5);
  const win = (x, y, ww, hh) => {
    c.rect(x - 1, y - 1, ww + 2, hh + 2, C('beige', 0.98));
    c.rect(x, y, ww, hh, C('sky', 0.7));
    c.rect(x + Math.floor(ww / 2), y, 1, hh, C('beige', 0.98));
    c.rect(x, y + Math.floor(hh / 2), ww, 1, C('beige', 0.98));
    for (let k = 0; k < Math.min(ww, hh) - 2; k++) c.set(x + 1 + k, y + hh - 2 - k, lighten(C('sky', 0.7), 0.4));
  };
  win(x0 + 10, y0 + 10, 16, 14);
  win(x0 + w - 26, y0 + 10, 16, 14);
  win(x0 + 10, y0 + 38, 16, 14);
  c.rect(x0 + w - 24, y0 + h - 26, 14, 26, C('blood', 0.5));
  c.set(x0 + w - 13, y0 + h - 13, C('yellow', 0.9));
  // The round attic window.
  c.ellipse(x0 + w / 2, y0 - h * 0.2, 6, 6, C('beige', 0.98));
  c.ellipse(x0 + w / 2, y0 - h * 0.2, 4.5, 4.5, C('sky', 0.6));
  return { winX: x0 + w - 26, winY: y0 + 10 };
}

/** Dad, peeking out of a window: just his head and shoulders. */
function dadInWindow(c, x, y) {
  const frame = dadFrame({ legL: { thigh: 4, knee: 6 }, legR: { thigh: -4, knee: 4 }, armL: { reach: [42, 66, 14] } }, { mouth: 0.6, mug: false });
  // Crop his head and shoulders (the top of the 128x128 frame) into the 16x14 window.
  for (let yy = 0; yy < 14; yy++) {
    for (let xx = 0; xx < 16; xx++) {
      const p = frame.get(Math.floor(48 + xx * 2), Math.floor(16 + yy * 2));
      if (p) c.set(x + xx, y + yy, p);
    }
  }
}

/** A wooden picture frame with the zombie rat's portrait in it. */
function portraitFrame(c) {
  const { x, y, w, h } = PORTRAIT;
  const m = new Model(W, H, { seed: 61 });
  m.slab([[x - 9, y - 9], [x + w + 9, y - 9], [x + w + 9, y + h + 18], [x - 9, y + h + 18]], 0, C('wood', 0.5), MAT.wood, { bevel: 4, thickness: 2 });
  c.blit(m.render({ light: [-0.5, -0.6, 0.6], ambient: 0.45 }), 0, 0);
  c.rect(x - 2, y - 2, w + 4, h + 4, C('wood', 0.25));
  // A cheese-yellow backdrop behind the rat.
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) c.set(x + xx, y + yy, mix(C('yellow', 0.85), C('orange', 0.6), yy / h));
  const face = ratFace({ expr: 'grin' }, 3);
  c.blit(face, x, y);
  smallText(c, 'ZOMBIE RAT', x + w / 2, y + h + 6, C('beige', 0.98), { align: 'center', shadow: C('wood', 0.2) });
}

function title() {
  const c = new PixelCanvas(W, H);
  const seed = seedFrom('title');
  daySky(c, seed, 168);
  lawn(c, 168, seed + 1);
  const { winX, winY } = house(c, 186, 92, 110, 76, 71);
  dadInWindow(c, winX, winY);
  // A little cloud of "!!" over Dad.
  smallText(c, '!!', winX + 18, winY - 12, C('blood', 0.6), { shadow: C('beige', 0.98) });
  portraitFrame(c);
  const logo = cheeseLogo('OH, RATS!', 5, { seed: 9 });
  c.blit(logo, Math.round((W - logo.w) / 2), 2);
  smallText(c, 'A ZOMBIE RAT WITH A BONE SHOTGUN', 212, 58, C('beige', 0.98), { align: 'center', shadow: C('navy', 0.4) });
  return c;
}

// ---------------------------------------------------------------------------
// Intermission: a dollhouse cut-away of the house, from the basement up to
// the attic, with the vents running between the rooms.

/** Map spots for each level on the intermission picture (used by the episode def). */
export const MAP_SPOTS = { e1m1: [160, 176], e1m2: [92, 128], e1m3: [226, 128], e1m4: [160, 86], e1m5: [160, 42] };

function intermission() {
  const c = new PixelCanvas(W, H);
  const seed = seedFrom('intermission');
  daySky(c, seed, 154);
  // Underground: dirt around the basement.
  for (let y = 154; y < H; y++) for (let x = 0; x < W; x++) c.set(x, y, C('wood', 0.3 + hash2(x, y, seed) * 0.06));
  for (let x = 0; x < W; x++) for (let y = 150; y < 155; y++) c.set(x, y, C('green', 0.55));
  const room = (x, y, w, h, wall, floor) => {
    c.rect(x, y, w, h, wall);
    c.rect(x, y + h - 4, w, 4, floor);
    c.frame(x - 2, y - 2, w + 4, h + 4, C('beige', 0.95));
    c.frame(x - 1, y - 1, w + 2, h + 2, C('wood', 0.3));
  };
  // Basement, ground floor (kitchen | living room), upstairs, attic.
  room(60, 158, 200, 36, C('concrete', 0.55), C('concrete', 0.35));
  room(50, 110, 106, 40, C('sky', 0.75), C('gray', 0.85));
  room(164, 110, 106, 40, C('green', 0.7), C('wood', 0.5));
  room(50, 66, 220, 38, C('flesh', 0.8), C('sky', 0.5));
  // The roof and attic.
  c.poly([[36, 64], [160, 8], [284, 64]], C('blood', 0.55));
  c.poly([[70, 60], [160, 22], [250, 60]], C('wood', 0.6));
  c.rect(70, 58, 180, 4, C('wood', 0.42));
  // Vents (grey ducts) zig-zagging between floors.
  const duct = (pts) => {
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[i + 1];
      for (let t = 0; t <= 1; t += 0.01) c.rect(Math.round(ax + (bx - ax) * t) - 1, Math.round(ay + (by - ay) * t) - 1, 3, 3, C('steel', 0.7));
    }
  };
  duct([[64, 186], [44, 186], [44, 120], [52, 120]]);
  duct([[256, 186], [276, 186], [276, 76], [268, 76]]);
  duct([[156, 106], [156, 132], [164, 132]]);
  duct([[100, 66], [100, 56], [130, 40]]);
  // Furniture silhouettes to make each room readable.
  c.ellipse(90, 182, 10, 10, C('blood', 0.5)); // furnace
  c.rect(220, 176, 14, 14, C('beige', 0.95)); // washing machine
  c.rect(60, 126, 16, 20, C('beige', 0.98)); // fridge
  c.rect(84, 136, 40, 3, C('wood', 0.4)); // counter
  c.rect(176, 134, 34, 10, C('green', 0.45)); // couch
  c.rect(244, 122, 18, 24, C('blood', 0.5)); // fireplace
  c.ellipse(253, 140, 4, 3, G('yellow', 1));
  c.rect(70, 92, 20, 8, C('sky', 0.6)); // bed
  c.rect(200, 98, 40, 2, G('red', 1)); // the lava floor
  c.rect(110, 46, 12, 10, C('wood', 0.42)); // boxes in the attic
  c.rect(196, 48, 10, 8, C('wood', 0.42));
  // Labels.
  tinyText(c, 'BASEMENT', 136, 160, C('gray', 0.2));
  tinyText(c, 'KITCHEN', 76, 112, C('navy', 0.6));
  tinyText(c, 'LIVING ROOM', 190, 112, C('green', 0.25));
  tinyText(c, 'UPSTAIRS', 144, 68, C('blood', 0.4));
  tinyText(c, 'ATTIC', 150, 36, C('wood', 0.25));
  // Soften the middle so the tally text reads.
  c.eachOpaque((x, y, p) => mix(p, [20, 30, 60], 0.25 * (1 - Math.min(1, Math.hypot((x - 160) / 160, (y - 100) / 100)))));
  return c;
}

// ---------------------------------------------------------------------------
// Episode 2's intermission: a cut-away of the warehouse. The loading dock, the
// aisles and the big freezer downstairs; the conveyor belts and the lumber
// yard (the Lumberjack's) upstairs; a delivery truck backed up to the dock.

/** Map spots for the warehouse levels (E2M2..E2M5 are planned; see TODO.md). */
export const MAP_SPOTS_E2 = { e2m1: [72, 150], e2m2: [160, 150], e2m3: [248, 150], e2m4: [104, 90], e2m5: [234, 90] };

function intermissionWarehouse() {
  const c = new PixelCanvas(W, H);
  const seed = seedFrom('intermission-e2');
  daySky(c, seed, 178);
  // The parking lot.
  for (let y = 178; y < H; y++) for (let x = 0; x < W; x++) c.set(x, y, C('gray', 0.3 + hash2(x, y, seed) * 0.06));
  for (let x = 4; x < W; x += 24) c.rect(x, 188, 12, 2, C('yellow', 0.8));
  // The building: corrugated blue walls with a sawtooth roof.
  const x0 = 30;
  const x1 = 290;
  for (let y = 52; y < 178; y++) for (let x = x0; x < x1; x++) c.set(x, y, C('sky', x % 6 < 3 ? 0.48 : 0.42));
  for (let x = x0; x < x1; x += 52) c.poly([[x, 52], [x + 52, 52], [x + 52, 30], [x + 40, 30]], C('steel', 0.45));
  for (let x = x0; x < x1; x += 52) c.rect(x + 41, 32, 10, 18, G('tube', 0)); // skylights
  c.rect(x0 - 4, 50, x1 - x0 + 8, 3, C('steel', 0.3));
  const room = (x, y, w, h, wall, floor) => {
    c.rect(x, y, w, h, wall);
    c.rect(x, y + h - 4, w, 4, floor);
    c.frame(x - 2, y - 2, w + 4, h + 4, C('beige', 0.95));
    c.frame(x - 1, y - 1, w + 2, h + 2, C('steel', 0.25));
  };
  room(36, 120, 74, 52, C('beige', 0.8), C('concrete', 0.55)); // the loading dock
  room(118, 120, 86, 52, C('beige', 0.86), C('concrete', 0.6)); // the aisles
  room(212, 120, 72, 52, C('sky', 0.85), C('sky', 0.95)); // the big freezer
  room(36, 64, 140, 46, C('concrete', 0.72), C('steel', 0.4)); // conveyor belts
  room(184, 64, 100, 46, C('wood', 0.62), C('wood', 0.35)); // the lumber yard
  // The dock: a roll-up door and a truck backed up to it.
  c.rect(38, 136, 18, 32, C('gray', 0.85));
  for (let y = 138; y < 168; y += 4) c.rect(38, y, 18, 1, C('gray', 0.6));
  c.rect(0, 130, 34, 34, C('beige', 0.98)); // the trailer
  c.rect(0, 130, 34, 2, C('blood', 0.55));
  tinyText(c, 'CHEESE', 4, 142, C('blood', 0.55));
  c.ellipse(10, 168, 6, 6, C('gray', 0.12));
  c.ellipse(26, 168, 6, 6, C('gray', 0.12));
  c.rect(78, 152, 18, 4, C('wood', 0.55)); // a pallet
  c.rect(80, 142, 14, 10, C('wood', 0.62));
  // The aisles: pallet racks of boxes.
  for (const x of [124, 150, 176]) {
    c.rect(x, 126, 2, 42, C('orange', 0.6));
    c.rect(x + 20, 126, 2, 42, C('orange', 0.6));
    for (const y of [138, 154]) {
      c.rect(x, y, 22, 2, C('sky', 0.45));
      c.rect(x + 3, y - 9, 7, 9, C('wood', 0.62));
      c.rect(x + 11, y - 7, 8, 7, C('wood', 0.55));
    }
  }
  // The freezer: icicles and blocks of cheese on ice.
  for (let x = 214; x < 282; x += 5) c.poly([[x, 120], [x + 3, 120], [x + 1.5, 126 + (x % 3) * 2]], C('gray', 0.98));
  for (const [x, y] of [[226, 156], [244, 160], [262, 154]]) {
    c.rect(x, y, 12, 8, C('yellow', 0.8));
    c.rect(x, y, 12, 2, C('yellow', 0.95));
  }
  // Conveyor belts carrying boxes, and the lumber yard's logs and stump.
  for (const y of [84, 100]) {
    c.rect(42, y, 128, 3, C('gray', 0.25));
    for (let x = 44; x < 168; x += 6) c.set(x, y + 1, C('gray', 0.6));
    for (let x = 50; x < 166; x += 22) c.rect(x, y - 7, 9, 7, C('wood', 0.62));
  }
  for (const [x, y] of [[196, 100], [205, 100], [214, 100], [223, 100], [200.5, 92], [209.5, 92], [218.5, 92], [205, 84], [214, 84]]) {
    c.ellipse(x, y, 4.5, 4.5, C('wood', 0.3)); // a pile of logs, cut ends out
    c.ellipse(x, y, 3.2, 3.2, C('wood', 0.75));
    c.set(Math.round(x), Math.round(y), C('wood', 0.5));
  }
  c.rect(250, 90, 22, 14, C('wood', 0.4)); // a big tree stump
  c.ellipse(261, 90, 11, 3, C('wood', 0.75));
  c.rect(258, 82, 2, 9, C('steel', 0.8)); // with an axe in it
  c.rect(255, 80, 7, 3, C('steel', 0.6));
  // Vents along the roof, down the side, and between the floors.
  const duct = (pts) => {
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[i + 1];
      for (let t = 0; t <= 1; t += 0.01) c.rect(Math.round(ax + (bx - ax) * t) - 1, Math.round(ay + (by - ay) * t) - 1, 3, 3, C('steel', 0.7));
    }
  };
  duct([[286, 166], [296, 166], [296, 72], [286, 72]]);
  duct([[114, 160], [114, 116], [140, 116]]);
  duct([[180, 106], [180, 58], [240, 58]]);
  // Labels.
  tinyText(c, 'LOADING DOCK', 50, 122, C('gray', 0.25));
  tinyText(c, 'THE AISLES', 142, 122, C('gray', 0.25));
  tinyText(c, 'BIG FREEZER', 226, 130, C('navy', 0.6));
  tinyText(c, 'CONVEYOR BELTS', 76, 66, C('gray', 0.2));
  tinyText(c, 'LUMBER YARD', 212, 66, C('beige', 0.95));
  // Soften the middle so the tally text reads.
  c.eachOpaque((x, y, p) => mix(p, [20, 30, 60], 0.25 * (1 - Math.min(1, Math.hypot((x - 160) / 160, (y - 100) / 100)))));
  return c;
}

// ---------------------------------------------------------------------------
// Finale: a soft backdrop for the text crawl, and the end picture.

function finaleBackdrop() {
  const c = new PixelCanvas(W, H);
  const seed = seedFrom('finale-bg');
  // Wallpaper with little cheese wedges, dimmed so the text reads.
  c.each((x, y) => {
    let col = mix(C('navy', 0.55), C('navy', 0.75), y / H);
    if ((x + (Math.floor(y / 20) % 2) * 10) % 20 < 6 && y % 20 < 5 && (x % 20) + (y % 20) < 22) col = mix(col, C('yellow', 0.6), 0.25);
    if (hash2(x, y, seed) > 0.985) col = lighten(col, 0.2);
    return col;
  });
  return c;
}

function finaleEnd() {
  const c = new PixelCanvas(W, H);
  const seed = seedFrom('finale-end');
  // The attic at sunrise: wood walls, a round window full of morning sun.
  const wall = fbm(seed, 128, { cells: 4, octaves: 3 });
  c.each((x, y) => C('wood', 0.42 + wall(x % 128, y % 128) * 0.12 + (x % 24 === 0 ? -0.15 : 0)));
  for (let y = 0; y < 12; y++) for (let x = 0; x < W; x++) c.set(x, y, C('wood', 0.3));
  c.ellipse(250, 52, 34, 34, C('beige', 0.98));
  for (let y = 22; y < 84; y++) {
    for (let x = 220; x < 282; x++) {
      if (Math.hypot(x - 250, y - 52) > 30) continue;
      c.set(x, y, ramp([[0, [255, 200, 150]], [0.5, [255, 226, 160]], [1, [180, 220, 255]]], 1 - (y - 22) / 62));
    }
  }
  c.rect(249, 22, 2, 60, C('beige', 0.98));
  c.rect(220, 51, 60, 2, C('beige', 0.98));
  glow(c, 250, 52, 70, [255, 230, 170], 0.35);
  // The floor.
  for (let y = 150; y < H; y++) for (let x = 0; x < W; x++) c.set(x, y, C('wood', y % 8 === 0 ? 0.35 : 0.55 + hash2(Math.floor(x / 32), Math.floor(y / 8), 3) * 0.1));
  // Dad, fast asleep on the floor (the last frame of his sheet).
  const dad = dadFrame(
    { lean: 3, headTilt: 3, armL: { spread: 80, swing: 0, bend: 20 }, armR: { spread: 70, swing: 0, bend: 20 }, legL: { thigh: 8, knee: 14, spread: 10 }, legR: { thigh: -6, knee: 4, spread: 10 }, fall: 1.57 },
    { eyes: 'closed', mug: false, zzz: 2 },
  );
  c.blit(dad, 4, 56);
  // The zombie rat standing proud on a wheel of cheese, bone shotgun in the air.
  const m = new Model(W, H, { seed: 900 });
  m.capsule(176, 180, 0, 252, 180, 0, 12, 12, C('yellow', 0.72), { ...MAT.brass, spec: 0.5 });
  m.ellipsoid(176, 180, 0, 12, 12, 12, C('yellow', 0.72), { ...MAT.brass, spec: 0.5 });
  m.slab(ellipse(214, 170, 44, 9), 14, C('yellow', 0.95), { ...MAT.brass, spec: 0.5 }, { tilt: [0, -2.2], bevel: 2 });
  m.ellipsoid(214, 150, 16, 17, 16, 12, mix(C('toxic', 0.62), C('gray', 0.6), 0.3), MAT.fur); // the rat's body
  for (const [x, y] of [[186, 182], [204, 186], [228, 185], [244, 180]]) {
    m.dent(x, y, 3, 2, 1.5);
    m.paint(x, y, 2.4, 1.6, C('yellow', 0.5));
  }
  const out = m.render({ light: [0.5, -0.5, 0.7], ambient: 0.45 });
  c.blit(out, 0, 0);
  const face = ratFace({ expr: 'grin' }, 2.4);
  c.blit(face, 214 - face.w / 2, 150 - face.h + 10);
  // A raised paw holding the bone shotgun up high.
  const shot = new Model(W, H, { seed: 901 });
  shot.capsule(230, 130, 6, 246, 104, 8, 4, 3, mix(C('toxic', 0.62), C('gray', 0.6), 0.3), MAT.fur);
  shot.capsule(236, 112, 10, 270, 78, 10, 3.6, 2.6, C('beige', 0.88), MAT.bone);
  for (const [x, y] of [[236, 112], [270, 78]]) shot.sphere(x, y, 12, 3.4, C('beige', 0.88), MAT.bone);
  shot.sphere(246, 104, 14, 4, mix(C('flesh', 0.62), C('toxic', 0.6), 0.2), MAT.flesh);
  c.blit(shot.render({ light: [0.5, -0.5, 0.7], ambient: 0.45 }), 0, 0);
  // Confetti.
  const r = rng(seed);
  for (let k = 0; k < 80; k++) {
    const x = r.int(110, 318);
    const y = r.int(14, 150);
    c.rect(x, y, 2, 1, r.pick([C('blood', 0.62), C('sky', 0.62), C('yellow', 0.85), C('green', 0.62), C('purple', 0.62)]));
  }
  return c;
}

export default [
  { name: 'title', out: U('title'), draw: title, dither: 'fs' },
  { name: 'intermission', out: U('intermission'), draw: intermission, dither: 'fs' },
  { name: 'intermission-e2', out: U('intermission-e2'), draw: intermissionWarehouse, dither: 'fs' },
  { name: 'finale-bg', out: U('finale-bg'), draw: finaleBackdrop, dither: 'fs' },
  { name: 'finale-end', out: U('finale-end'), draw: finaleEnd, dither: 'fs' },
];

