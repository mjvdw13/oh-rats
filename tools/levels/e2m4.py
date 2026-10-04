import os
from lvl import Level, js, ROOT
from warehouse import legend, THINGS

L = Level(60, 46)

# The sorting floor: belts everywhere, and the SORT-O-MATIC in the middle.
L.room(0, 12, 44, 34, '#', '.')
L.fill(2, 16, 41, 16, '>')  # a long belt running east
L.fill(4, 20, 42, 20, '<')  # and one running back west
L.fill(26, 25, 34, 30, 'M')
for x in (24, 32, 40):
    L.set(x, 12, 'U')
# The sorting island: the blue key sits in the middle, and every belt around
# it runs outward. Walk (or run!) against them to get in.
L.fill(7, 24, 17, 24, '^')
L.fill(7, 32, 17, 32, 'v')
L.fill(7, 25, 7, 31, '<')
L.fill(17, 25, 17, 31, '>')
L.fill(8, 25, 16, 31, ':')
# The intake room (start).
L.room(0, 0, 14, 12, '#', '.')
L.set(7, 12, 'D')
# The packing room, behind the blue door: a belt up to the Mega Microwave.
L.room(44, 12, 59, 34, '#', '.')
L.set(44, 24, '1')
L.fill(51, 15, 51, 32, '^')
L.fill(47, 14, 55, 14, ':')
# The dispatch bay, behind the yellow door: ride the belt to the mouse hole.
L.room(14, 34, 46, 45, 'B', '.')
L.set(30, 34, '2')
L.fill(16, 40, 44, 40, '>')
L.set(46, 40, 'X')
L.fill(26, 36, 34, 38, ':')
# Secret: one of the intake room's chutes is a way through, to the lost parcels.
L.room(14, 0, 24, 11, '#', 'x')
L.set(14, 6, 'q')
# Secret: a vent in the dispatch bay's west wall, to a duct room.
L.room(0, 38, 9, 45, 'V', 'z')
L.hall(9, 42, 13, 42, 'V', 'z')
L.set(14, 42, 'G')
L.set(0, 41, 'Y')

# --- things
# The intake room.
L.put(7, 3, 'v')
L.puts('X', (2, 2), (3, 2), (12, 2), (2, 10))
L.puts(',', (5, 6), (7, 6), (9, 6))
L.put(11, 9, 'r')
L.put(4, 8, '+')
L.put(12, 10, 's')
# The sorting floor.
L.puts('r', (5, 14), (20, 14), (36, 18), (12, 22), (40, 23), (22, 33), (38, 32))
L.puts('i', (30, 14), (2, 28), (42, 28))
L.puts('m', (24, 22), (36, 32), (2, 18))
L.puts('c', (22, 28), (38, 26))
L.put(30, 22, 'G')
L.puts('$', (14, 18), (40, 14))
L.put(21, 31, '!')
L.put(36, 24, '@')
L.put(4, 33, '`')
L.put(12, 28, 'b')
L.puts('s', (8, 14), (34, 18), (20, 26))
L.puts('M', (16, 18), (38, 21))
L.puts('E', (25, 32), (3, 22))
L.put(28, 18, 'J')
L.puts('d', (42, 13), (1, 33))
L.puts('X', (1, 13), (43, 33), (43, 31))
L.puts('o', (22, 18), (40, 18))
L.put(10, 18, 'C')
L.put(24, 31, 'P')
L.put(13, 29, ';')
# The packing room.
L.put(51, 13, '5')
L.puts('q', (49, 13), (53, 13))
L.put(57, 32, 'y')
L.puts('T', (47, 20), (55, 20), (47, 27), (55, 27))
L.puts('r', (46, 16), (56, 24), (48, 31))
L.put(56, 15, 'i')
L.put(46, 23, 'm')
L.put(54, 30, 'c')
L.put(49, 18, 'j')
L.put(56, 18, '%')
L.puts('X', (58, 13), (58, 14), (45, 33))
L.put(53, 23, 'p')
L.put(47, 33, 'S')
# The dispatch bay.
L.puts('r', (18, 37), (40, 43), (24, 43))
L.puts('i', (44, 36), (16, 44))
L.put(32, 43, 'G')
L.put(28, 37, 'c')
L.put(36, 37, 'j')
L.puts('&', (20, 42), (42, 38))
L.puts('P', (15, 35), (45, 35), (15, 44))
L.put(30, 42, 'd')
L.puts('Q', (34, 44), (22, 36))
L.put(42, 44, 'E')
# The secrets.
L.put(19, 5, 'O')
L.puts('Q', (16, 2), (22, 2))
L.puts('X', (16, 9), (22, 9))
L.put(4, 41, 'A')
L.puts('Z', (2, 39), (2, 44))
L.puts(',', (11, 42), (6, 39), (6, 44))

level_legend = legend(
    q={'door': 'chute', 'secret': True},
    x={'base': '-', 'light': 176, 'secret': True},
    z={'base': 'm', 'secret': True},
)
triggers = [
    {'on': 'start', 'do': [
        {'action': 'message', 'text': 'THE SORTING ROOM. WATCH YOUR STEP:'},
        {'action': 'message', 'text': 'THE CONVEYOR BELTS CARRY YOU ALONG!'},
    ]},
    {'on': 'pickup', 'thing': 'key-blue', 'do': [{'action': 'message', 'text': 'GOT IT! NOW RIDE THE BELTS BACK OUT.'}]},
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e2m4.js'),
    [
        'E2M4: THE CONVEYOR BELTS. The sorting room, where every box in the',
        'warehouse rides the belts. The belts carry you along too.',
        '',
        'Route: the intake room -> the sorting floor -> the sorting island (blue',
        'key; every belt around it runs outward, so push against them) -> the blue',
        'door -> the packing room (ride the belt up to the Mega Microwave, yellow',
        'key in the corner) -> the yellow door -> the dispatch bay -> ride the',
        'belt to the mouse hole.',
        'Secrets: a chute in the intake room\'s east wall (the lost parcels) and a',
        'vent in the dispatch bay\'s west wall (a duct room).',
    ],
    {
        'id': "'e2m4'",
        'mapLabel': "'E2M4'",
        'name': "'THE CONVEYOR BELTS'",
        'music': "'warehouse'",
        'sky': "'sky-day'",
        'par': 150,
        'legend': js(level_legend),
        'thingLegend': js(THINGS),
        'triggers': js(triggers),
    },
)
print('ok')
