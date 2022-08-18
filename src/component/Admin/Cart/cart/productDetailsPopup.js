import React, { Component } from "react";
import { NormalInput, NormalButton, NormalSelect } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonPatchApi,
  commonCreateApi,
} from "redux/actions/common";
import { Toast } from "service/toast";
import _ from "lodash";
import "./style.scss";
import { withTranslation } from "react-i18next";

export class ProductDetailsPopupClass extends Component {
  state = {
    data_list: [],
    hold_item_reasons_options: [],
    sourceList: [],
    activRow: 0,
    depositIndex: null,
  };

  componentDidMount() {
    let { hold_item_reasons_options } = this.state;
    this.props.getCommonApi(`holditemsetup/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          hold_item_reasons_options.push({
            value: value.id,
            label: value.hold_desc,
          });
        }
        this.setState({ hold_item_reasons_options });
      }
    });
    this.getProductList();
  }
  getProductList = () => {
    let { data_list } = this.state;
    let { basicApptDetail } = this.props;
    this.props
      .getCommonApi(
        `cartpopup/?cust_noid=${basicApptDetail.custId}&cart_id=${this.props.id}&is_product=1`
      )
      .then(async key => {
        let { status, data } = key;
        if (status == "200") {
          console.log(key, "cartproductpopuplist");
          data_list = data;
          await this.setState({
            data_list,
          });
          if (this.state.data_list.length > 0) {
            this.setState({
              activeRow: this.state.data_list[0].id,
            });
            document
              .getElementById(this.state.data_list[0].id)
              .classList.toggle("d-none");
          }
        }
      });
  };

  handleSubmit = () => {
    let { data_list, sourceList } = this.state;
    sourceList = [];

    for (let value of data_list) {
      let currentData = Number(value.deposit);
      let transamt = Number(value.trans_amt);
      if (currentData > transamt) {
        Toast({
          type: "error",
          message:
            "Deposit amount should be less than or equal to transaction amount",
        });
        return false;
      } else {
        if (value.is_foc) {
          sourceList.push({
            id: value.id,
            quantity: Number(value.quantity),
            price: Number(value.price).toFixed(2),
            holditemqty: Number(value.holditemqty),
            holdreason: Number(value.holdreason),
          });
        } else {
          sourceList.push({
            id: value.id,
            quantity: Number(value.quantity),
            price: Number(value.price).toFixed(2),
            deposit: Number(value.deposit).toFixed(2),
            holditemqty: Number(value.holditemqty),
            holdreason: Number(value.holdreason),
          });
        }
      }
    }

    console.log(sourceList, "productupdatelist");
    this.props.commonCreateApi(`cartpopup/product/`, sourceList).then(key => {
      let { status, data } = key;
      if (status == 200) {
        this.props.handleModal();
      }
    });
  };

  handleChange = (e, index) => {
    let { data_list } = this.state;
    let data = e.target.value;
    if ([e.target.name] == "holdreason") {
      data_list[index][e.target.name] = Number(data);
    } else if ([e.target.name] == "holditemqty") {
      let ActualQty = Number(data_list[index]["quantity"]);
      let HoldQty = Number(data);
      if (HoldQty > ActualQty) {
        Toast({
          type: "error",
          message:
            "Hold quantity should be less than or equal to actual quantity",
        });
      } else {
        data_list[index][e.target.name] = HoldQty;
      }
    } else {
      data_list[index][e.target.name] = data;
    }
    this.setState({ data_list });
    if ([e.target.name] == "quantity" || [e.target.name] == "price") {
      this.handlePriceandQuantityChange(index);
    }
  };

  handleAccordion = async id => {
    let elements = document.getElementsByClassName("accordion");
    await this.setState({
      activeRow: id,
    });
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("d-none");
    }
    document.getElementById(id).classList.toggle("d-none");
  };
  handlePriceandQuantityChange = index => {
    let { data_list } = this.state;
    let total_disc =
      Number(data_list[index]["discount_amt"]).toFixed(2) +
      Number(data_list[index]["additional_discountamt"]);
    data_list[index]["discount_price"] = Number(
      data_list[index]["price"] - total_disc
    ).toFixed(2);
    let after_linedisc =
      (data_list[index]["price"] - data_list[index]["discount_amt"]) *
      data_list[index]["quantity"];
    data_list[index]["trans_amt"] = Number(
      after_linedisc - data_list[index]["additional_discountamt"]
    ).toFixed(2);
    data_list[index]["deposit"] = Number(
      after_linedisc - data_list[index]["additional_discountamt"]
    ).toFixed(2);
    this.setState({
      data_list,
    });
  };

  validateDepositAmount = () => {
    debugger;
    let { data_list, depositIndex } = this.state;
    let deposit = Number(data_list[depositIndex]["deposit"]);
    let transAmt = Number(data_list[depositIndex]["trans_amt"]);
    if (deposit > transAmt) {
      Toast({
        type: "error",
        message:
          "Deposit amount should be less than or equal to transaction amount",
      });
      data_list[depositIndex]["deposit"] = "";
      depositIndex = null;
      this.setState({
        data_list,
        depositIndex,
      });
    }
  };
  handleDepositOnChange = async (event, index) => {
    //event.persist();
    let { data_list, depositIndex } = this.state;
    data_list[index]["deposit"] = event.target.value;
    depositIndex = index;
    await this.setState({ data_list, depositIndex });
    if (!this.debouncedFnDeposit) {
      this.debouncedFnDeposit = _.debounce(async () => {
        this.validateDepositAmount();
      }, 500);
    }
    this.debouncedFnDeposit();
  };

  render() {
    let { data_list, hold_item_reasons_options, activeRow } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid mb-4 mt-2 product-details">
          <div className="row">
            <div className="col-10">
              <h4>{t("Product Details")}</h4>
            </div>
            {data_list && data_list.length > 0 ? (
              <div className="col-2">
                <NormalButton
                  mainbg={false}
                  className="col-12 fs-15 submit-btn"
                  label="Done"
                  onClick={() => this.handleSubmit()}
                />
              </div>
            ) : null}
          </div>
          <div className="row pl-3 pr-5 mt-2 fw-500 h6">
            <div className="col-4">{t(`Item`)}</div>
            <div className="col-1 text-center">{t(`Qty`)}</div>
            <div className="col-1 text-center">{t(`Unit Price`)}</div>
            <div className="col-1 text-center">{t(`Disc`)}&nbsp;$</div>
            <div className="col-1 text-center">{t(`D/Price`)}</div>
            <div className="col-1 text-center">{t(`Amount`)}</div>
            <div className="col-1 text-center">{t(`Deposit`)}</div>
            <div className="col-2">{t(`Staff`)}</div>
          </div>
          {data_list && data_list.length <= 0 ? (
            <div className="row pl-5 pr-3 mt-2">{t("No Record Found")}</div>
          ) : null}

          <div className="row pl-5 pr-3 mt-2">
            {data_list.map((item, index) => {
              return (
                <div className="row w-100 mb-2 fs-14" key={index}>
                  <div
                    className={`row w-100 rounded p-2 accordion-menu border ${
                      activeRow == item.id ? "border-primary" : ""
                    }`}
                    onClick={() => this.handleAccordion(item.id)}
                  >
                    <div className="col-4">{item.itemdesc}</div>
                    <div className="col-1 text-center">{item.quantity}</div>
                    <div className="col-1 text-right">{item.price}</div>
                    <div className="col-1 text-right">{item.totl_disc}</div>
                    <div className="col-1 text-right">
                      {item.discount_price}
                    </div>
                    <div className="col-1 text-right">{item.trans_amt}</div>
                    <div className="col-1 text-right">{item.deposit}</div>
                    <div className="col-2">{item.sales_staffs}</div>
                  </div>
                  <div
                    className="row w-100 rounded bg-light p-3 d-none accordion fs-14"
                    id={item.id}
                  >
                    <div className="row w-100 pl-3 mb-3">
                      <div className="col">
                        <label className="text-left text-black common-label-text fs-17 pb-2">
                          {t("Quantity")}
                        </label>
                        <div className="input-group">
                          <NormalInput
                            placeholder="Enter here"
                            value={item.quantity}
                            type="number"
                            name="quantity"
                            onChange={e => this.handleChange(e, index)}
                          />
                        </div>
                      </div>
                      {!item.is_foc ? (
                        <div className="col">
                          <label className="text-left text-black common-label-text fs-17 pb-2">
                            {t("Deposit")}
                          </label>
                          <div className="input-group">
                            <NormalInput
                              placeholder="Enter here"
                              value={item.deposit}
                              name="deposit"
                              onChange={e =>
                                this.handleDepositOnChange(e, index)
                              }
                              //onBlur={e => this.validateDepositAmount(e, index)}
                            />
                          </div>
                        </div>
                      ) : null}
                      {!item.is_foc ? (
                        <div className="col">
                          <label className="text-left text-black common-label-text fs-17 pb-2">
                            {t("Unit Price")}
                          </label>
                          <div className="input-group">
                            <NormalInput
                              placeholder="Enter here"
                              value={item.price}
                              type="number"
                              name="price"
                              onChange={e => this.handleChange(e, index)}
                            />
                          </div>
                        </div>
                      ) : null}
                      <div className="col">
                        <label className="text-left text-black common-label-text fs-17 pb-2">
                          {t("Hold Reason")}
                        </label>
                        <div className="input-group">
                          <NormalSelect
                            options={hold_item_reasons_options}
                            value={item.holdreason ? item.holdreason : 0}
                            name="holdreason"
                            onChange={e => this.handleChange(e, index)}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <label className="text-left text-black common-label-text fs-17 pb-2">
                          {t("Hold Quantity")}
                        </label>
                        <div className="input-group">
                          <NormalInput
                            placeholder="Enter here"
                            value={item.holditemqty ? item.holditemqty : ""}
                            type="number"
                            name="holditemqty"
                            onChange={e => this.handleChange(e, index)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row w-100 pl-3 mb-3"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonPatchApi,
      commonCreateApi,
    },
    dispatch
  );
};
export const ProductDetailsPopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ProductDetailsPopupClass)
);
