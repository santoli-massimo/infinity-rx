import { Observable } from "rxjs";
export declare const rxMeta: <T>(source: Observable<T>, meta?: Observable<any>) => Observable<T>;
export declare const emitMeta: <T>(metaCarrier: Observable<T>, status: any) => void;
export declare const getMeta: <T>(metaCarrier: Observable<T>) => Observable<any> | undefined;
