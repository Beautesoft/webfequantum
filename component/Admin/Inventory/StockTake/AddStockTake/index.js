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
import { Toast } from "service/toast";
import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import PDF from "../../StocksPDF/StockTake/index";
import Blur from "react-css-blur";

export class AddStockTakeClass extends Component {
  state = {
    formFields: {
      PHY_NO: "",
      PHY_REF: "",
      PHY_DATE: new Date(),
      STAFF_NAME: "",
      PHY_STATUS: "",
      STORE_NO: "",
      PHY_REMK1: "",
      PHY_TTLQTY: "",
      PHY_COUNTQTY: "",
    },

    headerDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Brand" },
      { label: "Range" },
      { label: "UOM" },
      { label: "Unit Cost" },
      { label: "On Hand Qty" },
      { label: "Counted Qty" },

      { label: "" },
    ],
    headerSelectedDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "UOM" },
      { label: "On Hand Qty" },
      { label: "Counted Qty" },
      ,
      { label: "Variance" },
      { label: "Remarks" },
      { label: "" },
      { label: "" },
    ],

    searchFormFields: {
      dept: "",
      site: "",
      brand: "",
      item: "",
      range: "",
      // date:new Date(),
      QtyItem: false,
      inactiveItem: false,
    },

    UOM: "",

    listDetail: {},
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

    storedItemList: [],
    itemListBeforeEdit: [],
    pageMeta: {},

    active: false,
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
    // if (this.props.location.state){
    //   if(this.props.location.state.projectFk){
    //     this.state.fkProject = this.props.location.state.projectFk
    //     this.setState({fkProject : this.state.fkProject})
    //     console.log("this.props.location.state.projectFk",this.props.location.state.projectFk)
    //     console.log("this.state.fkProject",this.state.fkProject)
    //   }

    // this.state.fkQuotation = this.props.location.state.quoId
    // this.setState({fkQuotation : this.state.fkQuotation})

    // console.log("this.props.location.state.quoId",this.props.location.state.quoId)
    // console.log("this.state.fkQuotation",this.state.fkQuotation)
    // }

    console.log("this.props", this.props);

    console.log("this.state", this.state);
    // console.log("useLocation()",useLocation())
    this.getStatus();

    // this.getSup()

    this.getBrand();
    this.getDept();
    this.getRange();
    this.getSiteCode();
    this.getSiteDetail();

    this.handleUpdateTotal();
  };

  // componentDidUpdate(prevProps) {
  //   // Typical usage (don't forget to compare props):
  //   if (this.props.tokenDetail !== prevProps.tokenDetail) {
  //     // this.fetchData(this.props.siteGstList);
  //     this.getItem()
  //   }
  // }

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
        this.getDetails();
        this.getItem();
        if (this.props.match.params.id) {
          this.autoFillForm();
        } else {
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
      this.state.formFields["STAFF_NAME"] = empOption.find(
        option => option.label === this.props.tokenDetail.username
      ).value;
    }
    if (statusOption.length !== 0) {
      //matching status name with the id to set prefill status in dropdown
      this.state.formFields["PHY_STATUS"] = statusOption.find(
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

  getAutofillItemDetails = PHY_NO => {
    this.props
      .getCommonApi(`stocktakeitem/?searchphyno=${PHY_NO}&limit=10000`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            this.state.storedItemList.push({
              item_code: item.ITEMCODE,
              Item_Desc: item.ITEMDESC,
              UOM_DESC: item.PHY_UOMTYPE,
              ITEM_UOM: item.PHY_UOM,
              QTY: item.PHY_QTY,
              item_quantity: item.PHY_COUNTQTY,
              variance: item.PHY_VARIANCE,
              item_remarks: item.PHY_REMARK,
              editing: false,
            });
            this.state.itemListBeforeEdit.push({
              item_id: item.PHY_ID,
              item_code: item.ITEMCODE,
              UOM_DESC: item.PHY_UOMTYPE,
            });
          }
          this.setState(this.state.storedItemList);
          this.setState(this.state.itemListBeforeEdit);
        }
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
      .getCommonApi(`stocktakelist/?searchphyid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("adj dataList", res.data.dataList);

        this.state.formFields["PHY_NO"] = res.data.dataList[0].PHY_NO;
        // this.state.formFields["SUPPLY_NO"] = res.data.dataList[0].SUPPLY_NO

        this.state.formFields["PHY_REF"] = res.data.dataList[0].PHY_REF;
        this.state.formFields["PHY_DATE"] = res.data.dataList[0].PHY_DATE;

        // this.state.formFields["STAFF_NO"] = res.data.dataList[0].STAFF_NO
        if (res.data.dataList[0].STAFF_NAME && empOption.length !== 0) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["STAFF_NAME"] = empOption.find(
            option => option.label === res.data.dataList[0].STAFF_NAME
          ).value;
        }

        console.log("statusOption in prefill", this.state.statusOption);
        console.log(
          "res.data.dataList[0].status",
          res.data.dataList[0].PHY_STATUS
        );
        // if status empty prevent err
        if (res.data.dataList[0].PHY_STATUS && statusOption.length !== 0) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["PHY_STATUS"] = statusOption.find(
            option => option.label === res.data.dataList[0].PHY_STATUS
          ).value;
          console.log(
            "res.data.dataList[0].PHY_STATUS",
            res.data.dataList[0].PHY_STATUS
          );
          if (res.data.dataList[0].PHY_STATUS == "Posted") {
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
        this.state.formFields["PHY_REMK1"] = res.data.dataList[0].PHY_REMK1;
        // if (res.data.dataList[0].STAFF_NO && empOption.length!==0) {
        //   //matching status name with the id to set prefill status in dropdown
        //   this.state.formFields["STAFF_NO"] = empOption.find(option => option.label === res.data.dataList[0].STAFF_NO).value
        // }

        this.state.formFields["PHY_TTLQTY"] = res.data.dataList[0].PHY_TTLQTY;
        this.state.formFields["PHY_COUNTQTY"] =
          res.data.dataList[0].PHY_COUNTQTY;

        this.updateState(this.state.formFields);
        console.log("this.state.formFields", this.state.formFields);
        this.getAutofillItemDetails(res.data.dataList[0].PHY_NO);
      });
  };

  handleItemDetailsSubmit = resTAKE => {
    let { storedItemList, itemListBeforeEdit } = this.state;

    for (let item of itemListBeforeEdit) {
      let found = storedItemList.some(
        el => el.item_code === item.item_code && el.UOM_DESC === item.UOM_DESC
      );
      if (!found) {
        this.props
          .commonDeleteApi(`stocktakeitem/${item.item_id}/`)
          .then(res => {});
      }
    }

    for (let item of storedItemList) {
      const formDataItem = new FormData();
      formDataItem.append("ITEMCODE", item.item_code);
      formDataItem.append("ITEMDESC", item.Item_Desc);
      formDataItem.append("PHY_UOM", item.ITEM_UOM);
      formDataItem.append("PHY_UOMTYPE", item.UOM_DESC);
      formDataItem.append("PHY_QTY", item.QTY);
      formDataItem.append("PHY_COUNTQTY", item.item_quantity);
      formDataItem.append("PHY_VARIANCE", item.variance);
      formDataItem.append("PHY_REMARK", item.item_remarks);
      formDataItem.append("STORE_NO", this.props.tokenDetail.site_code);

      this.props
        .getCommonApi(
          `stocktakeitem/?searchphyno=${resTAKE.data.PHY_NO}&searchitemcode=${item.item_code}&searchuom=${item.UOM_DESC}`
        )
        .then(resGetItem => {
          console.log("resGetItem", resGetItem);
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `stocktakeitem/${resGetItem.data.dataList[0].PHY_ID}/`,
                formDataItem
              )
              .then(resUpdateItem => {
                console.log("resUpdateItem", resUpdateItem);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("PHY_NO", resTAKE.data.PHY_NO);
            this.props
              .commonCreateApi(`stocktakeitem/`, formDataItem)
              .then(resCreateItem => {
                console.log("resCreateItem", resCreateItem);
              });
          }
        });
    }
  };

  handleSubmit = async PHY_STATUS => {
    try {
      if (this.validator.allValid()) {
        let { formFields, statusOption, empOption } = this.state;

        const formData = new FormData();

        formData.append("PHY_REF", formFields.PHY_REF);
        formData.append(
          "PHY_DATE",
          dateFormat(formFields.PHY_DATE) + " 00:00:00"
        );
        formData.append(
          "STAFF_NO",
          formFields.STAFF_NAME
            ? empOption.find(
                option => option.value === parseInt(formFields.STAFF_NAME)
              ).code
            : ""
        );

        if (PHY_STATUS) {
          formData.append("PHY_STATUS", "Posted");
        } else {
          formData.append(
            "PHY_STATUS",
            formFields.PHY_STATUS
              ? statusOption.find(
                  option => option.value === parseInt(formFields.PHY_STATUS)
                ).label
              : ""
          );
        }

        // console.log(statusOption.find(option => option.value === parseInt(formFields.DOC_STATUS)).label)

        // formData.append("STORE_NO", formFields.STORE_NO);
        formData.append("STORE_NO", this.props.tokenDetail.site_code);
        formData.append("PHY_REMK1", formFields.PHY_REMK1);

        formData.append(
          "STAFF_NAME",
          formFields.STAFF_NAME
            ? empOption.find(
                option => option.value === parseInt(formFields.STAFF_NAME)
              ).label
            : ""
        );

        formData.append("PHY_TTLQTY", formFields.PHY_TTLQTY);
        formData.append("PHY_COUNTQTY", formFields.PHY_COUNTQTY);

        console.log("formData", formData);
        if (this.props.match.params.id) {
          console.log("in if loop");
          console.log("this.props.match.params.id", this.props.match.params.id);
          var resTAKE = await this.props.commonUpdateApi(
            `stocktakelist/${this.props.match.params.id}/`,
            formData
          );

          console.log(resTAKE);
          // this.handleAddressSubmit(resTAKE);
          this.handleItemDetailsSubmit(resTAKE);
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
          // var resTAKE = await this.props.createPO(formData);

          var resTAKE = await this.props.commonCreateApi(
            `stocktakelist/`,
            formData
          );

          console.log("resTAKE in createPO", resTAKE);
          console.log("resTAKE.data.id", resTAKE.data.id);

          // this.handleAddressSubmit(resTAKE);
          this.handleItemDetailsSubmit(resTAKE);
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
    let { detailsList, pageMeta, page, limit, search, searchFormFields } =
      this.state;
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

  handleSelect = (
    item_code,
    Item_Desc,
    UOM_DESC,
    ITEM_UOM,
    QTY,
    item_quantity
  ) => {
    let { storedItemList, detailsList, formFields } = this.state;
    // console.log("item_code", item_code)
    // console.log("Item_Desc", Item_Desc)
    // console.log("ITEM_COST", ITEM_COST)

    for (let item of storedItemList) {
      if (item.item_code == item_code && item.UOM_DESC == UOM_DESC) {
        Toast({
          type: "error",
          message: "This item already exists",
        });
        return;
      }
    }

    if (!item_quantity) {
      Toast({
        type: "error",
        message: "Counted Qty is empty!",
      });
      return;
    }

    storedItemList.push({
      item_code: item_code,
      Item_Desc: Item_Desc,
      UOM_DESC: UOM_DESC,
      ITEM_UOM: ITEM_UOM,
      QTY: QTY,
      item_quantity: item_quantity,
      variance: item_quantity - QTY,
      item_remarks: "",
      editing: false,
    });

    console.log("storedItemList", storedItemList);
    this.setState({ storedItemList });
    this.handleUpdateTotal();
    // this.props.storeItemDetails(storedItemList, formFields)
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
    // this.props.storeItemDetails(storedItemList, formFields)
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
    // this.props.storeItemDetails(storedItemList, formFields)
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
        storedItemList[list].variance = value - storedItemList[list].QTY;
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

    formFields.PHY_TTLQTY = 0;
    formFields.PHY_COUNTQTY = 0;

    for (let item of storedItemList) {
      formFields.PHY_TTLQTY = parseInt(item.QTY) + formFields.PHY_TTLQTY;
      formFields.PHY_COUNTQTY =
        parseInt(!item.item_quantity ? 0 : item.item_quantity) +
        formFields.PHY_COUNTQTY;
    }
    console.log("storedItemList in update total", storedItemList);
    // formFields.DOC_AMT = Math.round(formFields.DOC_AMT * 100) / 100
    // console.log("formFields.DOC_AMT",formFields.DOC_AMT, typeof formFields.DOC_AMT)
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
      PHY_NO: formFields.PHY_NO,
      // "Supplier": formFields.SUPP_Code&&supOption ? supOption.find(option => option.value === formFields.SUPP_Code).label : "",
      STAFF_NAME:
        formFields.STAFF_NAME && empOption
          ? empOption.find(option => option.value === formFields.STAFF_NAME)
              .label
          : "",
      PHY_DATE: formFields.PHY_DATE,
      PHY_REF: formFields.PHY_REF,

      PHY_REMK1: formFields.PHY_REMK1,
      storeName: this.props.tokenDetail.branch,
      printedBy: this.props.tokenDetail.username,
      totalQty: formFields.PHY_TTLQTY,
      totalCountedQty: formFields.PHY_COUNTQTY,
      addr: addr,
    };
    console.log("listDetail in getListDetail", listDetail);

    isPrintPdfClick = true;
    this.setState({ listDetail, isPrintPdfClick });
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
      storedItemList,
      isLoading,
      isPrintPdfClick,
      listDetail,
      blur,
    } = this.state;

    let {
      PHY_NO,
      PHY_REF,
      PHY_DATE,
      STAFF_NAME,
      PHY_STATUS,
      STORE_NO,
      PHY_REMK1,
      PHY_TTLQTY,
      PHY_COUNTQTY,
    } = formFields;

    let { QtyItem, inactiveItem } = searchFormFields;

    let { t } = this.props;
    return (
      <div className="px-5  create-stocktake">
        <div className="head-label-nav">
          <p
            className="category cursor-pointer"
            onClick={() => history.push(`/admin/inventory`)}
          >
            {t("Stock Take")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} Stock Take`)}
          </p>
        </div>
        <div className="PO-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row mt-5">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Phy No")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={true}
                    placeholder="Auto generated"
                    value={PHY_NO}
                    name="PHY_NO"
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
                  {t("Ref")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={PHY_REF}
                    name="PHY_REF"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("Ref"),
                      PHY_REF,
                      t("required")
                    )}
                  </div> */}
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Phy Date")}
                </label>
                <div className="input-group-normal">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={PHY_DATE ? new Date(PHY_DATE) : new Date()}
                    name="PHY_DATE"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    // maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Phy Date"),
                    PHY_DATE,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Created By")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={empOption}
                    disabled={disableEdit}
                    value={STAFF_NAME}
                    name="STAFF_NAME"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Created By"),
                    STAFF_NAME,
                    t("required")
                  )}
                </div>
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Status")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={statusOption}
                    disabled={disableEdit}
                    value={PHY_STATUS}
                    name="PHY_STATUS"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Status"),
                    PHY_STATUS,
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
                    value={PHY_REMK1}
                    name="PHY_REMK1"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 stocktake-content">
              <div className="py-4">
                <div className="table-container">
                  {/* <div className="row">
                    <div className="col-8"></div>

                    <div className='col-4 mb-3'>
                      <div className="w-100">
                        <InputSearch
                          placeholder="Search Item"
                          onChange={this.handlesearch}
                        />
                      </div>

                    </div>
                  </div> */}

                  <div className="row mb-2">
                    <div className="col-md-4 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-30 text-black common-label-text mr-2  pt-2">
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
                        <label className="text-left w-30 text-black common-label-text mr-2  pt-2">
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
                        <label className="text-left w-30 text-black common-label-text mr-2 pt-2">
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
                        <label className="text-left w-30 text-black common-label-text mr-3  pt-2">
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
                        <label className="text-left w-30 text-black common-label-text  mr-2 pt-2">
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
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-2 col-12">
                      <div className="d-flex mb-2">
                        <label className="text-left w-30 text-black common-label-text mr-2  pt-2">
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
                        <label className="text-left w-30 text-black common-label-text mr-2  pt-2">
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

                    <div className="col-md-4 col-12 ">
                      <NormalButton
                        buttonClass={"mx-2"}
                        mainbg={true}
                        className="confirm"
                        label="Load Stock Take Table"
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
                          ITEM_UOM,
                          ITEM_COST,
                          QTY,
                          item_quantity,
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
                              {/* <div className="input-group"> */}
                              <NormalInput
                                value={item_quantity}
                                disabled={disableEdit}
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
                                      // brand_itm_desc,
                                      // range_itm_desc,
                                      UOM_DESC,
                                      ITEM_UOM,
                                      QTY,
                                      item_quantity
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
                            UOM_DESC,
                            QTY,
                            item_quantity,
                            variance,
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
                                  {UOM_DESC}
                                </div>
                              </td>

                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {QTY}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {item_quantity}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {variance}
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
                                      disableEdit == false
                                        ? () =>
                                            this.handleEdit(item_code, UOM_DESC)
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
                                      disableEdit == false
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
                                  {UOM_DESC}
                                </div>
                              </td>

                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {QTY}
                                </div>
                              </td>

                              {/* <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    value={item_cost}
                                    disabled={this.props.disableEdit}
                                    name={item_code}
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key) && !/\./.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onChange={this.handleEditChangePrice}
                                  />
                                  </div>
                                </td> */}

                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    value={item_quantity}
                                    disabled={disableEdit}
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
                                  {variance}
                                </div>
                              </td>

                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <NormalInput
                                    value={item_remarks}
                                    disabled={disableEdit}
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
                                      disableEdit == false
                                        ? () =>
                                            this.handleSave(item_code, UOM_DESC)
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
                      <div className="d-flex mb-3">
                        <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                          {t("Total Quantity")}
                        </label>
                        <div className="input-group-address w-100">
                          <NormalInput
                            placeholder="Enter here"
                            disabled={true}
                            value={PHY_TTLQTY}
                            name="PHY_TTLQTY"
                            // onChange={this.handleChangeDetails}
                          />
                        </div>
                      </div>
                      {/* <div>
                            {this.validator.message(
                              t("Total Quantity"),
                              PHY_TTLQTY,
                              t("required")
                            )}
                        </div> */}

                      <div className="d-flex mb-3">
                        <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                          {t("Total Counted Quantity")}
                        </label>
                        <div className="input-group-address w-100">
                          <NormalInput
                            placeholder="Enter here"
                            disabled={true}
                            value={PHY_COUNTQTY}
                            name="PHY_COUNTQTY"
                            // onChange={this.handleChangeDetails}
                          />
                        </div>
                      </div>
                      {/* <div>
                            {this.validator.message(
                              t("Total Cost"),
                              PHY_COUNTQTY,
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
                  onClick={() => this.handleSubmit(PHY_STATUS)}
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

export const AddStockTake = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStockTakeClass)
);
