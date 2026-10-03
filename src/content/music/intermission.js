import { defineSong } from '../../engine/defs.js';
import { bass, arp, pad, kick, snare, hat, bell } from './instruments.js';

// A relaxed groove for the stats screen between floors.
export default defineSong({
  id: 'intermission',
  bpm: 108,
  echo: { time: 0.42, feedback: 0.35 },
  instruments: { bass, arp, pad, kick, snare: { ...snare, volume: 0.2 }, hat, bell },
  patterns: {
    a: {
      bass: 'C2 . . C2 . . E2 . F1 . . F1 . A1 . C2',
      arp: 'C4 G4 E4 G4 C4 G4 E4 G4 F4 C5 A4 C5 F4 C5 A4 C5',
      pad: 'C3+E3+G3 . . . . . . . F3+A3+C4 . . . . . . .',
      kick: 'x . . . . . x . x . . . . . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: '. . x . . . x . . . x . . . x .',
    },
    b: {
      bass: 'A1 . . A1 . . C2 . G1 . . G1 . B1 . D2',
      arp: 'A3 E4 C4 E4 A3 E4 C4 E4 G3 D4 B3 D4 G3 D4 B3 D4',
      pad: 'A2+C3+E3 . . . . . . . G2+B2+D3 . . . . . . .',
      bell: 'E5 . . . . . . . D5 . . . . . . .',
      kick: 'x . . . . . x . x . . . . . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: '. . x . . . x . . . x . . . x .',
    },
  },
  sequence: ['a', 'a', 'b', 'b'],
  volume: 0.85,
});
