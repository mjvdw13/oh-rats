// Pickup sprites: snacks (health), rat-sized armour, ammo, weapons, keys and
// powerups. Every item sits on the floor and is seen from slightly above.
import { PixelCanvas, darken, lighten } from '../lib/canvas.js';
import { C, G } from '../lib/pal.js';
import { Model, MAT } from '../lib/model.js';
import { box, cylinder, ellipse, flat } from '../lib/props.js';
import { sheet } from '../lib/sprite.js';
import { rng } from '../lib/noise.js';

const I = (name) => `assets/sprites/items/${name}.png`;
const RENDER = { light: [-0.5, -0.7, 0.55], ambient: 0.38, aoStrength: 0.45 };
const shadow = (m, cx, cy, rx) => flat(m, cx, cy, rx, rx * 0.22, C('gray', 0.1), MAT.cloth, -20);
const CHEESE = C('yellow', 0.75);
const CHEESE_DARK = C('yellow', 0.55);

function model(w, h, seed, build) {
  const m = new Model(w, h, { seed });
  build(m);
  return m.render(RENDER);
}

/** A tiny sparkle (fullbright). */
function glint(c, x, y, on = true, col = 'pale') {
  if (!on) return c;
  c.set(x, y, G(col, 1));
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) c.set(x + dx, y + dy, G('yellow', 0.7));
  return c;
}

/** A wedge of cheese with holes. `k` scales it. */
function wedge(m, cx, cy, k, z = 0) {
  const pts = [[cx - 8 * k, cy + 3 * k], [cx + 8 * k, cy + 3 * k], [cx + 8 * k, cy - 3 * k], [cx - 4 * k, cy - 1 * k]];
  m.slab(pts, z + 4, CHEESE, { ...MAT.plastic, spec: 0.15 }, { bevel: 1.2 * k, thickness: 1 });
  m.slab([[cx - 4 * k, cy - 1 * k], [cx + 8 * k, cy - 3 * k], [cx + 3 * k, cy - 7 * k]], z + 3, lighten(CHEESE, 0.15), MAT.plastic, { bevel: 1, tilt: [0, -2] });
  const r = rng(Math.round(cx * 7 + cy));
  for (let i = 0; i < 4; i++) {
    const hx = cx + r.range(-6, 6) * k;
    const hy = cy + r.range(-1, 2) * k;
    m.dent(hx, hy, 1.4 * k, 1.1 * k, 1.5);
    m.paint(hx, hy, 1.1 * k, 0.9 * k, CHEESE_DARK);
  }
}

// ---------------------------------------------------------------- health

function cheeseCrumb() {
  return sheet([0, 1, 2, 3].map((f) => {
    const c = model(16, 16, 201, (m) => {
      shadow(m, 8, 14.5, 4);
      m.slab([[4, 13], [12, 13], [11, 9], [6, 8]], 4, CHEESE, MAT.plastic, { bevel: 1 });
      m.dent(8, 11, 1.2, 1, 1.4);
    });
    return glint(c, 5 + f, 8, f !== 3);
  }));
}

const cheeseWedge = () =>
  model(24, 24, 203, (m) => {
    shadow(m, 12, 21, 9);
    wedge(m, 12, 17, 1.05);
  });

const pizzaSlice = () =>
  model(32, 24, 205, (m) => {
    shadow(m, 16, 21, 13);
    // A triangle of pizza with a puffy crust, cheese and pepperoni.
    m.slab([[4, 19], [28, 19], [16, 7]], 4, C('yellow', 0.85), { ...MAT.plastic, spec: 0.25 }, { bevel: 1.5, tilt: [0, -1.2] });
    m.capsule(4, 19.5, 6, 28, 19.5, 6, 2.2, 2.2, C('orange', 0.55), MAT.skin);
    for (const [x, y] of [[12, 15], [19, 15.5], [16, 11.5]]) m.paint(x, y, 2, 1.4, C('blood', 0.55));
    m.paint(9, 17, 1, 0.6, C('green', 0.5));
    m.paint(22, 17.5, 1, 0.6, C('green', 0.5));
  });

