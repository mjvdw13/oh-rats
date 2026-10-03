import { defineWeapon } from '../../engine/defs.js';

// Slot 6: the FLARE GUN. Fires a fizzing red flare that bursts in a shower of
// sparks. Light up the dark corners (and the rats in them).
export default defineWeapon({
  id: 'flare-gun',
  name: 'FLARE GUN',
  slot: 6,
  ammo: 'flares',
  priority: 3,
  flashLight: 2,
  offset: [0, 18],
  sheet: { src: 'assets/sprites/weapons/flare-gun.png', frameWidth: 128, frameHeight: 96 },
  anims: {
    idle: [0],
    fire: { frames: [1, 2, 3, 3, 0], durations: [0.08, 0.14, 0.2, 0.15, 0.15], fireAt: 0, fullbright: [0], events: { 2: 'sound:flare-reload' } },
  },
  fire: { kind: 'projectile', projectile: 'flare' },
  sounds: { fire: 'flare-fire' },
});
