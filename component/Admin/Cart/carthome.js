import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { NormalButton, NormalSelect, NormalModal, NormalInput } from 'component/common';
import { InputSearch, TableWrapper } from 'component/common';
import { Cart } from '.'
import './style.scss'
// import { SalonProduct } from './salonProduct';
// import { Services } from './services';
// import { Courses } from './courses';
// import { RetailProduct } from './retailProduct'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getCommonApi, updateForm } from 'redux/actions/common';
import closeIcon from 'assets/images/close.png';
import { dateFormat } from 'service/helperFunctions';
import _ from 'lodash';

export class CartHomeClass extends Component {
  state = {
    active: false,
    currentValue: 0,
    navLinks: [

    ],
    customerList: [],
    branchList: [],
    isOpenModal: false,
    customerDetail: {
      branchId: "",
      cust_noid: ""
  },
  }

  componentDidMount = () => {
    let { productCard, branchList } = this.state;
   
    this.props.getCommonApi(`treatment/Outlet/`).then((key) => {
        let { status, data } = key;
        if (status === 200) {
            for (let value of data) {
                branchList.push({ value: value.id, label: value.itemsite_desc })
            }
            this.setState({ branchList })
            // console.log(brachList, "jhksdfkjsdhfks")
        }
    })
}

handleChange = async ({ target: { value, name } }) => {
  let { customerDetail, customerList } = this.state;
  console.log("uihwkjrwkej", name, value)
  customerDetail[name] = value;
  await this.setState({
      customerDetail,
  });
  if (name === "branchId") {
      this.props.getCommonApi(`custappt/?Outlet=${value}`).then((key) => {
          let { status, data } = key;
          if (status === 200) {
              for (let value of data) {
                  customerList.push({ value: value.id, label: value.cust_name + " | " + value.cust_phone1 + " | " + value.cust_code })
              }
              this.setState({ customerList })
          }
      }) 
  }
  this.props.updateForm('selected_customer', customerDetail)
}

  handleClick = (key) => {
    let { active, currentValue } = this.state
    this.setState({
      active: true,
      currentValue: key
    })
  }

  handleSearch = (event) => {
    event.persist();

    if (!this.debouncedFn) {
        this.debouncedFn = _.debounce(() => {
            let searchString = event.target.value;
            let data = { search: searchString }
            // this.queryHandler(data)
            let { customerList, customerDetail } = this.state;
            this.props.getCommonApi(`custappt/?Outlet=${customerDetail.branchId}&search=${searchString}`).then((key) => {
                
                let { status, data } = key;
                if (status === 200) {
                    // for (let value of data) {
                    //     customerList.push({ value: value.id, label: value.emp_name })
                    // }
                    this.setState({ customerList: data })
                }
            })
        }, 500);
    }
    this.debouncedFn();
}

handleCloseDialog = () => {
    this.setState({
        isOpenModal:false,
    })
}

handleSelectCustomer = async(data) => {
  let { customerList, customerDetail, servicesDetail } = this.state;
  customerDetail['cust_noid'] = data.id;
  customerDetail['cust_name'] = data.cust_name;
  await this.setState({customerDetail})
  this.props.updateForm('selected_customer', customerDetail)
}

  render() {
    let { navLinks, active, currentValue, branchList, customerList } = this.state
    let { servicesDetail, isOpenModal } = this.state;
    let { selected_cstomer } = this.props;
    return (
      <>
        <div className="cart-section">
        
        <div className="row mt-2 mb-5 mx-3">
          <div className="col-10">
          {/* {console.log("safasdfasdf", this.props)} */}
              <div className="pl-0 mt-3 fs-18 py-2">
                Select Branch
            </div>
              <NormalSelect
                placeholder="select"
                options={branchList}
                value={selected_cstomer.branchId}
                name="branchId"
                onChange={this.handleChange}
                className="customer-name p-0"
              />
              <div className=" pl-0 mt-3 fs-18 py-2">
                Customer
            </div>
              <NormalInput
                // placeholder="Enter here"
                // options={siteList}
                value={selected_cstomer.cust_name}
                name="cust_name"
                onClick={() => this.setState({ isOpenModal: true })}
                // onChange={this.handleSearch}
                className="search customer-name px-3 p-0"
                // disabled
              />

              <div className="confirm">
                <NormalButton
                  mainbg={true}
                  className=" fs-15 mt-5"
                  label="Catalog"
                  onClick={() => this.props.history.push('/admin/catalog')}
                />
              </div>

            </div>
          </div>
          
          <div className="pr-0 position-relative cart-bar">
            <Cart />
          </div>
        </div>
       
          <NormalModal className={"multiple-appointment select-category"} modal={isOpenModal} handleModal={this.handleCloseDialog}>
            <img onClick={this.handleCloseDialog} className="close" src={closeIcon} alt="" />
            <div className="row mt-2 mb-5 mx-3">
             
              <div className="col-12 pl-0 mt-3 fs-18 py-2">
                Customer
                        </div>
              <input
                // placeholder="Enter here"
                // options={siteList}
                value={selected_cstomer.cust_name}
                name="cust_name"
                // onClick={() => this.setState({ isOpenModal: true })}
                onChange={this.handleSearch}
                className="search px-3 p-0"
                disabled
              />
             
              <div className="col-12 pl-0 mt-3 fs-18 py-2">
                Search
                        </div>
              <input
                // placeholder="Enter here"
                // options={siteList}
                // value={treatmentField.treatment}
                name="treatment"
                // onClick={() => this.setState({ isOpenModal: true })}
                onChange={this.handleSearch}
                className="search px-3 p-0"
              />

              <div className="row mt-4 table-header w-100 m-0">
                <div className="col-2">Name</div>
                <div className="col-2">Phone</div>
                <div className="col-3">Cust Code</div>
                <div className="col-5">Email</div>
              </div>
              {customerList.length > 0 ? customerList.map((item, index) => {
                return (
                  <div className="row m-0 table-body w-100" onClick={() => this.handleSelectCustomer(item)} key={index}>
                    <div className="col-2">{item.cust_name}</div>
                    <div className="col-2">{item.cust_phone1}</div>
                    <div className="col-3">{item.cust_code}</div>
                    <div className="col-5">{item.cust_email}</div>
                  </div>
                )
              }) : <div className="text-center w-100">
                  No Data are available
                        </div>}
              <div className="d-flex create m-5 w-100">
                <NormalButton
                  buttonClass={"mx-2"}
                  // mainbg={true}
                  className="col-12 fs-15 multiple-customer"
                  label="Continue"
                  outline={true}
                  onClick={this.handleCloseDialog}
                />
              </div>


            </div>
          </NormalModal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  // customerDetail: state.appointment.customerDetail,
  selected_cstomer: state.common.selected_cstomer,
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    // getCustomer,
    getCommonApi,
    updateForm
  }, dispatch)
}

export const CartHome = connect(mapStateToProps, mapDispatchToProps)(CartHomeClass)