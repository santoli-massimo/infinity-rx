import { first, merge, of, repeat, ReplaySubject, share, shareReplay, startWith, Subject, switchMap, tap, timer } from "rxjs";
import { defaultRxStatus, RxStatus } from "./RxStatus";
import { catchError, map } from "rxjs/operators";
/**
 * Extract the data from a RxStatus
 * @param status
 */
export const value = (status) => {
    return status.pipe(map(status => status.data));
};
/**
 * Extract the error from a RxStatus
 * @param status
 */
export const error = (status) => {
    return status.pipe(map(status => status.error));
};
/**
 * Extract the isLoading from a RxStatus
 * @param status
 */
export const isLoading = (status) => {
    return status.pipe(map(status => status.isLoading));
};
/**
 * Extract the isErrored from a RxStatus
 * @param status
 */
export const isErrored = (status) => {
    return status.pipe(map(status => status.isErrored));
};
/**
 * Extract the hasData from a RxStatus
 * @param status
 */
export const hasData = (status) => {
    return status.pipe(map(status => status.hasData));
};
/**
 * Extract the refresh function from a RxStatus
 * @param status
 */
export const refresh = (status) => {
    return status.pipe(map(status => status.refresh));
};
const toLoadingStatus = (refresher) => new RxStatus({ ...defaultRxStatus, isLoading: true }, refresher);
const toErrorStatus = (error, refresher) => new RxStatus({ ...defaultRxStatus, isErrored: true, error: error }, refresher);
const toDataStatus = (data, refresher) => new RxStatus({ ...defaultRxStatus, data: data, hasData: true }, refresher);
export const reload = (status) => status.pipe(first()).subscribe((status) => status.refresh());
const toIRx = (refresher) => {
    return (source) => {
        return source.pipe(switchMap(() => merge(refresher.pipe(map(() => toLoadingStatus(refresher))), source.pipe(map((value) => toDataStatus(value, refresher)), catchError((err) => of(toErrorStatus(err, refresher)))))));
    };
};
const addReloadBehaviour = (refresher) => {
    return (source) => {
        return source.pipe(share({
            connector: () => new ReplaySubject(1),
            resetOnError: true,
            resetOnComplete: true,
        }), repeat({ count: Infinity, delay: () => refresher }));
    };
};
const addRefCountBehaviour = (refresher, refreshBehaviour = {}) => {
    let resetTimer;
    return (source) => {
        return source.pipe(tap((status) => {
            if (refreshBehaviour.minRefreshInterval)
                resetTimer = timer(refreshBehaviour.minRefreshInterval).pipe(shareReplay(1));
        }), share({
            connector: () => new ReplaySubject(1),
            resetOnRefCountZero: refreshBehaviour.onRefCountZero
                ? () => resetTimer || timer(0)
                : false
        }));
    };
};
export const irx = (refreshBehaviour = {}) => {
    const refresher$ = new Subject();
    return (source) => {
        return source.pipe(addReloadBehaviour(refresher$), toIRx(refresher$), addRefCountBehaviour(refresher$, refreshBehaviour), startWith(toLoadingStatus(refresher$)));
    };
};
//# sourceMappingURL=operators.js.map