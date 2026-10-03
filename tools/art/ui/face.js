// The hero's status-bar face (Doom "mugshot" layout): a zombie rat with
// greenish fur, big ears, stitches, one normal eye and one glowing green
// zombie eye. As health drops it collects band-aids, more stitches and a
// bandage, and starts to look worn out. The same model, drawn bigger, is the
// portrait on the title screen.
//
// Sheet layout (24x30 frames): five rows of health tiers (healthy -> worn
// out), each with 8 frames: [look ahead, look left, look right, turn right,
// turn left, ouch, grin, angry]; then [invincible (god mode), knocked out].
import { PixelCanvas, mix, lighten, darken } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT } from '../lib/model.js';

export const FACE_W = 24;
export const FACE_H = 30;

const FUR = mix(C('toxic', 0.62), C('gray', 0.6), 0.3);
const MUZZLE = lighten(FUR, 0.3);
const PINK = mix(C('flesh', 0.62), C('toxic', 0.6), 0.2);
const FURMAT = { ...MAT.fur, grain: 0.1 };
const RENDER = { light: [-0.5, -0.6, 0.62], ambient: 0.42, aoStrength: 0.4 };

/**
 * Draw the face at scale `u` (1 = 24x30). o: { look: -2.5..2.5, expr:
 * 'idle'|'ouch'|'grin'|'angry'|'god'|'ko', tier: 0..4 }.
 */
