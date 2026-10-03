import os
from lvl import Level, js, ROOT

L = Level(50, 38)

# The rat nest behind the furnace (start).
L.room(1, 1, 10, 8, 'O', '-')
for x in (3, 4, 5):
    L.set(x, 1, 'U')
L.set(8, 1, 'I')
# The vent from the nest to the laundry room.
L.set(10, 4, 'G')
L.hall(11, 4, 17, 4, 'V', 'n')
L.set(18, 4, 'G')
# Laundry room.
L.room(18, 1, 32, 12, 'O', '=')
for x in (20, 23, 26, 29):
    L.set(x, 1, 'I')
L.fill(19, 2, 31, 3, '-')
# Secret: a loose concrete panel in the laundry's east wall, a vent loop to a
# hidden duct junction full of goodies.
L.set(32, 6, 'q')
L.hall(33, 6, 39, 6, 'V', 'z')
L.room(40, 2, 48, 10, 'V', 'z')
L.set(40, 6, 'z')
L.set(48, 6, 'Y')
L.set(48, 4, 'Y')
# Hallway along the middle of the basement.
L.set(25, 12, 'D')
L.room(1, 12, 48, 16, 'O', '-')
for x in range(4, 46, 8):
    L.set(x, 14, '=')
L.set(13, 12, 'N')  # a little basement window
# Storage room full of boxes (blue key at the back).
L.room(1, 16, 16, 32, 'O', '-')
L.set(8, 16, 'D')
L.fill(2, 17, 15, 18, '=')
# Secret closet behind the storage room's south wall.
L.set(8, 32, 'y')
L.room(5, 32, 11, 36, 'o', 'x')
# Workshop (the Rubber Band Gatling).
L.room(16, 16, 32, 28, 'w', '-')
L.set(24, 16, 'D')
L.fill(21, 20, 27, 24, '=')
# Rec room behind the blue door: carpet, an old couch, the stairs and the exit.
L.room(32, 16, 48, 32, 'w', ',')
L.set(40, 16, '1')
L.fill(38, 22, 42, 26, ';')
L.set(32, 22, 'a')
L.set(44, 32, 'X')
L.set(48, 24, 'N')

# --- things
L.put(4, 5, '>')
L.puts(',', (6, 3), (7, 3), (8, 3))
L.put(2, 7, 'x')
L.put(8, 7, 'P')
# Laundry room.
L.puts('W', (20, 2), (23, 2), (26, 2))
L.put(29, 3, 'L')
L.put(30, 10, 'o')
L.put(19, 10, 'X')
L.puts('r', (22, 6), (27, 8), (24, 10))
L.put(30, 5, '$')
L.puts(';', (21, 9), (22, 9))
L.put(28, 6, 'd')
L.put(20, 6, '+')
# Secret vent loop.
L.puts(';', (35, 6), (37, 6))
L.puts(';', (42, 4), (44, 4), (46, 4))
L.put(44, 7, 'a')
L.put(42, 8, 'p')
# Hallway.
L.puts('i', (6, 14), (30, 13), (43, 15))
L.put(16, 14, '!')
L.puts('r', (12, 13), (36, 14))
L.put(20, 15, 's')
L.put(46, 13, 'd')
L.put(3, 15, 'k')
L.put(38, 13, 'o')
L.put(2, 13, '"')
# Storage room: stacks of boxes, the blue key at the back.
for (x, y) in [(4, 20), (5, 20), (10, 20), (11, 20), (4, 24), (8, 23), (12, 24), (13, 24), (6, 27), (10, 28), (3, 29), (14, 28)]:
    L.put(x, y, 'X')
L.put(2, 31, 'b')
L.puts('r', (7, 21), (12, 26), (4, 26))
L.put(9, 30, 'i')
L.put(13, 18, '$')
L.put(14, 31, 'B')
L.put(7, 25, 'd')
L.put(15, 17, ',')
# Secret closet.
L.put(8, 34, 'O')
L.put(6, 35, 'x')
# Workshop.
L.put(24, 23, '3')
L.puts('s', (22, 25), (26, 25))
L.puts('I', (17, 17), (31, 17))
L.puts('X', (17, 27), (31, 27))
L.put(20, 19, 'o')
L.puts('i', (19, 22), (29, 21))
L.put(24, 26, '!')
L.put(28, 26, 'r')
L.put(30, 24, 'd')
# Rec room.
L.put(40, 20, 'H')
L.put(40, 25, 'V')
L.put(36, 18, 'l')
L.put(46, 18, 'F')
L.put(34, 30, 'X')
L.puts('m', (36, 28), (45, 22))
L.put(42, 29, 'c')
L.puts('r', (38, 30), (46, 28))
L.put(34, 20, '@')
L.put(44, 27, '$')
L.put(35, 25, 'p')
L.put(47, 30, 'S')
L.puts(',', (38, 18), (39, 18), (41, 18))

legend = {
    'q': {'door': 'concrete', 'secret': True},
    'y': {'door': 'concrete', 'secret': True},
    'z': {'base': 'm', 'secret': True},
    'x': {'base': '-', 'light': 176, 'secret': True},
}
triggers = [
    {'on': 'start', 'do': [{'action': 'message', 'text': 'YOU WAKE UP BEHIND THE FURNACE. PRESS USE ON THE VENT COVER TO CRAWL OUT.'}]},
    {'on': 'pickup', 'thing': 'pickup-band-gatling', 'do': [{'action': 'message', 'text': 'THWIP THWIP THWIP! HOLD FIRE TO KEEP FLINGING.'}]},
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e1m1.js'),
    [
        'E1M1: THE BASEMENT. You wake up in a rat nest behind the furnace. Time to',
        'show the other rats who is boss.',
        '',
        'Route: the vent cover -> the laundry room -> the hallway -> the workshop',
        '(Rubber Band Gatling) -> the storage room (blue key, behind the boxes) ->',
        'the blue door -> the rec room -> the mouse hole by the stairs.',
        'Secrets: a loose panel in the laundry room\'s east wall (a vent loop full of',
        'goodies) and the south wall of the storage room (a closet with the Golden',
        'Cheese).',
    ],
    {
        'id': "'e1m1'",
        'mapLabel': "'E1M1'",
        'name': "'THE BASEMENT'",
        'music': "'basement'",
        'sky': "'sky-day'",
        'par': 90,
        'legend': js(legend),
        'triggers': js(triggers),
    },
)
print('ok')
