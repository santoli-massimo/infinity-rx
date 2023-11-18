import { Observable, OperatorFunction } from "rxjs";
import { MetaWithSource } from "./types";
export declare const bindMeta: <T, M>(meta: Observable<M>) => OperatorFunction<T, T>;
export declare const withMetaFrom: <T, U>(metaCarrier: Observable<U>) => OperatorFunction<T, T>;
export declare const extractMeta: <T, M>() => (source: Observable<T>) => Observable<M>;
export declare const converge: <T>() => <T_1>(metaCarrier: Observable<T_1>) => Observable<MetaWithSource<T_1, any>>;
