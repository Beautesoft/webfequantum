import React, { Component } from "react";
import { NormalButton, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import {
  NormalInput,
  NormalTextarea,
  NormalDateTime,
  NormalModal,
} from "component/common";
import filter from "assets/images/filter.png";
import "./style.scss";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";
import closeIcon from "assets/images/close.png";

export class BillingClass extends Component {
  state = {
    headerDetails: [
      // { label: '' },
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
    },
    active: false,
    currentIndex: -1,
    page: 1,
    limit: 10,
    isOpenvoidCheckout: false,
  };

  componentDidMount() {
    this.getBilling();
  }

  getBilling = () => {
    let { billingList, pageMeta, formField, page, limit } = this.state;
    let { fromDate, toDate, transCode, custCode, custName } = formField;
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
        `billing/?from_date=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&to_date=${dateFormat(
          To,
          "yyyy-mm-dd"
        )}&transac_no=${transCode}&cust_code=${custCode}&cust_name=${custName}&page=${page}&limit=${limit}`
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
    console.log(pageNo, "dsfsdfsdfsdf");
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getBilling();
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
    console.log(name, value, "sdfgdfhfshg", dateFormat(value));
    // dateFormat(new Date())
    let { formField } = this.state;
    formField[name] = value;
    // formFields[name] = value;
    await this.setState({
      formField,
    });
    // this.getCart()
  };

  handleSearch = () => {
    this.getBilling();
  };

  render() {
    let {
      currentIndex,
      headerDetails,
      pageMeta,
      billingList,
      formField,
      isOpenvoidCheckout,
    } = this.state;
    let { fromDate, toDate, transCode, custCode, custName } = formField;
    return (
      <>
        <div className="billing-section">
          <div className="row m-0 filter">
            <div className="col-md-8 d-flex align-items-center">
              <p className="label-head my-2">Billing history</p>
              <i className="icon-download ml-4"></i>
            </div>

            <div className="col-md-4">
              <div className="d-flex my-2">
                <div className="w-100 mr-5">
                  <InputSearch
                    className=""
                    placeholder="Search here.."
                    onChange={this.handleChange}
                  />
                </div>

                <div
                  className="bg-white filter-icon filter-section"
                  onClick={() => {
                    this.handleClick("filter");
                  }}
                >
                  <img src={filter} alt="" />
                  {currentIndex === "filter" && (
                    <>
                      <div className="filter-category">
                        <p className="subcategory">Available today</p>
                        <p className="subcategory">Unavailable today</p>
                        <p className="subcategory">Morning shift</p>
                        <p className="subcategory">Evening shift</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  From Date
                </label>
                <div className="input-group">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={fromDate ? new Date(fromDate) : new Date()}
                    name="fromDate"
                    className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  To Date
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
                  />
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  Customer Name
                </label>
                <div className="input-group">
                  <NormalInput
                    value={custName}
                    name="custName"
                    onChange={this.handleChange}
                    className={`customer-name`}
                  />
                </div>
              </div>
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  Customer Code
                </label>
                <div className="input-group">
                  <NormalInput
                    value={custCode}
                    name="custCode"
                    onChange={this.handleChange}
                    className={`customer-name`}
                  />
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  Transaction Code
                </label>
                <div className="input-group">
                  <NormalInput
                    value={transCode}
                    name="transCode"
                    onChange={this.handleChange}
                    className={`customer-name`}
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
                            {/* <td><div className="d-flex align-items-center justify-content-center bill-status"><i className={icon}></i></div></td> */}
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_custno}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_custname}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_date}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_totamt}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_transacno_ref}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {void_refno}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_staffname}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_status}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {sa_transacno_type}
                              </div>
                            </td>
                            <td className="position-relative">
                              <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className=" fs-15 confirm"
                                label="View"
                                outline={false}
                                onClick={() =>
                                  history.push(
                                    `/admin/billing/print/bill/${sa_transacno}`
                                  )
                                }
                              />
                            </td>
                          </tr>
                        );
                      })
                    : ""}
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

export const Billing = connect(null, mapDispatchToProps)(BillingClass);
