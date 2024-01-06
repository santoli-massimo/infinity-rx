import {metaExtractionToken} from "./symbols";
import {identity, Observable, OperatorFunction, UnaryFunction} from "rxjs";

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


export type rxPipeArgument<S, A=void, B=void, C=void, D=void, E=void, F=void, G=void, H=void, I=void, L=void> =
    []
    | [OperatorFunction<S, S>]
    | [OperatorFunction<S, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, E>, OperatorFunction<E, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, E>, OperatorFunction<E, F>, OperatorFunction<F, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, E>, OperatorFunction<E, F>, OperatorFunction<F, G>, OperatorFunction<G, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, E>, OperatorFunction<E, F>, OperatorFunction<F, G>, OperatorFunction<G, H>, OperatorFunction<H, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, E>, OperatorFunction<E, F>, OperatorFunction<F, G>, OperatorFunction<G, H>, OperatorFunction<H, I>, OperatorFunction<I, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, E>, OperatorFunction<E, F>, OperatorFunction<F, G>, OperatorFunction<G, H>, OperatorFunction<H, I>, OperatorFunction<I, L>, OperatorFunction<L, D>]
    | [OperatorFunction<S, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, E>, OperatorFunction<E, F>, OperatorFunction<F, G>, OperatorFunction<G, H>, OperatorFunction<H, I>, OperatorFunction<I, L>, OperatorFunction<L, D>, ...OperatorFunction<any, any>[]]
