# Ideas

*Oh, Rats!* is guided by my son's ideas. This file keeps his ideas and shows
where each one lives in the game. Add new ideas to the bottom!

## The original idea

> Doom clone where you are a zombie rat with a shotgun made out of bones that
> has infinite ammo and you start with it. Scatter weapons and other supplies
> and healing items around the level. The environment is a really big house
> with vents. Enemies are other rats and the boss is the dad of the house.

## Where each idea is

| Idea | In the game | Files |
|---|---|---|
| You are a zombie rat | Green zombie fur, stitches, one glowing zombie eye (status-bar face, claws, title screen). Gets band-aids as you get hurt. | `src/content/hero.js`, `tools/art/ui/face.js` |
| A shotgun made out of bones | The **Bone Shotgun**: a femur barrel, a spine of vertebrae and a little skull for a stock | `src/content/weapons/bone-shotgun.js`, `tools/art/sprites/weapons.js` |
| Infinite ammo, and you start with it | It has no ammo type, so it never runs out (the HUD shows ∞) | `src/content/weapons/bone-shotgun.js` |
| Scattered weapons | Crowbar, Slingshot and Rubber Band Gatling (basement), Soda Bazooka (kitchen pantry), Flare Gun (living room den), Blow Torch (upstairs linen closet), Mega Microwave (attic) | `src/content/weapons/`, `src/content/items/weapons.js` |
| Supplies | Rubber bands, soda cans, batteries, a lunchbox, armour (bottle caps, a thimble helmet, tin-can armour) and powerups (hot sauce, bubble wrap, a glow stick, rain boots, house blueprints) | `src/content/items/` |
| Healing items | Cheese crumbs, cheese wedges, pizza slices and the Golden Cheese | `src/content/items/health.js` |
| A really big house | The basement, the kitchen, the living room, upstairs (the kids' rooms and the playroom) and the attic. Then episode 2: a whole warehouse (the loading dock, the aisles, the big freezer, the conveyor belts and the lumber yard) | `src/content/levels/` |
| With vents | Vent covers open like doors. Vents are shortcuts and secret hiding places in every level | `src/content/levels/legend.js` (`G`, `V`, `Y`) |
| Enemies are other rats | House Rat, Slingshot Rat, Spitball Rat, Chonky Rat, Ninja Rat, Pack Rat | `src/content/monsters/` |
| The boss is the dad of the house | **Dad**, in his bathrobe and slippers, throws mousetraps. Hurt him and he gets angry, and his stomps knock rats out of the vents. Beat him and he falls asleep. | `src/content/monsters/dad.js`, `tools/art/sprites/dad.js` |

## Choices made along the way (change any of these!)

- The game is bright and cheerful: daytime, sunny windows, no blood (rats lose
  tufts of fur and get dizzy stars), and Dad falls asleep instead of dying.
- The zombie rat doesn't have a name yet. What should it be called?
- The playroom upstairs has a "the floor is LAVA" floor. Rain boots let you walk on it.
- The ending hints at a sequel: "...was that a CAT?"
- Episode 2 is a warehouse. The zombie rat falls asleep in a cardboard box and
  wakes up in a delivery truck parked at the loading dock.
- The warehouse boss is **the Lumberjack**, with a chainsaw. Beat him and you
  get the chainsaw. He's in the lumber yard behind the warehouse (E2M5;
  `src/content/monsters/lumberjack.js`, `src/content/weapons/chainsaw.js`).
- The sorting room's conveyor belts carry you along, and the blue key sits on
  an island in the middle where every belt runs outward.

## New ideas

- 
