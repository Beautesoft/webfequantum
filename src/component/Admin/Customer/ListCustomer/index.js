import React from "react";
import { NormalButton, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import filter from "../../../../assets/images/filter.png";
import "./style.scss";
import { getCustomer } from "redux/actions/customer";
import { updateForm } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";

export class ListCustomerClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Customer Name", sortKey: "customerName" },
      { label: "Address", sortKey: "address" },
      { label: "Contact Number" },
      { label: "Last Visit", sortKey: "lastVisit" },
      { label: "Upcoming Appointments" },
      { label: "" },
    ],
    customerList: [],
    meta: {},
    active: false,
    currentIndex: -1,
  };
  // handleClick = (key,active) => {
  //     let currentIndex;
  //     if (this.state.active == true) {
  //         this.setState({
  //             active: false,
  //             currentIndex: '-1'
  //         })
  //     }
  //     else {
  //         this.setState({
  //             active: active,
  //             currentIndex: key
  //         })
  //     }
  // }

  componentDidMount = () => {
    this.getCustomer({});
  };

  handleClick = key => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      active: !prevState.active,
      currentIndex: key,
    }));
  };

  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  getCustomer = data => {
    let { page = 1, limit = 10, search = "" } = data;
    this.props
      .getCustomer(`?page=${page}&limit=${limit}&search=${search}`)
      .then(res => {
        console.log(res, "dsfdfaafg");
        this.setState({
          customerList: res.data.dataList,
          meta: res.data.meta.pagination,
        });
      });
  };

  handlePagination = page => {
    console.log(page, "dsfsdfsdfsdf");
    this.getCustomer(page);
  };

  handlesearch = event => {
    console.log("sadfasdfasdf", event.target.value);
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        this.getCustomer(data);
      }, 500);
    }
    this.debouncedFn();
  };

  bookAppointment = async data => {
    let formFields = {};
    formFields["custId"] = data.id;
    formFields["custName"] = data.cust_name;
    await this.props.updateForm("basicApptDetail", formFields);
    this.props.history.push(`/admin/newappointment`);
  };

  render() {
    let { headerDetails, customerList, meta, currentIndex, active } =
      this.state;
    return (
      <>
        <div className="customer-list">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h3 className="head-label">Customer</h3>
            </div>
            <div className="col-md-6">
              <div className="d-flex">
                <div className="w-100 mr-5">
                  <InputSearch
                    className=""
                    placeholder="Search Customer"
                    onChange={this.handlesearch}
                  />
                </div>
                <div className="w-100 col-4 p-0">
                  <NormalButton
                    mainbg={true}
                    className="col-12 fs-15 float-right"
                    label="Add Customer"
                    onClick={() =>
                      this.props.history.push("/admin/customer/add")
                    }
                  />
                </div>
                {/* <div className="bg-white ml-5 filter-icon filter-section" onClick={() => { this.handleClick('filter') }}>
                                    <img src={filter} alt="" />
                                    {currentIndex === 'filter' &&
                                        <>
                                            <div className="filter-category">
                                                <p className="subcategory">Available today</p>
                                                <p className="subcategory">Unavailable today</p>
                                                <p className="subcategory">Morning shift</p>
                                                <p className="subcategory">Evening shift</p>
                                            </div>
                                        </>
                                    }
                                </div> */}
              </div>
            </div>
          </div>
          {/* <div className="filter-by">
                        <p className="head">Filter</p>
                        <div className="row">
                            <div className="col-md-3">
                                <div>
                                    <label className="label">Location</label>
                                    <div className="input-group">
                                        <NormalSelect
                                            placeholder="Masseuse"
                                            // options={treatmentOption}
                                            // value={treatment}
                                            iconname="icon-down-key"
                                            name="treatment"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div>
                                    <label className="label">Service</label>
                                    <div className="input-group">
                                        <NormalSelect
                                            placeholder="Select department"
                                            // options={treatmentOption}
                                            // value={treatment}
                                            iconname="icon-down-key"
                                            name="treatment"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div>
                                    <label className="label">Date</label>
                                    <div className="input-group">
                                        <NormalSelect
                                            placeholder="Select date"
                                            // options={treatmentOption}
                                            // value={treatment}
                                            iconname="icon-down-key"
                                            name="treatment"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div> */}

          <div className="tab-table-content">
            <div className="py-4">
              <div className="table-container">
                <TableWrapper
                  headerDetails={headerDetails}
                  queryHandler={this.handlePagination}
                  pageMeta={meta}
                >
                  {customerList
                    ? customerList.map((item, index) => {
                        let {
                          id,
                          cust_name,
                          cust_address,
                          last_visit,
                          upcoming_appointments,
                          cust_phone2,
                        } = item;
                        return (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {cust_name}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {cust_address}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {cust_phone2}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {last_visit}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {upcoming_appointments}
                              </div>
                            </td>
                            <td
                              className="position-relative"
                              ref={node => {
                                this.node = node;
                              }}
                              onClick={() => this.handleClick(index)}
                            >
                              {currentIndex === index ? (
                                <>
                                  <div className="d-flex align-items-center justify-content-center horizontal-more-active">
                                    <i className="icon-more"></i>
                                  </div>
                                  <div className="option card">
                                    <div
                                      className="d-flex align-items-center fs-16 pt-3"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/customer/${id}/details`
                                        )
                                      }
                                    >
                                      <span className="icon-eye-grey px-3"></span>{" "}
                                      View{" "}
                                    </div>
                                    <div className="d-flex align-items-center fs-16">
                                      <span className="icon-schedule px-3"></span>{" "}
                                      Reschedule Appointment{" "}
                                    </div>
                                    <div
                                      className="d-flex align-items-center fs-16"
                                      onClick={() => this.bookAppointment(item)}
                                    >
                                      <span className="px-2">
                                        <svg
                                          width="31"
                                          height="30"
                                          viewBox="0 0 31 30"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            width="31"
                                            height="30"
                                            fill="#F9F9F9"
                                          />
                                          <path
                                            d="M15 8V22"
                                            stroke="#848484"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M8 15H22"
                                            stroke="#848484"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      Book Appointment
                                    </div>
                                    <div className="d-flex align-items-center fs-16 pb-3">
                                      <span className="icon-cancel-schedule px-3"></span>{" "}
                                      Cancel Appointment{" "}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="d-flex align-items-center justify-content-center horizontal-more">
                                  <i className="icon-more"></i>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    : ""}
                </TableWrapper>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomer,
      updateForm,
    },
    dispatch
  );
};

export const ListCustomer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCustomerClass);
