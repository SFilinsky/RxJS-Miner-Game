import {MinesNumberFeature} from "./features/mines-number.feature";
import {FieldSizeFeature} from "./features/field-size.feature";
import {BehaviorSubject} from "rxjs";
import {MinesFeature} from "./features/mines.feature";
import {MyElements} from "./elements";
import {GameFeature} from "./features/game.feature";
import {withLatestFrom} from "rxjs/operators";

MinesNumberFeature.minesNumber$.subscribe(console.log);
FieldSizeFeature.fieldSize$.subscribe(console.log);

export const gameStart$ = new BehaviorSubject(true);


console.log('Initialized elements');
console.log(MyElements);


MinesNumberFeature.init();
FieldSizeFeature.init();
MinesFeature.init();
GameFeature.init();


GameFeature.resetGame$
  .pipe(
    withLatestFrom(
      MinesNumberFeature.minesNumber$,
      FieldSizeFeature.fieldSize$
    )
  )
  .subscribe(
    ([resetGame, minesNumber, fieldSize]: [boolean, number, number]) => {
      console.log('Reset');

      if (Number.isNaN(minesNumber)) return;
      if (Number.isNaN(fieldSize)) return;

      MinesFeature.spawnMinesToContainer(MyElements.minesContainer, minesNumber, fieldSize);
    }
  );

