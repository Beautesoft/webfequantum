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
import PDF from "../../StocksPDF/DO/index";
import Blur from "react-css-blur";

export class AddStocksDOClass extends Component {
  state = {
    formFields: {
      DO_NO: "",
      SUPP_Code: "",
      DO_DATE: new Date(),
      contactPerson: "",
      DO_STATUS: "",
      ItemSite_Code: "",
      DO_REMK1: "",
      terms: "",
      DO_TTQTY: "",
      DO_TTAMT: "",
    },

    //item table
    headerDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "UOM" },
      { label: "Brand" },
      { label: "Unit Price" },
      { label: "Stock Qty" },
      { label: "MOQ Qty" },
      { label: "Range" },
      { label: "Req Qty" },

      { label: "" },
    ],
    // selected item table
    headerSelectedDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "UOM" },
      { label: "Unit Price" },
      { label: "Stock Qty" },

      { label: "Required Qty" },
      { label: "Delivery Qty" },
      { label: "" },
      { label: "" },
    ],

    listDetail: {},
    isPrintPdfClick: false,
    siteAddr: [],

    hqonly: 0,

    UOM: "",
    fkProject: "",
    fkQuotation: "",
    statusOption: [],
    contactOption: [],
    supOption: [],
    stateOption: [],
    cityOption: [],

    detailsList: [],
    storedItemList: [],
    itemListBeforeEdit: [],
    pageMeta: {},

    disableEdit: false,
    is_loading: true,
    isMounted: true,

    blur: false,

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

    this.handleUpdateTotal();
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
        // for (var i = 0; i < statusOption.length; i++){
        //   if(statusOption[i].label == "Posted") {
        //     statusOption.splice(i,1)
        //   }
        // }
        for (let item of statusOption) {
          if (item.label == "Open") {
            statusOption = [item];
          }
        }
      }
      console.log("statusOption", statusOption);
      this.setState({ statusOption }, () => {
        this.getContact();
      });
    });
  };

  getContact = () => {
    let { contactOption } = this.state;
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
      this.setState({ contactOption }, () => {
        this.getSup();
      });
    });
  };

  getSup = () => {
    let { supOption, blur } = this.state;
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
          // active: key.itm_isactive,
        });
      }
      console.log("supOption", supOption);
      this.setState({ supOption }, () => {
        this.getDetails();
        console.log(
          "this.props.tokenDetail.site_code in getSup",
          this.props.tokenDetail.site_code
        );
        this.getSiteDetail(this.props.tokenDetail.site_code);
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
    let { disableEdit, statusOption, contactOption, supOption } = this.state;

    // if (contactOption.length!==0) {
    //   //matching status name with the id to set prefill status in dropdown
    //   this.state.formFields["contactPerson"] = contactOption.find(option => option.label === this.props.tokenDetail.username).value
    // }
    if (statusOption.length !== 0) {
      //matching status name with the id to set prefill status in dropdown
      this.state.formFields["DO_STATUS"] = statusOption.find(
        option => option.label === "Open"
      ).value;
    }

    this.state.formFields["ItemSite_Code"] = 1;
    this.setState(this.state.formFields);
  };

  getSiteDetail = ItemSite_Code => {
    let { siteAddr, hqonly } = this.state;
    siteAddr = [];
    this.props.getCommonApi(`sitecode`).then(res => {
      console.log("res.data", res);
      siteAddr = res.data;
      console.log("siteAddr", siteAddr);
      this.setState({ siteAddr });

      for (let item of res.data) {
        if (item.ItemSite_Code == ItemSite_Code) {
          hqonly = item.hq_only;
        }
      }
      console.log("hqonly", hqonly);

      this.setState({ hqonly });
    });
  };

  getAutofillItemDetails = DO_NO => {
    console.log("DO_NO", DO_NO);
    this.props
      .getCommonApi(`doitem/?searchdono=${DO_NO}&limit=10000`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            this.props
              .getCommonApi(
                `allstocklist/?searchitemdesc=${item.DOD_ITEMDESC}&searchsitecode=${this.props.tokenDetail.site_code}&limit=100`
              )
              .then(resAll => {
                console.log(resAll, "dsfdfaafg");
                // this.setState({ detailsListFull: [] });
                for (let data of resAll.data.dataList) {
                  console.log("data.Item_Desc", data.Item_Desc);
                  console.log("item.DOD_ITEMDESC", item.DOD_ITEMDESC);
                  console.log("data.UOM_DESC", data.UOM_DESC);
                  console.log("item.BrandName", item.BrandName);
                  if (
                    data.Item_Desc == item.DOD_ITEMDESC &&
                    data.UOM_DESC == item.BrandName
                  ) {
                    console.log("in if loop");
                    this.state.storedItemList.push({
                      item_code: item.DOD_ITEMCODE,
                      Item_Desc: item.DOD_ITEMDESC,
                      ITEM_UOM: item.BrandCode,
                      UOM_DESC: item.BrandName,
                      ITEM_COST: item.DOD_ITEMPRICE,
                      QTY: data.QTY,
                      DOD_POSTQTY: item.DOD_POSTQTY,
                      item_quantity: item.DOD_QTY,
                      amount: item.DOD_AMT,
                      editing: false,
                    });
                    this.state.itemListBeforeEdit.push({
                      item_id: item.DO_ID,
                      item_code: item.DOD_ITEMCODE,
                      UOM_DESC: item.BrandName,
                    });
                  }
                }
                this.setState(this.state.storedItemList);
                this.setState(this.state.itemListBeforeEdit);
                console.log(
                  "this.state.itemListBeforeEdit",
                  this.state.itemListBeforeEdit
                );
                // console.log('res.data',res.data)
                // console.log('detailsListFull',detailsListFull)
                // console.log('pageMeta',pageMeta)
              });
          }
        }
      });
  };

  autoFillForm = () => {
    let { disableEdit, statusOption, contactOption, supOption } = this.state;

    this.props
      .getCommonApi(`dolist/?searchdoid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("po dataList", res.data.dataList);
        // console.log("quo dataList cust name", res.data.dataList[0].customer_name);
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList
        this.state.formFields["DO_NO"] = res.data.dataList[0].DO_NO;
        this.state.formFields["SUPP_Code"] = res.data.dataList[0].SUPP_Code;

        // if (res.data.dataList[0].SUPP_Code && supOption.length!==0) {
        //   //matching status name with the id to set prefill status in dropdown
        //   this.state.formFields["SUPP_Code"] = supOption.find(option => option.label === res.data.dataList[0].SUPP_Code).value
        //   console.log("res.data.dataList[0].SUPP_Code",res.data.dataList[0].SUPP_Code)
        // }
        // this.state.formFields["SUPP_Code"] = res.data.dataList[0].SUPP_Code
        this.state.formFields["DO_DATE"] = res.data.dataList[0].DO_DATE;

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

        // console.log("statusOption in prefill",this.state.statusOption)
        // console.log("res.data.dataList[0].status",res.data.dataList[0].status)
        // if status empty prevent err
        if (res.data.dataList[0].DO_STATUS && statusOption.length !== 0) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["DO_STATUS"] = statusOption.find(
            option => option.label === res.data.dataList[0].DO_STATUS
          ).value;
          console.log(
            "res.data.dataList[0].DO_STATUS",
            res.data.dataList[0].DO_STATUS
          );
          if (res.data.dataList[0].DO_STATUS == "Posted") {
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
        this.state.formFields["ItemSite_Code"] = 1;
        this.state.formFields["DO_REMK1"] = res.data.dataList[0].DO_REMK1;
        this.state.formFields["terms"] = res.data.dataList[0].terms;
        this.state.formFields["DO_TTQTY"] = res.data.dataList[0].DO_TTQTY;
        this.state.formFields["DO_TTAMT"] = res.data.dataList[0].DO_TTAMT;

        // this.state.formFieldsDetailsStored.DO_TTQTY = res.data.dataList[0].DO_TTQTY

        this.updateState(this.state.formFields);
        // this.setState(this.state.formFieldsDetailsStored)
        // console.log("this.state.formFieldsDetailsStored",this.state.formFieldsDetailsStored)
        console.log("this.state.formFields", this.state.formFields);
        this.getAutofillItemDetails(res.data.dataList[0].DO_NO);
      });
  };

  handleItemDetailsSubmit = async (formFields, DO_STATUS) => {
    let { storedItemList, itemListBeforeEdit, statusOption } = this.state;

    for (let item of itemListBeforeEdit) {
      let found = storedItemList.some(
        el => el.item_code === item.item_code && el.UOM_DESC === item.UOM_DESC
      );
      if (!found) {
        this.props.commonDeleteApi(`doitem/${item.item_id}/`).then(res => {});
      }
    }

    for (let item of storedItemList) {
      const formDataItem = new FormData();
      if (DO_STATUS) {
        formDataItem.append("STATUS", "Posted");
      }
      formDataItem.append("DOD_ITEMCODE", item.item_code);
      formDataItem.append("DOD_ITEMDESC", item.Item_Desc);
      formDataItem.append("BrandName", item.UOM_DESC);
      formDataItem.append("BrandCode", item.ITEM_UOM);
      formDataItem.append("DOD_ITEMPRICE", item.ITEM_COST);
      formDataItem.append("DOD_QTY", item.item_quantity);
      formDataItem.append("DOD_POSTQTY", item.DOD_POSTQTY);
      formDataItem.append("DOD_TTLQTY", item.QTY);
      formDataItem.append("DOD_AMT", item.amount);
      formDataItem.append("ITEMSITE_CODE", this.props.tokenDetail.site_code);
      formDataItem.append("LineNumber", 1);

      await this.props
        .getCommonApi(
          `doitem/?searchdono=${formFields.DO_NO}&searchitemcode=${item.item_code}&searchuom=${item.UOM_DESC}`
        )
        .then(resGetItem => {
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `doitem/${resGetItem.data.dataList[0].DO_ID}/`,
                formDataItem
              )
              .then(resUpdateItem => {
                console.log("resUpdateItem", resUpdateItem);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("DO_No", formFields.DO_NO);
            this.props
              .commonCreateApi(`doitem/`, formDataItem)
              .then(resCreateItem => {
                console.log("resCreateItem", resCreateItem);
              });
          }
        });
    }
  };

  handleSubmit = async DO_STATUS => {
    try {
      if (this.validator.allValid()) {
        let {
          formFields,
          statusOption,
          contactOption,
          hqonly,
          storedItemList,
        } = this.state;

        for (let item of storedItemList) {
          if (item.QTY < item.DOD_POSTQTY) {
            Toast({
              type: "error",
              message: "Delivery Qty for " + item.Item_Desc + " exceeded limit",
            });
            return;
          }
        }
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
        // formData.append("DO_number", formFields.PONumber);
        // check save or post
        if (DO_STATUS) {
          formData.append("DO_STATUS", "Posted");
        } else {
          formData.append(
            "DO_STATUS",
            formFields.DO_STATUS
              ? statusOption.find(
                  option => option.value === parseInt(formFields.DO_STATUS)
                ).label
              : ""
          );
        }
        console.log("formFields.ItemSite_Code", formFields.ItemSite_Code);
        formData.append("SUPP_Code", formFields.SUPP_Code);
        // ?
        // supOption.find(option => option.value === formFields.SUPP_Code).label
        // : "");

        formData.append("ItemSite_Code", this.props.tokenDetail.site_code);
        formData.append(
          "contactPerson",
          formFields.contactPerson
            ? contactOption.find(
                option => option.value === parseInt(formFields.contactPerson)
              ).label
            : ""
        );
        formData.append("DO_REMK1", formFields.DO_REMK1);
        formData.append(
          "DO_DATE",
          dateFormat(formFields.DO_DATE) + " 00:00:00"
        );
        formData.append("terms", formFields.terms);
        formData.append("DO_User", this.props.tokenDetail.username);

        formData.append("DO_TTQTY", formFields.DO_TTQTY);
        formData.append("DO_TTAMT", formFields.DO_TTAMT);

        console.log("formData", formData);
        if (this.props.match.params.id) {
          await this.handleItemDetailsSubmit(formFields, DO_STATUS);
          console.log("in if loop");
          console.log("this.props.match.params.id", this.props.match.params.id);
          // var resDO = await this.props.updatePO(
          //   `${this.props.match.params.id}/`,
          //   formData
          // );
          if (hqonly == 1) {
            var resDO = await this.props.commonUpdateApi(
              `dohqonlylist/${this.props.match.params.id}/`,
              formData
            );
          } else {
            var resDO = await this.props.commonUpdateApi(
              `dolist/${this.props.match.params.id}/`,
              formData
            );
          }

          console.log(resDO);
          // this.handleAddressSubmit(resDO);

          // if(statusValue == "Void"){
          //   console.log("in void loop")
          //   await this.props.deletePO(`${this.props.match.params.id}/`)
          // }

          history.push(`/admin/inventory`);
        } else {
          console.log("this.props before createPO", this.props);

          await this.handleItemDetailsSubmit(formFields, DO_STATUS);

          if (hqonly == 1) {
            var resDO = await this.props.commonCreateApi(
              `dohqonlylist/`,
              formData
            );
          } else {
            var resDO = await this.props.commonCreateApi(`dolist/`, formData);
          }

          // .then(resDO => {
          //   console.log("resDO in create dolist", resDO)
          // })

          console.log("resDO in createPO", resDO);
          console.log("resDO.data.DO_NO", resDO.data.DO_NO);

          // this.handleAddressSubmit(resDO);
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
    let { detailsList, pageMeta, page, limit, search } = this.state;
    // let { Item_Desc } = formField;
    // console.log("this.props.siteCode",this.props.siteCode)
    //     console.log(typeof this.props.siteCode)

    this.props
      .getCommonApi(
        `allstocklist/?searchitemdesc=${search}&searchsitecode=${this.props.tokenDetail.site_code}&page=${page}&limit=${limit}`
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

  handleChangeQty = ({ target: { value, name } }) => {
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

  // when click select store item details into storedItemList array for display and further edit or delete
  handleSelect = (
    item_code,
    Item_Desc,
    UOM_DESC,
    ITEM_UOM,
    ITEM_COST,
    QTY,
    item_quantity
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
    if (this.props.tokenDetail.site_code == "HQ") {
      if (QTY < 1) {
        Toast({
          type: "error",
          message: "This item cannot be selected, quantity exceeds limit",
        });
        return;
      }
      if (QTY < item_quantity) {
        Toast({
          type: "error",
          message: "This item cannot be selected, quantity exceeds limit",
        });
        return;
      }
    }

    // for (let list in detailsList){
    //   if (detailsList[list].item_code == item_code){
    //     let item_quantiy = detailsList[list].item_quantity
    if (item_quantity) {
      storedItemList.push({
        item_code: item_code,
        Item_Desc: Item_Desc,
        UOM_DESC: UOM_DESC,
        ITEM_UOM: ITEM_UOM,
        ITEM_COST: ITEM_COST,
        QTY: QTY,
        DOD_POSTQTY: item_quantity,
        item_quantity: item_quantity,
        amount: Math.round(item_quantity * ITEM_COST * 100) / 100,
        editing: false,
      });
    } else {
      item_quantity = 1;
      storedItemList.push({
        item_code: item_code,
        Item_Desc: Item_Desc,
        UOM_DESC: UOM_DESC,
        ITEM_UOM: ITEM_UOM,
        ITEM_COST: ITEM_COST,
        QTY: QTY,
        DOD_POSTQTY: item_quantity,
        item_quantity: item_quantity,
        amount: Math.round(item_quantity * ITEM_COST * 100) / 100,
        editing: false,
      });
    }
    //   }
    // }

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
      if (this.props.tokenDetail.site_code == "HQ") {
        if (storedItemList[list].QTY < storedItemList[list].DOD_POSTQTY) {
          Toast({
            type: "error",
            message: "This item cannot be saved, quantity exceeds limit",
          });
          return;
        }
      }
      if (storedItemList[list].DOD_POSTQTY <= 0) {
        Toast({
          type: "error",
          message: "Delivery quantity cannot be less than 1",
        });
        return;
      }

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

  handleEditChangePrice = ({ target: { value, name } }) => {
    let { storedItemList, UOM } = this.state;

    let r = new RegExp(/^\d*(\d+\.|\.\d+)?$/);
    if (r.test(value) == true || !value) {
      for (let list in storedItemList) {
        if (
          storedItemList[list].item_code == name &&
          storedItemList[list].UOM_DESC == UOM
        ) {
          storedItemList[list].ITEM_COST = value;
          storedItemList[list].amount =
            Math.round(storedItemList[list].DOD_POSTQTY * value * 100) / 100;
        }
        // console.log("storedItemList[list].item_code",storedItemList[list].item_code)
      }
    }

    this.setState({
      storedItemList,
    });
    console.log("UOM in handleEditChangePrice", UOM);
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
        // storedItemList[list].amount =  Math.round(storedItemList[list].ITEM_COST*value * 100) / 100
      }
      // console.log("storedItemList[list].item_code",storedItemList[list].item_code)
    }

    this.setState({
      storedItemList,
    });
    console.log("storedItemList in handleEditChange", storedItemList);
  };

  handleEditChangeDeliverQuantity = ({ target: { value, name } }) => {
    let { storedItemList, UOM } = this.state;

    for (let list in storedItemList) {
      if (
        storedItemList[list].item_code == name &&
        storedItemList[list].UOM_DESC == UOM
      ) {
        storedItemList[list].DOD_POSTQTY = value;
        storedItemList[list].amount =
          Math.round(storedItemList[list].ITEM_COST * value * 100) / 100;
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

    formFields.DO_TTQTY = 0;
    formFields.DO_TTAMT = 0;

    for (let item of storedItemList) {
      console.log(
        "item.amount in update total",
        item.amount,
        typeof item.amount
      );
      console.log(
        "item.DOD_POSTQTY in update total",
        item.DOD_POSTQTY,
        typeof item.DOD_POSTQTY
      );
      formFields.DO_TTAMT = item.amount + formFields.DO_TTAMT;
      formFields.DO_TTQTY =
        parseInt(!item.DOD_POSTQTY ? 0 : item.DOD_POSTQTY) +
        formFields.DO_TTQTY;
    }

    formFields.DO_TTAMT = Math.round(formFields.DO_TTAMT * 100) / 100;

    this.setState({ formFields });
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
      DO_NO: formFields.DO_NO,
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
      DO_DATE: formFields.DO_DATE,
      terms: formFields.terms,
      Supplier:
        formFields.SUPP_Code && supOption
          ? supOption.find(option => option.value === formFields.SUPP_Code)
              .label
          : "",
      DO_REMK1: formFields.DO_REMK1,
      storeName: this.props.tokenDetail.branch,
      printedBy: this.props.tokenDetail.username,
      totalQty: formFields.DO_TTQTY,
      totalAmt: formFields.DO_TTAMT,
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
      headerDetails,
      headerSelectedDetails,
      disableEdit,
      pageMeta,
      contactOption,
      supOption,
      detailsList,
      storedItemList,
      isLoading,
      isPrintPdfClick,
      listDetail,
      blur,
    } = this.state;

    let {
      DO_NO,
      SUPP_Code,
      DO_DATE,
      contactPerson,
      DO_STATUS,
      ItemSite_Code,
      DO_REMK1,
      terms,
      DO_TTQTY,
      DO_TTAMT,
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5 create-DO">
        <div className="head-label-nav">
          <p
            className="category cursor-pointer"
            onClick={() => history.push(`/admin/inventory`)}
          >
            {t("DO")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} Stocks DO`)}
          </p>
        </div>
        <div className="DO-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row mt-5">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("DO No")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={true}
                    placeholder="Auto generated"
                    value={DO_NO}
                    name="DO_NO"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("DO No"),
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
                <div>
                  {this.validator.message(
                    t("Supplier"),
                    SUPP_Code,
                    t("required")
                  )}
                </div>
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("DO Date")}
                </label>
                <div className="input-group-normal">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={DO_DATE ? new Date(DO_DATE) : new Date()}
                    name="DO_DATE"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    // maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                <div>
                  {this.validator.message(t("DO Date"), DO_DATE, t("required"))}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Contact Person")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={SUPP_Code ? contactOption : []}
                    disabled={disableEdit}
                    value={contactPerson}
                    name="contactPerson"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Contact Person"),
                    contactPerson,
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
                    value={DO_STATUS}
                    name="DO_STATUS"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("Status"),
                      DO_STATUS,
                      t("required")
                    )}
                  </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Store Code")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={[
                      { value: 1, label: this.props.tokenDetail.branch },
                    ]}
                    disabled={disableEdit}
                    value={ItemSite_Code}
                    name="ItemSite_Code"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Store Code"),
                    ItemSite_Code,
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
                    value={DO_REMK1}
                    name="DO_REMK1"
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
                    placeholder="Enter here"
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

            <div className="col-md-12 DO-content">
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
                          UOM_DESC,
                          ITEM_UOM,
                          brand_itm_desc,
                          ITEM_COST,
                          QTY,
                          MOQQty,
                          range_itm_desc,
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
                                {UOM_DESC}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {brand_itm_desc}
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
                                {MOQQty}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {range_itm_desc}
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
                                onChange={this.handleChangeQty}
                              />
                              {/* </div> */}
                            </td>

                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <NormalButton
                                  buttonClass={"mx-2"}
                                  disabled={disableEdit}
                                  mainbg={true}
                                  className="warning"
                                  label="Select"
                                  onClick={() =>
                                    this.handleSelect(
                                      item_code,
                                      Item_Desc,
                                      UOM_DESC,
                                      ITEM_UOM,
                                      ITEM_COST,
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
                            ITEM_COST,
                            QTY,
                            DOD_POSTQTY,
                            item_quantity,
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
                                  {item_quantity}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {DOD_POSTQTY}
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
                              <Blur radius={blur ? "10px" : ""}>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center">
                                    <NormalInput
                                      value={ITEM_COST}
                                      disabled={disableEdit}
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
                              </Blur>
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {QTY}
                                </div>
                              </td>

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
                                  <NormalInput
                                    value={DOD_POSTQTY}
                                    disabled={disableEdit}
                                    name={item_code}
                                    onKeyPress={event => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onClick={() => this.setUOM(UOM_DESC)}
                                    onChange={
                                      this.handleEditChangeDeliverQuantity
                                    }
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
                          {t("Total Cost")}
                        </label>
                        <Blur radius={blur ? "10px" : ""}>
                          <div className="input-group-address w-100">
                            <NormalInput
                              placeholder="Enter here"
                              disabled={true}
                              value={DO_TTAMT}
                              name="DO_TTAMT"
                              // onChange={this.handleChangeDetails}
                            />
                          </div>
                        </Blur>
                      </div>
                      {/* <div>
                          {this.props.validator.message(
                            t("Total Cost"),
                            DO_TTAMT,
                            t("required")
                          )}
                      </div> */}

                      <div className="d-flex mb-3">
                        <label className="text-left w-100 text-black common-label-text fs-15 pl-5 pt-2">
                          {t("Total Quantity")}
                        </label>
                        <div className="input-group-address w-100">
                          <NormalInput
                            placeholder="Enter here"
                            disabled={true}
                            value={DO_TTQTY}
                            name="DO_TTQTY"
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      {/* <div>
                          {this.validator.message(
                            t("Total"),
                            DO_TTQTY,
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
                  onClick={() => this.handleSubmit(DO_STATUS)}
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
      commonDeleteApi,
      // updateDO,
      // createDO,
      // deleteDO,
      getTokenDetails,
    },
    dispatch
  );
};

export const AddStocksDO = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStocksDOClass)
);
