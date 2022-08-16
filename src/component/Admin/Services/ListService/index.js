import React from 'react';
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import classnames from 'classnames';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
import { AllServices, ComboServices } from './TypeOfServices';
import './style.scss';

export class ListService extends React.Component {
    state = {
        activeTab: '1',
        active: false,
        currentIndex: -1,
        formFields: {

            type: '',
            typeOption: [
                { label: 'All', value: 'All' },
                { label: 'A-Z', value: 'A-Z' },
                { label: 'Z-A', value: 'Z-A' },
            ]
        }
    }

    // handle tabs
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };

    handleClick = (key) => {
        let currentIndex;
        if (this.state.active == true) {
            this.setState({
                active: false,
                currentIndex: '-1'
            })
        }
        else {
            this.setState({
                active: true,
                currentIndex: key
            })
        }
    }
    
    render() {
        let { currentIndex, formFields } = this.state
        let { type, typeOption } = formFields
        return (
            <>
                <div className="row align-items-center services-list">
                    <div className="col-md-5">
                        <h3>Services</h3>
                    </div>
                    <div className="col-md-7">
                        <div className="d-flex">
                            <div className="w-100 d-flex align-items-center">
                                <p>Type</p>
                                <div className="category">
                                    <NormalSelect
                                        options={typeOption}
                                        value={type}
                                        name="type"
                                        onChange={this.handleChange}
                                    />
                                </div>

                            </div>
                            <div className="w-100 input-search">
                                <InputSearch
                                    className=""
                                    placeholder='Search Services'
                                    onChange={this.handleChange} />
                            </div>
                            <div className="w-100 col-3 p-0">
                                <NormalButton
                                    mainbg={true}
                                    className="col-12 fs-15 float-right"
                                    label="Add Services"
                                    onClick={() => this.props.history.push('/admin/service/add')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="service-navlink py-3">
                    <div className="tab-view">
                        <Nav tabs>
                            <div className="col-md-2 p-0">
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggle('1'); }}
                                    >
                                        <div className="d-flex flex-column align-items-center">
                                            <span>All Services</span>
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
                                            <span>Combo Services</span>
                                        </div>
                                    </NavLink>
                                </NavItem>
                            </div>

                        </Nav>
                    </div>
                    <div className="border-bottom-line"></div>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            {this.state.activeTab === "1" ?
                                <AllServices />
                                : ""}
                        </TabPane>
                        <TabPane tabId="2">
                            {this.state.activeTab === "2" ?
                                <ComboServices />
                                : ""}
                        </TabPane>

                    </TabContent>
                </div>


            </>
        );
    }
}