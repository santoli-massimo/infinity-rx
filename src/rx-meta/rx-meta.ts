import {Observable, OperatorFunction, pipe, Subject} from "rxjs";
import {defaultChannelName, metaExtractionToken} from "./symbols";
import {RxMetaPipe} from "./types";


export type RxChannelsLiteral = {[key: string|symbol]: Subject<any>}
export type rxChannelsSource = RxChannels | RxChannelsLiteral | Array<string|symbol>

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
    channels?: rxChannelsSource
): Observable<any> => {
    channels = RxChannels.from(channels)

    // Add channels to the observable
    source.pipe = (...operations: OperatorFunction<any, any>[]): Observable<any> => {
        operations = operationsWithMeta(operations, channels)
        // console.log('operations', operations.map((op: OperatorFunction<any, any>) => op.name))

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
 *  The default channel is always used when no channel is provided.
 *
 * @param metaCarrier
 * @param status
 * @param channelKey
 */
export const emitMeta = <T>(metaCarrier: Observable<T>, status: any, channelKey: any = defaultChannelName): void => {
    // console.log(`Emit meta ${channelKey.toString()}`, getMeta(metaCarrier, channelKey))
    getMeta(metaCarrier, channelKey)?.next(status)
}

/**
 * @description
 * Gets meta data from a specific channel.
 * The default channel is always used when no channel is provided.
 * Returns undefined if no meta data is found.
 * @param metaCarrier
 * @param channelKey
 */
export const getMeta = <T>(metaCarrier: Observable<any>, channelKey: any = defaultChannelName) : Subject<T>|undefined =>{
    // console.log(`Get meta ${channelKey.toString()}`, metaCarrier, channelKey)
    return getMetaChannels(metaCarrier)?.get(channelKey)
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

/**
 * @description
 * Adds an operator that persist meta/channels after each existing operator to make metaChannels available
 * to the next operator even if it's a custom operator that does not use pipe internally.
 * @param operators
 * @param channels
 */
const operationsWithMeta = <T>(operators: OperatorFunction<any, any>[], channels: rxChannelsSource=[]) : OperatorFunction<any, any>[] => {
    const propagateMeta = (source: Observable<T>) : Observable<T> => rxMeta(source, channels)
    return operators.reduce((acc: OperatorFunction<any, any>[], operator: OperatorFunction<any, any>) => [...acc, operator, propagateMeta], [])
}





