const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let numbers = [];
    
    lines.forEach((l, i) => {
        for (let j = 0; j < l.length; j++) {
            const x = l.slice(j).match(/^(\d+)/)?.[0];
            // console.log(x);

            if (x) {
                numbers.push({v: Number(x), s: j, e: j + x.length - 1, l: i});
                j += x.length;
            }
        }
    });

    return {
        map: lines.map(x => x.split('')),
        numbers
    };
}

// --------------------------------------------

function run({map, numbers}) {
    // console.table(data);

    let mem = {};

    let result = numbers.filter(({v, s, e, l}) => {
        for (let i = l - 1; i <= l + 1; i++) {
            for (let j = s - 1; j <= e + 1; j++) {

                if (i === l && j >= s && j <= e) continue;

                const val = map[i]?.[j];
                
                if (val === '*') {
                    let t = mem[`${i},${j}`] || [];
                    t.push(v);
                    mem[`${i},${j}`] = t;
                }
            }
        }

        return false;
    });
 
    U.log(mem);

    const r1 = R.values(mem);
    const r2 = r1.filter(x => x.length === 2);
    const r3 = r2.map(([x, y]) => x * y)

    return r3.reduce((p, c) => p + c, 0);
}

