import { defineSound } from '../engine/defs.js';

// Every sound effect, synthesized from parameters (see src/engine/audio/synth.js).
// To use a recorded sound instead: defineSound({ id: 'bone-blast', src: 'assets/sounds/boom.wav' }).

const crunch = { bits: 7 };

// Reusable building blocks.
const thump = (freq = 120, end = 45, duration = 0.18, volume = 0.8) => ({ wave: 'sine', freq, freqEnd: end, duration, attack: 0.002, release: duration * 0.9, volume });
const burst = (duration = 0.2, lowpass = [6000, 800], volume = 0.8, noiseHold = 1) => ({ wave: 'noise', duration, attack: 0.001, release: duration * 0.95, lowpass, volume, noiseHold });
const click = (freq = 1400, volume = 0.4) => ({ wave: 'square', freq, freqEnd: freq * 0.7, duration: 0.025, attack: 0.001, release: 0.02, volume });
const squeak = (freq, duration = 0.07, volume = 0.35) => ({ wave: 'sine', freq, freqEnd: freq * 1.3, duration, attack: 0.005, release: duration * 0.6, volume, vibrato: { rate: 30, depth: 1 } });
const voice = (freq, end, duration, volume = 0.6, extra = {}) => ({
  wave: 'saw', freq, freqEnd: end, duration, attack: 0.03, release: duration * 0.4, lowpass: 1100,
  vibrato: { rate: 6, depth: 0.4 }, volume, distortion: 0.15, ...extra,
});
/** Bubbly fizz: lots of tiny high pops. */
const fizz = (duration = 0.6, volume = 0.35) => ({ wave: 'noise', duration, attack: 0.01, release: duration * 0.7, highpass: 2500, noiseHold: 18, volume });

