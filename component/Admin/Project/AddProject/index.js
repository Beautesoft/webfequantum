import React, { Component } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { Redirect } from "react-router-dom";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalTextarea,
  NormalDateTime,
  NormalMultiSelect,
  NormalModal,
} from "component/common";
import { displayImg, dateFormat } from "service/helperFunctions";
// import { DragFileUpload } from "../../../common";
import { createProject, updateProject } from "redux/actions/project";
import { getJobtitle, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FormGroup, Label, Input } from "reactstrap";
// import { ScheduleTable } from "./ScheduleTable";
import { withTranslation } from "react-i18next";
import { Activities } from "./activities";
import { Quotation } from "./quotation";
import { PO } from "./PO";
import { NavLink } from "react-router-dom";
import { getTokenDetails } from "redux/actions/auth";
import addBtn from "assets/images/add.png";
import _ from "lodash";
export class AddProjectClass extends Component {
  state = {
    formFields: {
      projectTitle: "",
      projectDesc: "",
      status: "",
      salesStaff: "",
      operationStaff: "",
      adminStaff: "",
      custName: "",
      contactName: "",
      contactNumber: "",
      addSalesStaff: "",
      addOperationStaff: "",
      addAdminStaff: "",
      custCorporate:false,
      contactPerson:[]
      
    },
    // scheduleOptions: [],

    projectList: [],
    statusOption: [],
    salesStaffOption: [],
    operationStaffOption: [],
    adminStaffOption: [],
    salesStaffTag: [],
    operationStaffTag: [],
    adminStaffTag: [],
    // locationOption: [],
    // levelList: [],
    is_loading: true,
    isMounted: true,

    active: false,
    isModalVisible: false,
    isModalVisibleOperation: false,
    isModalVisibleAdmin: false,

    currentValue: 0,
    // navLinks: [
    //   { to: "/admin/project/add", label: "Activities", id: "Activities" },
    //   { to: "/admin/project/add", label: "Quotation", id: "Quotation" },
    //   { to: "/admin/project/add", label: "Purchase Order", id: "PO" },
    // ],
    navLinks: [
      {
        to: this.props.location.pathname,
        label: "Activities",
        id: "Activities",
      },
      { to: this.props.location.pathname, label: "Quotation", id: "Quotation" },
      { to: this.props.location.pathname, label: "Purchase Order", id: "PO" },
    ],
    selectedMenu: "Activities",
    visible:false,
    customerOption: []
  };

