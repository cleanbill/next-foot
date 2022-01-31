import { Component } from "react";
import { StateOfTheGame } from "../pages/api/events";

export interface PollingEventListProp {
  onGameChanged: (game: StateOfTheGame) => void;
}

export default class GameChanger extends Component<PollingEventListProp> {
  private interval = null;

  constructor(props: PollingEventListProp) {
    super(props);
  }
  componentDidMount() {
    this.interval = setInterval(this.updateEvents.bind(this), 1000);
  }

  async updateEvents() {
    const resp = await fetch("./api/events");
    const game: StateOfTheGame = await resp.json();
    this.props.onGameChanged(game);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    return <span></span>;
  }
}
