import React, { Component } from "react";
import { Navbar } from "component/Header";
import { Sidebar } from "component/Sidebar";
import "assets/scss/layouts/mainlayout.scss";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

export class MainLayout extends Component {
  state = {
    profilemenu: false,
    menuOpenClass: false,
  };

  handleProfileMenu = (event, active) => {
    event.stopPropagation();
    this.setState({
      profilemenu: active,
    });
  };

  handleSidenav = () => {
    let { menuOpenClass } = this.state;

    this.setState({
      menuOpenClass: !menuOpenClass,
    });
  };

  render() {
    let { children } = this.props;

    let { menuOpenClass } = this.state;

    return (
      <div id="main-content" onClick={e => this.handleProfileMenu(e, false)}>
        <div
          className={
            window.location.pathname == "/admin/newappointmentfullscreen"
              ? "fscreen-head"
              : window.location.pathname == "/admin/mobileappointment"
              ? "d-none"
              : "nav-head"
          }
        >
          <Navbar
            changeProfileState={(e, param) => this.handleProfileMenu(e, param)}
            active={this.state.profilemenu}
          />
          <Sidebar
            menuOpen={menuOpenClass}
            handleSidenav={this.handleSidenav}
          />
        </div>
        <div
          className={
            window.location.pathname == "/admin/newappointmentfullscreen"
              ? "fscreen-wrapper"
              : window.location.pathname == "/admin/mobileappointment"
              ? "mscreen-wrapper"
              : window.location.pathname == "/admin/kpidashboard"
              ? "dashboardContent-wrapper"
              : "content-wrapper"
          }
        >
          <PerfectScrollbar>
            <div className="content">{children}</div>
          </PerfectScrollbar>
        </div>
      </div>
    );
  }
}
