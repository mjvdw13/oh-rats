import { defineMonster } from '../../engine/defs.js';

// A sneaky black rat in a headband. It moves so fast it's almost invisible
// (Doom's spectre): look for the shimmer.
export default defineMonster({
  id: 'ninja-rat',
  name: 'Ninja Rat',
  glyph: 'j',
  sheet: { src: 'assets/sprites/monsters/ninja-rat.png', frameWidth: 48, frameHeight: 32 },
  scale: 1.2,
  renderStyle: 'fuzz',
  health: 40,
  speed: 5.6,
  radius: 0.22,
  height: 0.4,
  painChance: 0.6,
  reactionTime: 0.15,
  mass: 40,
  cooldown: [0.35, 0.7],
  melee: { kind: 'melee', damage: [4, 14], range: 0.85, hitSound: 'rat-bite' },
  anims: {
    idle: { frames: [0, 1], fps: 4, loop: true },
    walk: { frames: [0, 1, 2, 1], fps: 14 },
    melee: { frames: [3, 4], durations: [0.1, 0.14], fireAt: 1 },
    pain: { frames: [5], durations: [0.1] },
    death: { frames: [6, 7, 8, 9], fps: 10 },
  },
  blood: 'fluff', // tufts of fur instead of blood
  sounds: { sight: 'ninja-sight', active: 'rat-active', pain: 'rat-pain', death: 'rat-death' },
});
