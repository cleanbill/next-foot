import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Positions from "../components/positions";
import PositionInput from "../components/positionInput";
import { establish } from "../utils/stateHelper";

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
  allPositions[5] = { id: 4, value: "Finn", cls: "", gap: false };

  const [inputMode, setInputMode] = useState(false);
  const [positions, setPositionValues] = useState(allPositions);
  const [where, setWhere] = useState("HOME");
  const [teamName, setTeamName] = useState("Flaming Jaguar");
  const [opponentName, setOpponentName] = useState("World");

  useEffect(() => {
    establish("pos", allPositions, setPositionValues);
    establish("where", "HOME", setWhere);
    establish("teamName", "Flames", setTeamName);
    establish("opponentName", "World", setOpponentName);
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

  const kickoff = () => {
    localStorage.setItem("started-at", new Date() + "");
    localStorage.setItem("eventList", "[]");
    localStorage.removeItem("score");

    router.push("match");
  };

  const edit = () => {
    setInputMode(!inputMode);
  };

  const posChange = (index: number, event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    updatePos([{ index, value, cls: "" }]);
  };

  const nameChange = (key: string, event: Event, setter: Function) => {
    const value = (event.target as HTMLInputElement).value;
    localStorage.setItem(key, value);
    setter(value);
  };

  return (
    <div className="container">
      <Head>
        <title>Footswell</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-3xl font-bold underline">Footswell</div>
        <button
          onClick={swapWhere}
          className="where font-semibold rounded-md bg-white text-black"
        >
          {where}
        </button>

        <div className="teams">
          <input
            type="text"
            defaultValue={teamName}
            placeholder="Team Name"
            onChange={() => nameChange("teamName", event, setTeamName)}
          ></input>
          <div>Vrs</div>
          <input
            type="text"
            defaultValue={opponentName}
            placeholder="Opponent Name"
            onChange={() => nameChange("opponentName", event, setOpponentName)}
          ></input>
        </div>

        <div className="actions">
          <button
            onClick={edit}
            className="h-10 px-6 font-semibold rounded-md bg-white text-black"
          >
            Edit
          </button>

          <span></span>

          <button
            onClick={kickoff}
            className="h-10 px-6 font-semibold rounded-md bg-white text-black"
          >
            Kickoff
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
          height: 60px;
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
          width: 60%;
          margin: 5px;
          height: 40px;
        }
        .action {
          border-radius: 10px;
        }

        main {
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
          width: 50%;
          height: 42px;
          margin-left: 25%;
          font-size: 24px;
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
          border-style: outset;
          border-color: -internal-light-dark(
            rgb(118, 118, 118),
            rgb(133, 133, 133)
          );
          border-image: initial;
          text-align: -webkit-center;
        }

        .logo {
          height: 1em;
        }
      `}</style>

      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
          background-color: green;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        html {
          background-color: #1f911f;
          text-align: -webkit-center;
        }

        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: green;
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
