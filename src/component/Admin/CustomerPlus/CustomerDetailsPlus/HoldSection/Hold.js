import React, { Component } from "react";
import "./style.scss";
import { IssuedStaff } from "./modal";
import {
  NormalInput,
  NormalButton,
  NormalModal,
  TableWrapper,
} from "component/common";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";
import { Toast } from "service/toast";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { history } from "helpers";
import { CreateHoldItem } from "redux/actions/customer";
import { withTranslation } from "react-i18next";

export class HoldSectionClass extends Component {
  state = {
    activeTab: "",
    headerDetails: [
      {
        label: "Date",
        sortKey: false,
        width: "70px",
        divClass: "justify-content-end text-right",
      },
      { label: "Transaction #", width: "180px" },
      { label: "Item Name", sortKey: false, width: "150px" },
      { label: "Item Code", sortKey: false, width: "150px" },
      {
        label: "Qty Hold",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Qty issued",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      { label: "Staff issued", sortKey: false, width: "100px" },
    ],
    accountList: [],
    accountHeader: {},
    isIssued: false,
    isWarning: false,
    Staffid: 0,
    holdItem: {},
    formData: [],
    downloadlLink: "",
    isPrint: false,
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };
  modalclose = () => {
    this.setState({ isIssued: !this.state.isIssued });
  };

  componentDidMount() {
    this.getAccountData();
  }

  getAccountData = () => {
    let { accountHeader } = this.state;
    this.props.getCommonApi(`holditem/?cust_id=${this.props.id}`).then(key => {
      let { data, header_data } = key;
      let { accountList } = this.state;
      accountList = data;
      accountHeader = header_data;
      this.setState({ accountList, accountHeader });
    });
  };

  handleissuedstaff = async item => {
    await this.setState({
      holdItem: item,
    });

    if (item.onhand) {
      if (item.check == "fullpay") {
        this.setState({
          isIssued: !this.state.isIssued,
        });
      } else {
        this.setState({
          isWarning: !this.state.isWarning,
        });
      }
    } else {
      Toast({
        type: "error",
        message: "Stock is not available for this product",
      });
    }
  };

  proceedtoissuedstaff = () => {
    this.setState({
      isWarning: !this.state.isWarning,
      isIssued: !this.state.isIssued,
    });
  };

  denyissuedstaff = () => {
    this.setState({
      isWarning: !this.state.isWarning,
    });
  };

  issuedlisttableupdate = holdData => {
    let { accountList } = this.state;
    let filterList = accountList.find(account => account.id === holdData.id);
    filterList["qty_issued"] = holdData.issueQty;
    filterList["staff_issued"] = holdData.emp_name;
    filterList["emp_id"] = holdData.emp_id;
    filterList["emp_name"] = holdData.emp_name;
    this.setState({ ...this.state.accountList, filterList });
  };

  issuedlistupdate = holdData => {
    let { formData } = this.state;
    let filterList = formData.find(account => account.id === holdData.id);
    if (filterList) {
      filterList["id"] = holdData.id;
      filterList["issued_qty"] = holdData.issueQty;
      filterList["emp_id"] = holdData.emp_id;
      this.setState({ ...this.state.formData, filterList });
    } else {
      let data = {};
      data["id"] = holdData.id;
      data["issued_qty"] = holdData.issueQty;
      data["emp_id"] = holdData.emp_id;
      formData.push(data);
      this.setState({ ...this.state.formData, formData });
    }
  };

  handlePrint = () => {
    this.setState({ isPrint: false });
    window.open(this.state.downloadlLink);
  };

  onSubmit = async () => {
    let { formData } = this.state;
    if (formData.length > 0) {
      await this.props.CreateHoldItem(formData).then(async res => {
        if (res.status === 200 || res.status === 201) {
          this.setState({
            downloadlLink: res.data,
            isPrint: true,
            formData: [],
          });
          this.getAccountData();
        } else {
          Toast({ type: "error", message: res.message });
        }
      });
    } else {
      Toast({ type: "error", message: "There is no record to update" });
    }
  };

  render() {
    let {
      headerDetails,
      accountList = [],
      activeTab,
      isIssued,
      isWarning,
      Staffid,
      holdItem = {},
      downloadlLink,
      isPrint,
    } = this.state;
    let { t } = this.props;
    return (
      <div className="treatment-account row mt-3">
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
                            <div className="text-left">
                              {item.sa_transacno_ref}
                            </div>
                          </td>
                          <td>
                            <div className="text-left">{item.hi_itemdesc}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.itemno}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.holditemqty}</div>
                          </td>
                          <td onClick={() => this.handleissuedstaff(item)}>
                            <div className="text-right cursor-pointer">
                              {item.qty_issued}
                            </div>
                          </td>
                          <td onClick={() => this.handleissuedstaff(item)}>
                            <div className="text-left justify-content-center">
                              {item.staff_issued}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            ) : null}
          </div>
        </div>
        <div className="col-12 d-flex justify-center">
          <div className="col-4">
            <button
              onClick={() => this.onSubmit()}
              className={`btn outline-btn mx-2 fs-14  text-capitalize`}
            >
              {t("Issued")}
            </button>
          </div>
        </div>
        <div className="col-12 d-flex justify-center">
          {isIssued ? (
            <IssuedStaff
              isIssued={isIssued}
              key={holdItem.id}
              toggle={this.modalclose}
              holdItem={holdItem}
              handleModal={this.handleissuedstaff}
              issuedlistupdate={this.issuedlistupdate}
              issuedlisttableupdate={this.issuedlisttableupdate}
            />
          ) : (
            ""
          )}
        </div>
        <div className="col-12 d-flex justify-center">
          {isWarning ? (
            <>
              <NormalModal
                style={{ minWidth: "25%" }}
                modal={isWarning}
                handleModal={this.toggle}
              >
                <div className="row new-cart issued-staff p-3">
                  <div className="col-12">
                    <div>
                      <p>
                        {t(`Product have outstanding, Are you sure you want to
                        issued ?`)}
                      </p>
                    </div>
                  </div>
                  <div className="col-12 p-3">
                    <div className="row">
                      <div className="col-3">
                        <button
                          onClick={() => this.proceedtoissuedstaff()}
                          className={`btn outline-btn mx-2 fs-14  text-capitalize`}
                        >
                          {t("Yes")}
                        </button>
                      </div>
                      <div className="col-3">
                        <button
                          onClick={() => this.denyissuedstaff()}
                          className={`btn outline-btn mx-2 fs-14  text-capitalize`}
                        >
                          {t("No")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </NormalModal>
            </>
          ) : null}
        </div>
        <div className="col-12 d-flex justify-center">
          {isPrint ? (
            <>
              <NormalModal
                style={{ minWidth: "25%" }}
                modal={isPrint}
                handleModal={this.toggle}
              >
                <div className="row new-cart issued-staff p-3">
                  <div className="col-12">
                    <div>
                      <p>{t(`Do you want to print ?`)}</p>
                    </div>
                  </div>
                  <div className="col-12 p-3">
                    <div className="row">
                      <div className="col-3">
                        <button
                          onClick={() => this.handlePrint()}
                          className={`btn outline-btn mx-2 fs-14  text-capitalize`}
                        >
                          {t("Yes")}
                        </button>
                      </div>
                      <div className="col-3">
                        <button
                          onClick={() => this.setState({ isPrint: false })}
                          className={`btn outline-btn mx-2 fs-14  text-capitalize`}
                        >
                          {t("No")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </NormalModal>
            </>
          ) : null}
        </div>
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
      CreateHoldItem,
    },
    dispatch
  );
};

export const Hold = withTranslation()(
  connect(null, mapDispatchToProps)(HoldSectionClass)
);
