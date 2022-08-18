import React, { Component } from 'react';
import { NormalSelect, NormalTextarea, NormalButton, NormalInput, NormalMultiSelect } from 'component/common';
import Hairwash from '../../../../assets/images/service1.png'
import './style.scss';
import { updateForm, createBooking } from 'redux/actions/appointment';
import { getStaffBranchwise } from 'redux/actions/staff';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import SimpleReactValidator from 'simple-react-validator';
import { getCommonApi } from 'redux/actions/common'

export class TreatmentDetailClass extends Component {
    state = {
        treatmentDetail: [],
        formFields: {
            treatment_no: "",
            // outlet: "",
            emp_no: [],
            Trmt_Room_Codeid: "",
            cus_requests: ""
        },
        outletOption: [],
        staffOption: [],
        roomOption: [],
    }

    componentWillMount() {
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });

        this.props.getCommonApi('branchlist/').then((res) => {
            this.getOptionData(res.data, "branch")
        })
        this.props.getCommonApi(`room/?Appointment_id=${this.props.appointmentDetail.id}`).then((res) => {
            this.getOptionData(res.data, "room")
        })
        let { treatmentOutletDetail } = this.props;
        this.props.getCommonApi(`treatment/Staffs/?Appointment_id=${this.props.appointmentDetail.id}`).then((res) => {
            // console.log(this.state, "kjgasduygasd", value, res)
            this.getOptionData(res.data, "staff")
        })

        this.setState({ cus_requests: treatmentOutletDetail.cus_requests })
    }

    getOptionData = (data, type) => {
        let { outletOption, staffOption, roomOption } = this.state
        if (type === "branch") {
            for (let key of data) {
                outletOption.push({ label: key.itemsite_desc, value: key.id })
            }
            this.setState({ outletOption })
        }
        if (type === "staff") {

            for (let key of data) {
                staffOption.push({ label: key.emp_name, value: key.id })
            }
            this.setState({ staffOption })
        }
        if (type === "room") {
            for (let key of data) {
                roomOption.push({ label: key.displayname, value: key.id })
            }
            this.setState({ roomOption })
        }
    }


    handleChange = async ({ target: { value, name } }) => {
        let { formFields, staffList } = this.state;

        formFields[name] = value;
        await this.setState({
            formFields,
        });
        if (name === "emp_no") {
            if (formFields['emp_no'].includes(Number(value))) {
                formFields['emp_no'].push(value);
            }
        }
        this.props.updateForm('treatmentDetail', formFields)

    };

    handleStaffList = (value) => {
        let { formFields } = this.state;
        let array = formFields['emp_no'];
        let index = array.indexOf(value);
        if (index > -1) {

            array.splice(index, 1);
            formFields['emp_no'] = array;
        }
        if (formFields['emp_no'].length <= 7) {
            let index = array.indexOf(99);
            if (index > -1) {
                array.splice(index, 1);
                formFields['emp_no'] = array;
            }
        }
        this.setState({
            formFields,
        })
    }

    getDateTime = (data) => {
        let date = new Date(data)
        date = String(date).split(" ")
        let date1 = date[2] + "th " + date[1] + ", " + date[3]
        let time = date[4].split(":")
        let time1 = String(Number(time[0]) > 12 ? (Number(time[0]) - 12) : time[0]) + ":" + time[1] + (Number(time[0]) > 12 ? "PM" : "AM")
        return time1 + ", " + date1
    }

    handleSubmit = async () => {
        let { treatmentDetail } = this.props;
        await this.props.createBooking(`${this.props.treatmentOutletDetail.id}/`, treatmentDetail).then((res) => {
            if (res.status) {
                let { formFields } = this.state;
                formFields = {
                    treatment_no: "",
                    // outlet: "",
                    emp_no: "",
                    Trmt_Room_Codeid: "",
                    cus_requests: ""
                }
                this.setState({ formFields })
                this.props.handleBookTreatment()
            }
        })

    }

    handleMultiSelect = (data) => {
        let { formFields } = this.state;
        let list = []
        for (let key of data) {
            list.push(key.value);
        }
        formFields['emp_no'] = list;
        this.setState({ formFields });
        console.log(formFields, data, "oyokkjk")
    }

    render() {
        let { outletOption, staffOption, roomOption } = this.state
        let { treatmentDetail, treatmentOutletDetail } = this.props;
        let { course, item_class, site_name, treatment_date, PIC, price } = treatmentOutletDetail;
        let { outlet, emp_no, Trmt_Room_Codeid, cus_requests = treatmentOutletDetail.cus_requests, treatment_no } = treatmentDetail;
        return (
            <div className="select-treatment w-100">
                <div className="row selected mb-4">
                    <div className="col-7">
                        <div className="row">
                            <div className="col-4 ">
                                <img className="treatment-img" src={PIC} alt="" />
                            </div>
                            <div className="col-8 header-detail">
                                <p className="fs-18 title">{course}</p>
                                <p className="fs-16 subtitle">{item_class}</p>
                                <p className="detail">{treatment_date ? this.getDateTime(treatment_date) : ""},  {site_name}</p>
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
                <p className="headline">Treatment No</p>
                <div className="input-group mb-3 mt-1">

                    <div className="input-select">
                        <NormalInput
                            // placeholder="Enter here"
                            value={treatment_no}
                            name="treatment_no"
                            onChange={this.handleChange}
                            className="customer-name w-100"
                        />
                        {this.validator.message('treatment_no', treatment_no, 'required')}
                    </div>

                </div>
                {/* <p className="headline">Outlet</p>
                <div className="input-group mb-3 mt-1">

                    <div className="input-select">
                        <NormalSelect
                            // placeholder="Enter here"
                            options={outletOption}
                            value={outlet}
                            name="outlet"
                            onChange={this.handleChange}
                            className="customer-name"
                        />
                        {this.validator.message('outlet', outlet, 'required')}
                    </div>

                    <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="31" height="30" fill="#F9F9F9" />
                        <path d="M15 8V22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8 15H22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </div> */}
                <p className="headline">Staffs</p>
                {staffOption.length > 0 ?
                    <div className="input-group mb-3 mt-1">

                        <div className="input-select">

                            <NormalMultiSelect
                                name="skills"
                                className={`staff-skills-select ${emp_no.length > 0 ? "overflow-y-set" : ""}`}
                                options={staffOption}
                                handleMultiSelect={this.handleMultiSelect}>
                            </NormalMultiSelect>
                        </div>
                        <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="31" height="30" fill="#F9F9F9" />
                            <path d="M15 8V22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 15H22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div> : ""
                }
                <p className="headline">Rooms</p>
                <div className="input-group mb-3 mt-1">

                    <div className="input-select">
                        <NormalSelect
                            // placeholder="Enter here"
                            options={roomOption}
                            value={Trmt_Room_Codeid}
                            name="Trmt_Room_Codeid"
                            onChange={this.handleChange}
                            className="customer-name"
                        />
                        {this.validator.message('Trmt_Room_Codeid', Trmt_Room_Codeid, 'required')}
                    </div>
                    <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="31" height="30" fill="#F9F9F9" />
                        <path d="M15 8V22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8 15H22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </div>
                <p className="headline">Customer Requests</p>
                <div className="input-group mb-3 mt-1">
                    <NormalTextarea
                        placeholder="Enter your Request"
                        value={cus_requests}
                        name="cus_requests"
                        onChange={this.handleChange}
                        className="customer-name"
                    />
                </div>
                <div className="confirm mt-5">
                    <NormalButton
                        buttonClass={"treatment"}
                        mainbg={true}
                        className="col-12 fs-15 "
                        label="Add this treatment"
                        onClick={this.handleSubmit}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
    customerList: state.common.customerList,
    treatmentOutletDetail: state.appointment.treatmentOutletDetail,
    treatmentDetail: state.appointment.treatmentDetail,
    appointmentDetail: state.appointment.appointmentDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        updateForm,
        getStaffBranchwise,
        getCommonApi,
        createBooking
    }, dispatch)
}

export const TreatmentDetail = connect(mapStateToProps, mapDispatchToProps)(TreatmentDetailClass)