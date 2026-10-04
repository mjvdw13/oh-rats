import { defineItem } from '../../engine/defs.js';

const S = (name) => ({ src: `assets/sprites/items/${name}.png`, frameWidth: 64, frameHeight: 32 });

// Weapon pickups scattered around the house: the weapon plus some ammo for
// it. Each glyph is the weapon's slot number.
export default [
  defineItem({
    id: 'pickup-crowbar',
    name: 'Crowbar',
    glyph: '1',
    sheet: S('pickup-crowbar'),
    radius: 0.35,
    pickup: { weapon: 'crowbar' },
    message: 'You got the CROWBAR! Press 1 again for your claws.',
    sound: 'weapon-pickup',
  }),
  defineItem({
    id: 'pickup-slingshot',
    name: 'Slingshot',
    glyph: '2',
    sheet: S('pickup-slingshot'),
    radius: 0.35,
    pickup: { weapon: 'slingshot', ammo: { marbles: 10 } },
    message: 'You got the SLINGSHOT! Press 2 again for the shotgun.',
    sound: 'weapon-pickup',
  }),
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
  defineItem({
    id: 'pickup-flare-gun',
    name: 'Flare Gun',
    glyph: '6',
    sheet: S('pickup-flare-gun'),
    radius: 0.35,
    pickup: { weapon: 'flare-gun', ammo: { flares: 4 } },
    message: 'You got the FLARE GUN! Light them up!',
    sound: 'weapon-pickup',
  }),
  defineItem({
    id: 'pickup-blow-torch',
    name: 'Blow Torch',
    glyph: '7',
    sheet: S('pickup-blow-torch'),
    radius: 0.35,
    pickup: { weapon: 'blow-torch', ammo: { propane: 50 } },
    message: 'You got the BLOW TORCH! FWOOOSH!',
    sound: 'weapon-pickup',
  }),
  // The Lumberjack drops this when you beat him, so it has no map glyph.
  defineItem({
    id: 'pickup-chainsaw',
    name: 'Chainsaw',
    sheet: S('pickup-chainsaw'),
    radius: 0.35,
    pickup: { weapon: 'chainsaw' },
    message: 'You got the CHAINSAW! VRRRRRMMMM!',
    sound: 'weapon-pickup',
  }),
];
