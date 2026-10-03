// Game-wide settings the engine reads from content.
export default {
  /** Font ids used by the engine for each role. */
  fonts: { small: 'small', big: 'big', hud: 'hud', tiny: 'tiny', gold: 'gold' },
  /** Keys. `icon` is the frame in assets/ui/hud-icons.png; `ramp` colours the automap. */
  keys: [
    { id: 'blue', name: 'BLUE KEY', icon: 0, ramp: 'sky' },
    { id: 'yellow', name: 'YELLOW KEY', icon: 1, ramp: 'yellow' },
    { id: 'red', name: 'RED KEY', icon: 2, ramp: 'blood' },
  ],
  colors: { message: 'yellow' },
  titleMusic: 'title',
  intermissionMusic: 'intermission',
  /** Where a custom face photo would go on the title screen (unused: the hero is drawn). */
  titlePortrait: { x: 22, y: 64 },
};
