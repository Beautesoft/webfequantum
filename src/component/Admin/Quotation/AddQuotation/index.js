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
import {
  createQuotation,
  updateQuotation,
  deleteQuotation,
} from "redux/actions/quotation";
import { getTokenDetails } from "redux/actions/auth";

export class AddQuotationClass extends Component {
  state = {
    formFields: {
      quoNumber: "",
      projectTitle: "",
      companyName: "",
      quoDate: new Date(),
      validity: "",
      attnTo: "",
      status: "",
      terms: "",
      preparedBy: "",
      remarks: "",
      footer: "",
    },
    fkProject: "",
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
      console.log("this.props.location.state", this.props.location.state);
      this.state.fkProject = this.props.location.state.projectFk;
      this.setState({ fkProject: this.state.fkProject });
      console.log(
        "this.props.location.state.projectFk",
        this.props.location.state.projectFk
      );
      console.log("this.state.fkProject", this.state.fkProject);
      this.autofillFromProject();
    }

    console.log("this.props", this.props);
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
    });
  };

  autofillFromProject = () => {
    let { fkProject } = this.state;
    console.log("fkProject in autofill", fkProject);
    console.log("this.props.tokenDetail", this.props.tokenDetail);
    this.props
      .getCommonApi(`projectlist/?searchid=${fkProject}`)
      .then(async res => {
        console.log("project dataList", res.data.dataList);
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList
        this.state.formFields["projectTitle"] = res.data.dataList[0].title;
        this.state.formFields["companyName"] =
          res.data.dataList[0].customer_name;
        this.state.formFields["attnTo"] = res.data.dataList[0].contact_person;
        this.state.formFields["preparedBy"] = this.props.tokenDetail.username;
        this.updateState(this.state.formFields);
        console.log("this.state.formFields", this.state.formFields);
      });
  };

  getAutofillItemDetails = () => {
    this.props
      .getCommonApi(
        `quotationdetail/?searchqdetailid=${this.props.match.params.id}`
      )
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
        if (res.status == 200) {
          this.state.formFieldsDetailsStored.q_shipcost =
            res.data[0].q_shipcost;
          this.state.formFieldsDetailsStored.q_discount =
            res.data[0].q_discount;
          this.state.formFieldsDetailsStored.q_taxes = res.data[0].q_taxes;
          this.state.formFieldsDetailsStored.q_total = res.data[0].q_total;
          // this.state.formFieldsDetailsStored.push("q_shipcost":res.data[0].q_shipcost)
          this.setState(this.state.formFieldsDetailsStored);
          console.log(
            "this.state.formFieldsDetailsStored in getAutofillItemDetails",
            this.state.formFieldsDetailsStored
          );
        }
      });

    this.props
      .getCommonApi(
        `quotationitem/?searchqitemid=${this.props.match.params.id}`
      )
      .then(res => {
        console.log("res in getAutofillItemDetails", res);
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
            this.state.itemListBeforeEdit.push({
              item_id: item.id,
              item_code: item.quotation_itemcode,
            });
          }
          this.setState(this.state.storedItemListStored);
          this.setState(this.state.itemListBeforeEdit);
          console.log(
            "this.state.storedItemListStored in getAutofillItemDetails",
            this.state.storedItemListStored
          );
          console.log(
            "this.state.storedItemListStored in itemListBeforeEdit",
            this.state.itemListBeforeEdit
          );
        }
        // this.state.formFieldsDetailsStored.q_shipcost = res.data[0].q_shipcost
        // this.state.formFieldsDetailsStored.q_discount = res.data[0].q_discount
        // this.state.formFieldsDetailsStored.q_taxes = res.data[0].q_taxes
        // this.state.formFieldsDetailsStored.q_total = res.data[0].q_total
        // this.setState(this.state.formFieldsDetailsStored)
      });
  };

  getAutofillAddress = () => {
    this.props
      .getCommonApi(
        `quotationaddr/?searchqaddrid=${this.props.match.params.id}`
      )
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
      "formFieldsBillingStored in addquotation",
      this.state.formFieldsBillingStored
    );
    console.log(
      "formFieldsShippingStored in addquotation",
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
      "storedItemListStored in addquotation",
      this.state.storedItemListStored
    );
    console.log(
      "formFieldsDetailsStored in addquotation",
      this.state.formFieldsDetailsStored
    );
    this.setState(this.state.storedItemListStored);
    this.setState(this.state.formFieldsDetailsStored);
  };

  autoFillForm = () => {
    let { disableEdit, statusOption } = this.state;

    this.props
      .getCommonApi(`quotationlist/?searchid=${this.props.match.params.id}`)
      .then(async res => {
        console.log("quo dataList", res.data.dataList);
        // console.log("quo dataList cust name", res.data.dataList[0].customer_name);
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList
        this.state.formFields["quoNumber"] =
          res.data.dataList[0].quotation_number;
        this.state.formFields["projectTitle"] = res.data.dataList[0].title;
        this.state.formFields["companyName"] = res.data.dataList[0].company;
        this.state.formFields["quoDate"] = res.data.dataList[0].created_at;
        this.state.formFields["validity"] = res.data.dataList[0].validity;
        this.state.formFields["attnTo"] = res.data.dataList[0].contact_person;

        console.log("statusOption in prefill", this.state.statusOption);
        console.log("res.data.dataList[0].status", res.data.dataList[0].status);
        console.log();
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
        this.state.formFields["terms"] = res.data.dataList[0].terms;
        this.state.formFields["preparedBy"] = res.data.dataList[0].in_charge;
        this.state.formFields["remarks"] = res.data.dataList[0].remarks;
        this.state.formFields["footer"] = res.data.dataList[0].footer;
        this.updateState(this.state.formFields);
        console.log("this.state.formFields", this.state.formFields);
      });
  };

  handleItemDetailsSubmit = resQuo => {
    let { storedItemListStored, formFieldsDetailsStored, itemListBeforeEdit } =
      this.state;
    const formDataDetails = new FormData();

    formDataDetails.append(
      "q_shipcost",
      formFieldsDetailsStored.q_shipcost
        ? formFieldsDetailsStored.q_shipcost
        : 0
    );
    formDataDetails.append(
      "q_discount",
      formFieldsDetailsStored.q_discount
        ? formFieldsDetailsStored.q_discount
        : 0
    );
    formDataDetails.append(
      "q_taxes",
      formFieldsDetailsStored.q_taxes ? formFieldsDetailsStored.q_taxes : 0
    );
    formDataDetails.append(
      "q_total",
      formFieldsDetailsStored.q_total ? formFieldsDetailsStored.q_total : 0
    );

    this.props
      .getCommonApi(`quotationdetail/?searchqdetailid=${resQuo.data.id}`)
      .then(resGetDetails => {
        if (resGetDetails.status == 200) {
          console.log("resGetDetails", resGetDetails);
          this.props
            .commonUpdateApi(
              `quotationdetail/${resGetDetails.data[0].id}/`,
              formDataDetails
            )
            .then(resUpdateDetails => {
              console.log("resUpdateDetails", resUpdateDetails);
              this.props.history.push(`/admin/quotation`);
            });
        } else if (resGetDetails.status == 204) {
          formDataDetails.append("fk_quotation", resQuo.data.id);
          this.props
            .commonCreateApi(`quotationdetail/`, formDataDetails)
            .then(resCreateDetails => {
              console.log("resCreateDetails", resCreateDetails);
              this.props.history.push(`/admin/quotation`);
            });
        }
      });

    for (let item of itemListBeforeEdit) {
      let found = storedItemListStored.some(
        el => el.item_code === item.item_code
      );
      if (!found) {
        this.props
          .commonDeleteApi(`quotationitem/${item.item_id}/`)
          .then(res => {});
      }
    }

    for (let item of storedItemListStored) {
      const formDataItem = new FormData();
      formDataItem.append("quotation_itemcode", item.item_code);
      formDataItem.append("quotation_itemdesc", item.item_desc);
      formDataItem.append("quotation_itemremarks", item.item_remarks);
      formDataItem.append("quotation_unitprice", item.item_price);
      formDataItem.append("quotation_quantity", item.item_quantity);

      this.props
        .getCommonApi(
          `quotationitem/?searchqitemid=${resQuo.data.id}&searchqitemcode=${item.item_code}`
        )
        .then(resGetItem => {
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `quotationitem/${resGetItem.data.dataList[0].id}/`,
                formDataItem
              )
              .then(resUpdateItem => {
                console.log("resUpdateItem", resUpdateItem);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("fk_quotation", resQuo.data.id);
            this.props
              .commonCreateApi(`quotationitem/`, formDataItem)
              .then(resCreateItem => {
                console.log("resCreateItem", resCreateItem);
              });
          }
        });
    }
  };

  handleAddressSubmit = resQuo => {
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
    // console.log("countryOption.find(option => option.value === parseInt(this.state.formFieldsBillingStored.country)).label",countryOption.find(option => option.value === parseInt(this.state.formFieldsBillingStored.country)).label)

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
      .getCommonApi(`quotationaddr/?searchqaddrid=${resQuo.data.id}`)
      .then(resGetAddr => {
        if (resGetAddr.status == 200) {
          console.log("resGetAddr", resGetAddr);
          this.props
            .commonUpdateApi(
              `quotationaddr/${resGetAddr.data[0].id}/`,
              formDataAddress
            )
            .then(resUpdateAddr => {
              console.log("resCreateAddr", resUpdateAddr);
            });
        } else if (resGetAddr.status == 204) {
          formDataAddress.append("fk_quotation", resQuo.data.id);
          this.props
            .commonCreateApi(`quotationaddr/`, formDataAddress)
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
        formData.append("quotation_number", formFields.quoNumber);
        formData.append("title", formFields.projectTitle);
        formData.append("company", formFields.companyName);
        formData.append(
          "created_at",
          dateFormat(formFields.quoDate) + " 00:00:00"
        );
        // formData.append("created_at", dateFormat(formFields.quoDate) + " "+formFields.quoDate.getHours() + ":" + formFields.quoDate.getMinutes() + ":" + formFields.quoDate.getSeconds());
        formData.append("validity", formFields.validity);
        formData.append("contact_person", formFields.attnTo);
        //check save or post
        if (status) {
          formData.append("status", "Posted");
        } else {
          formData.append("status", statusValue);
        }
        formData.append("terms", formFields.terms);
        formData.append("in_charge", formFields.preparedBy);
        formData.append("remarks", formFields.remarks);
        formData.append("footer", formFields.footer);
        formData.append("username", this.props.tokenDetail.username);
        if (this.state.fkProject) {
          formData.append("fk_project", this.state.fkProject);
        }
        console.log("this.state.fkProject in updating", this.state.fkProject);

        console.log("formData", formData);
        console.log("this.props.match.params.id", this.props.match.params.id);
        if (this.props.match.params.id) {
          console.log("in if loop");
          console.log("this.props.match.params.id", this.props.match.params.id);
          var resQuo = await this.props.updateQuotation(
            `${this.props.match.params.id}/`,
            formData
          );

          console.log(resQuo);
          await this.handleAddressSubmit(resQuo);
          await this.handleItemDetailsSubmit(resQuo);
          if (statusValue == "Void") {
            console.log("if void loop");
            await this.props.deleteQuotation(`${this.props.match.params.id}/`);
          }

          // await this.props.history.push(
          //   `/admin/quotation`
          // )
        } else {
          console.log("pass if loop");
          console.log("this.props.location.state", this.props.location.state);
          // if (this.props.location.state){
          //   console.log("this.props.location.state.projectFk",this.props.location.state.projectFk)
          //   formData.append("fk_project", this.props.location.state.projectFk);
          // }
          console.log("pass if ?");

          console.log(
            "this.state.fkProject before createPO",
            this.state.fkProject
          );
          console.log("this.state.fkProject", this.state.fkProject);

          var resQuo = await this.props.createQuotation(formData);
          console.log("resQuo in createQuotation", resQuo);
          console.log("resQuo.data.id", resQuo.data.id);

          await this.handleAddressSubmit(resQuo);
          await this.handleItemDetailsSubmit(resQuo);

          // await this.props.history.push(
          //   `/admin/quotation`
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
    let { formFields, statusOption, currentValue, navLinks, disableEdit } =
      this.state;

    let {
      quoNumber,
      projectTitle,
      companyName,
      quoDate,
      validity,
      attnTo,
      status,
      terms,
      preparedBy,
      remarks,
      footer,
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5 container create-quotation">
        <div className="head-label-nav">
          <p className="category">{t("Quotation")}</p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} Quotation`)}
          </p>
        </div>
        <div className="quotation-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row mt-5">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Quotation No")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={true}
                    placeholder="Auto generated"
                    value={quoNumber}
                    name="quoNumber"
                    onChange={this.handleChange}
                  />
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Project")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={disableEdit}
                    placeholder="Enter here"
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

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Company Name")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={disableEdit}
                    placeholder="Enter here"
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
                  {t("Quotation Date")}
                </label>
                <div className="input-group-normal">
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    value={quoDate ? new Date(quoDate) : new Date()}
                    name="quoDate"
                    //className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                    // maxDate={new Date(toDate)}
                    showDisabledMonthNavigation
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Quotation Date"),
                    quoDate,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Validity")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={validity}
                    name="validity"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Validity"),
                    validity,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Attn To")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={attnTo}
                    name="attnTo"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(t("Attn To"), attnTo, t("required"))}
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
                  {t("Terms")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={terms}
                    name="terms"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(t("Terms"), terms, t("required"))}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Prepared By")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={preparedBy}
                    name="preparedBy"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Prepared By"),
                    preparedBy,
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
                    value={remarks}
                    name="remarks"
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Footer")}
                </label>
                <div className="input-group-desc">
                  <NormalTextarea
                    placeholder="Enter here"
                    disabled={disableEdit}
                    value={footer}
                    name="footer"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 quotation-content">
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
              {this.state.selectedMenu === "Details" && (
                <Details
                  disableEdit={disableEdit}
                  quoId={this.props.match.params.id}
                  siteGstList={this.state.siteGstList}
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

            <div className="row">
              <div className="col-md-4 col-12 mt-3"></div>

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
                      this.props.history.push(`/admin/quotation`);
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

              {disableEdit == true ? (
                <div className="col-md-2 col-12 mt-3">
                  <NormalButton
                    buttonClass={"mx-2"}
                    mainbg={true}
                    className="confirm"
                    label="Convert to PO"
                    onClick={() =>
                      this.props.history.push({
                        pathname: "/admin/po/add",
                        state: {
                          quoId: this.props.match.params.id,
                          projectFk: this.state.fkProject,
                        },
                      })
                    }
                  />
                </div>
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
      createQuotation,
      updateQuotation,
      deleteQuotation,
      commonDeleteApi,
      getTokenDetails,
    },
    dispatch
  );
};

export const AddQuotation = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddQuotationClass)
);
