import {BehaviorSubject} from "rxjs";

import {MinesNumberFeature} from "./features/mines-number.feature";
import {FieldSizeFeature} from "./features/field-size.feature";
import {MinesFeature} from "./features/mines.feature";
import {MyElements} from "./elements";
import {GameFeature} from "./features/game.feature";
import {withLatestFrom} from "rxjs/operators";
import {DialogFeature} from "./features/dialog.feature";

export const gameStart$ = new BehaviorSubject(true);


console.log('Game Elements:');
console.log(MyElements);


MinesNumberFeature.init();
FieldSizeFeature.init();
MinesFeature.init();
GameFeature.init();
DialogFeature.init();


GameFeature.resetGame$
  .pipe(
    withLatestFrom(
      MinesNumberFeature.minesNumber$,
      FieldSizeFeature.fieldSize$
    )
  )
  .subscribe(
    ([resetGame, minesNumber, fieldSize]: [boolean, number, number]) => {
      if (Number.isNaN(minesNumber)) return;
      if (Number.isNaN(fieldSize)) return;

      console.log('Reset');

      MinesFeature.spawnMinesToContainer(MyElements.minesContainer, fieldSize, minesNumber);
      GameFeature.gameOver$.next(false);
    }
  );

