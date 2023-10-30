import { BehaviorSubject } from "rxjs";
// import {symbols} from "./symbols";
export const defaultRxStatus = {
    data: undefined,
    error: undefined,
    isLoading: false,
    isErrored: false,
    hasData: false,
    refresh$: undefined
};
// Class containing the status of an Observable along with his value
export class RxStatus {
    constructor(status = defaultRxStatus, refresh$ = new BehaviorSubject(undefined)) {
        Object.assign(this, { ...status });
        this.refresh$ = refresh$;
    }
    refresh() { this.refresh$?.next(undefined); }
}
// export class IRxStatus<T>{
//     [key: symbol]: any|T
//
//     constructor(status: Partial<RxStatus<T>> = {}, refresh$: BehaviorSubject<undefined> = new BehaviorSubject(undefined)) {
//         this[symbols['value']] = status.data
//         this[symbols['error']] = status.error
//         this[symbols['isLoading']] = status.isLoading
//         this[symbols['isErrored']] = status.isErrored
//         this[symbols['hasData']] = status.hasData
//         this[symbols['refresh']] = refresh$
//     }
// }
export class RxStatusRefreshBehaviour {
    constructor() {
        this.onRefCountZero = false;
        this.minRefreshInterval = 0;
        this.maxRefreshInterval = 0;
        this.everyMilliseconds = 0;
    }
}
//# sourceMappingURL=RxStatus.js.map