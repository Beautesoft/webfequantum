import React, { Component } from 'react';
import './style.scss';
import closeIcon from 'assets/images/close.png';
import { NormalButton, NormalInput, NormalModal, NormalSelect, NormalMultiSelect } from 'component/common';
import { updateForm, getAppointmentCartList, UpdateCart, DeleteCart, HoldCart } from 'redux/actions/appointment';
import { commonUpdateApi, commonCreateApi, getCommonApi } from 'redux/actions/common'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { history } from 'helpers';

export class CartClass extends Component {
    state = {
        isOpen: false,
        currentIndex: -1,
        formField: {
            subtotal: 0,
            tax: 0,
            discount: 0,
            additional_discount: 0,
            additional_discountamt: 0,
            voucher: "",
            total: 0
        },
        discountField: {
            discount: 0,
            discount_amt: 0,
            sales_staff: "",
            service_staff: "",
            itemstatus: ""
        },
        deposit: 0,
        isOpenModal: false,
        editTreatmentId: null,
        modalOpenType: "view",
        isConfirmOpen: false,
        salesOption: [],
        servicesOption: [],
        itemOption: [],
        allSaleStaff: false,
        allServiceStaff: false,
        allItemCart: {},
        isOpenUpdateDisount: false,
        addDiscountField: {
            additional_discount: 0,
            additional_discountamt: 0
        }
    }

    componentWillMount() {
        if (this.props.id) {
            this.getCart();
            this.getListDate();
        }
    }

    getListDate = () => {
        let { salesOption, servicesOption, itemOption } = this.state;
        this.props.getCommonApi(`empcartlist/?Appointment_id=${this.props.id}&sales_staff=1`).then((res) => {
            console.log(res, "fdsgsdfgsdf")
            this.setState({ salesOption: [] })
            for (let key of res.data) {
                salesOption.push({ value: key.id, label: key.emp_name })
            }
            this.setState({ salesOption });
        })
        this.props.getCommonApi(`empcartlist/?Appointment_id=${this.props.id}&sales_staff=0`).then((res) => {
            console.log(res, "fdsgsdfgsdf")
            this.setState({ servicesOption: [] })
            for (let key of res.data) {
                servicesOption.push({ value: key.id, label: key.emp_name })
            }
            this.setState({ servicesOption });
        })
        this.props.getCommonApi(`itemstatus/`).then((res) => {
            console.log(res, "fdsgsdfgsdf")
            this.setState({ itemOption: [] })
            for (let key of res.data) {
                itemOption.push({ value: key.id, label: key.status_short_desc })
            }
            this.setState({ itemOption });
        })
    }

    handleOutsideClick = (e) => {
        if (this.node != null) {
            if (this.node.contains(e.target)) {
                return;
            }
        }
        this.handleClick();
    }

    getCart = () => {
        let { formField } = this.state;
        this.props.getAppointmentCartList(`?Appointment_id=${this.props.id}`).then((res) => {
            console.log("namekkuhkjn", res, this.sum(res.data, 'price'))
            formField['subtotal'] = this.sum(res.data, 'total');
            formField['tax'] = this.sum(res.data, 'tax');
            formField['total'] = this.sum(res.data, 'total_price');
            // formField['total'] = this.sum(res.data, 'total') - ((this.sum(res.data, 'price') / 100) * this.sum(res.data, 'discount')) + this.sum(res.data, 'tax');
            // formField['discount'] = (this.sum(res.data, 'price') / 100) * this.sum(res.data, 'discount');
            // formField['discount'] = (this.sum(res.data, 'price') / 100) * this.sum(res.data, 'discount');
            this.setState({ formField, allItemCart: res });

        })
    }

    sum = (array, key) => {
        return array.reduce(function (prev, cur) {
            return Number(prev) + Number(cur[key]);
        }, 0)
    };

    handleChange = ({ target: { value, name } }) => {
        let formField = Object.assign({}, this.state.formFields);

        formField[name] = value;

        this.setState({
            formField,
        });
    };

