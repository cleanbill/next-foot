const json = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

const establish = (
  statename: string,
  defaultValue: any,
  setter: Function
): any => {
  const stored = localStorage.getItem(statename);
  try {
    const place = stored ? json(stored) : defaultValue;
    setter(place);
    return place;
  } catch (error) {
    console.error(error, stored);
    setter(defaultValue);
    return defaultValue;
  }
};

export { establish };
