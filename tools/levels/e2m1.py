import os
from lvl import Level, js, ROOT
from warehouse import legend, THINGS

L = Level(60, 46)

# --- The warehouse (built first, so the yard's walls don't cover its corrugated outer wall).
# The loading dock: a long hall behind four roll-up doors.
L.room(23, 0, 37, 30, '#', '.')
L.fill(23, 0, 37, 0, 'B')  # the outer walls are corrugated steel
L.fill(23, 0, 23, 30, 'B')
for y in (5, 11, 17, 23):
    L.set(23, y, 'L')
L.fill(26, 1, 26, 29, '_')  # the lane line along the dock edge
for y0 in (3, 13, 23):
    L.fill(29, y0, 31, y0 + 2, ':')
# The receiving office (the blue key is on the desk).
L.room(37, 0, 47, 9, '#', 'k')
L.set(37, 5, 'D')
L.fill(41, 3, 43, 5, 'j')
# The racks, behind the blue door: four rows of shelves and their aisles.
L.room(37, 9, 59, 31, '#', '-')
L.set(37, 20, '1')
for y in (13, 17, 21, 25):
    L.fill(41, y, 55, y, 'S')
for y in (11, 15, 19, 23, 28):
    L.fill(46, y, 49, y, ':')
# The shipping hall behind the yellow door, with the mouse hole.
L.room(37, 31, 59, 45, '#', '.')
L.set(48, 31, '2')
L.fill(42, 35, 44, 37, 'C')
L.fill(51, 39, 53, 41, 'C')
L.fill(47, 36, 49, 38, ':')
L.set(59, 38, 'X')
# The break room, off the dock.
L.room(23, 30, 37, 45, '#', 'k')
L.set(30, 30, 'D')
L.fill(28, 35, 32, 39, 'j')

# --- Outside: the truck yard, fenced in brick.
L.room(0, 0, 23, 32, 'R', ',')
# The delivery truck's trailer, its back open to the yard (start).
L.fill(3, 2, 9, 17, 'B')
L.fill(4, 3, 8, 17, 't')
# Secret: a fort of crates in the corner of the yard; one crate slides away.
L.fill(1, 25, 7, 31, 'C')
L.fill(2, 26, 6, 30, 'x')
L.set(7, 28, 'q')
# A vent from the yard to the break room...
L.set(12, 32, 'G')
L.hall(12, 33, 12, 37, 'V', 'n')
L.hall(12, 37, 22, 37, 'V', 'n')
L.set(23, 37, 'G')
# ...with a loose panel at its corner, and a hidden duct full of goodies.
L.room(8, 38, 16, 44, 'V', 'z')
L.set(12, 38, 'y')
L.set(16, 41, 'Y')

