import os
from lvl import Level, js, ROOT

L = Level(68, 42)

# The vent over the kitchen: from the back hall up, along, and down into the dining room.
L.hall(14, 1, 14, 3, 'V', 'n')
L.hall(15, 1, 58, 1, 'V', 'n')
L.hall(58, 2, 58, 3, 'V', 'n')
L.set(26, 0, 'Y')
L.set(46, 0, 'Y')
for x in range(20, 56, 6):
    L.set(x, 1, 'm')  # light spilling up through the grilles
# Secret: a side duct off the vent, full of goodies.
L.set(36, 2, 'u')
L.hall(36, 3, 36, 3, 'V', 'z')

# Broom closet (start) and the back hall.
L.room(1, 4, 8, 10, '#', '.')
L.set(8, 7, 'Q')
L.room(8, 4, 20, 10, '#', '.')
L.set(14, 4, 'G')
L.set(11, 10, 'N')
# The kitchen.
L.room(20, 4, 46, 26, 'T', 'k')
L.set(20, 7, 'D')
for x in range(21, 46):
    L.set(x, 4, 'C')
for x in (27, 28):
    L.set(x, 4, 'S')
for x in (37, 38):
    L.set(x, 4, 'F')
L.set(36, 4, 'F')
for x in range(21, 30):
    L.set(x, 26, 'C')
L.set(46, 9, 'N')
L.fill(29, 13, 37, 16, 'C')  # the kitchen island
L.fill(24, 7, 42, 8, 'j')
L.fill(24, 20, 42, 21, 'j')
# The pantry (Soda Bazooka) and its two cupboards (ambush!).
L.room(20, 26, 34, 36, 'w', '.')
L.set(27, 26, 'D')
for y in range(28, 35):
    L.set(20, y, 'L')
    L.set(34, y, 'L')
L.room(21, 36, 26, 40, 'w', '.')
L.room(28, 36, 33, 40, 'w', '.')
L.set(24, 36, 'q')
L.set(30, 36, 'q')
# The dining room (yellow key).
L.room(46, 4, 62, 22, 'W', '.')
L.set(46, 14, 'D')
L.set(58, 4, 'G')
L.fill(49, 8, 59, 18, 'r')
for x in (50, 54):
    L.set(x, 22, 'N')
L.set(62, 12, 'A')
# Secret: a panel in the dining room's east wall.
L.set(62, 18, 'v')
L.room(62, 15, 66, 21, 'W', 'x')
# The mudroom behind the yellow door, and the mouse hole out.
L.set(40, 26, '2')
L.room(36, 26, 50, 36, '#', ',')
L.fill(40, 29, 46, 33, ';')
L.set(43, 36, 'X')

# --- things
L.put(4, 7, '>')
L.puts(',', (5, 5), (6, 5), (7, 5))
L.put(2, 9, 'k')
# Back hall.
L.puts('r', (12, 6), (17, 8))
L.put(16, 5, 'h')
L.put(10, 9, 'F')
L.put(18, 6, 'd')
# Vent.
L.puts(',', (20, 1), (24, 1), (28, 1), (32, 1), (40, 1), (44, 1), (48, 1), (52, 1))
L.puts('r', (30, 1), (50, 1))
L.put(56, 1, '$')
L.put(36, 3, 'O')
# Kitchen.
L.puts('i', (24, 12), (42, 12), (26, 18), (40, 22))
L.puts('r', (33, 10), (33, 19), (44, 17), (22, 24))
L.puts('m', (44, 6), (23, 6))
L.put(38, 18, '!')
L.put(30, 22, '@')
L.puts('h', (28, 11), (38, 11))
L.put(44, 24, 'k')
L.put(22, 15, 'o')
L.put(44, 14, 'o')
L.puts('s', (25, 10), (41, 18))
L.put(33, 20, 'd')
L.put(21, 25, '+')
L.put(45, 5, '=')
# Pantry.
L.put(27, 32, '4')
L.puts('n', (23, 33), (31, 33))
L.put(27, 29, 'N')
L.puts('d', (22, 28), (32, 28))
L.put(27, 35, 'p')
L.puts('X', (21, 35), (33, 35))
L.puts('m', (23, 38), (31, 38))
L.puts('r', (25, 38), (29, 38))
L.put(22, 39, '$')
L.put(32, 39, '$')
# Dining room.
L.put(54, 13, 'T')
L.puts('h', (51, 13), (57, 13), (54, 10), (54, 16))
L.put(48, 6, 'F')
L.put(60, 6, 'F')
L.put(54, 7, 'u')
L.put(60, 20, 'y')
L.put(58, 19, 'c')
L.puts('i', (50, 18), (59, 9))
L.puts('m', (48, 20), (56, 6))
L.put(52, 8, '&')
L.put(48, 16, 'S')
L.put(61, 14, 'd')
# Dining room secret.
L.put(64, 17, 'D')
L.put(64, 19, 'p')
# Mudroom.
L.puts('i', (38, 30), (48, 30))
L.puts('r', (43, 28), (37, 34), (49, 34))
L.put(43, 32, 'c')
L.put(47, 28, '!')
L.put(39, 27, 'L')
L.puts('P', (48, 33), (45, 27))
L.put(43, 34, 'd')
# Marbles for the slingshot.
L.puts('M', (12, 8), (30, 8), (41, 31))
L.put(60, 7, 'J')

legend = {
    'u': {'door': 'vent-wall', 'secret': True},
    'v': {'door': 'wainscot', 'secret': True},
    'q': {'door': 'wood-panel', 'jamb': 'door-jamb', 'lock': 'remote', 'tag': 'cupboards'},
    'z': {'base': 'm', 'secret': True},
    'x': {'base': '.', 'light': 220, 'secret': True},
}
triggers = [
    {'on': 'start', 'do': [{'action': 'message', 'text': 'UP THE STAIRS AND INTO THE KITCHEN. IT SMELLS LIKE PIZZA UP HERE!'}]},
    {
        'on': 'pickup',
        'thing': 'pickup-soda-bazooka',
        'do': [{'action': 'openDoors', 'tag': 'cupboards'}, {'action': 'message', 'text': 'THE CUPBOARDS BURST OPEN! RATS!'}],
    },
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e1m2.js'),
    [
        'E1M2: THE KITCHEN. Up from the basement into a kitchen full of crumbs,',
        'cheese and rats.',
        '',
        'Route: the broom closet -> the back hall -> the kitchen -> the pantry (the',
        'Soda Bazooka; taking it opens the cupboards) -> the dining room (yellow',
        'key) -> the yellow door -> the mudroom and the mouse hole.',
        'The vent over the kitchen joins the back hall to the dining room.',
        'Secrets: a side duct off the vent (the Golden Cheese) and a panel in the',
        'dining room\'s east wall (Bubble Wrap).',
    ],
    {
        'id': "'e1m2'",
        'mapLabel': "'E1M2'",
        'name': "'THE KITCHEN'",
        'music': "'house'",
        'sky': "'sky-day'",
        'par': 120,
        'legend': js(legend),
        'triggers': js(triggers),
    },
)
print('ok')
