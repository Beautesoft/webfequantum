import React, { Component } from 'react';
import { NormalInput, NormalTextarea, NormalButton, NormalSelect, NormalDate } from 'component/common';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { getPayment, createPayment } from 'redux/actions/payment';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { history } from 'helpers';
import { getCommonApi } from 'redux/actions/common';
import { dateFormat } from 'service/helperFunctions';

export class MakePaymentClass extends Component {
    state = {
        formFields: {
            name: '',
            contact: '',
            address: '',
            searchStaff: ''
        },
        responseData: {},
        selectType: {
            creditOrDebit: false,
            point: false,
            payOnPremise: false,
            upi: false,
            prepaid: false
        },
        premisesOption: [],
        cardOption: [],
        premiseField: {
            pay_typeid: null,
            pay_amt: "",
            pay_premise: true
        },
        cardField: {
            pay_typeid: null,
            pay_amt: "",
            credit_debit: true,
            pay_rem1: "",
            pay_rem2: "",
            pay_rem3: "",
            pay_rem4: ""
        }
    }

    componentDidMount() {
        this.getPayment();
        this.getPaytableList();
    }

    // get method for payment detail against appointment
    getPayment = () => {
        let { selected_cstomer } = this.props
        if(selected_cstomer){
            this.props.getPayment(`?sitecodeid=${selected_cstomer.branchId}&cart_date=${dateFormat(new Date(), "yyyy-mm-dd")}&cust_noid=${selected_cstomer.cust_noid}&cart_id=${this.props.id}`).then((res) => {
                this.setState({ responseData: res.data })
            })
        } else {
            history.push("/admin/cart");
        }
        
    }

    // get response for payment options dropdown
    getPaytableList = () => {
        this.props.getCommonApi(`paytable/`).then((res) => {
            this.getDataFromResponses(res.data);
        })
    }

    // set data to dropdown fields
    getDataFromResponses = (data) => {
        let { cardOption, premisesOption } = this.state;
        for (let key of data.CARD) {
            cardOption.push({ label: key.pay_description, value: key.id })
        }
        for (let key of data.CASH) {
            premisesOption.push({ label: key.pay_description, value: key.id })
        }
        this.setState({
            cardOption,
            premisesOption
        })
    }

