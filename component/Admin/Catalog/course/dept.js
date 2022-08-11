import React, { Component } from 'react'
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import Brush from 'assets/images/make-up-brush.png'
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from 'redux/actions/common';

export class DeptClass extends Component {
    state = {
        productCard: [
        
        ],
    }

    componentDidMount = () => {
        let { productCard } = this.state;
        this.props.getCommonApi(`serviceitemrange/?Item_Deptid=${this.props.id}`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                
                this.setState({ productCard: data })
            }
        })
    }

    render() {
        let { productCard } = this.state
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
                            <div className="ml-3 filter-icon"><img src={filter} alt=""/></div>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content dept position-relative">
                        {productCard && productCard.map((data, index) => (
                            <div className={`product-card card `} key={index}>
                            {/* <div className={`product-card card ${!data.stock ? 'stock-nill' : ''}`} key={index}> */}
                                {/* <div className="d-flex justify-content-between px-3">
                                    <p className="label">{data.label}</p>
                                    <div className="cart-img"> <img src={CartImg} alt=""/></div>
                                </div>
                                <p className="cost px-3">{data.cost}</p>
                                <div className="product-img px-1">
                                    <img src={Brush} alt=""/>

                                    {data.combo ?
                                        <p className="px-2 combo">Combo available</p> : ''
                                    }

                                </div> */}
                                <div>
                                    <NormalButton
                                        className="col-12 fs-15 "
                                        label={data.itm_desc}
                                        onClick={()=>this.props.handleSelectDept(data.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <NormalButton
                        className="col-12 fs-15 mt-5 next-btn"
                        label={"Next"}
                        onClick={() => this.props.handleSelectDept()}
                    />
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

export const Dept = connect(mapStateToProps, mapDispatchToProps)(DeptClass)