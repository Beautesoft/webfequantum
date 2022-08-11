import React, { Component } from 'react'
import { NormalButton, NormalSelect, NormalModal } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import Brush from 'assets/images/make-up-brush.png'
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from 'redux/actions/common';
import closeIcon from 'assets/images/close.png';

export class CourseItemClass extends Component {
    state = {
        productCard: [],
        isOpenPriceModal: false,
        serviceDetail: "",
        serviceName: ""
    }

    componentDidMount = () => {
        let { productCard } = this.state;
        if(this.props.id){
            this.props.getCommonApi(`coursestock/?Item_Rangeid=${this.props.id}`).then((key) => {
                let { status, data } = key;
                if (status === 200) {
    
                    this.setState({ productCard: data })
                }
            })
        } else {
        this.props.getCommonApi(`coursestock/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {

                this.setState({ productCard: data })
            }
        })
    }
    }

    handleSelectPrice = (data, index) => {
        this.setState({ isOpenPriceModal: true, serviceName: data.item_desc, serviceDetail: data })
        // history.push(`/admin/payment/${id}`)
    }

    render() {
        let { productCard, isOpenPriceModal, serviceDetail } = this.state
        return (
            <>
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="">
                            <InputSearch
                                className=""
                                placeholder='Search here..'
                                onChange={this.handleChange} />
                        </div>
                        <div className="d-flex align-items-center nav-icon">
                            <div className="mr-3"><i className="icon-barcode"></i></div>
                            {/* <div><i className="icon-"></i></div> */}
                            <div className="ml-3 filter-icon"><img src={filter} alt="" /></div>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content position-relative">
                        {productCard && productCard.map((data, index) => (
                            <div className={`product-card card `} key={index}>
                                {/* <div className={`product-card card ${!data.stock ? 'stock-nill' : ''}`} key={index}> */}
                                <div className="d-flex justify-content-between px-3">
                                    <p className="label">{data.Item_Desc}</p>
                                    <div className="cart-img">
                                        <img src={CartImg} alt="" />
                                    </div>
                                </div>
                                <p className="cost px-3">${data.Item_Price}</p>
                                <div className="product-img px-1">
                                    <img src={data.Stock_PIC} alt="" />

                                    {/* {data.combo ?
                                        <p className="px-2 combo">Combo available</p> : ''
                                    } */}

                                </div>
                                <div>
                                    <NormalButton
                                        className="col-12 fs-15 "
                                        label={"View Detail"}
                                        outline={true}
                                        onClick={()=>this.props.handleSelectServices(data.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <NormalModal className={"retail-price-modal"} style={{ minWidth: "760px" }} modal={isOpenPriceModal} handleModal={this.handleCloseDialog}>
                    <img onClick={this.handleCloseDialog} className="close" src={closeIcon} alt="" />

                    <div className=" mt-2 mb-5 mx-3">
                        <div className="col-12 pl-0 mb-3 fs-18 py-2">
                            Select Customer
                        </div>
                        <div className="row title fs-16 mb-2 f-600">
                            <div className="col-1">S.No</div>
                            <div className="col-4">Type</div>
                            <div className="col-4">Price</div>
                            <div className="col-2">Action</div>
                        </div>
                        {serviceDetail && serviceDetail.uomprice.length > 0 ? serviceDetail.uomprice.map((data, index) => {

                            return (
                                <div className="row mb-1 fs-14">
                                    <div className="col-1">{index + 1}</div>
                                    <div className="col-4">{data.itemuom_desc}</div>
                                    <div className="col-4">{data.item_price}</div>
                                    <div className="col-2">
                                        <NormalButton
                                            buttonClass={"detail-button addtocart"}
                                            mainbg={true}
                                            className="col-12 fs-15 "
                                            label="Select"
                                            onClick={() => this.handleAddCart(serviceDetail, data.item_price, data.itemuom_id)}
                                        />
                                    </div>
                                </div>
                            )
                        }) : ""}

                    </div>
                </NormalModal>
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

export const CourseItem = connect(mapStateToProps, mapDispatchToProps)(CourseItemClass)