"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.defaultRxStatusRefreshBehaviour = exports.RxStatusRefreshBehaviour = exports.RxDataStatus = exports.RxErroredStatus = exports.RxLoadingStatus = exports.RxStatus = exports.defaultRxStatus = void 0;
var rxjs_1 = require("rxjs");
// import {symbols} from "./symbols";
exports.defaultRxStatus = {
    data: undefined,
    error: undefined,
    isLoading: false,
    isErrored: false,
    hasData: false,
    refresh$: undefined
};
// Class containing the status of an Observable along with his value
var RxStatus = /** @class */ (function () {
    function RxStatus(status, refresh$) {
        if (status === void 0) { status = exports.defaultRxStatus; }
        if (refresh$ === void 0) { refresh$ = new rxjs_1.BehaviorSubject(undefined); }
        Object.assign(this, __assign({}, status));
        this.refresh$ = refresh$;
    }
    RxStatus.prototype.refresh = function () { var _a; (_a = this.refresh$) === null || _a === void 0 ? void 0 : _a.next(undefined); };
    return RxStatus;
}());
exports.RxStatus = RxStatus;
var RxLoadingStatus = /** @class */ (function (_super) {
    __extends(RxLoadingStatus, _super);
    function RxLoadingStatus(refresh$, loadingCount) {
        if (refresh$ === void 0) { refresh$ = new rxjs_1.BehaviorSubject(undefined); }
        if (loadingCount === void 0) { loadingCount = 0; }
        return _super.call(this, __assign(__assign({}, exports.defaultRxStatus), { loadingCount: loadingCount, isLoading: true }), refresh$) || this;
    }
    return RxLoadingStatus;
}(RxStatus));
exports.RxLoadingStatus = RxLoadingStatus;
var RxErroredStatus = /** @class */ (function (_super) {
    __extends(RxErroredStatus, _super);
    function RxErroredStatus(refresh$, error) {
        if (refresh$ === void 0) { refresh$ = new rxjs_1.BehaviorSubject(undefined); }
        return _super.call(this, __assign(__assign({}, exports.defaultRxStatus), { error: error, isErrored: true }), refresh$) || this;
    }
    return RxErroredStatus;
}(RxStatus));
exports.RxErroredStatus = RxErroredStatus;
var RxDataStatus = /** @class */ (function (_super) {
    __extends(RxDataStatus, _super);
    function RxDataStatus(refresh$, data) {
        if (refresh$ === void 0) { refresh$ = new rxjs_1.BehaviorSubject(undefined); }
        return _super.call(this, __assign(__assign({}, exports.defaultRxStatus), { data: data, hasData: true }), refresh$) || this;
    }
    return RxDataStatus;
}(RxStatus));
exports.RxDataStatus = RxDataStatus;
// export class IRxStatus<T>{
//     [key: symbol]: any|T
//
//     constructor(status: Partial<RxStatus<T>> = {}, refresh$: BehaviorSubject<undefined> = new BehaviorSubject(undefined)) {
//         this[symbols['value']] = status.data
//         this[symbols['error']] = status.error
//         this[symbols['isLoading']] = status.isLoading
//         this[symbols['isErrored']] = status.isErrored
//         this[symbols['hasData']] = status.hasData
//         this[symbols['refresh']] = refresh$
//     }
// }
var RxStatusRefreshBehaviour = /** @class */ (function () {
    function RxStatusRefreshBehaviour() {
        this.emitLoading = true;
        this.onRefCountZero = false;
        this.minRefreshInterval = 0;
        this.maxRefreshInterval = 0;
        this.everyMilliseconds = 0;
    }
    return RxStatusRefreshBehaviour;
}());
exports.RxStatusRefreshBehaviour = RxStatusRefreshBehaviour;
exports.defaultRxStatusRefreshBehaviour = new RxStatusRefreshBehaviour();
//# sourceMappingURL=RxStatus.js.map