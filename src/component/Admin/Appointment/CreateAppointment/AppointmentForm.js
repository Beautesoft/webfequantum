import React, { Component } from "react";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalDate,
  NormalModal,
} from "component/common";
import { CreateAppointment, updateForm } from "redux/actions/appointment";
import { getCustomer, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import SimpleReactValidator from "simple-react-validator";
import closeIcon from "assets/images/close.png";
import _ from "lodash";

export class AppointmentFormClass extends Component {
  state = {
    active: false,
    appt_fr_time: "",
    appt_to_time: "",
    currentValue: "-1",
    formFields: {
      customerName: "",
      emp_id: "",
      appointmentDate: new Date(),
      bookingStatus: "",
      Source_Codeid: "",
      ItemSite_Codeid: "",
      new_remark: "",
      Appt_typeid: "",
      // emp_noid : 4,
      Room_Codeid: "",
      sec_status: "",
    },
    multipleCustomerForm: {
      noOfCustomer: 1,
      treatment: "",
      room: "",
    },
    bookingList: [],
    isOpenModal: false,
    multipleCustomr: 1,
    customerElement: [],
    siteList: [],
    sourceList: [],
    channelList: [],
    staffList: [],
    secStatusList: [],
    roomList: [],
    customerOption: [],
    search: "",
    customerId: 0,
  };

  componentWillMount = async () => {
    this.validator = new SimpleReactValidator({
      element: (message) => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
      validators: {
        date: {
          // name the rule
          message: "The :attribute must be grater than today.",
          rule: (val, params, validator) => {
            let date1 = new Date(dateFormat(new Date()));
            let date2 = new Date(dateFormat(val));
            console.log(
              "gagasdfsdfsdffqwef",
              date1,
              date2,
              date1.getTime(),
              date2.getTime()
            );
            return date1.getTime() <= date2.getTime();
          },
          //   messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
          required: true, // optional
        },
      },
    });
    this.props.getCustomer("all/").then(() => {});
    this.props.getCommonApi("bookingstatus/").then((res) => {
      let { status, data, sec_data } = res;
      console.log(data);
      if (status === 200) {
        this.setState({ bookingList: data, secStatusList: sec_data });
      }
    });
    // this.handleCustomerElement()
    this.props.onRef(this);
    let { staffList, formFields } = this.state;
    let { basicApptDetail } = this.props;
    formFields["appointmentDate"] = basicApptDetail.date;
    formFields["ItemSite_Codeid"] = basicApptDetail.branchId;
    await this.setState({ formFields });
    this.getListData();
    this.props
      .getCommonApi(
        `appointment/Staffs/?Outlet=${
          this.state.formFields.ItemSite_Codeid
        }&date=${dateFormat(new Date())}`
      )
      .then((key) => {
        let { status, data } = key;
        if (status === 200) {
          for (let value of data) {
            staffList.push({ value: value.id, label: value.emp_name });
          }
          this.setState({ staffList });
        }
      });
  };

  componentWillUnmount() {
    this.props.onRef(null);
  }

  getListData = () => {
    let { staffList, sourceList, siteList, channelList, roomList } = this.state;

    this.props.getCommonApi(`source/`).then((key) => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          sourceList.push({ value: value.id, label: value.source_desc });
        }
        this.setState({ sourceList });
        console.log(sourceList, "jhksdfkjsdhfks");
      }
    });
    this.props.getCommonApi(`treatment/Outlet/`).then((key) => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          siteList.push({ value: value.id, label: value.itemsite_code });
        }
        this.setState({ siteList });
        console.log(siteList, "jhksdfkjsdhfks");
      }
    });
    this.props.getCommonApi(`appttype/`).then((key) => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          channelList.push({ value: value.id, label: value.appt_type_desc });
        }
        this.setState({ channelList });
        console.log(siteList, "jhksdfkjsdhfks");
      }
    });
    this.props
      .getCommonApi(`room/?outlet=${this.state.formFields.ItemSite_Codeid}`)
      .then((key) => {
        let { status, data } = key;
        if (status === 200) {
          for (let value of data) {
            roomList.push({ value: value.id, label: value.displayname });
          }
          this.setState({ roomList });
          console.log(roomList, "jhksdfkjsdhfks");
        }
      });
  };

  selectTime = async (key, type) => {
    let { formFields } = this.state;
    if (type === "appt_fr_time") {
      formFields["appt_fr_time"] = key;
      await this.setState({
        formFields,
        appt_fr_time: key,
      });
    } else {
      formFields["appt_to_time"] = key;
      await this.setState({
        formFields,
        appt_to_time: key,
      });
    }

    await this.props.updateForm("appointmentCustomerDetail", formFields);
    console.log("sdfsdfsdfsd", formFields);
  };

  handleClick = (key) => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      active: !prevState.active,
      currentValue: key,
    }));
  };

  handleOutsideClick = (e) => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  onFocus = () => {
    this.validator.showMessages();
  };

  handleChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;
    await this.setState({
      formFields,
    });
    this.props.updateForm("customerDetail", formFields);
    await this.props.updateForm("appointmentCustomerDetail", formFields);
    if (name === "ItemSite_Codeid") {
      let { staffList } = this.state;
      this.props
        .getCommonApi(`appointment/Staffs/?Outlet=${value}`)
        .then((key) => {
          let { status, data } = key;
          if (status === 200) {
            for (let value of data) {
              staffList.push({ value: value.id, label: value.emp_name });
            }
            this.setState({ staffList });
          }
        });
    }
  };

  handleMultiple = async ({ target: { value, name } }) => {
    let { multipleCustomerForm } = this.state;
    if (name === "noOfCustomer") {
      multipleCustomerForm[name] = Number(value);
    }
    if (name === "sameForAllTreatment" || name === "differentForAllTreatment") {
      if (name === "differentForAllTreatment") {
        multipleCustomerForm["treatment"] = 2;
      } else {
        multipleCustomerForm["treatment"] = 1;
      }
    } else {
      if (name === "differentForAllRoom") {
        multipleCustomerForm["room"] = 2;
      } else {
        multipleCustomerForm["room"] = 1;
      }
    }

    await this.setState({
      multipleCustomerForm,
    });
    this.props.updateForm("multipleCustomerForm", multipleCustomerForm);
  };

  handleSubmit = () => {
    history.push(`/admin/appointment/create/select-treatment`);
  };

  getTime = (data) => {
    let time = data.split(" ");
    let time1 = time[0].split(":");
    console.log(time, time1, "kghjhgdjfgsdf");
    if (time[1] === "pm") {
      return (
        (Number(time1[0]) + 12 === 24 ? "00" : Number(time1[0]) + 12) +
        ":" +
        time1[1]
      );
    } else {
      return time1[0] < 9 ? "0" + time[0] : time1[0] + ":" + time1[1];
    }
  };

  handleDialog = () => {
    let { isOpenModal } = this.state;
    isOpenModal = !isOpenModal;
    this.setState({
      isOpenModal,
    });
  };

  handleMultipleCustomer = async () => {
    let { multipleCustomerForm } = this.props;
    await this.setState({
      multipleCustomr: multipleCustomerForm.noOfCustomer,
      customerElement: [],
    });
    console.log(
      multipleCustomerForm,
      this.state,
      "dkjfkshgfghdfk",
      multipleCustomerForm.noOfCustomer
    );
    this.handleCustomerElement(multipleCustomerForm.noOfCustomer);
  };

  // handleSearch = (event) => {
  //     event.persist();

  //     if (!this.debouncedFn) {
  //         this.debouncedFn = _.debounce(() => {
  //             let searchString = event.target.value;
  //             let data = { search: searchString }
  //             // this.queryHandler(data)
  //             let { customerList } = this.state;
  //             let { basicApptDetail } = this.props;
  //             console.log(basicApptDetail)
  //             this.search(basicApptDetail, searchString)
  //         }, 500);
  //     }
  //     this.debouncedFn();
  // }

  handleSearch = async (event) => {
    // event.persist();
    await this.setState({ search: event.target.value });
    console.log(this.state.search);
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        let { customerList } = this.state;
        let { basicApptDetail } = this.props;
        this.search(basicApptDetail);
      }, 500);
    }
    this.debouncedFn();
  };

  search = (basicApptDetail) => {
    let { search } = this.state;
    this.props
      .getCommonApi(
        `custappt/?Outlet=${
          basicApptDetail.branchId ? basicApptDetail.branchId : ""
        }&search=${search}`
      )
      .then((key) => {
        let { status, data } = key;
        if (status === 200) {
          // for (let value of data) {
          //     customerList.push({ value: value.id, label: value.emp_name })
          // }
          this.setState({ customerOption: data });
        }
      });
  };

  handleSelectCustomer = (data) => {
    let { formFields } = this.state;
    formFields["customerName"] = data.id;
    formFields["custName"] = data.cust_name;
    this.setState({ formFields, isOpenModal: false, customerOption: [] });
    this.setState({ customerId: data.id });
    this.props.selectedCustomer(data.id);
  };
  render() {
    let {
      appt_fr_time,
      active,
      currentValue,
      bookingList,
      channelList,
      secStatusList,
      roomList,
      customerOption,
      isOpenModal,
      multipleCustomr,
      appt_to_time,
      siteList,
      sourceList,
      staffList,
      customerElement,
      formFields,
    } = this.state;
    let { customerDetail, customerList, multipleCustomerForm } = this.props;
    let { noOfCustomer, treatment, room } = multipleCustomerForm;
    return (
      <div className="form-group mb-4 pb-2">
        <div className="row">
          {/* <div className="col-3 mb-3">
                        <div>
                            <label className="text-left text-black common-label-text ">
                                Branch
                                    </label>
                        </div>
                        <div className="input-group">
                            <NormalSelect
                                // placeholder="Enter here"
                                options={siteList}
                                value={formFields.ItemSite_Codeid}
                                name="ItemSite_Codeid"
                                onChange={this.handleChange}
                                className="customer-name py-1"
                            />
                        </div>
                        {this.validator.message('Branch', formFields.ItemSite_Codeid, 'required')}
                    </div> */}

          <div className="col-3 mb-3">
            <label className="text-left text-black common-label-text ">
              Date{" "}
              <span className="error-message text-danger validNo fs-18">*</span>
            </label>
            <div className="input-group">
              <NormalDate
                value={new Date(formFields.appointmentDate)}
                name="appointmentDate"
                type="date"
                onChange={this.handleChange}
                minDate={new Date()}
                showDisabledMonthNavigation
              />
            </div>
            {this.validator.message(
              "appointmentDate",
              formFields.appointmentDate,
              "required|date"
            )}
          </div>
          <div className="col-3 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Name{" "}
                <span className="error-message text-danger validNo fs-18">
                  *
                </span>
              </label>
            </div>
            <div className="input-group">
              <NormalInput
                // placeholder="Enter here"
                // options={siteList}
                value={formFields.custName}
                name="customerName"
                onClick={() => this.setState({ isOpenModal: true })}
                // onChange={this.handleSearch}
                className="search px-3 p-0"
              />
            </div>
            {this.validator.message(
              "customerName",
              formFields.customerName,
              "required"
            )}
          </div>

          <div className="col-3 mb-3">
            <label className="text-left text-black common-label-text ">
              Booking status{" "}
              <span className="error-message text-danger validNo fs-18">*</span>
            </label>
            <div className="input-group">
              <NormalSelect
                // placeholder="Enter here" }
                options={bookingList}
                value={formFields.bookingStatus}
                name="bookingStatus"
                onChange={this.handleChange}
                className="customer-name status py-1"
              />
              {this.validator.message(
                "Booking Status",
                formFields.bookingStatus,
                "required"
              )}
            </div>
          </div>

          <div className="col-3 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Channel
              </label>
            </div>
            <div className="input-group">
              <NormalSelect
                // placeholder="Enter here"
                options={channelList}
                value={formFields.Appt_typeid}
                name="Appt_typeid"
                onChange={this.handleChange}
                className="customer-name py-1"
              />
            </div>
            {/* {this.validator.message('Appt_typeid', formFields.Appt_typeid, 'required')} */}
          </div>

          <div className="col-3 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Remark
              </label>
            </div>
            <div className="input-group">
              <NormalInput
                // placeholder="Enter here"
                // options={siteList}
                value={formFields.new_remark}
                name="new_remark"
                onChange={this.handleChange}
                className="customer-name"
              />
            </div>
            {/* {this.validator.message('Remark', formFields.new_remark, 'required')} */}
          </div>

          <div className="col-3 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Source Name
              </label>
            </div>
            <div className="input-group">
              <NormalSelect
                // placeholder="Enter here"
                options={sourceList}
                value={formFields.Source_Codeid}
                name="Source_Codeid"
                onChange={this.handleChange}
                className="customer-name py-1"
              />
            </div>
            {/* {this.validator.message('Source name', formFields.Source_Codeid, 'required')} */}
          </div>
          <div className="col-3 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Room
              </label>
            </div>
            <div className="input-group">
              <NormalSelect
                // placeholder="Enter here"
                options={roomList}
                value={formFields.Room_Codeid}
                name="Room_Codeid"
                onChange={this.handleChange}
                className="customer-name py-1"
              />
            </div>
            {/* {this.validator.message('Room', formFields.Room_Codeid, 'required')} */}
          </div>

          <div className="col-3 mb-3">
            <label className="text-left text-black common-label-text ">
              Secondary status
            </label>
            <div className="input-group">
              <NormalSelect
                // placeholder="Enter here"
                options={secStatusList}
                value={formFields.sec_status}
                name="sec_status"
                onChange={this.handleChange}
                className="customer-name py-1"
              />
              {/* {this.validator.message('Secondary Status', formFields.sec_status, 'required')} */}
            </div>
          </div>
        </div>
        {/* <div className="create text center create-appointment">
                    
                    <NormalButton
                        buttonClass={"mx-2"}
                        mainbg={true}
                        className="col-12 fs-15 confirm"
                        label="Select treatment"
                        onClick={this.handleSubmit}
                    />
                </div> */}

        <NormalModal
          className={"multiple-appointment select-category"}
          style={{ minWidth: "800px" }}
          modal={isOpenModal}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="row mt-2 mb-5 mx-3">
            <div className="col-12 pl-0 mb-3 fs-18 py-2">Select Customer</div>
            <div className="col-2 pl-0">Search</div>
            <div className="col-5">
              <input
                name="search"
                onChange={this.handleSearch}
                className="search m-0 p-0 px-3"
              />
            </div>
            <div className="col-3">
              <NormalButton
                buttonClass={"mx-2 p-0"}
                mainbg={true}
                className=" fs-15 confirm"
                label="Search"
                outline={false}
                onClick={() => this.search(this.state.search)}
              />
            </div>

            <div className="row mt-4 table-header w-100 m-0">
              <div className="col-2">Name</div>
              <div className="col-2">Phone</div>
              <div className="col-3">Cust Code</div>
              <div className="col-5">Email</div>
            </div>
            <div className="response-table w-100">
              {customerOption.length > 0 ? (
                customerOption.map((item, index) => {
                  return (
                    <div
                      className="row m-0 table-body w-100"
                      onClick={() => this.handleSelectCustomer(item)}
                      key={index}
                    >
                      <div className="col-2">{item.cust_name}</div>
                      <div className="col-2">{item.cust_phone1}</div>
                      <div className="col-3">{item.cust_code}</div>
                      <div className="col-5">{item.cust_email}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100">No Data are available</div>
              )}
            </div>
            {/* <div className="d-flex create m-5 w-100">
                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="col-12 fs-15 multiple-customer"
                                label="Continue"
                                outline={true}
                                onClick={this.handleMultipleCustomer}
                            />
                        </div> */}
          </div>
        </NormalModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  customerDetail: state.appointment.customerDetail,
  customerList: state.common.customerList,
  multipleCustomerForm: state.appointment.multipleCustomerForm,
  basicApptDetail: state.appointment.basicApptDetail,
  appointmentCustomerDetail: state.appointment.appointmentCustomerDetail,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      CreateAppointment,
      updateForm,
      getCustomer,
      getCommonApi,
    },
    dispatch
  );
};

export const AppointmentForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentFormClass);
