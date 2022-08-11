import React, { Component } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalTextarea,
} from "component/common";
import { updateEmpInfo, getStaffPlus } from "redux/actions/staffPlus";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

export class EmployeeInfoClass extends Component {
  state = {
    formFields: {
      display_name: "",
      emp_name: "",
      emp_phone1: "",
      emp_address: "",
      Emp_sexesid: "",
      emp_nric: "",
      emp_race: "",
      Emp_nationalityid: "",
      emp_country: "",
      Emp_maritalid: "",
      Emp_religionid: "",
      emp_emer: "",
      emp_emerno: "",
      emp_remarks: "",
    },
    sexOption: [
      { value: 1, label: "Male" },
      { value: 2, label: "Female" },
    ],
    raceList: [],
    nationalityList: [],
    maritialStatusList: [
      { value: 1, label: "Single" },
      { value: 2, label: "Married" },
    ],
    religionList: [],
    countryList: [],
    is_loading: false,
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentWillMount() {
    this.validator = new SimpleReactValidator({
      validators: {
        contactNumber: {
          message: "The :attribute must be a valid format.",
          rule: (val, params, validator) => {
            return (
              validator.helpers.testRegex(
                val,
                /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
              ) && params.indexOf(val) === -1
            );
          },
          messageReplace: (message, params) =>
            message.replace("", this.helpers.toSentence(params)),
          required: true,
        },
      },
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });

    this.getDetails();
  }

  // get data from apis
  getDetails = async () => {
    this.updateState({ is_loading: true });
    await this.props
      .getStaffPlus(`${this.props.match.params.id}/`)
      .then(res => {
        this.setDataFromStore();
      });
    await this.props.getCommonApi("meta/religion/").then(res => {
      let { religionList } = this.state;
      for (let key of res.religions) {
        religionList.push({ value: key.itm_id, label: key.itm_name });
      }
      this.updateState({ religionList });
    });
    await this.props.getCommonApi("meta/nationality/").then(res => {
      let { nationalityList } = this.state;
      for (let key of res.nationalities) {
        nationalityList.push({ value: key.itm_id, label: key.itm_name });
      }
      this.updateState({ nationalityList });
    });
    await this.props.getCommonApi("meta/race/").then(res => {
      let { raceList } = this.state;
      for (let key of res.races) {
        raceList.push({ value: key.itm_id, label: key.itm_name });
      }
      this.updateState({ raceList });
    });
    await this.props.getCommonApi("meta/country/").then(res => {
      let { countryList } = this.state;
      for (let key of res.countries) {
        countryList.push({ value: key.itm_id, label: key.itm_desc });
      }
      this.updateState({ countryList });
    });
    this.updateState({ is_loading: false });
  };

  // set data to formfield from response while edit
  setDataFromStore = () => {
    let { staffPlusDetail } = this.props;
    let { formFields } = this.state;
    formFields["emp_name"] = staffPlusDetail.emp_name;
    formFields["display_name"] = staffPlusDetail.display_name;
    formFields["emp_nric"] = staffPlusDetail.emp_nric;
    formFields["emp_phone1"] = staffPlusDetail.emp_phone1;
    formFields["emp_address"] = staffPlusDetail.emp_address;
    formFields["Emp_sexesid"] = staffPlusDetail.Emp_sexesid;
    formFields["emp_race"] = staffPlusDetail.emp_race;
    formFields["Emp_maritalid"] = staffPlusDetail.Emp_maritalid;
    formFields["Emp_nationalityid"] = staffPlusDetail.Emp_nationalityid;
    formFields["Emp_religionid"] = staffPlusDetail.Emp_religionid;
    formFields["emp_country"] = staffPlusDetail.emp_country;
    formFields["emp_emer"] = staffPlusDetail.emp_emer;
    formFields["emp_emerno"] = staffPlusDetail.emp_emerno;
    formFields["emp_remarks"] = staffPlusDetail.emp_remarks;
    this.updateState({ formFields });
  };

  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;

    this.updateState({
      formFields,
    });
  };

  handleDatePick = async (name, value) => {
    let { formFields } = this.state;
    formFields[name] = value;
    await this.updateState({
      formFields,
    });
  };

