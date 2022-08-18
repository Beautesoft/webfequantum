import React, { Component } from 'react'
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import Brush from 'assets/images/make-up-brush.png'
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from 'redux/actions/common';

export class ItemDetailClass extends Component {
    state= {
        servicesDetail: {

        }
    }

    componentDidMount = () => {
        let { productCard } = this.state;
        this.props.getCommonApi(`coursestock/${this.props.id}/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {

                this.setState({ servicesDetail: data })
            }
        })
    }

    render() {
        let { servicesDetail } = this.state;
        return (
            <>
                <div className="product-detail">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="detail-view">
                                        <img src={servicesDetail.Stock_PIC} alt="" />
                                    </div>
                                    {/* <div className="thumbnail-view">
                                        <img src={Brush} />
                                        <img src={Brush} />
                                        <img src={Brush} />
                                    </div> */}
                                </div>
                                <div className="col-md-5">
                                    <div className="product-left">
                                        <p className="product-name">{servicesDetail.item_desc}</p>
                                        <p className="fs-12">{servicesDetail.item_name}</p>
                                        {/* <div className="rating">
                                            <div className="star-rate">
                                                <i className="icon-star-fill"></i>
                                                <i className="icon-star-fill"></i>
                                                <i className="icon-star-fill"></i>
                                                <i className="icon-star-fill"></i>
                                                <i className="icon-star-fill"></i>
                                            </div>
                                            <div><p className="rate-count">5 ratings</p></div>
                                        </div> */}
                                        <div>
                                            <p className="list-price">Price:<span> ${servicesDetail.item_price}</span></p>
                                        </div>
                                        {/* <div>
                                            <p className="detail-label">Select color</p>
                                            <div className="color-palette">
                                                <p style={{ width: "31px", height: "31px", background: "#000", borderRadius: "50%" }}></p>
                                                <p style={{ width: "31px", height: "31px", background: "#850", borderRadius: "50%" }}></p>
                                                <p style={{ width: "31px", height: "31px", background: "#200", borderRadius: "50%" }}></p>
                                                <p style={{ width: "31px", height: "31px", background: "#498", borderRadius: "50%" }}></p>
                                            </div>
                                        </div> */}
                                        {/* <div>
                                            <p className="detail-label">Select Brush Size</p>
                                            <div className="select-size">
                                                <p>2</p>
                                                <p>3</p>
                                                <p>5</p>
                                                <p>7</p>
                                            </div>
                                        </div> */}
                                        <div>
                                            <NormalButton
                                                mainbg={true}
                                                className="col-12 fs-15 mt-5"
                                                label="Add to Cart"
                                                onClick={() => this.props.history.push('/admin/appointment/create')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-5">
                            <span className="fs-18">Combo available</span>
                            <div className="row m-0">
                                <div className="col-5 bg-white text-center">
                                    <img src={Brush} alt=""></img>
                                    <p>Brush</p>
                                    <p className="text-orenge">$7.97</p>
                                </div>
                                <div className="col-1 p-0 pt-5 bg-white text-center">
                                    <span>+</span>
                                </div>
                                <div className="col-5 bg-white text-center">
                                    <img src={Brush} alt=""></img>
                                    <p>Compact</p>
                                    <p className="text-orenge">$6.97</p>
                                </div>
                                <div className="col-11 bg-white text-center">
                                    <span>Combo Offr <span className="text-orenge"> $13</span></span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </>
        );
    }
}


const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        // getCustomer,
        getCommonApi
    }, dispatch)
}

export const ItemDetail = connect(mapStateToProps, mapDispatchToProps)(ItemDetailClass)