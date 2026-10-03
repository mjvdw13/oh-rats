/**
 * The OH, RATS! palette: 256 bright, cheerful colours.
 *
 * - Index 0 is black.
 * - Indices 1..223 are colour ramps (dark → light). Lighting darkens these.
 * - Indices 224..254 are FULLBRIGHT: they glow in the dark and ignore
 *   lighting (eyes, lamps, screens, sparkles, the microwave ray). Use them in
 *   art for anything that should shine.
 * - Index 255 is transparent.
 *
 * Every PNG the game loads is snapped to these colours, so art from any
 * source automatically matches. Change a ramp here and regenerate the art
 * (npm run art) to re-theme the whole game.
 */

const RAMPS = [
  // name, count, key colours dark → light
  ['gray', 23, [10, 10, 12], [62, 62, 66], [130, 130, 134], [240, 240, 236]],
  ['concrete', 16, [22, 20, 17], [78, 72, 62], [146, 136, 118], [206, 196, 174]], // basement stone
  ['wood', 24, [24, 12, 6], [78, 40, 18], [140, 84, 40], [196, 138, 80], [238, 200, 146]], // floors, furniture, fur
  ['skin', 16, [48, 26, 18], [120, 70, 48], [196, 132, 98], [250, 210, 176]], // Dad
  ['blood', 16, [30, 0, 4], [110, 10, 14], [204, 34, 34], [255, 104, 84]], // cheerful red
  ['orange', 12, [52, 18, 0], [150, 64, 8], [236, 130, 30], [255, 200, 106]],
  ['yellow', 12, [50, 40, 6], [142, 114, 22], [226, 194, 54], [255, 242, 146]],
  ['green', 16, [8, 22, 8], [30, 82, 30], [74, 152, 52], [156, 222, 104]], // grass, leaves, plants
  ['toxic', 12, [6, 22, 12], [32, 84, 44], [96, 164, 86], [186, 234, 150]], // zombie green
  ['sky', 12, [10, 26, 52], [40, 92, 152], [102, 172, 232], [196, 234, 255]],
  ['steel', 20, [8, 10, 20], [34, 42, 68], [82, 98, 136], [138, 158, 192], [200, 214, 238]], // vents, metal
  ['purple', 12, [16, 8, 28], [60, 30, 92], [124, 76, 176], [200, 160, 240]],
  ['flesh', 12, [40, 10, 22], [130, 52, 74], [222, 124, 146], [255, 204, 214]], // pink: rat ears, tails and noses
  ['beige', 12, [44, 40, 30], [110, 100, 76], [180, 168, 136], [246, 238, 212]],
  ['navy', 8, [4, 6, 18], [14, 20, 46], [30, 40, 80], [52, 66, 116]],
];

/** Glowing colours, indices 224..254, in groups ordered dark → light. */
const GLOW_GROUPS = [
  ['glow-yellow', [255, 70, 10], [255, 120, 20], [255, 170, 30], [255, 210, 60], [255, 236, 120], [255, 250, 200], [255, 255, 255]],
  ['glow-red', [150, 10, 10], [210, 20, 20], [255, 40, 30]],
  ['glow-green', [10, 110, 20], [20, 170, 30], [70, 230, 60], [170, 255, 140]],
  ['glow-cyan', [10, 90, 160], [20, 150, 220], [60, 220, 255], [170, 250, 255]],
  ['glow-magenta', [190, 20, 150], [255, 60, 200], [255, 150, 240]],
  ['glow-purple', [140, 80, 255], [200, 150, 255]],
  ['glow-lamp', [190, 120, 60], [232, 166, 92], [255, 214, 150]],
  ['glow-tube', [170, 192, 232], [214, 232, 255]],
  ['glow-amber', [200, 120, 0], [255, 176, 0]],
  ['glow-pale', [255, 255, 170]],
];

function interpolate(keys, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : (i / (count - 1)) * (keys.length - 1);
    const k = Math.min(keys.length - 2, Math.floor(t));
    const f = t - k;
    const a = keys[k];
    const b = keys[k + 1];
    out.push([0, 1, 2].map((c) => Math.round(a[c] + (b[c] - a[c]) * f)));
  }
  return out;
}

function build() {
  const colors = [[0, 0, 0]];
  const ramps = {};
  for (const [name, count, ...keys] of RAMPS) {
    ramps[name] = [colors.length, count];
    colors.push(...interpolate(keys, count));
  }
  if (colors.length !== 224) throw new Error(`Palette ramps must fill indices 0..223 (got ${colors.length})`);
  const fullbrightStart = colors.length;
  for (const [name, ...group] of GLOW_GROUPS) {
    ramps[name] = [colors.length, group.length];
    colors.push(...group);
  }
  if (colors.length !== 255) throw new Error(`Glow colours must fill 224..254 (got ${colors.length})`);
  colors.push([255, 0, 255]); // 255: transparent
  return { colors, ramps, fullbrightStart };
}

const built = build();

export default {
  colors: built.colors,
  ramps: built.ramps,
  fullbrightStart: built.fullbrightStart,
};
