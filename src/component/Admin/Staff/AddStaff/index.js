import React, { Component } from 'react';
import "./style.scss";
import { Link } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import { NormalInput, NormalSelect, NormalButton, NormalDate, NormalMultiSelect, NormalDateTime } from 'component/common';
import { displayImg, dateFormat } from 'service/helperFunctions';
import { DragFileUpload } from '../../../common';
import { createStaff, getStaff, updateStaff } from 'redux/actions/staff'
import { getBranch, getJobtitle, getShift, getSkills, getCommonApi } from 'redux/actions/common'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { FormGroup, Label, Input } from 'reactstrap';

export class AddStaffClass extends Component {
    state = {
        formFields: {
            emp_name: '',
            emp_phone1: '',
            emp_joindate: '',
            defaultSiteCodeid: '',
            skills_list: '',
            emp_address: '',
            Emp_sexesid: '',
            shift: [],
            emp_dob: '',
            EMP_TYPEid: '',
            emp_pic: "",
            is_login: false,
            pw_password: "",
            LEVEL_ItmIDid: "",
            emp_email: ""
        },
        imageArray: [],
        jobOption: [],
        shiftOptions: [],
        locationOption: [],
        sexOption: [
            { value: 1, label: "Male" },
            { value: 2, label: "Female" }
        ],
        skillsOptions: [],
        selectedSkills: [],
        levelList: []
    };

    componentWillMount() {
        this.validator = new SimpleReactValidator({
            validators: {
                contactNumber: {
                    message: 'The :attribute must be a valid format.',
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(val, /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/) && params.indexOf(val) === -1
                    },
                    messageReplace: (message, params) => message.replace('', this.helpers.toSentence(params)),
                    required: true
                },
            },
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });

        // branch option api 
        this.props.getCommonApi("branchlist/").then((res) => {
            let { locationOption } = this.state;
            for (let key of res.data) {
                locationOption.push({ value: key.id, label: key.itemsite_desc })
            }
            this.setState({ locationOption })
        });

        // level option api 
        this.props.getCommonApi("securities/").then((res) => {
            let { levelList } = this.state;
            for (let key of res.data) {
                levelList.push({ value: key.id, label: key.level_name })
            }
            this.setState({ levelList })
        });

        // jobtitle option api
        this.props.getJobtitle().then(() => {
            this.getDatafromStore('jobtitle');
        });

        // get api for staff while
        if (this.props.match.params.id) {
            this.getStaffDetail();
        }

