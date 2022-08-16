import React, { Component } from "react";
import {
  NormalButton,
  NormalSelect,
  InputSearch,
  TableWrapper,
  NormalInput,
  NormalDateTime,
  NormalCheckbox,
} from "component/common";

import "./style.scss";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { withTranslation } from "react-i18next";
import { data } from "component/Admin/mobileAppointment/MobileListAppointment/devExpressScheduler/data";

export class OutstandingCustomerPlusClass extends Component {
  state = {
    headerDetails: [
      {
        label: "Purc Date",
        divClass: "justify-content-end text-right",
        width: "110px",
        sortKey: "sa_date",
        singleClickFunc: () => this.handleSort("sa_date"),
      },
      { label: "Cust Ref." },
      { label: "Cust Name", width: "150px" },
      {
        label: "Service Balance",
        divClass: "justify-content-end text-right",
        width: "125px",
        sortKey: "treat_bal",
        singleClickFunc: () => this.handleSortAmount("treat_bal"),
      },
      {
        label: "Service Outstanding",
        divClass: "justify-content-end text-right",
        sortKey: "treat_out",
        width: "125px",
        singleClickFunc: () => this.handleSortAmount("treat_out"),
      },

      {
        label: "PP Balance",
        divClass: "justify-content-end text-right",
        sortKey: "pre_bal",
        width: "120px",
        singleClickFunc: () => this.handleSortAmount("pre_bal"),
      },
      {
        label: "PP Outstanding",
        divClass: "justify-content-end text-right",
        sortKey: "pre_out",
        width: "120px",
        singleClickFunc: () => this.handleSortAmount("pre_out"),
      },

      {
        label: "Product Balance",
        divClass: "justify-content-end text-right",
        sortKey: "product_bal",
        width: "125px",
        singleClickFunc: () => this.handleSortAmount("product_bal"),
      },
      {
        label: "Product Outstanding",
        divClass: "justify-content-end text-right",
        sortKey: "product_out",
        width: "125px",
        singleClickFunc: () => this.handleSortAmount("product_bal"),
      },
    ],
    outstandingList: [],
    pageMeta: {
      chunk: 10,
      page: 1,
      total: 10,
      totalPages: 2,
    },
    formField: {
      fromDate: new Date(),
      toDate: new Date(),
      searchText: "",
    },
    active: false,
    currentIndex: -1,
    page: 1,
    limit: 10,
    orderBy: "desc",
  };

  componentDidMount() {
    let From = new Date();
    let { formField } = this.state;
    let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    formField["fromDate"] = firstdayMonth;
    this.setState({
      formField,
    });

    this.getOutStandingList();
  }

  handleSort = sortkey => {
    let { outstandingList, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });

    if (orderBy === "asc") {
      outstandingList.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      outstandingList.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      outstandingList,
    });
  };

  handleSortAmount = sortkey => {
    let { outstandingList, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });

    if (orderBy === "asc") {
      outstandingList.sort((a, b) =>
        Number(a[sortkey]) > Number(b[sortkey])
          ? 1
          : Number(b[sortkey]) > Number(a[sortkey])
          ? -1
          : 0
      );
    } else {
      outstandingList.sort((a, b) =>
        Number(a[sortkey]) < Number(b[sortkey])
          ? 1
          : Number(b[sortkey]) < Number(a[sortkey])
          ? -1
          : 0
      );
    }
    this.setState({
      outstandingList,
    });
  };

  getOutStandingList = () => {
    let { outstandingList, pageMeta, formField, page, limit } = this.state;
    let { fromDate, toDate, searchText } = formField;
    try {
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
          `customeraccount/?page=${page}&limit=${limit}&start=${dateFormat(
            From,
            "yyyy/mm/dd"
          )}&end=${dateFormat(To, "yyyy/mm/dd")}&search=${searchText}`
        )
        .then(async res => {
          let { data } = res;
          if (data && data.dataList) {
            await this.setState({ outstandingList: [] });
            outstandingList = data.dataList;
            pageMeta = data.meta.pagination;
            this.setState({ outstandingList, pageMeta });
          }
          //          this.handleSort("prepaid");
        });
    } catch (e) {
      console.log(e, "outstanding catch log");
    }
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getOutStandingList();
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
    this.getOutStandingList();
  };

  render() {
    let { headerDetails, pageMeta, outstandingList, formField } = this.state;
    let { fromDate, toDate, searchText } = formField;
    let { t } = this.props;
    return (
      <>
        <div className="outstanding-customer">
          <div className="col-md-12 d-flex align-items-center py-4 fs-18">
            <p
              className="fw-500"
              onClick={() => history.push("/admin/customerplus")}
            >
              {t("Customer")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p>{t("Outstanding List")}</p>
          </div>
          <div className="row m-0 filter">
            <div className="col-md-3 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-50 text-black common-label-text ">
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
            </div>
            <div className="col-md-3 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-50 text-black common-label-text">
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
            <div className="col-md-3 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-50 text-black common-label-text">
                  {t("Search")}
                </label>
                <div className="input-group">
                  <NormalInput
                    onChange={this.handleChange}
                    value={searchText}
                    name="searchText"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-2 col-12">
              <NormalButton
                buttonClass={"mx-2"}
                mainbgrev={true}
                className="confirm"
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
                  {outstandingList
                    ? outstandingList.map((dataitem, index) => {
                        let {
                          sa_date,
                          CustCode,
                          CustName,
                          cust_refer,
                          pre_bal,
                          pre_out,
                          product_bal,
                          product_out,
                          treat,
                          treat_bal,
                          treat_out,
                        } = dataitem;
                        return (
                          <tr key={index}>
                            <td>
                              <div className="text-right">{sa_date}</div>
                            </td>
                            <td>
                              <div className="text-left">{cust_refer}</div>
                            </td>
                            <td>
                              <div className="text-left">{CustName}</div>
                            </td>
                            <td>
                              <div className="text-right">{treat_bal}</div>
                            </td>
                            <td>
                              <div className="text-right">{treat_out}</div>
                            </td>
                            {/* <td>
                              <div className="d-flex justify-content-center text-center">
                                <NormalCheckbox checked={prepaid} disabled />
                              </div>
                            </td> */}
                            <td>
                              <div className="text-right">{pre_bal}</div>
                            </td>
                            <td>
                              <div className="text-right">{pre_out}</div>
                            </td>
                            {/* <td>
                              <div className="d-flex justify-content-center">
                                <NormalCheckbox checked={product} disabled />
                              </div>
                            </td> */}
                            <td>
                              <div className="text-right">{product_bal}</div>
                            </td>
                            <td>
                              <div className="text-right">{product_out}</div>
                            </td>
                            {/* <td>
                              <div className="d-flex justify-content-center">
                                <NormalCheckbox checked={treat} disabled />
                              </div>
                            </td> */}
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

export const OutstandingCustomerPlus = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(OutstandingCustomerPlusClass)
);
