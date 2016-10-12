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


  it('basic Redux pattern', async (done) => {
    const results: number[] = [];
    const dispatcher$ = new Subject<number>();
    const provider$ = new BehaviorSubject<number>(0);

    Observable
      .zip<number>(...[
        dispatcher$,
        (value) => value
      ])
      .subscribe(value => {
        provider$.next(value);
      });

    provider$
      .subscribe(value => {
        results.push(value);
      }, err => {
        /* error handling */
      }, () => {
        expect(results).toEqual([0, 1, 2, 3]);
        done();
      });

    await dispatchDelayedAction(1, 100, dispatcher$);
    await dispatchDelayedAction(2, 10, dispatcher$);
    await dispatchDelayedAction(3, 50, dispatcher$);
    await sleep(100);
    provider$.complete();
  });

});


function dispatchDelayedAction<T>(value: T, ms: number, dispatcher$: Subject<T>): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      dispatcher$.next(value);
      resolve();
    }, ms);
  });
}


function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
}