import { BehaviorSubject } from "rxjs";
import { RxStatus } from "./RxStatus";
export class RxStatusFactory {
    constructor(refresh$ = new BehaviorSubject(undefined)) {
        this.refresh$ = refresh$;
        this.defaultStatus = {
            data: undefined,
            error: undefined,
            isLoading: false,
            isErrored: false,
            hasData: false,
            refresh$: undefined
        };
    }
    newLoadingStatus() {
        return new RxStatus({ ...this.defaultStatus, isLoading: true }, this.refresh$);
    }
    newErrorStatus(error = undefined) {
        return new RxStatus({ ...this.defaultStatus, isErrored: true, error: error }, this.refresh$);
    }
    newDataStatus(data) {
        return new RxStatus({ ...this.defaultStatus, data: data, hasData: true }, this.refresh$);
    }
}
//# sourceMappingURL=RxStatusFactory.js.map