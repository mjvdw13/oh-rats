// Effects and projectiles: dust puffs, fur tufts, zombie goo, fizzy
// explosions, sparkly pop-in dust, spitballs, mousetraps, junk balls, soda
// rockets and the Mega Microwave's blast. Glowing bits use fullbright colours.
import { PixelCanvas } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT } from '../lib/model.js';
import { sheet, flash } from '../lib/sprite.js';
import { fbm, hash2, rng } from '../lib/noise.js';
import { mousetrap } from './dad.js';
import { can } from './items.js';

const F = (name) => `assets/sprites/fx/${name}.png`;
const RENDER = { light: [-0.5, -0.65, 0.58], ambient: 0.38, aoStrength: 0.4 };

/** Noisy fire ball. palette: array of colours from hot core to cool rim. */
function fireBlob(c, x, y, r, seed, palette, { density = 1, holes = 0 } = {}) {
  const n = fbm(seed, 64, { cells: 4, octaves: 3 });
  for (let yy = Math.floor(y - r - 2); yy <= Math.ceil(y + r + 2); yy++) {
    for (let xx = Math.floor(x - r - 2); xx <= Math.ceil(x + r + 2); xx++) {
      const d = Math.hypot(xx + 0.5 - x, yy + 0.5 - y) / r;
      const v = n((((xx * 2) % 64) + 64) % 64, (((yy * 2) % 64) + 64) % 64);
      const t = d + (v - 0.5) * 0.7;
      if (t > density) continue;
      if (holes && v < holes && d > 0.3) continue;
      const k = Math.min(palette.length - 1, Math.max(0, Math.floor((t / density) * palette.length)));
      c.set(xx, yy, palette[k]);
    }
  }
}

const FIRE = [[255, 255, 255], G('yellow', 0.85), G('yellow', 0.55), G('yellow', 0.3), G('yellow', 0), G('red', 0.5)];
// Soda fizz: white foam with a warm, sugary glow.
const FIZZ = [[255, 255, 255], G('pale', 1), G('lamp', 1), G('yellow', 0.85), G('lamp', 0.5), G('lamp', 0)];
const GREEN = [[255, 255, 255], G('green', 1), G('green', 0.65), G('green', 0.35), G('green', 0)];
const ZAP = [[255, 255, 255], G('pale', 1), G('purple', 1), G('magenta', 1), G('purple', 0), G('magenta', 0)];

function smoke(c, x, y, r, seed, t = 0.4) {
  const n = fbm(seed, 64, { cells: 3, octaves: 3 });
  for (let yy = Math.floor(y - r); yy <= Math.ceil(y + r); yy++) {
    for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++) {
      const d = Math.hypot(xx + 0.5 - x, yy + 0.5 - y) / r;
      const v = n((xx + 64) % 64, (yy + 64) % 64);
      if (d + (v - 0.5) * 0.8 > 1) continue;
      if (hash2(xx, yy, seed) > 0.75 + d * 0.2) continue;
      c.set(xx, yy, C('gray', t * (0.6 + v * 0.6)));
    }
  }
}

function puff() {
  return sheet([0, 1, 2, 3].map((f) => {
    const c = new PixelCanvas(16, 16);
    if (f < 2) fireBlob(c, 8, 8, 2.5 + f, 3 + f, [[255, 255, 255], G('yellow', 0.8), G('yellow', 0.4)]);
    if (f >= 1) smoke(c, 8, 8 - f, 2 + f * 1.4, 9 + f, 0.75 - f * 0.08);
    return c;
  }));
}

/** Little bits flying out from a hit: fur tufts, zombie goo. */
function bits(cols, seed) {
  return sheet([0, 1, 2].map((f) => {
    const c = new PixelCanvas(16, 16);
    const r = rng(seed + f);
    for (let k = 0; k < 9 + f * 2; k++) {
      const a = r.range(0, Math.PI * 2);
      const d = r.range(0, 2 + f * 2.2);
      const x = 8 + Math.cos(a) * d;
      const y = 8 + Math.sin(a) * d + f;
      c.set(x, y, r.pick(cols));
      if (f < 2 && r.chance(0.5)) c.set(x + 1, y, r.pick(cols));
    }
    return c;
  }));
}

