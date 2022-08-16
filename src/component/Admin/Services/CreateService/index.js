import React, { Component } from 'react';
import "./style.scss";
import { Link } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import { NormalInput, NormalSelect, NormalButton } from 'component/common';
import { displayImg } from 'service/helperFunctions';
import { DragFileUpload } from '../../../common';
import { createServices, getServices, updateServices } from 'redux/actions/services';
import { getCategory } from 'redux/actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

export class CreateServiceClass extends Component {
    state = {
        formFields: {
            Course: '',
            category: '',
            Price: '',
            service_tax: '',
            discount: '',
            image: '',
        },
        categoryOption: [],
        bannerImg: '',
    };

    componentWillMount() {
        this.validator = new SimpleReactValidator({
            validators: {
                // validations here
                price: {
                    message: 'The :attribute must be a number format.',
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(val, /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/) && params.indexOf(val) === -1
                    },
                    messageReplace: (message, params) => message.replace('', this.helpers.toSentence(params)),
                    required: true
                },
                number: {
                    message: 'The :attribute must be a number format.',
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(val, /^[0-9\b]+$/) && params.indexOf(val) === -1
                    },
                    messageReplace: (message, params) => message.replace('', this.helpers.toSentence(params)),
                    required: true
                },

            },

            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        
        // get api for category option
        this.props.getCategory().then(() => {
            console.log("dfsdfsdf")
            this.getDatafromStore();
        });

        if (this.props.match.params.id) {
            this.getServicesDetail();

            // this.props.getShift(`?employee=${this.props.match.params.id}`).then(() => {
            //     this.getDatafromStore('shift');
            // });
        }
    }

    // get services detail
    getServicesDetail = () => {
        this.props.getServices(`${this.props.match.params.id}/`).then((res) => {
            this.setDataFromStore();
        })
    }

    // set data to formfield while edit services
    setDataFromStore = () => {
        let { servicesDetail } = this.props;
        let { formFields } = this.state;
        formFields['Course'] = servicesDetail.Course;
        formFields['category'] = servicesDetail.category;
        formFields['Price'] = parseFloat(servicesDetail.Price).toFixed(2);
        formFields['service_tax'] = Number(servicesDetail.service_tax);
        formFields['discount'] = Number(servicesDetail.discount);
        // formFields['image'] = servicesDetail.image;
        this.setState({ formFields })
        console.log("ufjdfjssd services", servicesDetail, formFields)
    }

    // dropdown option from api
    getDatafromStore = () => {
        let { categoryList } = this.props;
        let { categoryOption } = this.state;
        for (let key of categoryList) {
            categoryOption.push({ label: key.itm_desc, value: key.id })
        }
        this.setState({
            categoryOption
        })
    }

    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };

    //  image upload for formfield
    handleInput = ({ target: { name, value } }) => {
        let formFields = Object.assign({}, this.state.formFields)
        if (name === "image") {
            let img = new FormData()
            img.append("image", value)
        }
        formFields[name] = (value === true ? 1 : value);
        this.setState({
            formFields
        })
    }

    // submit service create/update api
    handleSubmit = () => {
        if (this.validator.allValid()) {
            let { formFields } = this.state;
            const formData = new FormData();
            formData.append('image', formFields.image)
            formData.append('Course', formFields.Course)
            formData.append('category', formFields.category)
            formData.append('item_price', formFields.Price)
            formData.append('tax', formFields.service_tax)
            formData.append('discount', formFields.discount)
            if (this.props.match.params.id) {
                this.props.updateServices(`${this.props.match.params.id}/`, formData).then((res) => {
                    console.log(res)
                    if(res.status===201){
                        this.props.history.push(`/admin/staff`);
                    }
                })
            } else {
                this.props.createServices(formData).then((res) => {
                    console.log(res)
                    if(res.status===201){
                        this.props.history.push(`/admin/staff`);
                    }
                })
            }

        } else {
            this.validator.showMessages();
        }
    };


    handleImageUpload = (file) => {
        let { formFields } = this.state;
        formFields['image'] = file;
        this.setState({
            formFields
        })
    }

    render() {
        let { formFields, categoryOption, bannerImg } = this.state;

        let {
            Course,
            category,
            Price,
            service_tax,
            discount,
            image } = formFields;

        return (
            <div className="p-4 create-service">
                <h2>Add New Service</h2>
                <div className="service-detail">
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Service Name
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={Course}
                                        name="Course"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('Course', Course, 'required')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Category
                            </label>
                                <div className="input-group category-select">
                                    <NormalSelect
                                        options={categoryOption}
                                        value={category}
                                        name="category"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('category', category, 'required')}
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Service Price
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={Price}
                                        name="Price"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('Price', Price, 'required|price')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Service Tax
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={service_tax}
                                        name="service_tax"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('service_tax', service_tax, 'required|currency')}
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Discount
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={discount}
                                        name="discount"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('discount', discount, 'required|number')}
                            </div>

                        </div>
                    </div>

                    <div className="form-group mb-4 pb-2">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                            Upload Images
                    </label>
                        <div className="col-md-12 p-0">
                            <DragFileUpload
                                className={`file-uploader size-sm ${image ? "" : 'no-img'}`}
                                label="Upload Thumbnail"
                                handleFileUpload={this.handleImageUpload}
                            >
                                {image ?
                                    <img src={displayImg(image)} alt="" /> :
                                    <div className="uploader-content text-center">
                                        <span>Upload Image</span>
                                    </div>
                                }
                            </DragFileUpload>
                            {!this.props.match.params.id ? this.validator.message('image', image, 'required') : ""}
                        </div>
                    </div>
                    <div className="border-bottom-line"></div>
                    <div className="pt-5 d-flex">
                        <div className="col-2">
                            <Link to="/admin/service">
                                <NormalButton label="Cancel" normal={true} className="mr-2 col-12" />
                            </Link>
                        </div>
                        <div className="col-2">
                            <NormalButton onClick={() => this.handleSubmit()} label="Save" mainbg={true} className="mr-2 col-12" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    categoryList: state.common.categoryList,
    servicesDetail: state.services.servicesDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        createServices,
        getCategory,
        getServices,
        updateServices
    }, dispatch)
}

export const CreateService = connect(mapStateToProps, mapDispatchToProps)(CreateServiceClass)