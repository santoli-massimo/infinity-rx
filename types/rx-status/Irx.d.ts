import { Observable } from "rxjs";
import { RxStatus, RxStatusRefreshBehaviour } from "./RxStatus";
export declare const IRx: <T>(source: Observable<T>, refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => Observable<RxStatus<T>>;
