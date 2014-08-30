'use strict';

var path = require('path');
var vow = require('vow');
var vowFs = require('vow-fs');

/**
 * Список технологий, используемый для создания файлов.
 *
 * @type {array}
 */
var techs = [
    'bemhtml',
    'css',
    'js'
];

/**
 * Создает файл для соответствующей технологии.
 *
 * @param  {string}   filePath
 * @param  {string}   tech     bemhtml|css|js.
 * @return {function}
 */
function appendTech(filePath) {
    return function (exist) {
        if (exist) {
            return;
        }

        return vowFs.write(filePath, '');
    };
}

/**
 * Получает список папок, которые необходимо создать.
 *
 * @param  {string} pathName
 * @return {array}
 */
function folderList(pathName) {
    pathName = path.resolve(pathName);

    var base = path.basename(pathName);
    var basePath = path.dirname(pathName);

    // блок
    if (/^([a-z\-]+)$/i.exec(base)) {
        return [
            path.join(basePath, RegExp.$1)
        ];
    // модификатор блока
    } else if (/^([a-z\-]+)(_[a-z\-]+)(?:_[a-z\-]+)?$/i.exec(base)) {
        return [
            path.join(basePath, RegExp.$1),
            path.join(basePath, RegExp.$1, RegExp.$2)
        ];
    // элемент блока
    } else if (/^([a-z\-]+)(__[a-z\-]+)$/i.exec(base)) {
        return [
            path.join(basePath, RegExp.$1),
            path.join(basePath, RegExp.$1, RegExp.$2)
        ];
    // модификатор элемента
    } else if (/^([a-z\-]+)(__[a-z\-]+)(_[a-z\-]+)(?:_[a-z\-]+)?$/i.exec(base)) {
        return [
            path.join(basePath, RegExp.$1),
            path.join(basePath, RegExp.$1, RegExp.$2),
            path.join(basePath, RegExp.$1, RegExp.$2, RegExp.$3)
        ];
    }
}

/**
 * Логирует ошибки.
 *
 * @param  {*} err
 */
exports.log = function (err) {
    console.log(err.stack || err);
};

/**
 * Создает БЕМ сущность.
 *
 * @param  {string}  str
 * @param  {boolean} bemhtml
 * @param  {boolean} css
 * @param  {boolean} js
 * @return {promise}
 */
exports.make = function (str) {
    var list = folderList(str);
    var promise = vow.resolve();

    list.forEach(function (pathName) {
        promise.then(vowFs.makeDir(pathName));
    });

    var ln = arguments.length;
    var basePath = list.pop();
    str = path.basename(str);
    for (var a = 1; a < ln; ++a) {
        if (!arguments[a]) {
            continue;
        }

        var ext = techs[a - 1];
        var pathName = path.join(basePath, str + '.' + ext);
        promise
            .then(vowFs.exists(pathName))
            .then(appendTech(pathName, ext));
    }

    return promise;
};

/**
 * Получает список файлов папки.
 *
 * @param  {string} pathName
 * @return {array}
 */
function listDir(pathName) {
    return vowFs.listDir(pathName)
        .then(function (list) {
            return list.map(function (file) {
                return path.resolve(pathName, file);
            });
        });
}

/**
 * Получает абсолютный путь из исходной строки и выделяет значимые части.
 *
 * @param  {string} str
 * @return {object}
 */
function parsePath(str) {
    str = path.resolve(str);
    return {
        base: path.basename(str),
        dir: path.dirname(str),
        path: str
    };
}

function pattern(base) {
    return RegExp(base + '(?=\\.[a-z]+$)', 'i');
}

/**
 * Выделяет из списка файлов список папок и файлов.
 *
 * @param  {array}   list
 * @return {promise}
 */
function separate(list) {
    var dirs = [];
    var files = [];

    return vow.all(list.map(vowFs.isDir, vowFs))
        .then(function (flags) {
            flags.forEach(function (isdir, i) {
                if (isdir) {
                    dirs.push(list[i]);
                } else {
                    files.push(list[i]);
                }
            });

            return [dirs, files];
        });
}

/**
 * Переименовывает БЕМ сущности.
 *
 * @param  {string}  from
 * @param  {string}  to
 * @return {promise}
 */
exports.rename = function (from, to) {
    from = parsePath(from);
    to = parsePath(to);

    return listDir(from.path)
        .then(separate)
        .spread(function (dirs, files) {
            return vow.all(files.map(function (filePath) {
                var destPath = filePath.replace(pattern(from.base), to.base);
                console.log(pattern(from.base));
                console.log(destPath);
                if (destPath !== filePath) {
                    return vowFs.move(filePath, destPath);
                }
            }));
        })
        .then(function () {
            if (to.path !== from.path) {
                return vowFs.move(from.path, to.path);
            }
        });
};
