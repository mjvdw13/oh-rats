import { defineItem } from '../../engine/defs.js';

const S = (name, w, h) => ({ src: `assets/sprites/items/${name}.png`, frameWidth: w, frameHeight: h });

// Ammo for the weapons you find. (The Bone Shotgun needs none.)
export default [
  defineItem({ id: 'bands', name: 'Rubber Bands', glyph: 's', sheet: S('bands', 16, 16), pickup: { ammo: { bands: 10 } }, message: 'Picked up some rubber bands.', sound: 'item-ammo' }),
  defineItem({ id: 'bands-ball', name: 'Rubber Band Ball', glyph: 'S', sheet: S('bands-ball', 24, 24), pickup: { ammo: { bands: 50 } }, message: 'Picked up a big rubber band ball.', sound: 'item-ammo' }),
  defineItem({ id: 'soda-can', name: 'Soda Can', glyph: 'n', sheet: S('soda-can', 16, 24), pickup: { ammo: { soda: 1 } }, message: 'Picked up a soda can. Shake it!', sound: 'item-ammo' }),
  defineItem({ id: 'six-pack', name: 'Six-Pack of Soda', glyph: 'N', sheet: S('six-pack', 32, 24), pickup: { ammo: { soda: 5 } }, message: 'Picked up a six-pack of soda.', sound: 'item-ammo' }),
  defineItem({ id: 'batteries', name: 'Batteries', glyph: 'q', sheet: S('batteries', 24, 16), pickup: { ammo: { batteries: 20 } }, message: 'Picked up some batteries.', sound: 'item-ammo' }),
  defineItem({ id: 'battery-pack', name: 'Battery Mega-Pack', glyph: 'Q', sheet: S('battery-pack', 32, 24), pickup: { ammo: { batteries: 100 } }, message: 'Picked up a battery mega-pack!', sound: 'item-ammo' }),
  defineItem({ id: 'marbles', name: 'Marbles', glyph: 'M', sheet: S('marbles', 16, 16), pickup: { ammo: { marbles: 5 } }, message: 'Picked up a handful of marbles.', sound: 'item-ammo' }),
  defineItem({ id: 'marble-jar', name: 'Jar of Marbles', glyph: 'J', sheet: S('marble-jar', 24, 24), pickup: { ammo: { marbles: 25 } }, message: 'Picked up a whole jar of marbles!', sound: 'item-ammo' }),
  defineItem({ id: 'flares', name: 'Flares', glyph: 'E', sheet: S('flares', 24, 16), pickup: { ammo: { flares: 2 } }, message: 'Picked up a couple of flares.', sound: 'item-ammo' }),
  defineItem({ id: 'flare-box', name: 'Box of Flares', glyph: 'Z', sheet: S('flare-box', 32, 24), pickup: { ammo: { flares: 8 } }, message: 'Picked up a box of flares!', sound: 'item-ammo' }),
  defineItem({ id: 'propane-can', name: 'Propane Can', glyph: 't', sheet: S('propane-can', 16, 24), pickup: { ammo: { propane: 25 } }, message: 'Picked up a little propane can.', sound: 'item-ammo' }),
  defineItem({ id: 'propane-tank', name: 'Propane Tank', glyph: '*', sheet: S('propane-tank', 24, 32), pickup: { ammo: { propane: 100 } }, message: 'Picked up a big propane tank!', sound: 'item-ammo' }),
  defineItem({
    id: 'lunchbox',
    name: 'Lunchbox',
    glyph: 'B',
    sheet: S('lunchbox', 32, 24),
    pickup: { backpack: true },
    message: 'Found a lunchbox! Room for LOTS more ammo.',
    sound: 'item-ammo',
  }),
];
