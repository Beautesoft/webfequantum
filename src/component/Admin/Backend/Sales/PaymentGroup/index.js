import React, { Component } from "react";
import { NormalButton, TableWrapper, NormalInput } from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import { PayGroups, NewPayGroups, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import { DragFileUpload } from "../../../../common";
import { displayImg } from "service/helperFunctions";
export class PaymentGroupClass extends Component {
  state = {
    CommissionDetails: [
      { label: "Code" },
      { label: "Sequence", divClass: "justify-content-end" },
    ],
    count: null,
    iscreation: false,
    islist: false,
    staffList: [],
    code: null,
    pic: null,
    codeedit: null,
    countedit: null,
    imagesedit: null,
    edit: false,
  };

  generalcontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  commissioncontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  componentDidMount = () => {
    this.Listofpaygroups({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  handleedit = async (itemcode) => {
    let { edit, codeedit, countedit, imagesedit, temp, pic } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.PayGroups().then((res) => {
      console.log(res);
      debugger;
      let objIndex = res.findIndex((obj) => obj.payGroupCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      console.log(temp);
      codeedit = temp.payGroupCode;
      countedit = temp.seq;
      imagesedit = temp.pictureLocation;

      //      var uri = window.URL.createObjectURL(temp.pictureLocation);
      //  var uri = window.URL.createObjectURL(temp.pictureLocation);
      // var binaryData = [];
      //  binaryData.push();
      // var foo = URL.createObjectURL(
      //   new Blob(temp.pictureLocation, { type: "jpg/jpeg" })
      //);
      debugger;
      var file_img = new File([temp.pictureLocation], temp.payGroupCode);
      pic = file_img;
      ////  let reader = new FileReader();
      //  reader.readAsDataURL(
      //    "blob:http://localhost:3000/0952bae4-322e-4462-aaed-91d5a106dac9"
      //  );
      //  imagesedit = reader.result;
      this.setState({
        codeedit,
        countedit,
        imagesedit,
        pic,
      });
      console.log(pic);
    });
    this.generalcontent();
  };

  handleupdates = async () => {
    let { edit, code, count, pic } = this.state;
    let descJson = {
      payGroupCode: this.state.codeedit,
      pictureLocation: this.state.imagesedit,
      seq: this.state.countedit,
      iscreditcard: null,
    };
    await this.props
      .updateCommon(
        `PayGroups/update?where=%7B%22payGroupCode%22%3A%20%22${this.state.codeedit}%22%7D
    `,
        descJson
      )
      .then((data) => {
        this.Listofpaygroups({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edit = false;
    code = "";
    count = "";
    pic = "";

    this.setState({ edit, code, count, pic });
    this.generalcontent();
  };

  Listofpaygroups = async () => {
    this.updateState({ is_loading: true });
    await this.props.PayGroups().then((res) => {
      console.log(res);
      let { staffList } = this.state;

      staffList = res;
      console.log(staffList);
      this.setState({
        staffList,
        is_loading: false,
      });
      console.log(staffList.length);
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, count } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "count") {
      count = value;
      this.setState({ count });
    }
  };

  handleeditinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { codeedit, countedit } = this.state;
    if (name == "code") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "count") {
      countedit = value;
      this.setState({ countedit });
    }
  };

  Addnewone = async () => {
    let { code, pic, count } = this.state;
    if (code == null || count == null) {
      Toast({
        type: "error",
        message: "Please check required ",
      });
    } else {
      if (pic != null && typeof pic === "object") {
        console.log(pic);
        if (pic) {
          let Filedt = new File([pic], "name");

          let newroom = {
            payGroupCode: code,
            pictureLocation: Filedt,
            seq: count,
            iscreditcard: true,
          };
          await this.props
            .NewPayGroups(newroom)
            .then((res) => {
              console.log(res);
              this.Listofpaygroups({});
              Toast({
                type: "success",
                message: "Successfully Added",
              });
              code = "";
              count = "";
              this.setState({ code, count });
            })

            .catch((e) => console.log(e));
        }
      }
    }
  };

  handleimageChange(event) {
    let { pic } = this.state;
    console.log(event);
    pic = URL.createObjectURL(event.target.files[0]);
    this.setState({
      pic,
    });
    console.log(pic);
  }

  handleedutimageChange(event) {
    let { imagesedit } = this.state;
    imagesedit = URL.createObjectURL(event.target.files[0]);
    this.setState({
      imagesedit,
    });
    console.log(imagesedit);
  }
  // fileToDataUri = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       resolve(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // upload imag to formfield
  handleImageUpload = (file) => {
    let { pic } = this.state;
    debugger;
    pic = file;
    this.setState({
      pic,
    });
    console.log(pic);
  };
  render() {
    let {
      CommissionDetails,
      staffList,
      is_loading,
      code,
      iscreation,
      islist,
      count,
      codeedit,
      countedit,
      imagesedit,
      edit,
      pic,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid salespayment">
          <h4>{t("Payment Group")}</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 payment"
                onClick={() => this.generalcontent()}
              >
                <p>{t("Payment Group Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={code}
                            name="code"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Sequence")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={count}
                            name="count"
                            onChange={this.temp}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        {/* <input type = "file" onChange = {(event) => this.handleimageChange(event)} />  */}
                        <DragFileUpload
                          className={`file-uploader size-sm ${
                            pic ? "" : "no-img"
                          }`}
                          label="Upload Thumbnail"
                          handleFileUpload={this.handleImageUpload}
                        >
                          {pic ? (
                            <div>
                              {console.log(pic, "imageontagonrender")}
                              <img src={pic} alt="" />
                            </div>
                          ) : (
                            <div className="uploader-content text-center">
                              <span>Upload Image</span>
                            </div>
                          )}
                        </DragFileUpload>
                      </div>

                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.Addnewone()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <div
                className="d-flex  justify-content-between p-3 payment"
                onClick={() => this.generalcontent()}
              >
                <p>{t("Payment Group Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={codeedit}
                            name="code"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Sequence")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={countedit}
                            name="count"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <DragFileUpload
                          className={`file-uploader size-sm ${
                            imagesedit ? "" : "no-img"
                          }`}
                          label="Upload Thumbnail"
                          handleFileUpload={this.handleImageUpload}
                        >
                          {imagesedit ? (
                            <div>
                              {console.log(pic, "imageontagonrender")}
                              <img src={imagesedit} alt="" />
                            </div>
                          ) : (
                            <div className="uploader-content text-center">
                              <span>Upload Image</span>
                            </div>
                          )}
                        </DragFileUpload>
                        <img src={displayImg(imagesedit)} alt="edit" />
                      </div>

                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Update"}
                          onClick={() => this.handleupdates()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}

          <div
            className="d-flex  justify-content-between p-3 payment mt-5"
            onClick={() => this.commissioncontent()}
          >
            <p>{t("Payment Group List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <h5 className="mt-3">{t("List of Payment Groups")}</h5>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={CommissionDetails}>
                        {is_loading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : staffList.length > 0 ? (
                          staffList.map(({ payGroupCode, seq }, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div
                                    className="text-left text-success"
                                    onClick={() =>
                                      this.handleedit(payGroupCode)
                                    }
                                  >
                                    {payGroupCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">{seq}</div>
                                </td>
                              </tr>
                            );
                          })
                        ) : null}
                      </TableWrapper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      PayGroups,
      NewPayGroups,
      updateCommon,
    },
    dispatch
  );
};

export const PaymentGroup = withTranslation()(
  connect(null, mapDispatchToProps)(PaymentGroupClass)
);
