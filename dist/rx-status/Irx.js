import { first } from "rxjs";
import { irx } from "./operators";
export const IRx = (source, refreshBehaviour = {}) => source.pipe(irx(refreshBehaviour));
export const reload = (status) => status.pipe(first()).subscribe((status) => status.refresh());
//# sourceMappingURL=IRx.js.map