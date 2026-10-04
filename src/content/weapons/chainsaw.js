import { defineWeapon } from '../../engine/defs.js';

// Slot 1 (with the claws and the crowbar): the CHAINSAW. The Lumberjack drops
// it when you beat him. Hold fire and it chews through anything up close.
// Press 1 again to switch to the crowbar or your claws.
export default defineWeapon({
  id: 'chainsaw',
  name: 'CHAINSAW',
  slot: 1,
  order: -2, // comes up first when you press 1
  ammo: null,
  priority: 2,
  noise: true, // it's LOUD: every rat nearby hears it
  offset: [0, 10],
  sheet: { src: 'assets/sprites/weapons/chainsaw.png', frameWidth: 160, frameHeight: 96 },
  anims: {
    idle: { frames: [0, 3], fps: 10, loop: true }, // rumbling while it idles
    fire: { frames: [1, 2], durations: [0.07, 0.07], fireAt: [0, 1] },
  },
  fire: { kind: 'melee', damage: [3, 11], range: 1.35, arc: 0.6, berserkMultiplier: 3, hitSound: 'chainsaw-hit' },
  sounds: { fire: 'chainsaw-buzz', raise: 'chainsaw-start' },
  bob: 0.9,
});
