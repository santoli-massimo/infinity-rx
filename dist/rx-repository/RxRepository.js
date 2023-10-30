import { inject, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// export interface IRxRepository<T>{
//     list$ : T[] | unknown
//     create$(creationData: Partial<T>): T | unknown
//     update$(creationData: Partial<T>): T | unknown
//     delete$(id: string|number): unknown
// }
export class RxRepository {
    constructor() {
        this.http = inject(HttpClient);
        this._list$ = undefined;
        // public get list$() : Observable<RxStatus<T[]>> {
        //     // console.log(this._list$)
        //     this._list$ = this._list$ || irx<T[]>(()=>this.list(), this.configuration)
        //     return this._list$
        // }
    }
    list() { return this.http.get(this.configuration + '/pippo'); }
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