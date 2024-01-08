import { identity } from "rxjs";
export const when = (condition) => (trueResult) => !!condition ? trueResult : identity;
//# sourceMappingURL=control-flow.js.map