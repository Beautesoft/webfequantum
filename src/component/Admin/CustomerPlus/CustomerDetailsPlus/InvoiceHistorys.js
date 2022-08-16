import React, { Component } from "react";
import "./style.scss";
import Modal from "assets/images/modal-avatar.png";
import filter from "assets/images/filter.png";

import { history } from "helpers";

import { NormalButton, NormalInput } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCustomer } from "redux/actions/customer";
import _ from "lodash";
import { InvoiceHistory } from "./InvoiceHistory";
import { withTranslation } from "react-i18next";
import { getCommonApi } from "redux/actions/common";

export class InvoiceHistorysClass extends Component {
  state = {
    activeTab: "1",
    isOpenTreatmentDone: false,
    formFields: {
      auto: false,
      totalOutstanding: "",
      outstanding: "",
    },
    isActiveTab: "detail",
    visible: false,
    customerOption: [],
  };

  componentWillMount() {
    this.getCustomer();
  }

  getCustomer = () => {
    this.props.getCustomer(this.props.match.params.id).then(res => {
      console.log(res, "asdasdfasdfasdf resssssss");
    });
  };

  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    console.log(value, name, "ghfhgfhjfkhjg");
    formFields[name] = value;

    this.setState({
      formFields,
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
    let { customerDetail = {}, t } = this.props;
    console.log(customerDetail, "asdasdfasdfasdf === sdfasdfagf");
    let { id, cust_name, cust_refer, cust_img, is_allowedit } = customerDetail;
    let {
      isOpenTreatmentDone,
      formFields,
      isActiveTab,
      customerOption,
      visible,
    } = this.state;
    return (
      <div className="view-detail">
        <div className="row pb-md-4">
          <div className="col-md-6 head-label-nav">
            <p
              className="category"
              onClick={() => history.push("/admin/customerplus")}
            >
              {t(`Customer`)}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t(`Customer Details`)}</p>
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
            </div>
          </div>
        </div>
        <div className="view-detail-box p-3 d-flex flex-column">
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
            <div className="col-6 icon-change menu-list p-0">
              <button
                className={`btn outline-btn col-2 mr-1 fs-14 float-left text-capitalize detail`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/details`
                  )
                }
              >
                {t("Detail")}
              </button>
              <button
                className={`btn outline-btn col-2 mr-1 fs-14 float-left text-capitalize account`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/account`
                  )
                }
              >
                {t("Account")}
              </button>
              <button
                className={`btn outline-btn col-2 mr-1 fs-14 float-left text-capitalize hold`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/hold`
                  )
                }
              >
                {t("Hold")}
              </button>
              <button
                className={`btn outline-btn col-3 mr-1 fs-14 active float-left text-capitalize invoice`}
                onClick={() =>
                  history.push(
                    `/admin/customerplus/${this.props.match.params.id}/invoice`
                  )
                }
              >
                {t("Invoice History")}
              </button>
            </div>
            <div className="col-2 icon-change edit">
              {is_allowedit ? (
                <button
                  className="btn outline-btn col-2 mr-1 fs-15 float-right text-capitalize"
                  onClick={() =>
                    this.props.history.push(
                      `/admin/customerplus/${this.props.match.params.id}/editCustomer`
                    )
                  }
                >
                  <span className="icon-edit mr-1"></span>
                  {t(`Edit`)}
                </button>
              ) : null}
            </div>
          </div>
          <InvoiceHistory id={this.props.match.params.id}></InvoiceHistory>
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

export const InvoiceHistorys = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(InvoiceHistorysClass)
);
