import { defineMonster } from '../../engine/defs.js';

// THE BOSS: DAD. The giant who owns this house. Bathrobe, slippers, coffee
// mug, and an endless supply of mousetraps to throw. Hurt him enough and he
// gets REALLY mad: faster, throwing more, and stomping so hard that rats fall
// out of the vents. Beating him wins the game (see the e1m5 trigger).
export default defineMonster({
  id: 'dad',
  name: 'Dad',
  glyph: 'K',
  sheet: { src: 'assets/sprites/monsters/dad.png', frameWidth: 128, frameHeight: 128 },
  scale: 1.35,
  health: 2500,
  speed: 1.8,
  radius: 0.75,
  height: 2.4,
  painChance: 0.06,
  reactionTime: 0.3,
  mass: 4000,
  boss: true,
  splashImmune: true,
  sightRange: 64,
  cooldown: [1.2, 2.2],
  attack: { kind: 'projectile', projectile: 'mousetrap', range: 48, minRange: 1.5 },
  melee: { kind: 'melee', damage: [20, 50], range: 1.4, hitSound: 'stomp' },
  aggression: 0.8,
  anims: {
    idle: { frames: [0, 1], fps: 2, loop: true },
    walk: { frames: [0, 1, 2, 3], fps: 4, events: { 1: 'sound:dad-step', 3: 'sound:dad-step' } },
    attack: { frames: [4, 5, 4, 5, 4, 5, 6], durations: [0.3, 0.12, 0.18, 0.12, 0.18, 0.12, 0.3], fireAt: [1, 3, 5] },
    melee: { frames: [7, 6], durations: [0.25, 0.25], fireAt: 1 },
    pain: { frames: [8], durations: [0.2] },
    death: { frames: [9, 10, 11, 12, 13, 14], durations: [0.25, 0.25, 0.25, 0.3, 0.4, 0.5] },
  },
  blood: 'fluff', // fluff from his fuzzy bathrobe
  sounds: { sight: 'dad-sight', active: 'dad-active', pain: 'dad-pain', death: 'dad-death' },
  hooks: {
    onThink(world, self, dt) {
      if (self.state === 'idle') return;
      const angry = self.health <= self.def.health / 2;
      if (angry && !self.angry) {
        self.angry = true;
        self.speedMul = 1.4;
        world.playSoundFrom('dad-sight', self);
        world.message('DAD: THAT IS IT! NOBODY MESSES WITH MY HOUSE!');
      }
      if (!angry) return;
      // Every so often he stomps, and rats fall out of the vents next to him.
      self.stomp = (self.stomp ?? 5) - dt;
      if (self.stomp > 0) return;
      self.stomp = 12;
      world.playSoundFrom('stomp', self);
      world.message('THE STOMP SHAKES RATS OUT OF THE VENTS!');
      for (let k = 0; k < 2; k++) {
        const a = self.angle + Math.PI / 2 + k * Math.PI;
        const x = self.x + Math.cos(a) * 1.8;
        const y = self.y + Math.sin(a) * 1.8;
        if (world.map.blocks(Math.floor(x), Math.floor(y))) continue;
        const m = world.spawn('rat', x, y, self.angle);
        if (m) {
          world.stats.totalKills++;
          world.spawn('teleport-fog', x, y);
          world.wakeMonster(m, world.player);
        }
      }
    },
    // When he's angry he throws faster.
    onAttack(world, self) {
      if (self.angry) self.cooldown *= 0.6;
    },
  },
});
