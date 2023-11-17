import { UnaryFunction } from "rxjs";
export declare const pipeFromArray: <T, R>(fns: UnaryFunction<T, R>[]) => UnaryFunction<T, R>;
