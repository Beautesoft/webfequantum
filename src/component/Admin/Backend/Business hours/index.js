import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalDate,
  NormalInput,
  NormalTimePicker,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  Businesshrs,
  NewBusinesshrs,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import moment from "moment";

export class BusinesshoursClass extends Component {
  state = {
    CommissionDetails: [
      { label: "Business Day" },
      { label: "Status" },
      { label: "Start Time", divClass: "justify-content-end" },
      { label: "End Time", divClass: "justify-content-end" },
    ],
    site_code: null,
    isoption: false,
    iscreation: false,
    issite: false,
    islist: false,
    staffList: [],
    bus_day: null,
    status: null,
    start_time: null,
    end_time: null,
    bus_dayedit: null,
    statusedit: null,
    start_timeedit: null,
    end_timeedit: null,
    site_codeedit: null,
  };

  businesscontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  listcontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  componentDidMount = () => {
    this.Listofbushours({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  handleedit = async (itemcode) => {
    let {
      edit,
      bus_dayedit,
      statusedit,
      start_timeedit,
      end_timeedit,
      site_codeedit,
      temp,
    } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.Businesshrs().then((res) => {
      console.log(res);

      let objIndex = res.findIndex((obj) => obj.businessday == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      bus_dayedit = temp.businessday;
      statusedit = temp.status;
      // start_timeedit = temp.starttime;
      //  end_timeedit = temp.endtime;
      site_codeedit = temp.sitecode;
      this.setState({
        bus_dayedit,
        statusedit,
        start_timeedit,
        end_timeedit,
        site_codeedit,
      });
    });
    this.businesscontent();
  };

  handleupdates = async () => {
    let { edit, bus_day, status, start_time, end_time, site_code } = this.state;
    let descJson = {
      businessday: this.state.bus_dayedit,
      status: this.state.statusedit,
      starttime: this.state.start_timeedit,
      endtime: this.state.end_timeedit,
      sitecode: this.state.site_codeedit,
    };
    await this.props
      .updateCommon(
        `Businesshrs/update?where=%7B%22businessday%22%3A%20%22${this.state.codeedit}%22%7D
    `,
        descJson
      )
      .then((data) => {
        this.Listofbushours({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edit = false;
    bus_day = "";
    status = "";
    start_time = "";
    end_time = "";
    site_code = "";

    this.setState({ edit, bus_day, status, start_time, end_time, site_code });
    this.businesscontent();
  };

  Listofbushours = async () => {
    this.updateState({ is_loading: true });
    await this.props.Businesshrs().then((res) => {
      console.log(res);
      let { staffList } = this.state;

      staffList = res;
      console.log(staffList);
      this.setState({
        staffList,
        is_loading: false,
      });
      console.log(staffList.length);
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { bus_day, status, site_code } = this.state;
    if (name == "bus_day") {
      bus_day = value;
      this.setState({ bus_day });
    }
    if (name == "status") {
      status = value;
      this.setState({ status });
    }
    if (name == "site_code") {
      site_code = value;
      this.setState({ site_code });
    }
  };

  handleeditinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { bus_dayedit, statusedit, site_codeedit } = this.state;
    if (name == "bus_day") {
      bus_dayedit = value;
      this.setState({ bus_dayedit });
    }
    if (name == "status") {
      statusedit = value;
      this.setState({ statusedit });
    }
    if (name == "site_code") {
      site_codeedit = value;
      this.setState({ site_codeedit });
    }
  };

  Addnew = async () => {
    let { bus_day, status, site_code, start_time, end_time } = this.state;
    let newroom = {
      businessday: bus_day,
      status: status,
      starttime: start_time,
      endtime: end_time,
      sitecode: site_code,
    };
    await this.props
      .NewBusinesshrs(newroom)
      .then((data) => {
        this.Listofbushours();
        Toast({
          type: "success",
          message: "Successfully Added",
        });
        bus_day = "";
        status = "";
        site_code = "";
        start_time = null;
        end_time = null;
        this.setState({ bus_day, status, site_code, start_time, end_time });
      })
      .catch((e) => console.log(e));
  };

  starttime = ({ target: { value, name } }) => {
    let { start_time } = this.state;
    start_time = value;
    this.setState({ start_time });
    console.log(start_time);
  };

  totime = ({ target: { value, name } }) => {
    let { end_time } = this.state;
    end_time = value;
    this.setState({ end_time });
    console.log(end_time);
  };

  editstarttime = ({ target: { value, name } }) => {
    let { start_timeedit } = this.state;
    start_timeedit = value;
    this.setState({ start_timeedit });
    console.log(start_timeedit);
  };

  edittotime = ({ target: { value, name } }) => {
    let { end_timeedit } = this.state;
    end_timeedit = value;
    this.setState({ end_timeedit });
    console.log(end_timeedit);
  };
  render() {
    let {
      CommissionDetails,
      pageMeta,
      staffList,
      is_loading,
      bus_day,
      status,
      iscreation,
      islist,
      site_code,
      start_time,
      end_time,
      site_codeedit,
      start_timeedit,
      end_timeedit,
      bus_dayedit,
      statusedit,
      edit,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid focreason">
          <h4>{t("Business Hours")}</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 foc"
                onClick={() => this.businesscontent()}
              >
                <p>{t("Business Hours Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Business Day")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={bus_day}
                            name="bus_day"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Status")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={status}
                            name="status"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Start Time")}</p>
                        <div className="input-group">
                          <NormalTimePicker
                            className={`cursor-pointer`}
                            onChange={this.starttime}
                            label="start_time"
                            name="start_time"
                            timeOnly={true}
                            dateFormat={`HH:mm`}
                            showTime={true}
                            selected={false}
                            placeholder=""
                            timeIntervals={5}
                            value={start_time}
                            showIcon={false}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("End Time")}</p>
                        <div className="input-group">
                          <NormalTimePicker
                            className={`cursor-pointer`}
                            onChange={this.totime}
                            label="end_time"
                            name="end_time"
                            timeOnly={true}
                            dateFormat={`HH:mm`}
                            showTime={true}
                            selected={false}
                            placeholder=""
                            timeIntervals={5}
                            value={end_time}
                            showIcon={false}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Site Code")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={site_code}
                            name="site_code"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.Addnew()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <div
                className="d-flex  justify-content-between p-3 foc"
                onClick={() => this.businesscontent()}
              >
                <p>{t("Business Hours Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Business Day")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={bus_dayedit}
                            name="bus_day"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Status")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={statusedit}
                            name="status"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Start Time")}</p>
                        <div className="input-group">
                          <NormalTimePicker
                            className={`cursor-pointer`}
                            onChange={this.editstarttime}
                            label="start_timeedit"
                            name="start_timeedit"
                            timeOnly={true}
                            dateFormat={`HH:mm`}
                            showTime={true}
                            selected={false}
                            placeholder=""
                            timeIntervals={5}
                            value={start_timeedit}
                            showIcon={false}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("End Time")}</p>
                        <div className="input-group">
                          <NormalTimePicker
                            className={`cursor-pointer`}
                            onChange={this.edittotime}
                            label="end_timeedit"
                            name="end_timeedit"
                            timeOnly={true}
                            dateFormat={`HH:mm`}
                            showTime={true}
                            selected={false}
                            placeholder=""
                            timeIntervals={5}
                            value={end_timeedit}
                            showIcon={false}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Site Code")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={site_codeedit}
                            name="site_code"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Update"}
                          onClick={() => this.handleupdates()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}

          <div
            className="d-flex  justify-content-between p-3 mt-5 foc"
            onClick={() => this.listcontent()}
          >
            <p>{t("Business Hours List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Business Hours")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={CommissionDetails}
                        queryHandler={this.handlePagination}
                        pageMeta={pageMeta}
                      >
                        {is_loading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : staffList.length > 0 ? (
                          staffList.map(
                            (
                              { businessday, status, starttime, endtime },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-left text-success"
                                      onClick={() =>
                                        this.handleedit(businessday)
                                      }
                                    >
                                      {businessday}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{status}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {moment(starttime).format("hh:mm A")}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {moment(endtime).format("hh:mm A")}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : null}
                      </TableWrapper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      Businesshrs,
      NewBusinesshrs,
      updateCommon,
    },
    dispatch
  );
};

export const Businesshours = withTranslation()(
  connect(null, mapDispatchToProps)(BusinesshoursClass)
);
