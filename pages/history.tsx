import { useEffect, useState } from "react";
import EventList from "../components/eventList";
import { dateDisplay } from "../utils/timeHelper";
import { MatchData } from "./whistle";

export default function History() {
  const [matches, setMatches] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    if (matches.length == 0 && !empty) {
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
    return match.score.goals > match.score.opponentGoals;
  };

  const drew = (match: MatchData) => {
    return match.score.goals == match.score.opponentGoals;
  };

  const goalDifference = () => {
    if (matches.length == 0) {
      return "";
    }
    const totalGoals = matches
      .map((match: MatchData) => match.score.goals)
      .reduce((a, b) => a + b);
    const totalConceded = matches
      .map((match: MatchData) => match.score.opponentGoals)
      .reduce((a, b) => a + b);
    return (
      totalGoals +
      " goals. Conceded " +
      totalConceded +
      " goals. Goal diffrence " +
      (totalGoals - totalConceded)
    );
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
            <div className="text-left" onClick={() => toggler(index)}>
              <span>{match.startedAt} -</span>
              <span className="capitalize"> {match.teamName} </span>
              <span className="font-bold">{match.score.goals}</span>
              <span> vrs </span>
              <span className="capitalize"> {match.opponentName}</span>
              <span className="font-bold">{match.score.opponentGoals}</span>
              <span className="indent-4">
                <span className="lowercase">( {match.where}</span>
                {won(match) && <span> win )</span>}
                {!won(match) && <span> lost )</span>}
                {drew(match) && <span> drew )</span>}
              </span>
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
        {goalDifference()}
      </div>
    </div>
  );
}
