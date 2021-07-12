import './App.css';
import Square from './components/Square';
import { useEffect, useState } from 'react';

function App() {
  const [squareValues, setSquareValues] = useState(Array(16).fill(null));
  const [start, setStart] = useState(false);
  const [newSquares, setNewSquares] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const triedDirections = [];
    function handleKeyboard(e) {
      const direction = getDirection(e.key);
      if (result) {
        return;
      }
      if (!triedDirections.includes(direction) && direction) {
        triedDirections.push(direction);
      }
      if (!direction) {
        return;
      }

      const newSquareValues = squareValues.slice();
      const newSkipSquares = [];
      let invalidMove = [];

      // Adds squares
      newSquareValues.forEach((squareValue, index) => {
        if (!squareValue || newSkipSquares.includes(index)) {
          return;
        }

        const targetIndex = crossDirections[index][direction].find(
          element => newSquareValues[element]
        );

        const targetSquare = {
          squareValue: newSquareValues[targetIndex],
          index: targetIndex,
        };

        if (
          squareValue === targetSquare.squareValue &&
          !newSkipSquares.includes(targetSquare.index)
        ) {
          newSquareValues[targetSquare.index] += squareValue;
          newSquareValues[index] = null;
          newSkipSquares.push(targetSquare.index);
          invalidMove.push(false);

          return;
        }

        invalidMove.push(true);
      });

      if (newSquareValues.includes(1024)) {
        setResult('You win');
      } else if (
        !newSquareValues.includes(null) &&
        !invalidMove.includes(false) &&
        triedDirections.length === 4
      ) {
        setResult('Game over');
        return;
      }

      // Moves squares
      for (let i = 0, ctr = 1; i < ctr; i += 1) {
        endSquares[direction].forEach((children, childrenIndex) => {
          const lastSquares = [];
          const filledSquares = children.filter(
            child => newSquareValues[child]
          );

          // Moves the square value to next square (1 by 1)
          children.forEach((child, childIndex) => {
            if (!newSquareValues[child]) {
              return;
            }
            const currentEndSquares = endSquares[direction][childrenIndex];
            if (
              !newSquareValues[currentEndSquares[childIndex + 1]] &&
              childIndex !== children.length - 1
            ) {
              newSquareValues[currentEndSquares[childIndex + 1]] =
                newSquareValues[currentEndSquares[childIndex]];
              newSquareValues[currentEndSquares[childIndex]] = null;
              invalidMove.push(false);
              return;
            }
            invalidMove.push(true);
          });

          if (filledSquares.length === 0) {
            return;
          }

          // Checks from last square to the first square (group)
          for (
            let j = children.length;
            j > children.length - filledSquares.length;
            j -= 1
          ) {
            newSquareValues[children[j - 1]]
              ? lastSquares.push(children[j - 1])
              : lastSquares.push(false);
          }

          if (lastSquares.includes(false)) {
            ctr += 1;
          }
        });
      }

      if (!invalidMove.includes(false)) {
        return;
      }

      const emptySquares = [];
      newSquareValues.forEach((value, index) => {
        if (value === null) {
          emptySquares.push(index);
        }
      });

      const { newSquares, finalSquareValues } = randomSquare(
        newSquareValues,
        emptySquares
      );

      setNewSquares(newSquares);
      setSquareValues(finalSquareValues);
    }
    window.addEventListener('keypress', handleKeyboard);

    return () => {
      window.removeEventListener('keypress', handleKeyboard);
    };
  }, [result, squareValues, start]);

  function spawnSquares() {
    const res = [];

    squareValues.forEach((squareValue, i) =>
      res.push(
        <Square
          key={i}
          newSquare={newSquares.includes(i) ? true : false}
          value={squareValue}
        ></Square>
      )
    );

    return res;
  }

  function handleClickStart() {
    const { newSquares, finalSquareValues } = randomSquare(
      Array(16).fill(null),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    );
    setSquareValues(finalSquareValues);
    setNewSquares([]);
    setResult(null);
    setStart(!start);
  }

  return (
    <div className="g-2048">
      <div className="top-row">
        <div onClick={handleClickStart} className="start-btn">
          New game
        </div>

        <div className="score">
          Score: {squareValues.reduce((a, b) => a + b, 0)}
        </div>
      </div>
      <div className="board" style={result ? { filter: 'blur(2px)' } : {}}>
        {spawnSquares()}
      </div>

      {result ? (
        <div className="result">
          <div className="status">{result}</div>
          <div onClick={handleClickStart} className="start-btn">
            Play again
          </div>
        </div>
      ) : (
        ''
      )}

      <footer>
        Created by skrr-tech, based on
        <a href="https://play2048.co/">play2048.co</a>
      </footer>
    </div>
  );
}

export default App;

const endSquares = {
  up: [
    [12, 8, 4, 0],
    [13, 9, 5, 1],
    [14, 10, 6, 2],
    [15, 11, 7, 3],
  ],
  down: [
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
  ],
  left: [
    [3, 2, 1, 0],
    [7, 6, 5, 4],
    [11, 10, 9, 8],
    [15, 14, 13, 12],
  ],
  right: [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
  ],
};

function randomSquare(squareValues, emptySquares) {
  let selection = emptySquares.slice();

  const newSquares = [];
  const newSquareValues = squareValues.slice();
  const pick1 = selection[randomNumber(0, selection.length - 1)];

  if (emptySquares.length === 16) {
    selection = selection.filter((value, index) => index !== pick1);
    const pick2 = selection[randomNumber(0, selection.length - 1)];
    newSquareValues[pick2] = randomNumber(1, 13) === 13 ? 4 : 2;
  }

  newSquareValues[pick1] = randomNumber(1, 13) === 13 ? 4 : 2;

  newSquares.push(pick1);
  const res = {
    newSquares: newSquares,
    finalSquareValues: newSquareValues,
  };
  return res;
}

const crossDirections = {
  0: { up: [null], down: [4, 8, 12], right: [1, 2, 3], left: [null] },
  1: { up: [null], down: [5, 9, 13], right: [2, 3], left: [0] },
  2: { up: [null], down: [6, 10, 14], right: [3], left: [1, 0] },
  3: { up: [null], down: [7, 11, 15], right: [null], left: [2, 1, 0] },
  4: { up: [0], down: [8, 12], right: [5, 6, 7], left: [null] },
  5: { up: [1], down: [9, 13], right: [6, 7], left: [4] },
  6: { up: [2], down: [10, 14], right: [7], left: [5, 4] },
  7: { up: [3], down: [11, 15], right: [null], left: [6, 5, 4] },
  8: { up: [4, 0], down: [12], right: [9, 10, 11], left: [null] },
  9: { up: [5, 1], down: [13], right: [10, 11], left: [8] },
  10: { up: [6, 2], down: [14], right: [11], left: [9, 8] },
  11: { up: [7, 3], down: [15], right: [null], left: [10, 9, 8] },
  12: { up: [8, 4, 0], down: [null], right: [13, 14, 15], left: [null] },
  13: { up: [9, 5, 1], down: [null], right: [14, 15], left: [12] },
  14: { up: [10, 6, 2], down: [null], right: [15], left: [13, 12] },
  15: { up: [11, 7, 3], down: [null], right: [null], left: [14, 13, 12] },
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDirection(key) {
  const directions = {
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
  };

  return directions[key];
}
