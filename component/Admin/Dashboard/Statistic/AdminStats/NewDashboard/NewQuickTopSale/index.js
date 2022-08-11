import React, { Component } from "react";
import { TopTenList } from "./TopTenList";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import { NormalSelect } from "component/common";
import "./style.scss";
import { withTranslation } from "react-i18next";
export class NewQuickTopSaleClass extends Component {
  state = {
    top_product: [],
    top_service: [],
    top_prepaid: [],
    top_voucher: [],
    top_td: [],
    toplistcount: 10,
    Top10byPrice: true,
    Top20byPrice: false,
    Top10byQty: false,
    Top20byQty: false,
    orderBy: "price",
    transtypeOptions: [
      { label: "Top 10 (Price)", value: "price_10" },
      { label: "Top 20 (Price)", value: "price_20" },
      { label: "Top 10 (Qty)", value: "qty_10" },
      { label: "Top 20 (Qty)", value: "qty_20" },
    ],
    transtype: "price_10",
  };
  componentDidMount() {
    this.getTopList();
  }

  getTopList = () => {
    let {
      top_product,
      top_service,
      top_prepaid,
      top_voucher,
      top_td,
      toplistcount,
      orderBy,
    } = this.state;

    this.props
      .getCommonApi(
        `dashboardtopproduct/?select=${toplistcount}&order_by=${orderBy}`
      )
      .then(res => {
        console.log(res, "custtopsalereport");
        top_product = res.top_product;
        top_service = res.top_service;
        top_prepaid = res.top_prepaid;
        top_voucher = res.top_voucher;
        top_td = res.top_td;
        this.setState({
          top_product,
          top_service,
          top_prepaid,
          top_voucher,
          top_td,
        });
      });
  };

  handleChange = async ({ target: { value, name } }) => {
    let { transtype } = this.state;
    if (transtype != value) {
      transtype = value;
      let res = value.split("_");
      await this.setState({
        transtype,
        toplistcount: Number(res[1]),
        orderBy: res[0],
      });
      this.getTopList();
    }
  };

  render() {
    let {
      top_product,
      top_service,
      top_prepaid,
      top_voucher,
      top_td,
      Top10byPrice,
      Top20byPrice,
      Top10byQty,
      Top20byQty,
      transtypeOptions,
      transtype,
    } = this.state;
    let {t} = this.props;
    return (
      <div className="TopTen">
        <div className="d-flex justify-content-end flex-row mt-3">
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

        <div className="d-flex flex-wrap px-2">
          <div className="col-md-4 col-12">
            <TopTenList Title="Product Sales" topTenList={top_product} t= {t}/>
          </div>
          <div className="col-md-4 col-12">
            <TopTenList Title="Service Sales" topTenList={top_service} t= {t}/>
          </div>
          <div className="col-md-4 col-12">
            <TopTenList Title="Prepaid Sales" topTenList={top_prepaid} t= {t}/>
          </div>
          <div className="col-md-4 col-12">
            <TopTenList Title="Voucher Sales" topTenList={top_voucher} t= {t}/>
          </div>
          <div className="col-md-4 col-12">
            <TopTenList Title="Treatment Done" topTenList={top_td} t= {t}/>
          </div>
        </div>
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

export const NewQuickTopSale =withTranslation()  (connect(
  null,
  mapDispatchToProps
)(NewQuickTopSaleClass));
