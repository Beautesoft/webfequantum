import React, { Component } from "react";
import PayModePieChart from "./PayModePieChart";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  NormalButton,
  NormalCheckbox,
  NormalInput,
  SwitchBox,
} from "component/common";
import "./style.scss";
import { withTranslation } from "react-i18next";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

export class PayModeClass extends Component {
  state = {
    // chartData: {
    //   chart: {
    //     plotBackgroundColor: null,
    //     plotBorderWidth: null,
    //     plotShadow: false,
    //     type: "pie",
    //   },
    //   title: {
    //     text: "Browser market shares in January, 2018",
    //   },
    //   tooltip: {
    //     pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    //   },
    //   accessibility: {
    //     point: {
    //       valueSuffix: "%",
    //     },
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       innerSize: "40%",
    //       cursor: "pointer",
    //       dataLabels: {
    //         enabled: true,
    //         format: "<b>{point.name}</b>: {point.percentage:.1f} %",
    //       },
    //     },
    //   },
    //   series: [
    //     {
    //       name: "",
    //       colorByPoint: true,
    //       data: [
    //         {
    //           name: "Chrome",
    //           y: 61.41,
    //         },
    //         {
    //           name: "Internet Explorer",
    //           y: 11.84,
    //         },
    //         {
    //           name: "Firefox",
    //           y: 10.85,
    //         },
    //         {
    //           name: "Edge",
    //           y: 4.67,
    //         },
    //         {
    //           name: "Safari",
    //           y: 4.18,
    //         },
    //         {
    //           name: "Sogou Explorer",
    //           y: 1.64,
    //         },
    //         {
    //           name: "Opera",
    //           y: 1.6,
    //         },
    //         {
    //           name: "QQ",
    //           y: 1.2,
    //         },
    //         {
    //           name: "Other",
    //           y: 2.61,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // TestchartData: {
    //   chart: {
    //     plotBackgroundColor: null,
    //     plotBorderWidth: null,
    //     plotShadow: false,
    //     type: "pie",
    //   },
    //   title: {
    //     text: "Browser market shares in January, 2018",
    //   },
    //   tooltip: {
    //     pointFormat:
    //       "<b>count: {point.y}</b><br/>" + "<b>Amount($): {point.z:.2f}</b>",
    //   },
    //   accessibility: {
    //     point: {
    //       valueSuffix: "%",
    //     },
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       innerSize: "40%",
    //       cursor: "pointer",
    //       dataLabels: {
    //         enabled: true,
    //         format: "<b>{point.name}</b>: {point.percent:.2f} %",
    //       },
    //     },
    //   },
    //   series: [
    //     {
    //       name: "",
    //       colorByPoint: true,
    //       data: [
    //         {
    //           name: "Chrome",
    //           y: 61,
    //           z: 124.632320000000003,
    //           color: "#96c344",
    //           percent: 5,
    //         },
    //         {
    //           name: "Internet Explorer",
    //           y: 11,
    //           z: 124.6,
    //           color: "green",
    //           percent: 5,
    //         },
    //         {
    //           name: "Firefox",
    //           y: 10,
    //           z: 129.6,
    //           color: "grey",
    //           percent: 5,
    //         },
    //         {
    //           name: "Edge",
    //           y: 4,
    //           color: "blue",
    //           percent: 5,
    //         },
    //         {
    //           name: "Safari",
    //           y: 4,
    //           z: 123.6,
    //           color: "orange",
    //           percent: 10,
    //         },
    //         {
    //           name: "Sogou Explorer",
    //           y: 1,
    //           z: 124.6,
    //           color: "black",
    //           percent: 8,
    //         },
    //         {
    //           name: "Opera",
    //           y: 1,
    //           z: 124.6,
    //           color: "purple",
    //           percent: 6,
    //         },
    //         {
    //           name: "QQ",
    //           y: 2,
    //           z: 10.6,
    //           color: "white",
    //           percent: 4,
    //         },
    //         {
    //           name: "Other",
    //           y: 61,
    //           z: 144.6,
    //           color: "royalblue",
    //           percent: 2,
    //         },
    //       ],
    //     },
    //   ],
    // },
    chartData: {},
    dayPayCompare: false,
    weekPayCompare: false,
    monthPayCompare: false,
    yearPayCompare: false,
    activeMenu: "today",
    paymodeCompare: false,
    deptmodeCompare: false,
    divmodeCompare: false,
    comparedChartData: {},
    breakstaffmodeCompare: false,
    breakdeptmodeCompare: false,
    breakdivmodeCompare: false,
    tdstaffmodeCompare: false,
    tddeptmodeCompare: false,
    tddivmodeCompare: false,
    isChart: false,
  };

