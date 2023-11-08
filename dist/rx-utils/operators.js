import { Observable } from "rxjs";
import { mirror } from "./mirror";
export const countReferences = () => {
    let refCount = 0;
    return (source) => {
        return new Observable((destination) => {
            refCount++;
            let subscription = mirror(source, destination);
            return () => {
                refCount--;
                subscription.unsubscribe();
            };
        });
    };
};
//# sourceMappingURL=operators.js.map