import { defineCheat } from '../engine/defs.js';

// Type these during play. '#' matches one digit.
export default [
  defineCheat({
    code: 'iddqd',
    run(game, world) {
      const p = world.player.player;
      p.god = !p.god;
      if (p.god) p.health = Math.max(p.health, 100);
      return p.god ? 'GOD MODE ON' : 'GOD MODE OFF';
    },
  }),
  defineCheat({
    code: 'zombie',
    run(game, world) {
      const p = world.player.player;
      p.god = !p.god;
      if (p.god) p.health = Math.max(p.health, 100);
      return p.god ? 'ALREADY DEAD: NOTHING CAN HURT YOU' : 'ZOMBIE MODE OFF';
    },
  }),
  defineCheat({
    code: 'idkfa',
    run(game, world) {
      game.giveEverything(world);
      return 'VERY HAPPY AMMO ADDED';
    },
  }),
  defineCheat({
    code: 'cheese',
    run(game, world) {
      game.giveEverything(world);
      world.player.player.health = Math.max(world.player.player.health, 100);
      return 'ALL THE CHEESE! ALL THE WEAPONS!';
    },
  }),
  defineCheat({
    code: 'idclip',
    run(game, world) {
      const p = world.player.player;
      p.noclip = !p.noclip;
      return p.noclip ? 'WALK THROUGH WALLS ON' : 'WALK THROUGH WALLS OFF';
    },
  }),
  defineCheat({
    code: 'iddt',
    run(game) {
      game.hud.revealThings = !game.hud.revealThings;
      return game.hud.revealThings ? 'MAP REVEALED' : 'MAP HIDDEN';
    },
  }),
  defineCheat({
    code: 'idclev##',
    run(game, world, a, b) {
      const ep = Number(a);
      const map = Number(b);
      const episode = [...game.registry.episodes.values()][ep - 1];
      const id = episode?.levels[map - 1];
      if (!id) return 'NO SUCH LEVEL';
      game.startLevel(id, world.player.player.snapshot());
      return `WARPING TO ${id.toUpperCase()}`;
    },
  }),
];
