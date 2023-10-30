import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RxStatusRefreshBehaviour } from "../rx-status";
export declare class RxRepository<T> {
    readonly http: HttpClient;
    configuration: RxRepositoryConfiguration<T>;
    protected list(): Observable<T[]>;
    private _list$;
}
export declare type RxRepositoryConfiguration<T> = {
    resourceAddress: string;
} & RxStatusRefreshBehaviour;
export declare function customInjectableFactory(target: any): any;
export declare function Repository<T>(configuration: RxRepositoryConfiguration<T>): ClassDecorator;
