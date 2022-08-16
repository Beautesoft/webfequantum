import React, { Component } from "react";
import {
  NormalInput,
  NormalTextarea,
  NormalSelect,
  NormalButton,
} from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SimpleReactValidator from "simple-react-validator";
import { getLoginSaloon } from "redux/actions/auth";
import {
  getCommonApi,
  commonCreateApi,
  commonPatchApi,
} from "redux/actions/common";
import { history } from "helpers";

export class SmtpCreateClass extends Component {
  state = {
    formFields: {
      sender_name: "",
      sender_address: "",
      smtp_serverhost: "",
      port: "",
      user_email: "",
      user_password: "",
      email_subject: "",
      email_content: "",
      site_codeid: "",
      sms_content: "",
    },
    salonList: [],
    smtpSettingId: null,
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
    this.setState({
      smtpSettingId: this.props.match.params.id,
    });

    let { salonList } = this.state;
    this.props.getLoginSaloon().then(res => {
      for (let key of res.data) {
        salonList.push({ value: key.id, label: key.itemsite_desc });
      }
      this.setState({ salonList });
    });

    if (this.props.match.params.id && this.props.match.params.id > 0) {
      this.props
        .getCommonApi(`smtpsettings/${this.props.match.params.id}/`)
        .then(res => {
          if (res.status == 200) {
            this.setState({ formFields: res.data });
            console.log(res, "smtpsettingeditclick");
          }
        });
    }
  };

  handleChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;
    this.setState({
      formFields,
    });
  };

  handleSubmit = () => {
    let { formFields, smtpSettingId } = this.state;
    console.log(formFields, "data for save settings");
    if (this.validator.allValid()) {
      let data = {
        sender_name: formFields.sender_name,
        sender_address: formFields.sender_address,
        smtp_serverhost: formFields.smtp_serverhost,
        port: Number(formFields.port),
        user_email: formFields.user_email,
        user_password: formFields.user_password,
        email_subject: formFields.email_subject,
        email_content: formFields.email_content,
        site_codeid: Number(formFields.site_codeid),
        sms_content: formFields.sms_content,
      };
      if (this.props.match.params.id && this.props.match.params.id > 0) {
        this.props
          .commonPatchApi(`smtpsettings/${smtpSettingId}/`, data)
          .then(async res => {
            console.log(res, "result of smtpsetingsupdate");
            if (res.status === 200) {
              this.props.history.push(`/admin/settings/smtpsettings`);
            }
          });
      } else {
        this.props.commonCreateApi(`smtpsettings/`, data).then(async res => {
          console.log(res, "result of smtpsetingssave");
          if (res.status === 201) {
            this.props.history.push(`/admin/settings/smtpsettings`);
          }
        });
      }
    } else {
      this.validator.showMessages();
    }
  };

  render() {
    let { formFields, salonList, smtpSettingId } = this.state;
    return (
      <div className="col-12">
        <div className="card row">
          <div className="head-label-nav p-4">
            <p
              className="category"
              onClick={() =>
                this.props.history.push(`/admin/settings/smtpsettings`)
              }
            >
              SMTP Settings
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">
              {smtpSettingId && smtpSettingId > 0 ? "Edit" : "Create"}
            </p>
          </div>
          <div className="d-flex flex-wrap">
            <div className="col-md-3 col-12 mt-3">
              <div className="d-flex flex-wrap justify-content-start self-align-center">
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      Sender Name
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={formFields.sender_name}
                      name="sender_name"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    "Sender Name",
                    formFields.sender_name,
                    "required"
                  )}
                </div>
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      Sender Address
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={formFields.sender_address}
                      name="sender_address"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    "Sender Address",
                    formFields.sender_address,
                    "required"
                  )}
                </div>
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      SMTP Host Server
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={formFields.smtp_serverhost}
                      name="smtp_serverhost"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    "SMTP Server",
                    formFields.smtp_serverhost,
                    "required"
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-3 col-12 mt-3">
              <div className="d-flex flex-wrap justify-content-start self-align-center">
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      Port
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={formFields.port}
                      name="port"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message("Port", formFields.port, "required")}
                </div>
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      User ID
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={formFields.user_email}
                      name="user_email"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    "User Id",
                    formFields.user_email,
                    "required"
                  )}
                </div>
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      Password
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={formFields.user_password}
                      name="user_password"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    "user Password",
                    formFields.user_password,
                    "required"
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-3 col-12 mt-3">
              <div className="d-flex flex-wrap justify-content-start self-align-center">
                <div className="col-md-12 col-12 mb-3 p-0">
                  <div>
                    <label className="text-left text-black common-label-text">
                      Site
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalSelect
                      options={salonList}
                      value={formFields.site_codeid}
                      name="site_codeid"
                      onChange={this.handleChange}
                      disabled={
                        smtpSettingId && smtpSettingId > 0 ? true : false
                      }
                    />
                  </div>
                  {this.validator.message(
                    "site",
                    formFields.site_codeid,
                    "required"
                  )}
                </div>
                <div className="col-md-12 col-12 border">
                  <div className="d-flex justify-content-between pt-3">
                    <p className="fs-16 fw-500 mb-2">{`SMS Invoice Settings`}</p>
                  </div>
                  <div className="mb-3">
                    <div>
                      <label className="text-left text-black common-label-text">
                        Content
                        <span className="error-message text-danger validNo fs-18">
                          *
                        </span>
                      </label>
                    </div>
                    <div className="input-group">
                      <NormalTextarea
                        placeholder="Enter here"
                        value={formFields.sms_content}
                        name="sms_content"
                        onChange={this.handleChange}
                      />
                    </div>
                    {this.validator.message(
                      "sms Content",
                      formFields.sms_content,
                      "required"
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-12 mt-3">
              <div className="d-flex flex-wrap justify-content-start self-align-center border">
                <div className="d-flex justify-content-between px-2 pt-3">
                  <p className="fs-16 fw-500 mb-2">{`Email Invoice Settings`}</p>
                </div>
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      Subject{" "}
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={formFields.email_subject}
                      name="email_subject"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    "Email Subject",
                    formFields.email_subject,
                    "required"
                  )}
                </div>
                <div className="col-md-12 col-12 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text">
                      Content{" "}
                      <span className="error-message text-danger validNo fs-18">
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalTextarea
                      placeholder="Enter here"
                      value={formFields.email_content}
                      name="email_content"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.validator.message(
                    "Email Content",
                    formFields.email_content,
                    "required"
                  )}
                </div>
              </div>
              <div className="col-md-12 col-12 p-4">
                <div className="d-flex justify-content-end">
                  <NormalButton
                    buttonClass={"treatment"}
                    resetbg={true}
                    className="col-12"
                    label="Cancel"
                    onClick={() =>
                      this.props.history.push(`/admin/settings/smtpsettings`)
                    }
                  />
                  {smtpSettingId ? (
                    <NormalButton
                      buttonClass={"submit-btn"}
                      mainbg={false}
                      className="col-12 submit-btn ml-3"
                      label="Update"
                      onClick={this.handleSubmit}
                    />
                  ) : (
                    <NormalButton
                      buttonClass={"submit-btn"}
                      mainbg={false}
                      className="col-12 submit-btn ml-3"
                      label="Save"
                      onClick={this.handleSubmit}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customerDetail: state.customer.customerDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      getLoginSaloon,
      commonPatchApi,
    },
    dispatch
  );
};
export const SmtpCreate = connect(
  mapStateToProps,
  mapDispatchToProps
)(SmtpCreateClass);