  handleInput = ({ target: { name, value } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    formFields[name] = value === true ? 1 : value;
    this.updateState({
      formFields,
    });
  };

  // submit to create/update staff
  handleSubmit = async () => {
    if (this.validator.allValid()) {
      try {
        this.updateState({ is_loading: true });
        let { formFields } = this.state;
        const formData = new FormData();
        formData.append("emp_phone1", formFields.emp_phone1);
        formData.append("emp_address", formFields.emp_address);
        formData.append("Emp_sexesid", formFields.Emp_sexesid);
        formData.append("emp_race", formFields.emp_race);
        formData.append("Emp_maritalid", formFields.Emp_maritalid);
        formData.append("Emp_nationalityid", formFields.Emp_nationalityid);
        formData.append("Emp_religionid", formFields.Emp_religionid);
        formData.append("emp_country", formFields.emp_country);
        formData.append("emp_emer", formFields.emp_emer);
        formData.append("emp_emerno", formFields.emp_emerno);
        formData.append("emp_remarks", formFields.emp_remarks);
        await this.props
          .updateEmpInfo(this.props.match.params.id, formData)
          .then(res => {
            console.log(res);
            if (res.status === 200) {
              window.location.reload();
            }
          });
      } catch (e) {
        console.log(e);
      }
      this.updateState({ is_loading: true });
    } else {
      this.validator.showMessages();
    }
  };

  handleChangeBox = event => {
    let formFields = Object.assign({}, this.state.formFields);
    console.log(formFields, "oyokkjk", event.target.name, event.target);
    formFields[event.target.name] = event.target.checked;

    this.updateState({
      formFields,
    });
  };

  render() {
    let {
      formFields,
      sexOption,
      raceList,
      nationalityList,
      maritialStatusList,
      religionList,
      countryList,
      is_loading,
    } = this.state;

    let {
      emp_name,
      emp_nric,
      display_name,
      emp_phone1,
      emp_address,
      Emp_sexesid,
      emp_race,
      Emp_nationalityid,
      emp_country,
      Emp_maritalid,
      Emp_religionid,
      emp_emer,
      emp_emerno,
      emp_remarks,
    } = formFields;
    let { t } = this.props;
    return (
      <div className="px-5 container create-staff">
        <div className="head-label-nav">
          <p
            className="category fw-500"
            onClick={this.props.history.push("/admin/staffplus")}
          >
            {t("Staff")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">{t("Edit Employee Information")}</p>
        </div>
        {is_loading ? (
          <div class="d-flex mt-5 align-items-center justify-content-center">
            <div class="spinner-border" role="status">
              <span class="sr-only">{t("Loading...")}</span>
            </div>
          </div>
        ) : (
          <div className="staff-detail">
            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Name")}
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    :
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {emp_name}
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("NRIC")} / {t("WP")}
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    :
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {emp_nric}
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("User name")}
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    :
                  </label>
                </div>
                <div className="col-md-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {display_name}
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Phone")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={emp_phone1}
                      name="emp_phone1"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Address")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={emp_address}
                      name="emp_address"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Gender")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      // placeholder="Enter here"
                      options={sexOption}
                      value={Emp_sexesid}
                      name="Emp_sexesid"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Race")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      // placeholder="Enter here"
                      options={raceList}
                      value={emp_race}
                      name="emp_race"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Nationality")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      // placeholder="Enter here"
                      options={nationalityList}
                      value={Emp_nationalityid}
                      name="Emp_nationalityid"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Marital Status")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      // placeholder="Enter here"
                      options={maritialStatusList}
                      value={Emp_maritalid}
                      name="Emp_maritalid"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Religion")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      // placeholder="Enter here"
                      options={religionList}
                      value={Emp_religionid}
                      name="Emp_religionid"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Country")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      // placeholder="Enter here"
                      options={countryList}
                      value={emp_country}
                      name="emp_country"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Emergency Person")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={emp_emer}
                      name="emp_emer"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Emergency Phone")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={emp_emerno}
                      name="emp_emerno"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-12">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Remarks")}
                  </label>
                  <div className="input-group">
                    <NormalTextarea
                      value={emp_remarks}
                      name="emp_remarks"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-bottom-line"></div>
            <div className="pt-5 d-flex justify-content-center">
              <div className="col-2">
                <Link to="/admin/staffplus">
                  <NormalButton
                    label="Cancel"
                    resetbg={true}
                    className="mr-2 col-12"
                  />
                </Link>
              </div>
              <div className="col-2">
                <NormalButton
                  onClick={() => this.handleSubmit()}
                  label="Save"
                  success={true}
                  className="mr-2 col-12"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  staffPlusDetail: state.staffPlus.staffPlusDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getStaffPlus,
      updateEmpInfo,
      getCommonApi,
    },
    dispatch
  );
};

export const EmployeeInfo = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(EmployeeInfoClass)
);