  componentWillMount = () => {
    this.getStatus();
    this.getSalesStaff();
    this.getOperationStaff();
    this.getAdminStaff();
    // console.log("componentWillMount statusoption",this.state.statusOption )
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

  componentDidMount() {}

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  getStatus = () => {
    let { statusOption } = this.state;
    console.log("this.props addpro", this.props);
    console.log(
      "this.props.match.params.id addpro",
      this.props.match.params.id
    );
    // statusOption = [];
    this.props.getCommonApi(`dropdownproject`).then((res) => {
      // activeMenu = []
      console.log("res.data", res);
      for (let key of res.data) {
        statusOption.push({
          value: key.id,
          label: key.dropdown_item,
          code: key.dropdown_desc,
          active: key.active,
        });
      }
      console.log("statusOption", statusOption);
      this.updateState({ statusOption });

      if (this.props.match.params.id) {
        this.autoFillForm();
      }
    });
  };

  getSalesStaff = () => {
    let { salesStaffOption } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=1&page=1&limit=1000`)
      .then((res) => {
        // activeMenu = []
        console.log("res.data", res);
        for (let key of res.data.dataList) {
          salesStaffOption.push({
            id: key.id,
            value: key.emp_name,
            label: key.emp_name,
            pic: key.emp_pic,
          });
        }
        console.log("salesStaffOption", salesStaffOption);
        this.updateState({ salesStaffOption });

        if (this.props.match.params.id) {
          this.autoFillForm();
        }
      });
  };
  getOperationStaff = () => {
    let { operationStaffOption } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=2&page=1&limit=1000`)
      .then((res) => {
        // activeMenu = []
        console.log("res.data", res);
        for (let key of res.data.dataList) {
          operationStaffOption.push({
            id: key.id,
            value: key.emp_name,
            label: key.emp_name,
            pic: key.emp_pic,
          });
        }
        console.log("operationStaffOption", operationStaffOption);
        this.updateState({ operationStaffOption });

        if (this.props.match.params.id) {
          this.autoFillForm();
        }
      });
  };
  getAdminStaff = () => {
    let { adminStaffOption } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=0&page=1&limit=1000`)
      .then((res) => {
        // activeMenu = []
        console.log("res.data", res);
        for (let key of res.data.dataList) {
          adminStaffOption.push({
            id: key.id,
            value: key.emp_name,
            label: key.emp_name,
            pic: key.emp_pic,
          });
        }
        console.log("adminStaffOption", adminStaffOption);
        this.updateState({ adminStaffOption });

        if (this.props.match.params.id) {
          this.autoFillForm();
        }
      });
  };

  handleToogleModal = () => {
    let { isModalVisible } = this.state;
    isModalVisible = !isModalVisible;
    this.setState({
      isModalVisible,
    });
  };
  handleToogleModalOperation = () => {
    let { isModalVisibleOperation } = this.state;
    isModalVisibleOperation = !isModalVisibleOperation;
    this.setState({
      isModalVisibleOperation,
    });
  };
  handleToogleModalAdmin = () => {
    let { isModalVisibleAdmin } = this.state;
    isModalVisibleAdmin = !isModalVisibleAdmin;
    this.setState({
      isModalVisibleAdmin,
    });
  };
  autoFillForm = () => {
    // let { statusOption } = this.state;

    this.props
      .getCommonApi(`projectlist/?searchid=${this.props.match.params.id}`)
      .then(async (res) => {
        console.log("project dataList", res.data.dataList);
        console.log(
          "project dataList cust name",
          res.data.dataList[0].customer_name
        );
        // custName = res.data.dataList[0].customer_name
        // this.state.projectList = res.data.dataList
        this.state.formFields["projectTitle"] = res.data.dataList[0].title;
        this.state.formFields["projectDesc"] = res.data.dataList[0].desc;
        // const people = [ {name: "john", age:23},
        //         {name: "john", age:43},
        //         {name: "jim", age:101},
        //         {name: "bob", age:67} ];

        //   // const john = people.find(person => person.name === john);
        // console.log("people testing",people.find(person => person.name === "john"));
        // const statusOPtionLoop = this.state.statusOption
        // console.log("statusOPtionLoop",statusOPtionLoop[0])
        // for (let x in statusOPtionLoop){
        //   console.log("statusOPtionLoop elements", x)
        // }
        // console.log("statusOPtionLoop",statusOPtionLoop.find((person => person.label === "Lead")))
        // console.log("statusOptionTemp",statusOptionTemp)
        // console.log("statusOptionTemp[0]",statusOptionTemp[0])
        console.log("statusOption in prefill", this.state.statusOption);
        console.log("res.data.dataList[0].status", res.data.dataList[0].status);
        this.setState({
          adminStaffTag: JSON.parse(res.data.dataList[0].admin_staff),
        });
        this.setState({
          operationStaffTag: JSON.parse(res.data.dataList[0].operation_staff),
        });
        this.setState({
          salesStaffTag: JSON.parse(res.data.dataList[0].sales_staff),
        });
        // if status empty prevent err
        if (res.data.dataList[0].status) {
          //matching status name with the id to set prefill status in dropdown
          this.state.formFields["status"] = this.state.statusOption.find(
            (option) => option.label === res.data.dataList[0].status
          ).value;
        }
        this.state.formFields["custName"] = res.data.dataList[0].customer_name;
        this.state.formFields["contactName"] =
          res.data.dataList[0].contact_person;
        this.state.formFields["contactNumber"] =
          res.data.dataList[0].contact_number;
        this.updateState(this.state.formFields);
        console.log("this.state.formFields", this.state.formFields);
      });
  };

  handleSearch = async event => {
    //    event.persist();
    let { formFields, visible } = this.state;
    formFields["custName"] = event.target.value;
    visible = true;
     this.setState({ formFields, visible });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {        
        let { basicApptDetail } = this.props;
        this.search(basicApptDetail);
      }, 500);
    }
    this.debouncedFn();
  };
  handleSearchClick = key => {
    if (!this.state.visible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    if (this.state.visible) {
      this.search();
    }
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  };

  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleSearchClick();
  };
  search = () => {
    let { formFields } = this.state;
    this.props
      .getCommonApi(
        `custappt/?search=${formFields.custName}`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {          
          this.setState({ customerOption: data });
        }
      });
  };
  handleSelectCustomer = async data => {
    let { formFields } = this.state;    
    formFields["custName"] = data.cust_name;
    formFields["custCorporate"]=data.cust_corporate    
    formFields["contactPerson"]=data.contactperson
    if(!data.cust_corporate){
    formFields["contactName"] = data.cust_name;
    formFields["contactNumber"] = data.cust_phone2;
    }
    this.setState({ formFields, customerOption: [] });
    this.handleSearchClick();
  };


  handleClick = async (key) => {
    let { active, currentValue } = this.state;
    await this.updateState({
      selectedMenu: key.id,
    });
    this.updateState({
      active: true,
      currentValue: key.key,
      selected: key.id,
    });
  };

  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    if (name == "salesStaff") {
      let checkSameName =this.state.salesStaffTag&& this.state.salesStaffTag.filter(
        (tag) => tag === value
      );
      if (checkSameName && checkSameName == value) {
        alert("This Member already exist");
      } else {
        if(this.state.salesStaffTag){

          this.setState({ salesStaffTag: [value, ...this.state.salesStaffTag] });
        }else{
          this.setState({ salesStaffTag: [value] });

        }
      }
    } else if (name == "operationStaff") {
      let checkSameName =this.state.operationStaffTag&& this.state.operationStaffTag.filter(
        (tag) => tag === value
      );
      if (checkSameName && checkSameName == value) {
        alert("This Member already exist");
      } else {
        if(this.state.operationStaffTag){

          this.setState({
            operationStaffTag: [value, ...this.state.operationStaffTag],
          });
        }else{
          
                    this.setState({
                      operationStaffTag: [value],
                    });

        }
      }
    } else if (name == "adminStaff") {
      let checkSameName =this.state.adminStaffTag&& this.state.adminStaffTag.filter(
        (tag) => tag === value
      );
      if (checkSameName && checkSameName == value) {
        alert("This Member already exist");
      } else {
        if(this.state.adminStaffTag){

          this.setState({ adminStaffTag: [value, ...this.state.adminStaffTag] });
        }else{
          this.setState({ adminStaffTag: [value] });

        }
      }
    } else {
      formFields[name] = value;

      this.updateState({
        formFields,
      });
    }
  };

  // handleMultiSelect = (data = []) => {
  //   let { formFields } = this.state;
  //   formFields.siteCodes = data;
  //   console.log(data);
  //   this.updateState({ formFields });
  // };

  // handleDatePick = async (name, value) => {
  //   // dateFormat(new Date())
  //   let { formFields } = this.state;
  //   formFields[name] = value;
  //   // formFields[name] = value;
  //   await this.updateState({
  //     formFields,
  //   });
  // };

  // handleInput = ({ target: { name, value } }) => {
  //   let formFields = Object.assign({}, this.state.formFields);
  //   formFields[name] = value === true ? 1 : value;
  //   this.updateState({
  //     formFields,
  //   });
  // };

  // submit to create/update project
  handleSubmit = async () => {
    try {
      if (this.validator.allValid()) {
        //   this.updateState({ is_loading: true });
        //   let { formFields } = this.state;
        //   Object.keys(formFields).forEach((e) => {
        //     if (typeof formFields[e] === "boolean")
        //       formFields[e] = formFields[e] ? "True" : "False";
        //   });
        let { formFields, statusOption } = this.state;
        let statusValue = "";
        console.log("formFields", formFields);

        for (let key of statusOption) {
          // console.log(key.value)
          if (key.value == formFields.status) {
            statusValue = key.label;
          }
        }
        console.log("statusValue", statusValue);
        const formData = new FormData();
        formData.append("title", formFields.projectTitle);
        formData.append("desc", formFields.projectDesc);
        formData.append("status", statusValue);
        formData.append("customer_name", formFields.custName);
        formData.append("contact_person", formFields.contactName);
        formData.append("contact_number", formFields.contactNumber);
        formData.append("username", this.props.tokenDetail.username);
        formData.append(
          "sales_staff",
          JSON.stringify(this.state.salesStaffTag)
        );
        formData.append(
          "operation_staff",
          JSON.stringify(this.state.operationStaffTag)
        );
        formData.append(
          "admin_staff",
          JSON.stringify(this.state.adminStaffTag)
        );
        console.log("formData", formData);
        if (this.props.match.params.id) {
          console.log("in if loop");
          console.log("this.props.match.params.id", this.props.match.params.id);
          var res = await this.props.updateProject(
            `${this.props.match.params.id}/`,
            formData
          );
          console.log(res);
          this.props.history.push(`/admin/project`);
        } else {
          var res = await this.props.createProject(formData);
          this.props.history.push(`/admin/project`);
        }

        // if (
        //   formFields.emp_pic != null &&
        //   typeof formFields.emp_pic === "object"
        // )
        //   formData.append("emp_pic", formFields.emp_pic);
        // formData.append("emp_nric", formFields.emp_nric);
        // formData.append("is_login", formFields.is_login);
        // formData.append("emp_isactive", formFields.emp_isactive);
        // formData.append("max_disc", formFields.max_disc);
        // formData.append("LEVEL_ItmIDid", formFields.LEVEL_ItmIDid);
        // formData.append("show_in_sales", formFields.show_in_sales);
        // formData.append("show_in_appt", formFields.show_in_appt);
        // formData.append("show_in_trmt", formFields.show_in_trmt);
        // formData.append(
        //   "site_list",
        //   formFields.siteCodes.map((e) => e.value).reduce((a, e) => a + "," + e)
        // );
        // const scheduleData = new FormData();
        // scheduleData.append("monday", formFields.work_schedule.monday);
        // scheduleData.append("tuesday", formFields.work_schedule.tuesday);
        // scheduleData.append("wednesday", formFields.work_schedule.wednesday);
        // scheduleData.append("tuesday", formFields.work_schedule.tuesday);
        // scheduleData.append("friday", formFields.work_schedule.friday);
        // scheduleData.append("saturday", formFields.work_schedule.saturday);
        // scheduleData.append("sunday", formFields.work_schedule.sunday);
        // if (this.props.match.params.id) {
        //   var res = await this.props.updateStaffPlus(
        //     `${this.props.match.params.id}/`,
        //     formData
        //   );
        //   console.log(res);
        //   if (res.status === 200) {
        //     await this.props.updateWorkSchedule(
        //       this.props.match.params.id,
        //       scheduleData
        //     );
        //   }
        //   await this.getStaffDetail();
        // } else {
        //   var res = await this.props.createStaffPlus(formData);
        //   console.log(res);
        //   if (res.status === 201) {
        //     var res2 = await this.props.updateWorkSchedule(
        //       res.data.id,
        //       scheduleData
        //     );
        //     if (res2.status === 200)
        //       this.props.history.push(
        //         `/admin/staffPlus/${res.data.id}/editStaff`
        //       );
        //   }
        // }
      } else {
        this.validator.showMessages();
      }
      // this.updateState({ is_loading: false });
    } catch (e) {
      this.updateState({ is_loading: false });
    }
  };

  handleFilterTag = (e, data, tagName) => {
    if (tagName == "salesStaffTag") {
      this.setState({
        salesStaffTag: this.state.salesStaffTag.filter((tag) => tag !== data),
      });
    } else if (tagName == "operationStaffTag") {
      this.setState({
        operationStaffTag: this.state.operationStaffTag.filter(
          (tag) => tag !== data
        ),
      });
    } else if (tagName == "adminStaffTag") {
      this.setState({
        adminStaffTag: this.state.adminStaffTag.filter((tag) => tag !== data),
      });
    }
  };

  render() {
    let {
      formFields,
      navLinks,
      currentValue,
      statusOption,
      salesStaffOption,
      operationStaffOption,
      adminStaffOption,
      salesStaffTag,
      operationStaffTag,
      adminStaffTag,
      customerOption, 
      visible
    } = this.state;
    console.log(salesStaffTag, "i am status option ");
    let {
      projectTitle,
      projectDesc,
      status,
      salesStaff,
      operationStaff,
      adminStaff,
      custName,
      contactName,
      contactNumber,
      custCorporate,
      contactPerson
    } = formFields;

    let { t } = this.props;
    return (
      <div className="px-5 container create-project">
        {/* <p className="list-heading pb-4"> {id ? "Edit" : "Add"} Staff</p> */}
        <div className="head-label-nav">
          <p
            className="category"
            onClick={() => this.props.history.push(`/admin/project`)}
          >
            {t("Project")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(`${this.props.match.params.id ? "Edit" : "New"} Project`)}
          </p>
        </div>
        {/* {is_loading ? (
          <div class="d-flex mt-5 align-items-center justify-content-center">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : ( */}
        <div className="quotation-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row mt-5">
              <div className="col-md-6 col-12 mb-4">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Project Title")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={projectTitle}
                    name="projectTitle"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Project Title"),
                    projectTitle,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Project Description")}
                </label>
                <div className="input-group-desc">
                  <NormalTextarea
                    placeholder="Enter here"
                    value={projectDesc}
                    name="projectDesc"
                    onChange={this.handleChange}
                  />
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3  d-flex justify-content-between align-items-center w-100">
                  {t("Sales Staff")}

                  <img
                    src={addBtn}
                    width="35"
                    height="35"
                    alt=""
                    className="action-img bg-transparent"
                    onClick={this.handleToogleModal}
                  />
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={salesStaffOption}
                    value={salesStaff}
                    name="salesStaff"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                  {this.validator.message(t("Status"), status, t("required"))}
                </div> */}
                <div
                  className="input-group mt-2 d-flex mb-4"
                  style={{ overflowX: "scroll", flexWrap: "nowrap" }}
                >
                  {salesStaffTag &&
                    salesStaffTag.map((data, key) => {
                      return (
                        <p
                          className="mr-3  bg-primary p-1 mb-1 px-3 rounded-2xl text-white text-center rounded"
                          key={key}
                          onClick={(e) =>
                            this.handleFilterTag(e, data, "salesStaffTag")
                          }
                        >
                          {data},
                        </p>
                      );
                    })}
                </div>

                {/* <div>
                  {this.validator.message(t("Status"), status, t("required"))}
                </div> */}

                <label className="text-left text-black common-label-text fs-17 pt-3  d-flex justify-content-between align-items-center w-100">
                  {t("Admin Staff")}

                  <img
                    src={addBtn}
                    width="35"
                    height="35"
                    alt=""
                    className="action-img bg-transparent"
                    onClick={this.handleToogleModalAdmin}
                  />
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={adminStaffOption}
                    value={adminStaff}
                    name="adminStaff"
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div>
                  {this.validator.message(t("Status"), status, t("required"))}
                </div> */}
                <div
                  className="input-group mt-2 mt-1 d-flex"
                  style={{ overflowX: "scroll", flexWrap: "nowrap" }}
                >
                  {adminStaffTag &&
                    adminStaffTag.map((data, key) => {
                      return (
                        <p
                          className="mr-3  bg-primary p-1 mb-1 px-3 rounded-2xl text-white text-center rounded"
                          key={key}
                          onClick={(e) =>
                            this.handleFilterTag(e, data, "adminStaffTag")
                          }
                        >
                          {data}
                        </p>
                      );
                    })}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Status")}
                </label>
                <div className="input-group">
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
              </div>

              <div className="col-md-6 col-12">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Customer")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={custName}
                    name="custName"
                    onChange={this.handleSearch}
                    onClick={this.handleSearchClick}
                  />
                </div>
                
{visible? (
              <div className="customerSearch-block">
                <div className="d-flex mt-3 table table-header w-100 m-0">
                  <div className="col-2">{t("Name")}</div>
                  <div className="col-2">{t("Phone")}</div>
                  <div className="col-2">{t("Customer Code")}</div>
                  <div className="col-2">{t("Reference")}</div>
                  <div className="col-3">{t("Email")}</div>
                  <div className="col-1">{t("NRIC")}</div>
                </div>
                <div className="response-table w-100 row">
                  {console.log(customerOption, "customer search result")}
                  {customerOption.length > 0 ? (
                    customerOption.map((item, index) => {
                      return (
                        <div
                          className="row m-0 table-body w-100 border"
                          onClick={() => this.handleSelectCustomer(item)
                          }
                          key={index}
                        >
                          <div className="col-2">{item.cust_name}</div>
                          <div className="col-2">{item.cust_phone1}</div>
                          <div className="col-2">{item.cust_code}</div>
                          <div className="col-2">{item.cust_refer}</div>
                          <div className="col-3">{item.cust_email}</div>
                          <div className="col-1">{item.cust_nric}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center w-100">
                      {t("No Data Available")}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
                <div>
                  {this.validator.message(
                    t("Customer"),
                    custName,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Contact Person")} {contactName}
                </label>
                <div className="input-group"> 
                  {!custCorporate?
                  <NormalInput
                    placeholder="Enter here"
                    value={contactName}
                    name="contactName"
                    onChange={this.handleChange}
                  />:<NormalSelect
                  options={contactPerson.map(x=>{return{id:x.name,value:x.name,label:x.name}})}
                  value={contactName}
                  name="contactName"
                  onChange={(event)=>{let formFields=this.state.formFields; formFields.contactName=event.target.value;formFields.contactNumber=contactPerson.find(x=>x.name==event.target.value).mobile_phone;this.setState({formFields})}}
                />
                
                }
                </div>
                <div>
                  {this.validator.message(
                    t("Contact Person"),
                    contactName,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Contact Number")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={contactNumber}
                    name="contactNumber"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {this.validator.message(
                    t("Contact Number"),
                    contactNumber,
                    t("required")
                  )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-3  d-flex justify-content-between align-items-center w-100">
                  {t("Operations Staff")}

                  <img
                    src={addBtn}
                    width="35"
                    height="35"
                    alt=""
                    className="action-img bg-transparent"
                    onClick={this.handleToogleModalOperation}
                  />
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={operationStaffOption}
                    value={operationStaff}
                    name="operationStaff"
                    onChange={this.handleChange}
                  />
                </div>
                <div
                  className="input-group mt-2 mt-1 d-flex"
                  style={{ overflowX: "scroll", flexWrap: "nowrap" }}
                >
                  {operationStaffTag &&
                    operationStaffTag.map((data, key) => {
                      return (
                        <p
                          className="mr-3  bg-primary p-1 mb-1 px-3 rounded-2xl text-white text-center rounded"
                          key={key}
                          onClick={(e) =>
                            this.handleFilterTag(e, data, "operationStaffTag")
                          }
                        >
                          {data},
                        </p>
                      );
                    })}
                </div>
              </div>

              {/* <div className="col-6 mb-3">
                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    {t("Join Date")}
                  </label>
                  <div className="input-group">
                    <NormalDateTime
                      onChange={this.handleDatePick}
                      inputcol="p-0 inTime"
                      value={emp_joindate}
                      name="emp_joindate"
                      className="dob-pick"
                      showYearDropdown={true}
                      dateFormat="MM/dd/yyyy"
                    />
                  </div>
                  {this.validator.message(
                    t("join date"),
                    emp_joindate,
                    t("required")
                  )}
                </div> */}
              {this.props.match.params.id && (
                <div className="col-md-12 project-content">
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
                              <span className="sidebar-menu-desc">
                                {t(label)}
                              </span>
                            </div>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {this.state.selectedMenu === "Activities" && (
                    <Activities
                      fk_id={this.props.match.params.id}
                      id={this.state.selectedMenu}
                      // search={formFields.search}
                      api={"activities"}
                    />
                  )}
                  {this.state.selectedMenu === "Quotation" && (
                    <Quotation
                      fk_id={this.props.match.params.id}
                      id={this.state.selectedMenu}
                      // search={formFields.search}
                      api={"quotation"}
                    />
                  )}
                  {this.state.selectedMenu === "PO" && (
                    <PO
                      fk_id={this.props.match.params.id}
                      id={this.state.selectedMenu}
                      // search={formFields.search}
                      api={"po"}
                    />
                  )}
                </div>
              )}

              <div className="col-md-4 col-12 mt-3"></div>

              <div className="col-md-4 col-12 mt-3">
                {/* <Link to="/admin/project"> */}
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
                      // window.location.href = '/admin/project'
                      this.props.history.push(`/admin/project`);
                  }}
                  // onClick={this.handleSearch}
                />
                {/* </Link> */}
              </div>

              <div className="col-md-4 col-12 mt-3">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  onClick={() => this.handleSubmit()}
                />
              </div>
            </div>
          </div>
        </div>
        <NormalModal
          modal={this.state.isModalVisible}
          handleModal={this.handleToogleModal}
          className={"multiple-appointment select-category"}
          style={{ minWidth: "800px" }}
        >
          <>
            <label className="text-left text-black common-label-text fs-17 pt-3">
              Add Sales Staff
            </label>
            <div className="input-group">
              <NormalInput
                placeholder="Enter here"
                value={this.state.formFields.addSalesStaff}
                name="addSalesStaff"
                onChange={this.handleChange}
              />
            </div>
            <div className="d-flex">
              <div className="col-md-4 col-12 mt-3 mr-5">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="cancel"
                  label="Cancel"
                  onClick={this.handleToogleModal}
                />
              </div>
              <div className="col-md-4 col-12 mt-3 mr-5">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  onClick={() => {
                    this.setState({
                      salesStaffTag: [
                        this.state.formFields.addSalesStaff,
                        ...this.state.salesStaffTag,
                      ],
                    });
                    this.setState({ isModalVisible: false });
                  }}
                />
              </div>
            </div>
          </>
        </NormalModal>
        <NormalModal
          modal={this.state.isModalVisibleOperation}
          handleModal={this.handleToogleModalOperation}
          className={"multiple-appointment select-category"}
          style={{ minWidth: "800px" }}
        >
          <>
            <label className="text-left text-black common-label-text fs-17 pt-3">
              Add Operation Staff
            </label>
            <div className="input-group">
              <NormalInput
                placeholder="Enter here"
                value={this.state.formFields.addOperationStaff}
                name="addOperationStaff"
                onChange={this.handleChange}
              />
            </div>
            <div className="d-flex">
              <div className="col-md-4 col-12 mt-3 mr-5">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="cancel"
                  label="Cancel"
                  onClick={this.handleToogleModalOperation}
                />
              </div>
              <div className="col-md-4 col-12 mt-3 mr-5">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  onClick={() => {
                    this.setState({
                      operationStaffTag: [
                        this.state.formFields.addOperationStaff,
                        ...this.state.operationStaffTag,
                      ],
                    });
                    this.setState({ isModalVisibleOperation: false });
                  }}
                />
              </div>
            </div>
          </>
        </NormalModal>
        <NormalModal
          modal={this.state.isModalVisibleAdmin}
          handleModal={this.handleToogleModalAdmin}
          className={"multiple-appointment select-category"}
          style={{ minWidth: "800px" }}
        >
          <>
            <label className="text-left text-black common-label-text fs-17 pt-3">
              Add Admin Staff
            </label>
            <div className="input-group">
              <NormalInput
                placeholder="Enter here"
                value={this.state.formFields.addAdminStaff}
                name="addAdminStaff"
                onChange={this.handleChange}
              />
            </div>
            <div className="d-flex">
              <div className="col-md-4 col-12 mt-3 mr-5">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="cancel"
                  label="Cancel"
                  onClick={this.handleToogleModalAdmin}
                />
              </div>
              <div className="col-md-4 col-12 mt-3 mr-5">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  onClick={() => {
                    this.setState({
                      adminStaffTag: [
                        this.state.formFields.addAdminStaff,
                        ...this.state.adminStaffTag,
                      ],
                    });
                    this.setState({ isModalVisibleAdmin: false });
                  }}
                />
              </div>
            </div>
          </>
        </NormalModal>
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
      createProject,
      updateProject,
      getTokenDetails,
    },
    dispatch
  );
};

// export const AddProject = withTranslation()(
//   connect(mapStateToProps, mapDispatchToProps)(AddProjectClass)
// );

export const AddProject = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddProjectClass)
);
