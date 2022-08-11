import React, { Component, useRef } from "react";
import { AppointmentForm } from "./AppointmentForm";
import { NewSelectTreatment } from "./NewSelectTreatment";

export class CustomerAppointment extends Component {
  state = {
    customerId: 0,
  };

  componentWillMount() {}

  selectedCustomer = data => {
    this.setState({
      customerId: data,
    });
  };

  render() {
    return (
      <div className="appointment-holder pt-4 px-3">
        <div className="row">
          {/* <AppointmentForm
            onRef={ref => (this.child = ref)}
            selectedCustomer={this.selectedCustomer}
            PasteAppointmentId={this.props.PasteAppointmentId}
          ></AppointmentForm> */}
        </div>
        <div className="row select-appointment">
          {/* <p className="header h5">Select Treatments</p> */}
          <NewSelectTreatment
            selectedCustomer={this.selectedCustomer}
            customerId={this.state.customerId}
            handleCloseDialog={this.props.handleCloseDialog}
            handleSaveorUpdate={this.props.handleSaveorUpdate}
          ></NewSelectTreatment>
        </div>
      </div>
    );
  }
}
