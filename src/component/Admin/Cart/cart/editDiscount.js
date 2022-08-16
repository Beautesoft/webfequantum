import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalCheckbox,
  NormalInput,
  NormalSelect,
  NormalTextarea,
  TableWrapper,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonPatchApi,
  commonCreateApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import { FormGroup, Label, Input } from "reactstrap";
import { withTranslation } from "react-i18next";

export class EditDiscountClass extends Component {
  state = {
    isOpen: false,
    currentIndex: -1,
    cartList: [],
    cartData: {},
    formFields: {
      custName: "",
    },
    headerDetails: [
      {
        label: "Line No",
        sortKey: false,
        width: "30px",
        divClass: "justify-content-end text-right",
      },
      { label: "Item Code", width: "82px" },
      { label: "Item Desc", sortKey: false, width: "135px" },
      {
        label: "Qty",
        sortKey: false,
        width: "30px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Unit Price",
        sortKey: false,
        width: "70px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Other Disc",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Tran Disc",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Net Amt",
        sortKey: false,
        width: "90px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Deposit Amt",
        sortKey: false,
        width: "90px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Auto",
        sortKey: false,
        width: "90px",
        divClass: "justify-content-center",
      },
    ],
    discountFields: {
      discount: "",
      discount_amt: "",
      disc_reason: "",
      discreason_txt: null,
    },
    discountReasonList: [],
    net_amount: "",
  };

  componentWillMount = () => {
    // this.getCart();
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
    let { basicApptDetail } = this.props;
    this.getCartList();
    this.getDropdownData();
  };

  getCartList = () => {
    let { cartList, cartData } = this.state;
    let { basicApptDetail } = this.props;
    this.props
      .getCommonApi(
        `itemcart/SetAdditionalDiscList/?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${basicApptDetail.custId}&cart_id=${this.props.id}`
      )
      .then(key => {
        let { status, data } = key;
        console.log("demooooooo", key);
        cartList = data;
        cartData = key;
        this.setState({
          cartList,
          cartData,
        });
      });
  };

  applyDiscountNetamount = () => {
    let { discountFields, net_amount } = this.state;
    let { basicApptDetail } = this.props;
    let data = {
      additional_discount: null,
      additional_discountamt: null,
    };
    this.props
      .commonCreateApi(
        `itemcart/SetAdditionalDisc/?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${basicApptDetail.custId}&cart_id=${
          this.props.id
        }&disc_reason=${discountFields.disc_reason}&discreason_txt=${
          discountFields.discreason_txt
        }&disc_reset=0&net_amt=${net_amount}`,
        data
      )
      .then(() => {
        this.getCartList();
      });
  };

  applyDiscount = () => {
    let { discountFields } = this.state;
    let { basicApptDetail } = this.props;
    let data = {
      additional_discount: String(discountFields.discount),
      additional_discountamt: String(discountFields.discount_amt),
    };
    this.props
      .commonCreateApi(
        `itemcart/SetAdditionalDisc/?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${basicApptDetail.custId}&cart_id=${
          this.props.id
        }&disc_reason=${discountFields.disc_reason}&discreason_txt=${
          discountFields.discreason_txt
        }`,
        data
      )
      .then(() => {
        this.getCartList();
      });
  };

  handleApplyAuto = async (id, index, value) => {
    let { discountFields, cartList } = this.state;
    let { basicApptDetail } = this.props;
    this.props.commonPatchApi(`itemcart/${id}/`).then(async res => {
      let { status } = res;
      if (status == 200) {
        cartList[index]["auto"] = value;
        await this.setState({ cartList });
        this.getCartList();
      }
    });
  };

  handleChangeAuto = async (event, index, id) => {
    this.handleApplyAuto(id, index, event.target.value);
  };

  getDateTime = data => {
    let date = new Date(data);
    date = String(date).split(" ");
    let date1 = date[2] + "th " + date[1] + ", " + date[3];
    let time = date[4].split(":");
    let time1 =
      String(Number(time[0]) > 12 ? Number(time[0]) - 12 : time[0]) +
      ":" +
      time[1] +
      (Number(time[0]) > 12 ? "PM" : "AM");
    return time1 + ", " + date1;
  };

