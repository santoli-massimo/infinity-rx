"use strict";
exports.__esModule = true;
exports.reload = exports.IRx = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("./operators");
var IRx = function (source, refreshBehaviour) {
    if (refreshBehaviour === void 0) { refreshBehaviour = {}; }
    return source.pipe((0, operators_1.irx)(refreshBehaviour));
};
exports.IRx = IRx;
var reload = function (status) { return status.pipe((0, rxjs_1.first)()).subscribe(function (status) { return status.refresh(); }); };
exports.reload = reload;
//# sourceMappingURL=IRx.js.map