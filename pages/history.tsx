import { useEffect, useState } from "react";
import EventList from "../components/eventList";
import { dateDisplay } from "../utils/timeHelper";
import { MatchData } from "./whistle";

export default function History() {
  const [matches, setMatches] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    if (matches.length > 0 || empty) {
      return;
    }
    try {
      const keys = Object.keys(localStorage);
      const matchKeys = keys.filter((key) => key.startsWith("MATCH"));
      setEmpty(matchKeys.length == 0);
      const matchesStored: Array<MatchData> = matchKeys
        .map((key) => {
          const storedString = localStorage.getItem(key);
          if (!storedString) {
            return null;
          }
          return JSON.parse(storedString);
        })
        .filter((match) => match != null)
        .map((match) => {
          match.startedAt = dateDisplay(match.startedAt);
          return match;
        });
      setMatches(matchesStored);
    } catch (error) {
      console.log("Failed to get history", error);
    }
  });

  const toggler = (index) => {
    if (openIndex == index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const won = (match: MatchData) => {
    return match.score?.goals > match.score?.opponentGoals;
  };

  const loss = (match: MatchData) => {
    return match.score?.goals < match.score?.opponentGoals;
  };

  const drew = (match: MatchData) => {
    return match.score?.goals == match.score?.opponentGoals;
  };

  const total = (oppenentTotal = false): number => {
    if (matches.length == 0) {
      return 0;
    }
    const totalGoals = matches
      .map((match: MatchData) =>
        oppenentTotal ? match.score?.opponentGoals : match.score?.goals
      )
      .reduce((a, b) => a + b);
    return totalGoals;
  };

  const goalDifference = (): number => {
    if (matches.length == 0) {
      return 0;
    }

    const totalGoals = total();
    const totalConceded = total(true);
    return totalGoals - totalConceded;
  };

  return (
    <div className="min-h-screen bg-green-600">
      <div className="relative px-6 pt-10 top-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-2xl sm:mx-auto sm:rounded-lg sm:px-10">
        {empty && <div className="text-center text-red-600">NO HISTORY</div>}
        {!empty && (
          <div className="text-center text-4xl pb-10 text-green-600">
            HISTORY
          </div>
        )}
        {matches.map((match, index: number) => (
          <div key={index}>
            <div className="text-left grid" onClick={() => toggler(index)}>
              <span>{match.startedAt} </span>
              <span className="capitalize text-gray-500">
                {" "}
                {match.teamName}{" "}
              </span>
              <span className="font-bold">{match.score?.goals}</span>
              <span className="text-gray-300"> vrs </span>
              <span className="font-bold">{match.score?.opponentGoals}</span>
              <span className="capitalize"> {match.opponentName} </span>
              <span className="lowercase"> {match.where}</span>
              {won(match) && <span> win</span>}
              {loss(match) && <span> loss</span>}
              {drew(match) && <span> drew</span>}
            </div>
            <div className="">
              {openIndex == index && (
                <div className="indent-3">
                  <br />
                  <EventList disableUndo="true" eventList={match.events} />
                </div>
              )}
            </div>
          </div>
        ))}
        <br />
        <br />
        <div className="sum">
          <span>Scored total of </span>
          <span className="font-bold">{total()}</span>
          <span> goals</span>

          <span>Conceded total of </span>
          <span className="font-bold">{total(true)}</span>
          <span> goals</span>

          <span></span>
          <span></span>
          <span></span>

          <span>Goal difference of </span>
          <span className="font-bold">{goalDifference()}</span>
          <span> goals</span>
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
            <a href="/board" className="text-sky-500 hover:text-sky-600">
              Board &rarr;
            </a>
          </p>
        </div>
      </div>
      <style jsx>{`
        .foots {
          display: grid;
          justify-items: center;
          grid-template-columns: auto auto;
        }
        .grid {
          display: grid;
          grid-template-columns: 0fr auto auto 0fr 0fr 1fr 1fr 1fr;
          grid-gap: 5px;
        }
        .sum {
          display: grid;
          grid-template-columns: auto auto 1fr;

          grid-gap: 5px;
        }
      `}</style>
    </div>
  );
}
