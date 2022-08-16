import React, { Component } from "react";
import {
  TableWrapper,
  NormalTextarea,
  NormalButton,
  NormalDate,
} from "component/common";
import { withTranslation } from "react-i18next";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export default class StaffcommissionClass extends Component {
  state = {
    SalescommissionDetails: [
      { label: "Date" },
      { label: "Transac.No" },
      { label: "Customer Name" },
      { label: "Item Desc" },
      { label: "Qty" },
      { label: "Paid Amount" },
      { label: "Shared Info" },
      { label: "Amount calc for Comm" },
    ],
    SalesList: [],
    remark: "",
    F_date: new Date(),
  };

  handleChange = ({ target: { value, name } }) => {
    let { remark } = this.state;
    if (name == "remark") {
      remark = value;
    }

    this.setState({ remark });
  };

  render() {
    let { t } = this.props;
    let { SalesList, SalescommissionDetails, is_loading, remark, F_date } =
      this.state;
    return (
      <div className="container-fluid commission">
        <div className="d-flex justify-content-between">
          <div className="h4">{t("Staff Performance")}</div>
          <div className="d-flex ">
            <div className="input-group p-2">
              <NormalDate
                value={F_date}
                name="fromdate"
                type="date"
                onChange={this.handleChange}
                showDisabledMonthNavigation
              />
            </div>
            <div className="p-2 ">
              <NormalButton
                mainbg={true}
                label={"Submit"}
                // onClick={() =>
                //   this.props.history.push(`/admin/commission/Amountsetting`)
                // }
              />
            </div>
          </div>
        </div>

        {/*   Work Commssion*/}

        <div className="d-flex  p-3 itemstatusgroup mt-5">
          <p>{t("Work Done")}</p>
        </div>
        <div className="border p-4">
          <p className="h5 p-2">{t("Course Redemption")}</p>
          <div className="d-flex justify-content-between  border p-3">
            <div>Treament Amount</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Treament Commission Rate</div>
            <div>5%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="col-12 mt-1">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper headerDetails={SalescommissionDetails}>
                    {is_loading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : SalesList.length > 0 ? (
                      SalesList.map(
                        (
                          {
                            statusGroupCode,
                            statusGroupDesc,
                            statusGroupShortDesc,
                            isactive,
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div
                                  className="text-left text-success"
                                  onClick={() =>
                                    this.handleedit(statusGroupCode)
                                  }
                                >
                                  {statusGroupCode}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupShortDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {isactive == true ? "YES" : "NO"}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>

          <p className="h5 p-2">{t("Walk in")}</p>
          <div className="d-flex justify-content-between  border p-3">
            <div>Treament Amount</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Treament Commission Rate</div>
            <div>5%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="col-12 mt-1">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper headerDetails={SalescommissionDetails}>
                    {is_loading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : SalesList.length > 0 ? (
                      SalesList.map(
                        (
                          {
                            statusGroupCode,
                            statusGroupDesc,
                            statusGroupShortDesc,
                            isactive,
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div
                                  className="text-left text-success"
                                  onClick={() =>
                                    this.handleedit(statusGroupCode)
                                  }
                                >
                                  {statusGroupCode}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupShortDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {isactive == true ? "YES" : "NO"}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*   Sales Commssion*/}
        <div className="d-flex  p-3 itemstatusgroup mt-5">
          <p>{t("Course")}</p>
        </div>

        <div className="border p-4">
          <div className="d-flex justify-content-between  border p-3">
            <div>Total Sales</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission Rate</div>
            <div>5%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="col-12 mt-1">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper headerDetails={SalescommissionDetails}>
                    {is_loading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : SalesList.length > 0 ? (
                      SalesList.map(
                        (
                          {
                            statusGroupCode,
                            statusGroupDesc,
                            statusGroupShortDesc,
                            isactive,
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div
                                  className="text-left text-success"
                                  onClick={() =>
                                    this.handleedit(statusGroupCode)
                                  }
                                >
                                  {statusGroupCode}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupShortDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {isactive == true ? "YES" : "NO"}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*   Retail Products*/}
        <div className="d-flex  p-3 itemstatusgroup mt-5">
          <p>{t("Retail Products")}</p>
        </div>

        <div className="border p-4">
          <div className="d-flex justify-content-between  border p-3">
            <div>Total Sales</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission Rate</div>
            <div>5%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="col-12 mt-1">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper headerDetails={SalescommissionDetails}>
                    {is_loading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : SalesList.length > 0 ? (
                      SalesList.map(
                        (
                          {
                            statusGroupCode,
                            statusGroupDesc,
                            statusGroupShortDesc,
                            isactive,
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div
                                  className="text-left text-success"
                                  onClick={() =>
                                    this.handleedit(statusGroupCode)
                                  }
                                >
                                  {statusGroupCode}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupShortDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {isactive == true ? "YES" : "NO"}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  Prepaid*/}
        <div className="d-flex  p-3 itemstatusgroup mt-5">
          <p>{t("Prepaid")}</p>
        </div>

        <div className="border p-4">
          <div className="d-flex justify-content-between  border p-3">
            <div>Total Sales</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission Rate</div>
            <div>5%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="col-12 mt-1">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper headerDetails={SalescommissionDetails}>
                    {is_loading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : SalesList.length > 0 ? (
                      SalesList.map(
                        (
                          {
                            statusGroupCode,
                            statusGroupDesc,
                            statusGroupShortDesc,
                            isactive,
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div
                                  className="text-left text-success"
                                  onClick={() =>
                                    this.handleedit(statusGroupCode)
                                  }
                                >
                                  {statusGroupCode}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {statusGroupShortDesc}
                                </div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {isactive == true ? "YES" : "NO"}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5 col-12 h4 mt-4">{t("Summary")}</div>

        {/*   Work Commssion  summary*/}

        <div className="d-flex  p-3 itemstatusgroup mt-5">
          <p>{t("Work Commission")}</p>
        </div>
        <div className="border p-4">
          <div className="d-flex">
            <div className="col-6 p-3">
              <p className="p-3 h5 border-bottom">{t("Course Redemption")}</p>
              <div className="d-flex justify-content-between border p-3 mt-3">
                <div>This Month</div>
                <div>6.40</div>
              </div>
              <div className="d-flex justify-content-between border p-3 ">
                <div>Today</div>
                <div>6.40</div>
              </div>
              <div className="d-flex justify-content-between border p-3 ">
                <div>Nett Total </div>
                <div>6.40</div>
              </div>
            </div>

            <div className="col-6 p-3">
              <p className="p-3 h5 border-bottom">{t("Walk in")}</p>
              <div className="d-flex justify-content-between border p-3 mt-3">
                <div>This Month</div>
                <div>6.40</div>
              </div>
              <div className="d-flex justify-content-between border p-3 ">
                <div>Today</div>
                <div>6.40</div>
              </div>
              <div className="d-flex justify-content-between border p-3 ">
                <div>Nett Total </div>
                <div>6.40</div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between border p-3 mt-3">
            <div>Today Sales Commission</div>
            <div>6.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Total Sales Commission</div>
            <div>6.40</div>
          </div>
        </div>
        {/*   Sales Commssion summary*/}
        <div className="d-flex  p-3 itemstatusgroup mt-3">
          <p>{t("Course")}</p>
        </div>

        <div className="border p-4">
          <div className="d-flex justify-content-between  border p-3">
            <div>This Month (Exclude today)</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Today</div>
            <div>5.00%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Today Sales Commission</div>
            <div>6.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Total Sales Commission</div>
            <div>6.40</div>
          </div>
        </div>
        <div className="d-flex  p-3 itemstatusgroup mt-3">
          <p>{t("Retail Products")}</p>
        </div>

        <div className="border p-4">
          <div className="d-flex justify-content-between  border p-3">
            <div>This Month (Exclude today)</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Today</div>
            <div>5.00%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Today Sales Commission</div>
            <div>6.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Total Sales Commission</div>
            <div>6.40</div>
          </div>
        </div>
        <div className="d-flex  p-3 itemstatusgroup mt-3">
          <p>{t("Prepaid")}</p>
        </div>

        <div className="border p-4">
          <div className="d-flex justify-content-between  border p-3">
            <div>This Month (Exclude today)</div>
            <div>96.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Today</div>
            <div>5.00%</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Commission</div>
            <div>6.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Today Sales Commission</div>
            <div>6.40</div>
          </div>
          <div className="d-flex justify-content-between border p-3">
            <div>Total Sales Commission</div>
            <div>6.40</div>
          </div>
        </div>

        <div className="col-md-5 col-12 h4 mt-4">{t("Remark")}</div>
        <div className="input-group">
          <NormalTextarea
            placeholder="Enter here"
            value={remark}
            name="remark"
            onChange={this.handleChange}
          />
        </div>
        <div className="col-12 mt-3">
          <NormalButton
            resetbg={true}
            label={"Confirm"}
            // onClick={() => this.handlebrandDialog()}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export const Staffcommission = withTranslation()(
  connect(null, mapDispatchToProps)(StaffcommissionClass)
);
