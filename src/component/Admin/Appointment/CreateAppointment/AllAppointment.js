import React, { Component } from 'react';
import { NormalButton } from 'component/common';
import './style.scss';
import { history } from 'helpers';
import { dateFormat } from 'service/helperFunctions';
import { updateForm, getSelectedTreatmentList, getAppointmentList } from 'redux/actions/appointment';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import timeOption from 'data/timeOption.json'
import SimpleReactValidator from 'simple-react-validator';
import { AppointmentForm } from './AppointmentForm';
import { getCustomer, getCommonApi } from 'redux/actions/common';

export class AllAppointmentClass extends Component {
    state = {
        active: false,
        appointmentTime: '',
        currentValue: '-1',
        formFields: {
            customerName: "",
            appointmentDate: "",
            appointmentTime: "",
            bookingStatus: ""
        },
        bookingList: [],
        staffList: [{ value: "", label: "" }],
        siteList: [{ value: "", label: "" }],
        sourceList: [{ value: "", label: "" }]
    }

    componentWillMount = async () => {
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        await this.props.getCustomer('all/').then(() => { })
        await this.props.getCommonApi('bookingstatus/').then(async (res) => {
            let { status, data } = res;
            if (status === 200) {
                await this.setState({ bookingList: data })
            }
        })
        await this.props.getAppointmentList(`?Appt_date=${dateFormat(new Date())}`).then((res) => { })
        this.getListData();
        this.getStaffList(1)
    }

