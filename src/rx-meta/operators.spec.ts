import {describe, expect, test} from '@jest/globals';
import {Observable, of, ReplaySubject} from 'rxjs';
import {converge} from './operators';
import {emitMeta, rxMeta} from './rx-meta';
import {cold} from 'jest-marbles';
import {MetaWithSource} from "./types";


describe('Operators', () => {
    let metaCarrier$: Observable<number>;

    beforeEach(() => {
        metaCarrier$ = rxMeta(of(1, 2), new ReplaySubject<string>());
        emitMeta(metaCarrier$, 'a')
        emitMeta(metaCarrier$, 'b')
    });

    test('converge should emit data and channel data from the source observable', done => {
        const expected = cold('(ab|)', {
            a: {data: 1, meta: 'a'},
            b: {data: 2, meta: 'b'},
        });

        const converged$ = metaCarrier$.pipe<MetaWithSource<number, string>>(converge())
        expect(converged$).toBeObservable(expected);

        done();
    });
});
