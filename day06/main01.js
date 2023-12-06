const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const times = lines[0].split(': ')[1].split(' ').map(x => Number(x)).filter(x => x > 0);
    const dists = lines[1].split(': ')[1].split(' ').map(x => Number(x)).filter(x => x > 0);

    const races = times.map((t, i) => ({ time: t, dist: dists[i]}));

    return races;
}

// --------------------------------------------

function evalRaceWins(race) {
    let counter = 0;

    for (let i = 1; i < race.time - 1; i++) {
        const speed = i;
        const dist = (race.time - speed) * speed;

        // console.log(race, speed, dist);

        if(dist > race.dist) counter++;
    }

    return counter;
}

function run(data) {

    // U.log('Hello');

    const result = data.map(race => evalRaceWins(race));

    return result.reduce((p, c) => p * c, 1);
}

