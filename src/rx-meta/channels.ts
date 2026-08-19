// import { Subject } from 'rxjs';
//
// class Pair<P1, P2> {
//     a: P1;
//     b: P2;
//     constructor(a: P1, b: P2) {
//         this.a = a;
//         this.b = b;
//     }
// }
//
// export type Channels<A extends {[key: string|symbol]: any extends infer T ? T :any}> = {
//     [K in keyof A]: A[K]
// }
//
// export class RxChannels<A>{
//     readonly channels: Channels<A>
//
//     constructor(channels: A){
//         this.channels = [...Object.keys(channels), ...Object.getOwnPropertySymbols(channels)]
//             .reduce((acc:Channels<A>, key:string|symbol) => {
//                 return {...acc, [key]: new Subject()  }
//             }, {} as Channels<A>)
//     }
//     public get<K extends keyof A>(key: K): A[K]{ return this.channels[key] }
// }
//
// let out = new RxChannels({
//     a: String,
//     b: Number,
//     c: Subject<string>,
//     d: Pair<string, number>
// } as const)
//
// let a = out.get('a')
// let b = out.get('b')
// let c = out.get('c')
// let d = out.get('d')
