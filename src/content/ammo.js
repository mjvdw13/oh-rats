import { defineAmmo } from '../engine/defs.js';

// `max` is the carry limit (doubled by a lunchbox); `clip` is what a lunchbox hands out.
// The Bone Shotgun needs no ammo at all.
export default [
  defineAmmo({ id: 'bands', name: 'Rubber bands', short: 'BAND', max: 200, clip: 10 }),
  defineAmmo({ id: 'soda', name: 'Soda cans', short: 'SODA', max: 50, clip: 1 }),
  defineAmmo({ id: 'batteries', name: 'Batteries', short: 'BATT', max: 300, clip: 20 }),
];
