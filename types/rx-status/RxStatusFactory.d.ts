import { BehaviorSubject } from "rxjs";
import { RxStatus } from "./RxStatus";
export declare class RxStatusFactory<T> {
    private refresh$;
    constructor(refresh$?: BehaviorSubject<undefined>);
    private defaultStatus;
    newLoadingStatus(): RxStatus<T>;
    newErrorStatus(error?: any): RxStatus<T>;
    newDataStatus(data: T): RxStatus<T>;
}
