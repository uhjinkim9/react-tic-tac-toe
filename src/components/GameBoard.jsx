import { useState } from "react";

// 상태가 아닌 변수는 컴포넌트 바깥에 저장해도 된다.
const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export default function GameBoard({ onClickSquare, turns }) {
  /*
    만약 상태가 객체나 배열이라면,
    해당 상태를 업데이트할 때 이전 상태를 하나 복제해서 새 객체 또는 배열로 저장해 두고
    복제된 버전을 수정하고 교체하는 것이 좋다.
    
    객체나 배열은 JS 내의 참조값이기 때문에 메모리 속의 기존 값을 바로 변경하게 되는데,
    리액트가 상태의 변화를 업데이트하는 시점 이전에 변경되기 때문에, 알 수 없는 오류가 발생할 수 있다.
    이런 오류는 앱 내부의 한 상태에 대해 여러 상태 변경이 예정되어 있을 때 발생한다.
    */

  /*
    - activePlayerSymbol prop을 받아오는 방법
    const [gameBoard, setGameBoard] = useState(initialGameBoard);
    setGameBoard((prevGameBoard) => {
        const updatedBoard = [...prevGameBoard.map(innerArray => [...innerArray])]; // 중첩 배열까지 전부 복제
        updatedBoard[rowIndex][colIndex] = activePlayerSymbol;
        return updatedBoard;
    });
    onClickSquare();
    */

  // turns 배열에 따라 게임보드 업데이트하는 방법
  let gameBoard = initialGameBoard;

  // turns가 빈 배열이라면 for loop는 작동하지 않음
  for (const turn of turns) {
    // turns 배열을 destructuring(구조 분해 할당)하여 square와 player를 추출
    const { square, player } = turn;
    const { row, col } = square;

    // gameBoard의 row, col 위치에 player를 할당
    gameBoard[row][col] = player;

    // gameBoard는 App.jsx의 gameTurns 상태에서 파생된 것
    // 제어하는 상태의 수는 최소화하되, 각 상태에서 가능한 한 많은 정보와 값을 파생시킨다.
  }

  return (
    <ol id="game-board">
      {/* map의 index는 데이터의 위치와만 연결되어 있기 때문에 웬만하면 사용하지 않는 게 좋다. */}
      {gameBoard.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button
                  onClick={() => 
                    onClickSquare(rowIndex, colIndex)
                  }
                  disabled={playerSymbol !== null}
                >
                  {playerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
