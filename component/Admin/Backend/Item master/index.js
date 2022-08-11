import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  InputSearch,
  NormalSelect,
} from "component/common";
import "./style.scss";
import { withTranslation } from "react-i18next";
import { getStocks, ItemDivs } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactPaginate from "react-paginate";

export class ItemMasterClass extends Component {
  state = {
    headerDetails: [
      {
        label: "Stock Code",
        sortKey: "StockCode",
        enabled: true,
        id: "itemCode",
        singleClickFunc: () => this.handleSort("itemCode"),
        divClass: "justify-content-end",
      },
      {
        label: "Stock Name",
        sortKey: "Stock Name",
        enabled: true,
        id: "itemName",
        singleClickFunc: () => this.handleSort("itemName"),
      },
      {
        label: "Link Code",
        sortKey: "Link Code",
        enabled: true,
        id: "itmCode",
        singleClickFunc: () => this.handleSort("itmCode"),
        divClass: "justify-content-end",
      },
      {
        label: "Type",
        sortKey: "Type",
        enabled: true,
        id: "itemType",
        singleClickFunc: () => this.handleSort("itemType"),
      },
      {
        label: "Division",
        sortKey: "Division",
        enabled: true,
        id: "itemDiv",
        singleClickFunc: () => this.handleSort("itemDiv"),
      },
      {
        label: "Class",
        sortKey: "Class",
        enabled: true,
        id: "itemClass",
        singleClickFunc: () => this.handleSort("itemClass"),
      },
      {
        label: "Dept",
        sortKey: "Dept",
        enabled: true,
        id: "itemDept",
        singleClickFunc: () => this.handleSort("itemDept"),
      },
      {
        label: "Active",
        sortKey: "Active",
        enabled: true,
        id: "itemIsactive",
        singleClickFunc: () => this.handleSort("itemIsactive"),
      },
      {
        label: "Brand",
        sortKey: "Brand",
        enabled: true,
        id: "itemBrand",
        singleClickFunc: () => this.handleSort("itemBrand"),
      },
      {
        label: "Range",
        sortKey: "Range",
        enabled: true,
        id: "itemRange",
        singleClickFunc: () => this.handleSort("itemRange"),
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
    orderBy: "desc",
    search: "",
    filterdata: [],
    offset: 0,
    data: [],
    perPage: 10,
    currentPage: 0,
    Itemdata: [],
    seachdata: [],
    tempdiv: "",
  };

  componentDidMount = () => {
    this.Listofstocks({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  temp = ({ target: { value, name } }) => {
    let { count, perPage } = this.state;
    if (name == "count") {
      count = value;
      perPage = value;
      this.setState({ count, perPage });
      console.log(count, perPage);
      this.Listofstocks();
    }
  };

  Listofstocks = async () => {
    this.updateState({ is_loading: true });
    await this.props.getStocks().then((res) => {
      console.log(res);
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
        pageCount,
        Itemdata,
        is_loading: false,
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

  Activeitem = async () => {
    this.updateState({ is_loading: true });
    await this.props.getStocks().then((res) => {
      let { pageCount, Itemdata } = this.state;
      let List = [];
      for (let key of res) {
        if (key.itemIsactive == true) {
          List.push({
            itemCode: key.itemCode,
            itemName: key.itemName,
            itmCode: key.itmCode,
            itemType: key.itemType,
            itemDiv: key.itemDiv,
            itemDept: key.itemDept,
            itemClass: key.itemClass,
            itemIsactive: key.itemIsactive,
            itemBrand: key.itemBrand,
            itemRange: key.itemRange,
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
    await this.props.getStocks().then((res) => {
      let { pageCount, Itemdata } = this.state;
      let List = [];
      for (let key of res) {
        if (key.itemIsactive == false) {
          List.push({
            itemCode: key.itemCode,
            itemName: key.itemName,
            itmCode: key.itmCode,
            itemType: key.itemType,
            itemDiv: key.itemDiv,
            itemDept: key.itemDept,
            itemClass: key.itemClass,
            itemIsactive: key.itemIsactive,
            itemBrand: key.itemBrand,
            itemRange: key.itemRange,
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

  //   covertdiv = async(div) =>
  //   {

  //     let {tempdiv} = this.state;
  //     await this.props.ItemDivs().then(res => {

  //         for (let key of res) {
  //           if(key.itmCode == div)
  //           {
  //             tempdiv = key.itmDesc;
  //            this.setState({tempdiv})
  //           }
  //         }
  //     })
  // console.log(tempdiv)
  //     return false;
  //   }

  covertdiv = async (divss) => {
    await this.props.ItemDivs().then((res) => {
      debugger;
      let objIndex = res.filter((obj) => obj.itmCode == divss);
      if (objIndex) {
        return objIndex[0]["itmDesc"];
      } else {
        return "";
      }
    });
  };

  render() {
    let { headerDetails, is_loading, option, count, search, seachdata } =
      this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid itemmaster-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <h4 className="head-label">{t("Article Master ")}</h4>
                </div>
                <div className="col-md-8">
                  <div className="d-flex justify-content-between">
                    <div className="w-100 col-8">
                      <InputSearch
                        //placeholder={t("Search")}
                        onChange={this.filterByName}
                        placeholder="Search by Stock code / Stock Name"
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
                          onClick={this.Listofstocks}
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
              {search.length > 1 ? (
                <div className="tab-table-content">
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={headerDetails}>
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
                                itemCode,
                                itemName,
                                itmCode,
                                itemType,
                                itemDiv,
                                itemDept,
                                itemClass,
                                itemIsactive,
                                itemBrand,
                                itemRange,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td className="position-relative cursor-pointer">
                                    <div
                                      className="text-right cursor-pointer text-success"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/itemCode/${itemCode}`
                                        )
                                      }
                                    >
                                      {itemCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemName}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemType}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemDiv}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemDept}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemClass}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {itemIsactive == true ? "True" : "False"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemBrand}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemRange}</div>
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
                      <TableWrapper headerDetails={headerDetails}>
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
                                itemCode,
                                itemName,
                                itmCode,
                                itemType,
                                itemDiv,
                                itemDept,
                                itemClass,
                                itemIsactive,
                                itemBrand,
                                itemRange,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td className="position-relative status-type">
                                    <div
                                      className="text-right cursor-pointer text-success"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/itemCode/${itemCode}`
                                        )
                                      }
                                    >
                                      {itemCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemName}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemType}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemDiv}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemDept}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemClass}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {itemIsactive == true ? "True" : "False"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemBrand}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemRange}</div>
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
                  this.props.history.push(`/admin/backend/itemdataentrys`)
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
      getStocks,
      ItemDivs,
    },
    dispatch
  );
};

export const ItemMaster = withTranslation()(
  connect(null, mapDispatchToProps)(ItemMasterClass)
);
