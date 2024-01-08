import {combineLatest, filter, Observable, OperatorFunction, startWith, Subject} from "rxjs";
import {getMeta, getMetaChannels, rxMeta} from "./rx-meta";
import {map} from "rxjs/operators";
import {MetaWithSource} from "./types";
import {defaultChannelName} from "./symbols";


/**
 * @description
 * Adds channels from another observable(metaCarrier) to the source observable
 * @param metaCarrier
 */
export const withMetaFrom = <T, U>(metaCarrier: Observable<U>) : OperatorFunction<T, T> => {
    return (source: Observable<T>) => rxMeta(source, getMetaChannels(metaCarrier))
}


/**
 * @description
 * Create a new observable that emits the data and a channel data from the source observable
 * @param channelName
 * optional (default to defaultChannelName)
 */
export const converge = (channelName: string | symbol = defaultChannelName) => {
    return <T, M>(metaCarrier: Observable<T>) : Observable<MetaWithSource<T, M>> => {
        let source = metaCarrier.pipe(startWith(undefined)) as Observable<T>
        let meta = (getMeta<M>(metaCarrier, channelName) || new Subject()).pipe(startWith(undefined)) as Observable<M>

        return combineLatest<[T, M]>([source, meta]).pipe(
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
