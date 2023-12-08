const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let moves = {};

    R.drop(2, lines).forEach(x => {
        const from = x.split(' = ')[0];
        const to = x.split(' = ')[1].split(', ').map(y => y.replace(')', '').replace('(', ''))

        moves[from] = {
            'L': to[0],
            'R': to[1]
        };
    });

    return {
        dirs: lines[0].split(''),
        moves
    };
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    let pos = 'AAA';
    let step = 0;

    while (pos !== 'ZZZ') {
        U.log(pos);
        const dir = data.dirs[step % data.dirs.length];
        pos = data.moves[pos][dir];

        step++;
    }

    return step;
}

