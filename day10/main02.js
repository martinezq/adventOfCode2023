const fs = require('fs');

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

function traverse(map) {
    let dists = U.mapMatrix(map, (x) => '.');
    let mainLoop = U.mapMatrix(map, (x) => '.');
    
    const [sy, sx] = U.findInMatrix(map, x => x === 'S');
    
    U.log(sx, sy);

    let entries = [];

    if (['-', '7', 'J'].indexOf(map[sy][sx + 1]) > -1) entries.push([sy, sx + 1, 'E']); 
    if (['-', 'F', 'L'].indexOf(map[sy][sx - 1]) > -1) entries.push([sy, sx - 1, 'W']); 
    if (['|', 'F', '7'].indexOf(map[sy - 1][sx]) > -1) entries.push([sy - 1, sx, 'N']); 
    if (['|', 'L', 'J'].indexOf(map[sy + 1][sx]) > -1) entries.push([sy + 1, sx, 'S']); 

    U.logf(entries);

    const sdirs = entries.map(x => x[2]).sort().join('');
    let sReal = 'S';

    if (sdirs === 'ES') sReal = 'F';

    let [y, x, dir] = entries[0];

    mainLoop[sy][sx] = map[y][x];

    while (true) {

        let curr = map[y][x];

        if (x === sx && y === sy) {
            curr = sReal;
        }

        mainLoop[y][x] = map[y][x];
        
        if (curr === '|') {
            const r = dir === 'N' ? 0 : 1;
            const l = 1 - r;

            dists[y][x + 1] = r;
            dists[y][x - 1] = l;
        }

        if (curr === '-') {
            const r = dir === 'E' ? 0 : 1;
            const l = 1 - r;            

            dists[y + 1][x] = r;
            dists[y - 1][x] = l;
        }

        if (curr === '7') {
            const r = dir === 'N' ? 0 : 1;
            const l = 1 - r;

            dists[y + 1][x - 1] = l;

            dists[y][x + 1] = r;
            dists[y - 1][x + 1] = r;
            dists[y - 1][x] = r;
        }        

        if (curr === 'J') {
            const r = dir === 'E' ? 0 : 1;
            const l = 1 - r;

            dists[y - 1][x - 1] = l;

            dists[y + 1][x] = r;
            dists[y + 1][x + 1] = r;
            dists[y][x + 1] = r;
        }        

        if (curr === 'L') {
            const r = dir === 'S' ? 0 : 1;
            const l = 1 - r;

            dists[y - 1][x + 1] = l;

            dists[y][x - 1] = r;
            dists[y + 1][x - 1] = r;
            dists[y + 1][x] = r;
        }

        if (curr === 'F') {
            const r = dir === 'W' ? 0 : 1;
            const l = 1 - r;

            dists[y + 1][x + 1] = l;

            dists[y - 1][x] = r;
            dists[y - 1][x - 1] = r;
            dists[y][x - 1] = r;
        }           
         
        // ---

        if (map[y][x] === 'S') {
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

    return U.mapMatrix(dists, (v, y, x) => mainLoop[y][x] === '.' ? dists[y][x] : map[y][x]);    
}

function flood(map, y, x) {

    if (x === undefined && y === undefined) {
        const dot = U.findInMatrix(map, x => x === '.');
        if (!dot) return map;
        [y, x] = dot;
    } else {
        const v = map[y][x];

        if (v === 0 || v === 1) {
    
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[i].length; j++) {
                    if (map[i][j] === '*') map[i][j] = v;
                }
            }
        }
    
    }

    map[y][x] = '*';

    if (map[y][x + 1] === '.') flood(map, y, x + 1);
    if (x > 0 && map[y][x - 1] === '.') flood(map, y, x - 1);
    if (y > 0 && map[y - 1][x] === '.') flood(map, y - 1, x);
    if (y < map.length - 1 && map[y + 1][x] === '.') flood(map, y + 1, x);

    return map;

}

function run(data) {

    // U.log('Hello');

    let data2 = [];
    data2.push(R.repeat('.', data[0].length + 2));

    data.forEach(line => {
        let line2 = [];
        line2.push('.');
        line.forEach(x => line2.push(x));
        line2.push('.');
        data2.push(line2);
    });

    data2.push(R.repeat('.', data[0].length + 2));

    U.logf(data2);

    const dists = traverse(data2);

    U.logf(U.matrixToTile(dists));

    fs.writeFileSync('_out.txt', U.matrixToTile(dists));

    const dists2 = flood(dists);

    U.logf(U.matrixToTile(dists2));

    fs.writeFileSync('_out2.txt', U.matrixToTile(dists2));
    
    const c0 = dists2.flat().filter(x => x === 0).length;
    const c1 = dists2.flat().filter(x => x === 1).length;

    return Math.min(c0, c1);
}

// 254 low
// 413 low
// 415