# TODO: handoff

State as of 2026-10-04: *Raccoon Alex* has been repurposed into *Oh, Rats!*, with
two episodes: the house and the warehouse. The game boots and plays from the
title screen to both finales. `npm test` (65 tests)
and `npm run validate` (0 errors, 0 warnings) both pass. All art is regenerated
from `tools/art/`.

## Done

- Rebranded: name, page, package, storage prefix, README, a new IDEAS.md (the
  son's original description and where each idea is). The personal photos and
  coworker caricatures from Raccoon Alex were removed.
- A brighter palette, plus new art for everything:
  - textures: house wallpapers, kitchen, bathroom, fireplace, vents, lava,
    the mouse-hole exit
  - sprites: the six rats, Dad, the five weapons, all items, house decor and
    effects
  - screens and HUD: the zombie-rat face, status bar, title, intermission
    and finale
- Content:
  - the zombie-rat hero, starting with the Bone Shotgun (no ammo type = infinite)
  - weapons: the Crowbar (slot 1, with the claws), the Slingshot (slot 2, with
    the shotgun; marbles), the Rubber Band Gatling, the Soda Bazooka, the Mega
    Microwave, the Flare Gun (6; flares) and the Blow Torch (7; propane)
  - held weapons sit 18px lower (`offset` in each weapon file) so the paws
    barely show. The claws are the exception, since the paws are the weapon.
  - the HUD's ammo tally switches to two columns when there are more than
    four ammo types (`src/engine/ui/hud.js`)
  - rats: House, Slingshot, Spitball, Chonky, Ninja and Pack
  - Dad: throws mousetraps; when angry he speeds up and stomps rats out of the
    vents
- New sounds, new major-key music and all new text.
- **Episode 2, the warehouse** (built 2026-10-03 and 2026-10-04):
  - five levels, built by `tools/levels/e2m*.py`, which share their legend
    and prop glyphs from `tools/levels/warehouse.py` (every shared glyph is
    taken): E2M1 The Loading Dock, E2M2 The Aisles (Flare Gun), E2M3 The Big
    Freezer (Blow Torch), E2M4 The Conveyor Belts (Mega Microwave) and E2M5
    The Lumber Yard (the boss)
  - the boss, **the Lumberjack** (`src/content/monsters/lumberjack.js`, art
    in `tools/art/sprites/lumberjack.js`): he throws logs, swings a chainsaw
    up close and gets mad at half health (3000). Beaten, he drops the
    **Chainsaw** (`src/content/weapons/chainsaw.js`, slot 1) and the sawmill
    shed opens; the mouse hole in there ends the episode.
  - textures for the warehouse (`warehouse.js`), the freezer (`freezer.js`),
    the sorting room (`sorting.js`, with conveyor belts that run four ways)
    and the lumber yard (`lumberyard.js`), steel key doors, and props: a
    pallet, a forklift, a traffic cone and a log pile
  - a `warehouse` song, a cut-away intermission picture (`intermission-e2`),
    an ending and an end picture (`finale-e2-end`), all in
    `tools/art/ui/screens.js`
- Five levels: E1M1 The Basement, E1M2 The Kitchen, E1M3 The Living Room,
  E1M4 Upstairs (the playroom floor is lava) and E1M5 The Attic (Dad). They're built by `tools/levels/e1m*.py`.
- Small, generic engine additions:
  - `monster.speedMul` (`src/engine/things/monster.js`)
  - `strings.hud.infiniteAmmo` shows ∞ for ranged weapons without ammo
    (`src/engine/ui/hud.js`; the HUD font draws `~` as ∞)
  - the ammo budget treats an infinite starting weapon as unlimited
    (`tools/lib/levelcheck.mjs`)
  - an episode's `intermission` names the picture behind its level-finished
    screen (`src/engine/scenes/intermission.js`)
  - conveyor belts: a floor's `push: [dx, dy]` carries the player along
    (`src/engine/world/world.js`). They don't carry monsters or items.
- `tools/art/generate.mjs --group textures|sprites|ui`.

## Still to do

1. **Playtest episode 2** at skill 3. Every level passes the validator and a
   simulated minute of play, and I walked through each one in the browser
   (with god mode), but nobody has played it for real. Things to check: E2M1
   has 35 rats and you start it with only the Bone Shotgun; the conveyor
   belts' speed (`BELT` in `tools/levels/warehouse.py`, 2.5 tiles a second);
   the blue key's belt island in E2M4; and the Lumberjack's health (3000),
   log damage and chainsaw damage. Ask the son whether the Lumberjack is
   scary enough.
2. **Polish the attic boss fight** in play. It's small: Dad, 7 rats, the Mega
   Microwave by the door. Tune Dad's health (2500), the mousetrap damage and
   the stomp timer after playtesting with the son.
3. **Playtest every level** at skill 3. The levels pass the validator and a
   simulated minute of play each, but nobody has played them through yet.
   Check the difficulty, the item placement and the lighting (the basement is
   a bit dim).
4. **MODDING.md**: its examples still use Raccoon Alex ids (intern, staples,
   donut, coworkers...). There's a note at the top; rewrite the examples with
   this game's ids. The coworker/NPC section could become "friendly
   characters" (the engine still supports them, and `tests/npc.test.js`
   defines test-only ones).
5. **Name the zombie rat** (ask the son!). Then put the name in
   `src/content/strings.js` (the help screen, the finale) and on the title
   portrait (`tools/art/ui/screens.js`, `portraitFrame`).
6. **Long messages get cut off.** The HUD doesn't wrap messages, and anything
   over about 55 characters runs off the right edge. Several in episode 1
   do (the E1M1, E1M2 and E1M4 start messages, the rain boots and the
   slingshot pickup). Split them into two `message` actions, as the
   warehouse levels do, or make the HUD wrap.
7. **Screenshots** for the README (`docs/screenshots/` was removed with the
   old ones), and the `og:image` link preview in `index.html` points at
   `docs/screenshots/title.jpg`.
8. **Hosting**: done. Pushes to `main` deploy to
   https://mjvdw13.github.io/oh-rats/ through `.github/workflows/ci.yml`.
9. Art polish ideas: the Slingshot Rat's slingshot is hard to see, the Chonky
   Rat's roll-over frames are a little abrupt, and the finale picture could use
   the rat's whole body instead of a big head on a cheese wheel.
10. The engine's photo-face feature (`src/engine/ui/photoface.js`, `?photo=`)
   still draws raccoon masks over human photos. It's unused here; remove it,
   or leave it.

## How to work on it

```sh
# Node is installed but not on the Git Bash PATH on this machine:
export PATH="/c/Program Files/nodejs:$PATH"
npm test && npm run validate
python tools/levels/e1m2.py            # rebuild a level after editing its script
node tools/mapview.mjs e1m2            # top-down picture in tools/art/out/maps/
node tools/art/generate.mjs --only dad --preview
python -m http.server 8080             # then open http://localhost:8080/?map=e1m1
```
