import React, { Component } from "react";
import "./style.scss";
import { NormalButton, NormalInput, TableWrapper } from "component/common";
import _ from "lodash";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import { Toast } from "service/toast";
import { withTranslation } from "react-i18next";

export class TransactionPriceChangeClass extends Component {
  state = {
    headerDetails: [
      {
        label: "S. No",
        sortKey: false,
        divClass: "justify-content-end text-right",
      },
      { label: "Type", sortKey: false },
      { label: "Item Code" },
      { label: "Description", sortKey: false },
      {
        label: "Price",
        sortKey: false,
        width: "150px",
        divClass: "justify-content-center",
      },
      {
        label: "Discount Amount",
        sortKey: false,
        width: "150px",
        divClass: "justify-content-center",
      },
      {
        label: "Price After Disc",
        sortKey: false,
        width: "150px",
        divClass: "justify-content-center",
      },
      {
        label: "Qty",
        sortKey: false,
        divClass: "justify-content-end text-right",
      },
      {
        label: "Total Amount",
        sortKey: false,
        width: "150px",
        divClass: "justify-content-center",
      },
      {
        label: "Paid Amount",
        sortKey: false,
        width: "150px",
        divClass: "justify-content-center",
      },
      { label: "Staff", sortKey: false },
    ],
    TransactionPrice: {
      transaction_no: "",
      customer_name: "",
      date: "",
      paid_amount: "",
      total_amount: "",
      priceChangeList: [],
    },
    sumTotal: "",
    balanceTotal: "",
    sumPaid: "",
    balancePaid: "",
    changeTextIndex: "",
    changeTextLabel: "",
  };

  componentDidMount = () => {
    this.getSelectedTransactions();
  };
  getSelectedTransactions = () => {
    try {
      let { TransactionPrice, sumPaid, sumTotal, balanceTotal, balancePaid } =
        this.state;

      this.props
        .getCommonApi(`transactionhistory/${this.props.match.params.id}`)

        .then(async res => {
          let { status, data } = res;
          if (status == 200) {
            TransactionPrice["customer_name"] = data.customer_name;
            TransactionPrice["date"] = data.date;
            TransactionPrice["paid_amount"] = data.paid_amount;
            TransactionPrice["total_amount"] = data.total_amount;
            TransactionPrice["transaction_no"] = data.transaction_no;
            TransactionPrice["priceChangeList"] = data.daud_lines
              ? data.daud_lines
              : [];

            if (data.daud_lines.length > 0) {
              sumPaid = 0;
              sumTotal = 0;
              data.daud_lines.forEach(e => {
                sumPaid += Number(e.dt_deposit);
                sumTotal += Number(e.dt_transacamt);
              });

              let sumofpaid = Number(sumPaid).toFixed(2);
              let sumoftotal = Number(sumTotal).toFixed(2);
              let balPaid =
                Number(TransactionPrice.paid_amount) - Number(sumPaid);
              let balTotal =
                Number(TransactionPrice.total_amount) - Number(sumTotal);

              balancePaid = Number(balPaid).toFixed(2);
              balanceTotal = Number(balTotal).toFixed(2);
              sumPaid = Number(sumofpaid).toFixed(2);
              sumTotal = Number(sumoftotal).toFixed(2);
            } else {
              sumPaid = Number(data.paid_amount).toFixed(2);
              sumTotal = Number(data.total_amount).toFixed(2);
              balancePaid = "0.00";
              balanceTotal = "0.00";
            }
            this.setState({
              TransactionPrice,
              sumTotal,
              sumPaid,
              balanceTotal,
              balancePaid,
            });
          }
        });
    } catch (e) {
      console.log(e, "catchexforpricechange");
    }
  };

  handleChange = async (e, index) => {
    await this.setState({
      changeTextLabel: e.target.name,
      changeTextIndex: index,
    });
    try {
      let { TransactionPrice } = this.state;

      let data = e.target.value;
      TransactionPrice.priceChangeList[index][e.target.name] = Number(data);

      await this.setState({
        TransactionPrice,
      });
      if (!this.debouncedFn) {
        this.debouncedFn = _.debounce(async () => {
          this.handleChangeValue();
        }, 500);
      }
      this.debouncedFn();
    } catch (e) {
      console.log(e, "pricechangecatchlog");
    }
  };
  handleChangeValue = () => {
    let { changeTextLabel } = this.state;
    if (changeTextLabel == "dt_promoprice") {
      this.handlepromopriceChange();
    } else if (changeTextLabel == "dt_discamt") {
      this.handlediscountpriceChange();
    } else if (changeTextLabel == "dt_transacamt") {
      this.handleTotalpriceChange();
    } else if (changeTextLabel == "dt_price") {
      this.handleUnitpriceChange();
    } else if (changeTextLabel == "dt_deposit") {
      this.handleBalanceUpdate();
    }
  };
  handleUnitpriceChange = async () => {
    let { TransactionPrice, changeTextIndex } = this.state;
    let final = TransactionPrice.priceChangeList[changeTextIndex];

    final["dt_promoprice"] = Number(final["dt_price"]).toFixed(2);
    final["dt_discamt"] = Number(0).toFixed(2);
    final["dt_transacamt"] = Number(
      Number(final["dt_promoprice"]) * Number(final["dt_qty"])
    ).toFixed(2);
    await this.setState({
      final,
    });
    this.handleBalanceUpdate();
  };

