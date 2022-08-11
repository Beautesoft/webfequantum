import React, { Component, PureComponent } from "react";
import "./devExpressScheduler/Styles.scss";
import Scheduler, { Resource, View } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import ResourceCell from "./devExpressScheduler/ResourceCell";
import fullscreenIcon from "assets/images/fullScreen.png";
import { InputSearch } from "../InputSearch";
import _ from "lodash";
import {
  NormalButton,
  NormalSelect,
  NormalInput,
  NormalModal,
} from "component/common";

import { StaffSorting } from "../../Admin/NewAppointment/NewListAppointment/modal/StaffSorting";
import { BlockPopup } from "../../Admin/NewAppointment/NewListAppointment/modal/BlockPopup";
import { PrintModal } from "../../Admin/NewAppointment/NewListAppointment/modal/PrintModal";
import { Toast } from "service/toast";
import html2canvas from "html2canvas";
import { dateFormat } from "service/helperFunctions";
import { getCommonApi, commonPatchApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TreatmentHistory } from "component/Admin/NewAppointment/NewListAppointment/modal/TreatmentHistory";
import { UpcomingAppointment } from "component/Admin/NewAppointment/NewListAppointment/modal/UpcomingAppointment";
import setting from "assets/images/settings.png";
import { AppointmentSettings } from "./devExpressScheduler/AppointmentSettings";
import closeIcon from "assets/images/close.png";
import { history } from "helpers";
import { withTranslation } from "react-i18next";
import moment from "moment";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import calander from "assets/images/app-icons/00.png";
import outstanding from "assets/images/app-icons/0.png";
import req_therapist from "assets/images/app-icons/1.png";
import treatmentbal from "assets/images/app-icons/2.png";
import birthday from "assets/images/app-icons/3.png";
import new_remark from "assets/images/app-icons/4.png";
import storecard from "assets/images/app-icons/5.png";
import walkin from "assets/images/app-icons/6.png";
import reschedule from "assets/images/app-icons/8.png";
import Button from "devextreme/ui/button";
import { SMSReply } from "pages";

