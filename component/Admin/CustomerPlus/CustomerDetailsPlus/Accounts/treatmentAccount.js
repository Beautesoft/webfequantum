import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  TableWrapper,
  NormalSelect,
  NormalInput,
  NormalCheckbox,
  NormalRadio,
} from "component/common";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import Invoice from "component/Admin/Report/Account/Invoice";
import { withTranslation } from "react-i18next";
import { dateFormat } from "service/helperFunctions";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

export class TreatmentAccountClass extends Component {
  state = {
    activeTab: "",
    isOpenTreatmentDone: false,
    isActiveTab: "detail",
    headerDetails: [
      {
        label: "Date",
        sortKey: true,
        width: "50px",
        singleClickFunc: () => this.handleSort(`sa_date`),
        divClass: "justify-content-end text-right",
      },
      { label: "Transaction #", width: "52px" },
      { label: "Treatment #", sortKey: false, width: "75px" },
      { label: "Description", sortKey: false, width: "155px" },
      {
        label: "Payment",
        sortKey: false,
        width: "70px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Credit Balance",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Outstanding",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Qty",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Balance Qty",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      { label: "", sortKey: false, width: "72px" },
    ],
    detailHeader: [
      {
        label: "Date",
        sortKey: true,
        width: "80px",
        singleClickFunc: () => this.handleDetailSort("sa_date"),
        divClass: "justify-content-end text-right",
      },
      { label: "Description", sortKey: false, width: "155px" },
      { label: "Type", width: "52px" },
      {
        label: "Amount",
        sortKey: false,
        width: "70px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Credit Balance",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Outstanding",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
    ],
    accountList: [],
    DetailList: [],
    yearList: [],
    year: new Date().getFullYear(),
    accountHeader: {},
    isPrintPdfClick: false,
    orderBy: "desc",
    orderByDetail: "desc",
    show: true,
  };

  componentDidMount() {
    this.getFilter();
    this.getAccountData();
  }

  handleSort = async () => {
    await this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });
    this.getAccountData();
  };

