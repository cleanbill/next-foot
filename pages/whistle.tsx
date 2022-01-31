import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Positions from "../components/positions";
import PositionInput from "../components/positionInput";
import { establish } from "../utils/stateHelper";
import { getSecondsLeft, timeDisplay } from "../utils/timeHelper";

export type Change = {
  index: number;
  value: string;
  cls: string;
};

export type Position = {
  id: number;
  value: string;
  cls: string;
  gap: boolean;
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
    const selected = positions.findIndex((pos) => pos.cls == "selected");
    if (selected == -1) {
      updatePos([{ index, value: positions[index].value, cls: "selected" }]);
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

  const finalWhistle = () => {
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

  // const publish = () => {};

  //                <button onClick={publish} className="action">
  //Publish
  //</button>

  return (
    <div className="container">
      <Head>
        <title>Footswell</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <button onClick={finalWhistle} className="where">
          Final Whistle
        </button>
        <h1 className="title">Footswell</h1>
        <button
          onClick={swapWhere}
          className="where font-semibold rounded-md bg-white text-black"
        >
          {where}
        </button>

        <div className="teams">
          <div>{teamName}</div>
          <span>{time}</span>
          <div>{opponentName}</div>
          <div className="score">{score.goals}</div>
          <div>vrs</div>
          <div className="score">{score.opponentGoals}</div>
        </div>

        <div className="actions">
          <button
            onClick={edit}
            className="font-semibold rounded-md bg-white text-black"
          >
            {editName}
          </button>

          <button
            onClick={resetTime}
            className="font-semibold rounded-md bg-white text-black"
          >
            Reset time
          </button>

          <button
            onClick={kickoff}
            className="font-semibold rounded-md bg-white text-black"
          >
            Carry on
          </button>
        </div>

        {!inputMode && <Positions positions={positions} onClick={swapper} />}
        {inputMode && (
          <PositionInput positions={positions} posChange={posChange} />
        )}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel" className="logo" />
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

        input {
          border-radius: 10px;
          height: 90%;
          width: 90%;
          object-position: center;
          margin-left: 5%;
        }

        .actions {
          display: grid;
          grid-template-columns: auto auto auto;
          grid-gap: 5px;
          text-align: center;
          width: 90%;
          margin: 5px;
          height: 40px;
        }
        .action {
          border-radius: 10px;
        }

        main {
          padding: 1px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .where {
          width: 90%;
          height: 42px;
          margin-left: 25%;
          font-size: 30px;
          appearance: auto;
          text-align: center;
          align-items: flex-start;
          cursor: default;
          box-sizing: border-box;
          background-color: -internal-light-dark(
            rgb(239, 239, 239),
            rgb(59, 59, 59)
          );
          margin: 0em;
          margin-bottom: 10px;
          padding: 1px 6px;
          border-width: 2px;
          border-radius: 15px;
          border-style: outset;
          border-color: -internal-light-dark(
            rgb(118, 118, 118),
            rgb(133, 133, 133)
          );
          border-image: initial;
        }

        .logo {
          height: 1em;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          background-color: #1f911f;
          text-align: -webkit-center;
        }

        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .grid {
          display: grid;
          grid-template-columns: auto auto auto auto auto;
        }
        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        .card {
          margin: 3px;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
