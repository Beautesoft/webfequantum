import React, { Component } from "react";
import {
  NormalSelect,
  NormalButton,
  NormalModal,
  NormalInput,
  NormalDateTime,
  NormalCheckbox,
  NormalTimePicker,
} from "component/common";
import "./style.scss";
import {
  updateForm,
  getSelectedTreatmentList,
} from "redux/actions/appointment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SimpleReactValidator from "simple-react-validator";
import closeIcon from "assets/images/close.png";
import req_therapist from "assets/images/app-icons/1.png";
import {
  getCommonApi,
  commonCreateApi,
  commonPatchApi,
  commonDeleteApi,
} from "redux/actions/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { TableWrapper } from "component/common";
import { TreatmentPackage } from "./modal/index";
import { Toast } from "service/toast";
import { MobileAppointmentForm } from "./MobileAppointmentForm";
import { history } from "helpers";
import { TreatmentHistory } from "component/Admin/NewAppointment/NewListAppointment/modal/TreatmentHistory";
import { UpcomingAppointment } from "component/Admin/NewAppointment/NewListAppointment/modal/UpcomingAppointment";
import { withTranslation } from "react-i18next";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const getTime = date => {
  debugger;
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

export class MobileSelectTreatmentClass extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    treatmentDetail: [],
    formFields: {
      appt_id: "",
      start_time: "",
      end_time: "",
      Item_Codeid: null,
      add_duration: "",
      emp_no: 0,
      requesttherapist: false,
      Item_CodeName: "",
      edit_remark: "",
      recur_days: null,
      recur_qty: null,
      item_text: null,
      checktype: "",
      treat_parentcode: null,
    },
    selectedList: [
      {
        appt_id: "",
        start_time: "",
        end_time: "",
        Item_Codeid: null,
        add_duration: "",
        emp_no: 0,
        requesttherapist: false,
        Item_CodeName: "",
        edit_remark: "",
        recur_days: null,
        recur_qty: null,
        item_text: null,
        checktype: "",
        treat_parentcode: null,
      },
    ],
    outletOption: [],
    staffOption: [],
    roomOption: [],
    list: [],
    isOpenModal: false,
    categoryList: [],
    treatmentList: [],
    siteList: [],
    treatmentField: {
      category: "",
      treatment: "",
    },
    timeDropdown: [],
    duration: [],
    index: null,
    search: "",
    selectTreatmentId: "",
    treatmentListHeader: [
      { label: "Category", className: "w-50" },
      { label: "Service", className: "w-75" },
      { label: "Duration", className: "w-25" },
      {
        label: "price",
        className: "w-50",
        divClass: "justify-content-end text-right",
      },
    ],
    meta: {},
    isTreatementModal: false,
    appointmentId: null,
    PackageIndex: 0,
    selectedRec_days: null,
    selectedRec_qty: null,
    recurringList: [],
    recurringSelectedItems: [],
    recurringSelectAll: false,
    settingData: {},
    PasteAppointmentId: 0,
    InitAppointmentStatus: "",
    isTreatmentHistoryModal: false,
    isUpcomingAppointmentModal: false,
    freeTextStockId: "",
    headerDetails: [
      { label: "Start", width: "100px" },
      { label: "End" },
      { label: "Service", width: "260px" },
      { label: "Duration" },
      { label: "Treatment Staff" },
      { label: "therapist", width: "35px" },
      { label: "Recur Days", width: "100px" },
      { label: "Recur Qty", width: "100px" },
      { label: "Action" },
    ],
    activeRow: 0,
    isLoginConfirmation: false,
    passwordVisible: false,
    dragusername: "",
    dragpassword: "",
    DeletedList: [],
  };
  showErrorMessage = () => {
    this.child.onFocus();
  };
  componentDidMount() {
    this.search({});
    this.handleItemSettings();
    let { categoryList, staffOption, selectedList, formFields, duration } =
      this.state;

    let { basicApptDetail, AppointmentCopy } = this.props;
    console.log(AppointmentCopy, "Basic app detail data");

    if (basicApptDetail.appt_id) {
      this.setState({ appointmentId: basicApptDetail.appt_id });
      this.handleRenderApptDetail(basicApptDetail.appt_id, false);
    } else {
      let { selectedList } = this.state;
      selectedList[0]["start_time"] = basicApptDetail
        ? this.timeToDateFormat(basicApptDetail.time)
        : "";
      selectedList[0]["emp_no"] = basicApptDetail
        ? basicApptDetail.staff_id
        : 0;
      this.setState({
        selectedList,
      });
      this.props.updateForm("treatmentList", selectedList);
    }
    this.props.getCommonApi(`itemdept/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          categoryList.push({ value: value.id, label: value.itm_desc });
        }
        this.setState({ categoryList });
      }
    });
    this.props
      .getCommonApi(
        `appointment/Staffs/?Outlet=${
          basicApptDetail.branchId
        }&date=${dateFormat(new Date(basicApptDetail.date))}`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          for (let value of data) {
            staffOption.push({ value: value.id, label: value.emp_name });
          }
          this.setState({ staffOption });
        }
      });
    this.props.getCommonApi(`treatment/Duration/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          duration.push({ value: value, label: value });
        }
        this.setState({ duration });
      }
    });
    this.getStaffAvailability();
    this.getFreetextStockid();
  }
  getFreetextStockid = async => {
    let { treatmentField, search, selectTreatmentId } = this.state;
    let page = 1,
      limit = 10;
    this.props
      .getCommonApi(
        `stocklist/?Item_Deptid=${selectTreatmentId}&search=${search}&page=${page}&limit=${limit}`
      )
      .then(res => {
        console.log(res, "stocklistfreetextresponse");
        let { data, status } = res;
        if (status === 200) {
          if (data && data.stock_id && data.stock_id !== " ") {
            this.setState({ freeTextStockId: data.stock_id });
          } else {
            Toast({
              type: "error",
              message: "Stock Id not found for free text item",
            });
          }
        }
      });
  };
  timeToDateFormat = TimeValue => {
    let time = String(TimeValue).split(":");
    let newTime = new Date(new Date().setHours(time[0], time[1], 0, 0));
    return newTime;
  };
  handleRenderApptDetail = async (appt_id, copy) => {
    let { selectedList, InitAppointmentStatus } = this.state;

    this.props.getCommonApi(`appointmentedit/${appt_id}/`).then(async key => {
      let { status, data } = key;
      console.log(data, "renderappointmentdetail");
      if (status === 200) {
        if (data.treatment) {
          InitAppointmentStatus = data.appointment.appt_status;
          selectedList = [];
          await this.setState({
            selectedList: selectedList,
            InitAppointmentStatus,
          });
          this.props.updateForm("treatmentList", selectedList);
          for (let treat of data.treatment) {
            let startTime = "";
            let endTime = "";
            let apptid = null;
            if (copy) {
              startTime = this.timeToDateFormat(treat.start_time);
              endTime = treat.end_time;
              apptid = null;
            } else {
              startTime = this.timeToDateFormat(treat.start_time);
              endTime = treat.end_time;
              apptid = treat.appt_id;
            }
            selectedList.push({
              start_time: startTime,
              end_time: endTime,
              emp_no: treat.emp_id,
              appt_id: apptid,
              Item_Codeid: treat.item_id,
              Item_CodeName: treat.item_name,
              add_duration: treat.add_duration,
              requesttherapist: treat.requesttherapist,
              recur_days: treat.recur_days,
              recur_qty: treat.recur_qty,
              item_text: treat.item_name,
              checktype: treat.checktype,
              treat_parentcode: treat.treat_parentcode,
            });
            this.setState({
              selectedList,
            });
          }
          this.props.updateForm("treatmentList", selectedList);
        }
      }
    });
  };
  handleItemSettings = () => {
    let { settingData } = this.state;
    this.props.getCommonApi(`userlist/`).then(key => {
      let { status, data } = key;
      console.log(key, "settingsData appointmentCreate");
      if (status === 200) {
        settingData = data;
        this.setState({ settingData });
      }
    });
  };
  componentWillMount() {
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  }

  getStaffAvailability = () => {
    this.props
      .getCommonApi(
        `staffsavailable/?Appt_date=${dateFormat(new Date(), "yyyy-mm-dd")}`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          // for (let value of data) {
          //     staffList.push({ value: value.id, label: value.emp_name })
          // }
          this.setState({ list: data });
        }
      });
  };

  handleSearch = event => {
    event.persist();
    console.log(event.target.value, event.target, event, "dfhdfjghkjfghj");
    let { treatmentField } = this.state;
    treatmentField["treatment"] = event.target.value;
    this.setState({ search: event.target.value, treatmentField });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        // this.queryHandler(data)
        this.search(data);
      }, 500);
    }
    this.debouncedFn();
  };

  search = data => {
    let { page = 1, limit = 10, search = "" } = data;
    let { selectTreatmentId } = this.state;
    this.props
      .getCommonApi(
        `stocklist/?Item_Deptid=${selectTreatmentId}&search=${search}&page=${page}&limit=${limit}`
      )
      .then(res => {
        console.log(res, "treatmentList treatment_parentcode");
        if (res.status === 200) {
          this.setState({
            treatmentList: res.data.dataList,
            meta: res.data.meta.pagination,
          });
        }
      });
  };

  handlePagination = page => {
    this.search(page);
  };

  handleChangeTreatment = async ({ target: { value, name } }) => {
    let { treatmentField, search, selectTreatmentId } = this.state;
    console.log("uihwkjrwkej", name, value);
    treatmentField[name] = value;
    if (name === "category") {
      selectTreatmentId = value;
    } else if (name === "treatment") {
      search = value;
    }
    await this.setState({
      treatmentField,
      selectTreatmentId,
      search,
    });

    let page = 1,
      limit = 10;
    this.props
      .getCommonApi(
        `stocklist/?Item_Deptid=${selectTreatmentId}&search=${search}&page=${page}&limit=${limit}`
      )
      .then(res => {
        console.log(res, "stocklis");
        if (res.status === 200) {
          this.setState({
            treatmentList: res.data.dataList,
            meta: res.data.meta.pagination,
          });
        }
      });
  };

  handleChange = async ({ target: { value, name } }, index) => {
    let { selectedList, appointmentId, freeTextStockId } = this.state;

    if (name === "add_duration") {
      //if (appointmentId) {
      selectedList[index]["end_time"] = this.addTimes(
        this.getHoursFromDate(selectedList[index]["start_time"]),
        value ? value : "00:00"
      );
      // } else {
      //   selectedList[index]["end_time"] = this.addTimes(
      //     selectedList[index]["start_time"],
      //     value ? value : "00:00"
      //   );
      // }
      selectedList[index]["add_duration"] = value;
      if (selectedList.length - 1 > index) {
        let endTime = "";
        //if (appointmentId) {
        endTime = this.timeToDateFormat(selectedList[index]["end_time"]);
        // } else {
        //   endTime = selectedList[index]["end_time"];
        // }
        selectedList[index + 1]["start_time"] = endTime;
        if (selectedList[index + 1]["add_duration"] !== "") {
          selectedList[index + 1]["end_time"] = this.addTimes(
            selectedList[index]["end_time"],
            selectedList[index + 1]["add_duration"]
          );
        }
      }
    } else if (name === "Item_CodeName") {
      selectedList[index]["Item_Codeid"] = freeTextStockId;
      selectedList[index]["Item_CodeName"] = value;
      selectedList[index]["item_text"] = value;
      selectedList[index]["checktype"] = "freetext";
      selectedList[index]["treat_parentcode"] = null;
    } else if (name === "recur_days" || name === "recur_qty") {
      if (value <= 0 || value === "") {
        selectedList[index][name] = null;
      } else {
        selectedList[index][name] = Number(value);
      }
    } else {
      selectedList[index][name] = value;
    }

    await this.setState({
      selectedList,
    });
    await this.props.updateForm("treatmentList", selectedList);
  };

  handleMultiSelect = data => {
    let { formFields } = this.state;
    let list = [];
    for (let key of data) {
      list.push(key.value);
    }
    formFields["emp_no"] = list;
    this.setState({ formFields });
    console.log(formFields, "oyokkjk");
  };

  // handleDatePick = async (name, value) => {
  //   debugger;
  //   let { formFields, selectedList } = this.state;
  //   let time = this.getHoursFromDate(value);
  //   formFields["start_time"] = time;
  //   selectedList[0]["start_time"] = time ? time : formFields["start_time"];
  //   if (time) {
  //     formFields["end_time"] = this.addTimes(
  //       formFields["start_time"],
  //       formFields["add_duration"]
  //     );
  //     selectedList[0]["end_time"] = this.addTimes(
  //       selectedList[0]["start_time"],
  //       formFields["add_duration"]
  //     );
  //   }
  //   await this.setState({
  //     formFields,
  //     selectedList,
  //   });
  //   await this.props.updateForm("treatmentList", selectedList);
  // };

  handleDatePick = async ({ target: { value, name } }, index) => {
    let { selectedList, appointmentId } = this.state;
    let time = this.getHoursFromDate(value);
    let duration = "";
    if (selectedList[index]["add_duration"] !== "") {
      duration = selectedList[index]["add_duration"];
    } else {
      duration = "00:00";
    }
    selectedList[index]["start_time"] = value
      ? value
      : this.timeToDateFormat(selectedList[index]["start_time"]);
    if (time) {
      selectedList[index]["end_time"] = this.addTimes(time, duration);
    }
    if (selectedList.length - 1 > index) {
      let endTime = "";
      if (appointmentId) {
        endTime = this.timeToDateFormat(selectedList[index]["end_time"]);
      } else {
        endTime = selectedList[index]["end_time"];
      }
      selectedList[index + 1]["start_time"] = endTime;
      if (selectedList[index + 1]["add_duration"] !== "") {
        selectedList[index + 1]["end_time"] = this.addTimes(
          selectedList[index]["end_time"],
          selectedList[index + 1]["add_duration"]
        );
      }
    }
    await this.setState({
      selectedList,
    });
    await this.props.updateForm("treatmentList", selectedList);
  };

  getHoursFromDate = date => {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let hours = hour > 9 ? hour : "0" + hour;
    let minutes = minute > 9 ? minute : "0" + minute;
    return hours + ":" + minutes;
  };

  stafflistvalidation = appointmentTreatmentList => {
    if (appointmentTreatmentList.length > 0) {
      for (let item of appointmentTreatmentList) {
        if (!item.emp_no || item.emp_no === "" || item.emp_no === null) {
          Toast({ type: "error", message: "Please select Staff" });
          return false;
        } else {
          return true;
        }
      }
    }
  };
  handleUpdate = () => {
    let { appointmentCustomerDetail, appointmentTreatmentList } = this.props;
    let {
      appointmentId,
      InitAppointmentStatus,
      dragusername,
      dragpassword,
      DeletedList,
    } = this.state;
    let finalTreatment = [];
    for (let TreatmentList of appointmentTreatmentList) {
      finalTreatment.push({
        appt_id: TreatmentList.appt_id,
        start_time: this.getHoursFromDate(TreatmentList.start_time),
        end_time: TreatmentList.end_time,
        add_duration: TreatmentList.add_duration,
        item_id: TreatmentList.Item_Codeid,
        item_text: TreatmentList.item_text,
        emp_id: TreatmentList.emp_no,
        requesttherapist: TreatmentList.requesttherapist,
        recur_qty: Number(""),
        recur_days: "",
        checktype: TreatmentList.checktype,
        treat_parentcode: TreatmentList.treat_parentcode,
      });
    }
    console.log(finalTreatment, "filteredupdateFunctionAppointmentData");
    let orig_remark = "";
    let AppStatus = "";
    if (appointmentCustomerDetail.remark_setting) {
      orig_remark = null;
    } else {
      orig_remark = appointmentCustomerDetail.new_remark;
    }
    if (
      String(InitAppointmentStatus).toUpperCase() === "ARRIVED" &&
      String(appointmentCustomerDetail.bookingStatus).toUpperCase() ===
        "ARRIVED"
    ) {
      AppStatus = null;
    } else {
      AppStatus = appointmentCustomerDetail.bookingStatus;
    }
    if (
      appointmentCustomerDetail.customerName &&
      appointmentCustomerDetail.bookingStatus
    ) {
      if (this.stafflistvalidation(appointmentTreatmentList)) {
        try {
          let data = {
            appointment: {
              appt_date: dateFormat(
                new Date(appointmentCustomerDetail.appointmentDate),
                "yyyy-mm-dd"
              ),
              appt_status: AppStatus,
              channel_id: Number(appointmentCustomerDetail.Appt_typeid),
              ori_remark: orig_remark,
              edit_remark: appointmentCustomerDetail.edit_remark,
              source_id: Number(appointmentCustomerDetail.Source_Codeid),
              Room_Codeid: Number(appointmentCustomerDetail.Room_Codeid),
              sec_status: appointmentCustomerDetail.sec_status,
              remark_setting: appointmentCustomerDetail.remark_setting,
              cart_create: appointmentCustomerDetail.cart_create,
              username: dragusername,
              password: dragpassword,
              cust_StoreCard: appointmentCustomerDetail.cust_StoreCard,
            },
            treatment: finalTreatment,
            apptdel_id: DeletedList,
          };

          this.props
            .commonPatchApi(`appointmentedit/${appointmentId}/`, data)
            .then(async res => {
              console.log(res, "cart check while update booking");
              if (res.status === 200) {
                this.handleCloseDialog();
                this.handleSaveorUpdate();
              } else if (res.status === 201) {
                let formFields = { custId: 0, custName: "", cust_refer: "" };
                formFields["custId"] = appointmentCustomerDetail.customerName;
                formFields["custName"] = appointmentCustomerDetail.custName;
                formFields["cust_refer"] = appointmentCustomerDetail.cust_refer;
                await this.props.updateForm("basicApptDetail", formFields);
                this.props
                  .getCommonApi(
                    `itemcart/Check/?cart_date=${dateFormat(
                      new Date(),
                      "yyyy-mm-dd"
                    )}&cust_noid=${appointmentCustomerDetail.customerName}`
                  )
                  .then(res => {
                    history.push("/admin/cart");
                  });
              }
            });
        } catch (e) {
          console.log("updateappointmentcatch", e);
        }
      }
    } else {
      this.showErrorMessage();
    }
  };
  // handleUpdate = () => {
  //   let { appointmentCustomerDetail, appointmentTreatmentList } = this.props;
  //   let { appointmentId, selectedRec_days, selectedRec_qty } = this.state;
  //   let orig_remark = "";
  //   if (appointmentCustomerDetail.remark_setting) {
  //     orig_remark = null;
  //   } else {
  //     orig_remark = appointmentCustomerDetail.new_remark;
  //   }
  //   if (
  //     appointmentCustomerDetail.customerName &&
  //     appointmentCustomerDetail.bookingStatus
  //   ) {
  //     if (this.stafflistvalidation(appointmentTreatmentList)) {
  //       let data = {
  //         appt_date: dateFormat(
  //           new Date(appointmentCustomerDetail.appointmentDate),
  //           "yyyy-mm-dd"
  //         ),
  //         Room_Codeid: appointmentCustomerDetail.Room_Codeid,
  //         appt_status: appointmentCustomerDetail.bookingStatus,
  //         sec_status: appointmentCustomerDetail.sec_status,
  //         ori_remark: orig_remark,
  //         edit_remark: appointmentCustomerDetail.edit_remark,
  //         start_time: this.getHoursFromDate(
  //           appointmentTreatmentList[0].start_time
  //         ),
  //         end_time: appointmentTreatmentList[0].end_time,
  //         item_id: appointmentTreatmentList[0].Item_Codeid,
  //         add_duration: appointmentTreatmentList[0].add_duration,
  //         emp_id: appointmentTreatmentList[0].emp_no,
  //         requesttherapist: appointmentTreatmentList[0].requesttherapist,
  //         item_text: appointmentTreatmentList[0].item_text,
  //         recur_days:
  //           selectedRec_days === appointmentTreatmentList[0].recur_days ||
  //           appointmentTreatmentList[0].recur_days === "" ||
  //           appointmentTreatmentList[0].recur_days <= 0
  //             ? null
  //             : appointmentTreatmentList[0].recur_days,
  //         recur_qty:
  //           Number(selectedRec_qty) ===
  //             Number(appointmentTreatmentList[0].recur_qty) ||
  //           Number(appointmentTreatmentList[0].recur_qty) === "" ||
  //           Number(appointmentTreatmentList[0].recur_qty) <= 0
  //             ? null
  //             : Number(appointmentTreatmentList[0].recur_qty),
  //         checktype: appointmentTreatmentList[0].checktype,
  //         treat_parentcode: appointmentTreatmentList[0].treat_parentcode,
  //         remark_setting: appointmentCustomerDetail.remark_setting,
  //       };
  //       console.log(data, "UpdatedappointmentTreatmentListWhenupdate");

  //       this.props
  //         .commonPatchApi(`appointmentresources/${appointmentId}/`, data)
  //         .then(async res => {
  //           console.log(res, "cart check while update booking");
  //           if (res.status === 200) {
  //             this.handleCloseDialog();
  //             this.handleSaveorUpdate();
  //           } else if (res.status === 201) {
  //             // this.handleCloseDialog();
  //             // this.handleSaveorUpdate();
  //             let formFields = { custId: 0, custName: "" };
  //             formFields["custId"] = appointmentCustomerDetail.customerName;
  //             formFields["custName"] = appointmentCustomerDetail.custName;

  //             await this.props.updateForm("basicApptDetail", formFields);
  //             this.props
  //               .getCommonApi(
  //                 `itemcart/Check/?cart_date=${dateFormat(
  //                   new Date(),
  //                   "yyyy-mm-dd"
  //                 )}&cust_noid=${appointmentCustomerDetail.customerName}`
  //               )
  //               .then(res => {
  //                 history.push("/admin/cart");
  //               });
  //           }
  //         });
  //     }
  //   } else {
  //     this.showErrorMessage();
  //   }
  // };
  handleRecurringUpdate = () => {
    let { appointmentCustomerDetail, appointmentTreatmentList } = this.props;
    let {
      appointmentId,
      selectedRec_days,
      selectedRec_qty,
      recurringList,
      recurringSelectAll,
    } = this.state;
    let finalRecurring = [];
    for (var recurringItem of recurringList) {
      if (recurringItem.selected) {
        let value = recurringItem.id;
        finalRecurring.push(value);
      }
    }
    console.log(finalRecurring, "finalrecurringList");
    if (
      appointmentCustomerDetail.customerName &&
      appointmentCustomerDetail.bookingStatus
    ) {
      if (this.stafflistvalidation(appointmentTreatmentList)) {
        let data = {
          appt_date: dateFormat(
            new Date(appointmentCustomerDetail.appointmentDate),
            "yyyy-mm-dd"
          ),
          Room_Codeid: appointmentCustomerDetail.Room_Codeid,
          appt_status: appointmentCustomerDetail.bookingStatus,
          sec_status: appointmentCustomerDetail.sec_status,
          edit_remark: appointmentCustomerDetail.edit_remark,
          start_time: this.getHoursFromDate(
            appointmentTreatmentList[0].start_time
          ),
          end_time: appointmentTreatmentList[0].end_time,
          item_id: appointmentTreatmentList[0].Item_Codeid,
          add_duration: appointmentTreatmentList[0].add_duration,
          emp_id: appointmentTreatmentList[0].emp_no,
          requesttherapist: appointmentTreatmentList[0].requesttherapist,
          item_text: appointmentTreatmentList[0].item_text,
          recur_days:
            selectedRec_days === appointmentTreatmentList[0].recur_days ||
            appointmentTreatmentList[0].recur_days === "" ||
            appointmentTreatmentList[0].recur_days <= 0
              ? null
              : appointmentTreatmentList[0].recur_days,
          recur_qty:
            Number(selectedRec_qty) ===
              Number(appointmentTreatmentList[0].recur_qty) ||
            Number(appointmentTreatmentList[0].recur_qty) === "" ||
            Number(appointmentTreatmentList[0].recur_qty) <= 0
              ? null
              : Number(appointmentTreatmentList[0].recur_qty),
          recur_ids: finalRecurring,
        };
        console.log(data, "UpdatedappointmentTreatmentListWhenupdate");
        if (recurringSelectAll) {
          this.props
            .commonPatchApi(
              `appointmentrecur/${appointmentId}/?type=${`all`} `,
              data
            )
            .then(async res => {
              if (res.status === 200) {
                this.handleCloseDialog();
                this.handleSaveorUpdate();
              }
            });
        } else {
          this.props
            .commonPatchApi(`appointmentrecur/${appointmentId}/`, data)
            .then(async res => {
              console.log(res, "type all clicked result");
              if (res.status === 200) {
                this.handleCloseDialog();
                this.handleSaveorUpdate();
              }
            });
        }
      }
    } else {
      this.showErrorMessage();
    }
  };
  handleSubmit = () => {
    // this.props.handleConfirmBooking()
    let { appointmentCustomerDetail, appointmentTreatmentList } = this.props;
    let { dragpassword, dragusername } = this.state;
    console.log(appointmentCustomerDetail, "appointmentcustomerdetailwhenSave");
    console.log(
      appointmentTreatmentList,
      "savedappointmentTreatmentListWhenSave"
    );

    let finalTreatment = [];
    for (let TreatmentList of appointmentTreatmentList) {
      finalTreatment.push({
        appt_id: TreatmentList.appt_id,
        start_time: this.getHoursFromDate(TreatmentList.start_time),
        end_time: TreatmentList.end_time,
        add_duration: TreatmentList.add_duration,
        Item_Codeid: TreatmentList.Item_Codeid,
        item_text: TreatmentList.item_text,
        emp_no: TreatmentList.emp_no,
        requesttherapist: TreatmentList.requesttherapist,
        recur_qty: TreatmentList.recur_qty,
        recur_days: TreatmentList.recur_days,
        checktype: TreatmentList.checktype,
        treat_parentcode: TreatmentList.treat_parentcode,
      });
    }
    if (
      appointmentCustomerDetail.customerName &&
      appointmentCustomerDetail.bookingStatus
    ) {
      if (this.stafflistvalidation(appointmentTreatmentList)) {
        let data = {
          Appointment: {
            appt_date: dateFormat(
              new Date(appointmentCustomerDetail.appointmentDate),
              "yyyy-mm-dd"
            ),
            Appt_typeid: appointmentCustomerDetail.Appt_typeid,
            cust_noid: appointmentCustomerDetail.customerName,
            new_remark: appointmentCustomerDetail.new_remark,
            // emp_noid: appointmentCustomerDetail.emp_id,
            Source_Codeid: appointmentCustomerDetail.Source_Codeid,
            Room_Codeid: appointmentCustomerDetail.Room_Codeid,
            appt_status: appointmentCustomerDetail.bookingStatus,
            sec_status: appointmentCustomerDetail.sec_status,
            ItemSite_Codeid: appointmentCustomerDetail.ItemSite_Codeid,
            walkin: appointmentCustomerDetail.walkin,
            username: dragusername,
            password: dragpassword,
            cust_StoreCard: appointmentCustomerDetail.cust_StoreCard,
          },
          Treatment: finalTreatment,
        };

        this.props.commonCreateApi(`appointment/`, data).then(async res => {
          if (res.status === 201) {
            this.sendMessage(
              appointmentCustomerDetail,
              appointmentTreatmentList
            );
            this.handleCloseDialog();
            this.handleSaveorUpdate();
          }
        });
      }
    } else {
      this.showErrorMessage();
    }
  };

  sendMessage = async (appointmentCustomerDetail, appointmentTreatmentList) => {
    let { tokenDetail } = this.props;
    const API_ENDPOINT =
      "https://api.chat-api.com/instance368869/sendMessage?token=2817uztanv2i8kqn";
    let payload = {
      phone: `${
        appointmentCustomerDetail.custPhone
          ? appointmentCustomerDetail.custPhone
          : ""
      }`,
      body: `Dear Customer,
       Warmest regards - your Appointment for ${
         appointmentTreatmentList[0].Item_CodeName
           ? appointmentTreatmentList[0].Item_CodeName
           : ""
       } is booked on ${
        appointmentCustomerDetail.appointmentDate
          ? dateFormat(
              new Date(appointmentCustomerDetail.appointmentDate),
              "yyyy-mm-dd"
            )
          : ""
      } at ${
        appointmentTreatmentList[0].start_time
          ? this.getHoursFromDate(appointmentTreatmentList[0].start_time)
          : ""
      }. 
      Kindly call ${
        tokenDetail.sitePhone ? tokenDetail.sitePhone : ""
      } if you have any inquiries - ${
        tokenDetail.branch ? tokenDetail.branch : ""
      }`,
    };

    const res = await fetch(`${API_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  };

  getDateTime = data => {
    let date = new Date(data);
    date = String(date).split(" ");
    let date1 = date[2] + "th " + date[1] + ", " + date[3];
    let time = date[4].split(":");
    let time1 =
      String(Number(time[0]) > 12 ? Number(time[0]) - 12 : time[0]) +
      ":" +
      time[1] +
      (Number(time[0]) > 12 ? "PM" : "AM");
    return time1 + ", " + date1;
  };

  handleDialog = () => {
    this.setState({ isOpenModal: false, index: null });
  };

  handleMultipleCustomer = () => {
    this.setState({ isOpenModal: false });
  };

  handleSelectPackage = async data => {
    debugger;
    let { selectedList, PackageIndex, appointmentId } = this.state;

    if (PackageIndex === 0 && selectedList[0]["Item_CodeName"] === "") {
      selectedList[0]["start_time"] = selectedList[0]["start_time"];
      // if (appointmentId) {
      selectedList[0]["end_time"] = this.addTimes(
        this.getHoursFromDate(selectedList[0]["start_time"]),
        data.add_duration ? data.add_duration : "00:00"
      );
      // } else {
      //   selectedList[0]["end_time"] = this.addTimes(
      //     selectedList[0]["start_time"],
      //     data.add_duration ? data.add_duration : "00:00"
      //   );
      // }
      selectedList[0]["Item_Codeid"] = data.id;
      selectedList[0]["Item_CodeName"] = data.item_desc;
      selectedList[0]["item_text"] = null;
      selectedList[0]["add_duration"] = data.add_duration;
      selectedList[0]["checktype"] = "package";
      selectedList[0]["treat_parentcode"] = data.treatment_parentcode;

      await this.setState({
        selectedList,
        PackageIndex: PackageIndex + 1,
      });
      await this.props.updateForm("treatmentList", selectedList);
    } else if (selectedList[selectedList.length - 1]["Item_CodeName"] === "") {
      selectedList[selectedList.length - 1]["start_time"] =
        selectedList[selectedList.length - 1]["start_time"];
      // if (appointmentId) {
      selectedList[selectedList.length - 1]["end_time"] = this.addTimes(
        this.getHoursFromDate(
          selectedList[selectedList.length - 1]["start_time"]
        ),
        data.add_duration ? data.add_duration : "00:00"
      );
      // } else {
      //   selectedList[selectedList.length - 1]["end_time"] = this.addTimes(
      //     selectedList[selectedList.length - 1]["start_time"],
      //     data.add_duration ? data.add_duration : "00:00"
      //   );
      // }

      selectedList[selectedList.length - 1]["Item_Codeid"] = data.id;
      selectedList[selectedList.length - 1]["Item_CodeName"] = data.item_desc;
      selectedList[selectedList.length - 1]["item_text"] = null;
      selectedList[selectedList.length - 1]["add_duration"] = data.add_duration;
      selectedList[selectedList.length - 1]["checktype"] = "package";
      selectedList[selectedList.length - 1]["treat_parentcode"] =
        data.treatment_parentcode;

      await this.setState({
        selectedList,
        PackageIndex: PackageIndex + 1,
      });
      await this.props.updateForm("treatmentList", selectedList);
    } else if (
      selectedList[selectedList.length - 1]["Item_CodeName"] !== "" &&
      appointmentId
    ) {
      selectedList[selectedList.length - 1]["start_time"] =
        selectedList[selectedList.length - 1]["start_time"];
      // if (appointmentId) {
      selectedList[selectedList.length - 1]["end_time"] = this.addTimes(
        this.getHoursFromDate(
          selectedList[selectedList.length - 1]["start_time"]
        ),
        data.add_duration ? data.add_duration : "00:00"
      );
      // } else {
      //   selectedList[selectedList.length - 1]["end_time"] = this.addTimes(
      //     selectedList[selectedList.length - 1]["start_time"],
      //     data.add_duration ? data.add_duration : "00:00"
      //   );
      // }

      selectedList[selectedList.length - 1]["Item_Codeid"] = data.id;
      selectedList[selectedList.length - 1]["Item_CodeName"] = data.item_desc;
      selectedList[selectedList.length - 1]["item_text"] = null;
      selectedList[selectedList.length - 1]["add_duration"] = data.add_duration;
      selectedList[selectedList.length - 1]["checktype"] = "package";
      selectedList[selectedList.length - 1]["treat_parentcode"] =
        data.treatment_parentcode;

      await this.setState({
        selectedList,
        PackageIndex: PackageIndex + 1,
      });
      await this.props.updateForm("treatmentList", selectedList);
    } else {
      var listCount = selectedList.length - 1;
      let treatment = {};
      // if (appointmentId) {
      treatment["start_time"] = this.timeToDateFormat(
        selectedList[listCount]["end_time"]
      );
      // } else {
      //   treatment["start_time"] = selectedList[listCount]["end_time"];
      // }
      treatment["Item_Codeid"] = data.id;
      treatment["Item_CodeName"] = data.item_desc;
      treatment["item_text"] = null;
      treatment["add_duration"] = data.add_duration;
      treatment["checktype"] = "package";
      treatment["treat_parentcode"] = data.treatment_parentcode;
      selectedList.push(treatment);
      await this.setState({
        selectedList,
      });
      await this.props.updateForm("treatmentList", selectedList);
    }

    this.setState({ isOpenModal: false });
  };

  handleSelectTreatment = async data => {
    let { selectedList, index, appointmentId } = this.state;

    if (index == 0 && selectedList.length == 1) {
      selectedList[0]["start_time"] = selectedList[0]["start_time"];
      // if (appointmentId) {
      selectedList[0]["end_time"] = this.addTimes(
        this.getHoursFromDate(selectedList[0]["start_time"]),
        data.add_duration ? data.add_duration : "00:00"
      );
      // } else {
      //   selectedList[0]["end_time"] = this.addTimes(
      //     selectedList[0]["start_time"],
      //     data.add_duration ? data.add_duration : "00:00"
      //   );
      // }
      selectedList[0]["Item_Codeid"] = data.id;
      selectedList[0]["Item_CodeName"] = data.item_desc;
      selectedList[0]["add_duration"] = data.add_duration;
      selectedList[0]["checktype"] = "service";
      selectedList[0]["treat_parentcode"] = null;

      await this.setState({
        selectedList,
      });
      await this.props.updateForm("treatmentList", selectedList);
    } else {
      selectedList[index]["start_time"] = selectedList[index]["start_time"];
      // if (appointmentId) {
      selectedList[index]["end_time"] = this.addTimes(
        this.getHoursFromDate(selectedList[index]["start_time"]),
        data.add_duration ? data.add_duration : "00:00"
      );
      // } else {
      //   selectedList[index]["end_time"] = this.addTimes(
      //     selectedList[index]["start_time"],
      //     data.add_duration ? data.add_duration : "00:00"
      //   );
      // }
      selectedList[index]["Item_Codeid"] = data.id;
      selectedList[index]["Item_CodeName"] = data.item_desc;
      selectedList[index]["add_duration"] = data.add_duration;
      selectedList[index]["checktype"] = "service";
      selectedList[index]["treat_parentcode"] = null;

      let endTime = "";
      //if (appointmentId) {
      endTime = this.timeToDateFormat(selectedList[index]["end_time"]);
      // } else {
      //   endTime = selectedList[index]["end_time"];
      // }
      if (selectedList.length - 1 > index) {
        selectedList[index + 1]["start_time"] = endTime;
        if (selectedList[index + 1]["add_duration"] !== "") {
          selectedList[index + 1]["end_time"] = this.addTimes(
            selectedList[index]["end_time"],
            selectedList[index + 1]["add_duration"]
          );
        }
      }
      await this.setState({
        selectedList,
      });
      await this.props.updateForm("treatmentList", selectedList);
    }
    this.setState({ isOpenModal: false });
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

  // Add two times in hh:mm format
  addTimes = (t0, t1) => {
    return this.timeFromMins(this.timeToMins(t0) + this.timeToMins(t1));
  };

  // handleNewTimeChange = selectedTime => {
  //   let time = new Date(dateFormat(selectedTime));
  //   let selectedTimeNew = time.getTime();
  //   console.log(selectedTimeNew);
  //   let { selectedList, formFields } = this.state;
  //   formFields = {
  //     start_time: selectedTimeNew,
  //     end_time: "",
  //     add_duration: "",
  //   };
  // };

  handleAddtreatment = async index => {
    let { selectedList, formFields, appointmentId } = this.state;

    if (selectedList[index]["end_time"]) {
      let start = "";
      //if (appointmentId) {
      start = this.timeToDateFormat(
        selectedList[selectedList.length - 1].end_time
      );
      // } else {
      //   start = selectedList[selectedList.length - 1].end_time;
      // }
      formFields = {
        appt_id: null,
        start_time: start,
        end_time: "",
        Item_Codeid: this.state.freeTextStockId,
        add_duration: "",
        emp_no: 0,
        requesttherapist: false,
        recur_days: null,
        recur_qty: null,
        item_text: null,
        checktype: "",
        treat_parentcode: null,
      };
      selectedList.push({
        appt_id: null,
        start_time: start,
        end_time: "",
        Item_Codeid: this.state.freeTextStockId,
        Item_CodeName: "",
        add_duration: "",
        emp_no: 0,
        requesttherapist: false,
        recur_days: null,
        recur_qty: null,
        item_text: null,
        checktype: "",
        treat_parentcode: null,
      });

      await this.setState({ selectedList, formFields });

      await this.props.updateForm("treatmentList", selectedList);
    } else {
      Toast({ type: "error", message: "End time shouldn't be empty" });
    }
  };

  deleteTreatment = async (index, item) => {
    let { selectedList, DeletedList } = this.state;
    selectedList.splice(index, 1);
    DeletedList.push(item.appt_id);
    this.setState({ selectedList, DeletedList });
    await this.props.updateForm("treatmentList", selectedList);
  };

  handleTreatementmodal = () => {
    let { appointmentCustomerDetail } = this.props;
    let customerId = appointmentCustomerDetail.customerName;
    if (customerId > 0) {
      this.setState(prevState => ({
        isTreatementModal: !prevState.isTreatementModal,
      }));
    } else {
      Toast({ type: "error", message: "Please select customer" });
    }
  };
  // handleChangeremark = async ({ target: { value, name } }) => {
  //   let { formFields, selectedList } = this.state;
  //   formFields[name] = value;
  //   selectedList[0][name] = value;
  //   await this.setState({
  //     formFields,
  //     selectedList,
  //   });
  //   await this.props.updateForm("treatmentList", selectedList);
  // };

  handleCheckbox = async ({ target: { value, name } }, index) => {
    let { treatmentList } = this.state;
    let { selectedList } = this.state;
    selectedList[index]["requesttherapist"] = value;
    await this.setState({
      selectedList,
    });
    await this.props.updateForm("treatmentList", selectedList);
  };

  handleCloseDialog = async () => {
    this.props.handleCloseDialog();
  };
  handleSaveorUpdate = async () => {
    this.props.handleSaveorUpdate();
  };
  handleRecurringlistCheckbox = async ({ target: { value, name } }, item) => {
    let { recurringList } = this.state;
    let listCheckbox = recurringList.find(acc => acc.id === item.id);
    if (listCheckbox) {
      listCheckbox["selected"] = value;
      await this.setState({ ...this.state.recurringList, listCheckbox });
    }
    let Checkbox = recurringList.filter(acc => acc.selected === true).length;
    if (Checkbox == this.state.recurringList.length) {
      await this.setState({ recurringSelectAll: true });
    } else {
      await this.setState({ recurringSelectAll: false });
    }
  };

  handleRecurringSelectAllCheckbox = async ({ target: { value, name } }) => {
    let { recurringList } = this.state;
    await this.setState({ recurringSelectAll: value });
    for (let item of recurringList) {
      item["selected"] = value;
      await this.setState({ ...this.state.recurringList, item });
    }
  };
  handleCopyAppointment = async () => {
    let { appointmentId } = this.state;
    let formFields = {};
    formFields["appointmentId"] = appointmentId;
    await this.props.updateForm("AppointmentCopy", formFields);
    console.log(
      this.props.AppointmentCopy,
      "after copy click appointment copy id"
    );
    Toast({ type: "success", message: "Appointment copied" });
  };
  handlePasteAppointment = async () => {
    let { AppointmentCopy } = this.props;
    if (AppointmentCopy) {
      this.setState({
        PasteAppointmentId: AppointmentCopy.appointmentId,
        selectedList: [],
      });
      this.handleRenderApptDetail(AppointmentCopy.appointmentId, true);
    }
  };

  handleGotoCart = async () => {
    let { appointmentCustomerDetail } = this.props;
    let formFields = { custId: 0, custName: "" };
    formFields["custId"] = appointmentCustomerDetail.customerName;
    formFields["custName"] = appointmentCustomerDetail.custName;
    formFields["cust_refer"] = appointmentCustomerDetail.cust_refer;
    await this.props.updateForm("basicApptDetail", formFields);

    history.push("/admin/cart");
  };
  handleUpcomingAppointment = () => {
    let { appointmentCustomerDetail } = this.props;
    let customerId = appointmentCustomerDetail.customerName;
    if (customerId > 0) {
      this.setState(prevState => ({
        isUpcomingAppointmentModal: !prevState.isUpcomingAppointmentModal,
      }));
    } else {
      Toast({ type: "error", message: "Please select customer" });
    }
  };
  handleTreatmentHistory = () => {
    let { appointmentCustomerDetail } = this.props;
    let customerId = appointmentCustomerDetail.customerName;
    if (customerId > 0) {
      this.setState(prevState => ({
        isTreatmentHistoryModal: !prevState.isTreatmentHistoryModal,
      }));
    } else {
      Toast({ type: "error", message: "Please select customer" });
    }
  };

  handleAccordion = async index => {
    let { activeRow } = this.state;
    if (index === activeRow) {
      await this.setState({
        activeRow: "",
      });
    } else {
      await this.setState({
        activeRow: index,
      });
    }
  };
  handleLoginPopupCheck = async () => {
    let { settingData } = this.state;
    if (settingData.appt_pw) {
      let { isLoginConfirmation } = this.state;
      isLoginConfirmation = true;
      await this.setState({
        isLoginConfirmation,
      });
    } else {
      this.handleLoginSubmit();
    }
  };

  handleLoginConfirmationDialog = async () => {
    let { isLoginConfirmation } = this.state;
    isLoginConfirmation = false;
    await this.setState({
      isLoginConfirmation,
      dragusername: "",
      dragpassword: "",
    });
  };
  handleInputChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleLoginSubmit = () => {
    let { appointmentId } = this.state;
    if (appointmentId) {
      this.handleUpdate();
    } else {
      this.handleSubmit();
    }
  };
  toggle = key => {
    this.setState(prevState => ({
      [key]: !prevState[key],
    }));
  };
  render() {
    let {
      outletOption,
      staffOption,
      roomOption,
      selectedList,
      siteList,
      list,
      formFields,
      timeDropdown,
      duration,
      isOpenModal,
      treatmentField,
      treatmentList = [],
      categoryList,
      treatmentListHeader,
      meta,
      isTreatementModal,
      appointmentId,
      selectedRec_days,
      selectedRec_qty,
      recurringList,
      recurringSelectAll,
      settingData,
      PasteAppointmentId,
      isTreatmentHistoryModal,
      isUpcomingAppointmentModal,
      AppointmentListHeader,
      headerDetails,
      activeRow,
      isLoginConfirmation,
      passwordVisible,
      dragusername,
      dragpassword,
    } = this.state;
    let { customerDetail, selectedTreatmentList, customerId, t, tokenDetail } =
      this.props;
    let { outlet, staff, rooms } = customerDetail;

    return (
      <React.Fragment>
        {PasteAppointmentId <= 0 ? (
          <MobileAppointmentForm
            onRef={ref => (this.child = ref)}
            selectedCustomer={this.props.selectedCustomer}
            PasteAppointmentId={PasteAppointmentId}
          ></MobileAppointmentForm>
        ) : null}
        {PasteAppointmentId > 0 ? (
          <MobileAppointmentForm
            onRef={ref => (this.child = ref)}
            selectedCustomer={this.props.selectedCustomer}
            PasteAppointmentId={PasteAppointmentId}
          ></MobileAppointmentForm>
        ) : null}

        {selectedList.length == 0 ? (
          <div class="d-flex mt-5 align-items-center justify-content-center">
            {t("No Data")}
          </div>
        ) : (
          <div className="response-table w-100">
            {selectedList.length === selectedList.length - 1 + 1 ? (
              <div className="d-flex justify-content-end">
                <NormalButton
                  mainbg={true}
                  label={"Add New"}
                  onClick={() =>
                    this.handleAddtreatment(selectedList.length - 1)
                  }
                />
              </div>
            ) : null}
            {selectedList.length > 0 ? (
              selectedList.map((item, index) => {
                return (
                  <div
                    className={`mt-3 rounded border ${
                      activeRow === index ? "border-primary" : ""
                    }`}
                    key={index}
                  >
                    <div className="d-flex bg-light">
                      <div className="h6 fw-500 col-7 col-md-9 text-left text-dark ">
                        {index + 1}
                        {". "}
                        {item.Item_CodeName
                          ? item.Item_CodeName
                          : "Please Choose item"}
                      </div>

                      <div className="h6 col-2 col-md-1 text-center fw-700 align-items-center">
                        {selectedList.length > 1 && (
                          <div
                            className="cursor-pointer fs-15 p-1 border border-light"
                            onClick={() => this.deleteTreatment(index, item)}
                            tooltip="delete"
                          >
                            <span className="icon-delete"></span>
                          </div>
                        )}
                      </div>
                      <div
                        className="h6 col-2 col-md-1 text-center fw-700 align-items-center"
                        onClick={() => this.handleAccordion(index)}
                      >
                        {activeRow === index ? (
                          <div className="cursor-pointer fs-15 p-1 border border-light">
                            <span>
                              <AiOutlineMinus />
                            </span>
                          </div>
                        ) : (
                          <div className="cursor-pointer fs-15 p-1 border border-light">
                            <span>
                              <AiOutlinePlus />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {activeRow === index ? (
                      <div className="d-flex flex-wrap">
                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("Start Time")}
                          </label>

                          <div className="input-group">
                            <NormalTimePicker
                              onChange={e => this.handleDatePick(e, index)}
                              name="start_time"
                              timeOnly={true}
                              dateFormat={`HH:mm`}
                              showTime={true}
                              selected={false}
                              placeholder=""
                              timeIntervals={5}
                              value={item.start_time}
                              showIcon={false}
                            />
                          </div>
                        </div>

                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("End Time")}
                          </label>
                          <div className="input-group">
                            <NormalInput
                              type="text"
                              name="end_time"
                              value={item.end_time}
                              onChange={() => {}}
                              disabled={true}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("Item")}
                          </label>

                          <div className="input-group">
                            {settingData &&
                            settingData.service_sel &&
                            settingData.service_text ? (
                              <NormalInput
                                placeholder="service"
                                // options={siteList}
                                value={item.Item_CodeName}
                                name="Item_CodeName"
                                onDoubleClick={() =>
                                  this.setState({
                                    isOpenModal: true,
                                    index: index,
                                  })
                                }
                                onChange={e => this.handleChange(e, index)}
                              />
                            ) : null}
                            {settingData &&
                            settingData.service_sel &&
                            !settingData.service_text ? (
                              <NormalInput
                                placeholder="service"
                                // options={siteList}
                                value={item.Item_CodeName}
                                name="Item_CodeName"
                                onDoubleClick={() =>
                                  this.setState({
                                    isOpenModal: true,
                                    index: index,
                                  })
                                }
                                onChange={() => {}}
                              />
                            ) : null}
                            {settingData &&
                            !settingData.service_sel &&
                            settingData.service_text ? (
                              <NormalInput
                                placeholder="service"
                                // options={siteList}
                                value={item.Item_CodeName}
                                name="Item_CodeName"
                                onClick={() => {}}
                                onChange={e => this.handleChange(e, index)}
                              />
                            ) : null}
                            {settingData &&
                            !settingData.service_sel &&
                            !settingData.service_text ? (
                              <NormalInput
                                placeholder="service"
                                // options={siteList}
                                value={item.Item_CodeName}
                                name="Item_CodeName"
                                onClick={() => {}}
                                onChange={() => {}}
                              />
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("Duration")}
                          </label>

                          <div className="input-group">
                            <NormalSelect
                              // placeholder="Enter here"
                              options={duration}
                              value={item.add_duration}
                              name="add_duration"
                              onChange={e => this.handleChange(e, index)}
                              className="p-0"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("Staff")}
                          </label>

                          <div className="input-group">
                            <NormalSelect
                              // placeholder="Enter here"
                              options={staffOption}
                              value={item.emp_no}
                              name="emp_no"
                              onChange={e => this.handleChange(e, index)}
                              className="p-0"
                            />
                          </div>
                        </div>

                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("Req. Therapist")}
                          </label>
                          <div className="input-group">
                            {item.requesttherapist ? (
                              <NormalCheckbox
                                onChange={e => this.handleCheckbox(e, index)}
                                value={item.requesttherapist}
                                name="requesttherapist"
                                checked={true}
                              />
                            ) : (
                              <NormalCheckbox
                                onChange={e => this.handleCheckbox(e, index)}
                                value={item.requesttherapist}
                                name="requesttherapist"
                                checked={false}
                              />
                            )}
                          </div>
                        </div>

                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("Recur Days")}
                          </label>
                          <div className="input-group">
                            <NormalInput
                              type="number"
                              name="recur_days"
                              value={item.recur_days ? item.recur_days : ""}
                              onChange={e => this.handleChange(e, index)}
                              disabled={appointmentId ? true : false}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-12 mb-3">
                          <label className="text-left text-black common-label-text ">
                            {t("Recur Qty")}
                          </label>
                          <div className="input-group">
                            <NormalInput
                              type="number"
                              name="recur_qty"
                              value={item.recur_qty ? item.recur_qty : ""}
                              onChange={e => this.handleChange(e, index)}
                              disabled={appointmentId ? true : false}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            ) : (
              <div className="d-flex text-center w-100">{t("No Data")}</div>
            )}
          </div>
        )}

        {/* <TableWrapper
                    headerDetails={headerDetails}
                    // queryHandler={this.handlePagination}
                    // pageMeta={pageMeta}
                  >
                    {selectedList.length > 0
                      ? selectedList.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalTimePicker
                                    className={`cursor-pointer`}
                                    onChange={e =>
                                      this.handleDatePick(e, index)
                                    }
                                    label="start_time"
                                    name="start_time"
                                    timeOnly={true}
                                    dateFormat={`HH:mm`}
                                    showTime={true}
                                    selected={false}
                                    placeholder=""
                                    timeIntervals={5}
                                    value={item.start_time}
                                    showIcon={false}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    placeholder="end"
                                    // options={timeDropdown}
                                    value={item.end_time}
                                    name="end_time"
                                    onChange={() => {}}
                                    className="customer-name p-0"
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {settingData &&
                                  settingData.service_sel &&
                                  settingData.service_text ? (
                                    <NormalInput
                                      placeholder="service"
                                      // options={siteList}
                                      value={item.Item_CodeName}
                                      name="Item_CodeName"
                                      onDoubleClick={() =>
                                        this.setState({
                                          isOpenModal: true,
                                          index: index,
                                        })
                                      }
                                      onChange={e =>
                                        this.handleChange(e, index)
                                      }
                                      className="customer-name p-0 px-2"
                                    />
                                  ) : null}
                                  {settingData &&
                                  settingData.service_sel &&
                                  !settingData.service_text ? (
                                    <NormalInput
                                      placeholder="service"
                                      // options={siteList}
                                      value={item.Item_CodeName}
                                      name="Item_CodeName"
                                      onDoubleClick={() =>
                                        this.setState({
                                          isOpenModal: true,
                                          index: index,
                                        })
                                      }
                                      onChange={() => {}}
                                      className="customer-name p-0 px-2"
                                    />
                                  ) : null}
                                  {settingData &&
                                  !settingData.service_sel &&
                                  settingData.service_text ? (
                                    <NormalInput
                                      placeholder="service"
                                      // options={siteList}
                                      value={item.Item_CodeName}
                                      name="Item_CodeName"
                                      onClick={() => {}}
                                      onChange={e =>
                                        this.handleChange(e, index)
                                      }
                                      className="customer-name p-0 px-2"
                                    />
                                  ) : null}
                                  {settingData &&
                                  !settingData.service_sel &&
                                  !settingData.service_text ? (
                                    <NormalInput
                                      placeholder="service"
                                      // options={siteList}
                                      value={item.Item_CodeName}
                                      name="Item_CodeName"
                                      onClick={() => {}}
                                      onChange={() => {}}
                                      className="customer-name p-0 px-2"
                                    />
                                  ) : null}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalSelect
                                    // placeholder="Enter here"
                                    options={duration}
                                    value={item.add_duration}
                                    name="add_duration"
                                    onChange={e => this.handleChange(e, index)}
                                    className="customer-name p-0"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalSelect
                                    // placeholder="Enter here"
                                    options={staffOption}
                                    value={item.emp_no}
                                    name="emp_no"
                                    onChange={e => this.handleChange(e, index)}
                                    className="customer-name p-0"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {item.requesttherapist ? (
                                    <NormalCheckbox
                                      onChange={e =>
                                        this.handleCheckbox(e, index)
                                      }
                                      value={item.requesttherapist}
                                      name="requesttherapist"
                                      checked={true}
                                    />
                                  ) : (
                                    <NormalCheckbox
                                      onChange={e =>
                                        this.handleCheckbox(e, index)
                                      }
                                      value={item.requesttherapist}
                                      name="requesttherapist"
                                      checked={false}
                                    />
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    type="number"
                                    name="recur_days"
                                    value={
                                      item.recur_days ? item.recur_days : ""
                                    }
                                    onChange={e => this.handleChange(e, index)}
                                    disabled={appointmentId ? true : false}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    type="number"
                                    name="recur_qty"
                                    value={item.recur_qty ? item.recur_qty : ""}
                                    onChange={e => this.handleChange(e, index)}
                                    disabled={appointmentId ? true : false}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {selectedList.length === index + 1 ? (
                                    <div
                                      className="ml-3"
                                      onClick={() =>
                                        this.handleAddtreatment(index)
                                      }
                                    >
                                      <svg
                                        width="31"
                                        height="30"
                                        viewBox="0 0 31 30"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          width="31"
                                          height="30"
                                          fill="#F9F9F9"
                                        />
                                        <path
                                          d="M15 8V22"
                                          stroke="#848484"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M8 15H22"
                                          stroke="#848484"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <>
                                      {appointmentId && item.appt_id ? null : (
                                        <img
                                          width="25"
                                          height="25"
                                          onClick={() =>
                                            this.deleteTreatment(index)
                                          }
                                          className="ml-3"
                                          src={closeIcon}
                                          alt=""
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </TableWrapper> */}
        <div className="appointment-form">
          <div className="row">
            <div className="appointment">
              <div className="appointment-holder">
                <div className="treatment-section p-0">
                  {recurringList && recurringList.length > 0 ? (
                    <div className="mt-5 mb-3">
                      <div>
                        <p>Recurring Related Appointments</p>
                      </div>

                      <div className="row selected selected-header mb-2">
                        <div className="col-1">
                          <NormalCheckbox
                            label={`All`}
                            onChange={e =>
                              this.handleRecurringSelectAllCheckbox(e)
                            }
                            value={recurringSelectAll}
                            name="recurringSelectAll"
                            checked={recurringSelectAll}
                          />
                        </div>
                        <div className="col-2 p-0">{t("Date")}</div>
                        <div className="col-1 p-0">{t("Start")}</div>
                        <div className="col-1 p-0">{t("End")}</div>
                        <div className="col-3 p-0 header-detail">
                          {t("Service")}
                        </div>

                        <div className="col-1 p-0 header-detail">
                          {t("Duration")}
                        </div>
                        <div className="col-2 p-0">{t("Treatment staff")}</div>
                        <div className="col-1 p-0 d-flex justify-content-center">
                          <img
                            src={req_therapist}
                            alt=""
                            height="25"
                            width="25"
                          />
                        </div>
                      </div>
                      {recurringList && recurringList.length > 0 ? (
                        recurringList.map((item, index) => {
                          return (
                            <div className="row selected  mb-4" key={index}>
                              <div className="col-1 text-center">
                                <NormalCheckbox
                                  onChange={e =>
                                    this.handleRecurringlistCheckbox(e, item)
                                  }
                                  value={item.selected}
                                  name="recurringItem"
                                  checked={item.selected}
                                />
                              </div>
                              <div className="col-2 p-0">{item.date}</div>
                              <div className="col-1 p-0">{item.start_time}</div>
                              <div className="col-1 p-0">{item.end_time}</div>
                              <div className="col-3 p-0 header-detail">
                                {item.item_name}
                              </div>

                              <div className="col-1 p-0 header-detail">
                                {item.add_duration}
                              </div>
                              <div className="col-2 p-0">{item.emp_name}</div>
                              <div className="col-1 p-0 d-flex justify-content-center">
                                <NormalCheckbox
                                  onChange={e =>
                                    this.handleRecurringlistCheckbox(e, item)
                                  }
                                  value={item.requesttherapist}
                                  name="requesttherapist"
                                  checked={item.requesttherapist}
                                  disabled
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-12 text-center w-100">
                          {t("No Data")}
                        </div>
                      )}
                      <div className="d-flex justify-content-end">
                        <div className="mt-5">
                          <div className="d-flex justify-content-between">
                            <div>
                              <NormalButton
                                buttonClass={"treatment"}
                                resetbg={true}
                                className="col-12"
                                label="Cancel"
                                onClick={this.handleCloseDialog}
                              />
                            </div>
                            <div>
                              {appointmentId ? (
                                <NormalButton
                                  buttonClass={"submit-btn"}
                                  mainbg={false}
                                  className="col-12 submit-btn ml-4"
                                  label="Update Recurring"
                                  onClick={this.handleRecurringUpdate}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <NormalModal
            className={"multiple-appointment select-category"}
            style={{ minWidth: "60%" }}
            modal={isOpenModal}
            handleModal={this.handleDialog}
          >
            <img
              onClick={this.handleDialog}
              className="close"
              src={closeIcon}
              alt=""
            />
            <div className="customer-list container">
              <div className="col-12 pl-0 mb-3 fw-500 py-2">
                <h5>{t("Select Treatment")}</h5>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-6">
                    {t("Category")}
                    <NormalSelect
                      // placeholder="Enter here"
                      options={categoryList}
                      value={treatmentField.category}
                      name="category"
                      onChange={this.handleChangeTreatment}
                      className="customer-name p-0"
                    />
                  </div>
                  <div className="col-6">
                    {t("Service")}
                    <input
                      // placeholder="Enter here"
                      // options={siteList}
                      value={treatmentField.treatment}
                      name="treatment"
                      onChange={this.handleSearch}
                      className="search px-3 p-0"
                    />
                  </div>
                </div>
              </div>

              <div className="table-container table-responsive mt-3">
                <TableWrapper
                  headerDetails={treatmentListHeader}
                  queryHandler={this.handlePagination}
                  pageMeta={meta}
                >
                  {treatmentList.length > 0 ? (
                    treatmentList.map((item, index) => {
                      return (
                        <tr
                          className="w-100"
                          onClick={() => this.handleSelectTreatment(item)}
                          key={index}
                        >
                          <td>
                            {" "}
                            <div className="text-left">{item.Item_Class}</div>
                          </td>
                          <td>
                            {" "}
                            <div className="text-left">{item.item_desc}</div>
                          </td>
                          <td>
                            {" "}
                            <div className="text-left">{item.add_duration}</div>
                          </td>
                          <td>
                            {" "}
                            <div className="text-right">{item.item_price}</div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <td colSpan="12">
                      <div className="d-flex align-items-center justify-content-center">
                        {t("No data Available")}
                      </div>
                    </td>
                  )}
                </TableWrapper>
              </div>

              <div className="row text-center justify-center w-100">
                <NormalButton
                  buttonClass={"col-3"}
                  resetbg={true}
                  className="col-12 ml-4"
                  label="Cancel"
                  onClick={this.handleDialog}
                />
              </div>
            </div>
          </NormalModal>
          <NormalModal
            className={"d-flex justify-content-center"}
            style={{ minWidth: "20%" }}
            modal={isLoginConfirmation}
            handleModal={() => {}}
          >
            <img
              onClick={this.handleLoginConfirmationDialog}
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
                    onClick={this.handleLoginSubmit}
                    label="PROCEED"
                    className="col-12 submit-btn"
                  />
                </div>
              </div>
            </div>
          </NormalModal>
          <div className="col-12">
            {isTreatementModal ? (
              <TreatmentPackage
                isTreatementModal={isTreatementModal}
                handleTreatementmodal={this.handleTreatementmodal}
                handleSelectPackage={this.handleSelectPackage}
                customerNumber={
                  this.props.appointmentCustomerDetail.customerName
                }
                custName={this.props.appointmentCustomerDetail.custName}
                custPhone={this.props.appointmentCustomerDetail.custPhone}
                cust_refer={this.props.appointmentCustomerDetail.cust_refer}
                CustomerRemark={
                  this.props.appointmentCustomerDetail.cust_remark
                }
                CustomerRemarkFlag={false}
              />
            ) : (
              ""
            )}
          </div>
          {console.log(
            this.props.appointmentCustomerDetail,
            "appointmentcustomerdetail"
          )}
          {isTreatmentHistoryModal ? (
            <TreatmentHistory
              isTreatmentHistoryModal={isTreatmentHistoryModal}
              handleTreatmentHistory={this.handleTreatmentHistory}
              customerNumber={this.props.appointmentCustomerDetail.customerName}
              custName={this.props.appointmentCustomerDetail.custName}
              custPhone={this.props.appointmentCustomerDetail.custPhone}
              cust_refer={this.props.appointmentCustomerDetail.cust_refer}
              CustomerRemark={this.props.appointmentCustomerDetail.cust_remark}
              CustomerRemarkFlag={true}
            />
          ) : (
            ""
          )}
          {isUpcomingAppointmentModal ? (
            <UpcomingAppointment
              isUpcomingAppointmentModal={isUpcomingAppointmentModal}
              handleUpcomingAppointment={this.handleUpcomingAppointment}
              customerNumber={this.props.appointmentCustomerDetail.customerName}
              custName={this.props.appointmentCustomerDetail.custName}
              custPhone={this.props.appointmentCustomerDetail.custPhone}
              cust_refer={this.props.appointmentCustomerDetail.cust_refer}
              CustomerRemark={this.props.appointmentCustomerDetail.cust_remark}
              CustomerRemarkFlag={false}
            />
          ) : (
            ""
          )}
        </div>

        <div className="col-md-12 mt-2">
          <div className="d-flex flex-wrap justify-content-center">
            <NormalButton
              buttonClass={`p-2`}
              mainbg={true}
              className="col-12"
              label="Package"
              onClick={this.handleTreatementmodal}
            />
            <NormalButton
              buttonClass={`p-2`}
              mainbg={true}
              className="col-12"
              label="Upcoming"
              onClick={this.handleUpcomingAppointment}
            />
            <NormalButton
              buttonClass={`p-2`}
              mainbg={true}
              className="col-12"
              label="History"
              onClick={this.handleTreatmentHistory}
            />
            {/* {String(tokenDetail.role_code).toUpperCase() !== "4" &&
                appointmentId ? (
                  <NormalButton
                    buttonClass={`p-2`}
                    mainbg={true}
                    className="col-12"
                    label="Profile"
                    onClick={() =>
                      history.push(`/admin/customerplus/${customerId}/account`)
                    }
                  />
                ) : null}
                {String(tokenDetail.role_code).toUpperCase() !== "4" &&
                appointmentId ? (
                  <NormalButton
                    buttonClass={`p-2`}
                    mainbg={true}
                    className="col-12"
                    label="Cart"
                    onClick={this.handleGotoCart}
                  />
                ) : null} */}

            {!appointmentId &&
            this.props.AppointmentCopy &&
            this.props.AppointmentCopy.appointmentId > 0 ? (
              <NormalButton
                buttonClass={`p-2`}
                mainbg={true}
                className="col-12"
                label="Paste Appt."
                onClick={this.handlePasteAppointment}
              />
            ) : null}
            {appointmentId ? (
              <NormalButton
                buttonClass={`p-2`}
                mainbg={true}
                className="col-12"
                label="Copy Appt."
                onClick={this.handleCopyAppointment}
              />
            ) : null}
            <NormalButton
              buttonClass={`p-2`}
              resetbg={true}
              className="col-12"
              label="Cancel"
              onClick={this.handleCloseDialog}
            />

            <NormalButton
              buttonClass={`p-2`}
              submitBtn={true}
              label={appointmentId ? "Update" : "Confirm"}
              // onClick={e => {
              //   e.target.setAttribute("disabled", true);
              //   this.handleUpdate();
              // }}
              onClick={_.debounce(async () => {
                await this.handleLoginPopupCheck();
              }, 500)}
            />
            {/* {appointmentId ? (
              <NormalButton
                buttonClass={`p-2`}
                submitBtn={true}
                label="Update"
                onClick={this.handleUpdate}
              />
            ) : (
              <NormalButton
                buttonClass={`p-2`}
                submitBtn={true}
                className="col-12"
                label="Confirm"
                onClick={this.handleSubmit}
              />
            )} */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  customerDetail: state.appointment.customerDetail,
  appointmentDetail: state.appointment.appointmentDetail,
  selectedTreatmentList: state.appointment.selectedTreatmentList,
  basicApptDetail: state.appointment.basicApptDetail,
  appointmentCustomerDetail: state.appointment.appointmentCustomerDetail,
  appointmentTreatmentList: state.appointment.appointmentTreatmentList,
  AppointmentCopy: state.appointment.AppointmentCopy,
  tokenDetail: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateForm,
      getSelectedTreatmentList,
      getCommonApi,
      commonCreateApi,
      commonPatchApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const MobileSelectTreatment = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(MobileSelectTreatmentClass)
);
