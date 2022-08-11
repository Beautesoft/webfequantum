import React from 'react';
import { DayScheduler } from './CommonScheduler';
import { Scheduler } from './Scheduler';
import './style.scss'

export class ListAppointment extends React.Component {
    state={
        isCalander: false,
        selectedDate: null
    }

    handleBack = () => {
        let { isCalander } = this.state;
        isCalander = false;
        this.setState({
            isCalander
        })
    }

    handleOpen =async (date) => {
        let { isCalander, selectedDate } = this.state;
        isCalander = true;
        selectedDate = date
        await this.setState({
            selectedDate
        })
        await this.setState({
            isCalander
        })
    }

    render() {
        let { isCalander, selectedDate } = this.state;
        return (
            <>
                <div className="">
                    {
                        isCalander!==true ? <Scheduler handleOpen={this.handleOpen}/>:<DayScheduler selectedDate={selectedDate} handleBack={this.handleBack}/>
                    }
                </div>

            </>
        );
    }
}