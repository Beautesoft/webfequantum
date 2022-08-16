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
import { dateFormat } from 'service/helperFunctions';
import { getCommonApi } from 'redux/actions/common';

export class TreatmentClass extends Component {
    state = {
        treatment: [],
        treatmentDetail: [],
        treatmentCategoryId: null,
        treatmentId: "",
        list: [
        ],
        activeTab: 'treatment',
        detailField: {
            products_used: "",
            recurring_appointment: ""
        }
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
        await this.props.getTreatmentDetailList(`?Item_Deptid=${id}`).then((res) => {
            this.setState({ treatmentDetail: res.data, treatmentCategoryId: id })
        })
        this.setState({ activeTab: "treatmentdetaillist" })
    }

    handleTreatmentDetail = async (id) => {
        let { appointmentDetail } = this.props;
        await this.props.getTreatmentDetail(`${id}/?Appointment_id=${appointmentDetail.id}`).then(async (res) => {
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
                Item_Codeid: treatmentId,
                Appointment: appointmentDetail.id,
                products_used: detailField.products_used,
                recurring_appointment: detailField.recurring_appointment
            }
            await this.props.CreateTreatment(data).then(async (res) => {
                await this.props.getOutletDetail(`${res.data.id}/`).then(() => { })
            })


            this.setState({ activeTab: "select-treatment" })
        } else {
            this.validator.showMessages();
        }

    }

    handleBookTreatment = async (id) => {
        this.setState({ activeTab: "treatment-booking" })
    }

    handleChange = async (e) => {
        let { detailField } = this.state;
        detailField[e.target.name] = e.target.value;
        await this.setState({ detailField })
        this.props.updateForm('selectedTreatment', detailField)
    }

    handleConfirmBooking = async () => {
        this.setState({ activeTab: "confirm-booking" })
    }

    handleAnotherTreatment = (customer) => {
        console.log(customer, "ssdasdfasd ==========")
        this.props.updateForm('APPOINTMENT_DETAIL', customer)
        this.setState({ activeTab: "treatment" })
    }

