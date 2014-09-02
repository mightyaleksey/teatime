'use strict';

var path = require('path');
var vow = require('vow');
var vowFs = require('vow-fs');

var bemPattern = /^([a-z\-0-9]+)(__[a-z\-0-9]+)?(_[a-z\-0-9]+)?(_[a-z\-0-9]+)?$/i;

/**
 * Копирует файл из одного места в другое.
 *
 * @param  {string}  sourcePath
 * @param  {string}  targetPath
 * @return {promise}
 */
exports.copy = function (sourcePath, targetPath) {
    return vowFs.copy(sourcePath, targetPath);
};

/**
 * Проверяет существует ли указанный путь.
 *
 * @param  {string}  filePath
 * @return {promise}
 */
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

    var target = {base: path.basename(filePath)};

    if (!bemPattern.exec(target.base)) {
        throw new SyntaxError('Unknown type of argument: "' + target.base + '"');
    }

    target.block = RegExp.$1;
    target.elem = RegExp.$2;
    target.mod = RegExp.$3;
    target.val = RegExp.$4;

    var props = [];
    target.elem && props.push('elem');
    target.mod && props.push('mod');

    var parts = [path.dirname(filePath), target.block];
    if (props.length) {
        props.forEach(function (prop) {
            parts.push(target[prop]);
        });
        target.bem = props.join('');
    } else {
        target.bem = 'block';
    }

    target.dir = path.join.apply(path, parts);

    return target;
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
