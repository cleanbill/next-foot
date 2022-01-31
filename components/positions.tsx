import { Component } from "react";

export default class Positions extends Component {
  constructor(public props) {
    super(props);
  }

  render() {
    return (
      <div className="grid">
        {this.props.positions.map(
          (localPosition, index) =>
            (!localPosition.gap && (
              <button
                key={index}
                onClick={() => this.props.onClick(index)}
                className={
                  "rounded-md bg-white text-lg font-semibold text-slate-500" +
                  localPosition.cls
                }
              >
                {localPosition.value}
              </button>
            )) || <span key={index}></span>
        )}
        <style jsx>{`
          .selected {
            background-color: #00ff5a;
            color: white;
          }
          .grid {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 2fr 2fr;
            grid-gap: 5px;
            margin: 10px;
          }
          .card {
            height: 66px;
            width: 66px;
            word-wrap: break-word;
          }
        `}</style>
      </div>
    );
  }
}
