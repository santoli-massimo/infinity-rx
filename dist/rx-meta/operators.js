import { combineLatest, filter, startWith, Subject } from "rxjs";
import { getMeta, getMetaChannels, rxMeta } from "./rx-meta";
import { map } from "rxjs/operators";
import { MetaWithSource } from "./types";
import { defaultChannelName } from "./symbols";
/**
 * @description
 * Adds channels from another observable(metaCarrier) to the source observable
 * @param metaCarrier
 */
export const withMetaFrom = (metaCarrier) => {
    return (source) => rxMeta(source, getMetaChannels(metaCarrier));
};
/**
 * @description
 * Create a new observable that emits the data and a channel data from the source observable
 * @param channelName
 * optional (default to defaultChannelName)
 */
export const converge = (channelName = defaultChannelName) => {
    return (metaCarrier) => {
        let source = metaCarrier.pipe(startWith(undefined));
        let meta = (getMeta(metaCarrier, channelName) || new Subject()).pipe(startWith(undefined));
        return combineLatest([source, meta]).pipe(filter(([data, meta]) => !!data || !!meta), map(([data, meta]) => new MetaWithSource(data, meta)), withMetaFrom(metaCarrier));
    };
};
export const diverge = () => {
    return (metaCarrier) => {
        return metaCarrier.pipe(map((converged) => converged.data));
    };
};
//# sourceMappingURL=operators.js.map