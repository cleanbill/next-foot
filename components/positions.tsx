import { Position } from "../pages";

const Positions = (props: { positions: Position[]; onClick: (arg0: number) => void; }) => {

  return (
    <div className="grid ">
      {props.positions.map(
        (localPosition: Position, index: number) =>
          (!localPosition.gap && (
            <button
              aria-label={"Position switch number " + index}
              key={index}
              onClick={() => props.onClick(index)}
              className={
                "h-16 text-1xl shadow-2xl rounded-md bg-white font-semibold text-slate-500" +
                localPosition.cls
              }
            >
              {localPosition.value}
            </button>
          )) || <span key={index}></span>
      )}
      <style jsx>{`
          .grid {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 2fr 2fr;
            grid-gap: 5px;
            margin: 10px;
          }
        `}</style>
    </div>
  );
}

export default Positions;