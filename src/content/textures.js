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
  // The warehouse (episode 2)
  'corrugated', 'cinderblock', 'rack-boxes', 'crates', 'dock-door', 'warehouse-floor', 'floor-stripe', 'asphalt',
  'roof-truss', 'skylight', 'mouse-hole-block', 'mouse-hole-block-on', 'door-metal-blue', 'door-metal-yellow',
  'door-metal-red',
  // The freezer, the sorting room and the lumber yard
  'freezer-wall', 'cheese-shelf', 'freezer-door', 'ice-floor', 'freezer-ceiling', 'freezer-light', 'chute',
  'log-wall', 'barn-wood', 'sawdust',
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
  // Conveyor belts, one per direction they run (a level's `push` moves you).
  'conveyor-n': { frames: 4, fps: 10 },
  'conveyor-s': { frames: 4, fps: 10 },
  'conveyor-e': { frames: 4, fps: 10 },
  'conveyor-w': { frames: 4, fps: 10 },
  machine: { frames: 2, fps: 2 },
};

export default [
  ...STATIC.map((id) => defineTexture({ id, src: `assets/textures/${id}.png` })),
  ...Object.entries(ANIMATED).map(([id, a]) => defineTexture({ id, src: `assets/textures/${id}.png`, ...a })),
  defineTexture({ id: 'sky-day', src: 'assets/textures/sky-day.png', sky: true }),
];
