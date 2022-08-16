import React, { Component } from "react";
import { NewSchedulerModal } from "component/common/Plugins/NewScheduler";
// import BigSchedulerModal from 'component/common/Plugins/BigScheduler';

import {
  getCustomer,
  getCommonApi,
  commonDeleteApi,
} from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import timeOption from 'data/timeOption.json'
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import "./style.scss";
import SimpleReactValidator from "simple-react-validator";
import { CreateAppointment, updateForm } from "redux/actions/appointment";
import { NewCreateAppointment } from "../../NewCreateAppointment/index";
import { LoadPanel } from "devextreme-react/load-panel";
import moment from "moment";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

export class SchedulerClass extends Component {
  state = {
    appointment: [
      {
        time: "10.00 AM,",
        date: "Wednesday, 1st April, 2020",
        name: "Benjamin",
        treatment: "Head Massage",
      },
      {
        time: "12.00 PM,",
        date: "Wednesday, 1st April, 2020",
        name: "Daniel",
        treatment: "Pedicure",
      },
      {
        time: "1.00 PM,",
        date: "Wednesday, 1st April, 2020",
        name: "John",
        treatment: "Haircut",
      },
      {
        time: "2.00 PM,",
        date: "Wednesday, 1st April, 2020",
        name: "Josua",
        treatment: "Manicure",
      },
      {
        time: "4.00 PM, ",
        date: "Wednesday, 1st April, 2020",
        name: "Derrik",
        treatment: "Body Massage",
      },
    ],
    events: [],
    brachList: [],
    formField: {
      branchId: "",
      time: "",
      staff_id: "",
    },
    list: [],
    filterDate: new Date(),
    filterType: "day",
    selectedId: "",
    staffList: [],
    page: 1,
    meta: [],
    searchtext: "",
    staffSortlist: [],
    isOpenModal: false,
    loadPanelVisible: false,
    showIndicator: true,
    shading: true,
    showPane: true,
    groupByType: "staff",
    SchedulerSetting: {
      settingId: 0,
      startday_hour: "",
      endday_hour: "",
      cell_duration: "",
      resource_count: "",
    },
    settingData: {},
  };

  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };
  componentDidMount = () => {
    this.getSettingInfo();
    this.handleItemSettings();
  };

  handleItemSettings = () => {
    let { settingData } = this.state;
    this.props.getCommonApi(`userlist/`).then(async key => {
      let { status, data } = key;
      console.log(key, "settingsData AppointmentCreate");
      if (status === 200) {
        settingData = data;
        await this.setState({
          settingData,
        });
      }
    });
  };
  getSettingInfo = () => {
    let { SchedulerSetting } = this.state;
    this.props.getCommonApi(`siteappointsetting/`).then(async key => {
      let { status, data } = key;
      console.log(key, "siteappointsetting");
      if (status == "200") {
        if (data) {
          SchedulerSetting["settingId"] = data[0].id;
          SchedulerSetting["startday_hour"] = data[0].startday_hour
            ? Number(data[0].startday_hour)
            : 8;
          SchedulerSetting["endday_hour"] = data[0].endday_hour
            ? Number(data[0].endday_hour)
            : 21;
          SchedulerSetting["cell_duration"] = data[0].cell_duration
            ? Number(data[0].cell_duration)
            : 15;
          if (isMobile) {
            SchedulerSetting["resource_count"] = 1;
          } else {
            SchedulerSetting["resource_count"] = data[0].resource_count
              ? Number(data[0].resource_count)
              : 5;
          }

          console.log(SchedulerSetting, "siteappointsettingafterrender");
          await this.setState({
            SchedulerSetting,
          });
          await this.props.updateForm("SchedulerSetting", SchedulerSetting);
          let { filterDate, filterType } = this.state;
          // this.props
          //   .getCommonApi(
          //     `customeroutstanding/?date=${dateFormat(
          //       filterDate
          //     )}&check=${filterType}`
          //   )
          //   .then(key => {});
          this.getAppointmentWithStaff();
        }
      }
    });
  };

  getHoursFromDate = date => {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let hours = hour > 9 ? hour : "0" + hour;
    let minutes;
    if (minute < 15) {
      minutes = "00";
    } else if (minute >= 15 && minute < 30) {
      minutes = "15";
    } else if (minute >= 30 && minute < 45) {
      minutes = "30";
    } else if (minute >= 45 && minute < 59) {
      minutes = "45";
    }
    return hours + ":" + minutes;
  };

  handleEmptyEvent = async (date, e) => {
    let { customerDetail } = this.props;
    let { formField } = this.state;

    let time = new Date(date);

    formField["time"] = this.getHoursFromDate(time);
    formField["date"] = date;
    formField["appt_id"] = 0;
    if (e.groups) {
      formField["staff_id"] = e.groups.id;
    }
    if (e.appt_id) {
      formField["appt_id"] = e.appt_id;
    }

    await this.setState({ formField });
    console.log(
      date,
      e,
      "hgjsydfisuyfsdfm ==== handleEmptyEvent",
      time.getHours
    );
    await this.props.updateForm("basicApptDetail", formField);
    await this.setState({ isOpenModal: true });
  };
  handleCloseDialog = async () => {
    await this.props.updateForm("treatmentList", []);
    await this.props.updateForm("basicApptDetail", {});
    await this.props.updateForm("appointmentCustomerDetail", {});
    await this.setState({
      isOpenModal: false,
    });
  };

  handleChangeFilter = async (prevMode, prevDate, newMode, newDate, search) => {
    let { filterDate, filterType, searchtext } = this.state;
    filterDate = newDate;
    filterType = newMode;
    searchtext = search;
    await this.setState({
      filterDate,
      filterType,
      searchtext,
    });
    //if (newMode === "day" || newMode === "week") {
    // this.props
    //   .getCommonApi(
    //     `customeroutstanding/?date=${dateFormat(newDate)}&check=${newMode}`
    //   )
    //   .then(key => {});
    //}
    console.log("dfhgfhjhjghjdfhg", prevMode, prevDate, newMode, newDate);
    if (prevMode !== newMode || prevDate !== newDate) {
      this.getAppointmentWithStaff();
    }
  };

  handleChange = async ({ target: { value, name } }) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
    if (name === "branchId") {
      this.getAppointmentWithStaff();
    }
    this.props.updateForm("basicApptDetail", formField);
  };

  handleDelete = async (id, event) => {
    let { selectedId } = this.state;
    console.log(id, "===afasfasdfdfasd=====", selectedId);
    if (id !== selectedId) {
      await this.setState({
        selectedId: id,
      });
      await this.props.commonDeleteApi(`appointment/${id}/`).then(res => {});
    }
  };

  handleOpenStaff = (one, two, three) => {
    console.log("namdfsfgsghsfghf", one, two, three);
    let { filterDate } = this.state;
    this.props.handleOpen(filterDate);
  };

  getAppointmentWithStaff = () => {
    this.setState(
      {
        loadPanelVisible: true,
      },
      () => {
        let {
          filterDate,
          filterType,
          page,
          searchtext,
          staffList,
          events,
          meta,
          groupByType,
        } = this.state;

        this.props
          .getCommonApi(
            `empappointmentview/?date=${dateFormat(
              filterDate
            )}&check=${filterType}&page=${page}&limit=${Number(
              this.props.SchedulerSetting.resource_count
            )}&search=${searchtext}&type=${groupByType}`
          )
          .then(async key => {
            console.log(
              "starttime: ",
              moment(new Date(), "DD/MM/YYYY HH:mm:ss")
            );
            let { status, data, event } = key;
            setTimeout(this.hideLoadPanel);
            if (status === 200) {
              if (data) {
                staffList = [];
                if (data.dataList.length > 0) {
                  staffList = data.dataList;
                }
                events = [];
                meta = [];
                //this.setState({ events, meta });
                meta = data.meta;
                //events = event;

                if (event.length > 0) {
                  events = event;
                  // event.forEach(cell => {
                  //   let filterList = events.find(
                  //     Appoint =>
                  //       Appoint.linkcode === cell.linkcode &&
                  //       Appoint.id === cell.id &&
                  //       Appoint.cust_id === cell.cust_id &&
                  //       (Appoint.endDate === cell.startDate ||
                  //         Appoint.startDate === cell.endDate)
                  //   );
                  //   if (filterList) {
                  //     if (filterList.startDate < cell.startDate) {
                  //       filterList["startDate"] = filterList.startDate;
                  //     } else {
                  //       filterList["startDate"] = cell.startDate;
                  //     }
                  //     if (filterList.endDate > cell.endDate) {
                  //       filterList["endDate"] = filterList.endDate;
                  //     } else {
                  //       filterList["endDate"] = cell.endDate;
                  //     }
                  //     filterList["appt_remark"] =
                  //       filterList.appt_remark + " " + "/" + " " + cell.appt_remark;
                  //     filterList["Merged"] = true;
                  //     this.setState({ ...this.state.events, filterList });
                  //   } else {
                  //     events.push(cell);
                  //     this.setState({ ...events, events });
                  //   }
                  // });
                }
                await this.setState({ events, meta, staffList });
                console.log(
                  "endtime: ",
                  moment(new Date(), "DD/MM/YYYY HH:mm:ss")
                );
                // await this.setState({ events, staffList, meta });

                //console.log(event, "appointment cell data");
              }
            }
          });
      }
    );
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getAppointmentWithStaff();
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getAppointmentWithStaff();
    }
  };
  hideLoadPanel = async () => {
    let loadPanelVisible = Object.assign({}, this.state.loadPanelVisible);
    loadPanelVisible = false;
    await this.setState({
      loadPanelVisible,
    });
  };

  groupByAppointment = async groupBy => {
    await this.setState({
      groupByType: groupBy,
    });
    this.getAppointmentWithStaff();
  };
  timeToMins = time => {
    var b = time.split(":");
    return b[0] * 60 + +b[1];
  };

  render() {
    let {
      appointment,
      brachList,
      branchId,
      formField,
      list,
      events,
      filterType,
      filterDate,
      staffList,
      meta,
      searchtext,
      staffSortlist,
      isLoading,
      isOpenModal,
      SchedulerSetting,
    } = this.state;

    return (
      <div className="col-12 m-0" id="appointment">
        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          position={`center`}
          onHiding={this.hideLoadPanel}
          visible={this.state.loadPanelVisible}
          showIndicator={this.state.showIndicator}
          shading={this.state.shading}
          showPane={this.state.showPane}
        />

        <NewSchedulerModal
          staffList={this.state.staffList}
          meta={this.state.meta}
          event={this.state.events}
          onEmptyClick={(date, e) => this.handleEmptyEvent(date, e)}
          handleChangeFilter={this.handleChangeFilter}
          filterType={filterType}
          filterDate={filterDate}
          searchtext={searchtext}
          onDeleteEvent={this.handleDelete}
          handleBack={this.handleBack}
          handleNext={this.handleNext}
          staffSortlist={this.state.staffSortlist}
          getAppointmentWithStaff={this.getAppointmentWithStaff}
          groupByAppointment={groupBy => this.groupByAppointment(groupBy)}
          handleAppointmentSetting={this.getSettingInfo}
          settingData={this.state.settingData}
        />

        <NewCreateAppointment
          isOpenModal={isOpenModal}
          handleCloseDialog={this.handleCloseDialog}
          handleSaveorUpdate={this.getAppointmentWithStaff}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customerDetail: state.appointment.customerDetail,
  customerList: state.common.customerList,
  multipleCustomerForm: state.appointment.multipleCustomerForm,
  SchedulerSetting: state.appointment.SchedulerSetting,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomer,
      getCommonApi,
      updateForm,
      commonDeleteApi,
    },
    dispatch
  );
};

export const Scheduler = connect(
  mapStateToProps,
  mapDispatchToProps
)(SchedulerClass);
