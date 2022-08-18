import React, { Component } from 'react';
import { NormalIf, NormalButton } from 'component/common'
import '../style.scss';
import Availability from '../Availability';
import { Cart } from '../../../Cart'
import { getTreatment, getTreatmentDetailList, getTreatmentDetail, CreateTreatment, updateForm, getOutletDetail, getAppointmentList } from 'redux/actions/appointment';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { TreatmentList } from './treatmentsList';
import SimpleReactValidator from 'simple-react-validator';
import { history } from 'helpers';
import { dateFormat } from 'service/helperFunctions';
import { getCommonApi, commonCreateApi } from 'redux/actions/common';

export class BookAppointmentClass extends Component {
    state = {
        treatment: [],
        treatmentDetail: [],
        treatmentCategoryId: null,
        treatmentId: 26,
        list: [
            { emp_name: "MANDY YIN", job_title: "THERAPIST", value:"0 Appointment today", emp_img:"http://52.60.58.9:800//media/img/IMG-20200824-WA0000_pXUowT9.jpg", appointment:[], id:14 },
            { emp_name: "ALICE OOI", job_title: "BRANCH MANAGER", value:"0 Appointment today", emp_img:"http://52.60.58.9:800//media/img/4._Users_RrMUlCB.png", appointment:[], id:13 },
        ],
        activeTab: 'book-appointment',
    
    }

    componentWillMount() {
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        this.props.getTreatment("").then((res) => {
            this.setState({ treatment: res.data })
        })
        this.props.getCommonApi(`staffsavailable/?Appt_date=${dateFormat(new Date(), "yyyy-mm-dd")}`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                // for (let value of data) {
                //     staffList.push({ value: value.id, label: value.emp_name })
                // }
                this.setState({ list:data })
            }
        })
    }

    handleSelect = async (id) => {
        await this.props.getTreatmentDetailList(`?Item_Dept=${id}`).then((res) => {
            this.setState({ treatmentDetail: res.data, treatmentCategoryId: id })
        })
        this.setState({ activeTab: "treatmentdetaillist" })
    }

    handleTreatmentDetail = async (id) => {
        let { appointmentDetail } = this.props;
        await this.props.getTreatmentDetail(`${id}/?Appointment_id=${appointmentDetail.id}`).then(async(res) => {
            // await this.props.getTreatmentDetail(`${id}/`).then((res) => {
            let { detailField } = this.state;
            detailField['products_used'] = res.data.products_used;
            detailField['recurring_appointment'] = res.data.products_used;
            await this.setState({ treatmentDetail: res.data, detailField, treatmentId: id })
            this.props.updateForm('selectedTreatment', detailField)
        })
        this.setState({ activeTab: "treatmentdetail" })
    }

    handleSelectTreatment = async (id) => {
        let { treatmentId } = this.state;
        let { appointmentDetail, detailField } = this.props;
        if (this.validator.allValid()) {
            let data = {
                Item_Code: treatmentId,
                Appointment: appointmentDetail.id,
                products_used: detailField.products_used,
                recurring_appointment: detailField.recurring_appointment
            }
            await this.props.CreateTreatment(data).then(async(res) => {
                await this.props.getOutletDetail(`${res.data.id}/`).then(()=>{})
            })
            

            this.setState({ activeTab: "select-treatment" })
        } else {
            this.validator.showMessages();
        }

    }

    handleBookTreatment = async (id) => {
        this.setState({ activeTab: "treatment-booking" })
    }

    handleChange = async(e) => {
        let {detailField} = this.state;
        detailField[e.target.name] = e.target.value;
        await this.setState({detailField})
        this.props.updateForm('selectedTreatment', detailField)
    }

    handleConfirmBooking = async() => {
        // await this.props.getAppointmentList('').then((res)=>{})
        // this.setState({ activeTab: "confirm-booking" })
        history.push(`/admin/appointment/create/treatment/${this.props.match.params.id}/appointment-cart`)
    }

    render() {
        let { treatment, activeTab, treatmentDetail, treatmentCategoryId, treatmentId, list  } = this.state
        let { treatmentResponse, appointmentDetail, detailField } = this.props;
        let { procedure, room_image, staff_image, treatment_details, PIC_Path } = treatmentResponse;
        let { products_used, recurring_appointment } = detailField
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
                                {/* <div className="timeline-view d-flex justify-content-around">
                                    <div className="label-1 active"><div className="timeline step-1"></div><p>Customer Details</p></div>
                                    <div className="label-2"><div className="timeline step-2"></div><p>Treatment</p></div>
                                    <div className="label-3"><div cl3ssName="timeline step-3"></div><p>Book Appointment</p></div>
                                    <div className="label-4"><div className="timeline"></div><p>Add to cart</p></div>
                                </div> */}
                                <div className="stepper">
                                    <div className="step-view step-3">
                                        <div className="timeline-view step d-flex justify-content-around">
                                            <div className=""><div className={``}><div className="timeline active"></div></div><p>Customer Details</p></div>
                                            <div className=""><div className={``}><div className="timeline active"></div></div><p>Treatment</p></div>
                                            <div className=""><div className={`visited`}><div className="timeline active"></div></div><p>Book Appointment</p></div>
                                            <div className=""><div className={``}><div className="timeline"></div></div><p>Add to cart</p></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="appointment-holder">
                                    <div className="treatment-section">
                                        <NormalIf isShow={activeTab === 'book-appointment'}>
                                            <p className="treatment-label fs-14 f-600">Book appointment</p>
                                            <TreatmentList id={this.props.match.params.id} handleConfirmBooking={this.handleConfirmBooking}></TreatmentList>
                                        </NormalIf>
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
        getTreatment,
        getTreatmentDetailList,
        getTreatmentDetail,
        CreateTreatment,
        updateForm,
        getOutletDetail,
        getAppointmentList,
        getCommonApi,
        commonCreateApi
    }, dispatch)
}

export const BookAppointment = connect(mapStateToProps, mapDispatchToProps)(BookAppointmentClass)