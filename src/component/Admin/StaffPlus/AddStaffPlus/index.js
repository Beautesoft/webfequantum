import React, { Component } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalDateTime,
  NormalMultiSelect,
  NormalRadio,
  NormalCheckbox,
  NormalDate,
  NormalTextarea,
} from "component/common";
import { displayImg, dateFormat } from "service/helperFunctions";
import { DragFileUpload } from "../../../common";
import {
  createStaffPlus,
  getStaffPlus,
  updateStaffPlus,
  getWorkSchedule,
  updateWorkSchedule,
} from "redux/actions/staffPlus";
import { getJobtitle, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FormGroup, Label, Input } from "reactstrap";
import { ScheduleTable } from "./ScheduleTable";
import { withTranslation } from "react-i18next";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

export class AddStaffClass extends Component {
  state = {
    formFields: {
      emp_name: "",
      emp_nric: "",
      display_name: "",
      emp_joindate: new Date(),
      Site_Codeid: "",
      EMP_TYPEid: "",
      emp_pic: "",
      emp_isactive: false,
      is_login: false,
      pw_password: "",
      LEVEL_ItmIDid: 0,
      show_in_sales: false,
      show_in_appt: false,
      show_in_trmt: false,
      max_disc: "",
      work_schedule: {
        monday: "YES",
        tuesday: "YES",
        wednesday: "YES",
        thursday: "YES",
        friday: "YES",
        saturday: "NO",
        sunday: "NO",
      },
      Site_Codeid: "",
      siteCodes: [],
      emp_dob: new Date(),
      emp_salary: "",
      emp_epf: "",
      emp_epf_employee: 0,
      emp_epf_employer: 0,
      flghourly: false,
      emphoursalary: "",
      emp_address: "",
      emp_phone1: "",
    },
    is_flghourly: "hourly",
    scheduleOptions: [],
    jobOption: [],
    locationOption: [],
    levelList: [],
    is_loading: true,
    isMounted: true,
    isCompensation: false,
    isEPFKey: false,
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
  }
  componentDidMount() {
    let isEPFKey = true;
    this.setState({
      isEPFKey,
    });
    this.loadData();
  }

  loadData = async () => {
    this.updateState({ is_loading: true });
    // branch option api
    await this.props.getCommonApi("branchlist/").then(res => {
      let { locationOption } = this.state;
      for (let key of res.data) {
        locationOption.push({ value: key.id, label: key.itemsite_desc });
      }
      this.updateState({ locationOption });
    });

    // level option api
    await this.props.getCommonApi("securities/").then(res => {
      let { levelList } = this.state;
      for (let key of res.data) {
        levelList.push({ value: key.id, label: key.level_name });
      }
      this.updateState({ levelList });
    });

    // schedule hours api
    await this.props.getCommonApi("WorkScheduleHours/").then(res => {
      let { scheduleOptions } = this.state;
      for (let key of res.schedules) {
        scheduleOptions.push({
          id: key.id,
          value: key.itm_code,
          label: key.itm_desc,
          color: key.itm_color,
          shortDesc: key.shortDesc,
        });
      }
      this.updateState({ scheduleOptions });
    });

    // get api for staff while
    if (this.props.match.params.id) {
      // jobtitle option api
      await this.props.getJobtitle().then(async () => {
        await this.mapJobList();
        await this.getStaffDetail();
      });
    } else {
      // jobtitle option api
      await this.props.getJobtitle().then(() => {
        this.mapJobList();
      });
    }
    this.updateState({ is_loading: false });
  };

  // get api for staff
  getStaffDetail = async () => {
    await this.props.getStaffPlus(`${this.props.match.params.id}/`);
    await this.props.getWorkSchedule(`${this.props.match.params.id}`);
    this.setDataFromStore();
  };

  // set dropdown data from response
  mapJobList = async () => {
    let { jobtitleList } = this.props;
    let { jobOption } = this.state;
    for (let key of jobtitleList) {
      jobOption.push({ label: key.level_desc, value: key.id });
    }

    this.updateState({
      jobOption,
    });
  };

