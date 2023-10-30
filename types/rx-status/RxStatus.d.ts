import { BehaviorSubject, Subject } from "rxjs";
export declare const defaultRxStatus: any;
export declare class RxStatus<T> {
    constructor(status?: Partial<RxStatus<T>>, refresh$?: BehaviorSubject<undefined> | Subject<undefined>);
    private refresh$?;
    readonly data?: T;
    readonly error?: any;
    readonly isLoading?: boolean;
    readonly isErrored?: boolean;
    readonly hasData?: boolean;
    refresh(): void;
}
export declare class RxStatusRefreshBehaviour {
    onRefCountZero?: boolean;
    minRefreshInterval?: number;
    maxRefreshInterval?: number;
    everyMilliseconds?: number;
}
