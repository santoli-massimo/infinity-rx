import {Observable, OperatorFunction, pipe, ReplaySubject, Subject, UnaryFunction} from "rxjs";
import {metaExtractionToken} from "./symbols";
import {RxMetaPipe} from "./types";


export const rxMeta = <T, M>(source: Observable<T>, meta: Observable<M> = new ReplaySubject(1)): Observable<T> => {
    source.pipe = (...operations: OperatorFunction<any, any>[]): Observable<T> => {
        return rxMeta(
            pipe(...(operations as [OperatorFunction<any, any>]))(source) as Observable<T>,
            meta
        )
    }
    Object.assign(source.pipe, {[metaExtractionToken]: meta})
    return source
}


export const emitMeta = <T>(metaCarrier: Observable<T>, status: any): void => {
    let meta = getMeta(metaCarrier)
    if(meta instanceof Subject) meta.next(status)
}


export const getMeta = <T>(metaCarrier: Observable<T>) : Observable<any>|undefined =>{
    return (metaCarrier.pipe as RxMetaPipe)[metaExtractionToken] || undefined
}





