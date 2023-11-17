"use strict";
exports.__esModule = true;
exports.pif = void 0;
var rxjs_1 = require("rxjs");
var pif = function (condition) { return function (trueResult) { return !!condition ? trueResult : rxjs_1.identity; }; };
exports.pif = pif;
//# sourceMappingURL=control-flow.js.map