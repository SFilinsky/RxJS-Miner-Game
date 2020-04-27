import {fromEvent, merge} from "rxjs";
import {map, pairwise, startWith, tap} from "rxjs/operators";

import {DefaultSettings} from "../default-settings";
import {Validators} from "../validators";
import {extractInput} from "../misc";
import {MyElements} from "../elements";


export const MinesNumberFeature = {

  minesNumberValidator: Validators.validateNumberInput(
    DefaultSettings.MINES_NUMBER_MIN,
    DefaultSettings.MINES_NUMBER_MAX
  ),

  minesNumberInput$: merge(
    fromEvent(MyElements.minesNumberInput,'input'),
    fromEvent(MyElements.minesNumberInput,'change')
  )
    .pipe(
      map(event => {
        return extractInput(event).value;
      })
    ),

  get minesNumber$() {
    return this.minesNumberInput$
      .pipe(
        pairwise(),
        map(([prev, curr]) => {
          try {
            return this.minesNumberValidator(curr);
          } catch (e) {
            return prev;
          }
        }),
        startWith(DefaultSettings.MINES_NUMBER),
        tap((value: number) => MyElements.minesNumberInput.value = '' + value)
      )
  },

  init() {
    MyElements.minesNumberInput.setAttribute('min', DefaultSettings.FIELD_SIZE_MIN + '');
    MyElements.minesNumberInput.setAttribute('max', DefaultSettings.FIELD_SIZE_MAX + '');
  }

};