function goldenCheese() {
  return sheet([0, 1, 2, 3].map((f) => {
    const c = model(32, 32, 207, (m) => {
      // A whole wheel of glittering golden cheese with a wedge cut out.
      const cy = 17 + (f % 2 ? -1 : 0);
      const gold = { ...MAT.brass, spec: 0.7 };
      m.capsule(16, cy + 2, 0, 16, cy + 8, 0, 12, 12, C('yellow', 0.72), gold);
      m.slab(ellipse(16, cy, 12, 5), 7, C('yellow', 0.95), gold, { tilt: [0, -2.2], bevel: 1.2 });
      // The cut: a darker notch in the top and a flat face on the side.
      m.paintPoly([[16, cy], [28, cy + 1], [24, cy + 4]], C('yellow', 0.6));
      m.paintPoly([[24, cy + 4], [28, cy + 1], [28, cy + 8], [24, cy + 11]], C('yellow', 0.82));
      for (const [x, y] of [[8, cy + 7], [13, cy + 9], [19, cy + 8], [26, cy + 6]]) {
        m.dent(x, y, 1.4, 1, 1.4);
        m.paint(x, y, 1.1, 0.8, C('yellow', 0.5));
      }
    });
    glint(c, 8 + f * 4, 9, true);
    glint(c, 26 - f * 3, 22, f % 2 === 0);
    return c;
  }));
}

// ---------------------------------------------------------------- armour

function bottleCap() {
  return sheet([0, 1, 2, 3].map((f) => {
    const c = model(16, 16, 211, (m) => {
      shadow(m, 8, 14.5, 4.5);
      const crimp = Array.from({ length: 21 }, (_, k) => {
        const a = (k / 21) * Math.PI * 2;
        const rr = k % 2 ? 5.2 : 4.6;
        return [8 + Math.cos(a) * rr, 11 + Math.sin(a) * rr * 0.45];
      });
      m.slab(crimp, 4, C('blood', 0.62), MAT.metal, { bevel: 1, tilt: [0, -2] });
      m.paint(8, 11, 2.6, 1, C('beige', 0.95));
    });
    return glint(c, 5 + f, 9, f !== 3);
  }));
}

const thimbleHelmet = () =>
  model(24, 24, 213, (m) => {
    shadow(m, 12, 21, 8);
    // A thimble with a chin strap of string: a helmet for a rat.
    m.ellipsoid(12, 13, 0, 7, 7.5, 6, C('steel', 0.75), MAT.metal);
    m.capsule(12, 19, 0, 12, 13, 0, 7, 7, C('steel', 0.75), MAT.metal);
    for (let y = 9; y < 20; y += 2) for (let x = 7; x < 18; x += 2) m.dent(x + (y % 4 ? 1 : 0), y, 0.6, 0.6, 1);
    m.stroke(5, 20, 19, 20, 1, C('blood', 0.5));
  });

function tinCan() {
  return sheet([0, 1].map((f) => {
    const c = model(32, 32, 215, (m) => {
      shadow(m, 16, 29, 11);
      cylinder(m, 16, 7, 28, 9.5, C('steel', 0.72), MAT.metal, { topCol: C('steel', 0.85) });
      // A bright label and ribs.
      for (let y = 14; y < 24; y++) m.paint(16, y, 9.6, 0.6, y < 16 || y > 21 ? C('blood', 0.6) : C('beige', 0.95));
      m.paint(16, 19, 3, 1.6, C('green', 0.55));
    });
    return glint(c, 9 + f * 12, 9, true);
  }));
}

// ---------------------------------------------------------------- ammo

