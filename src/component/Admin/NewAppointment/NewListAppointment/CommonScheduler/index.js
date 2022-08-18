import React, { Component } from 'react';
import { SchedulerModal } from 'component/common/Plugins';
// import BigSchedulerModal from 'component/common/Plugins/BigScheduler';
import { NormalInput, NormalSelect, NormalButton, NormalDate, NormalModal } from 'component/common';
import { getCustomer, getCommonApi, commonDeleteApi } from 'redux/actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
// import timeOption from 'data/timeOption.json'
import { dateFormat } from 'service/helperFunctions';
import { history } from 'helpers';
import './style.scss';
import SimpleReactValidator from 'simple-react-validator';
import { CreateAppointment, updateForm } from 'redux/actions/appointment';
import { Calander } from './Calander';

const data = [
    { start_date: '2020-06-09 4:00', end_date: '2020-06-09 6:00', text: 'Event 1', id: 1 },
    { start_date: '2020-06-11 8:00', end_date: '2020-06-11 10:00', text: 'Event 2', id: 2 },
    { start_date: '2020-06-12 12:00', end_date: '2018-06-12 14:00', text: 'dblclick me!', id: 3 }
];

export class SchedulerClass extends Component {
    state = {
        appointment: [
            {
                time: '10.00 AM,',
                date: 'Wednesday, 1st April, 2020',
                name: 'Benjamin',
                treatment: 'Head Massage'
            },
            {
                time: '12.00 PM,',
                date: 'Wednesday, 1st April, 2020',
                name: 'Daniel',
                treatment: 'Pedicure'
            },
            {
                time: '1.00 PM,',
                date: 'Wednesday, 1st April, 2020',
                name: 'John',
                treatment: 'Haircut'
            },
            {
                time: '2.00 PM,',
                date: 'Wednesday, 1st April, 2020',
                name: 'Josua',
                treatment: 'Manicure'
            },
            {
                time: '4.00 PM, ',
                date: 'Wednesday, 1st April, 2020',
                name: 'Derrik',
                treatment: 'Body Massage'
            },

        ],
        events: [
            // {
            //     "start_date": "2021-01-06 3:30",
            //     "end_date": "2021-01-06 5:00",
            //     "text": "Korean Anti Aging",
            //     "id": 199787,
            //     "user_id": 171,
            //     "status": "Booking",
            //     "color": "#f0b5ec",
            //     "title": "divya test",
            //     "staff_name": "HAN HAI YAN"
            // }
        ],
        brachList: [],
        formField: {
            branchId: "",
            time: ""
        },
        list: [],
        filterDate: new Date(),
        filterType: 'day',
        selectedId: ""
    }

