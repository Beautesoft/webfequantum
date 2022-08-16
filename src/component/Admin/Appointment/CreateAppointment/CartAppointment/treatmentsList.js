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
        console.log(bookAppointmentList, "kjdkfjsdjfhsd")
        return (
            <div className="select-treatment book-treatment mt-3 w-100">
                <div className="row">
                    <div className="col-7">
                        <div className="row">
                            <div className="col-7 f-600">
                                Treatment
                            </div>
                            <div className="col-5 f-600 ">
                                Price
                            </div>
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="row">
                            <div className="col-7 f-600 ">
                                Quantity
                            </div>
                            <div className="col-5 f-600 ">
                                Total Price
                            </div>
                        </div>
                    </div>
                </div>
                {bookAppointmentList.length > 0 ? bookAppointmentList.map(({ id, PIC, course, total, item_class, treatment_no, treatment_date, site_name, price, cus_requests }, index) => {
                    return (
                        <div className="row selected mb-4">
                            <div className="col-7 h-100">
                                <div className="row">
                                    <div className="col-7 ">
                                        <p className="fs-20 mb-0 f-600 title">{course}</p>
                                        <p className="fs-14 mb-0 subtitle">{item_class}</p>
                                        <p className="detail mb-0 fs-10">{treatment_date ? this.getDateTime(treatment_date):""},  {site_name}</p>
                                    </div>
                                    <div className="col-5 py-3 header-detail">
                                        <div>
                                            <p className="fs-22 mb-0 f-600">$ {price}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-5 h-100">
                                <div className="row">
                                    <div className="col-7 py-3 header-detail">
                                        <p className="fs-22 f-600">{treatment_no}</p>
                                    </div>
                                    <div className="col-5 py-3">
                                        <p className="fs-22 f-600">$ {price * treatment_no}</p>
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
                        label="Add to Cart"
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