import React, { Component } from 'react';
import "./style.scss";
import { Link } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import { NormalInput, NormalSelect, NormalButton, NormalDate } from 'component/common';
import { displayImg } from 'service/helperFunctions';
import { DragFileUpload } from '../../../common';
import { addProduct } from 'redux/actions/auth'


export class CreateProduct extends Component {
    state = {
        formFields: {
            productName: '',
            productCategory: '',
            brand: '',
            productSize: '',
            productPrice: '',
            productTax: '',
            discount: '',
            productImage: '',
        },
        typeOption: [
            { label: 'All', value: 'All' },
            { label: 'A-Z', value: 'A-Z' },
            { label: 'Z-A', value: 'Z-A' },
        ],
        sizeOption: [
            { label: 'All', value: 'All' },
            { label: 'A-Z', value: 'A-Z' },
            { label: 'Z-A', value: 'Z-A' },
        ]
    };

    componentDidMount() {
        this.validator = new SimpleReactValidator({
            validators: {
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
    }

    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };

    handleInput = ({ target: { name, value } }) => {

        let formFields = Object.assign({}, this.state.formFields)
        formFields[name] = (value === true ? 1 : value);
        this.setState({
            formFields
        })

    }

    handleSubmit = () => {
        if (this.validator.allValid()) {
            let { formFields, rememberme } = this.state;
            addProduct(formFields).then((data)=>{
                console.log(data)
            })
        } else {
            this.validator.showMessages();
        }
    };

    render() {
        let { formFields, typeOption, sizeOption } = this.state;

        let { productName, productPrice, productSize, brand, productCategory, productTax, discount, productImage, bannerImg } = formFields;
        return (
            <div className="p-4 create-product">
                <h2>Add New Product</h2>
                <div className="product-detail">
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Product Name
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={productName}
                                        name="productName"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('productName', productName, 'required')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Category
                            </label>
                                <div className="input-group">
                                    <NormalSelect
                                        options={typeOption}
                                        value={productCategory}
                                        name="productCategory"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('productCategory', productCategory, 'required')}
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Brand
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={brand}
                                        name="brand"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('brand', brand, 'required')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Product Size
                            </label>
                                <div className="input-group">
                                    <NormalSelect
                                        options={sizeOption}
                                        value={productSize}
                                        name="productSize"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('productSize', productSize, 'required')}
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Product Price
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={productPrice}
                                        name="productPrice"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('productPrice', productPrice, 'required|price')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Product Tax
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={productTax}
                                        name="productTax"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('productTax', productTax, 'required|number')}
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
                                className={`file-uploader size-sm ${productImage ? "" : 'no-img'}`}
                                label="Upload Thumbnail"
                                handleFileUpload={([file]) => this.handleInput({ target: { name: "productImage", value: file } })}
                            >
                                {productImage ?
                                    <img src={displayImg(productImage)} /> :
                                    <div className="uploader-content text-center">
                                        <span>Upload Image</span>
                                    </div>
                                }
                            </DragFileUpload>
                        </div>
                    </div>
                    <div className="border-bottom-line"></div>
                    <div className="pt-5 d-flex">
                        <div className="col-2">
                            <Link to="/admin/product">
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