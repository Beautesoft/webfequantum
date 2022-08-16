import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { NormalButton, NormalSelect } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import Brush from '../../../assets/images/make-up-brush.png'
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi } from 'redux/actions/common';
import { Category, Dept, CourseItem, ItemDetail } from './course/index';

export class CourseClass extends Component {
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
        selectedDeptId: "",
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
    }

    componentDidMount = () => {
        let { productCard } = this.state;
        this.props.getCommonApi(`itemclass/`).then((key) => {
            let { status, data } = key;
            if (status === 200) {
                
                this.setState({ productCard: data })
            }
        })
    }

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
        let { productCard, activeTab, selectedCategoryId, currentValue, active, navLinks, selectedDeptId, selectedServicesId } = this.state;
        return (
            <>
               {/* { activeTab==="category" ? <Category handleSelectCategory={this.handleSelectCategory}></Category>:"" }
               { activeTab==="dept" ? <Dept id={selectedCategoryId} handleSelectDept={this.handleSelectDept}></Dept>:"" }
               { activeTab==="ServicesItem" ?  */}
               <div className="offset-1">
                                <ul className="catelog-service">
                                    {navLinks.map(({ to, label }, index) => (
                                        <li key={index} className="mr-3">
                                            <NavLink to={to} className="nav-link">
                                                <div className={`sidebar-menu ${(currentValue === index) ? 'active' : ''}`} onClick={() => this.handleClick(index)}>
                                                    <span className="sidebar-menu-desc">{label}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {currentValue == '0' &&
                                <CourseItem id={selectedDeptId} handleSelectServices={this.handleSelectServices}></CourseItem>
                            }
                            {currentValue == '1' &&
                               <CourseItem id={selectedDeptId} handleSelectServices={this.handleSelectServices}></CourseItem>
                            }
                            {currentValue == '2' &&
                                <CourseItem id={selectedDeptId} handleSelectServices={this.handleSelectServices}></CourseItem>
                            }
                            {currentValue == '3' &&
                                <CourseItem id={selectedDeptId} handleSelectServices={this.handleSelectServices}></CourseItem>
                            }
               {/* <CourseItem id={selectedDeptId} handleSelectServices={this.handleSelectServices}></CourseItem> */}
                {/* } */}
                {/* { activeTab==="ItemDetail" ? <ItemDetail id={selectedServicesId}></ItemDetail>:"" } */}
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

export const Courses = connect(mapStateToProps, mapDispatchToProps)(CourseClass)