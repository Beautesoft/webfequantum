import React, { Component } from "react";
import { updateForm, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  NormalButton,
  NormalModal,
  NormalInput,
  NormalCheckbox,
  TableWrapper,
  InputSearch,
  Pagination,
} from "component/common";
import closeIcon from "assets/images/close.png";
import _ from "lodash";
import { Toast } from "service/toast";

export class StockItemUsagePopupClass extends Component {
  state = {
    StockItemUsageList: {},
    meta: {},
    productList: "",
    productListHeader: [
      { label: "Select" },
      { label: "Description" },
      { label: "Item Code" },
      { label: "Link Code" },
    ],
    productListMeta: {},
    selectAll: false,
    isRetail: 0,
    Retail: false,
    Salon: true,
    search: "",
    isOpenPriceModal: false,
    item_uomid: "",
    item_uomdesc: "",
    item_qty: 1,
    uomprice: [],
    selectedProductItem: {},
    selectedCheckboxValue: false,
  };
  componentDidMount = () => {
    this.getProductList({});
  };
  getProductList = async data => {
    await this.setState({ productList: [] });
    let { productList, StockItemUsageList, isRetail, search } = this.state;
    let { page = 1, limit = 6 } = data;
    this.props
      .getCommonApi(
        `stockusageproduct/?is_retail=${isRetail}&search=${search}&page=${page}&limit=${limit}`
      )
      .then(async key => {
        let { status, data } = key;
        if (status === 200) {
          await this.setState({
            productList: data.dataList,
            productListMeta: data.meta.pagination,
          });
        }
      });
  };

  handlePagination = page => {
    this.getProductList({ page: page });
  };

