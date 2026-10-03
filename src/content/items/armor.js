import { defineItem } from '../../engine/defs.js';

const S = (name, w, h) => ({ src: `assets/sprites/items/${name}.png`, frameWidth: w, frameHeight: h });

// Armor, rat-sized. Class 1 absorbs a third of incoming damage, class 2 half.
export default [
  defineItem({
    id: 'bottle-cap',
    name: 'Bottle Cap',
    glyph: ';',
    sheet: S('bottle-cap', 16, 16),
    anims: { idle: { frames: [0, 1, 2, 3, 2, 1], fps: 8, loop: true } },
    radius: 0.25,
    pickup: { armor: 1, maxArmor: 200 },
    countItem: true,
    message: 'Picked up a shiny bottle cap.',
    sound: 'item',
  }),
  defineItem({
    id: 'thimble-helmet',
    name: 'Thimble Helmet',
    glyph: 'a',
    sheet: S('thimble-helmet', 24, 24),
    pickup: { armor: 100, armorClass: 1 },
    message: 'Put on a thimble helmet. Safety first!',
    sound: 'item-armor',
  }),
  defineItem({
    id: 'tin-can-armor',
    name: 'Tin Can Armor',
    glyph: 'A',
    sheet: S('tin-can-armor', 32, 32),
    anims: { idle: { frames: [0, 1], fps: 3, loop: true } },
    pickup: { armor: 200, armorClass: 2 },
    message: 'TIN CAN ARMOR! You are a tiny knight.',
    sound: 'item-armor',
  }),
];
