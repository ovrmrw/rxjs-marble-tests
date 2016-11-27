import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';


xdescribe('TEST: Resolving order associated with Actions order', () => {
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


    actions$
      .asObservable() // <--- if comment out, type of var action becomes "any" although that is exptected as "Action". 
      .concatMap(action => {
        return Observable.from(action)
          .timeoutWith(100, Observable.empty<Action>());
      })
      .subscribe(action => {
        dispatcher$.next(action);
      });


    Observable
      .zip<AppState>(
        dispatcher$
          .asObservable() // <--- if comment out, type of variables below 'state' and 'action' turns into "any" although they are exptected as "number" and "Action".
          .scan((state, action) => {
            switch (action.type) {
              case 'SET':
                return action.payload;
              default:
                return state;
            }
          }, initialState.counter),

        (counter): AppState => {
          return Object.assign({}, initialState, { counter });
        }
      )
      .subscribe(newState => {
        provider$.next(newState);
      });


    provider$
      .asObservable()  // <--- if comment out, type of variable becomes "any" although that is exptected as "AppState".      
      .share()
      .do(appState => console.log(appState)) // <--- although variable type is exptected as "AppState", do operator breaks that.
      .subscribe(appState => {
        results.push(appState);
      }, err => {

      }, () => {
        expect(results).toEqual([{ counter: 0 }, { counter: 2 }, { counter: 3 }]);
        done();
      });


    actions$.next(createAsyncAction({ type: 'SET', payload: 1 }, 110));
    actions$.next(createAsyncAction({ type: 'SET', payload: 2 }, 50));
    actions$.next(createAsyncAction({ type: 'SET', payload: 3 }, 10));

    setTimeout(() => {
      provider$.complete();
    }, 100);

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