import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { assert } from 'chai';


describe('TEST: Resolving order associated with Actions order', () => {
  let initialState: AppState;

  beforeEach(() => {
    initialState = {
      counter: 0
    };
  });


  it('basic Redux pattern', (done) => {
    const results: AppState[] = [];
    const actions$ = new Subject<Promise<Action>>();
    const dispatcher$ = new Subject<Action>();
    const provider$ = new BehaviorSubject<AppState>(initialState);


    actions$.asObservable()
      .concatMap(action => { // queues order by Action dispatch.
        return Observable.from(action)
          .timeoutWith(100, Observable.empty<Action>()); // if time out, the value will be lost.
      })
      .subscribe(action => {
        dispatcher$.next(action);
      });


    Observable
      .zip<AppState>(...[
        dispatcher$.asObservable()
          .scan((state, action) => { // reducer
            switch (action.type) {
              case 'SET':
                return action.payload;
              default:
                return state;
            }
          }, initialState.counter),

        (counter): AppState => { // projection
          return Object.assign({}, initialState, { counter });
        }
      ])
      .subscribe(newState => {
        provider$.next(newState);
      });


    provider$.asObservable()
      .share()
      .subscribe(appState => {
        results.push(appState);
      }, err => {
        /* error handling */
      }, () => { // when completed.
        // expect(results).toEqual([{ counter: 0 }, { counter: 2 }, { counter: 3 }]);
        assert.deepEqual(results, [{ counter: 0 }, { counter: 2 }, { counter: 3 }]);
        done();
      });


    actions$.next(createAsyncAction({ type: 'SET', payload: 1 }, 110));
    actions$.next(createAsyncAction({ type: 'SET', payload: 2 }, 50));
    actions$.next(createAsyncAction({ type: 'SET', payload: 3 }, 10));

    setTimeout(() => {
      provider$.complete();
    }, 50);

  });

});


function createAsyncAction(action: Action, delay: number): Promise<Action> {
  return new Promise<Action>(resolve => {
    setTimeout(() => resolve(action), delay);
  });
}


interface Action {
  type: string;
  payload: number;
}

interface AppState {
  counter: number;
}
