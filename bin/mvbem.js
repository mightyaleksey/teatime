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

var move = require('../lib/move');

move(program.args[0], program.args[1])
    .catch(function (err) {
        console.log(err.stack || err);
    });
