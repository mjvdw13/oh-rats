import os
from lvl import Level, js, ROOT

L = Level(58, 52)

# The front hall (foyer) along the top, with the front door.
L.room(8, 1, 36, 10, '#', '.')
L.fill(18, 3, 26, 7, ':')
L.set(22, 1, 'h')
L.set(17, 1, 'N')
L.set(27, 1, 'N')
# The staircase up, behind the red door, with the mouse hole.
L.room(36, 1, 50, 10, 'w', '.')
L.set(36, 5, '3')
L.set(50, 5, 'X')
L.fill(42, 3, 48, 8, 't')
# The living room.
L.room(8, 10, 36, 38, 'B', '.')
L.set(12, 10, 'D')
L.set(32, 10, 'D')
for x in (19, 20, 24, 25):
    L.set(x, 10, 'R')
for x in (21, 22, 23):
    L.set(x, 10, 'f')
L.fill(13, 16, 31, 32, 'r')
L.fill(21, 12, 23, 13, ':')
L.set(36, 16, 'a')
for x in (14, 30):
    L.set(x, 38, 'N')
# Where Pack Rats come down the chimney.
L.set(21, 12, 'c')
L.set(23, 12, 'c')
# The start: a nook by the kitchen doorway.
L.room(1, 18, 8, 26, '#', '.')
L.set(8, 22, 'D')
# The den behind the blue door: bookshelves and the red key.
L.room(36, 14, 56, 30, 'w', ',')
L.set(36, 22, '1')
for x in range(38, 55):
    if x != 46:
        L.set(x, 14, 'L')
L.fill(42, 19, 50, 25, ';')
# Secret: one of the bookshelves swings open.
L.set(46, 14, 'v')
L.room(42, 10, 50, 14, 'w', 'x')
# The hall to the bathroom and the coat closet.
L.set(22, 38, 'D')
L.room(14, 38, 40, 42, '#', '.')
L.room(28, 42, 40, 50, 'b', 'e')
L.set(34, 42, 'D')
L.room(14, 42, 24, 50, '#', ',')
L.set(19, 42, 'D')
# A vent from the hall to a hidden duct chamber.
L.set(14, 40, 'G')
L.hall(5, 40, 13, 40, 'V', 'n')
L.hall(5, 36, 5, 39, 'V', 'n')
L.room(1, 29, 9, 35, 'V', 'z')
L.set(5, 35, 'z')
L.set(1, 32, 'Y')

# --- things
L.put(3, 22, '>')
L.puts(',', (5, 21), (5, 23))
L.put(2, 19, 'F')
# Living room: the big fight.
L.put(22, 17, 'H')
L.put(22, 28, 'V')
L.puts('H', (15, 22), (29, 22))
L.puts('l', (10, 12), (34, 12), (10, 36), (34, 36))
L.puts('F', (10, 24), (34, 24))
L.put(18, 34, 'Y')
L.puts('i', (12, 15), (32, 15), (14, 31), (30, 31))
L.puts('m', (18, 20), (26, 20), (22, 33))
L.puts('r', (16, 26), (28, 26), (11, 29), (33, 29), (22, 24))
L.put(22, 21, 'c')
L.puts('!', (12, 20), (32, 27))
L.put(26, 14, '@')
L.put(10, 33, '$')
L.puts('s', (12, 26), (32, 20))
L.put(22, 25, 'S')
L.puts('d', (11, 13), (33, 35))
L.put(9, 37, '+')
L.puts(';', (17, 30), (27, 30))
L.put(35, 11, 'o')
L.put(9, 11, 'o')
# Foyer.
L.puts('i', (14, 4), (30, 7))
L.puts('m', (22, 5),)
L.puts('r', (11, 8), (34, 3))
L.put(26, 9, '&')
L.puts('F', (10, 3), (34, 9))
L.put(19, 9, 'k')
L.put(33, 5, 'N')
L.put(12, 3, 'd')
# Staircase.
L.puts('i', (40, 3), (44, 8))
L.put(47, 5, 'G')
L.put(39, 8, 'r')
L.put(48, 3, 'p')
# Den.
L.put(54, 28, 'R')
L.puts('H', (40, 22), (52, 18))
L.put(46, 22, 'T')
L.puts('l', (38, 16), (54, 16))
L.puts('i', (44, 17), (50, 27))
L.puts('m', (54, 21), (40, 28))
L.puts('j', (48, 24),)
L.put(38, 26, 'c')
L.put(53, 25, '`')
L.put(44, 27, '!')
L.puts('A', (55, 15),)
L.puts('q', (38, 18), (51, 29))
L.put(46, 20, 'n')
# Den secret.
L.put(46, 12, 'D')
L.puts('q', (44, 11), (48, 11))
# Hall and coat closet.
L.puts('r', (18, 40), (30, 39), (38, 41))
L.put(26, 41, 'i')
L.put(16, 39, '$')
L.puts('P', (17, 46), (21, 48))
L.put(19, 47, 'p')
L.puts('r', (16, 44), (22, 45))
L.put(23, 49, 'B')
# Bathroom: the blue key.
L.put(34, 48, 'b')
L.puts('m', (30, 46), (38, 45))
L.put(31, 49, 'i')
L.put(37, 49, '~')
L.put(35, 44, 'd')
# Vent chamber.
L.puts(',', (5, 38), (5, 37), (9, 40), (11, 40))
L.put(5, 32, 'O')
L.puts(';', (3, 31), (7, 31), (3, 33), (7, 33))
L.put(5, 30, 'n')

legend = {
    'h': {'wall': 'door-wood'},  # the front door (it doesn't open: you're a rat, use the vents)
    'c': {'base': 'r', 'tag': 'chimney'},
    'v': {'door': 'bookshelf', 'secret': True},
    'z': {'base': 'm', 'secret': True},
    'x': {'base': ',', 'light': 210, 'secret': True},
}
triggers = [
    {'on': 'start', 'do': [{'action': 'message', 'text': 'THE LIVING ROOM. SO MANY COUCHES. SO MANY RATS.'}]},
    {
        'on': 'pickup',
        'thing': 'key-red',
        'do': [
            {'action': 'spawn', 'thing': 'pack-rat', 'tag': 'chimney'},
            {'action': 'message', 'text': 'SOMETHING BIG JUST CAME DOWN THE CHIMNEY!'},
        ],
    },
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e1m3.js'),
    [
        'E1M3: THE LIVING ROOM. Couches, a fireplace, a big rug and a lot of rats.',
        '',
        'Route: the nook -> the living room -> the hall -> the bathroom (blue key)',
        '-> the blue door -> the den (red key; taking it sends Pack Rats down the',
        'chimney) -> the foyer -> the red door -> the stairs and the mouse hole.',
        'Secrets: the vent from the hall (a duct chamber with the Golden Cheese)',
        'and a bookshelf in the den that swings open.',
    ],
    {
        'id': "'e1m3'",
        'mapLabel': "'E1M3'",
        'name': "'THE LIVING ROOM'",
        'music': "'house'",
        'sky': "'sky-day'",
        'par': 150,
        'legend': js(legend),
        'triggers': js(triggers),
    },
)
print('ok')
