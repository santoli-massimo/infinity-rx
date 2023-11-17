"use strict";
exports.__esModule = true;
exports.getMeta = exports.keepMeta = exports.withMeta = void 0;
var rxjs_1 = require("rxjs");
var rx_meta_store_1 = require("./rx-meta-store");
var withMeta = function (status) {
    var currentStatus = rx_meta_store_1.RxMetaStore.get(status) || new rxjs_1.Subject();
    return function (source) {
        rx_meta_store_1.RxMetaStore.set(source, currentStatus);
        currentStatus.next(currentStatus);
        return source;
    };
};
exports.withMeta = withMeta;
var keepMeta = function (status) {
    var currentStatus = rx_meta_store_1.RxMetaStore.get(status) || new rxjs_1.Subject();
    return function (source) {
        rx_meta_store_1.RxMetaStore.set(source, currentStatus);
        return source;
    };
};
exports.keepMeta = keepMeta;
var getMeta = function (source) {
    return rx_meta_store_1.RxMetaStore.get(source);
};
exports.getMeta = getMeta;
//# sourceMappingURL=operators.js.map