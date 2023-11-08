import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RxStatus, RxStatusRefreshBehaviour } from "../rx-status";
export declare class RxRepository<T> {
    readonly http: HttpClient;
    configuration: RxRepositoryConfiguration<T>;
    private _list$;
    get list$(): Observable<RxStatus<T[]>>;
    protected set list$(value: Observable<RxStatus<T[]>>);
}
export type RxRepositoryConfiguration<T> = {
    resourceAddress: string;
} & RxStatusRefreshBehaviour;
export declare function customInjectableFactory(target: any): any;
export declare function Repository<T>(configuration: RxRepositoryConfiguration<T>): ClassDecorator;
