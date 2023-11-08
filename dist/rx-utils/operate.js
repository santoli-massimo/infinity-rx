import { Subscriber } from "rxjs";
export function operate({ destination, ...subscriberOverrides }) {
    return new Subscriber(destination, subscriberOverrides);
}
//# sourceMappingURL=operate.js.map