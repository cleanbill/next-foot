import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Positions from "../components/positions";
import PositionInput from "../components/positionInput";
import { establish } from "../utils/stateHelper";
import { getSecondsLeft, pad, timeDisplay } from "../utils/timeHelper";
import { Change, Position } from ".";
import { EventListItems } from "../components/eventList";
import { Score } from "./match";

export type MatchData = {
  events: EventListItems;
  startedAt: string;
  secondsIn: string;
  where: string;
  score: Score;
  positions: Array<Position>;
  teamName: string;
  opponentName: string;
};

export default function PositionSelector() {
  const router = useRouter();

  const gaps = [20, 21, 23, 24];
  const allPositions: Array<Position> = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    value: "",
    cls: "",
    gap: gaps.indexOf(i) != -1,
  }));
  allPositions[2] = { id: 3, value: "Cory", cls: "", gap: false };
  allPositions[5] = { id: 4, value: "Ethan", cls: "", gap: false };

  const [inputMode, setInputMode] = useState(false);
  const [positions, setPositionValues] = useState(allPositions);
  const [where, setWhere] = useState("HOME");
  const [teamName, setTeamName] = useState("Flames");
  const [opponentName, setOpponentName] = useState("World");
  const [score, setScore] = useState({ goals: 0, opponentGoals: 0 });
  const [time, setTime] = useState("00:00");
  const [editName, setEditName] = useState("Edit");

  useEffect(() => {
    establish("pos", allPositions, setPositionValues);
    establish("where", "HOME", setWhere);
    establish("teamName", "Flames", setTeamName);
    establish("opponentName", "World", setOpponentName);
    establish("score", { goals: 0, opponentGoals: 0 }, setScore);
    const secondsIntoGame = getSecondsLeft();
    const timeText = timeDisplay(secondsIntoGame);
    setTime(timeText);
  }, []);

  const updatePos = (changes: Array<Change>) => {
    const updates = [...positions];
    changes.forEach((change) => {
      updates[change.index].value = change.value;
      updates[change.index].cls = change.cls;
    });
    localStorage.setItem("pos", JSON.stringify(updates));
    setPositionValues(updates);
  };

  const swapper = (index: number) => {
    const selected = positions.findIndex(
      (pos) => pos.cls == " bg-cyan-400 text-white"
    );
    if (selected == -1) {
      updatePos([
        {
          index,
          value: positions[index].value,
          cls: " bg-cyan-400 text-white",
        },
      ]);
      return;
    }
    const value = positions[index].value;
    const selectedValue = positions[selected].value;

    const updates = [
      { index, value: selectedValue, cls: "" },
      { index: selected, value, cls: "" },
    ];
    updatePos(updates);
  };

  const swapWhere = () => {
    const next = where == "HOME" ? "AWAY" : "HOME";
    localStorage.setItem("where", next);
    setWhere(next);
  };

  const edit = () => {
    setEditName(inputMode ? "Edit" : "Move");
    setInputMode(!inputMode);
  };

  const saveScore = () => {
    const now = new Date();
    const key =
      "MATCH-" +
      now.getFullYear() +
      "-" +
      pad(now.getMonth() + 1) +
      "-" +
      pad(now.getDate()) +
      "-" +
      now.getTime();

    const eventsString = localStorage.getItem("eventList");
    let events = [];
    try {
      events = JSON.parse(eventsString || '{}');
    } catch (er) { }

    const positionsString = localStorage.getItem("pos");
    let positions: Array<Position> = [];
    try {
      positions = JSON.parse(positionsString || '{}');
    } catch (er) { }

    const scoreString = localStorage.getItem("score");
    let score: Score = { goals: 0, opponentGoals: 0 };
    try {
      score = JSON.parse(scoreString || '{}');
    } catch (er) { }

    const teamName = localStorage.getItem("teamName") || "";
    const opponentName = localStorage.getItem("opponentName") || "";
    const startedAt = localStorage.getItem("started-at") || "";
    const secondsIn = localStorage.getItem("seconds-in") || "";
    const where = localStorage.getItem("where") || "";

    const match: MatchData = {
      events,
      startedAt,
      secondsIn,
      where,
      score,
      positions,
      teamName,
      opponentName,
    };

    localStorage.setItem(key, JSON.stringify(match));
  };

  const finalWhistle = () => {
    saveScore();
    router.push("/");
  };

  const posChange = (index: number, event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    updatePos([{ index, value, cls: "" }]);
  };

  const resetTime = () => {
    setTime("00:00");
  };

  const kickoff = () => {
    if (time == "00:00") {
      localStorage.setItem("started-at", new Date() + "");
    } else {
      const secondsIntoGame = getSecondsLeft();
      const newStart = new Date(new Date().getTime() - secondsIntoGame * 1000);
      localStorage.setItem("started-at", newStart + "");
    }
    router.push("match");
  };

  return (
    <div className="min-h-screen w-full bg-green-600 text-center absolute">
      <main className="mb-6">
        <button
          onClick={finalWhistle}
          className="h-10 text-3xl min-w-max m-2 w-4/5 font-semibold rounded-md bg-white text-black"
        >
          Final Whistle
        </button>
        <button
          onClick={swapWhere}
          className="h-10 text-3xl min-w-max m-2 w-4/5 font-semibold rounded-md bg-white text-black"
        >
          {where}
        </button>

        <div className="teams">
          <div>{teamName}</div>
          <span>{time}</span>
          <div>{opponentName}</div>
          <div>{score.goals}</div>
          <div>vrs</div>
          <div>{score.opponentGoals}</div>
        </div>

        <div className="actions">
          <button
            onClick={edit}
            className="h-20 text-3xl self-center font-semibold rounded-md bg-white text-black"
          >
            {editName}
          </button>

          <button
            onClick={resetTime}
            className="h-20 text-3xl self-center font-semibold rounded-md bg-white text-black"
          >
            Reset time
          </button>

          <button
            onClick={kickoff}
            className="h-20 text-3xl self-center font-semibold rounded-md bg-white text-black"
          >
            Carry on
          </button>
        </div>

        {!inputMode && (
          <span>
            <div className="mb-12"></div>
            <Positions positions={positions} onClick={swapper} />
          </span>
        )}
        {inputMode && (
          <span>
            <div className="mb-10"></div>
            <PositionInput positions={positions} posChange={posChange} />
          </span>
        )}
      </main>

      <footer>
        <a
          href="https://github.com/cleanbill/next-foot"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next-Foot
        </a>
      </footer>

      <style jsx>{`
        .teams {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          text-align: center;
          font-size: x-large;
          height: 60px;
          width: 100%;
          margin: 10px;
        }

        .actions {
          display: grid;
          grid-template-columns: auto auto auto;
          grid-gap: 5px;
          text-align: center;
          width: 100%;
          height: 40px;
        }
      `}</style>
    </div>
  );
}
