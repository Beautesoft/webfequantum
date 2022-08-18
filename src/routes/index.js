import React, { Component } from "react";
import { Route, Router, Redirect } from "react-router-dom";
import { history } from "../helpers";
import { connect } from "react-redux";

import Routers from "./routes";

import * as Layout from "../layout";
import * as Pages from "../pages";

// import { getTokenDetails } from 'redux/actions/auth'

import { NotificationContainer } from "react-notifications";

export class RoutesClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderRoute: false,
      pathname: null,
      loading: true,
    };
  }

  componentDidMount() {
    // if (
    //   history.location.pathname == "/auth" ||
    //   history.location.pathname == "/auth/"
    // ) {
    //   history.push("/auth/login");
    // }
  }

  // componentDidMount() { }

  // componentWillReceiveProps({ userPermissionDetails }) { }

  routerGuard = () => {
    // let currentPath = history.location.pathname.split("/")[1];
    // if (currentPath === "auth") {
    // history.push("/admin/dashboard");
    // console.log("asdfgadffgdfgdfgdfgdfg")
    // getTokenDetails()
  };

  // {navLinks.map(({ to, label, role, imgno }, index) =>
  //               //role.includes("THERAPIST") ? (
  //               role.includes(tokenDetail.role_code) ? (

  render() {
    let { tokenDetails } = this.props;
    return (
      <Router history={history}>
        {Routers.map(
          ({
            component,
            redirect,
            path,
            exact = false,
            // auth = true,
            childrens = [],
            role,
            rightskey,
          }) => {
            if (childrens.length > 0) {
              return (
                <Route
                  path={path}
                  exact={exact}
                  key={path}
                  render={props => {
                    if (redirect) {
                      if (props.location.pathname === path) {
                        props.history.push(redirect);
                      }
                    }

                    const LayoutComponent = Layout[component];
                    if (component === "MainLayout") {
                      return (
                        <LayoutComponent {...props}>
                          {childrens.map(
                            ({
                              component: ChildrenComponent,
                              path: childrenPath,
                              exact = false,
                              auth = true,
                              role,
                              rightskey,
                            }) => {
                              this.routerGuard();
                              return (
                                <Route
                                  path={path + childrenPath}
                                  exact={exact}
                                  key={path + childrenPath}
                                  render={props => {
                                    if (tokenDetails[rightskey]) {
                                      let PageComponent =
                                        Pages[ChildrenComponent];

                                      return <PageComponent {...props} />;
                                    } else {
                                      return (
                                        <div className="d-flex justify-content-center p-5"></div>
                                      );
                                    }
                                  }}
                                />
                              );
                            }
                          )}
                        </LayoutComponent>
                      );
                    } else {
                      return (
                        <LayoutComponent {...props}>
                          {childrens.map(
                            ({
                              component: ChildrenComponent,
                              path: childrenPath,
                              exact = false,
                              auth = true,
                              role,
                            }) => {
                              this.routerGuard();
                              return (
                                <Route
                                  path={path + childrenPath}
                                  exact={exact}
                                  key={path + childrenPath}
                                  render={props => {
                                    let PageComponent =
                                      Pages[ChildrenComponent];

                                    return <PageComponent {...props} />;
                                  }}
                                />
                              );
                            }
                          )}
                        </LayoutComponent>
                      );
                    }
                  }}
                />
              );
            }
            if (component === "MainLayout") {
              return (
                <Route
                  path={path}
                  exact={exact}
                  key={component}
                  render={props => {
                    if (tokenDetails[rightskey]) {
                      if (component) {
                        let PageComponent = Pages[component];
                        return <PageComponent {...props} />;
                      }
                      if (redirect) {
                        return <Redirect to={redirect} />;
                      }
                      return <div></div>;
                    } else {
                      return (
                        <div className="d-flex justify-content-center p-5"></div>
                      );
                    }
                  }}
                />
              );
            } else {
              return (
                <Route
                  path={path}
                  exact={exact}
                  key={component}
                  render={props => {
                    if (component) {
                      let PageComponent = Pages[component];
                      return <PageComponent {...props} />;
                    }
                    if (redirect) {
                      return <Redirect to={redirect} />;
                    }
                    return <div></div>;
                  }}
                />
              );
            }
          }
        )}

        <NotificationContainer />
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
});

let component = RoutesClass;

export const Routes = connect(mapStateToProps, null)(component);