  componentDidMount = async () => {
    let { type } = this.props;
    // this.getDataByOrder();
  };
  getDataByOrder = async () => {
    await this.setState({
      chartData: [],
    });
    let { chartData, activeMenu } = this.state;
    let { type } = this.props;
    let {
      paymodeCompare,
      divmodeCompare,
      deptmodeCompare,
      breakstaffmodeCompare,
      breakdivmodeCompare,
      breakdeptmodeCompare,
      tddeptmodeCompare,
      tddivmodeCompare,
      tdstaffmodeCompare,
    } = this.state;
    this.props
      .getCommonApi(`${this.props.apiURL}/?type=${activeMenu}`)
      .then(async res => {
        chartData = res.data[0];
        console.log(chartData, "paymodedata");
        await this.setState({
          chartData,
        });
      });
    if (
      (type == "paymode" && paymodeCompare) ||
      (type == "department" && deptmodeCompare) ||
      (type == "division" && divmodeCompare) ||
      (type == "staff" && breakstaffmodeCompare) ||
      (type == "department" && breakdeptmodeCompare) ||
      (type == "division" && breakdivmodeCompare) ||
      (type == "staff" && tdstaffmodeCompare) ||
      (type == "department" && tddeptmodeCompare) ||
      (type == "division" && tddivmodeCompare)
    ) {
      await this.setState({
        comparedChartData: {},
      });
      this.getDataByOrdercompared();
    } else {
      await this.setState({
        comparedChartData: {},
      });
    }
  };

  toggle = async tab => {
    if (this.state.activeMenu !== tab) {
      await this.setState({
        activeMenu: tab,
      });
      this.getDataByOrder();
    }
  };

