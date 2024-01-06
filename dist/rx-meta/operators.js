import { combineLatest, filter, startWith, Subject } from "rxjs";
import { getMeta, getMetaChannels, rxMeta } from "./rx-meta";
import { map } from "rxjs/operators";
import { MetaWithSource } from "./types";
// @TODO: doesnt work: emitted value is a subject
export const withMetaFrom = (metaCarrier) => {
    return (source) => rxMeta(source, getMetaChannels(metaCarrier));
};
export const converge = () => {
    return (metaCarrier) => {
        let source = metaCarrier.pipe(startWith(undefined));
        let meta = (getMeta(metaCarrier) || new Subject()).pipe(startWith(undefined));
        return combineLatest([source, meta]).pipe(filter(([data, meta]) => !!data || !!meta), map(([data, meta]) => new MetaWithSource(data, meta)), withMetaFrom(metaCarrier));
    };
};
export const diverge = () => {
    return (metaCarrier) => {
        return metaCarrier.pipe(map((converged) => converged.data));
    };
};
//# sourceMappingURL=operators.js.map