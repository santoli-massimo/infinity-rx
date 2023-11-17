import { Observable } from "rxjs";
export declare const bindMeta: <T>(meta: Observable<any>) => (metaCarrier: Observable<T>) => Observable<T>;
export declare const extractMeta: <T>() => {
    <T_1>(source: Observable<T_1>): Observable<any>;
    rxMetaExtractionToken: boolean;
};
