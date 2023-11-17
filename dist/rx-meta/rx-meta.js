import { ReplaySubject, Subject } from "rxjs";
import { bindMeta } from "./operators";
import { pipeFromArray } from "./utils";
import { extractMeta } from "./operators";
export const rxMeta = (source, meta = new ReplaySubject(1)) => {
    source.pipe = (...operators) => {
        // Check if the last operation is the metaExtractor return the meta Subject
        if ('rxMetaExtractionToken' in operators[operators.length - 1]) {
            return meta;
        }
        // Else Add Meta Binding to the pipe and return source
        operators.push(bindMeta(meta));
        return pipeFromArray(operators)(source);
    };
    return source;
};
export const emitMeta = (metaCarrier, status) => {
    let meta = metaCarrier.pipe(extractMeta());
    if (meta instanceof Subject)
        meta.next(status);
};
export const getMeta = (metaCarrier) => metaCarrier.pipe(extractMeta());
//# sourceMappingURL=rx-meta.js.map