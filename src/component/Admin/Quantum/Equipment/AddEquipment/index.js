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

import { Details } from "./details";
import {
  createequipment,
  updateequipment,
  deleteequipment,
} from "redux/actions/equipment";
import { getTokenDetails } from "redux/actions/auth";
import { history } from "helpers";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "component/Admin/Report/Account/Invoice";

export class AddEquipmentClass extends Component {
  state = {
    modalOpenItemDetails: false,
    salesStaff: "",
    salesStaffOption: [],
    formFields: {
      eq_number: "",
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
      element: (message) => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };

  componentDidMount = () => {
    this.getSalesStaff();

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
    this.getSalesStaff();
  }

  dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    };
  }
  getSalesStaff = () => {
    let { salesStaffOption } = this.state;
    this.props
      .getCommonApi(`employeelist`)
      .then((res) => {
        // activeMenu = []
        console.log("res.data", res);
        let sortedSalesStaffList = res.data.sort(
          this.dynamicSort("Emp_name")
        );
        for (let key of sortedSalesStaffList) {
          salesStaffOption.push({
            // id: key.id,
            value: key.Emp_no,
            label: key.Emp_name,
            // pic: key.emp_pic,
          });
        }
        console.log("salesStaffOption", salesStaffOption);
        this.updateState({ salesStaffOption });

        // if (this.props.match.params.id) {
        //   this.autofillSaved();
        // }
      });
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  handleClick = async (key) => {
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

    if (name == "salesStaff") {
      this.setState({ salesStaff: value });
    }

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
      .then((res) => {
        console.log("res.data getSiteGst", res.data.dataList);
        siteGstList = res.data.dataList;
        this.setState({ siteGstList });
      });
  };

  getStatus = () => {
    let { statusOption } = this.state;
    statusOption = [
      { value: 1, label: "Issued" },
      { value: 2, label: "Returned" },
    ];
    console.log("sdfsdhfghjghj", this.props);
    // this.props.getCommonApi(`dropdown`).then((res) => {
    //   console.log("res.data", res);
    //   for (let key of res.data) {
    //     statusOption.push({
    //       value: key.id,
    //       label: key.dropdown_item,
    //       code: key.dropdown_desc,
    //       active: key.active,
    //     });
    //   }
    //   if (!this.props.match.params.id) {
    //     for (var i = 0; i < statusOption.length; i++) {
    //       if (statusOption[i].label == "Void") {
    //         statusOption.splice(i, 1);
    //       }
    //     }
    //   }
    //   console.log("statusOption", statusOption);
    // });
    this.setState({ statusOption });
    if (this.props.match.params.id) {
      this.autoFillForm();
    }
    if (this.props.tokenDetail) {
      this.getSiteGst();
    }
  };

  getCountry = () => {
    let { countryOption } = this.state;
    countryOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`country`).then((res) => {
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
    this.props.getCommonApi(`state`).then((res) => {
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
    this.props.getCommonApi(`city`).then((res) => {
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

  getCity = () => {
    let { cityOption } = this.state;
    cityOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`city`).then((res) => {
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

  autofillFromProject = () => {
    let { fkProject } = this.state;
    console.log("fkProject in autofill", fkProject);
    console.log("this.props.tokenDetail", this.props.tokenDetail);
    this.props
      .getCommonApi(`projectlist/?searchid=${fkProject}`)
      .then(async (res) => {
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
        `equipmentusagelist/?searchqdetailid=${this.props.match.params.id}`
      )
      .then((res) => {
        console.log("res in getAutofillItemDetails", res);
        debugger;
        if (res.status == 200) {
          this.setState(this.state.formFieldsDetailsStored);
          console.log(
            "this.state.formFieldsDetailsStored in getAutofillItemDetails",
            this.state.formFieldsDetailsStored
          );
        }
      });

    this.props
      .getCommonApi(
        `equipmentusageitem/?searchqitemid=${this.props.match.params.id}`
      )
      .then((res) => {
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
      });
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

    console.log(statusOption, "😂😂🟢🟢🔴🔴");

    this.props
      .getCommonApi(
        `equipmentusagelist/?searchid=${this.props.match.params.id}`
      )
      .then(async (res) => {
        console.log("quo dataList", res.data.dataList);
        // console.log("quo dataList cust name", res.data.dataList[0].customer_name);
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList

        this.state.formFields["eq_number"] = res.data.dataList[0].eq_number;
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
            (option) => option.label == res.data.dataList[0].status
          ).value;
          console.log(
            "res.data.dataList[0].status",
            res.data.dataList[0].status
          );
          if (res.data.dataList[0].status == "Returned") {
            disableEdit = true;

            for (var i = 0; i < statusOption.length; i++) {
              if (statusOption[i].label == "Returned") {
                statusOption = statusOption.filter((e) => e.label !== "Issued");
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

  handleItemDetailsSubmit = (resQuo) => {
    let { storedItemListStored, formFieldsDetailsStored, itemListBeforeEdit } =
      this.state;
    const formDataDetails = new FormData();

    // this.props
    //   .getCommonApi(`equipmentusageitem/?searchqdetailid=${resQuo.data.id}`)
    //   .then((resGetDetails) => {
    //     if (resGetDetails.status == 200) {
    //       console.log("resGetDetails", resGetDetails);
    //       this.props
    //         .commonUpdateApi(
    //           `equipmentusageitem/${resGetDetails.data.dataList[0].id}/`,
    //           formDataDetails
    //         )
    //         .then((resUpdateDetails) => {
    //           console.log("resUpdateDetails", resUpdateDetails);
    //           history.push(`/admin/quantum`);
    //         });
    //     } else if (resGetDetails.status == 204) {
    //       formDataDetails.append("eq_number", resQuo.data.id);
    //       this.props
    //         .commonCreateApi(`equipmentusageitem/`, formDataDetails)
    //         .then((resCreateDetails) => {
    //           console.log("resCreateDetails", resCreateDetails);
    //           history.push(`/admin/quantum`);
    //         });
    //     }
    //   });

    for (let item of itemListBeforeEdit) {
      let found = storedItemListStored.some(
        (el) => el.item_code === item.item_code
      );
      if (!found) {
        this.props
          .commonDeleteApi(`equipmentusageitem/${item.item_id}/`)
          .then((res) => { });
      }
    }
    for (let item of storedItemListStored) {
      console.log(item, "INSIDE FOR LOOPITEMDETAIL");
      const formDataItem = new FormData();
      formDataItem.append("quotation_itemcode", item.item_code);
      formDataItem.append("quotation_itemdesc", item.item_desc);
      formDataItem.append("quotation_itemremarks", item.item_remarks);
      formDataItem.append("quotation_unitprice", item.item_price);
      formDataItem.append("quotation_quantity", item.item_quantity);
      formDataItem.append("item_uom", item.item_uom);
      formDataItem.append("item_div", item.item_quantity);
      formDataItem.append("Item_Codeid", item.item_codeid);

      this.props
        .getCommonApi(
          `equipmentusageitem/?searchqitemid=${resQuo.data.id}&searchqitemcode=${item.item_code}`
        )
        .then((resGetItem) => {
          if (resGetItem.status == 200) {
            console.log("resGetItem", resGetItem);
            this.props
              .commonUpdateApi(
                `equipmentusageitem/${resGetItem.data.dataList[0].id}/`,
                formDataItem
              )
              .then((resUpdateItem) => {
                console.log("resUpdateItem", resUpdateItem);
                history.push(`/admin/quantum`);
              });
          } else if (resGetItem.status == 204) {
            formDataItem.append("fk_equipment", resQuo.data.id);
            this.props
              .commonCreateApi(`equipmentusageitem/`, formDataItem)
              .then((resCreateItem) => {
                console.log("resCreateItem", resCreateItem);
                history.push(`/admin/quantum`);
              });
          }
        });
    }
  };

  handleSubmit = async (status) => {
    if (!this.state.salesStaff) {

      alert("Please Select Sales Staff")
    }
    debugger;
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
        formData.append("eq_number", formFields.eq_number);
        formData.append("title", formFields.projectTitle);
        formData.append("company", formFields.companyName);
        formData.append("emp_id", this.state.salesStaff);
        formData.append(
          "created_at",
          dateFormat(formFields.quoDate) + " 00:00:00"
        );
        // formData.append("created_at", dateFormat(formFields.quoDate) + " "+formFields.quoDate.getHours() + ":" + formFields.quoDate.getMinutes() + ":" + formFields.quoDate.getSeconds());
        formData.append("validity", formFields.validity);
        formData.append("contact_person", formFields.attnTo);
        //check save or post
        if (status) {
          formData.append("status", "Returned");
        } else {
          if (this.props.match.params.id) {
            formData.append("status", statusValue);
          } else {
            formData.append("status", "Issued");
          }
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
          var resQuo = await this.props.commonUpdateApi(
            `equipmentusagelist/${this.props.match.params.id}/`,
            formData
          );

          console.log(resQuo, "resquo");

          await this.handleItemDetailsSubmit(resQuo);
          if (statusValue == "Void") {
            console.log("if void loop");
            await this.props.deleteequipment(`${this.props.match.params.id}/`);
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

          var resQuo = await this.props.createequipment(formData);
          console.log("resQuo in createQuotation", resQuo);
          console.log("resQuo.data.id", resQuo.data.id);

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
    let {
      formFields,
      statusOption,
      currentValue,
      navLinks,
      disableEdit,
      salesStaffOption,
    } = this.state;

    let {
      eq_number,
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
          <p
            className="category"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to leave this page and discard changes?"
                )
              )
                history.push(`/admin/quantum`);
            }}
          >
            {t(" Equipment")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(
              `${this.props.match.params.id ? "Edit Issue" : "Issue"} Equipment`
            )}
          </p>
        </div>
        <div className="quotation-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row mt-5">
              <div className="col-12 d-flex">
                <label className="text-left text-black common-label-text fs-17 pt-3 col-md-4 col-4">
                  Sales Staff
                </label>
                <div className="input-group-normal col-md-8 col-8">
                  <NormalSelect
                    options={salesStaffOption}
                    value={this.state.salesStaff}
                    name="salesStaff"
                    onChange={this.handleChange}
                    disabled={disableEdit}
                  />
                </div>
              </div>
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Invoice No")}
                </label>
                <div className="input-group-normal">
                  <NormalInput
                    disabled={true}
                    placeholder="Auto generated"
                    value={eq_number}
                    name="eq_number"
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
                  {t("Invoice Date")}
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
                    t("Invoice Date"),
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
                  {this.props.match.params.id ? (
                    disableEdit ? (
                      <NormalInput
                        placeholder="Returned"
                        disabled={true}
                        value={"Returned"}
                      />
                    ) : (
                      <NormalSelect
                        options={statusOption}
                        value={status}
                        name="status"
                        onChange={this.handleChange}
                        disabled={disableEdit}
                      />
                    )
                  ) : (
                    <NormalInput
                      placeholder="Returned"
                      disabled={true}
                      value={"Issued"}
                      name="status"
                      onChange={this.handleChange}
                    />
                  )}
                </div>
                {this.props.match.params.id && (
                  <div>
                    {this.validator.message(t("Status"), status, t("required"))}
                  </div>
                )}

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
              {/* <div className="tab-menus">
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
              </div> */}
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
            </div>

            <div className="row">
              <div className="col-md-8 col-12 mt-3"></div>

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
                      history.push(`/admin/quantum`);
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
              {/* <div className="col-md-2 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  mainbg={true}
                  className="confirm"
                  label="Post"
                  outline={false}
                  onClick={() => this.handleSubmit(status)}
                />
              </div> */}
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tokenDetail: state.authStore.tokenDetails,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      commonUpdateApi,
      createequipment,
      updateequipment,
      deleteequipment,
      commonDeleteApi,
      getTokenDetails,
    },
    dispatch
  );
};

export const AddEquipment = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddEquipmentClass)
);
