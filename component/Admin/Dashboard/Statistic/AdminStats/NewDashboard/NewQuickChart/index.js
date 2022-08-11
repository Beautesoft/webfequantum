import { NormalButton } from "component/common";
import React, { Component } from "react";
import { LineChart } from "./Chart";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { NormalSelect } from "component/common";
import { withTranslation } from "react-i18next";

export class NewQuickChartClass extends Component {
  state = {
    transtype: "Quarterly",
    transtypeOptions: [
      { label: "Yearly", value: "Yearly" },
      { label: "Quarterly", value: "Quarterly" },
    ],
    data: [],
    // data: [
    //   {
    //     title: {
    //       text: "New Customer",
    //     },
    //     xAxis: {
    //       categories: [
    //         "Jan-2021",
    //         "Feb-2021",
    //         "Mar-2021",
    //         "Apr-2021",
    //         "May-2021",
    //         "Jun-2021",
    //         "Jul-2021",
    //         "Aug-2021",
    //         "Sep-2021",
    //         "Oct-2021",
    //         "Nov-2021",
    //         "Dec-2021",
    //       ],
    //       labels: {
    //         step: 1,
    //       },
    //     },
    //     yAxis: {
    //       min: 0,
    //       title: {
    //         text: "",
    //       },
    //       labels: {
    //         step: 1,
    //         format: "{value}",
    //       },
    //     },
    //     series: [
    //       {
    //         name: "New Customer 1 (Male)",
    //         data: [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         color: "#ffa31a",
    //       },
    //       {
    //         name: "New Customer 2 (Male)",
    //         data: [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         color: "#ffa31a",
    //       },
    //       {
    //         name: "New Customer (Male)",
    //         data: [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         color: "#ffa31a",
    //       },
    //       {
    //         name: "New Customer (Female)",
    //         data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         color: "#a1cae2",
    //       },
    //       {
    //         name: "Dummy Customer (others)",
    //         data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         color: "#a1cae2",
    //       },
    //     ],
    //     legend: {
    //       position: "bottom",
    //       align: "center",
    //     },
    //     outlinetext: "Total Number of Customer",
    //     outlinevalue: 4,
    //   },
    //   {
    //     title: {
    //       text: "Product Sold QTY",
    //     },
    //     xAxis: {
    //       categories: [
    //         "Jan-2021",
    //         "Feb-2021",
    //         "Mar-2021",
    //         "Apr-2021",
    //         "May-2021",
    //         "Jun-2021",
    //         "Jul-2021",
    //         "Aug-2021",
    //         "Sep-2021",
    //         "Oct-2021",
    //         "Nov-2021",
    //         "Dec-2021",
    //       ],
    //       labels: {
    //         step: 1,
    //       },
    //     },
    //     yAxis: {
    //       min: 0,
    //       title: {
    //         text: "",
    //       },
    //       labels: {
    //         step: 1,
    //         format: "{value}",
    //       },
    //     },
    //     series: [
    //       {
    //         code: "100016",
    //         name: "TONG JUM CHEW 锺炎州",
    //         color: "#B7F19C",
    //         data: [0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       },
    //     ],
    //     legend: {
    //       align: "right",
    //       verticalAlign: "top",
    //       layout: "vertical",
    //       x: 0,
    //       y: 100,
    //     },
    //     outlinetext: "Total Number of Customer",
    //     outlinevalue: 4,
    //   },
    //   {
    //     title: {
    //       text: "Service Sales Amount",
    //     },
    //     xAxis: {
    //       categories: [
    //         "Jan-2021",
    //         "Feb-2021",
    //         "Mar-2021",
    //         "Apr-2021",
    //         "May-2021",
    //         "Jun-2021",
    //         "Jul-2021",
    //         "Aug-2021",
    //         "Sep-2021",
    //         "Oct-2021",
    //         "Nov-2021",
    //         "Dec-2021",
    //       ],
    //       labels: {
    //         step: 1,
    //       },
    //     },
    //     yAxis: {
    //       min: 0,
    //       title: {
    //         text: "",
    //       },
    //       labels: {
    //         step: 1,
    //         format: "{value}",
    //       },
    //     },
    //     series: [
    //       {
    //         code: "42",
    //         name: "BODY",
    //         color: "#B46966",
    //         data: [1000, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       },
    //     ],
    //     legend: {
    //       align: "right",
    //       verticalAlign: "top",
    //       layout: "vertical",
    //       x: 0,
    //       y: 100,
    //     },
    //   },
    //   {
    //     title: {
    //       text: "Treatment Done Count",
    //     },
    //     xAxis: {
    //       categories: [
    //         "Jan-2021",
    //         "Feb-2021",
    //         "Mar-2021",
    //         "Apr-2021",
    //         "May-2021",
    //         "Jun-2021",
    //         "Jul-2021",
    //         "Aug-2021",
    //         "Sep-2021",
    //         "Oct-2021",
    //         "Nov-2021",
    //         "Dec-2021",
    //       ],
    //       labels: {
    //         step: 1,
    //       },
    //     },
    //     yAxis: {
    //       min: 0,
    //       title: {
    //         text: "",
    //       },
    //       labels: {
    //         step: 1,
    //         format: "{value}",
    //       },
    //     },
    //     series: [
    //       {
    //         code: "42",
    //         name: "Male",
    //         color: "#B46966",
    //         data: [200, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       },
    //     ],
    //     legend: {
    //       position: "top",
    //       align: "center",
    //     },
    //   },
    // ],
  };

  componentDidMount() {
    this.getDataByOrder();
  }

  getDataByOrder = () => {
    let { transtype, data } = this.state;
    this.props.getCommonApi(`dashboardchart/?select=${transtype}`).then(res => {
      data = res.data;
      this.setState({
        data,
      });
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    let { transtype } = this.state;
    if (transtype != value) {
      transtype = value;
      await this.setState({
        transtype,
      });
      this.getDataByOrder();
    }
  };
  render() {
    const { chartOptions, data, transtype, transtypeOptions } = this.state;
    let {t} = this.props;
    return (
      <div className="Line-chart">
        <div className="d-flex justify-content-end flex-row mt-5 mb-3">
          <div className="col-md-2 col-12">
            <NormalSelect
              placeholderrequired="false"
              options={transtypeOptions}
              value={transtype}
              iconname="icon-down-key"
              name="transtype"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between flex-wrap">
          {data && data.length > 0 ? (
            data.map((item, index) => {
              return (
                <div className="col-12 col-md-6 mb-3 p-2" key={index}>
                  <LineChart height="150" width="150" chartOptions={item}  t={t}/>

                  <div className="text-center fw-500 p-1">
                    <p className="text-center">
                      {t(item.outlinetext)} : {item.outlinevalue}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center w-100">{t("No data available ")}</div>
          )}
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const NewQuickChart = withTranslation()(connect(
  null,
  mapDispatchToProps
)(NewQuickChartClass));