  handleTotalpriceChange = async () => {
    let { TransactionPrice, changeTextIndex } = this.state;
    let final = TransactionPrice.priceChangeList[changeTextIndex];
    final["dt_promoprice"] = Number(
      Number(final["dt_transacamt"]) / Number(final["dt_qty"])
    ).toFixed(2);
    final["dt_discamt"] = Number(0).toFixed(2);
    final["dt_price"] = Number(
      Number(final["dt_transacamt"]) / Number(final["dt_qty"])
    ).toFixed(2);
    await this.setState({
      final,
    });
    this.handleBalanceUpdate();
  };

  handlediscountpriceChange = async () => {
    let { TransactionPrice, changeTextIndex } = this.state;
    let final = TransactionPrice.priceChangeList[changeTextIndex];
    final["dt_promoprice"] = Number(
      Number(final["dt_price"]) - Number(final["dt_discamt"])
    ).toFixed(2);
    final["dt_transacamt"] = Number(
      (Number(final["dt_price"]) - Number(final["dt_discamt"])) *
        Number(final["dt_qty"])
    ).toFixed(2);
    await this.setState({
      final,
    });
    this.handleBalanceUpdate();
  };

  handlepromopriceChange = async () => {
    let { TransactionPrice, changeTextIndex } = this.state;
    let final = TransactionPrice.priceChangeList[changeTextIndex];
    final["dt_discamt"] = Number(
      Number(final["dt_price"]) - Number(final["dt_promoprice"])
    ).toFixed(2);
    final["dt_transacamt"] = Number(
      Number(final["dt_promoprice"]) * Number(final["dt_qty"])
    ).toFixed(2);
    await this.setState({
      final,
    });
    this.handleBalanceUpdate();
  };

  handleBalanceUpdate = () => {
    let { TransactionPrice, balancePaid, sumPaid, sumTotal, balanceTotal } =
      this.state;

    if (TransactionPrice.priceChangeList.length > 0) {
      sumPaid = 0;
      sumTotal = 0;
      TransactionPrice.priceChangeList.forEach(e => {
        sumPaid += Number(e.dt_deposit);
        sumTotal += Number(e.dt_transacamt);
      });
      let sumofpaid = Number(sumPaid).toFixed(2);
      let sumoftotal = Number(sumTotal).toFixed(2);
      let balPaid = Number(TransactionPrice.paid_amount) - Number(sumPaid);
      let balTotal = Number(TransactionPrice.total_amount) - Number(sumTotal);

      balancePaid = Number(balPaid).toFixed(2);
      balanceTotal = Number(balTotal).toFixed(2);
      sumPaid = Number(sumofpaid).toFixed(2);
      sumTotal = Number(sumoftotal).toFixed(2);

      this.setState({ balancePaid, sumPaid, sumTotal, balanceTotal });
    }
  };

