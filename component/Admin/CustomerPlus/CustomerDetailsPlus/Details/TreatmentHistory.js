import React, { Component } from "react";
import { TableWrapper } from "component/common";
import { getCommonApi, commonDeleteApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class TreatmentHistoryClass extends Component {
  state = {
    headerDetails: [
      {
        label: "S.No",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Date",
        divClass: "justify-content-end text-right",
      },
      {
        label: "From",
        divClass: "justify-content-end text-right",
      },
      {
        label: "To",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Staff Name",
      },
      {
        label: "App. Status",
      },
      {
        label: "Site",
      },
      {
        label: "Sec. Status",
      },
      {
        label: "Remarks",
      },
    ],
    upcomingAppointment: [],
    pageMeta: {},
    active: false,
    currentIndex: -1,
  };

  componentDidMount() {
    this.setState({
      CustomerId: this.props.id,
    });
    this.queryHandler({});
  }

  // api call for list
  queryHandler = data => {
    let { page = 1, limit = 10, search = "" } = data;
    this.props
      .getCommonApi(
        `custapptupcoming/?cust_id=${this.props.id}&page=${page}&limit=${limit}`
      )
      .then(res => {
        console.log(res, "customerappointmentupdatedupcominglist");
        let { data } = res;
        let { upcomingAppointment, pageMeta } = this.state;
        upcomingAppointment = [];
        pageMeta = {};
        this.setState({
          upcomingAppointment,
          pageMeta,
        });
        if (data && data.dataList) {
          upcomingAppointment = data.dataList;
          pageMeta = data.meta.pagination;
        }
        this.setState({
          upcomingAppointment,
          pageMeta,
        });
      });
  };

  handleClick = key => {
    let currentIndex;
    if (this.state.active == true) {
      this.setState({
        active: false,
        currentIndex: "-1",
      });
    } else {
      this.setState({
        active: true,
        currentIndex: key,
      });
    }
  };

  handlePagination = page => {
    this.queryHandler(page);
  };

  render() {
    let { headerDetails, upcomingAppointment, pageMeta, currentIndex } =
      this.state;
    return (
      <>
        <div className="">
          <div className="py-4">
            <div className="table">
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
                pageMeta={pageMeta}
              >
                {upcomingAppointment &&
                  upcomingAppointment.length > 0 &&
                  upcomingAppointment.map((item, index) => {
                    let {
                      id,
                      appt_date,
                      appt_fr_time,
                      appt_to_time,
                      emp_name,
                      appt_status,
                      itemsite_code,
                      sec_status,
                      appt_remark,
                    } = item;
                    return (
                      <tr key={index}>
                        <td>
                          <div className="text-right">{index + 1}</div>
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
                          <div className="text-left">{emp_name}</div>
                        </td>
                        <td>
                          <div className="text-left">{appt_status}</div>
                        </td>
                        <td>
                          <div className="text-left">{itemsite_code}</div>
                        </td>
                        <td>
                          <div className="text-left">{sec_status}</div>
                        </td>
                        <td>
                          <div className="text-left">{appt_remark}</div>
                        </td>
                      </tr>
                    );
                  })}
              </TableWrapper>
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
      getCommonApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const TreatmentHistory = connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentHistoryClass);
