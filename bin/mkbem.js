#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package.json');

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    mkbem -bcj block');
    console.log('    mkbem -j block_mod_name');
    console.log('    mkbem -c block__elem');
    console.log('    mkbem -c block__elem_mod_name');
});

program
    .version(pkg.version)
    .option('-b, --bemhtml', 'add bemhtml file')
    .option('-c, --css', 'add css file')
    .option('-d, --deps', 'add deps file')
    .option('-j, --js', 'add js file')
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

var make = require('../lib/make');

program.args.forEach(function (arg) {
    make(arg, program.bemhtml, program.css, program.deps, program.js)
        .catch(function (err) {
            console.log(err.stack || err);
        });
});
