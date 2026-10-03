// The hero: a zombie rat. Starting stats, inventory and face.
export default {
  health: 100,
  radius: 0.25,
  walkSpeed: 4.8, // tiles per second (rats are quick)
  runSpeed: 8.2,
  // The Bone Shotgun never runs out of ammo, and you start with it.
  startWeapons: ['claws', 'bone-shotgun'],
  startWeapon: 'bone-shotgun',
  startAmmo: {},
  blood: 'goo',
  face: {
    // The status-bar mugshot (tools/art/ui/face.js draws it).
    sheet: { src: 'assets/ui/face.png', frameWidth: 24, frameHeight: 30 },
  },
};
