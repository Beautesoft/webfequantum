import React, { Component } from "react";
import "./style.scss";
import SimpleReactValidator from "simple-react-validator";
import { NormalInput, NormalButton } from "component/common";
import { Toast } from "service/toast";
import { commonCreateApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

export class AddWalkinCustomerClass extends Component {
  state = {
    walkInUser: { newCustname: "", newCust_phone: "", newCustreference: "" },
  };

  componentWillMount() {
    this.validator = new SimpleReactValidator({
      validators: {},
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  }

  handleChange = async ({ target: { value, name } }) => {
    let { walkInUser } = this.state;
    walkInUser[name] = value;
    await this.setState({
      walkInUser,
    });
  };
  handleSubmit = () => {
    let { walkInUser } = this.state;
    console.log(walkInUser, "walkin users");

    if (this.validator.allValid()) {
      let data = {
        cust_name: walkInUser.newCustname,
        cust_address: null,
        cust_dob: null,
        cust_phone1: null,
        cust_phone2: walkInUser.newCust_phone,
        cust_email: null,
        Cust_sexesid: null,
        custallowsendsms: null,
        cust_maillist: null,
        cust_refer: walkInUser.newCustreference,
      };
      this.props.commonCreateApi(`customer/`, data).then(async res => {
        if (res.status === 201) {
          console.log(res, "Walkincustomer");
          this.setState({ walkInUser: {} });
          this.props.handleWalkInCustomer(res.data);
        } else {
          Toast({ type: "error", message: res.message });
        }
      });
    } else {
      this.validator.showMessages();
    }
  };

  render() {
    let { walkInUser } = this.state;
    let { t } = this.props;

    let { newCustname, newCust_phone, newCustreference } = walkInUser;
    return (
      <>
        <div className="col-md-2 col-12 mb-3">
          <label className="text-left text-black common-label-text ">
            {t("Name")}
            <span className="error-message text-danger validNo fs-18">*</span>
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={newCustname}
              name="newCustname"
              onChange={this.handleChange}
            />
          </div>
          {this.validator.message("Name", newCustname, "required|max:50")}
        </div>
        <div className="col-md-2 col-12 mb-3">
          <label className="text-left text-black common-label-text ">
            {t("Phone")}
            <span className="error-message text-danger validNo fs-18">*</span>
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={newCust_phone}
              name="newCust_phone"
              onChange={this.handleChange}
            />
          </div>
          {this.validator.message("Phone", newCust_phone, "required")}
        </div>
        <div className="col-md-1 col-12 mb-3">
          <label className="text-left text-black common-label-text ">
            {t("Reference")}
          </label>
          <div className="input-group">
            <NormalInput
              value={newCustreference}
              name="newCustreference"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="col-md-1 col-12 d-flex align-self-center">
          <NormalButton
            onClick={() => this.handleSubmit()}
            label="Save"
            className=" fs-15 confirm"
            mainbg={true}
            buttonClass={"mx-2 p-0"}
            outline={false}
          />
        </div>
      </>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      commonCreateApi,
    },
    dispatch
  );
};

export const AddWalkinCustomer = withTranslation()(
  connect(null, mapDispatchToProps)(AddWalkinCustomerClass)
);
