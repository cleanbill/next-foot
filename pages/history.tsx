import { useEffect, useState } from "react";
import EventList from "../components/eventList";
import { dateDisplay } from "../utils/timeHelper";
import { MatchData } from "./whistle";

// NB. @TODO - This page needs breaking down into components

export default function History() {
  const [matches, setMatches] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [downloadType, setDownloadType] = useState("Storage");
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

  const toggleDownloadType = () => {
    if (downloadType == "CSV") {
      setDownloadType("Storage");
    } else {
      setDownloadType("CSV");
    }
  };

  const generateCSV = (): string => {
    const results = matches.map((match: MatchData, index: number) => {
      const events = match.events
        .filter((event) => !event.crossedOut)
        .map((event) => event.time + "," + event.desc);
      const outcome = won(match) ? "won" : loss(match) ? "loss" : "drew";
      const matchCSV =
        "\n\n****\n\n" +
        match.startedAt +
        "," +
        match.teamName +
        "," +
        match.score.goals +
        ",vrs" +
        "," +
        match.score.opponentGoals +
        "," +
        match.opponentName +
        "," +
        match.where +
        "," +
        outcome;
      const result = matchCSV + ",\n" + events.join(",\n");
      console.log(index + ". " + result + "\n\n");
      return result;
    });
    return results.join(",");
  };

  const generateStorageData = (): string => {
    try {
      const keys = Object.keys(localStorage);
      setEmpty(keys.length == 0);
      const data = {};
      keys.map((key) => {
        const storedString = localStorage.getItem(key);
        if (!storedString) {
          return null;
        }
        data[key] = storedString;
        return data;
      });
      return JSON.stringify(data);
    } catch (error) {
      console.log("Failed to get history", error);
    }
    return "{}";
  };

  const storeJSON = (data: string) => {
    try {
      console.log("importing");
      const storageMap = JSON.parse(data);
      const keys = Object.keys(storageMap);
      console.log(keys.length + " items");
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = storageMap[key];
        window.localStorage.setItem(key, value);
        setImportSize(i);
        console.log(i, key, value);
      }
    } catch (er) {
      console.error("Just can't parse", er);
      console.log(data);
    }
    setTimeout(function () {
      console.log("imported");
      setImportSize(-1);
      const fileInputElement = document.getElementById("file-input") as any;
      fileInputElement.value = "";
      setImporting(false);
    }, 3000);
  };

  const exportHistory = () => {
    const ext = downloadType === "CSV" ? "csv" : "json";
    const data = downloadType === "CSV" ? generateCSV() : generateStorageData();
    download(data, ext);
  };

  const f = (n: number): string => {
    return n < 9 ? "0" + n : n + "";
  };

  const download = (data: string, ext = "csv") => {
    const date = new Date();

    const filename =
      "matches-" +
      date.getFullYear() +
      f(date.getMonth()) +
      f(date.getDate()) +
      f(date.getHours()) +
      f(date.getMinutes()) +
      "." +
      ext;
    const type = ext;
    const file = new Blob([data], { type });
    const a = document.createElement("a");

    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
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
          <span>
            <br></br>
            <div
              className="bg-green-500 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3"
              id="static-example"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-mdb-autohide="false"
            >
              <div className="bg-green-500 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-green-400 rounded-t-lg">
                <p className="font-bold text-white flex items-center">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="check-circle"
                    className="w-4 h-4 mr-2 fill-current"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                    ></path>
                  </svg>
                  Imported
                </p>
                <div className="flex items-center">
                  <p className="text-white opacity-90 text-xs">{importSize}</p>
                  <button
                    type="button"
                    className="btn-close btn-close-white box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
                    data-mdb-dismiss="toast"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-b-lg break-words text-white">
                Data has been imported
              </div>
            </div>
          </span>
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
          <div className="foots pt-8 text-base leading-7 font-semibold">
            <p className="text-left">
              <a
                onClick={importHistory}
                className="text-sky-500 hover:text-sky-600"
              >
                <span>Import Storage</span>
              </a>
            </p>
            <p className="text-center">
              <a
                onClick={exportHistory}
                className="text-sky-500 hover:text-sky-600"
              >
                Export
              </a>
              <a
                onClick={toggleDownloadType}
                className="text-sky-500 hover:text-sky-600"
              >
                &nbsp;
                {downloadType}
              </a>
            </p>
            <p className="text-right">
              <a href="/board" className="text-sky-500 hover:text-sky-600">
                Board &rarr;
              </a>
            </p>
          </div>
        )}
      </div>
      <style jsx>{`
        .doubler {
          display: grid;
          margin-top: 10px;
          grid-template-columns: 2fr 2fr;
        }
        .foots {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr;
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
