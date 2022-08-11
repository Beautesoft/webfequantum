import React, { Component } from "react";
import {
  NormalButton,
  NormalSelect,
  NormalModal,
  NormalCheckbox,
  NormalDateTime,
  NormalDate,
} from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import "./style.scss";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";
import { CredentialConfirmation } from "component/Admin/Cart/credentialConfirmation";
import moment from "moment";
import Payslip from "../Payslippdf/Payslip";

import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";

export class PayrollMainClass extends Component {
  state = {
    page: 1,
    limit: 10,
    selectAll: false,
    headerDetails: [
      {
        label: "",
        width: "20px",
        selectAll: true,
        selectAllCheck: false,
        checkboxChange: e => this.handleSelectAllCheckbox(e),
      },
      { label: "Staff ID" },
      { label: "NRIC" },
      {
        label: "Staff Name",
        divClass: "",
        width: "125px",
      },
      {
        label: "Site",
        divClass: "",
        width: "120px",
      },
      { label: "Emp Level" },
      { label: "Basic" },
      { label: "OT" },

      { label: "Commission" },
      { label: "Others" },
      { label: "Total" },
      { label: "Status" },
    ],
    pageMeta: {},
    formField: {
      pay_month: "",
      pay_year: "",
      pay_site: "",
      pay_active: "",
      pay_EmpLevel: "",
      pay_status: "",
      searchText: "",
      fromDate: new Date(),
    },
    active: false,
    currentIndex: -1,
    payStatusOptions: [
      { value: "new", label: "New" },
      { value: "open", label: "Open" },
      { value: "posted", label: "Posted" },
    ],
    payEmpLevelOptions: [],
    paySiteOptions: [],
    payYearOptions: [],
    payMonthOptions: [
      { value: 1, label: "Jan" },
      { value: 2, label: "Feb" },
      { value: 3, label: "Mar" },
      { value: 4, label: "Apr" },
      { value: 5, label: "May" },
      { value: 6, label: "Jun" },
      { value: 7, label: "Jul" },
      { value: 8, label: "Aug" },
      { value: 9, label: "Sep" },
      { value: 10, label: "Oct" },
      { value: 11, label: "Nov" },
      { value: 12, label: "Dec" },
    ],
    payActiveOptions: [
      { value: 1, label: "Active" },
      { value: 0, label: "In Active" },
      { value: "", label: "All" },
    ],
    isLoginConfirmation: false,
    isAllow: false,
    selected: false,
    isPrintPdfClick: false,
    PayrollList: [
      // {
      // payrollId: "1",
      // EmpName: "kaleeswaran",
      // EmpCode: "HS010121",
      // nric: "",
      // FromDate: new Date(),
      // toDate: new Date(),
      // BasicSalary: "60000",
      // hourlySalHour: "",
      // hourlySalRate: "",
      // firstOverTimeRate: "",
      // firstOverTimeHour: "",
      // totOTPay: "",
      // totCommission: "",
      // totAllowance: "",
      // totDeduct: "",
      // AddPay: "",
      // netPay: "",
      // empCPFCont: "",
      // dateofPay: new Date(),
      // modeofPayId: "",
      // modeofPay: "",
      // secondOverTimeHour: "",
      // secondOverTimeRate: "",
      // TotAllowanceList: [
      //   { desc: "desc", type: 2, typeName: "totallowtype2", amount: 500 },
      // ],
      // TotDeductionList: [
      //   {
      //     desc: "deducdesc",
      //     type: 1,
      //     typeName: "totdeductype1",
      //     amount: 200,
      //   },
      // ],
      // AddPaymentList: [
      //   {
      //     desc: "paydesc",
      //     type: 3,
      //     typeName: "paytype3",
      //     amount: 300,
      //   },
      // ],
      // checkbox: false,
      //  },
      // {
      // payrollId: "2",
      // EmpName: "rajan",
      // EmpCode: "HS010121",
      // FromDate: new Date(),
      // nric: "",
      // toDate: new Date(),
      // BasicSalary: "2000",
      // hourlySalHour: "",
      // hourlySalRate: "",
      // firstOverTimeRate: "",
      // firstOverTimeHour: "",
      // totOTPay: "",
      // totCommission: "",
      // totAllowance: "",
      // totDeduct: "",
      // AddPay: "",
      // netPay: "",
      // empCPFCont: "",
      // dateofPay: new Date(),
      // modeofPayId: "",
      // modeofPay: "",
      // secondOverTimeHour: "",
      // secondOverTimeRate: "",
      // TotAllowanceList: [],
      // TotDeductionList: [],
      // AddPaymentList: [],
      // checkbox: false,
      //  },
    ],
    accountHeader: { name: "Employer name", address: "", logo: "" },
  };

