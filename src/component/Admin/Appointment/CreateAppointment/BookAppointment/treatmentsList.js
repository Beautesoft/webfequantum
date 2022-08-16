import React, { Component } from 'react';
import { NormalSelect, NormalTextarea, NormalButton } from 'component/common';
import '../style.scss';
import { updateForm, getBookAppointmentList } from 'redux/actions/appointment';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import SimpleReactValidator from 'simple-react-validator';
import Hairwash from 'assets/images/service1.png'

export class TreatmentListClass extends Component {
    state = {
        treatmentDetail: [],
        formFields: {
            outlet: "",
            staff: "",
            rooms: "",
            customer_request: ""
        },
        outletOption: [{ label: "head massage", value: 1 }],
        staffOption: [{ label: "Narasim", value: 1 }],
        roomOption: [{ label: "room 1", value: 1 }],
    }

    componentWillMount() {
        let { appointmentDetail } = this.props
        this.props.getBookAppointmentList(`?appt_id=${this.props.id}`).then((res) => {
            console.log("namekkuhkjn", res)
        })
    }

    handleSubmit = () => {
        this.props.handleConfirmBooking()
    }

    getDateTime = (data) => {
        let date = new Date(data)
        date = String(date).split(" ")
        let date1 = date[2] + "th " + date[1] + ", " + date[3]
        let time = date[4].split(":")
        let time1 = String(Number(time[0]) > 12 ? (Number(time[0]) - 12) : time[0]) + ":" + time[1] + (Number(time[0]) > 12 ? "PM" : "AM")
        return time1 + ", " + date1
    }

    render() {
        let { outletOption, staffOption, roomOption } = this.state
        let { customerDetail, bookAppointmentList } = this.props;
        let { outlet, staff, rooms } = customerDetail;
        return (
            <div className="select-treatment book-treatment mt-3 w-100">
                {bookAppointmentList.length > 0 ? bookAppointmentList.map(({ id, PIC, course, item_class, stock_name, treatment_date, site_name, price, cus_requests, treatment_no }, index) => {
                    return (
                <div className="row selected mb-4">
                    <div className="col-7 h-100">
                        <div className="row">
                            <div className="col-7 ">
                                <p className="fs-20 mb-0 f-600 title">{course}</p>
                                <p className="fs-14 mb-0 subtitle">{item_class}</p>
                                <p className="detail mb-0 fs-10">{treatment_date ? this.getDateTime(treatment_date):""},  {site_name}</p>
                            </div>
                            <div className="col-5 py-2 header-detail">
                                <div>
                                    <p className="subtitle mb-0 fs-14">Requests</p>
                                    <p className="detail mb-0 fs-12">{cus_requests}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-5 h-100">
                        <div className="row">
                            <div className="col-5 py-4 header-detail">
                                <p className="fs-22 mb-0 f-700">$ {price}</p>

                            </div>
                            <div className="col-4 py-4">
                                <p className="fs-20 mb-0">Qty: {treatment_no}</p>
                            </div>
                            <div className="col-3 py-3">
                                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle opacity="0.3" cx="21" cy="21" r="21" fill="$primary-color" />
                                    <path d="M25.5 20.5C25.5 19.125 26.5125 18 27.75 18C28.9875 18 30 19.125 30 20.5C30 21.875 28.9875 23 27.75 23C26.5125 23 25.5 21.875 25.5 20.5ZM23.25 20.5C23.25 21.875 22.2375 23 21 23C19.7625 23 18.75 21.875 18.75 20.5C18.75 19.125 19.7625 18 21 18C22.2375 18 23.25 19.125 23.25 20.5ZM16.5 20.5C16.5 21.875 15.4875 23 14.25 23C13.0125 23 12 21.875 12 20.5C12 19.125 13.0125 18 14.25 18C15.4875 18 16.5 19.125 16.5 20.5Z" fill="$primary-color" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                 )
                }) : ""} 

                <div className="confirm mt-5">
                    <NormalButton
                        buttonClass={"confirm-booking"}
                        mainbg={true}
                        className="col-12 mr-5 fs-15 "
                        label="Confirm booking"
                        onClick={this.handleSubmit}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
    appointmentDetail: state.appointment.appointmentDetail,
    selectedTreatmentList: state.appointment.selectedTreatmentList,
    bookAppointmentList: state.appointment.bookAppointmentList
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        updateForm,
        getBookAppointmentList,
    }, dispatch)
}

export const TreatmentList = connect(mapStateToProps, mapDispatchToProps)(TreatmentListClass)