        // skills option api
        this.props.getSkills().then(() => {
            this.getDatafromStore('skills');
        });
    }

    // get api for staff
    getStaffDetail = async () => {

        let { selectedSkills, formFields } = this.state;
        await this.props.getStaff(`${this.props.match.params.id}/`).then((res) => {
            this.setDataFromStore();
        })
        await this.props.getShift(`?employee=${this.props.match.params.id}`).then(() => {
            this.getDatafromStore('shift');
            let { skillsList } = this.props;
            // for (let key of skillsList) {
            //     for (let value of formFields.skills_list) {
            //         if (key.id === value) {
            //             selectedSkills.push({ value: key.value, label: key.label })
            //         }
            //     }
            // }
            this.getDefaultSkills();
        });
        this.setState({ selectedSkills })

    }

    getDefaultSkills = () => {
        let { selectedSkills, formFields, skillsOptions } = this.state;
        selectedSkills = []
        for (let value of formFields.skills_list) {
            console.log(selectedSkills, "dfssfgsdfgsdfg", value, skillsOptions)
            for (let key of skillsOptions) {

                if (key.value === value) {
                    console.log(selectedSkills, "dfssfgsdfgsdfg =========", key, value)
                    selectedSkills.push({ value: key.value, label: key.label })
                }
            }
        }
        this.setState({ selectedSkills })
    }

    // set dropdown data from response
    getDatafromStore = async (type) => {
        let { branchList, jobtitleList, shiftList, skillsList } = this.props;
        let { jobOption, shiftOptions, locationOption, skillsOptions } = this.state;
        if (type === 'jobtitle') {
            for (let key of jobtitleList) {
                jobOption.push({ label: key.level_desc, value: key.id })
            }
        } else if (type === 'branch') {
            for (let key of branchList) {
                locationOption.push({ label: key.itemsite_desc, value: key.id })
            }
        } else if (type === 'shift') {
            for (let key of shiftList) {
                shiftOptions.push({ label: key.shift_name, value: key.id })
            }
        } else if (type === 'skills') {
            for (let key of skillsList) {
                skillsOptions.push({ value: key.id, label: key.item_desc })
            }
        }
        await this.setState({
            locationOption,
            jobOption,
            shiftOptions,
            skillsOptions
        })
        this.getDefaultSkills();
    }

    // set data to formfield from response while edit
    setDataFromStore = () => {
        let { staffDetail } = this.props;
        let { formFields } = this.state;
        // console.log("ufjdfjssd staff", staffDetail, formFields)
        formFields['emp_name'] = staffDetail.emp_name;
        formFields['emp_phone1'] = staffDetail.emp_phone1;
        formFields['emp_joindate'] = new Date(staffDetail.emp_joindate);
        formFields['defaultSiteCodeid'] = staffDetail.defaultSiteCodeid;
        formFields['skills_list'] = staffDetail.skills;
        formFields['emp_address'] = staffDetail.emp_address;
        formFields['Emp_sexesid'] = staffDetail.Emp_sexesid;
        formFields['shift'] = staffDetail.shift;
        formFields['emp_dob'] = new Date(staffDetail.emp_dob);
        formFields['EMP_TYPEid'] = staffDetail.EMP_TYPEid;
        formFields['emp_pic'] = staffDetail.emp_pic;
        this.setState({ formFields })
    }

    handleChange = ({ target: { value, name } }) => {
        let formFields = Object.assign({}, this.state.formFields);

        formFields[name] = value;

        this.setState({
            formFields,
        });
    };

    handleDatePick = async (name, value) => {
        console.log(name, value, "sdfgdfhfshg", dateFormat(new Date()))
        // dateFormat(new Date())
        let { formFields } = this.state;
        formFields[name] = value;
        // formFields[name] = value;
        await this.setState({
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

    // upload imag to formfield
    handleImageUpload = (file) => {
        let { formFields } = this.state;
        formFields['emp_pic'] = file;
        this.setState({
            formFields
        })
    }

    // remove image to formfield
    removepostImage = (e, name) => {
        let { staffImage } = this.state.formFields;
        let index = staffImage.indexOf(name);
        if (index === 0) {
            staffImage.shift();
        } else {
            staffImage.pop();
        }
        this.setState({
            staffImage
        })
    }

    // submit to create/update staff
    handleSubmit = () => {
        if (this.validator.allValid()) {
            let { formFields } = this.state;
            const formData = new FormData();
            formData.append('emp_name', formFields.emp_name)
            formData.append('emp_phone1', formFields.emp_phone1)
            formData.append('emp_joindate', dateFormat(formFields.emp_joindate))
            // if (formFields.defaultSiteCodeid === "") {
            formData.append('defaultSiteCodeid', formFields.defaultSiteCodeid)
            // }
            formData.append('skills_list', formFields.skills_list)
            formData.append('emp_address', formFields.emp_address)
            formData.append('Emp_sexesid', formFields.Emp_sexesid)
            // formData.append('shift', formFields.shift)
            formData.append('emp_dob', dateFormat(formFields.emp_dob))
            formData.append('EMP_TYPEid', formFields.EMP_TYPEid)
            formData.append('is_login', formFields.is_login)
            formData.append('pw_password', formFields.pw_password)
            formData.append('LEVEL_ItmIDid', formFields.LEVEL_ItmIDid)
            formData.append('emp_pic', formFields.emp_pic)
            formData.append('emp_email', formFields.emp_email)
            if (this.props.match.params.id) {
                this.props.updateStaff(`${this.props.match.params.id}/`, formData).then((res) => {
                    console.log(res)
                    if (res.status === 200) {
                        this.props.history.push(`/admin/staff/${res.data.id}/staffDetails`);
                    }
                })
            } else {
                this.props.createStaff(formData).then((res) => {
                    console.log(res)
                    if (res.status === 201) {
                        this.props.history.push(`/admin/staff`);
                    }
                })
            }

        } else {
            this.validator.showMessages();
        }
    };

    handleMultiSelect = (data) => {
        let { formFields } = this.state;
        let list = []
        for (let key of data) {
            list.push(key.value);
        }
        formFields['skills_list'] = list;
        this.setState({ formFields });
        console.log(formFields, "oyokkjk")
    }

    handleChangeBox = (event) => {
        let formFields = Object.assign({}, this.state.formFields);
        console.log(formFields, "oyokkjk", event.target.name, event.target)
        formFields[event.target.name] = event.target.checked;

        this.setState({
            formFields,
        });
    };

    render() {
        let { formFields, jobOption, shiftOptions, locationOption, sexOption, skillsOptions, selectedSkills, levelList } = this.state;

        let { emp_name, emp_email, emp_phone1, emp_joindate, defaultSiteCodeid, skills_list, emp_address, Emp_sexesid, shift, emp_dob, EMP_TYPEid, emp_pic, is_login, pw_password, LEVEL_ItmIDid } = formFields;
        return (
            <div className="px-5 container create-staff">
                {/* <p className="list-heading pb-4"> {id ? "Edit" : "Add"} Staff</p> */}
                <div className="head-label-nav">
                    <p className="category">Staffs </p>
                    <i className="icon-right mx-md-3"></i>
                    <p className="sub-category">Add {this.props.match.params.id ? "Edit" : "New"} Staff</p>
                </div>
                <div className="staff-detail">
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Staff Name
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={emp_name}
                                        name="emp_name"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('staff name', emp_name, 'required')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Job Title
                            </label>
                                <div className="input-group">
                                    <NormalSelect
                                        options={jobOption}
                                        value={EMP_TYPEid}
                                        name="EMP_TYPEid"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('job tilte', EMP_TYPEid, 'required')}
                            </div>

                        </div>
                    </div>
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Skills
                            </label>
                                <div className="input-group">
                                    {/* <NormalSelect
                                        options={skillsOptions}
                                        value={skills_list}
                                        name="skills_list"
                                        onChange={this.handleChange}
                                    /> */}
                                    {!this.props.match.params.id ? (skillsOptions.length > 0 ? <NormalMultiSelect name="skills_list" className={`staff-skills-select ${skills_list !== "" ? "overflow-y-set" : ""}`} options={skillsOptions} handleMultiSelect={this.handleMultiSelect}></NormalMultiSelect> : "") : (
                                        skillsOptions.length > 0 && selectedSkills.length > 0 ? <NormalMultiSelect name="skills_list" value={selectedSkills.length > 0 ? selectedSkills : []} className={`staff-skills-select ${skills_list !== "" ? "overflow-y-set" : ""}`} options={skillsOptions} handleMultiSelect={this.handleMultiSelect}></NormalMultiSelect> : ""
                                    )
                                    }
                                </div>
                                {this.validator.message('skills', skills_list, 'required')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Contact Number
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={emp_phone1}
                                        name="emp_phone1"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('phone number', emp_phone1, 'required')}
                            </div>
                        </div>
                    </div>

                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Address
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={emp_address}
                                        name="emp_address"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('address', emp_address, 'required')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Gender
                            </label>
                                <div className="input-group">
                                    <NormalSelect
                                        // placeholder="Enter here"
                                        options={sexOption}
                                        value={Emp_sexesid}
                                        name="Emp_sexesid"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('Emp_sexesid', Emp_sexesid, 'required')}
                            </div>
                        </div>
                    </div>

                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    DOB
                            </label>
                                <div className="input-group">
                                    {/* <NormalDate
                                        value={emp_dob}
                                        name="emp_dob"
                                        type="date"
                                        onChange={this.handleChange}
                                    /> */}
                                    <NormalDateTime
                                        onChange={this.handleDatePick}
                                        inputcol="p-0 inTime"
                                        // value={outTime}
                                        value={emp_dob}
                                        // label="inTime"
                                        name="emp_dob"
                                        className="dob-pick"
                                        showYearDropdown={true}
                                        dateFormat="dd/MM/yyyy" />
                                </div>
                                {this.validator.message('date of birth', emp_dob, 'required')}
                            </div>
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Starting Date
                            </label>
                                <div className="input-group">
                                    {/* <NormalDate
                                        value={emp_joindate}
                                        name="emp_joindate"
                                        type="date"
                                        onChange={this.handleChange}

                                    /> */}
                                    <NormalDateTime
                                        onChange={this.handleDatePick}
                                        inputcol="p-0 inTime"
                                        // value={outTime}
                                        value={emp_joindate}
                                        // label="inTime"
                                        name="emp_joindate"
                                        className="dob-pick"
                                        showYearDropdown={true}
                                        dateFormat="dd/MM/yyyy" />

                                </div>
                                {this.validator.message('Joined date', emp_joindate, 'required')}
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-4 pb-2">
                        <div className="row">
                            {/* <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Shift
                            </label>
                                <div className="input-group">
                                    <NormalSelect
                                        options={shiftOptions}
                                        value={shift}
                                        name="shift"
                                        disabled={!this.props.match.params.id ? true : false}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                 {this.validator.message('shift', shift, 'required')} 
                            </div> */}
                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Email
                            </label>
                                <div className="input-group">
                                    <NormalInput
                                        placeholder="Enter here"
                                        value={emp_email}
                                        name="emp_email"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('emp_email', emp_email, 'required')}
                            </div>

                            <div className="col-6">
                                <label className="text-left text-black common-label-text fs-17 pb-3">
                                    Branch / Location
                            </label>
                                <div className="input-group">
                                    <NormalSelect
                                        options={locationOption}
                                        value={defaultSiteCodeid}
                                        name="defaultSiteCodeid"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {this.validator.message('defaultSiteCodeid', defaultSiteCodeid, 'required')}
                            </div>

                            <div className="col-6 my-5">
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            onChange={this.handleChangeBox}
                                            checked={is_login}
                                            name="is_login" />{' '} Is Login
                                    </Label>
                                </FormGroup>
                            </div>
                            <div className="col-6">

                            </div>
                            {
                                is_login ? <div className="col-6">
                                    <label className="text-left text-black common-label-text fs-17 pb-3">
                                        Password
                            </label>
                                    <div className="input-group">
                                        <NormalInput
                                            placeholder="Enter here"
                                            value={pw_password}
                                            name="pw_password"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div> : ""
                            }

                            {
                                is_login ? <div className="col-6">
                                    <label className="text-left text-black common-label-text fs-17 pb-3">
                                        Category Level
                            </label>
                                    <div className="input-group">
                                        <NormalSelect
                                            options={levelList}
                                            value={LEVEL_ItmIDid}
                                            name="LEVEL_ItmIDid"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div> : ""
                            }
                        </div>
                    </div>

                    <div className="form-group mb-4 pb-2">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                            Upload Staff Photo
                    </label>
                        <div className="col-md-12 p-0">
                        <DragFileUpload
                                className={`file-uploader size-sm ${emp_pic ? "" : 'no-img'}`}
                                label="Upload Thumbnail"
                                handleFileUpload={this.handleImageUpload}
                            >
                                {emp_pic ?
                                    <>
                                        {console.log(typeof emp_pic, "kjusytdifshwosdhfs")}
                                        {typeof emp_pic == 'string' ? <img src={emp_pic} alt="" /> : <img src={displayImg(emp_pic)} alt="" />}

                                    </> :
                                    <div className="uploader-content text-center">
                                        <span>Upload Image</span>
                                    </div>
                                }
                            </DragFileUpload>
                            {/* <img src={emp_pic} alt="" /> */}
                            {this.validator.message('emp_pic', emp_pic, 'required')}
                            {/*                             
                            <div className="d-flex flex-wrap image-upload">
                                <div className="p-0" >
                                    <label for="imageUpload" class="btn cursor-pointer">Upload Image</label>
                                    <input type="file" onChange={this.uploadImageFiles} id="imageUpload" accept="image/*" className="d-none"></input>
                                </div>
                                {(emp_pic || []).map(url => (
                                    <>
                                        <div className="position-relative image-folder">
                                            <img src={url} alt="..." className="image-upload position-relative" />
                                            <div className="close-icon">
                                                <span className="icon-close fs-10" onClick={(e) => this.removepostImage(e, url)}></span>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div> */}
                            {/* <DragFileUpload /> */}
                        </div>
                    </div>
                    <div className="border-bottom-line"></div>
                    <div className="pt-5 d-flex justify-content-center">
                        <div className="col-2">
                            <Link to="/admin/staff">
                                <NormalButton label="Cancel" danger={true} className="mr-2 col-12" />
                            </Link>
                        </div>
                        <div className="col-2">
                            <NormalButton onClick={() => this.handleSubmit()} label="Save" success={true} className="mr-2 col-12" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    branchList: state.common.branchList,
    jobtitleList: state.common.jobtitleList,
    shiftList: state.common.shiftList,
    skillsList: state.common.skillsList,
    staffDetail: state.staff.staffDetail
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        createStaff,
        getBranch,
        getJobtitle,
        getShift,
        getSkills,
        getStaff,
        updateStaff,
        getCommonApi
    }, dispatch)
}

export const AddStaff = connect(mapStateToProps, mapDispatchToProps)(AddStaffClass)