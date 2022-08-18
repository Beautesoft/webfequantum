import React, { Component } from 'react'
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper, Pagination } from 'component/common';
import _ from 'lodash';
import Brush from 'assets/images/make-up-brush.png'
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from 'redux/actions/common';

export class CatalogCartClass extends Component {
    state = {
        productCard: [],
        page: 1,
        formFields:{
            search:""
        }
    }

    componentDidMount = () => {
        let { productCard } = this.state;
       this.getServices({});

    }

    getServices = (query) => {
        let { page = this.state.page, search = this.state.formFields.search } = query;
        if (this.props.id) {
            this.props.getCommonApi(`servicestock/?Item_Deptid=${this.props.id}&page=${page}`).then((key) => {
                let { status, data } = key;
                if (status === 200) {

                    // this.setState({ productCard: data })
                }
            })
        } else {
            this.props.getCommonApi(`servicestock/?Item_Deptid=${this.props.id}&page=${page}`).then((key) => {
                let { status, data } = key;
                if (status === 200) {

                    // this.setState({ productCard: data })
                }
            })
        }
    }

    render() {
        let { productCard = {} } = this.state
        let { dataList, meta = {} } = productCard;
        let { pagination } = meta
        return (
            <>
                <div className="products">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="headline">
                            Cart
                       </p>
                    </div>
                    <div className="d-flex list flex-wrap justify-content position-relative ">
                        {productCard.dataList && productCard.dataList.map((data, index) => (
                            <div className={`catalog-cart-item mt-1`} key={index}>
                                {/* <div className={`product-card card ${!data.stock ? 'stock-nill' : ''}`} key={index}> */}
                                <div className="row text-center">

                                    <div className="col-2">
                                        <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 5V3C4 2.46957 4.21071 1.96086 4.58579 1.58579C4.96086 1.21071 5.46957 1 6 1H10C10.5304 1 11.0391 1.21071 11.4142 1.58579C11.7893 1.96086 12 2.46957 12 3V5M15 5V19C15 19.5304 14.7893 20.0391 14.4142 20.4142C14.0391 20.7893 13.5304 21 13 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V5H15Z" stroke="#757575" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6 10V16" stroke="#757575" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M10 10V16" stroke="#757575" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                    </div>
                                    <div className="col-4 p-0">
                                        <p className="font-600 fs-14">Makeup brush {'&'} Compact combo</p>
                                    </div>
                                    <div className="col-2">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.00016 14.6663C11.6821 14.6663 14.6668 11.6816 14.6668 7.99967C14.6668 4.31778 11.6821 1.33301 8.00016 1.33301C4.31826 1.33301 1.3335 4.31778 1.3335 7.99967C1.3335 11.6816 4.31826 14.6663 8.00016 14.6663Z" stroke="$green" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M5.3335 8H10.6668" stroke="$green" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <span>1</span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.00016 14.6663C11.6821 14.6663 14.6668 11.6816 14.6668 7.99967C14.6668 4.31778 11.6821 1.33301 8.00016 1.33301C4.31826 1.33301 1.3335 4.31778 1.3335 7.99967C1.3335 11.6816 4.31826 14.6663 8.00016 14.6663Z" stroke="$green" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M5.3335 8H10.6668" stroke="$green" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                    </div>
                                    <div className="col-3">
                                        <p className="font-600 fs-14">$12.35</p>
                                    </div>
                                </div>

                            </div>
                        ))}
                        {pagination && <Pagination handlePagination={this.handlePagination} pageMeta={pagination} />}
                    </div>
                </div>
                <div className="checkout">
                    <NormalButton
                        className="col-12 fs-15 "
                        label={"Checkout"}
                        outline={false}
                        onClick={() => this.props.handleSelectServices()}
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

export const CatalogCart = connect(mapStateToProps, mapDispatchToProps)(CatalogCartClass)