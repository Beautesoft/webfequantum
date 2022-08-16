import React, { Component } from "react";
import "./style.scss";
import { NormalButton, TableWrapper } from "component/common";
import { FormGroup, Label, Input } from "reactstrap";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class PrepaidAccountClass extends Component {
  state = {
    activeTab: "",
    isOpenTreatmentDone: false,
    isActiveTab: "detail",
    headerDetails: [
      { label: "Prepaid #", sortKey: false, width: "120px" },
      { label: "Payment #", sortKey: false, width: "120px" },
      { label: "Prepaid Description", width: "242px" },
      { label: "Last Update", sortKey: false, width: "120px" },
      { label: "Purchase Date", sortKey: false, width: "180px" },
      { label: "Type", sortKey: false, width: "120px" },
      { label: "Expiry Date", sortKey: false, width: "120px" },
      { label: "Expiry Status", sortKey: false, width: "120px" },
      { label: "Prepaid", sortKey: false, width: "100px" },
      { label: "Balance", sortKey: false, width: "72px" },
      { label: "", sortKey: false, width: "100px" },
    ],
    detailHeader: [
      { label: "Prepaid Ref", sortKey: false, width: "150px" },
      { label: "Transaction Ref", sortKey: false, width: "225px" },
      { label: "Voucher #", width: "100px" },
      { label: "Item No", sortKey: false, width: "70px" },
      { label: "Item Name", sortKey: false, width: "72px" },
      { label: "Used Amt", sortKey: false, width: "72px" },
      { label: "Top up A", sortKey: false, width: "72px" },
      { label: "Balance", sortKey: false, width: "72px" },
      { label: "Topup #", sortKey: false, width: "72px" },
    ],
    accountList: [],
    accountHeader: {},
    show: "active",
    DetailList: [],
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  componentDidMount() {
    this.getAccountData("");
  }

  getAccountData = api => {
    let { show, accountHeader } = this.state;
    this.props
      .getCommonApi(`prepaidacclist/?cust_id=${this.props.id}${api}`)
      .then(key => {
        let { data, header_data } = key;
        let { accountList } = this.state;
        accountList = data;
        accountHeader = header_data;
        this.setState({ accountList, accountHeader });
      });
  };

  handleChange = async type => {
    let { show } = this.state;
    show = type;
    await this.setState({
      show,
    });
    if (type === "all") {
      this.getAccountData("&is_all=1");
    } else {
      this.getAccountData("");
    }
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
    this.props.getCommonApi(`prepaidacclist/${id}`).then(key => {
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

    this.getAccountData("");
  };

  render() {
    let {
      treatmentList,
      headerDetails,
      accountList = [],
      show,
      accountHeader = {},
      activeTab,
      detailHeader,
      DetailList,
    } = this.state;
    let {
      balance_producttype,
      balance_servicetype,
      balance_alltype,
      totalprepaid_count,
      pp_no,
    } = accountHeader;
    return (
      <div className="treatment-account row">
        <div className="col-6 mt-3 mb-4">
          {activeTab !== "detail" ? (
            <div className="row">
              <div className="col-5 mb-2">Total Prepaid Count</div>
              <div className="col-5 mb-2">{totalprepaid_count}</div>
              <div className="row m-0">
                <div className="col-12 mb-2">
                  <FormGroup check>
                    <Label check>
                      <Input
                        checked={show === "active"}
                        onChange={() => this.handleChange("active")}
                        type="radio"
                        name="radio1"
                      />{" "}
                      Show active prepaid only
                    </Label>
                  </FormGroup>
                </div>
                <div className="col-12">
                  <FormGroup check>
                    <Label check>
                      <Input
                        checked={show === "all"}
                        onChange={() => this.handleChange("all")}
                        type="radio"
                        name="radio1"
                      />{" "}
                      Show all prepaid
                    </Label>
                  </FormGroup>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-4 mb-2">Payment #</div>
              <div className="col-8 mb-2">{pp_no}</div>
            </div>
          )}
        </div>
        <div className="col-6 mt-3 mb-4">
          <div className="row">
            <div className="col-6 mb-2">Balance of Product Type</div>
            <div className="col-6 mb-2">$ {balance_producttype}</div>

            <div className="col-6">Balance of Service Type</div>
            <div className="col-6">$ {balance_servicetype}</div>

            <div className="col-6">Balance of All Types</div>
            <div className="col-6">$ {balance_alltype}</div>
          </div>
        </div>
        <div className="col-12">
          <div className="table">
            {activeTab !== "detail" ? (
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
                            <div className="d-flex align-items-center justify-content-center">
                              {item.prepaid}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.pp_no}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.pp_desc}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.last_update}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.sa_date}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.type}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.exp_date}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.exp_status}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.pp_total}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {"$" + item.remain}
                            </div>
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
                {console.log(accountHeader, "accountheaderviewdetail")}
                {DetailList && DetailList.length > 0
                  ? DetailList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.prepaid_ref}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.transaction_ref}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.voucher}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.item_no}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.item_name}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {"$" + item.use_amt}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {"$" + item.topup_amt}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {"$" + item.balance}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.topup_no}
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
            // mainbg={true}
            className="col-12 fs-15 "
            label="Print"
            // outline={false}
            onClick={() => this.setState({ isOpenEditDisc: false })}
          />
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
    },
    dispatch
  );
};

export const PrepaidAccount = connect(
  null,
  mapDispatchToProps
)(PrepaidAccountClass);
