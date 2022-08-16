import React, { Component } from 'react';
import "./style.scss";
import { InputSearch } from 'component/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { history } from 'helpers';
import { getCommonApi, commonCreateApi } from 'redux/actions/common';

export class QuickStatsClass extends Component {
    state = {
       quickStats:{}
    }

    componentDidMount() {
        
        this.getQuickState();
    }

    getQuickState = () => {
        let { quickStats } = this.state;
        this.props.getCommonApi(`dashboard/`).then((res)=>{
            console.log(res, "sdafasdfasdfasdfasdf");
            quickStats = res.data;
            this.setState({
                quickStats
            })
        })
    }

    render() {
        let { quickStats } = this.state;
        return (
            <div className="quickStats">
                <div className="d-flex align-items-center mb-4">
                    <h3 className="team-label w-100">Quick stats</h3>
                    <div className="col-md-3 p-0">
                        {/* <div className="w-100 ">
                            <InputSearch
                                className=""
                                placeholder='Search Salons'
                                onChange={this.handleChange} />
                        </div> */}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="row stats-card ">
                            <div className="card col-5">
                                <div className="row m-0">
                                    <div className="col-8 pl-0 count-label">
                                        <h2>{quickStats.customer_site}</h2>
                                        <p>Customers</p>
                                    </div>
                                    <div className="col-4 pr-0 stats-icon d-flex align-items-center justify-content-center">
                                        <i className={'icon-user-1'}></i>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-5">
                                <div className="row m-0">
                                    <div className="col-8 pl-0 count-label">
                                        <h2>{quickStats.new_customer}</h2>
                                        <p>New Customers</p>
                                    </div>
                                    <div className="col-4 pr-0 stats-icon d-flex align-items-center justify-content-center">
                                        <i className={'icon-user-2'}></i>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-5">
                                <div className="row m-0">
                                    <div className="col-8 pl-0 count-label">
                                        <h2>{quickStats.product}</h2>
                                        <p>Products sold</p>
                                    </div>
                                    <div className="col-4 pr-0 stats-icon d-flex align-items-center justify-content-center">
                                        <i className={'icon-shopping-bag'}></i>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-5">
                                <div className="row m-0">
                                    <div className="col-8 pl-0 count-label">
                                        <h2>{quickStats.services}</h2>
                                        <p>Services completed</p>
                                    </div>
                                    <div className="col-4 pr-0 stats-icon d-flex align-items-center justify-content-center">
                                        <i className={'icon-money-1-1'}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-6">
                        <div className="row profit-card">
                            <div className="card1 col-6">
                                <div className="card ">
                                    <div className="">
                                        {/* <img src={Hospitality} /> */}
                                        <i className="icon-hospitality"></i>
                                    </div>
                                    <div>
                                        <p>Repeated customers</p>
                                        <h2>{quickStats.repeat_customer}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="card2 col-6">
                                <div className="card ">
                                    <div>
                                        {/* <img src={Profit} /> */}
                                        <i className="icon-profit"></i>
                                    </div>
                                    <div>
                                        <p>Monthly earnings</p>
                                        <h2>{quickStats.monthly_earnigs}</h2>
                                    </div>
                                </div>
                            </div>
                            {/* {profits && profits.map((data, index) => (
                                <div className="card col-6">
                                    <div className="">
                                        <img src={data.avatar} />
                                    </div>
                                    <div>
                                        <p>{data.label}</p>
                                        <h2>{data.count}</h2>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getCommonApi,
        commonCreateApi
    }, dispatch)
}

export const QuickStats = connect(null, mapDispatchToProps)(QuickStatsClass)