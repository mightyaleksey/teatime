'use strict';

var path = require('path');

/**
 * Шаблончик для БЕМ сущностей.
 *
 * @type {RegExp}
 */
var pattern = /^([a-z\-0-9]+)(__[a-z\-0-9]+)?(_[a-z\-0-9]+)?(_[a-z\-0-9]+)?(?:\.|$)/i;

/**
 * Парсит путь к БЕМ сущности.
 * 
 * @param  {string} file
 * @return {object}
 */
exports.parsePath = function (file) {
	file = path.resolve(file);

	var target = {level: path.dirname(file), name: path.basename(file)};

	if (!pattern.exec(target.name)) {
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
 * Резолвит имя файла.
 *
 * @param  {object} target
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
 * Резолвит путь до конечной БЕМ сущности.
 * 
 * @param  {object} target
 * @return {string}
 */
exports.resolvePath = function (target) {
	switch (target.type) {
	case 'block':
		return path.join(target.level, target.block);
	case 'mod':
		return path.join(target.level, target.block, target.mod);
	case 'elem':
		return path.join(target.level, target.block, target.elem);
	case 'elemmod':
		return path.join(target.level, target.block, target.elem, target.mod);
	}
};