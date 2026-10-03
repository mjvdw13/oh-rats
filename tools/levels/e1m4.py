import os
from lvl import Level, js, ROOT

L = Level(58, 47)

# North side of the hall: a pink bedroom, the playroom (THE FLOOR IS LAVA)
# and a second kid's bedroom.
L.room(6, 6, 20, 20, 'P', ',')
L.set(6, 10, 'N')
L.set(6, 16, 'N')
L.room(20, 2, 40, 20, 'Z', 'p')
L.room(40, 6, 54, 20, 'P', ',')
L.set(44, 6, 'N')
L.set(50, 6, 'N')
# The playroom: a lava moat around a toy-block island (the yellow key), lava
# puddles in the corners, and stepping stones in from the south.
L.fill(25, 7, 35, 15, '~')
L.fill(28, 10, 32, 12, 'p')
L.set(30, 13, 'p')
L.set(30, 15, 'p')
for x0, y0 in ((22, 4), (37, 4), (22, 17), (37, 17)):
    L.fill(x0, y0, x0 + 1, y0 + 1, '~')
# Toy boxes in the top corners (rats burst out of them).
L.set(21, 3, 'u')
L.set(39, 3, 'u')
# Secret: a closet behind the pink bedroom's north wall.
L.set(10, 6, 'q')
L.room(6, 1, 14, 6, 'P', 'x')
# The upstairs hall.
L.room(6, 20, 54, 24, '#', ',')
for x in range(9, 53, 6):
    L.set(x, 22, ';')
L.set(13, 20, 'D')
L.set(30, 20, '1')
L.set(47, 20, 'D')
# South side: the bathroom, the linen closet, the top of the stairs (start)
# and Mom and Dad's bedroom behind the yellow door.
L.room(24, 24, 36, 34, '#', '.')
for x in range(27, 34):
    L.set(x, 24, ',')
L.set(30, 34, 'a')
L.room(6, 24, 18, 34, 'b', 'e')
L.set(12, 24, 'D')
L.room(18, 24, 24, 30, '#', ',')
L.set(21, 24, 'Q')
L.room(36, 24, 54, 40, 'W', ',')
L.fill(41, 29, 49, 35, ';')
L.set(45, 24, '2')
L.set(54, 32, 'N')
L.set(40, 40, 'A')
# The attic stairs closet, with the mouse hole.
L.room(42, 40, 50, 45, 'w', 't')
L.set(46, 40, 'E')
L.set(46, 45, 'X')
# Secret: a vent from the bathroom down to a hidden duct chamber.
L.set(6, 30, 'G')
L.hall(3, 30, 5, 30, 'V', 'z')
L.hall(3, 31, 3, 37, 'V', 'z')
L.room(1, 38, 9, 44, 'V', 'z')
L.set(3, 38, 'z')
L.set(9, 41, 'Y')

