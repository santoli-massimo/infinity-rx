
export type IRxSymbol = {
    [key: string]: symbol
}

export const symbols: {[key:string]: symbol} = {
    value : Symbol('value'),
    error : Symbol('error'),
    isLoading : Symbol('isLoading'),
    isErrored : Symbol('isErrored'),
    hasData : Symbol('hasData'),
    refresh : Symbol('refresh'),
    status : Symbol('status'),
}
