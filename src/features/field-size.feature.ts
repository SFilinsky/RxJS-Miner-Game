import {fromEvent, merge} from "rxjs";
import {map, pairwise, startWith, tap} from "rxjs/operators";
import {extractInput} from "../misc";

import {Validators} from "../validators";
import {DefaultSettings} from "../default-settings";
import {MyElements} from "../elements";

export const FieldSizeFeature = {

  fieldSizeValidator: Validators.validateNumberInput(
    DefaultSettings.FIELD_SIZE_MIN,
    DefaultSettings.FIELD_SIZE_MAX
  ),

  fieldSizeInput$: merge(
    fromEvent(MyElements.fieldSizeInput,'input'),
    fromEvent(MyElements.fieldSizeInput,'change')
  )
    .pipe(
      map(event => {
        return extractInput(event).value;
      })
    ),


  get fieldSize$() {
    return this.fieldSizeInput$
      .pipe(
        pairwise(),
        map(([prev, curr]) => {
          try {
            return this.fieldSizeValidator(curr);
          } catch (e) {
            return prev;
          }
        }),
        startWith(DefaultSettings.FIELD_SIZE),
        tap((value: number) => MyElements.fieldSizeInput.value = '' + value)
      )
  },

  init() {
    MyElements.fieldSizeInput.setAttribute('min', DefaultSettings.FIELD_SIZE_MIN + '');
    MyElements.fieldSizeInput.setAttribute('max', DefaultSettings.FIELD_SIZE_MAX + '');
  }

};
