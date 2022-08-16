import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalInput,
  NormalSelect,
  InputSearch,
  NormalModal,
  TableWrapper,
  NormalMultiSelect,
} from "component/common";
import { Toast } from "service/toast";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { history } from "helpers";
import { connect } from "react-redux";
import Tree from "react-animated-tree";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
// import { Treatment, Payment, EditCart } from './cart/index';
import service from "assets/images/make-up-brush.png";
import { StaffList } from "../cart/StaffList";
import { withTranslation } from "react-i18next";
// import Discount from './cart/discount';

export class SelectStaffClass extends Component {
  state = {
    isOpen: false,
    currentIndex: -1,
    tstaffList: [],
    cartData: {},
    postFields: {
      work_point: "",
    },
    Room: null,
    Source: null,
    new_remark: null,
    updateFields: {
      Room_Codeid: "",
      Source_Codeid: "",
      new_remark: "",
    },
    outletList: [],
    headerDetails: [
      { label: "Employee name", sortKey: false, width: "130px" },
      { label: "Sessions", width: "30px", divClass: "justify-content-center" },
      { label: "WP1", width: "42px", divClass: "justify-content-center" },
      {
        label: "St. time",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-center",
      },
      {
        label: "End time",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Duration",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-center",
      },
    ],
    sessionTableHeader: [
      { label: "Sessions", width: "30px", divClass: "justify-content-center" },
      { label: "Employees", divClass: "justify-content-center" },
      { label: "" },
    ],
    sessionTableDetails: [],
    employeeOptions: [],
    customerOption: [],
    // cartData: {},
    roomList: [],
    sourceList: [],
    staffList: [],
    duration: [],
    startDuration: [],
    showPostError: false,
    showUpdateError: false,
    staffData: {},
    page: 1,
    limit: 7,
    meta: {},
    hideNotNeededControls: "false",
  };

