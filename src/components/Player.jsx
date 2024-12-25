import { useState } from "react";

export default function Player({ initialName, symbol, isActive }) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  /* const handleEditClick = () => setIsEditing(!isEditing);
    이것은 리액트가 권장하는 방식이 아니다.
    이전 상태값을 기반으로 업데이트하는 것(반환하고자 하는 새로운 상태 값으로 보내는 것)보다,
    함수를 한 번 거쳐서 최신 상태의 값을 반영하도록 보장하는 것이 권장된다.
    setIsEditing(wasEditing => !wasEditing)
    이렇게 자동으로 실행되는 함수를 통해 업데이트한다. */
  function handleEditClick() {
    setIsEditing((editing) => !editing);
  }

  function handleChange(e) {
    // e 객체는 자동으로 전달되는 이벤트 객체이다.
    setPlayerName(e.target.value);
    // 양방향 바인딩: 입력값의 변화에 반응하고 변경된 값을 다시 입력값에 전달하는 방식
  }

  let editablePlayerName = <span className="player-name">{playerName}</span>;

  if (isEditing) {
    editablePlayerName = (
      <input type="text" required value={playerName} onChange={handleChange} />
    );
  }

  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {editablePlayerName}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}
