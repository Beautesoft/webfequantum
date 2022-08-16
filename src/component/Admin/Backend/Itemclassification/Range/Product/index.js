import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  InputSearch,
  NormalSelect,
} from "component/common";
import { withTranslation } from "react-i18next";
import { rangelists } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactPaginate from "react-paginate";
import "../style.scss";

export class ItemclassproductClass extends Component {
  state = {
    headerDetails: [
      {
        label: "Code",
        divClass: "justify-content-end",
        sortKey: "itmCode",
        enabled: true,
        id: "itmCode",
        singleClickFunc: () => this.handleSort("itmCode"),
      },
      {
        label: "Description",
        sortKey: "itmDesc",
        enabled: true,
        id: "itmDesc",
        singleClickFunc: () => this.handleSort("itmDesc"),
      },
      {
        label: "Brand",
        sortKey: "itmBrand",
        enabled: true,
        id: "itmBrand",
        singleClickFunc: () => this.handleSort("itmBrand"),
      },
      {
        label: "Active",
        sortKey: "itmStatus",
        enabled: true,
        id: "itmStatus",
        singleClickFunc: () => this.handleSort("itmStatus"),
      },
    ],
    productList: [],
    option: [
      { label: 10, value: 10 },
      { label: 25, value: 25 },
      { label: 50, value: 50 },
      { label: 100, value: 100 },
    ],
    count: 10,
    is_loading: false,
    search: "",
    filterdata: [],
    offset: 0,
    data: [],
    perPage: 10,
    currentPage: 0,
    List: [],
  };

  //Sorting

  handleSort = (sortkey, order) => {
    let { List, headerDetails, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });
    console.log("che");
    if (orderBy === "asc") {
      List.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      List.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      List,
    });
  };

  //************Searching option **********//
  filterByName = ({ target: { value, name } }) => {
    console.log(value, name);
    let { productList, filterdata, search, seachdata, pageCount } = this.state;
    if (name == "search") {
      search = value;
      this.setState({ search });
    }
    if (search !== "") {
      filterdata = productList.filter((item) => {
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

  temp = ({ target: { value, name } }) => {
    let { count, perPage } = this.state;
    if (name == "count") {
      count = value;
      perPage = value;
      this.setState({ count, perPage });
      console.log(count, perPage);
      this.Listofproducts();
    }
  };

  componentDidMount = () => {
    this.Listofproducts({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofproducts = async () => {
    this.updateState({ is_loading: true });
    await this.props.rangelists().then((res) => {
      console.log(res);
      let { productList, pageCount, List } = this.state;
      for (let key of res) {
        if (key.isproduct == true) {
          productList.push({
            itmCode: key.itmCode,
            itmDesc: key.itmDesc,
            brand: key.brand,
            itmStatus: key.itmStatus,
          });
        }
      }
      List = productList.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(productList.length / this.state.perPage);
      console.log(List);
      this.setState({
        productList,
        is_loading: false,
        pageCount,
        List,
      });
      console.log(productList.length);
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
        this.Listofproducts();
      }
    );
  };

  Listofinactiveproducts = async () => {
    let { pageCount, List } = this.state;
    let Listone = [];
    await this.props.rangelists().then((res) => {
      for (let key of res) {
        if (key.itmStatus == false) {
          if (key.isproduct == true) {
            Listone.push({
              itmCode: key.itmCode,
              itmDesc: key.itmDesc,
              brand: key.brand,
              itmStatus: key.itmStatus,
            });
          }
        }
      }

      this.setState({ Listone });

      List = Listone.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(Listone.length / this.state.perPage);
      this.setState({
        pageCount,
        is_loading: false,
        List,
      });
    });
  };

  Listofactiveproducts = async () => {
    let { pageCount, List } = this.state;
    let Listone = [];
    await this.props.rangelists().then((res) => {
      for (let key of res) {
        if (key.itmStatus == true) {
          if (key.isproduct == true) {
            Listone.push({
              itmCode: key.itmCode,
              itmDesc: key.itmDesc,
              brand: key.brand,
              itmStatus: key.itmStatus,
            });
          }
        }
      }

      this.setState({ Listone });

      List = Listone.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(Listone.length / this.state.perPage);
      this.setState({
        pageCount,
        is_loading: false,
        List,
      });
    });
  };
  render() {
    let { headerDetails, is_loading, option, count, search, List, filterdata } =
      this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <h4 className="head-label">{t("Product Range")}</h4>
                </div>
                <div className="col-md-8">
                  <div className="d-flex justify-content-between">
                    <div className="w-100 col-8">
                      <InputSearch
                        placeholder={t("Search")}
                        onChange={this.filterByName}
                        placeholder="Search by  Code / Description"
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
                          onClick={this.Listofproducts}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Active"}
                          onClick={this.Listofactiveproducts}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Inactive"}
                          onClick={this.Listofinactiveproducts}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-table-content">
                {search.length > 0 ? (
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
                          ) : filterdata.length > 0 ? (
                            filterdata.map(
                              (
                                { itmCode, itmDesc, brand, itmStatus },
                                index
                              ) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div
                                        className="text-right text-success"
                                        onClick={() =>
                                          this.props.history.push(
                                            `/admin/backend/ProductId/${itmCode}`
                                          )
                                        }
                                      >
                                        {itmCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">{itmDesc}</div>
                                    </td>
                                    <td>
                                      <div className="text-left">{brand}</div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {itmStatus == true ? "Yes" : "No"}
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
                        ) : List.length > 0 ? (
                          List.map(
                            ({ itmCode, itmDesc, brand, itmStatus }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-right text-success"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/ProductId/${itmCode}`
                                        )
                                      }
                                    >
                                      {itmCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itmDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{brand}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {itmStatus == true ? "Yes" : "No"}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : null}
                      </TableWrapper>
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
              </div>
              <div
                className="icon"
                onClick={() =>
                  this.props.history.push(
                    `/admin/backend/itemclassification/range/product`
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
      rangelists,
    },
    dispatch
  );
};

export const Itemclassproduct = withTranslation()(
  connect(null, mapDispatchToProps)(ItemclassproductClass)
);
