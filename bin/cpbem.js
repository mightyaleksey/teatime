#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package.json');

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    mvbem block1 block2');
    console.log('    mvbem block1__elem1 block2__elem2');
});

program
    .version(pkg.version)
    .parse(process.argv);

if (program.args.length !== 2) {
    program.help();
}

var move = require('../lib/move');

move(program.args[0], program.args[1], true)
    .catch(function (err) {
        console.log(err.stack || err);
    });
