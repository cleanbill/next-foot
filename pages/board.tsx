import { useState } from "react";
import EventList from "../components/eventList";
import GameChanger from "../components/gameChanger";
import { StateOfTheGame } from "./api/events";

function Board() {
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState(0);
  const [message, setMessage] = useState("");
  const [opponentGoal, setOpponentGoals] = useState(0);
  const [opponentName, setOpponentName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [time, setTime] = useState("00:00");
  const updated = (game: StateOfTheGame) => {
    setEvents(game.events);
    setGoals(game.goals);
    setMessage(game.message);
    setOpponentGoals(game.opponentGoals);
    setOpponentName(game.opponentName);
    setTeamName(game.teamName);
    setTime(game.timeDisplay);
  };
  return (
    <div className="container">
      <h1>Footswell</h1>

      <div className="score">
        <div>{teamName}</div>
        <div>{time}</div>
        <div>{opponentName}</div>

        <div>{goals}</div>
        <div>vrs</div>
        <div>{opponentGoal}</div>
      </div>

      <div className="mess">{message}</div>

      <GameChanger onGameChanged={(game: StateOfTheGame) => updated(game)} />
      <EventList disableUndo eventList={events} />

      <style jsx>{`
        button {
          padding: 10px;
          border-radius: 10px;
          text-align: center;
          width: 100%;
        }
        h1 {
          text-align: center;
        }
        .score {
          display: grid;
          grid-template-columns: auto auto auto;
          text-align: center;
          width: 100%;
          font-size: 30px;
        }
        .mess {
          color: red;
          background-color: orange;
          width: 100%;
          font-size: 30px;
          text-align: center;
          margin: 10px;
        }
        .container {
          color: #ede8df;
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: green;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
export default Board;
