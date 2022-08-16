// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import Service1 from '../../../../../assets/images/service1.png'
// import Service2 from '../../../../../assets/images/service2.png'
// import Service3 from '../../../../../assets/images/service3.png'
// import More from '../../../../../assets/images/H-more.svg'
// import MoreActive from '../../../../../assets/images/H-more-blue.svg'
// export class AllProduct extends Component {
//     state = {
//         currentIndex: '-1',
//         active: false,
//         services: [
//             {
//                 service: 'Head Massage',
//                 pack: 'Dragon Fruit Face Mask',
//                 price: '217',
//                 image: Service1
//             },
//             {
//                 service: 'Body Massage',
//                 pack: 'Dragon Fruit Face Mask',
//                 price: '217',
//                 image: Service2
//             },
//             {
//                 service: 'Haircut',
//                 pack: 'Dragon Fruit Face Mask',
//                 price: '217',
//                 image: Service3
//             },
//         ]
//     }

//     handleClick = (key) => {
//         if (!this.state.active) {
//             document.addEventListener('click', this.handleOutsideClick, false);
//         } else {
//             document.removeEventListener('click', this.handleOutsideClick, false);
//         }

//         this.setState(prevState => ({
//             active: !prevState.active,
//             currentIndex: key
//         }));
//     }

//     handleOutsideClick = (e) => {
//         if (this.node != null) {
//             if (this.node.contains(e.target)) {
//                 return;
//             }
//         }
//         this.handleClick();
//     }
//     render() {
//         let { services, currentIndex } = this.state
//         return (
//             <>
//                 <div className="product-holder">
//                     {services && services.map((data, index) => (
//                         <div className="products">
//                             <div className="d-flex">
//                                 <div className="">
//                                     <img src={data.image} />
//                                 </div>
//                                 <div className="product-offered w-100">
//                                     <p className="product">{data.service}</p>
//                                     <p className="pack">{data.pack}</p>
//                                     <p className="price">$ {data.price}</p>
//                                 </div>
//                                 <div className="position-relative pt-2" ref={node => { this.node = node; }}
//                                     onClick={() => this.handleClick(index)}>
//                                     {currentIndex == index ?
//                                         <>
//                                             <div className="d-flex align-items-center justify-content-center horizontal-more-active"><img className="" src={MoreActive} /></div>
//                                             <div className="option card">
//                                                 <Link to="/admin/product/productDetails"><div className="d-flex align-items-center fs-16 pt-3" ><span className="icon-eye-grey px-3"></span> View </div></Link>
//                                                 <div className="d-flex align-items-center fs-16"><span className="icon-edit px-3"></span> Edit </div>
//                                                 <div className="d-flex align-items-center fs-16 pb-3"><span className="icon-delete px-3"></span> Delete </div>
//                                             </div>
//                                         </>
//                                         :
//                                         <div className="d-flex align-items-center justify-content-center horizontal-more"><img className="" src={More} /></div>
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </>
//         );
//     }
// }