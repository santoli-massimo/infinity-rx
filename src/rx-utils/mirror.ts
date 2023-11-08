import {Observable, Observer, Subscriber, Subscription} from "rxjs";

export const mirror = <In, Out>(source: Observable<In>, destination: Subscriber<In | Out>, overrides: Partial<Observer<In>> = {}): Subscription => {
    return source.subscribe(mirrorObserver(destination, overrides))
}

export const mirrorObserver = <In, Out>(destination: Observer<In | Out>, overrides: Partial<Observer<In>> = {}): Observer<any> => {
    return {
        ...{
            next: (value: In) => { destination.next(value) },
            error: (error: any) => {
                destination.error(error)
                destination.complete()
            },
            complete: () => { destination.complete() },
        },
        ...overrides
    }
}
