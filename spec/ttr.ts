/* >>> boilerplate */
import { Observable, Subject, TestScheduler } from 'rxjs/Rx';
import { assertDeepEqual } from '../testing/helper';
/* <<< boilerplate */


describe('TEST: True-Time Replay', () => {
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


  it('should return true-time replay Observable', () => {
    const eventArray: KeyEvent[] = [
      { key: 'A', timestamp: 100 },
      { key: 'B', timestamp: 120 },
      { key: 'C', timestamp: 150 },
      { key: 'D', timestamp: 160 },
      { key: 'E', timestamp: 200 }
    ];
    const source$ = cold<KeyEvent[]>('a', { a: eventArray });
    const marbles = 'A-B--CD---E';
    const values = { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E' };

    let initialTime: number;
    const test$ =
      source$
        .do(objs => initialTime = objs[0].timestamp)
        .map(objs => objs.map(obj => {
          obj.timestamp = obj.timestamp - initialTime;
          return obj;
        }))
        .mergeMap(objs => {
          return Observable.range(0, objs.length)
            .delayWhen(x => Observable.interval(objs[x].timestamp, ts))
            .map(x => objs[x].key)
        });

    ts.expectObservable(test$).toBe(marbles, values);
    ts.flush();
  });

});


interface KeyEvent {
  key: string;
  timestamp: number;
}