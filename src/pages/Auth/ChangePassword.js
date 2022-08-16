import React, { Component } from "react";
import { NormalInput, NormalButton } from "component/common";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SimpleReactValidator from "simple-react-validator";

import { resetPassword, getTokenVerify } from "redux/actions/auth";

export class ChangePasswordClass extends Component {
  state = {
    formDetails: {
      newPassword: "",
      reEnterPassword: ""
    },
    newPasswordVisible: false,
    reEnterPasswordVisible: false
  };

  toggle = key => {
    this.setState(prevState => ({
      [key]: !prevState[key]
    }));
  };

  componentWillMount() {
    this.validator = new SimpleReactValidator({
      validators: {
        // password: {
        //   message: 'The :attribute must be a valid format.',
        //   rule: (val, params, validator) => {
        //     return validator.helpers.testRegex(val, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/) && params.indexOf(val) === -1
        //   },
        //   messageReplace: (message, params) => message.replace('', this.helpers.toSentence(params)),
        //   required: true
        // },
        checkPassword: {
          message: "Given :attribute does not match",
          rule: function (val, params) {
            return val === params[0];
          }
        }
      },
      element: message => (
        <span className="error-message font-md">{message}</span>
      ),
      autoForceUpdate: this,
    });
  }

  componentDidMount() {
    // this.props.getTokenVerify({ token: getUrlParameter("token") });
  }

  handleInput = ({ target: { value, name } }) => {
    let formDetails = Object.assign({}, this.state.formDetails);

    formDetails[name] = value;

    this.setState({
      formDetails
    });
  };

  handleChangePsssword = event => {
    event.preventDefault();

    if (this.validator.allValid()) {
      let { newPassword } = this.state.formDetails;
      let data = {
        new_password : newPassword
      }
      this.props.resetPassword(`?emp_name=${this.props.match.params.name}`, data).then(() => {
        this.props.history.push("/auth/login");
      });
    } else {
      this.validator.showMessages();
    }
  };

  render() {
    let { newPasswordVisible, reEnterPasswordVisible } = this.state;

    let { newPassword, reEnterPassword } = this.state.formDetails;

    return (
      <>
        <div id="changePassword" className="h-100 py-5">
          <h1 className="text-left common-heading pb-5 fs-28">Reset Password</h1>
          <div className="form-group mb-4 pb-3">
            <div className="input-group">
              <NormalInput
                type={newPasswordVisible ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={this.handleInput}
              />
              <div className="input-group-addon right fs-14">
                <span
                  onClick={() => this.toggle("newPasswordVisible")}
                  className={`icon-${newPasswordVisible ? "eye" : "eye-blocked"} cursor-pointer fs-24`}
                ></span>
              </div>
            </div>
            {this.validator.message(
              "password",
              newPassword,
              "required|password"
            )}
          </div>
          <div className="form-group mb-5 pb-5">
            <div className="input-group">
              <NormalInput
                type={reEnterPasswordVisible ? "text" : "password"}
                name="reEnterPassword"
                placeholder="Confirm  New Password"
                value={reEnterPassword}
                onChange={this.handleInput}
              />
              <div className="input-group-addon right fs-14">
                <span
                  onClick={() => this.toggle("reEnterPasswordVisible")}
                  className={`icon-${reEnterPasswordVisible ? "eye" : "eye-blocked"} cursor-pointer fs-24`}
                ></span>
              </div>
            </div>
            {this.validator.message(
              "Password",
              reEnterPassword,
              `required|checkPassword:${newPassword}`
            )}
          </div>

          <div className="form-group mb-0 pt-5 d-flex justify-content-center">
            <NormalButton
              onClick={this.handleChangePsssword}
              mainbg={true}
              className="mr-2 col-12"
              label="continue"
              />
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      resetPassword,
      getTokenVerify
    },
    dispatch
  );
};

let component = ChangePasswordClass;

export const ChangePassword = connect(null, mapDispatchToProps)(component);
