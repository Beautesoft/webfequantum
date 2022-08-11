import React, { Component } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalDateTime,
  NormalMultiSelect,
  NormalTextarea,
  TableWrapper,
} from "component/common";
import { displayImg, dateFormat } from "service/helperFunctions";
import {
  getJobtitle,
  getCommonApi,
  commonCreateApi,
  commonUpdateApi,
} from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FormGroup, Label, Input } from "reactstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { createPO, updatePO, deletePO } from "redux/actions/po";
import { getTokenDetails } from "redux/actions/auth";
import { useLocation } from "react-router-dom";
import updateBtn from "assets/images/edit1.png";
import deleteBtn from "assets/images/delete1.png";
import closeBtn from "assets/images/close.png";
import saveBtn from "assets/images/save.png";
import { history } from "helpers";
import { Toast } from "service/toast";
import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import PDF from "../../StocksPDF/POHQ/index";
import Blur from "react-css-blur";

export class AddStocksPOHQClass extends Component {
  state = {
    formFields: {
      PO_NO: "",
      SUPP_Code: "",
      PO_DATE: new Date(),
      contactPerson: "",
      PO_STATUS: "",
      ItemSite_Code: "",
      PO_REMK1: "",
      terms: "",
      PO_TTQTY: "",
      PO_TTAMT: "",
    },
    headerSelectedDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "UOM" },
      // { label: "Brand" },
      // { label: "Range" },
      { label: "Unit Price" },
      { label: "Total Qty" },
      { label: "Required Qty" },
      { label: "Approved Qty" },
    ],
    statusOption: [],
    contactOption: [],
    supOption: [],
    siteOption: [],

    storedItemList: [],

    UOM: "",

    // hqonly:0,

    listDetail: {},
    isPrintPdfClick: false,
    siteAddr: [],

    disableEdit: false,
    disableEditQty: false,
    is_loading: true,
    isMounted: true,

    blur: false,
  };

  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      validators: {},
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };

  componentDidMount = () => {
    console.log("this.props", this.props);

    console.log("this.state", this.state);
    // console.log("useLocation()",useLocation())
    this.getSiteCode();
    this.getSup();
    this.getContact();
    // this.getSiteDetail()
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handleClick = async key => {
    let { active, currentValue } = this.state;
    await this.setState({
      selectedMenu: key.id,
    });
    this.setState({
      active: true,
      currentValue: key.key,
      selected: key.id,
    });
  };

  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;

    this.updateState({
      formFields,
    });
    if (name == "SUPP_Code") {
      let { contactOption } = this.state;
      contactOption = [];
      this.props
        .getCommonApi(`supplycontactinfo/?searchsuppliercode=${value}`)
        .then(res => {
          console.log("res.data", res);
          for (let key of res.data) {
            contactOption.push({
              value: key.ContactInfo_ID,
              label: key.ContactInfo_Name,
              suppCode: key.Supplier_Code,
              phone: key.ContactInfo_PhoneNo,
              email: key.ContactInfo_Email,
              active: key.Active,
            });
          }
          console.log("contactOption", contactOption);
          this.setState({ contactOption });
        });
    }
  };

  handleDatePick = async (name, value) => {
    // dateFormat(new Date())
    let { formFields } = this.state;
    formFields[name] = value;
    // formFields[name] = value;
    await this.updateState({
      formFields,
    });
  };

  getContact = () => {
    let { contactOption, blur } = this.state;
    contactOption = [];
    this.props.getCommonApi(`supplycontactinfo`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        contactOption.push({
          value: key.ContactInfo_ID,
          label: key.ContactInfo_Name,
          suppCode: key.Supplier_Code,
          phone: key.ContactInfo_PhoneNo,
          email: key.ContactInfo_Email,
          active: key.Active,
        });
      }
      console.log("contactOption", contactOption);
      this.setState({ contactOption });
      if (this.props.match.params.id) {
        this.autoFillForm();
      }
      if (
        this.props.tokenDetail.role_code !== "1" &&
        this.props.tokenDetail.role_code !== "2"
      ) {
        blur = true;
        this.setState({ blur });
      }
    });
  };

  getSiteCode = () => {
    let { siteOption } = this.state;
    siteOption = [];
    this.props.getCommonApi(`sitecode`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        siteOption.push({
          value: key.ItemSite_Code,
          label: key.ItemSite_Desc,
          id: key.ItemSite_ID,
          // active: key.itm_isactive,
        });
      }
      console.log("siteOption", siteOption);
      this.setState({ siteOption });
    });
  };

  getSup = () => {
    let { supOption } = this.state;
    supOption = [];
    this.props.getCommonApi(`itemsupply`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        supOption.push({
          value: key.SPLY_CODE,
          label: key.SUPPLYDESC,
          addr1: key.SPLY_ADDR1,
          addr2: key.SPLY_ADDR2,
          addr3: key.SPLY_ADDR3,
          postalCode: key.SPLY_POSCD,
          state: key.SPLY_STATE,
          city: key.SPLY_CITY,
          country: key.SPLY_CNTRY,
        });
      }
      console.log("supOption", supOption);
      this.setState({ supOption });
    });
  };

  getAutofillItemDetails = PO_NO => {
    console.log("PO_NO", PO_NO);
    this.props
      .getCommonApi(`poapprovalitem/?searchpono=${PO_NO}&limit=10000`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            this.props
              .getCommonApi(
                `allstocklist/?searchitemdesc=${item.POD_ITEMDESC}&searchsitecode=${this.props.tokenDetail.site_code}&limit=100`
              )
              .then(resAll => {
                console.log(resAll, "dsfdfaafg");
                // this.setState({ detailsListFull: [] });
                for (let data of resAll.data.dataList) {
                  console.log("data.Item_Desc", data.Item_Desc);
                  console.log("item.POD_ITEMDESC", item.POD_ITEMDESC);
                  console.log("data.UOM_DESC", data.UOM_DESC);
                  console.log("item.BrandName", item.BrandName);
                  if (
                    data.Item_Desc == item.POD_ITEMDESC &&
                    data.UOM_DESC == item.BrandName
                  ) {
                    console.log("in if loop");
                    this.state.storedItemList.push({
                      item_code: item.POD_ITEMCODE,
                      Item_Desc: item.POD_ITEMDESC,
                      ITEM_UOM: item.BrandCode,
                      UOM_DESC: item.BrandName,
                      POD_ITEMPRICE: item.POD_ITEMPRICE,
                      POD_TTLQTY: data.QTY,
                      POD_QTY: item.POD_QTY,
                      POD_APPQTY: item.POD_APPQTY,
                    });
                  }
                }
                this.setState(this.state.storedItemList);
              });
            // this.state.itemListBeforeEdit.push({"item_id":item.PO_ID,"item_code":item.POD_ITEMCODE,"UOM_DESC":item.BrandName})
          }

          // this.setState(this.state.itemListBeforeEdit)
          // console.log("this.state.itemListBeforeEdit",this.state.itemListBeforeEdit)
        }
      });
  };

  autoFillForm = () => {
    let { disableEdit, disableEditQty, contactOption, supOption } = this.state;

    this.props
      .getCommonApi(`poapprovallist/?searchpoid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("po dataList", res.data.dataList);
        // console.log("quo dataList cust name", res.data.dataList[0].customer_name);
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList
        this.state.formFields["PO_NO"] = res.data.dataList[0].PO_NO;
        this.state.formFields["SUPP_Code"] = res.data.dataList[0].SUPP_Code;

        // if (res.data.dataList[0].SUPP_Code && supOption.length!==0) {
        //   //matching status name with the id to set prefill status in dropdown
        //   this.state.formFields["SUPP_Code"] = supOption.find(option => option.label === res.data.dataList[0].SUPP_Code).value
        //   console.log("res.data.dataList[0].SUPP_Code",res.data.dataList[0].SUPP_Code)
        // }
        // this.state.formFields["SUPP_Code"] = res.data.dataList[0].SUPP_Code
        this.state.formFields["PO_DATE"] = res.data.dataList[0].PO_DATE;

        console.log("contactOption in autofill", contactOption);
        console.log(
          "res.data.dataList[0].contactPerson",
          res.data.dataList[0].contactPerson
        );

        if (res.data.dataList[0].contactPerson && contactOption.length !== 0) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["contactPerson"] = contactOption.find(
            option => option.label === res.data.dataList[0].contactPerson
          ).value;
          console.log(
            "res.data.dataList[0].contactPerson",
            res.data.dataList[0].contactPerson
          );
        }

        this.state.formFields["PO_STATUS"] = res.data.dataList[0].PO_STATUS;
        if (
          res.data.dataList[0].PO_STATUS == "Posted" ||
          res.data.dataList[0].PO_STATUS == "Approved" ||
          res.data.dataList[0].PO_STATUS == "Not Approved"
        ) {
          disableEdit = true;
          this.setState({ disableEdit });
        }
        if (
          res.data.dataList[0].PO_STATUS == "Approved" ||
          res.data.dataList[0].PO_STATUS == "Not Approved"
        ) {
          disableEditQty = true;
          this.setState({ disableEditQty });
        }

        // console.log("statusOption in prefill",this.state.statusOption)
        // console.log("res.data.dataList[0].status",res.data.dataList[0].status)
        // if status empty prevent err
        // if (res.data.dataList[0].PO_STATUS && statusOption.length!==0) {
        //   //matching status name with the id to set prefill status in dropdown
        //   this.state.formFields["PO_STATUS"] = statusOption.find(option => option.label === res.data.dataList[0].PO_STATUS).value
        //   console.log("res.data.dataList[0].PO_STATUS",res.data.dataList[0].PO_STATUS)
        //   if(res.data.dataList[0].PO_STATUS == "Posted"){
        //     disableEdit = true

        //     // for (var i = 0; i < statusOption.length; i++){
        //     //   if(statusOption[i].label == "Posted") {
        //     //     statusOption = statusOption.filter(e => e.label !== 'Open')
        //     //   }
        //     // }
        //     // console.log("statusOption when status is posted",statusOption)

        //     this.setState({disableEdit})
        //     console.log("this.state.disableEdit",disableEdit)
        //   }
        // }
        this.state.formFields["ItemSite_Code"] =
          res.data.dataList[0].ItemSite_Code;

        this.state.formFields["PO_REMK1"] = res.data.dataList[0].PO_REMK1;
        this.state.formFields["terms"] = res.data.dataList[0].terms;
        this.state.formFields["PO_TTQTY"] = res.data.dataList[0].PO_TTQTY;
        this.state.formFields["PO_TTAMT"] = res.data.dataList[0].PO_TTAMT;

        // this.state.formFieldsDetailsStored.PO_TTQTY = res.data.dataList[0].PO_TTQTY

        this.updateState(this.state.formFields);
        // this.setState(this.state.formFieldsDetailsStored)
        // console.log("this.state.formFieldsDetailsStored",this.state.formFieldsDetailsStored)
        console.log("this.state.formFields", this.state.formFields);
        this.getAutofillItemDetails(res.data.dataList[0].PO_NO);
        this.getSiteDetail(res.data.dataList[0].ItemSite_Code);
      });
  };

  getSiteDetail = ItemSite_Code => {
    let { siteAddr, hqonly } = this.state;
    siteAddr = [];
    this.props.getCommonApi(`sitecode`).then(res => {
      console.log("res.data", res);
      siteAddr = res.data;
      console.log("siteAddr", siteAddr);
      this.setState({ siteAddr });

      // for(let item of res.data){
      //   if(item.ItemSite_Code == ItemSite_Code){
      //     hqonly = item.hq_only
      //   }
      // }
      // console.log("hqonly",hqonly)

      // this.setState({hqonly})
    });
  };

  handleItemDetailsSubmit = async label => {
    let { storedItemList, formFields } = this.state;

    for (let item of storedItemList) {
      const formDataItem = new FormData();
      console.log("item.POD_APPQTY", item.POD_APPQTY);

      formDataItem.append("POD_APPQTY", item.POD_APPQTY ? item.POD_APPQTY : 0);

      if (label == "Approved") {
        formDataItem.append("STATUS", "Approved");
      } else if (label == "Not Approved") {
        formDataItem.append("STATUS", "Cancel");
      }

      await this.props
        .getCommonApi(
          `poapprovalitem/?searchpono=${formFields.PO_NO}&searchitemcode=${item.item_code}&searchuom=${item.UOM_DESC}`
        )
        .then(resGetItem => {
          // if (resGetItem.status == 200){
          console.log("resGetItem", resGetItem);
          this.props
            .commonUpdateApi(
              `poapprovalitem/${resGetItem.data.dataList[0].PO_ID}/`,
              formDataItem
            )
            .then(resUpdateItem => {
              console.log("resUpdateItem", resUpdateItem);
              history.push(`/admin/inventory`);
            });
          // }
          // else if(resGetItem.status == 204){
          //   formDataItem.append("fk_po", resPO.data.id)
          //   this.props
          //     .commonCreateApi(
          //       `poitem/`,
          //       formDataItem
          //     )
          //     .then(resCreateItem => {
          //       console.log("resCreateItem",resCreateItem)
          //     })
          // }
        });
    }
  };
  handleEditChangeQuantity = ({ target: { value, name } }) => {
    let { storedItemList, UOM } = this.state;

    for (let list in storedItemList) {
      if (
        storedItemList[list].item_code == name &&
        storedItemList[list].UOM_DESC == UOM
      ) {
        storedItemList[list].POD_APPQTY = value;
      }
      // console.log("storedItemList[list].item_code",storedItemList[list].item_code)
    }

    this.setState({
      storedItemList,
    });
    console.log("storedItemList in handleEditChange", storedItemList);
  };

  handleSubmit = async label => {
    try {
      if (this.validator.allValid()) {
        let { statusOption, storedItemList } = this.state;
        console.log("label", label, typeof label);
        console.log("storedItemList in submit", storedItemList);
        // window.alert("Approved Qty is empty!")
        for (let item of storedItemList) {
          console.log("!item.POD_APPQTY", !item.POD_APPQTY);
          // console.log("item.POD_APPQTY.length == 0",item.POD_APPQTY.length == 0)
          if (!item.POD_APPQTY) {
            Toast({
              type: "error",
              message: "Approved Qty is empty!",
            });
            return;
          }
        }
        for (let item of storedItemList) {
          if (item.POD_TTLQTY < item.POD_APPQTY) {
            Toast({
              type: "error",
              message: "Approved Qty for " + item.Item_Desc + " exceeded limit",
            });
            return;
          }
        }

        if (this.props.match.params.id) {
          console.log("if props");
          await this.handleItemDetailsSubmit(label);
          const formData = new FormData();
          if (label == "Approved") {
            // formData.append("IsApproved", "Approved")
            formData.append("PO_STATUS", "Approved");

            // if(hqonly == 1){
            //   var resPOHQ = await this.props
            //   .commonUpdateApi(
            //     `poapprovalhqonlylist/${this.props.match.params.id}/`,
            //     formData
            //   )
            // }else{
            var resPOHQ = await this.props.commonUpdateApi(
              `poapprovallist/${this.props.match.params.id}/`,
              formData
            );
            // }

            console.log(resPOHQ);
          } else if (label == "Not Approved") {
            console.log("label not app", label);
            // formData.append("IsApproved", "Not Approved")
            formData.append("PO_STATUS", "Not Approved");
            // if(hqonly == 1){
            //   var resPOHQ = await this.props
            //   .commonUpdateApi(
            //     `poapprovalhqonlylist/${this.props.match.params.id}/`,
            //     formData
            //   )
            // }else{
            var resPOHQ = await this.props.commonUpdateApi(
              `poapprovallist/${this.props.match.params.id}/`,
              formData
            );
            // }

            console.log(resPOHQ);
            // this.handleItemDetailsSubmit(label);
            history.push(`/admin/inventory`);
          } else {
            this.handleItemDetailsSubmit();
            history.push(`/admin/inventory`);
          }
        }
      } else {
        this.validator.showMessages();
      }
      // this.updateState({ is_loading: false });
    } catch (e) {
      this.updateState({ is_loading: false });
    }
  };

  setUOM = UOM_DESC => {
    let { UOM } = this.state;
    UOM = UOM_DESC;
    console.log("UOM in setUOM", UOM);
    this.setState({ UOM });
  };

  handlePrintPdfFormat = url => {
    this.setState({
      isPrintPdfClick: false,
    });
    var a = document.createElement("a");
    a.setAttribute("download", `${new Date()}.pdf`);
    a.setAttribute("href", url);
    a.click();
    window.open(url);
  };

  getListDetail = () => {
    let {
      siteAddr,
      supOption,
      contactOption,
      listDetail,
      formFields,
      isPrintPdfClick,
    } = this.state;

    let addr = "";

    for (let site of siteAddr) {
      if (site.ItemSite_Code == this.props.tokenDetail.site_code) {
        addr = site.ItemSite_Address;
      }
    }

    let supAddr = "";
    let supInfo = "";

    if (formFields.SUPP_Code && supOption) {
      supInfo = supOption.find(option => option.value === formFields.SUPP_Code);
      supAddr =
        supInfo.addr1 +
        " " +
        supInfo.addr2 +
        " " +
        supInfo.addr3 +
        " " +
        supInfo.postalCode +
        " " +
        supInfo.state +
        " " +
        supInfo.city +
        " " +
        supInfo.country;
      console.log("supAddr", supAddr);
    }

    listDetail = {
      PO_NO: formFields.PO_NO,
      Supplier:
        formFields.SUPP_Code && supOption
          ? supOption.find(option => option.value === formFields.SUPP_Code)
              .label
          : "",
      supAddr: supAddr ? supAddr : "",
      contactPhone:
        formFields.contactPerson && contactOption
          ? contactOption.find(
              option => option.value === formFields.contactPerson
            ).phone
          : "",
      contactEmail:
        formFields.contactPerson && contactOption
          ? contactOption.find(
              option => option.value === formFields.contactPerson
            ).email
          : "",
      contactPerson:
        formFields.contactPerson && contactOption
          ? contactOption.find(
              option => option.value === formFields.contactPerson
            ).label
          : "",
      PO_DATE: formFields.PO_DATE,
      terms: formFields.terms,
      PO_STATUS: formFields.PO_STATUS,
      storeName: this.props.tokenDetail.branch,
      printedBy: this.props.tokenDetail.username,
      totalQty: formFields.PO_TTQTY,
      totalAmt: formFields.PO_TTAMT,
      addr: addr,
    };
    console.log("listDetail in getListDetail", listDetail);

    isPrintPdfClick = true;
    this.setState({ listDetail, isPrintPdfClick });
  };

  render() {
    let {
      formFields,
      storedItemList,
      headerSelectedDetails,
      disableEdit,
      disableEditQty,
      contactOption,
      supOption,
      siteOption,
      isPrintPdfClick,
      listDetail,
      blur,
    } = this.state;

    let {
      PO_NO,
      SUPP_Code,
      PO_DATE,
      contactPerson,
      PO_STATUS,
      ItemSite_Code,
      PO_REMK1,
      terms,
      PO_TTQTY,
      PO_TTAMT,
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5  create-PO">
        <div className="head-label-nav">
          <p
            className="category cursor-pointer"
            onClick={() => history.push(`/admin/inventory`)}
          >
            {t("HQ Stocks PO Approval")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(
              `${this.props.match.params.id && "View/Edit"} Stocks PO Approval`
            )}
          </p>
        </div>
        <div className="PO-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row mt-5">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("PO No")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={true}
                    placeholder="Auto generated"
                    value={PO_NO}
                    name="PO_NO"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                  {this.validator.message(
                    t("PO No"),
                    PONumber,
                    t("required")
                  )}
                </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Supplier")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={supOption}
                    disabled={disableEdit}
                    value={SUPP_Code}
                    name="SUPP_Code"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                  {this.validator.message(
                    t("Supplier"),
                    SUPP_Code,
                    t("required")
                  )}
                </div> */}
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("PO Date")}
                </label>
                <div className="input-group-normal">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={PO_DATE ? new Date(PO_DATE) : new Date()}
                    name="PO_DATE"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    // maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                {/* <div>
                  {this.validator.message(
                    t("PO Date"),
                    PO_DATE,
                    t("required")
                  )}
                </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Contact Person")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={contactOption}
                    disabled={disableEdit}
                    value={contactPerson}
                    name="contactPerson"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                  {this.validator.message(
                    t("Contact Person"),
                    contactPerson,
                    t("required")
                  )}
                </div> */}
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Status")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={true}
                    // placeholder="Auto generated"
                    value={PO_STATUS}
                    name="PO_STATUS"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                  {this.validator.message(
                    t("Status"),
                    PO_STATUS,
                    t("required")
                  )}
                </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Store Code")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={siteOption}
                    disabled={disableEdit}
                    value={ItemSite_Code}
                    name="ItemSite_Code"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                  {this.validator.message(
                    t("Store Code"),
                    ItemSite_Code,
                    t("required")
                  )}
                </div> */}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Remarks")}
                </label>
                <div className="input-group-desc">
                  <NormalTextarea
                    // placeholder="Enter here"
                    disabled={disableEdit}
                    value={PO_REMK1}
                    name="PO_REMK1"
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-2 col-12"></div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Terms Of Payment")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    // placeholder="Enter here"
                    disabled={disableEdit}
                    value={terms}
                    name="terms"
                    onKeyPress={event => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("Quotation Number"),
                      terms,
                      t("required")
                    )}
                  </div> */}
              </div>
            </div>

            <div className="col-md-12 PO-content">
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
                        UOM_DESC,
                        POD_ITEMPRICE,
                        POD_TTLQTY,
                        POD_QTY,
                        POD_APPQTY,
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
                              {UOM_DESC}
                            </div>
                          </td>
                          <Blur radius={blur ? "10px" : ""}>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {POD_ITEMPRICE}
                              </div>
                            </td>
                          </Blur>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {POD_TTLQTY}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {POD_QTY}
                            </div>
                          </td>
                          <td>
                            <NormalInput
                              value={POD_APPQTY}
                              disabled={disableEditQty}
                              name={item_code}
                              onKeyPress={event => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              onClick={() => this.setUOM(UOM_DESC)}
                              onChange={this.handleEditChangeQuantity}
                            />
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>

              <div className="row justify-content-end mt-5">
                <div className="col-4">
                  <div className="d-flex mb-3">
                    <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                      {t("Total Cost")}
                    </label>
                    <Blur radius={blur ? "10px" : ""}>
                      <div className="input-group-address w-100">
                        <NormalInput
                          // placeholder="Enter here"
                          disabled={true}
                          value={PO_TTAMT}
                          name="PO_TTAMT"
                          // onChange={this.handleChangeDetails}
                        />
                      </div>
                    </Blur>
                  </div>
                  {/* <div>
                        {this.props.validator.message(
                          t("Total Cost"),
                          PO_TTAMT,
                          t("required")
                        )}
                    </div> */}

                  <div className="d-flex mb-3">
                    <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                      {t("Total Quantity")}
                    </label>
                    <div className="input-group-address w-100">
                      <NormalInput
                        // placeholder="Enter here"
                        disabled={true}
                        value={PO_TTQTY}
                        name="PO_TTQTY"
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  {/* <div>
                        {this.validator.message(
                          t("Total"),
                          PO_TTQTY,
                          t("required")
                        )}
                    </div> */}
                </div>
              </div>
            </div>

            <div className="row justify-content-end">
              {/* <div className="col-md-6 col-12 mt-3"></div> */}

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  mainbg={true}
                  className="confirm"
                  label="Back"
                  outline={false}
                  onClick={() => history.push(`/admin/inventory`)}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  disabled={disableEditQty}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  outline={false}
                  onClick={() => this.handleSubmit()}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  disabled={disableEditQty}
                  mainbg={true}
                  className="confirm"
                  label="Approved"
                  outline={false}
                  onClick={() => this.handleSubmit("Approved")}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  disabled={disableEditQty}
                  mainbg={true}
                  className="confirm"
                  label="Not Approved"
                  outline={false}
                  onClick={() => this.handleSubmit("Not Approved")}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  disabled={this.props.match.params.id ? false : true}
                  mainbg={true}
                  className="confirm"
                  label="Print PDF"
                  outline={false}
                  onClick={() => this.getListDetail()}
                />
              </div>
              {isPrintPdfClick ? (
                <PDFDownloadLink
                  document={
                    <PDF
                      listDetail={listDetail}
                      itemDetail={storedItemList}
                      // Flag={activeTab !== "detail" ? 3 : 4}
                      landscape={false}
                      blur={blur}
                    />
                  }
                >
                  {({ blob, url, loading, error }) =>
                    !loading && url ? this.handlePrintPdfFormat(url) : null
                  }
                </PDFDownloadLink>
              ) : null}
            </div>
          </div>
        </div>
        {/* )} */}
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
      commonCreateApi,
      commonUpdateApi,
      updatePO,
      createPO,
      deletePO,
      getTokenDetails,
    },
    dispatch
  );
};

export const AddStocksPOHQ = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStocksPOHQClass)
);
