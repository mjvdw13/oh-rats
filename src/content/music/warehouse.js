import { defineSong } from '../../engine/defs.js';
import { bass, arp, stab, lead, kick, snare, hat, clap, tom } from './instruments.js';

// Busy, bouncy D major for the warehouse: forklifts beeping, boxes everywhere.
export default defineSong({
  id: 'warehouse',
  bpm: 124,
  echo: { time: 0.36, feedback: 0.3 },
  instruments: { bass, arp, stab, lead, kick, snare, hat, clap, tom },
  patterns: {
    a: {
      bass: 'D2 . D2 D3 . D2 . A1 B1 . B1 B2 . A1 . A1',
      arp: 'A5 . . . A5 . . . A5 . . . A5 . . .',
      stab: '. . D3+F#3+A3 . . . D3+F#3+A3 . . . B2+D3+F#3 . . . A2+C#3+E3 .',
      kick: 'x . . . x . . . x . . . x . . .',
      clap: '. . . . x . . . . . . . x . . .',
      hat: '. x . x . x . x . x . x . x . x',
    },
    b: {
      bass: 'G1 . G1 G2 . G1 . D2 A1 . A1 A2 . E2 . C#2',
      arp: 'A5 . . . A5 . . . A5 . . . A5 . . .',
      stab: '. . G2+B2+D3 . . . G2+B2+D3 . . . A2+C#3+E3 . . . A2+C#3+E3 .',
      kick: 'x . . . x . . . x . . . x . x .',
      clap: '. . . . x . . . . . . . x . . .',
      hat: '. x . x . x . x . x . x . x . x',
    },
    c: {
      bass: 'D2 . D2 D3 . D2 . A1 B1 . B1 B2 . A1 . A1',
      lead: 'F#4 . A4 . D5 . . B4 . A4 . F#4 . E4 . .',
      stab: '. . D3+F#3+A3 . . . D3+F#3+A3 . . . B2+D3+F#3 . . . A2+C#3+E3 .',
      kick: 'x . . . x . . . x . . . x . . .',
      snare: '. . . . x . . . . . . . x . . .',
      hat: '. x . x . x . x . x . x . x . x',
    },
    d: {
      bass: 'G1 . G1 G2 . G1 . D2 A1 . A1 A2 . E2 . C#2',
      lead: 'G4 . B4 . D5 . E5 . C#5 . . A4 . . . .',
      stab: '. . G2+B2+D3 . . . G2+B2+D3 . . . A2+C#3+E3 . . . A2+C#3+E3 .',
      kick: 'x . . . x . . . x . . . x . x .',
      snare: '. . . . x . . . . . . . x . . .',
      tom: '. . . . . . . . . . . . . x x x',
      hat: '. x . x . x . x . x . x . x . x',
    },
  },
  sequence: ['a', 'b', 'a', 'b', 'c', 'd', 'c', 'd'],
  volume: 0.85,
});
