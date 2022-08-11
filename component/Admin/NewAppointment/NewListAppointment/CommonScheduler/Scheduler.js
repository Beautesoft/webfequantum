import React, { Component } from 'react'
import "./style.scss"
import { Sidebar } from './Sidebar';
import { Events } from './Event';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import { dateFormat } from 'service/helperFunctions';

export class SchedulerClass extends Component {
    state = {
        events: [],
        date: new Date()
    }

    componentDidMount() {
        this.handleAppointment();
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(null);
      }

    handleAppointment = (date) => {
        // let { date } = this.state;
        let { filterDate } = this.props;
        let { events } = this.state;
        events = [];
        this.props.getCommonApi(`empappointmentview/?date=${dateFormat(date?date:filterDate, "yyyy-mm-dd")}`).then((res) => {
            events = res.data;
            this.setState({
                events
            })
        })
    }


    render() {
        let { events } = this.state;
        return (
            <div className="Scheduler d-flex">
                <Sidebar></Sidebar>
                {console.log("fdgsdfsdfgdfgsdfg oter", events)}
                {
                    events.map((item, index) => {
                        console.log("fdgsdfsdfgdfgsdfg oter", events, item, index)
                        return (
                            <Events datass={item}></Events>
                        )
                    })
                }
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getCommonApi
    }, dispatch)
}

export const Scheduler = connect(null, mapDispatchToProps)(SchedulerClass)