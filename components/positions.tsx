import { Component } from "react";

export default class Positions extends Component {
  constructor(public props) {
    super(props);
  }

  render() {
    return (
      <div className="grid ">
        {this.props.positions.map(
          (localPosition, index) =>
            (!localPosition.gap && (
              <button
                key={index}
                onClick={() => this.props.onClick(index)}
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
}