const BAND_COLS = [C('blood', 0.62), C('sky', 0.6), C('green', 0.62), C('yellow', 0.8), C('purple', 0.62), C('orange', 0.7)];

const bands = () =>
  model(16, 16, 221, (m) => {
    shadow(m, 8, 14.5, 5);
    BAND_COLS.slice(0, 3).forEach((col, k) => {
      const pts = ellipse(8 + (k - 1) * 1.5, 12 - k * 0.8, 4.4, 1.8, 16);
      for (let i = 0; i < pts.length; i++) {
        const [a, b] = [pts[i], pts[(i + 1) % pts.length]];
        m.capsule(a[0], a[1], 4 + k, b[0], b[1], 4 + k, 0.6, 0.6, col, MAT.plastic);
      }
    });
  });

const bandsBall = () =>
  model(24, 24, 223, (m) => {
    shadow(m, 12, 21.5, 7);
    m.sphere(12, 14, 0, 7.2, BAND_COLS[0], MAT.plastic);
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * Math.PI;
      m.stroke(12 + Math.cos(a) * 7, 14 - 7, 12 - Math.cos(a) * 7, 14 + 7, 1.1, BAND_COLS[k % BAND_COLS.length]);
    }
  });

/** A soda can: red with a white wave. */
function can(m, cx, top, bottom, r = 4.2, col = C('blood', 0.6)) {
  cylinder(m, cx, top, bottom, r, col, MAT.metal, { topCol: C('steel', 0.85) });
  m.paint(cx, (top + bottom) / 2, r * 0.9, 1, C('beige', 0.95));
}

const sodaCan = () =>
  model(16, 24, 225, (m) => {
    shadow(m, 8, 22, 5);
    can(m, 8, 9, 22);
  });

const sixPack = () =>
  model(32, 24, 227, (m) => {
    shadow(m, 16, 22, 13);
    for (const [x, y, col] of [[8, 13, C('blood', 0.6)], [16, 13, C('green', 0.55)], [24, 13, C('sky', 0.55)], [10, 17, C('orange', 0.65)], [18, 17, C('purple', 0.55)], [26, 17, C('blood', 0.6)]]) can(m, x, y - 6, y + 4, 3.6, col);
    m.paint(16, 13, 13, 1, C('gray', 0.85));
  });

function battery(m, x, y, len, z, col = C('orange', 0.62)) {
  m.capsule(x, y, z, x + len, y, z, 2.2, 2.2, C('gray', 0.18), MAT.metal);
  m.capsule(x + len * 0.55, y, z + 0.1, x + len, y, z + 0.1, 2.25, 2.25, col, MAT.metal);
  m.sphere(x + len + 1.4, y, z, 0.9, C('steel', 0.85), MAT.metal);
}

const batteries = () =>
  model(24, 16, 229, (m) => {
    shadow(m, 12, 14.5, 9);
    battery(m, 4, 12, 13, 4);
    battery(m, 6, 9, 13, 2, C('yellow', 0.75));
  });

const batteryPack = () =>
  model(32, 24, 231, (m) => {
    shadow(m, 16, 22, 13);
    box(m, 5, 10, 22, 11, 4, C('sky', 0.55), MAT.plastic, { topCol: C('sky', 0.7) });
    // Four batteries standing in the pack, copper tops up.
    for (let k = 0; k < 4; k++) {
      const x = 8 + k * 5;
      m.capsule(x, 4, 12, x, 10, 12, 2.1, 2.1, C('gray', 0.18), MAT.metal);
      m.capsule(x, 3, 12.2, x, 6, 12.2, 2.15, 2.15, C('orange', 0.62), MAT.metal);
    }
  });

