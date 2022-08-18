import React, { Component } from 'react';
import { NormalSelect, NormalTextarea, NormalButton } from 'component/common';
import Hairwash from '../../../../assets/images/service1.png'
import './style.scss';
import { updateForm, getSelectedTreatmentList } from 'redux/actions/appointment';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import SimpleReactValidator from 'simple-react-validator';

export class TreatmentConfirmClass extends Component {
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
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        let { appointmentDetail } = this.props
        this.props.getSelectedTreatmentList(`?appt_id=${appointmentDetail.id}`).then((res) => {
            console.log("namekkuhkjn", res)
        })
    }

    // handleChange = async ({ target: { value, name } }) => {
    //     let { formFields } = this.state;
    //     console.log("uihwkjrwkej", name, value)
    //     formFields[name] = value;
    //     await this.setState({
    //         formFields,
    //     });
    //     this.props.updateForm('treatmentDetail', formFields)
    // };

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
        let { customerDetail, selectedTreatmentList } = this.props;
        let { outlet, staff, rooms } = customerDetail;
        return (
            <div className="select-treatment w-100">
                {selectedTreatmentList.length > 0 ? selectedTreatmentList.map(({ id, PIC, Course, item_class, stock_name, treatment_date, site_name, price, cus_requests }, index) => {
                    return (
                        <div className="row selected mb-4">
                            <div className="col-7">
                                <div className="row">
                                    <div className="col-4 ">
                                        <img className="treatment-img" src={PIC} alt="" />
                                    </div>
                                    <div className="col-8 header-detail">
                                        <p className="fs-18 title">{stock_name}</p>
                                        <p className="fs-16 subtitle">{item_class}</p>
                                        <p className="detail">{treatment_date ? this.getDateTime(treatment_date):""},  {site_name}</p>

                                    </div>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="row">
                                    <div className="col-6 py-4 header-detail">
                                        <div>
                                            <p className="subtitle">Requests</p>
                                            <p className="detail">{cus_requests}</p>
                                        </div>

                                    </div>
                                    <div className="col-6 py-5">
                                        <p className="fs-22">$ {price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) : ""}

                <div className="confirm mt-5">
                    <NormalButton
                        buttonClass={"treatment"}
                        mainbg={true}
                        className="col-12 mr-5 fs-15 "
                        label="Add another treatment"
                        onClick={this.props.handleAnotherTreatment}
                    />
                    <NormalButton
                        buttonClass={"treatment"}
                        mainbg={true}
                        className="col-12 ml-4 fs-15 "
                        label="Confirm Booking"
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
    selectedTreatmentList: state.appointment.selectedTreatmentList
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        updateForm,
        getSelectedTreatmentList
    }, dispatch)
}

export const TreatmentConfirm = connect(mapStateToProps, mapDispatchToProps)(TreatmentConfirmClass)