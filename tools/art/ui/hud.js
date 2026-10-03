// Status bar background, HUD key icons, the menu cursor and the favicon.
import { PixelCanvas, mix } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { hash2, seedFrom } from '../lib/noise.js';

/** Panel layout shared with src/engine/ui/hud.js (x, width). */
export const PANELS = {
  ammo: [2, 44],
  health: [48, 56],
  arms: [106, 34],
  face: [142, 36],
  armor: [180, 56],
  keys: [238, 12],
  tally: [252, 66],
};

function inset(c, x, y, w, h, fill) {
  c.rect(x, y, w, h, fill);
  c.rect(x, y, w, 1, C('wood', 0.12));
  c.rect(x, y, 1, h, C('wood', 0.14));
  c.rect(x, y + h - 1, w, 1, C('wood', 0.75));
  c.rect(x + w - 1, y, 1, h, C('wood', 0.7));
}

/** A polished wooden shelf with dark panels set into it. */
function statusBar() {
  const W = 320;
  const H = 32;
  const c = new PixelCanvas(W, H);
  const seed = seedFrom('statusbar');
  c.each((x, y) => {
    const grain = Math.sin(x * 0.07 + Math.sin(y * 0.9 + x * 0.013) * 2.2) * 0.04;
    return C('wood', 0.52 + grain + (hash2(x, y, seed) - 0.5) * 0.03);
  });
  c.rect(0, 0, W, 1, C('wood', 0.8));
  c.rect(0, 1, W, 1, C('wood', 0.65));
  c.rect(0, H - 1, W, 1, C('wood', 0.2));
  for (const [x, w] of Object.values(PANELS)) inset(c, x, 3, w, 27, C('navy', 0.25));
  // Face backdrop: a warm cheese-yellow glow.
  const [fx, fw] = PANELS.face;
  for (let y = 4; y < 29; y++) {
    for (let x = fx + 1; x < fx + fw - 1; x++) c.set(x, y, mix(C('yellow', 0.62), C('orange', 0.45), (y - 4) / 30 + hash2(x, y, 3) * 0.1));
  }
  // Brass screws.
  for (const x of [1, 46, 104, 140, 178, 236, 250, 318]) {
    c.set(x, 4, C('yellow', 0.85));
    c.set(x, 27, C('yellow', 0.85));
  }
  return c;
}

/** Key icons (8x10): blue, yellow, red; plus a little hot sauce bottle for berserk. */
function hudIcons() {
  const c = new PixelCanvas(8 * 4, 10);
  const key = (i, ramp) => {
    const ox = i * 8;
    c.ellipse(ox + 2.5, 3.5, 2.5, 2.5, C(ramp, 0.62));
    c.set(ox + 2, 3, C('gray', 0.15));
    c.rect(ox + 3, 5, 2, 5, C('yellow', 0.75));
    c.rect(ox + 5, 7, 2, 1, C('yellow', 0.75));
    c.rect(ox + 5, 9, 1, 1, C('yellow', 0.75));
    c.set(ox + 1, 2, G('pale', 1));
  };
  key(0, 'sky');
  key(1, 'yellow');
  key(2, 'blood');
  c.rect(27, 4, 3, 6, C('blood', 0.6));
  c.rect(28, 1, 1, 3, C('blood', 0.6));
  c.rect(28, 0, 1, 1, C('green', 0.6));
  return c;
}

/** The zombie rat's head (16x16) for the menu cursor. */
function ratHead(blink) {
  const c = new PixelCanvas(16, 16);
  const fur = mix(C('toxic', 0.55), C('gray', 0.55), 0.45);
  c.ellipse(3.5, 4, 3, 3, fur);
  c.ellipse(12.5, 4, 3, 3, fur);
  c.ellipse(3.5, 4, 1.6, 1.6, C('flesh', 0.6));
  c.ellipse(12.5, 4, 1.6, 1.6, C('flesh', 0.6));
  c.ellipse(8, 9, 6, 5, fur);
  c.ellipse(8, 12, 3.5, 2.5, mix(fur, [255, 255, 255], 0.25));
  c.rect(7, 10, 2, 1, C('flesh', 0.55)); // nose
  if (!blink) {
    c.rect(5, 8, 1, 1, C('gray', 0.05));
    c.rect(10, 8, 2, 2, G('green', 1)); // the zombie eye
  } else {
    c.rect(4, 8, 2, 1, C('gray', 0.05));
    c.rect(10, 8, 2, 1, C('gray', 0.05));
  }
  c.rect(7, 14, 2, 1, C('beige', 0.98)); // buck teeth
  c.line(6, 5, 9, 6, C('gray', 0.15)); // stitches
  c.set(7, 4, C('gray', 0.15));
  c.set(8, 7, C('gray', 0.15));
  c.outline(C('gray', 0.02));
  return c;
}

function cursor() {
  const c = new PixelCanvas(32, 16);
  c.blit(ratHead(false), 0, 0);
  c.blit(ratHead(true), 16, 0);
  return c;
}

function favicon() {
  const c = new PixelCanvas(32, 32);
  c.blit(ratHead(false).scale(2), 0, 0);
  return c;
}

export default [
  { name: 'statusbar', out: 'assets/ui/statusbar.png', draw: statusBar },
  { name: 'hud-icons', out: 'assets/ui/hud-icons.png', draw: hudIcons },
  { name: 'cursor', out: 'assets/ui/cursor.png', draw: cursor },
  { name: 'favicon', out: 'assets/ui/favicon.png', draw: favicon },
];
