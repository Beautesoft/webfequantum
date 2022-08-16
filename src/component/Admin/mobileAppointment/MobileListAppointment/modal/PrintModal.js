import React, { Component } from "react";
import {
  NormalButton,
  NormalModal,
  NormalCheckbox,
  NormalDate,
} from "component/common";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { dateFormat } from "service/helperFunctions";
import SimpleReactValidator from "simple-react-validator";
import { withTranslation } from "react-i18next";
export class PrintModalClass extends Component {
  state = {
    activeTab: "Tab1",
    staffList: [],
    siteCodeList: [],
    bookingList: [],
    secStatusList: [],
    formFields: {
      fromDate: new Date(),
      toDate: new Date(),
      Staff: "",
      Site: "",
      Booking: "",
      Sec_status: "",
    },
    employeeSelectAll: false,
    siteSelectAll: false,
    bookingSelectAll: false,
    secStatusSelectAll: false,
    PrintAs: "",
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
    this.getStaffList();
    this.getSiteCode();
    this.getBookingandSecondaryStatus();
  }

  handleDialog = () => {
    this.setState({
      staffList: [],
      siteCodeList: [],
      bookingList: [],
      secStatusList: [],
      formFields: {
        fromDate: new Date(),
        toDate: new Date(),
        Staff: "",
        Site: "",
        Booking: "",
        Sec_status: "",
      },
    });
    this.props.handlePrintDialog();
  };

