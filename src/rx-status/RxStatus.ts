import {BehaviorSubject, Subject} from "rxjs";
// import {symbols} from "./symbols";

export const defaultRxStatus:any = {
    data: undefined,
    error: undefined,
    isLoading: false,
    isErrored: false,
    hasData: false,
    refresh$: undefined
}


// Class containing the status of an Observable along with his value
export class RxStatus<T>{
    constructor(status: Partial<RxStatus<T>> = defaultRxStatus, refresh$: BehaviorSubject<undefined>|Subject<undefined> = new BehaviorSubject(undefined)) {
        Object.assign(this, {...status})
        this.refresh$ = refresh$
    }
    private refresh$? : Subject<undefined>

    public readonly data?: T
    public readonly error?: any
    public readonly isLoading?: boolean
    public readonly loadingCount?: number
    public readonly isErrored?: boolean
    public readonly hasData?: boolean
    public refresh():void {this.refresh$?.next(undefined)}
}

export class RxLoadingStatus<T> extends RxStatus<T>{
    constructor(refresh$: BehaviorSubject<undefined>|Subject<undefined> = new BehaviorSubject(undefined), loadingCount: number=0) {
        super({...defaultRxStatus, loadingCount, isLoading: true, }, refresh$)
    }
}

export class RxErroredStatus<T> extends RxStatus<T>{
    constructor(refresh$: BehaviorSubject<undefined>|Subject<undefined> = new BehaviorSubject(undefined), error: any) {
        super({...defaultRxStatus, error, isErrored: true}, refresh$)
    }
}

export class RxDataStatus<T> extends RxStatus<T>{
    constructor(refresh$: BehaviorSubject<undefined>|Subject<undefined> = new BehaviorSubject(undefined), data: T) {
        super({...defaultRxStatus, data, hasData: true}, refresh$)
    }
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
    emitLoading?: boolean = true
    onRefCountZero?: boolean = false
    minRefreshInterval?: number = 0
    maxRefreshInterval?: number = 0
    everyMilliseconds?: number = 0
}

export const defaultRxStatusRefreshBehaviour = new RxStatusRefreshBehaviour()
