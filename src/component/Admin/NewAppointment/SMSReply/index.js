import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalSelect,
  NormalModal,
  NormalDate,
} from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import { NormalInput, NormalDateTime } from "component/common";
import { getLoginSaloon } from "redux/actions/auth";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { withTranslation } from "react-i18next";
import { SMSReplyPopup } from "./SMSReplyPopup";
import closeIcon from "assets/images/close.png";
import _ from "lodash";

export class SMSReplyClass extends Component {
  state = {
    headerDetails: [
      {
        label: "Date & Time",
        divClass: "justify-content-end text-right",
      },
      { label: "Customer Name" },
      { label: "Cust Ref" },
      { label: "Site Code" },
      { label: "Phone" },
      { label: "Reply" },
      { label: "Handle", divClass: "justify-content-center text-center" },
    ],
    smsReplyList: [],
    pageMeta: {
      chunk: 10,
      page: 1,
      total: 10,
      totalPages: 2,
    },
    formField: {
      fromDate: new Date(),
      toDate: new Date(),
      custName: "",
      customerId: "",
      siteCode: "",
    },
    active: false,
    currentIndex: -1,
    page: 1,
    limit: 5,

    settingData: {},
    sitegroup: [],
    isOpenSelectedSMS: false,
    SelectedId: "",
    visible: false,
    customerOption: [],
  };

  componentDidMount() {
    this.listofsitegropus();
    this.getTransactions();
    this.handleItemSettings();
  }

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

  listofsitegropus = async () => {
    let { sitegroup } = this.state;
    sitegroup = [];

    await this.props.getCommonApi("branchlist/").then(res => {
      for (let key of res.data) {
        sitegroup.push({ value: key.id, label: key.itemsite_desc });
      }
      this.setState({
        sitegroup,
      });
    });
  };
  getTransactions = () => {
    let { smsReplyList, pageMeta, formField } = this.state;
    let { fromDate, toDate, customerId, custName, siteCode } = formField;

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
        `smsreply/?from_date=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&to_date=${dateFormat(
          To,
          "yyyy-mm-dd"
        )}&cust_pk=${customerId}&site_pk=${siteCode}`
      )
      .then(async res => {
        console.log(res, "transactionlistdsfdfaafg");
        await this.setState({ smsReplyList: [] });
        smsReplyList = res.data.dataList;
        pageMeta = res.data.meta.pagination;
        this.setState({ smsReplyList, pageMeta });
      });
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

