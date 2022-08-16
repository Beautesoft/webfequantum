import React from "react";
import { NormalButton } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import { Link } from "react-router-dom";
import "./style.scss";
import {
  getCustomerPlus,
  getCustomerPlusSettings,
} from "redux/actions/customerPlus";
import { updateForm, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import birthdayIcon from "assets/images/app-icons/3.png";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";

export class ListCustomerPlusClass extends React.Component {
  state = {
    headerDetails: [],
    customerList: [],
    originalCustomerList: [],
    search: "",
    meta: {},
    active: false,
    currentIndex: -1,
    isLoading: true,
    isExportLoading: false,
    isMounted: true,
    orderBy: "desc",
  };
  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount = () => {
    this.getCustomerPlus({});
  };

  handleClick = key => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.updateState(prevState => ({
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

  getCustomerPlus = async data => {
    this.updateState({ isLoading: true });
    try {
      let { search, headerDetails } = this.state;
      let { page = 1, limit = 10 } = data;
      if (headerDetails.length == 0) {
        await this.props.getCustomerPlusSettings();
        let { settings } = this.props;
        for (let {
          display_field_name,
          field_name,
          visible_in_listing,
        } of settings) {
          if (visible_in_listing)
            headerDetails.push({
              label: display_field_name,
              field: field_name,
              sortKey: field_name,
              singleClickFunc: () => this.handleSort(field_name),
            });
        }
        headerDetails.push({ label: "" });
        this.updateState({ headerDetails });
      }
      await this.props.getCustomerPlus(
        `?page=${page}&limit=${limit}&search=${search}`
      );
      let { customerDetails } = this.props;
      this.updateState({
        customerList: customerDetails.dataList,
        originalCustomerList: customerDetails.dataList,
        meta: customerDetails.meta?.pagination,
        isLoading: false,
      });
    } catch (e) {
      console.log(e, "listcustomerplus");
    }
  };

  handlePagination = page => {
    this.getCustomerPlus(page);
  };

  handlesearch = event => {
    console.log(event.target.value);
    let { search } = this.state;
    search = event.target.value;
    this.setState({ search });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.getCustomerPlus({});
      }, 500);
    }
    this.debouncedFn();
  };

  bookAppointment = async data => {
    let formFields = {};
    formFields["custId"] = data.id;
    formFields["custName"] = data.cust_name;
    await this.props.updateForm("basicApptDetail", formFields);
    this.props.history.push(`/admin/newappointment`);
  };
  handleExportClick = async () => {
    this.updateState({ isExportLoading: true });
    let { search } = this.state;
    let { page } = 1;
    let { limit } = 10;
    let exceldata = 1;
    this.props
      .getCustomerPlus(
        `?page=${page}&limit=${limit}&search=${search}&excel=${exceldata}`
      )
      .then(async res => {
        let { data } = res;
        console.log(res, "exportclickresponse");
        await this.updateState({
          isExportLoading: false,
        });
        if (data) {
          // window.open(data);
          var a = document.createElement("a");
          a.setAttribute("href", data);
          a.click();
        }
      });
  };

  handleSort = (sortkey, order) => {
    let { customerList, headerDetails, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });

    if (orderBy === "asc") {
      customerList.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      customerList.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      customerList,
    });
  };

  render() {
    let {
      headerDetails,
      originalCustomerList,
      customerList,
      meta,
      currentIndex,
      isLoading,
      isExportLoading,
    } = this.state;
    let { t, tokenDetail } = this.props;
    return (
      <div className="customer-list container-fluid">
        {Number(tokenDetail.role_code) === 1 ? (
          <div className="row mb-4">
            <div className="col-md-4 col-lg-2 mb-2">
              <Link to="/admin/customerplus/settings">
                <NormalButton
                  normal={true}
                  className="col-12 fs-15 float-right"
                  label="Settings"
                />
              </Link>
            </div>
            <div className="col-md-4 col-lg-3 mb-2">
              <Link to="/admin/customerplus/lpmanagement">
                <NormalButton
                  normal={true}
                  className="col-12 fs-15 float-right"
                  label="LP Management"
                />
              </Link>
            </div>
          </div>
        ) : null}
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-md-12 mb-1">
                <div className="d-flex flex-wrap">
                  <div className="col-md-5 col-12 h5">{t("Customer List")}</div>
                  <div className="col-md-7">
                    <div className="d-flex justify-content-end flex-wrap">
                      <div className="col-md-4 col-12 col-sm-12">
                        <NormalButton
                          mainbg={true}
                          className="col-12 fs-15 float-right"
                          label="Outstanding Customer List"
                          onClick={() =>
                            this.props.history.push(
                              "/admin/customerplus/outstanding"
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3 col-12 col-sm-12 mb-2">
                        <InputSearch
                          className=""
                          placeholder="Search Customer"
                          onChange={this.handlesearch}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="col-md-3 col-12 col-sm-12">
                        <NormalButton
                          mainbg={true}
                          className="col-12 fs-15 float-right"
                          label="Add Customer"
                          onClick={() =>
                            this.props.history.push("/admin/customerplus/add")
                          }
                        />
                      </div>
                      <div className="col-md-2 col-12 col-sm-12">
                        {isExportLoading ? (
                          <div class="d-flex align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">{t("Loading...")}</span>
                            </div>
                          </div>
                        ) : (
                          <NormalButton
                            mainbg={true}
                            className="col-12 fs-15 float-right"
                            label="Export"
                            onClick={this.handleExportClick}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12"></div>
            </div>
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper
                    headerDetails={headerDetails}
                    queryHandler={this.handlePagination}
                    pageMeta={meta}
                    showFilterColumn={true}
                    parentHeaderChange={value =>
                      this.updateState(() => (headerDetails = value))
                    }
                    // sortData={originalCustomerList}
                    // onSort={list => this.updateState({ customerList: list })}
                  >
                    {isLoading ? (
                      <tr>
                        <td colSpan="7">
                          <div className="d-flex mt-5 align-items-center justify-content-center">
                            <div className="spinner-border" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : customerList ? (
                      customerList.map((item, index) => {
                        let {
                          id,
                          cust_code,
                          cust_refer,
                          cust_name,
                          cust_phone2,
                          cust_dob,
                          class_name,
                          birthday,
                        } = item;
                        let date = new Date(cust_dob);
                        //cust_dob = date.toLocaleDateString();
                        cust_dob = dateFormat(date, "dd-mm-yyyy");
                        return (
                          <tr
                            key={index}
                            onClick={() =>
                              this.props.history.push(
                                `/admin/customerplus/${id}/details`
                              )
                            }
                          >
                            {headerDetails.map((e, index) =>
                              e.field ? (
                                <td key={index}>
                                  <div className="text-left">
                                    {item[e.field]}
                                  </div>
                                </td>
                              ) : null
                            )}
                            <td
                              className="position-relative d-none"
                              ref={node => {
                                this.node = node;
                              }}
                              onClick={() => this.handleClick(index)}
                            >
                              {currentIndex === index ? (
                                <>
                                  <div className="d-flex align-items-center justify-content-center horizontal-more-active">
                                    <i className="icon-more"></i>
                                  </div>
                                  <div className="option card">
                                    <div
                                      className="d-flex align-items-center fs-16 pt-3"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/customerplus/${id}/details`
                                        )
                                      }
                                    >
                                      <span className="icon-eye-grey px-3"></span>
                                      {t("View")}
                                    </div>
                                    <div
                                      className="d-flex align-items-center fs-16"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/customerplus/${id}/lpmanagement`
                                        )
                                      }
                                    >
                                      <span className="px-2">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="31"
                                          height="30"
                                          fill="currentColor"
                                          viewBox="0 0 15 30"
                                        >
                                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                        </svg>
                                      </span>
                                      {t("Loyalty Points Management")}
                                    </div>
                                    <div className="d-flex align-items-center fs-16">
                                      <span className="icon-schedule px-3"></span>{" "}
                                      {t("Reschedule Appointment")}{" "}
                                    </div>
                                    <div
                                      className="d-flex align-items-center fs-16"
                                      onClick={() => this.bookAppointment(item)}
                                    >
                                      <span className="px-2">
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
                                      </span>
                                      {t("Book Appointment")}
                                    </div>
                                    <div className="d-flex align-items-center fs-16 pb-3">
                                      <span className="icon-cancel-schedule px-3"></span>{" "}
                                      {t("Cancel Appointment")}{" "}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="d-flex align-items-center justify-content-center horizontal-more">
                                  <i className="icon-more"></i>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customerDetails: state.customerPlus.customerPlusDetail,
  settings: state.customerPlus.customerPlusSettings,
  tokenDetail: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomerPlus,
      updateForm,
      getCustomerPlusSettings,
      getCommonApi,
    },
    dispatch
  );
};

export const ListCustomerPlus = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListCustomerPlusClass)
);
