'use strict';

var utils = require('./utils');
var vow = require('vow');

/**
 * Шаблончики для разных БЕМ сущностей.
 *
 * @type {Object}
 */
var patterns = {
    block: /^([a-z\-0-9]+)$/i,
    elem: /^([a-z\-0-9]+)(__[a-z\-0-9]+)$/i,
    elemMod: /^([a-z\-0-9]+)(__[a-z\-0-9]+)(_[a-z\-0-9]+)(_[a-z\-0-9]+)?$/i,
    mod: /^([a-z\-0-9]+)(_[a-z\-0-9]+)(_[a-z\-0-9]+)?$/i
};

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
 * Формирует путь до БЕМ сущности.
 *
 * @param  {object} target
 * @return {string}
 */
function parseDirs(target) {
    // блок
    if (patterns.block.exec(target.base)) {
        return utils.resolve(target.dir, RegExp.$1);
    // модификатор блока
    } else if (patterns.mod.exec(target.base)) {
        return utils.resolve(target.dir, RegExp.$1, RegExp.$2);
    // элемент блока
    } else if (patterns.elem.exec(target.base)) {
        return utils.resolve(target.dir, RegExp.$1, RegExp.$2);
    // модификатор элемента
    } else if (patterns.elemMod.exec(target.base)) {
        return utils.resolve(target.dir, RegExp.$1, RegExp.$2, RegExp.$3);
    }

    throw new SyntaxError('Unknown type of argument: "' + target.base + '"');
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
    var dir = parseDirs(target);
    var promise = vow.resolve();

    promise.then(utils.mkdir(dir));

    var ln = arguments.length;
    for (var a = 1; a < ln; ++a) {
        if (!arguments[a]) {
            continue;
        }

        var tech = techs[a - 1];
        promise.then(createTech(dir, target.base, tech));
    }

    return promise;
};
