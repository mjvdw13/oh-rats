import { defineSong } from '../../engine/defs.js';
import { bass, lead, stab, pad, kick, snare, hat, openhat } from './instruments.js';

// Upbeat G major for running around the kitchen and the living room.
export default defineSong({
  id: 'house',
  bpm: 132,
  echo: { time: 0.34, feedback: 0.28 },
  instruments: { bass, lead, stab, pad, kick, snare, hat, openhat },
  patterns: {
    a: {
      bass: 'G1 . G2 G1 . G1 B1 . C2 . C3 C2 . D2 . D2',
      stab: 'G3+B3+D4 - . . . . . . C4+E4+G4 - . . D4+F#4+A4 - . .',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: 'x x x x x x x x x x x x x x x x',
    },
    b: {
      bass: 'G1 . G2 G1 . G1 B1 . C2 . C3 C2 . D2 . D2',
      lead: 'D5 . B4 . G4 . B4 . C5 . E5 . D5 . . .',
      stab: 'G3+B3+D4 - . . . . . . C4+E4+G4 - . . D4+F#4+A4 - . .',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: 'x x x x x x x x x x x x x x x x',
    },
    c: {
      bass: 'E1 . E2 E1 . E1 G1 . C2 . C3 C2 . D2 . D2',
      lead: 'E5 . D5 . B4 . G4 . A4 . B4 . C5 . D5 .',
      pad: 'E3+G3+B3 . . . . . . . C3+E3+G3 . . . D3+F#3+A3 . . .',
      kick: 'x . . . x . . . x . . . x . x .',
      snare: '. . . . x . . . . . . . x . x x',
      openhat: '. . x . . . x . . . x . . . x .',
    },
  },
  sequence: ['a', 'b', 'b', 'c', 'b', 'c', 'a'],
  volume: 0.85,
});
