import React, { Component } from "react";
import "./style.scss";
import Modal from "assets/images/modal-avatar.png";
import filter from "assets/images/filter.png";
import {
  Appointments,
  PurchaseHistory,
  PersonalDetails,
  Favourites,
} from "./Details";
import { history } from "helpers";
import _ from "lodash";
import classnames from "classnames";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import {
  NormalButton,
  NormalModal,
  InputSearch,
  NormalInput,
  NormalCheckbox,
} from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCustomer } from "redux/actions/customer";
import { getCommonApi } from "redux/actions/common";
import closeIcon from "assets/images/close.png";
import { Details } from "./Detail";
import { Account } from "./Account";
import { TreatmentHistory } from "./TreatmentHistory";
import { withTranslation } from "react-i18next";

export class CustomerDetailsPlusClass extends Component {
  state = {
    activeTab: "1",
    isOpenTreatmentDone: false,
    formFields: {
      auto: false,
      totalOutstanding: "",
      outstanding: "",
    },
    isActiveTab: "detail",
    customerOption: [],
    visible: false,
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };
  componentWillMount() {
    this.getCustomer();
  }

  getCustomer = () => {
    this.props.getCustomer(this.props.match.params.id).then(res => {
      console.log(res, "asdasdfasdfasdf resssssss");
    });
  };

  handleDialog = () => {
    let { isOpenTreatmentDone } = this.state;
    isOpenTreatmentDone = false;
    this.setState({
      isOpenTreatmentDone,
    });
  };

  handleTopup = () => {
    let { isOpenTreatmentDone } = this.state;
    isOpenTreatmentDone = true;
    this.setState({
      isOpenTreatmentDone,
    });
  };
  handleSearch = async event => {
    // event.persist();
    let { formFields, visible } = this.state;
    formFields.custName = event.target.value;
    await this.setState({ formFields, visible: true });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.search();
      }, 500);
    }
    this.debouncedFn();
  };

  search = searchString => {
    let { formFields } = this.state;
    this.props
      .getCommonApi(`custappt/?search=${formFields.custName}`)
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          // for (let value of data) {
          //     customerList.push({ value: value.id, label: value.emp_name })
          // }
          this.setState({ customerOption: data });
        }
      });
  };
  handleClick = key => {
    if (!this.state.visible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    if (this.state.visible) {
      let { basicApptDetail } = this.props;
      this.search(basicApptDetail);
    }
    this.setState(prevState => ({
      visible: !prevState.visible,
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
  handleSelectCustomer = async data => {
    await this.setState({
      customerOption: [],
    });
    this.props.history.push(`/admin/customerplus/${data.id}/details`);
    window.location.reload();
    this.handleClick();
  };
  render() {
    let { customerDetail = {} } = this.props;
    let { t } = this.props;
    console.log(customerDetail, "asdasdfasdfasdfcustomeredit === sdfasdfagf");
    let { id, cust_name, cust_refer, cust_img, is_allowedit } = customerDetail;
    let {
      isOpenTreatmentDone,
      formFields,
      isActiveTab,
      customerOption,
      visible,
    } = this.state;
    return (
      <div className="view-detail container-fluid">
        <div className="row pb-md-4">
          <div className="col-md-6 head-label-nav">
            <p
              className="category"
              onClick={() => history.push("/admin/customerplus")}
            >
              {t("Customer")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Customer Details")}</p>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-end">
              <div className="input-container">
                <NormalInput
                  placeholder="Search Customer.."
                  value={formFields.custName}
                  name="custName"
                  onChange={this.handleSearch}
                  onClick={this.handleClick}
                />
              </div>

              <div className="w-100 col-4 mx-2 p-0">
                <NormalButton
                  mainbg={true}
                  className="col-12 fs-15 float-right"
                  label="Add Customer"
                  onClick={() =>
                    this.props.history.push("/admin/customerplus/add")
                  }
                />
              </div>
              {/* <div className="bg-white ">
                
                <img src={filter} alt="" />
              </div> */}
            </div>
          </div>
        </div>
        <div className="view-detail-box p-4 d-flex flex-column">
          <div className="d-flex pb-3">
            <div className="col-4 d-flex align-items-center">
              <div>
                <img
                  className="modal-avatar"
                  src={cust_img ? cust_img : Modal}
                  alt=""
                  height="80"
                  width="80"
                />
              </div>
              <div className="pl-3">
                <p className="fs-28 fw-500 customer-detail-heading py-2">
                  {t(cust_name)}
                </p>
                <p className="fs-18 fw-500 customer-detail-heading py-2">
                  {t(cust_refer)}
                </p>
              </div>
            </div>
            <div className="col-6 icon-change menu-list">
              <button
                className={`btn outline-btn col-2 mx-2 fs-14 active float-left text-capitalize detail`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/details`
                  )
                }
              >
                {t("Detail")}
              </button>
              <button
                className={`btn outline-btn col-2 mx-2 fs-14 float-left text-capitalize account`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/account`
                  )
                }
              >
                {t("Account")}
              </button>
              <button
                className={`btn outline-btn col-2 mx-2 fs-14 float-left text-capitalize hold`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/hold`
                  )
                }
              >
                {t("Hold")}
              </button>
              <button
                className={`btn outline-btn col-3 mr-1 fs-14 p-1 float-left text-capitalize invoice`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/invoice`
                  )
                }
              >
                {t("Invoice History")}
              </button>
              {/* <button className={`btn outline-btn col-2 mx-2 fs-14 float-left text-capitalize treatment`} onClick={() => history.push(`/admin/customerplus/${this.props.match.params.id}/treatment`)}>
                                Treatment History
                            </button> */}
            </div>
            <div className="col-2 icon-change edit">
              {is_allowedit ? (
                <button
                  className="btn outline-btn col-2 mx-2 fs-15 float-right text-capitalize"
                  onClick={() =>
                    this.props.history.push(
                      `/admin/customerplus/${this.props.match.params.id}/editCustomer`
                    )
                  }
                >
                  <span className="icon-edit mr-2"></span>
                  {t("Edit")}
                </button>
              ) : null}
            </div>
          </div>
          <Details id={this.props.match.params.id}></Details>
        </div>
        {visible ? (
          <div className="customerSearch-block">
            <div className="d-flex mt-4 table table-header w-100 m-0">
              <div className="col-2">{t("Name")}</div>
              <div className="col-2">{t("Phone")}</div>
              <div className="col-2">{t("Cust Code")}</div>
              <div className="col-2">{t("Reference")}</div>
              <div className="col-3">{t("Email")}</div>
              <div className="col-1">{t("NRIC")}</div>
            </div>
            <div className="response-table w-100">
              {customerOption.length > 0 ? (
                customerOption.map((item, index) => {
                  return (
                    <div
                      className="row m-0 table-body w-100 border"
                      onClick={() => this.handleSelectCustomer(item)}
                      key={index}
                    >
                      <div className="col-2">{item.cust_name}</div>
                      <div className="col-2">{item.cust_phone1}</div>
                      <div className="col-2">{item.cust_code}</div>
                      <div className="col-2">{item.cust_refer}</div>
                      <div className="col-3">{item.cust_email}</div>
                      <div className="col-1">{item.cust_nric}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100">
                  {t("No Data are available")}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  customerDetail: state.customer.customerDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomer,
      getCommonApi,
    },
    dispatch
  );
};

export const CustomerDetailsPlus = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CustomerDetailsPlusClass)
);
