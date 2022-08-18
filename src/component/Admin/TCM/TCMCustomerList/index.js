import React from "react";
import { NormalButton, NormalSelect, TableWrapper } from "component/common";
import { getTcmApi, tcmCreateApi } from "redux/actions/TCM";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { withTranslation } from "react-i18next";
import { dateFormat } from "service/helperFunctions";
import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import MedicalCertificate from "../Report/MedicalCertificate";
import Receipt from "../Report/Receipt";

export class TCMCustomerListClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Customer Code" },
      { label: "Customer Name" },
      { label: "Contact" },
      { label: "Gender" },
      {
        label: "Appointment Timing",
        divClass: "justify-content-end text-right",
      },
      { label: "Location" },
      { label: "Physician" },
      { label: "Status" },
      { label: "", width: "100px" },
    ],
    tcmCustomerList: [],
    pageMeta: {},
    active: false,
    currentIndex: -1,
    isPrintPdfClick: false,
    accountHeader: {},
    tcmPrescriptionMain: [],
    MedicalCertificateResult: [],
    isMedicalCertificateClick: false,
  };

  componentDidMount() {
    this.queryHandler({});
    this.getSiteBaseTitle();
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
      let { tcmCustomerList } = this.state;
      if (success == "1" && result) {
        tcmCustomerList = result;
        this.setState({
          tcmCustomerList,
        });
      }
    });
  };

  getSiteBaseTitle = () => {
    this.props
      .getTcmApi(
        `getInvoiceTitle/?siteCode=${this.props.tokenDetails.site_code}`
      )
      .then(res => {
        console.log(res, "invoicetitle");
        let { result, success } = res;
        if (success == "1" && result) {
          this.setState({
            accountHeader: result,
          });
        }
      });
  };
  getMedicalCertificate = data => {
    this.props.getTcmApi(`tcmMedicalCertificate/?MCNo=${data}`).then(res => {
      let { result, success } = res;
      console.log(res, "Mcnumber repsonse");
      if (success == "1" && result) {
        this.getSiteBaseTitle();
        this.setState({
          MedicalCertificateResult: result,
          isMedicalCertificateClick: true,
        });
      }
    });
  };
  handlePrintPdfFormat = url => {
    let { tcmPrescriptionMain } = this.state;
    this.setState({
      isPrintPdfClick: false,
    });
    var a = document.createElement("a");
    a.setAttribute("download", `${tcmPrescriptionMain[0].prescriptionNo}.pdf`);
    a.setAttribute("href", url);
    a.click();
    window.open(url);
  };
  handleReceipt = data => {
    this.props
      .getTcmApi(
        `tcmPrescriptionReceipt/?PrescriptionNo=${data.prescriptionNo}`
      )
      .then(res => {
        let { result, success } = res;
        if (success == "1" && result) {
          this.getSiteBaseTitle();
          this.setState({
            tcmPrescriptionMain: result,
            isPrintPdfClick: true,
          });
        }
      });
  };
  handleMedicalReceiptPdfFormat = url => {
    var a = document.createElement("a");
    a.setAttribute("download", `${`MedicalCertificate`}.pdf`);
    a.setAttribute("href", url);
    a.click();
    this.setState({
      isMedicalCertificateClick: false,
    });
    window.open(url);
  };

  render() {
    let {
      headerDetails,
      tcmCustomerList,
      isPrintPdfClick,
      accountHeader,
      tcmPrescriptionMain,
      isMedicalCertificateClick,
      MedicalCertificateResult,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="table-container table-responsive mt-3">
          <TableWrapper
            headerDetails={headerDetails}
            // queryHandler={this.handlePagination}
            // pageMeta={pageMeta}
          >
            {tcmCustomerList.length > 0
              ? tcmCustomerList.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="text-left">{data.customerCode}</div>
                      </td>
                      <td>
                        <div className="text-left">{data.customerName}</div>
                      </td>
                      <td>
                        <div className="text-left">{data.contactNo}</div>
                      </td>
                      <td>
                        <div className="text-left">{data.gender}</div>
                      </td>
                      <td>
                        <div className="text-right">{data.apptDate}</div>
                      </td>
                      <td>
                        <div className="text-left">{data.location}</div>
                      </td>
                      <td>
                        <div className="text-left">{data.physician}</div>
                      </td>
                      <td>
                        <div className="text-left">{data.apptStatus}</div>
                      </td>
                      <td className="position-relative">
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalButton
                            className="fs-12"
                            label="Receipt"
                            mainbgrev={true}
                            onClick={() => this.handleReceipt(data)}
                            disabled={
                              String(data.apptStatus).toUpperCase() === "DONE"
                                ? false
                                : true
                            }
                          />
                          <NormalButton
                            className="fs-12 ml-2"
                            label="MC"
                            mainbgrev={true}
                            // onClick={() => this.getMedicalCertificate("MC100051")}
                            onClick={() =>
                              this.getMedicalCertificate(data.MCNo)
                            }
                            disabled={
                              String(data.apptStatus).toUpperCase() ===
                                "DONE" && data.MCNo
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

          {isPrintPdfClick ? (
            <PDFDownloadLink
              document={
                <Receipt
                  MainInfo={this.state.tcmPrescriptionMain}
                  accountHeader={this.state.accountHeader}
                  landscape={false}
                />
              }
            >
              {({ blob, url, loading, error }) =>
                !loading && url ? this.handlePrintPdfFormat(url) : null
              }
            </PDFDownloadLink>
          ) : null}

          {isMedicalCertificateClick ? (
            <PDFDownloadLink
              document={
                <MedicalCertificate
                  CertificateData={this.state.MedicalCertificateResult}
                  HeaderDetail={this.state.accountHeader}
                  landscape={false}
                />
              }
            >
              {({ blob, url, loading, error }) =>
                !loading && url ? this.handleMedicalReceiptPdfFormat(url) : null
              }
            </PDFDownloadLink>
          ) : null}
        </div>
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
    },
    dispatch
  );
};

export const TCMCustomerList = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(TCMCustomerListClass)
);