# --- things
# The trailer: boxes, and the box you woke up in.
L.put(6, 4, 'v')
L.puts('X', (4, 3), (5, 3), (8, 3), (8, 4), (4, 9), (8, 12), (4, 14))
L.put(7, 8, '1')
L.puts(',', (6, 10), (6, 12), (6, 14))
# The yard.
L.put(16, 4, '2')
L.puts('M', (18, 8), (14, 20), (20, 28), (17, 5))
L.puts('r', (12, 6), (16, 12), (18, 22))
L.puts('i', (20, 3), (14, 28))
L.put(19, 15, '$')
L.put(8, 22, '!')
L.puts('C', (11, 18), (13, 18), (15, 18), (20, 10), (20, 14))
L.puts('o', (17, 26), (2, 20))
L.puts('P', (12, 2), (15, 2))
L.put(21, 30, 'k')
L.put(2, 22, ';')
L.put(10, 20, '+')
L.put(19, 30, '"')
# The dock.
L.put(33, 8, 'F')
L.puts('P', (25, 2), (27, 2), (35, 2), (35, 14), (25, 27), (35, 27))
L.puts('X', (34, 20), (35, 21))
L.puts('r', (28, 8), (32, 18))
L.puts('i', (34, 4), (33, 26))
L.put(35, 10, 'm')
L.put(30, 28, 'c')
L.put(25, 15, '@')
L.put(34, 24, '&')
L.put(24, 28, '`')
L.puts('M', (27, 10), (31, 20))
L.put(35, 17, 'J')
L.put(25, 12, 'd')
L.put(28, 16, 'o')
# The office.
L.put(43, 3, 'T')
L.put(42, 5, 'h')
L.put(45, 2, 'b')
L.put(39, 7, 'm')
L.put(44, 7, 'r')
L.puts(';', (40, 2), (41, 2))
L.put(46, 8, 'k')
L.put(39, 2, '"')
# The racks.
L.put(39, 29, '3')
L.puts('s', (40, 11), (57, 15), (57, 23), (44, 27))
L.put(57, 29, 'S')
L.put(57, 11, 'y')
L.puts('r', (44, 11), (52, 15), (52, 23), (48, 27))
L.put(57, 19, 'i')
L.puts('m', (56, 11), (40, 23))
L.put(55, 28, 'c')
L.put(50, 19, 'j')
L.put(57, 27, 'G')
L.put(39, 25, '%')
L.put(39, 10, 'p')
L.put(57, 25, 'd')
L.put(49, 29, 'a')
# The shipping hall.
L.put(55, 42, 'G')
L.put(40, 42, 'c')
L.puts('i', (50, 34), (56, 33))
L.put(52, 37, 'r')
L.put(40, 34, '$')
L.puts('P', (39, 44), (57, 44), (57, 32))
L.put(46, 43, 'p')
L.puts('s', (48, 33), (39, 38))
L.put(54, 36, 'o')
# The break room.
L.put(30, 37, 'T')
L.puts('h', (28, 37), (32, 37))
L.put(25, 43, 'p')
L.put(35, 32, 'd')
L.puts(',', (34, 43), (35, 43))
L.put(26, 34, 'r')
L.put(25, 40, 'm')
L.put(30, 35, 'u')
L.put(36, 44, 'k')
L.put(24, 44, 'e')
# The vents and the secrets.
L.puts(',', (12, 34), (12, 36), (16, 37), (20, 37))
L.put(12, 41, 'A')
L.put(10, 40, 'S')
L.put(14, 40, 'J')
L.puts(';', (10, 43), (14, 43))
L.put(4, 28, '4')
L.put(3, 27, 'N')
L.put(5, 29, 'n')

level_legend = legend(
    q={'door': 'crates', 'secret': True},
    y={'door': 'vent-wall', 'secret': True},
    x={'base': '-', 'light': 176, 'secret': True},
    z={'base': 'm', 'secret': True},
)
triggers = [
    {'on': 'start', 'do': [
        {'action': 'message', 'text': 'YOU FELL ASLEEP IN A CARDBOARD BOX...'},
        {'action': 'message', 'text': '...AND WOKE UP IN A TRUCK! WHERE ARE WE?'},
    ]},
    {'on': 'pickup', 'thing': 'key-yellow', 'do': [{'action': 'message', 'text': 'THE YELLOW KEY! THE SHIPPING HALL IS PAST THE RACKS.'}]},
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e2m1.js'),
    [
        'E2M1: THE LOADING DOCK. You fell asleep in a cardboard box and woke up in',
        'the back of a delivery truck, parked at a big warehouse.',
        '',
        'Route: out of the truck -> the yard (Slingshot) -> a dock door -> the',
        'receiving office (blue key) -> the blue door -> the racks (Rubber Band',
        'Gatling, yellow key at the end of the top aisle) -> the yellow door -> the',
        'shipping hall -> the mouse hole. The break room is off the dock; a vent',
        'joins it to the yard.',
        'Secrets: a crate that slides away in the fort in the yard (the Soda',
        'Bazooka) and a loose panel at the corner of the vent (a duct full of',
        'goodies).',
    ],
    {
        'id': "'e2m1'",
        'mapLabel': "'E2M1'",
        'name': "'THE LOADING DOCK'",
        'music': "'warehouse'",
        'sky': "'sky-day'",
        'par': 120,
        'legend': js(level_legend),
        'thingLegend': js(THINGS),
        'triggers': js(triggers),
    },
)
print('ok')
