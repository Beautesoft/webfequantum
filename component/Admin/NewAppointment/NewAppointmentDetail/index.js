import React, { Component } from "react";
import {
  NormalInput,
  NormalSelect,
  NormalTextarea,
  NormalDate,
  NormalButton,
  NormalModal,
} from "component/common";
import Modal from "assets/images/modal-avatar.png";
import "./style.scss";
import { getCommonApi, commonPatchApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import closeIcon from "assets/images/close.png";
import _ from "lodash";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";

export class AppointmentDetailClass extends Component {
  state = {
    formFields: {
      appt_status: "",
      sec_status: "",
      Treatment: {
        emp_no: null,
      },
    },
    appointmentDetail: {},
    userDetail: [
      { label: "Joined", value: "02.05.2020" },
      { label: "D.O.B", value: "02.05.1995" },
      { label: "Gender", value: "Female" },
      { label: "Phone", value: "+65 62970125" },
      { label: "Email", value: "jamie@gmail.com" },
      { label: "Address", value: "1/2, Jurong west, Singapore." },
      { label: "Member type", value: "Premium" },
    ],
    bookingList: [],
    secStatusList: [],
    isOpenModal: true,
    customerOption: [],
    search: "",
    staffOption: [],
  };

  componentDidMount = async () => {
    let { formFields, staffOption } = this.state;
    await this.props.getCommonApi("bookingstatus/").then(async res => {
      let { status, data, sec_data } = res;
      if (status === 200) {
        await this.setState({ bookingList: data, secStatusList: sec_data });
      }
    });
    await this.props
      .getCommonApi(
        `appointment/Staffs/?Outlet=&date=${dateFormat(new Date())}`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          for (let value of data) {
            staffOption.push({ value: value.id, label: value.emp_name });
          }
          this.setState({ staffOption });
        }
      });
    this.getAppointmentDetail();
  };

  getAppointmentDetail = async () => {
    let { appointmentDetail } = this.state;
    await this.props
      .getCommonApi(`appointment/${this.props.match.params.id}/`)
      .then(async key => {
        let { status, data } = key;
        if (status === 200) {
          appointmentDetail = data;
          await this.setState({
            appointmentDetail,
          });
          this.getDataFromStore();
        }
      });
  };

  getDataFromStore = () => {
    debugger;
    let { appointmentDetail, formFields } = this.state;
    formFields["appt_status"] = appointmentDetail
      ? appointmentDetail.Appointment_details.Booking_status
      : "";
    formFields["sec_status"] =
      appointmentDetail.Appointment_details.Secondary_Status;
    formFields["Treatment"]["emp_no"] = appointmentDetail.Treatment.emp_id;
    this.setState({
      formFields,
    });
  };

  handleInput = ({ target: { name, value } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    formFields[name] = value === true ? 1 : value;
    this.setState({
      formFields,
    });
  };

  handleRemark = ({ target: { name, value } }) => {
    let { appointmentDetail } = this.state;
    appointmentDetail["Remark"]["New_Remark"] = value;
    this.setState({
      appointmentDetail,
    });
  };
  handleBookingStatus = ({ target: { name, value } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    formFields["appt_status"] = value;
    this.setState({
      formFields,
    });
  };

  handleSecStatus = ({ target: { name, value } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    formFields["sec_status"] = value;
    this.setState({
      formFields,
    });
  };

  handleChangeTerapist = ({ target: { name, value } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    formFields["Treatment"]["emp_no"] = value;
    this.setState({
      formFields,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      isOpenModal: false,
    });
    history.push(`/admin/newappointment`);
  };

  handleSearch = async event => {
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        let searchString = event.target.value;
        let data = { search: searchString };
        // this.queryHandler(data)
        await this.setState({
          search: searchString,
        });
        this.search(searchString);
      }, 500);
    }
    this.debouncedFn();
  };

  search = searchString => {
    let { search } = this.state;
    this.props.getCommonApi(`custappt/?search=${search}`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        // for (let value of data) {
        //     customerList.push({ value: value.id, label: value.emp_name })
        // }
        this.setState({ customerOption: data });
      }
    });
  };

  handleSubmit = () => {
    let { formFields } = this.state;
    this.props
      .commonPatchApi(
        `appointment/${this.props.match.params.id}/UpdateDetail/`,
        formFields
      )
      .then(res => {});
  };

  render() {
    let {
      appointmentDetail = {},
      formFields,
      bookingList,
      secStatusList,
      customerOption,
      isOpenModal,
      staffOption,
    } = this.state;
    let {
      Appointment_details = {},
      Booking_details = {},
      Remark = {},
      Treatment = {},
      customer_detail = {},
      Payment,
      Customer_Request,
    } = appointmentDetail;
    let {
      Booking_status,
      Date,
      Outlet,
      Secondary_Status,
      Time,
    } = Appointment_details;
    let { Appointment_channel, Booked_by, Source } = Booking_details;
    let { New_Remark, Remark_Points } = Remark;
    let {
      Duration,
      End_Time,
      Room,
      Start_Time,
      Status,
      Therapist,
      id,
      emp_no,
    } = Treatment;
    let {
      cust_address,
      cust_code,
      cust_dob,
      cust_email,
      cust_joindate,
      cust_name,
      cust_phone2,
      cust_pic,
      cust_sex,
      member_type,
    } = customer_detail;
    return (
      <NormalModal
        className="w-100"
        style={{ minWidth: "1400px", height: "100%" }}
        modal={isOpenModal}
        handleModal={this.handleCloseDialog}
      >
        <img
          onClick={this.handleCloseDialog}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="appointment-detail">
          <div className="row">
            <div className="col-md-9">
              <div
                className="re-direct"
                onClick={() => history.push(`/admin/newappointment`)}
              >
                <i className="icon-left-arrow"></i>
                <p>Back to appointments</p>
              </div>
              <p className="head-label">Appointment details</p>
              <div className="appointment">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="first-value">Date</th>
                      <th>Time</th>
                      <th>Outlet</th>
                      <th>Booking Status</th>
                      <th>Treatment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{Date}</td>
                      <td>{Time}</td>
                      <td>{Outlet}</td>
                      <td className="appointment-status">
                        <div className="input-group">
                          <NormalSelect
                            options={bookingList}
                            value={formFields.appt_status}
                            name="bookingStatus"
                            onChange={this.handleBookingStatus}
                            className="customer-name status py-1"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="input-group">
                          <NormalSelect
                            options={secStatusList}
                            value={formFields.sec_status}
                            name="sec_status"
                            onChange={this.handleSecStatus}
                            className="customer-name status py-1"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="status">
                <p className="status-label">Payment </p>
                <p className="status-detail">{Payment}</p>
              </div>
              <p className="head-label">Treatment</p>
              <div className="appointment">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="first-value">Treatment</th>
                      <th className="first-value">Start time</th>
                      <th>End Time</th>
                      <th>Room</th>
                      <th>Therapist(s)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{Treatment.Treatment}</td>
                      <td>{Start_Time}</td>
                      <td>{End_Time}</td>
                      <td>{Room}</td>
                      <td>
                        <div className="input-group">
                          <NormalSelect
                            // placeholder="Enter here"
                            options={staffOption}
                            value={formFields.Treatment.emp_no}
                            name="emp_no"
                            onChange={this.handleChangeTerapist}
                            className="customer-name p-0"
                          />
                        </div>
                      </td>
                      <td className="appointment-status">{Status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="head-label">Remarks</p>
              <div className="my-4">
                <NormalTextarea
                  placeholder="Enter customer feedbacks..."
                  value={New_Remark}
                  name="New_Remark"
                  onChange={this.handleRemark}
                />
              </div>

              <div className="d-flex justify-content-center">
                <div className="col-2">
                  <NormalButton
                    label="Submit"
                    success={true}
                    onClick={this.handleSubmit}
                    className="mr-2 col-12"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="detail-card card">
                <div className="detail-user-profile">
                  <div className="profile-avatar">
                    <img className="modal-avatar" src={cust_pic} alt="" />
                  </div>
                  <p className="user-name text-center">{cust_name}</p>
                  <NormalButton
                    label={`Id : ${cust_code}`}
                    className="mr-2 col-12"
                  />
                </div>
                <div className="user-detail">
                  <div className="detail d-flex">
                    <p className="status-label">Joined</p>
                    <p className="spliter">:</p>
                    <p className="status-detail">{cust_joindate}</p>
                  </div>

                  <div className="detail d-flex">
                    <p className="status-label">D.O.B</p>
                    <p className="spliter">:</p>
                    <p className="status-detail">{cust_dob}</p>
                  </div>

                  <div className="detail d-flex">
                    <p className="status-label">Gender</p>
                    <p className="spliter">:</p>
                    <p className="status-detail">{cust_sex}</p>
                  </div>

                  <div className="detail d-flex">
                    <p className="status-label">Phone</p>
                    <p className="spliter">:</p>
                    <p className="status-detail">{cust_phone2}</p>
                  </div>

                  <div className="detail d-flex">
                    <p className="status-label">Email</p>
                    <p className="spliter">:</p>
                    <p className="status-detail">{cust_email}</p>
                  </div>

                  <div className="detail d-flex">
                    <p className="status-label">Address</p>
                    <p className="spliter">:</p>
                    <p className="status-detail">{cust_address}</p>
                  </div>

                  <div className="detail d-flex">
                    <p className="status-label">Member type</p>
                    <p className="spliter">:</p>
                    <p className="status-detail">{member_type}</p>
                  </div>
                </div>
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
      getCommonApi,
      commonPatchApi,
    },
    dispatch
  );
};

export const NewAppointmentDetail = connect(
  null,
  mapDispatchToProps
)(AppointmentDetailClass);
