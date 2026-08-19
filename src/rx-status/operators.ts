import {
    filter,
    mergeWith,
    MonoTypeOperatorFunction,
    Observable,
    OperatorFunction,
    repeat,
    ReplaySubject,
    share,
    shareReplay,
    startWith,
    Subject,
    Subscriber,
    tap,
    TeardownLogic,
    timer
} from "rxjs";
import {RxDataStatus, RxErroredStatus, RxLoadingStatus, RxStatus, RxStatusRefreshBehaviour} from "./RxStatus";
import {map} from "rxjs/operators";
import {mirror} from "../rx-utils/mirror";
import {when} from "../rx-utils/control-flow";
import {getMeta, rxMeta} from "../rx-meta";
import {loadingToken} from "./symbols";
import {IRx} from "./IRx";


/**
 * @description
 * Emits a RxLoadingStatus immediately when the observable is subscribed or reloaded
 */
export const addLoadingStatus = <T>()=>{
    let loadingCount = 1
    return (source: Observable<T>): Observable<T> => {
        const status$ = getMeta<RxLoadingStatus>(source, 'status')
        const reloader$ = getMeta<void>(source, 'reload')
        return source.pipe(
            tap(() => loadingCount++),
            startWith(loadingToken),
            when(!!reloader$)(mergeWith(reloader$!.pipe(map(()=>loadingToken)))),
            tap(()=>status$?.next(new RxLoadingStatus(loadingCount))),
            filter((value: any)=>value !== loadingToken),
        )
    }
}


/**
 * @description
 * Emits a RxDataStatus when the observable emits a value
 */
export const addDataStatus = <T>()=>
    (source: Observable<T>): Observable<T> => {
        const status$ = getMeta<RxLoadingStatus>(source, 'status')
        return source.pipe(tap(()=>status$?.next(new RxDataStatus())),)
    }


/**
 * @description
 * Repeat the observable when the reload subject emits
 */
export const reloadBehaviour = <T>(): OperatorFunction<T, T> =>
    (source: Observable<T>): Observable<T> => {
        const reloader$ = getMeta<void>(source, 'reload')
        return reloader$
            ? source.pipe(repeat({delay: () => reloader$}))
            : source
    }


/**
 * @description
 * Reset the observable when the ref count is zero if onRefCountZero is true
 * If minRefreshInterval is true, wait for the specified time before resetting the observable,
 * this is useful to avoid too many reloads
 * @param onRefCountZero
 * @param minRefreshInterval
 */
export const addRefCountBehaviour = <T>(onRefCountZero:boolean, minRefreshInterval:number): OperatorFunction<T, T> =>{
    let resetTimer : Observable<number>

    return (source: Observable<T>): Observable<T> => {
        return source.pipe(
            tap((status: T) => {
                if(!!minRefreshInterval){ resetTimer = timer(minRefreshInterval).pipe(shareReplay(1)) }
            }),
            share<T>({
                connector: () => new ReplaySubject<T>(1),
                resetOnRefCountZero: onRefCountZero
                    ? ()=> resetTimer || timer(0)
                    : false
            })
        )
    }
}


/**
 * @description
 * Handle error by emitting a RxErroredStatus
 * Unsubscribe from all the subscriptions when the observable is completed
 */
export const toIRxStatus = <T>(): OperatorFunction<T, T> => {
    return (source: Observable<T>): Observable<T> => {
        return new Observable<T>((destination: Subscriber<T>) => {
            let subscription = mirror(source, destination, {
                next: (value: T) => destination.next(value),
                error: (error: any) => {
                    getMeta<RxStatus>(source, 'status')?.next(new RxErroredStatus(error))
                    destination.complete()
                },
            })
            return () => { subscription.unsubscribe() };
        })
    }
}


/**
 * @description
 * ### Reload periodically the source, only when there is at least one subscription
 * Each source observable emission will reset the timer, also if the reload is triggered manually
 * @param maxRefreshInterval
 */
export const reloadWithInterval = <T>(maxRefreshInterval: number): MonoTypeOperatorFunction<T> =>{
    let refCount= 0
    // let intervalTimer : NodeJS.Timeout | undefined = undefined
    // @TODO: find the right type that works in both node and browser
    let intervalTimer : NodeJS.Timeout | undefined = undefined
    const resetInterval = (reloader: Subject<any>, currentInterval: NodeJS.Timeout) => {
        clearInterval(currentInterval)
        return setInterval(()=>{reloader?.next(undefined)}, maxRefreshInterval)
    }

    return (source: Observable<T>): Observable<T> => {
        const reloader = getMeta<void>(source, 'reload')
        return new Observable<T>((destination: Subscriber<T>) : TeardownLogic => {
            refCount++
            intervalTimer = intervalTimer || resetInterval(reloader!, intervalTimer!)

            let subscription = mirror(source, {
                ...destination,
                next: (value: T) => {
                    intervalTimer = resetInterval(reloader!, intervalTimer!)
                    destination.next(value)
                }
            } as Subscriber<T>)

            return () => {
                refCount--
                if(refCount === 0){
                    clearInterval(intervalTimer)
                    intervalTimer = undefined
                }
                subscription.unsubscribe()
            };
        })
    }
}


/**
 * @description
 * Creates an IRx observable from a source observable
 * @param refreshBehaviour
 */
export const irx = <T>(refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : OperatorFunction<T, T> =>
    (source: Observable<T>): Observable<T> =>  IRx(source, refreshBehaviour)
