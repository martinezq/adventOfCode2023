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

function run(data) {

    // U.log('Hello');

    const points = data.map(({winning, your}) => {
        let points = 0;
        
        for (let i = 0; i < your.length; i++) {
            const x = your[i];
            if (winning.find(w => w === x)) {
                points = points === 0 ? 1 : points * 2;
            }
        }
        return points;
    });

    U.log(points);

    return points.reduce((p, c) => p + c, 0);
}

