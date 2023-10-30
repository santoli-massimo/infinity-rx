import { Observable } from "rxjs";
import { RxStatus, RxStatusRefreshBehaviour } from "./RxStatus";
export declare const toRxStatus: <T>(observableFactoryFunction: () => Observable<T>, refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => Observable<RxStatus<T>>;
export declare const toRxStatusPairs: <T>(observableFactoryFunction: () => Observable<T>, refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => [Observable<T>, Observable<RxStatus<T>>];
