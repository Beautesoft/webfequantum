import React, { Component } from 'react';
import "./style.scss";
import logo from "../../../../assets/images/man.png";
import { Details } from './Details'
import { history } from 'helpers';
import classnames from 'classnames';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
import { getServices } from 'redux/actions/services';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

export class ServiceDetailsClass extends Component {
    state = {
        activeTab: '1',
    }

    componentDidMount() {
        this.getServicesDetail();
    }

    // handle tab navigation
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    // api call for service
    getServicesDetail = () => {
        this.props.getServices(`${this.props.match.params.id}/`).then((res) => {
        })
    }

    render() {
        let { servicesDetail={} } = this.props;
        let { category_name, Course } = servicesDetail;
        return (
            <div className="view-detail">
                <div className="d-flex align-items-center cursor-pointer" onClick={() => history.push('/admin/service')}>
                    <i className="icon-left-arrow tc-primary fs-10"></i>
                    <span className="fs-15 tc-primary pl-2">Services</span>
                </div>
                <h3 className="inner-head">Treatment Details</h3>
                <div className="view-detail-box p-4 d-flex flex-column">
                    <div className="d-flex pb-3">
                        <div className="col-6">
                            <p className="fs-28 fw-500 service-detail-heading py-2">{category_name}</p>
                            <p className="fs-18 service-detail-sub-text py-1">{Course}</p>
                        </div>
                        <div className="col-6 icon-change">
                        <button className="btn outline-btn delete-btn mx-2 col-2 fs-15 float-right text-capitalize"><span className="icon-delete mr-2"></span>Delete</button>
                            <button className="btn outline-btn col-2 mx-2 fs-15 float-right text-capitalize"><span className="icon-delete mr-2"></span>Edit</button>
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
                                   
                                </Nav>
                            </div>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    {this.state.activeTab === "1" ?
                                        <Details id={this.props.match.params.id}/>
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
    servicesDetail: state.services.servicesDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getServices
    }, dispatch)
}

export const ServiceDetails = connect(mapStateToProps, mapDispatchToProps)(ServiceDetailsClass)