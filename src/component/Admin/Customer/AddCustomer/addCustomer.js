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

export class AddCustomerForm extends Component {
  state = {
    formFields: {},
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
    let { formFields, sexOption, handleCancel, handleDatePick, salonList } =
      this.props;

    let {
      cust_name,
      cust_address,
      cust_phone2,
      cust_email,
      cust_dob,
      Cust_sexesid,
      Site_Codeid,
      custallowsendsms,
      cust_maillist,
    } = formFields;
    return (
      <div className="form-group mb-4 pb-2">
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            Customer Name
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_name}
              name="cust_name"
              onChange={this.props.handleChange}
            />
          </div>
          {this.validator.message("Name", cust_name, "required|max:50")}
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            Email
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_email}
              name="cust_email"
              onChange={this.props.handleChange}
            />
          </div>
          {this.validator.message("Address", cust_address, "required")}
        </div>

        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            Address
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_address}
              name="cust_address"
              onChange={this.props.handleChange}
            />
          </div>
          {this.validator.message("Address", cust_address, "required")}
        </div>

        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            DOB
          </label>
          <div className="input-group py-3">
            {/* <NormalDate
                            value={cust_dob}
                            name="cust_dob"
                            type="date"
                            onChange={this.props.handleChange}
                        /> */}
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
            {/* <span className="icon-calendar icon font-lg icon"></span> */}
          </div>
          {this.validator.message("Date Of Birth", cust_dob, "required")}
        </div>
        <div className="pb-md-4">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            Contact Number
          </label>
          <div className="input-group">
            <NormalInput
              placeholder="Enter here"
              value={cust_phone2}
              name="cust_phone2"
              onChange={this.props.handleChange}
            />
          </div>
          {this.validator.message("Phone", cust_phone2, "required")}
        </div>
        <div className="gender">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            Gender
          </label>
          <div className="input-group">
            <NormalSelect
              // placeholder="Enter here"
              options={sexOption}
              value={Cust_sexesid}
              name="Cust_sexesid"
              onChange={this.props.handleChange}
            />
          </div>
          {this.validator.message("Gender", Cust_sexesid, "required")}
        </div>
        <div className="gender mt-3">
          <label className="text-left text-black common-label-text fs-17 pb-2">
            Site
          </label>
          <div className="input-group">
            <NormalSelect
              // placeholder="Enter here"
              options={salonList}
              value={Site_Codeid}
              name="Site_Codeid"
              onChange={this.props.handleChange}
            />
          </div>
          {this.validator.message("site", Site_Codeid, "required")}
        </div>

        <div className="gender mt-3">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                onChange={this.props.handleChangeBox}
                name="custallowsendsms"
                checked={custallowsendsms}
              />
              Send SMS
            </Label>
          </FormGroup>
        </div>
        <div className="gender mt-3">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                onChange={this.props.handleChangeBox}
                name="cust_maillist"
                checked={cust_maillist}
              />
              Send Mail
            </Label>
          </FormGroup>
        </div>

        {/* <div className="form-group mb-4 pb-3">
                    <div className="input-group">
                        <NormalSelect
                            // placeholder="Enter here"
                            options={salonList}
                            value={Site_Codeid}
                            name="Site_Codeid"
                            onChange={this.handleChange}
                        />
                    </div>
                    {this.validator.message('salon', Site_Codeid, 'required|string')}
                </div> */}
        <div className="border-bottom-line mt-5"></div>
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
