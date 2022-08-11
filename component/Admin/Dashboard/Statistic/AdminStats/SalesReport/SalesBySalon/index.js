import React from 'react';
import '../style.scss'
export class SalesBySalon extends React.Component {
    state = {
        salon: [
            {
                name:'ABC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'BBC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'BGC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'DFC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'REC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'FTC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'HGC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'NBC Salon',
                qty:'25',
                price:'$500',
            },
            {
                name:'MJC Salon',
                qty:'25',
                price:'$500',
            },
        ]
    }
    render() {
        let { salon } = this.state
        return (
            <>
                <h3 className="team-label my-4">Sales By Staff</h3>
                <div className="sales">
                    <div className="card">
                        <div className="my-4">
                            {salon && salon.map((data, index) => (
                                <div key={index} className="d-flex align-items-center">
                                    <div className="d-flex justify-content-between w-100 mb-2">
                                        <div className="d-flex align-items-center">
                                            <p className="red-circle"></p>
                                            <p>{data.name}</p>
                                        </div>
                                        <div className="d-flex">
                                            <p className="mr-5">{data.qty}</p>
                                            <p className="mr-3">{data.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </>
        );
    }
}