import React from 'react';
import { Bar } from 'react-chartjs-2';
import {NormalSelect} from 'component/common';

const state = {
    labels: ['Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'New Users',
            backgroundColor: '#FF0000',
            borderColor: '',
            borderWidth: 1,
            data: [5, 15, 15, 10, 15, 15, 15, 15, 15, 15, 15, 15]
        },
        {
            label: 'Revenue',
            backgroundColor: '#666666',
            borderColor: '',
            borderWidth: 1,
            data: [15, 25, 15, 25, 25, 20, 25, 25, 25, 25, 25, 25]
        },
        {
            label: 'Services',
            backgroundColor: '#999999',
            borderColor: '',
            borderWidth: 1,
            data: [10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
        },
    ]
}

export default class BarChart extends React.Component {
    state={
        formFields: {
            year: '',
            yearOption:[
                {label:'2020', value:'2020'},
                {label:'2010', value:'2010'},
            ],
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
        let {year, yearOption} =this.state.formFields
        return (
            <div className="bar-chart-customer-stats">
                <div className="d-flex justify-content-between">
                    <p>Customers</p>
                    <div className="bar-chart-year">
                    <NormalSelect
                        // placeholder="Enter here"
                        options={yearOption}
                        value={year}
                        name="year"
                        onChange={this.handleChange}
                    />
                    </div>
                </div>
                <Bar
                    data={state}
                    width={100}
                    height={30}
                    options={{
                        // title:{
                        //   display:true,
                        //   text:'Average Rainfall per month',
                        //   fontSize:20
                        // },
                        legend: {
                            maintainAspectRatio: false,
                            display: true,
                            position: 'bottom'
                        }
                    }}
                />
            </div>
        );
    }
}