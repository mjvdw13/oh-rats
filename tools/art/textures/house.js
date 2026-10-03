// The house: wallpapers, kitchen and bathroom tile, the fireplace, windows
// onto a sunny day, wood floors, rugs, the playroom's "the floor is LAVA",
// ceilings, and the mouse hole that takes you to the next level.
import {
  texture, noiseFill, speckle, bevel, tinyText, tinyTextWidth,
  wset, C, mix, darken, lighten, fbm, hash2, PixelCanvas,
} from '../lib/tex.js';
import { G } from '../lib/pal.js';

const T = (name) => `assets/textures/${name}.png`;

// ------------------------------------------------------------------ helpers

/** White skirting board along the bottom of a wall. */
function baseboard(c, col = C('beige', 0.92), h = 7) {
  const y0 = 64 - h;
  c.rect(0, y0, 64, h, col);
  c.rect(0, y0, 64, 1, lighten(col, 0.3));
  c.rect(0, y0 + 2, 64, 1, darken(col, 0.12));
  c.rect(0, 63, 64, 1, darken(col, 0.35));
}

/** A thin moulding along the top of a wall. */
function crown(c, col = C('beige', 0.9)) {
  c.rect(0, 0, 64, 3, col);
  c.rect(0, 2, 64, 1, darken(col, 0.25));
  c.rect(0, 0, 64, 1, lighten(col, 0.3));
}

/** Flat paper with a very soft mottle. */
function paper(name, col) {
  const t = texture(name);
  noiseFill(t.c, t.seed, darken(col, 0.06), lighten(col, 0.04), { cells: 4, grain: 0.12, contrast: 0.8 });
  return t;
}

/** A tiny repeating motif stamped on a lattice (offset every other row). */
function lattice(c, step, draw) {
  for (let gy = 0; gy * step < 64; gy++) {
    for (let gx = 0; gx * step < 64; gx++) draw(gx * step + (gy % 2 ? step / 2 : 0), gy * step + step / 2);
  }
}

/** A little five-petal flower. */
function flower(c, x, y, petal, middle) {
  for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) wset(c, x + dx, y + dy, petal);
  wset(c, x, y, middle);
}

// ------------------------------------------------------------------ wallpapers

function wallpaperBlue() {
  const { c } = paper('wallpaper-blue', C('sky', 0.62));
  lattice(c, 16, (x, y) => {
    flower(c, x, y, C('beige', 0.95), C('yellow', 0.8));
    wset(c, x - 3, y + 2, C('green', 0.55));
    wset(c, x + 3, y + 2, C('green', 0.55));
  });
  crown(c);
  baseboard(c);
  return c;
}

function wallpaperStripe() {
  const { c } = paper('wallpaper-stripe', C('beige', 0.88));
  c.eachOpaque((x, y, p) => {
    const k = x % 16;
    if (k >= 2 && k < 6) return mix(p, C('green', 0.62), 0.75);
    if (k === 7 || k === 15) return mix(p, C('green', 0.5), 0.35);
    return undefined;
  });
  crown(c);
  baseboard(c, C('wood', 0.45));
  return c;
}

