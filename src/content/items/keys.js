import { defineItem } from '../../engine/defs.js';

// House keys. Doors with a matching coloured stripe need them.
const key = (color, glyph, label) =>
  defineItem({
    id: `key-${color}`,
    name: `${label} Key`,
    glyph,
    sheet: { src: `assets/sprites/items/key-${color}.png`, frameWidth: 16, frameHeight: 16 },
    anims: { idle: { frames: [0, 1], fps: 2, loop: true, fullbright: [0] } },
    pickup: { key: color, always: true },
    message: `Picked up the ${label.toLowerCase()} key.`,
    sound: 'key-pickup',
  });

export default [key('blue', 'b', 'BLUE'), key('yellow', 'y', 'YELLOW'), key('red', 'R', 'RED')];
