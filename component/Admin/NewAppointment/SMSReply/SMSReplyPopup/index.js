import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonCreateApi,
  commonPatchApi,
} from "redux/actions/common";
import { NormalButton, TableWrapper } from "component/common";

export class SMSReplyPopupClass extends Component {
  state = {
    headerDetails: [
      {
        label: "Appnt Date",
        divClass: "justify-content-end text-right",
      },
      { label: "Service Name" },
      { label: "Staff" },
      { label: "Current Status" },
    ],
    smsReplyDetailInfo: [],
  };

  componentDidMount = () => {
    this.getTransactions();
  };
  getTransactions = () => {
    let { smsReplyDetailInfo, formField } = this.state;
    this.props
      .getCommonApi(`smsreply/${this.props.TransactionId}/`)
      .then(async res => {
        console.log(res, "selectedcustomerlistdsfdfaafg");
        await this.setState({ smsReplyDetailInfo: [] });
        let { data } = res;
        if (data) {
          smsReplyDetailInfo = res.data;
        }
        this.setState({ smsReplyDetailInfo });
      });
  };
  handleCancelAppointment = () => {
    let body = { appt_status: "Cancelled" };

    this.props
      .commonPatchApi(`smsreply/${this.props.TransactionId}/`, body)
      .then(res => {
        if (res.status == 200) {
          this.props.handleModal();
        }
      });
  };
  handleConfirmAppointment = () => {
    let body = { appt_status: "Confirmed" };
    this.props
      .commonPatchApi(`smsreply/${this.props.TransactionId}/`, body)
      .then(res => {
        if (res.status == 200) {
          this.props.handleModal();
        }
      });
  };
  render() {
    let { t } = this.props;
    let { headerDetails, smsReplyDetailInfo } = this.state;
    return (
      <>
        <div className="billing-section">
          <div className="d-flex align-items-center">
            <div className="col-12">
              <p className="h5 mb-2">{t("Status Update")}</p>
            </div>
          </div>

          <div className="col-md-12">
            <div className="d-flex flex-wrap">
              <div className="col-md-5 col-12">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Name")} : {smsReplyDetailInfo.cust_name}
                </label>
              </div>
              <div className="col-md-6 col-12">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Phone")} :{smsReplyDetailInfo.phone}
                </label>
              </div>
            </div>
            <div className="col-12">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Reply")} : {smsReplyDetailInfo.reply}
              </label>
            </div>
          </div>

          <div className="col-12">
            <div className="py-4">
              <div className="table-container">
                <TableWrapper
                  headerDetails={headerDetails}
                  //queryHandler={this.handlePagination}
                  // pageMeta={pageMeta}
                >
                  {smsReplyDetailInfo ? (
                    <tr key={smsReplyDetailInfo.id}>
                      <td>
                        <div className="text-right">
                          {smsReplyDetailInfo.appt_date}
                        </div>
                      </td>
                      <td>
                        <div className="text-left">
                          {smsReplyDetailInfo.service_name}
                        </div>
                      </td>
                      <td>
                        <div className="text-left">
                          {smsReplyDetailInfo.staff_name}
                        </div>
                      </td>
                      <td>
                        <div className="text-left">
                          {smsReplyDetailInfo.appt_status}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="text-center">No data</div>
                      </td>
                    </tr>
                  )}
                </TableWrapper>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <div className="col-md-8">
                <div className="d-flex justify-content-end">
                  <NormalButton
                    submitBtn={true}
                    className="col-12 mr-2"
                    label={t("Confirm")}
                    onClick={this.handleConfirmAppointment}
                  />
                  <NormalButton
                    resetbg={true}
                    className="col-12 ml-2"
                    label="Cancel Appointment"
                    onClick={this.handleCancelAppointment}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      commonPatchApi,
    },
    dispatch
  );
};
export const SMSReplyPopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SMSReplyPopupClass)
);