function wallpaperPink() {
  const { c } = paper('wallpaper-pink', C('flesh', 0.78));
  lattice(c, 16, (x, y) => {
    // Little hearts.
    for (const [dx, dy] of [[-1, -1], [1, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) {
      wset(c, x + dx, y + dy, C('blood', 0.72));
    }
  });
  lattice(c, 16, (x, y) => flower(c, x + 8, y + 8, C('beige', 0.95), C('yellow', 0.85)));
  crown(c);
  baseboard(c);
  return c;
}

function wallpaperKids() {
  const { c } = paper('wallpaper-kids', C('yellow', 0.86));
  const cols = [C('blood', 0.7), C('sky', 0.6), C('green', 0.65), C('purple', 0.6), C('orange', 0.7)];
  // Polka dots and stars in bright colours.
  lattice(c, 16, (x, y) => {
    const col = cols[Math.floor(hash2(x, y, 5) * cols.length)];
    c.ellipse(x, y, 2.4, 2.4, col);
  });
  lattice(c, 16, (x, y) => {
    const sx = x + 8;
    const sy = y + 8;
    const col = cols[Math.floor(hash2(sx, sy, 9) * cols.length)];
    for (let k = -2; k <= 2; k++) {
      wset(c, sx + k, sy, col);
      wset(c, sx, sy + k, col);
    }
    wset(c, sx - 1, sy - 1, col);
    wset(c, sx + 1, sy + 1, col);
    wset(c, sx + 1, sy - 1, col);
    wset(c, sx - 1, sy + 1, col);
  });
  // A crayon scribble a kid left behind.
  for (let x = 6; x < 30; x++) c.set(x, 46 + Math.round(Math.sin(x * 0.8) * 2), C('purple', 0.5));
  crown(c, C('sky', 0.8));
  baseboard(c, C('sky', 0.78));
  return c;
}

function wainscot() {
  const { c } = paper('wainscot', C('green', 0.7));
  c.eachOpaque((x, y, p) => (x % 8 < 1 ? darken(p, 0.08) : undefined));
  // Wood panelling on the bottom half with a chair rail.
  for (let y = 30; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const grain = Math.sin(y * 0.2 + Math.sin(x * 0.3) * 1.2) * 0.03;
      c.set(x, y, C('wood', 0.52 + grain + (hash2(x, y, 3) - 0.5) * 0.04));
    }
  }
  for (const x of [0, 32]) bevel(c, x + 4, 36, 24, 20, C('wood', 0.5), { depth: 1, fill: false });
  c.rect(0, 28, 64, 3, C('wood', 0.62));
  c.rect(0, 28, 64, 1, C('wood', 0.78));
  c.rect(0, 31, 64, 1, C('wood', 0.3));
  crown(c);
  baseboard(c, C('wood', 0.35));
  return c;
}

function woodPanel() {
  const { c, seed } = texture('wood-panel');
  for (let x = 0; x < 64; x++) {
    const plank = Math.floor(x / 8);
    const tone = hash2(plank, 1, seed) * 0.12;
    for (let y = 0; y < 64; y++) {
      const grain = Math.sin(y * 0.15 + plank * 3 + Math.sin(y * 0.05 + x) * 0.8) * 0.04;
      c.set(x, y, C('wood', 0.42 + tone + grain + (hash2(x, y, seed) - 0.5) * 0.03));
    }
    if (x % 8 === 0) for (let y = 0; y < 64; y++) c.set(x, y, C('wood', 0.22));
    if (x % 8 === 1) for (let y = 0; y < 64; y++) c.set(x, y, C('wood', 0.62));
  }
  baseboard(c, C('wood', 0.3), 5);
  return c;
}

// ------------------------------------------------------------------ kitchen and bathroom

function tiles(c, { w, h, col, grout, stagger = false, x0 = 0, y0 = 0, y1 = 64, seed = 1 }) {
  for (let y = y0; y < y1; y++) {
    const row = Math.floor((y - y0) / h);
    const off = stagger && row % 2 ? w / 2 : 0;
    for (let x = x0; x < 64; x++) {
      const tx = (x - x0 + off) % w;
      const ty = (y - y0) % h;
      if (tx === 0 || ty === 0) {
        c.set(x, y, grout);
        continue;
      }
      let p = mix(col, lighten(col, 0.1), hash2(Math.floor((x - x0 + off) / w), row, seed) * 0.6);
      if (ty === 1 || tx === 1) p = lighten(p, 0.25);
      if (ty === h - 1 || tx === w - 1) p = darken(p, 0.1);
      c.set(x, y, p);
    }
  }
}

function kitchenTile() {
  const { c, seed } = texture('kitchen-tile');
  tiles(c, { w: 16, h: 8, col: C('beige', 0.94), grout: C('gray', 0.7), stagger: true, seed });
  // A cheerful blue band.
  tiles(c, { w: 8, h: 8, col: C('sky', 0.55), grout: C('gray', 0.7), y0: 24, y1: 32, seed: seed + 1 });
  baseboard(c, C('beige', 0.85), 5);
  return c;
}

function kitchenCabinet() {
  const { c, seed } = texture('kitchen-cabinet');
  // Backsplash.
  tiles(c, { w: 16, h: 8, col: C('beige', 0.94), grout: C('gray', 0.7), stagger: true, seed, y0: 0, y1: 30 });
  // Upper cabinet strip at the very top.
  for (let y = 0; y < 10; y++) for (let x = 0; x < 64; x++) c.set(x, y, C('sky', 0.72 - (y === 9 ? 0.2 : 0)));
  for (const x of [0, 32]) bevel(c, x + 2, 0, 28, 8, C('sky', 0.7), { depth: 1, fill: false });
  // A toaster on the counter.
  bevel(c, 40, 18, 14, 10, C('steel', 0.72), { depth: 1 });
  c.rect(43, 18, 3, 1, C('gray', 0.1));
  c.rect(48, 18, 3, 1, C('gray', 0.1));
  c.rect(53, 22, 2, 2, C('gray', 0.2));
  // Countertop.
  c.rect(0, 28, 64, 4, C('gray', 0.55));
  c.rect(0, 28, 64, 1, C('gray', 0.8));
  c.rect(0, 31, 64, 1, C('gray', 0.3));
  speckle(c, seed, 0.02, 0.2);
  // Lower cabinet doors with knobs.
  for (let y = 32; y < 64; y++) for (let x = 0; x < 64; x++) c.set(x, y, C('sky', 0.66));
  for (const x of [0, 32]) {
    bevel(c, x + 2, 34, 28, 24, C('sky', 0.68), { depth: 1 });
    bevel(c, x + 6, 38, 20, 16, C('sky', 0.64), { depth: 1, fill: false });
  }
  for (const x of [27, 37]) {
    c.rect(x, 44, 2, 3, C('yellow', 0.7));
    c.set(x, 44, C('yellow', 0.95));
  }
  c.rect(0, 59, 64, 5, C('gray', 0.18)); // toe kick
  return c;
}

function fridge() {
  const { c, seed } = texture('fridge');
  noiseFill(c, seed, C('beige', 0.9), C('gray', 0.92), { cells: 2, grain: 0.05, contrast: 0.6 });
  // Freezer and fridge doors.
  bevel(c, 2, 2, 60, 20, C('beige', 0.92), { depth: 1, fill: false });
  bevel(c, 2, 24, 60, 38, C('beige', 0.92), { depth: 1, fill: false });
  for (const [y, h] of [[6, 12], [28, 20]]) {
    c.rect(54, y, 3, h, C('steel', 0.75));
    c.rect(56, y, 1, h, C('steel', 0.45));
  }
  // Magnets and a kid's drawing of the house (with a rat in it).
  bevel(c, 10, 30, 20, 16, C('beige', 0.98), { depth: 1 });
  c.poly([[13, 39], [19, 34], [25, 39]], C('blood', 0.6));
  c.rect(14, 39, 10, 5, C('yellow', 0.7));
  c.rect(18, 41, 2, 3, C('wood', 0.4));
  c.ellipse(27, 43, 1.6, 1, C('gray', 0.5)); // the rat
  c.set(29, 44, C('flesh', 0.6));
  c.ellipse(20, 30, 2, 2, C('blood', 0.6));
  for (const [x, y, col] of [[40, 8, C('sky', 0.6)], [34, 12, C('green', 0.6)], [42, 34, C('orange', 0.7)], [36, 50, C('purple', 0.6)]]) {
    c.ellipse(x, y, 2.5, 2.5, col);
    c.set(x - 1, y - 1, lighten(col, 0.4));
  }
  c.rect(0, 62, 64, 2, C('gray', 0.25));
  return c;
}

function stove() {
  const { c, seed } = texture('stove');
  noiseFill(c, seed, C('beige', 0.88), C('gray', 0.9), { cells: 2, grain: 0.05, contrast: 0.6 });
  // Control panel with knobs.
  bevel(c, 0, 0, 64, 12, C('gray', 0.3), { depth: 1 });
  for (let x = 8; x < 60; x += 12) {
    c.ellipse(x, 6, 3, 3, C('gray', 0.85));
    c.rect(x, 3, 1, 3, C('gray', 0.2));
  }
  // Oven door with a window.
  bevel(c, 4, 16, 56, 40, C('beige', 0.86), { depth: 1 });
  c.rect(8, 15, 48, 3, C('steel', 0.75)); // handle
  bevel(c, 12, 24, 40, 24, C('gray', 0.15), { depth: 1 });
  for (let y = 26; y < 46; y++) for (let x = 14; x < 50; x++) c.set(x, y, mix(C('gray', 0.08), G('lamp', 0), (y - 26) / 40));
  c.rect(14, 26, 36, 1, C('gray', 0.4));
  c.rect(0, 58, 64, 6, C('gray', 0.2));
  return c;
}

function bathroomTile() {
  const { c, seed } = texture('bathroom-tile');
  tiles(c, { w: 8, h: 8, col: C('sky', 0.78), grout: C('beige', 0.95), seed });
  tiles(c, { w: 8, h: 4, col: C('navy', 0.7), grout: C('beige', 0.95), y0: 40, y1: 44, seed: seed + 2 });
  baseboard(c, C('beige', 0.92), 4);
  return c;
}

// ------------------------------------------------------------------ living room

function brick() {
  const { c, seed } = texture('brick');
  for (let y = 0; y < 64; y++) {
    const row = Math.floor(y / 8);
    const off = row % 2 ? 8 : 0;
    for (let x = 0; x < 64; x++) {
      const inX = (x + off) % 16;
      const inY = y % 8;
      if (inY === 0 || inX === 0) {
        c.set(x, y, C('beige', 0.7));
        continue;
      }
      let col = mix(C('blood', 0.48), C('orange', 0.42), hash2(Math.floor((x + off) / 16), row, seed));
      if (inY === 1) col = lighten(col, 0.12);
      if (inY === 7) col = darken(col, 0.2);
      c.set(x, y, mix(col, C('wood', 0.3), hash2(x, y, seed + 4) * 0.15));
    }
  }
  return c;
}

function fireplace() {
  const out = new PixelCanvas(64 * 3, 64);
  const base = brick();
  for (let f = 0; f < 3; f++) {
    const c = base.clone();
    // Mantel.
    c.rect(0, 6, 64, 5, C('wood', 0.45));
    c.rect(0, 6, 64, 1, C('wood', 0.7));
    c.rect(0, 10, 64, 1, C('wood', 0.2));
    // A candle and a photo on the mantel.
    c.rect(10, 1, 3, 5, C('beige', 0.95));
    c.set(11, 0, G('yellow', f === 1 ? 1 : 0.7));
    bevel(c, 44, 0, 10, 6, C('wood', 0.3), { depth: 1 });
    c.rect(46, 1, 6, 4, C('sky', 0.6));
    // Firebox arch.
    for (let y = 22; y < 60; y++) {
      for (let x = 12; x < 52; x++) {
        const dx = (x - 32) / 20;
        const dy = (y - 34) / 12;
        if (y < 34 && dx * dx + dy * dy > 1) continue;
        c.set(x, y, C('gray', 0.06));
      }
    }
    // Logs and flames (fullbright so the fire glows).
    c.rect(18, 54, 28, 4, C('wood', 0.25));
    c.rect(22, 52, 20, 2, C('wood', 0.35));
    for (let y = 30; y < 54; y++) {
      for (let x = 16; x < 48; x++) {
        const h = hash2(x, y + f * 7, 11);
        const flame = 1 - Math.abs(x - 32) / 16 - (54 - y) / 26 + Math.sin(x * 0.9 + f * 2) * 0.12 + h * 0.25;
        if (flame > 0.75) c.set(x, y, G('yellow', 0.9));
        else if (flame > 0.5) c.set(x, y, G('yellow', 0.4));
        else if (flame > 0.3) c.set(x, y, G('red', 1));
      }
    }
    c.rect(10, 60, 44, 4, C('gray', 0.35)); // hearth
    out.blit(c, f * 64, 0);
  }
  return out;
}

function bookshelf() {
  const { c, seed } = texture('bookshelf');
  c.fill(C('wood', 0.3));
  const spines = [C('blood', 0.55), C('sky', 0.5), C('green', 0.5), C('yellow', 0.7), C('purple', 0.5), C('orange', 0.6), C('navy', 0.7), C('beige', 0.85)];
  for (const sy of [3, 23, 43]) {
    let x = 2;
    while (x < 62) {
      const w = 3 + Math.floor(hash2(x, sy, seed) * 3);
      const h = 14 + Math.floor(hash2(x, sy, seed + 1) * 4);
      const col = spines[Math.floor(hash2(x, sy, seed + 2) * spines.length)];
      const ww = Math.min(w, 62 - x);
      c.rect(x, sy + 18 - h, ww, h, col);
      c.rect(x, sy + 18 - h, 1, h, lighten(col, 0.25));
      c.rect(x, sy + 18 - h + 3, ww, 1, lighten(col, 0.4));
      x += ww;
    }
    c.rect(0, sy + 18, 64, 2, C('wood', 0.5));
    c.rect(0, sy + 18, 64, 1, C('wood', 0.7));
  }
  c.rect(0, 0, 2, 64, C('wood', 0.45));
  c.rect(62, 0, 2, 64, C('wood', 0.22));
  return c;
}

function windowDay() {
  const { c } = paper('window-day', C('beige', 0.88));
  // Sky, a cloud, the lawn and a tree outside.
  for (let y = 10; y < 50; y++) {
    for (let x = 12; x < 52; x++) c.set(x, y, mix(C('sky', 0.82), C('sky', 0.6), (y - 10) / 40));
  }
  for (const [x, y, rx] of [[22, 18, 6], [28, 16, 5], [33, 19, 5]]) c.ellipse(x, y, rx, 3, C('gray', 0.97));
  for (let y = 40; y < 50; y++) for (let x = 12; x < 52; x++) c.set(x, y, C('green', 0.55 + hash2(x, y, 4) * 0.12));
  c.rect(42, 28, 2, 13, C('wood', 0.3));
  c.ellipse(43, 25, 6, 6, C('green', 0.42));
  c.ellipse(41, 23, 3, 3, C('green', 0.6));
  // Window frame and cross bars.
  bevel(c, 10, 8, 44, 44, C('beige', 0.98), { depth: 2, fill: false });
  c.rect(31, 10, 2, 40, C('beige', 0.98));
  c.rect(12, 29, 40, 2, C('beige', 0.98));
  // Curtains.
  for (const x0 of [4, 51]) {
    for (let x = 0; x < 9; x++) {
      for (let y = 4; y < 58; y++) c.set(x0 + x, y, C('blood', 0.62 + Math.sin(x * 1.3) * 0.08));
    }
  }
  c.rect(2, 2, 60, 2, C('wood', 0.4)); // curtain rod
  crown(c);
  baseboard(c);
  return c;
}

function picture(name, wall, drawArt) {
  const c = wall();
  bevel(c, 14, 10, 36, 40, C('yellow', 0.6), { depth: 2 });
  c.rect(17, 13, 30, 34, C('beige', 0.92));
  drawArt(c);
  return c;
}

function dadPortrait(c) {
  // DAD: big round face, glasses, moustache, thinning hair. You'll meet him.
  c.rect(17, 13, 30, 34, C('sky', 0.7));
  c.ellipse(32, 46, 13, 7, C('sky', 0.3)); // shirt
  c.ellipse(32, 29, 9, 11, C('skin', 0.72));
  c.ellipse(32, 20, 8, 3, C('wood', 0.25)); // hair
  c.rect(26, 27, 5, 4, C('gray', 0.15));
  c.rect(33, 27, 5, 4, C('gray', 0.15));
  c.rect(27, 28, 3, 2, C('sky', 0.85));
  c.rect(34, 28, 3, 2, C('sky', 0.85));
  c.rect(31, 28, 2, 1, C('gray', 0.15));
  c.rect(28, 34, 8, 2, C('wood', 0.25)); // moustache
  c.rect(29, 37, 6, 1, C('blood', 0.4));
  tinyText(c, 'DAD', 26, 41, C('yellow', 0.85));
}

function cheesePainting(c) {
  c.rect(17, 13, 30, 34, C('purple', 0.35));
  c.poly([[20, 40], [44, 40], [44, 30], [20, 34]], C('yellow', 0.75));
  c.poly([[20, 34], [44, 30], [38, 24]], C('yellow', 0.92));
  for (const [x, y, r] of [[26, 36, 1.6], [34, 37, 2], [40, 34, 1.2], [36, 29, 1.2]]) c.ellipse(x, y, r, r, C('yellow', 0.5));
  for (let x = 18; x < 47; x += 3) c.set(x, 16, G('pale', 1));
}

function lightSwitch(name, on) {
  const { c } = paper(name, C('beige', 0.88));
  crown(c);
  baseboard(c);
  bevel(c, 26, 22, 12, 18, C('beige', 0.98), { depth: 1 });
  c.rect(30, on ? 25 : 31, 4, 6, C('gray', 0.85));
  c.rect(30, on ? 25 : 36, 4, 1, C('gray', 0.55));
  c.set(31, 23, C('gray', 0.5));
  c.set(31, 38, C('gray', 0.5));
  if (on) c.rect(24, 18, 16, 2, G('green', 1));
  return c;
}

/** The level exit: a mouse hole in the skirting board with a sign above it. */
/** The exit. `wall(name)` draws a different wall around the hole (the warehouse uses cinder blocks). */
function mouseHole(name, on, wall) {
  let c;
  if (wall) c = wall(name);
  else {
    c = paper(name, C('beige', 0.88)).c;
    crown(c);
    baseboard(c, C('beige', 0.92), 14);
  }
  // The arched hole.
  for (let y = 36; y < 64; y++) {
    for (let x = 18; x < 46; x++) {
      const dx = (x + 0.5 - 32) / 14;
      const dy = (y + 0.5 - 50) / 14;
      if (y < 50 && dx * dx + dy * dy > 1) continue;
      const edge = y < 50 ? dx * dx + dy * dy > 0.75 : Math.abs(dx) > 0.86;
      c.set(x, y, edge ? C('wood', 0.25) : on ? mix(G('lamp', 0), C('gray', 0.04), (y - 36) / 40) : C('gray', 0.04));
    }
  }
  // A tiny hand-made sign: EXIT (lit up and cheery once used).
  const label = on ? 'GO!' : 'EXIT';
  const w = tinyTextWidth(label) + 6;
  const x0 = 32 - Math.ceil(w / 2);
  bevel(c, x0, 14, w, 11, C('wood', 0.6), { depth: 1 });
  tinyText(c, label, x0 + 3, 17, on ? G('green', 1) : C('blood', 0.5));
  c.rect(31, 25, 2, 11, C('wood', 0.35)); // the stick it's on
  return c;
}

// ------------------------------------------------------------------ floors

function woodFloor() {
  const { c, seed } = texture('wood-floor');
  for (let y = 0; y < 64; y++) {
    const row = Math.floor(y / 8);
    const off = Math.floor(hash2(row, 0, seed) * 4) * 16;
    for (let x = 0; x < 64; x++) {
      const board = Math.floor(((x + off) % 64) / 32);
      const tone = hash2(board, row, seed) * 0.14;
      const grain = Math.sin(x * 0.25 + Math.sin(y * 1.3 + x * 0.05) * 1.5 + row) * 0.035;
      let col = C('wood', 0.5 + tone + grain + (hash2(x, y, seed) - 0.5) * 0.03);
      if (y % 8 === 0) col = C('wood', 0.28);
      else if (y % 8 === 1) col = lighten(col, 0.08);
      if ((x + off) % 32 === 0) col = C('wood', 0.3);
      c.set(x, y, col);
    }
  }
  return c;
}

function carpet() {
  const { c, seed } = texture('carpet');
  noiseFill(c, seed, C('sky', 0.42), C('sky', 0.52), { cells: 8, octaves: 3, grain: 0.3, contrast: 1.0 });
  c.eachOpaque((x, y, p) => ((x + y * 2) % 4 === 0 ? darken(p, 0.06) : undefined));
  speckle(c, seed, 0.1, 0.12);
  return c;
}

function rug() {
  const { c } = texture('rug');
  // A big patterned rug: red field, gold diamonds, cream border bands.
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const dx = Math.abs((x % 32) - 15.5);
      const dy = Math.abs((y % 32) - 15.5);
      const d = dx + dy;
      let col = C('blood', 0.5);
      if (d < 4) col = C('navy', 0.7);
      else if (d < 7) col = C('yellow', 0.72);
      else if (d > 13 && d < 15) col = C('beige', 0.85);
      if (hash2(x, y, 3) > 0.9) col = darken(col, 0.08);
      c.set(x, y, col);
    }
  }
  return c;
}

