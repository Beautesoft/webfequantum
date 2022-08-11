import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  InputSearch,
  NormalSelect,
} from "component/common";
import { withTranslation } from "react-i18next";
import { ItemBrands } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactPaginate from "react-paginate";
import "../style.scss";

export class BrandlistClass extends Component {
  state = {
    headerDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Active" },
      { label: "Show on retail" },
      { label: "Show on voucher" },
      { label: "Show on prepaid" },
    ],
    brandList: [],
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
    this.Listofbrands({});
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
      this.Listofbrands();
    }
  };

  Listofbrands = async () => {
    this.updateState({ is_loading: true });
    await this.props.ItemBrands().then((res) => {
      console.log(res);
      let { brandList, pageCount, List } = this.state;

      brandList = res;
      List = brandList.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(brandList.length / this.state.perPage);
      console.log(brandList);
      this.setState({
        brandList,
        List,
        pageCount,
        is_loading: false,
      });
      console.log(brandList.length);
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
        this.Listofbrands();
      }
    );
  };

  Listofinactivebrand = async () => {
    let { pageCount, List } = this.state;
    let Listone = [];
    await this.props.ItemBrands().then((res) => {
      for (let key of res) {
        if (key.itmStatus == false) {
          Listone.push({
            itmCode: key.itmCode,
            itmDesc: key.itmDesc,
            voucherBrand: key.voucherBrand,
            itmStatus: key.itmStatus,
            retailProductBrand: key.retailProductBrand,
            prepaidBrand: key.prepaidBrand,
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
    await this.props.ItemBrands().then((res) => {
      for (let key of res) {
        if (key.itmStatus == true) {
          Listone.push({
            itmCode: key.itmCode,
            itmDesc: key.itmDesc,
            voucherBrand: key.voucherBrand,
            itmStatus: key.itmStatus,
            retailProductBrand: key.retailProductBrand,
            prepaidBrand: key.prepaidBrand,
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
    let { headerDetails, List, is_loading, option, count } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <h4 className="head-label">{t("Brand List")}</h4>
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
                          onClick={this.Listofbrands}
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
                          onClick={this.Listofinactivebrand}
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
                          (
                            {
                              itmCode,
                              itmDesc,
                              itmStatus,
                              retailProductBrand,
                              voucherBrand,
                              prepaidBrand,
                            },
                            index
                          ) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div
                                    className="text-right text-success"
                                    onClick={() =>
                                      this.props.history.push(
                                        `/admin/backend/brandId/${itmCode}`
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
                                  <div className="text-left">
                                    {itmStatus == true ? "yes" : "No"}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {retailProductBrand == true ? "yes" : "No"}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {voucherBrand == true ? "yes" : "No"}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {prepaidBrand == true ? "yes" : "No"}
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
                    `/admin/backend/itemclassification/branddataentry`
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
      ItemBrands,
    },
    dispatch
  );
};

export const Brandlist = withTranslation()(
  connect(null, mapDispatchToProps)(BrandlistClass)
);
