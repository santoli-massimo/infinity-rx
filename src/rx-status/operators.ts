import {
    finalize,
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
import {pif} from "../rx-utils/control-flow";


/**
 * CORE
 * */
const addLoadingStatus = <T>(refresher: Subject<undefined>)=>{
    let loadingCount= 1
    return (source: Observable<RxStatus<T>>): Observable<RxStatus<T>> => {
        return source.pipe(
            tap(() => loadingCount++),
            mergeWith(refresher.pipe(map(()=>new RxLoadingStatus<T>(refresher, loadingCount)))),
            startWith(new RxLoadingStatus<T>(refresher, loadingCount)),
        )
    }
}


const reloadManually = <T>(refresher: Subject<undefined>): OperatorFunction<T, T> =>{
    return (source: Observable<T>): Observable<T> =>{
        return source.pipe(repeat({delay: ()=>refresher}))
    }
}


const addRefCountBehaviour = <T>(refresher: Subject<undefined>, onRefCountZero:boolean, minRefreshInterval:number): OperatorFunction<T, T> =>{
    let resetTimer : Observable<number>

    return (source: Observable<T>): Observable<T> => {
        return source.pipe(
            tap((status: T) => {
                if(!!minRefreshInterval){ resetTimer = timer(minRefreshInterval).pipe(shareReplay(1)) }
            }),
            share<T>({
                connector: () => new ReplaySubject<T>(1),
                resetOnRefCountZero: onRefCountZero
                    ? ()=>{
                        console.log('Ref count zero')
                        return resetTimer || timer(0)
                    }
                    : false
            })
        )
    }
}


const toIRxStatus = <T>(refresher: Subject<undefined>): OperatorFunction<T, RxStatus<T>> => {
    return (source: Observable<T>): Observable<RxStatus<T>> => {
        return new Observable<RxStatus<T>>((destination: Subscriber<RxStatus<T>>) => {
            let subscription = mirror(source, destination, {
                next: (value: T) => destination.next(new RxDataStatus<T>(refresher, value)),
                error: (error: any) => {
                    destination.next(new RxErroredStatus<T>(refresher, error))
                    destination.complete()
                },
            })
            return () => { subscription.unsubscribe() };
        })
    }
}


const reloadWithInterval = <T>(refresher: Subject<undefined>, maxRefreshInterval: number): MonoTypeOperatorFunction<T> =>{
    let refCount= 0
    let intervalTimer : NodeJS.Timeout | undefined = undefined

    return (source: Observable<T>): Observable<T> => {
        return new Observable<T>((destination: Subscriber<T>) : TeardownLogic => {
            refCount++
            let subscription = mirror(source, destination)

            if(!intervalTimer){ intervalTimer = setInterval(()=>{refresher.next(undefined)}, maxRefreshInterval)}

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


export const irx = <T>(refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : OperatorFunction<T, RxStatus<T>> => {
    let emitLoading = refreshBehaviour.emitLoading || true
    let onRefCountZero = refreshBehaviour.onRefCountZero || false
    let minRefreshInterval = refreshBehaviour.minRefreshInterval || 0
    let maxRefreshInterval = refreshBehaviour.maxRefreshInterval || 0

    return (source: Observable<T>): Observable<RxStatus<T>> => {
        const refresher: Subject<undefined> = new Subject()

        // @TODO: handle observables that does not autocomplete by itself
        return source.pipe(
            toIRxStatus(refresher),
            reloadManually(refresher),
            pif(emitLoading)(addLoadingStatus(refresher)),
            finalize(()=>console.log('FINALIZE')),
            addRefCountBehaviour(refresher, onRefCountZero!, minRefreshInterval),
            pif(maxRefreshInterval)(reloadWithInterval(refresher, maxRefreshInterval))
        )
    }
}



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
