import { Observable, Subject } from "rxjs";
export declare type RxMetaStoreRecord<T> = {
    adapter: Subject<T>;
    hash: string;
};
export declare class RxMetaStore extends Map<Observable<any>, RxMetaStoreRecord<any>> {
    private static instance;
    private constructor();
    static getStore(): RxMetaStore;
    initRecordIfNotExists: <T>(metaCarrier: Observable<T>) => RxMetaStoreRecord<any> | undefined;
}
