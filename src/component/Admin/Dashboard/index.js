import React, { Component } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import "./style.scss";
import { AdminStats, SalesStats } from "./Statistic";
export class Dashboard extends Component {
  state = {
    activeTab: "1",
  };

  render() {
    return (
      <div className="dashboard">
        <AdminStats />
      </div>
    );
  }
}
