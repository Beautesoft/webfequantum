import React, { Component } from 'react';
import "./style.scss";
// import { Appointments, TreatmentHistory, PurchaseHistory, PersonalDetails, Favourites } from './Details'
// import { Treatmentaccount } from './account';
import classnames from 'classnames';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
import { TreatmentCourse, Diagnosis, treatmentHistory } from './TreatmentHistory/index.js'

export class TreatmentHistory extends Component {
    state = {
        activeTab: '1',
        isOpenTreatmentDone: false,
        isActiveTab: "detail"
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {

        return (

            <div className="beautesoft-navlink">
                <div className="filled-tabs">
                    <div className="tabs-block">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    Treatment History
                                </NavLink>
                            </NavItem>

                            {/* <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                >
                                    Diagnosis
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                    onClick={() => { this.toggle('3'); }}
                                >
                                    Treatment History
                                </NavLink>
                            </NavItem> */}
                           

                        </Nav>
                    </div>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            {this.state.activeTab === "1" ?
                                <TreatmentCourse id={this.props.id} />
                                : ""}
                        </TabPane>

                        {/* <TabPane tabId="2">
                            {this.state.activeTab === "2" ?
                                // <TreatmentHistory />
                                <Diagnosis id={this.props.id} />
                                : ""}
                        </TabPane>

                        <TabPane tabId="3">
                            {this.state.activeTab === "3" ?
                                // <PurchaseHistory />
                                <treatmentHistory id={this.props.id} />
                                : ""}
                        </TabPane> */}
                    </TabContent>
                </div>
            </div>
        )
    }
}
