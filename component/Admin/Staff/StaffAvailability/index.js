import React from 'react';
import { NormalButton } from 'component/common';
import { InputSearch } from 'component/common';
// import Modal from '../../../../assets/images/modal-avatar.png';
import './style.scss'
import { getStaffAvailability } from 'redux/actions/staff';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import _ from 'lodash';

export class StaffAvailabilityClass extends React.Component {
    state = {
        headerDetails: [],
        dateArray: [],
        timeAvailable: [],
        workSchedule: [
            { label: 'No.Of Days Worked', data1: '7', data2: '7', data3: '7', data4: '7', data5: '7', data6: '7', data7: '7', data8: '7', data9: '7' },
            { label: 'Hours Worked', data1: '84.5', data2: '84.5', data3: '84.5', data4: '84.5', data5: '84.5', data6: '84.5', data7: '84.5', data8: '84.5', data9: '84.5' },
            { label: 'Late Entry', data1: '0', data2: '0', data3: '0', data4: '0', data5: '0', data6: '0', data7: '0', data8: '0', data9: '0' },
            { label: 'Overtime Hours', data1: '0.5', data2: '0.5', data3: '0.5', data4: '0.5', data5: '0.5', data6: '0.5', data7: '0.5', data8: '0.5', data9: '0.5' },
            { label: 'Early Release', data1: '0', data2: '0', data3: '0', data4: '0', data5: '0', data6: '0', data7: '0', data8: '0', data9: '0' },
        ],
        data: []
    }

    componentDidMount() {
        this.queryHandler({});
    }

    // get api call for staff availability
    queryHandler = (data) => {
        let { page = 1, limit = 10, search = "" } = data
        let { headerDetails, dateArray, timeAvailable } = this.state;
        this.props.getStaffAvailability(`?page=${page}&limit=${limit}&search=${search}`).then((res) => {
            console.log(res, "dsfdfaafg", Object.keys(res.data.dataList[0])[0])
            this.setState({data:res.data.dataList})
            for(let key of res.data.dataList[0][Object.keys(res.data.dataList[0])[0]]){
                
                
                headerDetails.push({ avatar: key.emp_img, name: key.emp_name })
                this.setState({headerDetails})
            }
            for(let key of Object.keys(res.data.dataList[0])){
                dateArray.push({ date: key,})
                this.setState({dateArray})
            }
            for(let key of Object.keys(res.data.dataList[0])){
                console.log(key, "kasdfiuashdf", res.data.dataList[0][key])
                timeAvailable.push(res.data.dataList[0][key])
                this.setState({timeAvailable})
            }
        })
    }

    // pagianation
    handlePagination = (page) => {
        this.queryHandler(page)
    }

    // search api call and change field
    handlesearch = (event) => {
        event.persist();

        if (!this.debouncedFn) {
            this.debouncedFn = _.debounce(() => {
                let searchString = event.target.value;
                let data = { search: searchString }
                this.queryHandler(data)
            }, 500);
        }
        this.debouncedFn();
    }

    render() {
        let { headerDetails, dateArray, workSchedule, timeAvailable } = this.state;
        return (
            <>
                <div className="staff-availability container">
                    <div className="row">
                        <div className="col-md-7 detail">
                            {/* <div className="detail"> */}
                            <p className="category" onClick={() => this.props.history.push('/admin/staff')}>Staffs </p>
                            <i className="icon-right mx-md-3"></i>
                            <p className="sub-category">Staffs  Availability</p>
                            {/* </div> */}
                        </div>
                        <div className="col-md-5">
                            <div className="d-flex justify-content-between">
                                <div className="input-container">
                                    <InputSearch
                                        className=""
                                        placeholder='Search Staff'
                                        onChange={this.handleChange} />
                                </div>

                                <div className="w-100 col-4 ml-md-4 p-0">
                                    <NormalButton
                                        mainbg={true}
                                        className="col-12 fs-15 float-right"
                                        label="Add Staff"
                                        onClick={() => this.props.history.push('/admin/staff/add')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-table-content">
                        <div className="py-4">
                            <div className="table-container">
                                <div className="maintable table-container">
                                    <div className="maintable-content table-responsive ">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="date-title"><div>Date</div></th>
                                                    {headerDetails && headerDetails.map(({ avatar, name }, index) => (
                                                        <th key={index}>
                                                            <div className="table-head-available">
                                                                <img src={avatar} alt=""/>
                                                                <p>{name} </p>
                                                            </div>
                                                        </th>
                                                    ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dateArray && dateArray.map((data, index) => (

                                                    <tr>
                                                        <td className="d-flex align-items-center justify-content-between">
                                                            <div className="date-available ml-3">{data.date}</div>
                                                            <div className="in-out">
                                                                <p>In</p>
                                                                <p>Out</p>
                                                            </div>
                                                        </td>
                                                        {console.log(timeAvailable, "lskjdflkjpodf", index)}
                                                        {timeAvailable.length > index ? timeAvailable[index].map((value, key) => (
                                                            <td key={key}>
                                                                <div className="data-available">{value.in_val}</div>
                                                                <div className="data-available">{value.out_val}</div>
                                                            </td>
                                                        )):""}
                                                    </tr>

                                                ))}


                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-container work-schedule">
                        <table className="table">
                            <tbody>
                                {workSchedule && workSchedule.map((data, index) => (

                                    <tr>
                                        <td className="label"><div className="">{data.label}</div></td>
                                        <td className="data"><div className="">{data.data1}</div></td>
                                        <td className="data"><div className="">{data.data2}</div></td>
                                        <td className="data"><div className="">{data.data3}</div></td>
                                        <td className="data"><div className="">{data.data4}</div></td>
                                        <td className="data"><div className="">{data.data5}</div></td>
                                        <td className="data"><div className="">{data.data6}</div></td>
                                        <td className="data"><div className="">{data.data7}</div></td>
                                        <td className="data"><div className="">{data.data8}</div></td>
                                        <td className="data"><div className="">{data.data9}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="palette">
                        <div className="color-detail">
                            <div className="color"></div>
                            <div className="detail">Late entry</div>
                        </div>
                        <div className="color-detail">
                            <div className="color OT"></div>
                            <div className="detail">Overtime</div>
                        </div>
                        <div className="color-detail">
                            <div className="color early"></div>
                            <div className="detail">Early release</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}


const mapStateToProps = (state) => ({
    // filter: state.dashboard
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getStaffAvailability
    }, dispatch)
}

export const StaffAvailability = connect(mapStateToProps, mapDispatchToProps)(StaffAvailabilityClass)