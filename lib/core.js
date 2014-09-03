'use strict';

var path = require('path');

/**
 * Шаблончик для БЕМ сущностей.
 *
 * @type {RegExp}
 */
var bemPattern = /^([a-z\-0-9]+)(__[a-z\-0-9]+)?(_[a-z\-0-9]+)?(_[a-z\-0-9]+)?$/i;

/**
 * Парсит путь к блоку и выделяет значимые части.
 *
 * @param  {string} filePath
 * @return {object}
 */
exports.parsePath = function (filePath) {
    filePath = path.resolve(filePath);

    var target = {name: path.basename(filePath), origin: path.dirname(filePath)};

    if (!bemPattern.exec(target.name)) {
        throw new SyntaxError('Unknown type of argument: "' + target.name + '"');
    }

    target.block = RegExp.$1;
    target.elem = RegExp.$2;
    target.mod = RegExp.$3;
    target.val = RegExp.$4;

    var props = [];
    target.elem && props.push('elem');
    target.mod && props.push('mod');

    target.type = props.length ? props.join('') : 'block';

    return target;
};

/**
 * Возвращает имя БЕМ сущности.
 *
 * @param  {object} target
 * @param  {string} target.block
 * @param  {string} target.mod
 * @param  {string} target.elem
 * @param  {string} target.elemmod
 * @param  {string} target.name
 * @param  {string} target.origin
 * @param  {string} target.type
 * @return {string}
 */
exports.resolveName = function (target) {
    switch (target.type) {
    case 'block':
        return target.block;
    case 'mod':
        return target.block + target.mod + (target.val ? target.val : '');
    case 'elem':
        return target.block + target.elem;
    case 'elemmod':
        return target.block + target.elem + target.mod + (target.val ? target.val : '');
    }
};

/**
 * Возвращает абсолютный путь к БЕМ сущности.
 *
 * @param  {object} target
 * @param  {string} target.block
 * @param  {string} target.mod
 * @param  {string} target.elem
 * @param  {string} target.elemmod
 * @param  {string} target.name
 * @param  {string} target.origin
 * @param  {string} target.type
 * @return {string}
 */
exports.resolvePath = function (target) {
    switch (target.type) {
    case 'block':
        return path.resolve(target.origin, target.block);
    case 'mod':
        return path.resolve(target.origin, target.block, target.mod);
    case 'elem':
        return path.resolve(target.origin, target.block, target.elem);
    case 'elemmod':
        return path.resolve(target.origin, target.block, target.elem, target.mod);
    }
};