export default [
  // --------------------------------------------------------- weapons
  defineSound({
    id: 'bone-blast', // the Bone Shotgun: a boom with a bony clatter on top
    synth: { ...burst(0.45, [5000, 300], 1, 3), distortion: 0.4, layers: [thump(110, 35, 0.35, 1), { ...click(900, 0.3), repeat: { count: 3, interval: 0.04, pitch: 1.3, decay: 0.7 }, delay: 0.05 }], ...crunch },
    pitchVariance: 0.04,
  }),
  defineSound({
    id: 'bone-rattle', // pumping it: bones knocking together
    synth: { ...click(700, 0.5), highpass: 300, repeat: { count: 4, interval: 0.05, pitch: 1.15, decay: 0.85 }, layers: [{ ...click(500, 0.5), delay: 0.16 }, { ...click(620, 0.45), delay: 0.2 }] },
  }),
  defineSound({
    id: 'band-fire', // a rubber band: thwip!
    synth: { wave: 'triangle', freq: 900, freqEnd: 300, duration: 0.09, attack: 0.002, release: 0.08, volume: 0.45, layers: [burst(0.05, [6000, 2000], 0.35), click(2200, 0.3)] },
    pitchVariance: 0.1,
  }),
  defineSound({
    id: 'soda-fire', // a shaken can popping out of the tube: PSSHT-thoonk
    synth: { wave: 'noise', duration: 0.45, attack: 0.005, release: 0.35, highpass: 1500, lowpass: [9000, 2500], volume: 0.7, layers: [thump(140, 60, 0.2, 0.8), fizz(0.4, 0.3)] },
  }),
  defineSound({
    id: 'fizz-boom', // soda explosion: a boom and a lot of fizz
    synth: {
      wave: 'noise', duration: 1.0, attack: 0.002, decay: 0.2, sustain: 0.4, release: 0.7, lowpass: [3000, 300], noiseHold: 3,
      distortion: 0.3, volume: 0.9, layers: [thump(80, 30, 0.6, 1), { ...fizz(1.2, 0.4), delay: 0.1 }], ...crunch,
    },
    pitchVariance: 0.08,
  }),
  defineSound({
    id: 'microwave-hum', // the Mega Microwave warming up
    synth: {
      wave: 'square', freq: 120, freqEnd: 240, duration: 0.6, attack: 0.05, release: 0.1, lowpass: [600, 2400], volume: 0.4, duty: 0.4,
      layers: [{ wave: 'sine', freq: 60, duration: 0.6, volume: 0.4, vibrato: { rate: 30, depth: 0.5 } }],
    },
  }),
  defineSound({
    id: 'microwave-ding', // ...DING! and away it goes
    synth: {
      wave: 'triangle', freq: 1568, duration: 0.5, attack: 0.002, release: 0.45, volume: 0.5,
      layers: [{ wave: 'triangle', freq: 2093, duration: 0.4, release: 0.35, volume: 0.25 }, { ...burst(0.4, [3000, 400], 0.6, 3), delay: 0.05 }, thump(70, 35, 0.3, 0.8)],
    },
  }),
  defineSound({
    id: 'microwave-boom',
    synth: {
      wave: 'noise', duration: 1.5, attack: 0.002, decay: 0.3, sustain: 0.5, release: 1.1, lowpass: [3500, 150], noiseHold: 5, distortion: 0.5, volume: 1,
      layers: [thump(55, 22, 1.1, 1), { wave: 'sine', freq: 1800, freqEnd: 200, duration: 0.8, vibrato: { rate: 40, depth: 3 }, volume: 0.25 }],
      ...crunch,
    },
  }),
  defineSound({ id: 'claw-swipe', synth: { wave: 'noise', duration: 0.16, attack: 0.03, release: 0.1, highpass: 1200, lowpass: [5000, 1500], volume: 0.5 }, pitchVariance: 0.1 }),
  defineSound({ id: 'claw-hit', synth: { ...thump(160, 60, 0.12, 0.8), layers: [burst(0.06, [4000, 900], 0.5)] }, pitchVariance: 0.1 }),
  defineSound({ id: 'crowbar-swing', synth: { wave: 'noise', duration: 0.22, attack: 0.04, release: 0.14, highpass: 600, lowpass: [3000, 900], volume: 0.55 }, pitchVariance: 0.1 }),
  defineSound({
    id: 'crowbar-hit', // CLONK: a heavy thud with a metal ring
    synth: { ...thump(130, 50, 0.16, 1), layers: [burst(0.08, [3500, 700], 0.6), { wave: 'triangle', freq: 1320, duration: 0.3, attack: 0.002, release: 0.28, volume: 0.22, vibrato: { rate: 12, depth: 0.3 } }] },
    pitchVariance: 0.08,
  }),
  defineSound({ id: 'slingshot-pull', synth: { wave: 'saw', freq: 180, freqEnd: 320, duration: 0.15, attack: 0.02, release: 0.05, lowpass: 900, volume: 0.25, vibrato: { rate: 40, depth: 1.5 } } }),
  defineSound({
    id: 'slingshot-fire', // twang!
    synth: { wave: 'triangle', freq: 520, freqEnd: 160, duration: 0.18, attack: 0.002, release: 0.16, volume: 0.5, vibrato: { rate: 45, depth: 2 }, layers: [burst(0.04, [6000, 2500], 0.3)] },
    pitchVariance: 0.08,
  }),
  defineSound({
    id: 'marble-plink', // a marble bouncing off something
    synth: { wave: 'sine', freq: 2400, duration: 0.08, attack: 0.001, release: 0.07, volume: 0.35, repeat: { count: 3, interval: 0.07, pitch: 0.92, decay: 0.55 } },
    pitchVariance: 0.15,
  }),
  defineSound({
    id: 'flare-fire', // a hollow POONK and a hiss
    synth: { ...thump(220, 90, 0.18, 0.9), layers: [{ wave: 'noise', duration: 0.7, attack: 0.01, release: 0.5, highpass: 2000, lowpass: 8000, volume: 0.35, noiseHold: 2 }] },
  }),
  defineSound({ id: 'flare-reload', synth: { ...click(900, 0.4), layers: [{ ...click(1300, 0.4), delay: 0.12 }] } }),
  defineSound({
    id: 'flare-burst', // sparks everywhere: crackle-pop
    synth: { wave: 'noise', duration: 0.6, attack: 0.002, release: 0.5, lowpass: [6000, 900], noiseHold: 6, volume: 0.7, layers: [thump(150, 50, 0.25, 0.7), { ...fizz(0.6, 0.35), delay: 0.05 }], ...crunch },
    pitchVariance: 0.1,
  }),
  defineSound({ id: 'torch-roar', synth: { wave: 'noise', duration: 0.12, attack: 0.01, release: 0.08, lowpass: [1400, 900], noiseHold: 2, volume: 0.45 }, pitchVariance: 0.12 }),

  // --------------------------------------------------------- world
  defineSound({
    id: 'door-open', // a creaky house door
    synth: { wave: 'saw', freq: 300, freqEnd: 520, duration: 0.6, attack: 0.05, release: 0.2, lowpass: 1600, volume: 0.25, vibrato: { rate: 22, depth: 1.2 }, layers: [{ wave: 'noise', duration: 0.5, lowpass: 1200, volume: 0.15, release: 0.2 }] },
  }),
  defineSound({
    id: 'door-close',
    synth: { wave: 'saw', freq: 480, freqEnd: 300, duration: 0.4, attack: 0.05, release: 0.1, lowpass: 1400, volume: 0.22, vibrato: { rate: 22, depth: 1 }, layers: [{ ...thump(110, 50, 0.18, 0.9), delay: 0.38 }, { ...burst(0.08, [2500, 500], 0.4), delay: 0.38 }] },
  }),
  defineSound({ id: 'switch', synth: { ...click(1500, 0.6), layers: [{ ...click(900, 0.5), delay: 0.07 }] } }),
  defineSound({
    id: 'secret', // a happy little arpeggio
    synth: { wave: 'triangle', freq: 523, duration: 0.14, attack: 0.005, release: 0.1, volume: 0.5, repeat: { count: 4, interval: 0.09, pitch: 1.26 }, echo: { time: 0.12, feedback: 0.4, mix: 0.5 } },
  }),
  defineSound({ id: 'oof', synth: squeak(700, 0.12, 0.4) }),
  defineSound({
    id: 'teleport', // sparkly pop
    synth: { wave: 'sine', freq: 400, freqEnd: 2000, duration: 0.4, attack: 0.01, release: 0.2, vibrato: { rate: 18, depth: 2 }, volume: 0.45, layers: [{ wave: 'triangle', freq: 1760, duration: 0.08, volume: 0.3, repeat: { count: 4, interval: 0.07, pitch: 1.12 }, delay: 0.1 }] },
  }),
  defineSound({ id: 'thump', synth: { ...thump(90, 40, 0.25, 1), layers: [burst(0.15, [2000, 300], 0.6, 4)] } }),

  // --------------------------------------------------------- items
  defineSound({ id: 'item', synth: { wave: 'square', freq: 880, freqEnd: 1320, duration: 0.09, attack: 0.002, release: 0.05, volume: 0.35, duty: 0.25 } }),
  defineSound({ id: 'item-food', synth: { ...burst(0.06, [1800, 600], 0.6, 6), repeat: { count: 3, interval: 0.08, decay: 0.8 } } }), // nom nom nom
  defineSound({ id: 'item-armor', synth: { wave: 'triangle', freq: 660, duration: 0.12, release: 0.1, volume: 0.4, layers: [{ ...click(2400, 0.4) }, { wave: 'triangle', freq: 990, duration: 0.15, delay: 0.08, release: 0.12, volume: 0.35 }] } }),
  defineSound({ id: 'item-ammo', synth: { ...click(1800, 0.45), layers: [{ ...click(2600, 0.35), delay: 0.05 }, { ...burst(0.05, [6000, 3000], 0.3), delay: 0.02 }] } }),
  defineSound({
    id: 'weapon-pickup',
    synth: { wave: 'square', freq: 440, duration: 0.07, volume: 0.3, duty: 0.25, repeat: { count: 5, interval: 0.06, pitch: 1.19 }, layers: [{ wave: 'triangle', freq: 220, duration: 0.4, release: 0.3, volume: 0.35 }] },
  }),
  defineSound({ id: 'key-pickup', synth: { wave: 'triangle', freq: 1046, duration: 0.3, release: 0.25, volume: 0.45, layers: [{ wave: 'triangle', freq: 1568, duration: 0.35, delay: 0.08, release: 0.3, volume: 0.4 }] } }),
  defineSound({
    id: 'powerup',
    synth: { wave: 'square', duty: 0.25, freq: 392, duration: 0.09, release: 0.06, volume: 0.35, repeat: { count: 6, interval: 0.07, pitch: 1.122 }, echo: { time: 0.1, feedback: 0.45, mix: 0.6 } },
  }),

  // --------------------------------------------------------- the zombie rat
  defineSound({ id: 'player-pain', synth: { ...squeak(900, 0.16, 0.45), layers: [{ wave: 'saw', freq: 300, freqEnd: 200, duration: 0.15, lowpass: 900, volume: 0.25 }] } }),
  defineSound({ id: 'player-pain-low', synth: { ...squeak(700, 0.22, 0.45), layers: [{ wave: 'saw', freq: 240, freqEnd: 150, duration: 0.2, lowpass: 800, volume: 0.25 }] } }),
  defineSound({
    id: 'player-death', // a sad trombone: wah, wah, wah, waaah
    synth: {
      wave: 'saw', freq: 311, duration: 0.3, attack: 0.03, release: 0.1, lowpass: 1400, volume: 0.45, vibrato: { rate: 5, depth: 0.3 },
      repeat: { count: 3, interval: 0.34, pitch: 0.944 },
      layers: [{ wave: 'saw', freq: 247, freqEnd: 233, duration: 0.9, delay: 1.02, attack: 0.03, release: 0.4, lowpass: 1400, volume: 0.45, vibrato: { rate: 6, depth: 0.6 } }],
    },
  }),

  // --------------------------------------------------------- menus / screens
  defineSound({ id: 'menu-open', synth: { wave: 'square', freq: 440, freqEnd: 660, duration: 0.06, volume: 0.3, duty: 0.25 } }),
  defineSound({ id: 'menu-move', synth: squeak(1800, 0.04, 0.3) }),
  defineSound({ id: 'menu-select', synth: { ...burst(0.12, [6000, 900], 0.6, 2), layers: [thump(180, 70, 0.1, 0.5)], ...crunch } }),
  defineSound({ id: 'menu-back', synth: { wave: 'square', freq: 500, freqEnd: 300, duration: 0.07, volume: 0.3, duty: 0.25 } }),
  defineSound({ id: 'tally', synth: { wave: 'square', freq: 1100, duration: 0.02, volume: 0.25 } }),
  defineSound({ id: 'tally-done', synth: { ...burst(0.25, [5000, 500], 0.8, 2), layers: [thump(110, 45, 0.2, 0.8)], ...crunch } }),
  defineSound({ id: 'quit', synth: { ...squeak(1600, 0.1, 0.4), repeat: { count: 3, interval: 0.14, pitch: 0.85 } } }),

  // --------------------------------------------------------- rats
  defineSound({ id: 'rat-sight', synth: { ...squeak(2100), repeat: { count: 3, interval: 0.09, pitch: 1.05 } } }),
  defineSound({ id: 'rat-active', synth: { ...squeak(2400, 0.05, 0.25), repeat: { count: 2, interval: 0.08 } } }),
  defineSound({ id: 'rat-pain', synth: squeak(2600, 0.12, 0.4) }),
  defineSound({ id: 'rat-death', synth: { wave: 'sine', freq: 2800, freqEnd: 900, duration: 0.35, release: 0.2, vibrato: { rate: 30, depth: 1.5 }, volume: 0.4 } }),
  defineSound({ id: 'rat-bite', synth: { ...burst(0.05, [6000, 2000], 0.4), layers: [click(3000, 0.3)] } }),
  defineSound({ id: 'ninja-sight', synth: { wave: 'noise', duration: 0.25, attack: 0.02, release: 0.2, highpass: 3000, lowpass: [9000, 4000], volume: 0.4, layers: [{ ...squeak(2600, 0.05, 0.3), delay: 0.2 }] } }),

  // Rats on two legs: chattering, a little lower.
  defineSound({ id: 'ratman-sight', synth: { ...squeak(1500, 0.08, 0.4), repeat: { count: 4, interval: 0.07, pitch: 0.95 } } }),
  defineSound({ id: 'ratman-active', synth: { ...squeak(1700, 0.05, 0.25), repeat: { count: 2, interval: 0.1 } } }),
  defineSound({ id: 'ratman-pain', synth: squeak(1900, 0.14, 0.45) }),
  defineSound({ id: 'ratman-death', synth: { wave: 'sine', freq: 2000, freqEnd: 500, duration: 0.5, release: 0.3, vibrato: { rate: 25, depth: 1.5 }, volume: 0.45 } }),
  defineSound({ id: 'slingshot', synth: { wave: 'triangle', freq: 600, freqEnd: 180, duration: 0.12, release: 0.1, volume: 0.45, layers: [burst(0.04, [5000, 1500], 0.3)] }, pitchVariance: 0.1 }),

  defineSound({ id: 'spitter-sight', synth: { ...squeak(1300, 0.1, 0.4), repeat: { count: 3, interval: 0.11, pitch: 1.1 } } }),
  defineSound({ id: 'spitter-active', synth: { wave: 'noise', duration: 0.2, attack: 0.05, release: 0.15, lowpass: 1500, volume: 0.25 } }),
  defineSound({ id: 'spitter-pain', synth: squeak(1500, 0.14, 0.45) }),
  defineSound({ id: 'spitter-death', synth: { wave: 'sine', freq: 1800, freqEnd: 400, duration: 0.55, release: 0.3, vibrato: { rate: 20, depth: 1.5 }, volume: 0.45 } }),
  defineSound({ id: 'spit', synth: { wave: 'noise', duration: 0.18, attack: 0.01, release: 0.14, lowpass: [3000, 800], volume: 0.5, layers: [{ wave: 'sine', freq: 400, freqEnd: 900, duration: 0.08, volume: 0.3 }] } }),
  defineSound({ id: 'splat', synth: { ...burst(0.25, [2000, 300], 0.7, 3), layers: [{ wave: 'sine', freq: 300, freqEnd: 80, duration: 0.15, volume: 0.4 }] } }),

  defineSound({ id: 'chonk-sight', synth: { ...squeak(700, 0.18, 0.5), repeat: { count: 2, interval: 0.16, pitch: 0.9 }, layers: [thump(90, 50, 0.2, 0.5)] } }),
  defineSound({ id: 'chonk-active', synth: { wave: 'noise', duration: 0.3, attack: 0.05, release: 0.2, lowpass: 700, noiseHold: 8, volume: 0.35 } }), // munch munch
  defineSound({ id: 'chonk-pain', synth: squeak(800, 0.15, 0.5) }),
  defineSound({ id: 'chonk-death', synth: { wave: 'sine', freq: 900, freqEnd: 200, duration: 0.7, release: 0.3, vibrato: { rate: 14, depth: 1.5 }, volume: 0.5, layers: [{ ...thump(80, 40, 0.3, 0.9), delay: 0.6 }] } }),
  defineSound({ id: 'chomp', synth: { ...burst(0.1, [4000, 800], 0.6, 2), layers: [{ ...click(1800, 0.4), delay: 0.05 }, thump(140, 70, 0.1, 0.5)] } }),

  defineSound({ id: 'packrat-sight', synth: { ...squeak(500, 0.25, 0.5), vibrato: { rate: 10, depth: 1 }, layers: [{ wave: 'noise', duration: 0.4, lowpass: 900, noiseHold: 6, volume: 0.3 }] } }),
  defineSound({ id: 'packrat-active', synth: { ...click(900, 0.3), repeat: { count: 5, interval: 0.08, pitch: 1.1, decay: 0.85 } } }), // junk rattling
  defineSound({ id: 'packrat-pain', synth: squeak(600, 0.18, 0.5) }),
  defineSound({ id: 'packrat-death', synth: { wave: 'sine', freq: 700, freqEnd: 150, duration: 0.8, release: 0.4, vibrato: { rate: 12, depth: 1.5 }, volume: 0.5, layers: [{ ...click(1300, 0.4), repeat: { count: 6, interval: 0.12, pitch: 0.9, decay: 0.85 }, delay: 0.3 }] } }),
  defineSound({ id: 'throw', synth: { wave: 'noise', duration: 0.25, attack: 0.04, release: 0.18, lowpass: [600, 2400], volume: 0.45 } }),
  defineSound({ id: 'junk-crash', synth: { ...burst(0.35, [3000, 400], 0.7, 2), layers: [{ ...click(1500, 0.4), repeat: { count: 4, interval: 0.05, pitch: 0.8 } }] } }),

  // --------------------------------------------------------- Dad
  defineSound({ id: 'dad-sight', synth: voice(150, 190, 0.7, 0.7, { layers: [{ ...voice(190, 120, 0.4, 0.6), delay: 0.45 }] }) }), // "HEY-YOU!"
  defineSound({ id: 'dad-active', synth: voice(110, 95, 0.5, 0.45) }), // "hmmmph"
  defineSound({ id: 'dad-pain', synth: voice(240, 140, 0.25, 0.7) }), // "OW!"
  defineSound({
    id: 'dad-death', // a big wobbly "whoa-oa-oa", a bump, then a snore
    synth: {
      ...voice(220, 120, 0.9, 0.7, { vibrato: { rate: 7, depth: 2 } }),
      layers: [
        { ...thump(60, 25, 0.5, 1), delay: 0.9 },
        { wave: 'noise', duration: 0.7, delay: 1.6, attack: 0.3, release: 0.3, lowpass: 260, noiseHold: 12, volume: 0.5 },
        { wave: 'noise', duration: 0.7, delay: 2.6, attack: 0.3, release: 0.3, lowpass: 260, noiseHold: 12, volume: 0.45 },
      ],
    },
  }),
  defineSound({ id: 'dad-step', synth: { ...thump(60, 30, 0.25, 0.9), layers: [burst(0.12, [900, 200], 0.4, 6)] } }),
  defineSound({ id: 'stomp', synth: { ...thump(50, 22, 0.5, 1), layers: [burst(0.3, [1200, 150], 0.7, 6)] } }),
  defineSound({ id: 'trap-snap', synth: { ...click(2400, 0.7), layers: [{ ...burst(0.12, [7000, 2000], 0.6, 1) }, thump(200, 80, 0.08, 0.6)] } }),
];
