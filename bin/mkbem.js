#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package.json');

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
            console.error(err.stack || err);
        });
});
