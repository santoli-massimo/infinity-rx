import { inject, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IRx } from "../rx-status";
// export interface IRxRepository<T>{
//     list$ : T[] | unknown
//     create$(creationData: Partial<T>): T | unknown
//     update$(creationData: Partial<T>): T | unknown
//     delete$(id: string|number): unknown
// }
export class RxRepository {
    constructor() {
        this.http = inject(HttpClient);
    }
    get list$() { return this._list$; }
    set list$(value) { this._list$ = IRx(value, this.configuration); }
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