  // set data to formfield from response while edit
  setDataFromStore = () => {
    let { staffPlusDetail, staffPlusWorkScheduleDetails } = this.props;
    console.log(staffPlusDetail, "staffplusdetaildata");
    let { formFields, locationOption } = this.state;
    formFields["emp_name"] = staffPlusDetail.emp_name;
    formFields["display_name"] = staffPlusDetail.display_name;
    formFields["emp_joindate"] = new Date(staffPlusDetail.emp_joindate);
    formFields["Site_Codeid"] = staffPlusDetail.Site_Codeid;
    formFields["EMP_TYPEid"] = staffPlusDetail.EMP_TYPEid;
    formFields["emp_pic"] = staffPlusDetail.emp_pic;
    formFields["emp_nric"] = staffPlusDetail.emp_nric;
    formFields["is_login"] = staffPlusDetail.is_login;
    formFields["emp_isactive"] = staffPlusDetail.emp_isactive;
    formFields["max_disc"] = staffPlusDetail.max_disc;
    formFields["LEVEL_ItmIDid"] = staffPlusDetail.LEVEL_ItmIDid;
    formFields["show_in_sales"] = staffPlusDetail.show_in_sales;
    formFields["show_in_appt"] = staffPlusDetail.show_in_appt;
    formFields["show_in_trmt"] = staffPlusDetail.show_in_trmt;
    formFields["emp_address"] = staffPlusDetail.emp_address;
    formFields["emp_phone1"] = staffPlusDetail.emp_phone1;
    formFields.siteCodes = [];
    staffPlusDetail.site_list.forEach(e => {
      let val = locationOption.find(element => element.value == e.Site_Codeid);
      formFields.siteCodes.push(val);
    });
    if (staffPlusDetail.emp_dob) {
      formFields["emp_dob"] = new Date(staffPlusDetail.emp_dob);
    }
    if (staffPlusDetail.emp_salary) {
      formFields["emp_salary"] = staffPlusDetail.emp_salary;
    }
    if (staffPlusDetail.emp_epf) {
      formFields["emp_epf"] = staffPlusDetail.emp_epf;
    }
    if (staffPlusDetail.emp_epf_employee) {
      formFields["emp_epf_employee"] = staffPlusDetail.emp_epf_employee;
    }
    if (staffPlusDetail.emp_epf_employer) {
      formFields["emp_epf_employer"] = staffPlusDetail.emp_epf_employer;
    }
    if (
      staffPlusDetail.flghourly !== undefined ||
      staffPlusDetail.flghourly !== null
    ) {
      formFields["flghourly"] = staffPlusDetail.flghourly;
    }
    if (staffPlusDetail.emphoursalary) {
      formFields["emphoursalary"] = staffPlusDetail.emphoursalary;
    }
    formFields.work_schedule.monday = staffPlusWorkScheduleDetails.monday;
    formFields.work_schedule.tuesday = staffPlusWorkScheduleDetails.tuesday;
    formFields.work_schedule.wednesday = staffPlusWorkScheduleDetails.wednesday;
    formFields.work_schedule.thursday = staffPlusWorkScheduleDetails.thursday;
    formFields.work_schedule.friday = staffPlusWorkScheduleDetails.friday;
    formFields.work_schedule.saturday = staffPlusWorkScheduleDetails.saturday;
    formFields.work_schedule.sunday = staffPlusWorkScheduleDetails.sunday;

    this.updateState({ formFields });
    this.handleMonthlyFlagRender();
  };

