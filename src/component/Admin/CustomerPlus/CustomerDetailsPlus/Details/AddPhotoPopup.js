import React, { Component } from "react";
import { NormalInput, NormalButton, NormalSelect } from "component/common";
import CanvasDraw from "react-canvas-draw";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Webcam from "react-webcam";
import { withTranslation } from "react-i18next";
import {
  addDiagosisPhoto,
  updateDiagosisPhoto,
} from "redux/actions/customerPlus";

export class AddPhotoPopupClass extends Component {
  state = {
    image: null,
    isCameraAvailable: true,
    remarks: "",
    layoutData: "",
    brushRadius: "2",
    diagnosis_code: null,
    brushColor: "yellow",
    brushColorOptions: [
      { label: "Yellow", value: "yellow" },
      { label: "Red", value: "red" },
      { label: "White", value: "white" },
      { label: "Black", value: "black" },
      { label: "Green", value: "green" },
      { label: "Blue", value: "blue" },
    ],
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentWillMount() {
    navigator.getMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    navigator.mediaDevices.getUserMedia(
      { video: true },
      () => {
        this.updateState({ isCameraAvailable: true });
      },
      () => {
        this.updateState({ isCameraAvailable: false });
      }
    );
  }

  componentDidMount() {
    let { image, remarks, layoutData, diagnosis_code } = this.props;
    console.log(this.props);
    if (image && remarks) {
      this.updateState({ image, remarks, layoutData, diagnosis_code });
    }
    document.getElementById("get_file").onclick = function () {
      document.getElementById("my_file").click();
    };
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.updateState({ image: imageSrc });
  };

  handleChange = e => {
    this.updateState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async () => {
    function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    let { remarks, image, diagnosis_code } = this.state;
    let { cust_no, onDone } = this.props;
    let pic_data1 = `${this.canvasDraw.getSaveData()}`;

    let formData = new FormData();
    formData.append("remarks", remarks);
    formData.append("cust_no", cust_no);
    formData.append("pic_data1", pic_data1);

    if (diagnosis_code == null) {
      formData.append("diagnosis_date", new Date().toISOString());
      formData.append("date_pic_take", new Date().toISOString());
      formData.append(
        "pic_path",
        dataURLtoFile(image, `${Date.now().toLocaleString("en-GB")}.jpeg`)
      );
      await this.props.addDiagosisPhoto(formData);
    } else {
      await this.props.updateDiagosisPhoto(diagnosis_code, formData);
    }
    onDone();
  };

  render() {
    let {
      image,
      isCameraAvailable,
      remarks,
      brushRadius,
      brushColor,
      brushColorOptions,
      layoutData,
    } = this.state;
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user",
    };
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid mb-4 mt-2 product-details">
          <div className="row">
            <div className="col-6">
              <h4>{t("Add Photo")}</h4>
            </div>
            {image == null ? null : (
              <div className="col-6">
                <NormalButton
                  mainbg={true}
                  className="col-12 fs-15 "
                  label="Done"
                  onClick={() => this.handleSubmit()}
                />
              </div>
            )}
          </div>
          {image == null ? (
            <div className="row pl-5 pr-5 mt-4">
              {isCameraAvailable ? (
                <>
                  <div className="col-12">
                    <Webcam
                      audio={false}
                      ref={this.setRef}
                      screenshotFormat="image/jpeg"
                      width={"100%"}
                      videoConstraints={videoConstraints}
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <NormalButton
                      mainbg={true}
                      className="col-12 fs-15 "
                      label="Capture"
                      onClick={() => this.capture()}
                    />
                  </div>
                </>
              ) : null}
              <div className="col-12">
                <input
                  type="button"
                  id="get_file"
                  value="Browse"
                  className="btn cursor-pointer mainbg-btn"
                />
                <input
                  type="file"
                  id="my_file"
                  className="d-none"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.value || e.target.value != null) {
                      var reader = new FileReader();
                      reader.onload = e => {
                        this.updateState({ image: e.target.result });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="row pl-5 pr-5 mt-4">
              <div className="col-12  mb-4">
                <div class="d-flex mt-5 align-items-center justify-content-center">
                  <CanvasDraw
                    imgSrc={this.state.image}
                    ref={ref => (this.canvasDraw = ref)}
                    brushRadius={brushRadius}
                    brushColor={brushColor}
                    saveData={layoutData && JSON.stringify(layoutData)}
                  />
                </div>
              </div>
              <div className="col-12 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Brush Radius")}
                </label>
                <input
                  className="col-12"
                  type="range"
                  min="1"
                  max="20"
                  value={brushRadius}
                  onChange={e =>
                    this.updateState({ brushRadius: e.target.value })
                  }
                />
              </div>
              <div className="col-12 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Brush Color")}
                </label>
                <NormalSelect
                  options={brushColorOptions}
                  value={brushColor}
                  onChange={e =>
                    this.updateState({ brushColor: e.target.value })
                  }
                />
              </div>
              <div className="col-12 mb-4">
                <NormalButton
                  resetbg={true}
                  className="col-12 fs-15 "
                  label="Clear"
                  onClick={() => {
                    this.canvasDraw.clear();
                  }}
                />
              </div>
              <div className="col-12 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Remarks")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter remarks"
                    value={remarks}
                    name="remarks"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addDiagosisPhoto,
      updateDiagosisPhoto,
    },
    dispatch
  );
};

export const AddPhotoPopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddPhotoPopupClass)
);
