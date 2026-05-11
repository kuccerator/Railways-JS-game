/* A PÁLYÁK:
            - Üres mező = 1
            - Híd mező:
                - Függőleges = 21
                - Vízszintes = 22
            - Hegy mező:
                - Bal felső sarok = 31
                - Bal alsó sarok = 32
                - Jobb felső sarok = 33
                - Jobb alsó sarok = 34
            - Oázis mező = 4 */
const easy_maps = [
    {id: 1, layout: [[1, 32, 1, 1, 4], [1, 1, 1, 21, 4], [21, 1, 31, 1, 1], [1, 1, 1, 4, 1], [1, 1, 33, 1, 1]]},
    {id: 2, layout: [[4, 1, 22, 1, 1], [1, 31, 1, 1, 31], [21, 4, 33, 1, 1], [1, 1, 1, 4, 1], [1, 1, 1, 1, 1]]},
    {id: 3, layout: [[1, 1, 22, 1, 1], [1, 1, 1, 1, 21], [1, 31, 21, 1, 1], [1, 4, 1, 1, 1], [1, 22, 1, 1, 31]]},
    {id: 4, layout: [[1, 1, 1, 22, 1], [1, 1, 1, 1, 1], [21, 1, 32, 1, 32], [1, 1, 1, 1, 1], [1, 1, 4, 33, 1]]},
    {id: 5, layout: [[1, 1, 22, 1, 1], [1, 34, 1, 1, 1], [21, 1, 1, 33, 1], [1, 1, 21, 4, 1], [1, 31, 1, 1, 1]]}
]
const hard_maps = [
    {id: 1, layout: [[1, 32, 4, 4, 1, 22, 1], [21, 1, 1, 1, 1, 1, 1], [1, 1, 21, 1, 1, 1, 1], [1, 1, 1, 33, 1, 1, 1], [33, 1, 32, 1, 22, 1, 4], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 22, 1, 1, 1]]},
    {id: 2, layout: [[1, 1, 4, 1, 1, 1, 1], [21, 1, 22, 1, 1, 31, 1], [1, 1, 22, 1, 1, 1, 21], [34, 1, 1, 1, 1, 1, 1], [1, 4, 1, 22, 1, 1, 1], [1, 34, 1, 1, 1, 1, 1], [1, 1, 4, 1, 1, 1, 1]]},
    {id: 3, layout: [[1, 1, 22, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 21], [4, 1, 33, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 4, 33, 1, 22, 1, 1], [21, 1, 1, 1, 1, 32, 1], [1, 1, 4, 33, 1, 1, 1]]},
    {id: 4, layout: [[1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 21, 1, 31, 1], [1, 1, 33, 1, 1, 1, 1], [1, 22, 1, 4, 1, 22, 1], [1, 1, 31, 1, 32, 1, 1], [21, 1, 1, 1, 1, 33, 1], [1, 1, 1, 1, 1, 1, 1]]},
    {id: 5, layout: [[1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 34, 1], [1, 22, 22, 1, 32, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 34, 1, 4, 1, 1], [1, 31, 1, 21, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]]}
]

// Sínek elhelyezése:
const imageGroups = {
    // Üres cella:
    'images/cells/empty.png': 'images/cells/straight_rail1.png',
    'images/cells/straight_rail1.png': 'images/cells/straight_rail2.png',
    'images/cells/straight_rail2.png': 'images/cells/curve_rail1.png',
    'images/cells/curve_rail1.png': 'images/cells/curve_rail2.png',
    'images/cells/curve_rail2.png': 'images/cells/curve_rail4.png',
    'images/cells/curve_rail4.png': 'images/cells/curve_rail3.png',
    'images/cells/curve_rail3.png': 'images/cells/empty.png',
    // Függőleges híd cella:
    'images/cells/bridge1.png': 'images/cells/bridge_rail1.png',
    'images/cells/bridge_rail1.png': 'images/cells/bridge1.png',
    // Vízszintes híd cella:
    'images/cells/bridge2.png': 'images/cells/bridge_rail2.png',
    'images/cells/bridge_rail2.png': 'images/cells/bridge2.png',
    // Hegy 1 cella:
    'images/cells/mountain1.png': 'images/cells/mountain_rail1.png',
    'images/cells/mountain_rail1.png': 'images/cells/mountain1.png',
    // Hegy 2 cella:
    'images/cells/mountain2.png': 'images/cells/mountain_rail2.png',
    'images/cells/mountain_rail2.png': 'images/cells/mountain2.png',
    // Hegy 3 cella:
    'images/cells/mountain3.png': 'images/cells/mountain_rail3.png',
    'images/cells/mountain_rail3.png': 'images/cells/mountain3.png',
    // Hegy 4 cella:
    'images/cells/mountain4.png': 'images/cells/mountain_rail4.png',
    'images/cells/mountain_rail4.png': 'images/cells/mountain4.png',
};

// Kapcsolódási pontok.
const connectionRules = {
    'images/cells/bridge_rail1.png': ['up', 'down'],
    'images/cells/bridge_rail2.png': ['right', 'left'],
    'images/cells/straight_rail1.png': ['up', 'down'],
    'images/cells/straight_rail2.png': ['right', 'left'],
    'images/cells/curve_rail1.png': ['up', 'left'],
    'images/cells/curve_rail2.png': ['down', 'left'],
    'images/cells/curve_rail3.png': ['up', 'right'],
    'images/cells/curve_rail4.png': ['down', 'right'],
    'images/cells/mountain_rail1.png': ['up', 'left'],
    'images/cells/mountain_rail2.png': ['down', 'left'],
    'images/cells/mountain_rail3.png': ['up', 'right'],
    'images/cells/mountain_rail4.png': ['down', 'right']
};
