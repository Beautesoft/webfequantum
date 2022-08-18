import React, { Component } from "react";
import {
  NormalInput,
  NormalTextarea,
  NormalButton,
  NormalSelect,
  NormalDate,
  NormalModal,
  NormalDateTime,
} from "component/common";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { getPayment, createPayment } from "redux/actions/payment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { history } from "helpers";
import { getCommonApi, updateForm } from "redux/actions/common";
import { dateFormat } from "service/helperFunctions";
import "./style.scss";
import SimpleReactValidator from "simple-react-validator";
import closeIcon from "assets/images/close.png";
import helpers from "../../../service/Helper";
import { Toast } from "service/toast";
import { withTranslation } from "react-i18next";
import moment from "moment";

export class ChangePaymentClass extends Component {
  state = {
    formFields: {
      name: "",
      contact: "",
      address: "",
      searchStaff: "",
      payTableDropDownValue: "",
    },
    responseData: {},

    premisesOption: [],
    selectedCards: [],
    selectedCardsPayAmount: 0,
    cardOption: [],
    ewalletoptions: [],

    ewalletField: {
      pay_typeid: null,
      pay_amt: "",
      credit_debit: true,
    },
    cardField: {
      pay_typeid: null,
      pay_amt: "",
      credit_debit: true,
      pay_rem1: "",
      pay_rem2: "",
      pay_rem3: "",
      pay_rem4: "",
      App_code: "",
    },
    balance: 0,
    errorMessage: "123",
    prepaidCustomerData: [],
    voucherCustomerData: [],
    creditNoteCustomerData: [],
    accountHeader: [],
    isMakePaymentButtonClicked: "false",
    itemProductAmount: 0,
    itemServiceAmount: 0,
    itemProductServiceVoucherAmount: 0,
    displayTablePrepaid: [],
    displayTableCreditNote: [],
    displayTableVoucher: [],
    paytableData: [],
    paytableFullData: [],
    payGroupData: [],
    selectPaymentGroup: "",
    selectPaymentGroupId: "",
    isSelectedPaymentType: "",
    displayModelPaymentType: "",
    txtUserPayAmount: 0,
    isOpenSubPayment: false,
    pay_rem4: "",
    DateofPay: new Date(),
    MinimumDate: new Date(),
    is_paymentdate: false,
    isMakePaymentLoading: false,
  };

