import React, { Component } from 'react';
import "./style.scss";
import { Link } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import { NormalInput, NormalSelect, NormalButton, NormalDate } from 'component/common';
import { displayImg } from 'service/helperFunctions';
import { DragFileUpload } from '../../../common';
import { CreateCustomer, getCustomer, updateCustomer } from 'redux/actions/customer'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { AddCustomerForm } from './addCustomer';
import { dateFormat } from 'service/helperFunctions';
import { getLoginSaloon } from 'redux/actions/auth';
import { updateForm } from 'redux/actions/common';

export class AddCustomerClass extends Component {
    state = {
        formFields: {
            cust_name: '',
            cust_address: '',
            cust_dob: "",
            cust_phone2: '',
            cust_email: '',
            Cust_sexesid: '',
            Site_Codeid: '',
            custallowsendsms: false,
            cust_maillist: false
        },
        sexOption: [
            { value: 1, label: "Male" },
            { value: 2, label: "Female" }
        ],
        salonList: []
    };

    componentWillMount() {
        if (this.props.match.params.id) {
            this.getCustomer();
        }
        let { salonList } = this.state;
        this.props.getLoginSaloon().then((res) => {
            for (let key of res.data) {
                salonList.push({ value: key.id, label: key.itemsite_desc })
            }
            this.setState({ salonList })
        })
    }

    getCustomer = () => {
        this.props.getCustomer(this.props.match.params.id).then((res) => {
            this.getDataFromStore();
        })
    }

    getDataFromStore = () => {
        let { formFields } = this.state;
        let { customerDetail } = this.props
        formFields['cust_name'] = customerDetail.cust_name;
        formFields['cust_address'] = customerDetail.cust_address;
        formFields['cust_dob'] = new Date(customerDetail.cust_dob);
        formFields['cust_phone2'] = customerDetail.cust_phone2;
        formFields['cust_email'] = customerDetail.cust_email;
        formFields['Cust_sexesid'] = customerDetail.Cust_sexesid;
        formFields['Site_Codeid'] = customerDetail.Site_Codeid;
        formFields['custallowsendsms'] = customerDetail.custallowsendsms;
        formFields['cust_maillist'] = customerDetail.cust_maillist;
        this.setState({ formFields })
        console.log(formFields, customerDetail, "sfsdfhsdfsdfg")
    }

    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;


        this.setState({
            formFields,
        });
    };

    handleChangeBox = (event) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[event.target.name] = event.target.checked;


        this.setState({
            formFields,
        });
    };


    handleInput = ({ target: { name, value } }) => {

        let formFields = Object.assign({}, this.state.formFields)
        formFields[name] = (value === true ? 1 : value);
        this.setState({
            formFields
        })

    }

    handleSubmit = async (data) => {
        let { formFields } = this.state;
        let type = data;
        console.log(type, "====", data, "sdfasdfasdf")
       
        let date = new Date(formFields.cust_dob)
        let d = date.getDate();
        let day = (d < 10 ? ("0" + d) : (d));
        let a = date.getMonth() + 1;
        let month = (a < 10 ? ("0" + a) : (a));
        let year = date.getFullYear();
        formFields["cust_dob"] =`${year}-${month}-${day}`;

        if (this.props.match.params.id) {
            await this.props.updateCustomer(`${this.props.match.params.id}/`, formFields).then((data) => {
                if (data.status === 200) {
                    this.resetData();
                    if (this.props.match.params.id) {
                        this.props.history.push(`/admin/customer/${this.props.match.params.id}/details`)
                    }
                }
               
            })
            
        } else {
            await this.props.CreateCustomer(formFields).then(async (data) => {
                if (data.status === 201) {
                    this.resetData();
                    if (this.props.match.params.id) {
                        this.props.history.push(`/admin/cart/${this.props.match.params.id}/details`)
                    } else {
                        let formFields = {};
                        formFields["custId"] = data.data.id;
                        formFields["custName"] = data.data.cust_name;
                        await this.props.updateForm('basicApptDetail', formFields)
                        if (type === "catalog") {
                            this.props.history.push(`/admin/cart`);
                        } else if (data) {
                            this.props.history.push(`/admin/customer`);
                        } else {
                            this.props.history.push(`/admin/cart`);
                        }
                    }
                }
            })
            
        }
    };

    handleCancel = () => {
        if (this.props.match.params.id) {
            this.props.history.push(`/admin/customer/${this.props.match.params.id}/details`)
        } else {
            this.props.history.push(`/admin/customer`);
        }
    }

    handleDatePick = async (name, value) => {
        console.log(name, value, "sdfgdfhfshg", dateFormat(new Date()))
        // dateFormat(new Date())
        let { formFields } = this.state;
        formFields[name] = value;
        // formFields[name] = value;
        await this.setState({
            formFields,
        });
    };

    resetData = () => {
        let { formFields } = this.state;
        formFields['cust_name'] = "";
        formFields['cust_address'] = "";
        formFields['cust_dob'] = "";
        formFields['cust_phone2'] = "";
        formFields['cust_email'] = "";
        formFields['Cust_sexesid'] = "";
        formFields['Site_Codeid'] = "";
        this.setState(formFields)
    }

    render() {
        let { formFields, sexOption, salonList } = this.state;
        let { cust_name } = formFields;
        return (
            <div className="create-customer-section container">
                {/* <p className="list-heading pb-4"> {id ? "Edit" : "Add"} Customer</p> */}
                <div className="create-customer">
                    <div className="head-label-nav">
                        <p className="category">Customer </p>
                        <i className="icon-right mx-md-3"></i>
                        <p className="sub-category">{this.props.match.params.id ? "Edit" : "Add"} New Customer</p>
                    </div>
                    <div className="customer-detail">
                        <AddCustomerForm formFields={formFields} salonList={salonList} handleDatePick={this.handleDatePick} sexOption={sexOption} handleChange={this.handleChange} handleSubmit={this.handleSubmit} handleCancel={this.handleCancel} handleChangeBox={this.handleChangeBox}></AddCustomerForm>
                    </div>

                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    customerDetail: state.customer.customerDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        CreateCustomer,
        getCustomer,
        updateCustomer,
        getLoginSaloon,
        updateForm
    }, dispatch)
}

export const AddCustomer = connect(mapStateToProps, mapDispatchToProps)(AddCustomerClass)