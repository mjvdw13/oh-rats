import { defineSong } from '../../engine/defs.js';
import { bass, pluck, bell, kick, snare, hat } from './instruments.js';

// Sneaky, tip-toeing F major for the basement and the vents.
export default defineSong({
  id: 'basement',
  bpm: 112,
  echo: { time: 0.4, feedback: 0.35 },
  instruments: { bass, pluck, bell, kick, snare: { ...snare, volume: 0.18 }, hat },
  patterns: {
    a: {
      bass: 'F1 . . F1 . . C2 . F1 . . F1 . . A1 C2',
      pluck: 'F4 . A4 . C5 . A4 . F4 . A4 . C5 . A4 .',
      kick: 'x . . . . . x . x . . . . . . .',
      hat: '. . x . . . x . . . x . . . x .',
    },
    b: {
      bass: 'Bb1 . . Bb1 . . F1 . C2 . . C2 . . E1 C2',
      pluck: 'D5 . Bb4 . F4 . Bb4 . C5 . G4 . E4 . G4 .',
      kick: 'x . . . . . x . x . . . . . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: '. . x . . . x . . . x . . . x .',
    },
    c: {
      bass: 'F1 . . F1 . . C2 . Bb1 . . Bb1 . C2 . .',
      pluck: 'F4 . A4 . C5 . F5 . D5 . C5 . Bb4 . A4 .',
      bell: 'F5 . . . . . . . . . . . E5 . . .',
      kick: 'x . . . . . x . x . . . . . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: '. . x . . . x . . . x . . . x .',
    },
  },
  sequence: ['a', 'a', 'b', 'a', 'c', 'b'],
  volume: 0.85,
});
