import React from 'react';
import { NormalDate } from 'component/common';
import CountryChart from './CountryChart'
import './style.scss'
export class CustomerByCountry extends React.Component {
    state={
        formFields: {
            date: '',
        },
        // status : {
        //     labels: ['Singappore', 'Malaysia', 'East Malaysia', ' Brunei', 'Vietnam', 'Indonesia'],
        //     datasets: [
        //         {
        //             label: 'New Users',
        //             backgroundColor: '#FF0000',
        //             borderColor: '',
        //             borderWidth: 0.5,
        //             data: [10,5,15,3,10,12]
        //         },
               
        //     ]
        // }
    }
    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };
    chartOptions= {
        chart: {
            type: 'column'
        },
        // title: {
        //     text: 'World\'s largest cities per 2017'
        // },
        // subtitle: {
        //     text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
        // },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -90,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        // yAxis: {
        //     min: 0,
        //     title: {
        //         text: 'Population (millions)'
        //     }
        // },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
        },
        series: [{
            name: 'Population',
            data: [
                ['Singapore', 53],
                ['Malaysia', 71],
                ['East Malaysia', 38],
                ['Brunei', 66],
                ['Vietnam', 88],
                ['Indonesia', 50]
            ],
            dataLabels: {
                enabled: true,
                rotation: 0,
                color: '$white',
                align: 'right',
                // format: '{point.y:.1f}', // one decimal
                y: 25, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    };
    render() {
        let {formFields} =this.state
        let {date}=formFields
        return (
            <>
                <h3 className="team-label my-4">Customer Statistic</h3>
                <div className="customer-month-stats">
                    <div className="card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="label">
                                <p>Customers by Country</p>
                            </div>
                            <div className=" date">
                                <NormalDate
                                    value={date}
                                    name="date"
                                    type="date"
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            {/* <BarChart data={this.state.status}/> */}
                            <CountryChart  options={this.chartOptions} />
                        </div>
                    </div>

                </div>
            </>
        );
    }
}