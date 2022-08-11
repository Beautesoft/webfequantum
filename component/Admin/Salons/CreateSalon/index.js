import React, { Component } from "react";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalDate,
  NormalMultiSelect,
  NormalDateTime,
} from "component/common";
import { CreateSaloon, updateSaloon } from "redux/actions/saloon";
import {
  getBranch,
  getSkills,
  getCommonApi,
  createBranch,
} from "redux/actions/common";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DragFileUpload } from "../../../common";
import { displayImg, dateFormat } from "service/helperFunctions";
import { getSaloon } from "redux/actions/saloon";

export class CreateSalonClass extends Component {
  state = {
    formFields: {
      salonName: "",
      openingDate: "",
      branch: "",
      services: "",
      contactNumber: "",
      email: "",
      images: "",
      description: "",
      itemsite_code: "1",
    },
    imageArray: [],
    locationOption: [],
    skillsOptions: [],
    selectedSkills: [],
  };

  componentWillMount() {
    this.validator = new SimpleReactValidator({
      validators: {
        contactNumber: {
          message: "The :attribute must be a valid format.",
          rule: (val, params, validator) => {
            return (
              validator.helpers.testRegex(
                val,
                /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
              ) && params.indexOf(val) === -1
            );
          },
          messageReplace: (message, params) =>
            message.replace("", this.helpers.toSentence(params)),
          required: true,
        },
      },
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });

    // branch dropdown option api
    this.props.getCommonApi("salon/").then(res => {
      let { locationOption } = this.state;
      for (let key of res.data) {
        locationOption.push({ value: key.id, label: key.description });
      }
      this.setState({ locationOption });
    });

    // services dropdown api
    this.props.getSkills("").then(() => {
      this.getDatafromStore("skills");
      this.setSkillsDetail();
    });

    // while salon edit this api will call for salon detail
    if (this.props.match.params.id) {
      this.getSaloonDetail();
    }
  }

  // saloon api for saloon
  getSaloonDetail = async () => {
    this.props.getBranch(`${this.props.match.params.id}/`).then(res => {
      this.setDataFromStore();
      this.setSkillsDetail();
    });
  };

  // get skills dropdown data from api
  setSkillsDetail = () => {
    let { selectedSkills, formFields } = this.state;
    let { skillsList } = this.props;
    for (let key of skillsList) {
      for (let value of formFields.services) {
        if (key.id === value) {
          selectedSkills.push({ value: key.id, label: key.item_desc });
        }
      }
    }
    console.log(selectedSkills, "kuyiusdfsd", skillsList);

    this.setState({ selectedSkills });
  };

  // set data from response to formfield while Edit option
  setDataFromStore = () => {
    let { saloonDetail } = this.props;
    let { formFields } = this.state;
    formFields["salonName"] = saloonDetail.salon_name;
    formFields["openingDate"] = new Date(saloonDetail.itemsite_date);
    formFields["branch"] = saloonDetail.Site_Groupid;
    // formFields['services'] = saloonDetail.services;
    formFields["contactNumber"] = saloonDetail.itemsite_phone1;
    formFields["email"] = saloonDetail.ItemSite_Email;
    formFields["description"] = saloonDetail.itemsite_desc;
    formFields["itemsite_code"] = saloonDetail.itemsite_code;
    this.setState({ formFields });
    console.log("ufjdfjssd saloon", saloonDetail, formFields);
  };

  // common dropdown options data from api
  getDatafromStore = type => {
    let { branchList, skillsList } = this.props;
    let { locationOption, skillsOptions } = this.state;
    console.log("fdghfdjyujf", this.props);
    if (type === "branch") {
      for (let key of branchList) {
        locationOption.push({ label: key.description, value: key.id });
      }
    } else if (type === "skills") {
      for (let key of skillsList) {
        skillsOptions.push({ value: key.id, label: key.item_desc });
      }
    }
    this.setState({
      locationOption,
    });
    console.log("fdghfdjyujf", this.props);
  };

  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;

