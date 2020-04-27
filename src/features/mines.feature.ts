import {DialogFeature} from "./dialog.feature";
import {fromEvent, Subject} from "rxjs";
import {filter, map, withLatestFrom} from "rxjs/operators";
import {getElement, getIndexes} from "../misc";
import {GameFeature} from "./game.feature";

const adjustent = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
];

export const MinesFeature = {

  clicks$: new Subject<HTMLElement>(),

  get filteredClicks$() {
    return this.clicks$.pipe(
      withLatestFrom(GameFeature.gameOver$),
      filter(([mineElement, gameOver]) => !gameOver),
      map(([mineElement, gameOver]) => mineElement)
    );
  },

  openCell$: new Subject<HTMLElement>(),

  get bombClicks$() {
    return this.filteredClicks$
      .pipe(
        filter(isMined)
      );
  },

  get emptyClicks$() {
    return this.openCell$
      .pipe(
        filter(isEmpty)
      );
  },

  get numberClicks$() {
    return this.openCell$
      .pipe(
        filter(isNumber)
      );
  },


  get spawnMinesToContainer() {
    return (minesContainer: HTMLElement, gameSize: number, minesNumber: number) => {
      console.log(`Spawn mines call: gameSize = ${gameSize}, minesNumber = ${minesNumber}`);
      createCells(minesContainer, gameSize);
      placeMines(minesContainer, minesNumber);
      placeNumbers(minesContainer, gameSize);

      if (!minesContainer.getAttribute('data-initialized')) {
        fromEvent(minesContainer, 'click')
          .pipe(
            map(event => event.target as HTMLElement),
            filter(target => target.classList.contains('mine'))
          )
          .subscribe(
            (mineElement) => {
              console.log(mineElement);
              this.clicks$.next(mineElement);
            }
          );
       minesContainer.setAttribute('data-initialized', 'true');
      }
    }
  },

  init() {
    this.filteredClicks$
      .subscribe(
        (cell: HTMLElement) => {
            this.openCell$.next(cell);
        }
      );

    this.openCell$
      .subscribe( (cell: HTMLElement) => {
        cell.classList.add('opened');
      });
    this.numberClicks$
      .subscribe(
        (cell: HTMLElement) => {
          cell.innerText = cell.getAttribute('mines-near')
        }
      );
    this.bombClicks$
      .subscribe(
        (cell: HTMLElement) => {
          console.log(cell);
          DialogFeature.messages$.next({ message: 'Oops :(', type: 'error'});
          GameFeature.gameOver$.next(true);
          (Array.from(cell.parentElement.childNodes) as HTMLElement[]).forEach(
            (cell) => {
              this.openCell$.next(cell);
            }
          )
        }
      );
    this.emptyClicks$
      .subscribe(
        (cell: HTMLElement) => {
          const clickNotMines = (cell: HTMLElement) => {
            if (!isMined(cell) && !isOpened(cell))
            this.clicks$.next(cell);
          };
          const gameSize = parseInt(cell.parentElement.getAttribute('data-game-size'));
          const cellIndex = parseInt(cell.getAttribute('data-index'));
          const cells = Array.from(cell.parentElement.querySelectorAll('.mine'));
          const {x, y} = getIndexes(cellIndex, gameSize);
          onAdjusted(clickNotMines, x, y, cells, gameSize);
        }
      );
  }


};


function createCells(minesContainer: HTMLElement, gameSize: number) {
  DialogFeature.messages$.next({ message: 'Creating cells...', type: 'message'});
  minesContainer.innerHTML = '';

  for (let i = 0; i < gameSize * gameSize; i++) {
    let cell = document.createElement('div');
    cell.classList.add('mine');
    cell.setAttribute('data-index', i + '');
    minesContainer.appendChild(cell);
  }

  minesContainer.setAttribute('data-game-size', gameSize + '');
  minesContainer.style.gridTemplateColumns = `repeat(${gameSize}, 1fr)`;
}


function placeMines(minesContainer: HTMLElement, minesNumber: number) {
  DialogFeature.messages$.next({ message: 'Placing mines...', type: 'message'});

  const mines = Array.from(minesContainer.querySelectorAll('*')) as HTMLElement[];

  if (mines.length <= minesNumber) {
    DialogFeature.messages$.next({ message: 'Too much mines!', type: 'error'});

    mines.forEach(
      mine => {
        doMine(mine);
      }
    );

    minesContainer.setAttribute('data-mines-number', minesNumber + '');
  }

  let minesPlaced = 0;

  while (minesPlaced < minesNumber) {

    let index = Math.round(Math.random() * (mines.length - 1));

    if (!isMined(mines[index])) {
      doMine(mines[index]);
      minesPlaced += 1;
    }

  }

}

function placeNumbers(minesContainer: HTMLElement, gameSize: number) {

  const cells = Array.from(minesContainer.querySelectorAll('.mine')) as HTMLElement[];

  for (let i = 0; i < cells.length; i++) {
    if (isMined(cells[i])) {
      const {x, y} = getIndexes(i, gameSize);
      const increment = (cell: HTMLElement) => {
          if (!isMined(cell)) {
            incrementCell(cell);
          }
        };
      onAdjusted(increment, x, y, cells, gameSize);
    }
  }

}

function onAdjusted(f: (cell: Element) => any, x:number, y: number, cells: Element[], gameSize: number) {
  adjustent.forEach(
    ([ax, ay]) => {
      const cx = x + ax, cy = y + ay;
      if (cx >= 0 && cx < gameSize && cy >= 0 && cy < gameSize) {
        const cell = getElement(cells, gameSize)(x + ax, y + ay);
        f(cell);
      }
    }
  )
}


function incrementCell(cell: Element) {
  if (!cell.classList.contains('number')) {
    cell.classList.add('number');
    cell.setAttribute('mines-near', '0');
  }

  cell.setAttribute(
    'mines-near',
    (parseInt(cell.getAttribute('mines-near')) + 1) + ''
  );
}

function doMine(cell: Element) {
  cell.classList.add('mined');
  cell.setAttribute('data-mined', '1');
}

function isNumber(cell: HTMLElement): boolean {
  return cell.classList.contains('number');
}

function isMined(cell: HTMLElement): boolean {
  return cell.getAttribute('data-mined') == '1';
}

function isEmpty(cell: HTMLElement): boolean {
  return !isMined(cell) && !isNumber(cell);
}

function isOpened(cell: HTMLElement) {
  return cell.classList.contains('opened');
}
