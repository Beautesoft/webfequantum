import React, { Component } from "react";
import {
  NormalButton,
  NormalSelect,
  NormalModal,
  NormalInput,
  NormalDate,
  NormalTextarea,
} from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import "./style.scss";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonCreateApi,
  commonPatchApi,
} from "redux/actions/common";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import { Toast } from "service/toast";
import { AiOutlinePlusCircle } from "react-icons/ai";
import closeIcon from "assets/images/close.png";
import { getStaffPlus } from "redux/actions/staffPlus";

export class AddpayrollClass extends Component {
  state = {
    pageMeta: {
      chunk: 10,
      page: 1,
      total: 10,
      totalPages: 2,
    },
    originalStaffList: [],
    formField: {
      payrollId: "",
      EmpCode: "",
      EmpName: "",
      empid: "",
      FromDate: new Date(),
      toDate: new Date(),
      BasicSalary: "",
      hourlySalHour: "",
      hourlySalRate: "",
      firstOverTimeRate: "",
      firstOverTimeHour: "",
      totOTPay: "",
      totCommission: "",
      totAllowance: "",
      totDeduct: "",
      AddPay: "",
      netPay: "",
      empCPFCont: "",
      dateofPay: new Date(),
      modeofPay: "",
      secondOverTimeHour: "",
      secondOverTimeRate: "",
      TotAllowanceList: [],
      TotDeductionList: [],
      AddPaymentList: [],
    },
    headerDetails: [
      { label: "Description" },
      { label: "Type" },
      { label: "Amount" },
      { label: "" },
    ],

    isNewPayTypePopup: false,
    newPopupDesc: "",
    newPopupTypeSelection: [],
    newPopupAmount: "",
    newPopupType: "",
    modeofPayList: [],
    salarySubType: [],
    visible: false,
    staffList: [],
    isLoading: false,
    headerStaffDetails: [
      { label: "Status" },
      { label: "Staff Name" },
      { label: "Phone" },
      { label: "Staff ID" },
      { label: "Specialist" },
      { label: "Home site" },
      { label: "Current site" },
    ],
  };

  componentDidMount() {
    this.getmodeofpayment();
    this.getSalarySubType();
    if (this.props.match.params.id) {
      this.getselectedItem();
    }
  }
  getselectedItem = async () => {
    let { formField } = Object.assign({}, this.state);
    this.props
      .getCommonApi(`employeesalary/${this.props.match.params.id}/`)
      .then(async res => {
        let { status, data } = res;
        if (status === 200) {
          if (data) {
            formField = {
              payrollId: data.payrollId,
              EmpCode: data.EmpCode,
              EmpName: data.EmpName,
              empid: data.empid,
              FromDate: new Date(data.FromDate),
              toDate: new Date(data.toDate),
              BasicSalary: data.BasicSalary,
              hourlySalHour: data.hourlySalHour,
              hourlySalRate: data.hourlySalRate,
              firstOverTimeRate: data.firstOverTimeRate,
              firstOverTimeHour: data.firstOverTimeHour,
              totOTPay: data.totOTPay,
              totCommission: data.totCommission,
              totAllowance: data.totAllowance,
              totDeduct: data.totDeduct,
              AddPay: data.AddPay,
              netPay: data.netPay,
              empCPFCont: data.empCPFCont,
              dateofPay: new Date(data.dateofPay),
              modeofPay: data.modeofPay,
              secondOverTimeHour: data.secondOverTimeHour,
              secondOverTimeRate: data.secondOverTimeRate,
              TotAllowanceList: data.TotAllowanceList,
              TotDeductionList: data.TotDeductionList,
              AddPaymentList: data.AddPaymentList,
            };
            await this.setState({
              formField,
            });
          }
        }
      });
  };
  handleChange = async event => {
    let { formField } = this.state;
    formField[event.target.name] = event.target.value;
    await this.setState({
      formField,
    });
    if ([event.target.name] == "FromDate") {
      let tdate = new Date(event.target.value);
      let newDate = new Date(tdate.getFullYear(), tdate.getMonth() + 1, 0);
      formField["toDate"] = newDate;
      await this.setState({
        formField,
      });
    }
  };

  handleDescPopup = async key => {
    await this.setState({
      selectedKey: key,
      isNewPayTypePopup: true,
    });
  };

