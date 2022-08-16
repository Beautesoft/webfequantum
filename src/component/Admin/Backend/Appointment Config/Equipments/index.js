import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  InputSearch,
  NormalSelect,
  NormalCheckbox,
} from "component/common";
import { withTranslation } from "react-i18next";
import { Myequipments } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactPaginate from "react-paginate";

export class EquipmentClass extends Component {
  state = {
    EquimentDetails: [
      {
        label: "Code",
        sortKey: "equipmentCode",
        enabled: true,
        id: "equipmentCode",
        singleClickFunc: () => this.handleSort("equipmentCode"),
      },
      {
        label: "Name",
        sortKey: "equipmentName",
        enabled: true,
        id: "equipmentName",
        singleClickFunc: () => this.handleSort("equipmentName"),
      },
      {
        label: "Description",
        sortKey: "equipmentDescription",
        enabled: true,
        id: "equipmentDescription",
        singleClickFunc: () => this.handleSort("equipmentDescription"),
      },
      {
        label: "Active",
        sortKey: "equipmentIsactive",
        enabled: true,
        id: "equipmentIsactive",
        singleClickFunc: () => this.handleSort("equipmentIsactive"),
      },
    ],
    staffList: [],
    option: [
      { label: 10, value: 10 },
      { label: 25, value: 25 },
      { label: 50, value: 50 },
      { label: 100, value: 100 },
    ],
    count: 10,
    is_loading: false,
    offset: 0,
    data: [],
    perPage: 10,
    currentPage: 0,
    Itemdata: [],
    search: "",
    filterdata: [],
    seachdata: [],
  };
  //Sorting
  handleSort = (sortkey, order) => {
    let { Itemdata, headerDetails, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });
    console.log("che");
    if (orderBy === "asc") {
      Itemdata.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      Itemdata.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      Itemdata,
    });
  };
  temp = ({ target: { value, name } }) => {
    let { count, perPage } = this.state;
    if (name == "count") {
      count = value;
      perPage = value;
      this.setState({ count, perPage });
      console.log(count, perPage);
      this.Listofequiments();
    }
  };

  componentDidMount = () => {
    this.Listofequiments({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofequiments = async () => {
    this.updateState({ is_loading: true });
    await this.props.Myequipments().then((res) => {
      let { staffList, pageCount, Itemdata } = this.state;
      staffList = res;
      Itemdata = staffList.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(staffList.length / this.state.perPage);
      console.log(staffList);
      this.setState({
        staffList,
        is_loading: false,
        pageCount,
        Itemdata,
      });
      console.log(staffList.length);
    });
  };

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.Listofstocks();
      }
    );
  };

  filterByName = ({ target: { value, name } }) => {
    console.log(value, name);
    let { staffList, filterdata, search, seachdata, pageCount } = this.state;
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
    seachdata = filterdata.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    pageCount = Math.ceil(filterdata.length / this.state.perPage);
    this.setState({ seachdata, pageCount });
  };

  Activeitem = async () => {
    this.updateState({ is_loading: true });
    await this.props.Myequipments().then((res) => {
      let { pageCount, Itemdata } = this.state;
      let List = [];
      for (let key of res) {
        if (key.equipmentIsactive == true) {
          List.push({
            equipmentName: key.equipmentName,
            equipmentDescription: key.equipmentDescription,
            equipmentCode: key.equipmentCode,
            equipmentIsactive: key.equipmentIsactive,
          });
          console.log(List);
        }
      }
      Itemdata = List.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(List.length / this.state.perPage);
      this.setState({
        pageCount,
        Itemdata,
        is_loading: false,
      });
    });
  };

  Inactiveitem = async () => {
    this.updateState({ is_loading: true });
    await this.props.Myequipments().then((res) => {
      let { pageCount, Itemdata } = this.state;
      let List = [];
      for (let key of res) {
        if (key.itemIsactive == false) {
          List.push({
            equipmentName: key.equipmentName,
            equipmentDescription: key.equipmentDescription,
            equipmentCode: key.equipmentCode,
            equipmentIsactive: key.equipmentIsactive,
          });
          console.log(List);
        }
      }
      Itemdata = List.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(List.length / this.state.perPage);
      this.setState({
        pageCount,
        Itemdata,
        is_loading: false,
      });
    });
  };

  render() {
    let { EquimentDetails, is_loading, option, count, search, seachdata } =
      this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <h4 className="head-label">{t("Equipment")}</h4>
                </div>
                <div className="col-md-8">
                  <div className="d-flex justify-content-between">
                    <div className="w-100 col-8">
                      <InputSearch
                        placeholder={t("Search")}
                        onChange={this.filterByName}
                        placeholder="Search by Code / Name / Description"
                      />
                    </div>
                    <div className="d-flex w-100 col-3 entries">
                      <p className="mt-2">{t("Show")}</p>
                      <div className="p-1">
                        <NormalSelect
                          options={option}
                          value={count}
                          onChange={this.temp}
                          name="count"
                        />
                      </div>
                      <p className="mt-2">{t("Entries")}</p>
                    </div>
                    <div className=" d-flex w-100 col-4 ml-3">
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"All"}
                          onClick={this.Listofequiments}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Active"}
                          onClick={this.Activeitem}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Inactive"}
                          onClick={this.Inactiveitem}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {search.length > 0 ? (
                <div className="tab-table-content">
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={EquimentDetails}>
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
                        ) : seachdata.length > 0 ? (
                          seachdata.map(
                            (
                              {
                                equipmentCode,
                                equipmentDescription,
                                equipmentIsactive,
                                equipmentName,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-left text-success"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/Equimentid/${equipmentCode}`
                                        )
                                      }
                                    >
                                      {equipmentCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {equipmentName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {equipmentDescription}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {equipmentIsactive == true ? "Yes" : "No"}
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
                  <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(event) => this.handlePageClick(event)}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </div>
              ) : (
                <div className="tab-table-content">
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={EquimentDetails}>
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
                        ) : this.state.Itemdata.length > 0 ? (
                          this.state.Itemdata.map(
                            (
                              {
                                equipmentCode,
                                equipmentDescription,
                                equipmentIsactive,
                                equipmentName,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-left text-success"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/Equimentid/${equipmentCode}`
                                        )
                                      }
                                    >
                                      {equipmentCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {equipmentName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {equipmentDescription}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {equipmentIsactive == true ? "Yes" : "No"}
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
                  <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(event) => this.handlePageClick(event)}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </div>
              )}
              <div
                className="icon"
                onClick={() =>
                  this.props.history.push(`/admin/backend/appointment/equipemt`)
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
      Myequipments,
    },
    dispatch
  );
};

export const Equipment = withTranslation()(
  connect(null, mapDispatchToProps)(EquipmentClass)
);
