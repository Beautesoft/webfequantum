import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logout } from "service/utilities";
import { Logout } from "redux/actions/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./style.scss";

export class ProfileMenuClass extends Component {
  state = {
    navLinks: [
      {
        to: "/admin/editUserProfile",
        label: "Edit Profile",
        iconName: "Group-81",
        typeId: [1, 2],
      },
      {
        to: "/admin/adminManagement",
        label: "Admin Management",
        iconName: "Group-59",
        typeId: [1],
      },
    ],
  };

  handleLogout = () => {
    this.props.Logout().then(res => {
      console.log(res, "fggfhfhtf");
      if (res.status === 200) {
        logout();
      }
    });
  };

  render() {
    let { navLinks } = this.state;

    let { typeId } = this.props.data;

    let tokentypeId = typeId;

    return (
      <div className={`profile-menu ${this.props.active ? "active" : ""}`}>
        <ul>
          {navLinks.map((item, index) => {
            let { to, label, iconName, typeId } = item;

            return (
              <React.Fragment key={index}>
                {typeId.indexOf(tokentypeId) != -1 ? (
                  <li>
                    <Link to={to}>
                      <span
                        className={`profile-menu-icon icon-${iconName}`}
                      ></span>
                      <span className="profile-menu-desc">{label}</span>
                    </Link>
                  </li>
                ) : (
                  ""
                )}
              </React.Fragment>
            );
          })}

          {/* <li>
            <a onClick={logout} href="#">
              <span className="profile-menu-icon icon-Group-33"></span>
              <span className="profile-menu-desc">Logout</span>
            </a>
          </li> */}
          <li>
            <span className="">{this.props.data.username}</span>
          </li>
          <li>
            <span className="">({this.props.data.role})</span>
          </li>
          <li>
            <span></span>
          </li>
          <li>
            <a onClick={this.handleLogout} href="#">
              <span className="profile-menu-icon icon-logout"></span>
              <span className="profile-menu-desc">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Logout,
    },
    dispatch
  );
};

export const ProfileMenu = connect(null, mapDispatchToProps)(ProfileMenuClass);
