import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalInput,
  NormalSelect,
  InputSearch,
  NormalModal,
  TableWrapper,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";
import { TopupProduct } from "./product";
import { TopupTreatment } from "./treatment";
import { TopupPrepaid } from "./prepaid";
import { withTranslation } from "react-i18next";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

export class TopupClass extends Component {
  state = {
    activeMenu: "",
    TreatmentFlag: true,
    ProductFlag: true,
    PrepaidFlag: true,
  };

  componentWillMount = () => {};

  handleMenu = data => {
    let { activeMenu } = this.state;
    activeMenu = data;
    this.setState({
      activeMenu,
    });
  };
  handleFlag = tab => {
    this.setState(prevState => ({
      [tab]: !prevState[tab],
    }));
  };
  render() {
    let { TreatmentFlag, ProductFlag, PrepaidFlag } = this.state;
    let { t } = this.props;
    return (
      <div className="row treatment-done-new p-3">
        <h5 className="mb-3">{t("Top Up")}</h5>
        <div className="d-flex flex-wrap w-100 mb-3 p-2">
          <div
            className="col-md-12 col-12 Accord-header cursor-pointer"
            onClick={() => this.handleFlag("TreatmentFlag")}
          >
            <div className="d-flex">
              <div className="h6 fw-500 col-6 col-md-9 text-left">
                {t("Treatment")}
              </div>
              <div className="h6 fw-500 col-6 col-md-3 text-right fs-18">
                {TreatmentFlag == false ? (
                  <AiOutlinePlus />
                ) : (
                  <AiOutlineMinus />
                )}
              </div>
            </div>
          </div>
          <div className={`mb-2" + ${TreatmentFlag ? "" : "d-none"}`}>
            <TopupTreatment
              id={this.props.basicApptDetail.custId}
              handleModal={this.props.handleModal}
            ></TopupTreatment>
          </div>
        </div>
        <div className="d-flex flex-wrap w-100 mb-3 p-2">
          <div
            className="col-md-12 col-12 Accord-header cursor-pointer"
            onClick={() => this.handleFlag("ProductFlag")}
          >
            <div className="d-flex">
              <div className="h6 fw-500 col-6 col-md-9 text-left">
                {t("Product")}
              </div>
              <div className="h6 fw-500 col-6 col-md-3 text-right fs-18">
                {ProductFlag == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
              </div>
            </div>
          </div>
          <div
            className={`mb-2 bg-whitesmoke" + ${ProductFlag ? "" : "d-none"}`}
          >
            <TopupProduct
              id={this.props.basicApptDetail.custId}
              handleModal={this.props.handleModal}
            ></TopupProduct>
          </div>
        </div>
        <div className="d-flex flex-wrap w-100 mb-3 p-2">
          <div
            className="col-md-12 col-12 Accord-header cursor-pointer"
            onClick={() => this.handleFlag("PrepaidFlag")}
          >
            <div className="d-flex">
              <div className="h6 fw-500 col-6 col-md-9 text-left">
                {t("Prepaid")}
              </div>
              <div className="h6 fw-500 col-6 col-md-3 text-right">
                {PrepaidFlag == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
              </div>
            </div>
          </div>

          <div className={`mb-2" + ${PrepaidFlag ? "" : "d-none"}`}>
            <TopupPrepaid
              id={this.props.basicApptDetail.custId}
              handleModal={this.props.handleModal}
            ></TopupPrepaid>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonCreateApi,
      commonPatchApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const Topup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(TopupClass)
);
