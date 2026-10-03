import os
from lvl import Level, js, ROOT

L = Level(46, 40)

# The attic stairs (start), a vent up into the attic, and the big attic itself.
L.room(18, 30, 28, 38, 'w', 't')
L.set(23, 30, 'E')
L.room(4, 4, 42, 30, 'w', 't')
L.fill(14, 10, 32, 24, 'a')
for x in (16, 30):
    L.set(x, 4, 'N')
L.set(23, 4, 'A')
# Secret: a vent behind the attic's west wall.
L.set(4, 17, 'G')
L.hall(1, 8, 1, 26, 'V', 'z')
L.hall(2, 17, 3, 17, 'V', 'z')

L.put(23, 35, '^')
L.puts('d', (20, 33), (26, 33))
L.put(23, 32, 'a')
L.put(23, 12, 'K')
L.puts('X', (8, 8), (9, 8), (38, 8), (8, 26), (38, 26), (37, 26))
L.puts('o', (12, 14), (34, 14), (12, 22), (34, 22))
L.puts('n', (6, 6), (40, 6), (6, 28), (40, 28))
L.puts('N', (10, 18), (36, 18))
L.puts('p', (6, 18), (40, 12))
L.put(23, 27, '5')
L.puts('Q', (21, 27), (25, 27))
L.puts('r', (10, 10), (36, 10), (10, 25), (36, 25))
L.puts('$', (16, 8), (30, 8))
L.put(1, 10, 'O')
L.put(1, 24, 'D')
L.puts(';', (1, 13), (1, 15), (1, 19), (1, 21))
# A last top-up for the new weapons.
L.put(21, 29, '*')
L.put(25, 29, 'Z')
L.put(8, 6, 'J')

legend = {
    'a': {'base': 't', 'tag': 'arena'},
    'z': {'base': 'm', 'secret': True},
}
triggers = [
    {'on': 'start', 'do': [{'action': 'message', 'text': 'THE ATTIC. SOMEONE IS UP HERE, SETTING MOUSETRAPS...'}]},
    {'on': 'enter', 'tag': 'arena', 'do': [{'action': 'music', 'id': 'boss'}, {'action': 'message', 'text': 'DAD: WHO LET A RAT IN MY ATTIC?!'}]},
    {'on': 'killed', 'thing': 'dad', 'do': [{'action': 'finale'}]},
]
L.write(
    os.path.join(ROOT, 'src/content/levels', 'e1m5.js'),
    [
        'E1M5: THE ATTIC. Dad has come up to set mousetraps. Beat him and the house',
        'is yours (it ends the episode).',
        '',
        'Route: up the attic stairs, grab the Mega Microwave by the door, then',
        'take on Dad among the boxes. Soda bottles explode: use them!',
        'Secret: a vent behind the west wall.',
    ],
    {
        'id': "'e1m5'",
        'mapLabel': "'E1M5'",
        'name': "'THE ATTIC'",
        'music': "'upstairs'",
        'sky': "'sky-day'",
        'par': 180,
        'legend': js(legend),
        'triggers': js(triggers),
    },
)
print('ok')