function checker() {
  const { c, seed } = texture('checker');
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const black = ((x >> 4) + (y >> 4)) % 2;
      let col = black ? C('gray', 0.18) : C('gray', 0.92);
      if (x % 16 === 0 || y % 16 === 0) col = darken(col, 0.15);
      c.set(x, y, mix(col, lighten(col, 0.2), hash2(x, y, seed) * 0.15));
    }
  }
  return c;
}

function bathFloor() {
  const { c, seed } = texture('bath-floor');
  c.fill(C('gray', 0.62));
  // Little hexagon-ish penny tiles.
  for (let gy = 0; gy < 8; gy++) {
    for (let gx = 0; gx < 8; gx++) {
      const cx = gx * 8 + (gy % 2 ? 4 : 0) + 4;
      const cy = gy * 8 + 4;
      const col = hash2(gx, gy, seed) > 0.92 ? C('sky', 0.6) : C('gray', 0.96);
      for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (Math.abs(x) + Math.abs(y) * 0.6 < 3.3) wset(c, cx + x, cy + y, col);
    }
  }
  return c;
}

function playmat() {
  const { c } = texture('playmat');
  // Foam alphabet tiles.
  const cols = [C('blood', 0.62), C('sky', 0.6), C('green', 0.62), C('yellow', 0.78)];
  const letters = ['A', 'B', 'C', 'D'];
  for (let ty = 0; ty < 2; ty++) {
    for (let tx = 0; tx < 2; tx++) {
      const i = (tx + ty * 2) % 4;
      c.rect(tx * 32, ty * 32, 32, 32, cols[i]);
      c.rect(tx * 32, ty * 32, 32, 1, darken(cols[i], 0.2));
      c.rect(tx * 32, ty * 32, 1, 32, darken(cols[i], 0.2));
      tinyText(c, letters[i], tx * 32 + 10, ty * 32 + 9, C('beige', 0.95), { scale: 3 });
    }
  }
  return c;
}

