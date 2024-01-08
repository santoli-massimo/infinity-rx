import { filter, mergeWith, Observable, repeat, ReplaySubject, share, shareReplay, startWith, tap, timer } from "rxjs";
import { RxDataStatus, RxErroredStatus, RxLoadingStatus } from "./RxStatus";
import { map } from "rxjs/operators";
import { mirror } from "../rx-utils/mirror";
import { when } from "../rx-utils/control-flow";
import { getMeta } from "../rx-meta";
import { loadingToken } from "./symbols";
import { IRx } from "./IRx";
/**
 * @description
 * Emits a RxLoadingStatus immediately when the observable is subscribed or reloaded
 */
export const addLoadingStatus = () => {
    let loadingCount = 1;
    return (source) => {
        const status = getMeta(source, 'status');
        const reloader = getMeta(source, 'reload');
        return source.pipe(tap(() => loadingCount++), startWith(loadingToken), when(!!reloader)(mergeWith(reloader.pipe(map(() => loadingToken)))), tap(() => status?.next(new RxLoadingStatus(loadingCount))), filter((value) => value !== loadingToken));
    };
};
/**
 * @description
 * Emits a RxDataStatus when the observable emits a value
 */
export const addDataStatus = () => (source) => {
    const status = getMeta(source, 'status');
    return source.pipe(tap(() => status?.next(new RxDataStatus())));
};
/**
 * @description
 * Repeat the observable when the reload subject emits
 */
export const reloadBehaviour = () => (source) => {
    const reloader = getMeta(source, 'reload');
    return reloader
        ? source.pipe(repeat({ delay: () => reloader }))
        : source;
};
/**
 * @description
 * Reset the observable when the ref count is zero if onRefCountZero is true
 * If minRefreshInterval is true, wait for the specified time before resetting the observable,
 * this is useful to avoid too many reloads
 * @param onRefCountZero
 * @param minRefreshInterval
 */
export const addRefCountBehaviour = (onRefCountZero, minRefreshInterval) => {
    let resetTimer;
    return (source) => {
        return source.pipe(tap((status) => {
            if (!!minRefreshInterval) {
                resetTimer = timer(minRefreshInterval).pipe(shareReplay(1));
            }
        }), share({
            connector: () => new ReplaySubject(1),
            resetOnRefCountZero: onRefCountZero
                ? () => {
                    console.log('Ref count zero');
                    return resetTimer || timer(0);
                }
                : false
        }));
    };
};
/**
 * @description
 * Handle error by emitting a RxErroredStatus
 * Unsubscribe from all the subscriptions when the observable is completed
 */
export const toIRxStatus = () => {
    return (source) => {
        return new Observable((destination) => {
            let subscription = mirror(source, destination, {
                next: (value) => destination.next(value),
                error: (error) => {
                    getMeta(source, 'status')?.next(new RxErroredStatus(error));
                    destination.complete();
                },
            });
            return () => { subscription.unsubscribe(); };
        });
    };
};
/**
 * @description
 * ### Reload periodically the source, only when there is at least one subscription
 * Each source observable emission will reset the timer, also if the reload is triggered manually
 * @param maxRefreshInterval
 */
export const reloadWithInterval = (maxRefreshInterval) => {
    let refCount = 0;
    // let intervalTimer : NodeJS.Timeout | undefined = undefined
    // @TODO: find the right type that works in both node and browser
    let intervalTimer = undefined;
    const resetInterval = (reloader, currentInterval) => {
        clearInterval(currentInterval);
        return setInterval(() => { reloader?.next(undefined); }, maxRefreshInterval);
    };
    return (source) => {
        const reloader = getMeta(source, 'reload');
        return new Observable((destination) => {
            refCount++;
            intervalTimer = intervalTimer || resetInterval(reloader, intervalTimer);
            let subscription = mirror(source, {
                ...destination,
                next: (value) => {
                    intervalTimer = resetInterval(reloader, intervalTimer);
                    destination.next(value);
                }
            });
            return () => {
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
/**
 * @description
 * Creates an IRx observable from a source observable
 * @param refreshBehaviour
 */
export const irx = (refreshBehaviour = {}) => (source) => IRx(source, refreshBehaviour);
//# sourceMappingURL=operators.js.map