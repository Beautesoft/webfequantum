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
import { DragFileUpload } from "../../../../common";
import { displayImg } from "service/helperFunctions";
import { history } from "helpers";
import axios from "axios";

export class SetupTransCreateClass extends Component {
  state = {
    formFields: {
      title: "",
      logo_pic: null,
      site_id: 0,
      gst_reg_no: "",
      trans_h1: "",
      trans_h2: "",
      trans_footer1: "",
      trans_footer2: "",
      trans_footer3: "",
      trans_footer4: "",
    },
    salonList: [],
    setupTransactionId: null,
  };
  componentWillMount = () => {
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
    this.setState({
      setupTransactionId: this.props.match.params.id,
    });

    let { salonList, formFields } = this.state;
    this.props.getLoginSaloon().then((res) => {
      for (let key of res.data) {
        salonList.push({ value: key.id, label: key.itemsite_desc });
      }
      this.setState({ salonList });
    });

    if (this.props.match.params.id && this.props.match.params.id > 0) {
      this.props
        .getCommonApi(`title/${this.props.match.params.id}/`)
        .then((res) => {
          if (res.status == 200) {
            debugger;
            //this.setState({ formFields: res.data });

            formFields["title"] = res.data.title;
            // formFields["logo_pic"] = new File([res.data.logo_pic], "name.png", {
            //   type: "image/png",
            // });

            // formFields["logo_pic"] = new File(
            //   [res.data.logo_pic],
            //   `image${Math.round(Math.random())}.png`,
            //   {
            //     type: "image/png",
            //     lastModified: new Date(),
            //     size: 3845,
            //   }
            // );
            if (res.data.logo_pic) {
              const url = res.data.logo_pic;
              const fileName = `myFile${Math.round(Math.random())}.jpg`;

              fetch(url).then(async (response) => {
                const contentType = response.headers.get("content-type");
                const blob = await response.blob();
                const file = new File([blob], fileName, { type: "image/*" });
                this.handleImageUpload(file);
              });
            } else {
              formFields["logo_pic"] = res.data.logo_pic;
            }
            formFields["site_id"] = Number(res.data.site_id);
            formFields["gst_reg_no"] = res.data.gst_reg_no;
            formFields["trans_h1"] = res.data.trans_h1;
            formFields["trans_h2"] = res.data.trans_h2;
            formFields["trans_footer1"] = res.data.trans_footer1;
            formFields["trans_footer2"] = res.data.trans_footer2;
            formFields["trans_footer3"] = res.data.trans_footer3;
            formFields["trans_footer4"] = res.data.trans_footer4;

            this.setState({ formFields });
            console.log(formFields, "aftersetuptransactioneditclick");
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
    debugger;
    if (this.validator.allValid()) {
      let { formFields, setupTransactionId } = this.state;
      console.log(formFields.logo_pic, "imagesaveformat");
      const formData = new FormData();
      formData.append("title", formFields.title);
      formData.append("logo_pic", formFields.logo_pic);
      formData.append("site_id", Number(formFields.site_id));
      formData.append("gst_reg_no", formFields.gst_reg_no);
      formData.append("trans_h1", formFields.trans_h1);
      formData.append("trans_h2", formFields.trans_h2);
      formData.append("trans_footer1", formFields.trans_footer1);
      formData.append("trans_footer2", formFields.trans_footer2);
      formData.append("trans_footer3", formFields.trans_footer3);
      formData.append("trans_footer4", formFields.trans_footer4);
      if (this.props.match.params.id) {
        this.props
          .commonPatchApi(`title/${this.props.match.params.id}/`, formData)
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              this.props.history.push(
                `/admin/settings/setuptransaction/${setupTransactionId}/details`
              );
            }
          });
      } else {
        this.props.commonCreateApi(`title/`, formData).then((res) => {
          console.log(res);
          if (res.status === 201) {
            this.props.history.push(`/admin/settings/setuptransaction`);
          }
        });
      }
    } else {
      this.validator.showMessages();
    }
  };

  // upload imag to formfield
  handleImageUpload = (file) => {
    debugger;
    let { formFields } = this.state;
    formFields["logo_pic"] = file;
    this.setState({
      formFields,
    });
  };

  render() {
    let { formFields, salonList, setupTransactionId } = this.state;
    let {
      title,
      logo_pic,
      site_id,
      gst_reg_no,
      trans_h1,
      trans_h2,
      trans_footer1,
      trans_footer2,
      trans_footer3,
      trans_footer4,
    } = formFields;
    return (
      <div className="col-12">
        <div className="card row">
          <div className="head-label-nav p-4">
            <p
              className="category"
              onClick={() =>
                this.props.history.push(`/admin/settings/setuptransaction`)
              }
            >
              Setup Transaction
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">
              {setupTransactionId && setupTransactionId > 0 ? "Edit" : "Create"}
            </p>
          </div>
          <div className="container">
            <div className="d-flex flex-wrap justify-content-start self-align-center">
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text ">
                    Title
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={title}
                    name="title"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("title", title, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text">
                    Header 1
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={trans_h1}
                    name="trans_h1"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("Header 1", trans_h1, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text">
                    Header 2
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={trans_h2}
                    name="trans_h2"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("Header 2", trans_h2, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text ">
                    Footer 1
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={trans_footer1}
                    name="trans_footer1"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("footer 1", trans_footer1, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text ">
                    Footer 2
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={trans_footer2}
                    name="trans_footer2"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("footer 2", trans_footer2, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text ">
                    Footer 3
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={trans_footer3}
                    name="trans_footer3"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("footer 3", trans_footer3, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text ">
                    Footer 4
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={trans_footer4}
                    name="trans_footer4"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("footer 4", trans_footer4, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="text-left text-black common-label-text">
                    GST Reg. No.
                    <span className="error-message text-danger validNo fs-18">
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={gst_reg_no}
                    name="gst_reg_no"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message("Gst No.", gst_reg_no, "required")}
              </div>
              <div className="col-md-6 col-12 mb-3">
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
                    value={site_id}
                    name="site_id"
                    onChange={this.handleChange}
                    disabled={
                      setupTransactionId && setupTransactionId > 0
                        ? true
                        : false
                    }
                  />
                </div>
                {this.validator.message("site", site_id, "required")}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  Upload Logo
                  <span className="error-message text-danger validNo fs-18">
                    *
                  </span>
                </label>
                <div className="col-md-12 p-0">
                  <DragFileUpload
                    className={`file-uploader size-sm ${
                      logo_pic ? "" : "no-img"
                    }`}
                    label="Upload Thumbnail"
                    handleFileUpload={this.handleImageUpload}
                  >
                    {logo_pic ? (
                      <div>
                        {console.log(logo_pic, "imageontagonrender")}
                        <img src={displayImg(logo_pic)} alt="" />
                      </div>
                    ) : (
                      <div className="uploader-content text-center">
                        <span>Upload Image</span>
                      </div>
                    )}
                  </DragFileUpload>
                </div>
                {this.validator.message("logo_pic", logo_pic, "required")}
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
                    this.props.history.push(`/admin/settings/setuptransaction`)
                  }
                />
                {setupTransactionId ? (
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
    );
  }
}

const mapStateToProps = (state) => ({
  customerDetail: state.customer.customerDetail,
});

const mapDispatchToProps = (dispatch) => {
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
export const SetupTransCreate = connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupTransCreateClass);
