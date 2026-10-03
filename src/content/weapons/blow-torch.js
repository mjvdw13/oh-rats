import { defineWeapon } from '../../engine/defs.js';

// Slot 7: the BLOW TORCH. A propane torch from Dad's workbench. Hold fire for
// a roaring jet of flame: it doesn't reach far, but nothing up close likes it.
export default defineWeapon({
  id: 'blow-torch',
  name: 'BLOW TORCH',
  slot: 7,
  ammo: 'propane',
  priority: 4,
  flashLight: 1,
  offset: [0, 4], // a taller frame than the others: this keeps the cylinder in view
  sheet: { src: 'assets/sprites/weapons/blow-torch.png', frameWidth: 128, frameHeight: 128 },
  anims: {
    idle: { frames: [0, 3], fps: 8, loop: true },
    fire: { frames: [1, 2], durations: [0.08, 0.08], fireAt: [0, 1], fullbright: [0, 1] },
  },
  fire: { kind: 'projectile', projectile: 'torch-flame', spread: 0.05 },
  sounds: { fire: 'torch-roar' },
});