  handleCompareChange = async ({ target: { name, value } }) => {
    await this.setState({
      [name]: value,
    });
    this.getcompareFlow();
  };
  getcompareFlow = async () => {
    let { type } = this.props;
    let {
      paymodeCompare,
      divmodeCompare,
      deptmodeCompare,
      breakdeptmodeCompare,
      breakdivmodeCompare,
      breakstaffmodeCompare,
      tddeptmodeCompare,
      tddivmodeCompare,
      tdstaffmodeCompare,
    } = this.state;
    if (
      (type == "paymode" && paymodeCompare) ||
      (type == "department" && deptmodeCompare) ||
      (type == "division" && divmodeCompare) ||
      (type == "staff" && breakstaffmodeCompare) ||
      (type == "department" && breakdeptmodeCompare) ||
      (type == "division" && breakdivmodeCompare) ||
      (type == "staff" && tdstaffmodeCompare) ||
      (type == "department" && tddeptmodeCompare) ||
      (type == "division" && tddivmodeCompare)
    ) {
      await this.setState({
        comparedChartData: {},
      });
      this.getDataByOrdercompared();
    } else {
      await this.setState({
        comparedChartData: {},
      });
    }
  };
  getDataByOrdercompared = async () => {
    let { comparedChartData, activeMenu } = this.state;

    let comparemenu = this.getComparemenu();

    this.props
      .getCommonApi(`${this.props.apiURL}/?type=${comparemenu}`)
      .then(async res => {
        comparedChartData = res.data[0];
        console.log(comparedChartData, "comparedChartData");
        await this.setState({
          comparedChartData,
        });
      });
  };
  getComparemenu = () => {
    let { activeMenu } = this.state;
    switch (activeMenu) {
      case "today":
        return "yesterday";
      case "yesterday":
        return "today";
      case "thisweek":
        return "lastweek";
      case "lastweek":
        return "thisweek";
      case "thismonth":
        return "lastmonth";
      case "lastmonth":
        return "thismonth";
      case "ytd":
        return "lastyear";
      case "lastyear":
        return "ytd";
      default:
        return "";
    }
  };
  handlehide = () => {
    this.setState(prevState => ({
      isChart: !prevState.isChart,
    }));
    this.handleLoadChart();
  };
  handleLoadChart = () => {
    let { isChart } = this.state;
    if (!isChart) {
      this.getDataByOrder();
    }
  };
  render() {
    let {
      chartData,
      activeMenu,
      paymodeCompare,
      deptmodeCompare,
      divmodeCompare,
      breakdeptmodeCompare,
      breakstaffmodeCompare,
      breakdivmodeCompare,
      tddeptmodeCompare,
      tdstaffmodeCompare,
      tddivmodeCompare,
      comparedChartData,
      isChart,
    } = this.state;
    let { t, type, mainTitle, switchBoxName } = this.props;
    return (
      <div className="piechart mb-2 mt-3 pb-2">
        <div className="d-flex flex-wrap justify-content-center aligm-items-center">
          <div className="col-md-1 col-12">
            <div className="h6">{t(mainTitle)}</div>
          </div>
          <div className="col-md-11 col-12">
            <div className="d-flex justify-content-center align-items-center">
              <div className="col-md-11 col-10">
                <div className="customer-detail tab-border">
                  <div className="filled-tabs">
                    <div className="tabs-block">
                      <Nav tabs>
                        <NavItem className="day-border">
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "today",
                            })}
                            onClick={() => {
                              this.toggle("today");
                            }}
                          >
                            {t("Today")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "yesterday",
                            })}
                            onClick={() => {
                              this.toggle("yesterday");
                            }}
                          >
                            {t("Yesterday")}
                          </NavLink>
                        </NavItem>
                        <NavItem className="week-border">
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "thisweek",
                            })}
                            onClick={() => {
                              this.toggle("thisweek");
                            }}
                          >
                            {t("This Week")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "lastweek",
                            })}
                            onClick={() => {
                              this.toggle("lastweek");
                            }}
                          >
                            {t("Last Week")}
                          </NavLink>
                        </NavItem>
                        <NavItem className="month-border">
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "thismonth",
                            })}
                            onClick={() => {
                              this.toggle("thismonth");
                            }}
                          >
                            {t("This Month")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "lastmonth",
                            })}
                            onClick={() => {
                              this.toggle("lastmonth");
                            }}
                          >
                            {t("Last Month")}
                          </NavLink>
                        </NavItem>
                        <NavItem className="year-border">
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "ytd",
                            })}
                            onClick={() => {
                              this.toggle("ytd");
                            }}
                          >
                            {t("YTD")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: this.state.activeMenu === "lastyear",
                            })}
                            onClick={() => {
                              this.toggle("lastyear");
                            }}
                          >
                            {t("Last Year")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-1 col-2">
                <div
                  className="d-flex align-items-center justify-content-center"
                  onClick={this.handlehide}
                >
                  {isChart == false ? (
                    <AiOutlinePlusCircle className="fs-27" />
                  ) : (
                    <AiOutlineMinusCircle className="fs-27" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isChart && (
          <TabContent
            activeTab={this.state.activeMenu}
            className="chart-border p-1"
          >
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                <div className="col-md-1 col-12">
                  <div className="d-flex justify-content-center align-items-center">
                    <span>{t("Compare")}</span>
                  </div>
                  <div className="d-flex flex-wrap justify-content-center align-items-center">
                    {type == "paymode" && switchBoxName == "paymodeCompare" ? (
                      <SwitchBox
                        checked={paymodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`paymodeCompare`}
                      />
                    ) : type == "department" &&
                      switchBoxName == "deptmodeCompare" ? (
                      <SwitchBox
                        checked={deptmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`deptmodeCompare`}
                      />
                    ) : type == "division" &&
                      switchBoxName == "divmodeCompare" ? (
                      <SwitchBox
                        checked={divmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`divmodeCompare`}
                      />
                    ) : type == "staff" &&
                      switchBoxName == "breakstaffmodeCompare" ? (
                      <SwitchBox
                        checked={breakstaffmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`breakstaffmodeCompare`}
                      />
                    ) : type == "department" &&
                      switchBoxName == "breakdeptmodeCompare" ? (
                      <SwitchBox
                        checked={breakdeptmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`breakdeptmodeCompare`}
                      />
                    ) : type == "division" &&
                      switchBoxName == "breakdivmodeCompare" ? (
                      <SwitchBox
                        checked={breakdivmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`breakdivmodeCompare`}
                      />
                    ) : type == "staff" &&
                      switchBoxName == "tdstaffmodeCompare" ? (
                      <SwitchBox
                        checked={tdstaffmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`tdstaffmodeCompare`}
                      />
                    ) : type == "department" &&
                      switchBoxName == "tddeptmodeCompare" ? (
                      <SwitchBox
                        checked={tddeptmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`tddeptmodeCompare`}
                      />
                    ) : type == "division" &&
                      switchBoxName == "tddivmodeCompare" ? (
                      <SwitchBox
                        checked={tddivmodeCompare}
                        onColor="green"
                        handleToggle={this.handleCompareChange}
                        name={`tddivmodeCompare`}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-11">
                  <div className="d-flex flex-wrap justify-content-center ">
                    <div className="col-md-6 col-12">
                      <PayModePieChart chartData={chartData} />
                    </div>
                    {(type == "paymode" && this.state.paymodeCompare) ||
                    (type == "department" && this.state.deptmodeCompare) ||
                    (type == "division" && this.state.divmodeCompare) ||
                    (type == "staff" && this.state.breakstaffmodeCompare) ||
                    (type == "division" && this.state.breakdivmodeCompare) ||
                    (type == "department" && this.state.breakdeptmodeCompare) ||
                    (type == "staff" && this.state.tdstaffmodeCompare) ||
                    (type == "division" && this.state.tddivmodeCompare) ||
                    (type == "department" && this.state.tddeptmodeCompare) ? (
                      <div className="col-md-6 col-12">
                        <PayModePieChart chartData={comparedChartData} />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabContent>
        )}
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   appointmentDetail: state.appointment.appointmentDetail,
//   selected_cstomer: state.common.selected_cstomer,
// });

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
    },
    dispatch
  );
};

export const PayMode = withTranslation()(
  connect(null, mapDispatchToProps)(PayModeClass)
);
