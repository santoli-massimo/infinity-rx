import { inject, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
// export interface IRxRepository<T>{
//     list$ : T[] | unknown
//     create$(creationData: Partial<T>): T | unknown
//     update$(creationData: Partial<T>): T | unknown
//     delete$(id: string|number): unknown
// }
export class RxRepository {
    constructor() {
        this.http = inject(HttpClient);
        this.configuration = { resourceAddress: '' };
        this._list$ = new Observable();
    }
    get list$() { return this._list$; }
    // protected set list$(value: Observable<T[]>) { this._list$ = IRx<T[]>(value, this.configuration) }
    set list$(value) { this._list$ = value; }
}
// Create an InjectionToken to serve as the provider key
const CUSTOM_INJECTABLE_TOKEN = new InjectionToken('custom_injectable_token');
// Define a factory function for the custom decorator
export function customInjectableFactory(target) {
    return new target();
}
export function Repository(configuration) {
    return (constructor) => {
        constructor.prototype.configuration = configuration;
        // @Injectable({providedIn: 'root'})
        // class x extends constructor<T>{
        //     configuration : RxRepositoryConfiguration<T> = configuration
        // }
        // return x
    };
}
//# sourceMappingURL=RxRepository.js.map