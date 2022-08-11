import React, { Component } from "react";
import "./style.scss";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCustomerPlusSettings,
  updateCustomerPlus,
  CreateCustomerPlus,
  getCustomerPlus,
} from "redux/actions/customerPlus";
import {
  NormalInput,
  NormalDateTime,
  NormalSelect,
  NormalMultiSelect,
  NormalButton,
  LayoutEditor,
  NormalModal

} from "component/common";
import { withTranslation } from "react-i18next";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { updateForm } from "redux/actions/common";
import closeIcon from "assets/images/close.png";

export class AddCustomerPlusClass extends Component {
  state = {
    formFields: {},
    fields: [
      {
        id: 1,
        field_name: "cust_dob",
        display_field_name: "Customer DOB",
        visible_in_registration: true,
        visible_in_listing: true,
        visible_in_profile: true,
        mandatory: true,
        data_type: "Dat",
        selection: null,
      },
    ],
    isLoading: true,
    isMounted: true,
    cust_corporate: false,
    isModalVisibleContectPerson: false,
    corpContactPersionList: [],
    corpContactPersionDetail: { name: "", email: "", designation: "", mobile_phone: "" }
  };

  handleToogleModalContectPerson = () => {
    let { isModalVisibleContectPerson } = this.state;
    isModalVisibleContectPerson = !isModalVisibleContectPerson;
    this.setState({
      isModalVisibleContectPerson,
      corpContactPersionDetail:{ name: "", email: "", designation: "", mobile_phone: "" }
    });
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    this.validator = new SimpleReactValidator({
      validators: {},
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
    this.loadData();
  }

  loadData = async () => {
    await this.props.getCustomerPlusSettings("details");
    this.state.fields = this.props.customerPlusSettings.filter(
      e => e.visible_in_registration
    );
    this.state.formFields = this.state.fields.reduce((map, obj) => {
      if (obj.data_type == "date") map[obj.field_name] = dateFormat(new Date());
      else if (obj.data_type == "datetime")
        map[obj.field_name] = new Date().toISOString();
      else map[obj.field_name] = null;
      return map;
    }, {});
    if (this.props.match.params.id) {
      await this.props.getCustomerPlus(this.props.match.params.id);
      this.state.formFields = this.props.customerPlusDetail;
    }
    this.setState({ isLoading: false });
  };

  handleSubmit = async type => {

    if (!this.validator.allValid()) return this.validator.showMessages();
    this.setState({ isLoading: true });
    console.log(this.state.formFields);
    try {
      this.state.fields
        .filter(e => e.data_type == "date")
        .forEach(e => {
          if (this.state.formFields[e.field_name]) {
            this.state.formFields[e.field_name] = dateFormat(
              this.state.formFields[e.field_name]
            );
          }
        });
      this.state.fields
        .filter(e => e.data_type == "datetime")
        .forEach(e => {
          if (this.state.formFields[e.field_name]) {
            let date = new Date(this.state.formFields[e.field_name]);
            this.state.formFields[e.field_name] = date.toISOString();
          }
        });
      if (this.props.match.params.id) {
        var formFields = {};
        this.state.fields.forEach(e => {
          formFields[e.field_name] = this.state.formFields[e.field_name];
        });
        var res = await this.props.updateCustomerPlus(
          this.props.match.params.id + "/",
          JSON.stringify(formFields)
        );
        if (res.status == 200) {
          if (type == "catalog") {
            let formField = { custId: 0, custName: "" };
            formField["custId"] = res.data.id;
            formField["custName"] = res.data.cust_name;
            this.setState({ isLoading: false });
            this.props.updateForm("basicApptDetail", formField);
            history.push("/admin/cart");
          } else {
            history.push(
              `/admin/customerplus/${this.props.match.params.id}/details`
            );
          }
        }
      } else {
        const payload = this.state.corpContactPersionList.length > 0 ?
          { cust_corporate: this.state.cust_corporate, contactperson: this.state.cust_corporate?this.state.corpContactPersionList:[], ...this.state.formFields }
          : { ...this.state.formFields };
        var res = await this.props.CreateCustomerPlus(
          JSON.stringify(payload)
        );
        if (type == "catalog") {
          let formField = { custId: 0, custName: "" };
          formField["custId"] = res.data.id;
          formField["custName"] = res.data.cust_name;
          this.props.updateForm("basicApptDetail", formField);
          history.push("/admin/cart");
        } else {
          history.push(`/admin/customerPlus`);
        }
      }
    } catch (e) {
      console.log(e, "catchmessage");
    }
    this.setState({ isLoading: false });
  };

  handleCancel = () => {
    if (this.props.match.params.id) {
      this.props.history.push(
        `/admin/customerplus/${this.props.match.params.id}/details`
      );
    } else {
      this.props.history.push(`/admin/customerplus`);
    }
  };
  handleChangeCorpContact = ({ target: { value, name } }) => {
    let corpContactPersionDetail = Object.assign({}, this.state.corpContactPersionDetail);

    corpContactPersionDetail[name] = value;

    this.setState({
      corpContactPersionDetail,
    });
  }

  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;

    this.setState({
      formFields,
    });
  };

  handleMultiSelect = (field, e) => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[field] = e;

    this.setState({
      formFields,
    });
  };

