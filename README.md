# OH, RATS!

A bright, silly, 80s-style first-person shooter that runs in the browser.

You are a **zombie rat** with a **shotgun made out of bones**. It has infinite
ammo, and you start with it. Fight your way through a really big house full
of other rats, from the basement up through the kitchen and the living room
to the attic, crawling through the **vents** as you go. Weapons, supplies and
healing snacks are scattered everywhere. And waiting at the top of the house
is the boss: **Dad**.

The game is guided by my son's ideas. See [IDEAS.md](IDEAS.md) for his original
description and how each idea made it into the game.

## Play

Serve the folder and open it in any modern desktop or mobile browser (see
*Run it locally*). Click the game to capture the mouse.

| Action | Keyboard and mouse | Gamepad | Touch |
|---|---|---|---|
| Move / strafe | W A S D, arrow keys | Left stick | Left half of the screen |
| Turn | Mouse, ← → | Right stick | Drag on the right half |
| Fire | Left click, F, Ctrl | Right trigger | FIRE |
| Use / open (doors, vent covers) | E, Space, right click | A | USE |
| Run | Shift (or Always Run in Options) | | |
| Weapons | 1-5, mouse wheel, Q | Bumpers | WPN |
| Automap | Tab or M (zoom with + and -) | Back / Select | MAP |
| Menu | Esc | Start | MENU |

**Skill levels:** Baby Mouse, Little Squeaker, Rat Attack!, Big Cheese and
ULTRA ZOMBIE!

**The house (episode 1):** E1M1 The Basement, E1M2 The Kitchen, E1M3 The Living
Room, E1M4 Upstairs (the floor is lava!) and E1M5 The Attic (Dad). Find the **mouse hole** to leave each floor.
Doors with a blue, yellow or red stripe need that key. Vent covers open like
doors, and the vents hide shortcuts and secrets.

**Weapons:** Zombie Claws and the Crowbar (1), the Bone Shotgun (2, never runs
out) and the Slingshot (2 again), the Rubber Band Gatling (3), the Soda Bazooka
(4), the Mega Microwave (5), the Flare Gun (6) and the Blow Torch (7). Press a
number twice to swap between two weapons that share it.

**Rats:** House Rats, Slingshot Rats, Spitball Rats, Chonky Rats, see-through
Ninja Rats and big Pack Rats. And Dad, who throws mousetraps.

**Cheats** (type them during play): `iddqd` and `zombie` (can't be hurt),
`idkfa` and `cheese` (everything), `idclip` (walk through walls), `iddt`
(reveal the map), `idclev##` (warp, for example `idclev15` for the attic).

## Run it locally

ES modules don't load from `file://` URLs, so serve the folder instead:

```sh
npm run serve        # npx http-server on http://localhost:8080
# or
python -m http.server 8080
```

Handy URL parameters for testing:

| Parameter | Effect |
|---|---|
| `?map=e1m3` | Jump straight into a level (`&skill=1`..`5`, default 3) |
| `&god` / `&nomonsters` / `&all` | God mode / no monsters / all weapons |
| `&crt=off` / `subtle` / `full` | CRT effect (also in Options) |
| `&gl=0` | Plain 2D canvas instead of WebGL |
| `&fps` | Frame counter |
| `&mute` | No sound |
| `&seed=N` | Fixed random seed |

## Make it your own

Everything specific to *Oh, Rats!* is plain data in `src/content/`. The engine
in `src/engine/` never mentions rats. New monsters, weapons, items, levels,
sounds and music are each a small file plus a line in an index.
**[MODDING.md](MODDING.md)** walks through each one.

```
index.html, css/        the page (the canvas, the loading text)
src/main.js             boots the game from the content pack
src/engine/             the engine: renderer, world, AI, audio, UI, scenes
src/content/            Oh, Rats!: palette, levels, rats, Dad, weapons, items,
                        sounds, music, strings, hero, cheats
assets/                 PNG textures, sprites and UI art (all generated)
tools/art/              the generators that draw all the art
tools/levels/           Python scripts that lay out the levels (see below)
tools/validate.mjs      content checks: references, files, level reachability
tools/mapview.mjs       renders levels as top-down PNGs
tools/smoke.mjs         headless-browser smoke test
tests/                  node --test unit and simulation tests
```

The level files in `src/content/levels/` are plain ASCII maps and can be edited
by hand. They were laid out with `tools/levels/e1m*.py` (Python 3, no extra
packages): edit a script and run `python tools/levels/e1m2.py` to rewrite that
level. If you hand-edit a level file, don't re-run its script afterwards.

## Development

Node 20 or newer is only needed for the tools. The game itself has no
dependencies.

```sh
npm test             # unit tests + a headless minute of play in every level
npm run validate     # check all content, assets and level layouts
npm run art          # regenerate all the art (tools/art/generate.mjs)
node tools/art/generate.mjs --group sprites --preview   # just one group
node tools/mapview.mjs e1m2        # draw a level map to tools/art/out/maps/
npm run smoke        # browser smoke test (needs Playwright, see the file)
```

On every push, GitHub Actions (`.github/workflows/ci.yml`) runs the tests, the
validator and the smoke test. Pushes to `main` that pass the tests and the
validator are published to GitHub Pages at https://mjvdw13.github.io/oh-rats/
(Settings → Pages → Source: **GitHub Actions**).

## How it works

- A 320×200 framebuffer of palette indices (a 320×168 view plus a 32-pixel
  status bar), drawn with a grid raycaster with textured floors and ceilings,
  skies, sliding doors and Doom-style light falloff.
- Every PNG is snapped to one bright 256-colour palette when it loads. The
  last 31 colours are fullbright, so lamps, zombie eyes and the microwave glow.
- Monsters follow a flow field toward the player. Gunfire wakes up every rat
  within earshot, and rats that hit each other start fighting.
- Sound effects are synthesized in the browser, and the music runs on a small
  tracker. There are no audio files.
- All the art is generated by `tools/art/`: a software "clay" renderer (depth,
  normals, ambient occlusion and specular), then dithered into the palette.

*Oh, Rats!* is built on the engine from *Raccoon Alex*.
