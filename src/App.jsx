import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combination";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

// 상태가 아닌 변수는 컴포넌트 바깥에 저장해도 된다.
const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

/* 헬퍼 함수: 컴포넌트 바깥에 정의
데이터에 접근할 필요가 없고,
컴포넌트 함수가 재실행될 때 이 함수까지 재실행될 필요 없음 */
function deriveActivePlayer(gameTurns) {
  // gameTurns의 현재 상태 기반하여 변경
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O"; // 가장 최근 게임한 플레이어가 X라면 O로 변경
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, players) {
  // const [hasWinner, setHasWinner] = useState(false); 상태 불필요
  let winner;
  // 매 턴마다(재실행마다) 우승 조건 검토
  for (const combi of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combi[0].row][combi[0].column];
    const secondSquareSymbol = gameBoard[combi[1].row][combi[1].column];
    const thirdSquareSymbol = gameBoard[combi[2].row][combi[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function deriveGameBoard(gameTurns) {
  // turns 배열에 따라 게임보드 업데이트하는 방법
  let gameBoard = [...initialGameBoard.map((innerArray) => [...innerArray])];
  // gameBoard를 도출할 때, 기존 메모리를 참조하여 수정하는 것이 아닌 복사본을 수정하도록 하여
  // Rematch 시 상태 초기화, 즉 게임이 초기화(재렌더링)되도록 한다.
  // 이 배열을 복사하여 사용하면, gameBoard는 초기 상태를 갖지만, 이후에 게임의 진행 상황에 따라 업데이트될 수 있다.

  // turns가 빈 배열이라면 for loop는 작동하지 않음
  for (const turn of gameTurns) {
    // turns 배열을 destructuring(구조 분해 할당)하여 square와 player를 추출
    const { square, player } = turn;
    const { row, col } = square;

    // gameBoard의 row, col 위치에 player를 할당
    gameBoard[row][col] = player;

    // gameBoard는 App.jsx의 gameTurns 상태에서 파생된 것
    // 제어하는 상태의 수는 최소화하되, 각 상태에서 가능한 한 많은 정보와 값을 파생시킨다.
  }
  return gameBoard;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  /*
  이미 gameTurns 상태가 UI를 업데이트하고 있으므로,
  activePlayer 상태는 더 이상 필요하지 않다.
  (하나의 UI를 업데이트하는 데 두 개의 상태를 쓸 필요가 없음)
  const [activePlayer, setActivePlayer] = useState('X'); // X부터 시작
 
  파생 상태를 이용하면 됨!
  */

  const currentPlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleClickSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      // 다른 상태를 병합하는 것은 권장하지 않으므로 새 변수 생성

      // 항상 가장 최신 게임 턴을 보도록 설정
      // gameTurns의 이전 상태 기반하여 변경
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRematch() {
    // gameTurns 상태를 초기화
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prev) => {
      return {
        ...prev,
        // []: JS 문법
        [symbol]: newName,
        // 변경되는 순간, 해당 플레이어의 이름만 업데이트
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          {/* 동일한 컴포넌트를 사용하더라도,
          동일한 로직을 공유하고 있지만
          완전히 분리된 인스턴스가 각각 생성되어
          사용하는 위치가 분리된다.
          즉, 재사용해도 서로에게 영향을 주지 않는다. */}
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={currentPlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={currentPlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRematch={handleRematch} />
        )}
        <GameBoard onClickSquare={handleClickSquare} board={gameBoard} />
      </div>

      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
