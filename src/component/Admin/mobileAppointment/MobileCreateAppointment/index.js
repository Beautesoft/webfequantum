import React, { Component } from "react";
// import { Cart } from './Cart'
import "./style.scss";
import { MobileCustomerAppointment } from "./MobileCustomerAppointment";
// import { Treatment } from './treatments';
import Availability from "./Availability";
import { dateFormat } from "service/helperFunctions";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
import { history } from "helpers";

export class MobileCreateAppointmentClass extends Component {
  state = {
    list: [],
    isOpenModal: false,
    PasteAppointmentId: "",
  };

  componentDidMount = () => {};

  render() {
    let { isOpenModal } = this.props;
    return (
      <>
        <NormalModal
          className="col-12 col-md-12 col-sm-12"
          style={{ minWidth: "80%", minHeight: "90%" }}
          modal={isOpenModal}
          handleModal={() => {}}
        >
          <img
            onClick={this.props.handleCloseDialog}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="row">
            <div className=" col-md-12 col-12 appointment-box appointment-col">
              <div className="appointment">
                <div className="appointment-holder">
                  <MobileCustomerAppointment
                    handleCloseDialog={this.props.handleCloseDialog}
                    handleSaveorUpdate={this.props.handleSaveorUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  customerDetail: state.appointment.customerDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
    },
    dispatch
  );
};

export const MobileCreateAppointment = connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileCreateAppointmentClass);
