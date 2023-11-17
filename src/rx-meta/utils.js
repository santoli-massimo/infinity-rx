"use strict";
exports.__esModule = true;
exports.emitStatus = exports.getStatus = void 0;
var rx_meta_store_1 = require("./rx-meta-store");
var rxjs_1 = require("rxjs");
var getStatus = function (source) {
    return rx_meta_store_1.RxMetaStore.get(source);
};
exports.getStatus = getStatus;
var emitStatus = function (source, status) {
    var currentStatus = rx_meta_store_1.RxMetaStore.get(source) || new rxjs_1.Subject();
    currentStatus.next(status);
};
exports.emitStatus = emitStatus;
//# sourceMappingURL=utils.js.map