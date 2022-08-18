import React, { Component } from "react";
import { NormalInput, NormalButton } from "component/common";
import { withTranslation } from "react-i18next";
export class CredentialConfirmationClass extends Component {
  state = {
    passwordVisible: false,
    cartusername: "",
    cartpassword: "",
  };

  handleInputChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value,
    });
  };

  toggle = key => {
    this.setState(prevState => ({
      [key]: !prevState[key],
    }));
  };
  render() {
    let { passwordVisible, cartusername, cartpassword } = this.state;
    let { t } = this.props;
    return (
      <div className="row">
        <div className="d-flex flex-wrap">
          <div className="col-12 mb-4">
            <p>{t("Please enter your login credential")} </p>
          </div>
          <div className="col-12 form-group mb-3 pb-2">
            <div className="input-group">
              <NormalInput
                placeholder="Username"
                value={cartusername}
                name="cartusername"
                autocomplete="off"
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-12 form-group mb-3 pb-2">
            <div className="input-group">
              <NormalInput
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={cartpassword}
                name="cartpassword"
                autocomplete="off"
                onChange={e => this.handleInputChange(e)}
              />
              <div className="input-group-addon right fs-14">
                <span
                  onClick={() => this.toggle("passwordVisible")}
                  className={`icon-${
                    passwordVisible ? "eye" : "eye-blocked"
                  } cursor-pointer fs-24`}
                ></span>
              </div>
            </div>
          </div>
          <div className="form-group mb-0 p-0 d-flex justify-content-center col-12">
            <NormalButton
              onClick={() =>
                this.props.handleLoginSubmit(
                  this.state.cartusername,
                  this.state.cartpassword
                )
              }
              label="PROCEED"
              className="col-12 submit-btn"
            />
          </div>
        </div>
      </div>
    );
  }
}

export const CredentialConfirmation = withTranslation()(
  CredentialConfirmationClass
);
