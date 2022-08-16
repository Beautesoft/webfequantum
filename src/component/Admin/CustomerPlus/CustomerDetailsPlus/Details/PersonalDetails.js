import React, { Component } from "react";
import { getCustomer } from "redux/actions/customer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

export class PersonalDetailsClass extends Component {
  state = {};

  componentDidMount() {}

  render() {
    let { customerDetail = {}, t } = this.props;
    console.log(customerDetail, "asdasdfasdfasdf === sdfasdfagf");
    let {
      id,
      cust_name,
      cust_address,
      last_visit,
      upcoming_appointments,
      cust_dob,
      cust_phone2,
      Cust_sexesid,
      cust_email,
      join_date,
      total_invoice,
      service_package,
      prepaid,
      products,
      credit_note,
      voucher,
      appointment,
      service_balance,
      service_outstanding,
      service_packages,
      service_session,
      prepaid_balance,
      prepaid_card,
      prepaid_outstanding,
      product_balance,
      product_hold,
      product_outstanding,
      credit_amount,
      credit_count,
      voucher_count,
      voucher_amount,
      appoint,
    } = customerDetail;
    return (
      <>
        <div className="customer-details">
          <div className="row pt-5">
            <div className="col-3">
              <p className="customer-detail-desc pb-4">
                {t(`Contact Numbers`)}
              </p>
            </div>
            <div className="col-9">
              <p className="customer-detail-text pb-4">{cust_phone2}</p>
            </div>
            <div className="col-3">
              <p className="customer-detail-desc pb-4">{t(`Email Address`)}</p>
            </div>
            <div className="col-9">
              <p className="customer-detail-text pb-4">{cust_email}</p>
            </div>
            <div className="col-3">
              <p className="customer-detail-desc pb-4">{t(`Address`)}</p>
            </div>
            <div className="col-9">
              <p className="customer-detail-text pb-4">{cust_address}</p>
            </div>
            <div className="col-3">
              <p className="customer-detail-desc pb-4">{t(`Gender`)}</p>
            </div>
            <div className="col-9">
              <p className="customer-detail-text pb-4">
                {Cust_sexesid === 1 ? "Male" : "Female"}
              </p>
            </div>

            <div className="col-3">
              <p className="customer-detail-desc pb-4">{t(`DOB`)}</p>
            </div>
            <div className="col-9">
              <p className="customer-detail-text pb-4">{cust_dob}</p>
            </div>
            <div className="col-3">
              <p className="customer-detail-desc pb-4">{t(`Join Date`)}</p>
            </div>
            <div className="col-9">
              <p className="customer-detail-text pb-4">{join_date}</p>
            </div>
            <div className="col-3">
              <p className="customer-detail-desc pb-4">{t(`Total Invoices`)}</p>
            </div>
            <div className="col-9">
              <p className="customer-detail-text pb-4">{total_invoice}</p>
            </div>
          </div>
          <div className="row pt-5">
            <div className="col-3 border">
              <p className="customer-detail-desc pb-4">
                {t(`Service Packages`)}
              </p>
            </div>
            <div className="col-9 border">
              <div className="d-flex">
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("Available Sessions")}
                  </div>
                  <p className="customer-detail-text pb-4">{service_session}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("No. of Packages")}
                  </div>
                  <p className="customer-detail-text pb-4">
                    {service_packages}
                  </p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("Available Credit")}
                  </div>
                  <p className="customer-detail-text pb-4">{service_balance}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">{t("AR")}</div>
                  <p className="customer-detail-text pb-4">
                    {service_outstanding}
                  </p>
                </div>
                {/* <p className="customer-detail-text pb-4">{service_package}</p> */}
              </div>
            </div>
            <div className="col-3 border">
              <p className="customer-detail-desc pb-4">{t(`Prepaid`)}</p>
            </div>
            <div className="col-9 border">
              <div className="d-flex">
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50"></div>
                  <p className="customer-detail-text pb-4"></p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">{t("No. of Cards")}</div>
                  <p className="customer-detail-text pb-4">{prepaid_card}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("Available Credit")}
                  </div>
                  <p className="customer-detail-text pb-4">{prepaid_balance}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">AR</div>
                  <p className="customer-detail-text pb-4">
                    {prepaid_outstanding}
                  </p>
                </div>
                {/* <p className="customer-detail-text pb-4">{prepaid}</p> */}
              </div>
            </div>
            <div className="col-3 border">
              <p className="customer-detail-desc pb-4">{t(`Product`)}</p>
            </div>
            <div className="col-9 border">
              <div className="d-flex">
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50"></div>
                  <p className="customer-detail-text pb-4"></p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("No. of Products")}
                  </div>
                  <p className="customer-detail-text pb-4">{product_hold}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("Hold Items Amount")}
                  </div>
                  <p className="customer-detail-text pb-4">{product_balance}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">AR</div>
                  <p className="customer-detail-text pb-4">
                    {product_outstanding}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-3 border">
              <p className="customer-detail-desc pb-4">{t(`Credit Notes`)}</p>
            </div>
            <div className="col-9 border">
              <div className="d-flex">
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50"></div>
                  <p className="customer-detail-text pb-4"></p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("No. of Credit Notes")}
                  </div>
                  <p className="customer-detail-text pb-4">{credit_count}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("Available credit")}
                  </div>
                  <p className="customer-detail-text pb-4">{credit_amount}</p>
                </div>
                <div className="col-md-3"></div>
              </div>
            </div>

            <div className="col-3 border">
              <p className="customer-detail-desc pb-4">{t(`Voucher`)}</p>
            </div>
            <div className="col-9 border">
              <div className="d-flex">
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50"></div>
                  <p className="customer-detail-text pb-4"></p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("No. of Vouchers")}
                  </div>
                  <p className="customer-detail-text pb-4">{voucher_count}</p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50">
                    {t("Available Credit")}
                  </div>
                  <p className="customer-detail-text pb-4">{voucher_amount}</p>
                </div>
                <div className="col-3"></div>
              </div>
            </div>
            <div className="col-3 border">
              <p className="customer-detail-desc pb-4">{t(`Appointments`)}</p>
            </div>
            <div className="col-9 border">
              <div className="d-flex">
                <div className="col-3">
                  <div className="fs-13 fw-500 h-50"></div>
                  <p className="customer-detail-text pb-4"></p>
                </div>
                <div className="col-3">
                  <div className="fs-13 fw-500">{t("Upcoming")}</div>
                  <p className="customer-detail-text pb-4">{appoint}</p>
                </div>
                <div className="col-3"></div>
                <div className="col-3"></div>
              </div>
            </div>
          </div>
        </div>
      </>
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
    },
    dispatch
  );
};

export const PersonalDetails = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(PersonalDetailsClass)
);
