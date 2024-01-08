import { ReplaySubject, Subject } from "rxjs";
import { RxStatusRefreshBehaviour } from "./RxStatus";
import { getMeta, rxMeta } from "../rx-meta";
import { when } from "../rx-utils/control-flow";
import { addDataStatus, addLoadingStatus, addRefCountBehaviour, reloadBehaviour, toIRxStatus, reloadWithInterval } from "./operators";
export const IRx = (source, refreshBehaviour = {}) => {
    const { emitLoading, onRefCountZero, minRefreshInterval, maxRefreshInterval } = new RxStatusRefreshBehaviour(refreshBehaviour);
    return rxMeta(source, {
        reload: new Subject(),
        status: new ReplaySubject(1)
    })
        .pipe(toIRxStatus(), reloadBehaviour(), when(emitLoading)(addLoadingStatus()), addDataStatus(), addRefCountBehaviour(onRefCountZero, minRefreshInterval), when(maxRefreshInterval)(reloadWithInterval(maxRefreshInterval)));
};
export const reload = (status) => getMeta(status, 'reload')?.next();
//# sourceMappingURL=IRx.js.map