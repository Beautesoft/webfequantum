import React, { Component } from "react";
import "./style.scss";
import { InputSearch, NormalDate, NormalDateTime } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { history } from "helpers";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import Woman from "assets/images/woman.png";
import Box from "assets/images/box.png";
import Coupon from "assets/images/coupon.png";
import Like from "assets/images/like.png";
import Rise from "assets/images/rise.png";
import TotalCollection from "assets/images/TotalCollection.png";
import TreatmentDone from "assets/images/TreatmentDone.png";
import { dateFormat } from "service/helperFunctions";
import { Toast } from "service/toast";
import { appointment } from "service/apiVariables";
import Appointimg from "assets/images/appointment_card.png";
import { withTranslation } from "react-i18next";
import _ from "lodash";
export class NewQuickStatsClass extends Component {
  state = {
    customer: { daily_custcnt: 0, monthly_custcnt: 0, total_cust: 0 },
    product_sold: {
      dailyproduct_qty: 0,
      monthlyproduct_qty: 0,
      daily_product: "0.00",
      monthly_product: "0.00",
      daily_product_ar: "0.00",
      monthly_product_ar: "0.00",
    },
    service_sold: {
      dailyservice_qty: 0,
      monthlyservice_qty: 0,
      daily_service: "0.00",
      monthly_service: "0.00",
      daily_service_ar: "0.00",
      monthly_service_ar: "0.00",
    },
    voucher_sold: {
      dailyvoucher_qty: 0,
      monthlyvoucher_qty: 0,
      daily_voucher: "0.00",
      monthly_voucher: "0.00",
    },
    prepaid_sold: {
      dailyprepaid_qty: 0,
      monthlyprepaid_qty: 0,
      daily_prepaid: "0.00",
      monthly_prepaid: "0.00",
      daily_prepaid_ar: "0.00",
      monthly_prepaid_ar: "0.00",
    },
    treatment_done: {
      daily_preqty: 0,
      monthly_preqty: 0,
      daily_preamt: "0.00",
      montly_preamt: "0.00",

      daily_single_td_qty: 0,
      month_single_td_qty: 0,
      daily_singletdamt: "0.00",
      month_singletdamt: "0.00",

      daily_multi_td_qty: 0,
      month_multi_td_qty: 0,
      daily_multi_tdamt: "0.00",
      month_multi_tdamt: "0.00",
    },
    total_collection: {
      daily_sales: "0.00",
      monthly_sales: "0.00",
      daily_nonsales: "0.00",
      monthly_nonsales: "0.00",
      total_daily: "0.00",
      total_monthly: "0.00",
    },
    appointment: {
      daily_appt_cnt: "0",
      monthly_appt_cnt: "0",
      daily_reqthe_cnt: "0",
      monthly_reqthe_cnt: "0",
      daily_source_cnt: "0",
      month_source_cnt: "0",
    },
    healspa_data: {
      percent_custser_daily: "0",
      percent_custser_monthly: "0",
      percent_newcustser_daily: "0",
      percent_newcustser_monthly: "0",
      percent_wakincusttddaily: "0",
      percent_wakincusttdmonth: "0",
    },
    formField: {
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
  };

  componentDidMount() {
    this.getCustomerProductandService();
    this.getVoucherandPrepaid();
    this.getTreatmentandTotal();
  }

  getCustomerProductandService = () => {
    let { customer, product_sold, service_sold, formField } = this.state;
    let { fromDate, toDate } = formField;
    let From = new Date();
    console.log(fromDate);
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
    console.log(From);
    this.props
      .getCommonApi(
        `dashboardcust/?from_date=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&to_date=${dateFormat(To, "yyyy-mm-dd")}`
      )
      .then(res => {
        console.log(res, "custdashbordpart");
        customer = res.customer;
        product_sold = res.product_sold;
        service_sold = res.service_sold;
        this.setState({
          customer,
          product_sold,
          service_sold,
        });
      });

    console.log(customer);
  };
  getVoucherandPrepaid = () => {
    let { voucher_sold, prepaid_sold, healspa_data, formField } = this.state;
    let { fromDate, toDate } = formField;
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
        `dashboardvoucher/?from_date=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&to_date=${dateFormat(To, "yyyy-mm-dd")}`
      )
      .then(res => {
        console.log(res, "voucherandprepaid");
        voucher_sold = res.voucher_sold;
        prepaid_sold = res.prepaid_sold;
        healspa_data = res.healspa_data;
        this.setState({
          voucher_sold,
          prepaid_sold,
          healspa_data,
        });
      });
  };
  getTreatmentandTotal = () => {
    let { treatment_done, total_collection, formField, appointment } =
      this.state;
    let { fromDate, toDate } = formField;
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
        `dashboardtd/?from_date=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&to_date=${dateFormat(To, "yyyy-mm-dd")}`
      )
      .then(res => {
        console.log(res, "treatment and total");
        treatment_done = res.treatment_done;
        total_collection = res.total_collection;
        appointment = res.appointment;
        this.setState({
          treatment_done,
          total_collection,
          appointment,
        });
      });
  };

  handleDateChange = async (name, value) => {
    // event.persist();
    console.log(value);
    let { formField } = this.state;
    formField[name] = value;

    this.setState({
      formField,
    });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        if (this.checktime()) {
          this.handleDatePick();
        } else {
          this.clearData();
        }
      }, 1000);
    }

    this.debouncedFn();
  };

  clearData = () => {
    this.setState({
      customer: { daily_custcnt: 0, monthly_custcnt: 0, total_cust: 0 },
      product_sold: {
        dailyproduct_qty: 0,
        monthlyproduct_qty: 0,
        daily_product: "0.00",
        monthly_product: "0.00",
        daily_product_ar: "0.00",
        monthly_product_ar: "0.00",
      },
      service_sold: {
        dailyservice_qty: 0,
        monthlyservice_qty: 0,
        daily_service: "0.00",
        monthly_service: "0.00",
        daily_service_ar: "0.00",
        monthly_service_ar: "0.00",
      },
      voucher_sold: {
        dailyvoucher_qty: 0,
        monthlyvoucher_qty: 0,
        daily_voucher: "0.00",
        monthly_voucher: "0.00",
      },
      prepaid_sold: {
        dailyprepaid_qty: 0,
        monthlyprepaid_qty: 0,
        daily_prepaid: "0.00",
        monthly_prepaid: "0.00",
        daily_prepaid_ar: "0.00",
        monthly_prepaid_ar: "0.00",
      },
      treatment_done: {
        daily_preqty: 0,
        monthly_preqty: 0,
        daily_preamt: "0.00",
        montly_preamt: "0.00",

        daily_single_td_qty: 0,
        month_single_td_qty: 0,
        daily_singletdamt: "0.00",
        month_singletdamt: "0.00",

        daily_multi_td_qty: 0,
        month_multi_td_qty: 0,
        daily_multi_tdamt: "0.00",
        month_multi_tdamt: "0.00",
      },
      total_collection: {
        daily_sales: "0.00",
        monthly_sales: "0.00",
        daily_nonsales: "0.00",
        monthly_nonsales: "0.00",
        total_daily: "0.00",
        total_monthly: "0.00",
      },
      appointment: {
        daily_appt_cnt: "0",
        monthly_appt_cnt: "0",
        daily_reqthe_cnt: "0",
        monthly_reqthe_cnt: "0",
        daily_source_cnt: "0",
        month_source_cnt: "0",
      },
      healspa_data: {
        percent_custser_daily: "0",
        percent_custser_monthly: "0",
        percent_newcustser_daily: "0",
        percent_newcustser_monthly: "0",
        percent_wakincusttddaily: "0",
        percent_wakincusttdmonth: "0",
      },
    });
  };

  handleDatePick = async () => {
    // console.log(name, value, "sdfgdfhfshg", dateFormat(value));
    // // dateFormat(new Date())
    // let { formField } = this.state;
    // formField[name] = value;
    // formFields[name] = value;

    // this.getCart()
    this.clearData();
    this.getCustomerProductandService();
    this.getVoucherandPrepaid();
    this.getTreatmentandTotal();
  };
  checktime = () => {
    let { formField } = this.state;
    let { fromDate, toDate } = formField;
    if (fromDate > toDate) {
      Toast({
        type: "info",
        message: "From date should not more than todate",
      });
      return false;
    } else {
      return true;
    }
  };
  render() {
    let {
      customer,
      product_sold,
      service_sold,
      voucher_sold,
      prepaid_sold,
      treatment_done,
      total_collection,
      formField,
      appointment,
      healspa_data,
    } = this.state;
    let { tokenDetail, t } = this.props;
    let { fromDate, toDate } = formField;
    return (
      <div className="quickStats">
        <div className="palette ">
          <div className="color-detail col-md-4">
            <div className="color"></div>
            <div className="detail">{t("Daily Value")}</div>
          </div>
          <div className="color-detail col-md-10">
            <div className="color not-available"></div>
            <div className="detail">{t("Monthly Value")}</div>
          </div>
          <div className="last col-md-12">
            <div className="detail">{t("From")}</div>
            <div className="input-group date">
              <NormalDateTime
                onChange={this.handleDateChange}
                inputcol="p-0 inTime"
                value={fromDate ? new Date(fromDate) : new Date()}
                name="fromDate"
                className="dob-pick"
                showYearDropdown={true}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="detail">{t("To")}</div>
            <div className="input-group date">
              <NormalDateTime
                onChange={this.handleDateChange}
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
        <div className="d-flex flex-wrap">
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Customer")}</p>
                <div className="cart-img">
                  <img src={Woman} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-between px-2">
                <p className="customer-label">{customer.total_cust}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{customer.daily_custcnt} / </span>
                  <span>{customer.monthly_custcnt}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
                <p className="label-title">{t("New Customer")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>
                    {healspa_data.percent_newcustser_daily
                      ? healspa_data.percent_newcustser_daily
                      : 0}
                    {"% "}/{" "}
                  </span>
                  <span>
                    {healspa_data.percent_newcustser_monthly
                      ? healspa_data.percent_newcustser_monthly
                      : 0}
                    {`%`}
                  </span>
                </div>
                <p className="label-title">{t("New Customer Trn Rate")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>
                    {healspa_data.percent_custser_daily
                      ? healspa_data.percent_custser_daily
                      : 0}
                    {`% `}/{" "}
                  </span>
                  <span>
                    {healspa_data.percent_custser_monthly
                      ? healspa_data.percent_custser_monthly
                      : 0}
                    {`%`}
                  </span>
                </div>
                <p className="label-title">{t("Old Customer Trn Rate")}</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Product Sold")}</p>
                <div className="cart-img">
                  <img src={Box} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-start px-2 count-label">
                <div>
                  <span>{product_sold.dailyproduct_qty} / </span>
                  <span>{product_sold.monthlyproduct_qty}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{product_sold.daily_product} / </span>
                  <span>{product_sold.monthly_product}</span>
                </div>
                <p className="label-title">{t("Amount")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{product_sold.daily_product_ar} / </span>
                  <span>{product_sold.monthly_product_ar}</span>
                </div>
                <p className="label-title">
                  {t("AR")} {t("Amount")}
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Voucher Sold")}</p>
                <div className="cart-img">
                  <img src={Coupon} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-start px-2 count-label">
                <div>
                  <span>{voucher_sold.dailyvoucher_qty} / </span>
                  <span>{voucher_sold.monthlyvoucher_qty}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{voucher_sold.daily_voucher} / </span>
                  <span>{voucher_sold.monthly_voucher}</span>
                </div>
                <p className="label-title">{t("Amount")}</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Service Sold")}</p>
                <div className="cart-img">
                  <img src={Like} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-start px-2 count-label">
                <div>
                  <span>{service_sold.dailyservice_qty} / </span>
                  <span>{service_sold.monthlyservice_qty}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
              </div>

              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{service_sold.daily_service} / </span>
                  <span>{service_sold.monthly_service}</span>
                </div>
                <p className="label-title">{t("Amount")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{service_sold.daily_service_ar} / </span>
                  <span>{service_sold.monthly_service_ar}</span>
                </div>
                <p className="label-title">
                  {t("AR")} {t("Amount")}
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Prepaid Sold")}</p>
                <div className="cart-img">
                  <img src={Rise} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-start px-2 count-label">
                <div>
                  <span>{prepaid_sold.dailyprepaid_qty} / </span>
                  <span>{prepaid_sold.monthlyprepaid_qty}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{prepaid_sold.daily_prepaid} / </span>
                  <span>{prepaid_sold.monthly_prepaid}</span>
                </div>
                <p className="label-title">{t("Amount")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{prepaid_sold.daily_prepaid_ar} / </span>
                  <span>{prepaid_sold.monthly_prepaid_ar}</span>
                </div>
                <p className="label-title">
                  {t("AR")} {t("Amount")}
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Treatment Done")}</p>
                <div className="cart-img">
                  <img src={TreatmentDone} alt="" />
                </div>
              </div>

              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{treatment_done.daily_preqty} / </span>
                  <span>{treatment_done.monthly_preqty}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
                <div>
                  <span>{treatment_done.daily_preamt} / </span>
                  <span>{treatment_done.montly_preamt}</span>
                </div>
                <p className="label-title">
                  {t("Prepaid")} ({t("Amount")})
                </p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{treatment_done.daily_single_td_qty} / </span>
                  <span>{treatment_done.month_single_td_qty}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
                <div>
                  <span>{treatment_done.daily_singletdamt} / </span>
                  <span>{treatment_done.month_singletdamt}</span>
                </div>
                <p className="label-title">
                  {t("Single")} ({t("Amount")})
                </p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{treatment_done.daily_multi_td_qty} / </span>
                  <span>{treatment_done.month_multi_td_qty}</span>
                  <span className="fs-10">{t(" Qty")}</span>
                </div>
                <div>
                  <span>{treatment_done.daily_multi_tdamt} / </span>
                  <span>{treatment_done.month_multi_tdamt}</span>
                </div>
                <p className="label-title">
                  {t("Package")} ({t("Amount")})
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Total Collections")}</p>
                <div className="cart-img">
                  <img src={TotalCollection} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-start px-2 count-label">
                <div>
                  <span>{total_collection.total_daily} / </span>
                  <span>{total_collection.total_monthly}</span>
                </div>
              </div>

              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{total_collection.daily_sales} / </span>
                  <span>{total_collection.monthly_sales}</span>
                </div>
                <p className="label-title">{t("Sales")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{total_collection.daily_nonsales} / </span>
                  <span>{total_collection.monthly_nonsales}</span>
                </div>
                <p className="label-title">{t("Non Sales")}</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content position-relative">
            <div className={`product-card card`}>
              <div className="d-flex justify-content-between px-2 title-border">
                <p className="label-header">{t("Appointment")}</p>
                <div className="cart-img">
                  <img src={Appointimg} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-start px-2 count-label">
                <div>
                  <span>{appointment.daily_appt_cnt} / </span>
                  <span>{appointment.monthly_appt_cnt}</span>
                </div>
              </div>

              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{appointment.daily_reqthe_cnt} / </span>
                  <span>{appointment.monthly_reqthe_cnt}</span>
                </div>
                <p className="label-title">{t("Request therapist")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>{appointment.daily_source_cnt} / </span>
                  <span>{appointment.month_source_cnt}</span>
                </div>
                <p className="label-title">{t("Source count")}</p>
              </div>
              <div className="d-flex flex-column justify-content-between px-2 count-label">
                <div>
                  <span>
                    {healspa_data.percent_wakincusttddaily
                      ? healspa_data.percent_wakincusttddaily
                      : 0}{" "}
                    /{" "}
                  </span>
                  <span>
                    {healspa_data.percent_wakincusttdmonth
                      ? healspa_data.percent_wakincusttdmonth
                      : 0}
                  </span>
                </div>
                <p className="label-title">{t("Customer Unit Price")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //tokenDetail: state.authStore.tokenDetails,
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

export const NewQuickStats = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(NewQuickStatsClass)
);
