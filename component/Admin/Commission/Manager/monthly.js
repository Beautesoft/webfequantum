import React, { Component } from "react";
import {
  TableWrapper,
  InputSearch,
  NormalButton,
  NormalDateTime,
} from "component/common";
import { withTranslation } from "react-i18next";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export default class MonthlycommissionClass extends Component {
  state = {
    SalescommissionDetails: [
      { label: "Staff Code" },
      { label: "Commission" },
      { label: "Remarks" },
    ],
    SalesList: [],
    month: new Date(),
    filterByName: "",
    F_date: new Date(),
  };

  handleChange = ({ target: { value, name } }) => {
    let { filterByName } = this.state;
    if (name == "remark") {
      filterByName = value;
    }

    this.setState({ filterByName });
  };
  handleDatePick = (name, value) => {
    // console.log(data);
    let { month } = this.state;
    month = value;
    this.setState({ month });
    console.log(month);
  };
  render() {
    let { t } = this.props;
    let {
      SalesList,
      SalescommissionDetails,
      is_loading,
      filterByName,
      F_date,
    } = this.state;
    return (
      <div className="container-fluid commission">
        <div className="d-flex justify-content-between">
          <div className="h4">{t("Staff Performance")}</div>
          <div className="d-flex ">
            <div className="input-group p-2">
              <NormalDateTime
                selected={new Date()}
                onChange={this.handleDatePick}
                selectsEnd
                startDate={new Date()}
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
            <div className="p-2 ">
              <NormalButton
                mainbg={true}
                label={"Submit"}
                // onClick={() =>
                //   this.props.history.push(`/admin/commission/Amountsetting`)
                // }
              />
            </div>
            <div className="p-2 ">
              <NormalButton
                mainbg={true}
                label={"ALL"}
                // onClick={() =>
                //   this.props.history.push(`/admin/commission/Amountsetting`)
                // }
              />
            </div>
          </div>
        </div>

        {/*   Sales Commssion*/}
        <div className="d-flex  p-3 itemstatusgroup mt-5 text-center">
          {t("Commossion for March month")}
        </div>
        <div className="row mt-5">
          <div className="col-sm-12">
            <TableWrapper
              className="table table-responsive mb-3"
              headerDetails={SalescommissionDetails}
            >
              {SalesList.map((item, index) => {
                let { desc, amount, qty } = item;
                return (
                  <tr key={index}>
                    <td>
                      <div className="text-left">{desc}</div>
                    </td>
                    <td>
                      <div className="text-right">
                        {parseFloat(amount).toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <div className="text-right"></div>
                    </td>
                  </tr>
                );
              })}

              <tr className="day-end-footer fw-500">
                <td>
                  <div className="d-flex align-items-center justify-content-end">
                    {t("Total")}
                  </div>
                </td>
                <td>
                  <div className="text-right">{SalesList.total_amount}</div>
                </td>
              </tr>
            </TableWrapper>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export const Monthlycommission = withTranslation()(
  connect(null, mapDispatchToProps)(MonthlycommissionClass)
);
