import React, { Component } from "react";
import "./style.scss";
import {
  NormalCheckbox,
  NormalInput,
  NormalButton,
  NormalModal,
  TableWrapper,
} from "component/common";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonUpdateApi,
  commonCreateApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
// import { Treatment, Payment, EditCart } from './cart/index';
import { Label } from "reactstrap";
import { PackageTreatmentDone } from "./packageTreatmentDone";
import closeIcon from "assets/images/close.png";
import { withTranslation } from "react-i18next";

export class PackageCartClass extends Component {
  state = {
    cartPackageList: [],
    auto_deposit: "",
    auto_deposit_new: "",
    deposit: "",
    net_deposit: "",
    checked: true,
    isOpenTreatmentDone: false,

    TransactionHeader: [
      { label: "Description" },
      {
        label: "Qty",
        width: "60px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Deposit",
        width: "80px",
        divClass: "justify-content-center text-center",
      },
      {
        label: "Net Amount",
        width: "80px",
        divClass: "justify-content-end text-right",
      },
      { label: "Action", width: "20px" },
    ],
    selectedData: "",
  };

  componentWillMount = () => {
    this.getCartData();
  };

  getCartData = () => {
    this.props
      .getCommonApi(`pospackagedeposit/?cartid=${this.props.id}`)
      .then(async key => {
        let {
          cartPackageList,
          auto_deposit,
          auto_deposit_new,
          deposit,
          net_deposit,
        } = this.state;
        let { data } = key;
        cartPackageList = data;
        auto_deposit = key.auto_deposit;
        auto_deposit_new = key.auto_deposit;
        deposit = key.deposit;
        net_deposit = key.net_deposit;
        this.setState({
          cartPackageList,
          auto_deposit,
          auto_deposit_new,
          deposit,
          net_deposit,
        });
      });
  };
  autoMatch = () => {
    const testData = [];
    const original_number = this.state.net_deposit;
    const net_deposit = this.state.net_deposit;
    const new_number = this.state.auto_deposit_new;
    if (parseFloat(new_number) > parseFloat(net_deposit)) {
      alert("Entered amount should not greater than Net Amount");
      return;
    }
    let decrease = original_number - new_number;
    let percentageOfDecrease = ((decrease / original_number) * 100).toFixed(2);
    var depositAmount = 0;
    var totalDepositAmount = 0;
    for (var i = 0; i < this.state.cartPackageList.length; i++) {
      var xRowNetAmount = this.state.cartPackageList[i].net_amt;
      var xDecreasedRowAmount = (
        (xRowNetAmount * percentageOfDecrease) /
        100
      ).toFixed(2);
      depositAmount = (xRowNetAmount - xDecreasedRowAmount).toFixed(2);
      totalDepositAmount += parseFloat(depositAmount);
      if (i == this.state.cartPackageList.length - 1) {
        //Assign Difference value into last row
        var difference = new_number - totalDepositAmount;
        totalDepositAmount += difference;
        depositAmount = parseFloat(depositAmount) + parseFloat(difference);
      }
      testData.push({
        id: this.state.cartPackageList[i].id,
        description: this.state.cartPackageList[i].description,
        qty: this.state.cartPackageList[i].qty,
        deposit_amt: parseFloat(depositAmount).toFixed(2),
        net_amt: this.state.cartPackageList[i].net_amt,
        auto: this.state.cartPackageList[i].auto,
        hold_qty: 0,
        itemcart: this.state.cartPackageList[i].itemcart,
      });
    }
    //console.log("data")
    this.setState({
      cartPackageList: testData,
      deposit: totalDepositAmount.toFixed(2),
    });
  };
  clear = () => {
    this.fillCartDepositModifyData("Clear");
  };
  fullPayment = () => {
    this.fillCartDepositModifyData("Full");
  };
  handleCancel = () => {
    this.props.handleModal();
  };

  handleConfirm = () => {
    let data = this.state.cartPackageList;
    this.props
      .commonCreateApi(
        `pospackagedeposit/confirm/?cartid=${this.props.id}`,
        data
      )
      .then(() => {
        //console.log("succ")
        this.props.handleModal();
      });
  };

