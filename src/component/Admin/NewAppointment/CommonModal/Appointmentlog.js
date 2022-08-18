import React, { Component } from "react";
import { InputSearch, TableWrapper, NormalCheckbox } from "component/common";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
import _ from "lodash";
import { withTranslation } from "react-i18next";

export class AppointmentLogClass extends Component {
  state = {
    headerDetails: [
      { label: "User" },
      { label: "Date", divClass: "justify-content-end text-right" },
      { label: "From", divClass: "justify-content-end text-right" },
      { label: "To", divClass: "justify-content-end text-right" },
      { label: "Duration", divClass: "justify-content-end text-right" },
      { label: "Treatment" },
      { label: "Status" },
      { label: "Secondary Status" },
      { label: "Created Date", divClass: "justify-content-end text-right" },
      { label: "Staff" },
      { label: "Req. therapist", divClass: "justify-content-center" },
    ],
    LogList: [],
    meta: {},
    appointmentId: 0,
    cust_data: {},
  };

  componentWillMount = async () => {
    debugger;
    await this.setState({
      appointmentId: this.props.appointmentId,
    });
    this.getAppointmentLogList({});
  };
  getAppointmentLogList = data => {
    debugger;
    let { appointmentId } = this.state;
    let { page = 1, limit = 10 } = data;
    this.props
      .getCommonApi(
        `appointmentlog/?appt_id=${appointmentId}&page=${page}&limit=${limit}`
      )
      .then(res => {
        let { status, data, cust } = res;
        if (res.status === 200) {
          console.log(res, "apploglist");

          if (data) {
            this.setState({
              LogList: res.data.dataList,
              meta: res.data.meta.pagination,
              cust_data: cust,
            });
          } else {
            this.setState({
              LogList: res.data.dataList,
            });
          }
        }
      });
  };

  handlePagination = page => {
    this.getAppointmentLogList(page);
  };

  render() {
    let { headerDetails, LogList, meta, cust_data } = this.state;
    let { t } = this.props;
    return (
      <>
        <NormalModal
          className={"multiple-appointment select-category"}
          style={{ minWidth: "75%" }}
          modal={this.props.isAppointmentLogModal}
          handleModal={this.props.handleLogClick}
        >
          <img
            onClick={this.props.handleLogClick}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="customer-list container">
            <div className="tab-table-content">
              <div className="py-2">
                <div className="col-12 p-2 text-center">
                  <h5 className="fw-500">{t("Appointment Log")}</h5>
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
                </div>
                <div className="table-container">
                  <TableWrapper
                    headerDetails={headerDetails}
                    queryHandler={this.handlePagination}
                    pageMeta={meta}
                  >
                    {LogList && LogList.length > 0 ? (
                      LogList.map((item, index) => {
                        let {
                          username,
                          appt_date,
                          appt_fr_time,
                          appt_to_time,
                          add_duration,
                          appt_remark,
                          appt_status,
                          sec_status,
                          created_at,
                          emp_name,
                          requesttherapist,
                        } = item;
                        return (
                          <tr key={index}>
                            <td>
                              <div className="text-left">{username}</div>
                            </td>
                            <td>
                              <div className="text-right">{appt_date}</div>
                            </td>
                            <td>
                              <div className="text-right">{appt_fr_time}</div>
                            </td>
                            <td>
                              <div className="text-right">{appt_to_time}</div>
                            </td>
                            <td>
                              <div className="text-right">{add_duration}</div>
                            </td>
                            <td>
                              <div className="text-left">{appt_remark}</div>
                            </td>
                            <td>
                              <div className="text-left">{appt_status}</div>
                            </td>
                            <td>
                              <div className="text-left">{sec_status}</div>
                            </td>
                            <td>
                              <div className="text-right">{created_at}</div>
                            </td>
                            <td>
                              <div className="text-left">{emp_name}</div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <NormalCheckbox
                                  value={requesttherapist}
                                  name="requesttherapist"
                                  checked={requesttherapist}
                                  disabled
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12">
                          <div className="d-flex align-items-center justify-content-center">
                            {t("No data available ")}
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
      getCommonApi,
    },
    dispatch
  );
};

export const AppointmentLog = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AppointmentLogClass)
);
