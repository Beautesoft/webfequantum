import React from "react";
import { InputSearch, TableWrapper } from "component/common";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { getCustomerPoints } from "redux/actions/customerPlus";
import { bindActionCreators } from "redux";

export class RewardPolicyTableClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Code", sortKey: "customerCode" },
      { label: "Cust Type", sortKey: "customerType", enabled: true },
      { label: "Reward Stock Type", sortKey: "rewardStockType", enabled: true },
      { label: "Currency Value", sortKey: "currencyValue", enabled: true },
      { label: "Point Value", sortKey: "pointsValue", enabled: true },
      {
        label: "Active",
        sortKey: "active",
        enabled: true,
        divClass: "justify-content-end text-right",
      },
    ],
    dataList: [],
    originalDataList: [],
    meta: {},
    currentIndex: -1,
    isMounted: true,
    isLoading: true,
  };

  componentDidMount() {
    this.handlePagination({});
  }

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handlePagination = async data => {
    let { page = 1, search = "" } = data;
    this.setState({ isLoading: true });
    await this.props.getCustomerPoints(
      this.props.id,
      `?type=reward&limit=10&page=${page}&search=${search}`
    );
    let { PointList, pagination } = this.props.dataList;
    this.updateState({
      meta: pagination,
      dataList: PointList,
      originalDataList: PointList,
      isLoading: false,
    });
  };

  handlesearch = event => {
    let searchString = event.target.value;
    let data = { search: searchString };
    this.handlePagination(data);
  };

  render() {
    let { headerDetails, dataList, meta, isLoading, originalDataList } =
      this.state;
    let { t } = this.props;
    return (
      <>
        <div className="customer-list container-fluid">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h3 className="head-label">{t("Redward Policy")}</h3>
            </div>
            <div className="col-md-8">
              <InputSearch
                className=""
                placeholder="Search Policy"
                onEnter={this.handlesearch}
              />
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
                    {dataList
                      ? dataList.map((item, index) => {
                          let {
                            id,
                            cust_code,
                            cust_refer,
                            cust_name,
                            cust_phone2,
                            cust_dob,
                          } = item;
                          return (
                            <tr key={index}>
                              <td
                                className={
                                  headerDetails[0].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-left">{cust_code}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[1].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-left">{cust_refer}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[2].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-left">{""}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[3].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-left">{cust_name}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[4].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-left">{cust_phone2}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[5].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-right">{cust_dob}</div>
                              </td>
                            </tr>
                          );
                        })
                      : null}
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

export const RewardPolicyTable = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(RewardPolicyTableClass)
);
