const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let moves = {};
    // let map = [];
    // let map2 = {};

    // let all = {};

    // R.drop(2, lines).forEach((x, i) => {
    //     const from = x.split(' = ')[0];
    //     const to = x.split(' = ')[1].split(', ').map(y => y.replace(')', '').replace('(', ''))
    //     all[from] = true;
    //     to.forEach(t => all[t] = true);
    // });

    // R.keys(all).forEach((x, i) => {
    //     map[i] = x;
    //     map2[x] = i;
    // });

    R.drop(2, lines).forEach((x, i) => {
        const from = x.split(' = ')[0];
        const to = x.split(' = ')[1].split(', ').map(y => y.replace(')', '').replace('(', ''))

        // moves[map2[from]] = to.map(x => map2[x]);
        moves[from] = to;
    });

    return {
        dirs: lines[0].split('').map(x => x === 'L' ? 0 : 1),
        moves
    };
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    const ipos = R.keys(data.moves).filter(x => x[2] === 'A');
    
    let pos = R.clone(ipos);

    const paths = pos.map(p => {
        let path = [];

        let i = 0;
        let end = false;
        let mem = {};

        while (!end) {
            const s = i % data.dirs.length;
            const dir = data.dirs[s];
            const key = `${p}_s`;

            if (p[2] === 'Z') {
                path.push([p, i]);

                if (mem[key] !== undefined) {
                    end = true;
                }

                mem[key] = i;
            }
            
            p = data.moves[p][dir];

            i++;
        }

        return path;
    });

    const dists = paths.map(x => x[1][1] - x[0][1]);
    const maxDist = U.maxA(dists);

    U.log(dists, maxDist);

    let incBy = maxDist;

    v = maxDist;

    let dividers = 1;

    while (true) {
        const currDividers = dists.filter(x => v % x === 0).length;
        if (currDividers === dists.length) {
            break;
        }

        if (currDividers > dividers) {
            dividers = currDividers;
            incBy = v;
        }

        v += incBy;
    }

    return v;

}

// 9177460370549 OK