const lunchbox = () => {
  return model(32, 24, 233, (m) => {
    shadow(m, 16, 22, 13);
    box(m, 4, 9, 24, 12, 4, C('blood', 0.62), MAT.metal, { topCol: C('blood', 0.72) });
    m.capsule(11, 5, 10, 21, 5, 10, 1.2, 1.2, C('gray', 0.3), MAT.plastic);
    m.paint(16, 15, 6, 3, C('yellow', 0.85)); // a sticker: a smiley sun
    m.paint(14.5, 14.5, 0.6, 0.6, C('gray', 0.2));
    m.paint(17.5, 14.5, 0.6, 0.6, C('gray', 0.2));
  });
};

const MARBLE_COLS = [C('sky', 0.62), C('green', 0.62), C('blood', 0.62), C('yellow', 0.8), C('purple', 0.62)];

/** A glass marble with a coloured swirl. */
function marble(m, x, y, z, r, k) {
  m.sphere(x, y, z, r, MARBLE_COLS[k % MARBLE_COLS.length], MAT.glass);
  m.paint(x - r * 0.2, y + r * 0.1, r * 0.45, r * 0.25, MARBLE_COLS[(k + 2) % MARBLE_COLS.length], MAT.glass);
}

const marbles = () => {
  const c = model(16, 16, 235, (m) => {
    shadow(m, 8, 14.5, 5);
    marble(m, 5, 11.5, 2, 2.6, 0);
    marble(m, 10.5, 12, 3, 2.6, 1);
    marble(m, 8, 8.5, 1, 2.6, 2);
  });
  return glint(c, 7, 7, true);
};

const marbleJar = () =>
  model(24, 24, 237, (m) => {
    shadow(m, 12, 22, 8);
    // A glass jar full of marbles (drawn in front of the glass), with a red lid.
    cylinder(m, 12, 6, 22, 7, C('sky', 0.88), { ...MAT.glass, spec: 0.9 }, { topCol: C('sky', 0.92) });
    for (let k = 0; k < 9; k++) marble(m, 8 + (k % 3) * 4, 19 - Math.floor(k / 3) * 4 + (k % 2), 14 + (k % 3), 2.2, k);
    cylinder(m, 12, 3, 6, 7.2, C('blood', 0.6), MAT.plastic, { topCol: C('blood', 0.7) });
  });

/** A red road flare: a stick with a white cap. */
function flare(m, x0, y0, x1, y1, z) {
  m.capsule(x0, y0, z, x1, y1, z, 2.2, 2.2, C('blood', 0.6), MAT.paper);
  m.capsule(x1, y1, z + 0.2, x1 + (x1 - x0) * 0.15, y1 + (y1 - y0) * 0.15, z + 0.2, 2.3, 2.3, C('beige', 0.92), MAT.plastic);
}

const flares = () =>
  model(24, 16, 243, (m) => {
    shadow(m, 12, 14.5, 9);
    flare(m, 4, 12, 17, 11, 3);
    flare(m, 6, 8, 18, 9.5, 1);
  });

const flareBox = () =>
  model(32, 24, 245, (m) => {
    shadow(m, 16, 22, 13);
    box(m, 5, 10, 22, 11, 4, C('orange', 0.62), MAT.paper, { topCol: C('orange', 0.72) });
    m.paint(16, 16, 4, 3, C('beige', 0.95), MAT.paper);
    m.paint(16, 16, 1.6, 1.6, C('blood', 0.6), MAT.paper); // the flare on the label
    flare(m, 9, 9, 13, 3, 14);
    flare(m, 19, 9, 22, 4, 14);
  });

/** A blue propane cylinder with a brass valve. */
function propane(m, cx, top, bottom, r) {
  m.capsule(cx, bottom - r * 0.4, 0, cx, top + r * 0.8, 0, r, r, C('sky', 0.5), { ...MAT.metal, spec: 0.35 });
  m.paint(cx, (top + bottom) / 2 + r * 0.3, r * 0.95, r * 0.35, C('beige', 0.92), MAT.paper);
  m.capsule(cx, top + r * 0.4, 1, cx, top - 1, 1, r * 0.35, r * 0.3, C('yellow', 0.66), MAT.brass);
  m.ellipsoid(cx + r * 0.45, top, 2, r * 0.3, r * 0.3, r * 0.2, C('blood', 0.6), MAT.plastic);
}

