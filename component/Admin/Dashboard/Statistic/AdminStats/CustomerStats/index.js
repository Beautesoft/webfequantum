import React from 'react';
import './style.scss'
import BarChart from './BarChart'
export class CustomerStats extends React.Component {
    render() {
        return (
            <div className="customer-stats">
                <h3 className="team-label mb-4">Customer statistics</h3>
                <div className="card">
                    <BarChart />
                </div>
            </div>
        );
    }
}