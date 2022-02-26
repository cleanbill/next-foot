import { useEffect, useState } from "react";
import EventList from "../components/eventList";
import { dateDisplay } from "../utils/timeHelper";
import { MatchData } from "./whistle";

export default function History() {
  const [storage, setStorage] = useState([]);
  const [keys, setKeys] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    if (storage.length > 0 || empty) {
      return;
    }
    try {
      const keys = Object.keys(localStorage);
      setEmpty(keys.length == 0);
      const storageStored: Array<any> = keys
        .map((key) => {
          const storedString = localStorage.getItem(key);
          if (!storedString) {
            return null;
          }
          return storedString;
        })
        .filter((match) => match != null);
      setStorage(storageStored);
      setKeys(keys);
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

  const update = (index: number, key: string) => {
    const textarea = document.getElementById(
      index + "-value"
    ) as HTMLInputElement;
    const newValue = textarea.value;
    console.log(key + " set to '" + newValue + "'");
    localStorage.setItem(key, newValue);
  };

  const deleteItem = (index: number) => {
    const key = keys[index];

    console.log("Removing " + key);
    console.log(localStorage.getItem(key));
    localStorage.removeItem(key);
    keys.splice(index, 1);
    storage.splice(index, 1);
    setKeys(keys);
    setStorage(keys);
  };

  return (
    <div className="min-h-screen bg-green-600">
      <div className="relative px-6 pt-10 top-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-4xl sm:mx-auto sm:rounded-lg sm:px-10">
        {empty && <div className="text-center text-red-600">NO STORAGE</div>}
        {!empty && (
          <div className="text-center text-4xl pb-10 text-green-600">
            STORAGE
          </div>
        )}
        {storage.map((stored, index: number) => (
          <div className="min-w-full" key={index}>
            <h1 className="font-extrabold font-mono pb-2 pt-16 ">
              {keys[index]}{" "}
            </h1>
            <textarea
              className="min-w-full bg-black text-green-400 p-3"
              rows="7"
              column="100"
              defaultValue={stored}
              id={index + "-value"}
            ></textarea>
            <button
              onClick={() => {
                update(index, stored);
              }}
              className="bg-green-600 float-right hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
            <button
              onClick={() => {
                deleteItem(index);
              }}
              className="bg-red-600 float-left hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
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
          grid-template-columns: 0fr auto auto 0fr 0fr 1fr 1fr;
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
