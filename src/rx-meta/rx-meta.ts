import {Observable, OperatorFunction, pipe, Subject} from "rxjs";
import {defaultChannelName, metaExtractionToken} from "./symbols";
import {RxMetaPipe} from "./types";


export type RxChannelsLiteral = {[key: string|symbol]: Subject<any>}

/**
 * @description
 * A map of channels. Channels are used to emit meta data to a specific channel.
 */
export class RxChannels extends Map<string|symbol, Subject<any>> {
    static fromLiteral(channels: RxChannelsLiteral): RxChannels {
        const channelEntries = [...Object.getOwnPropertySymbols(channels), ...Object.keys(channels)]
            .map<[string|symbol, Subject<any>]>((key: string|symbol) => [key, channels[key]])
        return new RxChannels([[defaultChannelName, new Subject()],  ...channelEntries])
    }

    static fromArray(channels: Array<string|symbol>): RxChannels {
        return new RxChannels(channels.map((key: string|symbol) => [key, new Subject()]))
    }

    static from(channels?: RxChannels | RxChannelsLiteral | Array<string | symbol>): RxChannels {
        if (!channels) return new RxChannels([[defaultChannelName, new Subject()]])
        else if (channels instanceof Array) return RxChannels.fromArray([...channels, defaultChannelName])
        else if (!(channels instanceof RxChannels)) return RxChannels.fromLiteral(channels)
        else return channels
    }
}

/**
    * @description
    *  Adds a channel to the observable. Channels are used to emit meta data to a specific channel.
    *  The default channel is always used when no channel is specified.
    *
    * @param source
    * @param channels
    */
export const rxMeta = <T, M>(
    source: Observable<T>,
    channels?: RxChannels | RxChannelsLiteral | Array<string|symbol>
): Observable<any> => {
    channels = RxChannels.from(channels)

    // Add channels to the observable
    source.pipe = (...operations: OperatorFunction<any, any>[]): Observable<any> => {
        return rxMeta(
            pipe(...(operations as [OperatorFunction<any, any>]))(source),
            channels
        )
    }
    Object.assign(source.pipe, {[metaExtractionToken]: channels})
    // Return the observable
    return source
}

/**
 * @description
 *  Emits meta data to a specific channel.
 *  The default channel is always used when no channel is specified.
 *
 * @param metaCarrier
 * @param status
 * @param channelKey
 */
export const emitMeta = <T>(metaCarrier: Observable<T>, status: any, channelKey: any = defaultChannelName): void => {
    // console.log(`Emit meta ${channelKey.toString()}`, getMeta(metaCarrier, channelKey))
    getMeta(metaCarrier, channelKey).next(status)
}

/**
 * @description
 * Gets meta data from a specific channel.
 * The default channel is always used when no channel is specified.
 * Returns undefined if no meta data is found.
 * @param metaCarrier
 * @param channelKey
 */
export const getMeta = <T>(metaCarrier: Observable<T>, channelKey: any = defaultChannelName) : Subject<any> =>{
    // console.log(`Get meta ${channelKey.toString()}`, metaCarrier, channelKey)
    return getMetaChannels(metaCarrier)?.get(channelKey) || new Subject()
}

/**
 * @description
 * Gets all channels from an observable.
 * Returns undefined if no channels are found.
 * @param metaCarrier
 */
export const getMetaChannels = <T>(metaCarrier: Observable<T>) : RxChannels|undefined =>{
    return (metaCarrier.pipe as RxMetaPipe)[metaExtractionToken] || undefined
}





