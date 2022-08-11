// import React, { Component } from 'react';
// import { InputSearch } from 'component/common';
// import { NormalButton, NormalTextarea } from 'component/common';
// import Modal from '../../../assets/images/modal-avatar.png'
// import More from '../../../assets/images/H-more.svg'
// import MoreActive from '../../../assets/images/H-more-blue.svg'
// import './style.scss'
// export class Review extends Component {
//     state = {
//         currentIndex: '-1',
//         active: false,
//         formFields: {
//             post: '',
//         },
//         review: [
//             {
//                 avatar: Modal,
//                 name: 'Carter Dias',
//                 time: 'Sept 5. 2019 | 10:15AM',
//                 post: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat?',
//             }
//         ],
//         makeReply: [
//             {
//                 avatar: Modal,
//                 name: 'Carter Dias',
//                 time: 'Sept 5. 2019 | 10:15AM',
//                 post: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat?',
//             }
//         ],
//         reply: [
//             {
//                 avatar: Modal,
//                 name: 'Carter Dias',
//                 time: 'Sept 5. 2019 | 10:15AM',
//                 post: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat?',
//                 replyTime: 'Sept 5. 2019 | 05:25PM',
//                 reply: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.'
//             }
//         ]
//     }
//     handleInput = ({ target: { name, value } }) => {

//         let formFields = Object.assign({}, this.state.formFields)
//         formFields[name] = (value === true ? 1 : value);
//         this.setState({
//             formFields
//         })

//     }
//     handleClick = (key) => {
//         let currentIndex;
//         if (this.state.active == true) {
//             this.setState({
//                 active: false,
//                 currentIndex: '-1'
//             })
//         }
//         else {
//             this.setState({
//                 active: true,
//                 currentIndex: key
//             })
//         }
//     }
//     render() {
//         let { review, reply, makeReply, currentIndex, formFields } = this.state
//         let { post } = formFields
//         return (
//             <>
//                 <div className="review">
//                     <div className="row align-items-center">
//                         <div className="col-md-5">
//                             <h3>Customer Reviews</h3>
//                         </div>

//                         <div className="offset-4 col-3 w-100 input-search">
//                             <InputSearch
//                                 className=""
//                                 placeholder='Search'
//                                 onChange={this.handleChange} />
//                         </div>
//                     </div>
//                     <div className="mt-3">
//                         {review && review.map((data, index) => (
//                             <div className="review-area">
//                                 <div className="review-head">
//                                     <div className="avatar"><img src={data.avatar} /></div>
//                                     <div className="w-100 px-3">
//                                         <p className="reviewer">{data.name}</p>
//                                         <p className="review-time">{data.time}</p>
//                                     </div>
//                                     <div className="position-relative" onClick={() => this.handleClick(index)}>
//                                         {currentIndex == index ?
//                                             <>
//                                                 <div className="d-flex align-items-center justify-content-center horizontal-more-active"><img className="" src={MoreActive} /></div>
//                                                 <div className="option card">
//                                                     <div className="d-flex align-items-center fs-16 pt-3" onClick={() => this.props.history.push('/admin/customer/details')}><span className="icon-eye-grey px-3"></span> View </div>
//                                                     <div className="d-flex align-items-center fs-16"><span className="icon-schedule px-3"></span> Review </div>
//                                                     <div className="d-flex align-items-center fs-16 pb-3"><span className="icon-cancel-schedule px-3"></span> Delete </div>
//                                                 </div>
//                                             </>
//                                             :
//                                             <div className="d-flex align-items-center justify-content-center horizontal-more"><img className="" src={More} /></div>
//                                         }
//                                     </div>
//                                 </div>
//                                 <div className="review-post">
//                                     <p>{data.post}</p>
//                                 </div>
//                                 <div>
//                                     <NormalTextarea
//                                         placeholder="Type your reply"
//                                         value={post}
//                                         name="post"
//                                         onChange={this.handleInput}
//                                     />
//                                 </div>
//                                 <div className="col-1 p-0 mt-3">
//                                     <NormalButton
//                                         mainbg={true}
//                                         className="col-12 fs-15 "
//                                         label="Send"
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="mt-3">
//                         {makeReply && makeReply.map((data, index) => (
//                             <div className="review-area">
//                                 <div className="review-head">
//                                     <div className="avatar"><img src={data.avatar} /></div>
//                                     <div className="w-100 px-3">
//                                         <p className="reviewer">{data.name}</p>
//                                         <p className="review-time">{data.time}</p>
//                                     </div>
//                                     <div className="position-relative" onClick={() => this.handleClick(index)}>
//                                         {currentIndex == index ?
//                                             <>
//                                                 <div className="d-flex align-items-center justify-content-center horizontal-more-active"><img className="" src={MoreActive} /></div>
//                                                 <div className="option card">
//                                                     <div className="d-flex align-items-center fs-16 pt-3" onClick={() => this.props.history.push('/admin/customer/customer/details')}><span className="icon-eye-grey px-3"></span> View </div>
//                                                     <div className="d-flex align-items-center fs-16"><span className="icon-schedule px-3"></span> Review </div>
//                                                     <div className="d-flex align-items-center fs-16 pb-3"><span className="icon-cancel-schedule px-3"></span> Delete </div>
//                                                 </div>
//                                             </>
//                                             :
//                                             <div className="d-flex align-items-center justify-content-center horizontal-more"><img className="" src={More} /></div>
//                                         }
//                                     </div>
//                                 </div>
//                                 <div className="review-post">
//                                     <p>{data.post}</p>
//                                 </div>
//                                 <p className="send-reply-text">Send your Reply</p>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="mt-3">
//                         {reply && reply.map((data, index) => (
//                             <div className="review-area">
//                                 <div className="review-head">
//                                     <div className="avatar"><img src={data.avatar} /></div>
//                                     <div className="w-100 px-3">
//                                         <p className="reviewer">{data.name}</p>
//                                         <p className="review-time">{data.time}</p>
//                                     </div>
//                                     <div className="position-relative" onClick={() => this.handleClick(index)}>
//                                         {currentIndex == index ?
//                                             <>
//                                                 <div className="d-flex align-items-center justify-content-center horizontal-more-active"><img className="" src={MoreActive} /></div>
//                                                 <div className="option card">
//                                                     <div className="d-flex align-items-center fs-16 pt-3" onClick={() => this.props.history.push('/admin/customer/customer/details')}><span className="icon-eye-grey px-3"></span> View </div>
//                                                     <div className="d-flex align-items-center fs-16"><span className="icon-schedule px-3"></span> Review </div>
//                                                     <div className="d-flex align-items-center fs-16 pb-3"><span className="icon-cancel-schedule px-3"></span> Delete </div>
//                                                 </div>
//                                             </>
//                                             :
//                                             <div className="d-flex align-items-center justify-content-center horizontal-more"><img className="" src={More} /></div>
//                                         }
//                                     </div>
//                                 </div>
//                                 <div className="review-post">
//                                     <p>{data.post}</p>
//                                 </div>
//                                 <div className="reply">
//                                     <div className="reply-head">
//                                     <p className="reply-by">Your Replied</p>
//                                     <p className="reply-time">{data.replyTime}</p>
//                                     </div>
//                                     <div>
//                                         <p className="reply-msg">{data.reply}</p>
//                                     </div>
//                                 </div>
//                                 <p className="reply-again-text">Reply again?</p>
//                             </div>
//                         ))}
//                     </div>

//                 </div>
//             </>
//         );
//     }
// }