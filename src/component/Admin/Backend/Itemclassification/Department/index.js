import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  InputSearch,
  NormalSelect,
} from "component/common";
import "../style.scss";
import { withTranslation } from "react-i18next";
import { ItemDepts } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactPaginate from "react-paginate";

export class DepartmentlistClass extends Component {
  state = {
    headerDetails: [
      { label: "Department Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Sequence", divClass: "justify-content-end" },
      { label: "Active" },
    ],
    deptList: [],
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
    this.Listofdepts({});
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
      this.Listofdepts();
    }
  };

  Listofdepts = async () => {
    this.updateState({ is_loading: true });
    await this.props.ItemDepts().then((res) => {
      console.log(res);
      let { deptList, pageCount, List } = this.state;
      deptList = res;
      List = deptList.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(deptList.length / this.state.perPage);
      console.log(deptList);
      this.setState({
        deptList,
        List,
        pageCount,
        is_loading: false,
      });
      console.log(deptList.length);
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
        this.Listofdepts();
      }
    );
  };

  Listofinactivedept = async () => {
    let { pageCount, List } = this.state;
    let Listone = [];
    await this.props.ItemDepts().then((res) => {
      for (let key of res) {
        if (key.itmStatus == false) {
          Listone.push({
            itmCode: key.itmCode,
            itmDesc: key.itmDesc,
            itmSeq: key.itmSeq,
            itmStatus: key.itmStatus,
          });
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

  Listofactivedept = async () => {
    let { pageCount, List } = this.state;
    let Listone = [];
    await this.props.ItemDepts().then((res) => {
      for (let key of res) {
        if (key.itmStatus == true) {
          Listone.push({
            itmCode: key.itmCode,
            itmDesc: key.itmDesc,
            itmSeq: key.itmSeq,
            itmStatus: key.itmStatus,
          });
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
    let { headerDetails, is_loading, option, count, List } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <h4 className="head-label">{t("Department List")}</h4>
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
                          onClick={this.Listofdepts}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Active"}
                          onClick={this.Listofactivedept}
                        />
                      </div>
                      <div className="p-1">
                        <NormalButton
                          mainbg={true}
                          label={"Inactive"}
                          onClick={this.Listofinactivedept}
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
                          ({ itmCode, itmDesc, itmSeq, itmStatus }, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div
                                    className="text-right text-success"
                                    onClick={() =>
                                      this.props.history.push(
                                        `/admin/backend/departmentId/${itmCode}`
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
                                  <div className="text-right">{itmSeq}</div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {itmStatus == true ? "yes" : "No"}
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
                    `/admin/backend/itemclassification/departmentdataentry`
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
      ItemDepts,
    },
    dispatch
  );
};

export const Departmentlist = withTranslation()(
  connect(null, mapDispatchToProps)(DepartmentlistClass)
);
