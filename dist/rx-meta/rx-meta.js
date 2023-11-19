import { pipe, ReplaySubject, Subject } from "rxjs";
import { metaExtractionToken } from "./symbols";
export const rxMeta = (source, meta = new ReplaySubject(1)) => {
    source.pipe = (...operations) => {
        return rxMeta(pipe(...operations)(source), meta);
    };
    Object.assign(source.pipe, { [metaExtractionToken]: meta });
    return source;
};
export const emitMeta = (metaCarrier, status) => {
    let meta = getMeta(metaCarrier);
    if (meta instanceof Subject)
        meta.next(status);
};
export const getMeta = (metaCarrier) => {
    return metaCarrier.pipe[metaExtractionToken] || undefined;
};
//# sourceMappingURL=rx-meta.js.map