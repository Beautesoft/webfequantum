import React, { Component } from 'react'
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import Brush from '../../../assets/images/make-up-brush.png'
import Service1 from '../../../assets/images/service1.png'
import Service2 from '../../../assets/images/service2.png'
import Gift from '../../../assets/images/gift.png'
import { MakePayment } from './selectPayment'
import { getPayment } from 'redux/actions/payment';
import { getCommonApi } from 'redux/actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { history } from 'helpers';
import { dateFormat } from 'service/helperFunctions';

import './style.scss'
export class PaymentClass extends Component {
    state = {
        active: true,
        headLabel: [
            { label: 'Date', value: '02.06.2020' },
            { label: 'Time', value: '12.30 PM' },
            { label: 'Bill number', value: '123456' },
            { label: 'Billed by', value: 'James' },
        ],
        product: [
            { img: Brush, productName: 'L\'Oreal Paris Makeup Brush', category: 'This is a gift', color: '#000', cost: '$7.97' },
            { img: Service1, productName: 'Head massage', category: 'This is a gift', cost: '$7.97' },
            { img: Service2, productName: 'Golden facial', category: 'This is a gift', cost: '$7.97' },
        ],
        responseData: {}
    }

    handleClick = () => {
        let { active } = this.state
        this.setState({
            active: !active
        })
    }

    componentDidMount() {
        this.getPayment()
    }

    getPayment = () => {
        // this.props.getPayment(`?Appointment_id=${this.props.match.params.id}`).then((res) => {
        //     this.setState({ responseData: res.data })
        // })
        let { selected_cstomer } = this.props
        this.props.getCommonApi(`postaud/?sitecodeid=${selected_cstomer.branchId}&cart_date=${dateFormat(new Date(), "yyyy-mm-dd")}&cust_noid=${selected_cstomer.cust_noid}&cart_id=${this.props.match.params.id}`).then((res) => {
            this.setState({ responseData: res.data })
        })
    }

    render() {
        let { active, headLabel, product, responseData } = this.state
        return (
            <>
                <div className="payment-section container">

                    <div className="top-nav">

                        <div className="d-flex" >
                            <p>Date</p>
                            <p>:</p>
                            <p>{responseData.date}</p>
                        </div>
                        <div className="d-flex" >
                            <p>Time</p>
                            <p>:</p>
                            <p>{responseData.time}</p>
                        </div>
                        <div className="d-flex" >
                            <p>Bill Number</p>
                            <p>:</p>
                            <p>{responseData.bill_no}</p>
                        </div>
                        <div className="d-flex">
                            <p>Billed by</p>
                            <p>:</p>
                            <p>{responseData.billed_by}</p>
                        </div>
                    </div>
                    <div className="row pt-4">
                        <div className="col-md-8">
                            {active ?
                                <MakePayment id={this.props.match.params.id} billNo={responseData.bill_no} />
                                :
                                <div>
                                    {product && product.map((data, index) => (
                                        <div className="product-list" key={index}>
                                            <div className="product-img">
                                                <img src={data.img} />
                                            </div>
                                            <div className="product-details">
                                                <p className="product-name">{data.productName}</p>
                                                <p className="product-category"><img src={Gift} />{data.category}</p>
                                            </div>
                                            <div className="product-color">
                                                <p className="color-label">Color</p>
                                                <p style={{ width: "31px", height: "31px", background: "#000", borderRadius: "50%" }}></p>
                                            </div>
                                            <div className="size-selector">
                                                <p className="size-label">Size</p>
                                                <select>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                </select>
                                            </div>
                                            <div className="qty">
                                                <p className="decrement">-</p>
                                                <p className="value px-2">1</p>
                                                <p className="increment">+</p>
                                            </div>
                                            <div className="cost">
                                                <p>{data.cost}</p>
                                            </div>
                                            <div className="remove-icon"><i className="icon-close"></i></div>
                                        </div>
                                    ))}
                                </div>
                            }

                        </div>
                        <div className="col-md-4">
                            <div className="cart-total">
                                <div className="cart-price">
                                    <div className="row pb-3">
                                        <div className="col-7"><p className="fs-16">Subtotal</p></div>
                                        <div className="col-5"><p>${responseData.subtotal}</p></div>
                                    </div>
                                    <div className="row pb-3">
                                        <div className="col-7"><p className="fs-16">Discount</p></div>
                                        <div className="col-5"><p>${responseData.discount}</p></div>
                                    </div>
                                    <div className="row pb-3">
                                        <div className="col-7"><p className="fs-16">Transaction Amount</p></div>
                                        <div className="col-5"><p>${responseData.trans_amt}</p></div>
                                    </div>
                                    <div className="row pb-3">
                                        <div className="col-7"><p className="fs-16">Deposit</p></div>
                                        <div className="col-5"><p>${responseData.deposit_amt}</p></div>
                                    </div>
                                    <div className="row pb-3">
                                        <div className="col-7"><p className="fs-16">{responseData.tax_lable}</p></div>
                                        <div className="col-5"><p>${responseData.tax_amt}</p></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="fs-18">Billable amount</p>
                                    <p className="bill-amount">${responseData.billable_amount}</p>
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
    appointmentDetail: state.appointment.appointmentDetail,
    selected_cstomer: state.common.selected_cstomer,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getPayment,
        getCommonApi
    }, dispatch)
}

export const Payment = connect(mapStateToProps, mapDispatchToProps)(PaymentClass)