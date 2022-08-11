import React from 'react';
import './style.scss'
import { Progress } from './ProgressCircle'
export class InvoicesStats extends React.Component {
    render() {
        return (
            <>
                <h3 className="team-label my-4">Invoices Statistics</h3>
                <div className="invoice-stats">
                    <div className="card">
                        <div className="row target-container">
                            <div className="col-6 target">
                                <p>Daily target</p>
                                <h2>1000</h2>
                            </div>
                            <div className="col-6 position-relative circle-canvas">
                                <Progress />
                            </div>

                        </div>
                        <div className="row align-items-center">
                            <div className="col-6 ">
                                <p className="paid-invoice">Total invoices Paid today</p>
                            </div>
                            <div className="col-6 text-center">
                                <h2 className="paid-count">750</h2>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-6 ">
                                <p className="paid-invoice">Total Income</p>
                            </div>
                            <div className="col-6 text-center">
                                <h2 className="paid-count">75,000</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}