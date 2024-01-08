export declare class RxStatus {
    constructor(status?: Partial<RxStatus>);
    readonly error: any;
    readonly isLoading: boolean;
    readonly loadingCount: number;
    readonly isErrored: boolean;
    readonly hasData: boolean;
}
export declare class RxLoadingStatus extends RxStatus {
    constructor(loadingCount?: number);
}
export declare class RxErroredStatus extends RxStatus {
    constructor(error: any);
}
export declare class RxDataStatus extends RxStatus {
    constructor();
}
export declare class RxStatusRefreshBehaviour {
    constructor(behaviour?: Partial<RxStatusRefreshBehaviour>);
    /**
     * ### Enables the emission of a loading status
     * Emit a loading status immediately after subscription and after each reload
     * @default: true
     */
    emitLoading: boolean;
    /**
     * ### Enable the reload of the source when all the subscriptions are disposed
     * Reload the source on re-subscription (when all the previous subscriptions have been disposed)
     * @default: true
     */
    onRefCountZero: boolean;
    /**
     * ### Modify the onRefCountZero behaviour to postpone the reload of a certain amount of time after re-subscription
     * Value in milliseconds,
     * ignored if onRefCountZero is false,
     * 0 to disable
     * @default: 0 (the reload is immediate)
     */
    minRefreshInterval: number;
    /**
     * ### Reload periodically the source, only when there is at least one subscription
     * Each source observable emission will reset the timer, also if the reload is triggered manually
     *
     * Value in milliseconds,
     * 0 to disable
     * @default: 0 (disabled)
     */
    maxRefreshInterval: number;
    everyMilliseconds: number;
}
