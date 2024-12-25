import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import {WINNING_COMBINATIONS} from "./winning-combination";

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

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  /*
  이미 gameTurns 상태가 UI를 업데이트하고 있으므로,
  activePlayer 상태는 더 이상 필요하지 않다.
  (하나의 UI를 업데이트하는 데 두 개의 상태를 쓸 필요가 없음)
  const [activePlayer, setActivePlayer] = useState('X'); // X부터 시작
 
  파생 상태를 이용하면 됨!
  */
  const currentPlayer = deriveActivePlayer(gameTurns);
  
  function handleClickSquare(rowIndex, colIndex) {
    // setActivePlayer((curPlayer) => (curPlayer === 'X' ? 'O' : 'X'));
    setGameTurns((prevTurns) => {
      // 다른 상태를 병합하는 것은 권장하지 않으므로 새 변수 생성
      // let currentPlayer = "X";

      // 항상 가장 최신 게임 턴을 보도록 설정
      // gameTurns의 이전 상태 기반하여 변경
      // if (prevTurns.length > 0 && prevTurns[0].player === "X") {
      //   currentPlayer = "O"; // 가장 최근 게임한 플레이어가 X라면 O로 변경
      // }
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
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
            initialName="Player 1"
            symbol="X"
            isActive={currentPlayer === "X"}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={currentPlayer === "O"}
          />
        </ol>

        <GameBoard onClickSquare={handleClickSquare} turns={gameTurns} />
      </div>

      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
