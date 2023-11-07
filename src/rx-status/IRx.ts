import {Observable} from "rxjs";
import {RxStatus, RxStatusRefreshBehaviour} from "./RxStatus";
import {irx} from "./operators";


export const IRx = <T>(source: Observable<T>, refreshBehaviour:Partial<RxStatusRefreshBehaviour>={}) : Observable<RxStatus<T>> => source.pipe(irx(refreshBehaviour))