    this.setState({
      formFields,
    });
  };

  handleInput = ({ target: { name, value } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    formFields[name] = value === true ? 1 : value;
    this.setState({
      formFields,
    });
  };

  // select image to formfield
  handleImageUpload = file => {
    let { formFields } = this.state;
    formFields["images"] = file;
    this.setState({
      formFields,
    });
  };

  // remove image form selected form
  removepostImage = (e, name) => {
    let { fileArray } = this.state.formFields;
    let index = fileArray.indexOf(name);
    if (index === 0) {
      fileArray.shift();
    } else {
      fileArray.pop();
    }
    this.setState({
      fileArray,
    });
  };

  // submit to api for create and update
  handleSubmit = () => {
    if (this.validator.allValid()) {
      let { formFields } = this.state;
      const formData = new FormData();
      formData.append("images", formFields.images);
      formData.append("itemsite_desc", formFields.salonName);
      formData.append("Site_Groupid", formFields.branch);
      formData.append("skills_list", formFields.services);
      formData.append("itemsite_phone1", formFields.contactNumber);
      formData.append("itemsite_date", dateFormat(formFields.openingDate));
      formData.append("itemsite_email", formFields.email);
      formData.append("itemsite_code", formFields.itemsite_code);
      formData.append("description", formFields.description);
      if (this.props.match.params.id) {
        this.props
          .updateSaloon(`${this.props.match.params.id}/`, formData)
          .then(res => {
            console.log(res);
            if (res.status === 201) {
              this.props.history.push(`/admin/salons`);
            }
          });
      } else {
        this.props.createBranch(formData).then(res => {
          console.log(res);
          if (res.status === 201) {
            this.props.history.push(`/admin/salons`);
          }
        });
      }
    } else {
      this.validator.showMessages();
    }
  };

  handleMultiSelect = data => {
    let { formFields } = this.state;
    let list = [];
    for (let key of data) {
      list.push(key.value);
    }
    formFields["services"] = list;
    this.setState({ formFields });
    console.log(formFields, "oyokkjk");
  };

  handleDatePick = async (name, value) => {
    console.log(name, value, "sdfgdfhfshg", dateFormat(new Date()));
    // dateFormat(new Date())
    let { formFields } = this.state;
    formFields[name] = value;
    // formFields[name] = value;
    await this.setState({
      formFields,
    });
  };

  render() {
    let {
      formFields,
      locationOption,
      skillsOptions,
      selectedSkills,
    } = this.state;

    let {
      salonName,
      openingDate,
      branch,
      services,
      contactNumber,
      email,
      images,
      description,
    } = formFields;
    return (
      <div className="p-4 create-salon">
        {/* <p className="list-heading pb-4"> {id ? "Edit" : "Add"} Salon</p> */}
        <h2>Add New Salons</h2>
        <div className="salon-detail">
          <div className="form-group mb-4 pb-2">
            <div className="row">
              <div className="col-6">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Salon Name
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={salonName}
                    name="salonName"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("salonName", salonName, "required")}
              </div>
              <div className="col-6">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Opening Date
                </label>
                <div className="input-group">
                  {/* <NormalDate
                                        value={openingDate}
                                        name="openingDate"
                                        type="date"
                                        onChange={this.handleChange}
                                    /> */}
                  <NormalDateTime
                    onChange={this.handleDatePick}
                    inputcol="p-0 inTime"
                    // value={outTime}
                    value={openingDate}
                    // label="inTime"
                    name="openingDate"
                    className="dob-pick"
                    showYearDropdown={true}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                {this.validator.message("openingDate", openingDate, "required")}
              </div>
            </div>
          </div>
          <div className="form-group mb-4 pb-2">
            <div className="row">
              <div className="col-6">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Branch / Location
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={locationOption}
                    value={branch}
                    name="branch"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("branch", branch, "required")}
              </div>
              <div className="col-6">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Services
                </label>
                <div className="input-group">
                  {/* <NormalInput
                                        placeholder="Enter here"
                                        value={services}
                                        name="services"
                                        onChange={this.handleChange}
                                    /> */}
                  {/* {
                                        skillsOptions.length > 0 ? <NormalMultiSelect name="skills" className={`staff-skills-select ${services !== "" ? "overflow-y-set" : ""}`} options={skillsOptions} handleMultiSelect={this.handleMultiSelect}></NormalMultiSelect> : ""
                                    } */}
                  {!this.props.match.params.id ? (
                    skillsOptions.length > 0 ? (
                      <NormalMultiSelect
                        name="skills"
                        className={`staff-skills-select ${
                          services !== "" ? "overflow-y-set" : ""
                        }`}
                        options={skillsOptions}
                        handleMultiSelect={this.handleMultiSelect}
                      ></NormalMultiSelect>
                    ) : (
                      ""
                    )
                  ) : skillsOptions.length > 0 && selectedSkills.length > 0 ? (
                    <NormalMultiSelect
                      name="skills"
                      value={selectedSkills.length > 0 ? selectedSkills : []}
                      className={`staff-skills-select ${
                        services !== "" ? "overflow-y-set" : ""
                      }`}
                      options={skillsOptions}
                      handleMultiSelect={this.handleMultiSelect}
                    ></NormalMultiSelect>
                  ) : (
                    ""
                  )}
                </div>
                {this.validator.message("services", services, "required")}
              </div>
            </div>
          </div>
          <div className="form-group mb-4 pb-2">
            <div className="row">
              <div className="col-6">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Contact Number
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={contactNumber}
                    name="contactNumber"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message(
                  "contactNumber",
                  contactNumber,
                  "required|min:8|max:8"
                )}
              </div>
              <div className="col-6">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Email Address
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={email}
                    name="email"
                    type="email"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("email", email, "required|email")}
              </div>
              <div className="col-6">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Description
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={description}
                    name="description"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("salonName", salonName, "required")}
              </div>
            </div>
          </div>

          <div className="form-group mb-4 pb-2">
            <label className="text-left text-black common-label-text fs-17 pb-3">
              Upload Salon Images
            </label>
            <div className="col-md-12 p-0">
              <DragFileUpload
                className={`file-uploader size-sm ${images ? "" : "no-img"}`}
                label="Upload Thumbnail"
                handleFileUpload={this.handleImageUpload}
              >
                {images ? (
                  <img src={displayImg(images)} alt="" />
                ) : (
                  <div className="uploader-content text-center">
                    <span>Upload Image</span>
                  </div>
                )}
              </DragFileUpload>

              {!this.props.match.params.id
                ? this.validator.message("Emp_PIC", images, "required")
                : ""}
            </div>
          </div>
          <div className="border-bottom-line"></div>
          <div className="pt-5 d-flex">
            <div className="col-2">
              <Link to="/admin/salons">
                <NormalButton
                  label="Cancel"
                  normal={true}
                  className="mr-2 col-12"
                />
              </Link>
            </div>
            <div className="col-2">
              <NormalButton
                onClick={() => this.handleSubmit()}
                label="Save"
                mainbg={true}
                className="mr-2 col-12"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  branchList: state.common.branchList,
  skillsList: state.common.skillsList,
  saloonDetail: state.saloon.saloonDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      CreateSaloon,
      getBranch,
      createBranch,
      getSkills,
      getSaloon,
      updateSaloon,
      getCommonApi,
    },
    dispatch
  );
};

export const CreateSalon = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSalonClass);
