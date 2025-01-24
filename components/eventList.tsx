import { Component, useState } from "react";

export interface EventListState {
  eventList: EventListItems;
  disableUndo: boolean;
  onChange?: Function
}

export interface EventItem {
  crossedOut: boolean;
  time: string;
  desc: string;
  goal: boolean;
  byOpponent: boolean;
}

export interface EventListItems extends Array<EventItem> { }

export default class EventList extends Component<
  EventListState,
  EventListState
> {
  constructor(props: EventListState | Readonly<EventListState>) {
    super(props);
    this.state = {
      eventList: this.props.eventList,
      disableUndo: this.props.disableUndo,
    };
  }

  componentDidUpdate(oldProp: EventListState) {
    if (oldProp != this.props) {
      this.setState({ eventList: this.props.eventList });
    }
  }

  componentDidMount(): void {
    this.setState({ eventList: this.props.eventList });
  }

  private updateScore(item: EventItem, decrement: boolean): EventItem {
    if (!item.goal) {
      return item;
    }
    console.log("Send update");
    if (this.props.onChange) {
      this.props.onChange(decrement, item.byOpponent);
    }
    return item;
  }

  private updateItem(item: EventItem, checkIndex: number, index: number): EventItem {
    if (checkIndex != index) {
      return item;
    }
    item.crossedOut = !item.crossedOut;
    return this.updateScore(item, item.crossedOut);
  }

  undo(index: number) {
    console.log("UNDO " + index);
    const updates = this.state.eventList.map(
      (item: EventItem, loopIndex: number) =>
        this.updateItem(item, loopIndex, index)
    );
    localStorage.setItem("eventList", JSON.stringify(updates));
    this.setState({ eventList: updates });
  }

  getClass(item: EventItem, desc = false): string {
    const className = desc ? "desc" : "";
    const names = item.crossedOut ? className + " crossout" : className;
    return names;
  }

  render() {
    const list: Array<EventItem> = this.state.eventList;
    const id = "events" + list.length;
    return (
      <div className="all" id={id}>
        {list.map((item: EventItem, index: number) => (
          <div
            className={this.state.disableUndo ? "display-grid" : "grid"}
            key={index}
          >
            {!this.state.disableUndo && (
              <div className="grid">
                <div className="up">
                  <button
                    className="font-semibold rounded-md bg-white text-black"
                    onClick={() => this.undo(index)}
                  >
                    undo
                  </button>
                </div>
              </div>
            )}
            <div className={this.getClass(item)}>
              {index + 1}. {item.time}
            </div>
            <div className={this.getClass(item, true)}>{item.desc}</div>
          </div>
        ))}
        <style jsx>{`
          .all {
            height: 100%;
            width: 97%;
            font-size: 18px;
            text-align: left;
          }
          .display-grid {
            display: grid;
            grid-template-columns: 3fr 9fr;
            height: 30px;
            width: 100%;
            font-size: 14px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 4fr 7fr;
            height: 30px;
            text-align: left;
          }
          .score {
            padding-top: 10px;
          }
          .crossout {
            opacity: 0.5;
            text-decoration: line-through;
          }
          .up {
            margin-bottom: 10px;
          }
          button {
            margin-right: 10px;
            border-radius: 10px;
            width: 45px;
          }
          .desc {
            padding-left: 10px;
            width: 100%;
            text-align: left;
          }
        `}</style>
      </div>
    );
  }
}