    handlDiscountChange = ({ target: { value, name } }) => {
        let discountField = Object.assign({}, this.state.discountField);
        let { deposit, selectedTreatment } = this.state;
        console.log(name, value, "fdfdgjfhjfgjkf");
        if (name === "deposit") {
            deposit = value;
        } else {
            if (name === "discount") {
                discountField[name] = Number(value);
                discountField["discount_amt"] = (value / 100) * (selectedTreatment.price * selectedTreatment.quantity);
            } else if (name === "discount_amt") {
                discountField["discount_amt"] = Number(value);
                discountField["discount"] = 0;
            } else {
                discountField[name] = Number(value);
            }
        }

        this.setState({
            discountField,
            deposit
        });
    }

    handleOpen = async () => {
        let { isOpen } = this.state
        await this.setState({
            isOpen: !isOpen,
        })
        if (this.props.id) {
            await this.getCart();
        }
    }

    handleClick = (key) => {
        if (!this.state.active) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            active: !prevState.active,
            currentIndex: key
        }));
    }

    getDateTime = (data) => {
        let date = new Date(data)
        date = String(date).split(" ")
        let date1 = date[2] + "th " + date[1] + ", " + date[3]
        let time = date[4].split(":")
        let time1 = String(Number(time[0]) > 12 ? (Number(time[0]) - 12) : time[0]) + ":" + time[1] + (Number(time[0]) > 12 ? "PM" : "AM")
        return time1 + ", " + date1
    }

    handleEditTreatment = async (index, type) => {
        let { editTreatmentId, isOpenModal, selectedTreatment, discountField, modalOpenType } = this.state;
        selectedTreatment = this.props.appointmentCartList[index];
        discountField['discount'] = selectedTreatment.discount;
        discountField['discount_amt'] = selectedTreatment.discount_amt;
        editTreatmentId = selectedTreatment.id;
        isOpenModal = true;
        modalOpenType = type;
        await this.setState({ editTreatmentId, selectedTreatment, discountField, modalOpenType });
        this.setState({ isOpenModal });
    }

    handleDeleteTreatment = async (index, type) => {
        let { editTreatmentId, isConfirmOpen, selectedTreatment } = this.state;
        selectedTreatment = this.props.appointmentCartList[index];
        editTreatmentId = selectedTreatment.id;
        isConfirmOpen = true;
        await this.setState({ editTreatmentId });
        this.setState({ isConfirmOpen });
        if (this.props.id) {
            await this.getCart();
        }
    }

    closeDialog = () => {
        let { editTreatmentId, isOpenModal, selectedTreatment, isConfirmOpen, isOpenUpdateDisount } = this.state;
        isOpenModal = false;
        isConfirmOpen = false
        selectedTreatment = [];
        editTreatmentId = null;
        isOpenUpdateDisount = false;
        this.setState({ editTreatmentId, selectedTreatment, isOpenModal, isConfirmOpen, isOpenUpdateDisount });
        if (this.props.id) {
            this.getCart();
        }
    }

    handleUpdateTreatment = () => {
        let { allSaleStaff, allServiceStaff, deposit, discountField } = this.state;
        let data = {
            discount: discountField.discount,
            discount_amt: discountField.discount_amt,
            sales_staff: discountField.sales_staff,
            service_staff: discountField.service_staff,
            itemstatus: discountField.itemstatus
        }
        if (deposit > 0) {
            data['deposit'] = deposit
        }
        this.props.UpdateCart(`${this.state.editTreatmentId}/?sales_all=${allSaleStaff ? "1" : "0"}&service_all=${allServiceStaff ? "1" : "0"}${deposit ? ('&deposit=' + deposit) : ""}`, data).then((res) => {
            if (res.status === 200) {
                this.getCart()
            }
            this.closeDialog();
        })
    }

    handleConfirmDelete = () => {
        this.props.DeleteCart(`${this.state.editTreatmentId}/`).then((res) => {

            this.getCart()
            this.closeDialog();
        })
    }

    handleHoldTreatment = (id) => {
        this.props.HoldCart(`${id}/`).then((res) => {

            this.getCart()
        })
    }

    handleSubmit = (id) => {
        // let { formField, editTreatmentId } = this.state;
        // let data = {
        //     additional_discount: formField.additional_discount,
        //     additional_discountamt: formField.additional_discountamt
        // }
        // this.props.commonCreateApi(`itemcart/SetAdditionalDisc/?Appointment_id=${this.props.id}`, data).then((res) => {
        history.push(`/admin/payment/appointment/${this.props.id}`)
        // })
    }

    handleMultiSelect = (data, name) => {
        let { discountField } = this.state;
        console.log(discountField, "oyokkjk", data, name)
        let list = []
        for (let key of data) {
            list.push(key.value);
        }
        discountField[name] = list;
        this.setState({ discountField });
    }

    handleSelect = (data, name) => {
        let { discountField } = this.state;
        console.log(discountField, "oyokkjk", data, name)
        discountField[name] = data.value;
        this.setState({ discountField });
    }

    discountChange = ({ target: { value, name } }) => {
        let addDiscountField = Object.assign({}, this.state.addDiscountField);
        let { deposit, allItemCart, subtotal } = this.state;
        console.log(name, value, "fdfdgjfhjfgjkf", allItemCart, subtotal);

        if (name === "additional_discount") {
            addDiscountField["additional_discount"] = Number(value);
            addDiscountField["additional_discountamt"] = (value / 100) * Number(allItemCart.subtotal);
        } else if (name === "additional_discountamt") {
            addDiscountField["additional_discountamt"] = Number(value);
            addDiscountField["additional_discount"] = 0;
        }


        this.setState({
            addDiscountField
        });
    }

    updateAddDiscount = () => {
        let { addDiscountField, editTreatmentId } = this.state;
        let data = {
            additional_discount: addDiscountField.additional_discount,
            additional_discountamt: addDiscountField.additional_discountamt
        }
        this.props.commonCreateApi(`itemcart/SetAdditionalDisc/?Appointment_id=${this.props.id}`, data).then((res) => {
            let { status } = res;
            if (status === 200) {
                this.closeDialog();
            }
        })
    }

    render() {
        let { isOpen, currentIndex, formField, isOpenModal, isOpenUpdateDisount, addDiscountField, editTreatmentId, deposit, selectedTreatment, discountField, modalOpenType, isConfirmOpen, salesOption, servicesOption, itemOption, allItemCart } = this.state;
        let { appointmentCartList } = this.props;
        let { subtotal, discount, voucher, tax, total, additional_discount, additional_discountamt } = formField
        console.log(appointmentCartList, "kjdkfjsdjfhsd")
        return (
            <>
                <div className={`cart-holder ${isOpen ? 'open' : ''}`}>
                    <div className="cart-head">
                        <i className="icon-left-arrow" onClick={() => this.handleOpen()}></i>
                        <p>Cart</p>
                    </div>
                    <div className={`${!isOpen ? 'item-list' : ''}`}>
                        {isOpen ? (
                            <div className="row item-list-detail">
                                <div className="col-9 list">
                                    <div className="row my-2">
                                        <div className="col-3 text-center">Treatment</div>
                                        <div className="col-2 text-center">Price</div>
                                        <div className="col-2 text-center">Discount</div>
                                        {/* <div className="col-1 text-center">Deposit</div> */}
                                        <div className="col-2 text-center">Sales Staff</div>
                                        <div className="col-2 text-center">Service Staff</div>
                                        {/* <div className="col-2 text-center">Status</div> */}
                                        <div className="col-1 text-center"></div>
                                    </div>
                                    {appointmentCartList.length > 0 ? appointmentCartList.map((item, index) => {

                                        let {
                                            id,
                                            PIC,
                                            Site_Code,
                                            sitecode_name,
                                            total,
                                            item_class,
                                            quantity,
                                            deposit,
                                            appt_date,
                                            itemdesc,
                                            price,
                                            sales_staff,
                                            service_staff
                                        } = item
                                        return (
                                            <div className="row detail m-2" key={index}>
                                                <div className="col-3 treatment">
                                                    <p className="title mb-2 f-600">{itemdesc}{' '}({quantity})</p>
                                                    <p className="sub-title mb-2 f-600">{item_class}</p>
                                                    <p className="time">{appt_date ? this.getDateTime(appt_date) : ""},  {sitecode_name}</p>
                                                </div>
                                                <div className="col-2 fs-18 p-4 title text-center f-600">$ {price}</div>
                                                <div className="col-2 fs-18 p-4 title text-center f-600">{item.discount}</div>
                                                {/* <div className="col-1 title">{deposit}</div> */}
                                                <div className="col-2 fs-18 p-4 title text-center f-600">{sales_staff}</div>
                                                <div className="col-2 fs-18 p-4 title text-center f-600">{service_staff}</div>
                                                {/* <div className="col-2 title">{status}</div> */}
                                                <div className="col-1 p-4 action text-center">
                                                    <div className="position-relative" ref={node => { this.node = node; }}
                                                        onClick={() => this.handleClick(index)}>
                                                        {currentIndex === index ?
                                                            <>
                                                                <div className="d-flex align-items-center justify-content-center horizontal-more-active"><i className="icon-more"></i></div>
                                                                <div className="option card">
                                                                    {/* <div className="d-flex align-items-center fs-16 pt-3" onClick={() => this.handleEditTreatment(index, "view")}><span className="icon-eye-grey px-3"></span> View </div> */}
                                                                    <div className="d-flex align-items-center fs-16 pt-3" onClick={() => this.handleHoldTreatment(id)}><span className="icon-eye-grey px-3"></span> Hold </div>
                                                                    <div className="d-flex align-items-center fs-16" onClick={() => this.handleEditTreatment(index, "edit")}><span className="icon-edit px-3"></span> Edit </div>
                                                                    <div className="d-flex align-items-center fs-16 pb-3" onClick={() => this.handleDeleteTreatment(index, "edit")}><span className="icon-delete px-3"></span> Delete </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <div className="d-flex align-items-center justify-content-center horizontal-more"><i className="icon-more"></i></div>
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    }) : ""}
                                </div>
                                <div className="col-3 billable-amount">
                                    <div className="row">
                                        <div className="col-6">Subtotal</div>
                                        <div className="col-6">$ {allItemCart.subtotal}</div>
                                        <div className="col-6">Discount</div>
                                        <div className="col-6">$ {allItemCart.discount}</div>

                                        <div className="col-6">Transaction Amt</div>

                                        <div className="col-6">$ {allItemCart.trans_amt}</div>
                                        <div className="col-6">Deposit</div>

                                        <div className="col-6">$ {allItemCart.deposit_amt}</div>
                                        <div className="col-12">
                                            <div className="confirm-booking">
                                                <NormalButton
                                                    buttonClass={"treatment"}
                                                    mainbg={true}
                                                    className="col-12 fs-15 "
                                                    label="Update Ad discount"
                                                    onClick={() => this.setState({ isOpenUpdateDisount: true })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right-total text-center">
                                        <p className="label">Billable Amount</p>
                                        <p className="amount text-orenge">$ {allItemCart.billable_amount}</p>
                                    </div>
                                </div>
                            </div>
                        ) : <p>No Items available</p>}

                    </div>
                    <div className="total">
                        <p>Total</p>
                        <p>$ {allItemCart.billable_amount}</p>
                    </div>
                    <div className="confirm-booking">
                        <NormalButton
                            buttonClass={"treatment"}
                            mainbg={true}
                            className="col-12 fs-15 "
                            label="Checkout to payment"
                            onClick={this.handleSubmit}
                        />
                    </div>
                </div>





                <NormalModal className={"multiple-appointment"} modal={isOpenModal} handleModal={() => { }}>
                    <img onClick={this.closeDialog} className="close" src={closeIcon} alt="" />
                    <div className="row m-5">
                        <div className="col-8 fs-18 f-600 py-2">
                            Edit Treatment
                        </div>
                        <div className="col-4 ">
                            <div className="input-group">

                            </div>
                        </div>
                        <div className="col-6 my-3"> Treatment</div>
                        <div className="col-6 my-3"> {selectedTreatment ? selectedTreatment.itemdesc : ""}{' '}({selectedTreatment ? selectedTreatment.item_class : ""})</div>
                        <div className="col-6">
                            Price
                        </div>
                        <div className="col-6">
                            $ {selectedTreatment ? selectedTreatment.price : ""}
                        </div>

                        <div className="col-6 my-3"> Branch</div>
                        <div className="col-6 my-3"> {selectedTreatment ? selectedTreatment.Site_Code : ""}</div>
                        <div className="col-6 my-2">
                            Discount in %
                        </div>
                        <div className="col-6 my-2">
                            {modalOpenType === "edit" ?
                                <div className="input-group">
                                    <NormalInput
                                        // placeholder="Enter here"
                                        value={discountField.discount}
                                        name="discount"
                                        onChange={this.handlDiscountChange}
                                        className="customer-name w-100"
                                    />
                                </div> : discountField.discount
                            }
                        </div>
                        <div className="col-6 my-2">
                            Discount in Amount
                        </div>
                        <div className="col-6 my-2">
                            {modalOpenType === "edit" ?
                                <div className="input-group">
                                    <NormalInput
                                        // placeholder="Enter here"
                                        value={discountField.discount_amt}
                                        name="discount_amt"
                                        onChange={this.handlDiscountChange}
                                        className="customer-name w-100"
                                    />
                                </div> : discountField.discount_amt
                            }
                        </div>
                        <div className="col-6 my-2">
                            Deposit
                        </div>
                        <div className="col-6 my-2">
                            {modalOpenType === "edit" ?
                                <div className="input-group">
                                    <NormalInput
                                        // placeholder="Enter here"
                                        value={deposit}
                                        name="deposit"
                                        onChange={this.handlDiscountChange}
                                        className="customer-name w-100"
                                    />
                                </div> : deposit
                            }
                        </div>
                        <div className="col-6 my-2">
                            Sales Staff
                        </div>
                        <div className="col-6 my-2">
                            {modalOpenType === "edit" ?
                                <div className="input-group">
                                    <NormalMultiSelect
                                        name="sales_staff"
                                        value={discountField.sales_staff.length > 0 ? discountField.sales_staff : []}
                                        className={`staff-skills-select ${discountField.sales_staff !== "" ? "overflow-y-set" : ""}`}
                                        options={salesOption}
                                        handleMultiSelect={(e) => this.handleMultiSelect(e, "sales_staff")}>

                                    </NormalMultiSelect>
                                </div> : discountField.sales_staff
                            }
                        </div>
                        <div className="col-6 my-2">
                            Services Staff
                        </div>
                        <div className="col-6 my-2">
                            {modalOpenType === "edit" ?
                                <div className="input-group">
                                    <NormalMultiSelect
                                        name="service_staff"
                                        value={discountField.service_staff.length > 0 ? discountField.service_staff : []}
                                        className={`staff-skills-select ${discountField.service_staff !== "" ? "overflow-y-set" : ""}`}
                                        options={servicesOption}
                                        handleMultiSelect={(e) => this.handleMultiSelect(e, "service_staff")}>

                                    </NormalMultiSelect>
                                </div> : discountField.service_staff
                            }
                        </div>
                        <div className="col-6 my-2">
                            Item status
                        </div>
                        <div className="col-6 my-2">
                            {modalOpenType === "edit" ?
                                <div className="input-group">
                                    <NormalMultiSelect
                                        name="itemstatus"
                                        value={discountField.itemstatus.length > 0 ? discountField.itemstatus : []}
                                        className={`staff-skills-select ${discountField.itemstatus !== "" ? "overflow-y-set" : ""}`}
                                        options={itemOption}
                                        ismulti={false}
                                        handleMultiSelect={(e) => this.handleSelect(e, "itemstatus")}>

                                    </NormalMultiSelect>
                                </div> : discountField.itemstatus
                            }
                        </div>
                        <div className="d-flex create mt-5 w-100">
                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="col-12 fs-15 multiple-customer"
                                label={modalOpenType === "edit" ? "Save" : "Close"}
                                outline={true}
                                onClick={modalOpenType === "edit" ? this.handleUpdateTreatment : this.closeDialog}
                            />
                        </div>
                    </div>
                </NormalModal>
                <NormalModal className={"multiple-appointment"} modal={isConfirmOpen} handleModal={() => { }}>
                    <img onClick={this.closeDialog} className="close" src={closeIcon} alt="" />
                    <div className="row m-5">
                        <div className="col-12 fs-22 f-600 p-0 mb-3">
                            Confirm
                        </div>

                        <div className="fs-16">
                            Are you sure want to Delete this treatment from Cart?
                        </div>

                        <div className="d-flex create mt-4 w-100">
                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="col-12 fs-15 multiple-customer cancel"
                                label={"Cancel"}
                                outline={true}
                                onClick={this.closeDialog}
                            />
                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="col-12 fs-15 multiple-customer"
                                label={"Confirm"}
                                outline={true}
                                onClick={this.handleConfirmDelete}
                            />
                        </div>
                    </div>


                </NormalModal>


                <NormalModal className={"multiple-appointment"} modal={isOpenUpdateDisount} handleModal={() => { }}>
                    <img onClick={this.closeDialog} className="close" src={closeIcon} alt="" />
                    <div className="row m-5">
                        <div className="col-8 fs-18 f-600 py-2">
                            Update Additional Discount
                        </div>
                        <div className="col-4 ">
                            <div className="input-group">

                            </div>
                        </div>

                        <div className="col-6 my-2">
                            Discount in %
                        </div>
                        <div className="col-6 my-2">
                            <div className="input-group">
                                <NormalInput
                                    // placeholder="Enter here"
                                    value={addDiscountField.additional_discount}
                                    name="additional_discount"
                                    onChange={this.discountChange}
                                    className="customer-name w-100"
                                />
                            </div>
                        </div>

                        <div className="col-6 my-2">
                            Discount in Amount
                        </div>
                        <div className="col-6 my-2">
                            <div className="input-group">
                                <NormalInput
                                    // placeholder="Enter here"
                                    value={addDiscountField.additional_discountamt}
                                    name="additional_discountamt"
                                    onChange={this.discountChange}
                                    className="customer-name w-100"
                                />
                            </div>
                        </div>

                        <div className="d-flex create mt-4 w-100">
                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="col-12 fs-15 multiple-customer cancel"
                                label={"Cancel"}
                                outline={true}
                                onClick={this.closeDialog}
                            />
                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="col-12 fs-15 multiple-customer"
                                label={"Confirm"}
                                outline={true}
                                onClick={this.updateAddDiscount}
                            />
                        </div>
                    </div>
                </NormalModal>
            </>
        );
    }
}


const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
    appointmentDetail: state.appointment.appointmentDetail,
    selectedTreatmentList: state.appointment.selectedTreatmentList,
    appointmentCartList: state.appointment.appointmentCartList
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        updateForm,
        getAppointmentCartList,
        UpdateCart,
        DeleteCart,
        commonUpdateApi,
        commonCreateApi,
        HoldCart,
        getCommonApi
    }, dispatch)
}

export const Cart = connect(mapStateToProps, mapDispatchToProps)(CartClass)