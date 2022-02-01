import { Component } from "react";

export default class PositionSwapper extends Component {
  constructor(public props) {
    super(props);
  }

  render() {
    return (
      <div className="grid">
        {this.props.positions.map(
          (localPosition, index) =>
            (!localPosition.gap && (
              <input
                className="h-16 m-1 rounded-md  w-full"
                onChange={() => this.props.posChange(index, event)}
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
}
