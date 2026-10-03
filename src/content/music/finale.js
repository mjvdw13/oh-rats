import { defineSong } from '../../engine/defs.js';
import { lead, pad, bell, kick, snare, hat, sub } from './instruments.js';

// A victory fanfare in F major: the house is yours.
export default defineSong({
  id: 'finale',
  bpm: 100,
  echo: { time: 0.45, feedback: 0.4 },
  instruments: { lead, pad, bell, kick, snare, hat, bass: sub },
  patterns: {
    a: {
      lead: 'C5 . . C5 F5 . . . A5 . . . G5 . F5 .',
      pad: 'F3+A3+C4 . . . . . . . Bb3+D4+F4 . . . . . . .',
      bass: 'F1 . . . . . . . Bb1 . . . . . . .',
      kick: 'x . . . . . . . x . . . . . . .',
      snare: '. . . . x . . . . . . . x . . .',
    },
    b: {
      lead: 'G5 . . . E5 . C5 . F5 . . . . . . .',
      pad: 'C3+E3+G3 . . . . . . . F3+A3+C4 . . . . . . .',
      bass: 'C2 . . . . . . . F1 . . . . . . .',
      bell: '. . . . . . . . C6 . . . A5 . . .',
      kick: 'x . . . . . . . x . . . . . . .',
      snare: '. . . . x . . . . . . . x . x x',
      hat: 'x . x . x . x . x . x . x . x .',
    },
  },
  sequence: ['a', 'b', 'a', 'b'],
  volume: 0.85,
});
