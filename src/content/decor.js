import { defineDecoration } from '../engine/defs.js';

const S = (name, w, h) => ({ src: `assets/sprites/decor/${name}.png`, frameWidth: w, frameHeight: h });

// Things around the house. `solid` decorations block movement; `hanging`
// ones attach to the ceiling.
export default [
  // Living room and kitchen.
  defineDecoration({ id: 'couch', glyph: 'H', sheet: S('couch', 64, 40), solid: true, radius: 0.45 }),
  defineDecoration({ id: 'kitchen-chair', glyph: 'h', sheet: S('kitchen-chair', 32, 40), solid: true, radius: 0.22 }),
  defineDecoration({ id: 'table', glyph: 'T', sheet: S('table', 56, 32), solid: true, radius: 0.42 }),
  defineDecoration({ id: 'houseplant', glyph: 'F', sheet: S('houseplant', 32, 48), solid: true, radius: 0.22 }),
  defineDecoration({
    id: 'floor-lamp',
    glyph: 'l',
    sheet: S('floor-lamp', 24, 56),
    anims: { idle: { frames: [0], fps: 1, fullbright: true } },
    solid: true,
    radius: 0.15,
  }),
  defineDecoration({
    id: 'ceiling-lamp',
    glyph: 'u',
    sheet: S('ceiling-lamp', 48, 16),
    anims: { idle: { frames: [0], fps: 1, fullbright: true } },
    hanging: true,
  }),
  defineDecoration({
    id: 'tv',
    glyph: 'V',
    sheet: S('tv', 40, 40),
    anims: { idle: { frames: [0, 1, 2], fps: 6, loop: true, fullbright: true } },
    solid: true,
    radius: 0.3,
  }),
  defineDecoration({ id: 'trash-can', glyph: 'k', sheet: S('trash-can', 24, 32), solid: true, radius: 0.18 }),
  // Playroom and bedrooms.
  defineDecoration({ id: 'teddy-bear', glyph: 'Y', sheet: S('teddy-bear', 32, 32), solid: true, radius: 0.2 }),
  defineDecoration({ id: 'toy-blocks', glyph: 'z', sheet: S('toy-blocks', 32, 24) }),
  defineDecoration({ id: 'toy-car', glyph: 'C', sheet: S('toy-car', 40, 24), solid: true, radius: 0.26 }),
  defineDecoration({ id: 'sock-pile', glyph: 'P', sheet: S('sock-pile', 40, 16) }),
  // Basement and laundry.
  defineDecoration({ id: 'cardboard-box', glyph: 'X', sheet: S('cardboard-box', 40, 40), solid: true, radius: 0.36 }),
  defineDecoration({ id: 'laundry-basket', glyph: 'L', sheet: S('laundry-basket', 40, 32), solid: true, radius: 0.3 }),
  defineDecoration({
    id: 'washing-machine',
    glyph: 'W',
    sheet: S('washing-machine', 48, 56),
    anims: { idle: { frames: [0, 1], fps: 4, loop: true } },
    solid: true,
    radius: 0.4,
  }),
  defineDecoration({ id: 'paint-cans', glyph: 'I', sheet: S('paint-cans', 32, 24), solid: true, radius: 0.24 }),
  defineDecoration({
    id: 'space-heater',
    glyph: 'U',
    sheet: S('space-heater', 24, 40),
    anims: { idle: { frames: [0, 1, 2, 1], fps: 6, loop: true, fullbright: true } },
    solid: true,
    radius: 0.2,
  }),
  // Shake it and it goes KA-BLOOSH: a big bottle of soda (Doom's barrel).
  defineDecoration({
    id: 'soda-bottle',
    glyph: 'o',
    sheet: S('soda-bottle', 24, 40),
    anims: {
      idle: { frames: [0, 1], fps: 3, loop: true },
      death: { frames: [2, 3, 4, 5, 6], fps: 10, fullbright: [1, 2, 3, 4] },
    },
    solid: true,
    radius: 0.2,
    health: 20,
    bleeds: false,
    explode: { radius: 2.6, damage: 128, sound: 'fizz-boom' },
    sounds: { death: 'fizz-boom' },
  }),
  // Leftovers: chicken bones and a puddle.
  defineDecoration({ id: 'bones', glyph: 'x', sheet: S('bones', 32, 16) }),
  defineDecoration({ id: 'puddle', glyph: '~', sheet: S('puddle', 40, 8) }),
  // The warehouse. Every glyph is taken, so these have none: the warehouse
  // levels give them one in their `thingLegend` (tools/levels/warehouse.py).
  defineDecoration({ id: 'pallet', sheet: S('pallet', 48, 48), solid: true, radius: 0.42 }),
  defineDecoration({ id: 'forklift', sheet: S('forklift', 64, 56), solid: true, radius: 0.45 }),
  defineDecoration({ id: 'traffic-cone', sheet: S('traffic-cone', 24, 32), solid: true, radius: 0.14 }),
  defineDecoration({ id: 'log-pile', sheet: S('log-pile', 48, 40), solid: true, radius: 0.42 }),
];
