import React, { Component } from "react";
import logo from "../../../../assets/images/man.png";
import Modal from "../../../../assets/images/modal-avatar.png";
import filter from "../../../../assets/images/filter.png";
import {
  Details,
  CustomerList,
  DashboardDetails,
  PerformanceDetails,
} from "./Details";
import { history } from "helpers";
import classnames from "classnames";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { NormalButton } from "component/common";
import { InputSearch } from "component/common";
import "./style.scss";
import { getStaff } from "redux/actions/staff";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

export class StaffPlusDetailsClass extends Component {
  state = {
    activeTab: "1",
  };

  componentDidMount() {
    this.getStaffDetail();
  }

  // handle navigation
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  // get api for staff list
  getStaffDetail = () => {
    this.props.getStaff(`${this.props.match.params.id}/`).then((res) => {
      console.log("kjsdhfkjhsdf", this.props);
    });
  };

  render() {
    let { staffDetail = {}, t } = this.props;
    let { emp_name, jobtitle_name } = staffDetail;
    return (
      <div className="view-detail container-fluid px-md-5">
        {/* <div className="d-flex align-items-center cursor-pointer" onClick={() => history.push('/admin/staff')}>
                    <i className="icon-left-arrow tc-primary fs-10"></i>
                    <span className="fs-15 tc-primary pl-2">Staffs</span>
                </div> */}
        <div className="row mb-md-4">
          <div className="col-md-4 d-flex align-items-center">
            <div className="detail">
              <p
                className="category"
                onClick={() => history.push("/admin/staffPlus")}
              >
                {t("Staffs")}
              </p>
              <i className="icon-right mx-md-3"></i>
              <p className="sub-category">{t("Staff Details")}</p>
            </div>
          </div>
          <div className="col-md-8">
            <div className="d-flex justify-content-between">
              <div className="input-container">
                <InputSearch
                  className=""
                  placeholder="Search Staff"
                  onChange={this.handleChange}
                />
              </div>
              <div className="w-100 col-4">
                <NormalButton
                  className="col-12 fs-15 float-right"
                  label="Staff availability"
                  mainbg={true}
                  // onClick={() => this.props.history.push('/admin/staffPlus/add')}
                />
              </div>
              <div className="w-100 col-3 p-0">
                <NormalButton
                  mainbg={true}
                  className="col-12 fs-15 float-right"
                  label="Add Staff"
                  onClick={() => this.props.history.push("/admin/staffPlus/add")}
                />
              </div>
              <div className="bg-white filter-icon ml-3">
                {/* <i className="icon-filter"></i> */}
                <img src={filter} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="view-detail-box p-4 d-flex flex-column">
          <div className="d-flex pb-3">
            <div className="col-6 d-flex align-items-center">
              <div>
                <img className="modal-avatar" src={Modal} alt="" />
              </div>
              <div className="pl-3">
                <p className="fs-28 fw-500 staff-detail-heading py-2">
                  {emp_name}
                </p>
                <p className="fs-18 staff-detail-sub-text py-1">
                  {jobtitle_name}
                </p>
              </div>
            </div>
            <div className="col-6 icon-change">
              <button
                className="btn outline-btn col-2 mx-2 fs-15 float-right text-capitalize"
                onClick={() =>
                  history.push(
                    `/admin/staffPlus/${this.props.match.params.id}/editStaff`
                  )
                }
              >
                <span className="icon-edit mr-2"></span>
                {t("Edit")}
              </button>
              {/* <NormalButton
                                link={true}
                                className="icon-delete mx-2 col-2 fs-15 float-right"
                                label="&nbsp;Delete"
                            />
                            <NormalButton
                                outline={true}
                                className="icon-edit mx-2 col-2 fs-15 float-right"
                                label="&nbsp;Edit"
                            /> */}
            </div>
          </div>
          <div className="beautesoft-navlink">
            <div className="filled-tabs">
              <div className="tabs-block">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1",
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      {t("Details")}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2",
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      {t("Customer History")}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "3",
                      })}
                      onClick={() => {
                        this.toggle("3");
                      }}
                    >
                      {t("Dashboard")}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "4",
                      })}
                      onClick={() => {
                        this.toggle("4");
                      }}
                    >
                      {t("Performance")}
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  {this.state.activeTab === "1" ? (
                    <Details id={this.props.match.params.id} />
                  ) : (
                    ""
                  )}
                </TabPane>

                <TabPane tabId="2">
                  {this.state.activeTab === "2" ? (
                    <CustomerList id={this.props.match.params.id} />
                  ) : (
                    ""
                  )}
                </TabPane>

                <TabPane tabId="3">
                  {this.state.activeTab === "3" ? (
                    <DashboardDetails id={this.props.match.params.id} />
                  ) : (
                    ""
                  )}
                </TabPane>
                <TabPane tabId="4">
                  {this.state.activeTab === "4" ? (
                    <PerformanceDetails id={this.props.match.params.id} />
                  ) : (
                    ""
                  )}
                </TabPane>
              </TabContent>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  staffDetail: state.staff.staffDetail,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getStaff,
    },
    dispatch
  );
};

export const StaffPlusDetails = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(StaffPlusDetailsClass)
);
