import {Observable, OperatorFunction, ReplaySubject, Subject, tap} from "rxjs";
import {bindMeta} from "./operators";
import {pipeFromArray} from "./utils";
import {extractMeta} from "./operators";


export const rxMeta = <T>(source: Observable<T>, meta: Observable<any> = new ReplaySubject(1)): Observable<T> => {
    source.pipe = (...operators: OperatorFunction<any, any>[]): Observable<any> => {
        // Check if the last operation is the metaExtractor return the meta Subject
        if('rxMetaExtractionToken' in operators[operators.length-1]) {return meta}

        // Else Add Meta Binding to the pipe and return source
        operators.push(bindMeta(meta))
        return pipeFromArray(operators)(source);
    }
    return source
}

export const emitMeta = <T>(metaCarrier: Observable<T>, status: any) => {
    let meta = metaCarrier.pipe(extractMeta())
    if(meta instanceof Subject) meta.next(status)
}

export const getMeta = <T>(metaCarrier: Observable<T>) : Observable<any>|undefined => metaCarrier.pipe(extractMeta())




