import React, { Component } from 'react';
import './style.scss';
import { NormalButton, NormalInput, NormalSelect, InputSearch, NormalModal, TableWrapper, NormalTextarea } from 'component/common';
import { dateFormat } from 'service/helperFunctions';
import _ from 'lodash';
import { history } from 'helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi, updateForm, commonUpdateApi, commonCreateApi } from "redux/actions/common"
import SimpleReactValidator from 'simple-react-validator';
// import { Treatment, Payment, EditCart } from './cart/index';
import service from 'assets/images/make-up-brush.png';
import { Discount } from './discount';
import closeIcon from 'assets/images/close.png';


export class EditCartClass extends Component {
    state = {

        formFields: {
            quantity: 0,
            price: 0,
            sales_staff: [],
            itemstatus: null,
            remark: "",
            focreason: null,
            holdreason: null,
            holditemqty: null,
            ratio: null

        },

        staffList: {
            dataList: []
        },

        cartDetail: {},
        itemStatusList: [],
        holdReasonList: [],
        focReasonList: [],
        page: 1
    }

    componentWillMount = () => {
        console.log(this.props, "fgfsdgetrtrey")
        // this.getCart();
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        let { basicApptDetail } = this.props;
        if (basicApptDetail.custId) {
            let { formFields } = this.state;
            // formFields["custId"] = basicApptDetail.custId;
            // formFields["custName"] = basicApptDetail.custName;
            this.setState({ formFields });
        }

        this.getDropdownData();

        this.getCartData();

        this.getStafflist();

    }

    getCartData = () => {
        this.props.getCommonApi(`itemcart/${this.props.id}`).then(async (key) => {
            let { status, data } = key;
            let { cartDetail } = this.state;
            cartDetail = data;
            this.setState({
                cartDetail
            })
            this.getDataFromStore(data);
        })
    }

    getStafflist = (data) => {
        let { page } = this.state;
        this.props.getCommonApi(`empcartlist/?sales_staff=1&page=${page}`).then(async (key) => {
            let { status, data } = key;
            console.log(data, "sdfgsdfgsdfgdfg sdfgsdfgsdfg")
            let { staffList } = this.state;
            staffList = data;
            this.setState({
                staffList
            })
        })
    }

    handleNext = async () => {
        let { page } = this.state;
        page = page + 1;
        await this.setState({
            page
        })
        if (page > 0) {
            this.getStafflist();
        }
    }

    handleBack = async () => {
        let { page } = this.state;
        page = page - 1;
        await this.setState({
            page
        })
        if (page > 0) {
            this.getStafflist();
        }
    }

    getDataFromStore = (data) => {
        let { formFields } = this.state;
        console.log("assdfasdfasdffgh", formFields, data)
        formFields['quantity'] = data.quantity;
        formFields['price'] = data.price;
        this.getsalsStaff(data.sales_staff);
        formFields['itemstatus'] = data.itemstatus;
        formFields['remark'] = data.remark;
        formFields['focreason'] = data.focreason;
        formFields['discount_price'] = data.discount_price;
        formFields['trans_amt'] = data.trans_amt;
        formFields['holdreason'] = data.holdreason;
        formFields['holditemqty'] = data.holditemqty;
        formFields['deposit'] = data.deposit;
        formFields['ratio'] = data.ratio;
        this.setState({
            formFields
        })
    }

    getsalsStaff = (data) => {
        let { formFields } = this.state;
        formFields['sales_staff'] = [];
        for (let key of data) {
            formFields['sales_staff'].push(key.id);
        }
        this.setState({
            formFields
        })
    }

