import React, { Component } from "react";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class StaffListClass extends Component {
  componentDidMount = () => {};

  render() {
    let { staffList, meta } = this.props;
    return (
      <div>
        <div className="staff-listing d-flex flex-wrap justify-content-center">
          {meta && Number(meta.current_page) !== 1 ? (
            <div
              className="d-flex justify-content-center align-items-center p-1 forward-button cursor-pointer fw-700"
              onClick={this.props.handleBack}
            >
              <svg
                width="10"
                height="25"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 0.5L1 5L5 9.5"
                  stroke="#888888"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : null}

          {staffList.dataList && staffList.dataList.length > 0 ? (
            staffList.dataList.map((item, index) => {
              return (
                <div
                  className="mx-1 staff-list cursor-pointer col p-2"
                  key={index}
                  onClick={() => this.props.handleSelectedStaff(item)}
                >
                  <img src={item.emp_pic} alt="" />
                  <p className="fs-10 text-left">{item.emp_name}</p>
                </div>
              );
            })
          ) : (
            <div className="mx-1 staff-list cursor-pointer">No data</div>
          )}
          {meta && Number(meta.current_page) !== Number(meta.total_pages) ? (
            <div
              className="d-flex justify-content-center align-items-center p-1 back-button cursor-pointer fw-700"
              onClick={this.props.handleNext}
            >
              <svg
                width="10"
                height="25"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.5 9.5L4.5 5L0.5 0.5"
                  stroke="#888888"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
    },
    dispatch
  );
};

export const StaffList = connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffListClass);