const groups = ["id"];
const draggingGroupName = "appointmentsGroup";
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
const scrolling = { mode: "virtual" };
const mobileviews = [
  {
    type: "day",
    name: "day",
    groupOrientation: "Horizontally",
    intervalCount: 1,
    maxAppointmentsPerCell: 'unlimited',
  },
];
const views = [
  {
    type: "day",
    name: "day",
    maxAppointmentsPerCell: 'unlimited',
  },
  {
    type: "week",
    name: "week",    
    maxAppointmentsPerCell: "unlimited",
  },
  {
    type: "month",
    name: "month",    
    maxAppointmentsPerCell: "unlimited",
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

export class NewSchedulerModalClass extends PureComponent {
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
    isSMSReply: false,
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
     this.setState({
      appointmentId: 0,
    });
    let date = new Date(e.appointmentData.startDate);
    if (e.appointmentData.status === "Block") {
       this.setState({ appointmentId: e.appointmentData.appt_id });
      this.handleBlockDialog();
    } else {
      this.props.onEmptyClick(date, e.appointmentData);
       this.setState({
        customerId: e.appointmentData.cust_id,
        custName: e.appointmentData.cust_name,
        custPhone: e.appointmentData.cust_phone,
      });
    }
  };

  onAppointmentSingleClick = async e => {
    e.cancel = true;
    if (e.appointmentData.status !== "Block") {
       this.setState({
        customerId: e.appointmentData.cust_id,
        custName: e.appointmentData.cust_name,
        custPhone: e.appointmentData.cust_phone,
      });
    }
  };

  componentDidMount() {
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
  onContentReadyDouble(e) {
    console.log(e, "oncontentreadylog");
    const currentHour = new Date().getHours() - 1;
    e.component.scrollToTime(currentHour, 30, new Date());

    const SMSreplyButton = document.getElementById("schedulerSMSreplyButton");
    if (!SMSreplyButton) {
      let element = document.querySelectorAll(".dx-scheduler-navigator");
      const container = document.createElement("div");
      container.id = "schedulerSMSreplyButton";
      element[0].appendChild(container);

      new Button(container, {
        text: "SMS Reply",
        mainbgrev: true,
        onClick: () => history.push("/admin/newappointment/SMSReply"),
        className: "ml-5 mr-3",
      });
    }

    const schedulerConfirmButton = document.getElementById(
      "schedulerConfirmButton"
    );
    if (!schedulerConfirmButton) {
      let element = document.querySelectorAll(".dx-scheduler-navigator");
      const containerTwo = document.createElement("div");
      containerTwo.id = "schedulerConfirmButton";
      element[0].appendChild(containerTwo);
      new Button(containerTwo, {
        text: "Confirm Booking",
        onClick: () => history.push("/admin/newappointment/confirmbooking"),
        mainbgrev: true,
        style:"display:flex",
        className: "ml-5 mr-5",
      });
    }
  }

  onContentReadysms(e) {
    console.log(e, "oncontentreadylog");
    const currentHour = new Date().getHours() - 1;
    e.component.scrollToTime(currentHour, 30, new Date());

    const SMSreplyButton = document.getElementById("schedulerSMSreplyButton");
    if (!SMSreplyButton) {
      let element = document.querySelectorAll(".dx-scheduler-navigator");
      const container = document.createElement("div");
      container.id = "schedulerSMSreplyButton";
      element[0].appendChild(container);

      new Button(container, {
        text: "SMS Reply",
        mainbgrev: true,
        onClick: () => history.push("/admin/newappointment/SMSReply"),
        className: "ml-5 mr-3",
      });
    }
  }
  onContentReadyconfirmbook(e) {
    console.log(e, "oncontentreadylog");
    const currentHour = new Date().getHours() - 1;
    e.component.scrollToTime(currentHour, 30, new Date());

    const schedulerConfirmButton = document.getElementById(
      "schedulerConfirmButton"
    );
    if (!schedulerConfirmButton) {
      let element = document.querySelectorAll(".dx-scheduler-navigator");      
      const containerTwo = document.createElement("div");
      containerTwo.id = "schedulerConfirmButton";
      element[0].appendChild(containerTwo);
      new Button(containerTwo, {
        text: "Confirm Booking",
        onClick: () => history.push("/admin/newappointment/confirmbooking"),
        mainbgrev: true,
        style:"display:flex",
        className: "ml-5 mr-5",
      });
    }
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
     this.setState(prevState => ({
      isOpenBlockModal: !prevState.isOpenBlockModal,
    }));
     this.setState({ appointmentId: 0 });
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
    //await sleep(2000); //
    //window.scrollTo(0, 0);
    let img = "";
    let base64URL = "";

    html2canvas(document.querySelector(".dx-scheduler-work-space-grouped"), {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 1,
      removeContainer: false,
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
    //window.scrollTo(0, document.documentElement.scrollHeight);
     this.setState({
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
    if (
      String(e.itemData.status).toUpperCase() === "BLOCK" ||
      String(e.itemData.status).toUpperCase() === "CANCELLED" ||
      String(e.itemData.status).toUpperCase() === "WAITING"
    ) {
      debugger;
      e.cancel = true;
      Toast({
        type: "error",
        message: "Appointment not allowed for dragging",
      });
      return false;
    } else if (e.itemData.link_flag) {
      debugger;
      e.cancel = true;
      Toast({
        type: "error",
        message: "Appointment not allowed for dragging",
      });
      return false;
    }
  };

  onDragEnd = async e => {
    //await sleep(500);
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
                this.setState({ formFields, isDragConfirmation });
              } else {
                isDragConfirmation = false;
                this.setState({ formFields, isDragConfirmation });
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
    this.setState({ custName, visible });
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
    this.setState({
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
  handleFullScreenClose = () => {
    history.push("/admin/newappointment");
    this.setState({ SchedulerHeight: "65%" });
  };
  handleFullScreenOpen = () => {
    history.push("/admin/newappointmentfullscreen");
    this.setState({ SchedulerHeight: "100%" });
  };

  handleInputChange = async event => {
    this.setState({
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
         this.setState({
          isDragConfirmation: false,
        });
         //this.props.getAppointmentWithStaff();
      });
  };

  handleSMSReply = async () => {
    await this.setState(prevState => ({
      isSMSReply: !prevState.isSMSReply,
    }));
  };

  onAppointmentUpdated = async e => {
    let selecteddata = e;
    if (selecteddata.newData) {
      if (
        String(selecteddata.newData.status).toUpperCase() === "BLOCK" ||
        String(selecteddata.newData.status).toUpperCase() === "CANCELLED" ||
        String(selecteddata.newData.status).toUpperCase() === "WAITING"
      ) {
        e.cancel = true;
        Toast({
          type: "error",
          message: "Not allowed",
        });
        this.props.getAppointmentWithStaff();
        return false;
      } else if (selecteddata.newData.link_flag) {
        e.cancel = true;
        Toast({
          type: "error",
          message: "Not allowed",
        });
        this.props.getAppointmentWithStaff();
        return false;
      } else {
        console.log(selecteddata, "onResizeEnd");
        this.onResizeEnd(selecteddata);
      }
    }
  };

  onResizeEnd = async e => {
    
    if (e.newData.appt_id) {
      let { formFields, isDragConfirmation } = this.state;
      let startTime = this.getHoursFromDate(e.newData.startDate);
      let endTime = this.getHoursFromDate(e.newData.endDate);
      let targetStaff = e.newData.id;
      this.props
        .getCommonApi(`appointmentresources/${e.newData.appt_id}/`)
        .then(async key => {
          let { status, data } = key;
          console.log(key, "resize data response");
          let appt_Date = data.appt_date;
          let date = appt_Date.split("/");
          let finaldate = date[2] + "-" + date[1] + "-" + date[0];
          if (status === 200) {
            formFields["appt_id"] = e.newData.appt_id;
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
            formFields["emp_no"] = data.targetStaff;
            formFields["add_duration"] = null;
            formFields["edit_remark"] = "";
            formFields["requesttherapist"] = data.requesttherapist;
            formFields["recur_days"] = data.recur_days;
            formFields["recur_qty"] = data.recur_qty;
            formFields["item_text"] = data.item_name;

            if (
              formFields["start_time"] !== startTime ||
              formFields["end_time"] !== endTime ||
              formFields["emp_no"] !== targetStaff
            ) {
              formFields["appointmentDate"] = e.newData.endDate;
              formFields["start_time"] = startTime;
              formFields["add_duration"] = null;
              formFields["end_time"] = endTime;
              formFields["emp_no"] = targetStaff;
              formFields["item_text"] = e.newData.item_name;
              formFields["recur_days"] = null;
              formFields["recur_qty"] = null;

              if (data.is_dragappt) {
                isDragConfirmation = true;
                this.setState({ formFields, isDragConfirmation });
              } else {
                isDragConfirmation = false;
                this.setState({ formFields, isDragConfirmation });
                this.handleDragandDropLogin();
              }
            }
          }
        });
    }
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
      isSMSReply,
    } = this.state;
    let { filterDate, tokenDetail, t } = this.props;

    let AppointmentcellContent = model => {
      const { appointmentData } = model.data;
      let fromTime = getTime(appointmentData.startDate);
      let toTime = getTime(appointmentData.endDate);
      let borderStyle = "1px solid" + appointmentData.border_color;
      return (
        <div
          className={`p-0`}
          style={{height: "inherit",
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
                      <span className="tooltiptext-img">
                        <p>{appointmentData.remark_val}</p>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {appointmentData.permanent_remark != "" ? (
                  <div className="pt-1">
                    <span className="tooltip-img">
                      <img src={new_remark} />
                      <span className="tooltiptext-img">
                        <p>{appointmentData.permanent_remark}</p>
                      </span>
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
      // <div style={{ width: "100%", height: "100%" }}>
      <React.Fragment>
        {isOpenModal ? (
          <StaffSorting
            isOpenModal={isOpenModal}
            handleDialog={this.handleDialog}
            handleChange={this.handleChange}
            filterDate={filterDate}
          />
        ) : (
          ""
        )}
        {isOpenBlockModal ? (
          <BlockPopup
            isOpenBlockModal={isOpenBlockModal}
            handleBlockDialog={this.handleBlockDialog}
            handleChange={this.handleChange}
            filterDate={filterDate}
            appointmentId={appointmentId}
          />
        ) : (
          ""
        )}
        {isOpenPrintModal ? (
          <PrintModal
            isOpenPrintModal={isOpenPrintModal}
            handlePrintDialog={this.handlePrintDialog}
          />
        ) : (
          ""
        )}
        <div className="d-flex flex-wrap justify-content-center m-1 p-1">
          {this.props.meta ? (
            <div className={`col-md-1 col-12 align-items-center`}>
              {this.props.meta.pagination &&
              this.props.meta.pagination.total_pages > 1 ? (
                <div className="d-flex">
                  <div className="row">
                    {this.props.meta.pagination.total_pages <
                      this.props.meta.pagination.current_page ||
                    this.props.meta.pagination.current_page > 1 ||
                    this.props.meta.pagination.total_pages ==
                      this.props.meta.pagination.current_page ? (
                      <button
                        className="cursor-pointer dx-button-content disabled mr-3"
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
                            stroke="#888888"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      ""
                    )}
                    {/* <span className="dx-button-staff-content"> Staff </span> */}
                    {this.props.meta.pagination.total_pages >
                      this.props.meta.pagination.current_page &&
                    this.props.meta.pagination.total_pages !==
                      this.props.meta.pagination.current_page &&
                    this.props.meta.pagination.current_page > 0 ? (
                      <button
                        className="cursor-pointer dx-button-content"
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
                            stroke="#888888"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className={`ml-1 pt-0 ${isMobile ? "col-3" : "d-none"}`}>
                    <img
                      style={{ width: 30 }}
                      onClick={
                        window.location.pathname ==
                        "/admin/newappointmentfullscreen"
                          ? this.handleFullScreenClose
                          : this.handleFullScreenOpen
                      }
                      className="close cursor-pointer tooltip-img ml-1"
                      src={fullscreenIcon}
                      alt=""
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title={
                        window.location.pathname ==
                        "/admin/newappointmentfullscreen"
                          ? "Exit Fullscreen Mode"
                          : "Fullscreen Mode"
                      }
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}

          {!isMobile ? (
            <div className="col-md-1 py-2 py-lg-0">
              <NormalButton
                buttonClass={"p-0 mr-1"}
                mainbg={true}
                className="fs-15 submit-btn"
                label={`Today`}
                outline={false}
                onClick={() => {
                  this.handleDateChange(new Date());
                }}
              />
            </div>
          ) : (
            ""
          )}
          {!isMobile ? (
            <>
              <div className="col-md-3 col-12">
                <div className="d-flex flex-nowrap py-2 py-lg-0">
                  <NormalInput
                    className="col-md-5 col-4 mr-1"
                    placeholder="customer.."
                    value={this.state.custName}
                    name="custName"
                    onChange={this.handleSearchCustomer}
                    onClick={this.handleClick}
                  />

                  <NormalButton
                    buttonClass={"mr-1 col-4"}
                    mainbg={true}
                    className="col-12 fs-15 m-0 p-0"
                    label="Upcoming"
                    onClick={this.handleUpcomingAppointment}
                  />
                  <NormalButton
                    buttonClass={"mr-1 col-4"}
                    mainbg={true}
                    className="col-12 fs-15"
                    label="History"
                    onClick={this.handleTreatmentHistory}
                  />
                </div>
              </div>
              <div className="col-md-2 col-sm-2 col-12 w-100 py-2 py-lg-0">
                <NormalInput
                  name="selecteddate"
                  value={
                    dayName[this.state.day] +
                    " " +
                    moment(selectedDate).format("DD/MM/YYYY")
                  }
                  disabled={true}
                />
              </div>
            </>
          ) : (
            ""
          )}
          {isMobile ? (
            <div className="col-md-2 col-sm-2 col-12 w-100 py-2 py-lg-0">
              <NormalInput
                name="selecteddate"
                value={
                  dayName[this.state.day] +
                  " " +
                  moment(selectedDate).format("DD/MM/YYYY")
                }
                disabled={true}
              />
            </div>
          ) : (
            ""
          )}

          {!isMobile ? (
            <div className="col-md-5 col-12 py-2 py-lg-0">
              <div className="d-flex py-2 py-lg-0">
                <NormalButton
                  buttonClass={"p-0 mr-1"}
                  mainbg={true}
                  className="confirm mr-1"
                  label={t("Snap")}
                  outline={false}
                  onClick={this.Snap}
                />
                <NormalButton
                  buttonClass={"p-0 mr-1"}
                  mainbg={true}
                  className=" confirm mr-1"
                  label={`Print`}
                  outline={false}
                  onClick={() => {
                    this.setState({ isOpenPrintModal: true });
                  }}
                />
                <NormalButton
                  buttonClass={"p-0 mr-1"}
                  mainbg={true}
                  className="confirm mr-1"
                  label={`Sort`}
                  outline={false}
                  onClick={() => {
                    this.setState({ isOpenModal: true });
                  }}
                />
                <NormalButton
                  buttonClass={"p-0 mr-1"}
                  mainbg={true}
                  className="fs-15 confirm"
                  label={`Block`}
                  outline={false}
                  onClick={() => {
                    this.setState({ isOpenBlockModal: true });
                  }}
                />
                <div className="col-md-4 col-12 py-2 py-lg-0">
                  <InputSearch
                    placeholder="Search here.."
                    value={this.state.searchtext}
                    onChange={this.handleSearch}
                    name="searchtext"
                  />
                </div>
                {String(tokenDetail.role_code).toUpperCase() === "1" ? (
                  <img
                    onClick={this.handleSettingClick}
                    className="close cursor-pointer"
                    src={setting}
                    alt=""
                    width="30"
                    height="30"
                  />
                ) : null}

                {this.props.settingData.smsreply ? (
                  <div className="ml-1 p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="grey"
                      class="bi bi-chat-square-dots-fill"
                      viewBox="0 0 16 16"
                      onClick={this.handleSMSReply}
                    >
                      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                  </div>
                ) : null}
                <div className="ml-1 pt-1">
                  <img
                    style={{ width: 25 }}
                    onClick={
                      window.location.pathname ==
                      "/admin/newappointmentfullscreen"
                        ? this.handleFullScreenClose
                        : this.handleFullScreenOpen
                    }
                    className="close cursor-pointer tooltip-img ml-1"
                    src={fullscreenIcon}
                    alt=""
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={
                      window.location.pathname ==
                      "/admin/newappointmentfullscreen"
                        ? "Exit Fullscreen Mode"
                        : "Fullscreen Mode"
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <NormalModal
            className={"transaction-done-modal top-up-modal"}
            style={{ minWidth: "55%" }}
            modal={isSettingsClick}
            handleModal={this.handleSettingDialog}
          >
            <img
              onClick={this.handleSettingDialog}
              className="close cursor-pointer"
              src={closeIcon}
              alt=""
            />
            <AppointmentSettings
              handleModal={this.handleSettingDialog}
              handleSettingChange={this.props.handleAppointmentSetting}
            />
          </NormalModal>
        </div>
        {isTreatmentHistoryModal ? (
          <TreatmentHistory
            isTreatmentHistoryModal={isTreatmentHistoryModal}
            handleTreatmentHistory={this.handleTreatmentHistory}
            customerNumber={this.state.customerNumber}
            custName={this.state.custName}
            custPhone={this.state.custPhone}
          />
        ) : (
          ""
        )}
        {isUpcomingAppointmentModal ? (
          <UpcomingAppointment
            isUpcomingAppointmentModal={isUpcomingAppointmentModal}
            handleUpcomingAppointment={this.handleUpcomingAppointment}
            customerNumber={this.state.customerNumber}
            custName={this.state.custName}
            custPhone={this.state.custPhone}
          />
        ) : (
          ""
        )}
        {visible ? (
          <div className="AppointmentnewStaffList">
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

        <div className={`col-md-12 mb-5 ${isSMSReply ? "" : "d-none"}`}>
          <SMSReply />
        </div>
        <div class="dx-viewport demo-container">
          <Scheduler
            id="Scheduler"
            className="col-12 m-0 p-0 Scheduler"
            height={SchedulerHeight}
            dataSource={this.props.staffList.length > 0 ? this.props.event : []}
            // views={this.props.staffList.length > 0 ? views : Dayview}
            views={isMobile ? mobileviews : views}
            onContentReady={
              this.props.settingData.confirmbook
                ? this.onContentReadyconfirmbook
                : this.onContentReady
            }
            // onContentReady={
            //   this.props.settingData.smsreply &&
            //   !this.props.settingData.confirmbook
            //     ? this.onContentReadysms
            //     : this.props.settingData.confirmbook &&
            //       !this.props.settingData.smsreply
            //     ? this.onContentReadyconfirmbook
            //     : this.props.settingData.confirmbook &&
            //       this.props.settingData.smsreply
            //     ? this.onContentReadyDouble
            //     : this.onContentReady
            // }
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
            crossScrollingEnabled={false}
            resourceCellComponent={ResourceCell}
            editing={{
              allowDeleting: false,
              allowResizing: true,
              allowUpdating: true,
              allowDragging: true,
              allowTaint: true,
            }}
            onAppointmentClick={e => {
              e.cancel = true;
            }}
            onAppointmentDblClick={e => this.onAppointmentDblClick(e)}
            onCellClick={e =>this.onEmptyClick(e)}
            //dateSerializationFormat="yyyy-MM-ddTHH:mm:ssZ"
            appointmentComponent={AppointmentcellContent}
            onCurrentViewChange={this.handleViewChange}
            onCurrentDateChange={this.handleDateChange}
            appointmentDragging={{
              autoScroll: true,
              scrollSpeed: 25,
              group: { draggingGroupName },
              //onDragStart: e => this.onDragStart(e),
              //onDragEnd: e => this.onDragEnd(e),
            }}
            onAppointmentUpdating={e => this.onAppointmentUpdated(e)}
            scrolling={scrolling}
          >
            <View type="day" label={t("day")} />
            <View type="week" label="week" />
            <View type="month" label="month" />
            <Resource
              dataSource={this.props.staffList}
              fieldExpr="id"
              useColorAsDefault={true}
              allowMultiple={false}
            />
          </Scheduler>
        </div>
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
      getCommonApi,
      commonPatchApi,
    },
    dispatch
  );
};

export const NewSchedulerModal = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(NewSchedulerModalClass)
);