  getStaffList = () => {
    this.setState({ staffList: [] });
    let { staffList } = this.state;
    this.props.getCommonApi(`employeebranchwise`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          staffList.push({
            value: value.id,
            label: value.display_name,
            selected: false,
          });
        }
        this.setState({ staffList });
      }
    });
  };
  getBookingandSecondaryStatus = () => {
    let { bookingList, secStatusList } = this.state;
    this.props.getCommonApi("bookingstatus/").then(res => {
      let { status, data, sec_data } = res;
      if (status === 200) {
        for (let value of data) {
          bookingList.push({
            value: value.value,
            label: value.label,
            selected: false,
          });
        }
        for (let value of sec_data) {
          secStatusList.push({
            value: value.value,
            label: value.label,
            selected: false,
          });
        }
        this.setState({ bookingList, secStatusList });
      }
    });
  };
  getSiteCode = () => {
    this.setState({ staffList: [] });
    let { siteCodeList } = this.state;
    this.props.getCommonApi(`branchlist/`).then(key => {
      let { status, data } = key;
      console.log(data, "sitecodelist");
      if (status === 200) {
        for (let value of data) {
          siteCodeList.push({
            value: value.id,
            label: value.itemsite_code,
            selected: false,
          });
        }
        this.setState({ siteCodeList });
      }
    });
  };
  handleCheckbox = async ({ target: { value, name } }, item) => {
    let { staffList, siteCodeList, bookingList, secStatusList } = this.state;

    if (name === "Staff") {
      let listCheckbox = staffList.find(acc => acc.value === item.value);
      if (listCheckbox) {
        listCheckbox["selected"] = value;
        await this.setState({ ...this.state.staffList, listCheckbox });
      }
      let Checkbox = staffList.filter(acc => acc.selected === true).length;
      if (Checkbox == this.state.staffList.length) {
        await this.setState({ employeeSelectAll: true });
      } else {
        await this.setState({ employeeSelectAll: false });
      }
    }
    if (name === "Site") {
      let listCheckbox = siteCodeList.find(acc => acc.value === item.value);
      if (listCheckbox) {
        listCheckbox["selected"] = value;
        await this.setState({ ...this.state.siteCodeList, listCheckbox });
      }
      let Checkbox = siteCodeList.filter(acc => acc.selected === true).length;
      if (Checkbox == this.state.siteCodeList.length) {
        await this.setState({ siteSelectAll: true });
      } else {
        await this.setState({ siteSelectAll: false });
      }
    }
    if (name === "Booking") {
      let listCheckbox = bookingList.find(acc => acc.value === item.value);
      if (listCheckbox) {
        listCheckbox["selected"] = value;
        await this.setState({ ...this.state.bookingList, listCheckbox });
      }
      let Checkbox = bookingList.filter(acc => acc.selected === true).length;
      if (Checkbox == this.state.bookingList.length) {
        await this.setState({ bookingSelectAll: true });
      } else {
        await this.setState({ bookingSelectAll: false });
      }
    }
    if (name === "Sec_status") {
      let listCheckbox = secStatusList.find(acc => acc.value === item.value);
      if (listCheckbox) {
        listCheckbox["selected"] = value;
        await this.setState({ ...this.state.secStatusList, listCheckbox });
      }
      let Checkbox = secStatusList.filter(acc => acc.selected === true).length;
      if (Checkbox == this.state.secStatusList.length) {
        await this.setState({ secStatusSelectAll: true });
      } else {
        await this.setState({ secStatusSelectAll: false });
      }
    }
  };
  sendAppointmentListPrint = async printAs => {
    let {
      staffList,
      siteCodeList,
      bookingList,
      secStatusList,
      formFields,
      PrintAs,
    } = this.state;
    await this.setState({ PrintAs: printAs });
    var finalstaff = "";
    var finalsite = "";
    var finalbooking = "";
    var finalSecStatus = "";
    for (var staffItem of staffList) {
      if (staffItem.selected) {
        if (finalstaff !== "") {
          finalstaff += "," + staffItem.value;
        } else {
          finalstaff += staffItem.value;
        }
      }
    }
    for (var siteItem of siteCodeList) {
      if (siteItem.selected) {
        if (finalsite !== "") {
          finalsite += "," + siteItem.value;
        } else {
          finalsite += siteItem.value;
        }
      }
    }
    for (var bookingItem of bookingList) {
      if (bookingItem.selected) {
        if (finalbooking !== "") {
          finalbooking += "," + bookingItem.value;
        } else {
          finalbooking += bookingItem.value;
        }
      }
    }
    for (var secItem of secStatusList) {
      if (secItem.selected) {
        if (finalSecStatus !== "") {
          finalSecStatus += "," + secItem.value;
        } else {
          finalSecStatus += secItem.value;
        }
      }
    }
    formFields["Staff"] = finalstaff;
    formFields["Site"] = finalsite;
    formFields["Booking"] = finalbooking;
    formFields["Sec_status"] = finalSecStatus;
    await this.setState({
      formFields,
    });
    this.AppointmentListPrint();
  };

  AppointmentListPrint = () => {
    let { formFields, PrintAs } = this.state;
    this.props
      .getCommonApi(
        `appointmentlistpdf/?type=${PrintAs}&start_date=${dateFormat(
          formFields.fromDate,
          "yyyy-mm-dd"
        )}&end_date=${dateFormat(formFields.toDate, "yyyy-mm-dd")}&emp_ids=${
          formFields.Staff
        }&site_ids=${formFields.Site}&status=${formFields.Booking}&sec_status=${
          formFields.Sec_status
        }`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          this.handleDialog();
          window.open(data);
        }
      });
  };
  handleChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;

    if (name === "fromDate") {
      formFields["toDate"] = value;
    }

    if (name === "toDate") {
      let fromdate = new Date(dateFormat(formFields.fromDate));
      let enddate = new Date(dateFormat(value));
      if (enddate < fromdate) {
        Toast({ type: "error", message: "Please enter valid date" });
        formFields["toDate"] = formFields.fromDate;
      }
    }
    await this.setState({ formFields });
  };
  changeTab = async data => {
    await this.setState({ activeTab: data });
  };

  handleSelectAllCheckbox = async ({ target: { value, name } }) => {
    let {
      staffList,
      siteCodeList,
      bookingList,
      secStatusList,
      employeeSelectAll,
      siteSelectAll,
      bookingSelectAll,
      secStatusSelectAll,
    } = this.state;

    if (name === "employeeSelectAll") {
      await this.setState({ employeeSelectAll: value });
      for (let item of staffList) {
        item["selected"] = value;
        await this.setState({ ...this.state.staffList, item });
      }
    }
    if (name === "siteSelectAll") {
      await this.setState({ siteSelectAll: value });
      for (let item of siteCodeList) {
        item["selected"] = value;
        await this.setState({ ...this.state.siteCodeList, item });
      }
    }
    if (name === "bookingSelectAll") {
      await this.setState({ bookingSelectAll: value });
      for (let item of bookingList) {
        item["selected"] = value;
        await this.setState({ ...this.state.bookingList, item });
      }
    }
    if (name === "secStatusSelectAll") {
      await this.setState({ secStatusSelectAll: value });
      for (let item of secStatusList) {
        item["selected"] = value;
        await this.setState({ ...this.state.secStatusList, item });
      }
    }
  };

  render() {
    let { isOpenPrintModal, t } = this.props;
    let {
      activeTab,
      staffList,
      formFields,
      siteCodeList,
      bookingList,
      secStatusList,
      employeeSelectAll,
      siteSelectAll,
      bookingSelectAll,
      secStatusSelectAll,
    } = this.state;

    return (
      <NormalModal
        className={"printModal"}
        style={{ minWidth: "50%" }}
        modal={isOpenPrintModal}
        handleModal={this.handleDialog}
      >
        <img
          onClick={this.handleDialog}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="row py-2">
          <div className="col-4 ml-2">
            <div
              className={`card text-center p-1 print activeColor ${
                activeTab === "Tab1" ? "active" : ""
              }`}
              onClick={() => this.changeTab("Tab1")}
            >
              {t("Appointment Report")}
            </div>
          </div>
          {/* <div className="col-4 ml-2">
            <div
              className={`card text-center p-1 activeColor ${
                activeTab === "Tab2" ? "active" : ""
              }`}
              onClick={() => this.changeTab("Tab2")}
            >
              Products
            </div>
          </div> */}
        </div>
        {activeTab === "Tab1" ? (
          <>
            <div className="d-flex flex-wrap justify-content-start p-3">
              <div className="col-md-6 col-6 mb-3">
                <label className="text-left text-black common-label-text ">
                  {t("From Date")}{" "}
                  <span className="error-message text-danger validNo fs-18">
                    *
                  </span>
                </label>
                <div className="input-group">
                  <NormalDate
                    className="customer-name status py-1 col-12"
                    value={new Date(formFields.fromDate)}
                    name="fromDate"
                    type="date"
                    popperPlacement="top-right"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message(
                  "fromDate",
                  formFields.fromDate,
                  "required|date"
                )}
              </div>
              <div className="col-md-6 col-6 mb-3">
                <label className="text-left text-black common-label-text ">
                  {t("To Date")}{" "}
                  <span className="error-message text-danger validNo fs-18">
                    *
                  </span>
                </label>
                <div className="">
                  <NormalDate
                    className="customer-name status py-1 col-12"
                    value={new Date(formFields.toDate)}
                    name="toDate"
                    type="date"
                    onChange={this.handleChange}
                    popperPlacement="top-right"
                    minDate={new Date(formFields.fromDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                {this.validator.message(
                  "toDate",
                  formFields.toDate,
                  "required|date"
                )}
              </div>
              <div className="col-md-6 col-6 mb-3">
                <div className="row mb-4 mt-2 mx-3">
                  <div className={`row`}>
                    <div>
                      <NormalCheckbox
                        onChange={e => this.handleSelectAllCheckbox(e)}
                        value={employeeSelectAll}
                        name="employeeSelectAll"
                        checked={employeeSelectAll}
                      />
                    </div>
                    <div>{t("Employee Name")}</div>
                  </div>

                  <div className="col-md-12 col-12 response-table fw-500 multiselectList-height fs-13">
                    {staffList && staffList.length > 0 ? (
                      staffList.map((item, index) => {
                        return (
                          <div
                            className={`d-flex justify-content-start m-0 table-body w-100 p-1 border border-secondary staff-sort-list ${
                              item.selected ? "active" : ""
                            } `}
                            key={item.value}
                          >
                            <div className="col-3 text-center">
                              <NormalCheckbox
                                onChange={e => this.handleCheckbox(e, item)}
                                value={item.selected}
                                name="Staff"
                                checked={item.selected}
                              />
                            </div>
                            <div className="col-8">{item.label}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center w-100"></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-6 mb-3">
                <div className="row mb-4 mt-2 mx-3">
                  <div className="row">
                    <div>
                      <NormalCheckbox
                        onChange={e => this.handleSelectAllCheckbox(e)}
                        value={siteSelectAll}
                        name="siteSelectAll"
                        checked={siteSelectAll}
                      />
                    </div>
                    <div>
                      {t("Site")} {t("Code")}
                    </div>
                  </div>
                  <div className="col-md-12 col-12 response-table fw-500 multiselectList-height fs-13">
                    {siteCodeList && siteCodeList.length > 0 ? (
                      siteCodeList.map((item, index) => {
                        return (
                          <div
                            className={`d-flex justify-content-start m-0 table-body w-100 p-1 border border-secondary staff-sort-list ${
                              item.selected ? "active" : ""
                            } `}
                            key={index}
                          >
                            <div className="col-3 text-center">
                              <NormalCheckbox
                                onChange={e => this.handleCheckbox(e, item)}
                                value={item.selected}
                                name="Site"
                                checked={item.selected}
                              />
                            </div>
                            <div className="col-8">{item.label}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center w-100"></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-6 mb-3">
                <div className="row mb-2 mx-3">
                  <div className="row">
                    <div>
                      <NormalCheckbox
                        onChange={e => this.handleSelectAllCheckbox(e)}
                        value={bookingSelectAll}
                        name="bookingSelectAll"
                        checked={bookingSelectAll}
                      />
                    </div>
                    <div>{t("Booking Status")}</div>
                  </div>
                  <div className="col-md-12 col-12 response-table fw-500 multiselectList-height fs-13">
                    {bookingList && bookingList.length > 0 ? (
                      bookingList.map((item, index) => {
                        return (
                          <div
                            className={`d-flex justify-content-start m-0 table-body w-100 p-1 border border-secondary staff-sort-list ${
                              item.selected ? "active" : ""
                            } `}
                            key={item.value}
                          >
                            <div className="col-3 text-center">
                              <NormalCheckbox
                                onChange={e => this.handleCheckbox(e, item)}
                                value={item.selected}
                                name="Booking"
                                checked={item.selected}
                              />
                            </div>
                            <div className="col-8">{item.label}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center w-100"></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-6 mb-3">
                <div className="row mb-2 mx-3">
                  <div className="row">
                    <div>
                      <NormalCheckbox
                        onChange={e => this.handleSelectAllCheckbox(e)}
                        value={secStatusSelectAll}
                        name="secStatusSelectAll"
                        checked={secStatusSelectAll}
                      />
                    </div>
                    <div>{t("Secondary Status")}</div>
                  </div>
                  <div className="col-md-12 col-12 response-table fw-500 multiselectList-height fs-13">
                    {secStatusList && secStatusList.length > 0 ? (
                      secStatusList.map((item, index) => {
                        return (
                          <div
                            className={`d-flex justify-content-start m-0 table-body w-100 p-1 border border-secondary staff-sort-list ${
                              item.selected ? "active" : ""
                            } `}
                            key={item.value}
                          >
                            <div className="col-3 text-center">
                              <NormalCheckbox
                                onChange={e => this.handleCheckbox(e, item)}
                                value={item.selected}
                                name="Sec_status"
                                checked={item.selected}
                              />
                            </div>
                            <div className="col-8">{item.label}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center w-100"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <div className="col-2">
                <NormalButton
                  buttonClass={"w-100  p-0"}
                  mainbg={true}
                  className="confirm"
                  label={`Pdf`}
                  outline={false}
                  onClick={() => this.sendAppointmentListPrint("Pdf")}
                />
              </div>
              <div className="col-2">
                <NormalButton
                  buttonClass={"w-100  p-0"}
                  mainbg={true}
                  className="confirm"
                  label={`Excel`}
                  outline={false}
                  onClick={() => this.sendAppointmentListPrint("Excel")}
                />
              </div>
              <div className="col-2">
                <NormalButton
                  buttonClass={"w-100 p-0"}
                  mainbg={true}
                  className="confirm"
                  label={`Cancel`}
                  outline={false}
                  onClick={this.handleDialog}
                />
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </NormalModal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
    },
    dispatch
  );
};

export const PrintModal = withTranslation()(
  connect(null, mapDispatchToProps)(PrintModalClass)
);
