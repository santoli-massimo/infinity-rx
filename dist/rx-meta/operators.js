import { rxMeta } from "./rx-meta";
export const bindMeta = (meta) => {
    return (metaCarrier) => {
        return rxMeta(metaCarrier, meta);
    };
};
export const extractMeta = () => {
    const fn = (source) => source;
    fn.rxMetaExtractionToken = true;
    return fn;
};
//# sourceMappingURL=operators.js.map