import { defineSong } from '../../engine/defs.js';
import { bass, lead, pluck, kick, snare, hat, bell } from './instruments.js';

// A bouncy C major theme: here comes the zombie rat!
export default defineSong({
  id: 'title',
  bpm: 126,
  echo: { time: 0.36, feedback: 0.3 },
  instruments: { bass, lead, pluck, kick, snare, hat, bell },
  patterns: {
    a: {
      bass: 'C2 . G1 . C2 . G1 . F1 . C2 . G1 . B1 .',
      pluck: 'C4+E4 . . C4+E4 . . C4+E4 . A3+C4+F4 . . A3+C4+F4 . . B3+D4+G4 .',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: 'x . x . x . x . x . x . x . x .',
    },
    b: {
      bass: 'C2 . G1 . C2 . G1 . F1 . C2 . G1 . B1 .',
      lead: 'C5 . E5 . G5 . E5 . F5 . A5 . G5 . . .',
      pluck: 'C4+E4 . . C4+E4 . . C4+E4 . A3+C4+F4 . . A3+C4+F4 . . B3+D4+G4 .',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: 'x . x . x . x . x . x . x . x .',
    },
    c: {
      bass: 'A1 . E2 . A1 . E2 . D2 . A1 . G1 . D2 .',
      lead: 'A4 . C5 . E5 . D5 C5 D5 . F5 . E5 . D5 .',
      pluck: 'A3+C4+E4 . . A3+C4+E4 . . . . D4+F4 . . D4+F4 . . B3+D4+G4 .',
      bell: '. . . . . . . . . . . . G5 . . .',
      kick: 'x . . . x . . . x . . . x . x .',
      snare: '. . . . x . . . . . . . x . . x',
      hat: 'x . x . x . x . x . x . x x x x',
    },
  },
  sequence: ['a', 'b', 'b', 'c', 'b', 'c'],
  volume: 0.85,
});
