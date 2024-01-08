import {identity, OperatorFunction} from "rxjs";

export const when = (condition: any) => (trueResult: OperatorFunction<any, any>)=> !!condition ? trueResult : identity
