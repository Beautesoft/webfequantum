import React, { Component, PureComponent } from "react";
import "../devExpressScheduler/Styles.scss";
import Scheduler, { Resource, View } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import ResourceCell from "../devExpressScheduler/ResourceCell";
import { logout } from "service/utilities";
import { Logout } from "redux/actions/auth";

import _ from "lodash";
import {
  NormalButton,
  NormalSelect,
  NormalInput,
  NormalModal,
} from "component/common";
import { Toast } from "service/toast";
import html2canvas from "html2canvas";
import { dateFormat } from "service/helperFunctions";
import { getCommonApi, commonPatchApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import setting from "assets/images/settings.png";
import closeIcon from "assets/images/close.png";
import { history } from "helpers";
import { withTranslation } from "react-i18next";
import moment from "moment";
import calander from "assets/images/app-icons/00.png";
import outstanding from "assets/images/app-icons/0.png";
import req_therapist from "assets/images/app-icons/1.png";
import treatmentbal from "assets/images/app-icons/2.png";
import birthday from "assets/images/app-icons/3.png";
import new_remark from "assets/images/app-icons/4.png";
import storecard from "assets/images/app-icons/5.png";
import walkin from "assets/images/app-icons/6.png";
import reschedule from "assets/images/app-icons/8.png";
import { isMobile } from "react-device-detect";

import { Container, Button, Link } from "react-floating-action-button";

const groups = ["id"];
const draggingGroupName = "appointmentsGroup";
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
const scrolling = { mode: "virtual" };
const views = [
  {
    type: "day",
    name: "day",
    groupOrientation: "Horizontally",
    intervalCount: 1,
  },
];
const Dayview = [
  {
    type: "day",
    name: "day",
    groupOrientation: "Horizontally",
    intervalCount: 1,
  },
];

const getTime = date => {
  var now = new Date(date);
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var ap = "AM";
  if (hour > 11) {
    ap = "PM";
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  if (hour == 0) {
    hour = 12;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  var timeString = hour + ":" + minute + " " + ap;
  return timeString;
};

export class MobileSchedulerModalClass extends PureComponent {
  state = {
    selectedDate: new Date(),
    selectedView: "",
    DefaultDate: new Date(),
    DefaultView: "",
    searchtext: "",
    SelectedList: [],
    isOpenModal: false,
    isOpenBlockModal: false,
    appointmentId: 0,
    SchedulerHeight: "100%",
    isOpenPrintModal: false,
    formFields: [],
    groupByList: [
      { label: "Group by Staff", value: "staff" },
      { label: "Group by Department", value: "department" },
      { label: "Group by Room", value: "room" },
    ],
    groupBy: "staff",
    customerNumber: 0,
    customerId: 0,
    clickCount: 0,
    visible: false,
    customerOption: [],
    isSettingsClick: false,
    dayName: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    day: new Date().getDay(),
    passwordVisible: false,
    dragusername: "",
    dragpassword: "",
    isDragConfirmation: false,
    screenOrientation: "portrait",
  };

  onEmptyClick = e => {
    e.cancel = true;
    let date = new Date(e.cellData.startDate);
    if (e.cellData.groups) {
      this.props.onEmptyClick(date, e.cellData);
    }
  };

  onAppointmentDblClick = async e => {
    e.cancel = true;
    await this.setState({
      appointmentId: 0,
    });
    let date = new Date(e.appointmentData.startDate);
    if (e.appointmentData.status === "Block") {
      await this.setState({ appointmentId: e.appointmentData.appt_id });
      this.handleBlockDialog();
    } else {
      this.props.onEmptyClick(date, e.appointmentData);
      await this.setState({
        customerId: e.appointmentData.cust_id,
        custName: e.appointmentData.cust_name,
        custPhone: e.appointmentData.cust_phone,
      });
    }
  };

  onAppointmentSingleClick = async e => {
    e.cancel = true;
    if (e.appointmentData.status !== "Block") {
      await this.setState({
        customerId: e.appointmentData.cust_id,
        custName: e.appointmentData.cust_name,
        custPhone: e.appointmentData.cust_phone,
      });
    }
  };
  setScreenOrientation = () => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      console.log("orientation: portrait");
      this.setState({
        screenOrientation: "portrait",
      });
    }

    if (window.matchMedia("(orientation: landscape)").matches) {
      console.log("orientation: landscape");
      this.setState({
        screenOrientation: "landscape",
      });
    }
  };
  componentDidMount() {
    window.addEventListener("resize", this.setScreenOrientation);
    this.setState({
      DefaultDate: this.props.filterDate,
      DefaultView: this.props.filterType,
    });
  }

  handleViewChange = async e => {
    //if (this.props.staffList.length > 0) {
    await this.setState({
      selectedView: e,
    });
    this.handleChange();
    //}
  };

  handleDateChange = async e => {
    let { day } = this.state;
    if (this.state.selectedDate !== e) {
      await this.setState({
        selectedDate: e,
      });
      this.handleChange();
    }
    day = moment(this.state.selectedDate).day();
    this.setState({ day });
    console.log(day);
  };

  handleChange = () => {
    let { selectedDate, selectedView, DefaultDate, DefaultView, searchtext } =
      this.state;
    let newDate = new Date();
    let newMode = "";
    let prevMode = DefaultView;
    let prevDate = DefaultDate;
    if (selectedView) {
      newMode = selectedView;
    } else {
      newMode = DefaultView;
    }
    if (selectedDate) {
      newDate = selectedDate;
    } else {
      newDate = selectedDate;
    }
    this.props.handleChangeFilter(
      prevMode,
      prevDate,
      newMode,
      newDate,
      searchtext
    );
  };

  onContentReady(e) {
    console.log(e, "oncontentreadylog");
    const currentHour = new Date().getHours() - 1;
    e.component.scrollToTime(currentHour, 30, new Date());
  }

  handleSearch = async event => {
    event.persist();
    await this.setState({ searchtext: event.target.value });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        this.handleChange();
      }, 500);
    }
    this.debouncedFn();
  };
  handleDragConfirmationDialog = async () => {
    let { isDragConfirmation } = this.state;
    isDragConfirmation = !isDragConfirmation;
    await this.setState({
      isDragConfirmation,
    });
    await this.props.getAppointmentWithStaff();
  };
  handleDialog = () => {
    let { isOpenModal } = this.state;
    isOpenModal = !isOpenModal;
    this.setState({
      isOpenModal,
    });
  };
  handleSettingDialog = () => {
    let { isSettingsClick } = this.state;
    isSettingsClick = !isSettingsClick;
    this.setState({
      isSettingsClick,
    });
  };
  handleBlockDialog = async () => {
    await this.setState(prevState => ({
      isOpenBlockModal: !prevState.isOpenBlockModal,
    }));
    await this.setState({ appointmentId: 0 });
  };
  handlePrintDialog = () => {
    let { isOpenPrintModal } = this.state;
    isOpenPrintModal = !isOpenPrintModal;
    this.setState({
      isOpenPrintModal,
    });
  };

  handleBack = () => {
    this.props.handleBack();
  };
  handleNext = () => {
    this.props.handleNext();
  };
  Snap = async () => {
    // await this.setState({
    //   SchedulerHeight: "350%",
    // });
    await sleep(2000); //
    window.scrollTo(0, 0);
    let img = "";
    let base64URL = "";

    html2canvas(document.querySelector("#Scheduler"), {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 1,
      removeContainer: true,
    }).then(function (canvas) {
      img = canvas.toDataURL("image/png", 1);
      base64URL = img.replace("image/png", "image/octet-stream");
      var byteCharacters = atob(
        img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
      );
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: "image/png" + ";base64" });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement("a");
      a.setAttribute("download", "myImage.png");
      a.setAttribute("href", base64URL);
      a.click();
      window.open(fileURL);
    });
    window.scrollTo(0, document.documentElement.scrollHeight);
    await this.setState({
      SchedulerHeight: "100%",
    });
  };

  getHoursFromDate = date => {
    let hour = new Date(date).getHours();
    let minute = new Date(date).getMinutes();
    let hours = hour > 9 ? hour : "0" + hour;
    let minutes = minute > 9 ? minute : "0" + minute;
    return hours + ":" + minutes;
  };
  // onDragStart = async e => {
  //   if (e.itemData.status === "Block") {
  //     e.cancel = true;
  //   } else {
  //     await sleep(300);
  //     this.getDraggedData(e.itemData.appt_id);
  //   }
  // };
  onDragStart = async e => {
    console.log(e, "drag start data");
    if (e.itemData.status === "Block") {
      e.cancel = true;
    } else if (e.itemData.link_flag) {
      e.cancel = true;
      Toast({
        type: "error",
        message: "Linked appointment not allowed for dragging",
      });
    }
  };

  onDragEnd = async e => {
    await sleep(500);
    if (e.itemData.appt_id) {
      let { formFields, isDragConfirmation } = this.state;
      let startTime = this.getHoursFromDate(e.itemData.startDate);
      let endTime = this.getHoursFromDate(e.itemData.endDate);
      let targetStaff = e.itemData.id;
      this.props
        .getCommonApi(`appointmentresources/${e.itemData.appt_id}/`)
        .then(async key => {
          let { status, data } = key;
          console.log(key, "drag end data response");
          let appt_Date = data.appt_date;
          let date = appt_Date.split("/");
          let finaldate = date[2] + "-" + date[1] + "-" + date[0];
          if (status === 200) {
            formFields["appt_id"] = e.itemData.appt_id;
            formFields["custName"] = data.cust_name;
            formFields["appointmentDate"] = finaldate;
            formFields["bookingStatus"] = data.booking_status;
            formFields["new_remark"] = data.ori_remark;
            formFields["customerName"] = data.cust_id;
            formFields["Source_Codeid"] = data.source_id;
            formFields["Room_Codeid"] = data.room_id;
            formFields["sec_status"] = data.secondary_status;
            formFields["Appt_typeid"] = data.channel_id;

            formFields["start_time"] = data ? data.start_time : "";
            formFields["end_time"] = data ? data.end_time : "";
            formFields["Item_Codeid"] = data.Item_Codeid;
            formFields["Item_CodeName"] = data.item_name;
            formFields["emp_no"] = data.emp_id;
            formFields["add_duration"] = data.add_duration;
            formFields["edit_remark"] = "";
            formFields["requesttherapist"] = data.requesttherapist;
            formFields["recur_days"] = data.recur_days;
            formFields["recur_qty"] = data.recur_qty;
            formFields["item_text"] = data.item_name;

            if (
              formFields["start_time"] !== startTime ||
              formFields["emp_no"] !== targetStaff
            ) {
              formFields["appointmentDate"] = e.itemData.endDate;
              formFields["start_time"] = startTime;
              formFields["end_time"] = endTime;
              formFields["emp_no"] = targetStaff;
              formFields["item_text"] = e.itemData.item_name;
              formFields["recur_days"] = null;
              formFields["recur_qty"] = null;
              if (data.is_dragappt) {
                isDragConfirmation = true;
                await this.setState({ formFields, isDragConfirmation });
              } else {
                isDragConfirmation = false;
                await this.setState({ formFields, isDragConfirmation });
                this.handleDragandDropLogin();
              }
            }
          }
        });
    }
  };

  handleTreatmentHistory = () => {
    let { customerId } = this.state;
    if (customerId > 0) {
      this.setState(prevState => ({
        isTreatmentHistoryModal: !prevState.isTreatmentHistoryModal,
        customerNumber: this.state.customerId,
      }));
    } else {
      Toast({ type: "error", message: "Please select customer" });
    }
  };
  handleUpcomingAppointment = () => {
    let { customerId } = this.state;
    if (customerId > 0) {
      this.setState(prevState => ({
        isUpcomingAppointmentModal: !prevState.isUpcomingAppointmentModal,
        customerNumber: this.state.customerId,
      }));
    } else {
      Toast({ type: "error", message: "Please select customer" });
    }
  };
  handleSearchCustomer = async event => {
    //    event.persist();
    let { custName, visible } = this.state;
    custName = event.target.value;
    visible = true;
    await this.setState({ custName, visible });
    console.log(this.state.custName);
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        let { customerList } = this.state;
        let { basicApptDetail } = this.props;
        this.search(basicApptDetail);
      }, 500);
    }
    this.debouncedFn();
  };

  search = basicApptDetail => {
    let { custName } = this.state;
    this.props
      .getCommonApi(
        `custappt/?Outlet=${
          basicApptDetail.branchId ? basicApptDetail.branchId : ""
        }&search=${custName}`
      )
      .then(key => {
        // this.props.getCommonApi(`custappt/?search=${custName}`).then(key => {
        let { status, data } = key;
        if (status === 200) {
          this.setState({ customerOption: data });
        }
      });
  };
  handleClick = key => {
    if (!this.state.visible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    if (this.state.visible) {
      let { basicApptDetail } = this.props;
      this.search(basicApptDetail);
    }
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  };
  handleSettingClick = key => {
    this.setState(prevState => ({
      isSettingsClick: !prevState.isSettingsClick,
    }));
  };

  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };
  handleSelectCustomer = async data => {
    console.log(data, "selectCustomer");
    await this.setState({
      customerId: data.id,
      custName: data.cust_name,
      custPhone: data.cust_phone1,
    });
    this.handleClick();
  };
  handleGroupbyChange = async ({ target: { value, name } }) => {
    if (value == "") {
      value = "staff";
    }
    if (value !== this.state.groupBy) {
      this.setState({
        groupBy: value,
      });
      this.props.groupByAppointment(value);
    }
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

  handleDragandDropLogin = () => {
    let { formFields, dragusername, dragpassword } = this.state;
    let payload = {
      appt_date: dateFormat(new Date(formFields.appointmentDate), "yyyy-mm-dd"),
      Room_Codeid: formFields.Room_Codeid,
      appt_status: formFields.bookingStatus,
      sec_status: formFields.sec_status,
      edit_remark: "",
      start_time: formFields.start_time,
      end_time: formFields.end_time,
      item_id: formFields.Item_Codeid,
      add_duration: formFields.add_duration,
      emp_id: formFields.emp_no,
      requesttherapist: formFields.requesttherapist,
      item_text: formFields.item_text,
      recur_qty: null,
      recur_days: null,
      username: dragusername,
      password: dragpassword,
    };

    this.props
      .commonPatchApi(`appointmentresources/${formFields.appt_id}/`, payload)
      .then(async res => {
        await this.setState({
          isDragConfirmation: false,
        });
        await this.props.getAppointmentWithStaff();
      });
  };
  handleLogout = () => {
    this.props.Logout().then(res => {
      console.log(res, "fggfhfhtf");
      if (res.status === 200) {
        logout();
      }
    });
  };

  render() {
    let {
      isOpenModal,
      isOpenBlockModal,
      appointmentId,
      SchedulerHeight,
      isOpenPrintModal,
      groupBy,
      isTreatmentHistoryModal,
      isUpcomingAppointmentModal,
      customerNumber,
      visible,
      customerOption,
      selectedDate,
      isSettingsClick,
      dayName,
      passwordVisible,
      dragusername,
      dragpassword,
      isDragConfirmation,
      screenOrientation,
    } = this.state;
    let { filterDate, tokenDetail, t } = this.props;

    const GreaterthanComponent = () => {
      return (
        <Container>
          {this.props.meta ? (
            <div className="">
              {this.props.meta.pagination &&
              this.props.meta.pagination.total_pages > 1 ? (
                <div className="">
                  {this.props.meta.pagination.total_pages <
                    this.props.meta.pagination.current_page ||
                  this.props.meta.pagination.current_page > 1 ||
                  this.props.meta.pagination.total_pages ==
                    this.props.meta.pagination.current_page ? (
                    <Button
                      label={`Menu`}
                      tooltip="Prev"
                      styles={{
                        backgroundColor: "#3c4087",
                        color: "white",
                      }}
                      rotate={false}
                      onClick={this.handleBack}
                    >
                      <svg
                        width="9"
                        height="15"
                        viewBox="0 0 6 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 0.5L1 5L5 9.5"
                          stroke="#FFF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}

          {this.props.meta ? (
            <div className="">
              {this.props.meta.pagination &&
              this.props.meta.pagination.total_pages > 1 ? (
                <div className="">
                  {this.props.meta.pagination.total_pages >
                    this.props.meta.pagination.current_page &&
                  this.props.meta.pagination.total_pages !==
                    this.props.meta.pagination.current_page &&
                  this.props.meta.pagination.current_page > 0 ? (
                    <Button
                      label={`Menu`}
                      tooltip="Next"
                      styles={{
                        backgroundColor: "#3c4087",
                        color: "white",
                      }}
                      rotate={false}
                      onClick={this.handleNext}
                    >
                      <svg
                        width="9"
                        height="15"
                        viewBox="0 0 6 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.5 9.5L4.5 5L0.5 0.5"
                          stroke="#FFF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </Container>
      );
    };

    let AppointmentcellContent = model => {
      const { appointmentData } = model.data;
      let fromTime = getTime(appointmentData.startDate);
      let toTime = getTime(appointmentData.endDate);
      let borderStyle = "1px solid" + appointmentData.border_color;
      return (
        <div
          className={` ${
            isMobile && screenOrientation == "portrait"
              ? `display-mobbox${this.props.staffList.length}`
              : `display-pc${this.props.staffList.length}`
          } p-0`}
          style={{
            background: appointmentData.color,
            border: borderStyle,
          }}
        >
          {appointmentData.status && appointmentData.status === "Block" ? (
            <div className="d-flex">
              <div className="col-12 col-sm-12 col-md-12">
                <div className="app-detail">
                  <p>{appointmentData.reason}</p>
                  <p className="text-uppercase">
                    {appointmentData.text} ({fromTime}
                    {" - "}
                    {toTime})
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex">
              <div className="col p-0 ml-1">
                {appointmentData.link_flag ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <span>
                        <span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="7"
                              cy="8"
                              r="7"
                              fill="rgba(60, 64, 135, 0.31)"
                              stroke="#3C4087"
                            ></circle>
                            <text x="5" y="12" fill="#3C4087">
                              L
                            </text>
                          </svg>
                        </span>
                      </span>
                      <div className="tooltiptext-img text-left">
                        <p>{`Linked Appointment`}</p>
                      </div>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.inital ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={calander} />
                      <div className="tooltiptext-img text-left">
                        <p>
                          [{fromTime}
                          {" - "}
                          {toTime}]
                        </p>
                        <p>{appointmentData.cust_name}</p>
                        <p>{appointmentData.cust_phone}</p>
                        <p>{appointmentData.status}</p>
                      </div>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.sec_status_flag ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={reschedule} width="100%" />
                      <span className="tooltiptext-img">
                        <p>{`Reschedule`}</p>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.outstanding ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={outstanding} />
                      <span className="tooltiptext-img">
                        <p>{`Outstanding $${appointmentData.outstanding_amt}`}</p>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.req_therapist ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={req_therapist} />
                      <span className="tooltiptext-img">
                        <p>{`Request Therapist`}</p>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.balance ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={treatmentbal} />
                      <span className="tooltiptext-img">
                        <p>{`Have balance for Treatment or Product`}</p>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.birthday ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={birthday} />
                      <span className="tooltiptext-img">
                        <p>{`Birthday Month`}</p>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.remark ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={new_remark} />
                      {appointmentData.remark_val ? (
                        <span className="tooltiptext-img">
                          <p>{appointmentData.remark_val}</p>
                        </span>
                      ) : null}
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.permanent_remark != "" ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={new_remark} />
                      {appointmentData.permanent_remark ? (
                        <span className="tooltiptext-img">
                          <p>{appointmentData.permanent_remark}</p>
                        </span>
                      ) : null}
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.cust_StoreCard ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={storecard} />
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.walkin ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={walkin} />
                      <span className="tooltiptext-img">
                        <p>{`Walkin`}</p>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="app-detail col-11 col-sm-11 col-md-11 p-0 ml-2">
                <p>
                  {fromTime}
                  {" - "}
                  {toTime}
                </p>
                <p>{appointmentData.cust_name}</p>
                <p>{appointmentData.cust_refer}</p>
                <p>
                  {appointmentData.cust_code}&ensp;
                  {(appointmentData.gender &&
                    appointmentData.gender.toUpperCase().trim() == "M") ||
                  appointmentData.gender.toUpperCase().trim() == "MALE"
                    ? "M / "
                    : "/ "}
                  {appointmentData.age ? appointmentData.age : 0}
                </p>
                <p>
                  {appointmentData.cust_phone}&nbsp;
                  {appointmentData.cust_phone1 ? "/" : ""}
                  &nbsp;{appointmentData.cust_phone1}
                </p>
                <p>{appointmentData.sec_status}</p>
                <p>{appointmentData.room}</p>
                <p>{appointmentData.appt_remark}</p>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <React.Fragment>
        {screenOrientation ? (
          <Scheduler
            id="Scheduler"
            className="col-12 overflow-auto m-0 p-0"
            height={SchedulerHeight}
            dataSource={this.props.staffList.length > 0 ? this.props.event : []}
            // views={this.props.staffList.length > 0 ? views : Dayview}
            views={views}
            onContentReady={this.onContentReady}
            defaultCurrentView="day"
            currentDate={selectedDate}
            defaultCurrentDate={new Date()}
            groups={this.props.staffList.length > 0 ? groups : []}
            // startDayHour={8}
            // endDayHour={21}
            // cellDuration={15}
            startDayHour={
              this.props.SchedulerSetting.startday_hour
                ? this.props.SchedulerSetting.startday_hour
                : 8
            }
            endDayHour={
              this.props.SchedulerSetting.endday_hour
                ? this.props.SchedulerSetting.endday_hour
                : 21
            }
            cellDuration={
              this.props.SchedulerSetting.cell_duration
                ? this.props.SchedulerSetting.cell_duration
                : 15
            }
            firstDayOfWeek={0}
            showAllDayPanel={false}
            crossScrollingEnabled={true}
            resourceCellComponent={ResourceCell}
            editing={{
              allowDeleting: false,
              allowResizing: false,
              allowUpdating: true,
              allowDragging: false,
              allowTaint: true,
            }}
            onAppointmentClick={e => {
              e.cancel = true;
            }}
            onAppointmentDblClick={e => this.onAppointmentDblClick(e)}
            onCellClick={e => this.onEmptyClick(e)}
            //dateSerializationFormat="yyyy-MM-ddTHH:mm:ssZ"
            appointmentComponent={AppointmentcellContent}
            onCurrentViewChange={this.handleViewChange}
            onCurrentDateChange={this.handleDateChange}
            appointmentDragging={{
              autoScroll: true,
              scrollSpeed: 25,
              group: { draggingGroupName },
              onDragStart: e => this.onDragStart(e),
              onDragEnd: e => this.onDragEnd(e),
            }}
            scrolling={scrolling}
          >
            <Resource
              dataSource={this.props.staffList}
              fieldExpr="id"
              useColorAsDefault={true}
              allowMultiple={false}
            />
          </Scheduler>
        ) : null}

        {visible ? (
          <div className="AppointmentStaffList">
            <div className="customerSearch-block">
              <div className="d-flex mt-4 table table-header w-100 m-0 top-1">
                <div className="col-2">{t("Name")}</div>
                <div className="col-2">{t("Phone")}</div>
                <div className="col-2">{t("Customer Code")}</div>
                <div className="col-2">{t("Reference")}</div>
                <div className="col-3">{t("Email")}</div>
                <div className="col-1">{t("NRIC")}</div>
              </div>
              <div className="response-table w-100">
                {customerOption.length > 0 ? (
                  customerOption.map((item, index) => {
                    return (
                      <div
                        className="row m-0 table-body w-100 border"
                        onClick={() => this.handleSelectCustomer(item)}
                        key={index}
                      >
                        <div className="col-2">{item.cust_name}</div>
                        <div className="col-2">{item.cust_phone1}</div>
                        <div className="col-2">{item.cust_code}</div>
                        <div className="col-2">{item.cust_refer}</div>
                        <div className="col-3">{item.cust_email}</div>
                        <div className="col-1">{item.cust_nric}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center w-100">
                    {t("No Data are available")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        <NormalModal
          className={"d-flex justify-content-center"}
          style={{ minWidth: "20%" }}
          modal={isDragConfirmation}
          handleModal={this.handleDragConfirmationDialog}
        >
          <img
            onClick={this.handleDragConfirmationDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <div className="row">
            <div className="d-flex flex-wrap">
              <div className="col-12 mb-4">
                <p>{t("Please enter your login credential")} </p>
              </div>
              <div className="col-12 form-group mb-3 pb-2">
                <div className="input-group">
                  <NormalInput
                    placeholder="Username"
                    value={dragusername}
                    name="dragusername"
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
                    value={dragpassword}
                    name="dragpassword"
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
                  onClick={this.handleDragandDropLogin}
                  label="PROCEED"
                  className="col-12 submit-btn"
                />
              </div>
            </div>
          </div>
        </NormalModal>
        <NormalButton
          buttonClass={`col-12 pt-5`}
          label="logout"
          tooltip="logout"
          submitBtn={true}
          onClick={this.handleLogout}
        />
        <GreaterthanComponent />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  basicApptDetail: state.appointment.basicApptDetail,
  SchedulerSetting: state.appointment.SchedulerSetting,
  tokenDetail: state.authStore.tokenDetails,
});
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Logout,
      getCommonApi,
      commonPatchApi,
    },
    dispatch
  );
};

export const MobileSchedulerModal = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(MobileSchedulerModalClass)
);