  handlepopupConfirmationDialog = async () => {
    await this.setState(prevState => ({
      isNewPayTypePopup: !prevState.isNewPayTypePopup,
      selectedKey: "",
      newPopupDesc: "",
      newPopupAmount: "",
      newPopupType: "",
    }));
  };

  handleStateChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleAddNewPayType = async () => {
    let { selectedKey, newPopupDesc, newPopupAmount, newPopupType, formField } =
      this.state;

    if (newPopupAmount && Number(newPopupAmount) > 0) {
      if (selectedKey == "TotAllowance") {
        formField["TotAllowanceList"].push({
          desc: newPopupDesc,
          type: newPopupType,
          typeName: "",
          amount: newPopupAmount,
          allow_id: null,
        });

        await this.setState({
          formField,
        });
        this.AddTotAllowanceCalc();
        this.handlepopupConfirmationDialog();
      } else if (selectedKey == "TotDeduction") {
        formField["TotDeductionList"].push({
          desc: newPopupDesc,
          type: newPopupType,
          typeName: "",
          amount: newPopupAmount,
          deduct_id: null,
        });

        await this.setState({
          formField,
        });
        this.AddTotDeductionCalc();
        this.handlepopupConfirmationDialog();
      } else if (selectedKey == "AddPayment") {
        formField["AddPaymentList"].push({
          desc: newPopupDesc,
          type: newPopupType,
          typeName: "",
          amount: newPopupAmount,
          pay_id: null,
        });
        await this.setState({
          formField,
        });
        this.AddpayrowDataCalc();
        this.handlepopupConfirmationDialog();
      }
    } else {
      Toast({
        type: "error",
        message: "Please enter amount",
      });
    }
  };

  handleDeleteAllowance = async (item, key, index) => {
    let { formField } = this.state;
    let { TotAllowanceList, TotDeductionList, AddPaymentList } = formField;

    if (key == "TotAllowanceList") {
      formField["TotAllowanceList"].splice(index, 1);
      await this.setState({
        formField,
      });
      this.AddTotAllowanceCalc();
      this.handleNetPayCalc();
    } else if (key == "TotDeductionList") {
      formField["TotDeductionList"].splice(index, 1);
      await this.setState({
        formField,
      });
      this.AddTotDeductionCalc();
      this.handleNetPayCalc();
    } else {
      formField["AddPaymentList"].splice(index, 1);
      await this.setState({
        formField,
      });
      this.AddpayrowDataCalc();
      this.handleNetPayCalc();
    }
  };
  AddTotAllowanceCalc = async () => {
    let { formField } = this.state;
    formField["totAllowance"] =
      formField.TotAllowanceList &&
      formField.TotAllowanceList.reduce(
        (a, v) => Number(a) + Number(v.amount),
        ""
      );
    await this.setState({
      formField,
    });
    this.handleNetPayCalc();
  };
  AddTotDeductionCalc = async () => {
    let { formField } = this.state;
    formField["totDeduct"] =
      formField.TotDeductionList &&
      formField.TotDeductionList.reduce(
        (a, v) => Number(a) + Number(v.amount),
        ""
      );
    await this.setState({
      formField,
    });
    this.handleNetPayCalc();
  };
  AddpayrowDataCalc = async () => {
    let { formField } = this.state;
    formField["AddPay"] =
      formField.AddPaymentList &&
      formField.AddPaymentList.reduce(
        (a, v) => Number(a) + Number(v.amount),
        ""
      );
    await this.setState({
      formField,
    });
    this.handleNetPayCalc();
  };

  handleHourlyRateUpdate = async event => {
    let { formField } = this.state;
    formField.hourlySalRate = event.target.value;
    await this.setState({ formField });
    if (!this.debouncedHourlySalaryFn) {
      this.debouncedHourlySalaryFn = _.debounce(async () => {
        this.handleHourlyRate();
      }, 1000);
    }
    this.debouncedHourlySalaryFn();
  };

  handleHourlyRate = () => {
    let { formField } = this.state;
    let data = formField.hourlySalRate;
    formField["firstOverTimeRate"] = Number(data) * 1.5;
    formField["secondOverTimeRate"] = Number(data) * 2;
    this.setState({ formField });

    this.handleOverTimeRate();
  };

