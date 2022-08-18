import React from "react";
import {
  NormalButton,
  NormalSelect,
  TableWrapper,
  NormalModal,
} from "component/common";
import { getTcmApi, tcmCreateApi } from "redux/actions/TCM";
import { updateForm } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { history } from "helpers";
import { withTranslation } from "react-i18next";
import { dateFormat } from "service/helperFunctions";
import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import Prescription from "../Report/Prescription";
import closeIcon from "assets/images/close.png";

export class TCMPaymentListClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Customer Code" },
      { label: "Customer Name" },
      { label: "NRIC" },
      { label: "Gender" },
      { label: "Age" },
      { label: "Date", divClass: "justify-content-end text-right" },
      { label: "Physician" },
      { label: "Status" },
      { label: "Total Amount", divClass: "justify-content-end text-right" },
      { label: "" },
      { label: "" },
      { label: "" },
    ],
    tcmPaymentList: [],
    pageMeta: {},
    active: false,
    currentIndex: -1,
    isPrintPdfClick: false,
    accountHeader: { name: "Prescription", address: "", logo: "" },
    tcmPrescriptionMain: [],
    tcmPrescriptionList: [],
    isConfirmOpen: false,
    AppointmentCode: "",
  };

  componentDidMount() {
    this.queryHandler({});
  }

  // api call for list
  queryHandler = data => {
    let payload = {
      siteCode: this.props.tokenDetails.site_code,
      date: dateFormat(new Date(), "yyyy-mm-dd"),
    };
    this.props.tcmCreateApi(`tcmCustomerListFronDesk/`, payload).then(res => {
      console.log(res, "dsfdfaafg");
      let { result, success } = res;
      let { tcmPaymentList } = this.state;
      if (success == "1" && result) {
        tcmPaymentList = result;
        this.setState({
          tcmPaymentList,
        });
      }
    });
  };

  handleGotoCart = data => {
    let formFields = { custId: 0, custName: "" };
    formFields["custId"] = data.customerId;
    formFields["custName"] = data.customerName;
    this.props.updateForm("basicApptDetail", formFields);

    history.push("/admin/cart");
  };
  handleSendBack = data => {
    this.setState({
      isConfirmOpen: true,
      AppointmentCode: data.apptCode,
    });
  };
  handlecloseDialog = () => {
    let { isConfirmOpen } = this.state;
    this.setState({
      isConfirmOpen: !isConfirmOpen,
    });
  };
  handleSendBackConfirm = () => {
    let payload = {
      AppointmentCode: this.state.AppointmentCode,
      status: "Verify",
      siteCode: this.props.tokenDetails.site_code,
    };
    this.props.tcmCreateApi(`tcmAppointmentStatus/`, payload).then(res => {
      console.log(res, "dsfdfaafgcustomerlist");
      let { result, success } = res;
      if (success == "1" && result) {
        this.queryHandler({});
      }
    });
    this.handlecloseDialog();
  };

  handlePrescription = data => {
    this.props
      .getTcmApi(
        `tcmPrescriptionReceipt/?PrescriptionNo=${data.prescriptionNo}`
      )
      .then(res => {
        let { result, success } = res;
        if (success == "1" && result) {
          console.log(result, "dsfdfaafgprescriptionresponse");
          this.setState({
            tcmPrescriptionMain: result,
          });
          this.props
            .getTcmApi(`tcmPrescription/?PrescriptionNo=${data.prescriptionNo}`)
            .then(res => {
              let { result, success } = res;
              if (success == "1" && result) {
                console.log(result, "dsfdfaafgprescriptionresponse");
                this.setState({
                  tcmPrescriptionList: result,
                });
                this.setState({ isPrintPdfClick: true });
              }
            });
        }
      });
  };
  handlePrintPdfFormat = url => {
    let { tcmPrescriptionMain } = this.state;
    console.log(tcmPrescriptionMain, "prescriptionmain");
    this.setState({
      isPrintPdfClick: false,
    });
    var a = document.createElement("a");
    a.setAttribute("download", `${tcmPrescriptionMain[0].prescriptionNo}.pdf`);
    a.setAttribute("href", url);
    a.click();
    window.open(url);
  };
  render() {
    let {
      headerDetails,
      tcmPaymentList,
      pageMeta,
      currentIndex,
      tcmPrescriptionList,
      isPrintPdfClick,
      accountHeader,
      tcmPrescriptionMain,
      isConfirmOpen,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="table-container mt-3">
          <TableWrapper
            headerDetails={headerDetails}
            // queryHandler={this.handlePagination}
            // pageMeta={pageMeta}
          >
            {tcmPaymentList.length > 0
              ? tcmPaymentList
                  .filter(
                    acc =>
                      String(acc.apptStatus).toUpperCase() === "VERIFY" ||
                      String(acc.apptStatus).toUpperCase() ===
                        "AWAITING PAYMENT"
                  )
                  .map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="text-left">{data.customerCode}</div>
                        </td>
                        <td>
                          <div className="text-left">{data.customerName}</div>
                        </td>
                        <td>
                          <div className="text-left">{data.custNRIC}</div>
                        </td>
                        <td>
                          <div className="text-left">{data.gender}</div>
                        </td>
                        <td>
                          <div className="text-left">{data.customerAge}</div>
                        </td>
                        <td>
                          <div className="text-right">{data.apptDate}</div>
                        </td>
                        <td>
                          <div className="text-left">{data.physician}</div>
                        </td>
                        <td>
                          <div className="text-left">{data.apptStatus}</div>
                        </td>
                        <td>
                          <div className="text-right">{data.paymentAmount}</div>
                        </td>
                        <td>
                          <div className="d-flex py-0">
                            <NormalButton
                              className={`fs-12`}
                              label="Prescribe"
                              mainbgrev={true}
                              onClick={() => this.handlePrescription(data)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex py-0">
                            <NormalButton
                              className="fs-12"
                              label="Payment"
                              styleFive={true}
                              onClick={() => this.handleGotoCart(data)}
                              disabled={
                                String(data.apptStatus).toUpperCase() === "DONE"
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex py-0">
                            <NormalButton
                              className="w-100 fs-12"
                              label="Send Back"
                              styleFour={true}
                              onClick={() => this.handleSendBack(data)}
                              disabled={
                                String(data.apptStatus).toUpperCase() ===
                                "AWAITING PAYMENT"
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
              : null}
          </TableWrapper>
          <NormalModal
            className={"multiple-appointment"}
            modal={isConfirmOpen}
            //style={{ minWidth: "30%" }}
            handleModal={() => {}}
          >
            <div className="row m-2">
              <div className="col-12 h4 p-0">{t("Confirm")}</div>

              <div className="col-12 h6">
                {t("Are you sure want to update")}?
              </div>

              <div className="d-flex justify-content-start mt-4 w-100">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="col-12 multiple-customer"
                  label={"Cancel"}
                  onClick={this.handlecloseDialog}
                />
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbgrev={true}
                  className="col-12 fs-15 multiple-customer"
                  label={"Confirm"}
                  onClick={this.handleSendBackConfirm}
                />
              </div>
            </div>
          </NormalModal>
        </div>

        {isPrintPdfClick ? (
          <PDFDownloadLink
            document={
              <Prescription
                TableDetail={tcmPrescriptionList}
                MainInfo={tcmPrescriptionMain}
                accountHeader={accountHeader}
                Flag={1}
                landscape={false}
              />
            }
          >
            {({ blob, url, loading, error }) =>
              !loading && url ? this.handlePrintPdfFormat(url) : null
            }
          </PDFDownloadLink>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getTcmApi,
      tcmCreateApi,
      updateForm,
    },
    dispatch
  );
};

export const TCMPaymentList = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(TCMPaymentListClass)
);
