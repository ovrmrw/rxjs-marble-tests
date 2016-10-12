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
    const actions$ = new Subject<Promise<number>>();
    const dispatcher$ = new Subject<number>();
    const provider$ = new BehaviorSubject<number>(0);


    actions$.asObservable()
      .concatMap(action => { // queues order by Action dispatch.
        return Observable.from(action)
          .timeoutWith(100, Observable.empty<number>()); // if time out, the value will be lost.
      })
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
        expect(results).toEqual([0, 2, 3]);
        done();
      });


    actions$.next(createAsyncAction(1, 110));
    actions$.next(createAsyncAction(2, 50));
    actions$.next(createAsyncAction(3, 10));

    setTimeout(() => {
      provider$.complete();
    }, 100);

  });

});


function createAsyncAction<T>(value: T, delay: number): Promise<T> {
  return new Promise<T>(resolve => {
    setTimeout(() => resolve(value), delay);
  });
}


interface Action {
  value: number;
  delay: number;
}


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
