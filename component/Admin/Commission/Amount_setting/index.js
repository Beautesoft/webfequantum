import React, { Component } from "react";
import {
  NormalButton,
  NormalSelect,
  NormalInput,
  NormalDate,
} from "component/common";

import { withTranslation } from "react-i18next";
import {
  Amountapplicable,
  getAmountapplicable,
} from "redux/actions/Commission";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ItemDivs,
  ItemDepts,
  ItemBrands,
  ItemRanges,
} from "redux/actions/Backend";

export default class AmountsettingClass extends Component {
  state = {
    cal_currency: [
      { label: "Percent", value: 1 },
      { label: "Amount", value: 2 },
    ],
    currency: "1",
    cost_price: "",
    gst_amt: "",
    bank_amt: "",
    other_amt: "",
    gst_val: "",
    bank_val: "",
    other_val: "",
    gst_pv: 1,
    bank_pv: 1,
    other_pv: 1,
  };

  handletype = ({ target: { value, name } }) => {
    let {
      cost_price,
      gst_amt,
      bank_amt,
      other_amt,
      gst_val,
      bank_val,
      other_val,
      gst_pv,
      bank_pv,
      other_pv,
    } = this.state;
    if (name == "costprice") {
      cost_price = value;
    }
    if (name == "gst_amt") {
      gst_amt = value;
    }
    if (name == "bank_amt") {
      bank_amt = value;
    }
    if (name == "other_amt") {
      other_amt = value;
    }
    if (name == "gst_val") {
      gst_val = value;
    }
    if (name == "bank_val") {
      bank_val = value;
    }
    if (name == "other_val") {
      other_val = value;
    }
    if (name == "gst_pv") {
      gst_pv = value;
    }
    if (name == "bank_pv") {
      bank_pv = value;
    }
    if (name == "other_pv") {
      other_pv = value;
    }

    this.setState({
      cost_price,
      gst_amt,
      bank_amt,
      other_amt,
      gst_val,
      bank_val,
      other_val,
      gst_pv,
      bank_pv,
      other_pv,
    });
  };

  paymentradio(event) {
    let { pay_type } = this.state;
    pay_type = event.target.value;
    this.setState({ pay_type });
    console.log(pay_type);
  }

  render() {
    let { t } = this.props;
    let {
      cal_currency,
      cost_price,
      gst_amt,
      bank_amt,
      other_amt,
      gst_val,
      bank_val,
      other_val,
      gst_pv,
      bank_pv,
      other_pv,
    } = this.state;
    return (
      <div className="container-fluid commission">
        <div className="col-md-5 col-12 h4">
          {t("Amount Applicable Profile")}
        </div>
        <hr></hr>
        <div className="d-flex">
          <div className="col-md-5 col-12 h5 mt-5">
            {t("Target Amount Calculation")}
          </div>
        </div>
        <div className="d-flex mt-5">
          <div className="col-3">
            <span>{t("GST")}</span>
          </div>
          <div className="col-1">
            <span>Amount</span>
            <div className="d-flex">
              <div className="input-group">
                <NormalInput
                  onChange={this.handletype}
                  value={gst_amt}
                  name="gst_amt"
                />
              </div>
            </div>
          </div>
          <div className="col-1">
            <span>Amount</span>
            <div className="d-flex">
              <div className="input-group">
                <NormalInput
                  onChange={this.handletype}
                  value={gst_val}
                  name="gst_val"
                />
              </div>
            </div>
          </div>
          <div className="col-2">
            <span> Type % / $</span>
            <div className="d-flex">
              <div className="input-group">
                <NormalSelect
                  options={cal_currency}
                  value={gst_pv}
                  onChange={this.handletype}
                  name="gst_pv"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mt-5">
          <div className="col-3">
            <span>{t("Bank changes")}</span>
          </div>
          <div className="col-1">
            <div className="d-flex">
              <div className="input-group">
                <NormalInput
                  onChange={this.handletype}
                  value={bank_amt}
                  name="bank_amt"
                />
              </div>
            </div>
          </div>
          <div className="col-1">
            <div className="d-flex">
              <div className="input-group">
                <NormalInput
                  onChange={this.handletype}
                  value={bank_val}
                  name="bank_val"
                />
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="d-flex">
              <div className="input-group">
                <NormalSelect
                  options={cal_currency}
                  value={bank_pv}
                  onChange={this.handletype}
                  name="bank_pv"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mt-5">
          <div className="col-3">
            <span>{t("Other Deduction (EMI)")}</span>
          </div>
          <div className="col-1">
            <div className="d-flex">
              <div className="input-group">
                <NormalInput
                  onChange={this.handletype}
                  value={other_amt}
                  name="other_amt"
                />
              </div>
            </div>
          </div>
          <div className="col-1">
            <div className="d-flex">
              <div className="input-group">
                <NormalInput
                  onChange={this.handletype}
                  value={other_val}
                  name="other_val"
                />
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="d-flex">
              <div className="input-group">
                <NormalSelect
                  options={cal_currency}
                  value={other_pv}
                  onChange={this.handletype}
                  name="other_pv"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mt-5">
          <div className="col-3">
            <span>{t("Type of Payment")}</span>
          </div>
          <div onChange={(event) => this.paymentradio(event)}>
            <input
              type="radio"
              value="gt1"
              name="method"
              defaultChecked
              className="mt-1 ml-3"
            />{" "}
            GT1
            <input
              type="radio"
              value="gt2"
              name="method"
              className="mt-1 ml-3"
            />{" "}
            GT2
            <input
              type="radio"
              value="both"
              name="method"
              className="mt-1 ml-3"
            />{" "}
            Both
          </div>
        </div>

        <div className="d-flex mt-5">
          <div className="col-3">
            <span>{t("Cost Price")}</span>
          </div>
          <div className="col-3">
            <div className="input-group">
              <NormalInput
                onChange={this.handletype}
                value={cost_price}
                name="costprice"
                placeholder="Cost Price"
                type="number"
              />
            </div>
          </div>
        </div>
        <hr className="mt-5"></hr>

        <div className="d-flex justify-content-end mt-5">
          <div className="col-1">
            <NormalButton
              mainbg={true}
              label={"Save"}
              // onClick={() => this.handlebrandDialog()}
            />
          </div>
          <div className="col-1">
            <NormalButton
              mainbg={true}
              label={"Staff"}
              onClick={() =>
                this.props.history.push(`/admin/commission/Staffcommission`)
              }
            />
          </div>
          <div className="col-1">
            <NormalButton
              mainbg={true}
              label={"Manager"}
              onClick={() =>
                this.props.history.push(`/admin/commission/Managercommission`)
              }
            />
          </div>
        </div>
        {/* <hr></hr> */}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export const Amountsetting = withTranslation()(
  connect(null, mapDispatchToProps)(AmountsettingClass)
);
