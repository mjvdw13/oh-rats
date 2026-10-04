import os
from lvl import Level, js, ROOT
from warehouse import legend, THINGS

L = Level(60, 44)

# The warehouse's back room (start): a roll-up door out to the lumber yard.
L.room(26, 36, 38, 43, '#', '.')
L.set(32, 36, 'L')
# The sawmill shed, north of the yard. Its barn door only opens once the
# Lumberjack is beaten; the mouse hole is in its back wall.
L.room(22, 0, 42, 8, 'A', 'h')
L.fill(22, 0, 42, 0, '#')
L.set(32, 0, 'X')
L.set(32, 8, 'e')
# The lumber yard: open sky, sawdust, walls of stacked logs, and log stacks
# to hide behind.
L.room(4, 8, 59, 36, 'K', 's')
for x0, y0 in ((12, 14), (48, 14), (12, 27), (48, 27)):
    L.fill(x0, y0, x0 + 3, y0 + 2, 'K')
L.fill(29, 21, 35, 23, 'K')
L.fill(27, 33, 37, 35, 'y')  # stepping into the yard wakes him up
# Secret: a gap in the west log wall, to a nook behind the woodpile.
L.room(0, 18, 4, 26, 'K', 'x')
L.set(4, 22, 'q')
# Secret: a vent in the back room's west wall, to a duct room.
L.room(12, 37, 19, 43, 'V', 'z')
L.hall(19, 40, 25, 40, 'V', 'z')
L.set(26, 40, 'G')
L.set(12, 40, 'Y')

# --- things
# The back room: the Mega Microwave (or its batteries, if you have it) and snacks.
L.put(32, 41, '^')
L.put(29, 38, '5')
L.puts('Q', (35, 38), (35, 40))
L.puts('d', (28, 42), (36, 42))
L.put(30, 40, 'S')
L.puts(',', (31, 38), (32, 38), (33, 38))
L.put(27, 37, 'P')
# The yard: the Lumberjack, his log piles, and a few rats.
L.put(32, 13, 'K')
L.puts('L', (20, 12), (44, 12), (9, 20), (55, 20), (20, 31), (44, 31), (9, 33), (55, 33), (24, 18), (40, 18), (24, 27), (40, 27))
L.puts('r', (8, 10), (56, 10), (18, 24), (46, 24))
L.puts('i', (6, 34), (57, 34))
L.puts('m', (18, 10), (46, 10))
L.put(32, 30, 'c')
L.puts('$', (24, 34), (40, 34))
L.put(10, 22, '!')
L.put(54, 22, '@')
L.put(32, 26, '%')
L.puts('Q', (6, 10), (57, 10), (8, 34))
L.puts('q', (20, 20), (44, 20))
L.puts('p', (14, 22), (50, 22))
L.put(32, 19, 'd')
L.puts('N', (20, 34), (44, 34))
L.put(8, 16, '*')
L.put(56, 16, 'S')
L.put(32, 32, 'a')
# The sawmill shed.
L.puts('L', (24, 3), (40, 3))
L.puts('p', (26, 2), (38, 2))
L.puts('X', (23, 7), (41, 7))
# The secrets.
L.put(2, 22, 'A')
L.put(2, 20, 'Q')
L.put(2, 24, 'p')
L.put(15, 40, 'Q')
L.puts('d', (14, 38), (17, 42))
L.puts(',', (21, 40), (23, 40))

level_legend = legend(
    e={'door': 'barn-wood', 'jamb': 'barn-wood', 'lock': 'remote', 'tag': 'shed'},
    q={'door': 'log-wall', 'secret': True},
    x={'base': 's', 'secret': True},
    y={'base': 's', 'tag': 'yard'},
    z={'base': 'm', 'secret': True},
)
triggers = [
    {'on': 'start', 'do': [
        {'action': 'message', 'text': 'THE LUMBER YARD, BEHIND THE WAREHOUSE.'},
        {'action': 'message', 'text': 'SOMEBODY OUT THERE IS CHOPPING WOOD...'},
    ]},
    {'on': 'enter', 'tag': 'yard', 'do': [
        {'action': 'music', 'id': 'boss'},
        {'action': 'message', 'text': 'THE LUMBERJACK: HEY! NO RATS IN MY LUMBER YARD!'},
    ]},
    {'on': 'killed', 'thing': 'lumberjack', 'do': [
        {'action': 'openDoors', 'tag': 'shed'},
        {'action': 'message', 'text': 'THE SAWMILL SHED IS OPEN. THE WAY OUT IS IN THERE!'},
    ]},
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e2m5.js'),
    [
        'E2M5: THE LUMBER YARD. The Lumberjack works out back. Beat him and his',
        'chainsaw is yours, and the sawmill shed opens.',
        '',
        'Route: the back room (Mega Microwave) -> the yard: fight the Lumberjack',
        'among the log piles -> grab the chainsaw he drops -> the sawmill shed',
        '(its barn door opens when he falls) -> the mouse hole ends the episode.',
        'Secrets: a gap in the west log wall (a nook behind the woodpile) and a',
        'vent in the back room\'s west wall (a duct room).',
    ],
    {
        'id': "'e2m5'",
        'mapLabel': "'E2M5'",
        'name': "'THE LUMBER YARD'",
        'music': "'warehouse'",
        'sky': "'sky-day'",
        'par': 180,
        'legend': js(level_legend),
        'thingLegend': js(THINGS),
        'triggers': js(triggers),
    },
)
print('ok')
