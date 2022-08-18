import React, { Component, useRef } from 'react'
import { AppointmentForm } from './AppointmentForm';
import { SelectTreatment } from './selectTreatment';

export class CustomerAppointment extends Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
      }
    state = {
        customerId: 0
    }

    componentWillMount() {}

    showErrorMessage = () => {
        this.child.onFocus();
    }

    selectedCustomer = (data) =>
    {   
        this.setState({
            customerId: data
        })
    }

    render() {
       
        return (
            <div className="appointment-holder pt-4 px-3">

                <div className="">
                    <p className="header fs-18 f-600 mb-3">Appointments</p>
                    <AppointmentForm onRef={ref => (this.child = ref)} selectedCustomer={this.selectedCustomer} ></AppointmentForm>
                </div>
                <div className="select-appointment">
                    <p className="header fs-18 f-600">Select Treatments</p>
                    <SelectTreatment showErrorMessage={this.showErrorMessage} customerId = {this.state.customerId}></SelectTreatment>
                </div>

            </div>


        );
    }
}
