const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => ({
        winning: x.split(': ')[1].split(' | ')[0].split(' ').map(x => Number(x)),
        your: x.split(': ')[1].split(' | ')[1].split(' ').map(x => Number(x))
    }));
}

// --------------------------------------------

function score({winning, your}) {
    let points = 0;
        
    for (let i = 0; i < your.length; i++) {
        const x = your[i];
        if (winning.find(w => w === x)) {
            points++
        }
    }
    return points;
}

function run(data) {

    // U.log('Hello');

    let cards = R.clone(data);
    let nums = {};

    cards.forEach((c, i) => nums[i] = 1);

    for (let i = 0; i < cards.length; i++) {
        const points = score(cards[i]);

        for (let j = i + 1; j <= i + points; j++) {
            nums[j] += nums[i];
        }
    }

    U.log(nums);

    return R.values(nums).reduce((p, c) => p + c, 0);
}