const propaneCan = () =>
  model(16, 24, 247, (m) => {
    shadow(m, 8, 22, 5);
    propane(m, 8, 5, 22, 4);
  });

const propaneTank = () =>
  model(24, 32, 249, (m) => {
    shadow(m, 12, 30, 9);
    propane(m, 12, 6, 30, 8);
    // A carrying collar round the valve.
    m.capsule(6, 7, 6, 18, 7, 6, 1.2, 1.2, C('steel', 0.72), MAT.metal);
  });

// ---------------------------------------------------------------- weapon pickups (side views)

function pickup(build) {
  return model(64, 32, 241, (m) => {
    shadow(m, 32, 30, 24);
    build(m);
  });
}

const pickupGatling = () =>
  pickup((m) => {
    m.ellipsoid(14, 22, 6, 9, 6, 6, C('blood', 0.6), MAT.plastic);
    for (let k = 0; k < 3; k++) m.capsule(20, 19 + k * 2.5, 5 + k, 58, 20 + k * 1.2, 5 + k, 1.6, 1.2, C('yellow', 0.72), MAT.wood);
    m.capsule(6, 22, 8, 2, 16, 8, 1, 1, C('steel', 0.7), MAT.metal);
  });

const pickupBazooka = () =>
  pickup((m) => {
    m.capsule(4, 21, 4, 60, 18, 6, 6, 5.5, C('wood', 0.66), MAT.paper);
    m.paint(20, 20.5, 2.5, 6, C('gray', 0.7));
    m.paint(44, 19, 2.5, 6, C('gray', 0.7));
    m.paint(32, 19.5, 4, 4, C('sky', 0.6));
    m.ellipsoid(61, 18, 7, 2, 4.5, 4, C('blood', 0.6), MAT.metal);
  });

const pickupMicrowave = () => {
  const c = pickup((m) => {
    box(m, 12, 12, 40, 16, 5, C('beige', 0.88), MAT.plastic, { topCol: C('beige', 0.95) });
    m.slab([[15, 14], [38, 14], [38, 26], [15, 26]], 10, C('gray', 0.2), MAT.glass, { bevel: 1 });
    m.slab([[41, 14], [49, 14], [49, 26], [41, 26]], 10, C('gray', 0.3), MAT.plastic, { bevel: 1 });
  });
  for (let x = 42; x < 48; x++) c.set(x, 16, G('green', 1));
  c.set(20, 18, G('purple', 1));
  return c;
};

const pickupCrowbar = () =>
  pickup((m) => {
    m.capsule(8, 27, 6, 50, 21, 6, 2.6, 2.4, C('blood', 0.58), MAT.metal);
    m.capsule(8, 27, 6, 4, 25, 6, 2.4, 1.4, C('steel', 0.72), MAT.metal); // the pry end
    // The hook curling up at the far end.
    let prev = [50, 21];
    for (let k = 1; k <= 6; k++) {
      const a = Math.PI / 2 - (k / 6) * Math.PI * 1.1;
      const p = [50 + Math.cos(a) * 6, 15 + Math.sin(a) * 6];
      m.capsule(...prev, 6, ...p, 6, 2.4, 2.2, k > 3 ? C('steel', 0.72) : C('blood', 0.58), MAT.metal);
      prev = p;
    }
  });

