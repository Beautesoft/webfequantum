import React from 'react';
import { InputSearch, TableWrapper } from 'component/common';
import { updateForm, getCommonApi } from 'redux/actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { NormalModal } from 'component/common';
import closeIcon from 'assets/images/close.png';
import _ from 'lodash';

export class ListTreatmentPackageClass extends React.Component {
    state = {
        headerDetails: [
            { label: 'Course'},
            { label: 'Tr. #'},
            { label: 'Total' },
            { label: 'Price'},
            { label: 'Expiry Date' },
        ],
        treatmentPackageList: [],
        meta: {},
        active: false,
        currentIndex: -1,
        isTreatementModal: false,
        formFields: {},
    }
    

    componentDidMount = () => {
        this.getPackageList({});
    }

    handleClick = (key) => {
        if (!this.state.active) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            active: !prevState.active,
            currentIndex: key
        }));
    }

    handleOutsideClick = (e) => {
        if (this.node != null) {
            if (this.node.contains(e.target)) {
                return;
            }
        }
        this.handleClick();
    }
    
    getPackageList = (data) => {
        console.log(this.props.customerId)    
        let { page = 1, limit = 10, search = "" } = data
        this.props.getCommonApi(`treatmentpackages/?cust_id=${this.props.customerId}&page=${page}&limit=${limit}`).then((res) => {
            console.log(res, "dsfdfaafg")
            if (res.status === 200) {
                if(res.data){
                this.setState({ treatmentPackageList: res.data.dataList, meta: res.data.meta.pagination })
                }
            }
            })      
    }

    handlePagination = (page) => {
        console.log(page, "dsfsdfsdfsdf")
        this.getPackageList(page)
    }

    // handlesearch = (event) => {
    //     console.log("sadfasdfasdf", event.target.value)
    //     event.persist();

    //     if (!this.debouncedFn) {
    //         this.debouncedFn = _.debounce(() => {
    //             let searchString = event.target.value;
    //             let data = { search: searchString }
    //             this.getPackageList(data)
    //         }, 500);
    //     }
    //     this.debouncedFn();
    // }

    handleDialog = () => {
        let { isTreatementModal } = this.state;
        isTreatementModal = !isTreatementModal;
        this.setState({
            isTreatementModal
        })
    }

    handleSelectTreatmentPackage = (item) => {
        let {formFields} = this.state            
            formFields["id"] = item.stock_id;
            formFields["item_desc"] = item.item_name;
            formFields["add_duration"] = item.add_duration;
            formFields["Item_CodeName"] = item.item_name;
            
        this.setState({
            formFields
        })
        console.log(formFields)
        this.props.handleSelectPackage(formFields)
        this.props.handleTreatementmodal()
    }

    render() {
        let { headerDetails, treatmentPackageList, meta, currentIndex, active, isTreatementModal, formFields } = this.state
        let {customerId} =  this.props
        return (
            <>
            
            <NormalModal className={"multiple-appointment select-category"} style={{ minWidth: "800px" }} modal={this.props.isTreatementModal} handleModal={this.props.handleTreatementmodal}>
                    <img onClick={this.props.handleTreatementmodal} className="close" src={closeIcon} alt="" />
                <div className="customer-list container">                  
                    <div className="tab-table-content">
                        <div className="py-4">
                            <div className='col-12 p-2 text-center'><h2 className='fw-500'>Treatment</h2></div>
                            <div className="table-container">
                                <TableWrapper
                                    headerDetails={headerDetails}
                                    queryHandler={this.handlePagination}
                                    pageMeta={meta}
                                >

                                    {treatmentPackageList && treatmentPackageList.length > 0 ? treatmentPackageList.map((item, index) => {

                                        let {
                                            item_name,
                                            tr_open,
                                            tr_done,
                                            stock_id,
                                            price,
                                            expiry,
                                            add_duration
                                        } = item
                                        return (
                                            <tr  onClick={() => this.handleSelectTreatmentPackage(item, index)} key={index}>
                                                <td><div className="d-flex align-items-center justify-content-center">{item_name}</div></td>
                                                <td><div className="d-flex align-items-center justify-content-center">{tr_open}</div></td>
                                                <td><div className="d-flex align-items-center justify-content-center">{tr_done}</div></td>
                                                <td><div className="d-flex align-items-center justify-content-center">{price}</div></td>
                                                <td><div className="d-flex align-items-center justify-content-center">{expiry}</div></td>
                                            </tr>
                                        )
                                    }) : <td><div className="d-flex align-items-center justify-content-center">No data available</div></td>}

                                </TableWrapper>
                            </div>
                        </div>
                    </div>
                </div>
                </NormalModal>
            </>
        );
    }
}


const mapStateToProps = (state) => ({
    // filter: state.dashboard
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        updateForm,
        getCommonApi,
        
    }, dispatch)
}

export const TreatmentPackage = connect(mapStateToProps, mapDispatchToProps)(ListTreatmentPackageClass)