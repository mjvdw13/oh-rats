import { defineWeapon } from '../../engine/defs.js';

// Slot 2: the BONE SHOTGUN. Built from old bones, it rattles when you pump it
// and it NEVER runs out of ammo. You start with it.
export default defineWeapon({
  id: 'bone-shotgun',
  name: 'BONE SHOTGUN',
  slot: 2,
  ammo: null, // infinite ammo
  priority: 2,
  flashLight: 1,
  sheet: { src: 'assets/sprites/weapons/bone-shotgun.png', frameWidth: 128, frameHeight: 96 },
  anims: {
    idle: [0],
    fire: {
      frames: [1, 2, 0, 3, 4, 3, 0],
      durations: [0.07, 0.1, 0.08, 0.13, 0.13, 0.1, 0.12],
      fireAt: 0,
      fullbright: [0],
      events: { 3: 'sound:bone-rattle' },
    },
  },
  fire: { kind: 'hitscan', damage: [5, 15], pellets: 7, spread: 0.1, range: 40 },
  sounds: { fire: 'bone-blast' },
});
