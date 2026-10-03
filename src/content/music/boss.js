import { defineSong } from '../../engine/defs.js';
import { bass, lead, stab, kick, snare, hat, openhat, tom } from './instruments.js';

// A fast, stompy D minor polka for the fight with Dad. Oom-pah, oom-pah!
export default defineSong({
  id: 'boss',
  bpm: 152,
  echo: { time: 0.3, feedback: 0.25 },
  instruments: { bass, lead, stab, kick, snare, hat, openhat, tom },
  patterns: {
    a: {
      bass: 'D1 . A1 . D1 . A1 . G1 . D2 . A1 . E2 .',
      stab: '. . D3+F3+A3 - . . D3+F3+A3 - . . G3+Bb3+D4 - . . A3+C#4+E4 -',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . x . . . x . . . x . . . x .',
      hat: 'x x x x x x x x x x x x x x x x',
    },
    b: {
      bass: 'D1 . A1 . D1 . A1 . G1 . D2 . A1 . E2 .',
      lead: 'D5 . F5 . A5 . F5 . G5 . Bb5 . A5 . C#5 .',
      stab: '. . D3+F3+A3 - . . D3+F3+A3 - . . G3+Bb3+D4 - . . A3+C#4+E4 -',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . x . . . x . . . x . . . x .',
      hat: 'x x x x x x x x x x x x x x x x',
    },
    c: {
      bass: 'Bb0 . F1 . Bb0 . F1 . A0 . E1 . A0 . E1 .',
      lead: 'F5 . E5 . D5 . C#5 . D5 . E5 . F5 . A5 .',
      stab: '. . Bb2+D3+F3 - . . Bb2+D3+F3 - . . A2+C#3+E3 - . . A2+C#3+E3 -',
      kick: 'x . . . x . . . x . . . x . x x',
      snare: '. . x . . . x . . . x . . . x .',
      tom: '. . . . . . . . . . . . x x x x',
      openhat: '. . x . . . x . . . x . . . x .',
    },
  },
  sequence: ['a', 'b', 'b', 'c', 'b', 'c'],
  volume: 0.85,
});
