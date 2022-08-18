import React, { Component } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import "./style.scss";
import { PayMode } from "./PayMode";
import { NewStaffStats } from "./NewStaffStats";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Translation } from "react-i18next";

export class NewDashboard extends Component {
  state = {
    activeTab: "1",
    CollectionFlag: true,
    BreakDownsalesFlag: true,
    TreatmentDoneFlag: true,
  };

  handleFlag = tab => {
    this.setState(prevState => ({
      [tab]: !prevState[tab],
    }));
  };
  render() {
    let { CollectionFlag, BreakDownsalesFlag, TreatmentDoneFlag } = this.state;
    return (
      <div className="dashboard mb-2">
        <div className="col-md-12 mb-3 p-2">
          <NewStaffStats />
        </div>
        <div className="d-flex flex-wrap mb-3 p-2">
          <div
            className="col-md-12 col-12 Accord-header cursor-pointer"
            onClick={() => this.handleFlag("CollectionFlag")}
          >
            <div className="d-flex">
              <div className="h5 fw-500 col-10 col-md-10 text-left">
                {`Collection Summary`}
              </div>
              <div className="h5 fw-500 col-2 col-md-2 text-right fs-18">
                {CollectionFlag == false ? (
                  <AiOutlinePlus />
                ) : (
                  <AiOutlineMinus />
                )}
              </div>
            </div>
          </div>
          <div
            className={`mb-2 bg-whitesmoke" + ${
              CollectionFlag ? "" : "d-none"
            }`}
          >
            <div className="d-flex flex-wrap py-1">
              <div className="col-12">
                <PayMode
                  type="paymode"
                  mainTitle="Pay Mode"
                  switchBoxName="paymodeCompare"
                  apiURL="paymodepiedashboard"
                />
              </div>
              <div className="col-12">
                <PayMode
                  type="department"
                  mainTitle="Department"
                  switchBoxName="deptmodeCompare"
                  apiURL="paymodepiedashboard/piedepartment"
                />
              </div>
              <div className="col-12">
                <PayMode
                  type="division"
                  mainTitle="Division"
                  switchBoxName="divmodeCompare"
                  apiURL="paymodepiedashboard/piedivision"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap mb-3 p-2">
          <div
            className="col-md-12 col-12 Accord-header cursor-pointer"
            onClick={() => this.handleFlag("BreakDownsalesFlag")}
          >
            <div className="d-flex">
              <div className="h5 fw-500 col-10 col-md-10 text-left">
                {`Breakdown Sales`}
              </div>
              <div className="h6 fw-500 col-2 col-md-2 text-right fs-18">
                {BreakDownsalesFlag == false ? (
                  <AiOutlinePlus />
                ) : (
                  <AiOutlineMinus />
                )}
              </div>
            </div>
          </div>
          <div
            className={`mb-2 bg-red" + ${BreakDownsalesFlag ? "" : "d-none"}`}
          >
            <div className="d-flex flex-wrap py-1">
              <div className="col-12">
                <PayMode
                  type="staff"
                  mainTitle="Staff"
                  switchBoxName="breakstaffmodeCompare"
                  apiURL="paymodepiedashboard"
                />
              </div>
              <div className="col-12">
                <PayMode
                  type="department"
                  mainTitle="Department"
                  switchBoxName="breakdeptmodeCompare"
                  apiURL="paymodepiedashboard/piedepartment"
                />
              </div>
              <div className="col-12">
                <PayMode
                  type="division"
                  mainTitle="Division"
                  switchBoxName="breakdivmodeCompare"
                  apiURL="paymodepiedashboard/piedivision"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap mb-3 p-2">
          <div
            className="col-12 Accord-header cursor-pointer"
            onClick={() => this.handleFlag("TreatmentDoneFlag")}
          >
            <div className="d-flex">
              <div className="h5 fw-500 col-10 col-md-10 text-left">
                {`Treatment Done`}
              </div>
              <div className="h6 fw-500 col-2 col-md-2 text-right fs-18">
                {TreatmentDoneFlag == false ? (
                  <AiOutlinePlus />
                ) : (
                  <AiOutlineMinus />
                )}
              </div>
            </div>
          </div>
          <div className={`mb-2" + ${TreatmentDoneFlag ? "" : "d-none"}`}>
            <div className="d-flex flex-wrap py-1">
              <div className="col-md-12 col-12">
                <PayMode
                  type="staff"
                  mainTitle="Staff"
                  switchBoxName="tdstaffmodeCompare"
                  apiURL="paymodepiedashboard"
                />
              </div>
              <div className="col-12">
                <PayMode
                  type="department"
                  mainTitle="Department"
                  switchBoxName="tddeptmodeCompare"
                  apiURL="paymodepiedashboard/piedepartment"
                />
              </div>
              <div className="col-12">
                <PayMode
                  type="division"
                  mainTitle="Division"
                  switchBoxName="tddivmodeCompare"
                  apiURL="paymodepiedashboard/piedivision"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
