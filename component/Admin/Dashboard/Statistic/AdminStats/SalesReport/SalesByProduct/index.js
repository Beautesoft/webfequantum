import React from 'react';
import '../style.scss'
export class SalesByProduct extends React.Component {
    state = {
        product: [
            {
                name:'Shampoo',
                qty:'25',
                price:'$500',
            },
            {
                name:'Nailpolish',
                qty:'25',
                price:'$500',
            },
            {
                name:'Conditioner',
                qty:'25',
                price:'$500',
            },
            {
                name:'Hair color',
                qty:'25',
                price:'$500',
            },
            {
                name:'Straightner',
                qty:'25',
                price:'$500',
            },
            {
                name:'Compact',
                qty:'25',
                price:'$500',
            },
            {
                name:'Foundation',
                qty:'25',
                price:'$500',
            },
            {
                name:'Primer',
                qty:'25',
                price:'$500',
            },
            {
                name:'Makeup kit',
                qty:'25',
                price:'$500',
            },
        ]
    }
    render() {
        let { product } = this.state
        return (
            <>
                <h3 className="team-label my-4">Sales By Product</h3>
                <div className="sales">
                    <div className="card">
                        <div className="my-4">
                            {product && product.map((data, index) => (
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