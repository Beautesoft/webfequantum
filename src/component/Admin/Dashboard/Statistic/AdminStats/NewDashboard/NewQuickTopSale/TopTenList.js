import React, { Component } from "react";

export class TopTenList extends Component {
  render() {
    let { topTenList, Title,t } = this.props;

    return (
      <div className="row TopTen">
        <div className="response-table w-100">
          <div className="text-left fs-16 fw-600 TopTen-title mb-3 mt-5">
            {t(Title)}
          </div>
          {topTenList && topTenList.length > 0 ? (
            topTenList.map((data, index) => {
              return (
                <div className={`row table-body w-100 p-1`} key={index}>
                  <div className="col-8 text-uppercase">
                    <span className="topten-circle mr-1"></span>
                    {data.item}
                  </div>
                  <div className="col-2">{data.qty}</div>
                  <div className="col-2">${Number(data.amount).toFixed(2)}</div>
                </div>
              );
            })
          ) : (
            <div className="col-12">{t("No Data")}</div>
          )}
        </div>
      </div>
    );
  }
}
