# TODO: handoff

State as of 2026-10-03: *Raccoon Alex* has been repurposed into *Oh, Rats!*. The
game boots and plays from the title screen to the finale. `npm test` (44 tests)
and `npm run validate` (0 errors, 0 warnings) both pass. All art is regenerated
from `tools/art/`. Nothing here is a git repository yet.

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
  - weapons: the Rubber Band Gatling, the Soda Bazooka and the Mega Microwave
  - rats: House, Slingshot, Spitball, Chonky, Ninja and Pack
  - Dad: throws mousetraps; when angry he speeds up and stomps rats out of the
    vents
- New sounds, new major-key music and all new text.
- Four levels: E1M1 The Basement, E1M2 The Kitchen, E1M3 The Living Room and
  E1M4 The Attic (Dad). They're built by `tools/levels/e1m*.py`.
- Small, generic engine additions:
  - `monster.speedMul` (`src/engine/things/monster.js`)
  - `strings.hud.infiniteAmmo` shows ∞ for ranged weapons without ammo
    (`src/engine/ui/hud.js`; the HUD font draws `~` as ∞)
  - the ammo budget treats an infinite starting weapon as unlimited
    (`tools/lib/levelcheck.mjs`)
- `tools/art/generate.mjs --group textures|sprites|ui`.

## Still to do

1. **An UPSTAIRS level** (kids' bedrooms, the playroom where *the floor is
   LAVA*, the bathroom). It goes between the living room and the attic. The
   art is ready (`wallpaper-pink`, `wallpaper-kids`, `playmat`, `lava` (`~`),
   teddy bears, toy blocks and cars, rain boots). Steps:
   - add `tools/levels/e1m4.py` for it
   - rename the attic to e1m5 and update `e1m4.py` → `e1m5.py`
   - update `src/content/levels/index.js` (the intermission spot for upstairs
     is `[160, 86]`, the attic `[160, 42]`) and the episode list in
     `tests/content.test.js`
   - the `upstairs` song exists (the attic currently borrows it until the
     fight starts)
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
6. **Screenshots** for the README (`docs/screenshots/` was removed with the
   old ones), and the `og:image` link preview in `index.html` points at
   `docs/screenshots/title.jpg`.
7. **Hosting**: done. Pushes to `main` deploy to
   https://mjvdw13.github.io/oh-rats/ through `.github/workflows/ci.yml`.
8. Art polish ideas: the Slingshot Rat's slingshot is hard to see, the Chonky
   Rat's roll-over frames are a little abrupt, and the finale picture could use
   the rat's whole body instead of a big head on a cheese wheel.
9. The engine's photo-face feature (`src/engine/ui/photoface.js`, `?photo=`)
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