# --- things
# The top of the stairs.
L.put(30, 32, '^')
L.puts(',', (26, 26), (34, 26))
L.puts('F', (25, 33), (35, 33))
L.put(28, 29, '"')
# The hall.
L.puts('r', (10, 22), (50, 21), (38, 22))
L.puts('i', (20, 21), (42, 23))
L.put(26, 21, '!')
L.put(35, 22, '$')
L.put(8, 21, 'L')
L.put(53, 23, 'F')
L.put(16, 23, 's')
L.put(44, 22, 'd')
# The pink bedroom: the Rubber Band Gatling and the rain boots.
L.put(13, 9, '3')
L.puts('s', (11, 9), (15, 9))
L.put(18, 8, 'w')
L.put(8, 8, 'Y')
L.put(17, 15, 'C')
L.put(9, 18, 'P')
L.put(15, 18, 'z')
L.puts('r', (10, 14), (16, 12))
L.put(13, 16, 'm')
L.put(8, 12, '@')
L.put(18, 18, '=')
# The secret closet.
L.put(8, 3, 'p')
L.puts(';', (10, 3), (12, 3))
L.put(12, 4, 'e')
# The second bedroom: the blue key.
L.put(50, 9, 'b')
L.put(47, 16, '4')
L.puts('n', (52, 8), (42, 12))
L.put(42, 8, 'Y')
L.put(52, 18, 'L')
L.put(45, 14, 'C')
L.put(49, 17, 'z')
L.puts('i', (44, 10), (51, 15))
L.puts('r', (47, 12), (42, 17))
L.put(48, 10, 'c')
L.put(52, 12, 'd')
L.put(45, 18, '&')
# The playroom.
L.put(30, 11, 'y')
L.puts('z', (28, 10), (32, 12))
L.put(30, 18, 'w')
L.puts('j', (23, 15), (37, 15))
L.puts('m', (22, 10), (38, 10))
L.put(30, 5, 'c')
L.puts('r', (26, 18), (34, 18), (22, 13), (38, 13))
L.put(30, 3, '`')
L.put(21, 8, 'S')
L.put(39, 8, 'p')
L.puts('Y', (24, 19), (36, 19))
L.put(35, 4, 'C')
L.put(26, 4, 'P')
# The bathroom.
L.put(9, 26, 'd')
L.put(15, 32, 'p')
L.put(12, 30, '~')
L.put(14, 28, 'm')
L.put(10, 32, 'r')
L.put(16, 26, ',')
L.put(8, 33, '+')
# The vent and the duct chamber.
L.puts(',', (3, 33), (3, 35))
L.put(5, 41, 'O')
L.puts(';', (3, 40), (7, 40), (3, 42), (7, 42))
L.put(5, 43, 'N')
# The linen closet.
L.puts('s', (20, 26), (22, 26))
L.put(21, 28, 'B')
L.put(19, 29, 'P')
# Mom and Dad's bedroom.
L.put(45, 32, 'T')
L.puts('l', (38, 26), (52, 26))
L.puts('r', (40, 30), (50, 30), (44, 37))
L.puts('i', (38, 34), (52, 36))
L.puts('m', (42, 27), (49, 38))
L.put(45, 35, 'c')
L.put(47, 28, 'G')
L.put(39, 38, '%')
L.put(52, 38, 'p')
L.put(38, 29, 'd')
L.put(53, 30, 'n')
L.puts('X', (37, 39), (53, 25))
L.puts('L', (50, 33),)
L.put(41, 37, '$')
# The attic stairs closet.
L.puts(',', (44, 43), (48, 43))
# The blow torch in the linen closet; propane, flares and marbles.
L.put(22, 28, '7')
L.puts('t', (12, 22), (40, 33), (24, 9))
L.puts('E', (51, 28), (8, 15))
L.put(33, 28, 'M')
L.put(43, 15, 'J')

legend = {
    'u': {'base': 'p', 'tag': 'toybox'},
    'q': {'door': 'wallpaper-pink', 'secret': True},
    'x': {'base': ',', 'light': 176, 'secret': True},
    'z': {'base': 'm', 'secret': True},
}
triggers = [
    {'on': 'start', 'do': [{'action': 'message', 'text': 'UPSTAIRS. THE KIDS SAY THE PLAYROOM FLOOR IS LAVA. THEY ARE RIGHT.'}]},
    {'on': 'pickup', 'thing': 'rain-boots', 'do': [{'action': 'message', 'text': 'RAIN BOOTS! NOW YOU CAN WALK ON THE LAVA (FOR A WHILE).'}]},
    {
        'on': 'pickup',
        'thing': 'key-yellow',
        'do': [
            {'action': 'spawn', 'thing': 'ninja-rat', 'tag': 'toybox'},
            {'action': 'message', 'text': 'THE TOY BOXES BURST OPEN! NINJA RATS!'},
        ],
    },
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e1m4.js'),
    [
        'E1M4: UPSTAIRS. The kids\' bedrooms, the bathroom and the playroom, where',
        'the floor really is LAVA.',
        '',
        'Route: the top of the stairs -> the hall -> the east bedroom (blue key) ->',
        'the blue door -> the playroom (yellow key on the island; taking it opens the',
        'toy boxes) -> the yellow door -> Mom and Dad\'s bedroom -> the attic stairs',
        'closet and the mouse hole. Rain boots in the pink bedroom and the playroom.',
        'Secrets: a closet behind the pink bedroom\'s north wall, and the bathroom',
        'vent (a duct chamber with the Golden Cheese).',
    ],
    {
        'id': "'e1m4'",
        'mapLabel': "'E1M4'",
        'name': "'UPSTAIRS'",
        'music': "'upstairs'",
        'sky': "'sky-day'",
        'par': 150,
        'legend': js(legend),
        'triggers': js(triggers),
    },
)
print('ok')
