import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalInput,
  NormalSelect,
  InputSearch,
  NormalModal,
  TableWrapper,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";
import { withTranslation } from "react-i18next";

export class IssuedStaffClass extends Component {
  state = {
    isOpen: false,
    currentIndex: -1,
    headerDetails: [
      {
        label: "Employee name",
        divClass: "justify-content-center",
        sortKey: false,
        width: "130px",
      },
    ],
    staffList: [],
    page: 1,
    holdData: {
      id: 0,
      hi_itemdesc: "",
      holditemqty: 0,
      issueQty: 0,
      issuedstaff: "",
      emp_id: 0,
      emp_name: "",
    },
  };
  componentDidMount = () => {
    this.props.getCommonApi(`holditem/${this.props.holdItem.id}`).then(key => {
      let { data } = key;
      let holdData = Object.assign({}, this.state.holdData);
      holdData["id"] = data.id;
      holdData["hi_itemdesc"] = data.hi_itemdesc;
      holdData["holditemqty"] = data.holditemqty;
      holdData["issueQty"] = this.props.holdItem.qty_issued;
      holdData["issuedstaff"] = this.props.holdItem.staff_issued;
      holdData["emp_name"] = this.props.holdItem.emp_name;
      holdData["emp_id"] = this.props.holdItem.emp_id;
      this.setState({ holdData });
    });
  };
  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
    this.getStaffList();
  };

  handleInput = ({ target: { name, value, index } }) => {
    let holdData = Object.assign({}, this.state.holdData);
    holdData[index][name] = value;
    this.setState({
      holdData,
    });
  };

  getStaffList = () => {
    this.props
      .getCommonApi(`empcartlist/?sales_staff=2&page=${this.state.page}`)
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          this.setState({ staffList: data.dataList });
        }
      });
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStaffList();
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStaffList();
    }
  };

  handleChange = ({ target: { value, name } }) => {
    let holdData = Object.assign({}, this.state.holdData);
    holdData[name] = value;
    this.setState({
      holdData,
    });
  };

  handleissuedconfirm = event => {
    event.preventDefault();

    let { holdData } = this.state;
    let payload = {
      id: holdData.id,
      issued_qty: holdData.issueQty,
    };
    this.props
      .commonCreateApi(`holditem/validate_issueqty/`, payload)
      .then(key => {
        let { status } = key;
        console.log("holditemnewconfirmrepsonse:", key);
        if (status == 200) {
          if (
            isNaN(holdData.issueQty) ||
            holdData.issueQty <= 0 ||
            holdData.issueQty == null ||
            holdData.issueQty == ""
          ) {
            Toast({ type: "error", message: "invalid issue quantity" });
            return false;
          } else if (holdData.issueQty > holdData.holditemqty) {
            Toast({
              type: "error",
              message:
                "issue quantity should be less than or equal to hold quantity",
            });
            return false;
          } else if (
            holdData.emp_id == 0 ||
            holdData.emp_id == "" ||
            holdData.emp_id == null
          ) {
            Toast({ type: "error", message: "please select staff" });
            return false;
          } else {
            this.props.issuedlistupdate(holdData);
            this.props.issuedlisttableupdate(holdData);
            this.setState({
              holdData: {},
            });
            this.props.toggle();
          }
        }
      });
  };

  handleSelect_Staff = staff => {
    let holdData = Object.assign({}, this.state.holdData);
    holdData["emp_name"] = staff.emp_name;
    holdData["emp_id"] = staff.id;
    this.setState({
      holdData,
    });
  };

  handleClearLine = () => {
    let holdData = Object.assign({}, this.state.holdData);
    holdData["emp_name"] = "";
    holdData["emp_id"] = "";
    this.setState({
      holdData,
    });
  };

  render() {
    let { staffList = [], headerDetails, holdData = {} } = this.state;
    let { isIssued, t } = this.props;
    let { hi_itemdesc, holditemqty, issueQty, emp_id, emp_name } = holdData;

    return (
      <NormalModal
        style={{ minWidth: "560px" }}
        modal={isIssued}
        handleModal={this.props.toggle}
      >
        <img
          onClick={this.props.toggle}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="row new-cart issued-staff">
          <div className="col-12">
            <p className="fs-18 font-700 mb-3 title">{t("Select Staff")}</p>
          </div>

          <div className="col-12 mb-2 form-group">
            <div className="row">
              <div className="col-12">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Item")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder=""
                    value={hi_itemdesc}
                    name="hi_itemdesc"
                    onChange={this.handleChange}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-2 form-group">
            <div className="row">
              <div className="col-6">
                <label className="text-left text-black common-label-text ">
                  {t("Hold Qty")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder=""
                    value={holditemqty}
                    name="holditemqty"
                    onChange={this.handleChange}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mb-2 form-group">
            <div className="row">
              <div className="col-6">
                <label className="text-left text-black common-label-text ">
                  {t("Issue Qty")}
                </label>
                <div className="input-group">
                  <NormalInput
                    value={issueQty}
                    name="issueQty"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`col-12 cart-item emp-image`}>
            <div className={`staff-listing d-flex emp-list`}>
              <div
                className="forward-button cursor-pointer"
                onClick={this.handleBack}
              >
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 0.5L1 5L5 9.5"
                    stroke="#888888"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="d-flex">
                {staffList.length > 0
                  ? staffList.map(staff => {
                      return (
                        <div
                          className="mx-1 staff-list cursor-pointer "
                          key={staff.id}
                          onClick={() => this.handleSelect_Staff(staff)}
                        >
                          <img className="" src={staff.emp_pic} alt="" />
                          <p>{staff.emp_name}</p>
                        </div>
                      );
                    })
                  : ""}
              </div>
              <div
                className="back-button cursor-pointer"
                onClick={this.handleNext}
              >
                <svg
                  width="5"
                  height="10"
                  viewBox="0 0 5 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.5 9.5L4.5 5L0.5 0.5"
                    stroke="#888888"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-12 cart-item">
            <div className="item-list">
              <div className="table">
                <TableWrapper
                  headerDetails={headerDetails}
                  queryHandler={this.handlePagination}
                >
                  {holdData.emp_id ? (
                    <tr key={emp_id}>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="input-group">
                            <NormalInput
                              value={emp_name}
                              name="issueQty"
                              onChange={this.handleChange}
                              disabled={true}
                              className={`text-right`}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </TableWrapper>
              </div>
            </div>
          </div>
          <div className="col-12 pt-4 action-bar">
            <div className="row">
              <div className="col-4 d-flex text-left">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="fs-15 clear-line"
                  label="Clear Line"
                  outline={false}
                  onClick={this.handleClearLine}
                />
              </div>
              <div className="col-4 d-flex"></div>
              <div className="col-4 d-flex text-right">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className=" fs-15 confirm"
                  label="Done"
                  outline={false}
                  onClick={event => this.handleissuedconfirm(event)}
                />
              </div>
            </div>
          </div>
        </div>
      </NormalModal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonCreateApi,
      commonPatchApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const IssuedStaff = withTranslation()(
  connect(null, mapDispatchToProps)(IssuedStaffClass)
);
