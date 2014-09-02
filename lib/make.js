'use strict';

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
            utils.resolve(dir, name + '.deps.js') :
            utils.resolve(dir, name + '.' + tech);

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
    var target = utils.parsePath(filePath);
    var promise = utils.mkdir(target.dir);
    var ln = arguments.length;
    for (var a = 1; a < ln; ++a) {
        if (!arguments[a]) {
            continue;
        }

        var tech = techs[a - 1];
        promise.then(createTech(target.dir, target.base, tech));
    }

    return promise;
};
