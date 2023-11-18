import {metaExtractionToken} from "./symbols";
import {Observable} from "rxjs";

export interface RxMetaPipe {
    [metaExtractionToken]?: any
}


export class MetaWithSource<T, M>{
    data: T | undefined
    meta: M | undefined

    constructor(data: T | undefined, meta: M | undefined) {
        this.data = data;
        this.meta = meta;
    }
}
