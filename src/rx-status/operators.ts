import {
    first,
    merge,
    Observable,
    of,
    OperatorFunction,
    repeat,
    ReplaySubject,
    share,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    tap,
    timer
} from "rxjs";
import {defaultRxStatus, RxStatus, RxStatusRefreshBehaviour} from "./RxStatus";
import {catchError, map} from "rxjs/operators";


/**
 * Extract the data from a RxStatus
 * @param status
 */
export const value = <T>(status: Observable<RxStatus<T>>)=>{
    return status.pipe(map(status=> status.data))
}

/**
 * Extract the error from a RxStatus
 * @param status
 */
export const error = <T>(status: Observable<RxStatus<T>>)=>{
    return status.pipe(map(status=> status.error))
}

/**
 * Extract the isLoading from a RxStatus
 * @param status
 */
export const isLoading = <T>(status: Observable<RxStatus<T>>)=>{
    return status.pipe(map(status=> status.isLoading))
}

/**
 * Extract the isErrored from a RxStatus
 * @param status
 */
export const isErrored = <T>(status: Observable<RxStatus<T>>)=>{
    return status.pipe(map(status=> status.isErrored))
}

/**
 * Extract the hasData from a RxStatus
 * @param status
 */
export const hasData = <T>(status: Observable<RxStatus<T>>)=>{
    return status.pipe(map(status=> status.hasData))
}

/**
 * Extract the refresh function from a RxStatus
 * @param status
 */
export const refresh = <T>(status: Observable<RxStatus<T>>)=>{
    return status.pipe(map(status => status.refresh))
}




const toLoadingStatus = <T>(refresher: Subject<undefined>): RxStatus<T> => new RxStatus<T>({...defaultRxStatus, isLoading: true}, refresher)
const toErrorStatus = <T>(error: any, refresher: Subject<undefined>): RxStatus<T> => new RxStatus<T>({...defaultRxStatus, isErrored: true, error: error}, refresher)
const toDataStatus = <T>(data: T, refresher: Subject<undefined>): RxStatus<T> => new RxStatus<T>({...defaultRxStatus, data: data, hasData: true}, refresher)
export const reload = <T>(status: Observable<RxStatus<T>>)=> status.pipe(first()).subscribe((status: RxStatus<T>)=>status.refresh())

const toIRx = <T>(refresher: Subject<undefined>): OperatorFunction<T, RxStatus<T>> =>{
    return (source: Observable<T>): Observable<RxStatus<T>> => {
        return source.pipe(
            switchMap(()=>
                merge<[RxStatus<T>, RxStatus<T>]>(
                    refresher.pipe(map(()=>toLoadingStatus<T>(refresher))),
                    source.pipe(
                        map((value: T):RxStatus<T>=>toDataStatus<T>(value, refresher)),
                        catchError((err:any)=>of(toErrorStatus<T>(err, refresher))),
                    )
                )
            )
        )
    }
}

const addReloadBehaviour = <T>(refresher: Subject<undefined>): OperatorFunction<T, T> =>{
    return (source: Observable<T>): Observable<T> => {
        return source.pipe(
            share<T>({
                connector: () => new ReplaySubject<T>(1),
                resetOnError: true,
                resetOnComplete: true,
            }),
            repeat({count: Infinity, delay: ()=>refresher}),
        )
    }
}

const addRefCountBehaviour = <T>(refresher: Subject<undefined>, refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}): OperatorFunction<RxStatus<T>, RxStatus<T>> =>{
    let resetTimer : Observable<number>

    return (source: Observable<RxStatus<T>>): Observable<RxStatus<T>> => {
        return source.pipe(
            tap((status: RxStatus<T>) => {
                if(refreshBehaviour.minRefreshInterval) resetTimer = timer(refreshBehaviour.minRefreshInterval).pipe(shareReplay(1))
            }),
            share<RxStatus<T>>({
                connector: () => new ReplaySubject<RxStatus<T>>(1),
                resetOnRefCountZero: refreshBehaviour.onRefCountZero
                    ? ()=>resetTimer || timer(0)
                    : false
            }),
        )
    }
}

export const irx = <T>(refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : OperatorFunction<T, RxStatus<T>> => {
    const refresher$:Subject<undefined> = new Subject()

    return (source: Observable<T>): Observable<RxStatus<T>> =>{
        return source.pipe(
            addReloadBehaviour<T>(refresher$),
            toIRx(refresher$),
            addRefCountBehaviour(refresher$, refreshBehaviour),
            startWith(toLoadingStatus<T>(refresher$))
        )
    }

}
