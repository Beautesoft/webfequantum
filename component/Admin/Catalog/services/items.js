import React, { Component } from "react";
import { NormalButton, NormalSelect, NormalModal } from "component/common";
import { InputSearch, TableWrapper, Pagination } from "component/common";
import _ from "lodash";
import Brush from "assets/images/make-up-brush.png";
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
} from "redux/actions/common";
import { ItemDetail } from "./itemsDetail";
import closeIcon from "assets/images/close.png";
import { history } from "helpers";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";

export class ServicesItemClass extends Component {
  state = {
    productCard: [],
    page: 1,
    formFields: {
      search: "",
    },
    isOpenEditDetail: false,
    selectedId: "",
    list: [],
    isOpenPriceModal: false,
    serviceDetail: "",
    serviceName: "",
    search: "",
    isOpenCustomer: "",
    customerOption: [],
    selectedData: {},
    selectedPrice: "",
    uomId: "",
    is_foc: false,
    qty: null,
    menuId: "",
    rangeId: "",
    rangeName: "",
    menuOption: [],
    rangeOption: [],
  };

  componentDidMount = () => {
    let { productCard } = this.state;
    if (this.props.id !== "Favorites" && Number(this.props.id) !== 8) {
      this.getMenus();
    }
    this.getServices({});
    console.log(this.props, "sfdgsdfg  mount");
  };

  getServices = async query => {
    let { page = this.state.page } = query;
    let { rangeId = "" } = this.state;
    let { id } = this.props;
    await this.setState({ productCard: [] });

    if (this.props.id === "Favorites" || Number(this.props.id) === 8) {
      await this.props
        .getCommonApi(
          `${this.props.api}/?page=${page}&search=${this.props.search}`
        )
        .then(key => {
          let { status, data } = key;
          console.log(key, "sfdgsdfg  8888888");
          if (status === 200) {
            this.setState({ productCard: data, list: data.dataList });
          }
        });
    } else if (this.props.id) {
      await this.props
        .getCommonApi(
          `${this.props.api}/?Item_Deptid=${this.state.menuId}&page=${page}&Item_Rangeid=${rangeId}`
        )
        .then(key => {
          let { status, data } = key;
          console.log(key, "sfdgsdfg  idddddddd");
          if (status === 200) {
            this.setState({ productCard: data, list: data.dataList });
          }
        });
    } else {
      await this.props
        .getCommonApi(
          `${this.props.api}/?Item_Deptid=${this.state.menuId}&page=${page}&Item_Rangeid=${rangeId}`
        )
        .then(key => {
          let { status, data } = key;
          console.log(key, "sfdgsdfg elseeeeeee");
          if (status === 200) {
            this.setState({ productCard: data, list: data.dataList });
          }
        });
    }
  };
  getMenus = () => {
    let { menuOption } = this.state;
    menuOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props
      .getCommonApi(`catalogitemdept/?Item_Dept=${this.props.id}`)
      .then(res => {
        // activeMenu = []
        console.log("sdfsdhfghjghj ress", res);
        for (let key of res.data) {
          menuOption.push({
            value: key.id,
            label: key.itm_desc,
            code: key.itm_code,
            seq: key.itm_seq,
          });
        }
        this.setState({ menuOption });
      });
  };

  getRange = () => {
    let { rangeOption } = this.state;
    rangeOption = [];
    this.props
      .getCommonApi(`catalogitemrange?Item_Deptid=${this.state.menuId}`)
      .then(res => {
        // activeMenu = []
        for (let key of res.data) {
          rangeOption.push({ value: key.id, label: key.itm_desc });
        }
        this.setState({ rangeOption });
      });
  };

  componentWillUpdate(prevProps, prevState) {
    console.log(prevProps, this.props, "sgahsdfjhagsdkjfgsadf");
    if (prevProps.search !== this.props.search) {
      this.getServices({});
    }
  }

  handlePagination = async page => {
    console.log(page);
    await this.setState({ page: page });
    this.getServices({ page: page });
  };

