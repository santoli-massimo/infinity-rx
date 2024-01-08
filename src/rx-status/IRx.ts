import {Observable, ReplaySubject, Subject} from "rxjs";
import {RxStatus, RxStatusRefreshBehaviour} from "./RxStatus";
import {getMeta, rxMeta} from "../rx-meta";
import {when} from "../rx-utils/control-flow";
import {addDataStatus, addLoadingStatus, addRefCountBehaviour, reloadBehaviour, toIRxStatus, reloadWithInterval} from "./operators";


export const IRx = <T>(source: Observable<T>, refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : Observable<T> => {
    const {emitLoading, onRefCountZero, minRefreshInterval, maxRefreshInterval} = new RxStatusRefreshBehaviour(refreshBehaviour)
    return rxMeta(source, {
        reload: new Subject<void>(),
        status: new ReplaySubject<RxStatus>(1)
    })
    .pipe(
        toIRxStatus(),
        reloadBehaviour(),
        when(emitLoading)(addLoadingStatus()),
        addDataStatus(),
        addRefCountBehaviour(onRefCountZero!, minRefreshInterval),
        when(maxRefreshInterval)(reloadWithInterval(maxRefreshInterval))
    )
}


export const reload = (status: Observable<any>) : void =>getMeta<void>(status, 'reload')?.next()

