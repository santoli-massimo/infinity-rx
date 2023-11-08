import { Observable, Observer, Subscriber, Subscription } from "rxjs";
export declare const mirror: <In, Out>(source: Observable<In>, destination: Subscriber<In | Out>, overrides?: Partial<Observer<In>>) => Subscription;
export declare const mirrorObserver: <In, Out>(destination: Observer<In | Out>, overrides?: Partial<Observer<In>>) => Observer<any>;
