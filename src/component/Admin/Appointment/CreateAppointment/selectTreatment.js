import React, { Component } from 'react';
import { NormalSelect, NormalButton, NormalModal, NormalInput } from 'component/common';
import './style.scss';
import { updateForm, getSelectedTreatmentList } from 'redux/actions/appointment';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import SimpleReactValidator from 'simple-react-validator';
import closeIcon from 'assets/images/close.png';
import { getCommonApi, commonCreateApi } from 'redux/actions/common';
import { dateFormat } from 'service/helperFunctions';
import { history } from 'helpers';
import _ from 'lodash';
import { TableWrapper } from 'component/common';
import {TreatmentPackage} from './modal/TreatmentPackage'

export class SelectTreatmentClass extends Component {
    state = {
        treatmentDetail: [],
        formFields: {
            start_time: "",
            end_time: "",
            Item_Codeid: null,
            add_duration: "",
            emp_no: [],
            requesttherapist: true,
            Item_CodeName: ""
        },
        selectedList: [
            {
                start_time: "",
                end_time: "",
                Item_Codeid: null,
                add_duration: "",
                emp_no: [],
                requesttherapist: false
            }
        ],
        outletOption: [],
        staffOption: [],
        roomOption: [],
        list: [],
        isOpenModal: false,
        categoryList: [],
        treatmentList: [],
        siteList: [],
        treatmentField: {
            category: "",
            treatment: "",
        },
        timeDropdown: [],
        duration: [],
        index: null,
        search: "",
        selectTreatmentId: "",
        treatmentListHeader: [
            { label: 'Category', className: "w-50" },
            { label: 'Service', className: "w-75"},
            { label: 'Duration', className: "w-25" },
            { label: 'price', className: "w-50" },            
        ],
        meta: {},
        isTreatementModal: false
    }
    componentDidMount(){
        this.search({})
    }
    componentWillMount() {
        this.validator = new SimpleReactValidator({
            element: message => <span className="error-message text-danger validNo fs14">{message}</span>,
            autoForceUpdate: this,
        });
        let { appointmentDetail, categoryList, staffOption, selectedList, formFields, duration } = this.state;
        // this.props.getSelectedTreatmentList(`?appt_id=${appointmentDetail.id}`).then((res) => {
        //     console.log("namekkuhkjn", res)
        // })
        let { basicApptDetail } = this.props;
        formFields['start_time'] = basicApptDetail ? basicApptDetail.time : "";
        selectedList[0]['start_time'] = basicApptDetail ? basicApptDetail.time : "";
        this.setState({
            formFields,
            selectedList
        })

        this.props.getCommonApi(`itemdept/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    categoryList.push({ value: value.id, label: value.itm_desc })
                }
                this.setState({ categoryList })
            }
        })
        this.props.getCommonApi(`appointment/Staffs/?Outlet=${basicApptDetail.branchId}&date=${dateFormat(new Date())}`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    staffOption.push({ value: value.id, label: value.emp_name })
                }
                this.setState({ staffOption })
            }
        })
        this.props.getCommonApi(`treatment/Duration/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                for (let value of data) {
                    duration.push({ value: value, label: value })
                }
                this.setState({ duration })
            }
        })
        this.getStaffAvailability();
    }

    getStaffAvailability = () => {
        this.props.getCommonApi(`staffsavailable/?Appt_date=${dateFormat(new Date(), "yyyy-mm-dd")}`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                // for (let value of data) {
                //     staffList.push({ value: value.id, label: value.emp_name })
                // }
                this.setState({ list: data })
            }
        })
    }

    handleSearch = (event) => {
        event.persist();
        console.log(event.target.value, event.target, event, "dfhdfjghkjfghj")
        let { treatmentField } = this.state;
        treatmentField['treatment'] = event.target.value;
        this.setState({ search: event.target.value, treatmentField })
        if (!this.debouncedFn) {
            this.debouncedFn = _.debounce(() => {
                let searchString = event.target.value;
                 let data = { search: searchString }
                // this.queryHandler(data)
                let { customerList } = this.state;
                let { basicApptDetail } = this.props;
                this.search(data)
            }, 500);
        }
        this.debouncedFn();
    }

    search = (data) => {    
        let { page = 1, limit = 10, search = "" } = data
        let {selectTreatmentId } = this.state;
        this.props.getCommonApi(`stocklist/?Item_Deptid=${selectTreatmentId}&search=${search}&page=${page}&limit=${limit}`).then((res) => {
          console.log(res)
            if (res.status === 200) {
                this.setState({ treatmentList: res.data.dataList, meta: res.data.meta.pagination  })
            }
        })
    }
    
    handlePagination = (page) => {
        this.search(page)
    }

    handleChangeTreatment = async ({ target: { value, name } }) => {
        let { treatmentField, treatmentList, search, selectTreatmentId } = this.state;
        console.log("uihwkjrwkej", name, value)
        treatmentField[name] = value;
        if (name === "category") {
            selectTreatmentId = value;
        } else if( name==="treatment"){
            search = value;
        }
        await this.setState({
            treatmentField,
            selectTreatmentId,
            search
        });

        let page = 1, limit = 10
        this.props.getCommonApi(`stocklist/?Item_Deptid=${selectTreatmentId}&search=${search}&page=${page}&limit=${limit}`).then((res) => {
            console.log(res)
              if (res.status === 200) {
                  this.setState({ treatmentList: res.data.dataList, meta: res.data.meta.pagination  })
              }
          })
    };

    handleChange = async ({ target: { value, name } }, index) => {
        let { formFields, selectedList } = this.state;
        console.log("hgjfgjfcghfghfgh", name, value, index)
        if (selectedList.length > 0 && selectedList.length !== (index + 1)) {
            console.log("hgjfgjfcghfghfgh indexed", name, value, index)
            selectedList[index][name] = value;
            if(name==="add_duration"){
                selectedList[index]['end_time'] = this.addTimes(selectedList[index]["start_time"], value);
                selectedList[index+1]["start_time"] = selectedList[index]['end_time'];
            }
            await this.setState({
                selectedList,
            });
            await this.props.updateForm('treatmentList', selectedList)
        } else {
            console.log("hgjfgjfcghfghfgh else", name, value, index)
            formFields[name] = value;
            if(name==="add_duration"){
                formFields['end_time'] = this.addTimes(formFields["start_time"], value)
            }
            await this.setState({
                formFields,
            });
            selectedList.splice((selectedList.length - 1), 1);
            selectedList.push(formFields);
            await this.setState({
                selectedList,
            });
            await this.props.updateForm('treatmentList', selectedList)
        }
    };

    handleMultiSelect = (data) => {
        let { formFields } = this.state;
        let list = []
        for (let key of data) {
            list.push(key.value);
        }
        formFields['emp_no'] = list;
        this.setState({ formFields });
        console.log(formFields, "oyokkjk")
    }

    handleSubmit = () => {
        // this.props.handleConfirmBooking()
        let { appointmentCustomerDetail, appointmentTreatmentList } = this.props;
        console.log(appointmentCustomerDetail, appointmentTreatmentList, "sdfgdfsdggf")
        let data = {
            Appointment: {
                appt_date: dateFormat(new Date(appointmentCustomerDetail.appointmentDate), "yyyy-mm-dd"),
                Appt_typeid: appointmentCustomerDetail.Appt_typeid,
                cust_noid: appointmentCustomerDetail.customerName,
                new_remark: appointmentCustomerDetail.new_remark,
                // emp_noid: appointmentCustomerDetail.emp_id,
                Source_Codeid: appointmentCustomerDetail.Source_Codeid,
                Room_Codeid: appointmentCustomerDetail.Room_Codeid,
                appt_status: appointmentCustomerDetail.bookingStatus,
                sec_status: appointmentCustomerDetail.sec_status,
                ItemSite_Codeid: appointmentCustomerDetail.ItemSite_Codeid
            },
            Treatment: appointmentTreatmentList
        }
        if(appointmentCustomerDetail.customerName && appointmentCustomerDetail.bookingStatus){
        this.props.commonCreateApi(`appointment/`, data).then(async (res) => {
            if (res.status === 201) {
                await this.props.updateForm('treatmentList', [])
                await this.props.updateForm('basicApptDetail', {})
                await this.props.updateForm('appointmentCustomerDetail', {})
                history.push('/admin/appointment')
            }
        })
    } else {
        this.props.showErrorMessage();
    }
    }

    getDateTime = (data) => {
        let date = new Date(data)
        date = String(date).split(" ")
        let date1 = date[2] + "th " + date[1] + ", " + date[3]
        let time = date[4].split(":")
        let time1 = String(Number(time[0]) > 12 ? (Number(time[0]) - 12) : time[0]) + ":" + time[1] + (Number(time[0]) > 12 ? "PM" : "AM")
        return time1 + ", " + date1
    }

    handleDialog = () => {
        this.setState({ isOpenModal: false, index: null });
    }

    handleMultipleCustomer = () => {
        this.setState({ isOpenModal: false });
    }

    handleSelectPackage = async (data) => {
        debugger
        let { formFields, selectedList, index} = this.state;
        if(selectedList.length===1 || selectedList.length===index+1){
            formFields["start_time"] = formFields["start_time"];
            formFields["end_time"] = this.addTimes(formFields["start_time"], data.add_duration);
            formFields["Item_Codeid"] = data.id;
            formFields["Item_CodeName"] = data.item_desc;
            formFields["add_duration"] = data.add_duration;
            await this.setState({
                formFields,
            });
        }
            if(selectedList.length>index+1) {
                var listCount =  selectedList.length - 1;
                selectedList[listCount]["end_time"] = this.addTimes(selectedList[listCount]["start_time"], data.add_duration);
                selectedList[listCount]["Item_Codeid"] = data.id;
                selectedList[listCount]["Item_CodeName"] = data.item_desc;
                selectedList[listCount]["add_duration"] = data.add_duration;
            await this.setState({
                selectedList,
            });
        }
        selectedList.splice((selectedList.length - 1), 1);
        selectedList.push(formFields);
        await this.setState({
            selectedList,
        });
        await this.props.updateForm('treatmentList', selectedList)
        this.setState({ isOpenModal: false })
    }
    handleSelectTreatment = async (data) => {
        let { treatmentList } = this.state;        
        let { formFields, selectedList, index} = this.state;
        console.log("uihwkjrwkej", selectedList.length, "===", index)
        if(selectedList.length===1 || selectedList.length===index+1){

            formFields["start_time"] = formFields["start_time"];
            formFields["end_time"] = this.addTimes(formFields["start_time"], data.add_duration);
            formFields["Item_Codeid"] = data.id;
            formFields["Item_CodeName"] = data.item_desc;
            formFields["add_duration"] = data.add_duration;
            await this.setState({
                formFields,
            });
        }
        console.log(index)
        if(selectedList.length>index+1) {
            selectedList[index]['Item_CodeName'] = data.item_desc;
            selectedList[index]["Item_Codeid"] = data.id;
            selectedList[index]["add_duration"] = data.add_duration;
            await this.setState({
                selectedList,
            });
        }
        
        selectedList.splice((selectedList.length - 1), 1);
        selectedList.push(formFields);
        await this.setState({
            selectedList,
        });
        // console.log("uihwkjrwkej", data, selectedList)
        await this.props.updateForm('treatmentList', selectedList)
        this.setState({ isOpenModal: false })
    }

    timeToMins = (time) => {
        var b = time.split(':');
        return b[0] * 60 + +b[1];
    }

    // Convert minutes to a time in format hh:mm
    // Returned value is in range 00  to 24 hrs
    timeFromMins = (mins) => {
        function z(n) { return (n < 10 ? '0' : '') + n; }
        var h = (mins / 60 | 0) % 24;
        var m = mins % 60;
        return z(h) + ':' + z(m);
    }

    // Add two times in hh:mm format
    addTimes = (t0, t1) => {
        return this.timeFromMins(this.timeToMins(t0) + this.timeToMins(t1));
    }

    handleAddtreatment = async () => {
        let { selectedList, formFields } = this.state;
        formFields = {
            start_time: selectedList[selectedList.length - 1].end_time,
            end_time: "",
            Item_Codeid: null,
            add_duration: "",
            emp_no: [],
            requesttherapist: false
        };
        selectedList.push({
            start_time: selectedList[selectedList.length - 1].end_time,
            end_time: "",
            Item_Codeid: 1,
            Item_CodeName: "",
            add_duration: "",
            emp_no: [],
            requesttherapist: false
        })

        await this.setState({ selectedList, formFields });

        await this.props.updateForm('treatmentList', selectedList)
    }

    deleteTreatment = async (index) => {
        let { selectedList } = this.state;
        selectedList.splice(index, 1);
        this.setState({ selectedList });
        await this.props.updateForm('treatmentList', selectedList)
    }

    handleTreatementmodal = () => {
        this.setState((prevState) => ({
            isTreatementModal: !prevState.isTreatementModal, 
        }));
    }

    render() {
        let { outletOption, staffOption, roomOption, selectedList, siteList, list, formFields, timeDropdown, duration, isOpenModal, treatmentField, treatmentList = [], categoryList, treatmentListHeader, meta, isTreatementModal } = this.state
        let { customerDetail, selectedTreatmentList, customerId } = this.props;
        let { outlet, staff, rooms } = customerDetail;
        return (
            <div className="create-appointment select-treatment-appointment">
                <div className="row">

                    <div className=" col-md-12">
                        <div className="appointment">

                            <div className="appointment-holder">
                                <div className="treatment-section">
                                    <div className="select-treatment select-list w-100">

                                        <div className="row selected selected-header mb-4">
                                            {/* <div className="col-7 p-0">
                                                <div className="row"> */}
                                            <div className="col-1 p-0">
                                                Start
                                                    </div>
                                            <div className="col-1 p-0">
                                                End
                                                    </div>
                                            <div className="col-5 p-0 header-detail">
                                                Services
                                                    </div>
                                            {/* </div>
                                            </div> */}
                                            {/* <div className="col-3 p-0">
                                                <div className="row"> */}
                                            <div className="col-2 p-0 header-detail">
                                                Duration

                                                    </div>
                                            <div className="col-2 p-0">
                                                Treatment staff
                                                    </div>
                                            {/* </div>
                                            </div> */}
                                            {/* <div>

                                            </div> */}
                                        </div>
                                        {selectedList.length > 0 ? selectedList.map((item, index) => {
                                            return (
                                                <div className="row selected  mb-4">
                                                    {/* <div className="col-7 p-0">
                                                        <div className="row"> */}
                                                    <div className="col-1 mr-1 p-0">
                                                        {/* <NormalSelect
                                                                    // placeholder="Enter here"
                                                                    options={timeDropdown}
                                                                    value={item.start_time}
                                                                    name="start_time"
                                                                    onChange={this.handleChange}
                                                                    className="customer-name p-0"
                                                                /> */}

                                                        <NormalInput
                                                            placeholder="start"
                                                            // options={timeDropdown}
                                                            value={item.start_time}
                                                            name="start_time"
                                                            onChange={this.handleChange}
                                                            className="customer-name p-0"
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="col-1 mr-1 p-0">
                                                        {/* <NormalSelect
                                                                    // placeholder="Enter here"
                                                                    options={timeDropdown}
                                                                    value={item.end_time}
                                                                    name="end_time"
                                                                    onChange={this.handleChange}
                                                                    className="customer-name p-0"
                                                                /> */}
                                                        <NormalInput
                                                            placeholder="end"
                                                            // options={timeDropdown}
                                                            value={item.end_time}
                                                            name="end_time"
                                                            onChange={this.handleChange}
                                                            className="customer-name p-0"
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="col-5 mr-1 p-0">
                                                        <div className="header-detail"></div>
                                                        <NormalInput
                                                            placeholder="service"
                                                            // options={siteList}
                                                            value={item.Item_CodeName}
                                                            name="Item_CodeName"
                                                            onClick={() => this.setState({ isOpenModal: true, index: index })}
                                                            className="customer-name p-0 px-2"
                                                        />
                                                        {/* </div>
                                                        </div> */}
                                                    </div>
                                                    {/* <div className="col-3 p-0">
                                                        <div className="row"> */}
                                                    <div className="col-2 mr-1 p-0 header-detail">
                                                        <NormalSelect
                                                            // placeholder="Enter here"
                                                            options={duration}
                                                            value={item.add_duration}
                                                            name="add_duration"
                                                            onChange={(e)=>this.handleChange(e, index)}
                                                            className="customer-name p-0"
                                                        />

                                                    </div>
                                                    <div className="col-2 p-0">
                                                        <NormalSelect
                                                            // placeholder="Enter here"
                                                            options={staffOption}
                                                            value={item.emp_no}
                                                            name="emp_no"
                                                            onChange={(e) => this.handleChange(e, index)}
                                                            className="customer-name p-0"
                                                        />

                                                    </div>
                                                    {selectedList.length === index + 1 ?
                                                        <div className="ml-3" onClick={this.handleAddtreatment}>
                                                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect width="31" height="30" fill="#F9F9F9" />
                                                                <path d="M15 8V22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                                                                <path d="M8 15H22" stroke="#848484" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                        </div> : <img width="25" height="25" onClick={() => this.deleteTreatment(index)} className="ml-3" src={closeIcon} alt="" />}
                                                </div>
                                            )
                                        }) : ""}

                                        <div className="confirm confirm-selected mt-5">
                                            <div className="row">
                                                <NormalButton
                                                buttonClass={"treatment"}
                                                mainbg={true}
                                                className="col-12 mr-4 fs-15 "
                                                label="Treatment Package"
                                                onClick={this.handleTreatementmodal}
                                            />
                                            <NormalButton
                                                buttonClass={"treatment"}
                                                mainbg={true}
                                                className="col-12 mr-4 ml-4 fs-15 "
                                                label="cancel"
                                                onClick={() => history.push('/admin/appointment')}
                                            />
                                            <NormalButton
                                                buttonClass={"treatment"}
                                                mainbg={true}
                                                className="col-12 ml-5 fs-15 "
                                                label="Confirm Booking"
                                                onClick={this.handleSubmit}
                                            />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                <NormalModal className={"multiple-appointment select-category"} style={{ minWidth: "800px" }} modal={isOpenModal} handleModal={this.handleDialog}>
                    <img onClick={this.handleDialog} className="close" src={closeIcon} alt="" />
                    <div className="customer-list container">                  
                        <div className="col-12 pl-0 mb-3 fs-18 py-2">
                            Select Treatment
                        </div>
                        <div className="col-12">
                            <div className='row'>
                        <div className='col-6'>
                        Category
                        <NormalSelect
                            // placeholder="Enter here"
                            options={categoryList}
                            value={treatmentField.category}
                            name="category"
                            onChange={this.handleChangeTreatment}
                            className="customer-name p-0"
                        />
                        </div>
                        <div className='col-6'>
                        Service
                        <input
                            // placeholder="Enter here"
                            // options={siteList}
                            value={treatmentField.treatment}
                            name="treatment"
                            onChange={this.handleSearch}
                            className="search px-3 p-0"
                        />
                        </div>
                        </div>
                        </div>
                       
                        <div className="table-container table-responsive mt-3">
                        <TableWrapper
                                    headerDetails={treatmentListHeader}
                                    queryHandler={this.handlePagination}
                                    pageMeta={meta}
                                >
                            {treatmentList.length > 0 ? treatmentList.map((item, index) => {
                                return (
                                    <tr className='w-100' onClick={() => this.handleSelectTreatment(item)} key={index}>
                                       <td> <div className="d-flex align-items-center justify-content-center">{item.Item_Class}</div></td>
                                       <td> <div className="d-flex align-items-center justify-content-center">{item.item_desc}</div></td>
                                       <td> <div className="d-flex align-items-center justify-content-center">{item.add_duration}</div></td>
                                       <td> <div className="d-flex align-items-center justify-content-center">{item.item_price}</div></td>
                                    </tr>
                                )
                            }) : <td><div className="d-flex align-items-center justify-content-center">No data available</div></td>}
                        </TableWrapper>
                        </div>
                        
                        <div className="row text-center justify-center w-100">

                            <NormalButton
                                buttonClass={"col-3"}
                                mainbg={true}
                                className="col-12 ml-4 fs-15 "
                                label="Cancel"
                                onClick={this.handleDialog}
                            />
                        </div>

                    </div>
                </NormalModal>
                <div className='col-12'>
                {
                    isTreatementModal ? <TreatmentPackage isTreatementModal={isTreatementModal} handleTreatementmodal = {this.handleTreatementmodal}  handleSelectPackage={this.handleSelectPackage} customerId = {customerId} /> : ''
                    
                }
            </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
    appointmentDetail: state.appointment.appointmentDetail,
    selectedTreatmentList: state.appointment.selectedTreatmentList,
    basicApptDetail: state.appointment.basicApptDetail,
    appointmentCustomerDetail: state.appointment.appointmentCustomerDetail,
    appointmentTreatmentList: state.appointment.appointmentTreatmentList,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        updateForm,
        getSelectedTreatmentList,
        getCommonApi,
        commonCreateApi
    }, dispatch)
}

export const SelectTreatment = connect(mapStateToProps, mapDispatchToProps)(SelectTreatmentClass)