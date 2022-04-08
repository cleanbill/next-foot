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

export { download, parseData };