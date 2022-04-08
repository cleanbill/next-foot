import { MatchData } from "../pages/whistle";

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

const f = (n: number): string => {
    return n < 9 ? "0" + n : n + "";
};

const parseData = (data: string): { keys: Array<string>, values: Array<string> } => {
    try {
        console.log("importing");
        const storageMap = JSON.parse(data);
        const keys = Object.keys(storageMap);
        const values = new Array();
        console.log(keys.length + " items");
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            values.push(storageMap[key]);
        }
        return { keys, values };
    } catch (er) {
        console.error("Just can't parse", er);
        console.log(data);
    }
}

const generateCSV = (matches: Array<MatchData>, won:Function, loss:Function): string => {
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


  const generateStorageData = (setEmpty:Function): string => {
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


export { download, parseData, generateCSV, generateStorageData };