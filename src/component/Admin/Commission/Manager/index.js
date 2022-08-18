import React, { Component } from "react";
import {
  TableWrapper,
  InputSearch,
  NormalButton,
  NormalDate,
} from "component/common";
import { withTranslation } from "react-i18next";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export default class ManagercommissionClass extends Component {
  state = {
    SalescommissionDetails: [
      { label: "Staff Code" },
      { label: "Staff Username" },
      { label: "Staff Name" },
      { label: "Daily Based" },
      { label: "Monthly Based" },
    ],
    SalesList: [],
    filterByName: "",
    F_date: new Date(),
  };

  handleChange = ({ target: { value, name } }) => {
    let { filterByName } = this.state;
    if (name == "remark") {
      filterByName = value;
    }

    this.setState({ filterByName });
  };

  render() {
    let { t } = this.props;
    let {
      SalesList,
      SalescommissionDetails,
      is_loading,
      filterByName,
      F_date,
    } = this.state;
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

        {/*   Sales Commssion*/}
        <div className="d-flex  p-3 itemstatusgroup mt-5">
          <p>{t("Employees Details")}</p>
        </div>
        <div className="border p-4">
          <div className="d-flex">
            <div className="w-100 col-6 p-3 d-flex">
              <div className="col-4">Search By Code</div>
              <div className="col-8">
                <InputSearch
                  onChange={this.filterByName}
                  placeholder="Search By Code"
                />
              </div>
            </div>
            <div className="w-100 col-6 p-3 d-flex">
              <div className="col-4">Search By Name</div>
              <div className="col-8">
                <InputSearch
                  placeholder={t("Search By Name")}
                  onChange={this.filterByName}
                />
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="w-100 col-6 p-3 d-flex">
              <div className="col-4">Search By Username</div>
              <div className="col-8">
                <InputSearch
                  placeholder={t("Search By Username")}
                  onChange={this.filterByName}
                />
              </div>
            </div>
            <div className="w-100 col-6 p-3">
              <NormalButton
                mainbg={true}
                label={"Search"}
                //onClick={this.Listofstocks}
              />
            </div>
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
        <div className="col-1">
          <NormalButton
            mainbg={true}
            label={"Monthly"}
            onClick={() =>
              this.props.history.push(`/admin/commission/Monthlycommission`)
            }
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export const Managercommission = withTranslation()(
  connect(null, mapDispatchToProps)(ManagercommissionClass)
);
