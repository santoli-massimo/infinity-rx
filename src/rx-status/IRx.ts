import {first, Observable} from "rxjs";
import {RxStatus, RxStatusRefreshBehaviour} from "./RxStatus";
import {irx} from "./operators";


export const IRx = <T>(source: Observable<T>, refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : Observable<RxStatus<T>> => source.pipe(irx(refreshBehaviour))

export const reload = <T>(status: Observable<RxStatus<T>>)=> status.pipe(first()).subscribe((status: RxStatus<T>)=>status.refresh())
