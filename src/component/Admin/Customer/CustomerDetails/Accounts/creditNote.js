import React, { Component } from 'react';
import "./style.scss";
// import { Appointments, TreatmentHistory, PurchaseHistory, PersonalDetails, Favourites } from './Details'
import classnames from 'classnames';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { NormalInput, NormalButton, TableWrapper, NormalRadio, NormalModal } from 'component/common';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi, updateForm, commonCreateApi, commonDeleteApi, commonPatchApi } from "redux/actions/common";
import closeIcon from 'assets/images/close.png';

export class CreditNoteClass extends Component {
  state = {
    activeTab: '1',
    isOpenTreatmentDone: false,
    isActiveTab: "detail",
    headerDetails: [
      { label: 'Credit #', sortKey: false, width: "100px" },
      { label: 'Date', width: "82px" },
      // { label: 'Transaction #', sortKey: false, width: "180px" },
      // { label: 'Item', sortKey: false, width: "185px" },
      { label: 'Amount', sortKey: false, width: "100px" },
      { label: 'Balance', sortKey: false, width: "100px" },
      { label: 'Status', sortKey: false, width: "100px" },
      { label: '', sortKey: false, width: "52px" },
    ],
    accountList: [],
    showActive: false,
    accountHeader: {},
    show: "active",
    isOpenUpdate: false,
    editItem: {},
    formField: {
      new_balance: "",
      refund_amt: ""
    }
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    this.getAccountData('');
  }


  getAccountData = (api) => {
    let { show, accountHeader } = this.state;
    this.props.getCommonApi(`creditnotelist/?cust_id=${this.props.id}${api}`).then((key) => {
      let { data, header_data } = key;
      let { accountList } = this.state;
      accountList = data;
      accountHeader = header_data;
      this.setState({ accountList, accountHeader })
    })
  }

  handleChange = async (type) => {
    let { show } = this.state;
    show = type
    await this.setState({
      show
    })
    if (type === "all") {
      this.getAccountData('&is_all=1');
    } else {
      this.getAccountData('');
    }
  }

  handleOpenDetail = async (data) => {
    let { activeTab } = this.state
    activeTab = 'detail';

    await this.setState({
      activeTab
    })
    this.getDetailList(data.id);
  }

  getDetailList = (id) => {
    this.props.getCommonApi(`treatmentacclist/${id}`).then((key) => {
      let { data, header_data } = key;
      let { DetailList, accountHeader } = this.state;
      DetailList = data;
      accountHeader = header_data;
      this.setState({ DetailList, accountHeader })
    })
  }

  handleBack = () => {
    let { activeTab } = this.state;
    activeTab = '';
    this.setState({
      activeTab,
      DetailList: []
    })
    this.getAccountData();
  }

  handleEdit = (data) => {
    let { isOpenUpdate, editItem } = this.state;
    isOpenUpdate = true;
    editItem = data;
    this.setState({
      isOpenUpdate,
      editItem
    })
  }

  handleChangeUpdate = ({ target: { value, name } }) => {
    let { formField } = this.state;
    formField[name] = value;
    this.setState({
      formField
    })
  }

  handleUpdateCredit = () => {
    let { formField, editItem } = this.state;
    this.props.commonPatchApi(`creditnotelist/${editItem.id}/`, formField).then(() => {
      this.handleCloseDialog();
    })
  }

  handleCloseDialog = () => {
    let { formField, editItem, isOpenUpdate } = this.state;
    isOpenUpdate = false;
    editItem = {};
    formField['new_balance'] = "";
    formField['refund_amt'] = "";
    this.setState({
      editItem,
      isOpenUpdate,
      formField
    })
  }


