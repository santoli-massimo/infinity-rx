import { Subscriber } from "rxjs";
export interface SubscriberOverrides<T> {
    /**
     * If provided, this function will be called whenever the {@link Subscriber}'s
     * `next` method is called, with the value that was passed to that call. If
     * an error is thrown within this function, it will be handled and passed to
     * the destination's `error` method.
     * @param value The value that is being observed from the source.
     */
    next?: (value: T) => void;
    /**
     * If provided, this function will be called whenever the {@link Subscriber}'s
     * `error` method is called, with the error that was passed to that call. If
     * an error is thrown within this function, it will be handled and passed to
     * the destination's `error` method.
     * @param err An error that has been thrown by the source observable.
     */
    error?: (err: any) => void;
    /**
     * If provided, this function will be called whenever the {@link Subscriber}'s
     * `complete` method is called. If an error is thrown within this function, it
     * will be handled and passed to the destination's `error` method.
     */
    complete?: () => void;
    /**
     * If provided, this function will be called after all teardown has occurred
     * for this {@link Subscriber}. This is generally used for cleanup purposes
     * during operator development.
     */
    finalize?: () => void;
}
export interface OperateConfig<In, Out> extends SubscriberOverrides<In> {
    /**
     * The destination subscriber to forward notifications to. This is also the
     * subscriber that will receive unhandled errors if your `next`, `error`, or `complete`
     * overrides throw.
     */
    destination: Subscriber<Out>;
}
export declare function operate<In, Out>({ destination, ...subscriberOverrides }: OperateConfig<In, Out>): Subscriber<unknown>;
