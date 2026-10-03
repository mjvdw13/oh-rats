import { defineItem } from '../../engine/defs.js';

const S = (name, w, h) => ({ src: `assets/sprites/items/${name}.png`, frameWidth: w, frameHeight: h });

// Healing items: snacks a rat finds around the house.
export default [
  // +1 health, can go over 100 (Doom's health bonus).
  defineItem({
    id: 'cheese-crumb',
    name: 'Cheese Crumb',
    glyph: ',',
    sheet: S('cheese-crumb', 16, 16),
    anims: { idle: { frames: [0, 1, 2, 3, 2, 1], fps: 8, loop: true } },
    radius: 0.25,
    pickup: { health: 1, maxHealth: 200 },
    countItem: true,
    message: 'Nibbled a cheese crumb.',
    sound: 'item',
  }),
  // +10 health (stimpack).
  defineItem({
    id: 'cheese-wedge',
    name: 'Cheese Wedge',
    glyph: 'd',
    sheet: S('cheese-wedge', 24, 24),
    pickup: { health: 10 },
    message: 'Gobbled a wedge of cheese.',
    sound: 'item-food',
  }),
  // +25 health (medikit).
  defineItem({
    id: 'pizza-slice',
    name: 'Pizza Slice',
    glyph: 'p',
    sheet: S('pizza-slice', 32, 24),
    pickup: { health: 25 },
    message: 'Found a slice of pizza under the couch!',
    sound: 'item-food',
  }),
  // +100 health up to 200 (soulsphere).
  defineItem({
    id: 'golden-cheese',
    name: 'Golden Cheese',
    glyph: 'O',
    sheet: S('golden-cheese', 32, 32),
    anims: { idle: { frames: [0, 1, 2, 3], fps: 6, loop: true } },
    fullbright: true,
    radius: 0.3,
    pickup: { health: 100, maxHealth: 200 },
    countItem: true,
    message: 'THE GOLDEN CHEESE! You feel UNSTOPPABLE.',
    sound: 'powerup',
  }),
];
