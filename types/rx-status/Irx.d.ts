import { Observable } from "rxjs";
import { RxStatus, RxStatusRefreshBehaviour } from "./RxStatus";
export declare const irx: <T>(observableFactoryFunction: () => Observable<T>, refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => Observable<RxStatus<T>>;
export declare const irxPairs: <T>(observableFactoryFunction: () => Observable<T>, refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => [Observable<T>, Observable<RxStatus<T>>];
