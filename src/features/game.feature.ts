import {BehaviorSubject, fromEvent, merge} from "rxjs";
import {mapTo} from "rxjs/operators";
import {MyElements} from "../elements";
import {gameStart$} from "../index";

export const GameFeature = {

  startClick$: fromEvent(MyElements.startButton, 'click')
    .pipe(
      mapTo(true)
    ),


  get resetGame$() {
    return merge(
      new BehaviorSubject<boolean>(true),
      this.startClick$,
      gameStart$
    )
  },


  init() {

  }

};
