import { Observable } from "rxjs";
import { RxStatusRefreshBehaviour } from "./RxStatus";
export declare const IRx: <T>(source: Observable<T>, refreshBehaviour?: Partial<RxStatusRefreshBehaviour>) => Observable<T>;
export declare const reload: (status: Observable<any>) => void;
