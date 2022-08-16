import React, { Component } from "react";
import { NormalInput, NormalButton, NormalSelect } from "component/common";
import CanvasDraw from "react-canvas-draw";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Webcam from "react-webcam";
import { withTranslation } from "react-i18next";
import {
  addDiagnosisHistory,
  updateDiagnosisHistory,
} from "redux/actions/customerPlus";

export class ComparePhotoPopupClass extends Component {
  state = {
    remarks: "",
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    if (this.props.remarks) this.setState({ remarks: this.props.remarks });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async () => {
    let { remarks } = this.state;
    let { id, cust_no, onDone, dataList } = this.props;
    let data = {
      compare_remark: remarks,
      compare_datetime: new Date().toISOString(),
      cust_no,
      diagnosis: dataList.map((e) => e.sys_code),
    };
    if (id == null) {
      await this.props.addDiagnosisHistory(data);
    } else {
      await this.props.updateDiagnosisHistory(id, data);
    }
    onDone();
  };

  render() {
    let { remarks } = this.state;
    let { dataList, t } = this.props;
    console.log("rendered");
    return (
      <>
        <div className="container-fluid mb-4 mt-2 product-details">
          <div className="row">
            <div className="col-6">
              <h4>{t("Compare Photo")}</h4>
            </div>
            <div className="col-6">
              <NormalButton
                mainbg={true}
                className="col-12 fs-15 "
                label="Done"
                onClick={() => this.handleSubmit()}
              />
            </div>
          </div>
          <div className="row pl-5 pr-5 mt-4">
            {dataList
              ? dataList.map((data) => (
                  <div className="col-md-6 mb-4">
                    <div className="col-12 mb-4">
                      <div class="d-flex mt-5 align-items-center justify-content-center">
                        <CanvasDraw
                          imgSrc={data.pic_path}
                          ref={(ref) => (this.canvasDraw = ref)}
                          saveData={
                            data.pic_data1 && JSON.stringify(data.pic_data1)
                          }
                          disabled
                          hideGrid
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="text-left text-black common-label-text fs-17 pb-2">
                        {t("Remarks")}
                      </label>
                      <NormalInput
                        placeholder="Enter remarks"
                        value={data.remarks}
                        name="remarks"
                        disabled
                      />
                    </div>
                  </div>
                ))
              : null}
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
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addDiagnosisHistory,
      updateDiagnosisHistory,
    },
    dispatch
  );
};

export const ComparePhotoPopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ComparePhotoPopupClass)
);
