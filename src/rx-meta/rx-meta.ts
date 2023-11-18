import {Observable, ReplaySubject, Subject} from "rxjs";
import {metaExtractionToken} from "./symbols";
import {RxMetaPipe} from "./types";

export const rxMeta = <T, M>(source: Observable<T>, meta: Observable<M> = new ReplaySubject(1)): Observable<T> => {
    source.pipe = Object.assign(
        source.pipe,
        {[metaExtractionToken]: meta}
    )
    return source
}


export const emitMeta = <T>(metaCarrier: Observable<T>, status: any): void => {
    let meta = getMeta(metaCarrier)
    if(meta instanceof Subject) meta.next(status)
}


export const getMeta = <T>(metaCarrier: Observable<T>) : Observable<any>|undefined =>{
    return (metaCarrier.pipe as RxMetaPipe)[metaExtractionToken] || undefined
}





