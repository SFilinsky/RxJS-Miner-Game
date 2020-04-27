import {fromEvent, merge, Subject} from "rxjs";
import {mapTo} from "rxjs/operators";
import {MyElements} from "../elements";
import {gameStart$} from "../index";

export const GameFeature = {

  startClick$: fromEvent(MyElements.startButton, 'click')
    .pipe(
      mapTo(true)
    ),


  gameOver$: new Subject<boolean>(),
    // .pipe(
    //   pairwise(),
    //   filter(([prev, curr]) => prev != curr),
    //   map(([prev, curr]) => curr)
    // ) as Subject<boolean>,

  get resetGame$() {
    return merge(
      this.startClick$,
      gameStart$
    )
  },


  init() {

  }

};
