"use strict";
exports.__esModule = true;
exports.status = exports.hasData = exports.isErrored = exports.isLoading = exports.error = exports.value = exports.irx = void 0;
var rxjs_1 = require("rxjs");
var RxStatus_1 = require("./RxStatus");
var operators_1 = require("rxjs/operators");
var mirror_1 = require("../rx-utils/mirror");
var control_flow_1 = require("../rx-utils/control-flow");
/**
 * CORE
 * */
var addLoadingStatus = function (refresher) {
    var loadingCount = 1;
    return function (source) {
        return source.pipe((0, rxjs_1.tap)(function () { return loadingCount++; }), (0, rxjs_1.mergeWith)(refresher.pipe((0, operators_1.map)(function () { return new RxStatus_1.RxLoadingStatus(refresher, loadingCount); }))), (0, rxjs_1.startWith)(new RxStatus_1.RxLoadingStatus(refresher, loadingCount)));
    };
};
var reloadManually = function (refresher) {
    return function (source) {
        return source.pipe((0, rxjs_1.repeat)({ delay: function () { return refresher; } }));
    };
};
var addRefCountBehaviour = function (refresher, onRefCountZero, minRefreshInterval) {
    var resetTimer;
    return function (source) {
        return source.pipe((0, rxjs_1.tap)(function (status) {
            if (!!minRefreshInterval) {
                resetTimer = (0, rxjs_1.timer)(minRefreshInterval).pipe((0, rxjs_1.shareReplay)(1));
            }
        }), (0, rxjs_1.share)({
            connector: function () { return new rxjs_1.ReplaySubject(1); },
            resetOnRefCountZero: onRefCountZero
                ? function () {
                    console.log('Ref count zero');
                    return resetTimer || (0, rxjs_1.timer)(0);
                }
                : false
        }));
    };
};
var toIRxStatus = function (refresher) {
    return function (source) {
        return new rxjs_1.Observable(function (destination) {
            var subscription = (0, mirror_1.mirror)(source, destination, {
                next: function (value) { return destination.next(new RxStatus_1.RxDataStatus(refresher, value)); },
                error: function (error) {
                    destination.next(new RxStatus_1.RxErroredStatus(refresher, error));
                    destination.complete();
                }
            });
            return function () { subscription.unsubscribe(); };
        });
    };
};
var reloadWithInterval = function (refresher, maxRefreshInterval) {
    var refCount = 0;
    var intervalTimer = undefined;
    return function (source) {
        return new rxjs_1.Observable(function (destination) {
            refCount++;
            var subscription = (0, mirror_1.mirror)(source, destination);
            if (!intervalTimer) {
                intervalTimer = setInterval(function () { refresher.next(undefined); }, maxRefreshInterval);
            }
            return function () {
                refCount--;
                if (refCount === 0) {
                    clearInterval(intervalTimer);
                    intervalTimer = undefined;
                }
                subscription.unsubscribe();
            };
        });
    };
};
var irx = function (refreshBehaviour) {
    if (refreshBehaviour === void 0) { refreshBehaviour = {}; }
    var emitLoading = refreshBehaviour.emitLoading || true;
    var onRefCountZero = refreshBehaviour.onRefCountZero || false;
    var minRefreshInterval = refreshBehaviour.minRefreshInterval || 0;
    var maxRefreshInterval = refreshBehaviour.maxRefreshInterval || 0;
    return function (source) {
        var refresher = new rxjs_1.Subject();
        // @TODO: handle observables that does not autocomplete by itself
        return source.pipe(toIRxStatus(refresher), reloadManually(refresher), (0, control_flow_1.pif)(emitLoading)(addLoadingStatus(refresher)), (0, rxjs_1.finalize)(function () { return console.log('FINALIZE'); }), addRefCountBehaviour(refresher, onRefCountZero, minRefreshInterval), (0, control_flow_1.pif)(maxRefreshInterval)(reloadWithInterval(refresher, maxRefreshInterval)));
    };
};
exports.irx = irx;
/**
 * Extract the data from a RxStatus
 * @param status
 */
var value = function (status) {
    return status.pipe((0, operators_1.map)(function (status) { return status.data; }));
};
exports.value = value;
/**
 * Extract the error from a RxStatus
 * @param status
 */
var error = function (status) {
    return status.pipe((0, operators_1.map)(function (status) { return status.error; }));
};
exports.error = error;
/**
 * Extract the isLoading from a RxStatus
 * @param status
 */
var isLoading = function (status) {
    return status.pipe((0, operators_1.map)(function (status) { return status.isLoading; }));
};
exports.isLoading = isLoading;
/**
 * Extract the isErrored from a RxStatus
 * @param status
 */
var isErrored = function (status) {
    return status.pipe((0, operators_1.map)(function (status) { return status.isErrored; }));
};
exports.isErrored = isErrored;
/**
 * Extract the hasData from a RxStatus
 * @param status
 */
var hasData = function (status) {
    return status.pipe((0, operators_1.map)(function (status) { return status.hasData; }));
};
exports.hasData = hasData;
/**
 * Extract the RxStatus (without data embedded) from a RxStatus
 * @param status
 */
var status = function (status) {
    return status.pipe((0, operators_1.map)(function (status) {
        return {
            error: status.error,
            isLoading: status.isLoading,
            isErrored: status.isErrored,
            hasData: status.hasData
        };
    }));
};
exports.status = status;
//# sourceMappingURL=operators.js.map