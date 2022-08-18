import React, { Component } from "react";
import {
  NormalButton,
  NormalInput,
  NormalSelect,
  InputSearch,
  NormalModal,
  TableWrapper,
  NormalCheckbox,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";
import { withTranslation } from "react-i18next";
import SimpleReactValidator from "simple-react-validator";
import { Toast } from "service/toast";

export class CombineTopupClass extends Component {
  state = {
    treatmentList: [],
    formFields: {
      customer_name: "",
      new_outstanding: "",
      old_outstanding: "",
      topup_amount: "",
    },
    headerDetails: [
      {
        label: "Date",
        sortKey: false,
        width: "120px",
        divClass: "justify-content-end text-right",
      },
      { label: "Invoice No", sortKey: false, width: "120px" },
      { label: "Treatment Name", sortKey: false, width: "120px" },
      {
        label: "Qty",
        sortKey: false,
        width: "50px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Total Amount",
        width: "120px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Deposit Balance",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Outstanding",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },

      {
        label: "Pay amount",
        width: "60px",
        divClass: "justify-content-center",
      },
      { label: "Staff", width: "120px" },
    ],
    headerDetailsAuto: [
      {
        label: "Date",
        sortKey: false,
        width: "120px",
        divClass: "justify-content-end text-right",
      },
      { label: "Invoice No", sortKey: false, width: "120px" },
      { label: "Treatment Name", sortKey: false, width: "120px" },
      {
        label: "Qty",
        sortKey: false,
        width: "50px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Total Amount",
        width: "120px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Deposit Balance",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Outstanding",
        sortKey: false,
        width: "100px",
        divClass: "justify-content-end text-right",
      },

      {
        label: "Pay amount",
        width: "60px",
        divClass: "justify-content-center",
      },
      {
        label: "Auto",
        width: "50px",
        divClass: `justify-content-center`,
      },
      { label: "Staff", width: "120px" },
    ],
    typeofSelection: {
      service: true,
      product: true,
      prepaid: true,
    },
    is_fullpay: false,
    is_auto: false,
    page: 1,
    limit: 10,
    pageMeta: {},
    settingData: {},
  };

  componentDidMount() {
    this.getCart();
  }
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

  handleItemSettings = () => {
    let { settingData } = this.state;
    this.props.getCommonApi(`userlist/`).then(key => {
      let { status, data } = key;
      console.log(key, "settingsData appointmentCreate");
      if (status === 200) {
        settingData = data;
        this.setState({ settingData });
      }
    });
  };
  getCart = () => {
    let { typeofSelection, treatmentList, pageMeta, is_auto, is_fullpay } =
      this.state;

    try {
      let dataType = [];

      if (typeofSelection.service) {
        dataType.push("service");
      }
      if (typeofSelection.prepaid) {
        dataType.push("prepaid");
      }
      if (typeofSelection.product) {
        dataType.push("product");
      }

      this.props
        .getCommonApi(
          `topupcombinedlist/?cust_id=${this.props.id}&type=${dataType}`
        )
        .then(async key => {
          let { status, data } = key;

          if (status === 200) {
            treatmentList = [];
            await this.setState({ treatmentList });
            this.getDataFromRes(key);
            if (data) {
              if (data.dataList) {
                data.dataList.forEach(item => {
                  let itemData = item;
                  itemData["Autokey"] = false;
                  treatmentList.push(itemData);
                });
                pageMeta = data.meta.pagination;
                is_auto = false;
                is_fullpay = false;
                this.setState({ treatmentList, pageMeta, is_auto, is_fullpay });
              }
            }
          }
        });
    } catch (e) {
      console.log(e, "topupgetcombinelog");
    }
  };

  getDataFromRes = data => {
    let { header_data } = data;
    let { formFields } = this.state;
    formFields["customer_name"] = header_data ? header_data.customer_name : "";
    formFields["new_outstanding"] = header_data
      ? header_data.new_outstanding
      : "";
    formFields["old_outstanding"] = header_data
      ? header_data.old_outstanding
      : "";
    formFields["topup_amount"] = header_data ? header_data.topup_amount : "";
    this.setState({
      formFields,
    });
  };
  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getCart();
  };
  handlechangeSelection = async e => {
    let { typeofSelection } = this.state;
    typeofSelection[e.target.name] = e.target.value;
    await this.setState({
      typeofSelection,
    });
    this.getCart();
  };

  handleChange = e => {
    let { formFields } = this.state;
    formFields[e.target.name] = e.target.value;
    this.setState({
      formFields,
    });
  };

  handleTopupChange = async event => {
    // event.persist();
    let { formFields } = this.state;
    formFields.topup_amount = event.target.value;
    await this.setState({ formFields });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.search();
      }, 500);
    }
    this.debouncedFn();
  };

  search = () => {
    let { formFields } = this.state;
    let old_outstand = Number(formFields.old_outstanding);
    let topup = Number(formFields.topup_amount);
    if (topup <= old_outstand) {
      formFields["new_outstanding"] = Number(old_outstand - topup).toFixed(2);
      this.setState({
        formFields,
      });
    } else {
      Toast({
        type: "error",
        message: "The topup amount may not be greater than outstanding",
      });
    }
  };

  handlePayAmount = (event, data, index) => {
    let { treatmentList } = this.state;
    treatmentList[index][event.target.name] = event.target.value;
    this.setState({
      treatmentList,
    });
  };

  handleCommonChange = async e => {
    let { treatmentList, is_auto } = this.state;
    this.setState({
      [e.target.name]: e.target.value,
    });

    if ([e.target.name] == "is_auto") {
      treatmentList.forEach(item => {
        {
          e.target.value == true
            ? (item["Autokey"] = true)
            : (item["Autokey"] = false);
        }
      });
      await this.setState({
        treatmentList,
      });
    } else if ([e.target.name] == "is_fullpay") {
      let { formFields } = this.state;
      let topup = 0;
      if (is_auto) {
        treatmentList.forEach(item => {
          if (item.Autokey) {
            item["pay_amount"] = item.outstanding;
            topup += Number(item.outstanding);
          }
        });
        await this.setState({
          treatmentList,
        });
        formFields["topup_amount"] = Number(topup).toFixed(2);
        formFields["new_outstanding"] = Number(
          formFields.old_outstanding - topup
        ).toFixed(2);
        await this.setState({
          formFields,
        });
      } else {
        treatmentList.forEach(item => {
          item["pay_amount"] = item.outstanding;
        });
        await this.setState({
          treatmentList,
        });
        formFields["new_outstanding"] = 0;
        formFields["topup_amount"] = formFields.old_outstanding;
        await this.setState({
          formFields,
        });
      }
    }
  };
  ParseFloatUpdate = (str, val) => {
    str = str.toString();
    str = str.slice(0, str.indexOf(".") + val + 1);
    return Number(str);
  };

  handleAutoMatch = async () => {
    let { treatmentList, formFields } = this.state;
    try {
      if (formFields.topup_amount > 0) {
        let checkedCount = treatmentList.filter(
          item => item.Autokey == true
        ).length;
        let SelectedTotalOutstanding = 0;

        treatmentList.forEach(item => {
          if (item.Autokey) {
            SelectedTotalOutstanding += Number(item.outstanding);
          }
        });

        let recordCount = 0;
        let UpdatedTotalOutstanding = 0;
        treatmentList.forEach(item => {
          if (item.Autokey) {
            recordCount++;
            if (recordCount == checkedCount) {
              let otherrowTotal = this.ParseFloatUpdate(
                UpdatedTotalOutstanding,
                2
              );

              let linePay = Number(formFields.topup_amount - otherrowTotal);
              let tot = Number(linePay) + Number(otherrowTotal);
              let difference = formFields.topup_amount - tot;
              let final = linePay + difference;
              item["pay_amount"] = this.ParseFloatUpdate(final, 2);
            } else {
              let findPercentage =
                Number(formFields.topup_amount / SelectedTotalOutstanding) *
                100;
              let linePay = (Number(findPercentage) / 100) * item.outstanding;
              UpdatedTotalOutstanding += this.ParseFloatUpdate(linePay, 2);
              item["pay_amount"] = this.ParseFloatUpdate(linePay, 2);
            }
          }
        });
        await this.setState({
          treatmentList,
        });
      } else {
        Toast({
          type: "error",
          message: "Please enter valid Top up amount",
        });
      }
    } catch (e) {
      console.log(e, "catchlogautomatch");
    }
  };
  handleClearAll = async () => {
    let { formFields, treatmentList } = this.state;
    formFields["topup_amount"] = 0;
    formFields["new_outstanding"] = formFields.old_outstanding;
    await this.setState({
      is_fullpay: false,
      formFields,
    });
    treatmentList.forEach(item => {
      item["pay_amount"] = 0;
    });
    await this.setState({
      treatmentList,
    });
  };

  handleCreateCart = () => {
    let { basicApptDetail } = this.props;
    let { treatmentList } = this.state;
    let payload = [];
    if (this.validator.allValid()) {
      for (let key of treatmentList) {
        if (key.pay_amount > 0) {
          let obj = {
            cust_noid: basicApptDetail.custId,
            cart_date: dateFormat(new Date(), "yyyy-mm-dd"),
            itemcodeid: key.stock_id,
            price: key.pay_amount,
            item_uom: null,
            treatment_account: key.TreatmentAccountid
              ? key.TreatmentAccountid
              : null,
            deposit_account: key.DepositAccountid ? key.DepositAccountid : null,
            prepaid_account: key.prepaid_id ? key.prepaid_id : null,
          };
          payload.push(obj);
        }
      }

      this.props
        .getCommonApi(
          `itemcart/Check/?cart_date=${dateFormat(
            new Date(),
            "yyyy-mm-dd"
          )}&cust_noid=${basicApptDetail.custId}`
        )
        .then(res => {
          if (res.data.length === 0) {
            this.props
              .commonCreateApi("itemcart/TopUpCartCreate/", payload)
              .then(res => {
                // this.props.handleCartCreated()
                this.props.handleModal();
              });
          } else {
            this.props
              .commonCreateApi(
                `itemcart/TopUpCartCreate/?cart_id=${res.cart_id}`,
                payload
              )
              .then(res => {
                this.props.handleModal();
              });
          }
        });
    } else {
      this.validator.showMessages();
    }
  };

  render() {
    let {
      workpoint = "",
      treatmentList = [],
      headerDetails,
      formFields,
      is_auto,
      pageMeta,
      typeofSelection,
      is_fullpay,
      settingData,
      headerDetailsAuto,
    } = this.state;
    let { customer_name, new_outstanding, old_outstanding, topup_amount } =
      formFields;
    let { service, prepaid, product } = typeofSelection;
    let { t } = this.props;
    return (
      <div className="row p-3">
        <div className="col-12 mb-2">
          <div className="d-flex flex-wrap">
            <div className="col-md-6 col-12 fw-500 fs-18 text-left p-0 m-0">
              Top Up
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-2 col-12">
              <NormalButton
                buttonClass={"mx-2"}
                submitBtn={true}
                className="confirm"
                label="Confirm"
                onClick={this.handleCreateCart}
              />
            </div>
          </div>
        </div>
        <div className="col-12 new-cart top-up">
          <div className="d-flex flex-wrap">
            <div className="col-md-5 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text">
                  {t("Customer")}
                </label>
                <div className="input-group">
                  <NormalInput
                    value={customer_name}
                    name="customer_name"
                    onChange={this.handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="text-left w-100 text-black common-label-text">
                  {t("Outstanding")}
                </label>
                <div className="input-group">
                  <NormalInput
                    value={old_outstanding}
                    name="old_outstanding"
                    onChange={this.handleTopupChange}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col-md-1 col-12">
              <NormalCheckbox
                type="checkbox"
                onChange={this.handleCommonChange}
                name="is_auto"
                checked={is_auto}
                label="Auto"
              />
            </div>

            <div className="col-md-4 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("Top Up Amount")}
                </label>
                <div className="input-group">
                  <NormalInput
                    type="number"
                    value={topup_amount}
                    name="topup_amount"
                    onChange={this.handleTopupChange}
                    className="text-right"
                    max={old_outstanding}
                  />

                  {topup_amount
                    ? this.validator.message(
                        "topup_amount",
                        topup_amount,
                        `required|max:${Number(old_outstanding)},num`
                      )
                    : ""}
                </div>
              </div>
              <div className="d-flex">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {t("New Outstanding")}
                </label>
                <div className="input-group">
                  <NormalInput
                    type="number"
                    value={new_outstanding}
                    name="new_outstanding"
                    onChange={this.handleChange}
                    className={"text-right"}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-2 col-12">
              <NormalCheckbox
                type="checkbox"
                onChange={this.handleCommonChange}
                name="is_fullpay"
                checked={is_fullpay}
                label="Full payment"
              />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="d-flex flex-wrap mt-2">
            <div className="col-md-1 col-12">
              <NormalCheckbox
                checked={service}
                label="service"
                name="service"
                onChange={this.handlechangeSelection}
              />
            </div>
            <div className="col-md-1 col-12">
              <NormalCheckbox
                checked={product}
                label="product"
                name="product"
                onChange={this.handlechangeSelection}
              />
            </div>
            <div className="col-md-1 col-12">
              <NormalCheckbox
                checked={prepaid}
                label="prepaid"
                name="prepaid"
                onChange={this.handlechangeSelection}
              />
            </div>
            <div className="col-md-9"></div>
          </div>
        </div>
        <div className={`col-12`}>
          <div className="table-container table-responsive mt-3">
            <TableWrapper
              headerDetails={is_auto ? headerDetailsAuto : headerDetails}
              queryHandler={this.handlePagination}
              pageMeta={pageMeta}
            >
              {treatmentList.length > 0 ? (
                treatmentList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="text-right">{item.sa_date}</div>
                      </td>
                      <td>
                        <div className="text-left">{item.sa_transacno}</div>
                      </td>
                      <td>
                        <div className="text-left">{item.description}</div>
                      </td>
                      <td>
                        <div className="text-right">{item.qty}</div>
                      </td>
                      <td>
                        <div className="text-right">{item.total_amount}</div>
                      </td>
                      <td>
                        <div className="text-right">{item.balance}</div>
                      </td>
                      <td>
                        <div className="text-right">{item.outstanding}</div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center payment-input justify-content-center">
                          <NormalInput
                            value={item.pay_amount}
                            name="pay_amount"
                            onChange={e => this.handlePayAmount(e, item, index)}
                            className={`customer-name text-right`}
                          />
                          {item.pay_amount
                            ? this.validator.message(
                                "pay_amount",
                                item.pay_amount,
                                `required|max:${Number(item.outstanding)},num`
                              )
                            : ""}
                        </div>
                      </td>
                      {is_auto ? (
                        <td>
                          <div className="d-flex justify-content-center">
                            <NormalCheckbox
                              type="checkbox"
                              onChange={e =>
                                this.handlePayAmount(e, item, index)
                              }
                              name="Autokey"
                              checked={item.Autokey}
                              //disabled={is_auto ? false : true}
                            />
                          </div>
                        </td>
                      ) : (
                        ""
                      )}

                      <td>
                        <div className="text-left">{item.sa_staffname}</div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12">
                    <div className="text-center">No data</div>
                  </td>
                </tr>
              )}
            </TableWrapper>
          </div>
        </div>
        <div className="col-12 pt-4 action-bar">
          <div className="d-flex  justify-content-end">
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <NormalButton
                  resetbg={true}
                  label="Clear All"
                  className="mr-2"
                  onClick={this.handleClearAll}
                />
                {is_auto ? (
                  <NormalButton
                    mainbgrev={true}
                    label="Auto Match"
                    // disabled={is_auto ? false : true}
                    onClick={this.handleAutoMatch}
                    className="ml-2"
                  />
                ) : (
                  ""
                )}
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
      commonCreateApi,
      commonPatchApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const CombineTopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CombineTopupClass)
);
