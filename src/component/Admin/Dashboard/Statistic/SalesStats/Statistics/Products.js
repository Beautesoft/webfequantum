import React from 'react';
import { NormalDate } from 'component/common';
import { Line } from 'react-chartjs-2';
// import BarChart from './BarChart'
// import './style.scss'

export class Products extends React.Component {
    state = {
        formFields: {
            date: '',
        },
    };
    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };
    render() {
        let { formFields } = this.state;
        let { date } = formFields
        const statistic = (canvas) => {
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 0, 380);
            gradient.addColorStop(0, 'rgba(250,0,0,0.4)');
            gradient.addColorStop(1, 'rgba(250,0,0,0)');
            return {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [
                    {
                        label: 'Product',
                        fill: true,
                        lineTension: 0.5,
                        backgroundColor: gradient,
                        borderColor: 'rgba(255,0,0,1)',
                        borderWidth: 2,
                        data: [150, 300, 350, 250, 180, 300, 200]
                    }
                ]
            }
        }

        var options = {
            responsive: true,
            // datasetStrokeWidth : 3,
            // pointDotStrokeWidth : 4,
            legend: {display: false},
        };

        return (
            <>
                <div className="products">
                    <div className="d-flex justify-content-between">
                        <p className="product-income">Product Income</p>
                        <div className="date">
                            <NormalDate
                                value={date}
                                name="date"
                                type="date"
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <Line
                        data={statistic}
                        width={100}
                        height={30}
                        options={options}
                        // options={{
                        //     legend: {
                        //         display: false,
                        //         position: 'right'
                        //     }
                        // }}
                    />
                </div>
            </>
        );
    }
}