import React, { Component } from 'react';
import { NormalIf, NormalButton } from 'component/common'
import './style.scss';
import Availability from './Availability';
import { Cart } from './Cart'
import { getTreatment, getTreatmentDetailList, getTreatmentDetail, CreateTreatment, updateForm, getOutletDetail, getAppointmentList } from 'redux/actions/appointment';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { TreatmentDetail } from './treatmentsDetail'
import { TreatmentConfirm } from './treatmentsConfirm'
import { AllAppointment } from './AllAppointment'
import SimpleReactValidator from 'simple-react-validator';
import { history } from 'helpers';

export class StaffListClass extends Component {
    state = {
        list: [
            { name: "narasim", title: "frontend" },
            { name: "monica", title: "backend" }
        ],
        staffList: []
    }

    componentDidMount() {
        this.handlegetStaffList()
    }


    handlegetStaffList = async (id = 9) => {
        let { appointmentDetail } = this.props;
        this.props.getCommonApi(`employeebranchwise?Appointment_id=${appointmentDetail.id}`).then((res) => {
            this.setState({
                staffList: res.data
            })
        })
    }



    render() {
        let { list, staffList } = this.state;
        return (
            <>
                <div className="create-appointment container">
                    <div className="row">
                        <div className="col-md-1 pr-0 position-relative">
                            <div className="availability">
                                <p className="heading">Staff Availability</p>
                                {list.map((data, index) => (
                                    <>
                                        <Availability availability={data}></Availability>
                                    </>
                                ))}

                            </div>
                        </div>
                        <div className=" col-md-10 appointment-col">
                            <div className="appointment">
                                <div className="stepper">
                                    <div className="step-view step-3">
                                        <div className="timeline-view step d-flex justify-content-around">
                                            <div className=""><div className={``}><div className="timeline active"></div></div><p>Customer Details</p></div>
                                            <div className=""><div className={`visited`}><div className="timeline active"></div></div><p>Treatment</p></div>
                                            <div className=""><div className={``}><div className="timeline"></div></div><p>Book Appointment</p></div>
                                            <div className=""><div className={``}><div className="timeline"></div></div><p>Add to cart</p></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="appointment-holder">
                                    <div className="treatment-section">

                                        <p className="treatment-label"><span>Treatments {'>'}</span> Facial</p>
                                        <div className="cart-head">
                                            <i className="icon-left-arrow" onClick={() => history.push(`/admin/appointment/create/treatment`)}></i>
                                        </div>
                                        <div className="treatment-type">
                                            {staffList.length > 0 && staffList.map((data, index) => (
                                                <div className="treatment mt-4 col-3" onClick={() => this.handleTreatmentDetail(data.id)}>
                                                    <img className="treatment-img" src={data.Emp_PIC} alt="" />
                                                    <p className="treatment-name">{data.Emp_name}</p>
                                                    <p className="treatment-name">{data.jobtitle_name}</p>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <Cart />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
    detailField: state.appointment.selectedTreatment,
    treatmentResponse: state.appointment.treatmentResponse,
    appointmentDetail: state.appointment.appointmentDetail,
    customerList: state.common.customerList
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getTreatmentDetail,
        getTreatment
    }, dispatch)
}

export const StaffList = connect(mapStateToProps, mapDispatchToProps)(StaffListClass)