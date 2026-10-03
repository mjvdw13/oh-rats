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
#         shared vents: V Y G n m
# Things: P a pallet of boxes   F a forklift   C a traffic cone, plus every
#         shared thing glyph except the house furniture these replace.

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
}

THINGS = {
    'P': 'pallet',
    'F': 'forklift',
    'C': 'traffic-cone',
}


def legend(**extra):
    """The warehouse legend plus a level's own glyphs (secret doors and so on)."""
    return {**LEGEND, **extra}
