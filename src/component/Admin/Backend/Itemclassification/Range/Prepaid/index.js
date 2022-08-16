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

export class ItemclassprepaidClass extends Component {
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
        sortKey: "brand",
        enabled: true,
        id: "brand",
        singleClickFunc: () => this.handleSort("brand"),
      },
      {
        label: "Active",
        sortKey: "itmStatus",
        enabled: true,
        id: "itmStatus",
        singleClickFunc: () => this.handleSort("itmStatus"),
      },
    ],

    prepaidList: [],
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
    List: [],
  };

  componentDidMount = () => {
    this.Listofprepaid({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

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

  temp = ({ target: { value, name } }) => {
    let { count, perPage } = this.state;
    if (name == "count") {
      count = value;
      perPage = value;
      this.setState({ count, perPage });
      console.log(count, perPage);
      this.Listofprepaid();
    }
  };

  Listofprepaid = async () => {
    this.updateState({ is_loading: true });
    await this.props.rangelists().then((res) => {
      console.log(res);
      let { prepaidList, pageCount, List } = this.state;
      for (let key of res) {
        if (key.isprepaid == true) {
          prepaidList.push({
            itmCode: key.itmCode,
            itmDesc: key.itmDesc,
            brand: key.brand,
            itmStatus: key.itmStatus,
          });
        }
      }
      List = prepaidList.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(prepaidList.length / this.state.perPage);
      this.setState({
        prepaidList,
        List,
        pageCount,
        is_loading: false,
      });
      console.log(prepaidList.length);
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
        this.Listofprepaid();
      }
    );
  };

  Listofinactiveprepaid = async () => {
    let { pageCount, List } = this.state;
    let Listone = [];
    await this.props.rangelists().then((res) => {
      for (let key of res) {
        if (key.itmStatus == false) {
          if (key.isprepaid == true) {
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

  Listofactiveprepaid = async () => {
    let { pageCount, List } = this.state;
    let Listone = [];
    await this.props.rangelists().then((res) => {
      for (let key of res) {
        if (key.itmStatus == true) {
          if (key.isprepaid == true) {
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
    let { headerDetails, is_loading, option, List, count } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <h4 className="head-label">{t("Prepaid Range")}</h4>
                </div>
                <div className="col-md-8">
                  <div className="d-flex justify-content-between">
                    <div className="w-100 col-8">
                      <InputSearch
                        className=""
                        placeholder={t("Search")}
                        onEnter={this.handlesearch}
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
                          onClick={this.Listofprepaid}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Active"}
                          onClick={this.Listofactiveprepaid}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Inactive"}
                          onClick={this.Listofinactiveprepaid}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                                        `/admin/backend/prepaidId/${itmCode}`
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
              <div
                className="icon"
                onClick={() =>
                  this.props.history.push(
                    `/admin/backend/itemclassification/range/prepaid`
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

export const Itemclassprepaid = withTranslation()(
  connect(null, mapDispatchToProps)(ItemclassprepaidClass)
);
