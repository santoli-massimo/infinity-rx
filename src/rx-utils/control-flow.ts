import {identity, OperatorFunction} from "rxjs";

export const pif = (condition: any) => (trueResult: OperatorFunction<any, any>)=> !!condition ? trueResult : identity
