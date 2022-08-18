import React, { Component } from 'react';
import { NormalInput, NormalTextarea, NormalButton, NormalSelect, NormalDate } from 'component/common';
export class MakePayment extends Component {
    state = {
        formFields: {
            name: '',
            contact: '',
            address: '',
            searchStaff:''
        }
    }
    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };
    render() {
        let { formFields } = this.state
        let { name, contact, address, searchStaff } = formFields
        return (
            <>
                <div className="make-payment-section mb-4">
                    <div className="row">
                        <div className="col-5">
                            <h4>Enter Customer Details</h4>
                            <div className="pb-4">
                                <label className="text-left text-black common-label-text fs-17 ">
                                    Name
                                </label>
                                <div className="input-group">
                                    <NormalInput
                                        value={name}
                                        name="name"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="pb-4">
                                <label className="text-left text-black common-label-text fs-17 ">
                                    Address
                                </label>
                                <div className="input-group">
                                    <NormalTextarea
                                        value={address}
                                        name="address"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="pb-4">
                                <label className="text-left text-black common-label-text fs-17 ">
                                    Phone Number
                                </label>
                                <div className="input-group">
                                    <NormalInput
                                        value={contact}
                                        name="contact"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="d-flex pb-4">
                                <label className="text-left text-black common-label-text fs-17 ">
                                    D.O.B
                                </label>
                                <p className="pl-5">dd.mm.yyyy</p>
                            </div>
                            <div className="d-flex pb-4">
                                <label className="text-left text-black common-label-text fs-17 ">
                                    Gender
                                </label>
                                <p className="pl-5">male/female</p>
                            </div>
                        </div>
                        <div className="col-5">
                            <h4>Enter Staff Details</h4>
                            <div className="pb-4">
                                <label className="text-left text-black common-label-text fs-17 ">
                                </label>
                                <div className="input-group">
                                    <NormalSelect
                                        placeholder="Search Staff..."
                                        // options={treatmentOption}
                                        value={searchStaff}
                                        name="searchStaff"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <button>Add Another Staff</button>

                        </div>
                    </div>

                </div>
            </>
        );
    }
}