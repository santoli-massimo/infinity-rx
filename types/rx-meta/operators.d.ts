import { Observable, OperatorFunction } from "rxjs";
import { MetaWithSource } from "./types";
/**
 * @description
 * Adds channels from another observable(metaCarrier) to the source observable
 * @param metaCarrier
 */
export declare const withMetaFrom: <T, U>(metaCarrier: Observable<U>) => OperatorFunction<T, T>;
/**
 * @description
 * ###  Create a new observable that emits the data and a channel data from the source observable
 * emits only when both emits a new value
 * @param channelName
 * optional (default to defaultChannelName)
 */
export declare const converge: (channelName?: string | symbol) => <T, M>(metaCarrier: Observable<T>) => Observable<MetaWithSource<T, M>>;
/**
 * @description
 * ### Opposite of converge
 * Takes a combined Observable (Observable of type MetaWithSource<Data, Meta>)
 * and emits only the data discarding the meta/channels.
 *
 * Meta are preserved in the returned observable and can be accessed again with getMeta
 */
export declare const diverge: <T, M>() => (metaCarrier: Observable<MetaWithSource<T, M>>) => Observable<T>;
