'use strict';

var core = require('./core');
var path = require('path');
var utils = require('./utils');

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
 * @param  {string}  dir
 * @param  {string}  name
 * @param  {string}  tech
 * @return {promise}
 */
function createTech(dir, name, tech) {
    return function () {
        var filePath = tech === 'deps' ?
            path.resolve(dir, name + '.deps.js') :
            path.resolve(dir, name + '.' + tech);

        return utils.exists(filePath)
            .then(function (exist) {
                if (exist) {
                    return;
                }

                return utils.write(filePath, '');
            });
    };
}

/**
 * Создает БЕМ сущность.
 *
 * @param  {string}  filePath
 * @param  {boolean} bemhtml
 * @param  {boolean} css
 * @param  {boolean} deps
 * @param  {boolean} js
 * @return {promise}
 */
module.exports = function (filePath) {
    var target = core.parsePath(filePath);
    var dir = core.resolvePath(target);
    var promise = utils.mkdir(dir);
    var ln = arguments.length;
    for (var a = 1; a < ln; ++a) {
        if (!arguments[a]) {
            continue;
        }

        var tech = techs[a - 1];
        promise.then(createTech(dir, target.name, tech));
    }

    return promise;
};
