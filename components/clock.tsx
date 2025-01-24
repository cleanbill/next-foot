import { Component } from "react";
import { timeDisplay } from "../utils/timeHelper";

export interface ClockProp {
  timeChanged: (time: string) => void;
}

export interface ClockState {
  start: Date;
  current: string;
}

export default class Clock extends Component<ClockProp, ClockState> {
  private interval: NodeJS.Timer | undefined;

  constructor(props: ClockProp) {
    super(props);
    this.state = {
      start: new Date(),
      current: "00:00",
    };
  }

  componentDidMount() {
    const storedDate = localStorage.getItem("started-at");
    const start = storedDate ? new Date(storedDate) : new Date();

    const offset = this.makeTotalSeconds(start);
    const current = timeDisplay(offset);

    this.setState({ start, current });
    this.interval = setInterval(this.updateTime.bind(this), 1000);
  }

  private makeTotalSeconds(lastSeen: Date): number {
    const timeDiff = new Date().getTime() - lastSeen.getTime();
    const totalSeconds = timeDiff / 1000;
    return totalSeconds;
  }

  updateTime() {
    const totalSeconds = this.makeTotalSeconds(this.state.start);
    const current = timeDisplay(totalSeconds);
    this.props.timeChanged(current);
    this.setState({ current, start: this.state.start });
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    return (
      <div>
        <div>{this.state.current}</div>
      </div>
    );
  }
}
