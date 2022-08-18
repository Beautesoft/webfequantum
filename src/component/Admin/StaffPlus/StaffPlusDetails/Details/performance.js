import React, { Component } from "react";
export class PerformanceDetails extends Component {
  state = {
    statistics: [
      {
        label: "Customers served",
        count: "25",
        avatar: "icon-user-1",
      },
      {
        label: "Hours worked",
        count: "1253",
        avatar: "icon-user-2",
      },
      {
        label: "Products sold",
        count: "100",
        avatar: "icon-shopping-bag",
      },
      {
        label: "Sales Contribution",
        count: "10,000",
        avatar: "icon-money-1-1",
      },
    ],
  };
  render() {
    let { statistics } = this.state;
    return (
      <>
        <div className="performance-detail">
          <div className="row stats-card ">
            {statistics &&
              statistics.map((data, index) => (
                <div key={index} className="card col-5">
                  <div className="row m-0">
                    <div className="col-8 pl-0 count-label">
                      <h2>{data.count}</h2>
                      <p>{data.label}</p>
                    </div>
                    <div className="col-4 pr-0 stats-icon d-flex align-items-center justify-content-center">
                      <i className={data.avatar}></i>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }
}
