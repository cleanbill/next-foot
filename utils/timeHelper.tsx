const pad = (i: number): string => {
  return i == 0 ? "00" : i < 10 ? "0" + i : i + "";
};

const timeDisplay = (totalSeconds: number): string => {
  localStorage.setItem("seconds-in", totalSeconds + "");
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds - minutes * 60);
  const current = pad(minutes) + ":" + pad(seconds);
  return current;
};

const toSecs = (display: string): number => {
  const time = display.split(":").map((s) => parseInt(s));
  const result = +time[0] * 60 * 60 + +time[1] * 60 + +time[2];
  return result;
};

const getSecondsLeft = () => {
  const storedSecsIntoGame = localStorage.getItem("seconds-in");
  const secondsIntoGame = storedSecsIntoGame ? parseInt(storedSecsIntoGame) : 0;
  return secondsIntoGame;
};

export { timeDisplay, toSecs, getSecondsLeft, pad };
