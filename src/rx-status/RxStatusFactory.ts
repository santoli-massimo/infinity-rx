import {BehaviorSubject} from "rxjs";
import {RxStatus} from "./RxStatus";

export class RxStatusFactory<T>{
    constructor(private refresh$: BehaviorSubject<undefined> = new BehaviorSubject(undefined)) {}
    private defaultStatus:any = {
        data: undefined,
        error: undefined,
        isLoading: false,
        isErrored: false,
        hasData: false,
        refresh$: undefined
    }

    public newLoadingStatus():RxStatus<T> {
        return new RxStatus<T>({...this.defaultStatus, isLoading: true}, this.refresh$)
    }
    public newErrorStatus(error: any = undefined):RxStatus<T>{
        return new RxStatus<T>({...this.defaultStatus, isErrored: true, error: error}, this.refresh$)
    }
    public newDataStatus(data: T):RxStatus<T>{
        return new RxStatus<T>({...this.defaultStatus, data: data, hasData: true}, this.refresh$)
    }
}

