// Every piece of text in OH, RATS! Change anything here; the engine looks
// these up by key. {placeholders} are filled in by the game.

export default {
  loading: 'LOADING...',
  pressAnyKey: 'PRESS ANY KEY',
  yesNo: '(PRESS Y OR N)',
  cheatActivated: 'CHEAT ACTIVATED',
  secretFound: 'YOU FOUND A SECRET!',
  needKey: 'You need the {key} to open this door.',
  deathMessage: 'OH, RATS! YOU GOT SQUASHED.',
  respawnPrompt: 'PRESS USE TO TRY AGAIN',

  // `~` is drawn as an infinity sign in the HUD font: shown for the Bone Shotgun.
  hud: { ammo: 'AMMO', health: 'HEALTH', arms: 'ARMS', armor: 'ARMOR', infiniteAmmo: '~' },
  automap: { kills: 'RATS', items: 'ITEMS', secrets: 'SECRETS' },
  intermission: {
    finished: 'FINISHED',
    kills: 'RATS',
    items: 'ITEMS',
    secrets: 'SECRET',
    time: 'TIME',
    par: 'PAR',
    entering: 'NOW ENTERING',
    youAreHere: 'YOU ARE HERE',
  },

  skills: ['BABY MOUSE', 'LITTLE SQUEAKER', 'RAT ATTACK!', 'BIG CHEESE', 'ULTRA ZOMBIE!'],

  menu: {
    newGame: 'NEW GAME',
    continue: 'CONTINUE',
    options: 'OPTIONS',
    readThis: 'HOW TO PLAY',
    quit: 'QUIT GAME',
    paused: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART LEVEL',
    quitToTitle: 'QUIT TO TITLE',
    chooseSkill: 'HOW TOUGH ARE YOU?',
    whichEpisode: 'WHICH EPISODE?',
    nightmareConfirm: 'Are you SURE? This is the hardest level. The rats are fast, there are lots of them, and they come back!',
    restartConfirm: 'Restart this level from the beginning?',
    mouse: 'MOUSE',
    music: 'MUSIC',
    sound: 'SOUND',
    crt: 'CRT',
    alwaysRun: 'ALWAYS RUN',
    messages: 'MESSAGES',
    showFps: 'SHOW FPS',
    touch: 'TOUCH PAD',
    helpFooter: 'PRESS ESC TO GO BACK',
  },

  quitMessages: [
    "Don't go! There's still cheese in the pantry.",
    'The other rats will think you got scared.',
    'Dad is still out there. Somewhere.',
    "Quitting? That's exactly what Dad wants.",
    'Your Bone Shotgun will miss you.',
    "Leaving already? You haven't found all the vents!",
    "Are you sure? The pizza's still warm.",
    'Oh, rats! Leaving so soon?',
  ],

  goodbye: ["It's now safe to turn off", 'your computer.', '', 'Squeak you later!'],

  help: [
    { text: 'MOVE ......... W A S D / ARROW KEYS', tint: 'beige' },
    { text: 'TURN ......... MOUSE / LEFT + RIGHT', tint: 'beige' },
    { text: 'FIRE ......... CLICK / F / CTRL', tint: 'beige' },
    { text: 'USE / OPEN ... E / SPACE / RIGHT CLICK', tint: 'beige' },
    { text: 'RUN .......... SHIFT (OR ALWAYS RUN)', tint: 'beige' },
    { text: 'WEAPONS ...... 1-7 / MOUSE WHEEL / Q', tint: 'beige' },
    { text: 'AUTOMAP ...... TAB / M   (ZOOM + -)', tint: 'beige' },
    { text: 'MENU ......... ESC', tint: 'beige' },
    { text: '' },
    { text: 'You are a zombie rat with a shotgun', tint: 'sky' },
    { text: 'made of bones. It never runs out!', tint: 'sky' },
    { text: 'Fight the other rats through the', tint: 'sky' },
    { text: 'whole house and up to the attic.', tint: 'sky' },
    { text: '' },
    { text: 'Find the mouse hole to exit. Try the', tint: 'sky' },
    { text: 'vents! Keys open the striped doors.', tint: 'sky' },
    { text: 'And watch out for DAD.', tint: 'glow-yellow' },
  ],

  episodeName: 'THE BIG HOUSE',

  finale:
    'With one last mighty stomp, Dad wobbles, spins around three times... and flops down flat on the ' +
    'attic floor.\n\n' +
    'ZZZZZZZZZ.\n\n' +
    'Dad is fast asleep. Snoring like a lawnmower.\n\n' +
    'The other rats peek out of the vents. They look at Dad. They look at you. They look at your ' +
    'Bone Shotgun.\n\n' +
    'Then they all bow down.\n\n' +
    'The whole house is yours now: the pantry, the couch, the pizza under the couch, ALL of it.\n\n' +
    'You climb up onto the biggest wheel of cheese in the house and take a big bite.\n\n' +
    'Long live the Zombie Rat!\n\n' +
    '...but what was that noise downstairs? It sounded like... a CAT?',
};