  componentDidMount() {
    this.getFullPayTable();
    this.getPayGroup();
    this.getPayment();
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
  // get method for payment detail against appointment
  getPayment = () => {
    let { TransactionId } = this.props;
    let { selectedCards } = this.state;
    this.props
      .getPayment(`paymentlist/?sa_transacno=${TransactionId}`)
      .then(res => {
        console.log("Payment Details:", res);
        let { balance, selectedCards, txtUserPayAmount, isOpenSubPayment } =
          this.state;
        let { data, status, pay_list } = res;
        if (status === 200) {
          this.setState({
            responseData: data,
            balance: Number(data.billable_amount),
            txtUserPayAmount: Number(data.billable_amount),
          });
          pay_list.forEach(item => {
            if (Number(item.pay_typeid) == 2) {
              selectedCards.push({
                pay_typeid: item.pay_typeid,
                pay_amt: parseFloat(item.pay_amt),
                pay_premise: item.pay_premise,
                prepaid: item.prepaid,
                credit_debit: item.credit_debit,
                pay_rem4: item.pay_rem4,
                pay_desc: item.pay_desc,
                gt_group: item.gt_group,
              });
            } else if (Number(item.pay_typeid) == 4) {
              selectedCards.push({
                credit_debit: item.credit_debit,
                pay_amt: parseFloat(item.pay_amt),
                pay_premise: item.pay_premise,
                pay_rem1: item.pay_rem1,
                pay_rem2: item.pay_rem2,
                pay_rem3: item.pay_rem3,
                pay_rem4: item.pay_rem4,
                pay_typeid: item.pay_typeid,
                prepaid: item.prepaid,
                pay_desc: item.pay_desc,
                gt_group: item.gt_group,
              });
            } else if (Number(item.pay_typeid) == 17) {
              selectedCards.push({
                credit_debit: item.credit_debit,
                pay_amt: parseFloat(item.pay_amt),
                pay_premise: item.pay_premise,
                pay_rem1: item.pay_rem1,
                pay_rem2: item.pay_rem2,
                pay_rem4: item.pay_rem4,
                pay_typeid: item.pay_typeid,
                prepaid: item.prepaid,
                pay_desc: item.pay_desc,
                gt_group: item.gt_group,
              });
            } else if (Number(item.pay_typeid) == 23) {
              selectedCards.push({
                credit_debit: item.credit_debit,
                pay_amt: parseFloat(item.pay_amt),
                pay_premise: item.pay_premise,
                pay_rem1: item.pay_rem1,
                pay_rem2: item.pay_rem2,
                pay_rem4: item.pay_rem4,
                pay_typeid: item.pay_typeid,
                prepaid: item.prepaid,
                prepaid_ct: item.prepaid_ct,
                pay_desc: item.pay_desc,
                gt_group: item.gt_group,
              });
            } else if (Number(item.pay_typeid) == 9) {
              selectedCards.push({
                credit_debit: item.credit_debit,
                pay_amt: parseFloat(item.pay_amt),
                pay_premise: item.pay_premise,
                pay_rem1: item.pay_rem1,
                pay_rem4: item.pay_rem4,
                pay_typeid: item.pay_typeid,
                prepaid: item.prepaid,
                pay_desc: item.pay_desc,
                gt_group: item.gt_group,
              });
            } else {
              selectedCards.push({
                credit_debit: item.credit_debit,
                pay_amt: parseFloat(item.pay_amt),
                pay_premise: item.pay_premise,
                pay_rem1: item.pay_rem1,
                pay_rem2: item.pay_rem2,
                pay_rem3: item.pay_rem3,
                pay_rem4: item.pay_rem4,
                pay_typeid: item.pay_typeid,
                prepaid: item.prepaid,
                pay_desc: item.pay_desc,
                gt_group: item.gt_group,
              });
            }
            balance = parseFloat(balance - txtUserPayAmount).toFixed(2);
            txtUserPayAmount = balance;
            this.setState({ txtUserPayAmount, balance });
          });
        }
      });
  };

  handleMultiple = ({ target: { value, name } }) => {
    console.log("handleMultiple", value, name);
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;

    this.setState({
      formFields,
    });
  };

  getPayGroup = () => {
    this.props.getCommonApi(`paygroup/?gt_group=GT1`).then(res => {
      console.log(res, "paygroupresponse");
      let { payGroupData } = this.state;
      for (let key of res.data) {
        payGroupData.push({
          label: key.pay_group_code,
          value: key.id,
          picturelocation: key.picturelocation,
        });
      }
      this.setState({
        payGroupData,
      });
    });
  };
  getFullPayTable = () => {
    this.props.getCommonApi(`paytablenew/`).then(async res => {
      let { paytableFullData } = this.state;
      paytableFullData = res.data;
      console.log(res.data, "responseforGetfullpaytable");
      await this.setState({
        paytableFullData,
      });
    });
  };

  getPayTableNameBasedOnId = payTableId => {
    debugger;
    // gt_group: "GT1"
    // id: 6
    // pay_code: "UOBPN"
    // pay_description: "UOB PAYNOW"
    // pay_group_name: "UOB"
    // pay_groupid: 22

    // if (
    //   isSelectedPaymentType == "VOUCHER" ||
    //   isSelectedPaymentType == "PREPAID" ||
    //   isSelectedPaymentType == "Credit" ||
    //   isSelectedPaymentType == "OLD BILL"
    // ) {
    //   const test = paytableFullData.filter(
    //     res => res.pay_group_name.trim() == isSelectedPaymentType.trim()
    //   );
    //   return test[0].pay_description;
    // } else {
    const test = this.state.paytableFullData.filter(
      res => res.id == payTableId
    );
    console.log(test, "Filtered payment data");
    return test[0].pay_description;

    // }
  };

  handleChangeTextBox(event) {
    this.setState({
      txtUserPayAmount: event.target.value,
    });
  }
  handleChangeRemarkBox(event) {
    this.setState({
      pay_rem4: event.target.value,
    });
  }
  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;
    this.setState({
      formFields,
    });
    let { balance, selectedCards, txtUserPayAmount, isOpenSubPayment } =
      this.state;
    isOpenSubPayment = false;
    selectedCards.push({
      pay_typeid: value,
      pay_amt: parseFloat(txtUserPayAmount),
      credit_debit: false,
      pay_premise: true,
      prepaid: false,
      pay_rem4: this.state.pay_rem4,
      gt_group: false,
    });
    balance = parseFloat(balance - txtUserPayAmount).toFixed(2);
    txtUserPayAmount = balance;
    this.setState({ txtUserPayAmount, balance, isOpenSubPayment });
  };
  handleCreditChange = ({ target: { value, name } }) => {
    let cardField = Object.assign({}, this.state.cardField);

    cardField[name] = value;
    this.setState({
      cardField,
    });
  };
  // create payment detail
  handleSubmit = () => {
    this.setState({
      isMakePaymentLoading: true,
    });
    let { selectedCards, DateofPay } = this.state;
    this.setState({ isMakePaymentButtonClicked: "true" });

    let data = selectedCards;
    console.log("SubmitDatapayment", data);
    let { TransactionId } = this.props;
    this.props
      .createPayment(`changepayment/?sa_transacno=${TransactionId}`, data)
      .then(res => {
        this.setState({
          isMakePaymentLoading: false,
        });
        history.push(`/admin/billing/print/bill/${res.data.sa_transacno}`);
      });
    this.setState({
      isMakePaymentLoading: false,
    });
  };
  checkPayTypeIdAlreadyExists(val) {
    return this.state.selectedCards.some(item => val === item.pay_typeid);
  }
  addCreditCard = async () => {
    if (!this.validator.fieldValid("cardFieldType")) {
      this.validator.showMessageFor("cardFieldType");
      return;
    }

    let { cardField, selectedCards, balance, responseData, txtUserPayAmount } =
      this.state;
    let userPayAmount = parseFloat(txtUserPayAmount);
    if (parseFloat(this.state.responseData.billable_amount) > 0) {
      if (userPayAmount == 0) {
        return;
      }
    }
    if (this.checkPayTypeIdAlreadyExists(cardField.pay_typeid)) {
      let result =
        this.getPayTableNameBasedOnId(cardField.pay_typeid) + " already exists";
      Toast({
        type: "error",
        message: result,
      });

      return;
    } else {
      selectedCards.push({
        pay_typeid: cardField.pay_typeid,
        pay_amt: userPayAmount,
        credit_debit: true,
        pay_premise: false,
        pay_rem1: cardField.pay_rem1,
        pay_rem2: cardField.pay_rem2,
        pay_rem3: cardField.pay_rem3,
        pay_rem4: this.state.pay_rem4,
        prepaid: false,
        gt_group: false,
      });
    }

    balance = parseFloat(balance - userPayAmount).toFixed(2);
    this.setState({ isOpenSubPayment: false });
    this.setBalanceToAllTextBoxes(balance);
  };
  addPrepaid = selectedPrepaid => {
    const prepaidExpDate = moment(selectedPrepaid.exp_date).format(
      "YYYY-MM-DD"
    );
    const todaysDate = moment(new Date()).format("YYYY-MM-DD");
    const isValid = moment(todaysDate).isSameOrAfter(prepaidExpDate);
    let userPayAmount = 0;
    let {
      itemServiceAmount,
      itemProductAmount,
      itemProductServiceVoucherAmount,
      txtUserPayAmount,
    } = this.state;
    console.log(txtUserPayAmount);
    userPayAmount = parseFloat(txtUserPayAmount);
    if (isValid) {
      Toast({
        type: "error",
        message: "Check Expiry Date",
      });
      return;
    }
    if (userPayAmount <= 0) {
      Toast({
        type: "error",
        message: "Prepaid is Not allowed",
      });
      return;
    }

    let selectedRemainingPrepaidAmount = parseFloat(selectedPrepaid.remain);

    if (selectedRemainingPrepaidAmount < userPayAmount) {
      //return
    } else if (selectedRemainingPrepaidAmount > userPayAmount) {
      selectedRemainingPrepaidAmount = parseFloat(userPayAmount);
    }

    if (selectedPrepaid.conditiontype1 === "Service Only") {
      //For Service
      if (parseFloat(itemServiceAmount) == 0) {
        Toast({
          type: "error",
          message: "Prepaid is Not allowed",
        });
        return;
      }
      if (parseFloat(itemServiceAmount) <= selectedRemainingPrepaidAmount) {
        userPayAmount =
          parseFloat(txtUserPayAmount) < parseFloat(itemServiceAmount)
            ? parseFloat(txtUserPayAmount)
            : parseFloat(itemServiceAmount);
        console.log(itemServiceAmount);
        console.log(userPayAmount);
      } else {
        userPayAmount = selectedRemainingPrepaidAmount;
        console.log(userPayAmount);
      }
      itemServiceAmount = itemServiceAmount - userPayAmount;
      this.setState({ itemServiceAmount });
    } else if (selectedPrepaid.conditiontype1 === "Product Only") {
      //For Product
      if (parseFloat(itemProductAmount) == 0) {
        Toast({
          type: "error",
          message: "Prepaid is not allowed",
        });
        return;
      }
      if (parseFloat(itemProductAmount) <= selectedRemainingPrepaidAmount) {
        userPayAmount =
          parseFloat(txtUserPayAmount) < parseFloat(itemProductAmount)
            ? parseFloat(txtUserPayAmount)
            : parseFloat(itemProductAmount);
        console.log(userPayAmount);
      } else {
        userPayAmount = selectedRemainingPrepaidAmount;
        console.log(userPayAmount);
      }
      itemProductAmount = itemProductAmount - userPayAmount;
      this.setState({ itemProductAmount });
    } else {
      if (parseFloat(itemProductServiceVoucherAmount) == 0) {
        Toast({
          type: "error",
          message: "Prepaid is not allowed",
        });
        return;
      }
      if (
        parseFloat(itemProductServiceVoucherAmount) <=
        selectedRemainingPrepaidAmount
      ) {
        userPayAmount =
          parseFloat(txtUserPayAmount) <
          parseFloat(itemProductServiceVoucherAmount)
            ? parseFloat(txtUserPayAmount)
            : parseFloat(itemProductServiceVoucherAmount);
        console.log(userPayAmount);
      } else {
        userPayAmount = selectedRemainingPrepaidAmount;
        console.log(userPayAmount);
      }
      itemProductServiceVoucherAmount =
        itemProductServiceVoucherAmount - userPayAmount;
      this.setState({ itemProductServiceVoucherAmount });
    }
    if (userPayAmount == 0) {
      Toast({
        type: "error",
        message: "Prepaid is not allowed",
      });
      return;
    }
    const payTypeId = 23;
    let { cardField, ewalletField, balance, selectedCards, isOpenSubPayment } =
      this.state;

    selectedCards.push({
      pay_typeid: payTypeId,
      prepaid: true,
      pay_amt: userPayAmount,
      credit_debit: false,
      pay_premise: false,
      pay_rem1:
        selectedPrepaid.pp_no +
        " - " +
        selectedPrepaid.line_no +
        " - " +
        selectedPrepaid.pp_desc,
      pay_rem2: selectedPrepaid.id,
      pay_rem4: this.state.pay_rem4,
      prepaid_ct: selectedPrepaid.conditiontype1,
      gt_group: false,
    });
    console.log(
      "BeforeAdd-displayTablePrepaid",
      this.state.displayTablePrepaid
    );
    let setdisplayTablePrepaid = this.state.displayTablePrepaid;
    setdisplayTablePrepaid.push(selectedPrepaid.id);
    this.setState({ displayTablePrepaid: setdisplayTablePrepaid });
    console.log("AfterAdd-displayTablePrepaid", this.state.displayTablePrepaid);
    this.HidePrepaidTableData();

    balance = parseFloat(balance - userPayAmount).toFixed(2);
    this.setBalanceToAllTextBoxes(balance);
    console.log(balance);
    this.setState({ isOpenSubPayment: false });
  };
  HidePrepaidTableData() {
    let { prepaidCustomerData, displayTablePrepaid } = this.state;
    displayTablePrepaid.map(item => {
      var selectedPrepaid = prepaidCustomerData.filter(
        prepaid => prepaid.id != item
      );
      this.setState({ prepaidCustomerData: selectedPrepaid });
    });
  }
  HideCreditNoteTableData() {
    let { creditNoteCustomerData, displayTableCreditNote } = this.state;
    displayTableCreditNote.map(item => {
      var selectedCreditNote = creditNoteCustomerData.filter(
        creditNote => creditNote.credit_code != item
      );
      this.setState({ creditNoteCustomerData: selectedCreditNote });
    });
  }
  HideVoucherTableData() {
    let { voucherCustomerData, displayTableVoucher } = this.state;
    displayTableVoucher.map(item => {
      var selectedVoucher = voucherCustomerData.filter(
        voucher => voucher.voucher_no != item
      );
      this.setState({ voucherCustomerData: selectedVoucher });
    });
  }
  addVoucher = selectedVoucher => {
    let {
      cardField,
      ewalletField,
      balance,
      txtUserPayAmount,
      isOpenSubPayment,
      selectedCards,
    } = this.state;
    if (txtUserPayAmount == 0) {
      Toast({
        type: "error",
        message: "Voucher is not allowed",
      });
      return;
    }
    const selectedVoucherAmount = parseFloat(selectedVoucher.value);
    let pay_amt_setup = 0;
    if (selectedVoucherAmount <= parseFloat(txtUserPayAmount)) {
      pay_amt_setup = selectedVoucherAmount;
    } else {
      Toast({
        type: "error",
        message: "Partial Amount is not applicable in voucher",
      });
      return;
      // alert("Partial Amount is not applicable in voucher");
      // return;
    }
    const payTypeId = 9;

    selectedCards.push({
      pay_typeid: payTypeId,
      prepaid: false,
      pay_amt: parseFloat(pay_amt_setup),
      credit_debit: false,
      pay_premise: false,
      pay_rem1: selectedVoucher.voucher_no,
      pay_rem2: selectedVoucher.voucher_no,
      pay_rem4: this.state.pay_rem4,
      gt_group: false,
    });
    console.log(
      "BeforeAdd-displayTableVoucher",
      this.state.displayTableVoucher
    );
    let setdisplayTableVoucher = this.state.displayTableVoucher;
    setdisplayTableVoucher.push(selectedVoucher.voucher_no);
    this.setState({ displayTableVoucher: setdisplayTableVoucher });
    console.log(
      "AfterAdd-displayTableCreditNote",
      this.state.displayTableVoucher
    );
    this.HideVoucherTableData();

    balance = parseFloat(balance - pay_amt_setup).toFixed(2);
    this.setState({ isOpenSubPayment: false });
    this.setBalanceToAllTextBoxes(balance);
  };
  addCreditNote = selectedCreditNote => {
    console.log(selectedCreditNote);
    let { cardField, ewalletField, balance, txtUserPayAmount, selectedCards } =
      this.state;
    if (txtUserPayAmount == 0) {
      Toast({
        type: "error",
        message: "Credit Note is not allowed",
      });
      return;
    }
    const selectedCreditNoteAmount = parseFloat(selectedCreditNote.balance);
    console.log(selectedCreditNoteAmount);
    let pay_amt_setup = 0;
    if (selectedCreditNoteAmount <= parseFloat(txtUserPayAmount)) {
      pay_amt_setup = selectedCreditNoteAmount;
    } else {
      pay_amt_setup = txtUserPayAmount;
    }
    const payTypeId = 17;

    selectedCards.push({
      pay_typeid: payTypeId,
      prepaid: false,
      pay_amt: parseFloat(pay_amt_setup),
      credit_debit: false,
      pay_premise: false,
      pay_rem1: selectedCreditNote.credit_code,
      pay_rem2: selectedCreditNote.transaction,
      pay_rem4: this.state.pay_rem4,
      gt_group: false,
    });
    console.log(
      "BeforeAdd-displayTableCreditNote",
      this.state.displayTableCreditNote
    );
    let setdisplayTableCreditNote = this.state.displayTableCreditNote;
    setdisplayTableCreditNote.push(selectedCreditNote.credit_code);
    this.setState({ displayTableCreditNote: setdisplayTableCreditNote });
    console.log(
      "AfterAdd-displayTableCreditNote",
      this.state.displayTableCreditNote
    );
    this.HideCreditNoteTableData();

    balance = parseFloat(balance - pay_amt_setup).toFixed(2);
    this.setState({ isOpenSubPayment: false });
    this.setBalanceToAllTextBoxes(balance);
  };

