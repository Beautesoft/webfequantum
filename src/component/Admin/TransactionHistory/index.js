import React, { Component } from "react";
import { NormalButton, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import {
  NormalInput,
  NormalDateTime,
  NormalMultiSelect,
} from "component/common";

import "./style.scss";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { withTranslation } from "react-i18next";
import { Toast } from "service/toast";

export class TransactionHistoryClass extends Component {
  state = {
    headerDetails: [
      { label: "Cust Code" },
      { label: "Cust Name" },
      { label: "Paid On" },
      {
        label: "Modified Date",
        className: "d-none",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Invoice Amount",
        divClass: "justify-content-end text-right",
        width: "125px",
      },
      {
        label: "Staff Amount",
        divClass: "justify-content-end text-right",
        width: "120px",
      },
      {
        label: "Total Amount",
        className: "d-none",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Paid Amount",
        className: "d-none",
        divClass: "justify-content-end text-right",
      },
      { label: "Item", width: "300px", className: "d-none" },
      { label: "Transaction No" },
      { label: "Reference No" },
      { label: "Billed By" },
      {
        label: "No of Qty",
        className: "d-none",
        divClass: "justify-content-end text-right",
      },
      {
        label: "No of Lines",
        className: "d-none",
        divClass: "justify-content-end text-right",
      },
      {
        label: "OR",
        className: "d-none",
        divClass: "justify-content-end text-right",
      },
      { label: "Status" },
      { label: "Type" },
      { label: "Payment Remark" },
      { label: "" },
    ],
    billingList: [],
    pageMeta: {
      chunk: 10,
      page: 1,
      total: 10,
      totalPages: 2,
    },
    formField: {
      fromDate: new Date(),
      toDate: new Date(),
      transCode: "",
      salesStaff: [],
      custName: "",
      transtype: "All",
    },
    active: false,
    currentIndex: -1,
    page: 1,
    limit: 10,
    isOpenvoidCheckout: false,
    transtypeOptions: [
      { label: "All", value: "All" },
      { label: "Sales", value: "Sales" },
      { label: "Void", value: "Void" },
      { label: "TD", value: "TD" },
      { label: "Non-Sales", value: "NonSales" },
    ],
    settingData: {},
    TotalTransactionAmount: 0,
    TotalSalesAmount: 0,
    salesdefaultStaff: [],
    disbledstaffid: "",
  };

  componentDidMount() {
    let From = new Date();
    let { formField } = this.state;
    let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    formField["fromDate"] = firstdayMonth;
    this.setState({
      formField,
    });
    this.getdefaultStaffList();
    this.handleItemSettings();
  }

  getdefaultStaffList = async () => {
    try {
      let { salesdefaultStaff, formField } = this.state;

      this.props
        .getCommonApi(
          `empcartlist/?sales_staff=1&page=1&limit=1000&check=TransacHistory`
        )
        .then(async res => {
          console.log(res, "salesdefaultstaff");

          salesdefaultStaff = [];
          let { data, status } = res;
          if (status == 200) {
            if (data.dataList) {
              if (Number(this.props.tokenDetails.role_code) == 1) {
                formField["salesStaff"].push({
                  value: "0",
                  label: "All",
                });
                await this.setState({
                  formField,
                });
              } else {
                for (let key of data.dataList) {
                  salesdefaultStaff.push({
                    value: key.id,
                    label: key.emp_name,
                  });

                  if (
                    key.id == Number(this.props.tokenDetails.default_loginid) &&
                    Number(this.props.tokenDetails.role_code) != 1
                  ) {
                    formField["salesStaff"].push({
                      value: key.id,
                      label: key.emp_name,
                    });

                    await this.setState({
                      disbledstaffid: key.id,
                      formField,
                    });
                  }
                }
              }
              await this.setState({ salesdefaultStaff });
              this.getTransactions();
            } else {
              this.getTransactions();
            }
          } else {
            this.getTransactions();
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  handleItemSettings = () => {
    let { settingData } = this.state;
    this.props.getCommonApi(`userlist/`).then(key => {
      let { status, data } = key;
      console.log(key, "settingsData changeprice");
      if (status === 200) {
        settingData = data;
        this.setState({ settingData });
      }
    });
  };
  getTransactions = dStaffid => {
    let {
      billingList,
      pageMeta,
      formField,
      page,
      limit,
      TotalTransactionAmount,
      TotalSalesAmount,
      disbledstaffid,
    } = this.state;
    let { fromDate, toDate, transCode, salesStaff, custName, transtype } =
      formField;
    let selectedStaff = "";
    if (dStaffid) {
      selectedStaff = dStaffid;
    } else {
      selectedStaff = this.state.formField["salesStaff"]
        .map(e => e.value)
        .reduce((a, e) => (a === "" ? e : a + "," + e), "");
    }
    this.setState({ TotalTransactionAmount: 0, TotalSalesAmount: 0 });
    let From = new Date();
    if (fromDate && fromDate !== "") {
      From = fromDate;
    } else {
      this.setState({ fromDate: From });
    }
    let To = new Date();
    if (toDate && toDate !== "") {
      To = toDate;
    } else {
      this.setState({ toDate: To });
    }
    this.props
      .getCommonApi(
        `transactionhistory/?from_date=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&to_date=${dateFormat(
          To,
          "yyyy-mm-dd"
        )}&transac_no=${transCode}&sales_staffs=${selectedStaff}&cust_name=${custName}&page=${page}&limit=${limit}&invoice_type=${transtype}`
      )
      .then(async res => {
        console.log(res, "transactionlistdsfdfaafg");
        await this.setState({ billingList: [] });
        billingList = res.data.dataList;
        pageMeta = res.data.meta.pagination;
        TotalTransactionAmount = 0;
        TotalSalesAmount = 0;
        for (let line of res.data.dataList) {
          TotalTransactionAmount += Number(line.sa_totamt);
          TotalSalesAmount += Number(line.sales_amt);
        }
        this.setState({
          billingList,
          pageMeta,
          TotalTransactionAmount,
          TotalSalesAmount,
        });
      });
  };
  handlePrint = id => {
    let { billingList, pageMeta, formField, page, limit } = this.state;
    let { fromDate, toDate, transCode, salesStaff, custName } = formField;
    this.props.getCommonApi(`receiptpdf/?sa_transacno=${id}`).then(res => {});
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getTransactions();
  };

  handleShare = id => {
    this.props
      .commonCreateApi(`receiptpdfsend/?sa_transacno=${id}`)
      .then(res => {});
  };

  handleInvoice = id => {
    this.props
      .getCommonApi(`customerreceiptprint/?sa_transacno=${id}`)
      .then(res => {});
  };

  handleClick = key => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      active: !prevState.active,
      currentIndex: key,
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

  handleChange = async ({ target: { value, name } }) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
  };

  handleDatePick = async (name, value) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
  };

  handleSearch = () => {
    this.getTransactions();
  };

  handleMultiSelectDefaultStaff = async (data = []) => {
    let { formField, salesdefaultStaff } = this.state;

    let AllisSelected = data.filter(acc => Number(acc.value) == 0).length;
    let result = [];
    if (AllisSelected > 0) {
      data = [];
      data.push({ value: "0", label: "All" });
      let { formField, salesdefaultStaff } = this.state;
      formField["salesStaff"] = data;

      salesdefaultStaff = data;

      await this.setState({
        salesdefaultStaff,
        formField,
      });
    } else {
      result = data;

      formField["salesStaff"] = result;
      await this.setState({
        formField,
      });
      this.props
        .getCommonApi(
          `empcartlist/?sales_staff=1&page=1&limit=1000&check=TransacHistory`
        )
        .then(async res => {
          console.log(res, "salesdefaultstaff");

          salesdefaultStaff = [];
          let { data, status } = res;
          if (status == 200) {
            if (data.dataList) {
              for (let key of data.dataList) {
                salesdefaultStaff.push({
                  value: key.id,
                  label: key.emp_name,
                });
              }
              await this.setState({ salesdefaultStaff });
            }
          }
        });
    }
  };
  defaultAllUpdate = async () => {};
  render() {
    let {
      headerDetails,
      pageMeta,
      billingList,
      formField,
      transtypeOptions,
      settingData,
      TotalTransactionAmount,
      salesdefaultStaff,
      disbledstaffid,
    } = this.state;
    let { fromDate, toDate, transCode, salesStaff, custName, transtype } =
      formField;
    let { t } = this.props;
    return (
      <>
        <div className="billing-section">
          <div className="col-md-12 d-flex align-items-center">
            <p className="label-head mb-4">{t("Transaction History")}</p>
          </div>
          <div className="row m-0 filter">
            <div className="col-md-3 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("From Date")}
                </label>
                <div className="input-group">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={fromDate ? new Date(fromDate) : new Date()}
                    name="fromDate"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
              </div>
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("To Date")}
                </label>
                <div className="input-group">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={toDate ? new Date(toDate) : new Date()}
                    name="toDate"
                    // className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date(fromDate)}
                    showDisabledMonthNavigation
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Cust Name/ ref/ Code")}
                </label>
                <div className="input-group">
                  <NormalInput
                    value={custName}
                    name="custName"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Sales Staff")}
                </label>
                <div className="input-group">
                  {Number(this.props.tokenDetails.role_code) == 1 ? (
                    <NormalMultiSelect
                      id={`salesStaff`}
                      handleMultiSelect={this.handleMultiSelectDefaultStaff}
                      options={salesdefaultStaff}
                      value={salesStaff}
                      name="salesStaff"
                      disabled={
                        Number(this.props.tokenDetails.role_code) == 1
                          ? false
                          : true
                      }
                    />
                  ) : (
                    <NormalSelect
                      options={salesdefaultStaff}
                      value={disbledstaffid}
                      name="salesStaff"
                      onChange={this.handleChange}
                      disabled={true}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-3 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Transaction Code")}
                </label>
                <div className="input-group">
                  <NormalInput
                    value={transCode}
                    name="transCode"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Transaction Type")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    placeholderrequired={false}
                    options={transtypeOptions}
                    value={t(transtype)}
                    iconname="icon-down-key"
                    name="transtype"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-2 col-12">
              <div className=" w-100 mb-2">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Search"
                  outline={false}
                  onClick={this.handleSearch}
                />
              </div>

              <div className="d-flex w-100">
                <label className="text-left col h6 w-100 fw-500 common-label-text pr-1">
                  {t("Total Staff Amount")}
                </label>
                <div className="col">
                  <label className="text-left h6 w-50 fw-500 common-label-text">
                    $
                    {this.state.TotalSalesAmount
                      ? Number(this.state.TotalSalesAmount).toFixed(2)
                      : 0}
                  </label>
                </div>
              </div>
              <div className="d-flex w-100">
                <label className="text-left col fs-11 w-60 fw-500 common-label-text pr-2 pt-1">
                  {t("Total Invoice Amount")}
                </label>
                <div className="">
                  <label className="text-left fs-11 w-100 fw-500 common-label-text">
                    $
                    {this.state.TotalTransactionAmount
                      ? Number(this.state.TotalTransactionAmount).toFixed(2)
                      : 0}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="billing-table">
            <div className="py-4">
              <div className="table-container">
                <TableWrapper
                  headerDetails={headerDetails}
                  queryHandler={this.handlePagination}
                  pageMeta={pageMeta}
                >
                  {billingList
                    ? billingList.map((dataitem, index) => {
                        let {
                          icon,
                          id,
                          sa_custno,
                          sa_custname,
                          sa_date,
                          sa_totamt,
                          sa_transacno_ref,
                          void_refno,
                          sa_staffname,
                          sa_status,
                          sa_transacno_type,
                          sa_transacno,
                          payment_remarks,
                          isvoid,
                          no_of_qty,
                          no_of_lines,
                          or,
                          paid_amount,
                          total_amount,
                          item,
                          new_date,
                          sales_amt,
                        } = dataitem;
                        return (
                          <tr key={index}>
                            {/* {Number(this.props.tokenDetails.role_code) == 1 ||
                            Number(this.props.tokenDetails.role_code) == 2 ? (
                              <td className="position-relative">
                                <NormalButton
                                  buttonClass={"mx-0"}
                                  mainbgrev={true}
                                  className="confirm fs-11"
                                  label={t("Change Price")}
                                  outline={false}
                                  onClick={() =>
                                    history.push(
                                      `/admin/transactionhistory/pricechange/${id}`
                                    )
                                  }
                                  disabled={!isvoid ? false : true}
                                />
                              </td>
                            ) : (
                              ""
                            )} */}

                            <td>
                              <div className="text-left">{sa_custno}</div>
                            </td>
                            <td>
                              <div className="text-left">{sa_custname}</div>
                            </td>
                            <td>
                              <div className="text-right">{sa_date}</div>
                            </td>
                            <td className="d-none">
                              <div className="text-right">{new_date}</div>
                            </td>
                            <td>
                              <div className="text-right">{sa_totamt}</div>
                            </td>
                            <td>
                              <div className="text-right">{sales_amt}</div>
                            </td>
                            <td className="d-none">
                              <div className="text-right">{total_amount}</div>
                            </td>
                            <td className="d-none">
                              <div className="text-right">{paid_amount}</div>
                            </td>
                            <td className="d-none">
                              <div className="text-left">{item}</div>
                            </td>
                            <td>
                              <div className="text-left">
                                {sa_transacno_ref}
                              </div>
                            </td>
                            <td>
                              <div className="text-left">{void_refno}</div>
                            </td>
                            <td>
                              <div className="text-left">{sa_staffname}</div>
                            </td>
                            <td className="d-none">
                              <div className="text-right">{no_of_qty}</div>
                            </td>
                            <td className="d-none">
                              <div className="text-right">{no_of_lines}</div>
                            </td>
                            <td className="d-none">
                              <div className="text-right">{or}</div>
                            </td>

                            <td>
                              <div className="text-left">{sa_status}</div>
                            </td>
                            <td>
                              <div className="text-left">
                                {sa_transacno_type}
                              </div>
                            </td>
                            <td>
                              <div className="text-left">{payment_remarks}</div>
                            </td>
                            <td className="position-relative">
                              <div className="d-flex justify-content-center">
                                <NormalButton
                                  buttonClass={"mx-0"}
                                  mainbgrev={true}
                                  className="confirm fs-11"
                                  label={t("View")}
                                  outline={false}
                                  onClick={() =>
                                    history.push(
                                      `/admin/transactionhistory/print/bill/${sa_transacno}`
                                    )
                                  }
                                />
                                {(Number(this.props.tokenDetails.role_code) ==
                                  1 ||
                                  Number(this.props.tokenDetails.role_code) ==
                                    2) &&
                                settingData.showChangePrice ? (
                                  <NormalButton
                                    buttonClass={"mx-0 ml-1"}
                                    mainbgrev={true}
                                    className="confirm fs-11"
                                    label={t("Change Price")}
                                    outline={false}
                                    onClick={() =>
                                      history.push(
                                        `/admin/transactionhistory/pricechange/${id}`
                                      )
                                    }
                                    disabled={!isvoid ? false : true}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </TableWrapper>
              </div>
            </div>
          </div>
        </div>
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

export const TransactionHistory = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(TransactionHistoryClass)
);
