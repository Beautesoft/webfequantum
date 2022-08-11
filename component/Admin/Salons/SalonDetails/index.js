import React, { Component } from 'react';
import "./style.scss";
import logo from "../../../../assets/images/man.png";
import { Details, StaffDetails, ProductSaleHistory, CustomerList } from './Details'
import { history } from 'helpers';
import classnames from 'classnames';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
import { NormalButton } from 'component/common';
import { getBranch,commonDeleteApi } from 'redux/actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

export class SalonDetailsClass extends Component {
    state = {
        activeTab: '1',
        salonDetail: {}
    }

    componentDidMount() {
        this.getStaffDetail();
    }

    // tab navigation handled
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    // get saloon detail api
    getStaffDetail = () => {
        this.props.getBranch(`${this.props.match.params.id}/`).then((res) => {
            this.setState({salonDetail:res.data});
            console.log("kjdfkjsdkfjsdf", res)
        })
    }

    // edit salon button action
    editSaloon = (id) => {
        history.push(`/admin/salons/${id}/editSaloon`)
    }

    // delete salon api call
    deleteSaloon = (id) => {
        this.props.commonDeleteApi(`branch/${id}/`).then(()=>{
            history.push('/admin/salons');
        })
    }

    render() {
        let { saloonDetail={} } = this.props;
        let { salonDetail={} } = this.state;
        let { itemsite_desc, salon_name, id } = salonDetail
        console.log(salonDetail, "lkuytgiasd", this.state)
        return (
            <div className="view-detail">
                <div className="d-flex align-items-center cursor-pointer" onClick={() => history.push('/admin/salons')}>
                    <i className="icon-left-arrow tc-primary fs-10"></i>
                    <span className="fs-15 tc-primary pl-2">Salons</span>
                </div>
                <h3 className="inner-head">Salon Details</h3>
                <div className="view-detail-box p-4 d-flex flex-column">
                    <div className="d-flex pb-3">
                        <div className="col-6">
                            <p className="fs-28 fw-500 salon-detail-heading py-2">{itemsite_desc}</p>
                            <p className="fs-18 salon-detail-sub-text py-1">{salon_name}</p>
                        </div>
                        <div className="col-6 icon-change">
                        <button onClick={()=>this.deleteSaloon(id)} className="btn outline-btn delete-btn mx-2 col-2 fs-15 float-right text-capitalize"><span className="icon-delete mr-2"></span>Delete</button>
                        <button onClick={()=>this.editSaloon(id)} className="btn outline-btn col-2 mx-2 fs-15 float-right text-capitalize"><span className="icon-delete mr-2"></span>Edit</button>
                            {/* <NormalButton
                                link={true}
                                className="icon-delete mx-2 col-2 fs-15 float-right"
                                label="&nbsp;Delete"
                            />
                            <NormalButton
                                outline={true}
                                className="icon-edit mx-2 col-2 fs-15 float-right"
                                label="&nbsp;Edit"
                            /> */}
                        </div>
                    </div>
                    <div className="beautesoft-navlink">
                        <div className="filled-tabs">
                            <div className="tabs-block">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggle('1'); }}
                                        >
                                            Details
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            Staff List
                                </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '3' })}
                                            onClick={() => { this.toggle('3'); }}
                                        >
                                            Customers List
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '4' })}
                                            onClick={() => { this.toggle('4'); }}
                                        >
                                            Product Sale History
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </div>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    {this.state.activeTab === "1" && salonDetail ?
                                        <Details salonDetail={salonDetail} />
                                        : ""}
                                </TabPane>

                                <TabPane tabId="2">
                                    {this.state.activeTab === "2" ?
                                        <StaffDetails />
                                        : ""}
                                </TabPane>

                                <TabPane tabId="3">
                                    {this.state.activeTab === "3" ?
                                        <CustomerList />
                                        : ""}
                                </TabPane>

                                <TabPane tabId="4">
                                    {this.state.activeTab === "4" ?
                                        <ProductSaleHistory />
                                        : ""}
                                </TabPane>
                            </TabContent>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    saloonDetail: state.saloon.saloonDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getBranch,
        commonDeleteApi
    }, dispatch)
}

export const SalonDetails = connect(mapStateToProps, mapDispatchToProps)(SalonDetailsClass)