import { defineWeapon } from '../../engine/defs.js';

// Slot 4: the SODA BAZOOKA. Launches shaken-up soda cans that burst in a
// sticky, fizzy KA-BLOOSH (Doom's rocket launcher). Mind the splash!
export default defineWeapon({
  id: 'soda-bazooka',
  name: 'SODA BAZOOKA',
  slot: 4,
  ammo: 'soda',
  priority: 1,
  flashLight: 2,
  sheet: { src: 'assets/sprites/weapons/soda-bazooka.png', frameWidth: 128, frameHeight: 96 },
  anims: {
    idle: [0],
    fire: { frames: [1, 2, 0], durations: [0.1, 0.18, 0.4], fireAt: 0, fullbright: [0] },
  },
  fire: { kind: 'projectile', projectile: 'soda-rocket' },
  sounds: { fire: 'soda-fire' },
});
