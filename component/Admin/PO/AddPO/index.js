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

export class AddPOClass extends Component {
  state = {
    formFields: {
      PONumber: "",
      projectTitle: "",
      PODate: new Date(),
      companyName: "",
      status: "",
      from: "",
      remarks: "",
      quoNumber: "",
    },
    fkProject: "",
    fkQuotation: "",
    statusOption: [],
    countryOption: [],
    stateOption: [],
    cityOption: [],

    disableEdit: false,
    is_loading: true,
    isMounted: true,

    siteGstList: [],

    formFieldsBillingStored: [],
    formFieldsShippingStored: [],
    storedItemListStored: [],
    itemListBeforeEdit: [],
    formFieldsDetailsStored: {},

    active: false,
    currentValue: 0,
    navLinks: [
      { to: this.props.location.pathname, label: "Details", id: "Details" },
      { to: this.props.location.pathname, label: "Address", id: "Address" },
    ],
    selectedMenu: "Details",
  };

  componentWillMount = () => {
    if (this.props.location.state) {
      if (this.props.location.state.quoId) {
        this.state.fkQuotation = this.props.location.state.quoId;
        this.setState({ fkQuotation: this.state.fkQuotation });
        console.log(
          "this.props.location.state.quoId",
          this.props.location.state.quoId
        );
        console.log("this.state.fkQuotation", this.state.fkQuotation);
      }
    }
    this.getStatus();
    this.getCountry();
    this.getState();
    this.getCity();
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
    if (this.props.location.state) {
      if (this.props.location.state.projectFk) {
        this.state.fkProject = this.props.location.state.projectFk;
        this.setState({ fkProject: this.state.fkProject });
        console.log(
          "this.props.location.state.projectFk",
          this.props.location.state.projectFk
        );
        console.log("this.state.fkProject", this.state.fkProject);
      }

      // this.state.fkQuotation = this.props.location.state.quoId
      // this.setState({fkQuotation : this.state.fkQuotation})

      // console.log("this.props.location.state.quoId",this.props.location.state.quoId)
      // console.log("this.state.fkQuotation",this.state.fkQuotation)
    }

    console.log("this.props", this.props);

    console.log("this.state", this.state);
    // console.log("useLocation()",useLocation())

    if (this.props.match.params.id) {
      this.getAutofillItemDetails();
    }
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

  getSiteGst = () => {
    let { siteGstList } = this.state;
    // statusOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props
      .getCommonApi(
        `gstlist/?limit=100&searchsitecode=${this.props.tokenDetail.site_code}`
      )
      .then(res => {
        console.log("res.data getSiteGst", res.data.dataList);
        siteGstList = res.data.dataList;
        this.setState({ siteGstList });
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
          label: key.dropdown_item,
          code: key.dropdown_desc,
          active: key.active,
        });
      }
      if (!this.props.match.params.id) {
        for (var i = 0; i < statusOption.length; i++) {
          if (statusOption[i].label == "Void") {
            statusOption.splice(i, 1);
          }
        }
      }
      console.log("statusOption", statusOption);
      this.setState({ statusOption });
      if (this.props.match.params.id) {
        this.autoFillForm();
      }
      if (this.props.tokenDetail) {
        this.getSiteGst();
      }
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
      if (this.props.match.params.id) {
        this.getAutofillAddress();
      }
      if (this.props.location.state) {
        if (this.props.location.state.quoId) {
          this.getAutofillByQuotationNo();
          console.log(
            "this.props.location.state.quoId",
            this.props.location.state.quoId
          );
        }
      }
    });
  };

  getAutofillByQuotationNo = () => {
    this.props
      .getCommonApi(
        `quotationlist/?searchid=${this.props.location.state.quoId}`
      )
      .then(res => {
        console.log("res in getAutofillByQuotationNo", res);

        if (res.status == 200) {
          // this.state.formFields["PONumber"] = res.data.dataList[0].po_number
          this.state.formFields["projectTitle"] = res.data.dataList[0].title;
          this.state.formFields["PODate"] = res.data.dataList[0].created_at;
          this.state.formFields["companyName"] = res.data.dataList[0].company;
          if (res.data.dataList[0].status) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFields["status"] = this.state.statusOption.find(
              option => option.label === "Open"
            ).value;
          }
          this.state.formFields["from"] = res.data.dataList[0].contact_person;
          this.state.formFields["remarks"] = res.data.dataList[0].remarks;
          this.state.formFields["quoNumber"] =
            res.data.dataList[0].quotation_number;

          this.updateState(this.state.formFields);
        }
      });

    this.props
      .getCommonApi(
        `quotationitem/?searchqitemid=${this.props.location.state.quoId}`
      )
      .then(res => {
        console.log("res in getAutofillByQuotationNo", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            this.state.storedItemListStored.push({
              item_code: item.quotation_itemcode,
              item_desc: item.quotation_itemdesc,
              item_remarks: item.quotation_itemremarks,
              item_price: item.quotation_unitprice,
              item_quantity: item.quotation_quantity,
              editing: false,
            });
          }
          this.setState(this.state.storedItemListStored);
        }
      });

    // this.props
    // .getCommonApi(
    //   `quotationdetail/?searchqdetailid=${this.props.location.state.quoId}`
    // )
    // .then(res => {
    //   console.log("res in getAutofillByQuotationNo", res)

    //   if(res.status == 200){
    //     this.state.formFieldsDetailsStored.po_shipcost = res.data[0].q_shipcost
    //     this.state.formFieldsDetailsStored.po_discount = res.data[0].q_discount
    //     this.state.formFieldsDetailsStored.po_taxes = res.data[0].q_taxes
    //     this.state.formFieldsDetailsStored.po_total = res.data[0].q_total
    //     this.setState(this.state.formFieldsDetailsStored)
    //   }
    // })

    this.props
      .getCommonApi(
        `quotationaddr/?searchqaddrid=${this.props.location.state.quoId}`
      )
      .then(res => {
        console.log("res in getAutofillByQuotationNo", res);
        if (res.status == 200) {
          this.state.formFieldsBillingStored.to = res.data[0].billto;
          this.state.formFieldsBillingStored.address1 = res.data[0].bill_addr1;
          this.state.formFieldsBillingStored.address2 = res.data[0].bill_addr2;
          this.state.formFieldsBillingStored.address3 = res.data[0].bill_addr3;
          this.state.formFieldsBillingStored.postalCode =
            res.data[0].bill_postalcode;
          if (res.data[0].bill_city) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsBillingStored.city =
              this.state.cityOption.find(
                option => option.label === res.data[0].bill_city
              ).value;
          }
          if (res.data[0].bill_state) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsBillingStored.state =
              this.state.stateOption.find(
                option => option.label === res.data[0].bill_state
              ).value;
          }
          if (res.data[0].bill_country) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsBillingStored.country =
              this.state.countryOption.find(
                option => option.label === res.data[0].bill_country
              ).value;
          }

          this.state.formFieldsShippingStored.to = res.data[0].shipto;
          this.state.formFieldsShippingStored.address1 = res.data[0].ship_addr1;
          this.state.formFieldsShippingStored.address2 = res.data[0].ship_addr2;
          this.state.formFieldsShippingStored.address3 = res.data[0].ship_addr3;
          this.state.formFieldsShippingStored.postalCode =
            res.data[0].ship_postalcode;
          if (res.data[0].ship_city) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsShippingStored.city =
              this.state.cityOption.find(
                option => option.label === res.data[0].ship_city
              ).value;
          }
          if (res.data[0].ship_state) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsShippingStored.state =
              this.state.stateOption.find(
                option => option.label === res.data[0].ship_state
              ).value;
          }
          if (res.data[0].ship_country) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsShippingStored.country =
              this.state.countryOption.find(
                option => option.label === res.data[0].ship_country
              ).value;
          }

          console.log(
            "this.state.formFieldsBillingStored in getAutofillByQuotationNo",
            this.state.formFieldsBillingStored
          );
          console.log(
            "this.state.formFieldsShippingStored in getAutofillByQuotationNo",
            this.state.formFieldsShippingStored
          );
          this.setState(this.state.formFieldsBillingStored);
          this.setState(this.state.formFieldsShippingStored);
        }
      });
  };

  getAutofillItemDetails = () => {
    this.props
      .getCommonApi(`podetail/?searchpodetailid=${this.props.match.params.id}`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);

        if (res.status == 200) {
          this.state.formFieldsDetailsStored.po_shipcost =
            res.data[0].po_shipcost;
          this.state.formFieldsDetailsStored.po_discount =
            res.data[0].po_discount;
          this.state.formFieldsDetailsStored.po_taxes = res.data[0].po_taxes;
          this.state.formFieldsDetailsStored.po_total = res.data[0].po_total;
          this.setState(this.state.formFieldsDetailsStored);
        }
      });

    this.props
      .getCommonApi(`poitem/?searchpoitemid=${this.props.match.params.id}`)
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        // this.state.storedItemListStored = res.data.dataList
        if (res.status == 200) {
          for (let item of res.data.dataList) {
            this.state.storedItemListStored.push({
              item_code: item.po_itemcode,
              item_desc: item.po_itemdesc,
              item_remarks: item.po_itemremarks,
              item_price: item.po_unitprice,
              item_quantity: item.po_quantity,
              editing: false,
            });
            this.state.itemListBeforeEdit.push({
              item_id: item.id,
              item_code: item.po_itemcode,
            });
          }
          this.setState(this.state.storedItemListStored);
          this.setState(this.state.itemListBeforeEdit);
          console.log(
            "this.state.itemListBeforeEdit",
            this.state.itemListBeforeEdit
          );
        }
        // this.state.formFieldsDetailsStored.po_shipcost = res.data[0].po_shipcost
        // this.state.formFieldsDetailsStored.po_discount = res.data[0].po_discount
        // this.state.formFieldsDetailsStored.po_taxes = res.data[0].po_taxes
        // this.state.formFieldsDetailsStored.po_total = res.data[0].po_total
        // this.setState(this.state.formFieldsDetailsStored)
      });
  };

  getAutofillAddress = () => {
    this.props
      .getCommonApi(`poaddr/?searchpoaddrid=${this.props.match.params.id}`)
      .then(res => {
        console.log("res in autofillAddr", res);
        if (res.status == 200) {
          this.state.formFieldsBillingStored.to = res.data[0].billto;
          this.state.formFieldsBillingStored.address1 = res.data[0].bill_addr1;
          this.state.formFieldsBillingStored.address2 = res.data[0].bill_addr2;
          this.state.formFieldsBillingStored.address3 = res.data[0].bill_addr3;
          this.state.formFieldsBillingStored.postalCode =
            res.data[0].bill_postalcode;
          if (res.data[0].bill_city) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsBillingStored.city =
              this.state.cityOption.find(
                option => option.label === res.data[0].bill_city
              ).value;
          }
          if (res.data[0].bill_state) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsBillingStored.state =
              this.state.stateOption.find(
                option => option.label === res.data[0].bill_state
              ).value;
          }
          if (res.data[0].bill_country) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsBillingStored.country =
              this.state.countryOption.find(
                option => option.label === res.data[0].bill_country
              ).value;
          }

          this.state.formFieldsShippingStored.to = res.data[0].shipto;
          this.state.formFieldsShippingStored.address1 = res.data[0].ship_addr1;
          this.state.formFieldsShippingStored.address2 = res.data[0].ship_addr2;
          this.state.formFieldsShippingStored.address3 = res.data[0].ship_addr3;
          this.state.formFieldsShippingStored.postalCode =
            res.data[0].ship_postalcode;
          if (res.data[0].ship_city) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsShippingStored.city =
              this.state.cityOption.find(
                option => option.label === res.data[0].ship_city
              ).value;
          }
          if (res.data[0].ship_state) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsShippingStored.state =
              this.state.stateOption.find(
                option => option.label === res.data[0].ship_state
              ).value;
          }
          if (res.data[0].ship_country) {
            //matching status name with the id to set prefill status in dropdown
            this.state.formFieldsShippingStored.country =
              this.state.countryOption.find(
                option => option.label === res.data[0].ship_country
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
        }
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
    let { disableEdit, statusOption } = this.state;

    this.props
      .getCommonApi(`polist/?searchid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("po dataList", res.data.dataList);
        // console.log("quo dataList cust name", res.data.dataList[0].customer_name);
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList
        this.state.formFields["PONumber"] = res.data.dataList[0].po_number;
        this.state.formFields["projectTitle"] = res.data.dataList[0].title;
        this.state.formFields["PODate"] = res.data.dataList[0].created_at;
        this.state.formFields["companyName"] = res.data.dataList[0].company;

        console.log("statusOption in prefill", this.state.statusOption);
        console.log("res.data.dataList[0].status", res.data.dataList[0].status);
        // if status empty prevent err
        if (res.data.dataList[0].status) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["status"] = this.state.statusOption.find(
            option => option.label === res.data.dataList[0].status
          ).value;
          console.log(
            "res.data.dataList[0].status",
            res.data.dataList[0].status
          );
          if (res.data.dataList[0].status == "Posted") {
            disableEdit = true;

            for (var i = 0; i < statusOption.length; i++) {
              if (statusOption[i].label == "Posted") {
                statusOption = statusOption.filter(e => e.label !== "Open");
              }
            }
            console.log("statusOption when status is posted", statusOption);

            this.setState({ disableEdit, statusOption });
            console.log("this.state.disableEdit", disableEdit);
          }
        }
        this.state.formFields["from"] = res.data.dataList[0].contact_person;
        this.state.formFields["remarks"] = res.data.dataList[0].remarks;
        this.state.formFields["quoNumber"] =
          res.data.dataList[0].fk_quotation_number;

        this.updateState(this.state.formFields);
        console.log("this.state.formFields", this.state.formFields);
      });
  };

  handleItemDetailsSubmit = resPO => {
    let { storedItemListStored, formFieldsDetailsStored, itemListBeforeEdit } =
      this.state;
    const formDataDetails = new FormData();

    formDataDetails.append(
      "po_shipcost",
      formFieldsDetailsStored.po_shipcost
        ? formFieldsDetailsStored.po_shipcost
        : 0
    );
    formDataDetails.append(
      "po_discount",
      formFieldsDetailsStored.po_discount
        ? formFieldsDetailsStored.po_discount
        : 0
    );
    formDataDetails.append(
      "po_taxes",
      formFieldsDetailsStored.po_taxes ? formFieldsDetailsStored.po_taxes : 0
    );
    formDataDetails.append(
      "po_total",
      formFieldsDetailsStored.po_total ? formFieldsDetailsStored.po_total : 0
    );

    this.props
      .getCommonApi(`podetail/?searchpodetailid=${resPO.data.id}`)
      .then(resGetDetails => {
        if (resGetDetails.status == 200) {
          console.log("resGetDetails", resGetDetails);
          this.props
            .commonUpdateApi(
              `podetail/${resGetDetails.data[0].id}/`,
              formDataDetails
            )
            .then(resUpdateDetails => {
              console.log("resUpdateDetails", resUpdateDetails);
              this.props.history.push(`/admin/po`);
            });
        } else if (resGetDetails.status == 204) {
          formDataDetails.append("fk_po", resPO.data.id);
          this.props
            .commonCreateApi(`podetail/`, formDataDetails)
            .then(resCreateDetails => {
              console.log("resCreateDetails", resCreateDetails);
              this.props.history.push(`/admin/po`);
            });
        }
      });

    for (let item of itemListBeforeEdit) {
      let found = storedItemListStored.some(
        el => el.item_code === item.item_code
      );
      if (!found) {
        this.props.commonDeleteApi(`poitem/${item.item_id}/`).then(res => {});
      }
    }

    for (let item of storedItemListStored) {
      const formDataItem = new FormData();
      formDataItem.append("po_itemcode", item.item_code);
      formDataItem.append("po_itemdesc", item.item_desc);
      formDataItem.append("po_itemremarks", item.item_remarks);
      formDataItem.append("po_unitprice", item.item_price);
      formDataItem.append("po_quantity", item.item_quantity);

      this.props
        .getCommonApi(
          `poitem/?searchpoitemid=${resPO.data.id}&searchpoitemcode=${item.item_code}`
        )
        .then(resGetItem => {
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `poitem/${resGetItem.data.dataList[0].id}/`,
                formDataItem
              )
              .then(resUpdateItem => {
                console.log("resUpdateItem", resUpdateItem);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("fk_po", resPO.data.id);
            this.props
              .commonCreateApi(`poitem/`, formDataItem)
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
    formDataAddress.append(
      "billto",
      this.state.formFieldsBillingStored.to
        ? this.state.formFieldsBillingStored.to
        : ""
    );
    formDataAddress.append(
      "bill_addr1",
      this.state.formFieldsBillingStored.address1
        ? this.state.formFieldsBillingStored.address1
        : ""
    );
    formDataAddress.append(
      "bill_addr2",
      this.state.formFieldsBillingStored.address2
        ? this.state.formFieldsBillingStored.address2
        : ""
    );
    formDataAddress.append(
      "bill_addr3",
      this.state.formFieldsBillingStored.address3
        ? this.state.formFieldsBillingStored.address3
        : ""
    );
    formDataAddress.append(
      "bill_postalcode",
      this.state.formFieldsBillingStored.postalCode
        ? this.state.formFieldsBillingStored.postalCode
        : ""
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

    formDataAddress.append(
      "shipto",
      this.state.formFieldsShippingStored.to
        ? this.state.formFieldsShippingStored.to
        : ""
    );
    formDataAddress.append(
      "ship_addr1",
      this.state.formFieldsShippingStored.address1
        ? this.state.formFieldsShippingStored.address1
        : ""
    );
    formDataAddress.append(
      "ship_addr2",
      this.state.formFieldsShippingStored.address2
        ? this.state.formFieldsShippingStored.address2
        : ""
    );
    formDataAddress.append(
      "ship_addr3",
      this.state.formFieldsShippingStored.address3
        ? this.state.formFieldsShippingStored.address3
        : ""
    );
    formDataAddress.append(
      "ship_postalcode",
      this.state.formFieldsShippingStored.postalCode
        ? this.state.formFieldsShippingStored.postalCode
        : ""
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

  handleSubmit = async status => {
    try {
      if (this.validator.allValid()) {
        let { formFields, statusOption } = this.state;
        let statusValue = "";
        console.log("formFields.status", formFields.status);

        for (let key of statusOption) {
          // console.log(key.value)
          if (key.value == formFields.status) {
            statusValue = key.label;
          }
        }
        console.log("statusValue", statusValue);
        const formData = new FormData();
        // formData.append("po_number", formFields.PONumber);
        //check save or post
        if (status) {
          formData.append("status", "Posted");
        } else {
          formData.append("status", statusValue);
        }
        formData.append("title", formFields.projectTitle);
        formData.append("company", formFields.companyName);
        formData.append("contact_person", formFields.from);
        formData.append("remarks", formFields.remarks);
        console.log("formFields.PODate", formFields.PODate);
        formData.append(
          "created_at",
          dateFormat(formFields.PODate) + " 00:00:00"
        );
        // formData.append("created_at", dateFormat(formFields.PODate) + " "+formFields.PODate.getHours() + ":" + formFields.PODate.getMinutes() + ":" + formFields.PODate.getSeconds());

        formData.append("fk_quotation_number", formFields.quoNumber);
        formData.append("username", this.props.tokenDetail.username);
        console.log("this.state.fkProject in submit", this.state.fkProject);
        if (this.state.fkProject) {
          formData.append("fk_project", this.state.fkProject);
        }
        console.log("formData", formData);
        if (this.props.match.params.id) {
          console.log("in if loop");
          console.log("this.props.match.params.id", this.props.match.params.id);
          var resPO = await this.props.updatePO(
            `${this.props.match.params.id}/`,
            formData
          );

          console.log(resPO);
          this.handleAddressSubmit(resPO);
          this.handleItemDetailsSubmit(resPO);
          if (statusValue == "Void") {
            console.log("in void loop");
            await this.props.deletePO(`${this.props.match.params.id}/`);
          }

          // this.props.history.push(
          //   `/admin/po`
          // )
        } else {
          console.log("this.props before createPO", this.props);
          // if (this.props.location.state){
          //   console.log("this.props.location.state.projectFk",this.props.location.state.projectFk)
          //   formData.append("fk_project", this.props.location.state.projectFk);
          // }
          console.log(
            "this.state.fkProject before createPO",
            this.state.fkProject
          );
          // formData.append("fk_project", this.state.fkProject);
          var resPO = await this.props.createPO(formData);

          console.log("resPO in createPO", resPO);
          console.log("resPO.data.id", resPO.data.id);

          this.handleAddressSubmit(resPO);
          this.handleItemDetailsSubmit(resPO);

          // this.props.history.push(
          //   `/admin/po`
          // )
        }
      } else {
        this.validator.showMessages();
      }
      // this.updateState({ is_loading: false });
    } catch (e) {
      this.updateState({ is_loading: false });
    }
  };

  render() {
    let {
      formFields,
      statusOption,
      currentValue,
      navLinks,
      disableEdit,
      fkQuotation,
    } = this.state;

    let {
      PONumber,
      projectTitle,
      PODate,
      companyName,
      status,
      from,
      remarks,
      quoNumber,
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5 container create-PO">
        <div className="head-label-nav">
          <p className="category">{t("PO")}</p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} PO`)}
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
                    value={PONumber}
                    name="PONumber"
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
                  {t("Project")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={projectTitle}
                    name="projectTitle"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Project"),
                    projectTitle,
                    t("required")
                  )}
                </div>
              </div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("PO Date")}
                </label>
                <div className="input-group-normal">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={PODate ? new Date(PODate) : new Date()}
                    name="PODate"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    // maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                <div>
                  {this.validator.message(t("PO Date"), PODate, t("required"))}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Company Name")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={companyName}
                    name="companyName"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Company Name"),
                    companyName,
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
                    value={status}
                    name="status"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(t("Status"), status, t("required"))}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("From")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={from}
                    name="from"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(t("From"), from, t("required"))}
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
                    value={remarks}
                    name="remarks"
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-2 col-12"></div>

              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Quotation Number")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={quoNumber}
                    name="quoNumber"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                    {this.validator.message(
                      t("Quotation Number"),
                      quoNumber,
                      t("required")
                    )}
                  </div> */}
              </div>
            </div>

            <div className="col-md-12 PO-content">
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
              {/* {this.state.selectedMenu === "Details" && (
                <Details
                  disableEdit={disableEdit}
                  poId={this.props.match.params.id}
                  quoId={fkQuotation}
                  siteGstList={this.state.siteGstList}
                  validator={this.validator}
                  storeItemDetails={this.storeItemDetails.bind(this)}
                  storedItemListStored={this.state.storedItemListStored}
                  formFieldsDetailsStored={this.state.formFieldsDetailsStored}
                  id={this.state.selectedMenu}
                  // search={formFields.search}
                  api={"details"}
                />
              )} */}
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

            <div className="row">
              <div className="col-md-6 col-12 mt-3"></div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  mainbg={true}
                  className="confirm"
                  label="Cancel"
                  outline={false}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to leave this page and discard changes?"
                      )
                    )
                      this.props.history.push(`/admin/po`);
                  }}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  onClick={() => this.handleSubmit()}
                />
              </div>

              <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  mainbg={true}
                  className="confirm"
                  label="Post"
                  outline={false}
                  onClick={() => this.handleSubmit(status)}
                />
              </div>
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
      commonDeleteApi,
      getTokenDetails,
    },
    dispatch
  );
};

export const AddPO = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddPOClass)
);