  handleChange = async ({ target: { value, name } }) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
  };

  handleDatePick = async ({ target: { value, name } }) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
  };

  handleSearch = () => {
    this.getTransactions();
  };

  handleSelectedSms = data => {
    this.setState({
      SelectedId: data.id,
    });
    this.handleDialog();
  };
  handleDialog = () => {
    this.setState(prevState => ({
      isOpenSelectedSMS: !prevState.isOpenSelectedSMS,
    }));
  };

  handleSearchCustomer = async event => {
    //    event.persist();
    let { formField, visible } = this.state;
    formField["custName"] = event.target.value;
    visible = true;
    await this.setState({ formField, visible });

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.search();
      }, 400);
    }
    this.debouncedFn();
  };

  search = searchString => {
    let { formField } = this.state;
    this.props
      .getCommonApi(`custappt/?search=${formField.custName}`)
      .then(key => {
        let { status, data } = key;

        if (status === 200) {
          this.setState({ customerOption: data });
        }
      });
  };

  handleSelectCustomer = async data => {
    let { formField } = this.state;
    formField["customerId"] = data.id;
    formField["custName"] = data.cust_name;
    await this.setState({ formField, customerOption: [] });
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

  render() {
    let {
      headerDetails,
      pageMeta,
      smsReplyList,
      formField,
      sitegroup,
      isOpenSelectedSMS,
      visible,
      customerOption,
    } = this.state;
    let { fromDate, toDate, custName, customerId, siteCode } = formField;
    let { t } = this.props;
    return (
      <div className="sms-reply">
        <div className="row pb-md-2">
          <div className="col-md-2 mb-4">
            <p
              className="fw-500 h5 cursor-pointer"
              // onClick={() => history.push("/admin/newappointment/")}
            >
              {t(`SMS Reply`)}
            </p>
          </div>
          <div className="col-md-12">
            <div className="d-flex flex-wrap justify-content-start">
              <div className="col-md-2 col-12 mb-3">
                <label className="text-left text-black common-label-text ">
                  {t("From Date")}
                </label>
                <div className="">
                  <NormalDate
                    value={fromDate}
                    name="fromDate"
                    type="date"
                    onChange={this.handleDatePick}
                    maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                    showYearDropdown={true}
                    popperPlacement={"bottom"}
                  />
                </div>
              </div>
              <div className="col-md-2 col-12 mb-3">
                <label className="text-left text-black common-label-text ">
                  {t("To Date")}
                </label>
                <div className="">
                  <NormalDate
                    value={toDate}
                    name="toDate"
                    type={`date`}
                    onChange={this.handleDatePick}
                    minDate={new Date(fromDate)}
                    showDisabledMonthNavigation
                    showYearDropdown={true}
                    popperPlacement={"bottom"}
                  />
                </div>
              </div>

              <div className="col-md-2 col-12">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Customer Search")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="customer.."
                    value={custName}
                    name="custName"
                    onChange={this.handleSearchCustomer}
                    onClick={this.handleClick}
                  />
                </div>
              </div>

              <div className="col-md-2 col-12">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Site")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    placeholderrequired={false}
                    options={sitegroup}
                    value={siteCode}
                    iconname="icon-down-key"
                    name="siteCode"
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-2 col-12">
                <NormalButton
                  buttonClass={"mt-4"}
                  mainbg={true}
                  className="confirm"
                  label="Search"
                  outline={false}
                  onClick={this.handleSearch}
                />
              </div>
            </div>
          </div>
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
        <div className="py-4">
          <div className="response-table mb-4">
            <TableWrapper
              headerDetails={headerDetails}
              queryHandler={this.handlePagination}
              pageMeta={pageMeta}
            >
              {smsReplyList && smsReplyList.length > 0 ? (
                smsReplyList.map((dataitem, index) => {
                  let {
                    appt_date,
                    cust_name,
                    cust_refer,
                    date,
                    phone,
                    id,
                    reply,
                    service_name,
                    site_code,
                    staff_name,
                  } = dataitem;
                  return (
                    <tr key={index}>
                      <td>
                        <div className="text-right">{date}</div>
                      </td>
                      <td>
                        <div className="text-left">{cust_name}</div>
                      </td>
                      <td>
                        <div className="text-left">{cust_refer}</div>
                      </td>
                      <td>
                        <div className="text-left">{site_code}</div>
                      </td>
                      <td>
                        <div className="text-left">{phone}</div>
                      </td>
                      <td>
                        <div className="text-left">{reply}</div>
                      </td>

                      <td className="position-relative">
                        <div className="d-flex justify-content-center">
                          <NormalButton
                            buttonClass={"mx-0 ml-1"}
                            mainbgrev={true}
                            className="confirm fs-11"
                            label={t("Change")}
                            outline={false}
                            onClick={() => this.handleSelectedSms(dataitem)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12">
                    <div className="text-center">No data</div>
                  </td>
                </tr>
              )}
            </TableWrapper>

            <NormalModal
              className={"selected-modal"}
              style={{ minWidth: "55%" }}
              modal={isOpenSelectedSMS}
              handleModal={() => {}}
            >
              <img
                onClick={this.handleDialog}
                className="close cursor-pointer"
                src={closeIcon}
                alt=""
              />
              <SMSReplyPopup
                TransactionId={this.state.SelectedId}
                handleModal={this.handleDialog}
              ></SMSReplyPopup>
            </NormalModal>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      getLoginSaloon,
    },
    dispatch
  );
};

export const SMSReply = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SMSReplyClass)
);