    getDropdownData = () => {
        let { itemStatusList, holdReasonList, focReasonList } = this.state;
        this.props.getCommonApi(`itemstatus/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    itemStatusList.push({ value: value.id, label: value.status_short_desc })
                }
                this.setState({ itemStatusList })
            }
        })
        this.props.getCommonApi(`holditemsetup/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    holdReasonList.push({ value: value.id, label: value.hold_desc })
                }
                this.setState({ holdReasonList })
            }
        })
        this.props.getCommonApi(`focreason/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    focReasonList.push({ value: value.id, label: value.foc_reason_ldesc })
                }
                this.setState({ focReasonList })
            }
        })

    }


    getDateTime = (data) => {
        let date = new Date(data)
        date = String(date).split(" ")
        let date1 = date[2] + "th " + date[1] + ", " + date[3]
        let time = date[4].split(":")
        let time1 = String(Number(time[0]) > 12 ? (Number(time[0]) - 12) : time[0]) + ":" + time[1] + (Number(time[0]) > 12 ? "PM" : "AM")
        return time1 + ", " + date1
    }


    handleChange = async ({ target: { value, name } }) => {
        let { formFields } = this.state;
        formFields[name] = value;
        await this.setState({
            formFields,
        });
        if (name === "quantity") {
            this.quantityChange();
        } else if (name === "price") {
            this.priceChange();
        }
        // this.props.updateForm('customerDetail', formFields)
        // await this.props.updateForm('appointmentCustomerDetail', formFields)
    };

    quantityChange = () => {
        let { formFields, cartDetail } = this.state;

        let total_disc = cartDetail.discount_amt + cartDetail.additional_discountamt

        formFields['discount_price'] = Number(formFields.price - total_disc).toFixed(2)

        let after_linedisc = (formFields.price - cartDetail.discount_amt) * formFields.quantity

        formFields['trans_amt'] = Number(after_linedisc - cartDetail.additional_discountamt).toFixed(2);

        formFields['deposit'] = Number(after_linedisc - cartDetail.additional_discountamt).toFixed(2);

        this.setState({
            formFields
        })
    }

    priceChange = () => {
        let { formFields, cartDetail } = this.state;

        let total_disc = cartDetail.discount_amt + cartDetail.additional_discountamt

        formFields['discount_price'] = Number(formFields.price - total_disc).toFixed(2)

        let after_linedisc = (formFields.price - cartDetail.discount_amt) * formFields.quantity

        formFields['trans_amt'] = Number(after_linedisc - cartDetail.additional_discountamt).toFixed(2)

        formFields['deposit'] = Number(after_linedisc - cartDetail.additional_discountamt).toFixed(2)

        this.setState({
            formFields
        })
    }

    handleMultipleCustomer = async ({ target: { value, name } }) => {
        let { formFields } = this.state;
        formFields[name] = value;
        await this.setState({
            formFields,
        });
    };

    handleAddstaff = (data) => {
        let { formFields, staffList } = this.state;
        console.log(formFields, "kjhafsdkjasdo", staffList, formFields['sales_staff'])
        formFields['sales_staff'].push(data.id);
        formFields['sales_staff'] = formFields['sales_staff'].reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
        // formFields['ratio'] = Math.round(100 / formFields['sales_staff'].length);
        this.setState({
            formFields
        })
    }

    selectedStaff = (id) => {
        let { staffList } = this.state;
        for (let key of staffList.dataList) {
            if (key.id === id) {
                console.log("kjhafsdkjasdo", key.id, id, key.emp_name, key)
                return key.emp_name;
            }
        }
    }

    removeSalesStaff = (id) => {
        let { formFields } = this.state;
        formFields['sales_staff'].splice(id, 1);
        // formFields['ratio'] = Math.round(100 / formFields['sales_staff'].length);
        this.setState({ formFields });
    }


    handleUpdateCart = () => {
        let { formFields } = this.state;
        if (this.validator.allValid()) {
            this.props.commonUpdateApi(`itemcart/${this.props.id}/?sales_all=0&deposit=${formFields.deposit}`, formFields).then((key) => {
                let { status, data } = key;
                this.props.handleModal();
            })
        } else {
            this.validator.showMessages();
        }
    }

    render() {
        let { cartDetail, staffList = [], formFields } = this.state;
        let { itemStatusList, holdReasonList, focReasonList } = this.state;
        console.log(this.state, "sdfgsdfgsdfgdfg")
        return (
            <div className="row new-cart treatment-done">
                <div className="col-12">
                    <p className="fs-18 font-700 mb-3 title">Edit Cart</p>
                </div>
                <div className="col-4 mb-2">
                    <p className="text-left text-black common-label-text ">
                        {cartDetail.item}
                    </p>
                    <img width="100" src={cartDetail.stock_pic} alt={""} />
                    <p>{cartDetail.item_class}</p>
                    {/* <label className="text-left text-black common-label-text ">
                        Products used
                    </label>
                    <div className="input-group">
                        <NormalInput
                            // placeholder="Enter here"
                            // options={siteList}
                            value={formFields.productUsed}
                            name="productUsed"
                            onChange={this.handleChange}
                            className="customer-name"
                        />
                    </div> removed my monica*/}
                    <label className="text-left text-black common-label-text ">
                        Customer remark
                    </label>
                    <div className="input-group">
                        <NormalInput
                            // placeholder="Enter here"
                            // options={siteList}
                            value={formFields.remark}
                            name="remark"
                            onChange={this.handleChange}
                            className="customer-name"
                        />
                        {/* {this.validator.message('Remark', formFields.remark, 'required')} */}
                    </div>
                </div>
                <div className="col-8 mb-2">
                    <div className="staff-listing d-flex">
                        <div className="forward-button cursor-pointer" onClick={this.handleBack}>
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 0.5L1 5L5 9.5" stroke="#888888" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        {
                            (staffList.dataList && staffList.dataList.length > 0) ? staffList.dataList.map((item, index) => {
                                return (
                                    <>
                                        <div className="mx-1 staff-list cursor-pointer" key={index} onClick={() => this.handleAddstaff(item)}>
                                            <img src={item.emp_pic} alt="" />
                                            <p>{item.emp_name}</p>
                                        </div>
                                    </>)
                            }) : ""
                        }

                        <div className="back-button cursor-pointer" onClick={this.handleNext}>
                            <svg width="5" height="10" viewBox="0 0 5 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.5 9.5L4.5 5L0.5 0.5" stroke="#888888" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="text-left text-black common-label-text ">
                        Sales Staff
                    </label>
                    <div className=" d-flex mb-2">

                        {formFields.sales_staff.length > 0 ? formFields.sales_staff.map((item, index) => {

                            return (
                                <div className="mx-1" key={index}>
                                    <span className="">{this.selectedStaff(item)}</span>
                                    <img onClick={() => this.removeSalesStaff(index)} className="close ml-2 cursor-pointer" src={closeIcon} alt="" />
                                </div>)
                        }) : ""
                        }
                        {this.validator.message('sales_staff', formFields.sales_staff, 'required')}
                    </div>

                    <div className="row">
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                Quantity
                        </label>
                            <div className="input-group mb-2">
                                <NormalInput
                                    // placeholder="Enter here"
                                    // options={siteList}
                                    value={formFields.quantity}
                                    name="quantity"
                                    onChange={this.handleChange}
                                    className="customer-name special"
                                />
                                {this.validator.message('Quantity', formFields.quantity, 'required')}
                            </div>
                        </div>
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                Unit price
                        </label>
                            <div className="input-group mb-2">
                                <NormalInput
                                    // placeholder="Enter here"
                                    // options={siteList}
                                    value={formFields.price}
                                    name="price"
                                    onChange={this.handleChange}
                                    className="customer-name"
                                />

                            </div>
                        </div>
                    </div>

                    {cartDetail.id ? <Discount cartData={cartDetail} discount_price = {formFields.discount_price} id={this.props.id} handleRefresh={this.getCartData}></Discount> : ""}

                    <div className="row">
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                D / Price
                        </label>
                            <div className="input-group mb-2">
                                <NormalInput
                                    // placeholder="Enter here"
                                    // options={siteList}
                                    value={formFields.discount_price}
                                    name="discount_price"
                                    // onChange={this.handleChange}
                                    className="customer-name"
                                    disabled={true}
                                />
                                {/* {this.validator.message('discount price', formFields.disc_price, 'required')} */}
                            </div>
                        </div>
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                Transac Amount
                        </label>
                            <div className="input-group mb-2">
                                <NormalInput
                                    // placeholder="Enter here"
                                    // options={siteList}
                                    value={formFields.trans_amt}
                                    name="trans_amt"
                                    // onChange={this.handleChange}
                                    className="customer-name"
                                    disabled={true}
                                />
                                {/* {this.validator.message('Remark', formFields.new_remark, 'required')} */}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                Deposit
                        </label>
                            <div className="input-group mb-2">
                                <NormalInput
                                    // placeholder="Enter here"
                                    // options={siteList}
                                    value={formFields.deposit}
                                    name="deposit"
                                    onChange={this.handleChange}
                                    className="customer-name"
                                />
                                {this.validator.message('deposit', formFields.deposit, 'required')}
                            </div>
                        </div>
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                Item Status
                        </label>
                            <div className="input-group mb-2">
                                <NormalSelect
                                    // placeholder="Enter here"
                                    options={itemStatusList}
                                    value={formFields.itemstatus}
                                    name="itemstatus"
                                    onChange={this.handleChange}
                                    className="customer-name py-0"
                                />
                                {/* {this.validator.message('item status', formFields.itemstatus, 'required')} */}
                            </div>
                        </div>
                    </div>
                    {
                        cartDetail.item_div === "1" ?
                            <div className="row">
                                <div className="col-4">
                                    <label className="text-left text-black common-label-text ">
                                        Hold reason
                                    </label>
                                    <div className="input-group mb-2">
                                        <NormalSelect
                                            // placeholder="Enter here"
                                            options={holdReasonList}
                                            value={formFields.holdreason}
                                            name="holdreason"
                                            onChange={this.handleChange}
                                            className="customer-name py-0"
                                        />
                                        {/* {this.validator.message('hold reason', formFields.holdreason, 'required')} */}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <label className="text-left text-black common-label-text ">
                                        Hold quantity
                                    </label>
                                    <div className="input-group mb-2">
                                        <NormalInput
                                            // placeholder="Enter here"
                                            // options={siteList}
                                            value={formFields.holditemqty}
                                            name="holditemqty"
                                            onChange={this.handleChange}
                                            className="customer-name special"
                                        />
                                        {/* {this.validator.message('Hold item qty', formFields.holditemqty, 'required')} */}
                                    </div>
                                </div>
                            </div> : ""
                    }

                    <div className="row">
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                FOC reason
                            </label>
                            <div className="input-group">
                                <NormalSelect
                                    // placeholder="Enter here"
                                    options={focReasonList}
                                    value={formFields.focreason}
                                    name="focreason"
                                    onChange={this.handleChange}
                                    className="customer-name py-0"
                                />
                                {/* {this.validator.message('FOC reason', formFields.focreason, 'required')} */}
                            </div>
                        </div>
                        <div className="col-4">
                            <label className="text-left text-black common-label-text ">
                                Ratio
                        </label>
                            <div className="input-group mb-2">
                                <NormalInput
                                    // placeholder="Enter here"
                                    // options={siteList}
                                    value={formFields.ratio}
                                    name="ratio"
                                    onChange={this.handleChange}
                                    className="customer-name"
                                />
                                {/* {this.validator.message('Ratio', formFields.ratio, 'required')} */}
                            </div>
                        </div>
                    </div>


                </div>

                <div className="col-12 pt-4 action-bar">
                    <div className="row">

                        <div className="col-12 text-center">

                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className=" fs-15 confirm"
                                label="Confirm"
                                outline={false}
                                onClick={this.handleUpdateCart}
                            />

                        </div>
                    </div>
                </div>

            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    selected_cstomer: state.common.selected_cstomer,
    basicApptDetail: state.appointment.basicApptDetail,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        // getCustomer,
        getCommonApi,
        updateForm,
        commonUpdateApi,
        commonCreateApi
    }, dispatch)
}

export const EditCart = connect(mapStateToProps, mapDispatchToProps)(EditCartClass)