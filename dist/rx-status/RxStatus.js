// Class containing the status of an Observable along with his value
export class RxStatus {
    constructor(status = {}) {
        this.error = undefined;
        this.isLoading = false;
        this.loadingCount = 0;
        this.isErrored = false;
        this.hasData = false;
        Object.assign(this, { ...status });
    }
}
export class RxLoadingStatus extends RxStatus {
    constructor(loadingCount = 0) {
        super({ loadingCount, isLoading: true });
    }
}
export class RxErroredStatus extends RxStatus {
    constructor(error) {
        super({ error, isErrored: true });
    }
}
export class RxDataStatus extends RxStatus {
    constructor() {
        super({ hasData: true, isLoading: false });
    }
}
export class RxStatusRefreshBehaviour {
    constructor(behaviour = {}) {
        /**
         * ### Enables the emission of a loading status
         * Emit a loading status immediately after subscription and after each reload
         * @default: true
         */
        this.emitLoading = true;
        /**
         * ### Enable the reload of the source when all the subscriptions are disposed
         * Reload the source on re-subscription (when all the previous subscriptions have been disposed)
         * @default: true
         */
        this.onRefCountZero = true;
        /**
         * ### Modify the onRefCountZero behaviour to postpone the reload of a certain amount of time after re-subscription
         * Value in milliseconds,
         * ignored if onRefCountZero is false,
         * 0 to disable
         * @default: 0 (the reload is immediate)
         */
        this.minRefreshInterval = 0;
        /**
         * ### Reload periodically the source, only when there is at least one subscription
         * Each source observable emission will reset the timer, also if the reload is triggered manually
         *
         * Value in milliseconds,
         * 0 to disable
         * @default: 0 (disabled)
         */
        this.maxRefreshInterval = 0;
        this.everyMilliseconds = 0;
        Object.assign(this, behaviour);
    }
}
//# sourceMappingURL=RxStatus.js.map