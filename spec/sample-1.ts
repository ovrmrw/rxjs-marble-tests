/* >>> boilerplate */
import { Observable, Subject, TestScheduler } from 'rxjs/Rx';
import { assertDeepEqual, noop } from '../testing/helper';
import { assert } from 'chai';
/* <<< boilerplate */


describe('TEST: RxJS Marble Test basics', () => {
  /* >>> boilerplate */
  let ts: TestScheduler;
  let hot: typeof TestScheduler.prototype.createHotObservable;
  let cold: typeof TestScheduler.prototype.createColdObservable;

  beforeEach(() => {
    ts = new TestScheduler(assertDeepEqual);
    hot = ts.createHotObservable.bind(ts);
    cold = ts.createColdObservable.bind(ts);
  });
  /* <<< boilerplate */


  it('should return correct observable', () => {
    const source$ = cold<number>('-a-b-c', { a: 1, b: 2, c: 3 });
    const expected = '---B-C';
    const values = { A: 10, B: 20, C: 30 };
    const actual$ = mapFilterTest(source$);
    ts.expectObservable(actual$).toBe(expected, values);
    ts.flush();
  });


  // it('should return correct observable', () => {
  //   const source$ = cold<number>('-a', { a: 1 });
  //   const marbles = '-A';
  //   const values = { A: 1 };
  //   const test$ = mergeMapTest(source$);
  //   ts.expectObservable(test$).toBe(marbles, values);
  //   ts.flush();
  // });


  it('mergeMap', (done) => {
    let results: number[] = [];
    Observable.from([0, 1, 2])
      .mergeMap(value => Promise.resolve(value))
      .map(value => value * 10)
      .subscribe(value => {
        results.push(value);
      }, noop, () => {
        console.log('mergeMap', results);
        assert.deepEqual(results, [0, 10, 20]);
        done();
      });
  });


  it('switchMap', (done) => {
    let results: number[] = [];
    Observable.from([0, 1, 2])
      .switchMap(value => Promise.resolve(value))
      .map(value => value * 10)
      .subscribe(value => {
        results.push(value);
      }, noop, () => {
        console.log('switchMap', results);
        assert.deepEqual(results, [20]);
        done();
      });
  });


  it('timeoutWith', (done) => {
    let results: number[] = [];
    const promise = new Promise<number>(resolve => {
      setTimeout(function () {
        resolve(1);
      }, 2000);
    });

    Observable
      .from(promise)
      .timeoutWith(1000, Observable.of(2))
      .map(value => value * 10)
      .subscribe(value => {
        results.push(value);
      }, noop, () => {
        console.log('timeoutWith', results);
        assert.deepEqual(results, [20]);
        done();
      });

  });

});


function mapFilterTest(observable: Observable<number>): Observable<number> {
  return observable
    .map(value => value * 10)
    .filter(value => value > 10);
}


function mergeMapTest(observable: Observable<number>): Observable<number> {
  return observable
    .mergeMap(value => Promise.resolve(value))
    .map(value => value)
}
