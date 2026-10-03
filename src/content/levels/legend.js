// The shared map legend. Every level can use these glyphs, and can add or
// override glyphs in its own `legend` / `thingLegend`.
//
// TILE entries (the `tiles` grid):
//   { wall: 'texture' }                                  solid wall
//   { wall: 'texture', use: 'exit', switchTo: 'tex' }    usable switch (any trigger action)
//   { door: 'texture', jamb?, lock?, style?, secret?, tag? }
//   { floor, ceiling ('sky' for open air), light (0-255), lightFx?, damage?, secret?, exit?, tag? }
//   { base: '.', ...changes }                            copy another glyph and change parts
// A space is solid nothingness outside the map.
//
// THING entries (the `things` grid) map a glyph to a thing id, or to
// { type, skill: [..], ambush: true, angle: 'N' }. Every monster/item/
// decoration also has its own `glyph` (see src/content/monsters etc.).
// Player starts: ^ (facing north/up)  > (east)  v (south)  < (west).

export default {
  tiles: {
    // ---- Walls around the house
    '#': { wall: 'wallpaper-stripe' }, // hallways
    B: { wall: 'wallpaper-blue' }, // living room
    P: { wall: 'wallpaper-pink' }, // bedrooms
    Z: { wall: 'wallpaper-kids' }, // the playroom
    W: { wall: 'wainscot' }, // dining room
    w: { wall: 'wood-panel' }, // den and attic
    T: { wall: 'kitchen-tile' },
    C: { wall: 'kitchen-cabinet' },
    F: { wall: 'fridge' },
    S: { wall: 'stove' },
    b: { wall: 'bathroom-tile' },
    R: { wall: 'brick' },
    f: { wall: 'fireplace' },
    L: { wall: 'bookshelf' },
    N: { wall: 'window-day' },
    A: { wall: 'picture-dad' },
    a: { wall: 'picture-cheese' },
    // ---- Basement
    O: { wall: 'concrete' },
    o: { wall: 'concrete-dark' },
    H: { wall: 'concrete-stripe' },
    I: { wall: 'pipes' },
    U: { wall: 'furnace' },
    // ---- Vents
    V: { wall: 'vent-wall' },
    Y: { wall: 'vent-fan' },

    // ---- Doors (they slide open; use them with E/Space)
    D: { door: 'door-white', jamb: 'door-jamb' },
    E: { door: 'door-wood', jamb: 'door-jamb' },
    M: { door: 'door-metal', jamb: 'door-jamb' },
    Q: { door: 'door-closet', jamb: 'door-jamb', style: 'split' },
    G: { door: 'vent-cover', jamb: 'vent-wall' }, // a vent cover: pop it open and climb in
    1: { door: 'door-blue', jamb: 'door-jamb', lock: 'blue' },
    2: { door: 'door-yellow', jamb: 'door-jamb', lock: 'yellow' },
    3: { door: 'door-red', jamb: 'door-jamb', lock: 'red' },

    // ---- The exit: a mouse hole in the skirting board
    X: { wall: 'mouse-hole', use: 'exit', switchTo: 'mouse-hole-on' },

    // ---- Floors (and their ceilings)
    '.': { floor: 'wood-floor', ceiling: 'ceiling-plaster', light: 196 },
    ':': { floor: 'wood-floor', ceiling: 'ceiling-light', light: 228 },
    ',': { floor: 'carpet', ceiling: 'ceiling-plaster', light: 188 },
    ';': { floor: 'carpet', ceiling: 'ceiling-light', light: 220 },
    r: { floor: 'rug', ceiling: 'ceiling-plaster', light: 196 },
    k: { floor: 'checker', ceiling: 'ceiling-plaster', light: 204 },
    j: { floor: 'checker', ceiling: 'ceiling-light', light: 228 },
    e: { floor: 'bath-floor', ceiling: 'ceiling-light', light: 216 },
    p: { floor: 'playmat', ceiling: 'ceiling-plaster', light: 204 },
    '~': { floor: 'lava', ceiling: 'ceiling-plaster', light: 230, lightFx: 'glow', damage: 8 }, // THE FLOOR IS LAVA!
    '-': { floor: 'concrete-floor', ceiling: 'joists', light: 160 },
    '=': { floor: 'concrete-floor', ceiling: 'ceiling-light', light: 204 },
    n: { floor: 'vent-floor', ceiling: 'vent-ceiling', light: 140 },
    m: { floor: 'vent-floor', ceiling: 'vent-ceiling', light: 176 },
    g: { floor: 'grass', ceiling: 'sky', light: 232 },
    t: { floor: 'wood-floor', ceiling: 'ceiling-beams', light: 176 },
  },

  things: {
    // Extra rats on the harder skills only.
    '!': { type: 'slingshot-rat', skill: [3, 4, 5] },
    '@': { type: 'spitball-rat', skill: [3, 4, 5] },
    '&': { type: 'chonk', skill: [3, 4, 5] },
    '%': { type: 'pack-rat', skill: [4, 5] },
    $: { type: 'rat', skill: [3, 4, 5] },
    '`': { type: 'ninja-rat', skill: [4, 5] },
    // Extra help on the easy skills only.
    '+': { type: 'cheese-wedge', skill: [1, 2] },
    '=': { type: 'bands-ball', skill: [1, 2] },
    '"': { type: 'thimble-helmet', skill: [1, 2] },
  },
};
