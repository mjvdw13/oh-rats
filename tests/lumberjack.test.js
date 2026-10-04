import test from 'node:test';
import assert from 'node:assert/strict';
import { makeWorld, mockInput, room, run } from './helpers.js';

// A long hall with the Lumberjack at the far end. He has no glyph of his own,
// so the room gives him one, the way a warehouse level would.
const hall = room(
  ['##################', '#................#', '#................#', '#................#', '##################'],
  ['', '', ' >             L'],
  { thingLegend: { L: 'lumberjack' } },
);

test('beating the Lumberjack drops his chainsaw, and picking it up gives you the CHAINSAW', () => {
  const w = makeWorld(hall);
  const boss = w.things.find((t) => t.def.id === 'lumberjack');
  assert.ok(boss, 'the Lumberjack is in the hall');
  w.damage(boss, 99999, w.player, w.player);
  const saw = w.things.find((t) => t.def.id === 'pickup-chainsaw');
  assert.ok(saw, 'he drops the chainsaw');
  assert.ok(w.messages.some((m) => m.includes('CHAINSAW')));
  w.player.x = saw.x;
  w.player.y = saw.y;
  run(w, mockInput(), 0.2);
  assert.ok(w.player.player.weapons.has('chainsaw'));
});

test('he throws logs from far away', () => {
  const w = makeWorld(hall, { seed: 3 });
  w.player.player.god = true;
  const boss = w.things.find((t) => t.def.id === 'lumberjack');
  w.wakeMonster(boss, w.player);
  let logs = 0;
  run(w, mockInput(), 6, (world) => {
    logs = Math.max(logs, world.things.filter((t) => t.def.id === 'log' && !t.removed).length);
  });
  assert.ok(logs > 0, 'a log was thrown');
});

test('the chainsaw chews through a rat up close', () => {
  const arena = room(['#######', '#.....#', '#######'], ['', ' > r']);
  const w = makeWorld(arena);
  const p = w.player.player;
  p.weapons.add('chainsaw');
  p.weapon = 'chainsaw';
  const rat = w.things.find((t) => t.def.id === 'rat');
  rat.x = w.player.x + 1;
  rat.y = w.player.y;
  const input = mockInput();
  input.hold('fire');
  run(w, input, 2);
  assert.ok(rat.dead, 'the rat is down');
});
