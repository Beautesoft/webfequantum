import React from "react";
import { NormalButton } from "component/common";
import { TableWrapper } from "component/common";
import { bindActionCreators } from "redux";
import { getRedeemPlolicySettings } from "redux/actions/customerPlus";
import { connect } from "react-redux";
import _ from "lodash";
import { withTranslation } from "react-i18next";

export class RedeemPolicyTableClass extends React.Component {
  state = {
    headerDetails: [
      {
        label: "Code",
        sortKey: "redeem_code",
        divClass: "justify-content-end text-right",
      },
      { label: "Cust Class", sortKey: "cust_type_desc", enabled: true },
      {
        label: "Currency Value",
        sortKey: "cur_value",
        enabled: true,
        divClass: "justify-content-end text-right",
      },
      {
        label: "Point Value",
        sortKey: "point_value",
        enabled: true,
        divClass: "justify-content-end text-right",
      },
      {
        label: "Active",
        sortKey: "isactive",
        enabled: true,
        divClass: "justify-content-center",
      },
    ],
    originalDataList: [],
    dataList: [],
    meta: {},
    currentIndex: -1,
    isMounted: true,
    isLoading: true,
  };

  componentDidMount() {
    this.handlePagination();
  }

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handlePagination = async data => {
    let page = data?.page ?? 1;
    this.setState({ isLoading: true });
    await this.props.getRedeemPlolicySettings(`?limit=10&page=${page}`);
    let { dataList, pagination } = this.props.redeemPolicyList;
    this.updateState({
      meta: pagination,
      dataList: dataList,
      originalDataList: dataList,
      isLoading: false,
    });
  };

  handleClick = key => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.updateState(prevState => ({
      active: !prevState.active,
      currentIndex: key,
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
      dataList,
      originalDataList,
      meta,
      currentIndex,
      isLoading,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="customer-list container-fluid">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h3 className="head-label">{t("Redeem Policy")}</h3>
            </div>
            <div className="col-md-8">
              <div className="d-flex">
                <div className="col-12 p-0">
                  <NormalButton
                    mainbg={true}
                    className="col-md-6 col-sm-12 fs-15 float-right"
                    label="Add Redeem Policy"
                    onClick={() =>
                      this.props.history.push("lpmanagement/addredeem/")
                    }
                  />
                </div>
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
                    {dataList
                      ? dataList.map((item, index) => {
                          let {
                            id,
                            redeem_code,
                            cust_type_desc,
                            cur_value,
                            point_value,
                            isactive,
                          } = item;
                          console.log(headerDetails[0]);
                          return (
                            <tr
                              key={index}
                              onClick={() =>
                                this.props.history.push(
                                  `lpmanagement/${id}/editredeem`
                                )
                              }
                            >
                              <td
                                className={
                                  headerDetails[0].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-right">{redeem_code}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[1].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-left">
                                  {cust_type_desc}
                                </div>
                              </td>
                              <td
                                className={
                                  headerDetails[2].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-right">{cur_value}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[3].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="text-right">{point_value}</div>
                              </td>
                              <td
                                className={
                                  headerDetails[4].enabled ?? true
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <div className="d-flex align-items-center justify-content-center">
                                  <input
                                    type="checkbox"
                                    disbaled
                                    checked={isactive}
                                  />
                                </div>
                              </td>
                              {/* <td
                                className="position-relative"
                                ref={node => {
                                  this.node = node;
                                }}
                                onClick={() => this.handleClick(index)}
                              >
                                {currentIndex === index ? (
                                  <>
                                    <div className="d-flex align-items-center justify-content-center horizontal-more-active">
                                      <i className="icon-more"></i>
                                    </div>
                                    <div className="option card">
                                      <div
                                        className="d-flex align-items-center fs-16 pt-3"
                                        onClick={() =>
                                          this.props.history.push(
                                            `lpmanagement/${id}/editredeem`
                                          )
                                        }
                                      >
                                        <span className="icon-eye-grey px-3"></span>
                                        {t("Edit")}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="d-flex align-items-center justify-content-center horizontal-more">
                                    <i className="icon-more"></i>
                                  </div>
                                )}
                              </td> */}
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
  redeemPolicyList: state.customerPlus.redeemPolicyList,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getRedeemPlolicySettings,
    },
    dispatch
  );
};

export const RedeemPolicyTable = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(RedeemPolicyTableClass)
);
