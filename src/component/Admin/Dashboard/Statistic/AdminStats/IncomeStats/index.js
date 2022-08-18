import React from 'react';
import { Line } from 'react-chartjs-2';
import './style.scss'
import { NormalSelect } from 'component/common';
import LineChart from './lineChart';
export class IncomeStats extends React.Component {
    state = {
        formFields: {
            staffmonth: '',
            servicemonth: '',
            staffmonthOption: [
                { label: 'January', value: 'January' },
                { label: 'February', value: 'February' },
            ],
            servicemonthOption: [
                { label: 'January', value: 'January' },
                { label: 'February', value: 'February' },
            ],
        },
        state1: {
            labels: ['Jan', 'Febr', 'Mar',
                'Apr'],
            datasets: [
                {
                    label: 'Rainfall',
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(255,0,0,1)',
                    borderWidth: 5,
                    data: [150, 300, 150, 250]
                }
            ]
        },
        state2: {
            labels: ['Jan', 'Febr', 'Mar',
                'Apr'],
            datasets: [
                {
                    label: 'Rainfall',
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(255,0,0,1)',
                    borderWidth: 5,
                    data: [275, 150, 300, 350]
                }
            ]
        }
    }
    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };
    render() {
        let { state1, state2 } = this.state;
        let { staffmonth, staffmonthOption, servicemonth, servicemonthOption } = this.state.formFields;
        return (
            <div className="staffs-services-holder">
                
                <div className="row staff-service">
                    <div className="col-6">
                        <div className="card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="staffs">Services</p>
                                <div className="line-chart-year">
                                    <NormalSelect
                                        options={staffmonthOption}
                                        value={staffmonth}
                                        name="staffmonth"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <LineChart data={this.state.state1} />
                            <div className="staff-service-label text-center">
                                <i className="icon-bookmark"></i>
                                <p>Total number of Services completed</p>
                                <h1>75,000</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="services">Products</p>
                                <div className="line-chart-year">
                                    <NormalSelect
                                        options={servicemonthOption}
                                        value={servicemonth}
                                        name="servicemonth"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <LineChart data={this.state.state2} />
                            <div className="staff-service-label text-center">
                                <i className="icon-bookmark"></i>
                                <p>Total number of Products Sold</p>
                                <h1>5,000</h1>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}