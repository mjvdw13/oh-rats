import { defineWeapon } from '../../engine/defs.js';

// Slot 2 (with the Bone Shotgun): the SLINGSHOT. Pull back, aim, let go: a
// glass marble flies dead straight and hits hard. Slow, but great at long
// range. Press 2 again to switch back to the shotgun.
export default defineWeapon({
  id: 'slingshot',
  name: 'SLINGSHOT',
  slot: 2,
  order: 1,
  ammo: 'marbles',
  priority: 2.5,
  offset: [0, 18],
  sheet: { src: 'assets/sprites/weapons/slingshot.png', frameWidth: 128, frameHeight: 96 },
  anims: {
    idle: [0],
    fire: { frames: [1, 2, 3, 0], durations: [0.16, 0.06, 0.12, 0.16], fireAt: 1, events: { 0: 'sound:slingshot-pull' } },
  },
  fire: { kind: 'projectile', projectile: 'marble' },
  sounds: { fire: 'slingshot-fire' },
});