const fluff = () => bits([C('gray', 0.85), C('beige', 0.9), C('wood', 0.6)], 20);
const goo = () => bits([C('toxic', 0.75), C('toxic', 0.55), G('green', 0.6)], 24);

function explosion(size = 64, palette = FIRE, seed = 31, frames = 5) {
  const out = [];
  for (let f = 0; f < frames; f++) {
    const c = new PixelCanvas(size, size);
    const cx = size / 2;
    const cy = size / 2 + 4;
    const t = f / (frames - 1);
    if (f >= 2) smoke(c, cx, cy - f * 2, size * (0.18 + t * 0.2), seed + f, 1.15 - t * 0.2);
    fireBlob(c, cx, cy, size * (0.16 + t * 0.2), seed + f * 3, palette.slice(Math.min(2, f)), { density: 1 - t * 0.25, holes: t * 0.45 });
    out.push(c);
  }
  return out;
}

/** Sparkly dust: things popping in out of nowhere. */
function teleportFog() {
  return sheet([0, 1, 2, 3, 4, 5].map((f) => {
    const c = new PixelCanvas(48, 64);
    const r = rng(60 + f);
    const spread = 6 + f * 2.5;
    if (f < 3) smoke(c, 24, 52, 8 + f * 4, 70 + f, 0.85);
    for (let k = 0; k < 40 - f * 4; k++) {
      const x = 24 + r.range(-spread, spread);
      const y = 60 - r.range(0, 46) * (0.4 + f * 0.1);
      c.set(x, y, r.chance(0.4) ? G('pale', 1) : G('yellow', 0.85));
    }
    for (let k = 0; k < 5 - Math.floor(f / 2); k++) {
      const x = 24 + r.range(-spread, spread);
      const y = 56 - r.range(0, 40);
      for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-2, 0], [2, 0], [0, -2], [0, 2]]) {
        c.set(x + dx, y + dy, Math.abs(dx) + Math.abs(dy) > 1 ? G('yellow', 0.7) : G('pale', 1));
      }
    }
    return c;
  }));
}

/** The Spitball Rat's soggy green spitball. */
function spitball() {
  const fly = [0, 1].map((f) => {
    const m = new Model(32, 32, { seed: 80 + f });
    m.ellipsoid(16, 16, 0, 5 + f * 0.5, 4.6 - f * 0.4, 4, C('toxic', 0.7), { ...MAT.flesh, spec: 0.6 });
    m.paint(14, 14, 1.4, 1, C('toxic', 0.9));
    const c = m.render(RENDER);
    c.set(13, 13, G('pale', 1));
    return c;
  });
  return sheet([...fly, ...explosion(32, GREEN, 83, 3)]);
}

/** Dad's mousetrap, spinning end over end, then SNAP. */
function mousetrapShot() {
  const spin = [0, 1, 2, 3].map((f) => {
    const m = new Model(32, 32, { seed: 85 });
    mousetrap(m, 16, 16, 4, 1.1 - Math.abs(Math.sin((f / 4) * Math.PI)) * 0.45);
    return m.render(RENDER);
  });
  const snap = [0, 1, 2].map((f) => {
    const c = new PixelCanvas(32, 32);
    const r = rng(87 + f);
    if (f < 2) flash(c, 16, 18, 6 + f * 4, G('pale', 1), G('yellow', 0.8), 3 + f);
    for (let k = 0; k < 14; k++) {
      const a = r.range(0, Math.PI * 2);
      const d = r.range(2, 5 + f * 4);
      c.set(16 + Math.cos(a) * d, 18 + Math.sin(a) * d * 0.7, r.pick([C('wood', 0.62), C('steel', 0.85), C('yellow', 0.8)]));
    }
    return c;
  });
  return sheet([...spin, ...snap]);
}

