import { defineMonster } from '../../engine/defs.js';

// THE WAREHOUSE BOSS: THE LUMBERJACK. Flannel shirt, beanie, a beard you
// could lose a rat in, and a big orange chainsaw. He throws logs from far
// away and swings the chainsaw up close. Hurt him enough and he gets mad:
// faster, and throwing more. Beat him and he drops the chainsaw. It's yours!
// He has no glyph of his own: a level puts him on the map with its
// `thingLegend` (every glyph is taken).
export default defineMonster({
  id: 'lumberjack',
  name: 'The Lumberjack',
  sheet: { src: 'assets/sprites/monsters/lumberjack.png', frameWidth: 128, frameHeight: 128 },
  scale: 1.35,
  health: 3000,
  speed: 2.2,
  radius: 0.75,
  height: 2.4,
  painChance: 0.05,
  reactionTime: 0.3,
  mass: 4000,
  boss: true,
  splashImmune: true,
  sightRange: 64,
  cooldown: [1.4, 2.4],
  attack: { kind: 'projectile', projectile: 'log', range: 40, minRange: 2.5 },
  melee: { kind: 'melee', damage: [15, 30], range: 1.6, hitSound: 'chainsaw-hit' },
  aggression: 0.75,
  drops: ['pickup-chainsaw'],
  anims: {
    idle: { frames: [0, 1], fps: 2, loop: true },
    walk: { frames: [0, 1, 2, 3], fps: 5, events: { 1: 'sound:dad-step', 3: 'sound:dad-step' } },
    attack: { frames: [4, 5, 0], durations: [0.4, 0.2, 0.3], fireAt: 1 },
    melee: { frames: [6, 7, 6, 7], durations: [0.2, 0.15, 0.12, 0.2], fireAt: [1, 3], events: { 0: 'sound:chainsaw-buzz', 2: 'sound:chainsaw-buzz' } },
    pain: { frames: [8], durations: [0.2] },
    death: { frames: [9, 10, 11, 12, 13, 14], durations: [0.25, 0.25, 0.25, 0.3, 0.4, 0.5] },
  },
  blood: 'fluff', // fluff from his flannel shirt
  sounds: { sight: 'lumberjack-sight', active: 'chainsaw-start', pain: 'lumberjack-pain', death: 'lumberjack-death' },
  hooks: {
    onThink(world, self) {
      if (self.state === 'idle' || self.angry || self.health > self.def.health / 2) return;
      self.angry = true;
      self.speedMul = 1.35;
      world.playSoundFrom('chainsaw-start', self);
      world.message('THE LUMBERJACK: TIMBERRRR! NOW I AM MAD!');
    },
    // When he's angry he throws faster.
    onAttack(world, self) {
      if (self.angry) self.cooldown *= 0.6;
    },
    onDeath(world) {
      world.message('THE LUMBERJACK DROPPED HIS CHAINSAW! GRAB IT!');
    },
  },
});
