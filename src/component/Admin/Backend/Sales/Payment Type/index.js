import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalSelect,
  NormalCheckbox,
  NormalInput,
  NormalModal,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import { Paytables, NewPaytables, PayGroups } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export class PaymentTypeClass extends Component {
  state = {
    CommissionDetails: [
      { label: "Pay Code" },
      { label: "Payment Description" },
      { label: "Pay Group" },
      { label: "Sequence", divClass: "justify-content-end" },
      { label: "Active" },
    ],
    count: 10,
    isoption: false,
    iscreation: false,
    islist: false,
    List: [],
    code: null,
    desc: null,
    acc_code: null,
    gt_code: null,
    seq: null,
    credit_card: null,
    payment_charge: null,
    bank_charges: null,
    gst: false,
    checked: true,
    iscreditcard: false,
    isonlinepayment: false,
    isbankcharge: false,
    option: [
      { value: "GT1", label: "GT1" },
      { value: "GT2", label: "GT2" },
    ],
    pay: [],
    pay_group: null,
  };

  componentDidMount = () => {
    this.Listofpaytables({});
    this.Listofpaygroups({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofpaytables = async () => {
    this.updateState({ is_loading: true });
    await this.props.Paytables().then(res => {
      console.log(res);
      let { List } = this.state;

      List = res;
      console.log(List);
      this.setState({
        List,
        is_loading: false,
      });
      console.log(List.length);
    });
  };

  Listofpaygroups = async () => {
    let { pay } = this.state;
    await this.props.PayGroups().then(res => {
      console.log(res);

      for (let key of res) {
        pay.push({
          value: key.payGroupCode,
          label: key.payGroupCode,
          id: key.id,
        });
      }
      console.log(pay);
      this.setState({
        pay,
      });
      console.log(pay.length);
    });
  };

  generalcontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  commissioncontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      code,
      desc,
      count,
      acc_code,
      gt_code,
      seq,
      credit_card,
      payment_charge,
      bank_charges,
      gst,
      checked,
      iscreditcard,
      isonlinepayment,
      isbankcharge,
      pay_group,
    } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "acc_code") {
      acc_code = value;
      this.setState({ acc_code });
    }
    if (name == "gt_code") {
      gt_code = value;
      this.setState({ gt_code });
    }
    if (name == "seq") {
      seq = value;
      this.setState({ seq });
    }
    if (name == "credit_card") {
      credit_card = value;
      this.setState({ credit_card });
    }
    if (name == "payment_charge") {
      payment_charge = value;
      this.setState({ payment_charge });
    }
    if (name == "bank_charges") {
      bank_charges = value;
      this.setState({ bank_charges });
    }
    if (name == "gst") {
      gst = value;
      this.setState({ gst });
    }
    if (name == "pay_group") {
      pay_group = value;
      this.setState({ pay_group });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
    if (name == "iscreditcard") {
      iscreditcard = value;
      this.setState({ iscreditcard });
    }
    if (name == "isonlinepayment") {
      isonlinepayment = value;
      this.setState({ isonlinepayment });
    }
    if (name == "isbankcharge") {
      isbankcharge = value;
      this.setState({ isbankcharge });
    }
  };

  Addnewone = async () => {
    let {
      code,
      desc,
      count,
      acc_code,
      gt_code,
      seq,
      credit_card,
      payment_charge,
      bank_charges,
      gst,
      checked,
      isbankcharge,
      iscreditcard,
      isonlinepayment,
      pay_group,
    } = this.state;
    if (code == null || desc == null) {
      Toast({
        type: "error",
        message: "Please check required ",
      });
    } else {
      let newroom = {
        payCode: code,
        payDescription: desc,
        payGroup: count,
        payId: 0,
        payIsactive: checked,
        gtGroup: gt_code,
        rwUsebp: true,
        iscomm: true,
        sequence: seq,
        bankCharges: bank_charges,
        eps: 0,
        voucherPaymentControl: true,
        showInReport: true,
        payIsGst: gst,
        creditcardcharges: credit_card,
        onlinepaymentcharges: payment_charge,
        iscreditcard: iscreditcard,
        isonlinepayment: isonlinepayment,
        accountCode: acc_code,
        accountMapping: true,
        openCashdrawer: true,
        iscustapptpromo: true,
        payGroupIdId: pay_group,
        isvoucherExtvoucher: true,
      };
      await this.props
        .NewPaytables(newroom)
        .then(data => {
          this.Listofpaytables({});

          code = "";
          count = "";
          code = "";
          desc = "";
          count = "";
          acc_code = "";
          gt_code = "";
          seq = "";
          credit_card = "";
          payment_charge = "";
          bank_charges = "";
          gst = false;
          checked = true;
          isbankcharge = false;
          iscreditcard = false;
          isonlinepayment = false;
          pay_group = "";
          this.setState({
            code,
            count,
            count,
            acc_code,
            gt_code,
            seq,
            credit_card,
            payment_charge,
            bank_charges,
            gst,
            checked,
            isbankcharge,
            iscreditcard,
            isonlinepayment,
            pay_group,
          });
        })
        .catch(e => console.log(e));
    }
  };

  render() {
    let {
      CommissionDetails,
      pageMeta,
      List,
      is_loading,
      code,
      desc,
      iscreation,
      islist,
      option,
      count,
      acc_code,
      gt_code,
      seq,
      credit_card,
      payment_charge,
      bank_charges,
      gst,
      checked,
      pay,
      pay_group,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid salespayment">
          <h4>{t("Payment Type")}</h4>
          <div
            className="d-flex  justify-content-between p-3 payment"
            onClick={() => this.generalcontent()}
          >
            <p>{t("Payment Type Creation")}</p>
            <div className="icons">
              {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscreation == true ? (
            <div className="container-fluid roomcontent">
              <div className="row">
                <div className="col-6 ">
                  <div className="mt-3">
                    <span>{t("Payment Code")}</span>
                    <span style={{ color: "red" }}>*</span>
                    <div className="input-group">
                      <NormalInput
                        value={code}
                        name="code"
                        onChange={this.temp}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Payment Desc")}</span>
                    <span style={{ color: "red" }}>*</span>
                    <div className="input-group">
                      <NormalInput
                        value={desc}
                        name="desc"
                        onChange={this.temp}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p>{t("Pay Group")}</p>
                    <div className="input-group">
                      <NormalSelect
                        options={pay}
                        value={pay_group}
                        onChange={this.temp}
                        name="code"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p>{t("Account Code")}</p>
                    <div className="input-group">
                      <NormalInput
                        value={acc_code}
                        name="acc_code"
                        onChange={this.temp}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p>{t("GT GROUP")}</p>
                    <div className="input-group">
                      <NormalSelect
                        options={option}
                        value={gt_code}
                        onChange={this.temp}
                        name="gt_code"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-6 ">
                  <div className="mt-3">
                    <p>{t("Sequence")}</p>
                    <div className="input-group">
                      <NormalInput
                        value={seq}
                        name="seq"
                        onChange={this.temp}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex input-group">
                      <NormalCheckbox />
                      <p>{t("Credit Card Charges")}</p>
                      <div className="ml-3">
                        <NormalInput
                          value={credit_card}
                          name="credit_card"
                          onChange={this.temp}
                          type="number"
                        />
                      </div>
                      <p className="ml-1">(%)</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex input-group">
                      <NormalCheckbox />
                      <p>{t("Online Payment Charges")}</p>
                      <div className="ml-3">
                        <NormalInput
                          value={payment_charge}
                          name="payment_charge"
                          onChange={this.temp}
                          type="number"
                        />
                      </div>
                      <p className="ml-1">(%)</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex input-group">
                      <NormalCheckbox />
                      <p>{t("Bank Charges")}</p>
                      <div className="ml-3">
                        <NormalInput
                          value={bank_charges}
                          name="bank_charges"
                          onChange={this.temp}
                          type="number"
                        />
                      </div>
                      <p className="ml-1">(%)</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex input-group">
                      <NormalCheckbox
                        checked={gst}
                        name="gst"
                        onChange={this.temp}
                      />
                      <p>{t("GST Active")}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex input-group">
                      <NormalCheckbox
                        checked={checked}
                        name="checked"
                        onChange={this.temp}
                      />
                      <p>{t(" Active")}</p>
                    </div>
                  </div>
                  <div className="mt-3" style={{ width: 100 }}>
                    <NormalButton
                      mainbg={true}
                      label={"Add"}
                      onClick={() => this.Addnewone()}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className="d-flex  justify-content-between p-3 payment mt-5"
            onClick={() => this.commissioncontent()}
          >
            <p>{t("Payment Type List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <h5 className="mt-3">{t("List of Payment Type")}</h5>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={CommissionDetails}>
                        {is_loading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : List.length > 0 ? (
                          List.map(
                            (
                              {
                                payCode,
                                payDescription,
                                payGroup,
                                sequence,
                                payIsactive,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-left">{payCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {payDescription}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{payGroup}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">{sequence}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {payIsactive == true ? "Yes" : "No"}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : null}
                      </TableWrapper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Paytables,
      NewPaytables,
      PayGroups,
    },
    dispatch
  );
};

export const PaymentType = withTranslation()(
  connect(null, mapDispatchToProps)(PaymentTypeClass)
);