/** "THE FLOOR IS LAVA!" Bubbling, glowing, hurts. Animated. */
function lava() {
  const frames = 4;
  const out = new PixelCanvas(64 * frames, 64);
  const n = fbm(77, 64, { cells: 4, octaves: 3 });
  for (let f = 0; f < frames; f++) {
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const t = n((x + f * 4) % 64, (y + f * 2) % 64) + Math.sin((x + y + f * 16) * (Math.PI / 16)) * 0.08;
        let col;
        if (t > 0.66) col = G('yellow', 0.85);
        else if (t > 0.56) col = G('yellow', 0.55);
        else if (t > 0.44) col = G('yellow', 0.2);
        else if (t > 0.34) col = G('red', 1);
        else col = C('blood', 0.4);
        out.set(f * 64 + x, y, col);
      }
    }
    // Bubbles.
    for (let k = 0; k < 4; k++) {
      const bx = Math.floor(hash2(k, f, 5) * 60) + 2;
      const by = Math.floor(hash2(k, f, 6) * 60) + 2;
      out.ring(f * 64 + bx, by, 2, 1, G('yellow', 1));
    }
  }
  return out;
}

function grass() {
  const { c, seed } = texture('grass');
  noiseFill(c, seed, C('green', 0.42), C('green', 0.6), { cells: 6, grain: 0.4, contrast: 1.1 });
  c.eachOpaque((x, y, p) => (hash2(x, y, seed + 3) > 0.85 ? lighten(p, 0.18) : undefined));
  for (let i = 0; i < 4; i++) {
    const x = Math.floor(hash2(i, 1, seed) * 60) + 2;
    const y = Math.floor(hash2(i, 2, seed) * 60) + 2;
    flower(c, x, y, C('beige', 0.98), C('yellow', 0.85));
  }
  return c;
}

