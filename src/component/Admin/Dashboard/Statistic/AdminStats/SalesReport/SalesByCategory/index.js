import React from 'react';
import '../style.scss'
export class SalesByCategory extends React.Component {
    state = {
        Category: [
            {
                name: 'Hair products',
                qty: '25',
                price: '$500',
            },
            {
                name: 'Nail products',
                qty: '45',
                price: '$500',
            },
            {
                name: 'Makeup',
                qty: '25',
                price: '$500',
            },
            {
                name: 'Massage kit',
                qty: '25',
                price: '$500',
            },
            {
                name: 'Manicure',
                qty: '25',
                price: '$500',
            },
            {
                name: 'Pedicure',
                qty: '25',
                price: '$500',
            },
            {
                name: 'Hair removal',
                qty: '25',
                price: '$500',
            },
            {
                name: 'Straightening',
                qty: '25',
                price: '$500',
            },
            {
                name: 'Smoothening',
                qty: '15',
                price: '$500',
            },
        ]
    }
    render() {
        let { Category } = this.state
        return (
            <>
                <h3 className="team-label my-4">Sales By Category</h3>
                <div className="sales">
                    <div className="card">
                        <div className="my-4">
                            {Category && Category.map((data, index) => (
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