  handleChangeDisc = async ({ target: { value, name } }) => {
    let { discountFields, cartData } = this.state;
    discountFields[name] = value;
    if (name === "discount") {
      discountFields["discount_amt"] = Number(
        (cartData.balance / 100) * value
      ).toFixed(2);
    }
    if (name === "discount_amt") {
      // discountFields['discount'] = (value/formFields['price'])*100
      discountFields["discount"] = 0;
    }
    if (name === "discount" && Number(value) !== 182) {
      discountFields["discreason_txt"] = "";
      this.setState({
        discountFields,
      });
    }
    if (name === "net_amt") {
      discountFields["discount"] = "";
      discountFields["discount_amt"] = "";
      this.setState({
        discountFields,
        net_amount: value,
      });
    }
    await this.setState({
      discountFields,
    });
    // this.props.updateForm('customerDetail', formFields)
    // await this.props.updateForm('appointmentCustomerDetail', formFields)
  };

  getDropdownData = () => {
    let { discountReasonList } = this.state;

    this.props.getCommonApi(`paymentremarks/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          discountReasonList.push({ value: value.id, label: value.r_desc });
        }
        this.setState({ discountReasonList });
      }
    });
  };

  handleApply = () => {
    let { discountFields, net_amount } = this.state;
    if (this.validator.allValid()) {
      if (net_amount !== "") {
        this.applyDiscountNetamount();
      } else {
        this.applyDiscount();
      }
    } else {
      this.validator.showMessages();
    }
  };

  handleReset = () => {
    let { discountFields } = this.state;
    let { basicApptDetail } = this.props;
    this.props
      .commonCreateApi(
        `itemcart/SetAdditionalDisc/?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${basicApptDetail.custId}&cart_id=${
          this.props.id
        }&disc_reset=1`
      )
      .then(() => {
        this.getCartList();
      });
  };
  handleConfirm = () => {
    let { basicApptDetail } = this.props;
    this.props
      .commonCreateApi(
        `itemcart/SetTmpTreatment/?cust_noid=${basicApptDetail.custId}&cart_id=${this.props.id}`
      )
      .then(res => {
        let { status } = res;
        if (status == 200) {
          this.props.handleModal();
        }
      });
  };

  render() {
    let {
      isOpen,
      currentIndex,
      cartList = [],
      customerOption,
      cartData = {},
      channelList,
      formFields,
      outletList,
      discountFields,
      isOpenPayment,
      isOpenEditDisc,
      isOpenEditcart,
      headerDetails,
      isOpenCustomer,
      discountReasonList,
    } = this.state;

    let { basicApptDetail, t } = this.props;
    return (
      <div className="row new-cart">
        <div className={`col-12 cart-item`}>
          <div className={`item-list`}>
            <p className="fs-18 font-700 mb-3 title">
              {t("Transaction Discount")}
            </p>

            <div className="table">
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
                // pageMeta={pageMeta}
                // isEmpty={cartList.length === 0 ? true:false}
              >
                {cartList.length > 0
                  ? cartList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="position-relative status-type">
                            <span className={``}></span>
                            <div className="text-right">{item.lineno}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.item_code}</div>
                          </td>
                          <td>
                            <div className="text-left">{item.item_desc}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.qty}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.unit_price}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.other_disc}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.tran_disc}</div>
                          </td>
                          <td>
                            <div className="text-right">{item.net_amount}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {item.deposit_amount}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center discount-formcheck">
                              <FormGroup>
                                <Label>
                                  <NormalCheckbox
                                    checked={item.auto}
                                    type="checkbox"
                                    //defaultChecked={item.auto}
                                    onChange={e =>
                                      this.handleChangeAuto(e, index, item.id)
                                    }
                                  />
                                </Label>
                              </FormGroup>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            </div>
          </div>
        </div>
        <div className="col-12 pt-4 fs-14 payment-detail">
          <div className="row">
            <div className="col-5">
              <div className="row">
                <div className="col-4">
                  <p>{t("Total Amount")}</p>
                </div>
                <div className="col-1"></div>
                <div className="col-6">
                  <p>$ {cartData.total_amount}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <p>{t("Other Disc")}</p>
                </div>
                <div className="col-1">-</div>
                <div className="col-6">
                  <p>$ {cartData.other_disc}</p>
                </div>
              </div>
              <div className="row ">
                <div className="col-4">
                  <p>{t("Balance")}</p>
                </div>
                <div className="col-1"></div>
                <div className="col-4">
                  <p>$ {cartData.balance}</p>
                </div>
                <div className="col-3 reset-button">
                  <NormalButton
                    buttonClass={"mx-2"}
                    resetbg={true}
                    className=" fs-15 confirm"
                    label="Reset"
                    onClick={this.handleReset}
                  />
                </div>
                <div className="col-4">
                  <p>{t("Transaction Disc")}</p>
                </div>
                <div className="col-1">-</div>
                <div className="col-6">
                  <p>$ {cartData.tran_disc}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <p>{t("Net Amount")}</p>
                </div>
                <div className="col-1"></div>
                <div className="col-6">
                  <p>$ {cartData.net_amount}</p>
                </div>
                <div className="col-4 pr-0">
                  <p>{t("Deposit Amount")}</p>
                </div>
                <div className="col-1"></div>
                <div className="col-6">
                  <p>$ {cartData.deposit_amount}</p>
                </div>
              </div>
            </div>
            <div className="col-7 discount-section">
              <p>{t("Transaction Discount")}</p>
              <div className="row">
                <div className="col-6 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      {t("Discount")} %
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      // placeholder="Enter here"
                      // options={siteList}
                      value={discountFields.discount}
                      name="discount"
                      onChange={this.handleChangeDisc}
                      className="customer-name"
                    />
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      {t("Discount reason")}
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalSelect
                      // placeholder="Enter here"
                      options={discountReasonList}
                      value={discountFields.disc_reason}
                      name="disc_reason"
                      onChange={this.handleChangeDisc}
                      className="customer-name py-1"
                    />
                  </div>
                  {this.validator.message(
                    "disc_reason",
                    discountFields.disc_reason,
                    "required"
                  )}
                </div>
                {discountFields.disc_reason == "182" ? (
                  <div className="col-12 mb-3">
                    <label className="text-left text-black common-label-text ">
                      {t("Discount reason")}
                    </label>
                    <div className="input-group mb-2">
                      <NormalTextarea
                        // placeholder="Enter here"
                        // options={discountReasonList}
                        value={discountFields.discreason_txt}
                        name="discreason_txt"
                        onChange={this.handleChangeDisc}
                        className="customer-name w-100 py-0"
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
                )}

                <div className="col-6 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      {t("Discount amount")}
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      // placeholder="Enter here"
                      // options={siteList}
                      value={discountFields.discount_amt}
                      name="discount_amt"
                      onChange={this.handleChangeDisc}
                      className="customer-name"
                    />
                  </div>
                </div>

                <div className="col-6 mb-3">
                  <div>
                    <label className="text-left text-black common-label-text ">
                      {t("Net Amount")}
                    </label>
                  </div>
                  <div className="input-group">
                    <NormalInput
                      // placeholder="Enter here"
                      // options={siteList}
                      value={discountFields.net_amt}
                      name="net_amt"
                      onChange={this.handleChangeDisc}
                      className="customer-name"
                    />
                  </div>
                </div>
                {/* <div className="col-6 d-flex"></div> */}
                <div className="col-6">
                  <NormalButton
                    buttonClass={"mx-2"}
                    applybg={true}
                    className="submit-btn"
                    label="Apply"
                    onClick={this.handleApply}
                  />
                </div>
                <div className="col-6 text-right">
                  <NormalButton
                    buttonClass={"mx-2"}
                    mainbg={false}
                    className="submit-btn"
                    label="Confirm"
                    outline={false}
                    onClick={this.handleConfirm}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonPatchApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const EditDiscount = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(EditDiscountClass)
);
