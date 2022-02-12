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
    <div className="min-h-screen color text-amber-50 bg-green-600 text-center">
      <div className="relative px-6 pt-10 top-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/2 sm:max-w-2xl sm:mx-auto sm:rounded-lg sm:px-10">
        {message && (
          <h2 className="top-10 text-5xl ml-3 mr-3 text-orange-700 bg-orange-200  rounded-md p-3">
            {message}
          </h2>
        )}
        <div className="mx-auto">
          <div className="divide-y divide-gray-300/50">
            <div className="py-8 text-base leading-7 space-y-6 text-gray-600">
              <p>
                <div className="score">
                  <div>{teamName}</div>
                  <div
                    className="bg-green-600
                   rounded-md text-white"
                  >
                    {time}
                  </div>
                  <div>{opponentName}</div>

                  <div className="m-10">{goals}</div>
                  <div className="m-10">vrs</div>
                  <div className="m-10">{opponentGoal}</div>
                </div>
              </p>
              <div className="block font-size-10">
                <EventList disableUndo eventList={events} />
              </div>
            </div>
            <div className="foots pt-8 text-base leading-7 font-semibold">
              <p>
                <a
                  href="https://github.com/cleanbill/next-foot"
                  className="text-sky-500 hover:text-sky-600"
                >
                  &larr; Footswell
                </a>
              </p>
              <p>
                <a href="/history" className="text-sky-500 hover:text-sky-600">
                  Games Played &rarr;
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <GameChanger onGameChanged={(game: StateOfTheGame) => updated(game)} />

      <style jsx>{`
        .block {
          display: block;
          font-size: 15px;
        }
        .foots {
          display: grid;
          grid-template-columns: auto auto;
        }
        .score {
          display: grid;
          grid-template-columns: auto auto auto;
          text-align: center;
          width: 100%;
          font-size: 30px;
        }
      `}</style>
    </div>
  );
}
export default Board;
