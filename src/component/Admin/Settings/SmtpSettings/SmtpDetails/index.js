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
import { getCommonApi, commonDeleteApi } from "redux/actions/common";
import { history } from "helpers";
import "./style.scss";

export class SmtpDetailsClass extends Component {
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
      sitecode: "",
    },
    salonList: [],
    smtpSettingId: null,
  };
  componentWillMount = () => {};
  componentDidMount = () => {
    this.setState({
      smtpSettingId: this.props.match.params.id,
    });
    if (this.props.match.params.id && this.props.match.params.id > 0) {
      this.props
        .getCommonApi(`smtpsettings/${this.props.match.params.id}/`)
        .then(res => {
          if (res.status == 200) {
            this.setState({ formFields: res.data });
            console.log(res, "smtpsettingviewclick");
          }
        });
    }
  };
  handleDeleteSMTPSetting = id => {
    this.props.commonDeleteApi(`smtpsettings/${id}/`).then(res => {});
    this.props.history.push(`/admin/settings/smtpsettings`);
  };
  render() {
    let { formFields, salonList, smtpSettingId } = this.state;
    return (
      <div className="smtp-Setting-detail-section col-12">
        <div className="card row">
          <div className="d-flex flex-row">
            <div className="col-6">
              <div className="d-flex justify-content-start head-label-nav p-4">
                <p
                  className="category"
                  onClick={() =>
                    this.props.history.push(`/admin/settings/smtpsettings`)
                  }
                >
                  SMTP Settings
                </p>
                <i className="icon-right mx-md-3"></i>
                <p className="sub-category">Details</p>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex justify-content-end p-4">
                <div className="col-3 icon-change">
                  <button
                    className="btn outline-btn col-12 mx-2 fs-15 float-right text-capitalize"
                    onClick={() =>
                      this.props.history.push(
                        `/admin/settings/smtpsettings/${this.props.match.params.id}/edit`
                      )
                    }
                  >
                    <span className="icon-edit mr-2"></span>Edit
                  </button>
                </div>
                <div className="col-3 icon-change">
                  <button
                    className="btn outline-btn col-12 mx-2 fs-15 float-right text-capitalize"
                    onClick={() =>
                      this.handleDeleteSMTPSetting(this.props.match.params.id)
                    }
                  >
                    <span className="icon-delete mr-2"></span>Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container border p-3">
            <div className="d-flex flex-wrap">
              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">Sender Name</p>
              </div>
              <div className="col-md-6 col-12">
                <p className="pb-4">{formFields.sender_name}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3">
                <p className="fw-500 pb-4">Sender Address</p>
              </div>
              <div className="col-md-6">
                <p className=" pb-4">{formFields.sender_address}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">SMTP Host Server</p>
              </div>
              <div className="col-md-6 col-12">
                <p className=" pb-4">{formFields.smtp_serverhost}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">Port</p>
              </div>
              <div className="col-md-6 col-12">
                <p className=" pb-4">{formFields.port}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">User Id</p>
              </div>
              <div className="col-md-6 col-12">
                <p className=" pb-4">{formFields.user_email}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">User Password</p>
              </div>
              <div className="col-md-6 col-12">
                <p className=" pb-4">{formFields.user_password}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">Site </p>
              </div>
              <div className="col-md-6">
                <p className=" pb-4">{formFields.sitecode}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">Message Content</p>
              </div>
              <div className="col-md-6 col-12">
                <p className=" pb-4">{formFields.sms_content}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">Email subject</p>
              </div>
              <div className="col-md-6 col-12">
                <p className=" pb-4">{formFields.email_subject}</p>
              </div>

              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12">
                <p className="fw-500 pb-4">Email Content</p>
              </div>
              <div className="col-md-6 col-12">
                <p className=" pb-4">{formFields.email_content}</p>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-12 p-4">
            <div className="d-flex justify-content-center">
              <NormalButton
                mainbg={true}
                className="col-12"
                label="Go Back to List"
                onClick={() =>
                  this.props.history.push(`/admin/settings/smtpsettings`)
                }
              />
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
      commonDeleteApi,
    },
    dispatch
  );
};
export const SmtpDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(SmtpDetailsClass);
