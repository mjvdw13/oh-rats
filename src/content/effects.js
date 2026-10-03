import { defineEffect, defineProjectile } from '../engine/defs.js';

const FX = (name, w, h) => ({ src: `assets/sprites/fx/${name}.png`, frameWidth: w, frameHeight: h });

export const effects = [
  // Dust where a shot hits a wall.
  defineEffect({ id: 'puff', sheet: FX('puff', 16, 16), anims: { idle: { frames: [0, 1, 2, 3], fps: 14, fullbright: [0] } }, rise: 0.3 }),
  // Tufts of fur where a shot hits a rat (no blood in this house).
  defineEffect({ id: 'fluff', sheet: FX('fluff', 16, 16), anims: { idle: { frames: [0, 1, 2], fps: 10 } }, rise: -0.3 }),
  // Green zombie goo when you get hurt.
  defineEffect({ id: 'goo', sheet: FX('goo', 16, 16), anims: { idle: { frames: [0, 1, 2], fps: 10 } }, rise: -0.4 }),
  // A big fizzy soda burst (exploding soda bottles).
  defineEffect({ id: 'explosion', sheet: FX('explosion', 64, 64), anims: { idle: { frames: [0, 1, 2, 3, 4], fps: 12 } }, fullbright: true }),
  // Sparkly dust when something pops in (spawn triggers, rats falling out of vents).
  defineEffect({ id: 'teleport-fog', sheet: FX('teleport-fog', 48, 64), anims: { idle: { frames: [0, 1, 2, 3, 4, 5], fps: 10 } }, fullbright: true }),
];

export const projectiles = [
  // Spitball Rat: a soggy green spitball.
  defineProjectile({
    id: 'spitball',
    sheet: FX('spitball', 32, 32),
    anims: { fly: { frames: [0, 1], fps: 10, loop: true }, explode: { frames: [2, 3, 4], fps: 12 } },
    speed: 8,
    damage: [3, 24],
    radius: 0.14,
    sounds: { fire: 'spit', explode: 'splat' },
  }),
  // Dad: a spinning mousetrap that SNAPS when it lands.
  defineProjectile({
    id: 'mousetrap',
    sheet: FX('mousetrap', 32, 32),
    anims: { fly: { frames: [0, 1, 2, 3], fps: 14, loop: true }, explode: { frames: [4, 5, 6], fps: 12 } },
    fullbright: false,
    speed: 11,
    damage: [10, 40],
    splash: { radius: 1.6, damage: 60 },
    radius: 0.18,
    sounds: { fire: 'throw', explode: 'trap-snap' },
  }),
  // Pack Rat: a lobbed ball of junk (gum wrappers, bottle caps, string).
  defineProjectile({
    id: 'junk-ball',
    sheet: FX('junk-ball', 32, 32),
    anims: { fly: { frames: [0, 1, 2, 3], fps: 10, loop: true }, explode: { frames: [4, 5, 6], fps: 10 } },
    fullbright: false,
    speed: 7,
    gravity: 6,
    damage: [5, 20],
    splash: { radius: 1.6, damage: 40 },
    radius: 0.2,
    sounds: { fire: 'throw', explode: 'junk-crash' },
  }),
  // Soda Bazooka: a shaken soda can on a trail of fizz.
  defineProjectile({
    id: 'soda-rocket',
    sheet: FX('soda-rocket', 64, 64),
    anims: { fly: { frames: [0, 1], fps: 12, loop: true }, explode: { frames: [2, 3, 4, 5], fps: 10 } },
    speed: 15,
    damage: [20, 100],
    splash: { radius: 2.5, damage: 128 },
    radius: 0.14,
    sounds: { explode: 'fizz-boom' },
  }),
  // Mega Microwave: a crackling ball of microwave energy.
  defineProjectile({
    id: 'microwave-blast',
    sheet: FX('microwave-blast', 64, 64),
    anims: { fly: { frames: [0, 1], fps: 10, loop: true }, explode: { frames: [2, 3, 4, 5, 6], fps: 9 } },
    speed: 11,
    damage: [100, 400],
    splash: { radius: 4.5, damage: 400 },
    radius: 0.3,
    sounds: { explode: 'microwave-boom' },
  }),
];
