import os
from lvl import Level, js, ROOT
from warehouse import legend, THINGS

L = Level(64, 50)

# The front aisles: five long racks with a cross aisle through the middle.
L.room(18, 23, 57, 48, '#', '-')
L.fill(57, 26, 57, 45, 'S')  # racks along the east wall too (one hides a secret)
for x in (24, 30, 36, 42, 48):
    L.fill(x, 26, x, 43, 'S')
    L.fill(x, 34, x, 35, '-')
for x in (21, 27, 33, 39, 45, 52):
    L.fill(x, 28, x, 30, ':')
    L.fill(x, 39, x, 41, ':')
L.fill(19, 46, 56, 46, '_')  # the forklift lane
# The entry from the loading dock (start).
L.room(0, 38, 18, 48, '#', '.')
L.set(18, 43, 'D')
# The returns cage, off the front aisles: armour and snacks.
L.room(0, 23, 18, 38, '#', '.')
L.set(18, 30, 'D')
L.fill(6, 28, 11, 33, ':')
# The back aisles, behind the blue door: four racks the other way.
L.room(18, 3, 57, 23, '#', '-')
L.set(39, 23, '1')
for y in (7, 11, 15, 19):
    L.fill(22, y, 53, y, 'S')
for x0 in (26, 38, 50):
    L.fill(x0, 9, x0 + 1, 9, ':')
    L.fill(x0, 17, x0 + 1, 17, ':')
# The returns office, behind the red door: the mouse hole.
L.room(0, 3, 18, 23, '#', '.')
L.set(18, 13, '3')
L.fill(4, 8, 10, 18, 'a')
L.set(0, 13, 'X')
for x, y in ((15, 6), (16, 18), (2, 16)):
    L.set(x, y, 'w')  # the returns bins the ambush climbs out of
# Secret: one of the racks on the east wall slides away, to a hidden stash.
L.room(57, 36, 63, 44, '#', 'x')
L.set(57, 40, 'q')
# Secret: a vent in the back aisles' north wall, along the roof to a duct room.
L.set(40, 3, 'G')
L.hall(40, 1, 40, 2, 'V', 'z')
L.hall(40, 1, 56, 1, 'V', 'z')
L.room(57, 0, 63, 8, 'V', 'z')
L.set(57, 1, 'z')
L.set(63, 4, 'Y')
L.set(57, 6, 'G')  # a second vent cover drops back into the back aisles: a loop

# --- things
# The entry.
L.put(3, 43, '>')
L.puts(',', (8, 41), (9, 41), (10, 41))
L.puts('P', (2, 39), (2, 47), (15, 47))
L.puts('r', (12, 40), (14, 46))
L.put(6, 46, '+')
L.put(11, 45, 's')
# The front aisles.
L.puts('r', (21, 25), (27, 32), (33, 40), (39, 27), (45, 37), (52, 30), (27, 44))
L.puts('i', (33, 26), (45, 25), (52, 42))
L.puts('m', (21, 41), (39, 44), (55, 34))
L.put(30, 35, 'c')
L.put(48, 34, 'c')
L.puts('$', (27, 25), (45, 43))
L.put(36, 35, '!')
L.put(52, 38, '@')
L.put(21, 33, '`')
L.put(55, 25, '6')  # the Flare Gun, at the far end of the last aisle
L.puts('E', (39, 33), (21, 45), (54, 47))
L.puts('s', (27, 36), (45, 30), (33, 30))
L.puts('M', (21, 27), (39, 40), (51, 46))
L.put(33, 44, 'S')
L.puts('X', (26, 47), (44, 47))
L.put(30, 47, 'F')
L.puts('o', (36, 25), (42, 46))
L.put(51, 24, 'b')
L.puts('d', (21, 36), (45, 47))
# The returns cage.
L.puts('X', (2, 25), (3, 25), (2, 36), (16, 25))
L.put(8, 30, 'A')
L.puts(';', (6, 26), (7, 26), (8, 26), (9, 26))
L.puts('r', (4, 31), (13, 34))
L.put(14, 27, 'm')
L.put(10, 35, 'p')
L.put(5, 35, 'J')
# The back aisles.
L.puts('r', (25, 5), (35, 13), (47, 9), (31, 21), (52, 17))
L.puts('i', (20, 9), (55, 13), (44, 21))
L.puts('m', (55, 5), (28, 17))
L.put(38, 13, 'c')
L.put(30, 9, 'G')
L.puts('!', (50, 21), (20, 17))
L.put(44, 5, '%')
L.put(36, 17, '&')
L.put(20, 4, 'R')
L.puts('E', (24, 13), (48, 13))
L.put(55, 21, 'Z')
L.puts('s', (34, 5), (42, 17))
L.put(20, 21, 'd')
L.put(55, 9, 'p')
# The returns office (an ambush waits by the mouse hole).
L.puts('P', (2, 5), (2, 21), (16, 5))
L.puts('X', (14, 20), (15, 20))
L.put(7, 13, 'T')
L.put(9, 13, 'h')
L.puts('r', (12, 9), (4, 19))
L.put(15, 13, 'i')
L.put(3, 9, 'd')
L.put(13, 16, 'u')
# The secrets.
L.put(60, 40, 'O')
L.puts('Z', (59, 38), (61, 42))
L.put(60, 3, 'D')
L.put(61, 7, 'r')  # a rat guarding the stash
L.puts(';', (59, 5), (61, 5))
L.puts(',', (45, 1), (50, 1), (54, 1))

level_legend = legend(
    q={'door': 'rack-boxes', 'secret': True},
    x={'base': '-', 'light': 176, 'secret': True},
    z={'base': 'm', 'secret': True},
    a={'base': '.', 'tag': 'office'},
    w={'base': '.', 'tag': 'bins'},
)
triggers = [
    {'on': 'start', 'do': [{'action': 'message', 'text': 'THE AISLES. SHELVES, SHELVES, SHELVES... AND RATS.'}]},
    {'on': 'pickup', 'thing': 'pickup-flare-gun', 'do': [{'action': 'message', 'text': 'A FLARE GUN! LIGHT UP THOSE DARK AISLES.'}]},
    {'on': 'enter', 'tag': 'office', 'do': [
        {'action': 'message', 'text': 'RATS ARE CLIMBING OUT OF THE RETURNS BINS!'},
        {'action': 'spawn', 'thing': 'rat', 'tag': 'bins'},
    ]},
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e2m2.js'),
    [
        'E2M2: THE AISLES. Rows and rows of shelves, stacked to the roof.',
        '',
        'Route: the entry -> the front aisles (Flare Gun and the blue key at the far',
        'east end) -> the blue door -> the back aisles (red key in the north-west',
        'corner) -> the red door -> the returns office -> the mouse hole. Rats',
        'climb out of the returns bins when you walk into the office.',
        'Secrets: a rack on the east wall that slides away (the Golden Cheese)',
        'and a vent in the back aisles\' north wall (a duct loop over the roof, with a',
        'second vent cover back down into the back aisles).',
    ],
    {
        'id': "'e2m2'",
        'mapLabel': "'E2M2'",
        'name': "'THE AISLES'",
        'music': "'warehouse'",
        'sky': "'sky-day'",
        'par': 150,
        'legend': js(level_legend),
        'thingLegend': js(THINGS),
        'triggers': js(triggers),
    },
)
print('ok')
