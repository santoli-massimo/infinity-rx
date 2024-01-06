import {combineLatest, filter, Observable, OperatorFunction, startWith, Subject} from "rxjs";
import {getMeta, getMetaChannels, rxMeta} from "./rx-meta";
import {map} from "rxjs/operators";
import {MetaWithSource} from "./types";


// @TODO: doesnt work: emitted value is a subject
export const withMetaFrom = <T, U>(metaCarrier: Observable<U>) : OperatorFunction<T, T> => {
    return <T>(source: Observable<T>) => rxMeta(source, getMetaChannels(metaCarrier))
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


export const diverge = <T>() => {
    return <T>(metaCarrier: Observable<MetaWithSource<T, any>>) : Observable<T> => {
        return metaCarrier.pipe(
            map((converged: MetaWithSource<T, any>) => converged.data as T)
        )
    }
}
