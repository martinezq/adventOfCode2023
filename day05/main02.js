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

    // --

    const ranges = lines[0].split(': ')[1].split(' ').map(x => Number(x));
    let seeds = [];
    
    for (let i = 0; i < ranges.length; i += 2) {
        const start = ranges[i];
        const len = ranges[i + 1];
        seeds.push([start, len]);
    }
    

    return {
        seeds,
        maps
    };
}

// --------------------------------------------

function processMap(seed, map) {
    let result = [seed];

    for (let i = 0; i < map.length; i++) {

        let result2 = [];

        for (let j = 0; j < result.length; j++) {
            const [start, len] = result[j];
            const [destStart, sourceStart, len2] = map[i];

            const end = start + len - 1;
            const sourceEnd = sourceStart + len2 - 1;

            if (start < sourceStart && end < sourceStart) {
                result2.push([start, len]);
            } 

            if (start > sourceEnd) {
                result2.push([start, len]);
            } 

            if (start >= sourceStart && end <= sourceEnd) {
                const d = start - sourceStart;
                result2.push([start, len]);
            }

            if (start < sourceStart && end >= sourceStart && end <= sourceEnd) {
                const d1 = sourceStart - start;
                const d2 = end - sourceStart + 1;
                result2.push([start, d1]);
                result2.push([sourceStart, d2]);
            }

            if (start >= sourceStart && start <= sourceEnd && end > sourceEnd) {
                const d1 = sourceEnd - start + 1;
                const d2 = end - sourceEnd - 1;
                result2.push([start, d1]);
                result2.push([sourceEnd + 1, d2]);
            }

            if (start < sourceStart && end > sourceEnd) {
                const d1 = sourceStart - start;
                const d2 = end - sourceEnd;
                result2.push([start, d1]);
                result2.push([sourceStart, len2]);
                result2.push([sourceEnd + 1, d2]);
            }
        }

        result = result2;

    }

    let result3 = result.map(r => {
        for (let i = 0; i < map.length; i++) {
            const [start, len] = r;
            const [destStart, sourceStart, len2] = map[i];
            const end = start + len - 1;
            const sourceEnd = sourceStart + len2 - 1;

            if (start >= sourceStart && end <= sourceEnd) {
                const d = start - sourceStart
                return [destStart + d, len];
            }

        }    

        return r;
    });

    return result3;
}

function run({seeds, maps}) {

    const mapsA = R.values(maps);

    mapsA.forEach((map, m) => {
        let seeds2 = [];
        for (let s = 0; s < seeds.length; s++) {
            const newList = processMap(seeds[s], map);

            newList.forEach(x => seeds2.push(x));

            U.log(R.keys(maps)[m], newList);
        }

        seeds = seeds2;
    });

    U.log(seeds);

    return U.minA(seeds.map(x => x[0]));

}

