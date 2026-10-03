import { defineMonster } from '../../engine/defs.js';

// A rat with a drinking-straw blowgun that spits soggy green spitballs
// (Doom's imp). Gross. Up close it scratches.
export default defineMonster({
  id: 'spitball-rat',
  name: 'Spitball Rat',
  glyph: 'm',
  sheet: { src: 'assets/sprites/monsters/spitball-rat.png', frameWidth: 64, frameHeight: 64 },
  health: 60,
  speed: 2.4,
  radius: 0.3,
  height: 0.8,
  painChance: 0.7,
  reactionTime: 0.45,
  cooldown: [1.2, 2.6],
  attack: { kind: 'projectile', projectile: 'spitball', range: 32 },
  melee: { kind: 'melee', damage: [3, 24], range: 1.0, hitSound: 'claw-hit' },
  anims: {
    idle: { frames: [0, 2], fps: 2, loop: true },
    walk: { frames: [0, 1, 2, 3], fps: 6 },
    attack: { frames: [4, 5, 6], durations: [0.25, 0.2, 0.25], fireAt: 2 },
    pain: { frames: [7], durations: [0.15] },
    death: { frames: [8, 9, 10, 11, 12], fps: 8 },
  },
  blood: 'fluff', // tufts of fur instead of blood
  sounds: { sight: 'spitter-sight', active: 'spitter-active', pain: 'spitter-pain', death: 'spitter-death' },
});
