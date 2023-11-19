import {combineLatest, filter, Observable, OperatorFunction, startWith, Subject} from "rxjs";
import {getMeta, rxMeta} from "./rx-meta";
import {metaExtractionToken} from "./symbols";
import {map} from "rxjs/operators";
import {MetaWithSource} from "./types";


export const bindMeta = <T, M>(meta: Observable<M>) : OperatorFunction<T, T> =>{
    return <T>(source: Observable<T>) => rxMeta(source, meta)
}

export const withMetaFrom = <T, U>(metaCarrier: Observable<U>) : OperatorFunction<T, T> => {
    return <T>(source: Observable<T>) => rxMeta(source, getMeta(metaCarrier))
}

export const extractMeta = <T, M>() : (source: Observable<T>)=> Observable<M> =>{
    return Object.assign(
        <T, M>(source: Observable<T>) : Observable<M> => new Subject(),
        {[metaExtractionToken]: true}
    )
}

export const converge = <T>() => {
    return <T>(metaCarrier: Observable<T>) : Observable<MetaWithSource<T, any>> => {

        let source = metaCarrier.pipe(startWith(undefined))
        let meta = (getMeta(metaCarrier) || new Subject()).pipe(startWith(undefined))

        return combineLatest([source, meta]).pipe(
            filter(([data, meta]: [T|undefined, any|undefined])=>!!data || !!meta),
            map(([data, meta]: [T|undefined, any|undefined])=>new MetaWithSource(data, meta)),
            withMetaFrom(metaCarrier)
        )

    }
}
