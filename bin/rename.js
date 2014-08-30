#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package.json');

program.on('--help', function () {
    console.log('  Not implemented yet.');
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    mvbem <block1> <block2>');
});

program
    .version(pkg.version)
    .parse(process.argv);

if (program.args.length !== 2) {
    program.help();
}

var bem = require('../index');

bem.rename(program.args[0], program.args[1]).catch(bem.log);
