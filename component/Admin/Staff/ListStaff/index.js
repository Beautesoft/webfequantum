import React from "react";
import { NormalButton, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import "./style.scss";
import { api } from "service/api";
import { Staff } from "service/apiVariables";
import { getStaff, deleteStaff } from "redux/actions/staff";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";

export class ListStaffClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Staff name", sortKey: true },
      { label: "Phone" },
      { label: "Staff ID", sortKey: true },
      { label: "Specialist", sortKey: true },
      { label: "Home site", sortKey: true },
      { label: "Current site", sortKey: true },
      { label: "" },
    ],
    staffList: [],
    pageMeta: {},
    active: false,
    currentIndex: -1,
  };

  componentDidMount() {
    this.queryHandler({});
  }

  // popup open/close
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

  // while clicking popup close at outside click
  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  // api call for staff
  queryHandler = data => {
    let { page = 1, limit = 10, search = "" } = data;
    this.props.getStaff(`?page=${page}&limit=${limit}`).then(res => {
      // this.props.getStaff(`?page=${page}&limit=${limit}&search=${search}`).then((res) => {
      console.log(res, "dsfdfaafg", res.data.dataList);
      let { staffList, pageMeta } = this.state;
      staffList = res.data.dataList;
      pageMeta = res.data.meta.pagination;
      this.setState({
        staffList,
        pageMeta,
      });
    });
  };

  // pagination
  handlePagination = page => {
    this.queryHandler(page);
  };

  // seach change with api call
  handlesearch = event => {
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        this.queryHandler(data);
      }, 500);
    }
    this.debouncedFn();
  };

  // skills api call
  getSkills = services => {
    console.log(skills, "sdfoiuyujf");
    let skills = [];
    for (let key of services) {
      skills.push(key.Course);
    }
    console.log(skills, "sdfoiuyujf");
    return String(skills);
  };

  // delete api call for staff
  handleDeleteStaff = id => {
    this.props.deleteStaff(`${id}/`).then(res => {});
  };

  render() {
    let { headerDetails, staffList, pageMeta, currentIndex } = this.state;
    return (
      <div className="staffList-container">
        <div className="row align-items-center">
          <div className="col-md-4">
            <h3>List of Staffs</h3>
          </div>
          <div className="col-md-8">
            <div className="d-flex justify-content-between">
              <div className="input-container">
                <InputSearch
                  className=""
                  placeholder="Search Staff"
                  onChange={this.handleChange}
                  value={``}
                />
              </div>
              <div className="w-100 col-4">
                <NormalButton
                  className="col-12 fs-15 float-right"
                  label="Staff availability"
                  mainbg={true}
                  onClick={() =>
                    this.props.history.push("/admin/staff/availability")
                  }
                />
              </div>
              <div className="w-100 col-3 p-0">
                <NormalButton
                  mainbg={true}
                  className="col-12 fs-15 float-right"
                  label="Add Staff"
                  onClick={() => this.props.history.push("/admin/staff/add")}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="filter-by">
                    <p className="head">Filter</p>
                    <div className="row">
                        <div className="col-md-3">
                            <div>
                                <label className="label">Service</label>
                                <div className="input-group filter">
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
                                <label className="label">Department</label>
                                <div className="input-group filter">
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
                                <label className="label">Contract duration</label>
                                <div className="input-group filter">
                                    <NormalSelect
                                        placeholder="Select duration"
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
                                <label className="label">Rating</label>
                                <div className="input-group filter">
                                    <NormalSelect
                                        placeholder="Select rating"
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
                pageMeta={pageMeta}
              >
                {staffList.length > 0
                  ? staffList.map(
                      (
                        {
                          id,
                          emp_name,
                          emp_phone1,
                          emp_code,
                          services,
                          site_code,
                          defaultsitecode,
                          status,
                        },
                        index
                      ) => {
                        return (
                          <tr key={index}>
                            <td className="position-relative status-type">
                              <span
                                className={`${
                                  status === "available"
                                    ? "available"
                                    : "not-available"
                                }`}
                              ></span>
                              <div className="text-left">{emp_name}</div>
                            </td>
                            <td>
                              <div className="text-left">{emp_phone1}</div>
                            </td>
                            <td>
                              <div className="text-left">{emp_code}</div>
                            </td>
                            {/* <td><div className="d-flex align-items-center justify-content-center"></div></td> */}
                            <td>
                              <div className="text-left">
                                {services ? services[0] : ""}
                              </div>
                            </td>
                            <td>
                              <div className="text-left">{defaultsitecode}</div>
                            </td>
                            <td>
                              <div className="text-left">{site_code}</div>
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
                                      className="d-flex align-items-center fs-14 pt-3"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/staff/${id}/staffDetails`
                                        )
                                      }
                                    >
                                      <span className="icon-eye-grey px-3"></span>{" "}
                                      View{" "}
                                    </div>
                                    <div
                                      className="d-flex align-items-center fs-14"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/staff/${id}/editStaff`
                                        )
                                      }
                                    >
                                      <span className="icon-edit px-3"></span>{" "}
                                      Edit{" "}
                                    </div>
                                    <div
                                      className="d-flex align-items-center fs-14 pb-3"
                                      onClick={() => this.handleDeleteStaff(id)}
                                    >
                                      <span className="icon-delete px-3"></span>{" "}
                                      Delete{" "}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="d-flex align-items-center justify-content-center horizontal-more">
                                  <i className="icon-more text-grey"></i>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )
                  : null}
              </TableWrapper>
              <div className="palette">
                <div className="color-detail">
                  <div className="color"></div>
                  <div className="detail">Available today</div>
                </div>
                <div className="color-detail">
                  <div className="color not-available"></div>
                  <div className="detail">Not Available today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getStaff,
      deleteStaff,
    },
    dispatch
  );
};

export const ListStaff = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListStaffClass);
