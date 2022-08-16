import React from "react";
import { NormalButton, NormalInput } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import { connect } from "react-redux";
import _ from "lodash";
import { withTranslation } from "react-i18next";

class ManualRewardClass extends React.Component {
  state = {
    headerDetails: [
      { label: "S/N", sortKey: "SN" },
      { label: "Date", sortKey: "date", enabled: true },
      { label: "Reward", sortKey: "rewad", enabled: true },
      { label: "Points", sortKey: "points", enabled: true },
      { label: "New Balance", sortKey: "newBalance", enabled: true },
    ],
    dataList: [],
    rewardList: [
      { label: "Birthdays", points: 1500 },
      { label: "Promo", points: 500 },
    ],
    meta: {},
    currentIndex: -1,
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handlePagination = page => {
    console.log(page, "dsfsdfsdfsdf");
    //this.getCustomer(page);
  };

  handlesearch = event => {
    console.log("sadfasdfasdf", event.target.value);
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        //this.getCustomer(data);
      }, 500);
    }
    this.debouncedFn();
  };

  render() {
    let { headerDetails, dataList, meta, rewardList } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="customer-list container-fluid">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h3 className="head-label">{t("Manual Reward")}</h3>
            </div>
          </div>
          <div className="card-columns mt-5">
            {rewardList.map(e => (
              <div class="card text-center p-3">
                <blockquote class="blockquote mb-0">
                  <h6>{e.label}</h6>
                  <footer class="blockquote-footer">{e.points}</footer>
                </blockquote>
              </div>
            ))}
          </div>
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
                        console.log(headerDetails[0]);
                        return (
                          <tr key={index}>
                            <td
                              className={
                                headerDetails[0].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{cust_code}</div>
                            </td>
                            <td
                              className={
                                headerDetails[1].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{cust_refer}</div>
                            </td>
                            <td
                              className={
                                headerDetails[2].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{""}</div>
                            </td>
                            <td
                              className={
                                headerDetails[3].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{cust_name}</div>
                            </td>
                            <td
                              className={
                                headerDetails[4].enabled ?? true ? "" : "d-none"
                              }
                            >
                              <div className="text-left">{cust_phone2}</div>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </TableWrapper>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export const ManualReward = withTranslation()(connect()(ManualRewardClass));
