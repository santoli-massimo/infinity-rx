import { combineLatest, filter, startWith, Subject } from "rxjs";
import { getMeta, rxMeta } from "./rx-meta";
import { metaExtractionToken } from "./symbols";
import { map } from "rxjs/operators";
import { MetaWithSource } from "./types";
export const bindMeta = (meta) => {
    return (source) => rxMeta(source, meta);
};
export const withMetaFrom = (metaCarrier) => {
    return (source) => rxMeta(source, getMeta(metaCarrier));
};
export const extractMeta = () => {
    return Object.assign((source) => new Subject(), { [metaExtractionToken]: true });
};
export const converge = () => {
    return (metaCarrier) => {
        let source = metaCarrier.pipe(startWith(undefined));
        let meta = (getMeta(metaCarrier) || new Subject()).pipe(startWith(undefined));
        return combineLatest([source, meta]).pipe(filter(([data, meta]) => !!data || !!meta), map(([data, meta]) => new MetaWithSource(data, meta)), withMetaFrom(metaCarrier));
    };
};
//# sourceMappingURL=operators.js.map