  componentDidMount() {
    if (this.props.tokenDetails.emp_payroll_setup) {
      this.setState({
        isLoginConfirmation: true,
      });
    }

    let From = new Date();
    let { formField } = this.state;
    let firstdayMonth = new Date(From.getFullYear() - 20, From.getMonth(), 1);
    formField["fromDate"] = firstdayMonth;
    this.setState({
      formField,
    });
    let { payEmpLevelOptions, payStatusOptions } = this.state;
    this.props.getCommonApi("jobtitle/").then(res => {
      for (let key of res.data) {
        payEmpLevelOptions.push({ value: key.id, label: key.level_desc });
      }
      this.setState({ payEmpLevelOptions });
    });

    this.getSiteCode();
  }
  getPayrollList = query => {
    let { formField, limit } = this.state;
    let { page = this.state.page } = query;
    let PayrollList = Object.assign({}, this.state.PayrollList);

    let {
      pay_status,
      pay_EmpLevel,
      pay_active,
      pay_site,
      pay_year,
      pay_month,
      fromDate,
      searchText,
    } = formField;
    this.props
      .getCommonApi(
        `employeesalary/?month=${pay_month ? pay_month : ""}&year=${
          pay_year ? new Date(pay_year).getFullYear() : 0
        }&site_code=${pay_site ? pay_site : ""}&active=${
          pay_active ? pay_active : ""
        }&emplevel=${pay_EmpLevel ? pay_EmpLevel : ""}&status=${
          pay_status ? pay_status : ""
        }&page=${page}&limit=${limit}&search=${searchText ? searchText : ""}`
      )
      .then(key => {
        let { status, data } = key;
        let { pageMeta } = this.state;
        if (status === 200) {
          if (data) {
            PayrollList = data.printData;
            pageMeta = data.pagination;
          }
          this.setState({
            PayrollList,
            pageMeta,
          });
        } else {
          pageMeta = {};
          PayrollList = [];
          this.setState({
            PayrollList,
            pageMeta,
          });
        }
      });
  };

  getSiteCode = () => {
    let { paySiteOptions } = this.state;
    this.props.getCommonApi(`branchlist/`).then(key => {
      let { status, data } = key;
      console.log(data, "sitecodelist");
      if (status === 200) {
        for (let value of data) {
          paySiteOptions.push({
            value: value.id,
            label: value.itemsite_code,
            // selected: false,
          });
        }
        this.setState({ paySiteOptions });
      }
    });
  };
  handleChange = async event => {
    let formField = this.state;
    formField[event.target.name] = event.target.value;
    await this.setState({
      formField,
    });
    this.getPayrollList({});
  };

