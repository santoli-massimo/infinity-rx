import { Observable, OperatorFunction } from "rxjs";
import { MetaWithSource } from "./types";
export declare const withMetaFrom: <T, U>(metaCarrier: Observable<U>) => OperatorFunction<T, T>;
export declare const converge: <T>() => <T_1>(metaCarrier: Observable<T_1>) => Observable<MetaWithSource<T_1, any>>;
export declare const diverge: <T>() => <T_1>(metaCarrier: Observable<MetaWithSource<T_1, any>>) => Observable<T_1>;
