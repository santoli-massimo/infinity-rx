import { MonoTypeOperatorFunction, Observable, OperatorFunction } from "rxjs";
import { RxStatusRefreshBehaviour } from "./RxStatus";
/**
 * @description
 * Emits a RxLoadingStatus immediately when the observable is subscribed or reloaded
 */
export declare const addLoadingStatus: <T>() => (source: Observable<T>) => Observable<T>;
/**
 * @description
 * Emits a RxDataStatus when the observable emits a value
 */
export declare const addDataStatus: <T>() => (source: Observable<T>) => Observable<T>;
/**
 * @description
 * Repeat the observable when the reload subject emits
 */
export declare const reloadBehaviour: <T>() => OperatorFunction<T, T>;
/**
 * @description
 * Reset the observable when the ref count is zero if onRefCountZero is true
 * If minRefreshInterval is true, wait for the specified time before resetting the observable,
 * this is useful to avoid too many reloads
 * @param onRefCountZero
 * @param minRefreshInterval
 */
export declare const addRefCountBehaviour: <T>(onRefCountZero: boolean, minRefreshInterval: number) => OperatorFunction<T, T>;
/**
 * @description
 * Handle error by emitting a RxErroredStatus
 * Unsubscribe from all the subscriptions when the observable is completed
 */
export declare const toIRxStatus: <T>() => OperatorFunction<T, T>;
/**
 * @description
 * ### Reload periodically the source, only when there is at least one subscription
 * Each source observable emission will reset the timer, also if the reload is triggered manually
 * @param maxRefreshInterval
 */
export declare const reloadWithInterval: <T>(maxRefreshInterval: number) => MonoTypeOperatorFunction<T>;
/**
 * @description
 * Creates an IRx observable from a source observable
 * @param refreshBehaviour
 */
export declare const irx: <T>(refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => OperatorFunction<T, T>;
