import React, { Component } from "react";
import { NormalButton, NormalSelect } from "component/common";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { history } from "helpers";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
// import { ChangePayment } from "./ChangePayment";
// import { ChangeStaff } from "./ChangeStaff";
import { NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
// import { ChangeDate } from "./ChangeDate";

import { SignPanel } from "component/common/SignPanel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "component/Admin/Report/Account/Invoice";

// import logo from 'assets/images/logo.png'

export class PrintDeliverModuleClass extends Component {
  state = {
    responseData: [],
    downloadlLink: "",
    isOpenPayment: false,
    isOpenstaff: false,
    settingData: {},
    isOpenDate: false,
    signPhoto: "",
    isPrintPdfClick: false,
  };

  componentDidMount() {
    this.getResponseDate();
    // this.handlePrint();
    // this.handleItemSettings();
    this.signFunc();
  }

  signFunc = () => {
    this.props
      .getCommonApi(`deliveryordersign/?do_id=${this.props.match.params.id}`)
      .then((res) => {
        console.log("responseofprint:", res);
        if (res.status != 204) {
          this.setState({ signPhoto: res.data[0].do_sig });
        }
      });
  };

  getResponseDate = () => {
    this.props
      .getCommonApi(
        `deliveryinvoicepdf/?searchid=${this.props.match.params.id}`
      )
      .then((res) => {
        console.log("responseofprint:", res);
        this.setState({ responseData: res.data });
      });
  };

  handleItemSettings = () => {
    let { settingData } = this.state;
    this.props.getCommonApi(`userlist/`).then((key) => {
      let { status, data } = key;
      console.log(key, "settingsData changeprice");
      if (status === 200) {
        settingData = data;
        this.setState({ settingData });
      }
    });
  };
  // for get Print response
  handlePrint = () => {
    this.props
      .getCommonApi(`receiptpdf/?sa_transacno=${this.props.match.params.id}`)
      .then((res) => {
        this.setState({ downloadlLink: res.data });
      });
  };

  // for share reciept
  handleShare = () => {
    this.props
      .commonCreateApi(
        `receiptpdfsend/?sa_transacno=${this.props.match.params.id}`
      )
      .then((res) => {
        this.setState({ responseData: res });
      });
  };

  // for send sms reciept
  handleSendSMS = () => {
    this.props
      .commonCreateApi(
        // `receiptpdfsendsms/?sa_transacno=${this.props.match.params.id}`
        `receiptpdfsendsms/?sa_transacno=THS0110000612`
      )
      .then((res) => {});
  };
  //   handleChangePayment = () => {
  //     this.setState({ isOpenPayment: true });
  //   };

  handlestaffchange = () => {
    this.setState({ isOpenstaff: true });
  };

  handleDialog = async () => {
    let { isOpenPayment, isOpenstaff, isOpenDate } = this.state;
    isOpenPayment = false;
    isOpenstaff = false;
    isOpenDate = false;

    await this.setState({
      isOpenPayment,
      isOpenstaff,
      isOpenDate,
    });
  };
  //   handleChangeDateDialog = () => {
  //     this.handleDialog();
  //     this.componentDidMount();
  //   };
  //   handleChangeDate = () => {
  //     this.setState({ isOpenDate: true });
  //   };
  handleSignSaveClick = (imgData) => {
    // var block = imgData.split(";");
    // // Get the content type of the image
    // var contentType = block[0].split(":")[1]; // In this case "image/gif"
    // // get the real base64 content of the file
    // var realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

    // // Convert it to a blob to upload
    // var blob = this.b64toBlob(realData, contentType);

    let formData = new FormData();
    formData.append("do_id", this.props.match.params.id);
    formData.append(
      "do_sig",
      this.dataURLtoFile(imgData, `${this.props.match.params.id}.jpeg`)
    );

    this.props.commonCreateApi(`deliveryordersign/`, formData).then((key) => {
      let { status, data } = key;
      if (status == 201) {
        this.signFunc();
      }
    });
  };

  dataURLtoFile = (dataurl, filename, mime) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  handlePrintPdfFormat = (url) => {
    this.setState({
      isPrintPdfClick: false,
    });
    var a = document.createElement("a");
    a.setAttribute("download", `${new Date()}.pdf`);
    a.setAttribute("href", url);
    a.click();
    window.open(url);
  };
  render() {
    let {
      responseData = [],
      downloadlLink,
      isOpenPayment,
      isOpenstaff,
      settingData,
      isOpenDate,
    } = this.state;
    let {
      hdr_data = [],
      dtl_data = [],
      sub_data = {},
      taud_data = [],
      footer = {},
      company_hdr = {},
      taud_sub = {},
    } = responseData;
    return (
      <>
        <div className="print-section container">
          <div className="print-bill">
            <div className="receipt card">
              <div className="logo-header">
                <div className="d-flex justify-content-center">
                  <div className="col-10">
                    <div className="row">
                      <div className="col-3">
                        <img
                          src={this.state.responseData[0]?.company_header.logo}
                          alt=""
                        ></img>
                      </div>
                      <div className="col-9">
                        <h3 className="bill-head">
                          {this.state.responseData[0]?.company_header.name}
                        </h3>
                        <p className="receipt-detail">
                          {this.state.responseData[0]?.company_header.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bill-header">
                <div className="row ">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-3 f-600">Invoice No.</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.do_number}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Invoice Date</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.created_at}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-3  f-600">Status</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.status}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-3  f-600">Project</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.title}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Validity</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.validity}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-3  f-600">Terms</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.terms}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Company Name</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.company}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Attn To</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.footer}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Prepared By</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.deliveryorder.in_charge}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Printed On</div>
                      <div className="col-9">
                        {new Date().toISOString().slice(0, 10)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bill-detail mt-4 py-1">
                <div className="row m-0 table-header  f-600">
                  <div className="col-2">Code</div>
                  <div className="col-4 text-left">Description</div>
                  <div className="col-2 text-right">Quantity</div>
                  <div className="col-2 text-right">Unit Price</div>
                  <div className="col-2 text-right">Amount.</div>
                </div>
                {this.state.responseData[0]?.deliveryitem.map((item, index) => {
                  return (
                    <div className="row m-0 mt-2" key={index}>
                      <div className="col-2">{item.quotation_itemcode}</div>
                      <div className="col-4 text-left">
                        {item.quotation_itemdesc}
                      </div>
                      {/* <div className="col-2 text-right">{item.quotation_itemdesc}</div> */}
                      <div className="col-2 text-right">
                        {item.quotation_quantity}
                      </div>
                      <div className="col-2 text-right">
                        {item.quotation_unitprice}
                      </div>
                      <div className="col-2 text-right">
                        {item.quotation_unitprice * item.quotation_quantity}
                      </div>
                    </div>
                  );
                })}

                <div className="row table-header sub-total m-0 fs-14 f-600 mt-5">
                  {/* <div className="col-4 text-right">{sub_data.sub_total}</div> */}
                  <div className="col-4 text-right"></div>
                  <div className="col-1 text-right">{sub_data.tot_qty}</div>
                  <div className="col-1 text-right">{sub_data.tot_price}</div>
                  <div className="col-1 text-right">{sub_data.tot_disc}</div>
                  <div className="col-1 text-right">{sub_data.tot_net}</div>
                  <div className="col-1 text-right">{sub_data.tot_paid}</div>
                  <div className="col-2 d-none">{sub_data.tot_bal}</div>
                </div>
              </div>
              <div className="payment-detail my-4 fs-14 f-600 mb-5">
                <div className="row m-0">
                  <div className="col-7"></div>
                  {/* <div className="col-7">
                    <div className="row payment-header">
                      <div className="col-4">No</div>
                      <div className="col-4">Type</div>
                      <div className="col-4">Amount</div>
                    </div>
                    {taud_data.length > 0
                      ? taud_data.map((item, index) => {
                          return (
                            <div className="row payment-header" key={index}>
                              <div className="col-4">{item.pay_rem1}</div>
                              <div className="col-4">{item.pay_type_name}</div>
                              <div className="col-4 text-right">
                                $ {item.pay_amt}
                              </div>
                            </div>
                          );
                        })
                      : ""}
                    <div className="row payment-footer">
                      <div className="col-4 fs-11">{taud_sub.gst_label}</div>
                      <div className="col-4">Total</div>
                      <div className="col-4 text-right">{taud_sub.total}</div>
                    </div>
                  </div> */}
                  <div className="col-5 text-right">
                    <div className="row">
                      <div className="col-6">Shipping Cost :</div>
                      <div className="col-6 text-right">
                        {this.state.responseData[0]?.deliverydtl.q_shipcost}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">Discount :</div>
                      <div className="col-6 text-right">
                        {" "}
                        {this.state.responseData[0]?.deliverydtl.q_discount}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">Taxes :</div>
                      <div className="col-6 text-right">
                        {this.state.responseData[0]?.deliverydtl.q_taxes}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6"> Total :</div>
                      <div className="col-6 text-right">
                        {this.state.responseData[0]?.deliverydtl.q_total}
                      </div>
                    </div>
                  </div>
                </div>
                {/* used payment list */}
              </div>
              <div className="invoice-footer mt-5">
                <div className="row m-0">
                  <div className="col-9 fs-12">
                    <p className="">
                      Remark:{" "}
                      {this.state.responseData[0]?.deliveryorder.remarks}
                    </p>

                    {footer.footer1 ? <p>1. {footer.footer1}</p> : ""}
                    {footer.footer2 ? <p>2. {footer.footer2}</p> : ""}
                    {footer.footer3 ? <p>3. {footer.footer3}</p> : ""}
                    {footer.footer4 ? <p>4. {footer.footer4}</p> : ""}
                  </div>
                  <div className="col-3 text-center p-1">
                    {this.state.signPhoto ? (
                      <img
                        className={`sigImage`}
                        alt=""
                        width={200}
                        height={150}
                        src={this.state.signPhoto}
                      />
                    ) : (
                      <SignPanel
                        handleSignSaveClick={(imgData) =>
                          this.handleSignSaveClick(imgData)
                        }
                      />
                    )}
                    Customer Signature
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 d-flex text-center action-buttons">
              {/* {(Number(this.props.tokenDetails.role_code) == 1 ||
                Number(this.props.tokenDetails.role_code) == 2) &&
              settingData.showChangeStaff ? (
                <div className="w-100 mr-2">
                  <NormalButton
                    onClick={this.handlestaffchange}
                    label="Change Staff"
                    mainbg={true}
                    className="print"
                  />
                </div>
              ) : (
                ""
              )}
              {(Number(this.props.tokenDetails.role_code) == 1 ||
                Number(this.props.tokenDetails.role_code) == 2) &&
              settingData.showChangeDate ? (
                <div className="w-100 mr-2">
                  <NormalButton
                    onClick={this.handleChangeDate}
                    label="Change Date"
                    mainbg={true}
                    className="print"
                  />
                </div>
              ) : (
                ""
              )}
              {(Number(this.props.tokenDetails.role_code) == 1 ||
                Number(this.props.tokenDetails.role_code) == 2) &&
              settingData.showChangePayMode ? (
                <div className="w-100 mr-2">
                  <NormalButton
                    onClick={this.handleChangePayment}
                    label="Change Payment"
                    mainbg={true}
                    className="print"
                  />
                </div>
              ) : null} */}
              <div className="w-100 mr-2">
                <NormalButton
                  onClick={() => {
                    this.setState({
                      isPrintPdfClick: true,
                    });
                  }}
                  label="Print"
                  success={true}
                  className="print"
                />
                {this.state.isPrintPdfClick ? (
                  <PDFDownloadLink
                    document={
                      <Invoice
                        TableList={this.state.responseData[0]}
                        accountHeader={
                          this.state.responseData[0]["company_header"]
                        }
                        signPhoto={this.state.signPhoto}
                        Flag={9}
                        landscape={false}
                      />
                    }
                  >
                    {({ blob, url, loading, error }) =>
                      !loading && url ? this.handlePrintPdfFormat(url) : null
                    }
                  </PDFDownloadLink>
                ) : null}
              </div>
              {/* <div className="w-100 ml-2">
                <NormalButton
                  onClick={this.handleShare}
                  label="Share"
                  className="share"
                />
              </div>
              <div className="w-100 ml-2">
                <NormalButton
                  onClick={this.handleSendSMS}
                  label="Send SMS"
                  className="share"
                />
              </div>*/}
            </div>
          </div>
        </div>
        {/* <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenPayment}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <ChangePayment
            TransactionId={this.props.match.params.id}
            handleModal={this.handleChangeDateDialog}
          ></ChangePayment>
        </NormalModal> */}

        {/* <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenstaff}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <ChangeStaff
            TransactionId={this.props.match.params.id}
            handleModal={this.handleChangeDateDialog}
          ></ChangeStaff>
        </NormalModal> */}
        {/* <NormalModal
          className={"changeDate-modal"}
          style={{ minWidth: "25%" }}
          modal={isOpenDate}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <ChangeDate
            TransactionId={this.props.match.params.id}
            TransactionDate={hdr_data.sa_date}
            handleModal={this.handleChangeDateDialog}
          ></ChangeDate>
        </NormalModal> */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  appointmentDetail: state.appointment.appointmentDetail,
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const PrintDeliverModule = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrintDeliverModuleClass);
