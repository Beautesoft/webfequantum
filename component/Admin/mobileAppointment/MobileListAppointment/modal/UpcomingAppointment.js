import React, { Component } from "react";
import { InputSearch, TableWrapper } from "component/common";
import { updateForm, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
import _ from "lodash";
import { withTranslation } from "react-i18next";

export class UpcomingAppointmentClass extends Component {
  state = {
    headerDetails: [
      { label: "Date", divClass: "justify-content-end text-right" },
      { label: "Description", width: "250px" },
      { label: "Staff" },
      { label: "Status" },
      { label: "Secondary Status" },
      { label: "Location" },
    ],
    upcomingAppList: [],
    meta: {},
    customerNumber: 0,
    CustomerName: "",
    customerPhone: "",
    CustomerRemark: "",
    cust_data: {},
  };

  componentWillMount = async () => {
    await this.setState({
      customerNumber: this.props.customerNumber,
      CustomerName: this.props.custName,
      customerPhone: this.props.custPhone,
      CustomerRemark: this.props.CustomerRemark,
    });
    this.getUpcomingAppList({});
  };

  getUpcomingAppList = data => {
    let { customerNumber } = this.state;
    let { page = 1, limit = 10, search = "" } = data;
    this.props
      .getCommonApi(
        `upcomingappointment/?cust_id=${customerNumber}&page=${page}&limit=${limit}`
      )
      .then(res => {
        console.log(res, "dsfdfaafg");
        let { data, cust, status } = res;
        if (status === 200) {
          if (data) {
            this.setState({
              upcomingAppList: data.dataList,
              meta: data.meta.pagination,
              cust_data: cust,
            });
          }
        }
      });
  };

  handlePagination = page => {
    this.getUpcomingAppList(page);
  };
  // handlesearch = (event) => {
  //     console.log("sadfasdfasdf", event.target.value)
  //     event.persist();

  //     if (!this.debouncedFn) {
  //         this.debouncedFn = _.debounce(() => {
  //             let searchString = event.target.value;
  //             let data = { search: searchString }
  //             this.getUpcomingAppList(data)
  //         }, 500);
  //     }
  //     this.debouncedFn();
  // }

  render() {
    let {
      headerDetails,
      upcomingAppList,
      meta,
      CustomerName,
      customerPhone,
      CustomerRemark,
      cust_data,
    } = this.state;
    let { customerId, t } = this.props;
    return (
      <>
        <NormalModal
          className={"multiple-appointment select-category"}
          style={{ minWidth: "75%" }}
          modal={this.props.isUpcomingAppointmentModal}
          handleModal={this.props.handleUpcomingAppointment}
        >
          <img
            onClick={this.props.handleUpcomingAppointment}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="customer-list p-3">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="col-12 p-2 text-center">
                  <h5 className="fw-500">{t("Upcoming Appointment")}</h5>
                </div>
                <div className="d-flex flex-noWrap mb-2">
                  <div className="col-3">
                    <div className="col-12">
                      {t("Name")} :{" "}
                      <span className="fw-500 h6">{cust_data.cust_name}</span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="col-12">
                      {t("Reference")} :{" "}
                      <span className="fw-500 h6">{cust_data.cust_refer}</span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="col-12">
                      {t("Phone")} :{" "}
                      <span className="fw-500 h6">{customerPhone}</span>
                    </div>
                  </div>
                  {this.props.CustomerRemarkFlag ? (
                    <div className="col-3">
                      <div className="col-12">
                        {t("Permanent Remark")} :{" "}
                        <span className="fw-500 h6">{CustomerRemark}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="table-container">
                  <TableWrapper
                    headerDetails={headerDetails}
                    queryHandler={this.handlePagination}
                    pageMeta={meta}
                  >
                    {upcomingAppList && upcomingAppList.length > 0 ? (
                      upcomingAppList.map((item, index) => {
                        let {
                          id,
                          appt_date,
                          appt_fr_time,
                          appt_remark,
                          emp_name,
                          appt_status,
                          sec_status,
                          itemsite_code,
                        } = item;
                        return (
                          <tr key={id}>
                            <td>
                              <div className="text-right">
                                {appt_date} {appt_fr_time}
                              </div>
                            </td>
                            <td>
                              <div className="text-left">{appt_remark}</div>
                            </td>
                            <td>
                              <div className="text-left">{emp_name}</div>
                            </td>
                            <td>
                              <div className="text-left">{appt_status}</div>
                            </td>
                            <td>
                              <div className="text-left">{sec_status}</div>
                            </td>
                            <td>
                              <div className="text-left">{itemsite_code}</div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12">
                          <div className="d-flex align-items-center justify-content-center">
                            {t("No Data Available")}
                          </div>
                        </td>
                      </tr>
                    )}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </NormalModal>
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
      updateForm,
      getCommonApi,
    },
    dispatch
  );
};

export const UpcomingAppointment = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(UpcomingAppointmentClass)
);
