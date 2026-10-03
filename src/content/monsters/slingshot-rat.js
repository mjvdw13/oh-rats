import { defineMonster } from '../../engine/defs.js';

// A scrappy rat standing on its hind legs, plinking pebbles with a slingshot
// (Doom's zombieman). Drops rubber bands.
export default defineMonster({
  id: 'slingshot-rat',
  name: 'Slingshot Rat',
  glyph: 'i',
  sheet: { src: 'assets/sprites/monsters/slingshot-rat.png', frameWidth: 64, frameHeight: 64 },
  health: 20,
  speed: 2.2,
  radius: 0.28,
  height: 0.8,
  painChance: 0.78,
  reactionTime: 0.5,
  cooldown: [1.1, 2.6],
  attack: { kind: 'hitscan', damage: [3, 12], spread: 0.11, range: 24, sound: 'slingshot' },
  anims: {
    idle: { frames: [0, 2], fps: 2, loop: true },
    walk: { frames: [0, 1, 2, 3], fps: 6 },
    attack: { frames: [4, 5, 4], durations: [0.3, 0.12, 0.2], fireAt: 1 },
    pain: { frames: [6], durations: [0.15] },
    death: { frames: [7, 8, 9, 10, 11], fps: 8 },
  },
  blood: 'fluff', // tufts of fur instead of blood
  sounds: { sight: 'ratman-sight', active: 'ratman-active', pain: 'ratman-pain', death: 'ratman-death' },
  drops: ['bands'],
});
