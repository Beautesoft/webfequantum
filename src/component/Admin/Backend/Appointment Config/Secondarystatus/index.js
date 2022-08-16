import React, { Component } from "react";
import { TableWrapper, InputSearch } from "component/common";
import { withTranslation } from "react-i18next";
import { ApptSecondaryStatuses } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class SecondarystatusClass extends Component {
  state = {
    StatusDetails: [
      {
        label: "Code",
        divClass: "justify-content-end",
        sortKey: "ssCode",
        enabled: true,
        id: "ssCode",
        singleClickFunc: () => this.handleSort("ssCode"),
      },
      {
        label: "Description",
        sortKey: "ssDesc",
        enabled: true,
        id: "ssDesc",
        singleClickFunc: () => this.handleSort("ssDesc"),
      },
      { label: "Color Code" },
      {
        label: "Active",
        sortKey: "active",
        enabled: true,
        id: "active",
        singleClickFunc: () => this.handleSort("active"),
      },
    ],
    staffList: [],
    is_loading: false,
    search: "",
    filterdata: [],
  };
  componentDidMount = () => {
    this.Listofsstate({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  //Sorting
  handleSort = (sortkey, order) => {
    let { staffList, headerDetails, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });
    console.log("che");
    if (orderBy === "asc") {
      staffList.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      staffList.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      staffList,
    });
  };

  Listofsstate = async () => {
    this.updateState({ is_loading: true });
    await this.props.ApptSecondaryStatuses().then((res) => {
      console.log(res);
      let { staffList } = this.state;

      staffList = res;
      console.log(staffList);
      this.setState({
        staffList,
        is_loading: false,
      });
      console.log(staffList.length);
    });
  };

  //************Searching option **********//
  filterByName = ({ target: { value, name } }) => {
    console.log(value, name);
    let { staffList, filterdata, search } = this.state;
    if (name == "search") {
      search = value;
      this.setState({ search });
    }
    if (search !== "") {
      filterdata = staffList.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    }
    this.setState({ filterdata });
    console.log(filterdata);
  };

  render() {
    let { StatusDetails, staffList, is_loading, search, filterdata } =
      this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md">
                  <h4 className="head-label">{t("Secondary Status")}</h4>
                </div>
              </div>
              <div className="tab-table-content">
                <div className="d-flex">
                  <p className="mt-3 col-5">{t("List of Secondary Status")}</p>
                  <div className="w-100 col-7 mt-3">
                    <InputSearch
                      placeholder={t("Search")}
                      onChange={this.filterByName}
                      placeholder="Search by  Code / Description"
                    />
                  </div>
                </div>
                {search.length > 0 ? (
                  <div className="tab-table-content">
                    <div className="py-4">
                      <div className="table-container">
                        <TableWrapper headerDetails={StatusDetails}>
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
                          ) : filterdata.length > 0 ? (
                            filterdata.map(
                              (
                                { ssCode, ssDesc, ssColorCode, active },
                                index
                              ) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div
                                        className="text-right text-success"
                                        onClick={() =>
                                          this.props.history.push(
                                            `/admin/backend/Secondarylistid/${ssCode}`
                                          )
                                        }
                                      >
                                        {ssCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">{ssDesc}</div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {ssColorCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {active == true ? "Yes" : "No"}
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
                ) : (
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={StatusDetails}>
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
                        ) : staffList.length > 0 ? (
                          staffList.map(
                            (
                              { ssCode, ssDesc, ssColorCode, active },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-right text-success cursor-pointer"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/Secondarylistid/${ssCode}`
                                        )
                                      }
                                    >
                                      {ssCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{ssDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {ssColorCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {active == true ? "Yes" : "No"}
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
                )}
              </div>
              <div
                className="icon"
                onClick={() =>
                  this.props.history.push(
                    `/admin/backend/appointment/secondarystatus`
                  )
                }
              >
                +
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      ApptSecondaryStatuses,
    },
    dispatch
  );
};

export const Secondarystatus = withTranslation()(
  connect(null, mapDispatchToProps)(SecondarystatusClass)
);