  handleSearch = async event => {
    event.persist();
    let { formFields, activeMenu } = this.state;
    formFields["search"] = event.target.value;
    activeMenu = 8;
    await this.setState({ formFields, activeMenu });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        this.getServices(data);
      }, 500);
    }
    this.debouncedFn();
  };

  handleSearchCustomer = async event => {
    // event.persist();
    await this.setState({ search: event.target.value });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.search();
      }, 500);
    }
    this.debouncedFn();
  };

  search = searchString => {
    let { search } = this.state;
    this.props.getCommonApi(`custappt/?search=${search}`).then(key => {
      let { status, data } = key;
      console.log(data, "custappt/?search response");
      if (status === 200) {
        // for (let value of data) {
        //     customerList.push({ value: value.id, label: value.emp_name })
        // }
        this.setState({ customerOption: data });
      }
    });
  };

  handleSelectCustomer = async data => {
    let { formFields } = this.state;
    formFields["custId"] = data.id;
    formFields["custName"] = data.cust_name;
    formFields["cust_refer"] = data.cust_refer;
    console.log("correck");
    await this.setState({
      formFields,
      isOpenCustomer: false,
      search: "",
      customerOption: [],
    });
    await this.props.updateForm("basicApptDetail", formFields);
    console.log(this.props.basicApptDetail, "sdfsadfasdf");
    this.handleCreateCart();
  };

  handleOpenDetail = async data => {
    let { selectedId } = this.state;
    selectedId = data.id;
    await this.setState({ selectedId });
    this.setState({ isOpenEditDetail: true });
  };

  handleDialog = () => {
    let {
      isOpenEditDetail,
      selectedId,
      isOpenPriceModal,
      isOpenCustomer,
      selectedData,
      selectedPrice,
      uomId,
      is_foc,
      qty,
    } = this.state;
    isOpenEditDetail = false;
    selectedId = "";
    isOpenPriceModal = "";
    selectedData = {};
    selectedPrice = "";
    uomId = "";
    isOpenCustomer = false;
    is_foc = false;
    qty = qty ? qty : 1;
    this.setState({
      isOpenEditDetail,
      selectedId,
      isOpenPriceModal,
      isOpenCustomer,
      selectedData,
      selectedPrice,
      uomId,
      is_foc,
      qty,
    });
  };

  handleAddCart = async (data, price, id, qty) => {
    // let obj = data;
    let { selectedData, isOpenCustomer, selectedPrice, uomId, is_foc } =
      this.state;
    selectedData = data;
    selectedPrice = price;
    uomId = id;
    isOpenCustomer = true;
    is_foc = false;
    qty = qty ? qty : 1;
    this.setState({
      selectedData,
      isOpenCustomer,
      selectedPrice,
      uomId,
      is_foc,
      qty,
    });
    // obj["selected_menu"] = this.props.id;
    // await this.props.updateForm('selectedCart', obj)
    // // setTimeout(() => {
    //     history.push("/admin/cart");
    // }, 5000);
  };

  handleCreateCart = (data, price, id) => {
    let { formFields, selectedData, selectedPrice, uomId, is_foc, qty } =
      this.state;
    console.log(formFields, "ghdjhfbbgjbbjjb");
    let focres = "";
    if (is_foc) {
      if (selectedData.item_div === "5") {
        focres = "";
      } else {
        focres = "7";
      }
    } else {
      focres = "";
    }
    let payload = [];
    let obj = {
      cust_noid: formFields.custId,
      cart_date: dateFormat(new Date(), "yyyy-mm-dd"),
      itemcodeid: selectedData.id,
      price: selectedPrice ? selectedPrice : selectedData.item_price,
      qty: qty && qty > 1 ? qty : 1,
      item_uom: id ? id : "",
      is_foc: is_foc,
      focreason: focres,
      holdreason: "",
      holditemqty: Number(""),
    };
    if (uomId) {
      obj["item_uom"] = uomId;
    }

    payload.push(obj);

    this.props
      .getCommonApi(
        `itemcart/Check/?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${formFields.custId}`
      )
      .then(res => {
        console.log(res, "check api response");
        if (res.data.length === 0) {
          let api = "itemcart/";
          if (is_foc === true) {
            api = api + "?is_foc=1";
          }
          this.props.commonCreateApi(api, payload).then(res => {
            history.push("/admin/cart");
          });
        } else {
          let api = `itemcart/?cart_id=${res.cart_id}`;
          if (is_foc === true) {
            api = api + "?is_foc=1";
          }
          this.props.commonCreateApi(api, payload).then(res => {
            history.push("/admin/cart");
          });
        }
      });
  };

  handleAddFOC = async (data, price, id) => {
    // let obj = data;
    let { selectedData, isOpenCustomer, selectedPrice, uomId, is_foc } =
      this.state;
    selectedData = data;
    selectedPrice = price;
    uomId = id;
    isOpenCustomer = true;
    is_foc = true;
    this.setState({
      selectedData,
      isOpenCustomer,
      selectedPrice,
      uomId,
      is_foc,
    });
    // obj["selected_menu"] = this.props.id;
    // await this.props.updateForm('selectedCart', obj)
    // // setTimeout(() => {
    //     history.push("/admin/cart");
    // }, 5000);
  };

  handleSelectPrice = (data, index) => {
    console.log("sdfgfdhgfghfg", data);
    this.setState({
      isOpenPriceModal: true,
      // serviceName: data.item_desc,
      serviceDetail: data,
      selectedData: data,
    });
    // history.push(`/admin/payment/${id}`)
  };
  handleMenuChange = async ({ target: { value, name } }) => {
    let menuId = Object.assign({}, this.state.menuId);
    menuId = value;
    await this.setState({ menuId });
    this.getRange();
    this.getServices({});
  };

  handleRangeChange = async ({ target: { value, name } }) => {
    let rangeId = Object.assign({}, this.state.rangeId);
    let rangeName = Object.assign({}, this.state.rangeName);
    let { rangeOption } = this.state;
    rangeId = value;
    // rangeName = name;

    for (let key of rangeOption) {
      if (key.value == value) {
        rangeName = key.label;
      }
    }

    await this.setState({
      rangeId,
      rangeName,
    });
    this.setState({ productCard: [] });
    this.getServices({});
  };
  render() {
    let {
      productCard = {},
      isOpenEditDetail,
      selectedId,
      list,
      isOpenPriceModal,
      serviceName,
      serviceDetail,
      search,
      isOpenCustomer,
      customerOption,
      selectedData,
      selectedPrice,
      uom,
      menuId,
      rangeId,
      rangeName,
      menuOption,
      rangeOption,
    } = this.state;
    let { dataList = [], meta = {} } = productCard;
    let { pagination } = meta;
    let { t } = this.props;
    console.log(this.state, "fwfyhfgd , sfdgsdfg");
    return (
      <>
        <div className="catalog-services">
          <div className="d-flex">
            <div className="col-md-2 p-0 mb-2 mr-3">
              {this.props.id !== "Favorites" && Number(this.props.id) !== 8 ? (
                <div className="input-group range-filter">
                  <NormalSelect
                    // placeholder="Enter here"
                    options={menuOption}
                    value={menuId}
                    name={"menuId"}
                    onChange={this.handleMenuChange}
                    className="py-0"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-md-2 p-0 mb-2">
              {this.props.id !== "Favorites" && Number(this.props.id) !== 8 ? (
                <div className="input-group range-filter">
                  <NormalSelect
                    // placeholder="Enter here"
                    options={rangeOption}
                    value={rangeId}
                    name={rangeOption}
                    onChange={this.handleRangeChange}
                    className="py-0"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="d-flex list flex-wrap justify-content position-relative">
            {list.length > 0 &&
              list.map((data, index) => (
                <div className={`product-card card `} key={index}>
                  {/* <div className={`product-card card ${!data.stock ? 'stock-nill' : ''}`} key={index}> */}
                  <div className="d-flex justify-content-between px-3 card-title">
                    <p
                      className="label"
                      onClick={
                        data.item_div === "1"
                          ? () => this.handleSelectPrice(data, index)
                          : () => this.handleAddCart(data)
                      }
                    >
                      {data.item_desc}
                    </p>
                    <div className="cart-img">
                      {(data.item_div === "3" &&
                        String(data.item_type).toUpperCase() === "PACKAGE") ||
                      data.item_div === "5" ? null : (
                        <span
                          className="foc-icon"
                          onClick={
                            data.item_div === "1"
                              ? () => this.handleSelectPrice(data, index)
                              : () => this.handleAddFOC(data)
                          }
                        >
                          <svg
                            width="32"
                            height="32"
                            className="cursor-pointer"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="16"
                              cy="16"
                              r="15.5"
                              fill="rgba(60, 64, 135, 0.31)"
                              stroke="#3C4087"
                            />
                            <path
                              d="M3.996 11.456H9.42V12.476H5.22V15.152H9.18V16.172H5.22V20H3.996V11.456ZM14.3243 20.096C13.5163 20.096 12.8123 19.92 12.2123 19.568C11.6203 19.208 11.1603 18.7 10.8323 18.044C10.5123 17.388 10.3523 16.616 10.3523 15.728C10.3523 14.832 10.5123 14.056 10.8323 13.4C11.1523 12.744 11.6123 12.24 12.2123 11.888C12.8123 11.536 13.5163 11.36 14.3243 11.36C15.1403 11.36 15.8443 11.536 16.4362 11.888C17.0363 12.24 17.4963 12.744 17.8163 13.4C18.1363 14.056 18.2963 14.828 18.2963 15.716C18.2963 16.612 18.1363 17.388 17.8163 18.044C17.4963 18.7 17.0363 19.208 16.4362 19.568C15.8363 19.92 15.1323 20.096 14.3243 20.096ZM14.3243 19.088C15.1803 19.088 15.8443 18.796 16.3163 18.212C16.7963 17.628 17.0363 16.796 17.0363 15.716C17.0363 14.644 16.7963 13.82 16.3163 13.244C15.8443 12.66 15.1803 12.368 14.3243 12.368C13.4683 12.368 12.8043 12.66 12.3323 13.244C11.8603 13.82 11.6243 14.644 11.6243 15.716C11.6243 16.796 11.8603 17.628 12.3323 18.212C12.8123 18.796 13.4763 19.088 14.3243 19.088ZM23.7598 20.096C22.9358 20.096 22.2158 19.92 21.5998 19.568C20.9918 19.208 20.5238 18.7 20.1958 18.044C19.8678 17.388 19.7038 16.612 19.7038 15.716C19.7038 14.828 19.8678 14.056 20.1958 13.4C20.5238 12.744 20.9918 12.24 21.5998 11.888C22.2158 11.536 22.9358 11.36 23.7598 11.36C24.3438 11.36 24.8838 11.452 25.3798 11.636C25.8838 11.812 26.3078 12.072 26.6518 12.416L26.2198 13.328C25.8198 13 25.4238 12.764 25.0318 12.62C24.6478 12.468 24.2278 12.392 23.7718 12.392C22.8838 12.392 22.1958 12.68 21.7078 13.256C21.2278 13.832 20.9878 14.652 20.9878 15.716C20.9878 16.788 21.2278 17.616 21.7078 18.2C22.1958 18.776 22.8838 19.064 23.7718 19.064C24.2278 19.064 24.6478 18.992 25.0318 18.848C25.4238 18.696 25.8198 18.456 26.2198 18.128L26.6518 19.04C26.3078 19.384 25.8838 19.648 25.3798 19.832C24.8838 20.008 24.3438 20.096 23.7598 20.096Z"
                              fill="#3C4087"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                  {console.log("sadfadfasdf", this.props)}
                  {data.item_div === "1" ? (
                    <p
                      onClick={() => this.handleSelectPrice(data, index)}
                      className="cost px-3"
                    >
                      $ {t("Select")}
                    </p>
                  ) : (
                    <p
                      className="cost px-3"
                      onClick={
                        data.item_div === "1"
                          ? () => this.handleSelectPrice(data, index)
                          : () => this.handleAddCart(data)
                      }
                    >
                      ${data.item_price}
                    </p>
                  )}

                  <div
                    className="product-img px-1"
                    onClick={
                      data.item_div === "1"
                        ? () => this.handleSelectPrice(data, index)
                        : () => this.handleAddCart(data)
                    }
                  >
                    <img src={data.Stock_PIC} alt="" />
                  </div>
                  <div>
                    <NormalButton
                      className="col-12 fs-15 "
                      label={"View Detail"}
                      outline={true}
                      onClick={() => this.handleOpenDetail(data)}
                    />
                  </div>
                </div>
              ))}
            {pagination && (
              <Pagination
                handlePagination={this.handlePagination}
                pageMeta={pagination}
              />
            )}
          </div>
        </div>
        <NormalModal
          className={"multiple-appointment"}
          style={{ minWidth: "45%" }}
          modal={isOpenEditDetail}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close"
            src={closeIcon}
            alt=""
          />
          {/* <Discount discountFields={()=>{}} handleChange={()=>{}} handleSubmit={()=>{}}></Discount> */}
          <p className="title fs-18">{t("Detail")}</p>
          <ItemDetail
            id={this.state.selectedId}
            menuId={this.props.menuId}
            api={this.props.api}
            handleAddCart={
              this.props.id === "RETAIL"
                ? (data, price) => this.handleSelectPrice(data, price)
                : (data, price) => this.handleAddCart(data, price)
            }
            servicesDetail={this.state.serviceDetail}
          ></ItemDetail>
        </NormalModal>
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "40%" }}
          modal={isOpenPriceModal}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close"
            src={closeIcon}
            alt=""
          />

          <div className=" mt-2 mb-5 mx-3">
            <div className="col-12 pl-0 mb-3 fs-18 py-2">
              {t("Select")} {t("Price")}
            </div>
            <div className="row title fs-16 mb-2 f-600">
              <div className="col-1">{t("S.No")}</div>
              <div className="col-4">{t("Type")}</div>
              <div className="col-4">{t("Price")}</div>
              <div className="col-2">{t("Action")}</div>
            </div>
            {serviceDetail && serviceDetail.uomprice.length > 0
              ? serviceDetail.uomprice.map((data, index) => {
                  return (
                    <div className="row mb-1 fs-14">
                      <div className="col-1">{index + 1}</div>
                      <div className="col-4">{data.itemuom_desc}</div>
                      <div className="col-3">{data.item_price}</div>
                      <div className="col-4 d-flex">
                        <NormalButton
                          buttonClass={"detail-button addtocart mr-3"}
                          mainbg={true}
                          className="col-12 px-3 fs-15 "
                          label="Select"
                          onClick={() =>
                            this.handleAddCart(
                              serviceDetail,
                              data.item_price,
                              data.itemuom_id
                            )
                          }
                        />
                        {/* <NormalButton
                          buttonClass={"detail-button addtocart"}
                          mainbg={true}
                          className="col-12 px-3 fs-15 "
                          label="FOC"
                          onClick={() =>
                            this.handleAddFOC(
                              serviceDetail,
                              data.item_price,
                              data.itemuom_id
                            )
                          }
                        /> */}
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </NormalModal>
        <NormalModal
          className={"select-category customer-select"}
          style={{ minWidth: "70%" }}
          modal={isOpenCustomer}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="row mt-2 mb-5 mx-3">
            <div className="col-12 pl-0 mb-3 fs-18 py-2">
              {t("Select Customer")}
            </div>
            <div className="col-2 pl-0">{t("Search")}</div>
            <div className="col-5">
              <input
                name="treatment"
                value={search}
                onChange={this.handleSearchCustomer}
                className="search m-0 p-0 px-3"
              />
            </div>
            <div className="col-3">
              <NormalButton
                buttonClass={"mx-2 p-0"}
                mainbg={true}
                className="confirm"
                label="Search"
                outline={false}
                onClick={() => this.search(this.state.search)}
              />
            </div>

            <div className="row mt-4 table-header w-100 m-0">
              <div className="col-3">{t("Name")}</div>
              <div className="col-2">{t("Phone")}</div>
              <div className="col-2">{t("Customer Code")}</div>
              <div className="col-2">{t("Reference")}</div>
              <div className="col-1">{t("NRIC")}</div>
              <div className="col-2">{t("Email")}</div>
            </div>
            <div className="response-table w-100">
              {customerOption && customerOption.length > 0 ? (
                customerOption.map((item, index) => {
                  return (
                    <div
                      className="row m-0 table-body w-100"
                      onClick={() => this.handleSelectCustomer(item)}
                      key={index}
                    >
                      <div className="col-3">{item.cust_name}</div>
                      <div className="col-2">{item.cust_phone1}</div>
                      <div className="col-2">{item.cust_code}</div>
                      <div className="col-2">{item.cust_refer}</div>
                      <div className="col-1">{item.cust_nric}</div>
                      <div className="col-2">{item.cust_email}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100">
                  {t("No data available ")}
                </div>
              )}
            </div>
          </div>
        </NormalModal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  customerDetail: state.appointment.customerDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonCreateApi,
    },
    dispatch
  );
};

export const ServicesItem = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ServicesItemClass)
);
