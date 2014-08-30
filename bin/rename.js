#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package.json');

program.on('--help', function () {
    console.log('  Not implemented yet.');
});

program
    .version(pkg.version)
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}
