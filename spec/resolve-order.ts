/* >>> boilerplate */
import { Observable, Subject, TestScheduler } from 'rxjs/Rx';
import { assertDeepEqual } from '../testing/helper';
/* <<< boilerplate */
import { BehaviorSubject } from 'rxjs/Rx';


describe('TEST: Resolving order associated with Actions order', () => {
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


  it('basic Redux pattern', (done) => {
    const results: number[] = [];
    const actions$ = new Subject<Action>();
    const dispatcher$ = new Subject<number>();
    const provider$ = new BehaviorSubject<number>(0);


    actions$
      .map(action => new Promise<number>(resolve => {
        setTimeout(() => resolve(action.value), action.delay);
      }))
      .concatMap(value => Observable.from(value).timeoutWith(100, Observable.of(-1))) // if time out, the value will be -1.
      .subscribe(value => {
        dispatcher$.next(value);
      });


    Observable
      .zip(...[
        dispatcher$, // reducer
        (value): number => value // projection
      ])
      .subscribe(value => {
        provider$.next(value);
      });


    provider$
      .subscribe(value => {
        results.push(value);
      }, err => {
        /* error handling */
      }, () => { // when completed.
        expect(results).toEqual([0, -1, 2, 3]);
        done();
      });


    actions$.next({ value: 1, delay: 110 });
    actions$.next({ value: 2, delay: 10 });
    actions$.next({ value: 3, delay: 50 });

    setTimeout(() => {
      provider$.complete();
    }, 100);

  });

});


// function dispatchDelayedAction<T>(value: T, ms: number, dispatcher$: Subject<T>): Promise<void> {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       dispatcher$.next(value);
//       resolve();
//     }, ms);
//   });
// }


// function sleep(ms: number): Promise<void> {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(), ms);
//   });
// }


interface Action {
  value: number;
  delay: number;
}