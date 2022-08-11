import React from "react";
import {
  InputSearch,
  NormalButton,
  NormalDate,
  TableWrapper,
} from "component/common";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { getCustomerPoints } from "redux/actions/customerPlus";
import { bindActionCreators } from "redux";
import { dateFormat } from "service/helperFunctions";

export class CustomerPointsTableClass extends React.Component {
  state = {
    headerDetails: [
      {
        label: "Date",
        sortKey: "remarks",
        enabled: true,
        divClass: "justify-content-end text-right",
      },
      { label: "Transcation No", sortKey: "transacno" },
      { label: "Type", sortKey: "type", enabled: true },
      { label: "Remarks", sortKey: "remarks", enabled: true },
      {
        label: "Earn pts (+)",
        sortKey: "earned",
        enabled: true,
        divClass: "justify-content-end text-right",
      },
      {
        label: "Used pts (-)",
        sortKey: "used",
        enabled: true,
        divClass: "justify-content-end text-right",
      },
      {
        label: "Balance Pts",
        sortKey: "now_point",
        enabled: true,
        divClass: "justify-content-end text-right",
      },
    ],
    type: "all",
    dataList: [],
    originalDataList: [],
    meta: {},
    searchStartDate: "",
    searchEndDate: "",
    searchString: "",
    isMounted: true,
    isLoading: true,
  };

  componentDidMount() {
    this.state.searchEndDate = new Date();
    let date = new Date();
    date.setMonth(date.getMonth() - 3);
    this.state.searchStartDate = date;
    this.handlePagination({});
  }

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handlePagination = async data => {
    let { page = 1 } = data;
    let { searchStartDate, searchEndDate, type, searchString } = this.state;
    this.setState({ isLoading: true });
    let searchParams = `&search=${searchString}`;
    if (type == "redeem" || type == "reward") searchParams += `&type=${type}`;
    if (searchStartDate != "") {
      let startdate = dateFormat(searchStartDate);
      let endDate = dateFormat(
        searchEndDate == "" ? searchStartDate : searchEndDate
      );
      searchParams += `&startDate=${startdate}&endDate=${endDate}`;
    }
    await this.props.getCustomerPoints(
      this.props.id,
      `?limit=10&page=${page}` + searchParams
    );
    let { PointList, pagination } = this.props.dataList;
    PointList.forEach(e => {
      if (e.lp_type == "Reward") {
        e.earned = e.total_point;
        e.used = "";
      } else {
        e.earned = "";
        e.used = e.total_point;
      }
    });
    this.updateState({
      meta: pagination,
      dataList: PointList,
      originalDataList: PointList,
      isLoading: false,
    });
  };

  render() {
    let {
      headerDetails,
      dataList,
      meta,
      isLoading,
      originalDataList,
      searchStartDate,
      searchEndDate,
      type,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="customer-list container-fluid">
          <div className="row mb-2">
            <div className="col-md-4 mb-2">
              <h3 className="head-label">{t("Customer Points")}</h3>
            </div>
            <div className="col-md-4 mb-2">
              <NormalButton
                label="Add Manual Reward"
                mainbg={true}
                onClick={() =>
                  this.props.history.push(
                    `/admin/customerplus/${this.props.id}/lpmanagement/reward`
                  )
                }
              />
            </div>
            <div className="col-md-4">
              <NormalButton
                label="Add Manual Redeem"
                mainbg={true}
                onClick={() =>
                  this.props.history.push(
                    `/admin/customerplus/${this.props.id}/lpmanagement/redeem`
                  )
                }
              />
            </div>
          </div>
          <div className="container-fuild border rounded p-2">
            <div className="row mb-2">
              <div className="col-md-2 mb-3">{t("Type")}:</div>
              <div className="col col-md-3">
                <input
                  type="radio"
                  className="mr-2"
                  checked={type == "all"}
                  onChange={e => this.updateState({ type: "all" })}
                />
                <label>All</label>
              </div>
              <div className="col col-md-3">
                <input
                  type="radio"
                  className="mr-2"
                  checked={type == "reward"}
                  onChange={e => this.updateState({ type: "reward" })}
                />
                <label>Reward</label>
              </div>
              <div className="col col-md-3">
                <input
                  type="radio"
                  className="mr-2"
                  checked={type == "redeem"}
                  onChange={e => this.updateState({ type: "redeem" })}
                />
                <label>Redeem</label>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 mb-2">
                <label>{t("Start Date")}:</label>
                <div className="input-group">
                  <NormalDate
                    value={searchStartDate}
                    onChange={e =>
                      this.updateState({
                        searchStartDate: e.target.value,
                        searchEndDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <label>{t("End Date")}:</label>
                <NormalDate
                  value={searchEndDate}
                  disabled={searchStartDate == ""}
                  minDate={searchStartDate}
                  onChange={e =>
                    this.updateState({ searchEndDate: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4 pt-md-2">
                <label></label>
                <InputSearch
                  placeholder="Search Policy"
                  onChange={e =>
                    this.updateState({ searchString: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="d-flex flex-row-reverse">
              <div className="col-md-3 mb-2">
                <NormalButton
                  label="Search"
                  mainbg={true}
                  onClick={e => {
                    this.handlePagination({});
                  }}
                />
              </div>
              <div className="col-md-2 mb-2">
                <NormalButton
                  label="Clear"
                  resetbg={true}
                  onClick={async e => {
                    await this.updateState({
                      searchStartDate: "",
                      searchEndDate: "",
                      type: "all",
                      searchString: "",
                    });
                    this.handlePagination({});
                  }}
                />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div class="d-flex mt-5 align-items-center justify-content-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
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
                    sortData={originalDataList}
                    onSort={dataList => this.updateState({ dataList })}
                  >
                    {dataList &&
                      dataList.map((item, index) => {
                        let {
                          transacno,
                          remarks,
                          earned,
                          used,
                          now_point,
                          lp_type,
                          date,
                        } = item;
                        return (
                          <tr key={index}>
                            <td
                              className={
                                headerDetails[2].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-right">
                                {new Date(date).toLocaleDateString() +
                                  " " +
                                  new Date(date).toLocaleTimeString()}
                              </div>
                            </td>
                            <td
                              className={
                                headerDetails[0].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{transacno}</div>
                            </td>
                            <td
                              className={
                                headerDetails[2].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{lp_type}</div>
                            </td>
                            <td
                              className={
                                headerDetails[2].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{remarks}</div>
                            </td>
                            <td
                              className={
                                headerDetails[1].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-right">{earned}</div>
                            </td>
                            <td
                              className={
                                headerDetails[3].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-right">{used}</div>
                            </td>
                            <td
                              className={
                                headerDetails[3].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-right">{now_point}</div>
                            </td>
                          </tr>
                        );
                      })}
                  </TableWrapper>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  dataList: state.customerPlus.customerPoints,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getCustomerPoints }, dispatch);
};

export const CustomerPointsTable = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CustomerPointsTableClass)
);
