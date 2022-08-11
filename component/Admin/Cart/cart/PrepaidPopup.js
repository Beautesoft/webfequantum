import React, { Component } from "react";
import { NormalInput, NormalButton } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonUpdateApi,
  commonPatchApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import { Toast } from "service/toast";
import "./style.scss";
import { withTranslation } from "react-i18next";

export class PrepaidPopupClass extends Component {
  state = {
    id: null,
    itemdesc: "",
    quantity: 1,
    price: "",
    trans_amt: "",
    deposit: "",
    prepaid_value: "",
    isopen_prepaid: false,
    bonus: "",
  };
  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };
  componentDidMount = () => {
    this.getPrepaidInfo();
  };
  handleClear = () => {
    this.setState({
      id: null,
      itemdesc: "",
      quantity: 1,
      price: "",
      trans_amt: "",
      deposit: "",
      prepaid_value: "",
      isopen_prepaid: false,
      bonus: "",
    });
  };

  getPrepaidInfo = () => {
    let {
      id,
      itemdesc,
      quantity,
      price,
      trans_amt,
      deposit,
      prepaid_value,
      isopen_prepaid,
      bonus,
    } = this.state;
    this.props.getCommonApi(`cartprepaid/${this.props.cartId}/`).then(key => {
      let { status, data } = key;
      console.log(data, "cartprepaidgetdata");
      if (status == "200") {
        if (data) {
          id = data.id;
          itemdesc = data.itemdesc;
          quantity = data.quantity;
          price = data.price;
          trans_amt = Number(data.price - data.deposit);
          deposit = data.deposit;
          prepaid_value = data.prepaid_value;
          isopen_prepaid = data.isopen_prepaid;
          bonus = Number(data.prepaid_value - data.price);
          this.setState({
            id,
            itemdesc,
            quantity,
            price,
            trans_amt,
            deposit,
            prepaid_value,
            isopen_prepaid,
            bonus,
          });
        }
      }
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
    });
  };
  handleApply = async () => {
    let {
      discountFields,
      unit_price_after_discount,
      discount_price_txt,
      is_percentage,
    } = this.state;
    if (Number(discount_price_txt) > 0) {
      if (Number(is_percentage) == 1) {
        if (discountFields.disc_reason && discountFields.disc_reason != "") {
          if (
            Number(discountFields.disc_reason) != 182 ||
            (Number(discountFields.disc_reason) == 182 &&
              discountFields.discreason_txt != "")
          ) {
            discountFields["discount_amt"] = Number(
              (Number(unit_price_after_discount).toFixed(2) / 100) *
                Number(discount_price_txt)
            ).toFixed(2);

            discountFields["discount"] = Number(
              (Number(discountFields["discount_amt"]).toFixed(2) /
                Number(unit_price_after_discount).toFixed(2)) *
                100
            ).toFixed(2);
            await this.setState({ discountFields });
          } else {
            Toast({
              type: "error",
              message: "Please Enter Discount Reason Text",
            });
            return false;
          }
        } else {
          Toast({
            type: "error",
            message: "Please select Discount Reason",
          });
          return false;
        }
      } else if (Number(is_percentage) == 2) {
        if (discountFields.disc_reason && discountFields.disc_reason != "") {
          if (
            Number(discountFields.disc_reason) != 182 ||
            (Number(discountFields.disc_reason) == 182 &&
              discountFields.discreason_txt != "")
          ) {
            discountFields["discount_amt"] =
              Number(discount_price_txt).toFixed(2);
            discountFields["discount"] = null;
            await this.setState({ discountFields });
          } else {
            Toast({
              type: "error",
              message: "Please Enter Discount Reason Text",
            });
            return false;
          }
        } else {
          Toast({
            type: "error",
            message: "Please select Discount Reason",
          });
          return false;
        }
      } else {
        Toast({
          type: "error",
          message: "Please select Discount Type",
        });
        return false;
      }
      let body = {
        discount: Number(discountFields.discount),
        discount_amt: Number(discountFields.discount_amt),
        disc_reason: Number(discountFields.disc_reason),
        discreason_txt: discountFields.discreason_txt,
      };
      this.props
        .commonUpdateApi(
          `itemcart/${this.props.cartId}/?disc_add=1&disc_reset=0`,
          body
        )
        .then(key => {
          this.handleClear();
          this.getDiscountInfo();
          this.getDiscountReasons();
        });
    } else {
      Toast({
        type: "error",
        message: "Discount should be greater than zero",
      });
      return false;
    }
  };

  handleSubmit = () => {
    let { id, price, prepaid_value, deposit } = this.state;
    if (Number(deposit) > Number(price)) {
      Toast({
        type: "error",
        message: "Deposit amount should be less than or equal to price",
      });
      return;
    } else {
      let body = {};
      if (this.validator.allValid()) {
        body = {
          id: id,
          price: price,
          prepaid_value: prepaid_value,
          deposit: deposit,
        };
        this.props
          .commonPatchApi(
            `cartprepaid/${this.props.cartId}/`,

            body
          )
          .then(key => {
            let { status } = key;
            console.log(key, "response for submit");
            if (status == "200") {
              this.props.handleModal();
            }
          });
      } else {
        this.validator.showMessages();
      }
    }
  };

  handleDepositAmountChange = () => {
    let { price, deposit, trans_amt } = this.state;
    trans_amt = Number(price) - Number(deposit);
    this.setState({
      trans_amt,
    });
  };

  handleAmountChange = () => {
    let { price, bonus, prepaid_value, deposit, trans_amt } = this.state;
    prepaid_value = Number(price) + Number(bonus);
    deposit = price;
    trans_amt = Number(price) - Number(deposit);
    this.setState({
      prepaid_value,
      deposit,
      trans_amt,
    });
  };
  handlePrepaidValueChange = () => {
    let { price, bonus, prepaid_value, deposit, trans_amt } = this.state;
    price = Number(prepaid_value) - Number(bonus);
    deposit = price;
    trans_amt = Number(price) - Number(deposit);
    this.setState({
      price,
      deposit,
      trans_amt,
    });
  };
  render() {
    let {
      id,
      itemdesc,
      quantity,
      price,
      trans_amt,
      deposit,
      prepaid_value,
      isopen_prepaid,
      bonus,
    } = this.state;
    let {t} = this.props;
    return (
      <>
        <div className="container-fluid mb-4">
          <div className="row pl-3">
            <div className="col-md-9 col-12">
              <h6 className="text-secondary fs-19 fw-500">{t("Open")} {t("Prepaid")}</h6>
            </div>
            <div className="col-md-2 col-12">
              <NormalButton
                mainbg={false}  
                className="col-12 fs-15 submit-btn"
                label="Submit"
                onClick={() => this.handleSubmit()}
              />
            </div>
          </div>
          <div className="row pl-5 pr-5 mt-4">
            <div className="row mb-3">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Name")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={itemdesc}
                    name="itemdesc"
                    onChange={this.handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-1 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  Qty
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={quantity}
                    name="quantity"
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-2 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Amount")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={price}
                    type="number"
                    name="price"
                    onChange={this.handleChange}
                    onBlur={this.handleAmountChange}
                  />
                </div>
                {this.validator.message("price", price, "required")}
              </div>
              <div className="col-md-2 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  Bonus
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={bonus}
                    type="number"
                    name="bonus"
                    onChange={this.handleChange}
                    onBlur={this.handleAmountChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                 { t("Value")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={prepaid_value}
                    type="number"
                    name="prepaid_value"
                    onChange={this.handleChange}
                    onBlur={this.handlePrepaidValueChange}
                  />
                </div>
                {this.validator.message(
                  "prepaid value",
                  prepaid_value,
                  "required"
                )}
              </div>
              <div className="col-md-2 col-12 mt-2">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Deposit")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={deposit}
                    type="number"
                    name="deposit"
                    onChange={this.handleChange}
                    onBlur={this.handleDepositAmountChange}
                  />
                </div>
                {this.validator.message("deposit", deposit, "required")}
              </div>
              <div className="col-md-2 col-12 mt-2">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                 { t("Outstanding")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={trans_amt}
                    type="number"
                    name="trans_amt"
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>
            </div>
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
      commonUpdateApi,
      commonPatchApi,
    },
    dispatch
  );
};
export const PrepaidPopup = withTranslation() (connect(
  mapStateToProps,
  mapDispatchToProps
)(PrepaidPopupClass));
