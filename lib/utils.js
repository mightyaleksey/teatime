'use strict';

var path = require('path');
var vow = require('vow');
var vowFs = require('vow-fs');

exports.exists = function (filePath) {
    return vowFs.exists(filePath);
};

/**
 * Создает директорию и необходимые субдиректории (наподобии mkdir -p).
 *
 * @param  {string}  dir
 * @return {promise}
 */
exports.mkdir = function (dir) {
    return vowFs.makeDir(dir);
};

/**
 * Перемещает файл из одного места в другое.
 *
 * @param  {string}  sourcePath
 * @param  {string}  targetPath
 * @return {promise}
 */
exports.move = function (sourcePath, targetPath) {
    return vowFs.move(sourcePath, targetPath);
};

/**
 * Получает абсолютный путь из исходной строки и выделяет значимые части.
 *
 * @param  {string} filePath
 * @return {object}
 */
exports.parsePath = function (filePath) {
    filePath = path.resolve(filePath);

    return {
        base: path.basename(filePath),
        dir: path.dirname(filePath),
        path: filePath
    };
};

/**
 * Получает список файлов папки и разрешает их в абсолютные пути.
 *
 * @param  {string}  dir
 * @return {promise}
 */
exports.readdir = function (dir) {
    return vowFs.listDir(dir)
        .then(function (filesList) {
            return filesList.map(function (filePath) {
                return path.resolve(dir, filePath);
            });
        });
};

/**
 * Разрешает пути.
 *
 * @param  {...string} from
 * @return {string}
 */
exports.resolve = function () {
    return path.resolve.apply(path, arguments);
};

/**
 * Разбивает исходный список файлов на списоки папок и файлов.
 *
 * @param  {array}   filesList
 * @return {promise}
 */
exports.separate = function (filesList) {
    var dirs = [];
    var files = [];

    return vow.all(filesList.map(vowFs.isDir, vowFs))
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
 * @param  {string}  filePath
 * @param  {string}  data
 * @return {promise}
 */
exports.write = function (filePath, data) {
    return vowFs.write(filePath, data);
};
