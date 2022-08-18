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
  NormalCheckbox,
  InputSearch,
} from "component/common";
import { displayImg, dateFormat } from "service/helperFunctions";
import {
  getJobtitle,
  getCommonApi,
  commonCreateApi,
  commonUpdateApi,
  commonDeleteApi,
} from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FormGroup, Label, Input } from "reactstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { createPO, updatePO, deletePO } from "redux/actions/po";
import { getTokenDetails } from "redux/actions/auth";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import updateBtn from "assets/images/edit1.png";
import deleteBtn from "assets/images/delete1.png";
import saveBtn from "assets/images/save.png";
import { history } from "helpers";

import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import PDF from "../../StocksPDF/Report";
import SummaryPDF from "../../StocksPDF/Summary/index";
import DetailsPDF from "../../StocksPDF/Details/index";
import Blur from "react-css-blur";
import { Toast } from "service/toast";

export class AddStockReportClass extends Component {
  state = {
    formFields: {
      DOC_NO: "",
      DOC_REF1: "",
      DOC_DATE: new Date(),
      DOC_REF2: "",
      DOC_STATUS: "",
      STORE_NO: "",
      DOC_REMK1: "",
      CREATE_USER: "",
      DOC_AMT: "",
      DOC_QTY: "",
    },

    headerDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Brand" },
      { label: "Range" },
      { label: "UOM" },
      { label: "Unit Price" },
      { label: "Stock Qty" },
      { label: "Total Value" },
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
    headerDetailsSummary: [],

    searchFormFields: {
      dept: "",
      site: "",
      brand: "",
      item: "",
      range: "",
      // date:new Date(),
      QtyItem: false,
      inactiveItem: false,
      fromDate: new Date(),
      toDate: new Date(),
      itemSearch: "",
      itemSearchDesc: "",
    },

    UOM: "",

    listDetail: {},
    summary: {},
    details: {},
    reportDetailsList: [],
    reportSummaryList: [],
    isPrintSummaryPdfClick: false,
    isPrintDetailsPdfClick: false,
    isPrintPdfClick: false,
    siteAddr: [],

    statusOption: [],
    empOption: [],
    brandOption: [],
    deptOption: [],
    rangeOption: [],
    siteOption: [],
    itemOption: [],

    disableEdit: false,
    is_loading: true,
    isMounted: true,

    blur: false,

    detailsList: [],
    detailsListFull: [],
    summaryList: [],
    storedItemList: [],
    itemListBeforeEdit: [],
    pageMeta: {},

    search: "",
    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 10,
    isOpenvoidCheckout: false,
    isLoading: true,
    // is_loading: false,
    isMounted: true,
    // currentValue: 0,
    // navLinks: [
    //   { to: this.props.location.pathname, label: "Details", id: "Details" },
    //   { to: this.props.location.pathname, label: "Address", id: "Address" },
    // ],
    // selectedMenu: "Details",
  };