    handleMultiple = ({ target: { value, name } }) => {
        console.log("handleMultiple", value, name);
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };

    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };

    handleSelectOption = (e) => {

        let selectType = Object.assign({}, this.state.selectType);
        console.log(e.target.name, "sdfgdsfgsdfg", e.target.value, e.target)
        selectType[e.target.name] = !selectType[e.target.name];

        this.setState({
            selectType,
        });
    }

    handleChangePremise = ({ target: { value, name } }) => {
        let premiseField = Object.assign({}, this.state.premiseField);

        premiseField[name] = value;

        this.setState({
            premiseField,
        });
    }

    handleChangeCard = ({ target: { value, name } }) => {
        let cardField = Object.assign({}, this.state.cardField);

        cardField[name] = value;

        this.setState({
            cardField,
        });
    }

    // create payment detail
    handleSubmit = () => {
        let { cardField, premiseField, selectType } = this.state;
        let data = []
        if(selectType.creditOrDebit===true){
            data.push({
                pay_typeid: cardField.pay_typeid,
                pay_amt: cardField.pay_amt,
                credit_debit: true,
                pay_rem1: cardField.pay_rem1,
                pay_rem2: cardField.pay_rem2,
                pay_rem3: cardField.pay_rem3,
                pay_rem4: cardField.pay_rem4
            });
        }
        if(selectType.payOnPremise===true){
            data.push({
                pay_typeid: premiseField.pay_typeid,
                pay_amt: premiseField.pay_amt,
                pay_premise: true
            });
        }
        if(selectType.point===true){
            // data.push(premiseField);
        }
        if(selectType.upi===true){
            // data.push(premiseField);
        }
        if(selectType.prepaid===true){
            // data.push(premiseField);
        }
        let { selected_cstomer } = this.props
        this.props.createPayment(`?sitecodeid=${selected_cstomer.branchId}&cart_date=${dateFormat(new Date(), "yyyy-mm-dd")}&cust_noid=${selected_cstomer.cust_noid}&cart_id=${this.props.id}`, data).then((res)=>{
            history.push(`/admin/billing/print/bill/${this.props.billNo}`)
        })
    }

    render() {
        let { formFields, responseData, selectType, premisesOption, cardOption, premiseField, cardField } = this.state;
        let { name, contact, address, searchStaff } = formFields;
        let { creditOrDebit, point, payOnPremise, upi, prepaid } = selectType;

        return (
            <>
                <div className="make-payment-section mb-4">
                    <div className="row pl-3">

                        <div className="col-10 mb-4">
                            <h4>Select Payment Method</h4>
                        </div>
                        <div className="col-5">
                            <div class="radio-item">
                                <input type="radio" id="creditOrDebit" name="creditOrDebit" checked={creditOrDebit} onClick={this.handleSelectOption} />
                                <label for="creditOrDebit">Credit / Debit card</label>
                            </div>
                            {creditOrDebit ? <>
                                <div className="input-group">
                                    Select Card
                                        <NormalSelect
                                            placeholder="Search type..."
                                            options={cardOption}
                                            value={cardField.pay_typeid}
                                            name="pay_typeid"
                                            onChange={this.handleChangeCard}
                                        />
                                    </div>
                                <div className="input-group my-3">
                                    Amount
                                    <NormalInput
                                        value={cardField.pay_amt}
                                        name="pay_amt"
                                        onChange={this.handleChangeCard}
                                    />
                                </div>
                                <div className="input-group my-3">
                                    Card No
                                    <NormalInput
                                        value={cardField.pay_rem1}
                                        name="pay_rem1"
                                        onChange={this.handleChangeCard}
                                    />
                                </div>
                                <div className="input-group my-3">
                                    Name
                                    <NormalInput
                                        value={cardField.pay_rem2}
                                        name="pay_rem2"
                                        onChange={this.handleChangeCard}
                                    />
                                </div>
                                <div className="input-group my-3">
                                    Exp Month
                                    <NormalInput
                                        value={cardField.pay_rem3}
                                        name="pay_rem3"
                                        onChange={this.handleChangeCard}
                                    />
                                </div>
                                <div className="input-group my-3">
                                    Exp Year
                                    <NormalInput
                                        value={cardField.pay_rem4}
                                        name="pay_rem4"
                                        onChange={this.handleChangeCard}
                                    />
                                </div>
                            </> : ""}

                        </div>
                        <div className="col-5">
                            <div class="radio-item">
                                <input type="radio" id="point" name="point" checked={point} onClick={this.handleSelectOption} />
                                <label for="point">Point (Available point:201)</label>
                            </div>
                            {point ? <>
                                <div className="input-group my-3">
                                    <NormalInput
                                        value={address}
                                        name="point"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </> : ""}

                        </div>
                        <div className="col-5">
                            <div class="radio-item">
                                <input type="radio" id="upi" name="upi" checked={upi} onClick={this.handleSelectOption} />
                                <label for="upi">UPI</label>
                            </div>
                            {upi ? <>
                                <div className="input-group my-3">
                                    <NormalInput
                                        value={address}
                                        name="upi"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </> : ""}

                        </div>
                        <div className="col-5">
                            <div class="radio-item">
                                <input type="radio" id="prepaid" name="prepaid" checked={prepaid} onClick={this.handleSelectOption} />
                                <label for="prepaid">Prepaid</label>
                            </div>
                            {prepaid ? <>
                                <div className="input-group my-3">
                                    <NormalInput
                                        value={address}
                                        name="prepaid"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </> : ""}

                        </div>
                        <div className="col-5">
                            <div class="radio-item">
                                <input type="radio" id="payOnPremise" name="payOnPremise" checked={payOnPremise} onClick={this.handleSelectOption} />
                                <label for="payOnPremise">Pay on premise</label>
                            </div>
                            {payOnPremise ? <>
                                <div className="input-group my-3">
                                    <div className="input-group">
                                        Select Option
                                        <NormalSelect
                                            placeholder="Search type..."
                                            options={premisesOption}
                                            value={premiseField.pay_typeid}
                                            name="pay_typeid"
                                            onChange={this.handleChangePremise}
                                        />
                                    </div>
                                    <div className="input-group my-3">
                                        Amount
                                        <NormalInput
                                            value={premiseField.pay_amt}
                                            name="pay_amt"
                                            onChange={this.handleChangePremise}
                                        />
                                    </div>
                                </div></> : ""}

                        </div>
                        <div className="col-5">
                        </div>
                        <div className="col-10 mb-3">
                        </div>

                        {/* <div className="col-5">
                            <h4 className="mb-4">Add Discount/Vouchers</h4>
                            <div className="input-group">
                                <NormalInput
                                    value={address}
                                    name="address"
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div> */}

                        {/* <div className="col-5">
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

                        </div> */}
                    </div>

                    <div className="make-payment text-center">
                        <NormalButton
                            mainbg={true}
                            className="col-12 fs-15 "
                            label="Make payment "
                            onClick={() => this.handleSubmit()}
                        />
                    </div>
                </div>
            </>
        );
    }
}



const mapStateToProps = (state) => ({
    appointmentDetail: state.appointment.appointmentDetail,
    selected_cstomer: state.common.selected_cstomer,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getPayment,
        getCommonApi,
        createPayment
    }, dispatch)
}

export const MakePayment = connect(mapStateToProps, mapDispatchToProps)(MakePaymentClass)