  handleChangeBox = event => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[event.target.name] = event.target.checked;

    this.setState({
      formFields,
    });
  };

  handleDatePick = async (name, value) => {
    let { formFields } = this.state;
    formFields[name] = value;
    await this.setState({
      formFields,
    });
  };

  renderLayout = () => {
    let { t } = this.props;
    let filtered = this.state.fields;
    const renderFormData = (e, index) => {
      return (
        <div key={index}>
          <div className="input-group">
            {e.data_type == "text" ? (
              <NormalInput
                placeholder="Enter here"
                value={this.state.formFields[e.field_name]}
                name={e.field_name}
                onChange={this.handleChange}
              />
            ) : e.data_type == "date" ? (
              <NormalDateTime
                onChange={this.handleDatePick}
                value={
                  this.state.formFields[e.field_name]
                    ? new Date(this.state.formFields[e.field_name])
                    : new Date()
                }
                name={e.field_name}
                showYearDropdown={true}
              />
            ) : e.data_type == "datetime" ? (
              <NormalDateTime
                onChange={this.handleDatePick}
                value={
                  this.state.formFields[e.field_name]
                    ? new Date(this.state.formFields[e.field_name])
                    : new Date()
                }
                name={e.field_name}
                showYearDropdown={true}
              />
            ) : e.data_type == "selection" ? (
              <NormalSelect
                options={e.selection}
                value={this.state.formFields[e.field_name]}
                name={e.field_name}
                onChange={this.handleChange}
              />
            ) : e.data_type == "multiSelect" ? (
              <NormalMultiSelect
                options={e.selection}
                defaultValue={this.state.formFields[e.field_name]}
                name={e.field_name}
                handleMultiSelect={e => this.handleMultiSelect(e.field_name, e)}
              />
            ) : e.data_type == "boolean" ? (
              <input
                type="checkbox"
                checked={this.state.formFields[e.field_name]}
                name={e.field_name}
                onChange={this.handleChangeBox}
              />
            ) : e.data_type == "number" ? (
              <NormalInput
                type="number"
                placeholder="Enter here"
                value={this.state.formFields[e.field_name]}
                name={e.field_name}
                onChange={this.handleChange}
              />
            ) : (
              t("NO FILED RENDER DATA FOUND")
            )}
          </div>
          {e.mandatory
            ? this.validator.message(
              e.display_field_name,
              this.state.formFields[e.field_name],
              "required"
            )
            : null}
        </div>
      );
    };
    return filtered.map(e => {
      return (
        <div
          key={`${e.id}`}
          style={
            e.data_type == "date" || e.data_type == "datetime"
              ? { zIndex: 1 }
              : {}
          }
        >
          {e.showLabel && (
            <label className="text-left text-black common-label-text fs-17 p-0">
              {t(e.display_field_name)}
              {e.mandatory && <label className="text-danger p-0 m-0">*</label>}
            </label>
          )}
          {renderFormData(e)}

        </div>
      );
    });
  };

  render() {
    let { isLoading } = this.state;
    let { t } = this.props;
    return (
      <div className="create-customer-section container-fluid">
        <NormalModal
          modal={this.state.isModalVisibleContectPerson}
          handleModal={this.handleToogleModalContectPerson}
          className={"multiple-appointment select-category"}
          style={{ minWidth: "600px" }}
        >
          <>
            <div className="row d-flex">
              <div className="input-group input-group-padding">
                <div col-md-10 col-sm-10 mb-10>
                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    {t("Add New Contact Person")}
                  </label>
                </div >
                <div col-md-2 col-sm-2 mb-2>
                  <img onClick={this.handleToogleModalContectPerson} style={{paddingLeft:300}} className="close" src={closeIcon} alt="" />
                </div>
              </div>
              <div className="input-group input-group-padding">
                <div className="col-md-4 col-sm-12 mb-6">
                  <label className="text-left text-black common-label-text fs-17 p-0" >
                    {t("Name")}
                  </label>
                </div>
                <div className="col-md-6 col-sm-12 mb-6">
                  <NormalInput
                    placeholder="Enter here"
                    value={this.state.corpContactPersionDetail.name}
                    name="name"
                    onChange={this.handleChangeCorpContact}

                  />
                </div>
              </div>
              <div className="input-group input-group-padding">
                <div className="col-md-4 col-sm-12 mb-6">
                  <label className="text-left text-black common-label-text fs-17 p-0" >
                    {t("Designation")}
                  </label>
                </div>
                <div className="col-md-6 col-sm-12 mb-6">
                  <NormalInput
                    placeholder="Enter here"
                    value={this.state.corpContactPersionDetail.designation}
                    name="designation"
                    onChange={this.handleChangeCorpContact}

                  />
                </div>
              </div>
              <div className="input-group input-group-padding">
                <div className="col-md-4 col-sm-12 mb-6">
                  <label className="text-left text-black common-label-text fs-17 p-0" >
                    {t("Mobile Number")}
                  </label>
                </div>

                <div className="col-md-6 col-sm-12 mb-6">
                  <NormalInput
                    placeholder="Enter here"
                    value={this.state.corpContactPersionDetail.mobile_phone}
                    name="mobile_phone"
                    onChange={this.handleChangeCorpContact}
                  />
                </div>
              </div>
              <div className="input-group input-group-padding">
                <div className="col-md-4 col-sm-12 mb-6">
                  <label className="text-left text-black common-label-text fs-17 p-0" >
                    {t("Email Address")}
                  </label>
                </div>

                <div className="col-md-6 col-sm-12 mb-6">
                  <NormalInput
                    placeholder="Enter here"
                    value={this.state.corpContactPersionDetail.email}
                    name="email"
                    onChange={this.handleChangeCorpContact}

                  />
                </div>

              </div>
              <div className="input-group input-group-padding">

                <div className="col-md-8 col-sm-12 mb-8">
                </div>
                <div className="col-md-4 col-sm-12 mb-4">
                  <NormalButton

                    buttonClass={"mx-2"}
                    mainbg={true}
                    className="confirm"
                    label="Add"
                    onClick={() => {
                      if (this.state.corpContactPersionDetail.name && this.state.corpContactPersionDetail.email && this.state.corpContactPersionDetail.designation && this.state.corpContactPersionDetail.mobile_phone)
                        this.setState({ isModalVisibleContactPerson: false, corpContactPersionList: [...this.state.corpContactPersionList, this.state.corpContactPersionDetail] });
                        this.handleToogleModalContectPerson()
                    }}
                  />
                </div>
              </div>
            </div>

          </>
        </NormalModal>


        {/* <p className="list-heading pb-4"> {id ? "Edit" : "Add"} Customer</p> */}
        <div className="create-customerplus">
          <div className="head-label-nav p-2">
            <p
              className="category"
              onClick={() => {
                this.props.match.params.id
                  ? this.props.history.push(
                    `/admin/customerplus/${this.props.match.params.id}/details`
                  )
                  : this.props.history.push(`/admin/customerplus/`);
              }}
            >
              {t("Customer")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">
              {t(
                (this.props.match.params.id ? "Edit" : "Add") + " New Customer"
              )}
            </p>
          </div>
          <div className="customer-detail">
            {isLoading ? (
              <div class="d-flex mt-5 align-items-center justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="form-group mb-4 pb-2 row">
                  <LayoutEditor fields={this.state.fields} editable={false}>
                    {this.renderLayout()}

                  </LayoutEditor>
                  {!this.props.match.params.id?
                  <div className="corp-box">
                    <div className="corp-cust-box">
                      <label className="text-left text-black common-label-text fs-17 p-0">
                        {t("Corporate Customer")}

                      </label>
                      <div className="input-group">
                        <input
                          type="checkbox"
                          checked={this.state.cust_corporate}
                          name={"cust_corporate"}
                          onChange={() => {
                            let { cust_corporate } = this.state;
                            cust_corporate = !cust_corporate;
                            this.setState({ cust_corporate })
                          }}
                        />
                      </div>
                    </div>

                    {this.state.cust_corporate ?
                      <div className="row d-flex">
                        <div className="col-md-6 col-sm-12 mb-6">
                        </div>
                        <div className="col-md-6 col-sm-12 mb-6">
                          <NormalButton
                            buttonClass={"mx-2"}
                            mainbg={true}
                            className="confirm"
                            onClick={this.handleToogleModalContectPerson}
                            label="Add New Contact Person"

                          />
                        </div>

                      {this.state.corpContactPersionList.length>0 ? <table className="table">
                          <thead>
                            <tr>
                              <th className="first-value"></th>
                              <th>Name</th>
                              <th>Designation</th>
                              <th>Mobile</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.corpContactPersionList.map((e, index) => {
                              return(
                              <tr key={index}>
                                <td> <img onClick={()=>{let {corpContactPersionList}= this.state;corpContactPersionList.splice(index,1);this.setState({corpContactPersionList})}} className="close" src={closeIcon} alt="" /> </td>
                                <td>{e.name}</td>
                                <td>{e.designation}</td>
                                <td>{e.mobile_phone}</td>

                              </tr>)
                            })}

                          </tbody>
                        </table>:""
                      }
                      </div> : ""
                    }
                  </div>:""}
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-md-4 col-sm-12 mb-4">
                    <NormalButton
                      onClick={this.handleCancel}
                      label="CANCEL"
                      danger={true}
                      className="mr-2 col-12"
                    />
                  </div>
                  <div className="col-md-4 col-sm-12 mb-4">
                    <NormalButton
                      onClick={() => this.handleSubmit()}
                      label="SAVE"
                      success={true}
                      className="mr-2 col-12"
                    />
                  </div>
                  <div className="col-md-4 col-sm-12 mb-4">
                    <NormalButton
                      onClick={() => this.handleSubmit("catalog")}
                      label="SAVE &amp; CATALOG"
                      success={true}
                      className="mr-2 col-12"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customerPlusDetail: state.customerPlus.customerPlusDetail,
  customerPlusSettings: state.customerPlus.customerPlusSettings,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomerPlusSettings,
      updateCustomerPlus,
      CreateCustomerPlus,
      getCustomerPlus,
      updateForm,
    },
    dispatch
  );
};

export const AddCustomerPlus = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddCustomerPlusClass)
);
