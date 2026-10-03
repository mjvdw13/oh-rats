import { defineTexture } from '../engine/defs.js';

// Wall, floor, ceiling and sky textures. Walls/flats are 64x64 PNGs in
// assets/textures/ (animated ones are horizontal strips of 64x64 frames).
// To add a texture: drop a PNG in assets/textures/ and add its name here.

const STATIC = [
  // Walls around the house
  'wallpaper-blue', 'wallpaper-stripe', 'wallpaper-pink', 'wallpaper-kids', 'wainscot', 'wood-panel',
  'kitchen-tile', 'kitchen-cabinet', 'fridge', 'stove', 'bathroom-tile', 'brick', 'bookshelf', 'window-day',
  'picture-dad', 'picture-cheese',
  // Basement
  'concrete', 'concrete-dark', 'concrete-stripe', 'pipes',
  // Vents
  'vent-wall', 'vent-ceiling',
  // Doors, switches and the mouse-hole exit
  'door-white', 'door-wood', 'door-blue', 'door-yellow', 'door-red', 'door-closet', 'door-metal', 'door-jamb',
  'vent-cover', 'light-switch', 'light-switch-on', 'mouse-hole', 'mouse-hole-on',
  // Floors
  'wood-floor', 'carpet', 'rug', 'checker', 'bath-floor', 'playmat', 'grass', 'concrete-floor', 'vent-floor',
  // Ceilings
  'ceiling-plaster', 'ceiling-light', 'ceiling-beams', 'joists',
];

const ANIMATED = {
  fireplace: { frames: 3, fps: 8 },
  furnace: { frames: 3, fps: 8 },
  'vent-fan': { frames: 3, fps: 12 },
  lava: { frames: 4, fps: 4 },
};

export default [
  ...STATIC.map((id) => defineTexture({ id, src: `assets/textures/${id}.png` })),
  ...Object.entries(ANIMATED).map(([id, a]) => defineTexture({ id, src: `assets/textures/${id}.png`, ...a })),
  defineTexture({ id: 'sky-day', src: 'assets/textures/sky-day.png', sky: true }),
];
