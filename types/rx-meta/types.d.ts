import { metaExtractionToken } from "./symbols";
export interface RxMetaPipe {
    [metaExtractionToken]?: any;
}
export declare class MetaWithSource<T, M> {
    data: T | undefined;
    meta: M | undefined;
    constructor(data: T | undefined, meta: M | undefined);
}
