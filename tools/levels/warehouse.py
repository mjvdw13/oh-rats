# The warehouse levels (episode 2) share this legend. Every glyph in the shared
# legend (src/content/levels/legend.js) is taken by the house, so these
# override some house glyphs, but only in the levels that use them.
#
# Tiles:  B corrugated steel (outer walls)   # cinder block   S pallet racks
#         C stacked crates   R brick (the yard fence)   X the mouse-hole exit
#         L a roll-up dock door   D a steel door   1 2 3 blue/yellow/red doors
#         . concrete under the roof   : under a skylight   - dim (the racks)
#         _ concrete with a yellow lane line   , asphalt (outside)
#         t a truck's wooden floor   k j checker (break room, office), and the
#         shared vents: V Y G n m, and the basement's O o H I
#   The freezer:      F freezer wall   W shelves of cheese   J a freezer door
#                     i ice   l ice under a light
#   The sorting room: M the SORT-O-MATIC   U a box chute
#                     ^ v < > conveyor belts running north/south/east/west
#   The lumber yard:  K a wall of logs   A barn boards
#                     s sawdust (outside)   h sawdust (in the shed)
# Things: P a pallet of boxes   F a forklift   C a traffic cone   L a log pile
#         K the Lumberjack, plus every shared thing glyph except the house
#         furniture these replace.

BELT = 2.5  # how fast the conveyor belts carry you (tiles per second)

LEGEND = {
    'B': {'wall': 'corrugated'},
    '#': {'wall': 'cinderblock'},
    'S': {'wall': 'rack-boxes'},
    'C': {'wall': 'crates'},
    'X': {'wall': 'mouse-hole-block', 'use': 'exit', 'switchTo': 'mouse-hole-block-on'},
    'L': {'door': 'dock-door', 'jamb': 'concrete-stripe'},
    'D': {'door': 'door-metal', 'jamb': 'door-jamb'},
    '1': {'door': 'door-metal-blue', 'jamb': 'door-jamb', 'lock': 'blue'},
    '2': {'door': 'door-metal-yellow', 'jamb': 'door-jamb', 'lock': 'yellow'},
    '3': {'door': 'door-metal-red', 'jamb': 'door-jamb', 'lock': 'red'},
    '.': {'floor': 'warehouse-floor', 'ceiling': 'roof-truss', 'light': 192},
    ':': {'floor': 'warehouse-floor', 'ceiling': 'skylight', 'light': 228},
    '-': {'floor': 'warehouse-floor', 'ceiling': 'roof-truss', 'light': 160},
    '_': {'floor': 'floor-stripe', 'ceiling': 'roof-truss', 'light': 192},
    ',': {'floor': 'asphalt', 'ceiling': 'sky', 'light': 232},
    't': {'floor': 'wood-floor', 'ceiling': 'roof-truss', 'light': 168},
    # The freezer.
    'F': {'wall': 'freezer-wall'},
    'W': {'wall': 'cheese-shelf'},
    'J': {'door': 'freezer-door', 'jamb': 'freezer-wall'},
    'i': {'floor': 'ice-floor', 'ceiling': 'freezer-ceiling', 'light': 176},
    'l': {'floor': 'ice-floor', 'ceiling': 'freezer-light', 'light': 220},
    # The sorting room.
    'M': {'wall': 'machine'},
    'U': {'wall': 'chute'},
    '^': {'floor': 'conveyor-n', 'ceiling': 'roof-truss', 'light': 192, 'push': [0, -BELT]},
    'v': {'floor': 'conveyor-s', 'ceiling': 'roof-truss', 'light': 192, 'push': [0, BELT]},
    '>': {'floor': 'conveyor-e', 'ceiling': 'roof-truss', 'light': 192, 'push': [BELT, 0]},
    '<': {'floor': 'conveyor-w', 'ceiling': 'roof-truss', 'light': 192, 'push': [-BELT, 0]},
    # The lumber yard.
    'K': {'wall': 'log-wall'},
    'A': {'wall': 'barn-wood'},
    's': {'floor': 'sawdust', 'ceiling': 'sky', 'light': 232},
    'h': {'floor': 'sawdust', 'ceiling': 'roof-truss', 'light': 176},
}

THINGS = {
    'P': 'pallet',
    'F': 'forklift',
    'C': 'traffic-cone',
    'L': 'log-pile',
    'K': 'lumberjack',
}


def legend(**extra):
    """The warehouse legend plus a level's own glyphs (secret doors and so on)."""
    return {**LEGEND, **extra}
