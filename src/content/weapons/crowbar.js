import { defineWeapon } from '../../engine/defs.js';

// Slot 1 (with the claws): the CROWBAR. A big red crowbar, much heavier than
// a rat. It hits harder and reaches further than your claws, but it's slower.
// Press 1 again to switch back to the claws.
export default defineWeapon({
  id: 'crowbar',
  name: 'CROWBAR',
  slot: 1,
  order: -1, // comes up first when you press 1
  ammo: null,
  priority: 1,
  noise: false,
  offset: [0, 18],
  sheet: { src: 'assets/sprites/weapons/crowbar.png', frameWidth: 160, frameHeight: 96 },
  anims: {
    idle: [0],
    fire: { frames: [1, 2, 3, 0], durations: [0.1, 0.06, 0.16, 0.12], fireAt: 1 },
  },
  fire: { kind: 'melee', damage: [10, 35], range: 1.45, arc: 0.6, berserkMultiplier: 4, hitSound: 'crowbar-hit', missSound: 'crowbar-swing' },
  bob: 1.1,
});
