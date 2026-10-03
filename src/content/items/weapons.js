import { defineItem } from '../../engine/defs.js';

const S = (name) => ({ src: `assets/sprites/items/${name}.png`, frameWidth: 64, frameHeight: 32 });

// Weapon pickups scattered around the house: the weapon plus some ammo for
// it. Each glyph is the weapon's slot number.
export default [
  defineItem({
    id: 'pickup-band-gatling',
    name: 'Rubber Band Gatling',
    glyph: '3',
    sheet: S('pickup-band-gatling'),
    radius: 0.35,
    pickup: { weapon: 'band-gatling', ammo: { bands: 20 } },
    message: 'You got the RUBBER BAND GATLING!',
    sound: 'weapon-pickup',
  }),
  defineItem({
    id: 'pickup-soda-bazooka',
    name: 'Soda Bazooka',
    glyph: '4',
    sheet: S('pickup-soda-bazooka'),
    radius: 0.35,
    pickup: { weapon: 'soda-bazooka', ammo: { soda: 2 } },
    message: 'You got the SODA BAZOOKA! Shake well.',
    sound: 'weapon-pickup',
  }),
  defineItem({
    id: 'pickup-mega-microwave',
    name: 'Mega Microwave',
    glyph: '5',
    sheet: S('pickup-mega-microwave'),
    radius: 0.35,
    pickup: { weapon: 'mega-microwave', ammo: { batteries: 40 } },
    message: 'You got the MEGA MICROWAVE! *DING*',
    sound: 'weapon-pickup',
  }),
];
