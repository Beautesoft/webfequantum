import React, { Component } from "react";
import { NormalInput, NormalButton } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonUpdateApi,
  commonPatchApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import { Toast } from "service/toast";

export class AppointmentSettingsClass extends Component {
  state = {
    startday_hour: "",
    endday_hour: "",
    cell_duration: "",
    resource_count: "",
  };
  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };
  componentDidMount = async () => {
    let { id, startday_hour, endday_hour, cell_duration, resource_count } =
      this.state;
    let { SchedulerSetting } = this.props;
    id = SchedulerSetting.settingId;
    startday_hour = Number(SchedulerSetting.startday_hour).toFixed(2);
    endday_hour = Number(SchedulerSetting.endday_hour).toFixed(2);
    cell_duration = SchedulerSetting.cell_duration;
    resource_count = SchedulerSetting.resource_count;

    await this.setState({
      id,
      startday_hour,
      endday_hour,
      cell_duration,
      resource_count,
    });
  };
  handleClear = () => {
    this.setState({
      startday_hour: "",
      endday_hour: "",
      cell_duration: "",
      resource_count: "",
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = () => {
    let { startday_hour, endday_hour, cell_duration, resource_count } =
      this.state;
    if (Number(startday_hour) < Number(endday_hour)) {
      let body = {};
      if (this.validator.allValid()) {
        body = {
          startday_hour: startday_hour,
          endday_hour: endday_hour,
          cell_duration: cell_duration,
          resource_count: resource_count,
        };
        this.props
          .commonPatchApi(
            `siteappointsetting/${this.props.SchedulerSetting.settingId}/`,
            body
          )
          .then(key => {
            let { status } = key;
            console.log(key, "response for submit");
            if (status == "200") {
              this.props.handleModal();
              this.props.handleSettingChange();
            }
          });
      } else {
        this.validator.showMessages();
      }
    } else {
      Toast({
        type: "error",
        message: "Start hour must be earlier than end hour",
      });
    }
  };
  handlesStartHour = () => {
    let { startday_hour } = this.state;
    if (Number(startday_hour) > 24 || Number(startday_hour) < 0) {
      Toast({
        type: "error",
        message: "Please enter valid Start hour (MAX. 24 hours)",
      });
      this.setState({
        startday_hour: "",
      });
    }
  };

  handlesEndHour = () => {
    let { endday_hour, startday_hour } = this.state;
    if (
      Number(endday_hour) > 24 ||
      Number(endday_hour) < 0 ||
      Number(endday_hour) < Number(startday_hour)
    ) {
      Toast({
        type: "error",
        message: "Please enter valid End hour (MAX. 24 hours)",
      });
      this.setState({
        endday_hour: "",
      });
    }
  };

  render() {
    let { startday_hour, endday_hour, cell_duration, resource_count } =
      this.state;
    return (
      <>
        <div className="container-fluid mb-4">
          <div className="row pl-3">
            <div className="col-md-9 col-12">
              <h6 className="text-secondary fs-19 fw-500">Scheduler Setting</h6>
            </div>
            <div className="col-md-2 col-12"></div>
          </div>
          <div className="row pl-5 pr-5 mt-4">
            <div className="row mb-3">
              <div className="col-md-2 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  Start Hour
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={startday_hour}
                    type="number"
                    name="startday_hour"
                    onChange={this.handleChange}
                    onBlur={this.handlesStartHour}
                  />
                </div>
                {this.validator.message(
                  "start day hour",
                  startday_hour,
                  "required"
                )}
              </div>
              <div className="col-md-2 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  End Hour
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={endday_hour}
                    type="number"
                    name="endday_hour"
                    onChange={this.handleChange}
                    onBlur={this.handlesEndHour}
                  />
                </div>
                {this.validator.message(
                  "end day hour",
                  endday_hour,
                  "required"
                )}
              </div>
              <div className="col-md-2 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  Duration
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={cell_duration}
                    type="number"
                    name="cell_duration"
                    onChange={this.handleChange}
                    onBlur={this.handlePrepaidValueChange}
                  />
                </div>
                {this.validator.message("duration", cell_duration, "required")}
              </div>
              <div className="col-md-3 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  Resource Count
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={resource_count}
                    type="number"
                    name="resource_count"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message(
                  "resource count",
                  resource_count,
                  "required"
                )}
              </div>
              <div className="col-md-2 col-12 mt-4">
                <div className="d-flex justify-content-center">
                  <NormalButton
                    mainbg={false}
                    className="col-12 fs-15 submit-btn"
                    label="Submit"
                    onClick={this.handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  basicApptDetail: state.appointment.basicApptDetail,
  SchedulerSetting: state.appointment.SchedulerSetting,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonUpdateApi,
      commonPatchApi,
    },
    dispatch
  );
};
export const AppointmentSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentSettingsClass);
