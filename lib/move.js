'use strict';

var core = require('./core');
var fs = require('./fs');
var splat = require('./utils').splat;
var path = require('path');
var Promise = require('vow').Promise;

/**
 * Список значимых полей
 * 
 * @type {Array}
 */
var props = [
	'block',
	'elem',
	'mod',
	'val'
];

/**
 * Глубина возможной вложенности.
 * 
 * @param  {string} type
 * @return {number}
 */
function depth(type) {
	switch (type) {
	case 'block':
		return 3;
	case 'mod':
		return 2;
	case 'elem':
		return 2;
	case 'elemmod':
		return 1;
	}
}

/**
 * Получает список папок и файлов из указанной директории с учетом вложенности.
 * 
 * @param  {string}  dir
 * @param  {number}  depth
 * @param  {array}   [dirList]
 * @param  {array}   [fileList]
 * @return {promise}
 */
function list(dir, depth, dirList, fileList) {
	Array.isArray(dirList) || (dirList = []);
	Array.isArray(fileList) || (fileList = []);

	return fs.readdir(dir)
		.then(fs.separate)
		.then(splat(function (dirs, files) {
			files.forEach(function (file) {
				fileList.push(file);
			});

			if (dirs.length && depth > 1) {
				depth--;

				dirs.forEach(function (dir) {
					dirList.push(dir);
				});

				return Promise.all(dirs.map(function (dir) {
					return list(dir, depth, dirList, fileList);
				}));
			}
		}))
		.then(function () {
			return [dirList, fileList];
		});
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
 * Переименование.
 * 
 * @param  {string}  source
 * @param  {string}  target
 * @return {promise}
 */
module.exports = function (source, target) {
	source = parse(source);
	target = parse(target);

	if (source.type !== target.type) {
		throw new SyntaxError('Should use arguments of the same type');
	}

	return fs.mkdir(path.dirname(target.resolved))
		.then(fs.move.bind(null, source.resolved, target.resolved))
		.then(list.bind(null, target.resolved, depth(target.type)))
		.then(splat(function (dirs, files) {
			return Promise.all(files.map(function (file) {
				var parsed = core.parsePath(file);

				props.forEach(function (prop) {
					if (parsed[prop] && target[prop]) {
						parsed[prop] = target[prop];
					}
				});

				var dest = path.join(
					path.dirname(file),
					core.resolveName(parsed) + '.' + parsed.name.split('.').slice(1).join('.')
				);

				if (file !== dest) {
					return fs.move(file, dest);
				}
			}));
		}));
};