// ------------------------------------------------------------------ ceilings

function ceilingPlaster(name = 'ceiling-plaster') {
  const { c, seed } = texture(name);
  noiseFill(c, seed, C('beige', 0.84), C('beige', 0.92), { cells: 6, grain: 0.35, contrast: 0.9 });
  speckle(c, seed, 0.1, 0.08);
  return c;
}

function ceilingLight() {
  const c = ceilingPlaster('ceiling-light');
  c.ellipse(32, 32, 17, 17, C('beige', 0.98));
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const d = Math.hypot(x + 0.5 - 32, y + 0.5 - 32);
      if (d < 14) c.set(x, y, d < 6 ? G('pale', 1) : d < 10 ? G('lamp', 1) : G('lamp', 0.5));
    }
  }
  c.ring(32, 32, 14, 1, C('yellow', 0.65));
  return c;
}

function ceilingBeams() {
  const { c, seed } = texture('ceiling-beams');
  noiseFill(c, seed, C('beige', 0.74), C('beige', 0.82), { cells: 4, grain: 0.25 });
  for (const x0 of [0, 32]) {
    for (let x = x0; x < x0 + 10; x++) {
      for (let y = 0; y < 64; y++) {
        const grain = Math.sin(y * 0.3 + x) * 0.03;
        c.set(x, y, C('wood', (x === x0 ? 0.6 : x === x0 + 9 ? 0.25 : 0.42) + grain));
      }
    }
  }
  return c;
}