  handleDetailSort = async sortkey => {
    let { DetailList, orderByDetail } = this.state;
    await this.setState({
      orderByDetail: this.state.orderByDetail == "asc" ? "desc" : "asc",
    });

    if (orderByDetail === "asc") {
      DetailList.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      DetailList.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      DetailList,
    });
  };

  getFilter = () => {
    this.props.getCommonApi("treatmentdone/Year/").then(key => {
      let { status, data } = key;
      let { yearList } = this.state;
      for (let value of data) {
        yearList.push({ value: value, label: value });
      }
      this.setState({ yearList });
    });
  };

  getAccountData = () => {
    let { year, accountHeader } = this.state;
    this.props
      .getCommonApi(
        `treatmentacclist/?cust_id=${this.props.id}&year=${year}&value=${
          this.state.orderBy
        }&show_type=${Number(this.state.show)}&key=sa_date`
      )
      .then(key => {
        console.log(key.data, "treatment account table list");
        let { data, header_data } = key;
        let { accountList } = this.state;
        accountList = data;
        accountHeader = header_data;
        this.setState({ accountList, accountHeader });
      });
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  handleChange = async ({ target: { value, name } }) => {
    let { year } = this.state;
    year = value;
    await this.setState({
      year,
    });
    this.getAccountData();
  };

  handleOpenDetail = async data => {
    let { activeTab } = this.state;
    activeTab = "detail";

    await this.setState({
      activeTab,
    });
    this.getDetailList(data.id);
  };

  getDetailList = id => {
    this.props.getCommonApi(`treatmentacclist/${id}`).then(key => {
      let { data, header_data } = key;
      let { DetailList, accountHeader } = this.state;
      DetailList = data;
      accountHeader = header_data;
      this.setState({ DetailList, accountHeader });
    });
  };

  handleBack = () => {
    let { activeTab } = this.state;
    activeTab = "";
    this.setState({
      activeTab,
      DetailList: [],
    });
    this.getAccountData();
  };
  handlePrintPdfFormat = url => {
    this.setState({
      isPrintPdfClick: false,
    });
    var a = document.createElement("a");
    a.setAttribute("download", `${new Date()}.pdf`);
    a.setAttribute("href", url);
    a.click();
    window.open(url);
  };
  handleSelectionChange = async type => {
    let { show } = this.state;
    show = type;
    await this.setState({
      show,
    });

    this.getAccountData();
  };
  render() {
    let {
      accountHeader = {},
      headerDetails,
      accountList,
      yearList,
      year,
      activeTab,
      detailHeader,
      DetailList,
      isPrintPdfClick,
      invoice,
      show,
    } = this.state;
    let {
      balance,
      treatment_count,
      outstanding,
      credit_balance,
      outstanding_balance,
      treatparent_code,
      sa_transacno_ref,
    } = accountHeader;
    let { t } = this.props;
    return (
      <div className="treatment-account row">
        {activeTab !== "detail" ? (
          <div className="col-4 mt-3 mb-4">
            <div className="row m-0">
              <div className="col-12 mb-2">
                <FormGroup check>
                  <Label check>
                    <Input
                      checked={show ? true : false}
                      onChange={() => this.handleSelectionChange(true)}
                      type="radio"
                      name="radio1"
                    />{" "}
                    {t("Show Available Package Only")}
                  </Label>
                </FormGroup>
              </div>
              <div className="col-12">
                <FormGroup check>
                  <Label check>
                    <Input
                      checked={!show ? true : false}
                      onChange={() => this.handleSelectionChange(false)}
                      type="radio"
                      name="radio1"
                    />{" "}
                    {t("Show All")}
                  </Label>
                </FormGroup>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className={`${activeTab !== "detail" ? "col-4" : "col-6"} mt-3 mb-4`}
        >
          {activeTab !== "detail" ? (
            <div className="row">
              <div className="col-5 mb-2">{t("Treatment List")}</div>
              <div className="col-5 mb-2">
                <NormalSelect
                  options={yearList}
                  value={year}
                  name="year"
                  onChange={this.handleChange}
                  className="customer-name py-1"
                />
              </div>
              <div className="col-5">{t("Total Treatment Count")}</div>
              <div className="col-5">{treatment_count}</div>
            </div>
          ) : (
            <div className="row">
              <div className="col-6 mb-2">{t("Transaction #")}</div>
              <div className="col-6 mb-2">{sa_transacno_ref}</div>

              <div className="col-6">{t("Treatment #")}</div>
              <div className="col-6">{treatparent_code}</div>
            </div>
          )}
        </div>
        <div
          className={`${activeTab !== "detail" ? "col-4" : "col-6"} mt-3 mb-4`}
        >
          <div className="row">
            <div className="col-6 mb-2">{t("Credit Balance")}</div>
            <div className="col-6 mb-2">
              $ {activeTab !== "detail" ? balance : credit_balance}
            </div>

            <div className="col-6">{t("Outstanding Balance")}</div>
            <div className="col-6">
              $ {activeTab !== "detail" ? outstanding : outstanding_balance}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="table">
            {activeTab !== "detail" ? (
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
              >
                {accountList && accountList.length > 0
                  ? accountList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-right">{item.sa_date}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.transaction}</div>
                          </td>
                          <td>
                            <div className="text-left">
                              {item.treatment_parentcode}
                            </div>
                          </td>
                          <td>
                            <div className="text-left">{item.description}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {"$" + item.payment}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {"$" + item.balance}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {"$" + item.outstanding}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">{item.qty}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.balance_qty}</div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <NormalButton
                                buttonClass={"view mr-3"}
                                mainbg={true}
                                className="col-12 fs-15 "
                                label="view"
                                onClick={() => this.handleOpenDetail(item)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            ) : (
              <TableWrapper
                headerDetails={detailHeader}
                queryHandler={this.handlePagination}
              >
                {DetailList && DetailList.length > 0
                  ? DetailList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-right">{item.sa_date}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.description}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.type}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {"$" + item.amount}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {"$" + item.balance}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {"$" + item.outstanding}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            )}
          </div>
        </div>
        <div className="col-12 justify-center d-flex">
          {activeTab === "detail" ? (
            <NormalButton
              buttonClass={"back mr-3"}
              mainbg={true}
              className="col-12 fs-15 "
              label="Back"
              onClick={() => this.handleBack()}
            />
          ) : (
            ""
          )}
          <NormalButton
            buttonClass={"print"}
            className="col-12 fs-15 "
            label="Print"
            onClick={() => {
              this.setState({ isPrintPdfClick: true });
            }}
          />
        </div>
        {isPrintPdfClick ? (
          <PDFDownloadLink
            document={
              <Invoice
                TableList={activeTab !== "detail" ? accountList : DetailList}
                accountHeader={accountHeader}
                Flag={activeTab !== "detail" ? 1 : 2}
                landscape={activeTab !== "detail" ? true : false}
              />
            }
          >
            {({ blob, url, loading, error }) =>
              !loading && url ? this.handlePrintPdfFormat(url) : null
            }
          </PDFDownloadLink>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      updateForm,
      commonCreateApi,
      commonPatchApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const TreatmentAccount = withTranslation()(
  connect(null, mapDispatchToProps)(TreatmentAccountClass)
);
