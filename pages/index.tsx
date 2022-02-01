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
  const [mode, setMode] = useState("Edit");

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

  const kickoff = () => {
    localStorage.setItem("started-at", new Date() + "");
    localStorage.setItem("eventList", "[]");
    localStorage.removeItem("score");

    router.push("match");
  };

  const edit = () => {
    setInputMode(!inputMode);
    setMode(inputMode ? "EDIT" : "MOVE");
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
    <div className="min-h-screen bg-green-600 text-center absolute w-full ">
      <Head>
        <title>Footswell</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-3xl font-bold underline">Footswell</div>
        <button
          onClick={swapWhere}
          className="text-xl min-w-max m-7 w-4/5 font-semibold rounded-md bg-white text-black"
        >
          {where}
        </button>

        <div className="grid">
          <input
            type="text"
            className="rounded-md w-4/5 justify-self-center h-10"
            defaultValue={teamName}
            placeholder="Team Name"
            onChange={() => nameChange("teamName", event, setTeamName)}
          ></input>
          <div>Vrs</div>
          <input
            type="text"
            className="rounded-md w-4/5 justify-self-center h-10"
            defaultValue={opponentName}
            placeholder="Opponent Name"
            onChange={() => nameChange("opponentName", event, setOpponentName)}
          ></input>
        </div>

        <div className="actions">
          <button
            onClick={edit}
            className="h-10 px-6 m-4 font-semibold rounded-md bg-white text-black"
          >
            {mode}
          </button>

          <span></span>

          <button
            onClick={kickoff}
            className="h-10 px-6 m-4 font-semibold rounded-md bg-white text-black"
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
          href="https://github.com/cleanbill/next-foot"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next-Foot
        </a>
      </footer>
    </div>
  );
}
