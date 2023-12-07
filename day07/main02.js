const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => {
        return {
            hand: x.split(' ')[0].split(''),
            bid: Number(x.split(' ')[1])
        };
    });
}

// --------------------------------------------

function bestVariant(hand) {

    if (!hand.find(x => x === 'J')) return hand;

    const x = hand.findIndex(x => x === 'J');

    if (x !== undefined) {
        const nonJockers = R.uniq(hand.filter(x => x !== 'J'));

        if (nonJockers.length === 0) return R.repeat('A', 5);

        const variants = nonJockers.map(nj => {
            let newHand = R.clone(hand);
            newHand[x] = nj;
            return bestVariant(newHand);
        });

        // U.log(variants);

        let best = variants[0];

        for (let i = 1; i < variants.length; i++) {
            if (handType(variants[i]) > handType(best)) {
                best = variants[i];
            }
        }

        // U.log(best);

        return best;
    }
}

function handType(hand) {
    const g = R.groupBy(x => x, hand)
    const g2 = R.mapObjIndexed(x => x.length, g);
        
    const v = R.values(g2).sort((x, y) => y - x);

    // U.log(hand, v);

    if (v[0] === 5) return 5;
    if (v[0] === 4) return 4;
    if (v[0] === 3 && v[1] === 2) return 3.5;
    if (v[0] === 3) return 3;
    if (v[0] === 2 && v[1] === 2) return 2.5;
    if (v[0] === 2) return 2;
    
    return 1;

}

function compareHands(h1, h2) {

    const scores = {
        'A': 14,
        'K': 13,
        'Q': 12,
        'J': 1,
        'T': 10,
        '9': 9,
        '8': 8,
        '7': 7,
        '6': 6,
        '5': 5,
        '4': 4,
        '3': 3,
        '2': 2
    };

    const bv1 = bestVariant(h1.hand);
    const bv2 = bestVariant(h2.hand);

    const t1 = handType(bv1);
    const t2 = handType(bv2);

    if (t1 !== t2) {
        return t1 - t2;
    }

    for (let i = 0; i < h1.hand.length; i++) {
        const s1 = scores[h1.hand[i]];
        const s2 = scores[h2.hand[i]];

        if (s1 !== s2) {
            return s1 - s2;
        }
    }

    return 0;
}

function run(data) {

    const t = data.map(x => bestVariant(x.hand));

    U.log(t);

    // return;

    // U.log('Hello');

    const sorted = data.sort(compareHands);

    U.log(sorted);


    U.log(sorted.map((x, i) => [i + 1, x.bid]));


    return sorted.reduce((p, c, i) => p + (i + 1) * c.bid, 0);
}

