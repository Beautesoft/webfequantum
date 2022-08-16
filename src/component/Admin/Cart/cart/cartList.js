import React, { Component } from 'react';
// import './style.scss';
import { InputSearch, NormalInput, NormalButton } from 'component/common';
// import { dateFormat } from 'service/helperFunctions';
import _ from 'lodash';
import { history } from 'helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common"
import SimpleReactValidator from 'simple-react-validator';
import img from 'assets/images/service1.png';

export class TreatmentClass extends Component {
    state = {
        activeTab: "treatmentDetail",
        formFields: {
            search: "",
        },
    }

    componentWillMount = () => {
        // this.getCart()
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
    }


    getDateTime = (data) => {
        let date = new Date(data)
        date = String(date).split(" ")
        let date1 = date[2] + "th " + date[1] + ", " + date[3]
        let time = date[4].split(":")
        let time1 = String(Number(time[0]) > 12 ? (Number(time[0]) - 12) : time[0]) + ":" + time[1] + (Number(time[0]) > 12 ? "PM" : "AM")
        return time1 + ", " + date1
    }

    handleSubmit = (id) => {
        history.push(`/admin/payment/${id}`)
    }

    render() {
        let { activeTab, formFields } = this.state
        return (
            <div className="col-5 ">
                <div className="treatment-section ml-1">
                    <div className="row search-bar">
                        <div className="col-6">
                            <div className="input-group">
                                <InputSearch
                                    // placeholder="Enter here"
                                    // options={outletList}
                                    value={formFields.search}
                                    name="outlet"
                                    onChange={this.handleSearch}
                                    className="search p-0"
                                />

                            </div>
                        </div>
                        <div className="col-6 d-flex">
                            <svg width="143" height="35" viewBox="0 0 143 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.25" y="0.25" width="142.5" height="34.5" fill="white" stroke="$primary-color" stroke-width="0.5" />
                                <path d="M28.336 24.128C27.2373 24.128 26.2773 23.8933 25.456 23.424C24.6453 22.944 24.0213 22.2667 23.584 21.392C23.1467 20.5173 22.928 19.4827 22.928 18.288C22.928 17.104 23.1467 16.0747 23.584 15.2C24.0213 14.3253 24.6453 13.6533 25.456 13.184C26.2773 12.7147 27.2373 12.48 28.336 12.48C29.1147 12.48 29.8347 12.6027 30.496 12.848C31.168 13.0827 31.7333 13.4293 32.192 13.888L31.616 15.104C31.0827 14.6667 30.5547 14.352 30.032 14.16C29.52 13.9573 28.96 13.856 28.352 13.856C27.168 13.856 26.2507 14.24 25.6 15.008C24.96 15.776 24.64 16.8693 24.64 18.288C24.64 19.7173 24.96 20.8213 25.6 21.6C26.2507 22.368 27.168 22.752 28.352 22.752C28.96 22.752 29.52 22.656 30.032 22.464C30.5547 22.2613 31.0827 21.9413 31.616 21.504L32.192 22.72C31.7333 23.1787 31.168 23.5307 30.496 23.776C29.8347 24.0107 29.1147 24.128 28.336 24.128ZM37.4373 24.112C36.6479 24.112 35.9546 23.9413 35.3573 23.6C34.7599 23.2587 34.2959 22.7733 33.9653 22.144C33.6453 21.5147 33.4853 20.7787 33.4853 19.936C33.4853 19.0933 33.6453 18.3573 33.9653 17.728C34.2959 17.088 34.7599 16.5973 35.3573 16.256C35.9546 15.9147 36.6479 15.744 37.4373 15.744C38.2159 15.744 38.9039 15.9147 39.5013 16.256C40.0986 16.5973 40.5573 17.088 40.8773 17.728C41.2079 18.3573 41.3733 19.0933 41.3733 19.936C41.3733 20.7787 41.2079 21.5147 40.8773 22.144C40.5573 22.7733 40.0986 23.2587 39.5013 23.6C38.9039 23.9413 38.2159 24.112 37.4373 24.112ZM37.4213 22.832C38.1679 22.832 38.7386 22.5867 39.1333 22.096C39.5279 21.6053 39.7253 20.8853 39.7253 19.936C39.7253 19.008 39.5226 18.2933 39.1173 17.792C38.7226 17.2907 38.1626 17.04 37.4373 17.04C36.7013 17.04 36.1306 17.2907 35.7253 17.792C35.3199 18.2933 35.1173 19.008 35.1173 19.936C35.1173 20.8853 35.3146 21.6053 35.7093 22.096C36.1146 22.5867 36.6853 22.832 37.4213 22.832ZM52.4621 15.744C54.2541 15.744 55.1501 16.8213 55.1501 18.976V24H53.5341V19.056C53.5341 18.3627 53.4115 17.856 53.1661 17.536C52.9315 17.216 52.5475 17.056 52.0141 17.056C51.3955 17.056 50.9048 17.2693 50.5421 17.696C50.1901 18.1227 50.0141 18.704 50.0141 19.44V24H48.3981V19.056C48.3981 18.3627 48.2755 17.856 48.0301 17.536C47.7955 17.216 47.4115 17.056 46.8781 17.056C46.2595 17.056 45.7688 17.2693 45.4061 17.696C45.0435 18.1227 44.8621 18.704 44.8621 19.44V24H43.2621V18.208C43.2621 17.3653 43.2195 16.608 43.1341 15.936H44.6381L44.7821 17.28C45.0168 16.7893 45.3528 16.4107 45.7901 16.144C46.2275 15.8773 46.7395 15.744 47.3261 15.744C48.5741 15.744 49.3901 16.2613 49.7741 17.296C50.0195 16.816 50.3768 16.4373 50.8461 16.16C51.3261 15.8827 51.8648 15.744 52.4621 15.744ZM61.7373 15.744C62.4413 15.744 63.0653 15.9147 63.6093 16.256C64.1533 16.5973 64.5746 17.0827 64.8733 17.712C65.1719 18.3413 65.3212 19.072 65.3212 19.904C65.3212 20.736 65.1666 21.472 64.8573 22.112C64.5586 22.7413 64.1373 23.232 63.5933 23.584C63.0493 23.936 62.4306 24.112 61.7373 24.112C61.1186 24.112 60.5746 23.984 60.1053 23.728C59.6466 23.4613 59.2999 23.0827 59.0653 22.592V24H57.4653V12.224H59.0653V17.264C59.2999 16.784 59.6466 16.4107 60.1053 16.144C60.5746 15.8773 61.1186 15.744 61.7373 15.744ZM61.3693 22.832C62.0946 22.832 62.6599 22.576 63.0653 22.064C63.4706 21.5413 63.6733 20.8213 63.6733 19.904C63.6733 18.9973 63.4706 18.2933 63.0653 17.792C62.6599 17.2907 62.0946 17.04 61.3693 17.04C60.6333 17.04 60.0626 17.2907 59.6573 17.792C59.2626 18.2933 59.0653 19.008 59.0653 19.936C59.0653 20.864 59.2626 21.5787 59.6573 22.08C60.0626 22.5813 60.6333 22.832 61.3693 22.832ZM70.6873 24.112C69.8979 24.112 69.2046 23.9413 68.6073 23.6C68.0099 23.2587 67.5459 22.7733 67.2153 22.144C66.8953 21.5147 66.7353 20.7787 66.7353 19.936C66.7353 19.0933 66.8953 18.3573 67.2153 17.728C67.5459 17.088 68.0099 16.5973 68.6073 16.256C69.2046 15.9147 69.8979 15.744 70.6873 15.744C71.4659 15.744 72.1539 15.9147 72.7513 16.256C73.3486 16.5973 73.8073 17.088 74.1273 17.728C74.4579 18.3573 74.6233 19.0933 74.6233 19.936C74.6233 20.7787 74.4579 21.5147 74.1273 22.144C73.8073 22.7733 73.3486 23.2587 72.7513 23.6C72.1539 23.9413 71.4659 24.112 70.6873 24.112ZM70.6713 22.832C71.4179 22.832 71.9886 22.5867 72.3833 22.096C72.7779 21.6053 72.9753 20.8853 72.9753 19.936C72.9753 19.008 72.7726 18.2933 72.3673 17.792C71.9726 17.2907 71.4126 17.04 70.6873 17.04C69.9513 17.04 69.3806 17.2907 68.9753 17.792C68.5699 18.2933 68.3673 19.008 68.3673 19.936C68.3673 20.8853 68.5646 21.6053 68.9593 22.096C69.3646 22.5867 69.9353 22.832 70.6713 22.832ZM84.2498 24.112C83.4604 24.112 82.7671 23.9413 82.1698 23.6C81.5724 23.2587 81.1084 22.7733 80.7778 22.144C80.4578 21.5147 80.2978 20.7787 80.2978 19.936C80.2978 19.0933 80.4578 18.3573 80.7778 17.728C81.1084 17.088 81.5724 16.5973 82.1698 16.256C82.7671 15.9147 83.4604 15.744 84.2498 15.744C85.0284 15.744 85.7164 15.9147 86.3138 16.256C86.9111 16.5973 87.3698 17.088 87.6898 17.728C88.0204 18.3573 88.1858 19.0933 88.1858 19.936C88.1858 20.7787 88.0204 21.5147 87.6898 22.144C87.3698 22.7733 86.9111 23.2587 86.3138 23.6C85.7164 23.9413 85.0284 24.112 84.2498 24.112ZM84.2338 22.832C84.9804 22.832 85.5511 22.5867 85.9458 22.096C86.3404 21.6053 86.5378 20.8853 86.5378 19.936C86.5378 19.008 86.3351 18.2933 85.9298 17.792C85.5351 17.2907 84.9751 17.04 84.2498 17.04C83.5138 17.04 82.9431 17.2907 82.5378 17.792C82.1324 18.2933 81.9298 19.008 81.9298 19.936C81.9298 20.8853 82.1271 21.6053 82.5218 22.096C82.9271 22.5867 83.4978 22.832 84.2338 22.832ZM93.4514 13.52C92.566 13.52 92.1234 14.0267 92.1234 15.04V15.936H94.0114V17.184H92.1234V24H90.5074V17.184H88.9554V15.936H90.5074V14.912C90.5074 14.016 90.7314 13.3333 91.1794 12.864C91.638 12.3947 92.278 12.16 93.0994 12.16C93.526 12.16 93.9154 12.2133 94.2674 12.32V13.648C93.9794 13.5627 93.7074 13.52 93.4514 13.52ZM98.9983 13.52C98.1129 13.52 97.6703 14.0267 97.6703 15.04V15.936H99.5583V17.184H97.6703V24H96.0543V17.184H94.5023V15.936H96.0543V14.912C96.0543 14.016 96.2783 13.3333 96.7263 12.864C97.1849 12.3947 97.8249 12.16 98.6463 12.16C99.0729 12.16 99.4623 12.2133 99.8143 12.32V13.648C99.5263 13.5627 99.2543 13.52 98.9983 13.52ZM108.002 20H102.242C102.295 21.888 103.154 22.832 104.818 22.832C105.746 22.832 106.594 22.528 107.362 21.92L107.858 23.072C107.495 23.392 107.031 23.648 106.466 23.84C105.911 24.0213 105.351 24.112 104.786 24.112C103.495 24.112 102.482 23.744 101.746 23.008C101.01 22.2613 100.642 21.2427 100.642 19.952C100.642 19.1307 100.802 18.4 101.122 17.76C101.452 17.12 101.911 16.624 102.498 16.272C103.084 15.92 103.751 15.744 104.498 15.744C105.586 15.744 106.439 16.096 107.058 16.8C107.687 17.504 108.002 18.48 108.002 19.728V20ZM104.53 16.944C103.922 16.944 103.426 17.1253 103.042 17.488C102.658 17.8507 102.412 18.368 102.306 19.04H106.578C106.514 18.3573 106.306 17.84 105.954 17.488C105.602 17.1253 105.127 16.944 104.53 16.944ZM113.872 15.744C114.117 15.744 114.373 15.7813 114.64 15.856L114.608 17.328C114.32 17.2213 114.005 17.168 113.664 17.168C112.928 17.168 112.373 17.392 112 17.84C111.637 18.2773 111.456 18.832 111.456 19.504V24H109.856V18.208C109.856 17.3653 109.813 16.608 109.728 15.936H111.232L111.376 17.392C111.589 16.8587 111.92 16.4533 112.368 16.176C112.816 15.888 113.317 15.744 113.872 15.744ZM118.609 24.112C117.201 24.112 116.092 23.7707 115.281 23.088L115.761 21.92C116.604 22.56 117.569 22.88 118.657 22.88C119.212 22.88 119.633 22.7893 119.921 22.608C120.209 22.416 120.353 22.1493 120.353 21.808C120.353 21.52 120.252 21.296 120.049 21.136C119.857 20.9653 119.527 20.8213 119.057 20.704L117.713 20.384C117.009 20.2347 116.471 19.9733 116.097 19.6C115.735 19.216 115.553 18.7413 115.553 18.176C115.553 17.4507 115.841 16.864 116.417 16.416C117.004 15.968 117.777 15.744 118.737 15.744C119.313 15.744 119.857 15.8347 120.369 16.016C120.892 16.1973 121.335 16.4533 121.697 16.784L121.201 17.92C120.423 17.3013 119.601 16.992 118.737 16.992C118.215 16.992 117.809 17.0933 117.521 17.296C117.233 17.488 117.089 17.76 117.089 18.112C117.089 18.3893 117.18 18.6133 117.361 18.784C117.543 18.9547 117.831 19.088 118.225 19.184L119.601 19.52C120.369 19.6907 120.935 19.9627 121.297 20.336C121.671 20.6987 121.857 21.1733 121.857 21.76C121.857 22.4853 121.564 23.0613 120.977 23.488C120.401 23.904 119.612 24.112 118.609 24.112Z" fill="$primary-color" />
                            </svg>


                            <svg width="37" height="35" viewBox="0 0 37 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.25" y="0.25" width="36.5" height="34.5" fill="white" stroke="$primary-color" stroke-width="0.5" />
                                <path d="M9.61969 6.84332H6.06769C5.57751 6.84332 5.17969 7.24115 5.17969 7.73132V11.2833C5.17969 11.7735 5.57751 12.1713 6.06769 12.1713C6.55786 12.1713 6.95569 11.7735 6.95569 11.2833V8.61932H9.61969C10.1099 8.61932 10.5077 8.2215 10.5077 7.73132C10.5077 7.24115 10.1099 6.84332 9.61969 6.84332Z" fill="$primary-color" />
                                <path d="M30.9314 22.828C30.4412 22.828 30.0434 23.2258 30.0434 23.716V26.38H27.3794C26.8892 26.38 26.4914 26.7778 26.4914 27.268C26.4914 27.7582 26.8892 28.156 27.3794 28.156H30.9314C31.4216 28.156 31.8194 27.7582 31.8194 27.268V23.716C31.8194 23.2258 31.4216 22.828 30.9314 22.828Z" fill="$primary-color" />
                                <path d="M30.9314 6.84332H27.3794C26.8892 6.84332 26.4914 7.24115 26.4914 7.73132C26.4914 8.2215 26.8892 8.61932 27.3794 8.61932H30.0434V11.2833C30.0434 11.7735 30.4412 12.1713 30.9314 12.1713C31.4216 12.1713 31.8194 11.7735 31.8194 11.2833V7.73132C31.8194 7.24115 31.4216 6.84332 30.9314 6.84332Z" fill="$primary-color" />
                                <path d="M9.61969 26.38H6.95569V23.716C6.95569 23.2258 6.55786 22.828 6.06769 22.828C5.57751 22.828 5.17969 23.2258 5.17969 23.716V27.268C5.17969 27.7582 5.57751 28.156 6.06769 28.156H9.61969C10.1099 28.156 10.5077 27.7582 10.5077 27.268C10.5077 26.7778 10.1099 26.38 9.61969 26.38Z" fill="$primary-color" />
                                <path d="M10.5079 10.3957H8.73193V24.6037H10.5079V10.3957Z" fill="$primary-color" />
                                <path d="M14.0601 10.3957H12.2841V21.0517H14.0601V10.3957Z" fill="$primary-color" />
                                <path d="M17.6124 10.3957H15.8364V21.0517H17.6124V10.3957Z" fill="$primary-color" />
                                <path d="M21.1635 10.3957H19.3875V24.6037H21.1635V10.3957Z" fill="$primary-color" />
                                <path d="M24.7151 10.3957H22.9391V21.0517H24.7151V10.3957Z" fill="$primary-color" />
                                <path d="M28.2674 10.3957H26.4914V24.6037H28.2674V10.3957Z" fill="$primary-color" />
                                <path d="M14.0601 22.828H12.2841V24.604H14.0601V22.828Z" fill="$primary-color" />
                                <path d="M17.6124 22.828H15.8364V24.604H17.6124V22.828Z" fill="$primary-color" />
                                <path d="M24.7151 22.828H22.9391V24.604H24.7151V22.828Z" fill="$primary-color" />
                            </svg>

                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.25" y="0.25" width="34.5" height="34.5" fill="white" stroke="$primary-color" stroke-width="0.5" />
                                <path d="M17.7803 23.1552L15.1553 25.7802C14.8628 26.0731 14.3873 26.0731 14.0948 25.7802L11.4698 23.1552C11.177 22.8623 11.177 22.3876 11.4698 22.0947C11.7623 21.8018 12.2378 21.8018 12.5303 22.0947L13.8751 23.4395V8.74997C13.8751 8.33597 14.2111 7.99997 14.6251 7.99997C15.0391 7.99997 15.3751 8.33597 15.3751 8.74997V23.4395L16.7198 22.0947C16.8661 21.9481 17.0581 21.875 17.2501 21.875C17.4421 21.875 17.6341 21.9481 17.7803 22.0947C18.0732 22.3876 18.0732 22.8623 17.7803 23.1552Z" fill="$primary-color" />
                                <path d="M24.5303 11.9053C24.2374 12.1981 23.7626 12.1981 23.4698 11.9053L22.125 10.5605V25.25C22.125 25.664 21.789 26 21.375 26C20.961 26 20.625 25.664 20.625 25.25V10.5605L19.2803 11.9053C18.9874 12.1981 18.5123 12.1981 18.2198 11.9053C17.9269 11.6124 17.9269 11.1376 18.2198 10.8447L20.8448 8.21975C20.9914 8.07312 21.183 8 21.375 8C21.567 8 21.7586 8.07312 21.9053 8.21975L24.5303 10.8447C24.8231 11.1376 24.8231 11.6124 24.5303 11.9053Z" fill="$primary-color" />
                            </svg>

                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.25" y="0.25" width="34.5" height="34.5" fill="white" stroke="$primary-color" stroke-width="0.5" />
                                <path d="M28 9H8L16 18.46V25L20 27V18.46L28 9Z" stroke="$primary-color" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>



                        </div>
                    </div>
                    <div className="row py-2 treatment-menu">
                        <div className="col-2 ml-2 ">
                            <div className="menus active">Services</div>
                        </div>
                        <div className="col-2 ml-2">
                            <div className="menus">Products</div>
                        </div>
                        <div className="col-2 ml-2">
                            <div className="menus">Packages</div>
                        </div>
                        <div className="col-2 ml-2">
                            <div className="menus">Prepaid</div>
                        </div>
                        <div className="col-2 ml-2">
                            <div className="menus">Vouchers</div>
                        </div>
                    </div>
                    {activeTab === "treatment" ? <div className="services  row">
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Facials</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Massages</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Facials</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Massages</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Facials</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Massages</div>
                        </div>
                    </div> : ""}
                    {activeTab === "treatmentList" ? <div className="services  row">
                        <div className="col-12">
                            <p>Treatments {'>'} Facials</p>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Facials</div>
                            <div className="title text-orenge">$217</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Massages</div>
                            <div className="title text-orenge">$217</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Facials</div>
                            <div className="title text-orenge">$217</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Massages</div>
                            <div className="title text-orenge">$217</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Facials</div>
                            <div className="title text-orenge">$217</div>
                        </div>
                        <div className="service-tab col-3 m-2">
                            <div className="images"></div>
                            <div className="title">Massages</div>
                            <div className="title text-orenge">$217</div>
                        </div>
                    </div> : ""}
                    {activeTab === "treatmentDetail" ? <div className="services  row">
                        <div className="col-12">
                            <p>Treatments {'>'} Facials {'>'} Golden Facial</p>
                        </div>
                        <div className="row m-2">
                            <div className="col-8">
                                <p className="healine">Treatment details</p>
                                <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem nunc lectus consequat amet, arcu. Tempus ante sodales turpis facilisi ut sagittis sit ac habitasse. Hendrerit nullam mi congue massa bibendum. Molestie posuere pellentesque </p>
                            </div>
                            <div className="col-4">
                                <img src={img} alt=""></img>
                            </div>
                        </div>
                        <div className="row m-2">
                            <div className="col-8">
                                <p className="healine">Procedure</p>
                                <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem nunc lectus consequat amet, arcu. Tempus ante sodales tu </p>
                            </div>
                            <div className="col-4">
                                <img src={img} alt=""></img>
                            </div>
                        </div>
                        <div className="row m-2">
                            <div className="col-8">
                                <p className="healine">Products used</p>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Select your choices"
                                        // options={outletList}
                                        value={formFields.search}
                                        name="outlet"
                                        onChange={this.handleSearch}
                                        className="search p-0"
                                    />
                                </div>
                                <p className="healine mt-4">Recurring appointment</p>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter no. of recurrings"
                                        // options={outletList}
                                        value={formFields.search}
                                        name="outlet"
                                        onChange={this.handleSearch}
                                        className="search p-0"
                                    />
                                </div>
                                </div>
                                <div className="col-4">
                                    <img src={img} alt=""></img>
                                </div>
                                <div className="col-12 text-center select-treatment py-2">
                                    <NormalButton
                                        buttonClass={"detail-button"}
                                        // mainbg={true}
                                        className="col-12 fs-15 "
                                        label="Detail"
                                        outline={true}
                                        onClick={() => this.handleSubmit()}
                                    />
                                </div>
                            </div>
                        {/* </div> */}
                    </div> : ""}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    selected_cstomer: state.common.selected_cstomer,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getCommonApi
    }, dispatch)
}

export const Treatment = connect(mapStateToProps, mapDispatchToProps)(TreatmentClass)