function joists() {
  const { c, r, seed } = texture('joists');
  noiseFill(c, seed, C('wood', 0.38), C('wood', 0.46), { cells: 3, grain: 0.15 });
  for (const y0 of [8, 40]) {
    for (let y = y0; y < y0 + 14; y++) {
      for (let x = 0; x < 64; x++) c.set(x, y, C('wood', y === y0 ? 0.62 : y === y0 + 13 ? 0.2 : 0.5 + Math.sin(x * 0.3 + y) * 0.03));
    }
  }
  c.rect(0, 30, 64, 3, C('orange', 0.5)); // a copper pipe
  c.rect(0, 30, 64, 1, C('orange', 0.8));
  for (let i = 0; i < 2; i++) {
    const x = r.int(4, 56);
    c.line(x, 22, x + 6, 26, C('gray', 0.85)); // cobweb
    c.line(x + 6, 22, x, 26, C('gray', 0.85));
  }
  return c;
}

export default [
  { name: 'wallpaper-blue', out: T('wallpaper-blue'), draw: wallpaperBlue },
  { name: 'wallpaper-stripe', out: T('wallpaper-stripe'), draw: wallpaperStripe },
  { name: 'wallpaper-pink', out: T('wallpaper-pink'), draw: wallpaperPink },
  { name: 'wallpaper-kids', out: T('wallpaper-kids'), draw: wallpaperKids },
  { name: 'wainscot', out: T('wainscot'), draw: wainscot },
  { name: 'wood-panel', out: T('wood-panel'), draw: woodPanel },
  { name: 'kitchen-tile', out: T('kitchen-tile'), draw: kitchenTile },
  { name: 'kitchen-cabinet', out: T('kitchen-cabinet'), draw: kitchenCabinet },
  { name: 'fridge', out: T('fridge'), draw: fridge },
  { name: 'stove', out: T('stove'), draw: stove },
  { name: 'bathroom-tile', out: T('bathroom-tile'), draw: bathroomTile },
  { name: 'brick', out: T('brick'), draw: brick },
  { name: 'fireplace', out: T('fireplace'), draw: fireplace },
  { name: 'bookshelf', out: T('bookshelf'), draw: bookshelf },
  { name: 'window-day', out: T('window-day'), draw: windowDay },
  { name: 'picture-dad', out: T('picture-dad'), draw: () => picture('picture-dad', wallpaperStripe, dadPortrait) },
  { name: 'picture-cheese', out: T('picture-cheese'), draw: () => picture('picture-cheese', wallpaperBlue, cheesePainting) },
  { name: 'light-switch', out: T('light-switch'), draw: () => lightSwitch('light-switch', false) },
  { name: 'light-switch-on', out: T('light-switch-on'), draw: () => lightSwitch('light-switch-on', true) },
  { name: 'mouse-hole', out: T('mouse-hole'), draw: () => mouseHole('mouse-hole', false) },
  { name: 'mouse-hole-on', out: T('mouse-hole-on'), draw: () => mouseHole('mouse-hole-on', true) },
  { name: 'wood-floor', out: T('wood-floor'), draw: woodFloor },
  { name: 'carpet', out: T('carpet'), draw: carpet },
  { name: 'rug', out: T('rug'), draw: rug },
  { name: 'checker', out: T('checker'), draw: checker },
  { name: 'bath-floor', out: T('bath-floor'), draw: bathFloor },
  { name: 'playmat', out: T('playmat'), draw: playmat },
  { name: 'lava', out: T('lava'), draw: lava },
  { name: 'grass', out: T('grass'), draw: grass },
  { name: 'ceiling-plaster', out: T('ceiling-plaster'), draw: () => ceilingPlaster() },
  { name: 'ceiling-light', out: T('ceiling-light'), draw: ceilingLight },
  { name: 'ceiling-beams', out: T('ceiling-beams'), draw: ceilingBeams },
  { name: 'joists', out: T('joists'), draw: joists },
];

export { baseboard, crown, paper, mouseHole };