  handleMonthlyFlagRender = () => {
    let { formFields, is_flghourly } = this.state;
    if (formFields.flghourly) {
      is_flghourly = "hourly";
    } else {
      is_flghourly = "monthly";
    }
    this.setState({
      is_flghourly,
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;

    await this.updateState({
      formFields,
    });
  };

  handleMultiSelect = (data = []) => {
    let { formFields } = this.state;
    formFields.siteCodes = data;
    console.log(data);
    this.updateState({ formFields });
  };

  handleDatePick = async (name, value) => {
    // dateFormat(new Date())
    let { formFields } = this.state;
    formFields[name] = value;
    // formFields[name] = value;
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

  // upload imag to formfield
  handleImageUpload = file => {
    let { formFields } = this.state;
    formFields["emp_pic"] = file;
    this.updateState({
      formFields,
    });
  };

  // remove image to formfield
  removepostImage = (e, name) => {
    let { staffImage } = this.state.formFields;
    let index = staffImage.indexOf(name);
    if (index === 0) {
      staffImage.shift();
    } else {
      staffImage.pop();
    }
    this.updateState({
      staffImage,
    });
  };

  // submit to create/update staff
  handleSubmit = async () => {
    console.log(this.state.formFields, "formfieldsResult");
    try {
      if (this.validator.allValid()) {
        this.updateState({ is_loading: true });
        let { formFields } = this.state;
        Object.keys(formFields).forEach(e => {
          if (typeof formFields[e] === "boolean")
            formFields[e] = formFields[e] ? "True" : "False";
        });
        const formData = new FormData();
        formData.append("emp_name", formFields.emp_name);
        formData.append("display_name", formFields.display_name);
        formData.append("pw_password", formFields.pw_password);
        formData.append("emp_joindate", dateFormat(formFields.emp_joindate));
        formData.append("Site_Codeid", formFields.Site_Codeid);
        formData.append("EMP_TYPEid", formFields.EMP_TYPEid);
        if (
          formFields.emp_pic != null &&
          typeof formFields.emp_pic === "object"
        )
          formData.append("emp_pic", formFields.emp_pic);
        formData.append("emp_nric", formFields.emp_nric);
        formData.append("is_login", formFields.is_login);
        formData.append("emp_isactive", formFields.emp_isactive);
        formData.append("max_disc", formFields.max_disc);
        formData.append("LEVEL_ItmIDid", formFields.LEVEL_ItmIDid);
        formData.append("show_in_sales", formFields.show_in_sales);
        formData.append("show_in_appt", formFields.show_in_appt);
        formData.append("show_in_trmt", formFields.show_in_trmt);
        formData.append(
          "site_list",
          formFields.siteCodes
            .map(e => e.value)
            .reduce((a, e) => (a === "" ? e : a + "," + e), "")
        );
        formData.append("emp_dob", dateFormat(formFields.emp_dob));
        formData.append("emp_salary", formFields.emp_salary);
        formData.append("emp_epf", formFields.emp_epf);
        formData.append("Emp_Epf_Employee", formFields.emp_epf_employee);
        formData.append("Emp_Epf_Employer", formFields.emp_epf_employer);
        if (formFields.flghourly) {
          formData.append("flghourly", true);
        } else {
          formData.append("flghourly", false);
        }

        formData.append("emphoursalary", formFields.emphoursalary);
        formData.append("emp_address", formFields.emp_address);
        formData.append("emp_phone1", formFields.emp_phone1);
        const scheduleData = new FormData();
        scheduleData.append("monday", formFields.work_schedule.monday);
        scheduleData.append("tuesday", formFields.work_schedule.tuesday);
        scheduleData.append("wednesday", formFields.work_schedule.wednesday);
        scheduleData.append("tuesday", formFields.work_schedule.tuesday);
        scheduleData.append("friday", formFields.work_schedule.friday);
        scheduleData.append("saturday", formFields.work_schedule.saturday);
        scheduleData.append("sunday", formFields.work_schedule.sunday);
        if (this.props.match.params.id) {
          var res = await this.props.updateStaffPlus(
            `${this.props.match.params.id}/`,
            formData
          );
          console.log(res);
          if (res.status === 200) {
            await this.props.updateWorkSchedule(
              this.props.match.params.id,
              scheduleData
            );
          }
          await this.getStaffDetail();
        } else {
          var res = await this.props.createStaffPlus(formData);
          console.log(res);
          if (res.status === 201) {
            var res2 = await this.props.updateWorkSchedule(
              res.data.id,
              scheduleData
            );
            if (res2.status === 200)
              this.props.history.push(
                `/admin/staffPlus/${res.data.id}/editStaff`
              );
          }
        }
      } else {
        this.validator.showMessages();
        console.log("missing fields found !");
      }
      this.updateState({ is_loading: false });
    } catch (e) {
      console.log(e);
      this.updateState({ is_loading: false });
    }
  };

  handleChangeBox = event => {
    let formFields = Object.assign({}, this.state.formFields);
    formFields[event.target.name] = event.target.checked;

    this.updateState({
      formFields,
    });
  };
  handleFlag = tab => {
    this.setState(prevState => ({
      [tab]: !prevState[tab],
    }));
  };
  handleRadioCheckbox = async type => {
    let { is_flghourly } = this.state;
    if (type !== is_flghourly) {
      await this.setState({
        is_flghourly: type,
      });
    }
    this.updateFlagMonthly();
  };
  updateFlagMonthly = async () => {
    let { is_flghourly, formFields } = this.state;

    if (this.state.is_flghourly == "hourly") {
      formFields["flghourly"] = true;
      formFields["emp_salary"] = "";
    } else {
      formFields["flghourly"] = false;
      formFields["emphoursalary"] = "";
    }
    await this.setState({
      formFields,
    });
  };
  render() {
    let {
      formFields,
      jobOption,
      locationOption,
      is_loading,
      levelList,
      scheduleOptions,
      isCompensation,
      isEPFKey,
    } = this.state;

    let {
      emp_name,
      emp_nric,
      display_name,
      is_login,
      EMP_TYPEid,
      emp_joindate,
      emp_pic,
      emp_isactive,
      pw_password,
      LEVEL_ItmIDid,
      show_in_sales,
      show_in_appt,
      show_in_trmt,
      Site_Codeid,
      max_disc,
      work_schedule,
      emp_dob,
      emp_salary,
      emp_epf,
      emp_epf_employee,
      emp_epf_employer,
      flghourly,
      emphoursalary,
      emp_address,
      emp_phone1,
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5 container create-staff">
        {/* <p className="list-heading pb-4"> {id ? "Edit" : "Add"} Staff</p> */}
        <div className="head-label-nav">
          <p className="category">{t("StaffPlus")}</p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} Staff`)}
          </p>
        </div>
        {is_loading ? (
          <div class="d-flex mt-5 align-items-center justify-content-center">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="staff-detail">
            <div className="form-group mb-4 pb-2">
              <div className="row">
                <div className="col-6">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Upload Staff Photo")}
                  </label>
                  <div className="col-md-12 p-0">
                    <DragFileUpload
                      className={`file-uploader size-lg ${
                        emp_pic ? "" : "no-img"
                      }`}
                      label="Upload Thumbnail"
                      handleFileUpload={this.handleImageUpload}
                    ></DragFileUpload>

                    {emp_pic ? (
                      <>
                        {typeof emp_pic == "string" ? (
                          <img src={emp_pic} alt="" width="50%" />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
                {this.props.match.params.id ? (
                  <div className="col-6">
                    <Link
                      to={
                        "/admin/staffplus/" +
                        this.props.match.params.id +
                        "/empinfo"
                      }
                    >
                      <NormalButton
                        label="Emp Info"
                        outline={true}
                        className="mr-2 col-12"
                      />
                    </Link>
                  </div>
                ) : null}
                <div className="col-12 pb-4 pt-4">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        onChange={this.handleChangeBox}
                        checked={emp_isactive}
                        name="emp_isactive"
                      />{" "}
                      {t("Active")}
                    </Label>
                  </FormGroup>
                </div>

                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Employee Name")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={emp_name}
                      name="emp_name"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    t("employee name"),
                    emp_name,
                    "required"
                  )}
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("NRIC/WP")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={emp_nric}
                      name="emp_nric"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Phone")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={emp_phone1}
                      name="emp_phone1"
                      onChange={this.handleChange}
                      type={`number`}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("User Name")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={display_name}
                      name="display_name"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    t("user name"),
                    display_name,
                    "required"
                  )}
                </div>
                <div className="col-md-12 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Address")}
                  </label>
                  <div className="input-group">
                    <NormalTextarea
                      placeholder="Enter here"
                      value={emp_address}
                      name="emp_address"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Employee Type")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      options={jobOption}
                      value={EMP_TYPEid}
                      name="EMP_TYPEid"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    t("employee type"),
                    EMP_TYPEid,
                    "required"
                  )}
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Discount Limit")}
                  </label>
                  <div className="input-group">
                    <NormalInput
                      type="number"
                      placeholder="Enter here"
                      value={max_disc}
                      name="max_disc"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    t("discount limit"),
                    max_disc,
                    "required"
                  )}
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Join Date")}
                  </label>
                  <div className="input-group">
                    <NormalDateTime
                      onChange={this.handleDatePick}
                      inputcol="p-0 inTime"
                      value={emp_joindate}
                      name="emp_joindate"
                      className="dob-pick"
                      showYearDropdown={true}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  {this.validator.message(
                    t("join date"),
                    emp_joindate,
                    "required"
                  )}
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Default List")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      options={locationOption}
                      value={Site_Codeid}
                      name="Site_Codeid"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("Site List")}
                  </label>
                  <div className="input-group">
                    <NormalMultiSelect
                      handleMultiSelect={this.handleMultiSelect}
                      options={locationOption}
                      value={formFields.siteCodes}
                      name="siteCodes"
                    />
                  </div>
                </div>
                <div className="col-6 mb-4"></div>
                <div className="col-12">
                  <div className="d-flex flex-wrap">
                    <div className="col-md-3 col-12 mb-4">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            onChange={this.handleChangeBox}
                            checked={is_login}
                            name="is_login"
                          />
                          {t("Security AC")}
                        </Label>
                      </FormGroup>
                    </div>
                    {is_login ? (
                      <>
                        <div className="col-md-4 col-12 mb-4">
                          <label className="text-left text-black common-label-text fs-17 pb-3">
                            {t("Password")}
                          </label>
                          <div className="input-group">
                            <NormalInput
                              placeholder="Enter here"
                              value={pw_password}
                              name="pw_password"
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-12 mb-4">
                          <label className="text-left text-black common-label-text fs-17 pb-3">
                            {t("Employee Level")}
                          </label>
                          <div className="input-group">
                            <NormalSelect
                              options={levelList}
                              value={LEVEL_ItmIDid}
                              name="LEVEL_ItmIDid"
                              onChange={this.handleChange}
                            />
                          </div>
                          {this.validator.message(
                            t("employee level"),
                            LEVEL_ItmIDid,
                            "required"
                          )}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pb-3">
                    {t("To Show At")}
                  </label>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        onChange={this.handleChangeBox}
                        checked={show_in_sales}
                        name="show_in_sales"
                      />
                      {t("Sales")}
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        onChange={this.handleChangeBox}
                        checked={show_in_trmt}
                        name="show_in_trmt"
                      />
                      {t("Treatment")}
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        onChange={this.handleChangeBox}
                        checked={show_in_appt}
                        name="show_in_appt"
                      />
                      {t("Appointment")}
                    </Label>
                  </FormGroup>
                </div>
              </div>

              <div className="form-group mb-4 pb-2">
                <div className="row">
                  <div className="col-12">
                    <label className="text-left text-black common-label-text fs-17 pb-3">
                      {t("Work Schedule")}
                    </label>
                    <ScheduleTable
                      data={work_schedule}
                      optionList={scheduleOptions}
                      onChange={data => {
                        let { formFields } = this.state;
                        formFields["work_schedule"] = data;
                        this.updateState({
                          formFields,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="col-md-12 col-12 Accord-header cursor-pointer border"
                onClick={() => this.handleFlag("isCompensation")}
              >
                <div className="d-flex">
                  <div className="h5 fw-500 col-10 col-md-10 text-left">
                    {t(`Employee Compensation Details`)}
                  </div>
                  <div className="h5 fw-500 col-2 col-md-2 text-right fs-18">
                    {isCompensation == false ? (
                      <AiOutlinePlus />
                    ) : (
                      <AiOutlineMinus />
                    )}
                  </div>
                </div>
              </div>
              {isCompensation && (
                <div className="d-flex flex-wrap">
                  <div className="col-md-6 col-12 my-2">
                    <label className="text-left text-black common-label-text fs-17 pb-3 pt-3">
                      {t("Birth Date")}
                    </label>
                    <div className="input-group">
                      <NormalDateTime
                        onChange={this.handleDatePick}
                        inputcol="p-0 inTime"
                        value={emp_dob}
                        name="emp_dob"
                        className="dob-pick"
                        showYearDropdown={true}
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12 my-2">
                    <div className="d-flex flex-wrap align-items-center justify-content-center mb-2">
                      <div className="col-md-5 col-12 text-left text-black common-label-text">
                        <NormalCheckbox
                          checked={
                            this.state.is_flghourly == "monthly" ? true : false
                          }
                          onChange={() => this.handleRadioCheckbox(`monthly`)}
                          className="fs-12 m-1"
                          name={`flghourly`}
                          icon={false}
                        />
                        <label>{t("Monthly Salary")}</label>
                      </div>
                      <div className="col-md-6 col-12 input-group">
                        <NormalInput
                          type="number"
                          placeholder=""
                          value={emp_salary}
                          name="emp_salary"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-center mb-2">
                      <div className="col-md-5 col-12 text-left text-black common-label-text">
                        <NormalCheckbox
                          checked={
                            this.state.is_flghourly == "hourly" ? true : false
                          }
                          onChange={() => this.handleRadioCheckbox(`hourly`)}
                          className="fs-12 m-1"
                          name={`flghourly`}
                          icon={false}
                        />

                        <label>{t("Hourly Salary")}</label>
                      </div>
                      <div className="col-md-6 col-12 input-group">
                        <NormalInput
                          placeholder=""
                          value={emphoursalary}
                          name="emphoursalary"
                          onChange={this.handleChange}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 border">
                    <div className="d-flex">
                      <div className="col-md-6 col-12 my-2">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {isEPFKey ? t("EPF No.") : t("CPF No.")}
                        </label>
                        <div className="input-group">
                          <NormalInput
                            placeholder=""
                            value={emp_epf}
                            name="emp_epf"
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 my-2">
                        <div className="d-flex flex-wrap align-items-center justify-content-center mb-2">
                          <div className="col-md-6 col-12 text-left text-black common-label-text">
                            {isEPFKey
                              ? t("Employee's EPF")
                              : t("Employee's CPF")}{" "}
                            (%)
                          </div>
                          <div className="col-md-6 input-group">
                            <NormalInput
                              type="number"
                              placeholder=""
                              value={emp_epf_employee}
                              name="emp_epf_employee"
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-wrap align-items-center justify-content-center">
                          <div className="col-md-6 col-12 text-left text-black common-label-text">
                            {isEPFKey
                              ? t("Employer's EPF")
                              : t("Employer's CPF")}{" "}
                            (%)
                          </div>
                          <div className="col-md-6 input-group">
                            <NormalInput
                              type="number"
                              placeholder=""
                              value={emp_epf_employer}
                              name="emp_epf_employer"
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-5 d-flex justify-content-center">
                <div className="col-md-3 col-lg-2">
                  <Link to="/admin/staffplus">
                    <NormalButton
                      label="Cancel"
                      resetbg={true}
                      className="mr-2 col-12"
                    />
                  </Link>
                </div>
                <div className="col-md-3 col-lg-2">
                  <NormalButton
                    onClick={() => this.handleSubmit()}
                    label="Save"
                    success={true}
                    className="mr-2 col-12"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  branchList: state.common.branchList,
  jobtitleList: state.common.jobtitleList,
  staffPlusDetail: state.staffPlus.staffPlusDetail,
  staffPlusWorkScheduleDetails: state.staffPlus.staffPlusWorkScheduleDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      createStaffPlus,
      getJobtitle,
      getStaffPlus,
      updateStaffPlus,
      getCommonApi,
      getWorkSchedule,
      updateWorkSchedule,
    },
    dispatch
  );
};

export const AddStaffPlus = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStaffClass)
);
