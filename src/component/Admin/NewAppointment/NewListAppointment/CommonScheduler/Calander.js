import React, { Component } from 'react';
import { SchedulerModal } from 'component/common/Plugins';
// import BigSchedulerModal from 'component/common/Plugins/BigScheduler';
import { NormalDateTime } from 'component/common';
import { getCustomer, getCommonApi, commonDeleteApi } from 'redux/actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
// import timeOption from 'data/timeOption.json'
import { dateFormat } from 'service/helperFunctions';
import { history } from 'helpers';
import './style.scss';
import SimpleReactValidator from 'simple-react-validator';
import { CreateAppointment, updateForm } from 'redux/actions/appointment';
import { Scheduler } from './Scheduler';

const data = [
    { start_date: '2020-06-09 4:00', end_date: '2020-06-09 6:00', text: 'Event 1', id: 1 },
    { start_date: '2020-06-11 8:00', end_date: '2020-06-11 10:00', text: 'Event 2', id: 2 },
    { start_date: '2020-06-12 12:00', end_date: '2018-06-12 14:00', text: 'dblclick me!', id: 3 }
];

export class SchedulerClass extends Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
      }
    state = {

        events: [],

        formField: {
            search: "",
            menuOption: "",
            menuId: "",
            appointmentDate: new Date()
        },
        list: [],
        filterDate: new Date(),
        filterType: 'day',
        selectedId: "",
        menuOption: [
            { lable: "Name", value: "name" }
        ],
        dayWeekMonth: "day"
    }

    componentWillMount = async() => {
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        let { brachList, appointment, formField, filterDate } = this.state;
        this.props.getCommonApi(`treatment/Outlet/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    // brachList.push({ value: value.id, label: value.itemsite_desc })
                }
                this.setState({ brachList })
                // console.log(brachList, "jhksdfkjsdhfks")
            }
        })
        this.getAvailability()
        if(this.props.selectedDate){
            await this.setState({
                filterDate: this.props.selectedDate
            })
        }
        this.getAppointment();
    }

    getAvailability = () => {
        let { filterDate } = this.state;
        this.setState({ list: [] })
        this.props.getCommonApi(`staffsavailable/?Appt_date=${dateFormat(filterDate, "yyyy-mm-dd")}`).then((key) => {
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
        this.props.getCommonApi(`appointmentcalender/?date=${dateFormat(filterDate, "yyyy-mm-dd")}&check=${filterType}`).then(async (key) => {
            let { status, data } = key;
            events = [];
            if (status === 200) {
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

    handleDatePick = async (name, value) => {
        let { filterDate } = this.state;
        filterDate = value;
        await this.setState({
            filterDate,
        });
        this.props.handleFilterChange(value)
        this.child.handleAppointment(value);
        this.getAppointment();
    };

    openDetail = (id) => {
        history.push(`/admin/appointment/${id}/detail`)
    }

    handleChangeView = (data) => {
        let { dayWeekMonth } = this.state;
        dayWeekMonth = data;
        this.setState({
            dayWeekMonth
        })
    }

    render() {
        let { appointment, brachList, branchId, formField, list, events, filterType, menuOption, dayWeekMonth, filterDate } = this.state;
        let { search, menuId, appointmentDate } = formField;
        return (
            <div className="row define-height px-3">
                <div className="col-4 day-week-month filter-date d-flex pl-2 ">
                <div className="input-group py-3">
                        <NormalDateTime
                            onChange={this.handleDatePick}
                            inputcol="p-0 inTime"
                            value={filterDate ? (new Date(filterDate)): new Date()}
                            name="cust_dob"
                            className="dob-pick"
                            showYearDropdown={true}
                            dateFormat="MM/dd/yyyy" />
                    </div>
                </div>
                <div className="col-8 day-week-month d-flex pl-2 ">
                    <div onClick={this.props.handleBack} className={`menu my-3 ${dayWeekMonth === 'day' ? "active" : ""}`}>Back</div>
                    {/* <div onClick={() => this.handleChangeView('week')} className={`menu ${dayWeekMonth === 'week' ? "active" : ""}`}>Week</div>
                    <div onClick={() => this.handleChangeView('month')} className={`menu ${dayWeekMonth === 'month' ? "active" : ""}`}>Month</div> */}
                </div>
                    <Scheduler data={events} filterDate={filterDate} onRef={ref => (this.child = ref)}></Scheduler>
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

export const Calander = connect(mapStateToProps, mapDispatchToProps)(SchedulerClass)