import {Subject} from "rxjs";

export const RxAutoUnsubscribe = () => {
    return function(constructor: any) {
        const orig = constructor.prototype.ngOnDestroy
        constructor.prototype.ngOnDestroy = function() {
            for(const prop in this) {
                const property = this[prop]
                if(property instanceof Subject) {
                    console.log('disposing', property)
                }
            }
            orig.apply()
        }
    }
}
