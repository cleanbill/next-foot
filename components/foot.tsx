import { Component, useState } from "react";
import { DownloadType } from "../pages/history";

export interface FootProps {
  importHistory: () => void;
  exportHistory: (downloadType: DownloadType) => void;
}

export interface FootState {
  downloadType: DownloadType;
}

export default class Foot extends Component<FootProps, FootState> {
  private interval = null;

  constructor(props: FootProps) {
    super(props);
    this.state = { downloadType: DownloadType.Storage };
  }

  async toggleDownloadType() {
    if (this.state.downloadType == DownloadType.CSV) {
      this.setState({ downloadType: DownloadType.Storage });
    } else {
      this.setState({ downloadType: DownloadType.CSV });
    }
  }

  render() {
    return (
      <footer>
        <div className="foots pt-8 text-base leading-7 font-semibold">
          <p className="text-left">
            <a
              onClick={() => this.props.importHistory()}
              className="text-sky-500 hover:text-sky-600"
            >
              <span>Import Storage</span>
            </a>
          </p>
          <p className="text-center">
            <a
              onClick={() => this.props.exportHistory(this.state.downloadType)}
              className="text-sky-500 hover:text-sky-600"
            >
              Export
            </a>
            <a
              onClick={() => this.toggleDownloadType()}
              className="text-sky-500 hover:text-sky-600"
            >
              &nbsp;
              {this.state.downloadType}
            </a>
          </p>
          <p className="text-right">
            <a href="/board" className="text-sky-500 hover:text-sky-600">
              Board &rarr;
            </a>
          </p>
        </div>
        <style jsx>{`
          .foots {
            display: grid;
            grid-template-columns: 2fr 2fr 1fr;
          }
        `}</style>
      </footer>
    );
  }
}