  componentDidMount = () => {
    // this.getCart();
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
    // let { basicApptDetail } = this.props;
    // if (basicApptDetail.custId) {
    //     let { formFields } = this.state;
    //     formFields["custId"] = basicApptDetail.custId;
    //     formFields["custName"] = basicApptDetail.custName;
    //     this.setState({ formFields });
    // }
    let {
      roomList,
      sourceList,
      staffList,
      cartData,
      duration,
      startDuration,
      tstaffList,
    } = this.state;
    this.props.getCommonApi("room/").then(key => {
      let { status, data } = key;
      for (let value of data) {
        roomList.push({ value: value.id, label: value.displayname });
      }
      this.setState({ roomList });
    });
    this.props.getCommonApi(`source/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          sourceList.push({ value: value.id, label: value.source_desc });
        }
        this.setState({ sourceList });
      }
    });
    this.getStaffList();
    this.getCart();
    this.props.getCommonApi(`treatment/Duration/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          duration.push({ value: value, label: value });
        }
        this.setState({ duration });
      }
    });

    const startDurationLocal = [
      "08:00",
      "08:10",
      "08:20",
      "08:30",
      "08:40",
      "08:50",
      "09:00",
      "09:10",
      "09:20",
      "09:30",
      "09:40",
      "09:50",
      "10:00",
      "10:10",
      "10:20",
      "10:30",
      "10:40",
      "10:50",
      "11:00",
      "11:10",
      "11:20",
      "11:30",
      "11:40",
      "11:50",
      "12:00",
      "12:10",
      "12:20",
      "12:30",
      "12:40",
      "12:50",
      "13:00",
      "13:10",
      "13:20",
      "13:30",
      "13:40",
      "13:50",
      "14:00",
      "14:10",
      "14:20",
      "14:30",
      "14:40",
      "14:50",
      "15:00",
      "15:10",
      "15:20",
      "15:30",
      "15:40",
      "15:50",
      "16:00",
      "16:10",
      "16:20",
      "16:30",
      "16:40",
      "16:50",
      "17:00",
      "17:10",
      "17:20",
      "17:30",
      "17:40",
      "17:50",
      "18:00",
      "18:10",
      "18:20",
      "18:30",
      "18:40",
      "18:50",
      "19:00",
      "19:10",
      "19:20",
      "19:30",
      "19:40",
      "19:50",
      "20:00",
      "20:10",
      "20:20",
      "20:30",
      "20:40",
      "20:50",
      "21:00",
      "21:10",
      "21:20",
      "21:30",
      "21:40",
      "21:50",
      "22:00",
      "22:10",
      "22:20",
      "22:30",
      "22:40",
      "22:50",
      "23:00",
    ];
    //this.props.getCommonApi(`treatment/Duration/`).then((key) => {
    //let { status, data } = key;
    //if (status === 200) {
    for (let value of startDurationLocal) {
      startDuration.push({ value: value, label: value });
    }
    this.setState({ duration, startDuration });
    //}
    //})

    //this.setState({ duration:durationLocal })
  };

  getCart = () => {
    let {
      roomList,
      sourceList,
      staffList,
      cartData,
      duration,
      tstaffList,
      employeeOptions,
    } = this.state;
    let selectedItemTreatmentIds = this.props.id;
    let HightoLow = selectedItemTreatmentIds.sort((a, b) => b - a);
    console.log(HightoLow, "hightoLow");
    this.props
      .getCommonApi(`trmttmpitemhelper/?treatmentid=${HightoLow}`)
      .then(async key => {
        cartData = key;
        await this.setState({
          tstaffList: [],
          employeeOptions: [],
          sessionTableDetails: [],
        });
        tstaffList = key.data;
        employeeOptions = [];
        tstaffList.forEach(e => {
          employeeOptions.push({ label: e.helper_name, value: e.helper_id });
        });
        this.setState({ cartData, tstaffList, employeeOptions });
        this.getDataFromRes(key);
      });
  };

  getDataFromRes = async key => {
    let { postFields, updateFields } = this.state;
    postFields["work_point"] = key.value.work_point ? key.value.work_point : "";
    updateFields["Room_Codeid"] = key.value.room_id ? key.value.room_id : "";
    updateFields["Source_Codeid"] = key.value.source_id
      ? key.value.source_id
      : "";
    updateFields["new_remark"] = key.value.new_remark
      ? key.value.new_remark
      : "";
    await this.setState({
      postFields,
      updateFields,
    });
  };

  handleSubmit = id => {
    console.log(
      "this.state.updateFields.Source_Codeid",
      this.state.updateFields.Source_Codeid
    );
    /* if(this.state.updateFields.Room_Codeid=="")
        {
            alert("Room Must be selected");
            return
        }
        if(this.state.updateFields.Source_Codeid=="01")
        {
            alert("Source Must be selected");
            return
        }*/
    let { tstaffList, formFields, cartData, postFields } = this.state;
    let xTotalWp1Amount = 0;
    for (var i = 0; i < this.state.tstaffList.length; i++) {
      xTotalWp1Amount += parseFloat(this.state.tstaffList[i].wp1);
    }
    if (parseFloat(xTotalWp1Amount) == parseFloat(postFields.work_point)) {
    } else {
      Toast({
        type: "error",
        message: "User Entry should not greater or lesser than Work point",
      });
      return;
    }
    let selectedItemTreatmentIds = this.props.id;
    let HightoLow = selectedItemTreatmentIds.sort((a, b) => b - a);
    this.props
      .getCommonApi(`trmttmpitemhelper/confirm/?treatmentid=${HightoLow}`)
      .then(async key => {
        if (key.status === 200) {
          this.props.handleModal();
        }
      });
  };

  handleDialog = () => {};

  handleAddstaff = item => {
    let { tstaffList, formFields, cartData, postFields } = this.state;
    let data = {
      helper_id: item.id,
    };
    if (postFields.work_point && postFields.times) {
      this.props
        .commonCreateApi(
          `trmttmpitemhelper/?cartid=${this.props.cartId}&workcommpoints=${postFields.work_point}&times=${postFields.times}`,
          data
        )
        .then(() => {
          this.getCart();
        });
    } else {
      this.setState({ showPostError: true });
    }
  };

  handleuUpdateWp = async (event, item, index) => {
    // event.persist();
    let { postFields } = this.state;
    let workpoint = Number(postFields.work_point);
    let userEnteredValue = Number(event.target.value);
    if (userEnteredValue > workpoint) {
      return false;
    }

    let { tstaffList } = this.state;
    tstaffList[index][event.target.name] = event.target.value;
    await this.setState({
      tstaffList,
    });
    console.log(event, item, index, "sfdgfdgsgf too");
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async (event, item, index) => {
        console.log(event, item, index, "sfdgfdgsgf inside");
        this.handleUpdatestaff(event, item, index);
      }, 1000);
    }
    this.debouncedFn(event, item, index);
  };

  handleUpdateSession = async (event, item, index) => {
    // event.persist();
    let { postFields } = this.state;
    let sessionPoints = this.props.session;
    let userEnteredValue = parseFloat(event.target.value);
    if (userEnteredValue > sessionPoints) {
      return false;
    }
    let { tstaffList } = this.state;
    tstaffList[index][event.target.name] = event.target.value;
    await this.setState({
      tstaffList,
    });

    console.log(event, item, index, "sfdgfdgsgf too");
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async (event, item, index) => {
        console.log(event, item, index, "sfdgfdgsgf inside");
        this.handleUpdatestaff(event, item, index);
      }, 1000);
    }
    this.debouncedFn(event, item, index);
  };

  handleUpdatestaff = async (event, item, index) => {
    //this.state.updateFields.Source_Codeid="";
    let { tstaffList, cartData, updateFields } = this.state;
    let { Room_Codeid, Source_Codeid, new_remark } = updateFields;
    if (event.target.name !== "wp1" && event.target.name !== "session") {
      tstaffList[index][event.target.name] = event.target.value;
      this.setState({
        tstaffList,
      });
    }
    console.log(event, item, index, "sfdgfdgsgf");
    let data = {};
    if (event.target.name === "appt_fr_time") {
      data = {
        appt_fr_time: event.target.value,
        add_duration: cartData.value.add_duration,
        wp1: Number(item.wp1).toFixed(2),
      };
    }
    if (event.target.name === "add_duration") {
      data = {
        appt_fr_time: item.appt_fr_time,
        add_duration: event.target.value,
        wp1: Number(item.wp1).toFixed(2),
      };
    }
    if (event.target.name === "wp1") {
      data = {
        appt_fr_time: item.appt_fr_time,
        add_duration: cartData.value.add_duration,
        wp1: Number(item.wp1).toFixed(2),
      };
    }
    if (event.target.name === "session") {
      data = {
        appt_fr_time: item.appt_fr_time,
        add_duration: cartData.value.add_duration,
        wp1: Number(item.wp1).toFixed(2),
        session: Number(item.session).toFixed(2),
      };
    }

    // if (updateFields.Source && updateFields.Room) {
    this.props
      .commonPatchApi(
        `trmttmpitemhelper/${item.id}/?Room_Codeid=${Room_Codeid}&Source_Codeid=${Source_Codeid}&new_remark=${new_remark}`,
        data
      )
      .then(res => {
        if (res.status == 200) {
          console.log(res, "updatesessiononblur");
          this.getCart();
        }
      });
    // } else {
    //     this.setState({ showUpdateError: true })
    // }
  };
  handleClearLine = () => {
    let selectedItemTreatmentIds = this.props.id;
    let HightoLow = selectedItemTreatmentIds.sort((a, b) => b - a);
    this.props
      .commonDeleteApi(
        `trmttmpitemhelper/delete/?clear_all=0&treatmentid=${HightoLow}`
      )
      .then(() => {
        this.getCart();
      });
  };

  handleClearAll = () => {
    let selectedItemTreatmentIds = this.props.id;
    let HightoLow = selectedItemTreatmentIds.sort((a, b) => b - a);
    this.props
      .commonDeleteApi(
        `trmttmpitemhelper/delete/?clear_all=1&treatmentid=${HightoLow}`
      )
      .then(() => {
        this.getCart();
      });
  };

  getStaffList = data => {
    let { page, limit } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=0&page=${page}&limit=${limit}`)
      .then(async key => {
        let { status, data } = key;
        console.log(key, "sdfgsdfgsdfgdfg sdfgsdfgsdfg");
        let { staffList } = this.state;
        let { meta } = this.state;
        staffList = [];
        meta = {};
        staffList = data;
        meta = data.meta.pagination;
        console.log(meta, "metalist");
        this.setState({
          staffList,
          meta,
        });
      });
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStaffList();
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStaffList();
    }
  };

  handleSelect_Staff = async staff => {
    let { tstaffList, postFields, cartData, updateFields } = this.state;
    console.log("handleSelect_Staff-Source_Codeid", this.state.updateFields);
    let { Room_Codeid, Source_Codeid, new_remark } = updateFields;
    let { work_point } = postFields;
    console.log("workpoint", this.props.workPoint);
    let data = {
      helper_id: staff.id,
    };
    let selectedItemTreatmentIds = this.props.id;
    let HightoLow = selectedItemTreatmentIds.sort((a, b) => b - a);
    await this.props
      .commonCreateApi(
        `trmttmpitemhelper/?treatmentid=${HightoLow}&workcommpoints=${work_point}`,
        data
      )
      .then(key => {
        this.getCart1();
      });
  };
  getCart1 = () => {
    let {
      roomList,
      sourceList,
      staffList,
      cartData,
      duration,
      tstaffList,
      employeeOptions,
    } = this.state;
    let selectedItemTreatmentIds = this.props.id;
    let HightoLow = selectedItemTreatmentIds.sort((a, b) => b - a);
    this.props
      .getCommonApi(`trmttmpitemhelper/?treatmentid=${HightoLow}`)
      .then(async key => {
        cartData = key;
        await this.setState({
          tstaffList: [],
          employeeOptions: [],
          sessionTableDetails: [],
        });
        tstaffList = key.data;
        employeeOptions = [];
        tstaffList.forEach(e => {
          employeeOptions.push({ label: e.helper_name, value: e.helper_id });
        });
        this.setState({ cartData, tstaffList, employeeOptions }, () => {
          this.checkFirstArrayAndUpdateTiming();
        });
        this.getDataFromRes(key);
      });
  };
  checkFirstArrayAndUpdateTiming = () => {
    let { tstaffList, cartData, updateFields } = this.state;
    var item = tstaffList[0];
    let { Room_Codeid, Source_Codeid, new_remark } = updateFields;
    var today = new Date(),
      time = today.getHours() + ":" + today.getMinutes();
    let data = {};

    data = {
      appt_fr_time: this.roundTime(time, 10),
      add_duration: cartData.value.add_duration,
      wp1: item.wp1,
    };

    this.props
      .commonPatchApi(
        `trmttmpitemhelper/${item.id}/?Room_Codeid=${Room_Codeid}&Source_Codeid=${Source_Codeid}&new_remark=${new_remark}`,
        data
      )
      .then(() => {
        this.getCart();
      });
  };
  roundTime = (time, minutesToRound) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Convert hours and minutes to time in minutes
    time = hours * 60 + minutes;

    let rounded = Math.round(time / minutesToRound) * minutesToRound;
    let rHr = "" + Math.floor(rounded / 60);
    let rMin = "" + (rounded % 60);

    return rHr.padStart(2, "0") + ":" + rMin.padStart(2, "0");
  };
  handleUpdatChanges = async ({ target: { value, name } }) => {
    let { updateFields } = this.state;
    updateFields[name] = value;
    this.setState({
      updateFields,
    });
  };

  handlePostChanges = async ({ target: { value, name } }) => {
    let { postFields } = this.state;
    postFields[name] = value;
    this.setState({
      postFields,
    });
  };

  handleAddRow = () => {
    this.state.sessionTableDetails.push({ sessions: 0.0, values: [] });
    this.setState({});
  };

  handleRemoveRow = index => {
    let { sessionTableDetails } = this.state;
    if (index > -1) {
      sessionTableDetails.splice(index, 1);
    }
    this.setState({ sessionTableDetails });
  };

  handleSessionsChange = (e, index) => {
    let { sessionTableDetails } = this.state;
    sessionTableDetails[index].sessions = parseFloat(e.target.value);
    this.setState({ sessionTableDetails });
  };

  handleSessionEmpChange = (e, index) => {
    let { sessionTableDetails } = this.state;
    let values = [];
    e.forEach(e => {
      values.push(e.value);
    });
    sessionTableDetails[index].values = values;
    this.setState({ sessionTableDetails });
  };

  calculateSessions = () => {
    let { sessionTableDetails, employeeOptions, tstaffList } = this.state;
    console.log(sessionTableDetails, employeeOptions, tstaffList, "Megalaaaa");
    let sessionCount = 0;
    sessionTableDetails.forEach(e => {
      sessionCount += e.sessions;
    });
    if (sessionCount > this.props.sessionCount) {
      Toast({ type: "error", message: "Session count cannot exceed!" });
      return;
    }
    let employeeStartCount = 1;
    employeeOptions.forEach(e => {
      let total = 0.0;
      let employeeid = e.value;
      sessionTableDetails.forEach((sessionTable, index) => {
        let splitSessionAdjustCount = Number(
          sessionTableDetails[index].sessions /
            sessionTableDetails[index].values.length
        ).toFixed(2);
        let splitSessionreminder = Number(
          sessionTableDetails[index].sessions -
            splitSessionAdjustCount * sessionTableDetails[index].values.length
        ).toFixed(2);
        let includeSplitReminder =
          Number(splitSessionAdjustCount) + Number(splitSessionreminder);

        if (sessionTable.values.includes(e.value)) {
          let finalemployee = sessionTableDetails[index].values;
          let lastElement = finalemployee[finalemployee.length - 1];
          if (employeeid == lastElement) {
            total += includeSplitReminder;
            employeeStartCount = 1;
          } else {
            total = Number(total) + Number(splitSessionAdjustCount);
            employeeStartCount += 1;
          }
        }
      });

      tstaffList.filter(ele => ele.helper_id == e.value)[0].session = total;
    });
    console.log(tstaffList, "list with sessions");
    this.setState({ tstaffList });

    let event = { target: { name: "session" } };
    tstaffList.forEach((item, index) => {
      this.handleUpdatestaff(event, item, index);
    });
  };

  render() {
    let {
      staffList = [],
      tstaffList = [],
      roomList,
      Room,
      Source,
      duration,
      startDuration,
      sourceList,
      updateFields,
      headerDetails,
      cartData = {},
      postFields,
      employeeOptions,
      sessionTableDetails,
      sessionTableHeader,
      meta,
    } = this.state;
    let { value = {} } = cartData;
    let { work_point } = postFields;
    let { Room_Codeid, Source_Codeid, new_remark } = updateFields;
    let {
      Item,
      Price,
      add_duration,
      room_id,
      room_name,
      source_id,
      source_name,
      times,
    } = value;
    let { tsStaff = {}, t } = this.props;
    let { course, unit_amount, workpoint } = tsStaff;
    return (
      <div className="row new-cart treatment-done" id="treatment-done-sesiions">
        <div className="col-12">
          <p className="fs-18 font-700 mb-3 title">{t("Treatment Done")}</p>
        </div>
        <div className="col-6 mb-2">
          <label className="text-left text-black common-label-text ">
            {t("Item")}
          </label>
          <div className="input-group mb-2">{Item}</div>
          <label className="text-left text-black common-label-text ">
            {t("Price")}
          </label>
          <div className="input-group mb-2">{Price}</div>
          <label className="text-left text-black common-label-text ">
            {t("Work Point")}
          </label>

          <div className="input-group">
            <NormalInput
              value={work_point ? work_point : ""}
              name="work_point"
              onChange={this.handlePostChanges}
              className={`customer-name`}
              disabled={true}
            />
          </div>
        </div>
        <div className="col-4 mb-2"></div>
        <div className="col-2 mb-2">
          <label className="text-left text-black common-label-text ">
            {t("Session")}
          </label>

          <h1>{this.props.session}</h1>
        </div>
        <div className={`col-12 cart-item emp-image`}>
          <StaffList
            staffList={staffList}
            meta={meta}
            handleNext={() => this.handleNext()}
            handleBack={() => this.handleBack()}
            handleSelectedStaff={item => this.handleSelect_Staff(item)}
          />
        </div>
        <div className={`col-12 cart-item`}>
          <div className={`item-list`}>
            <div className="table">
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
                // pageMeta={pageMeta}
                // isEmpty={tstaffList.length === 0 ? true:false}
              >
                {tstaffList && tstaffList.length > 0
                  ? tstaffList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="position-relative status-type">
                            <div className="text-left fs-20">
                              {item.helper_name}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <NormalInput
                                // placeholder="Enter here"
                                // options={siteList}
                                value={item.session}
                                name="session"
                                type="number"
                                min="0"
                                max={this.props.session}
                                onChange={e =>
                                  this.handleUpdateSession(e, item, index)
                                }
                                onBlur={e =>
                                  this.handleUpdatestaff(e, item, index)
                                }
                                className="text-right"
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <NormalInput
                                // placeholder="Enter here"
                                // options={siteList}
                                value={item.wp1}
                                name="wp1"
                                type="number"
                                min="0"
                                max={postFields.work_point}
                                onChange={e =>
                                  this.handleuUpdateWp(e, item, index)
                                }
                                onBlur={e =>
                                  this.handleUpdatestaff(e, item, index)
                                }
                                className="text-right"
                              />
                            </div>
                          </td>
                          <td>
                            {this.state.hideNotNeededControls == "true" && (
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="input-group">
                                  <NormalSelect
                                    // placeholder="Enter here"
                                    options={startDuration}
                                    value={item.appt_fr_time}
                                    name="appt_fr_time"
                                    onChange={e =>
                                      this.handleUpdatestaff(e, item, index)
                                    }
                                    className="customer-name py-0"
                                  />
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            {this.state.hideNotNeededControls == "true" && (
                              <div className="text-right">
                                {item.appt_to_time}
                              </div>
                            )}
                          </td>

                          <td>
                            {this.state.hideNotNeededControls == "true" && (
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="input-group">
                                  <NormalSelect
                                    // placeholder="Enter here"this.setState({add_duration:e.target.value})
                                    options={duration}
                                    value={item.add_duration}
                                    name="add_duration"
                                    onChange={e =>
                                      this.handleUpdatestaff(e, item, index)
                                    }
                                    className="customer-name p-0"
                                  />
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            </div>
          </div>
        </div>

        <div className="col-12 cart-item">
          <Tree content="Assign Sessions">
            <div className="item-list p-0">
              <div className="d-flex justify-content-end">
                <div className="col-md-4 p-0 mb-2">
                  <NormalButton
                    mainbg={true}
                    label="Add Row"
                    onClick={this.handleAddRow}
                  />
                </div>
              </div>
              <div className="table">
                <TableWrapper headerDetails={sessionTableHeader}>
                  {sessionTableDetails && sessionTableDetails.length > 0
                    ? sessionTableDetails.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <NormalInput
                                  // placeholder="Enter here"
                                  // options={siteList}
                                  value={item.sessions}
                                  name="session"
                                  type="number"
                                  min="0"
                                  max={this.props.session}
                                  onChange={e =>
                                    this.handleSessionsChange(e, index)
                                  }
                                  className="text-right"
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <NormalMultiSelect
                                  // placeholder="Enter here"
                                  target={document.getElementById(
                                    "treatment-done-sesiions"
                                  )}
                                  options={employeeOptions}
                                  value={item.values}
                                  handleMultiSelect={e =>
                                    this.handleSessionEmpChange(e, index)
                                  }
                                  //className="wpr"
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <div
                                  className="icon"
                                  onClick={() => this.handleRemoveRow(index)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="red"
                                    class="bi bi-x"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                  </svg>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </TableWrapper>
              </div>
              {sessionTableDetails?.length > 0 ? (
                <div className="d-flex justify-content-end">
                  <div className="col-md-4 p-0 mt-2">
                    <NormalButton
                      mainbg={true}
                      label="Assign Sessions"
                      onClick={this.calculateSessions}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </Tree>
        </div>

        <div className="col-12 mb-2">
          {this.state.hideNotNeededControls == "true" && (
            <div className="row">
              <div className="col-4">
                <label className="text-left text-black common-label-text ">
                  {t("Room")}
                </label>

                <div className="input-group">
                  <NormalSelect
                    // placeholder="Enter here"
                    options={roomList}
                    value={Room_Codeid}
                    name="Room_Codeid"
                    onChange={this.handleUpdatChanges}
                    className="customer-name py-0"
                    // disabled={Room_Codeid}
                  />
                </div>
              </div>
              <div className="col-4">
                <label className="text-left text-black common-label-text ">
                  {t("Source")}
                </label>

                <div className="input-group">
                  <NormalSelect
                    // placeholder="Enter here"
                    options={sourceList}
                    value={Source_Codeid}
                    name="Source_Codeid"
                    onChange={this.handleUpdatChanges}
                    className="customer-name py-0"
                    // disabled={Source_Codeid}
                  />
                </div>
              </div>

              <div className="col-4">
                <label className="text-left text-black common-label-text ">
                  {t("New Remark")}
                </label>

                <div className="input-group">
                  <NormalInput
                    // placeholder="Enter here"
                    // options={siteList}
                    value={new_remark}
                    name="new_remark"
                    onChange={this.handleUpdatChanges}
                    className="customer-name"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 pt-4 action-bar">
          <div className="row">
            <div className="col-6 d-flex">
              <NormalButton
                buttonClass={"mx-2"}
                resetbg={true}
                className="fs-15"
                label="Clear Line"
                outline={false}
                onClick={this.handleClearLine}
              />
              <NormalButton
                buttonClass={"mx-2"}
                resetbg={true}
                className="fs-15"
                label="Clear All"
                outline={false}
                onClick={this.handleClearAll}
              />
            </div>
            <div className="col-4 text-right">
              {/* <NormalButton
                                buttonClass={"mx-2"}
                                danger={true}
                                className=" fs-15 close"
                                label="Close"
                                outline={false}
                                onClick={this.props.handleModal}
                            /> */}
            </div>
            <div className="col-2 text-right">
              <NormalButton
                buttonClass={"mx-2"}
                mainbg={true}
                className=" fs-15 confirm"
                label="Confirm"
                outline={false}
                onClick={this.handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonCreateApi,
      commonPatchApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const SelectStaff = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SelectStaffClass)
);
