import {Observable} from "rxjs";
import {rxMeta} from "./rx-meta";


export const bindMeta = <T>(meta: Observable<any>) =>{
    return (metaCarrier: Observable<T>) => {
        return rxMeta(metaCarrier, meta)
    }
}

export const extractMeta = <T>()=>{
    const fn= <T>(source: Observable<T>) : Observable<any> => source
    fn.rxMetaExtractionToken = true
    return fn
}


