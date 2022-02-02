import router from "next/router";
import React, { useState, useEffect } from "react";
import { Position } from ".";
import Clock from "../components/clock";
import EventList, { EventItem } from "../components/eventList";
import Positions from "../components/positions";
import { establish } from "../utils/stateHelper";
import { getSecondsLeft, timeDisplay, toSecs } from "../utils/timeHelper";
import { StateOfTheGame } from "./api/events";

function Match() {
  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const gaps = [20, 21, 23, 24];
  const allPositions: Array<Position> = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    value: "",
    cls: "",
    gap: gaps.indexOf(i) != -1,
  }));
  allPositions[2] = { id: 3, value: "Cory", cls: "", gap: false };
  allPositions[5] = { id: 4, value: "Ethan", cls: "", gap: false };

  const [positions, setPositionValues] = useState(allPositions);
  const [teamName, setTeamName] = useState("Flames");
  const [opponentName, setOpponentName] = useState("World");
  const [message, setMessage] = useState("");
  const [eventList, setEventList] = useState(new Array<EventItem>());
  const [score, setScore] = useState({ goals: 0, opponentGoals: 0 });

  const scorer = (index: number) => {
    const player = positions[index].value;
    if (!player) {
      return;
    }
    updateScore(player);
  };

  const scored = () => {
    updateScore(teamName);
  };

  const oppScored = () => {
    updateScore(opponentName, true);
  };

  let messageClear = null;
  const updateScore = (name: string, opponentGoal = false) => {
    if (messageClear) {
      clearTimeout(messageClear);
    }
    const goal = name + " scored!!";
    console.log(goal);
    setMessage(goal);
    const item: EventItem = {
      crossedOut: false,
      time: dateFormat.format(new Date()),
      desc: goal,
      goal: true,
      byOppenent: opponentGoal,
    };
    const updates = [...eventList, item].sort((a: EventItem, b: EventItem) => {
      const timeA = toSecs(a.time);
      const timeB = toSecs(b.time);
      return timeA === timeB ? 0 : timeA > timeB ? -1 : 1;
    });
    localStorage.setItem("eventList", JSON.stringify(updates));
    setEventList(updates);

    messageClear = setTimeout(() => setMessage(""), 4000);
    if (opponentGoal) {
      score.opponentGoals = score.opponentGoals + 1;
      setScore(score);
    } else {
      score.goals = score.goals + 1;
      setScore(score);
    }
    localStorage.setItem("score", JSON.stringify(score));
    updateGame(message);
  };

  const getTime = (time = null): string => {
    if (time != null) {
      return time;
    }
    const secondsIntoGame = getSecondsLeft();
    const timeText = timeDisplay(secondsIntoGame);
    return timeText;
  };

  const updateGame = async (mes: string, time = null) => {
    const timeText = getTime(time);
    const game: StateOfTheGame = {
      message: mes,
      events: eventList,
      teamName,
      opponentName,
      goals: score.goals,
      opponentGoals: score.opponentGoals,
      timeDisplay: timeText,
    };
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
  };

  const adjust = (score: number, adjuster: number): number => {
    const result = score + adjuster;
    return result > -1 ? result : 0;
  };

  const adjustScore = (decrement: boolean, opponent: boolean) => {
    const adjuster = decrement ? -1 : 1;
    console.log("score adjustment");
    if (opponent) {
      setScore({
        goals: score.goals,
        opponentGoals: adjust(score.opponentGoals, adjuster),
      });
    } else {
      setScore({
        goals: adjust(score.goals, adjuster),
        opponentGoals: score.opponentGoals,
      });
    }
    localStorage.setItem("score", JSON.stringify(score));
  };

  const whistle = () => {
    updateGame("Whistle Blown - PAUSED");
    router.push("whistle");
  };

  useEffect(() => {
    const newPos = establish("pos", allPositions, setPositionValues);
    establish("teamName", "Flames", setTeamName);
    establish("opponentName", "World", setOpponentName);
    establish("eventList", eventList, setEventList);
    establish("score", { goals: 0, opponentGoals: 0 }, setScore);
    const gapify = newPos.map((pos) => {
      pos.gap = pos.value.length == 0;
      return pos;
    });
    setPositionValues(gapify);
  }, []);

  return (
    <span>
      <div className="min-h-screen w-full bg-green-600 text-center  absolute">
        <main>
          <div className="text-1xl font-bold ">- FOOTSWELL -</div>
          <div className="teams">
            <button
              className="h-12 text-1xl px-6 w-4/5 font-semibold rounded-md bg-white text-black"
              onClick={scored}
            >
              {teamName}
            </button>
            <span>
              <Clock timeChanged={(time) => updateGame(message, time)} />
            </span>
            <button
              className="h-12 text-1xl px-6 w-4/5 font-semibold rounded-md bg-white text-black"
              onClick={oppScored}
            >
              {opponentName}
            </button>
            <div className="text-5xl">{score.goals}</div>
            <div className="text-1xl">vrs</div>
            <div className="text-5xl">{score.opponentGoals}</div>
          </div>
          {message && (
            <h2 className="text-5xl text-orange-700 bg-orange-200 m-3 rounded-md p-3">
              {message}
            </h2>
          )}
          <button
            className="h-15 text-3xl px-6 w-4/5 font-semibold rounded-md bg-white text-black"
            onClick={whistle}
          >
            Whistle Blown
          </button>
          <Positions positions={positions} onClick={scorer} />
          <EventList onChange={adjustScore} eventList={eventList} />
        </main>
      </div>
      <style jsx>{`
        .teams {
          display: grid;
          grid-template-columns: auto auto auto;
          place-items: center;
        }
      `}</style>
    </span>
  );
}
export default Match;
