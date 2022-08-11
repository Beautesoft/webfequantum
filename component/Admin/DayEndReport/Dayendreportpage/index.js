import React from "react";
import { Toast } from "service/toast";
import "../style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { getTokenDetails } from "redux/actions/auth";
import { NormalButton, NormalDate, TableWrapper } from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DayEndPdf from "../DayEndPdf";
import moment from "moment";

export class DayendreportpageClass extends React.Component {
  state = {
    salesCollectionHeader: [
      { label: "Sales Collection" },
      { label: "Before Tax", divClass: "justify-content-end text-right" },
      { label: "Qty", divClass: "justify-content-end text-right" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    nonSalesCollectionHeader: [
      { label: "Non Sales Collection" },
      { label: "Qty", divClass: "justify-content-end text-right" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    ServicesalesHeader: [
      { label: "Service Sales" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    nonSalesDetailCollectionHeader: [
      { label: "Customer Code" },
      { label: "Customer Name" },
      { label: "Desc" },
      { label: "Qty", divClass: "justify-content-end text-right" },
      { label: "Balance", divClass: "justify-content-end text-right" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    deptSalesHeader: [
      { label: "Dept Sales" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    salesTransactionHeader: [
      { label: "Sales Transaction" },
      { label: "Customer Code" },
      { label: "Customer Name" },
      { label: "Desc" },
      { label: "Qty", divClass: "justify-content-end text-right" },
      { label: "Amount", divClass: "justify-content-end text-right" },
      { label: "Balance", divClass: "justify-content-end text-right" },
      { label: "Net Amount", divClass: "justify-content-end text-right" },
      { label: "Paid", divClass: "justify-content-end text-right" },
      { label: "Outstanding", divClass: "justify-content-end text-right" },
    ],
    ARTransactionHeader: [
      { label: "AR Transaction" },
      { label: "Customer Code" },
      { label: "Customer Name" },
      { label: "Desc" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    TreatmentDoneHeader: [
      { label: "Treatment Done" },
      { label: "Customer" },
      { label: "Cust Code" },
      { label: "Cust Reference" },
      { label: "Description" },
      { label: "Staff" },
      { label: "Purchase Outlet" },
      { label: "TD Outlet" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    CreditNoteConsumptionHeader: [
      { label: "Credit Note Consumption" },
      { label: "Course" },
      { label: "Qty", divClass: "justify-content-end text-right" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    DayDate: new Date(),
    runDayEnd: false,
    reportDate: "",
    sales_collec: null,
    sales_trasac: null,
    ar_trasac: null,
    treatment_done: null,
    dept_sales: "",
    isPrintPdfClick: false,
    accountHeader: {},
    invcn_lst: "",
    ser_sal_lst: null,
  };

  componentDidMount = () => {
    this.setState({
      reportDate: this.state.DayDate,
    });
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };
  dayRunClick = async () => {
    await this.setState({
      runDayEnd: true,
      reportDate: this.state.DayDate,
    });
    this.runDayEndClick();
  };
  runDayEndClick = () => {
    let { tokenDetails } = this.props;
    this.props
      .getCommonApi(
        `dayendlist/?date=${dateFormat(
          this.state.reportDate,
          "yyyy-mm-dd"
        )}&type=list`
      )
      .then(async key => {
        let {
          status,
          sales_collec,
          nonsales_collec,
          sales_trasac,
          ar_trasac,
          treatment_done,
          dept_sales,
          header_data,
          invcn_lst,
          ser_sal_lst,
        } = key;
        console.log(key, "listdayendresponse");
        if (status === 200) {
          await this.setState({
            sales_collec,
            nonsales_collec,
            sales_trasac,
            ar_trasac,
            treatment_done,
            dept_sales,
            accountHeader: header_data,
            invcn_lst,
            ser_sal_lst,
          });
          if (tokenDetails.dayendScreenOption1or2) {
            await this.setState({
              isPrintPdfClick: true,
            });
          }
        }
      });
  };

  // dayEndPrintClick = async () => {
  //   await this.setState({
  //     isPrintPdfClick: true,
  //   });
  //   // this.props
  //   //   .getCommonApi(
  //   //     `dayendlist/?date=${dateFormat(
  //   //       this.state.reportDate,
  //   //       "yyyy-mm-dd"
  //   //     )}&type=pdf`
  //   //   )
  //   //   .then(key => {
  //   //     let { status, data } = key;
  //   //     if (status === 200) {
  //   //       window.open(data);
  //   //     }
  //   //   });
  // };
  dayEndEmailRunClick = () => {
    this.props
      .getCommonApi(
        `dayendlist/?date=${dateFormat(
          this.state.reportDate,
          "yyyy-mm-dd"
        )}&type=email`
      )
      .then(key => {
        if (key.status === 200 || key.status == 201) {
        } else {
          Toast({ type: "error", message: key.message });
        }
      });
  };

  handlePrintPdfFormat = url => {
    this.setState({
      printpdfurl: url,
      isPrintPdfClick: false,
    });

    if (url) {
      let Filedt = new File([url], `${this.state.reportDate}.pdf`);

      let formData = new FormData();
      formData.append("pdf", Filedt, `${this.state.reportDate}.pdf`);

      //console.log(pdf, "filecontentlog");
      this.props.commonCreateApi(`upload/`, formData).then(async key => {});
    }
  };
  dayEndPrintClick = () => {
    let { tokenDetails } = this.props;
    if (tokenDetails.dayendScreenOption1or2) {
      let { printpdfurl } = this.state;
      var a = document.createElement("a");
      a.setAttribute("download", `${this.state.reportDate}.pdf`);
      a.setAttribute("href", printpdfurl);
      a.click();
    } else {
      this.props
        .getCommonApi(
          `dayendlist/?date=${dateFormat(
            this.state.reportDate,
            "yyyy-mm-dd"
          )}&type=pdf`
        )
        .then(key => {
          let { status, data } = key;
          if (status === 200) {
            window.open(data);
          }
        });
    }
  };

  render() {
    let {
      salesCollectionHeader,
      nonSalesCollectionHeader,
      deptSalesHeader,
      salesTransactionHeader,
      ARTransactionHeader,
      TreatmentDoneHeader,
      runDayEnd,
      DayDate,
      reportDate,

      sales_collec,
      nonsales_collec,
      sales_trasac,
      ar_trasac,
      treatment_done,
      dept_sales,
      nonSalesDetailCollectionHeader,
      isPrintPdfClick,
      accountHeader,
      CreditNoteConsumptionHeader,
      invcn_lst,
      ServicesalesHeader,
      ser_sal_lst,
    } = this.state;

    let { t, tokenDetails } = this.props;
    return (
      <div className="dayendreportpage">
        <div className="row mb-3">
          <div className="col-sm-1 text-right">{t("Date")}</div>
          <div className="col-sm-2">
            <NormalDate
              value={new Date(DayDate)}
              name="DayDate"
              type="date"
              onChange={this.handleChange}
              //minDate={new Date()}
              showDisabledMonthNavigation
            />
          </div>
          <NormalButton
            className="fs-15 col-12 ml-2 float-right"
            label="Run Day End Report"
            mainbg={true}
            onClick={this.dayRunClick}
          />
        </div>
        {isPrintPdfClick ? (
          <PDFDownloadLink
            document={
              <DayEndPdf
                SalesCollectionList={sales_collec ? sales_collec : ""}
                DeptSalesList={dept_sales ? dept_sales : ""}
                NonSalesCollectionList={nonsales_collec ? nonsales_collec : ""}
                ARTransactionList={ar_trasac && ar_trasac ? ar_trasac : ""}
                salesTransactionList={sales_trasac ? sales_trasac : ""}
                NonSalesDetailCollectionList={
                  nonsales_collec ? nonsales_collec : ""
                }
                TreatmentDoneList={treatment_done ? treatment_done : ""}
                accountHeader={accountHeader}
                landscape={true}
                reportDate={moment(this.state.reportDate).format("DD-MM-YYYY")}
              />
            }
          >
            {({ blob, url, loading, error }) =>
              !loading && url ? this.handlePrintPdfFormat(url) : null
            }
          </PDFDownloadLink>
        ) : null}

        {runDayEnd ? (
          <div className="col-12 mt-4">
            <div className="w-100">
              <div className="d-flex justify-content-center align-items-center fw-500 h5 mb-2 day-end-title">
                {t("Day End Report for")}&nbsp;
                {reportDate !== "" ? dateFormat(reportDate, "dd-mm-yyyy") : ""}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-7">
                <TableWrapper
                  className="table table-responsive mb-3"
                  headerDetails={salesCollectionHeader}
                >
                  {sales_collec && sales_collec.sales.length > 0 ? (
                    sales_collec.sales.map((item, index) => {
                      let { desc, amount, qty, before_tax } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-right">{before_tax}</div>
                          </td>
                          <td>
                            <div className="text-right">{qty}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {sales_collec && sales_collec.sales.length > 0 ? (
                    <tr>
                      <td>
                        <div className="d-flex align-items-center justify-content-end fw-500">
                          {`Total`}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {sales_collec.total_tax}
                        </div>
                      </td>

                      <td>
                        <div className="text-right">{sales_collec.qty}</div>
                      </td>
                      <td>
                        <div className="text-right">{sales_collec.total}</div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
                <TableWrapper
                  className="mb-3"
                  headerDetails={CreditNoteConsumptionHeader}
                >
                  {invcn_lst && invcn_lst.invcn_lst.length > 0 ? (
                    invcn_lst.invcn_lst.map((item, index) => {
                      let { sa_transacno_ref, course, qty, used_amt } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{sa_transacno_ref}</div>
                          </td>
                          <td>
                            <div className="text-left">{course}</div>
                          </td>
                          <td>
                            <div className="text-right">{qty}</div>
                          </td>
                          <td>
                            <div className="text-right">{used_amt}</div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {invcn_lst && invcn_lst.invcn_lst.length > 0 ? (
                    <tr className="day-end-footer fw-500">
                      <td></td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {invcn_lst.total_qty ? invcn_lst.total_qty : ""}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(invcn_lst.total_amount).toFixed(2)
                            ? Number(invcn_lst.total_amount).toFixed(2)
                            : ""}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
              </div>

              <div className="col-sm-5">
                <TableWrapper className="mb-3" headerDetails={deptSalesHeader}>
                  {dept_sales && dept_sales.dept_sales.length > 0 ? (
                    dept_sales.dept_sales.map((item, index) => {
                      let { dept_sales, amount } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{dept_sales}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {dept_sales && dept_sales.dept_sales.length > 0 ? (
                    <tr className="day-end-footer fw-500">
                      <td>
                        <div className="d-flex align-items-center justify-content-end">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(dept_sales.total_amount).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
                <TableWrapper
                  className="mb-3"
                  headerDetails={nonSalesCollectionHeader}
                >
                  {nonsales_collec && nonsales_collec.nonsales.length > 0 ? (
                    nonsales_collec.nonsales.map((item, index) => {
                      let { desc, qty, amount } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-right">{qty}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {nonsales_collec && nonsales_collec.nonsales.length > 0 ? (
                    <tr>
                      <td>
                        <div className="d-flex align-items-center justify-content-end fw-500">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">{nonsales_collec.qty}</div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(nonsales_collec.total).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-7">
                <TableWrapper
                  className="table table-responsive mb-3"
                  headerDetails={ServicesalesHeader}
                >
                  {ser_sal_lst && ser_sal_lst.ser_sal_lst.length > 0 ? (
                    ser_sal_lst.ser_sal_lst.map((item, index) => {
                      let { desc, amount, qty } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {ser_sal_lst && ser_sal_lst.ser_sal_lst.length > 0 ? (
                    <tr className="day-end-footer fw-500">
                      <td>
                        <div className="d-flex align-items-center justify-content-end">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(ser_sal_lst.total_amount).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-sm-12 col-12">
                <TableWrapper
                  className="mb-3"
                  headerDetails={ARTransactionHeader}
                >
                  {ar_trasac && ar_trasac.ar_trasac.length > 0 ? (
                    ar_trasac.ar_trasac.map((item, index) => {
                      let {
                        satransac_ref,
                        amount,
                        cust_code,
                        cust_name,
                        desc,
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{satransac_ref}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_code}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_name}</div>
                          </td>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {ar_trasac && ar_trasac.ar_trasac.length > 0 ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end fw-500">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(ar_trasac.total_amount).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>

                <TableWrapper
                  className="mb-3"
                  headerDetails={salesTransactionHeader}
                >
                  {sales_trasac && sales_trasac.sales_trasac.length > 0 ? (
                    sales_trasac.sales_trasac.map((item, index) => {
                      let {
                        satransac_ref,
                        amount,
                        paid,
                        outstanding,
                        cust_code,
                        cust_name,
                        desc,
                        qty,
                        balance,
                        amt,
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{satransac_ref}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_code}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_name}</div>
                          </td>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-right">{qty}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amt).toFixed(2)}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(balance).toFixed(2)}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(paid).toFixed(2)}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(outstanding).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {sales_trasac && sales_trasac.sales_trasac.length > 0 ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>

                      <td>
                        <div className="d-flex align-items-center justify-content-end fw-500">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {sales_trasac.depo_qty}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(sales_trasac.total_amount).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(sales_trasac.depo_balance).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(sales_trasac.depo_amt).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(sales_trasac.total_paid).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(sales_trasac.total_outstanding).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
                <TableWrapper
                  className="mb-3 d-none"
                  headerDetails={nonSalesDetailCollectionHeader}
                >
                  {nonsales_collec &&
                  nonsales_collec.nonsales_dtl &&
                  nonsales_collec.nonsales_dtl.length > 0 ? (
                    nonsales_collec.nonsales_dtl.map((item, index) => {
                      let { amount, cust_code, cust_name, desc, qty, balance } =
                        item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{cust_code}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_name}</div>
                          </td>
                          <td>
                            <div className="text-left">{desc}</div>
                          </td>
                          <td>
                            <div className="text-right">{qty}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(balance).toFixed(2)}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {nonsales_collec &&
                  nonsales_collec.nonsales_dtl.length > 0 ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end fw-500">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {nonsales_collec.nonsal_qty}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(nonsales_collec.nonsal_balance).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(nonsales_collec.nonsal_amount).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12">
                <TableWrapper headerDetails={TreatmentDoneHeader}>
                  {treatment_done &&
                  treatment_done.treatment_done.length > 0 ? (
                    treatment_done.treatment_done.map((item, index) => {
                      let {
                        treatment_done,
                        desc,
                        amount,
                        cust_name,
                        cust_refer,
                        staff_name,
                        buy_treatment_outlet,
                        treatmentdone_outlet,
                        cust_code,
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-left">{treatment_done}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_name}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_code}</div>
                          </td>
                          <td>
                            <div className="text-left">{cust_refer}</div>
                          </td>

                          <td>
                            <div className="text-left">{desc}</div>
                          </td>

                          <td>
                            <div className="text-left">{staff_name}</div>
                          </td>
                          <td>
                            <div className="text-left">
                              {buy_treatment_outlet}
                            </div>
                          </td>
                          <td>
                            <div className="text-left">
                              {treatmentdone_outlet}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {Number(amount).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center w-100">
                          {t("No Data Available")}
                        </div>
                      </td>
                    </tr>
                  )}
                  {treatment_done &&
                  treatment_done.treatment_done.length > 0 ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end fw-500">
                          {t("Total")}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {Number(treatment_done.total_amount).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <NormalButton
                success={true}
                className="col-12"
                label="Download As Pdf"
                onClick={this.dayEndPrintClick}
              />
              <NormalButton
                onClick={this.dayEndEmailRunClick}
                label="Send As Email"
                success={true}
                className="ml-2 col-12"
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
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
      getTokenDetails,
    },
    dispatch
  );
};

export const Dayendreportpage = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DayendreportpageClass)
);
