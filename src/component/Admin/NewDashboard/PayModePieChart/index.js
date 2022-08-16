import React, { Component } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class PayModePieChart extends Component {
  state = {};

  render() {
    let { chartData } = this.props;

    return (
      <div className="col-12">
        <HighchartsReact highcharts={Highcharts} options={chartData} />
      </div>
    );
  }
}

export default PayModePieChart;
