import { finalize, mergeWith, Observable, repeat, ReplaySubject, share, shareReplay, startWith, Subject, tap, timer } from "rxjs";
import { RxDataStatus, RxErroredStatus, RxLoadingStatus } from "./RxStatus";
import { map } from "rxjs/operators";
import { mirror } from "../rx-utils/mirror";
import { pif } from "../rx-utils/control-flow";
/**
 * CORE
 * */
const addLoadingStatus = (refresher) => {
    let loadingCount = 1;
    return (source) => {
        return source.pipe(tap(() => loadingCount++), mergeWith(refresher.pipe(map(() => new RxLoadingStatus(refresher, loadingCount)))), startWith(new RxLoadingStatus(refresher, loadingCount)));
    };
};
const reloadManually = (refresher) => {
    return (source) => {
        return source.pipe(repeat({ delay: () => refresher }));
    };
};
const addRefCountBehaviour = (refresher, onRefCountZero, minRefreshInterval) => {
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
const toIRxStatus = (refresher) => {
    return (source) => {
        return new Observable((destination) => {
            let subscription = mirror(source, destination, {
                next: (value) => destination.next(new RxDataStatus(refresher, value)),
                error: (error) => {
                    destination.next(new RxErroredStatus(refresher, error));
                    destination.complete();
                },
            });
            return () => { subscription.unsubscribe(); };
        });
    };
};
const reloadWithInterval = (refresher, maxRefreshInterval) => {
    let refCount = 0;
    let intervalTimer = undefined;
    return (source) => {
        return new Observable((destination) => {
            refCount++;
            let subscription = mirror(source, destination);
            if (!intervalTimer) {
                intervalTimer = setInterval(() => { refresher.next(undefined); }, maxRefreshInterval);
            }
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
export const irx = (refreshBehaviour = {}) => {
    let emitLoading = refreshBehaviour.emitLoading || true;
    let onRefCountZero = refreshBehaviour.onRefCountZero || false;
    let minRefreshInterval = refreshBehaviour.minRefreshInterval || 0;
    let maxRefreshInterval = refreshBehaviour.maxRefreshInterval || 0;
    return (source) => {
        const refresher = new Subject();
        // @TODO: handle observables that does not autocomplete by itself
        return source.pipe(toIRxStatus(refresher), reloadManually(refresher), pif(emitLoading)(addLoadingStatus(refresher)), finalize(() => console.log('FINALIZE')), addRefCountBehaviour(refresher, onRefCountZero, minRefreshInterval), pif(maxRefreshInterval)(reloadWithInterval(refresher, maxRefreshInterval)));
    };
};
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
 * Extract the RxStatus (without data embedded) from a RxStatus
 * @param status
 */
export const status = (status) => {
    return status.pipe(map(status => {
        return {
            error: status.error,
            isLoading: status.isLoading,
            isErrored: status.isErrored,
            hasData: status.hasData,
        };
    }));
};
//# sourceMappingURL=operators.js.map