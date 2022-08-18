import React, { Component } from "react";
import {
  NormalButton,
  NormalDate,
  NormalModal,
  TableWrapper,
} from "component/common";
import "./style.scss";
import { Dayendreportpage } from "./Dayendreportpage";

export class DayEndReport extends Component {
  state = {};

  render() {
    return (
      <div className="DayEndReport">
        <Dayendreportpage />
      </div>
    );
  }
}
