import React from "react";

import Scheduler, { Resource, View } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { data, moviesData, theatreData } from "./data.js";
import ResourceCell from "./ResourceCell.js";
import { connect } from "react-redux";
import { dateFormat } from "service/helperFunctions";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";

const currentDate = new Date(2021, 1, 18);
const groups = ["user_id"];

const views = [
  {
    type: "day",
    name: "day",
    intervalCount: 1,
    startDayHour: 9,
    endDayHour: 21,
    crossScrollingEnabled: true,
    cellDuration: 10,
  },
  {
    type: "week",
    name: "Week",
    groupOrientation: "vertical",
    startDayHour: 9,
    endDayHour: 21,
    cellDuration: 10,
    intervalCount: 1,
  },
  {
    type: "month",
    name: "Month",
    intervalCount: 1,
  },
];

export class SchedulerModalClass extends React.Component {
  state = {
    events: [],
    date: new Date(),
    filterDate: "",
  };

  render() {
    let { events } = this.state;
    return (
      <div
        ref={input => {
          this.schedulerContainer = input;
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scheduler
          timeZone="America/Los_Angeles"
          dataSource={events}
          views={views}
          defaultCurrentView="day"
          defaultCurrentDate={currentDate}
          groups={groups}
          height={700}
          firstDayOfWeek={1}
          showAllDayPanel={false}
          crossScrollingEnabled={false}
          editing={false}
          resourceCellComponent={ResourceCell}
          // appointmentComponent={Appointment}
          // appointmentTooltipComponent={AppointmentTooltip}
          // onAppointmentFormOpening={this.onAppointmentFormOpening}
        >
          <Resource
            dataSource={events}
            fieldExpr="movieId"
            useColorAsDefault={true}
            allowMultiple={false}
          />
          <Resource
            dataSource={events}
            fieldExpr="theatreId"
            useColorAsDefault={true}
            allowMultiple={false}
          />
        </Scheduler>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
    },
    dispatch
  );
};

export const SchedulerExpressModal = connect(
  null,
  mapDispatchToProps
)(SchedulerModalClass);