const pickupChainsaw = () =>
  pickup((m) => {
    m.capsule(26, 20, 6, 60, 18, 6, 3.2, 2.6, C('steel', 0.78), MAT.metal); // the guide bar
    for (let x = 30; x < 58; x += 4) {
      m.paint(x, 16.6, 0.8, 0.8, C('gray', 0.15), MAT.metal);
      m.paint(x + 2, 21.2, 0.8, 0.8, C('gray', 0.15), MAT.metal);
    }
    m.capsule(8, 22, 8, 24, 20, 8, 8, 7.5, C('orange', 0.62), MAT.plastic); // the motor
    m.capsule(10, 17, 13, 20, 16, 13, 3, 3, C('gray', 0.18), MAT.plastic);
    m.capsule(6, 14, 12, 22, 11, 12, 1.6, 1.6, C('gray', 0.16), MAT.plastic); // the top handle
    m.paint(18, 23, 3, 1.6, C('beige', 0.95));
  });

const pickupSlingshot = () =>
  pickup((m) => {
    const wood = C('wood', 0.5);
    m.capsule(28, 29, 4, 31, 19, 6, 2.6, 2.4, wood, MAT.wood);
    m.capsule(31, 19, 6, 22, 7, 6, 2.2, 1.8, wood, MAT.wood);
    m.capsule(31, 19, 6, 40, 7, 6, 2.2, 1.8, wood, MAT.wood);
    m.capsule(22, 7, 8, 31, 14, 9, 0.9, 0.9, C('blood', 0.48), MAT.plastic);
    m.capsule(40, 7, 8, 31, 14, 9, 0.9, 0.9, C('blood', 0.48), MAT.plastic);
    m.ellipsoid(31, 14.5, 10, 3, 2, 1.6, C('wood', 0.32), MAT.leather);
    marble(m, 40, 26, 6, 2.4, 0);
    marble(m, 45, 27, 6, 2.4, 3);
  });

const pickupFlareGun = () =>
  pickup((m) => {
    const orange = C('orange', 0.62);
    m.capsule(22, 15, 6, 50, 15, 6, 6, 5.5, orange, MAT.plastic);
    m.paint(51, 15, 2, 4.4, C('gray', 0.08));
    m.slab([[18, 12], [26, 12], [26, 21], [18, 21]], 10, darken(orange, 0.12), MAT.plastic, { bevel: 1.5 });
    m.capsule(21, 20, 8, 15, 29, 8, 3.6, 4, darken(orange, 0.2), MAT.plastic);
    m.capsule(18, 11, 9, 15, 8, 9, 1.2, 1, C('gray', 0.25), MAT.metal); // the hammer
    m.stroke(24, 22, 26, 26, 1, C('gray', 0.25)); // the trigger
  });

const pickupBlowTorch = () =>
  pickup((m) => {
    m.capsule(8, 22, 6, 34, 22, 6, 7, 7, C('sky', 0.5), { ...MAT.metal, spec: 0.35 });
    m.paint(21, 22, 4, 6.8, C('beige', 0.92), MAT.paper);
    m.ellipsoid(38, 22, 7, 4, 5, 4, C('yellow', 0.66), MAT.brass);
    m.capsule(41, 21, 7, 56, 17, 7, 1.6, 1.4, C('steel', 0.7), MAT.metal);
    m.capsule(56, 17, 7, 60, 16, 7, 2, 2, C('yellow', 0.66), MAT.brass);
    m.ellipsoid(38, 15, 9, 2.2, 2.2, 1.6, C('blood', 0.6), MAT.plastic); // the valve knob
  });

// ---------------------------------------------------------------- keys and powerups

function key(ramp) {
  return sheet([1, 0].map((on) => {
    const c = model(16, 16, 251, (m) => {
      shadow(m, 8, 15, 5);
      // A chunky house key with a coloured plastic head.
      m.slab(ellipse(5.5, 9, 3.6, 3.6, 16), 6, C(ramp, 0.62), MAT.plastic, { bevel: 1 });
      m.paint(5.5, 9, 1.2, 1.2, C('gray', 0.2));
      m.slab([[8.5, 8], [14, 8], [14, 10], [8.5, 10]], 6, C('yellow', 0.7), MAT.brass, { bevel: 0.6 });
      m.slab([[11, 10], [12, 10], [12, 12], [11, 12]], 6, C('yellow', 0.7), MAT.brass, { bevel: 0.4 });
      m.slab([[13, 10], [14, 10], [14, 11.5], [13, 11.5]], 6, C('yellow', 0.7), MAT.brass, { bevel: 0.4 });
    });
    if (on) glint(c, 4, 7, true);
    return c;
  }));
}

