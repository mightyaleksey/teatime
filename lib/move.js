'use strict';

var core = require('./core');
var path = require('path');
var utils = require('./utils');
var vow = require('vow');

/**
 * Определяет глубину вложенности для указанной БЕМ сущности.
 *
 * @param  {object} target
 * @param  {string} target.block
 * @param  {string} target.mod
 * @param  {string} target.elem
 * @param  {string} target.elemmod
 * @param  {string} target.name
 * @param  {string} target.origin
 * @param  {string} target.type
 * @return {number}
 */
function depth(target) {
    switch (target.type) {
    case 'block':
        return 2;
    case 'mod':
        return 1;
    case 'elem':
        return 1;
    default:
        return 0;
    }
}

/**
 * Возвращает список файлов указанной редиктории.
 * Рекурсивно обходит вложенные папки вплоть до указанной глубины вложенности.
 *
 * @param  {string} dirPath
 * @param  {number} depth   Глубина вложенности.
 * @param  {array}  [files]
 * @return {array}
 */
function listFiles(dirPath, depth, files) {
    Array.isArray(files) || (files = []);
    return utils.readdir(dirPath)
        .then(utils.separate)
        .spread(function (dirList, fileList) {
            fileList.forEach(function (file) {files.push(file);});
            if (depth-- && dirList.length) {
                return vow.all(dirList.map(function (dir) {
                    return listFiles(dir, depth, files);
                }));
            }
        })
        .then(function () {
            return files;
        });
}

/**
 * Возвращает путь к переименованному файлу.
 *
 * @param  {string} filePath
 * @param  {regexp} sourcePattern
 * @param  {string} targetPattern
 * @return {string}
 */
function rename(filePath, sourcePattern, targetPattern) {
    return path.join(path.dirname(filePath), path.basename(filePath).replace(sourcePattern, targetPattern));
}

/**
 * Копирует / переименовывает указанную БЕМ сущность.
 *
 * @param  {string}  source Исходный путь.
 * @param  {string}  target Конечный путь.
 * @return {promise}
 */
module.exports = function (source, target) {
    source = core.parsePath(source);
    target = core.parsePath(target);

    if (target.type !== source.type) {
        throw new SyntaxError('Different types have been specified: "' + source.type + '" vs "' + target.type + '"');
    }

    var sourceDir = core.resolvePath(source);
    var targetDir = core.resolvePath(target);
    var parentDir = path.dirname(targetDir);

    var sourcePattern = new RegExp('^' + core.resolveName(source));
    var targetPattern = core.resolveName(target);

    return utils.mkdir(parentDir)
        .then(utils.move.bind(null, sourceDir, targetDir))
        .then(listFiles.bind(null, targetDir, depth(target)))
        .then(function (files) {
            return vow.all(files.map(function (filePath) {
                var destPath = rename(filePath, sourcePattern, targetPattern);
                if (destPath !== filePath) {
                    return utils.move(filePath, destPath);
                }
            }));
        });
};
