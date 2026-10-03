// The air vents that run through the whole house: shiny sheet-metal ducts,
// ribbed floors, slatted covers (they open like doors) and a spinning fan.
import { texture, noiseFill, bevel, rivet, C, mix, lighten, hash2, PixelCanvas } from '../lib/tex.js';

const T = (name) => `assets/textures/${name}.png`;

/** Brushed sheet metal with a soft vertical sheen. */
function sheet(name, t = 0.6) {
  const { c, seed } = texture(name);
  noiseFill(c, seed, C('steel', t - 0.06), C('steel', t + 0.04), { cells: 2, grain: 0.04, contrast: 0.6 });
  c.eachOpaque((x, y, p) => {
    const sheen = Math.sin((x / 64) * Math.PI * 2) * 0.06;
    const brushed = hash2(Math.floor(x / 2), y, seed) > 0.7 ? 0.04 : 0;
    return lighten(p, Math.max(0, sheen + brushed));
  });
  return { c, seed };
}

function ventWall() {
  const { c } = sheet('vent-wall', 0.62);
  // Duct seams with rivets.
  for (const x of [0, 32]) {
    c.rect(x, 0, 2, 64, C('steel', 0.42));
    c.rect(x + 2, 0, 1, 64, C('steel', 0.85));
    for (let y = 4; y < 64; y += 10) rivet(c, x + 4, y, C('steel', 0.7));
  }
  c.rect(0, 20, 64, 1, C('steel', 0.5));
  c.rect(0, 44, 64, 1, C('steel', 0.5));
  // Dust gathered in the bottom corner.
  for (let y = 56; y < 64; y++) for (let x = 0; x < 64; x++) if (hash2(x, y, 5) < (y - 55) / 12) c.set(x, y, mix(c.get(x, y), C('beige', 0.55), 0.6));
  return c;
}

function ventFloor() {
  const { c, seed } = sheet('vent-floor', 0.5);
  // Ribs across the duct floor.
  for (let y = 0; y < 64; y++) {
    const k = y % 8;
    if (k === 0) c.rect(0, y, 64, 1, C('steel', 0.8));
    if (k === 1) c.rect(0, y, 64, 1, C('steel', 0.65));
    if (k === 7) c.rect(0, y, 64, 1, C('steel', 0.3));
  }
  // Dust bunnies.
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(hash2(i, 1, seed) * 56) + 4;
    const y = Math.floor(hash2(i, 2, seed) * 56) + 4;
    c.ellipse(x, y, 3, 2, C('gray', 0.62));
    c.set(x - 1, y - 1, C('gray', 0.8));
  }
  return c;
}

function ventCeiling() {
  const { c } = sheet('vent-ceiling', 0.52);
  for (const y of [0, 32]) {
    c.rect(0, y, 64, 2, C('steel', 0.38));
    c.rect(0, y + 2, 64, 1, C('steel', 0.75));
  }
  return c;
}

/** A slatted vent cover (it slides open like a door). Light shines through the slats. */
function ventCover() {
  const { c } = sheet('vent-cover', 0.72);
  bevel(c, 0, 0, 64, 64, C('steel', 0.72), { depth: 2, fill: false });
  for (let y = 8; y < 56; y += 6) {
    c.rect(6, y, 52, 3, C('gray', 0.08));
    c.rect(6, y + 3, 52, 1, C('steel', 0.92));
    c.rect(6, y + 4, 52, 1, C('steel', 0.6));
  }
  for (const [x, y] of [[4, 4], [58, 4], [4, 58], [58, 58]]) {
    c.ellipse(x + 0.5, y + 0.5, 1.6, 1.6, C('steel', 0.45));
    c.set(x, y, C('steel', 0.95));
  }
  return c;
}

/** The inside of a vent with a big fan spinning behind a grille. Animated. */
function ventFan() {
  const frames = 3;
  const out = new PixelCanvas(64 * frames, 64);
  for (let f = 0; f < frames; f++) {
    const { c } = sheet('vent-fan', 0.62);
    c.ellipse(32, 32, 26, 26, C('gray', 0.12));
    for (let b = 0; b < 4; b++) {
      const a = (b / 4) * Math.PI * 2 + (f / frames) * (Math.PI / 2);
      for (let rr = 4; rr < 24; rr++) {
        for (let w = -4; w <= 4; w++) {
          const aa = a + w * 0.03 * (24 / rr);
          c.set(Math.round(32 + Math.cos(aa) * rr), Math.round(32 + Math.sin(aa) * rr), C('steel', 0.55 + (w > 0 ? 0.15 : 0)));
        }
      }
    }
    c.ellipse(32, 32, 4, 4, C('steel', 0.8));
    c.set(31, 31, C('steel', 0.98));
    // Grille in front.
    for (let x = 6; x < 60; x += 6) c.rect(x, 4, 1, 56, C('steel', 0.82));
    c.ring(32, 32, 26, 2, C('steel', 0.7));
    out.blit(c, f * 64, 0);
  }
  return out;
}

export default [
  { name: 'vent-wall', out: T('vent-wall'), draw: ventWall },
  { name: 'vent-floor', out: T('vent-floor'), draw: ventFloor },
  { name: 'vent-ceiling', out: T('vent-ceiling'), draw: ventCeiling },
  { name: 'vent-cover', out: T('vent-cover'), draw: ventCover },
  { name: 'vent-fan', out: T('vent-fan'), draw: ventFan },
];
