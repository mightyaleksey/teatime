'use strict';

var core = require('./core');
var fs = require('./fs');
var path = require('path');

/**
 * Список технологий, используемый для создания файлов.
 *
 * @type {array}
 */
var techs = [
    'bemhtml',
    'css',
    'deps',
    'js'
];

/**
 * Создает файл для соответствующей технологии.
 *
 * @param  {object}  target
 * @param  {string}  tech
 * @return {promise}
 */
function createTech(target, tech) {
    return function () {
        var filePath = tech === 'deps' ?
            path.resolve(target.resolved, target.name + '.deps.js') :
            path.resolve(target.resolved, target.name + '.' + tech);

        return fs.exists(filePath)
            .then(function (exist) {
                if (exist) {
                    return;
                }

                return fs.write(filePath, '');
            });
    };
}

/**
 * Парсит путь.
 * 
 * @param  {string} target
 * @return {object}
 */
function parse(target) {
    target = core.parsePath(target);
    target.resolved = core.resolvePath(target);

    return target;
}

/**
 * Создает БЕМ сущность.
 *
 * @param  {string}  file
 * @param  {boolean} bemhtml
 * @param  {boolean} css
 * @param  {boolean} deps
 * @param  {boolean} js
 * @return {promise}
 */
module.exports = function (file) {
    var target = parse(file);
    var promise = fs.mkdir(target.resolved);

    var length = arguments.length;
    for (var a = 1; a < length; ++a) {
        if (!arguments[a]) {
            continue;
        }

        var tech = techs[a - 1];
        promise.then(createTech(target, tech));
    }

    return promise;
};
