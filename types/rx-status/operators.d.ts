import { Observable, OperatorFunction } from "rxjs";
import { RxStatus, RxStatusRefreshBehaviour } from "./RxStatus";
/**
 * Extract the data from a RxStatus
 * @param status
 */
export declare const value: <T>(status: Observable<RxStatus<T>>) => Observable<T | undefined>;
/**
 * Extract the error from a RxStatus
 * @param status
 */
export declare const error: <T>(status: Observable<RxStatus<T>>) => Observable<any>;
/**
 * Extract the isLoading from a RxStatus
 * @param status
 */
export declare const isLoading: <T>(status: Observable<RxStatus<T>>) => Observable<boolean | undefined>;
/**
 * Extract the isErrored from a RxStatus
 * @param status
 */
export declare const isErrored: <T>(status: Observable<RxStatus<T>>) => Observable<boolean | undefined>;
/**
 * Extract the hasData from a RxStatus
 * @param status
 */
export declare const hasData: <T>(status: Observable<RxStatus<T>>) => Observable<boolean | undefined>;
/**
 * Extract the refresh function from a RxStatus
 * @param status
 */
export declare const refresh: <T>(status: Observable<RxStatus<T>>) => Observable<() => void>;
export declare const reload: <T>(status: Observable<RxStatus<T>>) => import("rxjs").Subscription;
export declare const irx: <T>(refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => OperatorFunction<T, RxStatus<T>>;
