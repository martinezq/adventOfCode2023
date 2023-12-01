const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x);
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    const res = data.map(l => {
        let a, b;
        for (let i = 0; i < l.length ; i++) {
            if (a === undefined && !isNaN(l[i])) a = (l[i]);
            
        }
        for (let i = l.length - 1; i >= 0 ; i--) {
            if (b === undefined && !isNaN(l[i])) b = (l[i]);
            
        }


        return Number(a + b);
    });

    console.table(res);

    const result = res.reduce((p,c) => p + c, 0);

    return result;
}

