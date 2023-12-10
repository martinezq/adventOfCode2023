const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(''));
}

// --------------------------------------------

function traverse(map, dists) {
    dists = dists || U.mapMatrix(map, (x) => x === 'S' ? 0 : x === '.' ? '.' : '?');
    
    const [y, x] = U.findInMatrix(map, x => x === 'S');
    
    U.log(x, y);

    let entries = [];

    if (['-', '7', 'J'].indexOf(map[y][x + 1]) > -1) entries.push([y, x + 1, 'E']); 
    if (['-', 'F', 'L'].indexOf(map[y][x - 1]) > -1) entries.push([y, x - 1, 'W']); 
    if (['|', 'F', '7'].indexOf(map[y - 1][x]) > -1) entries.push([y - 1, x, 'N']); 
    if (['|', 'L', 'J'].indexOf(map[y + 1][x]) > -1) entries.push([y + 1, x, 'S']); 

    U.logf(entries);

    entries.forEach(([y, x, dir]) => {
        let dist = 0;

        while (true) {
            dist++;
            const curr = map[y][x];

            if (dists[y][x] > dist || dists[y][x] === '?') {
                dists[y][x] = dist;
            } else {
                break;
            }
            
            if (dir === 'E') {
                if (curr === '-') { x = x + 1; }
                if (curr === '7') { y = y + 1; dir = 'S'; }
                if (curr === 'J') { y = y - 1; dir = 'N'; }
            }

            if (dir === 'W') {
                if (curr === '-') { x = x - 1; }
                if (curr === 'F') { y = y + 1; dir = 'S'; }
                if (curr === 'L') { y = y - 1; dir = 'N'; }
            }

            if (dir === 'N') {
                if (curr === '|') { y = y - 1; }
                if (curr === 'F') { x = x + 1; dir = 'E'; }
                if (curr === '7') { x = x - 1; dir = 'W'; }
            }

            if (dir === 'S') {
                if (curr === '|') { y = y + 1; }
                if (curr === 'L') { x = x + 1; dir = 'E'; }
                if (curr === 'J') { x = x - 1; dir = 'W'; }
            }
        }

    });

    return dists;    
}

function run(data) {

    // U.log('Hello');

    const dists = traverse(data);

    U.logf(dists);
    
    return U.maxA(dists.flat().filter(x => !isNaN(Number(x))));
}

