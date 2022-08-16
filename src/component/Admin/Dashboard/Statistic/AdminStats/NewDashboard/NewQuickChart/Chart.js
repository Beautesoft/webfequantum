import React, { Component } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export class LineChart extends Component {
  state = {
    // To avoid unnecessary update keep all options in the state.
    hoverData: null,
  };

  setHoverData = e => {
    this.setState({ hoverData: e.target.category });
  };

  render() {
    const { chartOptions, hoverData, data,t } = this.props;

    return (
      <>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} t={t}/>
      </>
    );
  }
}
