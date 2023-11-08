import { BehaviorSubject, Subject } from "rxjs";
export declare const defaultRxStatus: any;
export declare class RxStatus<T> {
    constructor(status?: Partial<RxStatus<T>>, refresh$?: BehaviorSubject<undefined> | Subject<undefined>);
    private refresh$?;
    readonly data?: T;
    readonly error?: any;
    readonly isLoading?: boolean;
    readonly loadingCount?: number;
    readonly isErrored?: boolean;
    readonly hasData?: boolean;
    refresh(): void;
}
export declare class RxLoadingStatus<T> extends RxStatus<T> {
    constructor(refresh$?: BehaviorSubject<undefined> | Subject<undefined>, loadingCount?: number);
}
export declare class RxErroredStatus<T> extends RxStatus<T> {
    constructor(refresh$: Subject<undefined> | BehaviorSubject<undefined> | undefined, error: any);
}
export declare class RxDataStatus<T> extends RxStatus<T> {
    constructor(refresh$: Subject<undefined> | BehaviorSubject<undefined> | undefined, data: T);
}
export declare class RxStatusRefreshBehaviour {
    emitLoading?: boolean;
    onRefCountZero?: boolean;
    minRefreshInterval?: number;
    maxRefreshInterval?: number;
    everyMilliseconds?: number;
}
export declare const defaultRxStatusRefreshBehaviour: RxStatusRefreshBehaviour;
