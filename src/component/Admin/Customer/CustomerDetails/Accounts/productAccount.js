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

export class ProductAccountClass extends Component {
  state = {
    activeTab: "",
    isOpenTreatmentDone: false,
    isActiveTab: "detail",
    headerDetails: [
      { label: "Date", sortKey: false, width: "80px" },
      { label: "Transaction #", width: "180px" },
      // { label: 'Package', sortKey: false, width: "75px" },
      { label: "Item", sortKey: false, width: "150px" },
      { label: "Credit ", sortKey: false, width: "100px" },
      { label: "Outstanding", sortKey: false, width: "100px" },
      { label: "Qty", sortKey: false, width: "75px" },
      { label: "status", sortKey: false, width: "100px" },
      { label: "", sortKey: false, width: "100px" },
    ],
    detailHeader: [
      { label: "Date", sortKey: false, width: "80px" },
      { label: "Transaction #", sortKey: false, width: "180px" },
      { label: "Treatment #", width: "152px" },
      { label: "Payment", sortKey: false, width: "100px" },
      { label: "Credit", sortKey: false, width: "100px" },
      { label: "Outstanding", sortKey: false, width: "100px" },
    ],
    accountList: [],
    accountHeader: {},
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

  handleOpenDetail = async data => {
    let { activeTab } = this.state;
    activeTab = "detail";

    await this.setState({
      activeTab,
    });
    this.getDetailList(data.id);
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

  handleBack = () => {
    let { activeTab } = this.state;
    activeTab = "";
    this.setState({
      activeTab,
      DetailList: [],
    });
    this.getAccountData();
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
    return (
      <div className="treatment-account row">
        <div className="col-6 mt-3">
          <div className="row">
            <div className="col-5 mb-2">Qty Hold</div>
            <div className="col-5 mb-2">{totalholdqty}</div>
          </div>
        </div>
        <div className="col-6 mt-3">
          <div className="row">
            <div className="col-6 mb-2">Credit Balance</div>
            <div className="col-6 mb-2">
              ${activeTab !== "detail" ? balance : credit_balance}
            </div>
          </div>
        </div>
        {activeTab !== "detail" ? (
          <div className="col-6 mt-3 mb-4">
            <div className="row">
              <div className="col-5">Total Product Count </div>
              <div className="col-5">{totalproduct_count}</div>
            </div>
          </div>
        ) : (
          <div className="col-6 mt-3 mb-4">
            <div className="row">
              <div className="col-5">Transaction # </div>
              <div className="col-5">{sa_transacno_ref}</div>
            </div>
          </div>
        )}
        <div className="col-6 mt-3 mb-4">
          <div className="row">
            <div className="col-6">Outstanding Balance</div>
            <div className="col-6">
              ${activeTab !== "detail" ? outstanding : outstanding_balance}
            </div>
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
                              {item.sa_date}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.transaction}
                            </div>
                          </td>
                          {/* <td><div className="d-flex align-items-center justify-content-center">{item.package_code}</div></td> */}
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.item_description}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.balance}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.outstanding}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.qty}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.item_status}
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
                  : ""}
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
                            <div className="d-flex align-items-center justify-content-center">
                              {item.sa_date}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.description}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {item.type}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {"$" + item.payment}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {"$" + item.balance}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {"$" + item.outstanding}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : ""}
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

export const ProductAccount = connect(
  null,
  mapDispatchToProps
)(ProductAccountClass);
