import { defineItem } from '../../engine/defs.js';

const S = (name, w, h) => ({ src: `assets/sprites/items/${name}.png`, frameWidth: w, frameHeight: h });

export default [
  // Berserk: full health and 10x claw power until the level ends.
  defineItem({
    id: 'hot-sauce',
    name: 'Hot Sauce',
    glyph: 'e',
    sheet: S('hot-sauce', 16, 24),
    pickup: { powerup: 'berserk' },
    countItem: true,
    message: 'HOT SAUCE! Your claws are on FIRE!',
    sound: 'powerup',
  }),
  // Invulnerability for 30 seconds (inverted colours).
  defineItem({
    id: 'bubble-wrap',
    name: 'Bubble Wrap',
    glyph: 'D',
    sheet: S('bubble-wrap', 24, 32),
    anims: { idle: { frames: [0, 1], fps: 3, loop: true } },
    pickup: { powerup: 'invulnerable', duration: 30 },
    countItem: true,
    message: 'BUBBLE WRAP! Nothing can hurt you!',
    sound: 'powerup',
  }),
  // Light amplification for 120 seconds.
  defineItem({
    id: 'glow-stick',
    name: 'Glow Stick',
    glyph: 'g',
    sheet: S('glow-stick', 16, 24),
    anims: { idle: { frames: [0], fps: 1, fullbright: true } },
    pickup: { powerup: 'nightvision', duration: 120 },
    countItem: true,
    message: 'A glow stick! Now you can see in the dark.',
    sound: 'powerup',
  }),
  // Protection from the lava floor for 60 seconds.
  defineItem({
    id: 'rain-boots',
    name: 'Rain Boots',
    glyph: 'w',
    sheet: S('rain-boots', 24, 24),
    pickup: { powerup: 'hazard', duration: 60 },
    countItem: true,
    message: 'Tiny rain boots! The floor is NOT lava (for you).',
    sound: 'powerup',
  }),
  // Reveals the whole automap.
  defineItem({
    id: 'blueprint',
    name: 'House Blueprint',
    glyph: 'f',
    sheet: S('blueprint', 24, 24),
    pickup: { map: true },
    countItem: true,
    message: 'Found the house blueprints!',
    sound: 'powerup',
  }),
];
