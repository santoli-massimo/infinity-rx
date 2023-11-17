"use strict";
exports.__esModule = true;
exports.rxMeta = void 0;
var operators_1 = require("./operators");
var rxMeta = function (data, meta) {
    return data.pipe((0, operators_1.withMeta)(meta));
};
exports.rxMeta = rxMeta;
//# sourceMappingURL=rx-meta.js.map