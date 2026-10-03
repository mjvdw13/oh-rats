import { defineAmmo } from '../engine/defs.js';

// `max` is the carry limit (doubled by a lunchbox); `clip` is what a lunchbox hands out.
// The Bone Shotgun needs no ammo at all.
export default [
  defineAmmo({ id: 'bands', name: 'Rubber bands', short: 'BAND', max: 200, clip: 10 }),
  defineAmmo({ id: 'soda', name: 'Soda cans', short: 'SODA', max: 50, clip: 1 }),
  defineAmmo({ id: 'batteries', name: 'Batteries', short: 'BATT', max: 300, clip: 20 }),
  defineAmmo({ id: 'marbles', name: 'Marbles', short: 'MARB', max: 100, clip: 5 }),
  defineAmmo({ id: 'flares', name: 'Flares', short: 'FLAR', max: 40, clip: 2 }),
  defineAmmo({ id: 'propane', name: 'Propane', short: 'GAS', max: 300, clip: 20 }),
];
