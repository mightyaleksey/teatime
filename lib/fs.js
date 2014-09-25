'use strict';

var path = require('path');
var Promise = require('vow').Promise;
var vowFs = require('vow-fs');

/**
 * Копирует файл.
 * 
 * @param  {string}  source
 * @param  {string}  target
 * @return {promise}
 */
exports.copy = function (source, target) {
	return vowFs.copy(source, target);
};

/**
 * Проверяет существует ли указанный файл / папка.
 *
 * @param  {string}  file
 * @return {promise}
 */
exports.exists = function (file) {
    return vowFs.exists(file);
};

/**
 * Создает папку.
 * 
 * @param  {string}  dir
 * @return {promise}
 */
exports.mkdir = function (dir) {
	return vowFs.makeDir(dir);
};

/**
 * Переименовывает файл / папку.
 * 
 * @param  {string}  source
 * @param  {string}  target
 * @return {promise}
 */
exports.move = function (source, target) {
	return vowFs.move(source, target);
};

/**
 * Получает список файлов папки и разрешает их в абсолютные пути.
 * 
 * @param  {string}  dir
 * @return {promise}
 */
exports.readdir = function (dir) {
	return vowFs.listDir(dir)
        .then(function (files) {
            return files.map(function (file) {
                return path.resolve(dir, file);
            });
        });
};

/**
 * Разделяет указанный список на списки папок и файлов.
 *
 * @param  {array}   filesList
 * @return {promise}
 */
exports.separate = function (filesList) {
    var dirs = [];
    var files = [];

    return Promise.all(filesList.map(vowFs.isDir, vowFs))
        .then(function (output) {
            output.forEach(function (isdir, i) {
                if (isdir) {
                    dirs.push(filesList[i]);
                } else {
                    files.push(filesList[i]);
                }
            });

            return [dirs, files];
        });
};

/**
 * Пишет данные в файл.
 * 
 * @param  {string}  file
 * @param  {string}  data
 * @return {promise}
 */
exports.write = function (file, data) {
	return vowFs.write(file, data, {encoding: 'utf8'});
};