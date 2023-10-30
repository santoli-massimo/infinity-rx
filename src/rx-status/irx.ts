import {
    BehaviorSubject,
    concatMap,
    interval,
    merge,
    mergeMap,
    Observable,
    of,
    ReplaySubject,
    share,
    shareReplay,
    tap,
    timer
} from "rxjs";
import {RxStatusFactory} from "./RxStatusFactory";
import {catchError, filter, map} from "rxjs/operators";
import {RxStatus, RxStatusRefreshBehaviour} from "./RxStatus";


const _toIRX = <T>(observableFactoryFunction: ()=>Observable<T>, refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : Observable<RxStatus<T>> => {
    const refresher$:BehaviorSubject<undefined> = new BehaviorSubject(undefined)
    const statusFactory:RxStatusFactory<T> = new RxStatusFactory(refresher$)
    refreshBehaviour = {...new RxStatusRefreshBehaviour(), ...refreshBehaviour}

    let resetTimer : Observable<number>

    let intervalTimer$ = (!!refreshBehaviour.maxRefreshInterval ?
            merge(timer(0), interval(refreshBehaviour.maxRefreshInterval)) : timer(0)
    )

    // return refresher$.pipe(
    return refresher$.pipe(
        // Turn the refresh$ value into a RxStatus
        mergeMap(()=>!!refreshBehaviour.maxRefreshInterval ? intervalTimer$ : of(undefined)),
        // mergeMap(()=>merge(
        // concatMap(()=>merge(
        concatMap(()=>merge(
            of(statusFactory.newLoadingStatus()),
            observableFactoryFunction().pipe(
                map((value: T):RxStatus<T>=>statusFactory.newDataStatus(value)),
                catchError((err:any)=>of(statusFactory.newErrorStatus(err))),
            )
        )),
        tap((status: RxStatus<T>) => {
            if(refreshBehaviour.minRefreshInterval) resetTimer = timer(refreshBehaviour.minRefreshInterval).pipe(shareReplay(1))
        }),
        // // Share and Replay the last value
        share({
            connector: () => new ReplaySubject<RxStatus<T>>(1),
            resetOnError: true,
            resetOnComplete: true,
            resetOnRefCountZero: refreshBehaviour.onRefCountZero
                ? ()=>resetTimer || timer(0)
                : false
        }),
    )

}


export const irx = <T>(observableFactoryFunction: ()=>Observable<T>, refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : Observable<RxStatus<T>> => {
    return _toIRX(observableFactoryFunction, refreshBehaviour)
}

export const irxPairs = <T>(observableFactoryFunction: ()=>Observable<T>, refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : [Observable<T>, Observable<RxStatus<T>>] => {
    const _RxStatus :Observable<RxStatus<T>> = _toIRX(observableFactoryFunction, refreshBehaviour)

    return [
        _RxStatus.pipe(
            filter(({data}: RxStatus<T>):boolean => data !== undefined),
            map((rxStatus: RxStatus<T>):T => rxStatus.data as T),
        ),
        _RxStatus
    ]
}
