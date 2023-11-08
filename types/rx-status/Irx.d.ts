import { Observable } from "rxjs";
import { RxStatus, RxStatusRefreshBehaviour } from "./RxStatus";
export declare const IRx: <T>(source: Observable<T>, refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => Observable<RxStatus<T>>;
export declare const reload: <T>(status: Observable<RxStatus<T>>) => import("rxjs").Subscription;