  handleupdate = () => {
    let { TransactionPrice, balanceTotal, balancePaid } = this.state;
    if (Number(balancePaid) == 0 && Number(balanceTotal) == 0) {
      if (TransactionPrice.priceChangeList.length > 0) {
        try {
          let payload = [];
          TransactionPrice.priceChangeList.forEach(e => {
            payload.push({
              id: e.id,
              dt_price: e.dt_price,
              dt_discamt: e.dt_discamt,
              dt_promoprice: e.dt_promoprice,
              dt_transacamt: e.dt_transacamt,
              dt_deposit: e.dt_deposit,
            });
          });

          this.props
            .commonCreateApi(`transactionhistory/changeprice/`, payload)
            .then(async res => {
              if (res.status === 201) {
                history.push("/admin/transactionhistory");
              }
            });
        } catch (e) {
          console.log("pricechangeupdate", e);
        }
      }
    } else {
      Toast({
        type: "error",
        message: "Amount difference should be 0",
      });
    }
  };
  render() {
    let {
      headerDetails,
      TransactionPrice,
      sumTotal,
      balanceTotal,
      sumPaid,
      balancePaid,
    } = this.state;
    let {
      transaction_no,
      customer_name,
      date,
      paid_amount,
      total_amount,
      priceChangeList,
    } = TransactionPrice;
    let tra;
    let { t } = this.props;
    return (
      <>
        <div className="d-flex flex-wrap mb-2 mt-2">
          <div className="col-md-10 col-12 header">
            <p className="fs-16 font-700 mb-3 title">
              <span
                className="fw-600"
                onClick={() => history.push(`/admin/transactionhistory/`)}
              >
                {t("Transaction History")}
              </span>
              &nbsp; &gt;&nbsp;
              {t("Price Change")}
            </p>
          </div>
          <div className="col-md-2 col-12">
            <div className="col text-right">
              <NormalButton
                buttonClass={"mx-2"}
                submitBtn={true}
                label="Update"
                outline={false}
                onClick={() => this.handleupdate()}
              />
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap p-2">
          <div className="col-md-2 col-12">
            <div className="">
              <label className="text-left w-100 text-black common-label-text mr-2 fw-500">
                {t("Transaction No")}
              </label>
              <div className="input-group">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {transaction_no}
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-12">
            <div className="">
              <label className="text-left w-100 common-label-text mr-2 fw-500">
                {t("Date")}
              </label>
              <div className="input-group">
                <label className="text-left w-100 common-label-text mr-2">
                  {date}
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-12">
            <div className="">
              <label className="text-left w-100 text-black common-label-text mr-2 fw-500">
                {t("Customer Name")}
              </label>
              <div className="input-group">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {customer_name}
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-12">
            <div className="">
              <label className="text-left w-100 text-black common-label-text mr-2 fw-500">
                {t("Total Amount")}
              </label>
              <div className="input-group">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {total_amount}
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-12">
            <div className="">
              <label className="text-left w-100 text-black common-label-text mr-2 fw-500">
                {t("Paid Amount")}
              </label>
              <div className="input-group">
                <label className="text-left w-100 text-black common-label-text mr-2">
                  {paid_amount}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={`d-flex`}>
          <TableWrapper
            headerDetails={headerDetails}
            queryHandler={this.handlePagination}
            // pageMeta={pageMeta}
            // isEmpty={tstaffList.length === 0 ? true:false}
          >
            {priceChangeList.length > 0
              ? priceChangeList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="position-relative status-type">
                        <div className="text-right">{index + 1}</div>
                      </td>
                      <td>
                        <div className="text-left">
                          {item.record_detail_type}
                        </div>
                      </td>
                      <td>
                        <div className="text-left">{item.item_code}</div>
                      </td>

                      <td>
                        <div className="text-left">{item.item_desc}</div>
                      </td>

                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            type="number"
                            name="dt_price"
                            value={item.dt_price}
                            onChange={e => this.handleChange(e, index)}
                            disabled={item.is_edit ? false : true}
                            className="text-right"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            type="number"
                            name="dt_discamt"
                            value={item.dt_discamt}
                            onChange={e => this.handleChange(e, index)}
                            disabled={item.is_edit ? false : true}
                            className="text-right"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            type="number"
                            name="dt_promoprice"
                            value={item.dt_promoprice}
                            onChange={e => this.handleChange(e, index)}
                            disabled={item.is_edit ? false : true}
                            className="text-right"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="text-right">{item.dt_qty}</div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            type="number"
                            name="dt_transacamt"
                            value={item.dt_transacamt}
                            onChange={e => this.handleChange(e, index)}
                            disabled={item.is_edit ? false : true}
                            className="text-right"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <NormalInput
                            type="number"
                            name="dt_deposit"
                            value={item.dt_deposit}
                            onChange={e => this.handleChange(e, index)}
                            disabled={item.is_edit ? false : true}
                            className="text-right"
                          />
                        </div>
                      </td>

                      <td className="text-left">{item.staff_name}</td>
                    </tr>
                  );
                })
              : null}
          </TableWrapper>
        </div>

        <div className="row">
          <div className="col-md-5 col-12"></div>
          <div className="col-md-7 col-12 p-1">
            <div className="d-flex flex-wrap justify-content-end p-1">
              <div className="col-md-6 col-12">
                <div className="d-flex p-1">
                  <div className="col-7">{t("Original Invoice Amount")}</div>
                  <div className="col-5">
                    <NormalInput
                      type="text"
                      name="total_amount"
                      value={total_amount}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="d-flex p-1">
                  <div className="col-7">{t("Sum of Current Amount")}</div>
                  <div className="col-5">
                    <NormalInput
                      type="text"
                      name="sumTotal"
                      value={sumTotal}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-start p-1">
                  <div className="col-7">{t("Difference")}</div>
                  <div className="col-5">
                    <NormalInput
                      className={`${
                        Number(balanceTotal) !== 0 ? `text-danger` : ``
                      } form-control`}
                      type="text"
                      name="balanceTotal"
                      value={balanceTotal}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="d-flex p-1">
                  <div className="col-7">{t("Original Paid Amount")}</div>
                  <div className="col-5">
                    <NormalInput
                      type="text"
                      name="paid_amount"
                      value={paid_amount}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="d-flex p-1">
                  <div className="col-7">{t("Current Paid Amount")}</div>
                  <div className="col-5">
                    <NormalInput
                      type="text"
                      name="sumPaid"
                      value={sumPaid}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="d-flex p-1">
                  <div className="col-7">{t("Difference")}</div>
                  <div className="col-5">
                    <NormalInput
                      className={`${
                        Number(balancePaid) !== 0 ? `text-danger` : ``
                      } form-control`}
                      type="text"
                      name="balancePaid"
                      value={balancePaid}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
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
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const TransactionPriceChange = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(TransactionPriceChangeClass)
);
