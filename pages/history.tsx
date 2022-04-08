import { useEffect, useState } from "react";
import EventList from "../components/eventList";
import Foot from "../components/foot";
import ImportedToast from "../components/importedToast";
import {
  download,
  generateCSV,
  generateStorageData,
  parseData,
} from "../utils/porter";
import { dateDisplay } from "../utils/timeHelper";
import { MatchData } from "./whistle";

// NB. @TODO - This page needs breaking down into components

export enum DownloadType {
  "CSV" = "CSV",
  "Storage" = "Storage",
}

export default function History() {
  const [matches, setMatches] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [importSize, setImportSize] = useState(-1);
  const [importing, setImporting] = useState(false);

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
        .sort((matchA: MatchData, matchB: MatchData): number => {
          const secsA = new Date(matchA.startedAt).getTime();
          const secsB = new Date(matchB.startedAt).getTime();
          if (secsA > secsB) {
            return -1;
          } else if (secsB > secsA) {
            return 1;
          }
          return 0;
        })
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

  const storeJSON = (data: string) => {
    const { keys, values } = parseData(data);
    keys.forEach((key: string, i) => {
      window.localStorage.setItem(key, values[i]);
      setImportSize(i);
      console.log(i, key, values[i]);
    });
    setTimeout(function () {
      console.log("imported");
      setImportSize(-1);
      const fileInputElement = document.getElementById("file-input") as any;
      fileInputElement.value = "";
      setImporting(false);
    }, 3000);
  };

  const exportHistory = (downloadType: DownloadType) => {
    const ext = downloadType === "CSV" ? "csv" : "json";
    const data =
      downloadType === "CSV"
        ? generateCSV(matches, won, loss)
        : generateStorageData(setEmpty);
    download(data, ext);
  };

  const importHistory = () => {
    setImporting(true);
  };

  const readSingleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      storeJSON(contents + "");
    };
    reader.readAsText(file);
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
          <div className="text-center text-4xl pb-7 text-green-600">
            HISTORY
          </div>
        )}
        {matches.map((match, index: number) => (
          <div key={index}>
            <div className="text-left grid" onClick={() => toggler(index)}>
              <span>{match.startedAt} </span>
              <span className="text-right uppercase">
                {match.where.substring(0, 1)}
              </span>
              {won(match) && <span className="text-right"> W</span>}
              {loss(match) && <span className="text-right"> L &nbsp;</span>}
              {drew(match) && <span className="text-right"> D &nbsp;</span>}
              <span className="capitalize text-gray-500">{match.teamName}</span>
              <span className="font-bold">{match.score?.goals}</span>
              <span className="text-gray-300"> vrs </span>
              <span className="font-bold">{match.score?.opponentGoals}</span>
              <span className="text-right capitalize">
                {match.opponentName}
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
        {importSize != -1 && (
          <ImportedToast importSize={importSize}></ImportedToast>
        )}

        {importing && importSize == -1 && (
          <span className="doubler">
            <a
              onClick={() => setImporting(false)}
              className="text-sky-500 self-center hover:text-sky-600"
            >
              Cancel Import
            </a>
            <div className="filer text-sky-500  hover:text-sky-600 justify-items-center">
              <input
                type="file"
                onChange={(e) => readSingleFile(e)}
                id="file-input"
              />
            </div>
          </span>
        )}

        {!importing && (
          <Foot
            importHistory={importHistory}
            exportHistory={exportHistory}
          ></Foot>
        )}
      </div>
      <style jsx>{`
        .doubler {
          display: grid;
          margin-top: 10px;
          grid-template-columns: 2fr 2fr;
        }
        .grid {
          display: grid;
          grid-template-columns: 0fr auto auto 0fr 0fr 1fr 1fr 1fr;
          grid-gap: 5px;
        }
        .sum {
          display: grid;
          grid-template-columns: 2fr 0fr 1fr;

          grid-gap: 5px;
        }
        [type="file"]::-webkit-file-upload-button {
          background: white;
          border: 0;
          border-radius: 4px;
          color: rgb(14 165 233 / var(--tw-text-opacity));
          cursor: pointer;
          font-size: 12px;
          outline: none;
          padding: 10px 25px;
          text-transform: uppercase;
          transition: all 1s ease;
        }
        .filer {
          display: grid;
          grid-template-rows: auto auto;
        }
      `}</style>
    </div>
  );
}
