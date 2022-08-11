import React, { Component } from "react";
import {
  NormalButton,
  NormalInput,
  NormalTextarea,
  TableWrapper,
} from "component/common";
import { getCommonApi, commonDeleteApi } from "redux/actions/common";
import { history } from "helpers";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

export class Projects extends Component {
  state = {
    headerDetails: [
      {
        label: "S.No",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Title",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Description",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Status",
        divClass: "justify-content-end text-right",
      },
    ],
    upcomingAppointment: [],
    pageMeta: {},
    active: false,
    currentIndex: -1,
    customerProjectList: [],
    isVisible: false,
    projectDetail: {
      active: "",
      contact_number: "",
      contact_person: "",
      customer_name: "",
      created_at: "",
      desc: "",
      title: "",
      status: "",
    },
    projectDetailId:""
  };

  componentDidMount() {
    this.props
      .getCommonApi(`customerprojectlist/?cust_id=${this.props.id}&page=1&limit=1000`)
      .then((key) => {
        let { status, data } = key;
        console.log(status, data, "Inside did mount");
        if (status === 200) {
          this.setState({ customerProjectList: data.dataList });
        }
      });
  }

  handleClick(e, data) {
    this.setState({ projectDetail: data });
    this.setState({ projectDetailId: data.id });
    this.setState({ isVisible: true });
    console.log(data, "I am Hnadle Clicked");
  }
  render() {
    let { headerDetails, upcomingAppointment, pageMeta, currentIndex } =
      this.state;
    console.log(this.props, "PROPS OFPROJECTS");

    return (
      <>
        {!this.state.isVisible ? (
          <div className="">
            <div className="py-4">
              <div className="table">
                <TableWrapper
                  headerDetails={headerDetails}
                  queryHandler={this.handlePagination}
                  pageMeta={pageMeta}
                >
                  {this.state.customerProjectList.map &&
                    this.state.customerProjectList.map((data, key) => {
                      return (
                        <tr
                          key={key}
                          onClick={(e) => this.handleClick(e, data)}
                        >
                          <td>
                            <div className="text-right">{key + 1}</div>
                          </td>
                          <td>
                            <div className="text-right">{data.title}</div>
                          </td>
                          <td>
                            <div className="text-right">{data.desc}</div>
                          </td>
                          <td>
                            <div className="text-right">{data.status}</div>
                          </td>
                        </tr>
                      );
                    })}
                </TableWrapper>
              </div>
            </div>
          </div>
        ) : (
          <div className="quotation-detail">
            <div className="form-group mb-4 pb-2">
              <div className="row mt-3">
                <div class="col-md-6 head-label-nav">
                  <p
                    class="category"
                    onClick={() => this.setState({ isVisible: false })}
                  >
                    Projects
                  </p>
                  <i class="icon-right mx-md-3"></i>
                  <p class="sub-category">View Project</p>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6 col-12 mb-4">
                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    "Project Title"
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={this.state.projectDetail.title}
                      name="projectTitle"
                      disabled={true}
                    />
                  </div>
                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    Project Description
                  </label>
                  <div className="input-group-desc">
                    <NormalTextarea
                      placeholder="Enter here"
                      value={this.state.projectDetail.desc}
                      name="projectDesc"
                      disabled={true}
                    />
                  </div>
                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    Status
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={this.state.projectDetail.status}
                      name="projectTitle"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    Customer
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={this.state.projectDetail.customer_name}
                      name="custName"
                      disabled={true}
                    />
                  </div>

                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    Contact Person
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={this.state.projectDetail.contact_person}
                      name="contName"
                      disabled={true}
                    />
                  </div>

                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    Contact Number
                  </label>
                  <div className="input-group">
                    <NormalInput
                      placeholder="Enter here"
                      value={this.state.projectDetail.contact_number}
                      name="contName"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6 col-12 mb-4"></div>
              <div className="col-md-6 col-12 mb-4">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Go to Project"
                  onClick={() => history.replace(`/admin/project/${this.state.projectDetailId}/editProject`)}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  //   customerProjectList: state.customerPlus.customerProjectList,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getCommonApi }, dispatch);
};

export const ProjectsHistory = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Projects)
);
