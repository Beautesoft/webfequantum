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
import { Address } from "./address";
import { Details } from "./details";
import { createPO, updatePO, deletePO } from "redux/actions/po";
import { getTokenDetails } from "redux/actions/auth";
import { useLocation } from "react-router-dom";
import { CgOpenCollective } from "react-icons/cg";
import { history } from "helpers";

import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import PDF from "../../StocksPDF/GRN/index";

export class AddStocksGRNClass extends Component {
  state = {
    formFields: {
      DOC_NO: "",
      SUPPLY_NO: "",
      DOC_REF1: "",
      DOC_DATE: new Date(),
      DOC_SHIP: new Date(),
      DOC_REF2: "",
      DOC_STATUS: "",
      DOC_TERM: "",
      STORE_NO: "",
      DOC_REMK1: "",
      CREATE_USER: "",
    },
    statusOption: [],
    countryOption: [],
    stateOption: [],
    cityOption: [],
    siteOption: [],
    empOption: [],
    supOption: [],

    itemListBeforeEdit: [],

    isPrintPdfClick: false,
    listDetail: {},
    siteAddr: [],

    disableEdit: false,
    is_loading: true,
    isMounted: true,
    render: false,

    formFieldsBillingStored: [],
    formFieldsShippingStored: [],
    storedItemListStored: [],
    formFieldsDetailsStored: [],

    active: false,
    currentValue: 0,
    navLinks: [
      { to: this.props.location.pathname, label: "Details", id: "Details" },
      { to: this.props.location.pathname, label: "Address", id: "Address" },
    ],
    selectedMenu: "Details",
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
    this.getStatus();
    this.getCountry();
    this.getState();
    this.getCity();
    this.getSiteCode();
    this.getSup();
    this.getEmp();
    // this.getStatus()
    this.getSiteDetail();

    console.log("this.props", this.props);

    console.log("this.state", this.state);
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

  getEmp = () => {
    let { empOption } = this.state;
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
      this.setState(
        { empOption }
        //   , ()=>{
        //   this.getSup()
        // }
      );
      if (this.props.match.params.id) {
        this.autoFillForm();
      } else {
        this.prefillDefault();
        this.setState({ render: true });
      }
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
          // code: key.itm_code,
          // active: key.itm_isactive,
        });
      }
      console.log("supOption", supOption);
      this.setState({ supOption });
      // , ()=>{

      // this.getDetails();

      // }
      // );
      // if(!this.props.match.params.id){
      //   this.setState({render: true})
      // }
      // if (this.props.match.params.id) {
      //   this.autoFillForm()
      // };
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
    console.log("prefill count");

    this.state.formFields["STORE_NO"] = 1;
    this.setState(this.state.formFields);
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
      this.setState(
        { statusOption }
        //   , () =>{
        //   this.getEmp()

        // }
      );
    });
  };

  getCountry = () => {
    let { countryOption } = this.state;
    countryOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`country`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        countryOption.push({
          value: key.itm_id,
          label: key.itm_desc,
          code: key.itm_code,
          active: key.itm_isactive,
        });
      }
      console.log("countryOption", countryOption);
      this.setState({ countryOption });
    });
  };

  getState = () => {
    let { stateOption } = this.state;
    stateOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`state`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        stateOption.push({
          value: key.itm_id,
          label: key.itm_desc,
          code: key.itm_code,
          active: key.itm_isactive,
        });
      }
      console.log("stateOption", stateOption);
      this.setState({ stateOption });
    });
  };

  getCity = () => {
    let { cityOption } = this.state;
    cityOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`city`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        cityOption.push({
          value: key.itm_id,
          label: key.itm_desc,
          code: key.itm_code,
          active: key.itm_isactive,
        });
      }
      console.log("cityOption", cityOption);
      this.setState({ cityOption });
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
    let { render } = this.state;
    this.props
      .getCommonApi(`grnitem/?searchdocno=${DOC_NO}&limit=10000`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            console.log("no of times in if loop");
            this.state.storedItemListStored.push({
              item_code: item.ITEMCODE,
              Item_Desc: item.ITEMDESC,
              brand_itm_desc: item.itmBrandDesc,
              range_itm_desc: item.itmRangeDesc,
              UOM_DESC: item.DOC_UOMTYPE,
              ITEM_UOM: item.DOC_UOM,
              item_cost: item.DOC_PRICE,
              item_quantity: item.DOC_QTY,
              amount: item.DOC_AMT,
              item_remarks: item.ITEM_REMARK,
              editing: false,
            });
            this.state.itemListBeforeEdit.push({
              item_id: item.DOC_ID,
              item_code: item.ITEMCODE,
              UOM_DESC: item.DOC_UOMTYPE,
            });
          }
          this.setState(this.state.storedItemListStored);
          this.setState(this.state.itemListBeforeEdit);
          console.log(
            "this.state.itemListBeforeEdit",
            this.state.itemListBeforeEdit
          );
        }

        this.setState({ render: true });
      });
  };

  storeAddressFields = (formFieldsBilling, formFieldsShipping) => {
    this.state.formFieldsBillingStored = formFieldsBilling;
    this.state.formFieldsShippingStored = formFieldsShipping;
    // this.state.formFieldsShippingStored = formFieldsShipping
    // this.setState(this.state.formFieldsBillingStored, this.state.formFieldsShippingStored)
    console.log("formFieldsBilling in addquo", formFieldsBilling);
    console.log("formFieldsShipping in addquo", formFieldsShipping);
    console.log(
      "formFieldsBillingStored in addpo",
      this.state.formFieldsBillingStored
    );
    console.log(
      "formFieldsShippingStored in addpo",
      this.state.formFieldsShippingStored
    );
    this.setState(this.state.formFieldsBillingStored);
    this.setState(this.state.formFieldsShippingStored);
  };

  storeItemDetails = (storedItemList, formFields) => {
    this.state.storedItemListStored = storedItemList;
    this.state.formFieldsDetailsStored = formFields;

    console.log("storedItemList in addquo", storedItemList);
    console.log("formFields in addquo", formFields);
    console.log(
      "storedItemListStored in addpo",
      this.state.storedItemListStored
    );
    console.log(
      "formFieldsDetailsStored in addpo",
      this.state.formFieldsDetailsStored
    );
    this.setState(this.state.storedItemListStored);
    this.setState(this.state.formFieldsDetailsStored);
  };

  autoFillForm = () => {
    let { disableEdit, statusOption, empOption, supOption } = this.state;

    this.props
      .getCommonApi(`grnlist/?searchdocid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("grn dataList", res.data.dataList);
        // console.log("quo dataList cust name", res.data.dataList[0].customer_name);
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList
        this.state.formFields["DOC_NO"] = res.data.dataList[0].DOC_NO;
        this.state.formFields["SUPPLY_NO"] = res.data.dataList[0].SUPPLY_NO;
        // if (res.data.dataList[0].SUPPLY_NO && supOption.length!==0) {
        //   //matching status name with the id to set prefill status in dropdown
        //   this.state.formFields["SUPPLY_NO"] = supOption.find(option => option.label === res.data.dataList[0].SUPPLY_NO).value
        //   console.log("res.data.dataList[0].SUPPLY_NO",res.data.dataList[0].SUPPLY_NO)
        // }
        this.state.formFields["DOC_REF1"] = res.data.dataList[0].DOC_REF1;
        this.state.formFields["DOC_DATE"] = res.data.dataList[0].DOC_DATE;
        this.state.formFields["DOC_SHIP"] = res.data.dataList[0].DOC_SHIP;
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
        this.state.formFields["DOC_TERM"] = res.data.dataList[0].DOC_TERM;
        this.state.formFields["STORE_NO"] = 1;
        this.state.formFields["DOC_REMK1"] = res.data.dataList[0].DOC_REMK1;
        if (res.data.dataList[0].CREATE_USER && empOption.length !== 0) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["CREATE_USER"] = empOption.find(
            option => option.label === res.data.dataList[0].CREATE_USER
          ).value;
        }

        this.state.formFieldsDetailsStored.DOC_AMT =
          res.data.dataList[0].DOC_AMT;
        this.state.formFieldsDetailsStored.DOC_QTY =
          res.data.dataList[0].DOC_QTY;

        this.state.formFieldsBillingStored.to = res.data.dataList[0].BNAME;
        this.state.formFieldsBillingStored.address1 =
          res.data.dataList[0].BADDR1;
        this.state.formFieldsBillingStored.address2 =
          res.data.dataList[0].BADDR2;
        this.state.formFieldsBillingStored.address3 =
          res.data.dataList[0].BADDR3;
        this.state.formFieldsBillingStored.postalCode =
          res.data.dataList[0].BPOSTCODE;
        if (res.data.dataList[0].BCITY) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFieldsBillingStored.city = this.state.cityOption.find(
            option => option.label === res.data.dataList[0].BCITY
          ).value;
        }
        if (res.data.dataList[0].BSTATE) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFieldsBillingStored.state =
            this.state.stateOption.find(
              option => option.label === res.data.dataList[0].BSTATE
            ).value;
        }
        if (res.data.dataList[0].BCOUNTRY) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFieldsBillingStored.country =
            this.state.countryOption.find(
              option => option.label === res.data.dataList[0].BCOUNTRY
            ).value;
        }

        // this.state.formFieldsShippingStored.to = res.data.dataList[0].shipto
        this.state.formFieldsShippingStored.address1 =
          res.data.dataList[0].DADDR1;
        this.state.formFieldsShippingStored.address2 =
          res.data.dataList[0].DADDR2;
        this.state.formFieldsShippingStored.address3 =
          res.data.dataList[0].DADDR3;
        this.state.formFieldsShippingStored.postalCode =
          res.data.dataList[0].DPOSTCODE;
        if (res.data.dataList[0].DCITY) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFieldsShippingStored.city = this.state.cityOption.find(
            option => option.label === res.data.dataList[0].DCITY
          ).value;
        }
        if (res.data.dataList[0].DSTATE) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFieldsShippingStored.state =
            this.state.stateOption.find(
              option => option.label === res.data.dataList[0].DSTATE
            ).value;
        }
        if (res.data.dataList[0].DCOUNTRY) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFieldsShippingStored.country =
            this.state.countryOption.find(
              option => option.label === res.data.dataList[0].DCOUNTRY
            ).value;
        }

        console.log(
          "this.state.formFieldsBillingStored in autofillAddr",
          this.state.formFieldsBillingStored
        );
        console.log(
          "this.state.formFieldsShippingStored in autofillAddr",
          this.state.formFieldsShippingStored
        );
        this.setState(this.state.formFieldsBillingStored);
        this.setState(this.state.formFieldsShippingStored);

        this.updateState(this.state.formFields);
        this.setState(this.state.formFieldsDetailsStored);
        console.log("this.state.formFields", this.state.formFields);
        this.getAutofillItemDetails(res.data.dataList[0].DOC_NO);
      });
  };

  handleItemDetailsSubmit = resGRN => {
    let { storedItemListStored, itemListBeforeEdit } = this.state;

    console.log("before delete");
    console.log("storedItemListStored", storedItemListStored);
    console.log("itemListBeforeEdit", itemListBeforeEdit);

    for (let item of itemListBeforeEdit) {
      let found = storedItemListStored.some(
        el => el.item_code === item.item_code && el.UOM_DESC === item.UOM_DESC
      );
      if (!found) {
        this.props.commonDeleteApi(`grnitem/${item.item_id}/`).then(res => {});
      }
    }

    console.log("storedItemListStored in submit", storedItemListStored);
    console.log("resGRN in item sub", resGRN);

    for (let item of storedItemListStored) {
      const formDataItem = new FormData();
      formDataItem.append("ITEMCODE", item.item_code);
      formDataItem.append("ITEMDESC", item.Item_Desc);
      formDataItem.append("DOC_UOMTYPE", item.UOM_DESC);
      formDataItem.append("DOC_UOM", item.ITEM_UOM);
      formDataItem.append("itmBrandDesc", item.brand_itm_desc);
      formDataItem.append("itmRangeDesc", item.range_itm_desc);
      formDataItem.append("DOC_PRICE", item.item_cost);
      formDataItem.append("DOC_QTY", item.item_quantity);
      formDataItem.append("DOC_AMT", item.amount);
      formDataItem.append("ITEM_REMARK", item.item_remarks);

      this.props
        .getCommonApi(
          `grnitem/?searchdocno=${resGRN.data.DOC_NO}&searchitemcode=${item.item_code}&searchuom=${item.UOM_DESC}`
        )
        .then(resGetItem => {
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `grnitem/${resGetItem.data.dataList[0].DOC_ID}/`,
                formDataItem
              )
              .then(resUpdateItem => {
                console.log("resUpdateItem", resUpdateItem);
                history.push(`/admin/inventory`);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("DOC_NO", resGRN.data.DOC_NO);
            this.props
              .commonCreateApi(`grnitem/`, formDataItem)
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
        let {
          formFields,
          statusOption,
          cityOption,
          stateOption,
          countryOption,
          supOption,
          empOption,
          formFieldsDetailsStored,
        } = this.state;
        // let statusValue =""
        // console.log('formFields.status', formFields.status)

        // for (let key of statusOption){
        //   // console.log(key.value)
        //   if(key.value == formFields.status){
        //     statusValue = key.label
        //   }
        // }
        // console.log("statusValue", statusValue)
        const formData = new FormData();
        // formData.append("po_number", formFields.PONumber);
        //check save or post
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
        // formData.append("SUPPLY_NO", formFields.SUPPLY_NO);
        formData.append("SUPPLY_NO", formFields.SUPPLY_NO);
        // ?
        // supOption.find(option => option.value === formFields.SUPPLY_NO).label
        // : "");
        formData.append("DOC_REF1", formFields.DOC_REF1);
        formData.append(
          "DOC_DATE",
          dateFormat(formFields.DOC_DATE) + " 00:00:00"
        );
        formData.append(
          "DOC_SHIP",
          dateFormat(formFields.DOC_SHIP) + " 00:00:00"
        );
        formData.append("DOC_REF2", formFields.DOC_REF2);

        // console.log(statusOption.find(option => option.value === parseInt(formFields.DOC_STATUS)).label)
        formData.append("DOC_TERM", formFields.DOC_TERM);
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
        formData.append(
          "DOC_AMT",
          formFieldsDetailsStored.DOC_AMT ? formFieldsDetailsStored.DOC_AMT : ""
        );
        formData.append(
          "DOC_QTY",
          formFieldsDetailsStored.DOC_QTY ? formFieldsDetailsStored.DOC_QTY : ""
        );

        console.log(
          "this.state.formFieldsBillingStored in submit",
          this.state.formFieldsBillingStored
        );
        formData.append(
          "BNAME",
          this.state.formFieldsBillingStored.to
            ? this.state.formFieldsBillingStored.to
            : ""
        );
        formData.append(
          "BADDR1",
          this.state.formFieldsBillingStored.address1
            ? this.state.formFieldsBillingStored.address1
            : ""
        );
        formData.append(
          "BADDR2",
          this.state.formFieldsBillingStored.address2
            ? this.state.formFieldsBillingStored.address2
            : ""
        );
        formData.append(
          "BADDR3",
          this.state.formFieldsBillingStored.address3
            ? this.state.formFieldsBillingStored.address3
            : ""
        );
        formData.append(
          "BPOSTCODE",
          this.state.formFieldsBillingStored.postalCode
            ? this.state.formFieldsBillingStored.postalCode
            : ""
        );

        // console.log("cityOption.find(option => option.value === this.formFieldsBillingStored.city).label",cityOption.find(option => option.value === parseInt(this.state.formFieldsBillingStored.city)).label)

        formData.append(
          "BCITY",
          this.state.formFieldsBillingStored.city
            ? cityOption.find(
                option =>
                  option.value ===
                  parseInt(this.state.formFieldsBillingStored.city)
              ).label
            : ""
        );

        formData.append(
          "BSTATE",
          this.state.formFieldsBillingStored.state
            ? stateOption.find(
                option =>
                  option.value ===
                  parseInt(this.state.formFieldsBillingStored.state)
              ).label
            : ""
        );

        formData.append(
          "BCOUNTRY",
          this.state.formFieldsBillingStored.country
            ? countryOption.find(
                option =>
                  option.value ===
                  parseInt(this.state.formFieldsBillingStored.country)
              ).label
            : ""
        );

        // formData.append("shipto", this.state.formFieldsShippingStored.to);
        formData.append(
          "DADDR1",
          this.state.formFieldsShippingStored.address1
            ? this.state.formFieldsShippingStored.address1
            : ""
        );
        formData.append(
          "DADDR2",
          this.state.formFieldsShippingStored.address2
            ? this.state.formFieldsShippingStored.address2
            : ""
        );
        formData.append(
          "DADDR3",
          this.state.formFieldsShippingStored.address3
            ? this.state.formFieldsShippingStored.address3
            : ""
        );
        formData.append(
          "DPOSTCODE",
          this.state.formFieldsShippingStored.postalCode
            ? this.state.formFieldsShippingStored.postalCode
            : ""
        );

        formData.append(
          "DCITY",
          this.state.formFieldsShippingStored.city
            ? cityOption.find(
                option =>
                  option.value ===
                  parseInt(this.state.formFieldsShippingStored.city)
              ).label
            : ""
        );

        formData.append(
          "DSTATE",
          this.state.formFieldsShippingStored.state
            ? stateOption.find(
                option =>
                  option.value ===
                  parseInt(this.state.formFieldsShippingStored.state)
              ).label
            : ""
        );

        formData.append(
          "DCOUNTRY",
          this.state.formFieldsShippingStored.country
            ? countryOption.find(
                option =>
                  option.value ===
                  parseInt(this.state.formFieldsShippingStored.country)
              ).label
            : ""
        );

        console.log("formData", formData);
        if (this.props.match.params.id) {
          console.log("in if loop");
          console.log("this.props.match.params.id", this.props.match.params.id);
          var resGRN = await this.props.commonUpdateApi(
            `grnlist/${this.props.match.params.id}/`,
            formData
          );

          // console.log(resPO);
          // this.handleAddressSubmit(resPO);
          // this.handleItemDetailsSubmit(resPO);
          // if(statusValue == "Void"){
          //   console.log("in void loop")
          //   await this.props.deletePO(`${this.props.match.params.id}/`)
          // }

          this.handleItemDetailsSubmit(resGRN);
          history.push(`/admin/inventory`);
        } else {
          console.log("this.props before createPO", this.props);
          var resGRN = await this.props.commonCreateApi(`grnlist/`, formData);

          console.log("resGRN in createresGRN", resGRN);
          // console.log("resPO.data.id",resPO.data.id)

          // this.handleAddressSubmit(resGRN);
          this.handleItemDetailsSubmit(resGRN);
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
      formFieldsDetailsStored,
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
      Supplier:
        formFields.SUPPLY_NO && supOption
          ? supOption.find(option => option.value === formFields.SUPPLY_NO)
              .label
          : "",
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
      totalQty: formFieldsDetailsStored.DOC_QTY,
      totalAmt: formFieldsDetailsStored.DOC_AMT,
      addr: addr,
    };
    console.log("listDetail in getListDetail", listDetail);

    isPrintPdfClick = true;
    this.setState({ listDetail, isPrintPdfClick });
  };

  render() {
    let {
      formFields,
      statusOption,
      currentValue,
      navLinks,
      disableEdit,

      siteOption,
      empOption,
      supOption,
      render,
      isPrintPdfClick,
      listDetail,
    } = this.state;

    let {
      DOC_NO,
      SUPPLY_NO,
      DOC_REF1,
      DOC_DATE,
      DOC_SHIP,
      DOC_REF2,
      DOC_STATUS,
      DOC_TERM,
      STORE_NO,
      DOC_REMK1,
      CREATE_USER,
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5  create-GRN">
        <div className="head-label-nav">
          <p
            className="category cursor-pointer"
            onClick={() => history.push(`/admin/inventory`)}
          >
            {t("Stocks GRN")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} Stocks GRN`)}
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
                      PONumber,
                      t("required")
                    )}
                  </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Supplier No")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={supOption}
                    disabled={disableEdit}
                    value={SUPPLY_NO}
                    name="SUPPLY_NO"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Supplier"),
                    SUPPLY_NO,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("GR Ref1")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={disableEdit}
                    placeholder="Enter here"
                    value={DOC_REF1}
                    name="DOC_REF1"
                    onChange={this.handleChange}
                  />
                </div>
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
                  {t("Delivery Date")}
                </label>
                <div className="input-group-normal">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={DOC_SHIP ? new Date(DOC_SHIP) : new Date()}
                    name="DOC_SHIP"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    // maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Delivery Date"),
                    DOC_SHIP,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("GR Ref2")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={disableEdit}
                    placeholder="Enter here"
                    value={DOC_REF2}
                    name="DOC_REF2"
                    onChange={this.handleChange}
                  />
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
                    value={DOC_STATUS}
                    name="DOC_STATUS"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("Status"),
                      DOC_STATUS,
                      t("required")
                    )}
                  </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Term")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={disableEdit}
                    placeholder="Enter here"
                    value={DOC_TERM}
                    name="DOC_TERM"
                    onChange={this.handleChange}
                  />
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

            <div className="col-md-12 GRN-content">
              <div className="tab-menus">
                <ul>
                  {navLinks.map(({ to, label, id }, index) => (
                    <li key={index}>
                      <NavLink to={to} className="nav-link">
                        <div
                          className={`sidebar-menu ${
                            currentValue === index ? "active" : ""
                          }`}
                          onClick={() =>
                            this.handleClick({ key: index, id: id })
                          }
                        >
                          <span className="sidebar-menu-desc">{t(label)}</span>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
              {this.state.selectedMenu === "Details" && render == true && (
                <Details
                  disableEdit={disableEdit}
                  grnId={this.props.match.params.id}
                  validator={this.validator}
                  storeItemDetails={this.storeItemDetails.bind(this)}
                  storedItemListStored={this.state.storedItemListStored}
                  formFieldsDetailsStored={this.state.formFieldsDetailsStored}
                  id={this.state.selectedMenu}
                  // search={formFields.search}
                  api={"details"}
                />
              )}
              {this.state.selectedMenu === "Address" && (
                <Address
                  disableEdit={disableEdit}
                  storeAddressFields={this.storeAddressFields.bind(this)}
                  formFieldsBillingStored={this.state.formFieldsBillingStored}
                  formFieldsShippingStored={this.state.formFieldsShippingStored}
                  id={this.state.selectedMenu}
                  // search={formFields.search}
                  api={"address"}
                />
              )}
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
                  mainbg={true}
                  disabled={disableEdit}
                  className="confirm"
                  label="Save"
                  onClick={() => this.handleSubmit()}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  mainbg={true}
                  disabled={this.props.match.params.id ? disableEdit : true}
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
                      itemDetail={this.state.storedItemListStored}
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

export const AddStocksGRN = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStocksGRNClass)
);
