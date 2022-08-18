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
import PDF from "../../StocksPDF/TransferOut/index";

export class AddStocksTransferOutClass extends Component {
  state = {
    formFields: {
      DOC_NO: "",
      DOC_REF1: "",
      FSTORE_NO: "",
      DOC_DATE: new Date(),
      DOC_REF2: "",
      TSTORE_NO: "",
      DOC_STATUS: "",
      STORE_NO: "",
      CREATE_USER: "",
      DOC_REMK1: "",

      DOC_AMT: "",
      DOC_QTY: "",
    },

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

    UOM: "",

    listDetail: {},
    isPrintPdfClick: false,
    siteAddr: [],

    fkProject: "",
    fkQuotation: "",
    statusOption: [],
    siteOption: [],
    empOption: [],
    cityOption: [],

    detailsList: [],
    storedItemList: [],
    itemListBeforeEdit: [],
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
    disableEdit: false,
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
    this.getStatus();
    // this.getSiteCode()

    this.getSiteDetail();

    // if(this.props.match.params.id) {
    //   this.getAutofillItemDetails()
    // }
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
          active: key.active,
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
        this.getSiteCode();
      });

      // if (this.props.match.params.id) {
      //   this.autoFillForm()
      // };
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
      this.setState({ siteOption }, () => {
        this.getEmp();
      });
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
      this.setState({ empOption }, () => {
        this.getDetails();
        if (this.props.match.params.id) {
          this.autoFillForm();
        } else {
          this.prefillDefault();
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
    this.state.formFields["FSTORE_NO"] = 1;
    this.setState(this.state.formFields);
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
    this.props
      .getCommonApi(`stockoutitem/?searchdocno=${DOC_NO}&limit=10000`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            this.state.storedItemList.push({
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
    let { disableEdit, statusOption, empOption, siteOption } = this.state;

    this.props
      .getCommonApi(`stockoutlist/?searchdocid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("adj dataList", res.data.dataList);

        this.state.formFields["DOC_NO"] = res.data.dataList[0].DOC_NO;
        // this.state.formFields["SUPPLY_NO"] = res.data.dataList[0].SUPPLY_NO

        this.state.formFields["DOC_REF1"] = res.data.dataList[0].DOC_REF1;
        this.state.formFields["FSTORE_NO"] = 1;
        this.state.formFields["DOC_DATE"] = res.data.dataList[0].DOC_DATE;

        this.state.formFields["DOC_REF2"] = res.data.dataList[0].DOC_REF2;
        this.state.formFields["TSTORE_NO"] = res.data.dataList[0].TSTORE_NO;

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
        // this.state.formFields["CREATE_USER"] =res.data.dataList[0].STAFF_NO
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

  handleItemDetailsSubmit = resOUT => {
    let { storedItemList, itemListBeforeEdit } = this.state;

    for (let item of itemListBeforeEdit) {
      let found = storedItemList.some(
        el => el.item_code === item.item_code && el.UOM_DESC === item.UOM_DESC
      );
      if (!found) {
        this.props
          .commonDeleteApi(`stockoutitem/${item.item_id}/`)
          .then(res => {});
      }
    }

    for (let item of storedItemList) {
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
          `stockoutitem/?searchdocno=${resOUT.data.DOC_NO}&searchitemcode=${item.item_code}&searchuom=${item.UOM_DESC}`
        )
        .then(resGetItem => {
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `stockoutitem/${resGetItem.data.dataList[0].DOC_ID}/`,
                formDataItem
              )
              .then(resUpdateItem => {
                console.log("resUpdateItem", resUpdateItem);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("DOC_NO", resOUT.data.DOC_NO);
            this.props
              .commonCreateApi(`stockoutitem/`, formDataItem)
              .then(resCreateItem => {
                console.log("resCreateItem", resCreateItem);
              });
          }
        });
    }
  };

  handleAddressSubmit = resPO => {
    let { cityOption, countryOption, stateOption } = this.state;
    //submit address
    const formDataAddress = new FormData();
    console.log(
      "this.state.formFieldsBillingStored in handleAddressSubmit",
      this.state.formFieldsBillingStored
    );
    console.log(
      "this.state.formFieldsBillingStored.to",
      this.state.formFieldsBillingStored.to
    );
    console.log(
      "this.state.formFieldsBillingStored.address1",
      this.state.formFieldsBillingStored.address1
    );
    formDataAddress.append("billto", this.state.formFieldsBillingStored.to);
    formDataAddress.append(
      "bill_addr1",
      this.state.formFieldsBillingStored.address1
    );
    formDataAddress.append(
      "bill_addr2",
      this.state.formFieldsBillingStored.address2
    );
    formDataAddress.append(
      "bill_addr3",
      this.state.formFieldsBillingStored.address3
    );
    formDataAddress.append(
      "bill_postalcode",
      this.state.formFieldsBillingStored.postalCode
    );

    // console.log("cityOption.find(option => option.value === this.formFieldsBillingStored.city).label",cityOption.find(option => option.value === parseInt(this.state.formFieldsBillingStored.city)).label)

    formDataAddress.append(
      "bill_city",
      this.state.formFieldsBillingStored.city
        ? cityOption.find(
            option =>
              option.value === parseInt(this.state.formFieldsBillingStored.city)
          ).label
        : ""
    );

    formDataAddress.append(
      "bill_state",
      this.state.formFieldsBillingStored.state
        ? stateOption.find(
            option =>
              option.value ===
              parseInt(this.state.formFieldsBillingStored.state)
          ).label
        : ""
    );

    formDataAddress.append(
      "bill_country",
      this.state.formFieldsBillingStored.country
        ? countryOption.find(
            option =>
              option.value ===
              parseInt(this.state.formFieldsBillingStored.country)
          ).label
        : ""
    );

    formDataAddress.append("shipto", this.state.formFieldsShippingStored.to);
    formDataAddress.append(
      "ship_addr1",
      this.state.formFieldsShippingStored.address1
    );
    formDataAddress.append(
      "ship_addr2",
      this.state.formFieldsShippingStored.address2
    );
    formDataAddress.append(
      "ship_addr3",
      this.state.formFieldsShippingStored.address3
    );
    formDataAddress.append(
      "ship_postalcode",
      this.state.formFieldsShippingStored.postalCode
    );

    formDataAddress.append(
      "ship_city",
      this.state.formFieldsShippingStored.city
        ? cityOption.find(
            option =>
              option.value ===
              parseInt(this.state.formFieldsShippingStored.city)
          ).label
        : ""
    );

    formDataAddress.append(
      "ship_state",
      this.state.formFieldsShippingStored.state
        ? stateOption.find(
            option =>
              option.value ===
              parseInt(this.state.formFieldsShippingStored.state)
          ).label
        : ""
    );

    formDataAddress.append(
      "ship_country",
      this.state.formFieldsShippingStored.country
        ? countryOption.find(
            option =>
              option.value ===
              parseInt(this.state.formFieldsShippingStored.country)
          ).label
        : ""
    );

    this.props
      .getCommonApi(`poaddr/?searchpoaddrid=${resPO.data.id}`)
      .then(resGetAddr => {
        if (resGetAddr.status == 200) {
          console.log("resGetAddr", resGetAddr);
          this.props
            .commonUpdateApi(
              `poaddr/${resGetAddr.data[0].id}/`,
              formDataAddress
            )
            .then(resUpdateAddr => {
              console.log("resCreateAddr", resUpdateAddr);
            });
        } else if (resGetAddr.status == 204) {
          formDataAddress.append("fk_po", resPO.data.id);
          this.props
            .commonCreateApi(`poaddr/`, formDataAddress)
            .then(resCreateAddr => {
              console.log("resCreateAddr", resCreateAddr);
            });
        }
      });
  };

  handleSubmit = async DOC_STATUS => {
    try {
      if (this.validator.allValid()) {
        let { formFields, statusOption, empOption } = this.state;

        const formData = new FormData();

        formData.append("DOC_REF1", formFields.DOC_REF1);
        formData.append("FSTORE_NO", this.props.tokenDetail.site_code);
        formData.append(
          "DOC_DATE",
          dateFormat(formFields.DOC_DATE) + " 00:00:00"
        );
        formData.append("DOC_REF2", formFields.DOC_REF2);
        formData.append("TSTORE_NO", formFields.TSTORE_NO);
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
          var resOUT = await this.props.commonUpdateApi(
            `stockoutlist/${this.props.match.params.id}/`,
            formData
          );

          console.log(resOUT);
          // this.handleAddressSubmit(resOUT);
          this.handleItemDetailsSubmit(resOUT);
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
          // var resOUT = await this.props.createPO(formData);

          var resOUT = await this.props.commonCreateApi(
            `stockoutlist/`,
            formData
          );

          console.log("resOUT in createPO", resOUT);
          console.log("resOUT.data.id", resOUT.data.id);

          // this.handleAddressSubmit(resOUT);
          this.handleItemDetailsSubmit(resOUT);
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
    item_cost,
    QTY
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
      if (QTY < parseFloat(item_quantity)) {
        Toast({
          type: "error",
          message: "This item cannot be selected, quantity exceeds limit",
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
        QTY: QTY,
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
        QTY: QTY,
      });
    }

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
        if (
          storedItemList[list].QTY <
          parseFloat(storedItemList[list].item_quantity)
        ) {
          Toast({
            type: "error",
            message: "This item cannot be saved, quantity exceeds limit",
          });
          return;
        }
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

  setUOM = UOM_DESC => {
    let { UOM } = this.state;
    UOM = UOM_DESC;
    console.log("UOM in setUOM", UOM);
    this.setState({ UOM });
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
      siteOption,
      siteAddr,
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
      TSTORE_NO:
        formFields.TSTORE_NO && siteOption
          ? siteOption.find(option => option.value === formFields.TSTORE_NO)
              .label
          : "",
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

  render() {
    let {
      formFields,
      statusOption,
      headerDetails,
      headerSelectedDetails,
      disableEdit,
      pageMeta,
      empOption,
      siteOption,
      detailsList,
      storedItemList,
      isLoading,
      isPrintPdfClick,
      listDetail,
    } = this.state;

    let {
      DOC_NO,
      DOC_REF1,
      FSTORE_NO,
      DOC_DATE,
      DOC_REF2,
      TSTORE_NO,
      DOC_STATUS,
      STORE_NO,
      CREATE_USER,
      DOC_REMK1,

      DOC_AMT,
      DOC_QTY,
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5  create-transferOut">
        <div className="head-label-nav">
          <p
            className="category cursor-pointer"
            onClick={() => history.push(`/admin/inventory`)}
          >
            {t("Stocks Treansfer Out")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(
              `${
                this.props.match.params.id ? "Edit" : "New"
              } Stocks Transfer Out`
            )}
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
                  {t("GR Ref1")}
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
                      t("GR Ref1"),
                      DOC_REF1,
                      t("required")
                    )}
                  </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("From Store")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={[
                      { value: 1, label: this.props.tokenDetail.branch },
                    ]}
                    disabled={disableEdit}
                    value={FSTORE_NO}
                    name="FSTORE_NO"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("From Store"),
                    FSTORE_NO,
                    t("required")
                  )}
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
                    t("DOC Date"),
                    DOC_DATE,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("GR Ref2")}
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
                      t("GR Ref2"),
                      DOC_REF2,
                      t("required")
                    )}
                  </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("To Store")}
                </label>
                <div className="input-group-normal">
                  <NormalSelect
                    options={siteOption}
                    disabled={disableEdit}
                    value={TSTORE_NO}
                    name="TSTORE_NO"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("To Store"),
                    TSTORE_NO,
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
            </div>

            <div className="col-md-12 transferOut-content">
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
                              {/* <div className="input-group"> */}
                              <NormalInput
                                value={item_cost}
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
                                onChange={this.handleChangeCost}
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
                                      brand_itm_desc,
                                      range_itm_desc,
                                      UOM_DESC,
                                      ITEM_UOM,
                                      item_quantity,
                                      item_cost,
                                      QTY
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
                                  {amount}
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
                        {this.validator.message(
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
                        {this.validator.message(
                          t("Total Quantity"),
                          DOC_QTY,
                          t("required")
                        )}
                      </div>
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

export const AddStocksTransferOut = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStocksTransferOutClass)
);
