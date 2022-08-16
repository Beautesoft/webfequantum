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
// import { Treatment, Payment, EditCart } from './cart/index';
import service from "assets/images/make-up-brush.png";
// import Discount from './cart/discount';
import { StaffList } from "./StaffList";

export class TreatmentDoneClass extends Component {
  state = {
    isOpen: false,
    currentIndex: -1,
    tstaffList: [],
    cartData: {},
    postFields: {
      work_point: "",
      times: "",
      helper_id: "",
    },
    updateFields: {
      Room: null,
      Source: null,
      new_remark: null,
    },
    formFields: {
      cartid: "",
      Item: "",
      Price: "",
      Room: null,
      Source: null,
      add_duration: "",
      new_remark: null,
      times: null,
      work_point: "",
    },
    outletList: [],
    headerDetails: [
      { label: "Employee name", sortKey: false, width: "130px" },
      {
        label: "WP1",
        width: "42px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "St. time",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-center",
      },
      {
        label: "End time",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Duration",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-center",
      },
    ],
    customerOption: [],
    // cartData: {},
    roomList: [],
    sourceList: [],
    staffList: [],
    limit: 6,
    page: 1,
    meta: {},
    duration: [],
    showPostError: false,
    showUpdateError: false,
  };

  componentDidMount = () => {
    // this.getCart();
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
    let { basicApptDetail } = this.props;
    if (basicApptDetail.custId) {
      let { formFields } = this.state;
      formFields["custId"] = basicApptDetail.custId;
      formFields["custName"] = basicApptDetail.custName;
      this.setState({ formFields });
    }
    let { roomList, sourceList, staffList, cartData, duration, tstaffList } =
      this.state;
    this.props.getCommonApi("room/").then(key => {
      let { status, data } = key;
      for (let value of data) {
        roomList.push({ value: value.id, label: value.displayname });
      }
      this.setState({ roomList });
    });
    this.props.getCommonApi(`source/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          sourceList.push({ value: value.id, label: value.source_desc });
        }
        this.setState({ sourceList });
      }
    });
    this.getStafflist();

    this.getCart();
    this.props.getCommonApi(`treatment/Duration/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          duration.push({ value: value, label: value });
        }
        this.setState({ duration });
      }
    });
  };

  getStafflist = data => {
    let { page, limit } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=0&page=${page}&limit=${limit}`)
      .then(async key => {
        let { status, data } = key;
        console.log(key, "sdfgsdfgsdfgdfg sdfgsdfgsdfg");
        let { staffList } = this.state;
        let { meta } = this.state;
        staffList = [];
        meta = {};
        staffList = data;
        meta = data.meta.pagination;
        console.log(meta, "metalist");
        this.setState({
          staffList,
          meta,
        });
      });
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  getCart = () => {
    let { roomList, sourceList, staffList, cartData, duration, tstaffList } =
      this.state;
    this.props
      .getCommonApi(`tmpitemhelper/?cartid=${this.props.cartId}`)
      .then(key => {
        // let { status, data } = key;
        // if (status === 200) {
        cartData = key;
        tstaffList = key.data;
        this.setState({ cartData, tstaffList });
        this.getDataFromRes(key);
        // }
      });
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

  getDateTime = data => {
    let date = new Date(data);
    date = String(date).split(" ");
    let date1 = date[2] + "th " + date[1] + ", " + date[3];
    let time = date[4].split(":");
    let time1 =
      String(Number(time[0]) > 12 ? Number(time[0]) - 12 : time[0]) +
      ":" +
      time[1] +
      (Number(time[0]) > 12 ? "PM" : "AM");
    return time1 + ", " + date1;
  };

  handleSubmit = id => {
    this.props
      .getCommonApi(`tmpitemhelper/confirm/?cartid=${this.props.cartId}`)
      .then(async key => {
        if (key.status === 200) {
          this.props.handleModal();
        }
      });
  };

  handleDialog = () => {};

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

  handleCartCreated = () => {};

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

  handlePostChange = async ({ target: { value, name } }) => {
    let { postFields } = this.state;
    postFields[name] = value;
    await this.setState({
      postFields,
    });
  };

  handleUpdateChange = async ({ target: { value, name } }) => {
    let { updateFields } = this.state;
    updateFields[name] = value;
    await this.setState({
      updateFields,
    });
    let event = { target: { value: value, name: name } };
    // this.handleUpdatestaff(event);
  };

  handleAddstaff = item => {
    let { tstaffList, formFields, cartData, postFields } = this.state;
    let data = {
      helper_id: item.id,
    };
    if (postFields.work_point && postFields.times) {
      this.props
        .commonCreateApi(
          `tmpitemhelper/?cartid=${this.props.cartId}&workcommpoints=${postFields.work_point}&times=${postFields.times}`,
          data
        )
        .then(() => {
          this.getCart();
        });
    } else {
      this.setState({ showPostError: true });
    }
  };

  handleUpdatestaff = async (event, item, index) => {
    let { tstaffList, formFields, cartData, updateFields } = this.state;
    tstaffList[index][event.target.name] = event.target.value;
    this.setState({
      tstaffList,
    });
    let data = {};
    if (event.target.name === "appt_fr_time") {
      data = {
        appt_fr_time: event.target.value,
        add_duration: formFields["add_duration"],
      };
    }
    if (event.target.name === "add_duration") {
      data = {
        appt_fr_time: item.appt_fr_time,
        add_duration: event.target.value,
      };
    }

    // if (updateFields.Source && updateFields.Room) {
    this.props
      .commonPatchApi(
        `tmpitemhelper/${item.id}/?Room_Codeid=${updateFields.Room}&Source_Codeid=${updateFields.Source}&new_remark=${updateFields.new_remark}`,
        data
      )
      .then(() => {
        this.getCart();
      });
    // } else {
    //     this.setState({ showUpdateError: true })
    // }
  };

  handleClearLine = () => {
    this.props
      .commonDeleteApi(
        `tmpitemhelper/delete/?clear_all=0&cartid=${this.props.cartId}`
      )
      .then(() => {
        this.getCart();
      });
  };

  handleClearAll = () => {
    this.props
      .commonDeleteApi(
        `tmpitemhelper/delete/?clear_all=1&cartid=${this.props.cartId}`
      )
      .then(() => {
        let { formFields, postFields } = this.state;
        formFields["work_point"] = "";
        postFields["times"] = "";
        this.setState({
          formFields,
          postFields,
        });
        this.getCart();
      });
  };

  render() {
    let {
      staffList = [],
      tstaffList = [],
      roomList,
      sourceList,
      formFields,
      headerDetails,
      cartData,
      postFields,
      updateFields,
      duration,
      meta,
    } = this.state;
    let { value = {}, data = {} } = cartData;
    let { Item, Price, work_point } = value;
    return (
      <div className="row new-cart treatment-done">
        <div className="col-12">
          <p className="fs-18 font-700 mb-3 title">Treatment Done</p>
        </div>
        <div className="col-6 mb-2">
          <label className="text-left text-black common-label-text ">
            Item
          </label>
          <div className="input-group mb-2">{Item}</div>
          <label className="text-left text-black common-label-text ">
            Price
          </label>
          <div className="input-group mb-2">{Price}</div>
          <label className="text-left text-black common-label-text ">
            Work Point
          </label>
          <div className="input-group">
            <NormalInput
              value={postFields.work_point}
              name="work_point"
              onChange={this.handlePostChange}
              className={`customer-name ${
                !postFields.work_point ? "required" : ""
              }`}
            />
          </div>
          <label className="text-left text-black common-label-text ">
            Sessions
          </label>
          <div className="input-group">
            <NormalInput
              value={postFields.times}
              name="times"
              onChange={this.handlePostChange}
              className={`customer-name ${!postFields.times ? "required" : ""}`}
              disabled
            />
          </div>
        </div>
        <div className="col-6 mb-2">
          <div>
            <label className="text-left text-black common-label-text ">
              Room
            </label>
          </div>
          <div className="input-group mb-2">
            <NormalSelect
              // placeholder="Enter here"
              options={roomList}
              value={updateFields.Room}
              name="Room"
              onChange={this.handleUpdateChange}
              className="customer-name py-0"
              // disabled={formFields.Room}
            />
          </div>
          <div>
            <label className="text-left text-black common-label-text ">
              Source
            </label>
          </div>
          <div className="input-group mb-2">
            <NormalSelect
              // placeholder="Enter here"
              options={sourceList}
              value={updateFields.Source}
              name="Source"
              onChange={this.handleUpdateChange}
              className="customer-name py-0"
              // disabled={formFields.Source}
            />
          </div>
          <div>
            <label className="text-left text-black common-label-text ">
              New Remark
            </label>
          </div>
          <div className="input-group">
            <NormalInput
              // placeholder="Enter here"
              // options={siteList}
              value={updateFields.new_remark}
              name="new_remark"
              onChange={this.handleUpdateChange}
              className="customer-name"
              // disabled={formFields.new_remark}
            />
          </div>
        </div>
        <StaffList
          staffList={staffList}
          meta={meta}
          handleNext={() => this.handleNext()}
          handleBack={() => this.handleBack()}
          handleSelectedStaff={item => this.handleAddstaff(item)}
        />
        <div className={`col-12 cart-item`}>
          <div className={`item-list`}>
            <div className="table">
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
                // pageMeta={pageMeta}
                // isEmpty={tstaffList.length === 0 ? true:false}
              >
                {tstaffList.length > 0
                  ? tstaffList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="position-relative status-type">
                            <span className={``}></span>
                            <div className="text-left">{item.helper_name}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.wp1}</div>
                          </td>
                          <td>
                            <div
                              className={`${
                                tstaffList.length > 0
                                  ? "d-flex"
                                  : "display-none"
                              } align-items-center justify-content-center`}
                            >
                              <div className="input-group">
                                <NormalSelect
                                  // placeholder="Enter here"
                                  options={duration}
                                  value={item.appt_fr_time}
                                  name="appt_fr_time"
                                  onChange={event =>
                                    this.handleUpdatestaff(event, item, index)
                                  }
                                  className="customer-name py-0"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {item.appt_to_time}
                            </div>
                          </td>
                          <td>
                            {tstaffList.length > 0 ? (
                              <div
                                className={`${
                                  tstaffList.length > 0
                                    ? "d-flex"
                                    : "display-none"
                                } align-items-center justify-content-center`}
                              >
                                <div className="input-group">
                                  <NormalSelect
                                    // placeholder="Enter here"
                                    options={duration}
                                    value={item.add_duration}
                                    name="add_duration"
                                    onChange={event =>
                                      this.handleUpdatestaff(event, item, index)
                                    }
                                    className="customer-name p-0"
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            </div>
          </div>
        </div>
        <div className="col-12 pt-4 action-bar">
          <div className="row">
            <div className="col-6 d-flex">
              <NormalButton
                buttonClass={"mx-2"}
                resetbg={true}
                className="fs-15"
                label="Clear Line"
                outline={false}
                onClick={this.handleClearLine}
              />
              <NormalButton
                buttonClass={"mx-2"}
                resetbg={true}
                className="fs-15"
                label="Clear All"
                onClick={this.handleClearAll}
              />
            </div>
            <div className="col-6 text-right">
              <NormalButton
                buttonClass={"mx-2"}
                mainbg={true}
                className=" fs-15 confirm"
                label="Confirm"
                outline={false}
                onClick={this.handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
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

export const TreatmentDone = connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentDoneClass);
