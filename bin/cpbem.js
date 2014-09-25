#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package.json');

program
    .version(pkg.version)
    .parse(process.argv);

if (program.args.length !== 2) {
    program.help();
}

var copy = require('../lib/copy');

copy(program.args[0], program.args[1])
    .catch(function (err) {
        console.error(err.stack || err);
    });