const hotSauce = () =>
  model(16, 24, 261, (m) => {
    shadow(m, 8, 22, 5);
    cylinder(m, 8, 9, 22, 3.6, C('blood', 0.6), MAT.glass);
    m.capsule(8, 9, 4, 8, 4, 4, 1.6, 1.2, C('blood', 0.62), MAT.glass);
    m.capsule(8, 4, 4, 8, 2, 4, 1.4, 1.4, C('green', 0.55), MAT.plastic);
    m.paint(8, 16, 3.6, 2.5, C('beige', 0.95));
    m.paint(8, 16, 1.4, 1.4, C('orange', 0.7)); // a little flame logo
  });

function bubbleWrap() {
  return sheet([0, 1].map((f) => {
    const c = model(24, 32, 263, (m) => {
      shadow(m, 12, 29.5, 9);
      m.slab([[3, 6], [21, 4], [22, 28], [2, 29]], 4, C('sky', 0.85), { ...MAT.glass, spec: 0.8 }, { bevel: 2, thickness: 1.5 });
      for (let y = 8; y < 27; y += 4) for (let x = 5 + ((y / 4) % 2) * 2; x < 21; x += 4) m.ellipsoid(x, y, 6, 1.6, 1.6, 1.5, C('sky', 0.92), { ...MAT.glass, spec: 0.9 });
    });
    glint(c, 7 + f * 8, 9 + f * 10, true);
    return c;
  }));
}

function glowStick() {
  const c = new PixelCanvas(16, 24);
  for (let y = 4; y < 22; y++) {
    const x = Math.round(5 + (y - 4) * 0.33);
    c.set(x, y, G('green', 0.9));
    c.set(x + 1, y, G('green', 1));
    c.set(x + 2, y, G('green', 0.65));
  }
  c.rect(5, 3, 3, 2, C('gray', 0.5));
  c.set(9, 10, G('pale', 1));
  return c;
}

const rainBoots = () =>
  model(24, 24, 265, (m) => {
    shadow(m, 12, 22, 10);
    for (const [x, z] of [[8, 2], [15, 4]]) {
      m.capsule(x, 6, z, x, 17, z, 3.2, 3.2, C('yellow', 0.78), MAT.plastic);
      m.ellipsoid(x + 2.6, 19, z + 1, 5, 2.4, 3.4, C('yellow', 0.78), MAT.plastic);
      m.paint(x, 7, 3.2, 1, C('yellow', 0.92));
    }
  });

const blueprint = () => {
  const c = model(24, 24, 267, (m) => {
    shadow(m, 12, 21, 10);
    m.slab([[3, 18], [21, 18], [20, 10], [4, 10]], 2, C('sky', 0.5), MAT.paper, { bevel: 0.6, tilt: [0, -2] });
    m.capsule(3, 13, 3, 3, 19, 3, 1.6, 1.6, C('sky', 0.6), MAT.paper);
  });
  // White lines of the floor plan.
  c.rect(7, 12, 9, 1, C('beige', 0.95));
  c.rect(7, 12, 1, 5, C('beige', 0.95));
  c.rect(15, 12, 1, 5, C('beige', 0.95));
  c.rect(7, 16, 9, 1, C('beige', 0.95));
  c.rect(11, 12, 1, 3, C('beige', 0.95));
  return c;
};

