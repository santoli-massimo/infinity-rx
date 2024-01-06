import { pipe, Subject } from "rxjs";
import { defaultChannelName, metaExtractionToken } from "./symbols";
/**
 * @description
 * A map of channels. Channels are used to emit meta data to a specific channel.
 */
export class RxChannels extends Map {
    static fromLiteral(channels) {
        const channelEntries = [...Object.getOwnPropertySymbols(channels), ...Object.keys(channels)]
            .map((key) => [key, channels[key]]);
        return new RxChannels([[defaultChannelName, new Subject()], ...channelEntries]);
    }
    static fromArray(channels) {
        return new RxChannels(channels.map((key) => [key, new Subject()]));
    }
    static from(channels) {
        if (!channels)
            return new RxChannels([[defaultChannelName, new Subject()]]);
        else if (channels instanceof Array)
            return RxChannels.fromArray([...channels, defaultChannelName]);
        else if (!(channels instanceof RxChannels))
            return RxChannels.fromLiteral(channels);
        else
            return channels;
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
export const rxMeta = (source, channels) => {
    channels = RxChannels.from(channels);
    // Add channels to the observable
    source.pipe = (...operations) => {
        return rxMeta(pipe(...operations)(source), channels);
    };
    Object.assign(source.pipe, { [metaExtractionToken]: channels });
    // Return the observable
    return source;
};
/**
 * @description
 *  Emits meta data to a specific channel.
 *  The default channel is always used when no channel is specified.
 *
 * @param metaCarrier
 * @param status
 * @param channelKey
 */
export const emitMeta = (metaCarrier, status, channelKey = defaultChannelName) => {
    // console.log(`Emit meta ${channelKey.toString()}`, getMeta(metaCarrier, channelKey))
    getMeta(metaCarrier, channelKey).next(status);
};
/**
 * @description
 * Gets meta data from a specific channel.
 * The default channel is always used when no channel is specified.
 * Returns undefined if no meta data is found.
 * @param metaCarrier
 * @param channelKey
 */
export const getMeta = (metaCarrier, channelKey = defaultChannelName) => {
    // console.log(`Get meta ${channelKey.toString()}`, metaCarrier, channelKey)
    return getMetaChannels(metaCarrier)?.get(channelKey) || new Subject();
};
/**
 * @description
 * Gets all channels from an observable.
 * Returns undefined if no channels are found.
 * @param metaCarrier
 */
export const getMetaChannels = (metaCarrier) => {
    return metaCarrier.pipe[metaExtractionToken] || undefined;
};
//# sourceMappingURL=rx-meta.js.map