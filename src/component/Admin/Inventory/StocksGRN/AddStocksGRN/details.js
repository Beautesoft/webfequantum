import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import {
  NormalButton,
  NormalDate,
  TableWrapper,
  InputSearch,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom";
import _ from "lodash";
import updateBtn from "assets/images/edit1.png";
import deleteBtn from "assets/images/delete1.png";
//import closeBtn from "assets/images/close.png";
import saveBtn from "assets/images/save.png";
import { getTokenDetails } from "redux/actions/auth";

export class DetailsClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Brand" },
      { label: "Range" },
      { label: "UOM" },
      { label: "On Hand Qty" },
      { label: "Qty" },
      { label: "Cost" },
      { label: "" },
    ],
    headerSelectedDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Brand" },
      { label: "Range" },
      { label: "UOM" },
      { label: "Unit Cost" },
      { label: "Qty" },
      { label: "Amount" },
      { label: "Remarks" },
      { label: "" },
      { label: "" },
    ],
    formFields: {
      DOC_AMT: "",
      DOC_QTY: "",
    },

    UOM: "",

    detailsList: [],
    storedItemList: [],
    pageMeta: {},

    search: "",
    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 4,
    isOpenvoidCheckout: false,
    isLoading: true,
    // is_loading: false,
    isMounted: true,

    // salesCollectionHeader: [
    //   { label: "Sales Collection" },
    //   { label: "Before Tax" },
    //   { label: "Amount" },
    //   { label: "Qty" },
    // ],
    // nonSalesCollectionHeader: [
    //   { label: "Non Sales Collection" },
    //   { label: "Amount" },
    //   { label: "Qty" },
    // ],
    // deptSalesHeader: [{ label: "Dept Sales" }, { label: "Amount" }],
    // salesTransactionHeader: [
    //   { label: "Sales Transaction" },
    //   { label: "Amount" },
    //   { label: "Paid" },
    //   { label: "Outstanding" },
    // ],
    // ARTransactionHeader: [{ label: "AR Transaction" }, { label: "Amount" }],
    // TreatmentDoneHeader: [
    //   { label: "Customer" },
    //   { label: "Customer Reference" },
    //   { label: "Treatment Done" },
    //   { label: "Description" },
    //   { label: "Staff" },
    //   { label: "Amount" },
    // DayDate: new Date(),
    // runDayEnd: false,
    // reportDate: "",
    // sales_collec: null,
    // sales_trasac: null,
    // ar_trasac: null,
    // treatment_done: null,
    // dept_sales: null,
  };

  componentWillMount() {}

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    // let From = new Date();
    // let { formField } = this.state;
    // let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    // formField["fromDate"] = firstdayMonth;
    // this.setState({
    //   formField,
    // });

    this.getDetails();
    this.autofillSaved();
    // this.state.formFields = this.props.formFieldsDetailsStored
    // this.setState(this.state.formFields)
    // if(this.props.grnId){
    //   this.autofillDetails()
    // }
    // if(this.props.quoId){
    //   this.autofillDetailsFromQuo()
    //   console.log("this.props.quoId",this.props.quoId)
    // }
    console.log("this.props in comdidmount", this.props);
    // this.queryHandler({});
    console.log(
      "this.props.storedItemListStored loaded",
      this.props.storedItemListStored
    );
    console.log(
      "this.props.formFieldsDetailsStored loaded",
      this.props.formFieldsDetailsStored
    );
    // this.handleUpdateTotal()
    // console.log("prevState.storedItemList",prevState.storedItemList)
    // console.log("this.state.storedItemList",this.state.storedItemList)
  }

  getDetails = () => {
    this.updateState({ isLoading: true });
    let { detailsList, pageMeta, page, limit, search } = this.state;
    // let { item_desc } = formField;

    this.props
      .getCommonApi(
        `allstocklist/?searchitemdesc=${search}&searchsitecode=${this.props.tokenDetail.site_code}&page=${page}&limit=${limit}`
      )
      .then(async res => {
        console.log(res, "dsfdfaafg");
        await this.setState({ detailsList: [] });
        detailsList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        // this.setState({ detailsList, pageMeta });
        // this.setState({ detailsList });

        console.log("res.data", res.data);
        console.log("detailsList", detailsList);
        console.log("pageMeta", pageMeta);
        this.updateState({
          detailsList,
          pageMeta,
          isLoading: false,
        });
      });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getDetails();
  };
  // pagination
  // handlePagination = page => {
  //   this.queryHandler(page);
  // };

  handlesearch = event => {
    // event.persist();
    console.log(event.target.value);
    let { search } = this.state;
    search = event.target.value;
    this.setState({ search });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.getDetails({});
      }, 500);
    }
    this.debouncedFn();
  };

  handleClick = key => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      active: !prevState.active,
      currentIndex: key,
    }));
  };

  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  // handleChangeDetails = ({ target: { value, name } }) => {
  //   let {storedItemList} = this.state
  //   let formFields = Object.assign({}, this.state.formFields);

  //   formFields[name] = value;

  //   this.updateState({
  //     formFields,
  //   });
  //   this.props.storeItemDetails(storedItemList, formFields)
  // };

  handleChangeQuantity = ({ target: { value, name } }) => {
    let { detailsList, UOM } = this.state;
    console.log("value", value);
    console.log("name", name);

    for (let list in detailsList) {
      if (
        detailsList[list].item_code == name &&
        detailsList[list].UOM_DESC == UOM
      ) {
        detailsList[list].item_quantity = value;
      }
      console.log("detailsList[list].item_code", detailsList[list].item_code);
    }

    this.setState({
      detailsList,
    });
    console.log("detailsList in handleChange", detailsList);
    // current_item_quantity = value
    // this.setState({ current_item_quantity })
  };

  handleChangeCost = ({ target: { value, name } }) => {
    let { detailsList, UOM } = this.state;
    console.log("value", value);
    console.log("name", name);
    let r = new RegExp(/^\d*(\d+\.|\.\d+)?$/);

    if (r.test(value) == true || !value) {
      for (let list in detailsList) {
        if (
          detailsList[list].item_code == name &&
          detailsList[list].UOM_DESC == UOM
        ) {
          detailsList[list].item_cost = value;
        }
      }
    }
    this.setState({
      detailsList,
    });
    console.log("detailsList in handleChange", detailsList);
    // current_item_quantity = value
    // this.setState({ current_item_quantity })
  };

  handleSelect = (
    item_code,
    Item_Desc,
    brand_itm_desc,
    range_itm_desc,
    UOM_DESC,
    ITEM_UOM,
    item_quantity,
    item_cost
  ) => {
    let { storedItemList, detailsList, formFields } = this.state;
    // console.log("item_code", item_code)
    // console.log("Item_Desc", Item_Desc)
    // console.log("item_price", item_price)

    for (let item of storedItemList) {
      if (item.item_code == item_code && item.UOM_DESC == UOM_DESC) {
        Toast({
          type: "error",
          message: "This item already exists",
        });
        return;
      }
    }

    if (!item_cost) {
      Toast({
        type: "error",
        message: "Cost is empty!",
      });
      return;
    }

    // for (let list in detailsList){
    //   if (detailsList[list].item_code == item_code){
    //     let item_quantity = detailsList[list].item_quantity
    //     if (item_quantity){
    //       storedItemList.push({"item_code":item_code, "Item_Desc":Item_Desc, "brand_itm_desc":brand_itm_desc, "range_itm_desc":range_itm_desc, "UOM_DESC":UOM_DESC, "item_cost":item_cost, "item_quantity":item_quantity, "amount":item_quantiy*item_cost, "item_remarks":"", "editing":false})
    //     }
    //     else{
    //       item_quantity = 1
    //       storedItemList.push({"item_code":item_code, "Item_Desc":Item_Desc, "brand_itm_desc":brand_itm_desc, "range_itm_desc":range_itm_desc, "UOM_DESC":UOM_DESC, "item_cost":item_cost, "item_quantity":item_quantity, "amount":item_quantiy*item_cost, "item_remarks":"", "editing":false})
    //     }
    //   }
    // }

    if (item_quantity) {
      storedItemList.push({
        item_code: item_code,
        Item_Desc: Item_Desc,
        brand_itm_desc: brand_itm_desc,
        range_itm_desc: range_itm_desc,
        UOM_DESC: UOM_DESC,
        ITEM_UOM: ITEM_UOM,
        item_cost: item_cost,
        item_quantity: item_quantity,
        amount: Math.round(item_quantity * item_cost * 100) / 100,
        item_remarks: "",
        editing: false,
      });
    } else {
      item_quantity = 1;
      storedItemList.push({
        item_code: item_code,
        Item_Desc: Item_Desc,
        brand_itm_desc: brand_itm_desc,
        range_itm_desc: range_itm_desc,
        UOM_DESC: UOM_DESC,
        ITEM_UOM: ITEM_UOM,
        item_cost: item_cost,
        item_quantity: item_quantity,
        amount: Math.round(item_quantity * item_cost * 100) / 100,
        item_remarks: "",
        editing: false,
      });
    }

    console.log("storedItemList", storedItemList);
    this.setState({ storedItemList });
    this.handleUpdateTotal();
    this.props.storeItemDetails(storedItemList, formFields);
  };

  handleRemoveStoredItem = (item_code, UOM_DESC) => {
    let { storedItemList, formFields } = this.state;
    for (var i = 0; i < storedItemList.length; i++) {
      if (
        storedItemList[i].item_code == item_code &&
        storedItemList[i].UOM_DESC == UOM_DESC
      ) {
        storedItemList.splice(i, 1);
      }
    }
    console.log("storedItemList after remove", storedItemList);
    this.setState({ storedItemList });
    this.props.storeItemDetails(storedItemList, formFields);
    this.handleUpdateTotal();
  };

  handleEdit = (item_code, UOM_DESC) => {
    let { storedItemList } = this.state;
    for (let list in storedItemList) {
      if (
        storedItemList[list].item_code == item_code &&
        storedItemList[list].UOM_DESC == UOM_DESC
      ) {
        storedItemList[list].editing = true;
      }
    }
    console.log("storedItemList in handleedit", storedItemList);

    this.setState({ storedItemList });
  };

  handleSave = (item_code, UOM_DESC) => {
    let { storedItemList, formFields } = this.state;
    for (let list in storedItemList) {
      if (
        storedItemList[list].item_code == item_code &&
        storedItemList[list].UOM_DESC == UOM_DESC
      ) {
        storedItemList[list].editing = false;
      }
    }
    console.log("storedItemList in handleedit", storedItemList);

    this.setState({ storedItemList });
    this.props.storeItemDetails(storedItemList, formFields);
    this.handleUpdateTotal();
  };

  handleEditChangeRemarks = ({ target: { value, name } }) => {
    let { storedItemList, UOM } = this.state;

    for (let list in storedItemList) {
      if (
        storedItemList[list].item_code == name &&
        storedItemList[list].UOM_DESC == UOM
      ) {
        storedItemList[list].item_remarks = value;
      }
      // console.log("storedItemList[list].item_code",storedItemList[list].item_code)
    }

    this.setState({
      storedItemList,
    });

    console.log("storedItemList in handleEditChange", storedItemList);
  };

  handleEditChangePrice = ({ target: { value, name } }) => {
    let { storedItemList, UOM } = this.state;
    let r = new RegExp(/^\d*(\d+\.|\.\d+)?$/);

    if (r.test(value) == true || !value) {
      for (let list in storedItemList) {
        if (
          storedItemList[list].item_code == name &&
          storedItemList[list].UOM_DESC == UOM
        ) {
          storedItemList[list].item_cost = value;
          storedItemList[list].amount =
            Math.round(storedItemList[list].item_quantity * value * 100) / 100;
        }
        // console.log("storedItemList[list].item_code",storedItemList[list].item_code)
      }
    }

    this.setState({
      storedItemList,
    });
    console.log("storedItemList in handleEditChange", storedItemList);
  };

  handleEditChangeQuantity = ({ target: { value, name } }) => {
    let { storedItemList, UOM } = this.state;

    for (let list in storedItemList) {
      if (
        storedItemList[list].item_code == name &&
        storedItemList[list].UOM_DESC == UOM
      ) {
        storedItemList[list].item_quantity = value;
        storedItemList[list].amount =
          Math.round(storedItemList[list].item_cost * value * 100) / 100;
      }
      // console.log("storedItemList[list].item_code",storedItemList[list].item_code)
    }

    this.setState({
      storedItemList,
    });
    console.log("storedItemList in handleEditChange", storedItemList);
  };

  handleUpdateTotal = () => {
    let { storedItemList, formFields } = this.state;

    formFields.DOC_AMT = 0;
    formFields.DOC_QTY = 0;

    for (let item of storedItemList) {
      console.log("item.amount", item.amount, typeof item.amount);
      formFields.DOC_AMT = item.amount + formFields.DOC_AMT;
      formFields.DOC_QTY =
        parseInt(!item.item_quantity ? 0 : item.item_quantity) +
        formFields.DOC_QTY;
    }
    console.log("storedItemList in update total", storedItemList);
    formFields.DOC_AMT = Math.round(formFields.DOC_AMT * 100) / 100;
    console.log(
      "formFields.DOC_AMT",
      formFields.DOC_AMT,
      typeof formFields.DOC_AMT
    );
    this.setState({ formFields });
  };

  autofillSaved = () => {
    // let formFields = Object.assign({}, this.state.formFields);
    let { storedItemList, formFields } = this.state;

    storedItemList = this.props.storedItemListStored;
    console.log(
      "this.props.formFieldsDetailsStored in autofill",
      this.props.formFieldsDetailsStored.DOC_AMT
    );

    // formFields.DOC_AMT = this.props.formFieldsDetailsStored.DOC_AMT
    // formFields.DOC_QTY = this.props.formFieldsDetailsStored.DOC_QTY
    // formFields = this.props.formFieldsDetailsStored

    this.setState({ storedItemList, formFields }, () => {
      this.handleUpdateTotal();
    });
    console.log("storedItemList in autofillSaved", storedItemList);
    console.log("formFields in autofillSaved", formFields);
  };

  setUOM = UOM_DESC => {
    let { UOM } = this.state;
    UOM = UOM_DESC;
    console.log("UOM in setUOM", UOM);
    this.setState({ UOM });
  };

  render() {
    let {
      headerDetails,
      headerSelectedDetails,
      pageMeta,
      detailsList,
      storedItemList,
      isLoading,
      formFields,
    } = this.state;

    let { DOC_AMT, DOC_QTY } = formFields;

    let { t } = this.props;

    return (
      <div className="py-4">
        <div className="table-container">
          <div className="row">
            <div className="col-8"></div>

            <div className="col-4 mb-3">
              <div className="w-100">
                <InputSearch
                  placeholder="Search Item"
                  onChange={this.handlesearch}
                />
              </div>
            </div>
          </div>

          <TableWrapper
            headerDetails={headerDetails}
            queryHandler={this.handlePagination}
            pageMeta={pageMeta}
          >
            {isLoading ? (
              <tr>
                <td colSpan="7">
                  <div class="d-flex mt-5 align-items-center justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">{t("Loading...")}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : detailsList ? (
              detailsList.map((item, index) => {
                let {
                  item_code,
                  Item_Desc,
                  brand_itm_desc,
                  range_itm_desc,
                  UOM_DESC,
                  ITEM_UOM,
                  QTY,
                  item_quantity,
                  item_cost,
                } = item;
                return (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {item_code}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {Item_Desc}
                      </div>
                    </td>

                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {brand_itm_desc}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {range_itm_desc}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {UOM_DESC}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {QTY}
                      </div>
                    </td>

                    <td>
                      {/* <div className="input-group"> */}
                      <NormalInput
                        value={item_quantity}
                        disabled={this.props.disableEdit}
                        name={item_code}
                        onKeyPress={event => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onClick={() => this.setUOM(UOM_DESC)}
                        onChange={this.handleChangeQuantity}
                      />
                      {/* </div> */}
                    </td>

                    <td>
                      {/* <div className="input-group"> */}
                      <NormalInput
                        value={item_cost}
                        disabled={this.props.disableEdit}
                        name={item_code}
                        onKeyPress={event => {
                          if (
                            !/[0-9]/.test(event.key) &&
                            !/\./.test(event.key)
                          ) {
                            event.preventDefault();
                          }
                        }}
                        onClick={() => this.setUOM(UOM_DESC)}
                        onChange={this.handleChangeCost}
                      />
                      {/* </div> */}
                    </td>

                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <NormalButton
                          buttonClass={"mx-2"}
                          disabled={this.props.disableEdit}
                          mainbg={true}
                          className="warning"
                          label="Select"
                          onClick={() =>
                            this.handleSelect(
                              item_code,
                              Item_Desc,
                              brand_itm_desc,
                              range_itm_desc,
                              UOM_DESC,
                              ITEM_UOM,
                              item_quantity,
                              item_cost
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : null}
          </TableWrapper>

          <div className="row mt-5"></div>
          <TableWrapper
            headerDetails={headerSelectedDetails}
            // queryHandler={this.handlePagination}
            // pageMeta={pageMeta}
          >
            {storedItemList
              ? storedItemList.map((item, index) => {
                  let {
                    item_code,
                    Item_Desc,
                    brand_itm_desc,
                    range_itm_desc,
                    UOM_DESC,
                    item_cost,
                    item_quantity,
                    amount,
                    item_remarks,
                    editing,
                  } = item;
                  return editing == false ? (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {item_code}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {Item_Desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {brand_itm_desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {range_itm_desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {UOM_DESC}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {item_cost}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {item_quantity}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {amount}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {item_remarks}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={updateBtn}
                            width="35"
                            height="35"
                            alt=""
                            className="action-img bg-transparent"
                            onClick={
                              this.props.disableEdit == false
                                ? () => this.handleEdit(item_code, UOM_DESC)
                                : ""
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={deleteBtn}
                            width="35"
                            height="35"
                            alt=""
                            className="action-img bg-transparent "
                            onClick={
                              this.props.disableEdit == false
                                ? () =>
                                    this.handleRemoveStoredItem(
                                      item_code,
                                      UOM_DESC
                                    )
                                : ""
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {item_code}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {Item_Desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {brand_itm_desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {range_itm_desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {UOM_DESC}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            value={item_cost}
                            disabled={this.props.disableEdit}
                            name={item_code}
                            onKeyPress={event => {
                              if (
                                !/[0-9]/.test(event.key) &&
                                !/\./.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            onClick={() => this.setUOM(UOM_DESC)}
                            onChange={this.handleEditChangePrice}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            value={item_quantity}
                            disabled={this.props.disableEdit}
                            name={item_code}
                            onKeyPress={event => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            onClick={() => this.setUOM(UOM_DESC)}
                            onChange={this.handleEditChangeQuantity}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {amount}
                        </div>
                      </td>

                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            value={item_remarks}
                            disabled={this.props.disableEdit}
                            name={item_code}
                            onClick={() => this.setUOM(UOM_DESC)}
                            onChange={this.handleEditChangeRemarks}
                          />
                        </div>
                      </td>

                      {/* <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <img
                                  src={closeBtn}
                                  width="35"
                                  height="35"
                                  alt=""
                                  className="action-img bg-transparent"
                                  onClick={() =>this.handleClose(item_code)}
                                />
                              </div>
                            </td> */}
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={saveBtn}
                            width="35"
                            height="35"
                            alt=""
                            className="action-img bg-transparent "
                            onClick={
                              this.props.disableEdit == false
                                ? () => this.handleSave(item_code, UOM_DESC)
                                : ""
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </TableWrapper>

          <div className="row justify-content-end mt-5">
            <div className="col-4">
              {/* <div className="d-flex mb-3"> 
                      <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                        {t("Shipping Cost")}
                      </label>
                      <div className="input-group-address w-100">
                        <NormalInput
                          placeholder="Enter here"
                          disabled={this.props.disableEdit}
                          value={po_shipcost}
                          name="po_shipcost"
                          onChange={this.handleChangeDetails}
                        />
                      </div>
                    </div>

                    <div className="d-flex mb-3"> 
                      <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                        {t("Discount")}
                      </label>
                      <div className="input-group-discount w-100">
                        <NormalInput
                          // placeholder="Enter here"
                          disabled={this.props.disableEdit}
                          value={po_discount}
                          name="po_discount"
                          onChange={this.handleChangeDetails}
                        />
                      </div>
                      
                    </div>                   

                    <div className="d-flex mb-3"> 
                      <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                        {t("Taxes")}
                      </label>
                      <div className="input-group-address w-100">
                        <NormalInput
                          placeholder="Enter here"
                          disabled={this.props.disableEdit}
                          value={po_taxes}
                          name="po_taxes"
                          onChange={this.handleChangeDetails}
                        />
                      </div>
                    </div> */}

              <div className="d-flex mb-3">
                <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                  {t("Total Cost")}
                </label>
                <div className="input-group-address w-100">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={true}
                    value={DOC_AMT}
                    name="DOC_AMT"
                    // onChange={this.handleChangeDetails}
                  />
                </div>
              </div>
              <div>
                {this.props.validator.message(
                  t("Total Cost"),
                  DOC_AMT,
                  t("required")
                )}
              </div>

              <div className="d-flex mb-3">
                <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                  {t("Total Quantity")}
                </label>
                <div className="input-group-address w-100">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={true}
                    value={DOC_QTY}
                    name="DOC_QTY"
                    // onChange={this.handleChangeDetails}
                  />
                </div>
              </div>
              <div>
                {this.props.validator.message(
                  t("Total Quantity"),
                  DOC_QTY,
                  t("required")
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetail: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      getTokenDetails,
      // deleteProject,
      // getProject
    },
    dispatch
  );
};

export const Details = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsClass)
);
