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
import { TreatmentAccount, CreditNote, ProductAccount, PrepaidAccount } from './Accounts'

export class Account extends Component {
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

            <div className="beautesoft-navlink customer-detail">
                <div className="filled-tabs">
                    <div className="tabs-block">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    Treatment Account
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                >
                                    Credit Note
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                    onClick={() => { this.toggle('3'); }}
                                >
                                    Product Account
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '4' })}
                                    onClick={() => { this.toggle('4'); }}
                                >
                                    Prepaid Account
                                </NavLink>
                            </NavItem>

                        </Nav>
                    </div>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            {this.state.activeTab === "1" ?
                                <TreatmentAccount id={this.props.id} />
                                : ""}
                        </TabPane>

                        <TabPane tabId="2">
                            {this.state.activeTab === "2" ?
                                // <TreatmentHistory />
                                <CreditNote id={this.props.id} />
                                : ""}
                        </TabPane>

                        <TabPane tabId="3">
                            {this.state.activeTab === "3" ?
                                // <PurchaseHistory />
                                <ProductAccount id={this.props.id} />
                                : ""}
                        </TabPane>
                        <TabPane tabId="4">
                            {this.state.activeTab === "4" ?
                                // <Appointments />
                                <PrepaidAccount id={this.props.id} />
                                : ""}
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        )
    }
}
