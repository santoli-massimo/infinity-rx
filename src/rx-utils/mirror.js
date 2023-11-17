"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.mirrorObserver = exports.mirror = void 0;
var mirror = function (source, destination, overrides) {
    if (overrides === void 0) { overrides = {}; }
    return source.subscribe((0, exports.mirrorObserver)(destination, overrides));
};
exports.mirror = mirror;
var mirrorObserver = function (destination, overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({
        next: function (value) { destination.next(value); },
        error: function (error) {
            destination.error(error);
            destination.complete();
        },
        complete: function () { destination.complete(); }
    }, overrides);
};
exports.mirrorObserver = mirrorObserver;
//# sourceMappingURL=mirror.js.map