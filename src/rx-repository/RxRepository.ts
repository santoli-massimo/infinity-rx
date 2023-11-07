import {inject, InjectionToken} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IRx, irx, RxStatus, RxStatusRefreshBehaviour} from "../rx-status";


// export interface IRxRepository<T>{
//     list$ : T[] | unknown
//     create$(creationData: Partial<T>): T | unknown
//     update$(creationData: Partial<T>): T | unknown
//     delete$(id: string|number): unknown
// }

export class RxRepository<T>{
    readonly http: HttpClient = inject(HttpClient)
    public configuration : RxRepositoryConfiguration<T>

    private _list$: Observable<RxStatus<T[]>>
    public get list$() : Observable<RxStatus<T[]>> {return this._list$}
    protected set list$(value: Observable<T[]>|undefined) { this._list$ = IRx<T[]>(value, this.configuration) }
}

export type RxRepositoryConfiguration<T> = {
    resourceAddress: string
} & RxStatusRefreshBehaviour



// Create an InjectionToken to serve as the provider key
const CUSTOM_INJECTABLE_TOKEN = new InjectionToken('custom_injectable_token');

// Define a factory function for the custom decorator
export function customInjectableFactory(target: any) {
    return new target();
}

export function Repository<T>(configuration: RxRepositoryConfiguration<T>): ClassDecorator {
    return (constructor: any): void => {
        constructor.prototype.configuration = configuration;

        // @Injectable({providedIn: 'root'})
        // class x extends constructor<T>{
        //     configuration : RxRepositoryConfiguration<T> = configuration
        // }
        // return x
    }
}

