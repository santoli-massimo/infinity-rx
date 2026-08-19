

// Class containing the status of an Observable along with his value
export class RxStatus{
    constructor(status: Partial<RxStatus> = {}) { Object.assign(this, {...status}) }
    public readonly error: any = undefined
    public readonly isLoading: boolean = false
    public readonly loadingCount: number = 0
    public readonly isErrored: boolean = false
    public readonly hasData: boolean = false
}

export class RxLoadingStatus extends RxStatus{
    constructor(loadingCount: number=0, extras: Partial<RxStatus> = {}) {
        super({...extras, loadingCount, isLoading: true,})
    }
}

export class RxErroredStatus extends RxStatus{
    constructor(error: any, extras: Partial<RxStatus> = {}) {
        super({...extras, error, isErrored: true})
    }
}

export class RxDataStatus extends RxStatus{
    constructor(extras: Partial<RxStatus> = {}) {
        super({...extras, hasData: true, isLoading: false})
    }
}

export class RxStatusRefreshBehaviour {
    constructor(behaviour: Partial<RxStatusRefreshBehaviour> = {}) { Object.assign(this, behaviour) }

    /**
     * ### Enables the emission of a loading status
     * Emit a loading status immediately after subscription and after each reload
     * @default: true
     */
    emitLoading: boolean = true
    /**
     * ### Enable the reload of the source when all the subscriptions are disposed
     * Reload the source on re-subscription (when all the previous subscriptions have been disposed)
     * @default: true
     */
    onRefCountZero: boolean = true
    /**
     * ### Modify the onRefCountZero behaviour to postpone the reload of a certain amount of time after re-subscription
     * Value in milliseconds,
     * ignored if onRefCountZero is false,
     * 0 to disable
     * @default: 0 (the reload is immediate)
     */
    minRefreshInterval: number = 0
    /**
     * ### Reload periodically the source, only when there is at least one subscription
     * Each source observable emission will reset the timer, also if the reload is triggered manually
     *
     * Value in milliseconds,
     * 0 to disable
     * @default: 0 (disabled)
     */
    maxRefreshInterval: number = 0
    everyMilliseconds: number = 0
}
