import React, { Component } from "react";
import {
  NormalInput,
  NormalButton,
  TableWrapper,
  NormalSelect,
  NormalTextarea,
  NormalCheckbox,
  NormalModal,
} from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonUpdateApi,
  commonPatchApi,
  commonCreateApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import { Toast } from "service/toast";
import "./style.scss";
import { withTranslation } from "react-i18next";
import { CredentialConfirmation } from "../credentialConfirmation";
import closeIcon from "assets/images/close.png";

export class ItemDiscountPopupClass extends Component {
  state = {
    item_data: {
      item_name: "",
    },
    quantity: 0,
    discount_reason_options: [],
    discount_reason: null,
    discount_reasons: [],
    unit_price: 0,
    unit_price_after_discount: 0,
    total_after_discount: 0,
    deposit: 0,
    discount: 0,
    is_percentage: "1",
    discountFields: {
      discount: 0,
      discount_amt: 0,
      disc_reason: "182",
      discreason_txt: "",
    },
    discount_price_txt: "",
    discType: [
      { value: 1, label: "%" },
      { value: 2, label: "$" },
    ],
    isHandleConfirmationDialog: false,
    isLoginConfirmation: false,
    user: "",
    pass: "",
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
    this.getDiscountInfo();
    this.getDiscountReasons();
  };
  handleClear = () => {
    this.setState({
      item_data: {
        item_name: "",
      },
      quantity: 0,
      discount_reason_options: [],
      discount_reason: null,
      unit_price: 0,
      unit_price_after_discount: 0,
      total_after_discount: 0,
      deposit: 0,
      discount: 0,
      discountFields: {
        discount: 0,
        discount_amt: 0,
        disc_reason: "182",
        discreason_txt: null,
      },
      discount_price_txt: "",
      is_percentage: "1",
    });
  };
  getDiscountReasons = () => {
    let { discount_reason_options } = this.state;

    this.props.getCommonApi(`paymentremarks/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          discount_reason_options.push({
            value: value.id,
            label: value.r_desc,
          });
        }
        this.setState({ discount_reason_options });
      }
    });
  };
  getDiscountInfo = () => {
    let {
      item_data,
      quantity,
      unit_price,
      unit_price_after_discount,
      deposit,
      total_after_discount,
      discount_reasons,
    } = this.state;
    this.props.getCommonApi(`cartpopup/${this.props.cartId}/`).then(key => {
      let { status, data } = key;
      console.log(data, "cartdiscountdatapopup");
      if (status == "200") {
        item_data["item_name"] = data.itemdesc;
        quantity = data.quantity;
        unit_price = data.price;
        unit_price_after_discount = data.discount_price;
        deposit = data.deposit;
        total_after_discount = data.trans_amt;
        discount_reasons = data.disc_lst;
        this.setState({
          item_data,
          quantity,
          unit_price,
          unit_price_after_discount,
          deposit,
          total_after_discount,
          discount_reasons,
        });
      }
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    let { discountFields, deposit, discount_price_txt, is_percentage } =
      this.state;
    discountFields[name] = value;

    if (name === "discount_price_txt") {
      discount_price_txt = value;
      this.setState({
        discount_price_txt,
      });
    }
    if (name == "is_percentage") {
      is_percentage = value;
      this.setState({
        is_percentage,
      });
    }
    if (name === "disc_reason") {
      discountFields["discreason_txt"] = "";
      this.setState({
        discountFields,
      });
    }
    await this.setState({
      discountFields,
    });

    if (name === "deposit") {
      deposit = value;

      this.setState({
        deposit,
      });
    }
  };
  handleApply = async () => {
    debugger;
    let {
      discountFields,
      unit_price_after_discount,
      discount_price_txt,
      is_percentage,
    } = this.state;

    if (Number(discount_price_txt) > 0) {
      if (Number(is_percentage) == 1) {
        if (discountFields.disc_reason && discountFields.disc_reason != "") {
          // if (
          //   Number(discountFields.disc_reason) != 182 ||
          //   (Number(discountFields.disc_reason) == 182 &&
          //     discountFields.discreason_txt != "")
          // ) {
          discountFields["discount_amt"] = Number(
            (Number(unit_price_after_discount) / 100) *
              Number(discount_price_txt)
          );
          discountFields["discount"] = Number(discount_price_txt);

          await this.setState({ discountFields });
          // } else {
          //   Toast({
          //     type: "error",
          //     message: "Please Enter Discount Reason Text",
          //   });
          //   return false;
          // }
        } else {
          Toast({
            type: "error",
            message: "Please select Discount Reason",
          });
          return false;
        }
      } else if (Number(is_percentage) == 2) {
        if (discountFields.disc_reason && discountFields.disc_reason != "") {
          // if (
          //   Number(discountFields.disc_reason) != 182 ||
          //   (Number(discountFields.disc_reason) == 182 &&
          //     discountFields.discreason_txt != "")
          // ) {
          discountFields["discount_amt"] = Number(discount_price_txt);
          discountFields["discount"] = null;
          await this.setState({ discountFields });
          // } else {
          //   Toast({
          //     type: "error",
          //     message: "Please Enter Discount Reason Text",
          //   });
          //   return false;
          // }
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
      let discreason_text = "";
      if (Number(discountFields.disc_reason) == 182) {
        discreason_text = "others";
      } else {
        discreason_text = "";
      }

      let body = {
        discount: Number(discountFields.discount),
        discount_amt: Number(discountFields.discount_amt),
        disc_reason: Number(discountFields.disc_reason),
        discreason_txt: discreason_text,
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
  // handleApply = async () => {
  //   debugger;
  //   let {
  //     discountFields,
  //     unit_price_after_discount,
  //     discount_price_txt,
  //     is_percentage,
  //   } = this.state;

  //   if (this.validator.allValid()) {
  //     if (Number(discount_price_txt) > 0) {
  //       if (is_percentage) {
  //         discountFields["discount_amt"] = Number(
  //           (unit_price_after_discount / 100) * Number(discount_price_txt)
  //         ).toFixed(2);

  //         discountFields["discount"] = Number(
  //           (discountFields["discount_amt"] / unit_price_after_discount) * 100
  //         ).toFixed(2);
  //         await this.setState({ discountFields });
  //       }
  //       if (!is_percentage) {
  //         discountFields["discount_amt"] =
  //           Number(discount_price_txt).toFixed(2);
  //         discountFields["discount"] = null;
  //         await this.setState({ discountFields });
  //       }
  //     } else {
  //       Toast({
  //         type: "error",
  //         message: "Discount should be greater than zero",
  //       });
  //       return false;
  //     }
  //     this.props
  //       .commonUpdateApi(
  //         `itemcart/${this.props.cartId}/?disc_add=1&disc_reset=0`,
  //         discountFields
  //       )
  //       .then(key => {
  //         this.handleClear();
  //         this.getDiscountInfo();
  //         this.getDiscountReasons();
  //       });
  //   } else {
  //     this.validator.showMessages();
  //   }
  // };
  handleReset = async () => {
    let { discountFields } = this.state;
    let body = {
      discount: Number(discountFields.discount),
      discount_amt: Number(discountFields.discount_amt),
      disc_reason: Number(discountFields.disc_reason),
      discreason_txt: discountFields.discreason_txt,
    };
    this.props
      .commonUpdateApi(
        `itemcart/${this.props.cartId}/?disc_add=0&disc_reset=1`,
        body
      )
      .then(key => {
        this.handleClear();
        this.getDiscountInfo();
        this.getDiscountReasons();
      });
  };
  handleSubmit = () => {
    let { deposit, total_after_discount } = this.state;
    let body = {};
    if (Number(deposit) > Number(total_after_discount)) {
      Toast({
        type: "error",
        message:
          "Deposit amount should be less than or equal to transaction amount",
      });
    } else {
      body = {
        deposit: Number(deposit).toFixed(2),
      };
      this.props
        .commonPatchApi(
          `cartpopup/${this.props.cartId}/`,

          body
        )
        .then(key => {
          let { status } = key;
          console.log(key, "response for submit");
          if (status == "200") {
            this.props.handleModal();
          }
        });
    }
  };
  handleLoginConfirmationDialog = async () => {
    await this.setState(prevState => ({
      isLoginConfirmation: !prevState.isLoginConfirmation,
    }));
  };

  handleauthentication = async (user, pass) => {
    let Body = {
      username: user,
      password: pass,
      type: "CartDisc",
    };
    this.props
      .commonCreateApi(`userauthorizationpopup/`, Body)
      .then(async key => {
        let { status, data } = key;
        if (status == 200) {
          await this.setState(prevState => ({
            isLoginConfirmation: !prevState.isLoginConfirmation,
          }));
          this.handleApply();
        }
      });
  };

  render() {
    let {
      item_data,
      quantity,
      unit_price,
      is_percentage,
      deposit,
      discount_reason_options,
      discount_reasons,
      total_after_discount,
      unit_price_after_discount,
      discountFields,
      discount_price_txt,
      discType,
      isHandleConfirmationDialog,
      isLoginConfirmation,
      user,
      pass,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid mb-4">
          <div className="row pl-3">
            <div className="col-md-9 col-12">
              <h6 className="text-secondary fs-18">{t("Item Discount")}</h6>

              <h4>{item_data.item_name}</h4>
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
              <div className="col-md-4">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Quantity")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={quantity}
                    type="number"
                    name="quantity"
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Unit Price")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder="Enter here"
                    value={unit_price}
                    type="number"
                    name="unit_price"
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-2 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Discount")}
                </label>
                <div className="input-group">
                  <NormalInput
                    placeholder=""
                    value={discount_price_txt}
                    type="number"
                    name="discount_price_txt"
                    onChange={this.handleChange}
                  />

                  {/* <NormalButton
                    mainbg={!is_percentage}
                    className="col h-100"
                    label="$"
                    onClick={() =>
                      this.setState({ is_percentage: !is_percentage })
                    }
                  />
                  <NormalButton
                    mainbg={is_percentage}
                    className="col h-100"
                    label="%"
                    onClick={async () =>
                      await this.setState({ is_percentage: !is_percentage })
                    }
                  />  */}
                </div>
              </div>
              <div className="col-md-2 col-12">
                <div className="row">
                  <label className="text-left text-black common-label-text pb-2">
                    {t("Type")}
                  </label>
                  <div className="input-group">
                    <NormalSelect
                      className={`col`}
                      options={discType}
                      value={is_percentage}
                      name="is_percentage"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row w-100 mb-3">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Discount Reason")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={discount_reason_options}
                    value={discountFields.disc_reason}
                    name="disc_reason"
                    onChange={this.handleChange}
                  />
                </div>
                {this.validator.message(
                  "discount reason",
                  discountFields.disc_reason,
                  "required"
                )}
              </div>
              {/* {discountFields.disc_reason == "182" ? (
                <div className="col-md-4 col-12">
                  <label className="text-left text-black common-label-text ">
                    Discount reason
                  </label>
                  <div className="input-group mb-2">
                    <NormalTextarea
                      value={discountFields.discreason_txt}
                      name="discreason_txt"
                      onChange={this.handleChange}
                      className="w-100"
                    />
                    {this.validator.message(
                      "discount reason",
                      discountFields.discreason_txt,
                      "required"
                    )}
                  </div>
                </div>
              ) : (
                ""
              )} */}
              <div className="col-md-2 col-12 mt-4 pt-3">
                <NormalButton
                  applybg={true}
                  className="col"
                  label="Apply"
                  onClick={() => {
                    this.props.tokenDetails.cartdisc_setup
                      ? this.setState({ isLoginConfirmation: true })
                      : this.handleVoidCreate();
                  }}
                />
              </div>
              <div className="col-md-2 col-12 mt-4 pt-3">
                <NormalButton
                  resetbg={true}
                  className="col"
                  label="Reset"
                  onClick={this.handleReset}
                />
              </div>
            </div>

            <div className="row w-100 mt-4">
              <div className="col-md-12">
                <label className="text-left text-black common-label-text pb-2">
                  {t("Discount List")}
                </label>
                <div className="d-flex">
                  <div className="col-2">
                    <label className="text-left text-black common-label-text pb-2 fw-500">
                      {t("Remark")}
                    </label>
                  </div>
                  <div className="col-2 text-center">
                    <label className="text-black common-label-text pb-2 fw-500">
                      {t("Price")}
                    </label>
                  </div>
                  <div className="col-2 text-center">
                    <label className="text-black common-label-text pb-2 fw-500">
                      {t(`Disc. %`)}
                    </label>
                  </div>
                  <div className="col-2 text-center">
                    <label className="text-black common-label-text pb-2 fw-500">
                      {t(`Disc. $`)}
                    </label>
                  </div>
                  <div className="col-2 text-center">
                    <label className="text-black common-label-text pb-2 fw-500">
                      {t(`D/price`)}
                    </label>
                  </div>
                  <div className="col-1"></div>
                </div>
                <div className="col-md-12 oveflow-auto col-12 w-100 bg-light p-1 border">
                  {discount_reasons &&
                    discount_reasons.length > 0 &&
                    discount_reasons.map((item, index) => {
                      return (
                        <div className="row" key={index}>
                          <div className="col-2">
                            <label className="text-left text-black common-label-text pb-2">
                              {item.remark ? item.remark : "OTHERS"}
                            </label>
                          </div>
                          <div className="col-2 text-right">
                            <label className=" text-black common-label-text pb-2">
                              $ {item.amount}
                            </label>
                          </div>
                          <div className="col-2 text-center">
                            <label className="text-black common-label-text pb-2">
                              {item.disc_per} %
                            </label>
                          </div>
                          <div className="col-2 text-right">
                            <label className="text-black common-label-text pb-2">
                              $ {item.disc_amt}
                            </label>
                          </div>
                          <div className="col-2 text-right">
                            <label className=" text-black common-label-text pb-2">
                              $ {item.after_disc}
                            </label>
                          </div>
                          <div className="col-1">
                            <NormalCheckbox
                              name="transac"
                              label="Trans."
                              checked={item.transac}
                              value={item.transac}
                              onChange={() => {}}
                            />
                          </div>
                        </div>
                      );
                    })}
                  {!discount_reasons || discount_reasons.length <= 0 ? (
                    <div className="col-12">{t("No record found")}</div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row w-100 mt-5">
              <div className="col-md-8 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Unit Price After Discount")}
                </label>
              </div>
              <div className="col-md-4 col-12 ">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {unit_price_after_discount}
                </label>
              </div>
            </div>
            <div className="row w-100 mt-2">
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {t("Total After Discount")}
                </label>
              </div>
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {quantity} * {unit_price_after_discount}
                </label>
              </div>
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  {total_after_discount}
                </label>
              </div>
            </div>
            <div className="row w-100 mt-4">
              <div className="col-md-8 col-12">
                <h6>{t("Deposit")}</h6>
              </div>
              <div className="col-md-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-2">
                  <NormalInput
                    value={deposit}
                    name="deposit"
                    onChange={this.handleChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <NormalModal
          className={"d-flex justify-content-center"}
          style={{ minWidth: "20%" }}
          modal={isLoginConfirmation}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleLoginConfirmationDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <CredentialConfirmation
            handleLoginSubmit={(user, pass) =>
              this.handleauthentication(user, pass)
            }
          />
        </NormalModal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  basicApptDetail: state.appointment.basicApptDetail,
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonUpdateApi,
      commonPatchApi,
      commonCreateApi,
    },
    dispatch
  );
};
export const ItemDiscountPopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ItemDiscountPopupClass)
);
