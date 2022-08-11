import React, { Component } from 'react';
import hotel1 from '../../../../../assets/images/hotel1.png'
import hotel2 from '../../../../../assets/images/hotel2.png'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

export class DetailsClass extends Component {
    componentDidMount = () => {
        console.log("fdasdfasdfasdf", this.props)
    }
    render() {
        let { salonDetail={} } = this.props;
        let { ItemSite_Desc, branch_name, itemsite_date, itemsite_phone1, skills_list, images, itemsite_email } = salonDetail;
        console.log("fdasdfasdfasdf", this.props)
        return (
            <div className="salon-details">
                <div className="pt-5 d-flex">
                    <div className="col-3">
                        <p className="salon-detail-desc pb-4">Opening Date</p>
                        <p className="salon-detail-desc pb-4">Contact Number</p>
                        <p className="salon-detail-desc pb-4">Email Address</p>
                        <p className="salon-detail-desc pb-4">Services</p>
                        <p className="salon-detail-desc pb-2">Salon Images</p>
                    </div>
                    <div className="col-9">
                        <p className="salon-detail-text pb-4">{itemsite_date}</p>
                        <p className="salon-detail-text pb-4">{itemsite_phone1}</p>
                        <p className="salon-detail-text pb-4">{itemsite_email}</p>
                        <p className="salon-detail-text pb-4">{skills_list}</p>

                    </div>
                </div>
                <div className="d-flex salon-detail-image pb-4">
                    <img src={hotel1} alt=""/>
                    <img src={hotel2} alt=""/>
                    <img src={hotel1} alt=""/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    saloonDetail: state.saloon.saloonDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        // getSaloon
    }, dispatch)
}

export const Details = connect(mapStateToProps, mapDispatchToProps)(DetailsClass)