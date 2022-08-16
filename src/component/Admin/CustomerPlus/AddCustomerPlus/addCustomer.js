import React, { Component } from "react";
import "./style.scss";
import SimpleReactValidator from "simple-react-validator";
import {
  NormalInput,
  NormalSelect,
  NormalDate,
  NormalButton,
  NormalDateTime,
} from "component/common";
import { Link } from "react-router-dom";
import { dateFormat } from "service/helperFunctions";
import { FormGroup, Label, Input } from "reactstrap";

export class AddCustomerFormClass extends Component {
  state = {
    formFields: {},
    namePrefix: [
      { value: "10001", label: "Mr" },
      { value: "10002", label: "Mrs" },
      { value: "10003", label: "Miss" },
    ],
    classPrefix: [
      { value: "100000", label: "Normal" },
      { value: "100001", label: "Staff" },
    ],
    sourcePrefix: [
      { value: "100001", label: "FRIEND" },
      { value: "100002", label: "NEWSPAPER" },
      { value: "100004", label: "FLYER" },
      { value: "100005", label: "BANNER" },
      { value: "100006", label: "INTERNET" },
      { value: "100008", label: "OTHERS" },
      { value: "100009", label: "ROAD SHOW" },
      { value: "100012", label: "WALK IN" },
      { value: "100013", label: "MGM" },
    ],
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

  handleSubmit = event => {
    // console.log("====", event, "sdfasdfasdf")
    // this.props.handleSubmit(event)
    if (this.validator.allValid()) {
      this.props.handleSubmit(event);
    } else {
      this.validator.showMessages();
    }
  };

  render() {
    let { formFields, sexOption, handleCancel, handleDatePick, salonList, t } =
      this.props;
    let { namePrefix } = this.state;
    let { classPrefix } = this.state;
    let { sourcePrefix } = this.state;
    let {
      cust_name,
      cust_address,
      cust_phone2,
      cust_phone1,
      cust_class,
      cust_source,
      cust_refer,
      cust_nric,
      cust_email,
      cust_title,
      cust_dob,
      Cust_sexesid,
      Site_Codeid,
      Cust_sexes,
      Site_Code,
    } = formFields;
    return (
      <div className="form-group mb-4 pb-2">
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Customer Date of Birth")}
          </label>
          <div className="input-group py-3">
            <NormalDateTime
              onChange={handleDatePick}
              inputcol="p-0 inTime"
              // value={outTime}
              value={cust_dob ? new Date(cust_dob) : new Date()}
              // label="inTime"
              name="cust_dob"
              className="dob-pick"
              showYearDropdown={true}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Customer Name")}
          </label>
          <div className="input-group">
            <div className="col-2 p-0">
              <NormalSelect
                // placeholder="Enter here"
                options={namePrefix}
                value={cust_title}
                name="cust_title"
                onChange={this.props.handleChange}
              />
            </div>
            <div className="col-6">
              <NormalInput
                placeholder="Enter here"
                value={cust_name}
                name="cust_name"
                onChange={this.props.handleChange}
              />
            </div>
          </div>
          {this.validator.message("Name", cust_name, "required|max:50")}
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Customer Class")}
          </label>
          <div className="input-group">
            <NormalSelect
              options={classPrefix}
              value={cust_class}
              name="cust_class"
              onChange={this.props.handleChange}
            />
          </div>
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Address")}
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_address}
              name="cust_address"
              onChange={this.props.handleChange}
            />
          </div>
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("NRIC")}
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_nric}
              name="cust_nric"
              onChange={this.props.handleChange}
            />
          </div>
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Source")}
          </label>
          <div className="input-group">
            <NormalSelect
              options={sourcePrefix}
              value={cust_source}
              name="cust_source"
              onChange={this.props.handleChange}
            />
          </div>
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Reference Code")}
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_refer}
              name="cust_refer"
              onChange={this.props.handleChange}
            />
          </div>
        </div>

        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Phone Number 1")}
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_phone1}
              name="cust_phone1"
              onChange={this.props.handleChange}
            />
          </div>
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Phone Number 2")}
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_phone2}
              name="cust_phone2"
              onChange={this.props.handleChange}
            />
          </div>
        </div>

        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            {t("Email Address")}
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_email}
              name="cust_email"
              onChange={this.props.handleChange}
            />
          </div>
        </div>

        <div className="pt-5 d-flex justify-content-center">
          <div className="col-3">
            <NormalButton
              onClick={handleCancel}
              label="CANCEL"
              danger={true}
              className="mr-2 col-12"
            />
          </div>
          <div className="col-3">
            <NormalButton
              onClick={() => this.handleSubmit()}
              label="SAVE"
              success={true}
              className="mr-2 col-12"
            />
          </div>
          <div className="col-3">
            <NormalButton
              onClick={() => this.handleSubmit("catalog")}
              label="SAVE & CATALOG"
              success={true}
              className="mr-2 col-12"
            />
          </div>
        </div>
      </div>
    );
  }
}
export const AddCustomerForm = withTranslation()(AddCustomerFormClass);
