import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import Brush from 'assets/images/make-up-brush.png'
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from 'redux/actions/common';
import { Category, Dept, ServicesItem, ItemDetail } from './services/index';

export class FavoriteClass extends Component {
    state = {
        productCard: [
            { stock: true, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: true },
            { stock: true, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: true },
            { stock: true, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: false },
            { stock: false, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: true },
            { stock: true, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: true },
            { stock: true, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: true },
            { stock: true, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: true },
            { stock: true, label: 'Makeup brush', img: Brush, cost: '$ 4', combo: true },
        ],
        activeTab:"category",
        selectedCategoryId: "",
        selectedServicesId:"",
        selectedDeptId: 246,
        active: false,
        currentValue: 0,
        navLinks: [
            {
                to: '/admin/catalog',
                label: 'Retails Products',
            },
            {
                to: '/admin/catalog',
                label: 'Salon Products',
            },
            {
                to: '/admin/catalog',
                label: 'Services',
            },
            {

                to: '/admin/catalog',
                label: 'Courses',
            },
        ],
        page: 1,
        formFields:{
            search:""
        }
    }

    componentDidMount = () => {
        let { productCard } = this.state;
        // this.getServices({});
    }

    // getServices = (query) => {
    //     let { page = this.state.page, search = this.state.formFields.search } = query;
    //     this.props.getCommonApi(`servicestock/?Item_Deptid=${this.props.id}&page=${page}`).then((key) => {
    //         let { status, data } = key;
    //         if (status === 200) {
                
    //             this.setState({ productCard: data })
    //         }
    //     })
    // }

    handleSelectCategory = (id) => {
        this.setState({activeTab:"dept", selectedCategoryId:id})
    }

    handleSelectDept = (id) => {
        this.setState({activeTab:"ServicesItem", selectedDeptId:id})
    }

    handleSelectServices = (id) => {
        this.setState({activeTab:"ItemDetail", selectedServicesId:id})
    }

    handleClick = (key) => {
        let { active, currentValue } = this.state
        this.setState({
            active: true,
            currentValue: key
        })
    }


    render() {
        let { productCard, activeTab, navLinks, selectedCategoryId, currentValue, active, selectedDeptId, selectedServicesId } = this.state;
        return (
            <>
             

               <ServicesItem id={this.props.id}  handleSelectServices={this.handleSelectServices} api={this.props.api} search={""}></ServicesItem>
               {/* } */}
               { activeTab==="ItemDetail" ? 
               <ItemDetail id={selectedServicesId}></ItemDetail>:"" 
               }

            </>
        );
    }
}

const mapStateToProps = (state) => ({
    customerDetail: state.appointment.customerDetail,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        // getCustomer,
        getCommonApi
    }, dispatch)
}

export const Favorite = connect(mapStateToProps, mapDispatchToProps)(FavoriteClass)