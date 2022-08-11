import React, { Component } from "react";
import {
  NormalButton,
  NormalModal,
  NormalInput,
  TableWrapper,
} from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import closeIcon from "assets/images/close.png";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { withTranslation } from "react-i18next";

export class ServiceExchangeClass extends Component {
  state = {
    treatmentList: [],
    treatmentListHeader: [
      { label: "Category", className: "w-50" },
      { label: "Service", className: "w-75" },
      {
        label: "Duration",
        className: "w-25",
        divClass: "justify-content-end text-right",
      },
      {
        label: "price",
        className: "w-50",
        divClass: "justify-content-end text-right",
      },
    ],
    meta: {},
    isShowExchangeModal: false,
  };

  render() {
    let { treatmentListHeader, meta, treatmentList } = this.state;
    return (
      <NormalModal
        className={"multiple-appointment select-category"}
        style={{ minWidth: "65%" }}
        modal={this.props.isShowExchangeModal}
        handleModal={this.props.handleExchange}
      >
        <img
          onClick={this.props.handleExchange}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="d-flex h4 justify-content-center p-1">
          {t("Service Exchange")}
        </div>
        <div className="customer-list container">
          <div className="table-container table-responsive mt-3">
            <TableWrapper
              headerDetails={treatmentListHeader}
              queryHandler={this.handlePagination}
              pageMeta={meta}
            >
              {treatmentList.length > 0 ? (
                treatmentList.map((item, index) => {
                  return (
                    <tr
                      className="w-100"
                      onClick={() => this.handleSelectTreatment(item)}
                      key={index}
                    >
                      <td>
                        <div className="text-left">{item.Item_Class}</div>
                      </td>
                      <td>
                        <div className="text-left">{item.item_desc}</div>
                      </td>
                      <td>
                        <div className="text-right">{item.add_duration}</div>
                      </td>
                      <td>
                        <div className="text-right">{item.item_price}</div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <td colSpan="12">
                  <div className="d-flex align-items-center justify-content-center">
                    No data available
                  </div>
                </td>
              )}
            </TableWrapper>
          </div>

          <div className="row text-center justify-center w-100">
            <NormalButton
              buttonClass={"col-3"}
              mainbg={true}
              className="col-12 ml-4 fs-15 "
              label="Confirm"
              onClick={this.handleConfirm}
            />
            <NormalButton
              buttonClass={"col-3"}
              resetbg={true}
              className="col-12 ml-4 fs-15 "
              label="Cancel"
              onClick={this.props.handleExchange}
            />
          </div>
        </div>
      </NormalModal>
    );
  }
}

const mapStateToProps = state => ({
  appointmentTreatmentList: state.appointment.appointmentTreatmentList,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const ServiceExchange = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ServiceExchangeClass)
);
