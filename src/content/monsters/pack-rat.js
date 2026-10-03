import { defineMonster } from '../../engine/defs.js';

// A big old rat hauling a backpack stuffed with junk it has collected. It
// lobs balls of junk in an arc, and it hits hard up close.
export default defineMonster({
  id: 'pack-rat',
  name: 'Pack Rat',
  glyph: 'G',
  sheet: { src: 'assets/sprites/monsters/pack-rat.png', frameWidth: 80, frameHeight: 80 },
  health: 300,
  speed: 1.7,
  radius: 0.42,
  height: 1.2,
  painChance: 0.3,
  reactionTime: 0.6,
  mass: 900,
  cooldown: [1.4, 2.8],
  attack: { kind: 'projectile', projectile: 'junk-ball', range: 18, minRange: 2 },
  melee: { kind: 'melee', damage: [8, 40], range: 1.15, hitSound: 'thump' },
  anims: {
    idle: { frames: [0, 2], fps: 1.5, loop: true },
    walk: { frames: [0, 1, 2, 3], fps: 4 },
    attack: { frames: [4, 5, 6], durations: [0.35, 0.25, 0.3], fireAt: 2 },
    pain: { frames: [7], durations: [0.2] },
    death: { frames: [8, 9, 10, 11, 12], fps: 7 },
  },
  blood: 'fluff', // tufts of fur instead of blood
  sounds: { sight: 'packrat-sight', active: 'packrat-active', pain: 'packrat-pain', death: 'packrat-death' },
  drops: [{ item: 'cheese-wedge', chance: 0.5 }],
});
