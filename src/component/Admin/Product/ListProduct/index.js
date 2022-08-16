import React from 'react';
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import { AllProduct } from './TypeOfServices'
import './style.scss'
export class ListProduct extends React.Component {
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
                <div className="row align-items-center product-list">
                    <div className="col-md-5">
                        <h3>Products</h3>
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
                                    placeholder='Search'
                                    onChange={this.handleChange} />
                            </div>
                            <div className="w-100 col-3 p-0">
                                <NormalButton
                                    mainbg={true}
                                    className="col-12 fs-15 float-right"
                                    label="Add Products"
                                    onClick={() => this.props.history.push('/admin/product/add')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-navlink py-3">
                    <AllProduct />

                </div>


            </>
        );
    }
}