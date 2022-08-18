import React, { Component } from "react";
import {
  NormalButton,
  NormalModal,
  NormalSelect,
  NormalDate,
  NormalDateTime,
  NormalCheckbox,
  NormalInput,
  NormalTextarea,
} from "component/common";
import closeIcon from "assets/images/close.png";
import {
  getCustomer,
  getCommonApi,
  commonCreateApi,
  commonPatchApi,
} from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import { dateFormat } from "service/helperFunctions";
import SimpleReactValidator from "simple-react-validator";
import logicon from "assets/images/logicon.png";
import { AppointmentLog } from "../../CommonModal/Appointmentlog";
import { withTranslation } from "react-i18next";

export class BlockPopupClass extends Component {
  state = {
    selectedList: [],
    filterDate: new Date(),
    staffSortlist: [],
    formFields: {
      startDate: new Date(),
      endDate: new Date(),
      startTime: "",
      endTime: "",
      duration: "",
      reason: "",
      description: "",
      active: true,
      staffId: 0,
    },
    duration: [],
    selectAll: false,
    reasonList: [],
    Employeelist: [],
    appointmentId: 0,
    isAppointmentLogModal: false,
  };
  handleDialog = () => {
    this.setState({
      selectedList: [],
      Employeelist: [],
      formFields: {
        startDate: new Date(),
        endDate: new Date(),
        startTime: "",
        endTime: "",
        duration: "",
        reason: "",
        description: "",
      },
      appointmentId: 0,
    });
    this.props.handleBlockDialog();
  };
  componentWillMount() {
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
      validators: {
        date: {
          // name the rule
          message: "The :attribute must be grater than today.",
          rule: (val, params, validator) => {
            let date1 = new Date(dateFormat(new Date()));
            let date2 = new Date(dateFormat(val));
            return date1.getTime() <= date2.getTime();
          },
          required: true, // optional
        },
      },
    });
    this.setState({ filterDate: this.props.filterDate });

    let { duration } = this.state;
    this.props.getCommonApi(`treatment/Duration/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          duration.push({ value: value, label: value });
        }
        this.setState({ duration });
      }
    });
    this.props.getCommonApi("blockreason/").then(res => {
      let { reasonList } = this.state;
      let { status, data } = res;
      if (status === 200) {
        for (let value of data) {
          reasonList.push({ value: value.id, label: value.b_reason });
        }
        this.setState({ reasonList });
      }
    });
    if (this.props.appointmentId && this.props.appointmentId > 0) {
      this.getBlockedDetail(this.props.appointmentId);
      this.getStaffList();
    } else {
      this.getStaffList();
    }
  }

  getDateformat = inputdate => {
    let appt_Date = inputdate;
    let date = appt_Date.split("/");
    let finaldate = date[2] + "-" + date[1] + "-" + date[0];
    return finaldate;
  };

  getBlockedDetail = async data => {
    await this.setState({ appointmentId: data });
    let { appointmentId, formFields, selected } = this.state;
    this.props
      .getCommonApi(`appointmentblock/${appointmentId}/`)
      .then(async key => {
        let { status, data } = key;
        if (status === 200) {
          formFields["startDate"] = this.getDateformat(data.start_date);
          formFields["endDate"] = this.getDateformat(data.end_date);
          formFields["startTime"] = data.appt_fr_time;
          formFields["endTime"] = data.appt_to_time;
          formFields["duration"] = data.duration;
          formFields["reason"] = data.reason_id;
          formFields["description"] = data.appt_remark;
          formFields["staffId"] = data.emp_noid;
          await this.setState({ formFields });
        }
      });
  };
  getStaffList = async () => {
    await this.setState({ staffSortlist: [] });
    let { filterDate, staffSortlist, formFields } = this.state;
    this.props
      .getCommonApi(
        `appointmentsort/?date=${dateFormat(filterDate, "yyyy-mm-dd")}`
      )
      .then(async key => {
        let { status, data } = key;
        if (status === 200) {
          for (let value of data) {
            let selectedid = value.id;
            let selectedstaff = false;
            if (selectedid === formFields.staffId) {
              selectedstaff = true;
            } else {
              selectedstaff = false;
            }
            staffSortlist.push({
              value: value.id,
              label: value.display_name,
              emp_code: value.emp_code,
              selected: selectedstaff,
            });
          }
          await this.setState({ staffSortlist });
        }
      });
  };

  handleSelectAllCheckbox = async ({ target: { value, name } }) => {
    let { staffSortlist } = this.state;
    await this.setState({ selectAll: value });
    for (let item of staffSortlist) {
      item["selected"] = value;
      await this.setState({ ...this.state.staffSortlist, item });
    }
    await this.setState({ staffSortlist });
    if (value) {
      await this.setState({ selectedList: staffSortlist });
    } else {
      await this.setState({ selectedList: [] });
    }
  };
  handleActiveCheckbox = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;
    await this.setState({ formFields });
  };

  handleCheckbox = async ({ target: { value, name } }, item) => {
    let { selectedList, staffSortlist } = this.state;

    let stafflistCheckbox = staffSortlist.find(acc => acc.value === item.value);
    if (stafflistCheckbox) {
      stafflistCheckbox["selected"] = value;
      await this.setState({ ...this.state.staffSortlist, stafflistCheckbox });
    }

    let filterList = selectedList.find(account => account.value === item.value);
    if (filterList) {
      filterList["value"] = item.value;
      filterList["label"] = item.label;
      filterList["selected"] = value;
      if (value) {
        await this.setState({ ...this.state.selectedList, filterList });
      } else {
        await this.setState(data => ({
          selectedList: data.selectedList.filter(x => x.value != item.value),
        }));
      }
    } else {
      let data = {};
      data["value"] = item.value;
      data["label"] = item.label;
      data["selected"] = value;
      selectedList.push(data);
      await this.setState({ ...selectedList, selectedList });
    }

    if (this.state.selectedList.length == this.state.staffSortlist.length) {
      await this.setState({ selectAll: true });
    } else {
      await this.setState({ selectAll: false });
    }
  };
  timeToMins = time => {
    var b = time.split(":");
    return b[0] * 60 + +b[1];
  };

  // Convert minutes to a time in format hh:mm
  // Returned value is in range 00  to 24 hrs
  timeFromMins = mins => {
    function z(n) {
      return (n < 10 ? "0" : "") + n;
    }
    var h = ((mins / 60) | 0) % 24;
    var m = mins % 60;
    return z(h) + ":" + z(m);
  };

  getHoursFromDate = date => {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let hours = hour > 9 ? hour : "0" + hour;
    let minutes = minute > 9 ? minute : "0" + minute;
    return hours + ":" + minutes;
  };
  addTimes = (t0, t1) => {
    return this.timeFromMins(this.timeToMins(t0) + this.timeToMins(t1));
  };
  handleTimePick = async (name, value) => {
    let { formFields } = this.state;
    let time = this.getHoursFromDate(value);
    formFields["startTime"] = time;
    if (time) {
      formFields["endTime"] = time;
    }
    let duration = "0:0";
    if (formFields.duration !== "" && formFields.duration !== null) {
      duration = formFields.duration;
    }
    if (formFields.endTime !== "") {
      formFields["endTime"] = this.addTimes(time, duration);
    }
    await this.setState({
      formFields,
    });
  };

  handleDurationChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields["duration"] = value;
    if (formFields.endTime) {
      formFields["endTime"] = this.addTimes(formFields["startTime"], value);
    }
    await this.setState({
      formFields,
    });
  };

  handleSubmit = async () => {
    await this.setState({ Employeelist: [] });
    let { formFields, selectedList, Employeelist } = this.state;
    for (let item of selectedList) {
      let value = item.value;
      Employeelist.push(value);
    }
    this.setState({ Employeelist });
    if (this.validator.allValid()) {
      if (selectedList.length > 0) {
        let data = {
          start_date: dateFormat(new Date(formFields.startDate), "yyyy-mm-dd"),
          end_date: dateFormat(new Date(formFields.endDate), "yyyy-mm-dd"),
          appt_fr_time: formFields.startTime,
          appt_to_time: formFields.endTime,
          reason_id: formFields.reason,
          duration: formFields.duration,
          appt_remark: formFields.description,
          appt_isactive: formFields.active,
          emp_ids: Employeelist,
        };

        this.props
          .commonCreateApi(`appointmentblock/`, data)
          .then(async res => {
            if (res.status === 201) {
              this.handleDialog();
              this.props.handleChange();
            }
          });
      } else {
        Toast({ type: "error", message: "Please select Staff" });
      }
    } else {
      this.validator.showMessages();
    }
  };
  handleUpdate = async () => {
    await this.setState({ Employeelist: [] });
    let { formFields, Employeelist, appointmentId } = this.state;
    Employeelist.push(formFields.staffId);
    this.setState({ Employeelist });
    if (this.validator.allValid()) {
      let data = {
        start_date: dateFormat(new Date(formFields.startDate), "yyyy-mm-dd"),
        end_date: dateFormat(new Date(formFields.endDate), "yyyy-mm-dd"),
        appt_fr_time: formFields.startTime,
        appt_to_time: formFields.endTime,
        reason_id: formFields.reason,
        duration: formFields.duration,
        appt_remark: formFields.description,
        appt_isactive: formFields.active,
        emp_ids: Employeelist,
      };
      console.log(data, "Blockupdatedata");
      this.props
        .commonPatchApi(`appointmentblock/${appointmentId}/`, data)
        .then(async res => {
          if (res.status === 200) {
            this.handleDialog();
            this.props.handleChange();
          }
        });
    } else {
      this.validator.showMessages();
    }
  };
  handleChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;

    if (name === "startDate") {
      formFields["endDate"] = value;
    }

    if (name === "endDate") {
      let startdate = new Date(dateFormat(formFields.startDate));
      let enddate = new Date(dateFormat(value));
      if (enddate < startdate) {
        Toast({ type: "error", message: "Please enter valid date" });
        formFields["endDate"] = formFields.startDate;
      }
    }

    await this.setState({
      formFields,
    });
  };

  handleLogClick = () => {
    debugger;
    this.setState(prevState => ({
      isAppointmentLogModal: !prevState.isAppointmentLogModal,
    }));
  };

  render() {
    let { isOpenBlockModal, t } = this.props;
    let {
      staffSortlist,
      formFields,
      duration,
      selectAll,
      reasonList,
      appointmentId,
      isAppointmentLogModal,
    } = this.state;
    return (
      <NormalModal
        className={`select-category Block-popup`}
        style={{ minWidth: "55%" }}
        modal={isOpenBlockModal}
        handleModal={this.handleDialog}
      >
        <div className="d-flex justify-content-end">
          <img
            onClick={() => this.handleDialog()}
            className="close"
            src={closeIcon}
            alt=""
          />
        </div>

        <div className="d-flex px-3">
          <div className="d-flex justify-content-start col-9 h4">
            {t("Block")} {t("Schedule")}{" "}
          </div>
          {appointmentId && appointmentId > 0 ? (
            <div
              className="d-flex justify-content-end align-items-center bg-white col-3"
              onClick={this.handleLogClick}
            >
              <img src={logicon} alt="" width="35px" height="35px" />
            </div>
          ) : null}
        </div>

        <div className="d-flex flex-wrap justify-content-start p-3">
          <div className="col-md-6 col-12 mb-3">
            <label className="text-left text-black common-label-text ">
              {t("Start")} {t("Date")}{" "}
              <span className="error-message text-danger validNo fs-18">*</span>
            </label>
            <div className="input-group">
              {appointmentId && appointmentId > 0 ? (
                <NormalDate
                  className="customer-name status py-1 col-12"
                  value={new Date(formFields.startDate)}
                  name="startDate"
                  type="date"
                  onChange={this.handleChange}
                  minDate={new Date()}
                  showDisabledMonthNavigation
                  disabled
                />
              ) : (
                <NormalDate
                  className="customer-name status py-1 col-12"
                  value={new Date(formFields.startDate)}
                  name="startDate"
                  type="date"
                  onChange={this.handleChange}
                  minDate={new Date()}
                  showDisabledMonthNavigation
                />
              )}
            </div>
            {this.validator.message(
              "startDate",
              formFields.startDate,
              "required|date"
            )}
          </div>
          <div className="col-md-6 col-12 mb-3">
            <label className="text-left text-black common-label-text ">
              {t("End")} {t("Date")}{" "}
              <span className="error-message text-danger validNo fs-18">*</span>
            </label>
            <div className="">
              {appointmentId && appointmentId > 0 ? (
                <NormalDate
                  className="customer-name status py-1 col-12"
                  value={new Date(formFields.endDate)}
                  name="endDate"
                  type="date"
                  onChange={this.handleChange}
                  minDate={new Date()}
                  showDisabledMonthNavigation
                  disabled
                />
              ) : (
                <NormalDate
                  className="customer-name status py-1 col-12"
                  value={new Date(formFields.endDate)}
                  name="endDate"
                  type="date"
                  onChange={this.handleChange}
                  minDate={new Date()}
                  showDisabledMonthNavigation
                />
              )}
            </div>
            {this.validator.message(
              "endDate",
              formFields.endDate,
              "required|date"
            )}
          </div>
          <div className="col-md-6 col-12 mb-3">
            <div className="row">
              <div className="col-md-6 col-12">
                <label className="text-left text-black common-label-text ">
                  {t("Select")} {t("Time")}
                </label>
                <div className="input-group">
                  <NormalDateTime
                    onChange={this.handleTimePick}
                    label="newStartTime"
                    name="newStartTime"
                    timeOnly={true}
                    dateFormat="hh:mm aa"
                    showTime={true}
                    selected={true}
                  />
                </div>
              </div>
              <div className="col-md-6 col-12">
                {" "}
                <label className="text-left text-black common-label-text ">
                  {t("Start")} {t("Time")}
                  <span className="error-message text-danger validNo fs-18">
                    *
                  </span>
                </label>
                <div className="input-group">
                  <NormalInput
                    label="startTime"
                    name="startTime"
                    value={formFields.startTime}
                    className="customer-name status py-1 col-12"
                    disabled
                  />
                </div>
                {this.validator.message(
                  "startTime",
                  formFields.startTime,
                  "required"
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 mb-3">
            <div className="row">
              <div className="col-md-6 col-12">
                {" "}
                <label className="text-left text-black common-label-text ">
                  {t("Duration")}
                  <span className="error-message text-danger validNo fs-18">
                    *
                  </span>
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={duration}
                    value={formFields.duration}
                    name="duration"
                    onChange={e => this.handleDurationChange(e)}
                    className="customer-name status py-1 col-12"
                  />
                </div>
                {this.validator.message(
                  "duration",
                  formFields.duration,
                  "required"
                )}
              </div>
              <div className="col-md-6 col-12">
                {" "}
                <label className="text-left text-black common-label-text ">
                  {t("End")} {t("Time")}
                  <span className="error-message text-danger validNo fs-18">
                    *
                  </span>
                </label>
                <div className="input-group">
                  <NormalInput
                    label="endTime"
                    name="endTime"
                    value={formFields.endTime}
                    className="customer-name status py-1 col-12"
                    disabled
                  />
                </div>
                {this.validator.message(
                  "endTime",
                  formFields.endTime,
                  "required"
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 mb-3">
            <label className="text-left text-black common-label-text ">
              {t("Reason")}{" "}
              <span className="error-message text-danger validNo fs-18">*</span>
            </label>
            <div className="input-group">
              <NormalSelect
                options={reasonList}
                value={formFields.reason} //
                name="reason"
                onChange={this.handleChange}
                className="py-1"
              />
              {this.validator.message("reason", formFields.reason, "required")}
            </div>
          </div>
          <div className="col-md-6 col-12 mb-3">
            <label className="text-left text-black common-label-text ">
              {t("Description")}
            </label>
            <div className="input-group">
              <NormalTextarea
                value={formFields.description} //
                name="description"
                onChange={this.handleChange}
                className="customer-name status py-1 col-12"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center p-3 mb-0">
          <div className="col-12 mt-1 mb-2 mx-3">
            <div className="row table-header m-0 fw-500">
              <div className="col-3">
                {t("Select")} {t("All")}{" "}
                <span>
                  {" "}
                  {appointmentId && appointmentId > 0 ? (
                    <NormalCheckbox
                      onChange={e => this.handleSelectAllCheckbox(e)}
                      value={selectAll}
                      name="selectAll"
                      checked={selectAll}
                      disabled
                    />
                  ) : (
                    <NormalCheckbox
                      onChange={e => this.handleSelectAllCheckbox(e)}
                      value={selectAll}
                      name="selectAll"
                      checked={selectAll}
                    />
                  )}
                </span>
              </div>
              <div className="col-3">
                {t("Employee")} {t("Code")}
              </div>
              <div className="col-6">
                {t("Display")} {t("Name")}
              </div>
            </div>
            <div className="response-table w-100 fw-500 multiselectList-height">
              {staffSortlist && staffSortlist.length > 0 ? (
                staffSortlist.map((item, index) => {
                  return (
                    <div
                      className={`d-flex justify-content-start m-0 table-body w-100 p-1 border border-secondary staff-sort-list ${
                        item.selected ? "active" : ""
                      } `}
                      key={item.value}
                    >
                      <div className="col-3 text-center">
                        {appointmentId && appointmentId > 0 ? (
                          <NormalCheckbox
                            onChange={e => this.handleCheckbox(e, item)}
                            value={item.selected}
                            name="selected"
                            checked={item.selected}
                            disabled
                          />
                        ) : (
                          <NormalCheckbox
                            onChange={e => this.handleCheckbox(e, item)}
                            value={item.selected}
                            name="selected"
                            checked={item.selected}
                          />
                        )}
                      </div>
                      <div className="col-3">{item.emp_code}</div>
                      <div className="col-6">{item.label}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100"></div>
              )}
            </div>
            <div className="row">
              <div className="col-3">
                {t("Active")}
                <span>
                  {" "}
                  {appointmentId && appointmentId > 0 ? (
                    <NormalCheckbox
                      onChange={e => this.handleActiveCheckbox(e)}
                      value={formFields.active}
                      name="active"
                      checked={formFields.active}
                    />
                  ) : (
                    <NormalCheckbox
                      onChange={e => this.handleActiveCheckbox(e)}
                      value={formFields.active}
                      name="active"
                      checked={formFields.active}
                      disabled
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <div className="col-md-2 col-6">
            {appointmentId && appointmentId > 0 ? (
              <NormalButton
                buttonClass={"w-100  p-0"}
                mainbg={true}
                className="confirm"
                label={`Update`}
                outline={false}
                onClick={() => this.handleUpdate()}
              />
            ) : (
              <NormalButton
                buttonClass={"w-100  p-0"}
                mainbg={true}
                className="confirm"
                label={`Save`}
                outline={false}
                onClick={() => this.handleSubmit()}
              />
            )}
          </div>
          <div className="col-md-2 col-6">
            <NormalButton
              buttonClass={"w-100 p-0"}
              mainbg={true}
              className="confirm"
              label={`Cancel`}
              outline={false}
              onClick={() => this.handleDialog()}
            />
          </div>
        </div>
        {isAppointmentLogModal ? (
          <AppointmentLog
            isAppointmentLogModal={isAppointmentLogModal}
            handleLogClick={this.handleLogClick}
            appointmentId={appointmentId}
          />
        ) : null}
      </NormalModal>
    );
  }
}

const mapStateToProps = state => ({
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomer,
      getCommonApi,
      commonCreateApi,
      commonPatchApi,
    },
    dispatch
  );
};

export const BlockPopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(BlockPopupClass)
);
