// Doors and door frames: painted panel doors, a louvred closet door, the
// basement's steel door, and doors (house panels, warehouse steel) with a coloured stripe that need a key.
import { texture, noiseFill, bevel, rivet, tinyText, tinyTextWidth, C, mix, lighten, hash2 } from '../lib/tex.js';

const T = (name) => `assets/textures/${name}.png`;

/** A classic six-panel door in `col`, with a brass knob. */
function panelDoor(name, col, { stripe } = {}) {
  const { c, seed } = texture(name);
  noiseFill(c, seed, col, lighten(col, 0.06), { cells: 2, grain: 0.05, contrast: 0.6 });
  bevel(c, 0, 0, 64, 64, col, { depth: 2, fill: false });
  for (const [y, h] of [[6, 12], [22, 16], [42, 16]]) {
    for (const x of [8, 34]) {
      bevel(c, x, y, 22, h, col, { depth: 1, fill: false, hi: 0.3, lo: 0.25 });
      bevel(c, x + 2, y + 2, 18, h - 4, col, { depth: 1, fill: false, hi: -0.15, lo: -0.2 });
    }
  }
  if (stripe) keyStripe(c, stripe);
  // Knob and keyhole.
  c.ellipse(55, 34, 2.6, 2.6, C('yellow', 0.62));
  c.set(54, 33, C('yellow', 0.95));
  c.rect(55, 38, 1, 2, C('gray', 0.12));
  return c;
}

/** A bright band and a big key symbol: this door needs that key. */
function keyStripe(c, stripe) {
  const band = C(stripe.ramp, 0.62);
  c.rect(0, 26, 64, 10, band);
  c.rect(0, 26, 64, 1, lighten(band, 0.3));
  c.rect(0, 35, 64, 1, mix(band, [0, 0, 0], 0.3));
  const w = tinyTextWidth(stripe.label);
  tinyText(c, stripe.label, 32 - Math.ceil(w / 2), 29, C('beige', 0.98));
  c.ellipse(12, 31, 2.5, 2.5, C('beige', 0.98));
  c.rect(14, 30, 5, 2, C('beige', 0.98));
  c.rect(17, 32, 1, 2, C('beige', 0.98));
}

function closetDoor() {
  const { c, seed } = texture('door-closet');
  noiseFill(c, seed, C('beige', 0.88), C('beige', 0.94), { cells: 2, grain: 0.05, contrast: 0.6 });
  for (const x of [0, 32]) {
    bevel(c, x + 2, 2, 28, 60, C('beige', 0.9), { depth: 1, fill: false });
    for (let y = 6; y < 58; y += 4) {
      c.rect(x + 5, y, 22, 2, C('beige', 0.62));
      c.rect(x + 5, y + 2, 22, 1, C('beige', 0.98));
    }
  }
  c.ellipse(29, 33, 1.5, 1.5, C('yellow', 0.65));
  c.ellipse(35, 33, 1.5, 1.5, C('yellow', 0.65));
  return c;
}

/** A steel door; with a `stripe` it's a key door (the warehouse's). */
function metalDoor(name = 'door-metal', { stripe } = {}) {
  const { c, seed } = texture(name);
  noiseFill(c, seed, C('steel', 0.5), C('steel', 0.58), { cells: 2, grain: 0.05 });
  bevel(c, 0, 0, 64, 64, C('steel', 0.5), { depth: 2, fill: false });
  bevel(c, 8, 8, 48, 20, C('steel', 0.48), { depth: 1 });
  bevel(c, 8, 34, 48, 22, C('steel', 0.48), { depth: 1 });
  c.rect(6, 30, 52, 3, C('steel', 0.8));
  c.rect(6, 33, 52, 1, C('steel', 0.3));
  for (const [x, y] of [[4, 4], [58, 4], [4, 58], [58, 58]]) rivet(c, x, y, C('steel', 0.6));
  if (stripe) keyStripe(c, stripe);
  return c;
}

/** White painted trim beside a door. */
function jamb() {
  const { c, seed } = texture('door-jamb');
  noiseFill(c, seed, C('beige', 0.86), C('beige', 0.94), { cells: 2, grain: 0.06, contrast: 0.6 });
  for (let x = 0; x < 64; x += 16) {
    c.rect(x, 0, 1, 64, C('beige', 0.7));
    c.rect(x + 1, 0, 1, 64, C('beige', 0.98));
  }
  c.eachOpaque((x, y, p) => (hash2(x, y, 9) > 0.97 ? mix(p, C('wood', 0.4), 0.2) : undefined));
  return c;
}

export default [
  { name: 'door-white', out: T('door-white'), draw: () => panelDoor('door-white', C('beige', 0.9)) },
  { name: 'door-wood', out: T('door-wood'), draw: () => panelDoor('door-wood', C('wood', 0.5)) },
  { name: 'door-blue', out: T('door-blue'), draw: () => panelDoor('door-blue', C('beige', 0.9), { stripe: { ramp: 'sky', label: 'BLUE' } }) },
  { name: 'door-yellow', out: T('door-yellow'), draw: () => panelDoor('door-yellow', C('beige', 0.9), { stripe: { ramp: 'yellow', label: 'YELLOW' } }) },
  { name: 'door-red', out: T('door-red'), draw: () => panelDoor('door-red', C('beige', 0.9), { stripe: { ramp: 'blood', label: 'RED' } }) },
  { name: 'door-closet', out: T('door-closet'), draw: closetDoor },
  { name: 'door-metal', out: T('door-metal'), draw: () => metalDoor() },
  { name: 'door-metal-blue', out: T('door-metal-blue'), draw: () => metalDoor('door-metal-blue', { stripe: { ramp: 'sky', label: 'BLUE' } }) },
  { name: 'door-metal-yellow', out: T('door-metal-yellow'), draw: () => metalDoor('door-metal-yellow', { stripe: { ramp: 'yellow', label: 'YELLOW' } }) },
  { name: 'door-metal-red', out: T('door-metal-red'), draw: () => metalDoor('door-metal-red', { stripe: { ramp: 'blood', label: 'RED' } }) },
  { name: 'door-jamb', out: T('door-jamb'), draw: jamb },
];
