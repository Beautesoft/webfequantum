import React, { Component } from "react";

export class CustomerSearch extends Component {
  render() {
    let { customerOption, t } = this.props;
    return (
      <div className="quantum-customer-search">
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
            {customerOption && customerOption.length > 0 ? (
              customerOption.map((item, index) => {
                return (
                  <div
                    className="row m-0 table-body w-100 border"
                    onClick={() => this.props.handleSelectCustomer(item)}
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
      </div>
    );
  }
}

export default CustomerSearch;
