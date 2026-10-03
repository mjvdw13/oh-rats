import { defineWeapon } from '../../engine/defs.js';

// Slot 5: the MEGA MICROWAVE. Runs on a LOT of batteries. Hums, dings, then
// fires a ball of pure microwave energy that zaps everything in the room
// (Doom's BFG). Uses 40 batteries a shot.
export default defineWeapon({
  id: 'mega-microwave',
  name: 'MEGA MICROWAVE',
  slot: 5,
  ammo: 'batteries',
  ammoPerShot: 40,
  priority: 6,
  flashLight: 2,
  offset: [0, 18],
  sheet: { src: 'assets/sprites/weapons/mega-microwave.png', frameWidth: 128, frameHeight: 96 },
  anims: {
    idle: { frames: [0, 1], fps: 3, loop: true },
    fire: {
      frames: [2, 2, 3, 4, 0],
      durations: [0.25, 0.3, 0.12, 0.25, 0.3],
      fireAt: 2,
      fullbright: [0, 1, 2],
      events: { 0: 'sound:microwave-hum' },
    },
  },
  fire: { kind: 'projectile', projectile: 'microwave-blast' },
  sounds: { fire: 'microwave-ding' },
});