  componentWillMount = () => {
    // if (this.props.location.state){
    //   if(this.props.location.state.quoId){
    //     this.state.fkQuotation = this.props.location.state.quoId
    //     this.setState({fkQuotation : this.state.fkQuotation})
    //     console.log("this.props.location.state.quoId",this.props.location.state.quoId)
    //     console.log("this.state.fkQuotation",this.state.fkQuotation)
    //   }

    // }
    // this.getStatus();
    // this.getCountry();
    // this.getState();
    // this.getCity();
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
    let From = new Date();
    let { searchFormFields } = this.state;
    let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    searchFormFields["fromDate"] = firstdayMonth;
    this.setState({
      searchFormFields,
    });

    console.log("this.props", this.props);

    console.log("this.state", this.state);

    this.getStatus();

    // this.getSup()

    this.getBrand();
    this.getDept();
    this.getRange();
    this.getSiteCode();
    this.getSiteDetail();

    // this.handleUpdateTotal()
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

  handleDatePickSearch = async (name, value) => {
    // dateFormat(new Date())
    let { searchFormFields } = this.state;
    searchFormFields[name] = value;
    // formFields[name] = value;
    await this.updateState({
      searchFormFields,
    });
  };

  getStatus = () => {
    let { statusOption } = this.state;
    statusOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`dropdown`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        statusOption.push({
          value: key.id,
          label: key.AllDropdown_Item,
          code: key.AllDropdown_Desc,
          active: key.Active,
        });
      }
      for (var i = 0; i < statusOption.length; i++) {
        if (statusOption[i].label == "Approved") {
          statusOption.splice(i, 1);
        }
        if (statusOption[i].label == "Not Approved") {
          statusOption.splice(i, 1);
        }
      }
      if (!this.props.match.params.id) {
        for (var i = 0; i < statusOption.length; i++) {
          if (statusOption[i].label == "Posted") {
            statusOption.splice(i, 1);
          }
        }
      }
      console.log("statusOption", statusOption);
      this.setState({ statusOption }, () => {
        this.getEmp();
      });
    });
  };

  getEmp = () => {
    let { empOption, blur } = this.state;
    empOption = [];
    this.props.getCommonApi(`employeelist`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        empOption.push({
          value: key.Emp_no,
          label: key.Emp_name,
          code: key.Emp_code,
          // active: key.itm_isactive,
        });
      }
      console.log("empOption", empOption);
      this.setState({ empOption }, () => {
        this.getItem();
        if (this.props.match.params.id) {
          this.autoFillForm();
        } else {
          this.getDetails();
          this.prefillDefault();
        }
        if (
          this.props.tokenDetail.role_code !== "1" &&
          this.props.tokenDetail.role_code !== "2"
        ) {
          blur = true;
          this.setState({ blur });
        }
      });
    });
  };

  prefillDefault = () => {
    let { disableEdit, statusOption, empOption, supOption } = this.state;

    if (empOption.length !== 0) {
      //matching status name with the id to set prefill status in dropdown
      this.state.formFields["CREATE_USER"] = empOption.find(
        option => option.label === this.props.tokenDetail.username
      ).value;
    }
    if (statusOption.length !== 0) {
      //matching status name with the id to set prefill status in dropdown
      this.state.formFields["DOC_STATUS"] = statusOption.find(
        option => option.label === "Open"
      ).value;
    }

    this.state.formFields["STORE_NO"] = 1;
    this.setState(this.state.formFields);
  };

  getBrand = () => {
    let { brandOption } = this.state;
    brandOption = [];
    this.props.getCommonApi(`itembrand`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        brandOption.push({
          value: key.itm_id,
          label: key.itm_desc,
          code: key.itm_code,
          active: key.itm_status,
        });
      }
      console.log("brandOption", brandOption);
      this.setState({ brandOption });
    });
  };

  getDept = () => {
    let { deptOption } = this.state;
    deptOption = [];
    this.props.getCommonApi(`itemdeptdropdown`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        deptOption.push({
          value: key.itm_id,
          label: key.itm_desc,
          code: key.itm_code,
          // active: key.itm_status,
        });
      }
      console.log("deptOption", deptOption);
      this.setState({ deptOption });
    });
  };

  getRange = () => {
    let { rangeOption } = this.state;
    rangeOption = [];
    this.props.getCommonApi(`itemrange`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        rangeOption.push({
          value: key.itm_id,
          label: key.itm_desc,
          code: key.itm_code,
          active: key.itm_status,
        });
      }
      console.log("rangeOption", rangeOption);
      this.setState({ rangeOption });
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

  getItem = () => {
    let { itemOption } = this.state;
    itemOption = [];
    console.log(
      "this.props.tokenDetail.site_code in getitem",
      this.props.tokenDetail.site_code
    );
    this.props
      .getCommonApi(
        `allstocklist/?limit=2600&searchsitecode=${this.props.tokenDetail.site_code}`
      )
      .then(res => {
        console.log("res.data", res);
        for (let key of res.data.dataList) {
          itemOption.push({
            value: key.Item_no,
            label: key.Item_Desc,
            code: key.item_code,
            active: key.IsActive,
          });
        }
        console.log("itemOption", itemOption);
        this.setState({ itemOption });
      });
  };

  getSiteDetail = () => {
    let { siteAddr } = this.state;
    siteAddr = [];
    this.props.getCommonApi(`sitecode`).then(res => {
      console.log("res.data", res);
      siteAddr = res.data;
      console.log("siteAddr", siteAddr);
      this.setState({ siteAddr });
    });
  };

  getAutofillItemDetails = DOC_NO => {
    this.updateState({ isLoading: true });
    this.props
      .getCommonApi(`stocksheetitem/?searchdocno=${DOC_NO}&limit=5000`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            this.state.detailsList.push({
              item_code: item.ITEMCODE,
              Item_Desc: item.ITEMDESC,
              brand_itm_desc: item.itmBrandDesc,
              range_itm_desc: item.itmRangeDesc,
              UOM_DESC: item.DOC_UOMTYPE,
              ITEM_UOM: item.DOC_UOM,
              ITEM_COST: item.DOC_PRICE,
              QTY: item.DOC_QTY,
            });
            this.state.detailsListFull = this.state.detailsList;
            this.state.itemListBeforeEdit.push({
              item_id: item.DOC_ID,
              item_code: item.ITEMCODE,
              UOM_DESC: item.DOC_UOMTYPE,
            });
          }
          this.setState(this.state.detailsList);
          this.setState(this.state.detailsListFull);
          this.setState(this.state.itemListBeforeEdit);
        }
        this.updateState({
          isLoading: false,
        });
        // this.state.formFieldsDetailsStored.po_shipcost = res.data[0].po_shipcost
        // this.state.formFieldsDetailsStored.po_discount = res.data[0].po_discount
        // this.state.formFieldsDetailsStored.po_taxes = res.data[0].po_taxes
        // this.state.formFieldsDetailsStored.po_total = res.data[0].po_total
        // this.setState(this.state.formFieldsDetailsStored)
      });
  };

  autoFillForm = () => {
    let { disableEdit, statusOption, empOption } = this.state;

    this.props
      .getCommonApi(`stocksheetlist/?searchdocid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("adj dataList", res.data.dataList);

        this.state.formFields["DOC_NO"] = res.data.dataList[0].DOC_NO;
        // this.state.formFields["SUPPLY_NO"] = res.data.dataList[0].SUPPLY_NO

        this.state.formFields["DOC_REF1"] = res.data.dataList[0].DOC_REF1;
        this.state.formFields["DOC_DATE"] = res.data.dataList[0].DOC_DATE;

        this.state.formFields["DOC_REF2"] = res.data.dataList[0].DOC_REF2;

        console.log("statusOption in prefill", this.state.statusOption);
        console.log(
          "res.data.dataList[0].status",
          res.data.dataList[0].DOC_STATUS
        );
        // if status empty prevent err
        if (res.data.dataList[0].DOC_STATUS && statusOption.length !== 0) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["DOC_STATUS"] = statusOption.find(
            option => option.label === res.data.dataList[0].DOC_STATUS
          ).value;
          console.log(
            "res.data.dataList[0].DOC_STATUS",
            res.data.dataList[0].DOC_STATUS
          );
          if (res.data.dataList[0].DOC_STATUS == "Posted") {
            disableEdit = true;

            // for (var i = 0; i < statusOption.length; i++){
            //   if(statusOption[i].label == "Posted") {
            //     statusOption = statusOption.filter(e => e.label !== 'Open')
            //   }
            // }
            // console.log("statusOption when status is posted",statusOption)

            this.setState({ disableEdit });
            console.log("this.state.disableEdit", disableEdit);
          }
        }

        this.state.formFields["STORE_NO"] = 1;
        this.state.formFields["DOC_REMK1"] = res.data.dataList[0].DOC_REMK1;
        if (res.data.dataList[0].CREATE_USER && empOption.length !== 0) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["CREATE_USER"] = empOption.find(
            option => option.label === res.data.dataList[0].CREATE_USER
          ).value;
        }

        this.state.formFields["DOC_QTY"] = res.data.dataList[0].DOC_QTY;
        this.state.formFields["DOC_AMT"] = res.data.dataList[0].DOC_AMT;

        this.updateState(this.state.formFields);
        console.log("this.state.formFields", this.state.formFields);
        this.getAutofillItemDetails(res.data.dataList[0].DOC_NO);
      });
  };

  handleItemDetailsSubmit = resReport => {
    let { storedItemList, itemListBeforeEdit, detailsListFull } = this.state;
    console.log("itemListBeforeEdit", itemListBeforeEdit);
    console.log("detailsListFull", detailsListFull);
    for (let item of itemListBeforeEdit) {
      let found = detailsListFull.some(
        el => el.item_code === item.item_code && el.UOM_DESC === item.UOM_DESC
      );
      if (!found) {
        this.props
          .commonDeleteApi(`stocksheetitem/${item.item_id}/`)
          .then(res => {});
      }
    }

    for (let item of detailsListFull) {
      const formDataItem = new FormData();
      formDataItem.append("ITEMCODE", item.item_code);
      formDataItem.append("ITEMDESC", item.Item_Desc);
      formDataItem.append("DOC_UOMTYPE", item.UOM_DESC);
      formDataItem.append("DOC_UOM", item.ITEM_UOM);
      formDataItem.append("itmBrandDesc", item.brand_itm_desc);
      formDataItem.append("itmRangeDesc", item.range_itm_desc);
      formDataItem.append("DOC_PRICE", item.ITEM_COST);
      formDataItem.append("DOC_QTY", item.QTY);
      formDataItem.append("DOC_AMT", item.ITEM_COST * item.QTY);
      // formDataItem.append("ITEM_REMARK",item.item_remarks)

      this.props
        .getCommonApi(
          `stocksheetitem/?searchdocno=${resReport.data.DOC_NO}&searchitemcode=${item.item_code}&searchuom=${item.UOM_DESC}`
        )
        .then(resGetItem => {
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `stocksheetitem/${resGetItem.data.dataList[0].DOC_ID}/`,
                formDataItem
              )
              .then(resUpdateItem => {
                console.log("resUpdateItem", resUpdateItem);
                history.push(`/admin/inventory`);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("DOC_NO", resReport.data.DOC_NO);
            this.props
              .commonCreateApi(`stocksheetitem/`, formDataItem)
              .then(resCreateItem => {
                console.log("resCreateItem", resCreateItem);
                history.push(`/admin/inventory`);
              });
          }
        });
    }
  };

  handleSubmit = async DOC_STATUS => {
    try {
      if (this.validator.allValid()) {
        let { formFields, statusOption, empOption } = this.state;

        const formData = new FormData();

        formData.append("DOC_REF1", formFields.DOC_REF1);
        formData.append(
          "DOC_DATE",
          dateFormat(formFields.DOC_DATE) + " 00:00:00"
        );
        formData.append("DOC_REF2", formFields.DOC_REF2);

        if (DOC_STATUS) {
          formData.append("DOC_STATUS", "Posted");
        } else {
          formData.append(
            "DOC_STATUS",
            formFields.DOC_STATUS
              ? statusOption.find(
                  option => option.value === parseInt(formFields.DOC_STATUS)
                ).label
              : ""
          );
        }

        // console.log(statusOption.find(option => option.value === parseInt(formFields.DOC_STATUS)).label)

        // formData.append("STORE_NO", formFields.STORE_NO);
        formData.append("STORE_NO", this.props.tokenDetail.site_code);
        formData.append("DOC_REMK1", formFields.DOC_REMK1);

        formData.append(
          "CREATE_USER",
          formFields.CREATE_USER
            ? empOption.find(
                option => option.value === parseInt(formFields.CREATE_USER)
              ).label
            : ""
        );

        formData.append(
          "STAFF_NO",
          formFields.CREATE_USER
            ? empOption.find(
                option => option.value === parseInt(formFields.CREATE_USER)
              ).code
            : ""
        );
        formData.append("DOC_AMT", formFields.DOC_AMT);
        formData.append("DOC_QTY", formFields.DOC_QTY);

        console.log("formData", formData);
        if (this.props.match.params.id) {
          console.log("in if loop");
          console.log("this.props.match.params.id", this.props.match.params.id);
          var resReport = await this.props.commonUpdateApi(
            `stocksheetlist/${this.props.match.params.id}/`,
            formData
          );

          console.log(resReport);
          // this.handleAddressSubmit(resReport);
          this.handleItemDetailsSubmit(resReport);
          // if(statusValue == "Void"){
          //   console.log("in void loop")
          //   await this.props.deletePO(`${this.props.match.params.id}/`)
          // }
          history.push(`/admin/inventory`);
        } else {
          console.log("this.props before createPO", this.props);
          // if (this.props.location.state){
          //   console.log("this.props.location.state.projectFk",this.props.location.state.projectFk)
          //   formData.append("fk_project", this.props.location.state.projectFk);
          // }
          // console.log("this.state.fkProject before createPO",this.state.fkProject)
          // formData.append("fk_project", this.state.fkProject);
          // var resReport = await this.props.createPO(formData);

          var resReport = await this.props.commonCreateApi(
            `stocksheetlist/`,
            formData
          );

          console.log("resReport in createPO", resReport);
          console.log("resReport.data.id", resReport.data.id);

          // this.handleAddressSubmit(resReport);
          this.handleItemDetailsSubmit(resReport);
          history.push(`/admin/inventory`);
        }
      } else {
        this.validator.showMessages();
      }
      // this.updateState({ is_loading: false });
    } catch (e) {
      this.updateState({ is_loading: false });
    }
  };

  getDetails = () => {
    this.updateState({ isLoading: true });
    let {
      detailsList,
      detailsListFull,
      pageMeta,
      page,
      limit,
      search,
      searchFormFields,
    } = this.state;
    // let { Item_Desc } = formField;
    // console.log("this.props.siteCode",this.props.siteCode)
    //     console.log(typeof this.props.siteCode)
    console.log("searchFormFields", searchFormFields);

    this.props
      .getCommonApi(
        `allstocklist/?searchactive=${
          searchFormFields.inactiveItem == false ? "no" : "yes"
        }&searchqty=${
          searchFormFields.inactiveItem == false ? "" : "yes"
        }&searchitemdesc=${searchFormFields.item}&searchdeptdesc=${
          searchFormFields.dept
        }&searchbranddesc=${searchFormFields.brand}&searchrangedesc=${
          searchFormFields.range
        }&searchsitecode=${
          this.props.tokenDetail.site_code
        }&page=${page}&limit=${limit}`
      )
      .then(res => {
        console.log(res, "dsfdfaafg");
        this.setState({ detailsList: [] });
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

    this.props
      .getCommonApi(
        `allstocklist/?searchactive=${
          searchFormFields.inactiveItem == false ? "no" : "yes"
        }&searchqty=${
          searchFormFields.inactiveItem == false ? "" : "yes"
        }&searchitemdesc=${searchFormFields.item}&searchdeptdesc=${
          searchFormFields.dept
        }&searchbranddesc=${searchFormFields.brand}&searchrangedesc=${
          searchFormFields.range
        }&searchsitecode=${this.props.tokenDetail.site_code}&limit=2600`
      )
      .then(res => {
        console.log(res, "dsfdfaafg");
        // this.setState({ detailsListFull: [] });
        detailsListFull = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        // pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        // this.setState({ detailsList, pageMeta });
        // this.setState({ detailsList });

        // console.log('res.data',res.data)
        console.log("detailsListFull", detailsListFull);
        // console.log('pageMeta',pageMeta)
        this.setState(
          {
            detailsListFull,
          },
          () => {
            this.handleUpdateTotal();
          }
        );
      });
  };

  getSummary = () => {
    // this.updateState({ isLoading: true });
    let {
      detailsList,
      detailsListFull,
      pageMeta,
      page,
      headerDetailsSummary,
      summaryList,
      searchFormFields,
    } = this.state;
    let { fromDate, toDate } = searchFormFields;
    // let { Item_Desc } = formField;
    // console.log("this.props.siteCode",this.props.siteCode)
    //     console.log(typeof this.props.siteCode)
    console.log("searchFormFields", searchFormFields);

    let From = new Date();
    if (fromDate && fromDate !== "") {
      From = fromDate;
    } else {
      this.setState({ fromDate: From });
    }
    let To = new Date();
    if (toDate && toDate !== "") {
      To = toDate;
    } else {
      this.setState({ toDate: To });
    }

    this.props
      .getCommonApi(
        `stockmvmtinfo/?searchfrom=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&searchto=${dateFormat(To, "yyyy-mm-dd")}&searchsitecode=${
          this.props.tokenDetail.site_code
        }&getpo=yes&getdo=yes&getstockin=yes&getstockout=yes&getstockadj=yes&getstockusage=yes&getstockreport=yes&getgrn=yes&getvgrn=yes&getstocktake=yes&getall=yes`
      )
      .then(res => {
        console.log(res, "dsfdfaafg");
        this.setState({ summaryList: [] });
        summaryList = res.data;
        for (let item of res.data) {
          headerDetailsSummary.push({ label: item.doctype });
        }
        this.setState({ headerDetailsSummary });
        // pageMeta = res.data.meta.pagination;
        // pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        // this.setState({ detailsList, pageMeta });
        // this.setState({ detailsList });

        // console.log('res.data',res.data)
        // console.log('detailsList',detailsList)
        // console.log('pageMeta',pageMeta)
        console.log("summaryList", summaryList);
        this.updateState({
          summaryList,
        });
      });

    this.props
      .getCommonApi(
        `allstocklist/?searchactive=${
          searchFormFields.inactiveItem == false ? "no" : "yes"
        }&searchqty=${
          searchFormFields.inactiveItem == false ? "" : "yes"
        }&searchitemdesc=${searchFormFields.item}&searchdeptdesc=${
          searchFormFields.dept
        }&searchbranddesc=${searchFormFields.brand}&searchrangedesc=${
          searchFormFields.range
        }&searchsitecode=${this.props.tokenDetail.site_code}&limit=2600`
      )
      .then(res => {
        console.log(res, "dsfdfaafg");
        // this.setState({ detailsListFull: [] });
        detailsListFull = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        // pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        // this.setState({ detailsList, pageMeta });
        // this.setState({ detailsList });

        // console.log('res.data',res.data)
        console.log("detailsListFull", detailsListFull);
        // console.log('pageMeta',pageMeta)

        this.setState(
          {
            detailsListFull,
          },
          () => {
            this.handleUpdateTotal();
          }
        );
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

  handleUpdateTotal = () => {
    let { detailsListFull, formFields } = this.state;

    formFields.DOC_AMT = 0;
    formFields.DOC_QTY = 0;

    // console.log("detailsListFull[0].ITEM_COST", typeof detailsListFull[0].ITEM_COST)
    for (let item of detailsListFull) {
      // console.log("item.amount",item.amount,typeof item.amount)
      formFields.DOC_AMT =
        parseFloat(item.ITEM_COST * item.QTY) + formFields.DOC_AMT;
      formFields.DOC_QTY = parseFloat(item.QTY) + formFields.DOC_QTY;
    }

    formFields.DOC_AMT = Math.round(formFields.DOC_AMT * 100) / 100;
    console.log(
      "formFields.DOC_AMT",
      formFields.DOC_AMT,
      typeof formFields.DOC_AMT
    );
    this.setState({ formFields });
  };

  setUOM = UOM_DESC => {
    let { UOM } = this.state;
    UOM = UOM_DESC;
    console.log("UOM in setUOM", UOM);
    this.setState({ UOM });
  };

  handleChangeCheckboxQty = () => {
    let { searchFormFields } = this.state;
    searchFormFields.QtyItem = !searchFormFields.QtyItem;
    this.setState(searchFormFields);
    console.log("searchFormFields.QtyItem", searchFormFields.QtyItem);
  };

  handleChangeCheckboxInactive = () => {
    let { searchFormFields } = this.state;
    searchFormFields.inactiveItem = !searchFormFields.inactiveItem;
    this.setState(searchFormFields);
    console.log("searchFormFields.inactiveItem", searchFormFields.inactiveItem);
  };

  handleMultiSelectBrand = e => {
    let { searchFormFields } = this.state;
    console.log("e", e);

    let tempArr = [];

    for (let key of e) {
      tempArr.push(key.label);
    }
    searchFormFields.brand = tempArr.toString();
    console.log("tempArr", tempArr);
    console.log("searchFormFields.brand", searchFormFields.brand);
    this.setState({
      searchFormFields,
    });
  };

  handleMultiSelectDept = e => {
    let { searchFormFields } = this.state;
    console.log("e", e);

    let tempArr = [];

    for (let key of e) {
      tempArr.push(key.label);
    }
    searchFormFields.dept = tempArr.toString();
    console.log("tempArr", tempArr);
    console.log("searchFormFields.dept", searchFormFields.dept);
    this.setState({
      searchFormFields,
    });
  };

  handleMultiSelectRange = e => {
    let { searchFormFields } = this.state;
    console.log("e", e);

    let tempArr = [];

    for (let key of e) {
      tempArr.push(key.label);
    }
    searchFormFields.range = tempArr.toString();
    console.log("tempArr", tempArr);
    console.log("searchFormFields.range", searchFormFields.range);
    this.setState({
      searchFormFields,
    });
  };

  handleMultiSelectItem = e => {
    let { searchFormFields } = this.state;
    console.log("e", e);

    let tempArr = [];

    for (let key of e) {
      tempArr.push(key.label);
    }
    searchFormFields.item = tempArr.toString();
    console.log("tempArr", tempArr);
    console.log("searchFormFields.item", searchFormFields.item);
    this.setState({
      searchFormFields,
    });
  };

  handleMultiSelectItemSearch = e => {
    let { searchFormFields } = this.state;
    console.log("e", e);

    let tempArr = [];
    let tempArr2 = [];

    for (let key of e) {
      tempArr.push(key.code);
      tempArr2.push(key.label);
    }
    searchFormFields.itemSearch = tempArr.toString();
    searchFormFields.itemSearchDesc = tempArr2.toString();
    console.log("tempArr", tempArr);
    console.log("searchFormFields.itemSearch", searchFormFields.itemSearch);
    console.log(
      "searchFormFields.itemSearchDesc",
      searchFormFields.itemSearchDesc
    );
    this.setState({
      searchFormFields,
    });
  };

  handlePrintPdfFormat = url => {
    this.setState({
      isPrintPdfClick: false,
      isPrintSummaryPdfClick: false,
      isPrintDetailsPdfClick: false,
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
      empOption,
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

    listDetail = {
      DOC_NO: formFields.DOC_NO,
      // "Supplier": formFields.SUPP_Code&&supOption ? supOption.find(option => option.value === formFields.SUPP_Code).label : "",
      CREATE_USER:
        formFields.CREATE_USER && empOption
          ? empOption.find(option => option.value === formFields.CREATE_USER)
              .label
          : "",
      DOC_DATE: formFields.DOC_DATE,
      DOC_REF1: formFields.DOC_REF1,
      DOC_REF2: formFields.DOC_REF2,
      DOC_REMK1: formFields.DOC_REMK1,
      storeName: this.props.tokenDetail.branch,
      printedBy: this.props.tokenDetail.username,
      totalQty: formFields.DOC_QTY,
      totalAmt: formFields.DOC_AMT,
      addr: addr,
    };
    console.log("listDetail in getListDetail", listDetail);

    isPrintPdfClick = true;
    this.setState({ listDetail, isPrintPdfClick });
  };

  getReportSummary = () => {
    let {
      siteAddr,
      reportSummaryList,
      empOption,
      summary,
      searchFormFields,
      isPrintSummaryPdfClick,
    } = this.state;
    let { fromDate, toDate } = searchFormFields;

    if (
      fromDate.getMonth() != toDate.getMonth() ||
      fromDate.getFullYear() != toDate.getFullYear()
    ) {
      console.log("fromDate.getMonth()", fromDate.getMonth());
      console.log("toDateget.Month()", toDate.getMonth());
      console.log("fromDate.getFullYear()", fromDate.getFullYear());
      console.log("toDate.getFullYear()", toDate.getFullYear());
      Toast({
        type: "error",
        message: "Wrong date range, please select within 1 month",
      });

      return;
    }

    let addr = "";

    for (let site of siteAddr) {
      if (site.ItemSite_Code == this.props.tokenDetail.site_code) {
        addr = site.ItemSite_Address;
      }
    }

    summary = {
      // "DOC_NO": formFields.DOC_NO,
      // // "Supplier": formFields.SUPP_Code&&supOption ? supOption.find(option => option.value === formFields.SUPP_Code).label : "",
      // "CREATE_USER": formFields.CREATE_USER&&empOption ? empOption.find(option => option.value === formFields.CREATE_USER).label : "",
      // "DOC_DATE": formFields.DOC_DATE,
      // "DOC_REF1":formFields.DOC_REF1,
      // "DOC_REF2":formFields.DOC_REF2,
      // "DOC_REMK1":formFields.DOC_REMK1,
      storeName: this.props.tokenDetail.branch,
      printedBy: this.props.tokenDetail.username,
      // "totalQty":formFields.DOC_QTY,
      // "totalAmt":formFields.DOC_AMT,
      addr: addr,
      from: dateFormat(searchFormFields.fromDate),
      to: dateFormat(searchFormFields.toDate),
      item: searchFormFields.itemSearchDesc,
    };

    this.setState({ summary });

    let From = new Date();
    if (fromDate && fromDate !== "") {
      From = fromDate;
    } else {
      this.setState({ fromDate: From });
    }
    let To = new Date();
    if (toDate && toDate !== "") {
      To = toDate;
    } else {
      this.setState({ toDate: To });
    }

    this.props
      .getCommonApi(
        `stktrnsummary/?searchfrom=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&searchto=${dateFormat(To, "yyyy-mm-dd")}&searchstoreno=${
          this.props.tokenDetail.site_code
        }&searchitemcode=${searchFormFields.itemSearch}`
      )
      .then(res => {
        // console.log("res.data.dataList", res.data.dataList);
        reportSummaryList = res.data;
        console.log("res.data", res.data);
        console.log("reportSummaryList", reportSummaryList);
        if (!reportSummaryList || reportSummaryList.length == 0) {
          Toast({
            type: "error",
            message: "No data in selected date range",
          });
          return;
        }

        for (let list of reportSummaryList) {
          for (let i = 1; i < 32; i++) {
            let check = list.some(x => x.day === i);
            if (check == false) {
              list.splice(i - 1, 0, { day: i, dayin: 0.0, dayout: 0 });
            }
          }
        }
        console.log("reportSummaryList after transform", reportSummaryList);
        isPrintSummaryPdfClick = true;
        this.setState({ reportSummaryList, isPrintSummaryPdfClick });
      });
  };

  getReportDetails = () => {
    let {
      siteAddr,
      reportDetailsList,
      empOption,
      details,
      searchFormFields,
      isPrintDetailsPdfClick,
    } = this.state;
    let { fromDate, toDate } = searchFormFields;
    let addr = "";

    for (let site of siteAddr) {
      if (site.ItemSite_Code == this.props.tokenDetail.site_code) {
        addr = site.ItemSite_Address;
      }
    }

    details = {
      // "DOC_NO": formFields.DOC_NO,
      // // "Supplier": formFields.SUPP_Code&&supOption ? supOption.find(option => option.value === formFields.SUPP_Code).label : "",
      // "CREATE_USER": formFields.CREATE_USER&&empOption ? empOption.find(option => option.value === formFields.CREATE_USER).label : "",
      // "DOC_DATE": formFields.DOC_DATE,
      // "DOC_REF1":formFields.DOC_REF1,
      // "DOC_REF2":formFields.DOC_REF2,
      // "DOC_REMK1":formFields.DOC_REMK1,
      storeName: this.props.tokenDetail.branch,
      printedBy: this.props.tokenDetail.username,
      // "totalQty":formFields.DOC_QTY,
      // "totalAmt":formFields.DOC_AMT,
      addr: addr,
      from: dateFormat(searchFormFields.fromDate),
      to: dateFormat(searchFormFields.toDate),
      item: searchFormFields.itemSearchDesc,
    };
    console.log("details in details", details);

    this.setState({ details });

    let From = new Date();
    if (fromDate && fromDate !== "") {
      From = fromDate;
    } else {
      this.setState({ fromDate: From });
    }
    let To = new Date();
    if (toDate && toDate !== "") {
      To = toDate;
    } else {
      this.setState({ toDate: To });
    }

    this.props
      .getCommonApi(
        `stktrn/?searchfrom=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&searchto=${dateFormat(To, "yyyy-mm-dd")}&searchstoreno=${
          this.props.tokenDetail.site_code
        }&searchitemcode=${searchFormFields.itemSearch}`
      )
      .then(res => {
        // console.log("res.data.dataList", res.data.dataList);
        reportDetailsList = res.data.dataList;
        console.log("reportDetailsList", reportDetailsList);
        isPrintDetailsPdfClick = true;

        if (!reportDetailsList) {
          Toast({
            type: "error",
            message: "No data in selected date range",
          });
          return;
        }

        function groupBy(array, f) {
          var groups = {};
          array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
          });
          return Object.keys(groups).map(function (group) {
            return groups[group];
          });
        }

        if (reportDetailsList) {
          var reportDetailsList = groupBy(reportDetailsList, function (item) {
            return [item.ITEMCODE, item.Item_UOM];
          });

          for (let list of reportDetailsList) {
            console.log(
              list
                .map(item => item.TRN_QTY)
                .reduce((prev, curr) => prev + curr, 0)
            );
            list.push({
              total: list
                .map(item => item.TRN_QTY)
                .reduce((prev, curr) => prev + curr, 0),
            });
          }
        }

        console.log("reportDetailsList after transform", reportDetailsList);
        this.setState({ reportDetailsList, isPrintDetailsPdfClick });
      });
  };

  render() {
    let {
      formFields,
      searchFormFields,
      statusOption,
      headerDetails,
      headerSelectedDetails,
      disableEdit,
      pageMeta,
      empOption,
      brandOption,
      deptOption,
      rangeOption,
      siteOption,
      itemOption,
      detailsList,
      summaryList,
      headerDetailsSummary,
      isLoading,
      isPrintPdfClick,
      isPrintSummaryPdfClick,
      isPrintDetailsPdfClick,
      listDetail,
      summary,
      details,
      blur,
    } = this.state;

    let {
      DOC_NO,
      DOC_REF1,
      DOC_DATE,
      DOC_REF2,
      DOC_STATUS,
      STORE_NO,
      DOC_REMK1,
      CREATE_USER,
      DOC_AMT,
      DOC_QTY,
    } = formFields;

    let { QtyItem, inactiveItem, fromDate, toDate } = searchFormFields;

    let { t } = this.props;
    return (
      <div className="px-5  create-report">
        <div className="head-label-nav">
          <p
            className="category cursor-pointer"
            onClick={() => history.push(`/admin/inventory`)}
          >
            {t("Stock Report")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} Stock Report`)}
          </p>
        </div>
        <div className="PO-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row mt-5">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Doc No")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={true}
                    placeholder="Auto generated"
                    value={DOC_NO}
                    name="DOC_NO"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("PO No"),
                      DOC_NO,
                      t("required")
                    )}
                  </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Ref1")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={DOC_REF1}
                    name="DOC_REF1"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("Ref1"),
                      DOC_REF1,
                      t("required")
                    )}
                  </div> */}
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Doc Date")}
                </label>
                <div className="input-group-normal">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={DOC_DATE ? new Date(DOC_DATE) : new Date()}
                    name="DOC_DATE"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    // maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Doc Date"),
                    DOC_DATE,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Ref2")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={DOC_REF2}
                    name="DOC_REF2"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("Ref2"),
                      DOC_REF2,
                      t("required")
                    )}
                  </div> */}
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Status")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={statusOption}
                    disabled={disableEdit}
                    value={DOC_STATUS}
                    name="DOC_STATUS"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Status"),
                    DOC_STATUS,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Store Code")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={[
                      { value: 1, label: this.props.tokenDetail.branch },
                    ]}
                    disabled={disableEdit}
                    value={STORE_NO}
                    name="STORE_NO"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Store Code"),
                    STORE_NO,
                    t("required")
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Remarks")}
                </label>
                <div className="input-group-desc">
                  <NormalTextarea
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={DOC_REMK1}
                    name="DOC_REMK1"
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-2 col-12"></div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Created By")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={empOption}
                    disabled={disableEdit}
                    value={CREATE_USER}
                    name="CREATE_USER"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Created By"),
                    CREATE_USER,
                    t("required")
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-12 report-content">
              <div className="py-4">
                <div className="table-container">
                  <div className="row m-0  mb-2">
                    <div className="col-md-4 col-12 filter">
                      <div className="d-flex mb-2">
                        <label className="text-left w-50 text-black common-label-text mr-2  pt-2">
                          {t("From Date")}
                        </label>
                        <div className="input-group">
                          <NormalDateTime
                            onChange={this.handleDatePickSearch}
                            inputcol="p-0 inTime"
                            value={fromDate ? new Date(fromDate) : new Date()}
                            name="fromDate"
                            //className="dob-pick"
                            showYearDropdown={true}
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date(toDate)}
                            showDisabledMonthNavigation
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12 filter ">
                      <div className="d-flex mb-2">
                        <label className="text-left w-50 text-black common-label-text mr-2  pt-2">
                          {t("To Date")}
                        </label>
                        <div className="input-group">
                          <NormalDateTime
                            onChange={this.handleDatePickSearch}
                            inputcol="p-0 inTime"
                            value={toDate ? new Date(toDate) : new Date()}
                            name="toDate"
                            // className="dob-pick"
                            showYearDropdown={true}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date(fromDate)}
                            showDisabledMonthNavigation
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text  mr-3 pt-2">
                          {t("Item")}
                        </label>
                        <div className="input-group">
                          <NormalMultiSelect
                            options={itemOption}
                            // name="dept"
                            handleMultiSelect={this.handleMultiSelectItemSearch}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-5 justify-content-center">
                    <div className="col-md-4 col-12">
                      <NormalButton
                        buttonClass={"mx-2"}
                        mainbg={true}
                        disabled={disableEdit}
                        className="confirm"
                        label="Load Stock Movement Summary PDF"
                        onClick={() => this.getReportSummary()}
                      />
                    </div>

                    <div className="col-md-4 col-12">
                      <NormalButton
                        buttonClass={"mx-2"}
                        mainbg={true}
                        disabled={disableEdit}
                        className="confirm"
                        label="Load Stock Movement Details PDF"
                        onClick={() => this.getReportDetails()}
                      />
                    </div>
                  </div>

                  {/* <div className="row mb-4 justify-content-center">
                <div className="col-md-4 col-12">
                  <NormalButton
                    buttonClass={"mx-2"}
                    mainbg={true}
                    disabled={disableEdit}
                    className="confirm"
                    label="Load Summary"
                    onClick={() =>this.getSummary()}
                  />
                </div>
              </div>

              <TableWrapper
                    headerDetails={headerDetailsSummary}
                    // queryHandler={this.handlePagination}
                    // pageMeta={pageMeta}
                  >
                {summaryList
                  ? summaryList.map((item, index) => {
                      let {
                        total_number_of_doc
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {total_number_of_doc}
                            </div>
                          </td>
                          
                                   
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper> */}

                  <div className="row mb-2">
                    <div className="col-md-4 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text mr-2  pt-2">
                          {t("Dept")}
                        </label>
                        <div className="input-group">
                          <NormalMultiSelect
                            options={deptOption}
                            // name="dept"
                            handleMultiSelect={this.handleMultiSelectDept}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text mr-2  pt-2">
                          {t("Brand")}
                        </label>
                        <div className="input-group">
                          <NormalMultiSelect
                            options={brandOption}
                            className={"pull-right"}
                            // name="dept"
                            handleMultiSelect={this.handleMultiSelectBrand}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text mr-2 pt-2">
                          {t("Range")}
                        </label>
                        <div className="input-group">
                          <NormalMultiSelect
                            options={rangeOption}
                            // name="dept"
                            handleMultiSelect={this.handleMultiSelectRange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-4 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text mr-3  pt-2">
                          {t("Site")}
                        </label>
                        <div className="input-group">
                          <NormalMultiSelect
                            options={[
                              {
                                value: 1,
                                label: this.props.tokenDetail.branch,
                              },
                            ]}
                            // name="dept"
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text  mr-3 pt-2">
                          {t("Item")}
                        </label>
                        <div className="input-group">
                          <NormalMultiSelect
                            options={itemOption}
                            // name="dept"
                            handleMultiSelect={this.handleMultiSelectItem}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text mr-2  pt-2">
                          {t("Show 0 Qty Items")}
                        </label>
                        <div className="pt-2">
                          <NormalCheckbox
                            type="checkbox"
                            checked={QtyItem}
                            name="QtyItem"
                            onChange={this.handleChangeCheckboxQty}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-40 text-black common-label-text mr-2  pt-2">
                          {t("Show Inactive Items")}
                        </label>
                        <div className="pt-2">
                          <NormalCheckbox
                            type="checkbox"
                            checked={inactiveItem}
                            name="inactiveItem"
                            onChange={this.handleChangeCheckboxInactive}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4 justify-content-center">
                    <div className="col-md-4 col-12">
                      <NormalButton
                        buttonClass={"mx-2"}
                        mainbg={true}
                        disabled={disableEdit}
                        className="confirm"
                        label="Load Stock Report Table"
                        onClick={() => this.getDetails()}
                      />
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
                          ITEM_COST,
                          QTY,
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
                            <Blur radius={blur ? "10px" : ""}>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {ITEM_COST}
                                </div>
                              </td>
                            </Blur>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {QTY}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {Math.round(ITEM_COST * QTY * 100) / 100}
                              </div>
                            </td>

                            {/* <td>
                                
                                  <NormalInput
                                    value={item_quantity}
                                    disabled={disableEdit}
                                    name={item_code}
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onChange={this.handleChangeQuantity}
                                  />
                               
                              </td> */}

                            {/* <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalButton
                                    buttonClass={"mx-2"}
                                    disabled={this.props.disableEdit}
                                    mainbg={true}
                                    className="warning"
                                    label="Select"
                                    onClick={() => this.handleSelect(item_code,
                                      Item_Desc,
                                      // brand_itm_desc,
                                      // range_itm_desc,
                                      UOM_DESC,
                                      // ITEM_COST,
                                      QTY,                                             
                                      )}
                                  />
                                </div>
                              </td> */}
                          </tr>
                        );
                      })
                    ) : null}
                  </TableWrapper>

                  <div className="row mt-5"></div>
                  {/* <TableWrapper
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
                            QTY,                                            
                            item_quantity,
                            variance,
                            item_remarks,
                            editing
                          } = item;
                            return (
                              editing==false ?
                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    { item_code }
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    { Item_Desc }
                                  </div>
                                </td>
                                
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { UOM_DESC }
                                </div>
                              </td>
                              
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { QTY }
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { item_quantity }
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { variance }
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { item_remarks }
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
                                      onClick={disableEdit==false ? () =>this.handleEdit(item_code):""}
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
                                      onClick={disableEdit==false ? () =>this.handleRemoveStoredItem(item_code):""}
                                    />
                                  </div>
                                </td>                        
                                        
                              </tr> : 

                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    { item_code }
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    { Item_Desc }
                                  </div>
                                </td>
                                
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { UOM_DESC }
                                </div>
                              </td>
                              
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { QTY }
                                </div>
                              </td>
                              
                                
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    value={item_quantity}
                                    disabled={disableEdit}
                                    name={item_code}
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onChange={this.handleEditChangeQuantity}
                                  />
                                  </div>
                                </td>

                                <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  { variance }
                                </div>
                                </td>

                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    value={item_remarks}
                                    disabled={disableEdit}
                                    name={item_code}
                                    onChange={this.handleEditChangeRemarks}
                                  />
                                  </div>
                                </td>

                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    <img
                                      src={saveBtn}
                                      width="35"
                                      height="35"
                                      alt=""
                                      className="action-img bg-transparent " 
                                      onClick={disableEdit==false ? () =>this.handleSave(item_code):""}
                                      
                                    />
                                  </div>
                                </td>                        
                                      
                              </tr>
                            );
                        })
                      : null}

                    </TableWrapper > */}

                  <div className="row justify-content-end mt-5">
                    <div className="col-4">
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
                      {/* <div>
                            {this.validator.message(
                              t("Total Quantity"),
                              DOC_QTY,
                              t("required")
                            )}
                        </div> */}

                      <div className="d-flex mb-3">
                        <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                          {t("Total Amount")}
                        </label>
                        <Blur radius={blur ? "10px" : ""}>
                          <div className="input-group-address w-100">
                            <NormalInput
                              placeholder="Enter here"
                              disabled={true}
                              value={DOC_AMT}
                              name="DOC_AMT"
                              // onChange={this.handleChangeDetails}
                            />
                          </div>
                        </Blur>
                      </div>
                      {/* <div>
                            {this.validator.message(
                              t("Total Cost"),
                              DOC_AMT,
                              t("required")
                            )}
                        </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-end">
              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  mainbg={true}
                  className="confirm"
                  label="Cancel"
                  outline={false}
                  onClick={() => history.push(`/admin/inventory`)}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2"}
                  disabled={disableEdit}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  onClick={() => this.handleSubmit()}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  disabled={this.props.match.params.id ? disableEdit : true}
                  mainbg={true}
                  className="confirm"
                  label="Post"
                  outline={false}
                  onClick={() => this.handleSubmit(DOC_STATUS)}
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
                      itemDetail={this.state.detailsListFull}
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

              {isPrintSummaryPdfClick ? (
                <PDFDownloadLink
                  document={
                    <SummaryPDF
                      summary={summary}
                      reportSummaryList={this.state.reportSummaryList}
                      // Flag={activeTab !== "detail" ? 3 : 4}
                      landscape={true}
                      blur={blur}
                    />
                  }
                >
                  {({ blob, url, loading, error }) =>
                    !loading && url ? this.handlePrintPdfFormat(url) : null
                  }
                </PDFDownloadLink>
              ) : null}

              {isPrintDetailsPdfClick ? (
                <PDFDownloadLink
                  document={
                    <DetailsPDF
                      details={details}
                      reportDetailsList={this.state.reportDetailsList}
                      // Flag={activeTab !== "detail" ? 3 : 4}
                      landscape={true}
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
      commonDeleteApi,
      updatePO,
      createPO,
      deletePO,
      getTokenDetails,
    },
    dispatch
  );
};

export const AddStockReport = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStockReportClass)
);
