import { BehaviorSubject, concatMap, interval, merge, mergeMap, of, ReplaySubject, share, shareReplay, tap, timer } from "rxjs";
import { RxStatusFactory } from "./RxStatusFactory";
import { catchError, filter, map } from "rxjs/operators";
import { RxStatusRefreshBehaviour } from "./RxStatus";
const _toIRX = (observableFactoryFunction, refreshBehaviour = {}) => {
    const refresher$ = new BehaviorSubject(undefined);
    const statusFactory = new RxStatusFactory(refresher$);
    refreshBehaviour = { ...new RxStatusRefreshBehaviour(), ...refreshBehaviour };
    let resetTimer;
    let intervalTimer$ = (!!refreshBehaviour.maxRefreshInterval ?
        merge(timer(0), interval(refreshBehaviour.maxRefreshInterval)) : timer(0));
    // return refresher$.pipe(
    return refresher$.pipe(
    // Turn the refresh$ value into a RxStatus
    mergeMap(() => !!refreshBehaviour.maxRefreshInterval ? intervalTimer$ : of(undefined)), 
    // mergeMap(()=>merge(
    // concatMap(()=>merge(
    concatMap(() => merge(of(statusFactory.newLoadingStatus()), observableFactoryFunction().pipe(map((value) => statusFactory.newDataStatus(value)), catchError((err) => of(statusFactory.newErrorStatus(err)))))), tap((status) => {
        if (refreshBehaviour.minRefreshInterval)
            resetTimer = timer(refreshBehaviour.minRefreshInterval).pipe(shareReplay(1));
    }), 
    // // Share and Replay the last value
    share({
        connector: () => new ReplaySubject(1),
        resetOnError: true,
        resetOnComplete: true,
        resetOnRefCountZero: refreshBehaviour.onRefCountZero
            ? () => resetTimer || timer(0)
            : false
    }));
};
export const irx = (observableFactoryFunction, refreshBehaviour = {}) => {
    return _toIRX(observableFactoryFunction, refreshBehaviour);
};
export const irxPairs = (observableFactoryFunction, refreshBehaviour = {}) => {
    const _RxStatus = _toIRX(observableFactoryFunction, refreshBehaviour);
    return [
        _RxStatus.pipe(filter(({ data }) => data !== undefined), map((rxStatus) => rxStatus.data)),
        _RxStatus
    ];
};
//# sourceMappingURL=irx.js.map