/** The Pack Rat's lobbed ball of junk. */
function junkBall() {
  const cols = [C('blood', 0.6), C('sky', 0.6), C('yellow', 0.8), C('green', 0.6)];
  const spin = [0, 1, 2, 3].map((f) => {
    const m = new Model(32, 32, { seed: 95 });
    const a = (f / 4) * Math.PI * 2;
    m.sphere(16, 17, 0, 7, C('gray', 0.62), MAT.cloth);
    for (let k = 0; k < 4; k++) {
      const b = a + k * (Math.PI / 2);
      m.paint(16 + Math.cos(b) * 4, 17 + Math.sin(b) * 3, 1.8, 1.6, cols[k]);
    }
    m.capsule(16 + Math.cos(a) * 6, 17 + Math.sin(a) * 6, 6, 16 + Math.cos(a) * 9, 17 + Math.sin(a) * 9, 6, 0.6, 0.6, C('steel', 0.8), MAT.metal);
    return m.render(RENDER);
  });
  const crash = [0, 1, 2].map((f) => {
    const c = new PixelCanvas(32, 32);
    const r = rng(97 + f);
    for (let k = 0; k < 40; k++) {
      const a = r.range(0, Math.PI * 2);
      const d = r.range(0, 4 + f * 4);
      c.set(16 + Math.cos(a) * d, 20 + Math.sin(a) * d * 0.6 + f, r.pick([C('gray', 0.62), C('steel', 0.8), ...cols]));
    }
    return c;
  });
  return sheet([...spin, ...crash]);
}

/** The Soda Bazooka's shaken soda can, riding a trail of fizz. */
function sodaRocket() {
  const fly = [0, 1].map((f) => {
    const c = new PixelCanvas(64, 64);
    fireBlob(c, 32, 33, 7 + f * 1.5, 110 + f, FIZZ, { holes: 0.3 });
    const m = new Model(64, 64, { seed: 111 });
    can(m, 32, 25, 35, 4.6);
    c.blit(m.render(RENDER), 0, 0);
    return c;
  });
  return sheet([...fly, ...explosion(64, FIZZ, 131, 4)]);
}

/** The Mega Microwave's crackling ball of energy. */
function microwaveBlast() {
  const fly = [0, 1].map((f) => {
    const c = new PixelCanvas(64, 64);
    fireBlob(c, 32, 32, 15 + f * 2, 140 + f, ZAP, { holes: 0.15 });
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + f;
      let x = 32;
      let y = 32;
      for (let s = 0; s < 18; s++) {
        x += Math.cos(a + Math.sin(s * 1.7 + k) * 0.8);
        y += Math.sin(a + Math.sin(s * 1.7 + k) * 0.8);
        if (s > 10) c.set(x, y, G('pale', 1));
      }
    }
    return c;
  });
  return sheet([...fly, ...explosion(64, ZAP, 151, 5)]);
}

export default [
  { name: 'puff', out: F('puff'), draw: puff },
  { name: 'fluff', out: F('fluff'), draw: fluff },
  { name: 'goo', out: F('goo'), draw: goo },
  { name: 'explosion', out: F('explosion'), draw: () => sheet(explosion(64, FIZZ, 31, 5)) },
  { name: 'teleport-fog', out: F('teleport-fog'), draw: teleportFog },
  { name: 'spitball', out: F('spitball'), draw: spitball, dither: 'fs' },
  { name: 'mousetrap', out: F('mousetrap'), draw: mousetrapShot, dither: 'fs' },
  { name: 'junk-ball', out: F('junk-ball'), draw: junkBall, dither: 'fs' },
  { name: 'soda-rocket', out: F('soda-rocket'), draw: sodaRocket },
  { name: 'microwave-blast', out: F('microwave-blast'), draw: microwaveBlast },
];

export { fireBlob, smoke, FIRE, FIZZ, ZAP };