  handlesearch = async event => {
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        this.setState({ search: searchString });
        this.getProductList(data);
      }, 500);
    }
    this.debouncedFn();
  };

  handleSelectedProduct = async item => {
    await this.setState({
      isOpenPriceModal: true,
      selectedProductItem: item,
      selectedCheckboxValue: true,
      uomprice: item.uomprice,
    });
  };
  handleUOMSelection = async data => {
    debugger;
    await this.setState({
      item_uomid: "",
      item_uomdesc: "",
      item_qty: "",
    });
    await this.setState({
      item_uomid: data.itemuomprice_id,
      item_uomdesc: data.item_uom,
      item_qty: data.qty,
    });
    if (
      this.state.item_uomdesc &&
      this.state.item_qty &&
      this.state.item_qty > 0
    ) {
      this.UOMPopupdata();
    } else {
      Toast({ type: "error", message: "Please enter valid Qty!" });
    }
  };
  UOMPopupdata = async () => {
    let item = this.state.selectedProductItem;
    let { StockItemUsageList, productList } = this.state;

    StockItemUsageList["stock_id"] = item.id;
    StockItemUsageList["item_code"] = item.item_code;
    StockItemUsageList["link_code"] = item.link_code;
    StockItemUsageList["ItemDesc"] = item.item_desc;
    StockItemUsageList["qty"] = this.state.item_qty;
    StockItemUsageList["uom"] = this.state.item_uomdesc;
    StockItemUsageList["uom_id"] = this.state.item_uomid;
    await this.setState({ StockItemUsageList });

    await this.setState({
      isOpenPriceModal: false,
    });
    this.handleConfirm();
  };

  handleRetailCheckbox = async ({ target: { value, name } }) => {
    let existing = this.state.isRetail;
    if (name === "Salon") {
      await this.setState({
        isRetail: 0,
      });
    } else {
      await this.setState({
        isRetail: 1,
      });
    }
    if (existing !== this.state.isRetail) {
      let data = { search: "" };
      this.getProductList(data);
    }
  };

  inputQtyChange = async ({ target: { value, name } }, index) => {
    //this.setState({ item_qty: value });
    let { uomprice } = this.state;
    uomprice[index][name] = value;
    this.setState({ uomprice });
  };
  handleCloseUOMDialog = () => {
    this.setState({ isOpenPriceModal: false });
  };

  handleConfirm = () => {
    let { StockItemUsageList } = this.state;
    if (StockItemUsageList) {
      this.props.newItem(StockItemUsageList);
    } else {
      Toast({ type: "error", message: "Please select product!" });
    }
  };
  render() {
    let { productList, productListMeta, isRetail, isOpenPriceModal, uomprice } =
      this.state;
    return (
      <NormalModal
        className={"select-category Treatment-usage"}
        style={{ minWidth: "75%" }}
        modal={this.props.isStockItemUsagePopup}
        handleModal={this.props.handleStockItemUsagePopup}
      >
        <img
          onClick={this.props.handleStockItemUsagePopup}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="d-flex h4 justify-content-center p-1">Item Usage</div>
        <div className="customer-list container">
          <div className="beautesoft-navlink customer-detail row">
            <div className="table-container table-responsive mt-3">
              <div className="d-flex mb-2">
                <div className="col-sm-3">
                  <div className="d-flex justify-content-start mb-2">
                    <p className="h5">Product</p>
                  </div>
                </div>
                <div className="col-sm-9">
                  <div className="d-flex justify-content-end mb-2">
                    <div className="col-sm-2">
                      <NormalCheckbox
                        onChange={e => this.handleRetailCheckbox(e)}
                        name="Salon"
                        checked={isRetail == 0 ? true : false}
                        label="show Salon"
                      />
                    </div>
                    <div className="col-sm-2">
                      <NormalCheckbox
                        onChange={e => this.handleRetailCheckbox(e)}
                        name="Retail"
                        checked={isRetail == 1 ? true : false}
                        label="show Retail"
                      />
                    </div>
                    <div className="col-sm-5 w-100">
                      <InputSearch
                        className=""
                        placeholder="Search product"
                        onChange={this.handlesearch}
                        name="searchText"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="services m-0 row">
                  {productList.length > 0 ? (
                    productList.map((data, index) => {
                      return (
                        <div className="col-2 fs-13 p-1" key={data.id}>
                          <div className="service-tab p-0">
                            <div className="service-ttl px-1 font-700 fs-11 text-uppercase">
                              {data.item_desc}
                            </div>
                            <div
                              className="images cursor-pointer"
                              onClick={() => this.handleSelectedProduct(data)}
                            >
                              <img src={data.Stock_PIC} alt="" />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="d-flex align-items-center justify-content-center">
                      No data available
                    </div>
                  )}
                  {productListMeta && (
                    <Pagination
                      handlePagination={this.handlePagination}
                      pageMeta={productListMeta}
                    />
                  )}
                </div>
              </div>
              <NormalModal
                className={"retail-price-modal"}
                style={{ minWidth: "760px" }}
                modal={isOpenPriceModal}
                handleModal={this.handleCloseUOMDialog}
              >
                <img
                  onClick={this.handleCloseUOMDialog}
                  className="close"
                  src={closeIcon}
                  alt=""
                />

                <div className=" mt-1 mb-5 mx-3">
                  <div className="row h5 text-left mb-2">Select UOM</div>
                  <div className="row title fs-16 mb-2 fw-500">
                    <div className="col-2">S.No</div>
                    <div className="col-3 text-center">Type</div>
                    <div className="col-3">Qty</div>
                    <div className="col-2">Action</div>
                  </div>
                  {uomprice && uomprice.length > 0 ? (
                    uomprice.map((data, index) => {
                      return (
                        <div className="row mb-1 fs-14" key={index}>
                          <div className="col-1">{index + 1}</div>
                          <div className="col-4 text-center">
                            {data.item_uom}
                          </div>
                          <div className="col-4">
                            <NormalInput
                              type="number"
                              name="qty"
                              value={data.qty}
                              //onChange={this.inputChange}
                              onChange={e => this.inputQtyChange(e, index)}
                            />
                          </div>
                          <div className="col-2">
                            <NormalButton
                              buttonClass={"detail-button addtocart"}
                              mainbg={true}
                              className="col-12 fs-15 "
                              label="Select"
                              onClick={() => this.handleUOMSelection(data)}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <tr className="w-100">
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          No data available
                        </div>
                      </td>
                    </tr>
                  )}
                </div>
              </NormalModal>
            </div>
          </div>
        </div>

        <div className="row text-center justify-content-center w-100">
          <NormalButton
            buttonClass={"col-2"}
            mainbg={true}
            className="col-12 ml-4 fs-15 "
            label="Close"
            onClick={this.props.handleStockItemUsagePopup}
          />
        </div>
      </NormalModal>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateForm,
      getCommonApi,
    },
    dispatch
  );
};

export const StockItemUsagePopup = connect(
  mapStateToProps,
  mapDispatchToProps
)(StockItemUsagePopupClass);
