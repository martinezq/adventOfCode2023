const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let maps = {};

    const lines2 = R.drop(2, lines);

    let mapName = undefined;

    lines2.forEach(line => {
        if (line === '') return;

        if (isNaN(Number(line[0]))) {
            mapName = line.split(' ')[0];
        } else {
            maps[mapName] = maps[mapName] || [];
            maps[mapName].push(line.split(' ').map(x => Number(x)))
        }
    });

    return {
        seeds: lines[0].split(': ')[1].split(' ').map(x => Number(x)),
        maps
    };
}

// --------------------------------------------

function processMap(x, map) {
    for (let i = 0; i < map.length; i++) {
        const [destStart, sourceStart, len] = map[i];
        
        if (x >= sourceStart && x <= sourceStart + len) {
            return x - sourceStart + destStart;
        }

        // console.log(destStart, sourceStart, len);
    }

    return x;
}

function run({seeds, maps}) {

    const result = seeds.map(seed => {
        const maps2 = R.values(maps);

        let x = seed;

        maps2.forEach(map => {
            x = processMap(x, map);
        });

        return x;
    });

    return U.minA(result);
}

