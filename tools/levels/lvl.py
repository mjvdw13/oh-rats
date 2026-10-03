# Level builder: lays out a level on a grid so the tile and thing grids stay
# aligned, then write a plain-ASCII level file for src/content/levels/.
import json
import os

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))


class Level:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.t = [[' '] * w for _ in range(h)]
        self.th = [[' '] * w for _ in range(h)]

    def room(self, x0, y0, x1, y1, wall, floor):
        """Walls on the border (not over existing floor), floor inside."""
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if x in (x0, x1) or y in (y0, y1):
                    if self.t[y][x] == ' ':
                        self.t[y][x] = wall
                else:
                    self.t[y][x] = floor

    def fill(self, x0, y0, x1, y1, ch):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.t[y][x] = ch

    def hall(self, x0, y0, x1, y1, wall, floor):
        """A corridor: floor from (x0,y0) to (x1,y1), walls around unless already floor."""
        for y in range(y0 - 1, y1 + 2):
            for x in range(x0 - 1, x1 + 2):
                if x0 <= x <= x1 and y0 <= y <= y1:
                    self.t[y][x] = floor
                elif self.t[y][x] == ' ':
                    self.t[y][x] = wall

    def set(self, x, y, ch):
        self.t[y][x] = ch

    def put(self, x, y, ch):
        assert self.th[y][x] == ' ', f'two things at {x},{y}'
        self.th[y][x] = ch

    def puts(self, ch, *pts):
        for x, y in pts:
            self.put(x, y, ch)

    def rows(self, grid):
        return [''.join(r).rstrip() for r in grid]

    def write(self, path, header, fields):
        tiles = self.rows(self.t)
        width = max(len(r) for r in tiles)
        tiles = [r.ljust(width) for r in tiles]
        while tiles and not tiles[-1].strip():
            tiles.pop()
        things = self.rows(self.th)
        while things and things[-1] == '':
            things.pop()
        out = ["import { defineLevel } from '../../engine/defs.js';", '']
        out += [f'// {line}' if line else '//' for line in header]
        out.append('export default defineLevel({')
        for k, v in fields.items():
            if k in ('tiles', 'things', 'triggers'):
                continue
            out.append(f'  {k}: {v},')
        out.append('  tiles: [')
        out += [f"    '{r}'," for r in tiles]
        out.append('  ],')
        out.append('  things: [')
        out += [f"    '{r}'," for r in things]
        out.append('  ],')
        if 'triggers' in fields:
            out.append(f"  triggers: {fields['triggers']},")
        out.append('});')
        open(path, 'w', encoding='utf-8', newline='\n').write('\n'.join(out) + '\n')


def js(v, indent=2):
    """Tiny JS-literal printer for legend/trigger objects (keys unquoted when safe)."""
    pad = ' ' * indent
    if isinstance(v, dict):
        if not v:
            return '{}'
        parts = []
        for k, val in v.items():
            key = k if (k.isidentifier()) else json.dumps(k).replace('"', "'")
            parts.append(f'{key}: {js(val, indent + 2)}')
        one = '{ ' + ', '.join(parts) + ' }'
        if len(one) < 110:
            return one
        return '{\n' + ''.join(f'{pad}  {p},\n' for p in parts) + pad + '}'
    if isinstance(v, list):
        items = [js(x, indent + 2) for x in v]
        one = '[' + ', '.join(items) + ']'
        if len(one) < 110:
            return one
        return '[\n' + ''.join(f'{pad}  {i},\n' for i in items) + pad + ']'
    if isinstance(v, str):
        return "'" + v.replace("'", "\\'") + "'"
    if isinstance(v, bool):
        return 'true' if v else 'false'
    return str(v)