  render() {
    let { treatmentList, headerDetails, accountList, showActive, show, isOpenUpdate, formField } = this.state;
    return (

      <div className="treatment-account credit-note row">
        <div className="col-6 mt-3 mb-4">
          <div className="row m-0">
            {/* <NormalRadio 
            classNam="" 
            value={showActive}
            label={""} 
            name="active"
            /> */}
            <div className="col-12 mb-2">
              <FormGroup check>
                <Label check>
                  <Input checked={show === "active"} onChange={() => this.handleChange("active")} type="radio" name="radio1" />{' '} Show Active Credit Notes Only
              </Label>
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup check>
                <Label check>
                  <Input checked={show === "all"} onChange={() => this.handleChange("all")} type="radio" name="radio1" />{' '} Show All Credit Notes
              </Label>
              </FormGroup>
            </div>
          </div>
        </div>

        <div className="col-12">

          <div className="table">
            <TableWrapper
              headerDetails={headerDetails}
              queryHandler={this.handlePagination}
            // pageMeta={pageMeta}
            // isEmpty={accountList.length === 0 ? true:false}
            >
              {accountList && accountList.length > 0 ? accountList.map((item, index) => {

                return (
                  <tr key={index}>

                    <td className="position-relative status-type"><span className={``}>
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="radio1" />{' '}
                        </Label>
                      </FormGroup>
                    </span><div className="d-flex align-items-center justify-content-center">{item.credit_code}</div></td>
                    <td><div className="d-flex align-items-center justify-content-center">{item.sa_date}</div></td>
                    {/* <td><div className="d-flex align-items-center justify-content-center">{item.transaction}</div></td>
                    <td><div className="d-flex align-items-center justify-content-center">{}</div></td> */}
                    <td><div className="d-flex align-items-center justify-content-center">{item.amount}</div></td>
                    <td><div className="d-flex align-items-center justify-content-center">{item.balance}</div></td>
                    <td><div className="d-flex align-items-center justify-content-center">{item.status}</div></td>
                    <td><div className="d-flex align-items-center justify-content-center">
                      <NormalButton
                        buttonClass={""}
                        mainbg={true}
                        className="col-12 fs-15 mr-2"
                        label="Edit"
                        outline={false}
                        onClick={() => this.handleEdit(item)}
                      />
                    </div></td>
                  </tr>
                )
              }) : ""
              }

            </TableWrapper>
          </div>
        </div>
        <div className="col-12 d-flex action-bar text-center">
          <NormalButton
            buttonClass={"credit-note-button"}
            // mainbg={true}
            className="col-12 fs-15 mr-2"
            label="Adjust credit note"
            outline={false}
            onClick={() => this.setState({ isOpenEditDisc: false })}
          />
          <NormalButton
            buttonClass={"print"}
            // mainbg={true}
            className="col-12 fs-15 "
            label="Print"
            // outline={false}
            onClick={() => this.setState({ isOpenEditDisc: false })}
          />
        </div>
        <NormalModal className={"credit-note-update"} style={{ minWidth: "560px" }} modal={isOpenUpdate} handleModal={this.handleCloseDialog}>
          <img onClick={this.handleCloseDialog} className="close" src={closeIcon} alt="" />

          <div className=" mt-2 mb-5 mx-3">
            <div className="col-12 pl-0 mb-3 font-600 fs-18">
              Update Credit Note
                        </div>
          </div>
          <div className="row">
            <div className="col-12 d-flex mb-3">
              <div className="w-100">
                <label className="text-left text-black common-label-text ">
                  New Balance
                                    </label>
              </div>
              <div className="input-group">
                <NormalInput
                  // placeholder="Enter here"
                  // options={siteList}
                  value={formField.new_balance}
                  name="new_balance"
                  onChange={this.handleChangeUpdate}
                  className="customer-name"
                />
              </div>
            </div>
            <div className="col-12 d-flex mb-3">
              <div className="w-100">
                <label className="text-left text-black common-label-text ">
                  Refund
                                    </label>
              </div>
              <div className="input-group">
                <NormalInput
                  // placeholder="Enter here"
                  // options={siteList}
                  value={formField.refund_amt}
                  name="refund_amt"
                  onChange={this.handleChangeUpdate}
                  className="customer-name"
                />
              </div>
            </div>
          </div>
          <div className="col-12 d-flex action-bar justify-center">

            <NormalButton
              buttonClass={"print"}
              mainbg={true}
              className="col-12 fs-15 "
              label="Update"
              // outline={false}
              onClick={() => this.handleUpdateCredit()}
            />
          </div>
        </NormalModal>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getCommonApi,
    updateForm,
    commonCreateApi,
    commonPatchApi,
    commonDeleteApi
  }, dispatch)
}

export const CreditNote = connect(null, mapDispatchToProps)(CreditNoteClass)