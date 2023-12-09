const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(' ').map(x => Number(x)));
}

// --------------------------------------------

function derivative(list) {
    let res = [];

    for (let i = 0; i < list.length - 1; i++) {
        const dif = list[i + 1] - list[i];

        res.push(dif);
    }

    return res;
}

function allZero(list) {
    return list.find(x => x !== 0) === undefined;
}

function derivativeDepth(list) {
    let depth = 0;
    
    while (!allZero(list)) {
        list = derivative(list);
        depth++;
    }

    return depth;
}

function extrapolate(list) {
    let levels = [list];

    while (!allZero(list)) {
        list = derivative(list);
        levels.push(list);
    }

    U.log(levels);

    levels[levels.length - 1].push(0);

    for (let i = levels.length - 2; i >=0; i--) {
        const x = R.last(levels[i]) + R.last(levels[i + 1]);
        
        levels[i].push(x);    
    }

    // U.log(levels);

    return R.last(levels[0]);
}

function run(data) {

    // U.log('Hello');

    const result = data.map(x => extrapolate(x));

    return result.reduce((p, c) => p + c, 0);
}

