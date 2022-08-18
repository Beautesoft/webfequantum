import React from "react";
import { Scheduler } from "./Scheduler";
import "./style.scss";
import { getCustomer, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateForm } from "redux/actions/appointment";

export class NewListAppointmentClass extends React.Component {
  state = {
    isCalander: false,
    selectedDate: null,
  };
  componentDidMount = () => {};

  handleOpen = async date => {
    let { isCalander, selectedDate } = this.state;
    isCalander = true;
    selectedDate = date;
    await this.setState({
      selectedDate,
    });
    await this.setState({
      isCalander,
    });
  };

  render() {
    return (
      <div className="col-12">
        <Scheduler handleOpen={this.handleOpen} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomer,
      getCommonApi,
      updateForm,
    },
    dispatch
  );
};

export const NewListAppointment = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewListAppointmentClass);