  handleOverTimeUpdate = async event => {
    let { formField } = this.state;
    formField[event.target.name] = event.target.value;
    await this.setState({ formField });
    if (!this.debouncedOverTimeFn) {
      this.debouncedOverTimeFn = _.debounce(async () => {
        this.handleOverTimeRate();
      }, 1000);
    }
    this.debouncedOverTimeFn();
  };

  handlePayInputUpdate = async event => {
    let { formField } = this.state;
    formField[event.target.name] = event.target.value;
    await this.setState({ formField });
    if (!this.debouncedPayInputFn) {
      this.debouncedPayInputFn = _.debounce(async () => {
        this.handleNetPayCalc();
      }, 1000);
    }
    this.debouncedPayInputFn();
  };
  handleOverTimeRate = () => {
    let { formField } = this.state;
    formField["totOTPay"] =
      Number(formField.firstOverTimeHour) *
        Number(formField.firstOverTimeRate) +
      Number(formField.secondOverTimeHour) *
        Number(formField.secondOverTimeRate);
    this.setState({ formField });

    this.handleNetPayCalc();
  };

  handleNetPayCalc = async () => {
    let { formField } = this.state;
    let hourTotal =
      Number(formField.hourlySalHour) * Number(formField.hourlySalRate);
    formField["netPay"] =
      Number(formField.BasicSalary) +
      hourTotal +
      Number(formField.totOTPay) +
      Number(formField.totCommission) +
      Number(formField.totAllowance) +
      Number(formField.AddPay) -
      Number(formField.totDeduct);
    await this.setState({ formField });
  };