  fillCartDepositModifyData(xMode) {
    let depositAmount;
    var totalDepositAmount = 0;
    const testData = [];
    for (var i = 0; i < this.state.cartPackageList.length; i++) {
      if (xMode == "Clear") {
        depositAmount = 0;
        totalDepositAmount += parseFloat(depositAmount);
      } else if (xMode == "Full") {
        depositAmount = this.state.cartPackageList[i].net_amt;
        totalDepositAmount += parseFloat(depositAmount);
      }
      testData.push({
        id: this.state.cartPackageList[i].id,
        description: this.state.cartPackageList[i].description,
        qty: this.state.cartPackageList[i].qty,
        deposit_amt: depositAmount,
        net_amt: this.state.cartPackageList[i].net_amt,
        auto: this.state.cartPackageList[i].auto,
        hold_qty: 0,
        itemcart: this.state.cartPackageList[i].itemcart,
      });
    }
    this.setState({ cartPackageList: testData, deposit: totalDepositAmount });
  }
  handleChange_auto_deposit_new = async ({ target: { value } }) => {
    let { auto_deposit_new } = this.state;
    auto_deposit_new = value;
    await this.setState({
      auto_deposit_new,
    });
  };
  handleCheck = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  handleChangeForEachRow(userId, event) {
    //var inputElement = event.target;
    var userEnteredValue = parseFloat(event.target.value);
    var userEnteredKeyUnique = event.target.name;
    var totalDepositAmount = 0;
    //console.log(inputElement.name + ': ' + inputElement.value);
    const testData = [];
    for (var i = 0; i < this.state.cartPackageList.length; i++) {
      let deposit = 0;
      var xRowNetAmount = parseFloat(this.state.cartPackageList[i].net_amt);

      if (i == userEnteredKeyUnique) {
        if (userEnteredValue > xRowNetAmount) {
          return;
        }
        deposit = userEnteredValue;
        totalDepositAmount += parseFloat(deposit);
      } else {
        deposit = this.state.cartPackageList[i].deposit_amt;
        totalDepositAmount += parseFloat(deposit);
      }
      testData.push({
        id: this.state.cartPackageList[i].id,
        description: this.state.cartPackageList[i].description,
        qty: this.state.cartPackageList[i].qty,
        deposit_amt: deposit,
        net_amt: this.state.cartPackageList[i].net_amt,
        auto: this.state.cartPackageList[i].auto,
        hold_qty: 0,
        itemcart: this.state.cartPackageList[i].itemcart,
      });
    }
    this.setState({
      cartPackageList: testData,
      deposit: totalDepositAmount.toFixed(2),
    });
  }
  handleDialog = async () => {
    let { isOpenTreatmentDone } = this.state;

    isOpenTreatmentDone = false;

    await this.setState({
      isOpenTreatmentDone,
    });
    this.getCartData();
  };
  handleTreatmentDone = async cartPackage => {
    debugger;
    await this.props.updateForm("Select_Package", cartPackage.id);
    await this.setState({
      selectedData: cartPackage.id,
      isOpenTreatmentDone: true,
    });
  };
  render() {
    let {
      cartPackageList,
      auto_deposit_new,
      deposit,
      net_deposit,
      isOpenTreatmentDone,
      TransactionHeader,
    } = this.state;
    let { t } = this.props;

    return (
      <div className="row new-cart treatment-done">
        <div className="col-12">
          <p className="fs-18 font-700 mb-3 title">{t("Package Details")}</p>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-2 col-12">
              <NormalCheckbox
                type="checkbox"
                checked={this.state.checked}
                onChange={() => this.handleCheck()}
                label="Auto Deposit"
              />
            </div>
            <div className="col-md-2 col-12">
              <NormalInput
                value={auto_deposit_new}
                name="auto_deposit_new"
                className="customer-name w-100 h-100 text-right fs-24"
                onChange={this.handleChange_auto_deposit_new}
              />
            </div>
            <div className="col-md-3 col-12">
              <NormalButton
                buttonClass={"treatment"}
                mainbg={true}
                className="col-12 fs-15 "
                label="Start AutoMatch"
                disabled={!this.state.checked}
                onClick={() => this.autoMatch()}
              />
            </div>
          </div>
        </div>
        <div className="col-12 mt-3">
          <TableWrapper className="mb-3" headerDetails={TransactionHeader}>
            {cartPackageList && cartPackageList.length > 0 ? (
              cartPackageList.map((cartPackage, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className="text-left">{cartPackage.description}</div>
                    </td>
                    <td>
                      <div className="text-right">{cartPackage.qty}</div>
                    </td>
                    <td className="text-center">
                      <div className="text-center">
                        <input
                          onChange={this.handleChangeForEachRow.bind(
                            this,
                            cartPackage.id
                          )}
                          name={index}
                          type="number"
                          min="0"
                          className="w-50 text-right"
                          value={cartPackage.deposit_amt}
                          disabled={this.state.checked}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="text-right">{cartPackage.net_amt}</div>
                    </td>
                    <td>
                      <div className="d-flex justifiy-content-center">
                        {cartPackage.is_td ? (
                          <NormalButton
                            mainbgrev={true}
                            label="TD"
                            onClick={this.handleTreatmentDone.bind(
                              this,
                              cartPackage
                            )}
                            className="w-30"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12">
                  <div className="d-flex align-items-center justify-content-center">
                    {t("No Data")}
                  </div>
                </td>
              </tr>
            )}

            <tr>
              <td></td>
              <td></td>
              <td>
                <div className="">
                  <div className="text-center fw-700">{t("Deposit")}</div>
                  <div className="fw-700">
                    <NormalInput
                      value={deposit}
                      disabled={true}
                      className="text-right w-70"
                    />
                  </div>
                </div>
              </td>
              <td>
                <div className="text-right">
                  <div className="text-center fw-700">{t("Net Total")}</div>
                  <div className="fw-700">
                    <NormalInput
                      value={net_deposit}
                      disabled={true}
                      className="text-right w-70"
                    />
                  </div>
                </div>
              </td>
              <td></td>
            </tr>
          </TableWrapper>
        </div>

        {/* <table className="table table-striped">
          <tr>
            <td>Description</td>
            <td>Qty</td>
            <td>Deposit</td>
            <td>Net Amount</td>
          </tr>
          {cartPackageList.map((cartPackage, index) => (
            <tr key={index} style={{ cursor: "pointer" }}>
              <td>{cartPackage.description}</td>
              <td>{cartPackage.qty}</td>
              <td>
                <input
                  onChange={this.handleChangeForEachRow.bind(
                    this,
                    cartPackage.id
                  )}
                  name={index}
                  type="number"
                  min="0"
                  className="w-50"
                  value={cartPackage.deposit_amt}
                  disabled={this.state.checked}
                />
              </td>

              <td className="d-flex align-items-center justify-content-center">
                {cartPackage.net_amt}
              </td>
            </tr>
          ))}
        </table>

        <div className="col-12">
          <div className="row">
            <div className="col-8"></div>
            <div className="col-2">
              <Label>Deposit:</Label>
              <NormalInput value={deposit} disabled={true} />
            </div>
            <div className="col-2">
              <Label>Net Total:</Label>
              <NormalInput value={net_deposit} disabled={true} />
            </div>
            <br />
            <br />
            <br />
          </div>
        </div> */}

        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-center my-2">
            <div className="col-md-2 col-6">
              <NormalButton
                buttonClass={"treatment"}
                mainbg={true}
                className="col-12 fs-15 "
                label="Full Payment"
                onClick={() => this.fullPayment()}
              />
            </div>
            <div className="col-md-2 col-6">
              <NormalButton
                buttonClass={"treatment"}
                mainbg={true}
                className="col-12 fs-15 "
                label="Clear Deposit"
                onClick={() => this.clear()}
              />
            </div>

            <div className="col-md-2 col-6">
              <NormalButton
                buttonClass={"treatment"}
                resetbg={true}
                className="col-12 fs-15 "
                label="Cancel"
                onClick={() => this.handleCancel()}
              />
            </div>
            <div className="col-md-2 col-6">
              <NormalButton
                submitBtn={true}
                className="col-12 fs-15 "
                label="Confirm"
                onClick={() => this.handleConfirm()}
              />
            </div>
          </div>
        </div>
        <NormalModal
          className={"transaction-done-modal"}
          style={{ minWidth: "60%" }}
          modal={isOpenTreatmentDone}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <PackageTreatmentDone
            id={this.state.selectedData}
            handleModal={this.handleDialog}
          />
        </NormalModal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonUpdateApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const PackageCart = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(PackageCartClass)
);