export function ratFace(o = {}, u = 1) {
  const w = Math.round(FACE_W * u);
  const h = Math.round(FACE_H * u);
  const m = new Model(w, h, { seed: 7 });
  const tier = o.tier ?? 0;
  const look = (o.look ?? 0) * u;
  const expr = o.expr ?? 'idle';
  const fur = tier >= 3 ? darken(FUR, 0.08) : FUR;
  const cx = 12 * u + look * 0.4;
  const cy = 15 * u;
  // Shoulders, then the head with big round ears.
  m.ellipsoid(12 * u, 31 * u, -4 * u, 10 * u, 5 * u, 4 * u, fur, FURMAT);
  for (const side of [-1, 1]) {
    const ex = cx + side * 8 * u;
    const ey = 6.5 * u;
    m.ellipsoid(ex, ey, -1 * u, 4.6 * u, 4.6 * u, 1.6 * u, fur, FURMAT);
    m.paint(ex, ey, 3 * u, 3 * u, PINK, MAT.flesh);
    m.dent(ex, ey, 2.8 * u, 2.8 * u, 1);
  }
  m.ellipsoid(cx, cy, 0, 9 * u, 8.6 * u, 7 * u, fur, FURMAT);
  m.ellipsoid(12 * u + look * 0.9, 20.5 * u, 5 * u, 5 * u, 3.8 * u, 4 * u, MUZZLE, FURMAT);
  // Nose.
  const nx = 12 * u + look * 1.2;
  m.sphere(nx, 18.6 * u, 8.5 * u, 1.5 * u, PINK, MAT.flesh);
  // Mouth.
  const my = 23 * u;
  if (expr === 'ouch' || expr === 'ko') {
    m.dent(nx, my, 2 * u, 1.8 * u, 1.6);
    m.paint(nx, my, 1.8 * u, 1.6 * u, C('blood', 0.3));
    if (expr === 'ko') m.paint(nx + 0.8 * u, my + 1.2 * u, 0.9 * u, 1 * u, C('flesh', 0.6)); // tongue out
  } else if (expr === 'grin' || expr === 'god') {
    m.dent(nx, my - 0.4 * u, 3.4 * u, 1.4 * u, 1.4);
    m.paint(nx, my - 0.4 * u, 3.2 * u, 1.2 * u, C('blood', 0.35));
    m.paint(nx, my - 0.8 * u, 2.6 * u, 0.6 * u, C('beige', 0.98));
  } else if (expr === 'angry') {
    m.paint(nx, my, 2.6 * u, 0.9 * u, C('beige', 0.98));
    m.stroke(nx - 2.6 * u, my, nx + 2.6 * u, my, 0.4 * u, C('gray', 0.4));
  } else {
    // Two big buck teeth.
    m.slab([[nx - 1.4 * u, my - 0.8 * u], [nx + 1.4 * u, my - 0.8 * u], [nx + 1.4 * u, my + 1.6 * u], [nx - 1.4 * u, my + 1.6 * u]], 9 * u, C('beige', 0.98), MAT.bone, { bevel: 0.4 * u, thickness: 0.2 });
  }
  // Stitches across the forehead (always: it's a zombie).
  m.stroke(cx - 5 * u, 9.5 * u, cx + 1 * u, 11 * u, 0.5 * u, darken(fur, 0.4));
  for (let k = 0; k < 4; k++) {
    const sx = cx - 4.5 * u + k * 1.6 * u;
    const sy = 9.7 * u + k * 0.4 * u;
    m.stroke(sx, sy - 1 * u, sx + 0.3 * u, sy + 1 * u, 0.35 * u, C('gray', 0.15));
  }
  // Damage tiers.
  if (tier >= 1) {
    // A band-aid on the ear.
    m.paintPoly([[cx - 10 * u, 5 * u], [cx - 6 * u, 3 * u], [cx - 5 * u, 5 * u], [cx - 9 * u, 7 * u]], C('orange', 0.75), MAT.cloth);
  }
  if (tier >= 2) {
    // Stitches down the cheek.
    m.stroke(cx + 5 * u, 15 * u, cx + 7 * u, 21 * u, 0.5 * u, darken(fur, 0.4));
    for (let k = 0; k < 3; k++) m.stroke(cx + 4.8 * u + k * 0.7 * u, 16 * u + k * 2 * u, cx + 6.6 * u + k * 0.7 * u, 15.6 * u + k * 2 * u, 0.35 * u, C('gray', 0.15));
  }
  if (tier >= 3) {
    // A band-aid on the nose and a bandage wrapped round the head.
    m.paintPoly([[nx - 2.4 * u, 17.6 * u], [nx + 2.4 * u, 17 * u], [nx + 2.6 * u, 18.6 * u], [nx - 2.2 * u, 19.2 * u]], C('orange', 0.75), MAT.cloth);
    m.stroke(cx - 9 * u, 8 * u, cx + 9 * u, 6.5 * u, 1.6 * u, C('beige', 0.95), MAT.cloth);
  }
  if (tier >= 4) {
    // A bite out of the right ear.
    m.paint(cx + 10 * u, 3.5 * u, 1.6 * u, 1.6 * u, darken(fur, 0.5));
  }
  const c = m.render(RENDER);

  // Eyes go straight onto the pixels so they stay crisp at 24x30.
  const s = Math.max(1, Math.round(u));
  const ey = Math.round(14 * u);
  const lx = Math.round(cx - 3.6 * u + look * 0.6);
  const rx = Math.round(cx + 3.6 * u + look * 0.6);
  const block = (x, y, ww, hh, col) => c.rect(x, y, ww, hh, col);
  const droop = tier >= 4 ? s : 0;
  if (expr === 'ko') {
    for (const x of [lx, rx]) for (const [dx, dy] of [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]]) block(x + dx * s, ey + dy * s, s, s, C('gray', 0.06));
    return c;
  }
  if (expr === 'grin' || expr === 'god') {
    // Happy closed arcs (the invincible face glows gold).
    const col = expr === 'god' ? G('yellow', 1) : C('gray', 0.06);
    for (const x of [lx, rx]) {
      block(x - s, ey, s, s, col);
      block(x, ey - s, s, s, col);
      block(x + s, ey, s, s, col);
    }
    return c;
  }
  const big = expr === 'ouch';
  const size = big ? 3 * s : 2 * s;
  // Left: a regular beady black eye with a shine (wide and white when hurt).
  block(lx - s, ey - s + droop, size, size - droop, big ? C('beige', 0.98) : C('gray', 0.05));
  if (big) block(lx, ey, s, s, C('gray', 0.05));
  else block(lx - s, ey - s + droop, s, s, C('gray', 0.85));
  // Right: the glowing zombie eye.
  block(rx - s, ey - s + droop, size, size - droop, G('green', big ? 0.85 : 1));
  if (!big) block(rx, ey + droop, s, s, G('pale', 1));
  if (expr === 'angry') {
    for (const [x, dir] of [[lx, 1], [rx, -1]]) {
      for (let k = -1; k <= 1; k++) block(x + k * s, ey - 3 * s + k * dir * s, s, s, darken(fur, 0.5));
    }
  }
  return c;
}

function faceSheet() {
  const frames = [];
  for (let tier = 0; tier < 5; tier++) {
    frames.push(
      ratFace({ tier, look: 0 }),
      ratFace({ tier, look: -1 }),
      ratFace({ tier, look: 1 }),
      ratFace({ tier, look: 2.5 }),
      ratFace({ tier, look: -2.5 }),
      ratFace({ tier, expr: 'ouch' }),
      ratFace({ tier, expr: 'grin' }),
      ratFace({ tier, expr: 'angry' }),
    );
  }
  frames.push(ratFace({ expr: 'god' }), ratFace({ expr: 'ko', tier: 4 }));
  const cols = 8;
  const out = new PixelCanvas(FACE_W * cols, FACE_H * Math.ceil(frames.length / cols));
  frames.forEach((f, i) => out.blit(f, (i % cols) * FACE_W, Math.floor(i / cols) * FACE_H));
  return out;
}

export default [{ name: 'face', out: 'assets/ui/face.png', draw: faceSheet }];
