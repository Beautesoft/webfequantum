import React, { Component } from "react";

import logo from "../assets/images/logo.png";

export class AuthLayout extends Component {
  // componentWillMount() { }

  render() {
    let { children } = this.props;

    return (
      <>
        <div className="auth-layout">
          <div className="col-12 h-100">
            <div className="row h-100">
              <div className="col-md-4 p-0">
                <div className="auth-layout-bg w-100 h-100">
                  <div className="page-wrapper w-100 h-100 position-relative">
                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                      <img
                        src={logo}
                        className="bg-white"
                        width="334"
                        height="73"
                        alt=""
                        className="position-relative"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 p-0">
                <div className="col-8 mx-auto d-flex align-items-center justify-content-center h-100">
                  <form className="pt-2 w-100">{children}</form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
