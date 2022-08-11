import React, { Component } from "react";
import { NormalButton, NormalDate, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import { NormalInput, NormalDateTime } from "component/common";

import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { withTranslation } from "react-i18next";

export class InvoiceHistoryClass extends Component {
  state = {
    headerDetails: [
      { label: "Cust Code" },
      { label: "Cust Name" },
      { label: "Paid On", divClass: "justify-content-end text-right" },
      { label: "Amount", divClass: "justify-content-end text-right" },
      { label: "Transaction No" },
      { label: "Reference No" },
      { label: "Billed By" },
      { label: "Status" },
      { label: "Type" },
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
      custCode: "",
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
    ],
    customer_id: "",
  };

  componentDidMount() {
    this.setState({
      customer_id: this.props.id,
    });
    let From = new Date();
    let { formField } = this.state;
    let firstdayMonth = new Date(From.getFullYear() - 2, From.getMonth(), 1);
    formField["fromDate"] = firstdayMonth;
    this.setState({
      formField,
    });

    this.getTransactions();
  }
  getTransactions = () => {
    debugger;
    let { billingList, pageMeta, formField, page, limit, customer_id } =
      this.state;
    let { fromDate, toDate, transCode, custCode, custName, transtype } =
      formField;

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
        )}&transac_no=${transCode}&cust_code=${custCode}&cust_name=${custName}&page=${page}&limit=${limit}&invoice_type=${transtype}&cust_id=${
          this.props.id
        }`
      )
      .then(async res => {
        console.log(res, "dsfdfaafg");
        await this.setState({ billingList: [] });
        billingList = res.data.dataList;
        pageMeta = res.data.meta.pagination;
        this.setState({ billingList, pageMeta });
      });
  };
  handlePrint = id => {
    let { billingList, pageMeta, formField, page, limit } = this.state;
    let { fromDate, toDate, transCode, custCode, custName } = formField;
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
  render() {
    let { headerDetails, pageMeta, billingList, formField, transtypeOptions } =
      this.state;
    let { fromDate, toDate, transCode, custCode, custName, transtype } =
      formField;
    let { t } = this.props;
    return (
      <>
        <div className="invoice-History mt-1">
          <div className="row m-0">
            <div className="col-4">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text">
                  {t("From Date")}
                </label>
                <div className="input-group">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    value={fromDate ? new Date(fromDate) : new Date()}
                    name="fromDate"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    type="date"
                    maxDate={new Date(toDate)}
                  />
                </div>
              </div>
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text">
                  {t("To Date")}
                </label>
                <div className="input-group">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={toDate ? new Date(toDate) : new Date()}
                    name="toDate"
                    className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    type="date"
                    minDate={new Date(fromDate)}
                  />
                </div>
              </div>
            </div>

            <div className="col-4">
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
                <label className="text-left w-100 text-black common-label-text">
                  {t("Transaction Type")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    placeholderrequired={false}
                    options={transtypeOptions}
                    value={transtype}
                    iconname="icon-down-key"
                    name="transtype"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-3">
              <NormalButton
                buttonClass={"mx-2"}
                mainbg={true}
                className=" fs-15 confirm"
                label="Search"
                outline={false}
                onClick={this.handleSearch}
              />
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
                    ? billingList.map((item, index) => {
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
                        } = item;
                        return (
                          <tr key={index}>
                            <td>
                              <div className="text-left">{sa_custno}</div>
                            </td>
                            <td>
                              <div className="text-left">{sa_custname}</div>
                            </td>
                            <td>
                              <div className="text-right">{sa_date}</div>
                            </td>
                            <td>
                              <div className="text-right">{sa_totamt}</div>
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
                            <td>
                              <div className="text-left">{sa_status}</div>
                            </td>
                            <td>
                              <div className="text-left">
                                {sa_transacno_type}
                              </div>
                            </td>
                            <td className="position-relative">
                              <NormalButton
                                buttonClass={"mx-0"}
                                mainbg={true}
                                className=" fs-15 confirm"
                                label="View"
                                outline={false}
                                onClick={() =>
                                  history.push(
                                    `/admin/transactionhistory/print/bill/${sa_transacno}`
                                  )
                                }
                              />
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const Invoice = withTranslation()(
  connect(null, mapDispatchToProps)(InvoiceHistoryClass)
);
