/* >>> boilerplate */
import { Observable, Subject, TestScheduler } from 'rxjs/Rx';
import lodash from 'lodash';
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
    const eventHistoryArray: KeyEvent[] = [
      { key: 'A', timestamp: 100 },
      { key: 'B', timestamp: 120 },
      { key: 'C', timestamp: 150 },
      { key: 'D', timestamp: 160 },
      { key: 'E', timestamp: 200 }
    ];
    const source$ = hot<KeyEvent[]>('---^a-----a', { a: eventHistoryArray });
    const marbles = '-A-B--CA-B--CD---E';
    const values = { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E' };

    const test$ =
      source$.asObservable()
        .map(objs => lodash.cloneDeep(objs))
        .map(objs => {
          const initialTime = objs[0].timestamp;
          return objs.map(obj => {
            obj.timestamp = obj.timestamp - initialTime;
            return obj;
          })
        })
        .switchMap(objs => {
          return Observable.range(0, objs.length)
            .delayWhen(x => Observable.interval(objs[x].timestamp, ts))
            .map(x => objs[x].key)
        });

    ts.expectObservable(test$).toBe(marbles, values);
    ts.flush();
  });


  it('should return true-time replay Array-Observable', () => {
    const eventHistoryArray: KeyEvent[] = [
      { key: 'A', timestamp: 100 },
      { key: 'B', timestamp: 120 },
      { key: 'C', timestamp: 150 },
      { key: 'D', timestamp: 160 },
      { key: 'E', timestamp: 200 }
    ];
    const source$ = hot<KeyEvent[]>('---^a-----a', { a: eventHistoryArray });
    const marbles = '-A-B--CA-B--CD---E';
    const values = { A: ['A'], B: ['A', 'B'], C: ['A', 'B', 'C'], D: ['A', 'B', 'C', 'D'], E: ['A', 'B', 'C', 'D', 'E'] };

    const test$ =
      source$.asObservable()
        .map(objs => lodash.cloneDeep(objs))
        .map(objs => {
          const initialTime = objs[0].timestamp;
          return objs.map(obj => {
            obj.timestamp = obj.timestamp - initialTime;
            return obj;
          })
        })
        .switchMap(objs => {
          return Observable.range(0, objs.length)
            .delayWhen<number>(x => Observable.interval(objs[x].timestamp, ts))
            .map(x => objs[x].key)
            .scan((array, key) => [...array, key], []);
        });

    ts.expectObservable(test$).toBe(marbles, values);
    ts.flush();
  });

});


interface KeyEvent {
  key: string;
  timestamp: number;
}