    render() {
        let { treatment, activeTab, treatmentDetail, treatmentCategoryId, treatmentId, list } = this.state
        let { treatmentResponse, appointmentDetail, detailField } = this.props;
        let { procedure, room_image, staff_image, treatment_details, Stock_PIC } = treatmentResponse;
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
                                            <div className=""><div className={`visited`}><div className="timeline active"></div></div><p>Treatment</p></div>
                                            <div className=""><div className={``}><div className="timeline"></div></div><p>Book Appointment</p></div>
                                            <div className=""><div className={``}><div className="timeline"></div></div><p>Add to cart</p></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="appointment-holder">
                                    <div className="treatment-section">
                                        <NormalIf isShow={activeTab === 'treatment'}>
                                            <p className="treatment-label">Treatments</p>
                                            <div className="treatment-type">
                                                {treatment.length > 0 && treatment.map((data, index) => (
                                                    <div className="treatment mt-4 col-3" onClick={() => this.handleSelect(data.id)} key={index}>
                                                        <img className="treatment-img" src={data.deptpic} alt="" />
                                                        <p className="treatment-name">{data.itm_desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </NormalIf>
                                        <NormalIf isShow={activeTab === 'treatmentdetaillist'}>
                                            <p className="treatment-label"><span>Treatments {'>'}</span> Facial</p>
                                            <div className="treatment-type">
                                                {treatmentDetail.length > 0 && treatmentDetail.map((data, index) => (
                                                    <div className="treatment mt-4 col-3" onClick={() => this.handleTreatmentDetail(data.id)}>
                                                        <img className="treatment-img" src={data.Stock_PIC} alt="" />
                                                        <p className="treatment-name">{data.item_desc}</p>
                                                        <p className="treatment-name">$ {data.item_price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </NormalIf>
                                        <NormalIf isShow={activeTab === 'treatmentdetail'}>
                                            <p className="treatment-label"><span>Treatments {'>'}</span> <span>Facial</span> {'>'} <span>Golden facial</span></p>
                                            <div className="treatment-detail row">
                                                <div className="col-5 p-0">
                                                    <p className="headline">Treatment details</p>
                                                    <p className="detail">{treatment_details} </p>
                                                    <p className="headline mt-3">Products used</p>

                                                    <div className="product-used">
                                                        <input
                                                            placeholder="Select your choices"
                                                            value={products_used}
                                                            name="products_used"
                                                            onChange={this.handleChange}
                                                        />
                                                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18.4733 7.75014H17.5003C17.4448 7.54951 17.3256 7.37237 17.1606 7.24551C16.9955 7.11866 16.7937 7.04898 16.5855 7.04702H15.5469V4.50702C15.548 4.4595 15.5366 4.41253 15.5136 4.37092C15.4906 4.32931 15.457 4.29455 15.4162 4.27022L8.08895 0.0381125C8.04765 0.014109 8.00073 0.00146484 7.95297 0.00146484C7.9052 0.00146484 7.85829 0.014109 7.81699 0.0381125L0.487501 4.27022C0.446029 4.29426 0.411627 4.32881 0.387761 4.37038C0.363896 4.41195 0.351411 4.45908 0.351564 4.50702V12.9713C0.351565 13.0193 0.3642 13.0664 0.388199 13.108C0.412198 13.1496 0.446716 13.1841 0.488283 13.2081L7.81852 17.4402C7.86008 17.4642 7.90724 17.4768 7.95524 17.4768C8.00447 17.4769 8.0529 17.4642 8.09586 17.4402L11.9531 15.2153V16.8237C11.9527 16.9768 11.9827 17.1285 12.0413 17.2699C12.0999 17.4114 12.186 17.5398 12.2946 17.6478C12.4032 17.7558 12.5322 17.8411 12.674 17.8989C12.8158 17.9567 12.9676 17.9858 13.1207 17.9845H18.4733C18.6268 17.9859 18.7791 17.957 18.9214 17.8993C19.0637 17.8417 19.1931 17.7565 19.3024 17.6486C19.4116 17.5407 19.4984 17.4122 19.5578 17.2707C19.6172 17.1291 19.648 16.9772 19.6484 16.8237V8.92913C19.6483 8.61716 19.5245 8.31797 19.3043 8.09702C19.084 7.87606 18.7852 7.75134 18.4733 7.75014ZM16.5953 7.59389C16.7005 7.59389 16.8015 7.63571 16.8759 7.71015C16.9504 7.78458 16.9922 7.88554 16.9922 7.99081V8.01729C16.9922 8.12256 16.9504 8.22352 16.8759 8.29795C16.8015 8.37239 16.7005 8.41421 16.5953 8.41421H15.0063C14.901 8.41421 14.8001 8.37239 14.7256 8.29795C14.6512 8.22352 14.6094 8.12256 14.6094 8.01729V7.99081C14.6094 7.88554 14.6512 7.78458 14.7256 7.71015C14.8001 7.63571 14.901 7.59389 15.0063 7.59389H16.5953ZM7.95524 0.590652L11.0011 2.34917L4.2182 6.26526L1.17238 4.50675L7.95524 0.590652ZM7.69531 16.7298L0.898439 12.8134V4.98003L7.69531 8.89639V16.7298ZM7.95524 8.4228L4.76508 6.58096L11.548 2.66491L14.7383 4.50675L7.95524 8.4228ZM11.9531 8.92913V14.5839L8.24219 16.7298V8.89639L15 4.98003V7.04702H15.0085C14.8003 7.04897 14.5985 7.11865 14.4334 7.2455C14.2684 7.37236 14.1492 7.5495 14.0937 7.75014H13.1207C12.8096 7.75165 12.5117 7.87671 12.2928 8.09782C12.0738 8.31892 11.9516 8.61795 11.9531 8.92913ZM19.1016 16.8237C19.1012 16.9054 19.0846 16.9862 19.0527 17.0615C19.0208 17.1368 18.9743 17.2049 18.9158 17.2621C18.8574 17.3192 18.7881 17.3641 18.7122 17.3943C18.6362 17.4244 18.555 17.4391 18.4733 17.4376H13.1207C13.0394 17.439 12.9586 17.4241 12.8832 17.3938C12.8077 17.3635 12.739 17.3185 12.6812 17.2613C12.6233 17.2041 12.5775 17.1359 12.5464 17.0608C12.5153 16.9856 12.4995 16.905 12.5 16.8237V8.92913C12.4992 8.84684 12.5146 8.7652 12.5454 8.68888C12.5761 8.61256 12.6216 8.54305 12.6793 8.48434C12.7369 8.42563 12.8056 8.37886 12.8814 8.34672C12.9571 8.31458 13.0385 8.29769 13.1207 8.29702H14.1044C14.1631 8.49057 14.2829 8.6599 14.4458 8.77962C14.6088 8.89934 14.8062 8.96301 15.0085 8.96108H16.5855C16.7878 8.96302 16.9852 8.89935 17.1482 8.77962C17.3112 8.6599 17.4309 8.49057 17.4896 8.29702H18.4733C18.6402 8.29807 18.8 8.36513 18.9177 8.48355C19.0354 8.60198 19.1015 8.76216 19.1016 8.92913V16.8237Z" fill="#888888" />
                                                        </svg>

                                                    </div>
                                                    {this.validator.message('products_used', products_used, 'required')}
                                                    <p className="headline mt-3">Recurring appointment</p>
                                                    <input
                                                        placeholder="Enter no. of recurrings"
                                                        value={recurring_appointment}
                                                        name="recurring_appointment"
                                                        onChange={this.handleChange}
                                                    /><br></br>
                                                    {this.validator.message('recurring_appointment', recurring_appointment, 'required')}
                                                </div>

                                                <div className="col-3 pt-2">
                                                    <img className="treatment-img" src={Stock_PIC} alt="" />
                                                </div>
                                                <div className="col-4 staff">
                                                    <div className="row m-0">
                                                        <div className="col-6 p-0">
                                                            <p className="headline">Treatment room</p>
                                                            <img onClick={() => history.push(`/admin/appointment/create/treatment/${treatmentId}/view-rooms`)} className="treatment-img" src={room_image} alt="" />
                                                        </div>
                                                        <div className="col-6 p-0">
                                                            <p className="headline">Staff</p>
                                                            <img onClick={() => history.push(`/admin/appointment/create/treatment/${treatmentId}/view-staffs`)} className="treatment-img" src={staff_image} alt="" />
                                                        </div>
                                                        <div className="procedure p-0">
                                                            <p className="headline">Procedure</p>
                                                            <p className="detail">{procedure}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="confirm mt-5">
                                                    <NormalButton
                                                        buttonClass={"treatment"}
                                                        mainbg={true}
                                                        className="col-12 fs-15 "
                                                        label="Select Treatment"
                                                        onClick={this.handleSelectTreatment}
                                                    />
                                                </div>

                                            </div>
                                        </NormalIf>
                                        <NormalIf isShow={activeTab === 'select-treatment'}>
                                            {activeTab === 'select-treatment' ?
                                                <div className="treatment-detail row">
                                                    {/* <TreatmentDetail id={treatmentId}></TreatmentDetail> */}
                                                    <TreatmentDetail id={treatmentId} handleBookTreatment={this.handleBookTreatment}></TreatmentDetail>
                                                </div> : ""}
                                        </NormalIf>

                                        <NormalIf isShow={activeTab === 'treatment-booking'}>
                                            {activeTab === 'treatment-booking' ?
                                                <div className="treatment-detail row">
                                                    <TreatmentConfirm id={treatmentId} handleConfirmBooking={this.handleConfirmBooking} handleAnotherTreatment={() => this.setState({ activeTab: "treatment" })}></TreatmentConfirm>

                                                </div> : ""}
                                        </NormalIf>
                                        <NormalIf isShow={activeTab === 'confirm-booking'}>
                                            <div className="treatment-detail row">
                                                <AllAppointment handleAnotherTreatment={this.handleAnotherTreatment}></AllAppointment>

                                            </div>
                                        </NormalIf>
                                    </div>
                                    <div className="view-all-appointment">
                                        <NormalButton
                                            buttonClass={"treatment"}
                                            mainbg={true}
                                            className="col-12 fs-15 "
                                            label="View all"
                                            onClick={() => this.setState({ activeTab: "confirm-booking" })}
                                        />
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
        getCommonApi
    }, dispatch)
}

export const Treatment = connect(mapStateToProps, mapDispatchToProps)(TreatmentClass)