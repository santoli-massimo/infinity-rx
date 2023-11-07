import {
    concatMap,
    first, interval,
    merge, mergeMap,
    Observable,
    of,
    OperatorFunction,
    repeat,
    ReplaySubject,
    share,
    shareReplay,
    startWith,
    Subject,
    switchMap, takeUntil,
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
 * Extract the RxStatus (without data embedded) from a RxStatus
 * @param status
 */
export const status = <T>(status: Observable<RxStatus<T>>)=>{
    return status.pipe(map(status=> {
        return {
            error: status.error,
            isLoading: status.isLoading,
            isErrored: status.isErrored,
            hasData: status.hasData,
        }
    }))
}


/**
 * FACTORIES
 * */

const toLoadingStatus = <T>(refresher: Subject<undefined>): RxStatus<T> => new RxStatus<T>({...defaultRxStatus, isLoading: true}, refresher)
const toErrorStatus = <T>(error: any, refresher: Subject<undefined>): RxStatus<T> => new RxStatus<T>({...defaultRxStatus, isErrored: true, error: error}, refresher)
const toDataStatus = <T>(data: T, refresher: Subject<undefined>): RxStatus<T> => new RxStatus<T>({...defaultRxStatus, data: data, hasData: true}, refresher)
export const reload = <T>(status: Observable<RxStatus<T>>)=> status.pipe(first()).subscribe((status: RxStatus<T>)=>status.refresh())


/**
 * CORE
 * */

const toIRx = <T>(refresher: Subject<undefined>): OperatorFunction<T, RxStatus<T>> =>{
    return (source: Observable<T>): Observable<RxStatus<T>> => {
        return source.pipe(
            mergeMap(()=>
                // merge<[RxStatus<T>, RxStatus<T>]>(
                //     refresher.pipe(map(()=>toLoadingStatus<T>(refresher))),
                    source.pipe(
                        map((value: T):RxStatus<T>=>toDataStatus<T>(value, refresher)),
                        catchError((err:any)=>of(toErrorStatus<T>(err, refresher))),
                    )
                // )
            )
        )
    }
}


const addReloadBehaviour = <T>(refresher: Observable<undefined>): OperatorFunction<T, T> =>{
    let connector = new ReplaySubject<T>(1)

    return (source: Observable<T>): Observable<T> =>
        source.pipe(
            share<T>({
                connector: () => new ReplaySubject<T>(1),
                // connector: () => connector,
                resetOnError: true,
                resetOnComplete: true,
            }),
            repeat({count: Infinity, delay: ()=>refresher}),
        )
}




const addRefCountBehaviour = <T>(refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}): OperatorFunction<RxStatus<T>, RxStatus<T>> =>{
    let resetTimer : Observable<number>

    return (source: Observable<RxStatus<T>>): Observable<RxStatus<T>> => {
        return source.pipe(
            tap((status: RxStatus<T>) => {
                resetTimer = !refreshBehaviour.minRefreshInterval
                    ? resetTimer
                    : timer(refreshBehaviour.minRefreshInterval).pipe(shareReplay(1))}
            ),
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
    const refresher: Subject<undefined> = new Subject()
    const refreshInterval : Observable<undefined> = interval(5000).pipe(map(()=>undefined))

    // refreshInterval.subscribe(refresher)

    return (source: Observable<T>): Observable<RxStatus<T>> =>
        source.pipe(
            addReloadBehaviour<T>(refresher),
            toIRx(refresher),
            startWith(toLoadingStatus<T>(refresher)),
            addRefCountBehaviour(refreshBehaviour),
        )
}
