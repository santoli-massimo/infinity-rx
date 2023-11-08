import {MonoTypeOperatorFunction, Observable, Subscriber, TeardownLogic} from "rxjs";
import {mirror} from "./mirror";

export const countReferences = <T>(): MonoTypeOperatorFunction<T> =>{
    let refCount= 0
    return (source: Observable<T>): Observable<T> => {
        return new Observable<T>((destination: Subscriber<T>) : TeardownLogic => {
            refCount++
            let subscription = mirror(source, destination)
            return () => {
                refCount--
                subscription.unsubscribe()
            };
        })
    }
}