export default [
  { name: 'cheese-crumb', out: I('cheese-crumb'), draw: cheeseCrumb, dither: 'fs' },
  { name: 'cheese-wedge', out: I('cheese-wedge'), draw: cheeseWedge, dither: 'fs' },
  { name: 'pizza-slice', out: I('pizza-slice'), draw: pizzaSlice, dither: 'fs' },
  { name: 'golden-cheese', out: I('golden-cheese'), draw: goldenCheese },
  { name: 'bottle-cap', out: I('bottle-cap'), draw: bottleCap, dither: 'fs' },
  { name: 'thimble-helmet', out: I('thimble-helmet'), draw: thimbleHelmet, dither: 'fs' },
  { name: 'tin-can-armor', out: I('tin-can-armor'), draw: tinCan, dither: 'fs' },
  { name: 'bands', out: I('bands'), draw: bands, dither: 'fs' },
  { name: 'bands-ball', out: I('bands-ball'), draw: bandsBall, dither: 'fs' },
  { name: 'soda-can', out: I('soda-can'), draw: sodaCan, dither: 'fs' },
  { name: 'six-pack', out: I('six-pack'), draw: sixPack, dither: 'fs' },
  { name: 'batteries', out: I('batteries'), draw: batteries, dither: 'fs' },
  { name: 'battery-pack', out: I('battery-pack'), draw: batteryPack, dither: 'fs' },
  { name: 'marbles', out: I('marbles'), draw: marbles, dither: 'fs' },
  { name: 'marble-jar', out: I('marble-jar'), draw: marbleJar, dither: 'fs' },
  { name: 'flares', out: I('flares'), draw: flares, dither: 'fs' },
  { name: 'flare-box', out: I('flare-box'), draw: flareBox, dither: 'fs' },
  { name: 'propane-can', out: I('propane-can'), draw: propaneCan, dither: 'fs' },
  { name: 'propane-tank', out: I('propane-tank'), draw: propaneTank, dither: 'fs' },
  { name: 'lunchbox', out: I('lunchbox'), draw: lunchbox, dither: 'fs' },
  { name: 'pickup-band-gatling', out: I('pickup-band-gatling'), draw: pickupGatling, dither: 'fs' },
  { name: 'pickup-soda-bazooka', out: I('pickup-soda-bazooka'), draw: pickupBazooka, dither: 'fs' },
  { name: 'pickup-mega-microwave', out: I('pickup-mega-microwave'), draw: pickupMicrowave, dither: 'fs' },
  { name: 'pickup-crowbar', out: I('pickup-crowbar'), draw: pickupCrowbar, dither: 'fs' },
  { name: 'pickup-chainsaw', out: I('pickup-chainsaw'), draw: pickupChainsaw, dither: 'fs' },
  { name: 'pickup-slingshot', out: I('pickup-slingshot'), draw: pickupSlingshot, dither: 'fs' },
  { name: 'pickup-flare-gun', out: I('pickup-flare-gun'), draw: pickupFlareGun, dither: 'fs' },
  { name: 'pickup-blow-torch', out: I('pickup-blow-torch'), draw: pickupBlowTorch, dither: 'fs' },
  { name: 'key-blue', out: I('key-blue'), draw: () => key('sky'), dither: 'fs' },
  { name: 'key-yellow', out: I('key-yellow'), draw: () => key('yellow'), dither: 'fs' },
  { name: 'key-red', out: I('key-red'), draw: () => key('blood'), dither: 'fs' },
  { name: 'hot-sauce', out: I('hot-sauce'), draw: hotSauce, dither: 'fs' },
  { name: 'bubble-wrap', out: I('bubble-wrap'), draw: bubbleWrap, dither: 'fs' },
  { name: 'glow-stick', out: I('glow-stick'), draw: glowStick },
  { name: 'rain-boots', out: I('rain-boots'), draw: rainBoots, dither: 'fs' },
  { name: 'blueprint', out: I('blueprint'), draw: blueprint, dither: 'fs' },
];

export { wedge, can, battery, marble };
