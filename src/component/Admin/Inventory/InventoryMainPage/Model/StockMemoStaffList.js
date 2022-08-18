import React, { Component } from "react";
import { NormalModal, Pagination, NormalButton } from "component/common";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import closeIcon from "assets/images/close.png";

export class StockMemoStaffListClass extends Component {
  state = { staffList: [], limit: 6, page: 1 };
  componentDidMount = () => {
    this.getStafflist({});
  };
  getStafflist = data => {
    let { page, limit } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=2&page=${page}&limit=${limit}`)
      .then(async key => {
        let { status, data } = key;
        console.log(data, "sdfgsdfgsdfgdfg sdfgsdfgsdfg");
        let { staffList } = this.state;
        staffList = data;
        this.setState({
          staffList,
        });
      });
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  render() {
    let { staffList } = this.state;
    return (
      <NormalModal
        className={"stock-memo-staff-listing"}
        style={{ minWidth: "760px" }}
        modal={this.props.isStockItemUsageEmployeePopup}
        handleModal={this.props.handleStockItemUsageEmployeePopup}
      >
        <img
          onClick={this.props.handleStockItemUsageEmployeePopup}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="d-flex h4 justify-content-center p-1 mb-3">
          Staff List
        </div>
        <div>
          <div className="staff-listing d-flex">
            <div
              className="forward-button cursor-pointer"
              onClick={this.handleBack}
            >
              <svg
                width="6"
                height="15"
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
            {staffList.dataList && staffList.dataList.length > 0 ? (
              staffList.dataList.map((item, index) => {
                return (
                  <div
                    className="mx-1 staff-list cursor-pointer col"
                    key={index}
                    onClick={() => this.props.handleSelectedStaff(item)}
                  >
                    <img src={item.emp_pic} alt="" />
                    <p className="text-uppercase fs-11 fw-500">
                      {item.emp_name}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="mx-1 staff-list cursor-pointer">No data</div>
            )}

            <div
              className="back-button cursor-pointer"
              onClick={this.handleNext}
            >
              <svg
                width="6"
                height="15"
                viewBox="0 0 5 10"
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
          </div>
          <div className="row text-center justify-content-center w-100 mt-3">
            <NormalButton
              buttonClass={"col-2"}
              mainbg={true}
              className="col-12 ml-4 fs-15 "
              label="Close"
              onClick={this.props.handleStockItemUsageEmployeePopup}
            />
          </div>
        </div>
      </NormalModal>
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

export const StockMemoStaffList = connect(
  mapStateToProps,
  mapDispatchToProps
)(StockMemoStaffListClass);
