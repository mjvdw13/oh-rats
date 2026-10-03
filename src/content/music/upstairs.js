import { defineSong } from '../../engine/defs.js';
import { bass, lead, pluck, bell, kick, snare, hat } from './instruments.js';

// A playful D major skip through the kids' rooms (watch out for the lava).
export default defineSong({
  id: 'upstairs',
  bpm: 138,
  echo: { time: 0.32, feedback: 0.3 },
  instruments: { bass, lead, pluck, bell, kick, snare, hat },
  patterns: {
    a: {
      bass: 'D2 . A1 . D2 . A1 . G1 . D2 . A1 . C#2 .',
      pluck: 'F#4 A4 D5 A4 F#4 A4 D5 A4 G4 B4 D5 B4 E4 A4 C#5 A4',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: 'x . x . x . x . x . x . x . x .',
    },
    b: {
      bass: 'D2 . A1 . D2 . A1 . G1 . D2 . A1 . C#2 .',
      lead: 'A5 . F#5 . D5 . F#5 . G5 . B5 . A5 . E5 .',
      pluck: 'F#4 A4 D5 A4 F#4 A4 D5 A4 G4 B4 D5 B4 E4 A4 C#5 A4',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: 'x . x . x . x . x . x . x . x .',
    },
    c: {
      bass: 'B1 . F#2 . B1 . F#2 . G1 . D2 . A1 . . .',
      lead: 'B4 . D5 . F#5 . E5 D5 E5 . G5 . F#5 . E5 .',
      bell: 'B5 . . . . . . . . . . . A5 . . .',
      kick: 'x . . . x . . . x . . . x . x .',
      snare: '. . . . x . . . . . . . x . . x',
      hat: 'x . x . x . x . x . x . x x x x',
    },
  },
  sequence: ['a', 'b', 'b', 'c', 'b', 'c'],
  volume: 0.85,
});
