import { identity } from "rxjs";
export const pif = (condition) => (trueResult) => !!condition ? trueResult : identity;
//# sourceMappingURL=control-flow.js.map