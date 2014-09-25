'use strict';

/**
 * Вызывает функцию с разбитым массивом аргументов.
 *
 * @param  {function} fn
 * @param  {object}   ctx Контекст
 * @return {function}
 */
exports.splat = function (fn, ctx) {
    return function (arr) {
        return fn.apply(ctx, arr);
    };
};