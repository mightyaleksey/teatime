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
 * Переименовывает фрагмент папки.
 * 
 * @param  {string} dir
 * @param  {string} from
 * @param  {string} to
 * @return {string}
 */
function renameDir(dir, from, to) {
	return dir.replace(from, to);
}

/**
 * Копирование.
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

	return list(source.resolved, depth(source.type))
		.then(splat(function (dirs, files) {
			var promise = fs.mkdir(target.resolved);

			dirs.forEach(function (dir) {
				promise = promise.then(function () {
					return fs.mkdir(renameDir(dir, source.resolved, target.resolved));
				});
			});

			return promise.then(function () {
				return Promise.all(files.map(function (file) {
					var parsed = core.parsePath(file);

					props.forEach(function (prop) {
						if (parsed[prop] && target[prop]) {
							parsed[prop] = target[prop];
						}
					});

					var dest = path.join(
						renameDir(parsed.level, source.resolved, target.resolved),
						core.resolveName(parsed) + '.' + parsed.name.split('.').slice(1).join('.')
					);

					return fs.copy(file, dest);
				}));
			});
		}));
};