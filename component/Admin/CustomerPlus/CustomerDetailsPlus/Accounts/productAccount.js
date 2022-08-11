import React, { Component } from "react";
import "./style.scss";
// import { Appointments, TreatmentHistory, PurchaseHistory, PersonalDetails, Favourites } from './Details'
import classnames from "classnames";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { NormalInput, NormalButton, TableWrapper } from "component/common";
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

export class ProductAccountClass extends Component {
  state = {
    activeTab: "",
    isOpenTreatmentDone: false,
    isActiveTab: "detail",
    headerDetails: [
      {
        label: "Date",
        sortKey: false,
        width: "80px",
        divClass: "justify-content-end text-right",
      },
      { label: "Transaction #", width: "180px" },
      // { label: 'Package', sortKey: false, width: "75px" },
      { label: "Item", sortKey: false, width: "150px" },
      {
        label: "Credit ",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Outstanding",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Qty",
        sortKey: false,
        width: "75px",
        divClass: "justify-content-end text-right",
      },
      { label: "status", sortKey: false, width: "100px" },
      { label: "", sortKey: false, width: "100px" },
    ],
    detailHeader: [
      {
        label: "Date",
        sortKey: false,
        width: "80px",
        divClass: "justify-content-end text-right",
      },
      { label: "Transaction #", sortKey: false, width: "180px" },
      { label: "Treatment #", width: "152px" },
      {
        label: "Payment",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Credit",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Outstanding",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
    ],
    olddetailHeader: [
      { label: "Date & Time", divClass: "justify-content-end text-right" },
      { label: "Description" },
      { label: "Hold Qty", divClass: "justify-content-end text-right" },
      { label: "Issued Qty", divClass: "justify-content-end text-right" },
      { label: "UOM" },
      { label: "Product Issue No." },
      { label: "Staff" },
      { label: "Site Code" },
      { label: "Status" },
    ],
    accountList: [],
    accountHeader: {},
    DetailList: [],
    isPrintPdfClick: false,
    oldDetailList: [],
    oldaccountHeader: {},
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  componentDidMount() {
    this.getAccountData();
  }

  getAccountData = () => {
    let { accountHeader } = this.state;
    this.props
      .getCommonApi(`productacclist/?cust_id=${this.props.id}`)
      .then(key => {
        let { data, header_data } = key;
        let { accountList } = this.state;
        accountList = data;
        accountHeader = header_data;
        this.setState({ accountList, accountHeader });
      });
  };

  handleOpenDetail = async (data, tab) => {
    let { activeTab } = this.state;
    activeTab = tab;

    await this.setState({
      activeTab,
    });
    if (tab === "detail") {
      this.getDetailList(data.id);
    } else {
      this.getOldDetailList(data.id);
    }
  };

  getDetailList = id => {
    this.props.getCommonApi(`productacclist/${id}`).then(key => {
      let { data, header_data } = key;
      let { DetailList, accountHeader } = this.state;
      DetailList = data;
      accountHeader = header_data;
      this.setState({ DetailList, accountHeader });
    });
  };

  getOldDetailList = id => {
    this.props
      .getCommonApi(`productacclist/holditemacclist/?deposit_id=${id}`)
      .then(key => {
        let { data, header_data } = key;
        let { oldDetailList, oldaccountHeader } = this.state;
        oldDetailList = data;
        oldaccountHeader = header_data;
        this.setState({ oldDetailList, oldaccountHeader });
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

  render() {
    let {
      treatmentList,
      headerDetails,
      accountList = [],
      accountHeader = {},
      activeTab,
      detailHeader,
      DetailList,
      isPrintPdfClick,
      oldDetailList,
      olddetailHeader,
      oldaccountHeader,
    } = this.state;
    let {
      balance,
      outstanding,
      totalproduct_count,
      credit_balance,
      outstanding_balance,
      totalholdqty,
      sa_transacno_ref,
    } = accountHeader;
    let { t } = this.props;
    return (
      <div className="treatment-account">
        {activeTab === "old" ? (
          <div className="row">
            <div className="col-6 mt-3 mb-4">
              <div className="row">
                <div className="col-6">{t("Qty Hold")}</div>
                <div className="col-6">
                  {oldaccountHeader && oldaccountHeader.qty_hold
                    ? oldaccountHeader.qty_hold
                    : ""}
                </div>
              </div>
            </div>
            <div className="col-6 mt-3 mb-4">
              <div className="row">
                <div className="col-6">{t("Total Count")}</div>
                <div className="col-6">
                  {oldaccountHeader && oldaccountHeader.total_count
                    ? oldaccountHeader.total_count
                    : ""}
                </div>
              </div>
            </div>
            <div className="col-6 mt-3 mb-4">
              <div className="row">
                <div className="col-6">{t("Invoice No.")}</div>
                <div className="col-6">
                  {oldaccountHeader && oldaccountHeader.transaction
                    ? oldaccountHeader.transaction
                    : ""}
                </div>
              </div>
            </div>
            <div className="col-6 mt-3 mb-4">
              <div className="row">
                <div className="col-6">{t("Transaction #")}</div>
                <div className="col-6">
                  {oldaccountHeader && oldaccountHeader.sa_transacno_ref
                    ? oldaccountHeader.sa_transacno_ref
                    : ""}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-6 mt-3">
              <div className="row">
                <div className="col-5 mb-2">{t("Qty Hold")}</div>
                <div className="col-5 mb-2">{totalholdqty}</div>
              </div>
            </div>
            <div className="col-6 mt-3">
              <div className="row">
                <div className="col-6 mb-2">{t("Credit Balance")}</div>
                <div className="col-6 mb-2">
                  ${activeTab !== "detail" ? balance : credit_balance}
                </div>
              </div>
            </div>
            {activeTab !== "detail" ? (
              <div className="col-6 mt-3 mb-4">
                <div className="row">
                  <div className="col-5">{t("Total Product Count")} </div>
                  <div className="col-5">{totalproduct_count}</div>
                </div>
              </div>
            ) : (
              <div className="col-6 mt-3 mb-4">
                <div className="row">
                  <div className="col-5">{t("Transaction")} # </div>
                  <div className="col-5">{sa_transacno_ref}</div>
                </div>
              </div>
            )}
            <div className="col-6 mt-3 mb-4">
              <div className="row">
                <div className="col-6">{t("Outstanding Balance")}</div>
                <div className="col-6">
                  ${activeTab !== "detail" ? outstanding : outstanding_balance}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="col-12">
          <div className="table">
            {activeTab == "old" ? (
              <TableWrapper
                headerDetails={olddetailHeader}
                queryHandler={this.handlePagination}
                // pageMeta={pageMeta}
                // isEmpty={accountList.length === 0 ? true:false}
              >
                {oldDetailList && oldDetailList.length > 0
                  ? oldDetailList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-right">
                              {item.sa_date} {item.sa_time}
                            </div>
                          </td>
                          <td>
                            <div className="text-left">{item.hi_itemdesc}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.holditemqty}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.issued_qty}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.hi_uom}</div>
                          </td>
                          <td>
                            <div className="text-left">
                              {item.product_issues_no}
                            </div>
                          </td>
                          <td>
                            <div className="text-left">{item.hi_staffname}</div>
                          </td>
                          <td>
                            <div className="text-left">
                              {item.itemsite_code}
                            </div>
                          </td>
                          <td>
                            <div className="text-left">{item.status}</div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            ) : activeTab == "detail" ? (
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
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            ) : (
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
                // pageMeta={pageMeta}
                // isEmpty={accountList.length === 0 ? true:false}
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
                          {/* <td><div className="d-flex align-items-center justify-content-center">{item.package_code}</div></td> */}
                          <td>
                            <div className="text-left">
                              {item.item_description}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">{item.balance}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.outstanding}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.qty}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.item_status}</div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <NormalButton
                                buttonClass={"view mr-3"}
                                mainbg={true}
                                className="col-12 fs-15 "
                                label="view"
                                onClick={() =>
                                  this.handleOpenDetail(item, "detail")
                                }
                              />
                              <NormalButton
                                mainbg={true}
                                label="Hold"
                                onClick={() =>
                                  this.handleOpenDetail(item, "old")
                                }
                              />
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
        <div className="col-12 d-flex justify-center">
          {activeTab === "detail" || activeTab === "old" ? (
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
          {activeTab === "old" ? null : (
            <NormalButton
              buttonClass={"print"}
              // mainbg={true}
              className="col-12 fs-15 "
              label="Print"
              // outline={false}
              onClick={() => this.setState({ isPrintPdfClick: true })}
            />
          )}
        </div>
        {isPrintPdfClick ? (
          <PDFDownloadLink
            document={
              <Invoice
                TableList={activeTab !== "detail" ? accountList : DetailList}
                accountHeader={accountHeader}
                Flag={activeTab !== "detail" ? 5 : 6}
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

export const ProductAccount = withTranslation()(
  connect(null, mapDispatchToProps)(ProductAccountClass)
);
