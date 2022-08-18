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
import { VoidPaidTrans } from "./voidPaidTrans.js";
import { withTranslation } from "react-i18next";

export class BillOpsClass extends Component {
  state = {
    tstaffList: [{}],
    headerDetails: [
      { label: "Date", sortKey: false, width: "60px" },
      { label: "Treatment", width: "120px" },
      { label: "Trans Ref", sortKey: false, width: "55px" },
      { label: "Discription", sortKey: false, width: "55px" },
      { label: "Type", sortKey: false, width: "55px" },
      { label: "Exp Date", sortKey: false, width: "55px" },
      { label: "Amount", sortKey: false, width: "55px" },
      { label: "Status", sortKey: false, width: "55px" },
      { label: "Rev", sortKey: false, width: "55px" },
      { label: "Treat No", sortKey: false, width: "55px" },
      { label: "Limit", sortKey: false, width: "55px" },
      { label: "Sel Staff", sortKey: false, width: "55px" },
      { label: "Staff", sortKey: false, width: "55px" },
    ],
    // cartData: {},
    yearList: [],
    selectedYear: new Date().getFullYear(),
    isOpenTreatmentDone: false,
    tsStaff: {},
    workPoint: 0,
    isOpenReversal: false,
    menuItems: [
      // { to: "/admin/catalog", label: "Suspend Bill", id: "suspendBill" },
      // { to: "/admin/catalog", label: "Recall Sus Bill", id: "recallSusBill" },
      // { to: "/admin/catalog", label: "Recall Tran", id: "reacallBill" },
      // { to: "/admin/catalog", label: "Reprint Bill", id: "reprint" },
      // { to: "/admin/catalog", label: "Void item/bill", id: "VoidItemBill" },
      { to: "/admin/catalog", label: "Void Paid Trans", id: "voidPaidTrns" },
    ],
    activeMenu: "voidPaidTrns",
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
    // this.props.getCommonApi('treatmentdone/Year/').then((key) => {
    //     let { status, data } = key;
    //     let { yearList } = this.state;
    //     for (let value of data) {
    //         yearList.push({ value: value, label: value })
    //     }
    //     this.setState({ yearList })
    // })

    // this.getCart();
  };

  getCart = () => {
    console.log(this.props, "sfgdfsgdfghgf");
    let {
      roomList,
      sourceList,
      staffList,
      cartData,
      duration,
      tstaffList,
      selectedYear,
    } = this.state;
    this.props
      .getCommonApi(
        `treatmentdone/?year=${selectedYear}&cust_id=${this.props.basicApptDetail.custId}`
      )
      .then(key => {
        cartData = key;
        tstaffList = key.data;
        this.setState({ tstaffList });
      });
  };

  handleYearChange = async ({ target: { value, name } }) => {
    let { selectedYear } = this.state;
    selectedYear = value;
    await this.setState({
      selectedYear,
    });
    this.getCart();
  };

  getDataFromRes = data => {
    let { formFields, cartData, updateFields, postFields } = this.state;
    formFields["Item"] = data.value.Item;
    formFields["Price"] = data.value.Price;
    formFields["Room"] = data.value.Room;
    updateFields["Room"] = data.value.Room;
    formFields["Source"] = data.value.Source;
    updateFields["Source"] = data.value.Source;
    formFields["add_duration"] = data.value.add_duration;
    formFields["new_remark"] = data.value.new_remark;
    updateFields["new_remark"] = data.value.new_remark;
    postFields["times"] = data.value.times;
    postFields["work_point"] = data.value.work_point;
    this.setState({
      formFields,
      updateFields,
      postFields,
    });
  };

  // getYearList = (data) => {
  //     let date = new Date().getFullYear();

  //     let { yearList } = this.state;
  //     for (let i = date; i > 1970; i--) {
  //         yearList.push({ label: i, value: i });
  //     }
  //     this.setState({
  //         yearList
  //     })
  // }

  handleSubmit = id => {};

  handleDialog = () => {
    this.setState({
      isOpenTreatmentDone: false,
      isOpenReversal: false,
    });
  };

  handleSearch = event => {
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        this.props
          .getCommonApi(`custappt/?search=${searchString}`)
          .then(key => {
            let { status, data } = key;
            if (status === 200) {
              // for (let value of data) {
              //     customerList.push({ value: value.id, label: value.emp_name })
              // }
              this.setState({ customerOption: data });
            }
          });
      }, 500);
    }
    this.debouncedFn();
  };

  handleSelectCustomer = async data => {
    let { formFields } = this.state;
    formFields["custId"] = data.id;
    formFields["custName"] = data.cust_name;
    this.setState({ formFields, isOpenCustomer: false, customerOption: [] });
    await this.props.updateForm("basicApptDetail", formFields);
    console.log(this.props.basicApptDetail, "sdfsadfasdf");
  };

  handleCheckout = () => {
    let { isOpenPayment } = this.state;
    isOpenPayment = true;
    this.setState({ isOpenPayment });
  };

  handleChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;
    await this.setState({
      formFields,
    });
    // this.props.updateForm('customerDetail', formFields)
    // await this.props.updateForm('appointmentCustomerDetail', formFields)
  };

  handleMenu = (item, index) => {};

  render() {
    let {
      tstaffList = [],
      menuItems = [],
      activeMenu,
      selectedYear,
      yearList,
      isOpenTreatmentDone,
      headerDetails,
      tsStaff,
      isOpenReversal,
      treatmentIds,
    } = this.state;
    let { basicApptDetail, t } = this.props;
    return (
      <>
        <div className="row treatment-done-new p-3">
          <div className="col-12 header">
            <div className="row">
              <div className="col-10">
                <p className="fs-18 font-700 mb-3 title">
                  {t("Transaction Detail")}
                </p>
              </div>
              <div className="col-2">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="fs-15 clear-line"
                  label="Back"
                  outline={false}
                  onClick={() => history.push(`/admin/cart`)}
                />
              </div>
            </div>
            <div className="d-flex mb-4">
              {menuItems.length > 0
                ? menuItems.map((data, index) => {
                    return (
                      <div
                        className={`menus fs-14 mr-4 ${
                          activeMenu === data.id ? "active" : ""
                        }`}
                        onClick={() => this.handleMenu(data.id, data.label)}
                      >
                        {t(data.label)}
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
          <div className="col-12">
            <VoidPaidTrans></VoidPaidTrans>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
});

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

export const BillOps = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(BillOpsClass)
);