    componentWillMount = () => {
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        let { brachList, appointment, formField, filterDate } = this.state;
        this.props.getCommonApi(`treatment/Outlet/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    brachList.push({ value: value.id, label: value.itemsite_desc })
                }
                this.setState({ brachList })
                // console.log(brachList, "jhksdfkjsdhfks")
            }
        })
       this.getAvailability();
        this.getAppointment();
    }

    getAvailability = (date) => {
        let { filterDate } = this.state;
        this.setState({ list: [] })
        
        this.props.getCommonApi(`staffsavailable/?Appt_date=${dateFormat(date ? date:filterDate, "yyyy-mm-dd")}`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                // for (let value of data) {
                //     staffList.push({ value: value.id, label: value.emp_name })
                // }
                this.setState({ list: data })
            }
        })
    }

    handleAppointmentOpen = (id, e) => {
        console.log(e, id, "hgjsydfisuyfsdfm ==== handleAppointmentOpen");
    }

    handleEmptyEvent = async (date, e) => {
        let { customerDetail } = this.props;
        let { formField } = this.state;
        // if (this.validator.allValid()) {
        let time = new Date(date)
        formField['time'] = time.getHours() > 9 ? (time.getHours() + ":00") : ("0" + time.getHours()) + ":00";
        await this.setState({ formField });
        console.log(date, e, "hgjsydfisuyfsdfm ==== handleEmptyEvent", time.getHours);
        await this.props.updateForm('basicApptDetail', formField);
        history.push(`/admin/appointment/create`)
        // console.log(date, e, "hgjsydfisuyfsdfm ====");
        // } else {
        //     this.validator.showMessages();
        // }

    }

    getAppointment = () => {
        let { brachList, events, formField, filterType, filterDate } = this.state;
        this.props.getCommonApi(`appointmentcalender/?date=${dateFormat(filterDate)}&check=${filterType}`).then(async (key) => {
            let { status, data } = key;
            if (status === 200) {
                events = [];
                await this.setState({ events: null })
                events = data;
                await this.setState({ events })
                // console.log(events, "jhksdfkjsdhfks", key)
            }
        })
    }
    handleChangeFilter = async (prevMode, prevDate, newMode, newDate) => {

        let { filterDate, filterType } = this.state;
        filterDate = newDate;
        filterType = newMode;
        await this.setState({
            filterDate,
            filterType
        })
        this.getAvailability();
        this.getAppointment()
    }

    handleChange = async ({ target: { value, name } }) => {
        let { formField } = this.state;
        formField[name] = value;
        await this.setState({
            formField,
        });
        if (name === "branchId") {
            this.getAvailability();
            this.getAppointment();
        }
        // console.log(formField, "afasfasdfdfasd")
        this.props.updateForm('basicApptDetail', formField);
    };

    handleDelete = async (id, event) => {
        let { selectedId } = this.state;
        console.log(id, "===afasfasdfdfasd=====", selectedId)
        if (id !== selectedId) {
            await this.setState({
                selectedId: id
            })
            await this.props.commonDeleteApi(`appointment/${id}/`).then((res) => {

            })
        }
        
    }

    openDetail = (id) => {
        history.push(`/admin/appointment/${id}/detail`)
    }

    render() {
        let { appointment, brachList, branchId, formField, list, events, filterType, filterDate } = this.state;
        return (
            <div className="row m-0">

                <div className="col-3 pl-0 ">
                    <div className="position-relative scheduler">
                        <div className="schedule-label">
                            Today's Appointments
                        </div>
                        {/* <span className="icon-down-blue clip-icon"></span> */}
                    </div>
                    <div className="appointment appointment-available-staff">
                        {list && list.map((data, index) => (
                            <div key={index}>
                            <div className='col-12 text-left detail'>
                               {data.appointment.map((app, index)=>(
                                   <div className='d-flex flex-wrap' key={index}>
                                       <div className="head-message mb-0 fs-10 fw-400 col-5">{app.time}</div>
                                       <div className="head-message mb-0 fs-12 col-7">{app.cust_name}</div>
                                   </div>))}   
                               </div>
                           <div className="col-12 text-left detail mt-2">                                   
                               <div className="d-flex flex-wrap">
                                   <div className="head-message mb-0 col-5 text-uppercase">{data.emp_name}</div>
                                   <div className="head-message mb-0 col-7">{data.services}</div>
                               </div>
                           </div>
                           <div className="border-bottom-line mx-3 mt-3"></div>
                       </div>
                        ))}
                    </div>
                </div>
                <div className='scheduler-container col-9 pr-0'>

                    <Calander selectedDate={this.props.selectedDate} handleBack={this.props.handleBack} handleFilterChange={this.getAvailability}></Calander>
                    {/* {console.log("render ===", this.state, this.props)} */}

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
    customerList: state.common.customerList,
    multipleCustomerForm: state.appointment.multipleCustomerForm
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getCustomer,
        getCommonApi,
        updateForm,
        commonDeleteApi
    }, dispatch)
}

export const DayScheduler = connect(mapStateToProps, mapDispatchToProps)(SchedulerClass)