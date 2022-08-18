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
  NormalSelect,
  NormalModal,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom";
import _ from "lodash";
import updateBtn from "assets/images/edit1.png";
import deleteBtn from "assets/images/delete1.png";
import closeBtn from "assets/images/close.png";
import saveBtn from "assets/images/save.png";
import closeIcon from "assets/images/close.png";

export class DetailsClass extends React.Component {
  state = {
    salesStaffOption: [],
    itemSlectedToIssue: "",
    headerDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Unit Price" },
      { label: "Quantity" },
      { label: "Uom item" },
      { label: "" },
    ],
    headerDetailsItemsTaken: [
      { label: "Staff Name" },
      { label: "Status" },
      { label: "UOM" },
    ],
    headerSelectedDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Remarks" },
      { label: "Quantity" },
      { label: "Unit Price" },
      { label: "" },
      { label: "" },
    ],
    formFields: {
      q_shipcost: "",
      q_discount: "",
      q_taxes: "",
      q_total: "",
    },

    detailsList: [
      {
        item_code: "",
        item_desc: "",
        item_remarks: "",
        item_price: "",
        item_quantity: "",
        item_uom: "",
        item_codeid: "",
        editing: false,
      },
    ],
    storedItemList: [],
    pageMeta: {},

    siteGstList: [],

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
    allInvoicesData: [],
    workOrderNo: "",
    allWorkOrderInvoiceLists: [],
    item_uom: "",

    items_taken_before: [],
  };

  componentWillMount() {
    this.autofillSaved();
  }

  updateState = (data) => {
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
    if (this.props.quoId) {
      this.autofillDetails();
    }

    // console.log("this.props.siteGstList",this.props.siteGstList)

    // if(this.props.siteCode){
    //   this.getSiteGst()
    // }

    // this.queryHandler({});
    console.log(
      "this.props.storedItemListStored loaded",
      this.props.storedItemListStored
    );
    console.log(
      "this.props.formFieldsDetailsStored loaded",
      this.props.formFieldsDetailsStored
    );
    // console.log("formfields in comdidmount", this.state.formFields)

    //
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.siteGstList !== prevProps.siteGstList) {
      // this.fetchData(this.props.siteGstList);
      let { siteGstList } = this.state;
      console.log("this.props.siteGstList in update", this.props.siteGstList);
      siteGstList = this.props.siteGstList;
      this.setState({ siteGstList }, () => {
        this.handleUpdateTotal();
      });
      // this.handleUpdateTotal()
    }
  }

  autofillDetails = () => {
    let formFields = Object.assign({}, this.state.formFields);
    // formFields["q_shipcost"] = 12
    // this.updateState({
    //   formFields,
    // });
    this.props
      .getCommonApi(`equipmentusagelist/?searchqdetailid=${this.props.quoId}`)
      .then((res) => {
        console.log("res in getAutofillItemDetails", res);
        if (res.status == 200) {
          // this.state.formFieldsDetailsStored.push("q_shipcost":res.data[0].q_shipcost)

          console.log(
            "this.state.formFields in componentWillMount",
            this.state.formFields
          );
        }
      });
  };

  getDetails = () => {
    this.updateState({ isLoading: true });
    let { detailsList, pageMeta, page, limit, search } = this.state;
    // let { item_desc } = formField;

    this.props
      .getCommonApi(`retailstock/?page=${page}&limit=&search=${search}&stock=1`)
      .then(async (res) => {
        console.log(res, "dsfdfaafg");
        await this.setState({ detailsList: [] });
        detailsList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.meta.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        // this.setState({ detailsList, pageMeta });
        // this.setState({ detailsList });

        console.log("res.data", res.data);
        console.log("detailsList", detailsList);
        console.log("pageMeta", pageMeta);

        for (let list in detailsList) {
          // console.log("detailsList[list] before",detailsList[list])
          detailsList[list].item_quantity = "";
          // console.log("detailsList[list] after", detailsList[list])
        }
        console.log("detailsList after", detailsList);

        this.updateState({
          detailsList,
          pageMeta,
          isLoading: false,
        });
      });
  };
  get_items_taken_before = (item_code) => {
    this.props
      .getCommonApi(`itemequipmentlist/?item_code=${item_code}`)
      .then(async (res) => {
        console.log(res, "dsfdfaafg");
        if (res.status == 200) {
          console.table(res.data);
          this.setState({ items_taken_before: res.data });
        }
      });
  };

  handlePagination = async (pageNo) => {
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

  handlesearch = (event) => {
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

  handleClick = (key) => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      active: !prevState.active,
      currentIndex: key,
    }));
  };

  handleOutsideClick = (e) => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  handleChangeDetails = ({ target: { value, name } }) => {
    let { storedItemList } = this.state;
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;

    this.setState(
      {
        formFields,
      },
      () => {
        this.handleUpdateTotal();
      }
    );
    console.log("formFields in handle change details", formFields);
    // this.handleUpdateTotal();
    this.props.storeItemDetails(storedItemList, formFields);
  };

  handleChange = async ({ target: { value, name } }) => {
    // debugger;
    let { detailsList } = this.state;
    console.log("value", value);
    console.log("name", name);

    for (let list in detailsList) {
      if (detailsList[list].item_code == name) {
        detailsList[list].item_quantity = value;
      } else if (name == detailsList[list].item_desc) {
        detailsList[list].item_uom = value;
        let uomid = detailsList[list].uomprice.filter(
          (e) => e.item_uom == value
        );
        console.log(uomid, "uomid");
        if (uomid) {
          this.setState({
            itemSlectedToIssue: {
              ...this.state.itemSlectedToIssue,
              ...uomid[0],
            },
          });
        }
        detailsList[list].item_codeid = detailsList[list].id;
      }

      console.log("detailsList[list].item_code", detailsList[list].item_code);
      console.log("detailsList[list].item_uom", detailsList[list].item_uom);
      console.log("detailsList[list].item_uom", detailsList[list]);
    }

    detailsList[0][name] = value;

    await this.setState({
      detailsList,
    });
    console.log("detailsList in handleChange", detailsList);
    // current_item_quantity = value
    // this.setState({ current_item_quantity })
  };

  handleSelect = (
    item_code,
    item_desc,
    item_price,
    item_quantity,
    item_div,
    item_type,
    item_uom,
    item_codeid
  ) => {
    let { storedItemList, detailsList, formFields } = this.state;
    for (let item of storedItemList) {
      if (item.item_code == item_code) {
        Toast({
          type: "error",
          message: "This item already exists",
        });
        return;
      }
    }
    console.log("item_code", item_code);
    console.log("item_desc", item_desc);
    console.log("item_price", item_price);
    console.log("item_codeid", item_codeid);
    console.log("item_uom", item_uom);
    console.log("item_type", item_type);
    if (this.state.itemSlectedToIssue.onhand_qty >= item_quantity) {
      if (item_quantity) {
        storedItemList.push({
          item_code: item_code,
          item_desc: item_desc,
          item_remarks: "",
          item_price: item_price,
          item_quantity: item_quantity,
          editing: false,
          item_div: item_div,
          item_type: item_type,
          item_uom: item_uom,
          item_codeid: item_codeid,
        });
      } else {
        item_quantity = 1;
        storedItemList.push({
          item_code: item_code,
          item_desc: item_desc,
          item_remarks: "",
          item_price: item_price,
          item_quantity: item_quantity,
          editing: false,
          item_div: item_div,
          item_type: item_type,
          item_uom: item_uom,
          item_codeid: item_codeid,
        });
      }

      console.log("storedItemList", storedItemList);
      this.setState({ storedItemList });
      this.handleUpdateTotal();
      this.props.storeItemDetails(storedItemList, formFields);
    } else {
      alert("Please Input Qunatity less than Available Qunatity");
    }
  };

  handleEditChangeRemarks = ({ target: { value, name } }) => {
    let { storedItemList } = this.state;

    for (let list in storedItemList) {
      if (storedItemList[list].item_code == name) {
        storedItemList[list].item_remarks = value;
      }
      // console.log("storedItemList[list].item_code",storedItemList[list].item_code)
    }

    this.setState({
      storedItemList,
    });

    console.log("storedItemList in handleEditChange", storedItemList);
  };
  handleRemoveStoredItem = (item_code) => {
    let { storedItemList, formFields } = this.state;
    for (var i = 0; i < storedItemList.length; i++) {
      if (storedItemList[i].item_code == item_code) {
        storedItemList.splice(i, 1);
      }
    }
    console.log("storedItemList after remove", storedItemList);
    this.setState({ storedItemList });
    this.handleUpdateTotal();
    this.props.storeItemDetails(storedItemList, formFields);
  };

  handleEdit = (item_code) => {
    let { storedItemList } = this.state;
    for (let list in storedItemList) {
      if (storedItemList[list].item_code == item_code) {
        storedItemList[list].editing = true;
      }
    }
    console.log("storedItemList in handleedit", storedItemList);

    this.setState({ storedItemList });
  };

  // handleClose = (item_code) => {
  //   let {storedItemList, storedItemListTemp, tempItem} = this.state

  //   console.log("storedItemListTemp in handleClose", storedItemListTemp)
  //   console.log("tempItem in handleClose", tempItem)

  //   for (let list in storedItemListTemp){
  //     if (storedItemListTemp[list].item_code == item_code){
  //       tempItem = storedItemListTemp[list]

  //     }
  //   }
  //   console.log("tempItem in handleClose", tempItem)

  //   for (let list in storedItemList){
  //     if (storedItemList[list].item_code == item_code){
  //       storedItemList[list].editing = false
  //       storedItemList[list].item_remarks = tempItem.item_remarks
  //       storedItemList[list].item_price = tempItem.item_price
  //       storedItemList[list].item_quantity = tempItem.item_quantity

  //     }
  //   }
  //   console.log("storedItemList in handleClose", storedItemList)

  //   this.setState({storedItemList})
  // }

  handleSave = (item_code) => {
    let { storedItemList } = this.state;
    for (let list in storedItemList) {
      if (storedItemList[list].item_code == item_code) {
        storedItemList[list].editing = false;
      }
    }
    console.log("storedItemList in handleClose", storedItemList);

    this.setState({ storedItemList });
  };

  autofillSaved = () => {
    let { storedItemList, formFields } = this.state;

    storedItemList = this.props.storedItemListStored;

    formFields.q_shipcost = this.props.formFieldsDetailsStored.q_shipcost;
    formFields.q_discount = this.props.formFieldsDetailsStored.q_discount;
    formFields.q_taxes = this.props.formFieldsDetailsStored.q_taxes;
    formFields.q_total = this.props.formFieldsDetailsStored.q_total;

    this.setState({ storedItemList, formFields });
    console.log("storedItemList in autofillSaved", storedItemList);
    console.log("formFields in autofillSaved", formFields);
  };

  handleUpdateTotal = () => {
    let { storedItemList, formFields, siteGstList } = this.state;
    // console.log("siteGstList[0]",siteGstList[0].site_is_gst)
    // if(siteGstList[0].site_is_gst == false)

    if (storedItemList.length !== 0) {
      let costPrice = 0;
      let subTotal = 0;
      let taxes = 0;
      let total = 0;
      for (let item of storedItemList) {
        costPrice =
          parseFloat(item.item_price) * parseFloat(item.item_quantity) +
          costPrice;
        // console.log("item.item_price",item.item_price,typeof item.item_price)
        // console.log("item.item_quantity",item.item_quantity,typeof item.item_quantity)
        // formFields.DOC_AMT = item.amount + formFields.DOC_AMT
        // formFields.DOC_QTY = parseInt(item.item_quantity) + formFields.DOC_QTY
      }
      console.log("GST");
      console.log(
        "formFields.q_shipcost",
        formFields.q_shipcost,
        typeof formFields.q_shipcost
      );
      console.log("costPrice", costPrice);

      subTotal =
        costPrice -
        (formFields.q_discount ? parseFloat(formFields.q_discount) : 0) +
        (formFields.q_shipcost ? parseFloat(formFields.q_shipcost) : 0);
      taxes =
        Math.round((siteGstList[0].item_value / 100) * subTotal * 100) / 100;

      total = Math.round((subTotal + taxes) * 100) / 100;

      formFields.q_taxes = taxes;
      formFields.q_total = total;
      // console.log("storedItemList in update total",storedItemList)
      // formFields.DOC_AMT = Math.round(formFields.DOC_AMT * 100) / 100
      // console.log("formFields.DOC_AMT",formFields.DOC_AMT, typeof formFields.DOC_AMT)
      this.setState({ formFields });
      console.log("formFields in update total if", formFields);
    } else {
      formFields.q_taxes = 0;
      formFields.q_total = 0;
      this.setState({ formFields });
      console.log("formFields in update total else", formFields);
    }
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

    let { q_shipcost, q_discount, q_taxes, q_total } = formFields;

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
                  item_desc,
                  item_price,
                  item_quantity,
                  item_div,
                  item_type,
                  item_uom,
                  item_codeid,
                } = item;

                {
                  /* let item_codeid = item.uomprice.map(e=>({label:e.item_uom,value:e.item_uom})); */
                }
                let item_uom_array = item.uomprice.map((e) => ({
                  label: e.item_uom,
                  value: e.item_uom,
                  onhand_qty: e.onhand_qty,
                  item_price: e.item_price,
                }));
                console.log(item, "INside map function line 543");
                return (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {item_code}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {item_desc}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {item_price}
                      </div>
                    </td>

                    <td>
                      {/* <div className="input-group"> */}
                      <NormalInput
                        value={item_quantity}
                        disabled={this.props.disableEdit}
                        name={item_code}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={this.handleChange}
                      />
                      {/* <div>
                                {this.props.validator.message(
                                  t("Quantity"),
                                  item_quantity,
                                  t("required")
                                )}
                          </div> */}
                      {/* </div> */}
                    </td>
                    <td>
                      <NormalSelect
                        options={item_uom_array}
                        value={item_uom}
                        name={item_desc}
                        onChange={this.handleChange}
                      />
                    </td>

                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <NormalButton
                          disabled={this.props.disableEdit}
                          buttonClass={"mx-2"}
                          mainbg={true}
                          className="warning"
                          label="Select"
                          onClick={() => {
                            if (!item_uom) {
                              alert("Plesae Select UOM Type");
                            } else {
                              this.get_items_taken_before(item_code);
                              this.setState({
                                modalOpenItemDetails:
                                  !this.state.modalOpenItemDetails,
                              });
                              this.setState({
                                itemSlectedToIssue: {
                                  ...this.state.itemSlectedToIssue,
                                  item_name: item.item_name,
                                  item_code,
                                  item_desc,
                                  item_price,
                                  item_quantity,
                                  item_div,
                                  item_type,
                                  item_uom,
                                  item_codeid,
                                },
                              });
                            }
                            console.log(
                              this.state.itemSlectedToIssue,
                              "itemSlectedToIssueitemSlectedToIssueitemSlectedToIssue"
                            );
                          }}
                        />
                      </div>
                      {/* <div className="d-flex align-items-center justify-content-center">
                        <NormalButton
                          disabled={this.props.disableEdit}
                          buttonClass={"mx-2"}
                          mainbg={true}
                          className="warning"
                          label="Select"
                          onClick={() =>
                            this.handleSelect(
                              item_code,
                              item_desc,
                              item_price,
                              item_quantity,
                              item_div,
                              item_type,
                              item_uom,
                              item_codeid
                            )
                          }
                        />
                      </div> */}
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
                    item_desc,
                    item_remarks,
                    item_price,
                    item_quantity,
                    editing,
                  } = item;
                  return editing == false ? (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-start justify-content-start">
                          {item_code}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-start justify-content-start">
                          {item_desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-start justify-content-start">
                          {item_remarks}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-end justify-content-end">
                          {item_quantity}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-end justify-content-end">
                          {item_price}
                        </div>
                      </td>
                      <div className="d-flex align-items-center justify-content-center">
                        <img
                          src={updateBtn}
                          width="35"
                          height="35"
                          alt=""
                          className="action-img bg-transparent"
                          onClick={
                            this.props.disableEdit == false
                              ? () => this.handleEdit(item_code)
                              : ""
                          }
                        />
                      </div>
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
                                ? () => this.handleRemoveStoredItem(item_code)
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
                          {item_desc}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            value={item_remarks}
                            disabled={this.props.disableEdit}
                            name={item_code}
                            onChange={this.handleEditChangeRemarks}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {item_quantity}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {item_price}
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
                            onClick={() => this.handleSave(item_code)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </TableWrapper>
        </div>
        <NormalModal
          className={"select-category"}
          style={{ minWidth: "60%" }}
          modal={this.state.modalOpenItemDetails}
          handleModal={() =>
            this.setState({
              modalOpenItemDetails: !this.state.modalOpenItemDetails,
            })
          }
        >
          <img
            onClick={() =>
              this.setState({
                modalOpenItemDetails: !this.state.modalOpenItemDetails,
              })
            }
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="d-flex h4 justify-content-center p-3">
            Product Detail
          </div>
          <table class="table">
            {/* <thead>
              <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Email</th>
              </tr>
            </thead> */}
            <tbody>
              <tr>
                <td>Product Name</td>
                <td>{this.state.itemSlectedToIssue.item_name}</td>
              </tr>
              <tr>
                <td>Item Uom</td>
                <td>{this.state.itemSlectedToIssue.item_uom}</td>
              </tr>
              <tr>
                <td>Item Price</td>
                <td>{this.state.itemSlectedToIssue.item_price}</td>
              </tr>
              <tr>
                <td>Available Quantity</td>
                <td>{this.state.itemSlectedToIssue.onhand_qty}</td>
              </tr>
              <tr>
                <td>Entered Quantity</td>
                <td>
                  {this.state.itemSlectedToIssue.item_quantity
                    ? this.state.itemSlectedToIssue.item_quantity
                    : 1}
                  {/* <NormalInput
                    value={this.state.itemSlectedToIssue.item_quantity}
                    disabled={this.props.disableEdit}
                    name={this.state.itemSlectedToIssue.item_code}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={this.handleChange}
                  /> */}
                </td>
                <td>
                  <NormalButton
                    disabled={this.props.disableEdit}
                    buttonClass={"mx-2"}
                    mainbg={true}
                    className="warning"
                    label="Select"
                    onClick={() =>
                      this.handleSelect(
                        this.state.itemSlectedToIssue.item_code,
                        this.state.itemSlectedToIssue.item_desc,
                        this.state.itemSlectedToIssue.item_price,
                        this.state.itemSlectedToIssue.item_quantity
                          ? this.state.itemSlectedToIssue.item_quantity
                          : 1,
                        this.state.itemSlectedToIssue.item_div,
                        this.state.itemSlectedToIssue.item_type,
                        this.state.itemSlectedToIssue.item_uom,
                        this.state.itemSlectedToIssue.item_codeid
                      )
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex h4 justify-content-center p-3">
          List of Staff who had taken it before
          </div>
          <TableWrapper
            headerDetails={this.state.headerDetailsItemsTaken}
            // queryHandler={this.handlePagination}
            // pageMeta={pageMeta}
          >
            {this.state.items_taken_before.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-start justify-content-start">
                    {data.staff_name}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-start justify-content-start">
                    {data.status}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-start justify-content-start">
                    {data.item_uom}
                  </div>
                </td>
              </tr>
            ))}
          </TableWrapper>
        </NormalModal>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   projectDetail: state.project.projectDetail,
// });

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCommonApi,
      // deleteProject,
      // getProject
    },
    dispatch
  );
};

export const Details = withTranslation()(
  connect(null, mapDispatchToProps)(DetailsClass)
);
