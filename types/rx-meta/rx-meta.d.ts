import { Observable, Subject } from "rxjs";
export type RxChannelsLiteral = {
    [key: string | symbol]: Subject<any>;
};
export type rxChannelsSource = RxChannels | RxChannelsLiteral | Array<string | symbol>;
/**
 * @description
 * A map of channels. Channels are used to emit meta data to a specific channel.
 */
export declare class RxChannels extends Map<string | symbol, Subject<any>> {
    static fromLiteral(channels: RxChannelsLiteral): RxChannels;
    static fromArray(channels: Array<string | symbol>): RxChannels;
    static from(channels?: RxChannels | RxChannelsLiteral | Array<string | symbol>): RxChannels;
}
/**
    * @description
    *  Adds a channel to the observable. Channels are used to emit meta data to a specific channel.
    *  The default channel is always used when no channel is specified.
    *
    * @param source
    * @param channels
    */
export declare const rxMeta: <T, M>(source: Observable<T>, channels?: rxChannelsSource) => Observable<any>;
/**
 * @description
 *  Emits meta data to a specific channel.
 *  The default channel is always used when no channel is provided.
 *
 * @param metaCarrier
 * @param status
 * @param channelKey
 */
export declare const emitMeta: <T>(metaCarrier: Observable<T>, status: any, channelKey?: any) => void;
/**
 * @description
 * Gets meta data from a specific channel.
 * The default channel is always used when no channel is provided.
 * Returns undefined if no meta data is found.
 * @param metaCarrier
 * @param channelKey
 */
export declare const getMeta: <T>(metaCarrier: Observable<any>, channelKey?: any) => Subject<T> | undefined;
/**
 * @description
 * Gets all channels from an observable.
 * Returns undefined if no channels are found.
 * @param metaCarrier
 */
export declare const getMetaChannels: <T>(metaCarrier: Observable<T>) => RxChannels | undefined;
