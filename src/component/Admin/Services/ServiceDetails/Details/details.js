import React, { Component } from 'react';
import hotel1 from '../../../../../assets/images/hotel1.png'
import hotel2 from '../../../../../assets/images/hotel2.png'
import { connect } from 'react-redux';

export class DetailsClass extends Component {
    render() {
        let { servicesDetail={} } = this.props;
        let { Price, service_tax, discount, sutiable_for, description, images=[] } = servicesDetail
        console.log(servicesDetail, "lkuytgiasd ==", this.props)
        return (
            <div className="salon-details">
                <div className="pt-5 d-flex">
                    <div className="col-3">
                        <p className="salon-detail-desc pb-4">Treatment Price</p>
                        <p className="salon-detail-desc pb-4">Service Tax</p>
                        <p className="salon-detail-desc pb-4">Discount</p>
                        <p className="salon-detail-desc pb-4">Suitable for</p>
                        <p className="salon-detail-desc pb-4">Description</p>
                        <p className="salon-detail-desc py-2">Treatment Images</p>
                    </div>
                    <div className="col-9">
                        <p className="salon-detail-text pb-4">{Price}</p>
                        <p className="salon-detail-text pb-4">{service_tax}</p>
                        <p className="salon-detail-text pb-4">{discount}</p>
                        <p className="salon-detail-text pb-4">{sutiable_for}</p>
                        <p className="salon-detail-text pb-4">{description}</p>

                    </div>
                </div>
                <div className="d-flex salon-detail-image pb-4">
                    {images.length > 0 ? images.map(({id, image, item_sitelist, services}, index)=>{
                        return (
                            <img src={image} alt=""/>
                        )
                    }):""}
                    
                    <img src={hotel2} alt=""/>
                    <img src={hotel1} alt=""/>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    servicesDetail: state.services.servicesDetail
})


export const Details = connect(mapStateToProps, null)(DetailsClass)