import test from 'node:test';
import assert from 'node:assert/strict';
import { tryPickup } from '../src/engine/things/pickups.js';
import { makeWorld, mockInput, room, run } from './helpers.js';

const arena = room(['#########', '#.......#', '#.......#', '#.......#', '#########'], ['', ' >     i']);

test('armor absorbs a third (class 1) or half (class 2) of the damage', () => {
  const w = makeWorld(arena, { noMonsters: true });
  const p = w.player.player;
  p.armor = 100;
  p.armorClass = 1;
  w.damage(w.player, 30, null, null);
  assert.equal(p.armor, 90);
  assert.equal(p.health, 80);
  p.armorClass = 2;
  w.damage(w.player, 30, null, null);
  assert.equal(p.armor, 75);
  assert.equal(p.health, 65);
});

test('running out of armor drops the armor class', () => {
  const w = makeWorld(arena, { noMonsters: true });
  const p = w.player.player;
  p.armor = 5;
  p.armorClass = 2;
  w.damage(w.player, 40, null, null);
  assert.equal(p.armor, 0);
  assert.equal(p.armorClass, 0);
  assert.equal(p.health, 65);
});

test('the easiest skill halves the damage the player takes', () => {
  const w = makeWorld(arena, { noMonsters: true, skill: 1 });
  w.damage(w.player, 30, null, null);
  assert.equal(w.player.player.health, 85);
});

test('god mode ignores damage', () => {
  const w = makeWorld(arena, { noMonsters: true });
  w.player.player.god = true;
  w.damage(w.player, 500, null, null);
  assert.equal(w.player.player.health, 100);
});

test('killing a monster counts the kill and drops its item', () => {
  const w = makeWorld(arena);
  const rat = w.things.find((t) => t.kind === 'monster');
  assert.ok(rat);
  w.damage(rat, 1000, w.player, w.player);
  assert.ok(rat.dead);
  assert.equal(w.stats.kills, 1);
  run(w, mockInput(), 0.5);
  assert.ok(w.things.some((t) => t.def.id === 'bands'), 'slingshot rats drop rubber bands');
});

test('pickups respect their limits', () => {
  const w = makeWorld(arena, { noMonsters: true });
  const p = w.player.player;
  const item = (id) => w.spawn(id, 2.5, 2.5);
  assert.equal(tryPickup(w, w.player, item('cheese-wedge')), false, 'full health: the cheese stays');
  p.health = 95;
  assert.equal(tryPickup(w, w.player, item('cheese-wedge')), true);
  assert.equal(p.health, 100);
  assert.equal(tryPickup(w, w.player, item('golden-cheese')), true, 'the golden cheese goes over 100');
  assert.ok(p.health > 100 && p.health <= 200);
  p.ammo.bands = p.maxAmmo.bands;
  assert.equal(tryPickup(w, w.player, item('bands-ball')), false, 'ammo is capped');
  const max = p.maxAmmo.bands;
  assert.equal(tryPickup(w, w.player, item('lunchbox')), true);
  assert.equal(p.maxAmmo.bands, max * 2, 'the lunchbox doubles capacity');
});

test('the bone shotgun hits what it is pointed at and never runs out', () => {
  const w = makeWorld(arena);
  const rat = w.things.find((t) => t.kind === 'monster');
  const p = w.player.player;
  assert.equal(p.weapon, 'bone-shotgun', 'you start with it');
  const input = mockInput();
  input.hold('fire');
  const ammo = { ...p.ammo };
  run(w, input, 3);
  assert.deepEqual(p.ammo, ammo, 'no ammo was spent');
  assert.ok(rat.dead, 'the rat in front of the player went down');
  assert.equal(p.weapon, 'bone-shotgun', 'still firing it');
});

test('effects (puffs, fur, goo, explosions) play once and disappear', () => {
  const w = makeWorld(arena, { noMonsters: true });
  const fx = ['puff', 'fluff', 'goo', 'explosion', 'teleport-fog'].map((id) => w.spawnEffect(id, 4.5, 2.5, 0.5));
  run(w, mockInput(), 1);
  for (const e of fx) assert.ok(e.removed, `${e.def.id} is gone`);
});

test('the crowbar, slingshot, flare gun and blow torch all take down a rat', () => {
  const close = room(['#########', '#.......#', '#.......#', '#.......#', '#########'], ['', ' > i']);
  for (const id of ['crowbar', 'slingshot', 'flare-gun', 'blow-torch']) {
    const w = makeWorld(close);
    const p = w.player.player;
    const rat = w.things.find((t) => t.kind === 'monster');
    const def = w.registry.weapons.get(id);
    p.god = true; // the flare's splash reaches back this close
    p.weapons.add(id);
    p.weapon = id;
    if (def.ammo) p.ammo[def.ammo] = 50;
    const input = mockInput();
    input.hold('fire');
    run(w, input, 4);
    assert.ok(rat.dead, `${id}: the rat went down`);
    if (def.ammo) assert.ok(p.ammo[def.ammo] < 50, `${id}: it used ${def.ammo}`);
  }
});

test('weapons that share a slot take turns on its number key', () => {
  const w = makeWorld(arena, { noMonsters: true });
  const p = w.player.player;
  p.weapons.add('crowbar');
  p.weapons.add('slingshot');
  p.ammo.marbles = 10;
  const input = mockInput();
  const press = (key) => {
    input.tap(key);
    run(w, input, 1);
    return p.weapon;
  };
  assert.equal(press('weapon1'), 'crowbar', 'the crowbar comes up first');
  assert.equal(press('weapon1'), 'claws');
  assert.equal(press('weapon2'), 'bone-shotgun', 'the shotgun comes up first');
  assert.equal(press('weapon2'), 'slingshot');
});