  setBalanceToAllTextBoxes(balance) {
    this.setState({
      balance: balance,
      txtUserPayAmount: balance,
    });
  }
  removeCards = idx => () => {
    let {
      selectedCards,
      balance,
      cardField,
      ewalletField,
      itemProductServiceVoucherAmount,
      itemProductAmount,
      itemServiceAmount,
    } = this.state;
    this.setState({ isMakePaymentButtonClicked: "false" });
    balance = parseFloat(balance) + parseFloat(idx.pay_amt);
    var array = [...selectedCards]; // make a separate copy of the array
    var index = array.indexOf(idx);
    if (idx.pay_typeid == 23) {
      if (idx.prepaid_ct == "Product Only") {
        itemProductAmount = itemProductAmount + idx.pay_amt;
      } else if (idx.prepaid_ct == "Service Only") {
        itemServiceAmount = itemServiceAmount + idx.pay_amt;
      } else {
        itemProductServiceVoucherAmount =
          itemProductServiceVoucherAmount + idx.pay_amt;
      }
      this.setState({
        itemProductServiceVoucherAmount,
        itemProductAmount,
        itemServiceAmount,
      });
    }
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ selectedCards: array, balance });
    }
    //console.log("idx", idx);
    var removedTerm = idx.pay_typeid;
    //console.log("removedTerm", removedTerm);
    //console.log("idx.pay_rem2", idx.pay_rem2);
    if (removedTerm == "23") {
      const items = this.state.displayTablePrepaid;
      console.log("BeforeRemove-displayTablePrepaid", items);
      const valueToRemove = idx.pay_rem2; //For Prepaid Ony we have added unique id here
      console.log("BeforeRemove-valueToRemove", valueToRemove);
      const filteredItems = items.filter(item => item !== valueToRemove);
      this.setState({ displayTablePrepaid: filteredItems }, () => {
        console.log(
          "AfterRemove-displayTablePrepaid",
          this.state.displayTablePrepaid
        );
      });
      this.getPrepaidAccountData("");
      // this.HidePrepaidTableData();
    }
    if (removedTerm == "17") {
      const items = this.state.displayTableCreditNote;
      console.log("BeforeRemove-displayTableCreditNote", items);
      const valueToRemove = idx.pay_rem1; //For Credit Note Ony we have added unique id here
      console.log("BeforeRemove-valueToRemove", valueToRemove);
      const filteredItems = items.filter(item => item !== valueToRemove);
      this.setState({ displayTableCreditNote: filteredItems }, () => {
        console.log(
          "AfterRemove-displayTableCreditNote",
          this.state.displayTableCreditNote
        );
      });
      this.getCreditNoteAccountData("");
      // this.HidePrepaidTableData();
    }

    if (removedTerm == "9") {
      const items = this.state.displayTableVoucher;
      console.log("BeforeRemove-displayTableVoucher", items);
      const valueToRemove = idx.pay_rem1; //For Credit Note Ony we have added unique id here
      console.log("BeforeRemove-valueToRemove", valueToRemove);
      const filteredItems = items.filter(item => item !== valueToRemove);
      this.setState({ displayTableVoucher: filteredItems }, () => {
        console.log(
          "AfterRemove-displayTableVoucher",
          this.state.displayTableVoucher
        );
      });
      this.getVoucherData("");
    }
    cardField["pay_amt"] = balance;
    ewalletField["pay_amt"] = balance;
    this.setBalanceToAllTextBoxes(balance);
  };
  checkTypeOfCartItemContainsDeposit(cartData) {
    let stringifiedCartData = cartData.data;
    if (stringifiedCartData) {
      stringifiedCartData.map(item => {
        if (item.type === "Deposit" || item.type === "Top Up") {
          this.state.isTreatmentDoneButton = false;
        }
      });
    }
  }
  addNewPaymentData = async (selPayTypeId, selPayTypeName) => {
    if (!this.validator.fieldValid("Amount")) {
      this.validator.showMessageFor("Amount");
      return;
    }
    if (!this.validator.fieldValid("Amount")) {
      this.validator.showMessageFor("Amount");
      return;
    }

    this.props
      .getCommonApi(`paytablenew/?paygroupid=${selPayTypeId}`)
      .then(res => {
        this.setState({
          paytableData: [],
        });
        let { paytableData, isSelectedPaymentType, displayModelPaymentType } =
          this.state;
        isSelectedPaymentType = selPayTypeName.trim().toUppperCase();
        displayModelPaymentType = selPayTypeName.trim().toUppperCase();
        for (let key of res.data) {
          paytableData.push({ label: key.pay_description, value: key.id });
        }
        this.setState(
          {
            paytableData,
          },
          () => {
            let { isOpenSubPayment } = this.state;
            if (paytableData.length == 0) {
              Toast({
                type: "error",
                message: "Pay Table Not Exists",
              });
              return;
            } else if (selPayTypeName.trim().toUppperCase() === "VOUCHER") {
              isOpenSubPayment = true;
            } else if (selPayTypeName.trim().toUppperCase() === "PREPAID") {
              isOpenSubPayment = true;
            } else if (selPayTypeName.trim().toUppperCase() === "CREDIT") {
              isOpenSubPayment = true;
            } else if (selPayTypeName.trim().toUppperCase() === "CARD") {
              isOpenSubPayment = true;
            } else if (paytableData.length == 1) {
              isOpenSubPayment = false;
              let payTypeId = paytableData[0].value;
              let { balance, selectedCards, txtUserPayAmount } = this.state;
              if (parseFloat(this.state.responseData.billable_amount) > 0) {
                if (parseFloat(txtUserPayAmount) == 0) {
                  return;
                }
              }
              if (this.checkPayTypeIdAlreadyExists(payTypeId)) {
                let result =
                  this.getPayTableNameBasedOnId(payTypeId) + " already exists";
                Toast({
                  type: "error",
                  message: result,
                });
                //alert("Already Exists");
                return;
              } else {
                selectedCards.push({
                  pay_typeid: payTypeId,
                  pay_amt: parseFloat(txtUserPayAmount),
                  credit_debit: false,
                  pay_premise: true,
                  prepaid: false,
                  pay_rem4: this.state.pay_rem4,
                  gt_group: false,
                });
                balance = parseFloat(balance - txtUserPayAmount).toFixed(2);
                txtUserPayAmount = balance;
                this.setState({ txtUserPayAmount, balance });
                return;
              }
            } else if (paytableData.length >= 1) {
              isOpenSubPayment = true;
              isSelectedPaymentType = "MULTIPLE";
            }
            this.setState({
              isOpenSubPayment,
              isSelectedPaymentType,
              displayModelPaymentType,
            });
          }
        );
      });
  };

  handleDialog = async () => {
    let { isOpenSubPayment } = this.state;
    isOpenSubPayment = false;
    await this.setState({
      isOpenSubPayment,
    });
  };

  handleChangeCard = async ({ target: { value, name } }) => {
    let cardField = Object.assign({}, this.state.cardField);

    cardField[name] = value;

    await this.setState({
      cardField,
    });
  };
  handleDatePick = async ({ target: { value, name } }) => {
    let { DateofPay } = this.state;
    DateofPay = value;
    await this.setState({
      DateofPay,
    });

    let DatePayment = {};
    DatePayment["DateofPayment"] = value;
    await this.props.updateForm("CartPaymentDate", DatePayment);
  };

  render() {
    let {
      responseData,
      balance,
      payGroupData,
      paytableData,
      isOpenSubPayment,
      isSelectedPaymentType,
      displayModelPaymentType,
      cardField,
      pay_rem4,
      DateofPay,
      MinimumDate,
      is_paymentdate,
      isMakePaymentLoading,
    } = this.state;
    let { t } = this.props;
    let { payTableDropDownValue } = this.state.formFields;
    console.log(payTableDropDownValue);
    let insideRadioButtonData;
    console.log(isSelectedPaymentType, "selectedpaymenttype");
    if (isSelectedPaymentType == "VOUCHER") {
      insideRadioButtonData = (
        <div>
          <table className="table table-bordered">
            <tr>
              <td>{t("Vocucher No")}</td>
              <td>{t("Value")}</td>
              <td>{t("Exp. Date")}</td>
            </tr>
            {this.state.voucherCustomerData.map((selectedVoucher, index) => (
              <tr
                key={index}
                style={{ cursor: "pointer" }}
                onClick={this.addVoucher.bind(this, selectedVoucher)}
              >
                <td>{selectedVoucher.voucher_no}</td>
                <td>{selectedVoucher.value}</td>
                <td>{selectedVoucher.issued_expiry_date}</td>
              </tr>
            ))}
          </table>
        </div>
      );
    } else if (isSelectedPaymentType == "PREPAID") {
      insideRadioButtonData = (
        <div>
          <table className="table table-striped">
            <tr>
              <td>{t("Category")}</td>
              <td>{t("Amount")}</td>
              <td>{t("Remaining")}</td>
              <td>{t("Invoice No.")}</td>
              <td>{t("Exp. Date")}</td>
              <td>{t("Condition Type")}</td>
              <td>{t("Use Amount")}</td>
            </tr>
            {this.state.prepaidCustomerData.map((selectedPrepaid, index) => (
              <tr
                key={index}
                style={{ cursor: "pointer" }}
                onClick={this.addPrepaid.bind(this, selectedPrepaid)}
              >
                <td>{selectedPrepaid.pp_desc}</td>
                <td className="text-right">{selectedPrepaid.pp_total}</td>
                <td className="text-right">{selectedPrepaid.remain}</td>
                <td>{selectedPrepaid.prepaid}</td>
                <td>{selectedPrepaid.exp_date}</td>
                <td>{selectedPrepaid.conditiontype1}</td>
                <td className="text-right">{selectedPrepaid.Finaluse_amt}</td>
              </tr>
            ))}
          </table>
        </div>
      );
    } else if (isSelectedPaymentType == "CREDIT") {
      insideRadioButtonData = (
        <div>
          <table className="table table-striped">
            <tr>
              <td>{t("Credit")} #</td>
              <td>{t("Date")}</td>
              <td>{t("Amount")}</td>
              <td>{t("Balance")}</td>
              <td>{t("Status")}</td>
            </tr>
            {this.state.creditNoteCustomerData.map((creditNote, index) => (
              <tr
                key={index}
                style={{ cursor: "pointer" }}
                onClick={this.addCreditNote.bind(this, creditNote)}
              >
                <td>{creditNote.credit_code}</td>
                <td>{creditNote.sa_date}</td>
                <td>{creditNote.amount}</td>
                <td>{creditNote.balance}</td>
                <td>{creditNote.status}</td>
              </tr>
            ))}
          </table>
        </div>
      );
    } else if (isSelectedPaymentType == "CARD") {
      insideRadioButtonData = (
        <div>
          <div className="d-flex flex-wrap justify-content-start">
            <div className="col-1"></div>
            <div className="col-5">
              <div className="input-group">
                {t("Select Card")}
                <NormalSelect
                  placeholder="Search type..."
                  options={paytableData}
                  value={cardField.pay_typeid}
                  name="pay_typeid"
                  onChange={this.handleCreditChange}
                />
              </div>
              {this.validator.message(
                "cardFieldType",
                cardField.pay_typeid,
                "required"
              )}
            </div>
            <div className="col-1"></div>
            <div className="col-5">
              <div className="input-group">
                {t("Card No.")}
                <NormalInput
                  value={cardField.pay_rem1}
                  name="pay_rem1"
                  onChange={this.handleChangeCard}
                />
              </div>
            </div>
            <div className="col-1"></div>
            <div className="col-5">
              <div className="input-group">
                {t("Name")}
                <NormalInput
                  value={cardField.pay_rem2}
                  name="pay_rem2"
                  onChange={this.handleChangeCard}
                />
              </div>
            </div>
            <div className="col-1"></div>
            <div className="col-5">
              <div className="input-group">
                {t("Exp Month")} / {t("Year")}
                <NormalInput
                  placeholder="mm/YYYY"
                  value={cardField.pay_rem3}
                  name="pay_rem3"
                  onChange={this.handleChangeCard}
                />
              </div>
            </div>
            <div className="col-1"></div>
            <div className="col-5">
              <div className="input-group">
                {t("Approval Code")}
                <NormalInput
                  value={cardField.App_code}
                  name="App_code"
                  onChange={this.handleChangeCard}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <div className="col-2">
              <div className="input-group">
                <NormalButton
                  mainbg={false}
                  className="col-12 mt-4 ml-2 btn-outline-success"
                  label="CONFIRM"
                  onClick={() => this.addCreditCard()}
                />
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        </div>
      );
    } else if (isSelectedPaymentType == "MULTIPLE") {
      insideRadioButtonData = (
        <div>
          <div className="row">
            <div className="col-5">
              <div className="input-group">
                <Label className="col-12 fs-15">{t("Choose Option")}</Label>
                <NormalSelect
                  placeholder="Search type..."
                  options={paytableData}
                  value={payTableDropDownValue}
                  name="payTableDropDownValue"
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      insideRadioButtonData = <div></div>;
    }
    let payGroupDataContent = [];
    console.log(payGroupData);
    payGroupData.forEach((item, i) => {
      payGroupDataContent.push(
        <div
          className="col-md-3 col-4 payment-item cursor-pointer"
          style={{ width: "50px", padding: "15px" }}
          key={i}
          onClick={() => this.addNewPaymentData(item.value, item.label)}
        >
          <center>
            <img
              src={helpers.getUrl() + "media/" + item.picturelocation}
              label={item.label}
              style={{ textAlign: "center" }}
              width="40"
              height="40"
            />
          </center>
          <center>
            <p style={{ width: "100px", textAlign: "center" }}>{item.label}</p>
          </center>
        </div>
      );
    });

    let { cartId, cartData, tokenDetails } = this.props;
    console.log(cartId, tokenDetails, this.props.cartData);
    //this.checkTypeOfCartItemContainsDeposit(cartData);

    let userAddedPayTableData = (
      <table className="table table-bordered">
        {this.state.selectedCards.map((selectedCards, index) => (
          <tr key={index}>
            <td className="fs-18">
              {selectedCards.pay_desc
                ? selectedCards.pay_desc
                : this.getPayTableNameBasedOnId(selectedCards.pay_typeid)}
            </td>
            <td className="fs-18" style={{ textAlign: "right" }}>
              {selectedCards.pay_amt.toFixed(2)}
            </td>
            <td>
              {!selectedCards.gt_group ? (
                <div
                  className="col-4 p-0 fs-20 cursor-pointer"
                  onClick={this.removeCards(selectedCards)}
                >
                  <span className="icon-delete"></span>
                </div>
              ) : null}
            </td>
          </tr>
        ))}
      </table>
    );
    return (
      <React.Fragment>
        <div className="d-flex flex-wrap">
          <div className="col-md-2 col-12 mb-2">
            <label className="text-left text-black common-label-text ">
              {t("Enter Amount")}
            </label>

            <div className="input-group mb-2">
              <NormalInput
                value={this.state.txtUserPayAmount}
                onChange={this.handleChangeTextBox.bind(this)}
              />
              {this.validator.message(
                "Amount",
                this.state.txtUserPayAmount,
                "required|numeric|min:0,num"
              )}
              {this.validator.message(
                "Amount",
                this.state.txtUserPayAmount,
                "required|numeric|max:" + this.state.balance + ",num"
              )}
            </div>
          </div>
          <div className="col-md-4 col-12 mb-2">
            <Label>{t("Remark")}</Label>
            <div className="input-group mb-2">
              <NormalInput
                value={pay_rem4}
                name="pay_rem4"
                onChange={this.handleChangeRemarkBox.bind(this)}
              />
            </div>
          </div>

          <div className="col-md-2 col-12 mb-2">
            {is_paymentdate ? (
              <>
                <Label>{t("Date")}</Label>
                <div className="input-group mb-2">
                  <NormalDate
                    value={new Date(DateofPay)}
                    name="DateofPay"
                    type="date"
                    onChange={this.handleDatePick}
                    minDate={new Date(MinimumDate)}
                    maxDate={new Date()}
                    showDisabledMonthNavigation
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="col-md-4 col-12">
            <div className="d-flex justify-content-end">
              <div className="make-payment mt-3 text-center">
                {isMakePaymentLoading ? (
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">{t("Loading...")}</span>
                    </div>
                  </div>
                ) : this.state.isMakePaymentButtonClicked == "true" ? (
                  <NormalButton
                    submitBtn={true}
                    className="col-12"
                    label="Make payment"
                    disabled={true}
                  />
                ) : (
                  <NormalButton
                    submitBtn={true}
                    className="col-12"
                    label="Make payment"
                    onClick={() => this.handleSubmit()}
                    disabled={
                      this.state.selectedCards.length <= 0 || balance > 0
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <h4>{t("Select Payment Method")}</h4>

        <div className="row paymentGroup">
          <div className="col-md-6">
            <div className="d-flex flex-wrap">
              {payGroupData.length > 0 ? (
                payGroupData.map((item, index) => {
                  return (
                    <div
                      className="col-md-3 col-4 payment-item cursor-pointer"
                      style={{ width: "50px", padding: "15px" }}
                      key={index}
                      onClick={() =>
                        this.addNewPaymentData(item.value, item.label)
                      }
                    >
                      <center>
                        <img
                          src={
                            helpers.getUrl() + "media/" + item.picturelocation
                          }
                          label={item.label}
                          style={{ textAlign: "center" }}
                          width="40"
                          height="40"
                        />
                      </center>
                      <center>
                        <p style={{ width: "100px", textAlign: "center" }}>
                          {item.label}
                        </p>
                      </center>
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="col-md-6 make-payment-section">
            <p className="h6">{t("List of Selections")}</p>
            <div className="row">
              <div className="col-md-12 mt-1 mb-1">
                <div className="d-flex payment">
                  <div className="col-md-7 p-0">
                    <div className="d-flex flex-wrap fs-14">
                      <div className="col-6">{t("Subtotal")}</div>
                      <div className="col-6">$ {responseData.subtotal}</div>
                      <div className="col-6">{t("Discount ($)")}</div>
                      <div className="col-6">$ {responseData.discount}</div>
                      <div className="col-6">{t("Transac amount")}</div>
                      <div className="col-6">$ {responseData.trans_amt}</div>
                      <div className="col-6">{t("Deposit")}</div>
                      <div className="col-6">$ {responseData.deposit_amt}</div>
                      <div className="col-6">{responseData.tax_lable}</div>
                      <div className="col-6">$ {responseData.tax_amt}</div>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="d-flex flex-wrap">
                      <div className="col-12 fs-22 text-center">
                        {t("Billing Amount")}
                      </div>
                      <div className="col-12 fs-22 fw-700 text-center text-orenge">
                        $ {responseData.billable_amount}
                      </div>
                      <div className="col-12 f-600 text-center mt-2">
                        {t("Balance Amount")}: {Number(balance).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 mt-2 payment-list">
              <div className="fs-12">{userAddedPayTableData}</div>
            </div>
          </div>
        </div>

        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "70%" }}
          modal={isOpenSubPayment}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <center>
            <p className="fs-18 f-600">{displayModelPaymentType}</p>
          </center>
          <br />
          {insideRadioButtonData}
        </NormalModal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  appointmentDetail: state.appointment.appointmentDetail,
  selected_cstomer: state.common.selected_cstomer,
  tokenDetails: state.authStore.tokenDetails,
  CartPaymentDate: state.appointment.CartPaymentDate,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getPayment,
      getCommonApi,
      createPayment,
      updateForm,
    },
    dispatch
  );
};

export const ChangePayment = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ChangePaymentClass)
);