  getmodeofpayment = () => {
    let { modeofPayList } = this.state;
    this.props.getCommonApi(`modeofpayment/`).then(key => {
      let { status, data } = key;
      console.log(data, "paymentmode");
      if (status === 200) {
        for (let value of data.dataList) {
          modeofPayList.push({
            value: value.id,
            label: value.modename,
          });
        }
        this.setState({ modeofPayList });
      }
    });
  };
  getSalarySubType = () => {
    let { salarySubType } = this.state;
    this.props.getCommonApi(`salarysubtype/`).then(key => {
      let { status, data } = key;
      console.log(data, "salarySubType");
      if (status === 200) {
        for (let value of data.dataList) {
          salarySubType.push({
            value: value.id,
            label: value.typename,
          });
        }
        this.setState({ salarySubType });
      }
    });
  };

  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };
  handleClick = async key => {
    if (!this.state.visible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    await this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  };

  handleSearch = async event => {
    // event.persist();
    let { formField, visible } = this.state;
    formField.EmpName = event.target.value;
    await this.setState({ formField, visible: true });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.queryHandler({});
      }, 500);
    }
    this.debouncedFn();
  };

  queryHandler = async data => {
    this.setState({ isLoading: true });
    let { formField } = this.state;
    let { page = 1, limit = 10 } = data;
    await this.props.getStaffPlus(
      `?page=${page}&limit=${limit}${""}&search=${formField.EmpName}`
    );
    let { staffDetails } = this.props;
    let { staffList, pageMeta } = this.state;
    staffList = staffDetails.dataList;
    pageMeta = staffDetails.meta?.pagination;
    this.setState({
      staffList,
      originalStaffList: staffList,
      pageMeta,
      isLoading: false,
    });
  };

  handleSelectStaff = async item => {
    debugger;
    let { formField } = this.state;
    formField.EmpName = item.emp_name;
    formField.EmpCode = item.emp_code;
    formField.empid = item.id;
    await this.setState(prevState => ({
      visible: !prevState.visible,
      formField,
    }));
    this.handleClick();
  };
  handleSubmit = () => {
    if (this.props.match.params.id) {
      this.handleUpdate();
    } else {
      this.handleSave();
    }
  };
  handleSave = () => {
    let { formField } = this.state;

    let payload = {
      payrollId: formField.payrollId,
      EmpCode: formField.EmpCode,
      EmpName: formField.EmpName,
      empid: formField.empid,
      FromDate: dateFormat(formField.FromDate),
      toDate: dateFormat(formField.toDate),
      BasicSalary: Number(formField.BasicSalary),
      hourlySalHour: Number(formField.hourlySalHour),
      hourlySalRate: Number(formField.hourlySalRate),
      firstOverTimeRate: Number(formField.firstOverTimeRate),
      firstOverTimeHour: Number(formField.firstOverTimeHour),
      totOTPay: Number(formField.totOTPay),
      totCommission: Number(formField.totCommission),
      totAllowance: Number(formField.totAllowance),
      totDeduct: Number(formField.totDeduct),
      AddPay: Number(formField.AddPay),
      netPay: Number(formField.netPay),
      empCPFCont: Number(formField.empCPFCont),
      dateofPay: dateFormat(formField.dateofPay),
      modeofPay: Number(formField.modeofPay),
      secondOverTimeHour: Number(formField.secondOverTimeHour),
      secondOverTimeRate: Number(formField.secondOverTimeRate),
      TotAllowanceList: formField.TotAllowanceList,
      TotDeductionList: formField.TotDeductionList,
      AddPaymentList: formField.AddPaymentList,
    };

    this.props.commonCreateApi(`employeesalary/`, payload).then(async res => {
      if (res.status === 201) {
        history.push(`/admin/payroll`);
      }
    });
  };
  handleUpdate = () => {
    let { formField } = this.state;

    let payload = {
      payrollId: formField.payrollId,
      EmpCode: formField.EmpCode,
      EmpName: formField.EmpName,
      empid: formField.empid,
      FromDate: dateFormat(formField.FromDate),
      toDate: dateFormat(formField.toDate),
      BasicSalary: Number(formField.BasicSalary),
      hourlySalHour: Number(formField.hourlySalHour),
      hourlySalRate: Number(formField.hourlySalRate),
      firstOverTimeRate: Number(formField.firstOverTimeRate),
      firstOverTimeHour: Number(formField.firstOverTimeHour),
      totOTPay: Number(formField.totOTPay),
      totCommission: Number(formField.totCommission),
      totAllowance: Number(formField.totAllowance),
      totDeduct: Number(formField.totDeduct),
      AddPay: Number(formField.AddPay),
      netPay: Number(formField.netPay),
      empCPFCont: Number(formField.empCPFCont),
      dateofPay: dateFormat(formField.dateofPay),
      modeofPay: Number(formField.modeofPay),
      secondOverTimeHour: Number(formField.secondOverTimeHour),
      secondOverTimeRate: Number(formField.secondOverTimeRate),
      TotAllowanceList: formField.TotAllowanceList,
      TotDeductionList: formField.TotDeductionList,
      AddPaymentList: formField.AddPaymentList,
    };

    this.props
      .commonPatchApi(`employeesalary/${this.props.match.params.id}/`, payload)
      .then(async res => {
        if (res.status === 200) {
          history.push(`/admin/payroll`);
        }
      });
  };

  handleClickReset = async () => {
    let formField = Object.assign({}, this.state.formField);
    formField = {};
    await this.setState({
      formField,
    });
    if (this.props.match.params.id) {
      this.getselectedItem();
    }
  };

  handlePostClick = () => {
    this.props
      .commonPatchApi(
        `employeesalary/${this.props.match.params.id}/postselected/`
      )
      .then(async res => {
        if (res.status === 200) {
          history.push(`/admin/payroll`);
        }
      });
  };
  render() {
    let {
      formField,
      headerDetails,
      isNewPayTypePopup,
      newPopupAmount,
      newPopupDesc,
      newPopupTypeSelection,
      newPopupType,
      modeofPayList,
      salarySubType,
      visible,
      EmployeeOption,
      isLoading,
      staffList,
      headerStaffDetails,
    } = this.state;

    let { TotAllowanceList, TotDeductionList, AddPaymentList } = formField;
    let {
      EmpCode,
      EmpName,
      FromDate,
      toDate,
      BasicSalary,
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
      modeofPay,
      secondOverTimeHour,
      secondOverTimeRate,
    } = formField;
    let { t } = this.props;
    return (
      <>
        <div className="payroll-section">
          <div className="col-md-12 d-flex align-items-center">
            <p className="label-head mb-4">
              <span
                className="h5"
                onClick={() => history.push(`/admin/payroll`)}
              >
                {t("Payroll")} &gt;
              </span>{" "}
              {this.props.match.params.id ? "Edit" : "Add"} &nbsp;
              {t("Payroll")}
            </p>
          </div>
          <div className="d-flex flex-wrap justify-content-center">
            <div className="col-md-6 py-3">
              <div className="d-flex flex-wrap justify-content-center">
                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Employee Name")}
                    </label>
                    <div className="input-group">
                      <NormalInput
                        placeholder="Search staff.."
                        value={EmpName}
                        name="EmpName"
                        onChange={this.handleSearch}
                        onClick={this.handleClick}
                      />
                    </div>
                  </div>
                  {visible ? (
                    <div className="empSearch-block">
                      <TableWrapper headerDetails={headerStaffDetails}>
                        {isLoading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : staffList.length > 0 ? (
                          staffList.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                onClick={() => this.handleSelectStaff(item)}
                              >
                                <td className="position-relative status-type">
                                  <span
                                    className={`${
                                      item.status === "available"
                                        ? "available"
                                        : "not-available"
                                    }`}
                                  ></span>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    {item.emp_name}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    {item.emp_phone1}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    {item.emp_code}
                                  </div>
                                </td>

                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    {item.services ? item.services[0] : ""}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    {item.defaultsitecode}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    {item.site_code}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : null}
                      </TableWrapper>
                    </div>
                  ) : null}
                </div>
                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Payment Period")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalDate
                            name="FromDate"
                            onChange={this.handleChange}
                            value={FromDate}
                            type={`date`}
                            popperPlacement={"bottom"}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 col-12">
                        <div className="d-flex justify-content-center">
                          <span className="text-center text-black common-label-text p-1">
                            {t("to")}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalDate
                            name="toDate"
                            onChange={this.handleChange}
                            value={toDate}
                            type={`date`}
                            popperPlacement={"bottom"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Basic Salary")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-6 col-12">
                        <div className="d-flex justify-content-end">
                          <NormalInput
                            name={`BasicSalary`}
                            onChange={this.handlePayInputUpdate}
                            type={`number`}
                            value={BasicSalary}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Hourly Salary")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalInput
                            name="hourlySalHour"
                            onChange={this.handlePayInputUpdate}
                            type={`number`}
                            value={hourlySalHour}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 col-12">
                        <div className="d-flex justify-content-center">
                          <span className="text-center text-black common-label-text p-1">
                            {t("X")}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalInput
                            name="hourlySalRate"
                            onChange={this.handleHourlyRateUpdate}
                            type={`number`}
                            value={hourlySalRate}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Amount of Over Time (1.5x)")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalInput
                            name="firstOverTimeHour"
                            onChange={this.handleOverTimeUpdate}
                            type={`number`}
                            value={firstOverTimeHour}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 col-12">
                        <div className="d-flex justify-content-center">
                          <span className="text-center text-black common-label-text p-1">
                            {t("X")}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalInput
                            name="firstOverTimeRate"
                            onChange={this.handleOverTimeUpdate}
                            type={`number`}
                            value={firstOverTimeRate}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Amount of Over Time (2x)")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalInput
                            name="secondOverTimeHour"
                            onChange={this.handleOverTimeUpdate}
                            type={`number`}
                            value={secondOverTimeHour}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 col-12">
                        <div className="d-flex justify-content-center">
                          <span className="text-center text-black common-label-text p-1">
                            {t("X")}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-5 col-12">
                        <div className="input-group">
                          <NormalInput
                            name="secondOverTimeRate"
                            onChange={this.handleOverTimeUpdate}
                            type={`number`}
                            value={secondOverTimeRate}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Total OT Pay")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-6 col-12">
                        <div className="d-flex justify-content-end">
                          <NormalInput
                            name={`totOTPay`}
                            onChange={this.handleChange}
                            type={`number`}
                            value={totOTPay}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-12 py-3">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-2">
                      {t("Total Commission")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-6 col-12">
                        <div className="d-flex justify-content-end">
                          <NormalInput
                            name={`totCommission`}
                            onChange={this.handleOverTimeUpdate}
                            type={`number`}
                            value={totCommission}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-12 pt-3 pb-1">
                  <div className="d-flex">
                    <label className="text-left w-50 text-black common-label-text mb-1">
                      {t("Total Allowance")}
                    </label>
                    <div className="input-group">
                      <div className="col-md-6 col-12">
                        <div className="d-flex justify-content-end">
                          <NormalInput
                            name={`totAllowance`}
                            onChange={this.handleChange}
                            type={`number`}
                            value={totAllowance}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex">
                          <div className="col-md-6">
                            <AiOutlinePlusCircle
                              className="fs-30"
                              color="primary"
                              onClick={() =>
                                this.handleDescPopup("TotAllowance")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-12  pt-1 pb-3">
                  <TableWrapper headerDetails={headerDetails}>
                    {formField.TotAllowanceList &&
                    formField.TotAllowanceList.length > 0 ? (
                      formField.TotAllowanceList.map((dataitem, index) => {
                        let { desc, type, amount, typeName } = dataitem;
                        return (
                          <tr key={index}>
                            <td>
                              <div className="text-left">{desc}</div>
                            </td>
                            <td>
                              <div className="text-left">{typeName}</div>
                            </td>
                            <td>
                              <div className="text-left">{amount}</div>
                            </td>
                            <td>
                              <div
                                className="col p-0 pr-1 fs-18 cursor-pointer"
                                onClick={() =>
                                  this.handleDeleteAllowance(
                                    dataitem,
                                    "TotAllowanceList",
                                    index
                                  )
                                }
                              >
                                <span className="icon-delete"></span>
                              </div>
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
              <div className="col-md-12 col-12  pt-3 pb-1">
                <div className="d-flex">
                  <label className="text-left w-50 text-black common-label-text mb-2">
                    {t("Total Deduction")}
                  </label>
                  <div className="input-group">
                    <div className="col-md-6 col-12">
                      <div className="d-flex justify-content-end">
                        <NormalInput
                          name={`totDeduct`}
                          onChange={this.handleChange}
                          type={`number`}
                          value={totDeduct}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex ">
                        <div className="col-md-6">
                          <AiOutlinePlusCircle
                            className="fs-30"
                            color="primary"
                            onClick={() => this.handleDescPopup("TotDeduction")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-12 pb-3 pt-1">
                <TableWrapper headerDetails={headerDetails}>
                  {TotDeductionList && TotDeductionList.length > 0 ? (
                    TotDeductionList.map((dataitem, index) => {
                      let { desc, type, amount, typeName } = dataitem;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-left">{typeName}</div>
                          </td>
                          <td>
                            <div className="text-left">{amount}</div>
                          </td>
                          <td>
                            <div
                              className="col p-0 pr-1 fs-18 cursor-pointer"
                              onClick={() =>
                                this.handleDeleteAllowance(
                                  dataitem,
                                  "TotDeductionList",
                                  index
                                )
                              }
                            >
                              <span className="icon-delete"></span>
                            </div>
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
              <div className="col-md-12 col-12 pt-3 pb-1">
                <div className="d-flex">
                  <label className="text-left w-50 text-black common-label-text mb-2">
                    {t("Additional Payment")}
                  </label>
                  <div className="input-group">
                    <div className="col-md-6 col-12">
                      <div className="d-flex justify-content-end">
                        <NormalInput
                          name={`AddPay`}
                          type={`number`}
                          onChange={() => {}}
                          value={AddPay}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex ">
                        <div className="col-md-6">
                          <AiOutlinePlusCircle
                            className="fs-30"
                            color="primary"
                            onClick={() => this.handleDescPopup("AddPayment")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-12  pb-3 pt-1">
                <TableWrapper headerDetails={headerDetails}>
                  {AddPaymentList && AddPaymentList.length > 0 ? (
                    AddPaymentList.map((dataitem, index) => {
                      let { desc, type, amount, typeName } = dataitem;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-left">{typeName}</div>
                          </td>
                          <td>
                            <div className="text-left">{amount}</div>
                          </td>
                          <td>
                            <div
                              className="col p-0 pr-1 fs-18 cursor-pointer"
                              onClick={() =>
                                this.handleDeleteAllowance(
                                  dataitem,
                                  "AddPaymentList",
                                  index
                                )
                              }
                            >
                              <span className="icon-delete"></span>
                            </div>
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
              <div className="col-md-12 col-12 py-3">
                <div className="d-flex">
                  <label className="text-left w-50 text-black common-label-text mb-2">
                    {t("Net Pay")}
                  </label>
                  <div className="input-group">
                    <div className="col-md-6 col-12">
                      <div className="d-flex justify-content-end">
                        <NormalInput
                          name={`netPay`}
                          onChange={() => {}}
                          type={`number`}
                          value={netPay}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-12 py-3">
                <div className="d-flex">
                  <label className="text-left w-50 text-black common-label-text mb-2">
                    {t("Employee CPF Contribution")}
                  </label>
                  <div className="input-group">
                    <div className="col-md-6 col-12">
                      <div className="d-flex justify-content-end">
                        <NormalInput
                          name={`empCPFCont`}
                          onChange={this.handleChange}
                          type={`number`}
                          value={empCPFCont}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-12 py-3">
                <div className="d-flex">
                  <label className="text-left w-50 text-black common-label-text mb-2">
                    {t("Date of Payment")}
                  </label>
                  <div className="input-group">
                    <div className="col-md-6 col-12">
                      <div className="d-flex justify-content-end">
                        <NormalDate
                          name={`dateofPay`}
                          onChange={this.handleChange}
                          value={dateofPay}
                          type={`date`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-12 py-3">
                <div className="d-flex">
                  <label className="text-left w-50 text-black common-label-text mb-2">
                    {t("Mode of Payment")}
                  </label>
                  <div className="input-group">
                    <div className="col-md-6 col-12">
                      <div className="d-flex justify-content-end">
                        <NormalSelect
                          name={`modeofPay`}
                          onChange={this.handleChange}
                          type={`number`}
                          value={modeofPay}
                          options={modeofPayList}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            <NormalButton
              buttonClass={`p-2`}
              resetbg={true}
              label={`Reset`}
              onClick={() => {
                this.handleClickReset();
              }}
            />
            <NormalButton
              buttonClass={`p-2`}
              mainbg={true}
              label={`Back`}
              onClick={() => {
                let result = window.confirm(
                  "Are you sure want to leave this page"
                );
                if (result) {
                  history.push(`/admin/payroll`);
                }
              }}
            />
            <NormalButton
              buttonClass={`p-2`}
              submitBtn={true}
              label={`Save`}
              onClick={_.debounce(async () => {
                {
                  this.handleSubmit();
                }
              }, 500)}
            />
            {this.props.match.params.id && (
              <NormalButton
                buttonClass={`p-2`}
                applybg={true}
                label={`Post`}
                onClick={_.debounce(async () => {
                  {
                    this.handlePostClick();
                  }
                }, 500)}
              />
            )}
          </div>
        </div>
        <NormalModal
          className={"d-flex justify-content-center"}
          style={{ minWidth: "55%" }}
          modal={isNewPayTypePopup}
          handleModal={() => {}}
        >
          <div className="d-flex justify-content-end">
            <img
              onClick={this.handlepopupConfirmationDialog}
              className="close cursor-pointer"
              src={closeIcon}
              alt=""
            />
          </div>
          <div className="col-12">
            <div className="d-flex flex-wrap">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text mb-2">
                  {t("Description")}
                </label>
                <div className="input-group">
                  <div className="d-flex justify-content-end">
                    <NormalTextarea
                      name={`newPopupDesc`}
                      onChange={this.handleStateChange}
                      type={`text`}
                      value={newPopupDesc}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-12">
                <label className="text-left w-50 text-black common-label-text mb-2">
                  {t("Type")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    name={`newPopupType`}
                    onChange={this.handleStateChange}
                    value={newPopupType}
                    options={salarySubType}
                  />
                </div>
              </div>
              <div className="col-md-3 col-12">
                <label className="text-left text-black common-label-text mb-2">
                  {t("Amount")}
                </label>
                <div className="input-group">
                  <div className="d-flex justify-content-end">
                    <NormalInput
                      name={`newPopupAmount`}
                      onChange={this.handleStateChange}
                      type={`number`}
                      value={newPopupAmount}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-12">
                <NormalButton
                  buttonClass={`p-3`}
                  submitBtn={true}
                  label={`Add`}
                  onClick={this.handleAddNewPayType}
                />
              </div>
            </div>
          </div>
        </NormalModal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
  staffDetails: state.staffPlus.staffPlusDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      getStaffPlus,
      commonPatchApi,
    },
    dispatch
  );
};

export const Addpayroll = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddpayrollClass)
);
