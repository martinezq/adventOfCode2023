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

    function num(text, i) {
        if (!isNaN(text[i])) return text[i];

        const p = text.slice(i);

        if (p.indexOf('one') === 0) return 1;
        if (p.indexOf('two') === 0) return 2;
        if (p.indexOf('three') === 0) return 3;
        if (p.indexOf('four') === 0) return 4;
        if (p.indexOf('five') === 0) return 5;
        if (p.indexOf('six') === 0) return 6;
        if (p.indexOf('seven') === 0) return 7;
        if (p.indexOf('eight') === 0) return 8;
        if (p.indexOf('nine') === 0) return 9;
        if (p.indexOf('zero') === 0) return 0;
    }

    const res = data.map(l => {
        let a, b;
        for (let i = 0; i < l.length ; i++) {
            
            if (a === undefined && !isNaN(num(l, i))) a = num(l, i);
            
        }
        for (let i = l.length - 1; i >= 0 ; i--) {
            if (b === undefined && !isNaN(num(l, i))) b = num(l, i);
            
        }


        return Number(String(a) + String(b));
    });

    console.table(res);

    const result = res.reduce((p,c) => p + c, 0);

    return result;
}

