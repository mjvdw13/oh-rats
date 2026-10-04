import os
from lvl import Level, js, ROOT
from warehouse import legend, THINGS

L = Level(58, 46)

# The cheese vault: a big frosty room full of shelves of cheese wheels.
L.room(12, 10, 40, 36, 'F', 'i')
for y in (14, 20, 26, 31):
    L.fill(16, y, 22, y + 1, 'W')
    L.fill(26, y, 32, y + 1, 'W')
L.fill(24, 12, 24, 34, 'l')
L.fill(36, 12, 36, 34, 'l')
# The ice hall, north of the vault: long, dim and slippery-looking.
L.room(12, 0, 40, 10, 'F', 'i')
L.set(26, 10, 'J')
for x in (16, 26, 36):
    L.set(x, 5, 'l')
# The antechamber from the aisles (start), with a vent in its north wall.
L.room(0, 18, 12, 28, '#', '.')
L.set(12, 23, 'J')
# The blast chiller, behind the blue door: fans roaring in the east wall.
L.room(40, 10, 57, 24, 'F', 'l')
L.set(40, 17, '1')
for y in (13, 20):
    L.set(57, y, 'Y')
# The loading tunnel, behind the yellow door: concrete, pipes and the mouse hole.
L.room(40, 24, 57, 36, 'O', '-')
L.fill(41, 24, 56, 24, 'I')
L.set(40, 30, '2')
L.set(57, 30, 'X')
L.fill(44, 28, 53, 32, '.')
# Secret: one of the cheese shelves in the vault's south wall swings open,
# into the deep freeze.
L.fill(14, 36, 28, 36, 'W')
L.room(12, 36, 30, 45, 'F', 'x')
L.set(20, 36, 'q')
# Secret: the vent in the antechamber's north wall, up to a duct room.
L.set(6, 18, 'G')
L.hall(6, 9, 6, 17, 'V', 'z')
L.room(0, 0, 12, 9, 'V', 'z')
L.set(6, 9, 'z')

# --- things
# The antechamber.
L.put(3, 23, '>')
L.puts(',', (6, 21), (7, 21), (8, 21))
L.puts('P', (1, 19), (1, 27), (11, 27))
L.put(9, 25, 'r')
L.put(4, 26, '+')
L.put(10, 19, 's')
# The ice hall.
L.put(14, 8, '7')
L.puts('t', (20, 5), (30, 5))
L.put(38, 2, 'b')
L.puts('j', (20, 3), (32, 7))
L.put(26, 5, '`')
L.puts('r', (35, 5), (17, 6))
L.put(38, 8, 'm')
L.put(24, 2, 'i')
L.put(30, 2, '&')
L.put(33, 1, 'd')
# The cheese vault.
L.puts('r', (14, 12), (24, 17), (34, 23), (24, 30), (37, 34), (14, 24))
L.puts('i', (35, 12), (14, 34))
L.puts('m', (24, 24), (37, 18))
L.put(34, 29, 'c')
L.put(24, 12, 'G')
L.put(37, 28, '$')
L.put(14, 18, '!')
L.put(34, 33, '@')
L.puts('s', (25, 13), (14, 29), (33, 17))
L.put(34, 18, 'M')
L.puts('E', (24, 35), (19, 23))
L.puts('d', (37, 12), (14, 35))
L.put(35, 30, 'n')
L.puts('t', (19, 29), (29, 23))
L.puts(';', (19, 17), (29, 17))
# The blast chiller.
L.put(54, 17, 'y')
L.put(50, 14, 'c')
L.put(45, 20, 'j')
L.put(52, 21, 'G')
L.put(44, 12, 'm')
L.put(55, 12, '*')
L.put(42, 22, 'p')
L.put(48, 17, 'J')
# The loading tunnel.
L.puts('r', (45, 28), (50, 33))
L.put(55, 26, 'i')
L.put(53, 30, 'G')
L.put(44, 34, '%')
L.puts('P', (41, 25), (41, 35), (56, 35))
L.put(48, 30, 'd')
L.put(46, 26, 'S')
# The deep freeze (secret).
L.put(16, 40, 'A')
L.put(25, 42, 'S')
L.put(21, 39, 'N')
L.put(27, 39, '*')
L.puts('d', (14, 43), (28, 43))
# The duct room (secret).
L.put(6, 4, 'p')
L.put(3, 2, 'Z')
L.puts(';', (9, 2), (9, 6))
L.puts(',', (6, 12), (6, 15))

level_legend = legend(
    q={'door': 'cheese-shelf', 'secret': True},
    x={'base': 'i', 'secret': True},
    z={'base': 'm', 'secret': True},
)
triggers = [
    {'on': 'start', 'do': [
        {'action': 'message', 'text': 'BRRRR! THE BIG FREEZER.'},
        {'action': 'message', 'text': 'MILES AND MILES OF CHEESE... ALL FROZEN.'},
    ]},
    {'on': 'pickup', 'thing': 'pickup-blow-torch', 'do': [{'action': 'message', 'text': 'A BLOW TORCH! THAT WILL WARM THINGS UP.'}]},
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e2m3.js'),
    [
        'E2M3: THE BIG FREEZER. A walk-in freezer the size of a house, full of',
        'frozen cheese.',
        '',
        'Route: the antechamber -> the cheese vault -> the ice hall (Blow Torch,',
        'blue key at the east end) -> the blue door -> the blast chiller (yellow',
        'key) -> back through the vault -> the yellow door -> the loading tunnel',
        '-> the mouse hole.',
        'Secrets: a cheese shelf in the vault\'s south wall that swings open (the',
        'deep freeze) and a vent in the antechamber\'s north wall (a duct room).',
    ],
    {
        'id': "'e2m3'",
        'mapLabel': "'E2M3'",
        'name': "'THE BIG FREEZER'",
        'music': "'basement'",
        'sky': "'sky-day'",
        'par': 150,
        'legend': js(level_legend),
        'thingLegend': js(THINGS),
        'triggers': js(triggers),
    },
)
print('ok')