    getListData = () => {
        let { staffList, sourceList, siteList } = this.state;

        this.props.getCommonApi(`source/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    sourceList.push({ value: value.id, label: value.source_desc })
                }
                this.setState({ sourceList })
                console.log(sourceList, "jhksdfkjsdhfks")
            }
        })
        this.props.getCommonApi(`treatment/Outlet/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    siteList.push({ value: value.id, label: value.itemsite_code })
                }
                this.setState({ siteList })
                console.log(siteList, "jhksdfkjsdhfks")
            }
        })

    }

    getStaffList = async (value) => {
        console.log("sdfasdfasdf", value)
        let { staffList, sourceList, siteList } = this.state;
        this.setState({ staffList: [] })
        await this.props.getCommonApi(`appointment/Staffs/?Outlet=${value}`).then(async (key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    staffList.push({ value: value.id, label: value.emp_name })
                }
                await this.setState({ staffList })

            }
            
        })
        console.log("sdfasdfasdf", value, staffList)
        return staffList
    }

    selectTime = async (key) => {
        let { formFields } = this.state;
        formFields['appointmentTime'] = key;
        console.log("uihwkjrwkej", key)
        await this.setState({
            formFields,
            appointmentTime: key
        })
        this.props.updateForm('customerDetail', formFields)
    }

    handleClick = (key) => {
        if (!this.state.active) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            active: !prevState.active,
            currentValue: key
        }));
    }

    handleOutsideClick = (e) => {
        if (this.node != null) {
            if (this.node.contains(e.target)) {
                return;
            }
        }
        this.handleClick();
    }

    handleChange = async ({ target: { value, name } }) => {
        let { formFields } = this.state;
        console.log("uihwkjrwkej", name, value)
        formFields[name] = value;
        await this.setState({
            formFields,
        });
        this.props.updateForm('customerDetail', formFields)
    };


    getTime = (data) => {
        let time = data.split(" ")
        let time1 = time[0].split(".")
        console.log(time, time1, "kghjhgdjfgsdf")
        if (time[1] === "pm") {
            return ((Number(time1[0]) + 12) === 24 ? "00" : Number(time1[0]) + 12) + ":" + time1[1]
        } else {
            return time1[0] < 9 ? ("0" + time[0]) : time1[0] + ":" + time1[1]
        }
    }

    handleSubmit = (id) => {
        // this.props.handleConfirmBooking()
        history.push(`/admin/appointment/create/treatment/${id}/book-appointment`)
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
        // let { outletOption, staffOption, roomOption } = this.state
        let { confirmedBookedList } = this.props;
        // let { outlet, staff, rooms } = customerDetail;
        let { appt_fr_time, appt_to_time, active, currentValue, bookingList, formFields, siteList, sourceList, staffList } = this.state;
        let { customerList } = this.props;
        return (
            <div className="booked-appointment w-100">
                {confirmedBookedList.length > 0 ? confirmedBookedList.map(({ Appointment, Treatment }, index) => {
                    // await this.getStaffList(Appointment.ItemSite_Codeid)
                    return (
                        <>
                            <div className="customer-title mb-4">Customer {index + 1}*</div>
                            <AppointmentForm
                                handleChange={this.handleChange}
                                handleClick={this.handleClick}
                                validator={this.validator}
                                formFields={
                                    {
                                        customerName: Number(Appointment.cust_noid),
                                        appointmentDate: new Date(Appointment.appt_date),
                                        appt_fr_time: Appointment.appt_fr_time,
                                        appt_to_time: Appointment.appt_to_time,
                                        // appt_fr_time: Number(Appointment.Appt_Fr_time.split(":")[0]) > 12 ? Number(Appointment.Appt_Fr_time.split(":")[0]) - 12 + ":" + Appointment.Appt_Fr_time.split(":")[0] + "PM" : Appointment.Appt_Fr_time + "AM",
                                        // appt_to_time: Number(Appointment.Appt_Fr_time.split(":")[0]) > 12 ? Number(Appointment.Appt_Fr_time.split(":")[0]) - 12 + ":" + Appointment.Appt_Fr_time.split(":")[0] + "PM" : Appointment.Appt_Fr_time + "AM",
                                        bookingStatus: Appointment.appt_status,
                                        emp_id: Number(Appointment.emp_noid),
                                        Source_Codeid: Appointment.Source_Codeid,
                                        ItemSite_Codeid: Appointment.ItemSite_Codeid
                                    }
                                }
                                timeOption={timeOption}

                                appt_fr_time={appt_fr_time}
                                appt_to_time={appt_to_time}
                                // appointmentTime={appointmentTime}
                                active={active}
                                customerList={customerList}
                                currentValue={currentValue}
                                bookingList={bookingList}
                                siteList={siteList}
                                // siteList={Appointment.ItemSite_Codeid ? () => this.getStaffList(Appointment.ItemSite_Codeid) : []}
                                sourceList={sourceList}
                                staffList={staffList}
                                selectTime={this.selectTime}>

                            </AppointmentForm>
                            {Treatment.length > 0 ? Treatment.map(({ id, PIC, Course, item_class, stock_name, treatment_date, room_name, emp_name, site_name, price, cus_requests }, key) => {

                                return (
                                    <>


                                        <div className="row selected mb-4">
                                            <div className="col-7">
                                                <div className="row">
                                                    <div className="col-4 ">
                                                        <img className="treatment-img" src={PIC} alt="" />
                                                    </div>
                                                    <div className="col-8 py-2 header-detail">
                                                        <p className="fs-18 title mt-1">{stock_name}</p>
                                                        <p className="fs-16 subtitle">{item_class}</p>
                                                        <p className="detail">{treatment_date ? this.getDateTime(treatment_date) : ""},  {site_name}</p>
                                                        {/* <p className="detail">{"4:00PM, Aug 15 2020, oulet_name"}</p> */}
                                                        <p className="detail mt-1">Staff <b>{emp_name}</b> &nbsp;&nbsp;&nbsp; Room <b>{room_name}</b></p>

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

                                    </>
                                )
                            }) : ""}
                            <div className="confirm mt-3 mb-5">
                                <NormalButton
                                    className="col-12 fs-15 multiple-customer"
                                    label="change treatment"
                                    outline={true}
                                // onClick={() => history.push('/admin/appointment/create/treatment')}
                                />
                                <NormalButton
                                    buttonClass={"mx-4"}
                                    className="col-12 fs-15 multiple-customer"
                                    label="Select another treatment"
                                    outline={true}
                                    onClick={() => this.props.handleAnotherTreatment(Appointment)}
                                />
                                <NormalButton
                                    buttonClass={"treatment"}
                                    mainbg={true}
                                    className="col-12 fs-15 "
                                    label="Confirm Booking"
                                    onClick={() => this.handleSubmit(Appointment.id)}
                                />
                            </div>

                        </>)
                }) : ""}

                <div className="confirm mt-5">

                    <NormalButton
                        mainbg={true}
                        className="col-12 fs-15 confirm"
                        label="Select Another Customer"
                        onClick={() => { }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
    appointmentDetail: state.appointment.appointmentDetail,
    confirmedBookedList: state.appointment.confirmedBookedList,
    customerList: state.common.customerList
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        // updateForm,
        updateForm,
        getCustomer,
        getCommonApi,
        getAppointmentList
    }, dispatch)
}

export const AllAppointment = connect(mapStateToProps, mapDispatchToProps)(AllAppointmentClass)