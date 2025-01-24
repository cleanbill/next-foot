import { Position } from "../pages";


const PositionSwapper = (props: { positions: Array<Position>, posChange: Function }) => {
  return (
    <div className="grid">
      {props.positions.map(
        (localPosition: Position, index: number) =>
          (!localPosition.gap && (
            <input
              className="h-16 text-1xl bold m-1 rounded-md  w-full"
              onChange={() => props.posChange(index, event)}
              key={index}
              defaultValue={localPosition.value}
            ></input>
          )) || <span></span>
      )}

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: 2fr 2fr 2fr 2fr 2fr;
          justify-content: center;
          width: 100%;
          grid-gap: 3px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );


}

export default PositionSwapper;