const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map((x, i) => ({
        id: i + 1,
        rounds: x.split(': ')[1].split('; ').map(y => ({
            cubes: y.split(', ').map((z, i) => ({color: z.split(' ')[1], size: Number(z.split(' ')[0])}) )
        }))
    }));
}

// --------------------------------------------

function run(data) {
    U.logf(data);

    // U.log('Hello');

    const games = data.map(g => {

        let minBlue = 0;
        let minGreen = 0;
        let minRed = 0;

        for (let r = 0; r < g.rounds.length; r++) {
            const round = g.rounds[r];

            for (let c = 0; c < round.cubes.length; c++) {
                const cube = round.cubes[c];

                if (cube.color === 'red' && cube.size > minRed) minRed = cube.size;
                if (cube.color === 'green' && cube.size > minGreen) minGreen = cube.size;
                if (cube.color === 'blue' && cube.size > minBlue) minBlue = cube.size;
                // console.log(cube, result);
            }
            
        }

        return minRed * minBlue * minGreen;
    });

    const result = games.reduce((p, c) => p + c, 0);;

    return result;
}