  handlesearch = event => {
    console.log(event.target.value);
    let { formField } = this.state;
    formField["searchText"] = event.target.value;
    this.setState({ formField });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.getPayrollList({});
      }, 500);
    }
    this.debouncedFn();
  };

  handleLoginConfirmationDialog = async () => {
    await this.setState(prevState => ({
      isLoginConfirmation: !prevState.isLoginConfirmation,
    }));
  };

  handleOpenTrac = async () => {
    await this.setState(prevState => ({
      isAllow: !prevState.isAllow,
    }));
    this.getPayrollList({});
  };

  handleauthentication = async (user, pass) => {
    let Body = {
      username: user,
      password: pass,
      type: "Payroll",
    };
    this.props
      .commonCreateApi(`userauthorizationpopup/`, Body)
      .then(async key => {
        let { status, data } = key;
        if (status == 200) {
          await this.setState(prevState => ({
            isLoginConfirmation: !prevState.isLoginConfirmation,
          }));
          this.handleOpenTrac();
        }
      });
  };

  handleCheckbox = async ({ target: { value, name } }, item) => {
    let { PayrollList } = this.state;
    let PayrollListCheckbox = PayrollList.find(
      acc => acc.payrollId === item.payrollId
    );
    if (PayrollListCheckbox) {
      PayrollListCheckbox[name] = value;
      await this.setState({ ...this.state.PayrollList, PayrollListCheckbox });
    }
    this.UpdateSelectAllcheckbox();
  };

  UpdateSelectAllcheckbox = () => {
    debugger;
    let { PayrollList, headerDetails } = this.state;
    let PayrollListfullyChecked = PayrollList.find(
      acc => acc.checkbox === false
    );

    if (!PayrollListfullyChecked) {
      headerDetails[0]["selectAllCheck"] = true;
      this.setState({
        selectAll: true,
      });
    }

    if (PayrollListfullyChecked) {
      headerDetails[0]["selectAllCheck"] = false;
      this.setState({
        selectAll: false,
      });
    }
  };

  handleSelectAllCheckbox = async ({ target: { value, name } }) => {
    let { PayrollList, headerDetails } = this.state;
    if (PayrollList) {
      headerDetails[0]["selectAllCheck"] = value;
      await this.setState({ selectAll: value, headerDetails });
      for (let item of PayrollList) {
        item["checkbox"] = value;
        await this.setState({ ...this.state.PayrollList, item });
      }
      await this.setState({ PayrollList });
    }
  };

  handlePrintPdfFormat = url => {
    let { formField } = this.state;
    console.log(formField, "payslipmain");
    this.setState({
      isPrintPdfClick: false,
    });
    var a = document.createElement("a");
    a.setAttribute("download", `${new Date()}.pdf`);
    a.setAttribute("href", url);
    a.click();
    window.open(url);
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getPayrollList({});
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getPayrollList({});
    }
  };

  handlePagination = page => {
    debugger;
    this.getPayrollList(page);
  };

  hanldePostSelected = () => {
    let { PayrollList } = this.state;
    if (PayrollList.length > 0) {
      let PayrollListCheckbox = PayrollList.find(acc => acc.checkbox === true);
      if (PayrollListCheckbox) {
        let { PayrollList } = this.state;
        let payrollIds = [];
        for (let item of PayrollList) {
          if (item.checkbox) {
            payrollIds.push({
              value: item.payrollId,
            });
          }
        }

        let body = {
          post_ids: payrollIds.map(e => e.value),
        };
        try {
          this.props
            .commonCreateApi(`employeesalary/postselectedlist/`, body)
            .then(key => {
              let { status } = key;
              if (status == 200) {
                this.getPayrollList();
              }
            });
        } catch (e) {
          console.log(e);
        }
      } else {
        Toast({
          type: "error",
          message: "Please Select Item for update!",
        });
      }
    } else {
      Toast({
        type: "error",
        message: "No data found!",
      });
    }
  };

  render() {
    let {
      headerDetails,
      pageMeta,
      PayrollList,
      formField,
      payStatusOptions,
      payEmpLevelOptions,
      paySiteOptions,
      payYearOptions,
      payMonthOptions,
      payActiveOptions,
      isLoginConfirmation,
      isAllow,
      isPrintPdfClick,
      printData,
      accountHeader,
    } = this.state;
    let {
      pay_status,
      pay_EmpLevel,
      pay_active,
      pay_site,
      pay_year,
      pay_month,
      fromDate,
      searchText,
    } = formField;
    let { t } = this.props;
    return (
      <>
        {isAllow ? (
          <>
            <div className="payroll-section">
              <div className="col-md-12 d-flex align-items-center">
                <p className="label-head mb-4">{t("List of Staffs")}</p>
              </div>
              <div className="d-flex flex-wrap">
                <div className="col-md-2 col-12">
                  <label className="text-left w-100 text-black common-label-text mb-2">
                    {t("Month")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      placeholderrequired={false}
                      options={payMonthOptions}
                      value={t(pay_month)}
                      iconname="icon-down-key"
                      name="pay_month"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-12">
                  <label className="text-left w-100 text-black common-label-text mr-2">
                    {t("Year")}
                  </label>
                  <div className="input-group">
                    <NormalDate
                      selected={pay_year}
                      onChange={date => this.handleChange(date)}
                      showYearPicker
                      dateFormat="yyyy"
                      // yearItemNumber={9}
                      value={pay_year}
                      name="pay_year"
                      type="date"
                      minDate={new Date(fromDate)}
                      // minDate={new Date(fromDate)}
                      maxDate={new Date()}
                      popperPlacement={"bottom"}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-12">
                  <label className="text-left w-100 text-black common-label-text mr-2">
                    {t("Site Code")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      placeholderrequired={false}
                      options={paySiteOptions}
                      value={t(pay_site)}
                      iconname="icon-down-key"
                      name="pay_site"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-12">
                  <label className="text-left w-100 text-black common-label-text mr-2">
                    {t("Active")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      placeholderrequired={false}
                      options={payActiveOptions}
                      value={t(pay_active)}
                      iconname="icon-down-key"
                      name="pay_active"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-12">
                  <label className="text-left w-100 text-black common-label-text mr-2">
                    {t("Employee Level")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      placeholderrequired={false}
                      options={payEmpLevelOptions}
                      value={t(pay_EmpLevel)}
                      iconname="icon-down-key"
                      name="pay_EmpLevel"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-12">
                  <label className="text-left w-100 text-black common-label-text mr-2">
                    {t("Status")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      placeholderrequired={false}
                      options={payStatusOptions}
                      value={t(pay_status)}
                      iconname="icon-down-key"
                      name="pay_status"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="payroll-table">
                <div className="py-4">
                  <div className="d-flex flex-wrap justify-content-end">
                    <div className="col-md-2 col-12 mb-2">
                      <InputSearch
                        placeholder="Search staff"
                        value={searchText}
                        name="searchText"
                        onChange={this.handlesearch}
                      />
                    </div>
                    <div className="col-md-2 col-12 mb-2">
                      <NormalButton
                        mainbg={`true`}
                        label={`Add New`}
                        onClick={() => {
                          history.push("Payroll/add");
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-container">
                    <TableWrapper
                      headerDetails={headerDetails}
                      queryHandler={this.handlePagination}
                      pageMeta={pageMeta}
                    >
                      {PayrollList ? (
                        PayrollList.map((dataitem, index) => {
                          let {
                            payrollId,
                            EmpName,
                            EmpCode,
                            emp_level_id,
                            emp_level_name,
                            FromDate,
                            toDate,
                            nric,
                            BasicSalary,
                            otsalary,
                            othersalary,
                            totalsalary,
                            salarystatus,
                            checkbox,
                            hourlySalHour,
                            hourlySalRate,
                            firstOverTimeRate,
                            firstOverTimeHour,
                            totOTPay,
                            totCommission,
                            totAllowance,
                            totDeduct,
                            AddPay,
                            netPay,
                            empCPFCont,
                            dateofPay,
                            modeofPayId,
                            modeofPay,
                            secondOverTimeHour,
                            secondOverTimeRate,
                            TotAllowanceList,
                            TotDeducionList,
                            AddPaymentList,
                            site_code,
                          } = dataitem;
                          return (
                            <tr key={index}>
                              <td>
                                <div
                                  className={`d-flex align-items-center justify-content-center`}
                                >
                                  <NormalCheckbox
                                    onChange={e =>
                                      this.handleCheckbox(e, dataitem)
                                    }
                                    name="checkbox"
                                    checked={checkbox}
                                    type="checkbox"
                                  />
                                </div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{EmpCode}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{nric}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{EmpName}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{site_code}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">
                                  {emp_level_name}
                                </div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{BasicSalary}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{totOTPay}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{totCommission}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{AddPay}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{netPay}</div>
                              </td>
                              <td
                                onClick={() =>
                                  history.push(`payroll/edit/${payrollId}/`)
                                }
                              >
                                <div className="text-left">{salarystatus}</div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={12}>{t("No Data")}</td>
                        </tr>
                      )}
                    </TableWrapper>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap justify-content-end">
                <NormalButton
                  buttonClass={`p-2`}
                  submitBtn={true}
                  label={`Post Selected`}
                  onClick={_.debounce(async () => {
                    {
                      this.hanldePostSelected();
                    }
                  }, 500)}
                />
                <NormalButton
                  buttonClass={`p-2`}
                  submitBtn={true}
                  label={`Print Selected`}
                  onClick={_.debounce(async () => {
                    {
                      PayrollList &&
                        PayrollList.length > 0 &&
                        this.setState({ isPrintPdfClick: true });
                    }
                  }, 500)}
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="d-flex flex justify-content-center">
              <h5>{t("You dont have a access to see this page")}</h5>
            </div>
          </div>
        )}
        <NormalModal
          className={"d-flex justify-content-center"}
          style={{ minWidth: "15%" }}
          modal={isLoginConfirmation}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleLoginConfirmationDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <CredentialConfirmation
            handleLoginSubmit={(user, pass) =>
              this.handleauthentication(user, pass)
            }
          />
        </NormalModal>
        {isPrintPdfClick && (
          <PDFDownloadLink
            document={
              <Payslip
                MainInfo={PayrollList.filter(print => print.checkbox != false)}
                Flag={1}
                landscape={false}
              />
            }
          >
            {({ blob, url, loading, error }) =>
              !loading && url ? this.handlePrintPdfFormat(url) : null
            }
          </PDFDownloadLink>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const PayrollMain = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(PayrollMainClass)
);
