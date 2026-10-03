import { defineWeapon } from '../../engine/defs.js';

// Slot 3: the RUBBER BAND GATLING. A spinning pencil-sharpener barrel that
// flings rubber bands as fast as you can hold the trigger (Doom's chaingun).
export default defineWeapon({
  id: 'band-gatling',
  name: 'RUBBER BAND GATLING',
  slot: 3,
  ammo: 'bands',
  priority: 5,
  accurateFirstShot: true,
  flashLight: 1,
  sheet: { src: 'assets/sprites/weapons/band-gatling.png', frameWidth: 128, frameHeight: 96 },
  anims: {
    idle: [0],
    fire: { frames: [1, 2], durations: [0.07, 0.07], fireAt: [0, 1], fullbright: [0, 1] },
  },
  fire: { kind: 'hitscan', damage: [5, 15], spread: 0.06, range: 48 },
  sounds: { fire: 'band-fire' },
});
