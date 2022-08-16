import React, { Component } from 'react'
// import { Cart } from './Cart'
import './style.scss'
import { CustomerAppointment } from './customerAppoitment';
// import { Treatment } from './treatments';
import Availability from './Availability';
import { dateFormat } from 'service/helperFunctions';
import { getCommonApi } from 'redux/actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

export class CreateAppointmentClass extends Component {
    state = {
        list: []
    }

    componentDidMount = () => {
        this.props.getCommonApi(`staffsavailable/?Appt_date=${dateFormat(new Date(), "yyyy-mm-dd")}`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                // for (let value of data) {
                //     staffList.push({ value: value.id, label: value.emp_name })
                // }
                this.setState({ list:data })
            }
        })
    }

    render() {
        let { list } = this.state;
        return (
            <>
                <div className="create-appointment">
                    <div className="row">
                        <div className="col-md-3 pr-0 position-relative">
                            <div className="availability">
                                <p className="heading">Staff Availability</p>
                                {list.map((data, index) => (
                                    <>
                                        <Availability availability={data}></Availability>
                                    </>
                                ))}

                            </div>
                        </div>
                        <div className=" col-md-9 appointment-box appointment-col">
                            <div className="appointment">
                               
                                <div className="appointment-holder">
                                    <CustomerAppointment />
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </>
        );
    }
}


const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getCommonApi
    }, dispatch)
}

export const CreateAppointment = connect(mapStateToProps, mapDispatchToProps)(CreateAppointmentClass)