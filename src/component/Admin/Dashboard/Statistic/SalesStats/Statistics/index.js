import React from 'react';
import { Products } from './Products'
import { Services } from './Services'
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
import classnames from 'classnames';
export class Statistics extends React.Component {
    state = {
        activeTab: '1',
        label1:'Services',
        label2: 'Products',
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
            <>
                <div className="tab-view">
                    <Nav tabs>
                        <div className="col-md-2 p-0">
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    <div className="d-flex flex-column align-items-center">
                                        <span>Products</span>
                                    </div>
                                </NavLink>
                            </NavItem>
                        </div>
                        <div className="col-md-2 p-0">
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                >
                                    <div className="d-flex flex-column align-items-center">
                                        <span>Services</span>
                                    </div>
                                </NavLink>
                            </NavItem>
                        </div>

                    </Nav>
                </div>
                {/* <div className="border-white"></div> */}
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        {this.state.activeTab === "1" ?
                            <Products />
                            : ""}
                    </TabPane>
                    <TabPane tabId="2">
                        {this.state.activeTab === "2" ?
                            <Services />
                            : ""}
                    </TabPane>

                </TabContent>
            </>
        );
    }
} 