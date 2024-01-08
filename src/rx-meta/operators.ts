import {combineLatest, filter, Observable, OperatorFunction, startWith, Subject, zip} from "rxjs";
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
 * ###  Create a new observable that emits the data and a channel data from the source observable
 * emits only when both emits a new value
 * @param channelName
 * optional (default to defaultChannelName)
 */
export const converge = (channelName: string | symbol = defaultChannelName) =>
    <T, M>(metaCarrier: Observable<T>) : Observable<MetaWithSource<T, M>> =>
        zip([metaCarrier, getMeta<M>(metaCarrier, channelName) || new Subject<M>()]).pipe(
            map(([data, meta]: [T, M])=>new MetaWithSource(data, meta)),
            withMetaFrom(metaCarrier)
        )


/**
 * @description
 * ### Opposite of converge
 * Takes a combined Observable (Observable of type MetaWithSource<Data, Meta>)
 * and emits only the data discarding the meta/channels.
 *
 * Meta are preserved in the returned observable and can be accessed again with getMeta
 */
export const diverge = <T, M>() =>
    /**
     * @param metaCarrier
     * Observable of type MetaWithSource<Data, Meta>
     */
    (metaCarrier: Observable<MetaWithSource<T, M>>) : Observable<T> =>
        metaCarrier.pipe(map((converged: MetaWithSource<T, any>) => converged.data as T))


