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

    let result = numbers.filter(({v, s, e, l}) => {
        for (let i = l - 1; i <= l + 1; i++) {
            for (let j = s - 1; j <= e + 1; j++) {

                if (i === l && j >= s && j <= e) continue;

                const val = map[i]?.[j];
                
                if (val && val !== '.') {
                    console.log(v, val)
                    return true;
                }
            }
        }

        return false;
    });
 
    // U.log(result);

    return result.map(({v}) => Number(v)).reduce((p, c) => p + c, 0);
}

// 332700 wrong
// 524899 wrong
// 332700 wrong
// 310037 wrong
// 592003 wrong

// 543575 wrong
// 526404
