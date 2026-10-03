import { defineMonster } from '../../engine/defs.js';

// A very round, very hungry rat that charges at you teeth-first (Doom's
// pinky demon). Takes a lot of shotgun to stop.
export default defineMonster({
  id: 'chonk',
  name: 'Chonky Rat',
  glyph: 'c',
  sheet: { src: 'assets/sprites/monsters/chonk.png', frameWidth: 64, frameHeight: 64 },
  health: 150,
  speed: 4.4,
  radius: 0.38,
  height: 0.7,
  painChance: 0.7,
  reactionTime: 0.25,
  mass: 400,
  cooldown: [0.4, 0.8],
  melee: { kind: 'melee', damage: [4, 36], range: 1.05, hitSound: 'chomp' },
  anims: {
    idle: { frames: [0, 1], fps: 3, loop: true },
    walk: { frames: [0, 1, 2, 1], fps: 9 },
    melee: { frames: [3, 4, 3], durations: [0.2, 0.12, 0.2], fireAt: 1 },
    pain: { frames: [5], durations: [0.15] },
    death: { frames: [6, 7, 8, 9], fps: 8 },
  },
  blood: 'fluff', // tufts of fur instead of blood
  sounds: { sight: 'chonk-sight', active: 'chonk-active', pain: 'chonk-pain', death: 'chonk-death' },
});
