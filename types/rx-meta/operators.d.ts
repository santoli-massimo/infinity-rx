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
 * Create a new observable that emits the data and a channel data from the source observable
 * @param channelName
 * optional (default to defaultChannelName)
 */
export declare const converge: (channelName?: string | symbol) => <T, M>(metaCarrier: Observable<T>) => Observable<MetaWithSource<T, M>>;
export declare const diverge: <T>() => <T_1>(metaCarrier: Observable<MetaWithSource<T_1, any>>) => Observable<T_1>;
