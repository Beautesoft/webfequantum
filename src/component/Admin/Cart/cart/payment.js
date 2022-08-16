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
import helpers from "../../../../service/Helper";
import { Toast } from "service/toast";
import { withTranslation } from "react-i18next";
import moment from "moment";
import { Paymentcheckout } from "./paymentgate";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { isMoment } from "moment";
import checkoutIcon from "assets/images/checkoutIcon.png";

const stripePromise = loadStripe("pk_test_GGEOsV78TJcV1OcvWcaH6lnz");

export class MakePaymentClass extends Component {
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
    pointData: [],
    accountHeader: [],
    isMakePaymentButtonClicked: "false",
    isTreatmentDoneButton: true,
    itemProductAmount: 0,
    itemServiceAmount: 0,
    itemProductServiceVoucherAmount: 0,
    displayTablePrepaid: [],
    displayTableCreditNote: [],
    displayTableVoucher: [],
    displayTablePoint: [],
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
    pointHeader: [],
    paymentgateway: false,
    paymentCompleted: false,
    cust_id: null,
    cust_stripeid: null,
    imageOnlineModePaymentL: false,
    payTableValueAndName: {
      target: {
        name: "",
        value: "",
      },
    },
    imgUrl: "",
    paygroupid:""
  };

  componentDidMount() {
    let From = new Date();
    let { MinimumDate, DateofPay } = this.state;
    let firstdayMonth = new Date(
      From.getFullYear(),
      From.getMonth() - 6,
      From.getDate() + 1
    );

    if (
      this.props.CartPaymentDate &&
      this.props.CartPaymentDate["DateofPayment"]
    ) {
      DateofPay = new Date(this.props.CartPaymentDate.DateofPayment);
    } else {
      DateofPay = new Date();
    }
    MinimumDate = firstdayMonth;
    this.setState({
      MinimumDate,
      DateofPay,
    });
    this.getPayment();
    this.getPayGroup();
    this.getFullPayTable();
    this.getPrepaidData();
    this.getCreditNoteAccountData("");
    this.getVoucherData("");
    this.getPointData();
    console.log("cartdata From cart", this.props.cartData);
  }
  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      element: (message) => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };
  // get method for payment detail against appointment
  getPayment = () => {
    let { id, cartId, cartData } = this.props;
    let { cust_id, cust_stripeid } = this.state;
    //id = 82318;
    //cartId = "ICMD100226";
    //cartData={"status":200,"message":"Listed Succesfully","error":false,"data":[{"id":57500,"cust_noid":82318,"customer":"test17011","customercode":"021427HQ","cart_id":"ICHQ100234","cart_date":"2021-03-14","cart_status":"Inprogress","lineno":1,"check":"New","itemcodeid":10067,"itemdesc":"Short - Chin Length(Before Shoulder) 128","quantity":1,"price":"128.00","total_price":"128.00","sitecodeid":31,"sitecode_name":"HQ OFFICE (DEMO)","sitecode":"HQ","discount":"0.00","discount_amt":0,"discount_price":"128.00","additional_discount":0,"additional_discountamt":0,"deposit":"128.00","trans_amt":"128.00","tax":0,"itemstatus":null,"ratio":"100.000000000000000","helper_name":null,"done_sessions":null,"type":"Deposit","treatment_account":null,"treatment":null,"deposit_account":null,"prepaid_account":null,"item_uom":null,"recorddetail":"Service","itemtype":"SINGLE","item_class":"HERBAL TREATMENT","sales_staff":"SEQ ADMIN","service_staff":"","total_disc":"0.00","treatment_name":"Short - Chin Length(Before Shoulder) 128  (1)","item_name":"Short - Chin Length(Before Shoulder) 128"}],"subtotal":"128.00","discount":"0.00","trans_amt":"128.00","deposit_amt":"128.00","billable_amount":"128.00"}
    if (id) {
      this.props
        .getPayment(
          `?cart_date=${dateFormat(
            new Date(),
            "yyyy-mm-dd"
          )}&cust_noid=${id}&cart_id=${cartId}`
        )
        .then((res) => {
          console.log("Payment Details:", res);
          console.log(res.data.cust_noid);
          cust_id = res.data.cust_noid;
          cust_stripeid = res.data.cust_stripeid;
          this.setState({ cust_id, cust_stripeid });
          let { data, status, prepaid_data } = res;
          if (status === 200) {
            this.setState({
              responseData: data,
              balance: Number(data.billable_amount),
              txtUserPayAmount: Number(data.billable_amount),
              prepaid_data: prepaid_data.prepaid,
              product_only: prepaid_data.product_only,
              service_only: prepaid_data.service_only,
              all_only: prepaid_data.all_only,
              is_paymentdate: data.is_paymentdate,
            });
          }
        });
    }

    //let {cartData} = this.props;
    let stringifiedCartData = cartData.data;

    let {
      itemProductAmount,
      itemServiceAmount,
      itemProductServiceVoucherAmount,
    } = this.state;
    if (stringifiedCartData) {
      stringifiedCartData.map((item) => {
        //alert(JSON.stringify(item));
        if (item.recorddetail === "Product") {
          itemProductAmount += parseFloat(item.total_price);
        }
        if (item.recorddetail === "Service") {
          itemServiceAmount += parseFloat(item.total_price);
          console.log(itemServiceAmount);
          console.log(item.total_price);
        }
        if (
          item.recorddetail === "Product" ||
          item.recorddetail === "Service" ||
          item.recorddetail === "Voucher"
        ) {
          itemProductServiceVoucherAmount += parseFloat(item.total_price);
        }
      });
    }
    this.setState({
      itemProductAmount,
      itemServiceAmount,
      itemProductServiceVoucherAmount,
    });
  };
  // set data to dropdown fields
  getDataFromResponses = (data) => {
    let { cardOption, premisesOption } = this.state;
    for (let key of data.CARD) {
      cardOption.push({ label: key.pay_description, value: key.id });
    }
    for (let key of data.CASH) {
      premisesOption.push({ label: key.pay_description, value: key.id });
    }
    this.setState({
      cardOption,
      premisesOption,
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
  getVoucherData = (api) => {
    this.props
      .getCommonApi(`voucher/?cust_id=${this.props.id}${api}`)
      .then((key) => {
        let { data } = key;
        let { voucherCustomerData } = this.state;
        voucherCustomerData = data;
        console.log("voucherCustomerData", data);
        // accountHeader = header_data;
        this.setState({ voucherCustomerData }, () => {
          console.log("test");
          this.HideVoucherTableData();
        });
      });
  };

  getPrepaidData = () => {
    this.getPrepaidAccountData("");
  };
  getPrepaidAccountData = (api) => {
    console.log("dd");

    this.props
      .getCommonApi(`prepaidacclist/?cust_id=${this.props.id}${api}`)
      .then((key) => {
        let { data } = key;
        let { prepaidCustomerData } = this.state;
        //prepaidCustomerData = data;
        prepaidCustomerData = [];
        console.log("prepaidCustomerData", data);
        for (let item of data) {
          let itemData = {};
          itemData["conditiontype1"] = item.conditiontype1;
          itemData["cust_code"] = item.cust_code;
          itemData["all"] = item.all;
          itemData["exp_status"] = item.exp_status;
          itemData["exp_date"] = item.exp_date;
          itemData["last_update"] = item.last_update;
          itemData["line_no"] = item.line_no;
          itemData["id"] = item.id;
          itemData["pp_amt"] = item.pp_amt;
          itemData["pp_bonus"] = item.pp_bonus;
          itemData["outstanding"] = item.outstanding;
          itemData["pp_no"] = item.pp_no;
          itemData["pp_total"] = item.pp_total;
          itemData["prepaid"] = item.prepaid;
          itemData["product"] = item.product;
          itemData["remain"] = item.remain;
          itemData["sa_date"] = item.sa_date;
          itemData["service"] = item.service;
          itemData["topup_amt"] = item.topup_amt;
          itemData["type"] = item.type;
          itemData["use_amt"] = item.use_amt;
          itemData["pp_desc"] = item.pp_desc;

          if (item.conditiontype1 === "Service Only") {
            if (Number(this.state.service_only) > Number(item.remain)) {
              itemData["Finaluse_amt"] = item.remain;
            } else {
              itemData["Finaluse_amt"] = this.state.service_only;
            }
          }
          if (item.conditiontype1 === "Product Only") {
            if (Number(this.state.product_only) > Number(item.remain)) {
              itemData["Finaluse_amt"] = item.remain;
            } else {
              itemData["Finaluse_amt"] = this.state.product_only;
            }
          }
          if (item.conditiontype1 === "All") {
            let finalamount = Number(this.state.all_only);
            if (this.state.prepaid_data) {
              this.state.prepaid_data
                .filter((dataitem) => dataitem.prepaid_id == item.id)
                .map((filteritem) => {
                  finalamount =
                    Number(this.state.all_only) - Number(filteritem.deposit);
                });
            }

            if (Number(finalamount) > Number(item.remain)) {
              itemData["Finaluse_amt"] = Number(item.remain).toFixed(2);
            } else {
              itemData["Finaluse_amt"] = Number(finalamount).toFixed(2);
            }
          }

          prepaidCustomerData.push(itemData);
        }
        this.setState({ prepaidCustomerData }, () => {
          this.HidePrepaidTableData();
        });
      });

    // accountHeader = header_data;
  };
  getCreditNoteAccountData = (api) => {
    debugger;
    this.props
      .getCommonApi(`creditnotelist/?cust_id=${this.props.id}${api}`)
      .then((key) => {
        let { data } = key;
        debugger;
        let { creditNoteCustomerData } = this.state;
        creditNoteCustomerData = data;
        this.setState({ creditNoteCustomerData }, () => {
          this.HideCreditNoteTableData();
        });
      });
  };

  getPointData = () => {
    let { txtUserPayAmount, pointHeader } = this.state;
    this.props
      .getCommonApi(
        `customerpoints/?cust_noid=${this.props.id}&enter_pointamt=${txtUserPayAmount}`
      )
      .then((key) => {
        console.log(key, "pointdataget");
        let { data, header_data } = key;
        let { pointData } = this.state;
        pointData = data;
        pointHeader = header_data;
        this.setState({ pointData, pointHeader }, () => {
          this.HidePointTableData();
        });
      });
  };

  HidePointTableData = () => {
    let { pointData, displayTablePoint } = this.state;
    displayTablePoint.map((item) => {
      var selectedPoint = pointData.filter((point) => point.id != item);
      this.setState({ pointData: selectedPoint });
    });
  };
  getPayGroup = () => {
    this.props.getCommonApi(`paygroup/`).then((res) => {
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
    this.props.getCommonApi(`paytablenew/`).then((res) => {
      console.log(res, "paytablefulldata");
      let { paytableFullData } = this.state;
      paytableFullData = res.data;
      this.setState({
        paytableFullData,
      });
    });
  };

  getPayTableNameBasedOnId = (payTableId) => {
    // gt_group: "GT1"
    // id: 6
    // pay_code: "UOBPN"
    // pay_description: "UOB PAYNOW"
    // pay_group_name: "UOB"
    // pay_groupid: 22
    let { paytableFullData } = this.state;
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
    const test = paytableFullData.filter((res) => res.id == payTableId);
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
    });
    balance = parseFloat(balance - txtUserPayAmount).toFixed(2);
    txtUserPayAmount = balance;
    this.setState({ txtUserPayAmount, balance, isOpenSubPayment });
  };
  handleChangePayTableDropDownValue = ({ target: { value, name } }) => {
    this.props.getCommonApi(`paytablenew/?paygroupid=${this.state.paygroupid}`).then((res) => {
      console.log(res);

      if (res.status == 200) {
        const obj = res.data.filter((item) => item.id == value);
        console.log(obj);
        if (obj[0].qr_code == null) {
          this.setState({ imgUrl: "" });
          this.setState({ imageOnlineModePaymentL: false });
          alert("No Qr Code to Show");
        } else {
          this.setState({ imgUrl: obj[0].qr_code });
        }
      }
    });
    this.setState({ imageOnlineModePaymentL: true });
    let formFields = Object.assign({}, this.state.formFields);

    formFields[name] = value;
    this.setState({
      formFields,
    });
    this.setState({
      payTableValueAndName: {
        target: {
          name: name,
          value: value,
        },
      },
    });
    console.log("name", name, " value", value);
  };
  handleContinueQr = ({ target: { value, name } }) => {
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
    });
    balance = parseFloat(balance - txtUserPayAmount).toFixed(2);
    txtUserPayAmount = balance;
    this.setState({ txtUserPayAmount, balance, isOpenSubPayment });
    this.setState({
      payTableValueAndName: {
        target: {
          name: "",
          value: "",
        },
      },
    });
  };
  handleCreditChange = ({ target: { value, name } }) => {
    let cardField = Object.assign({}, this.state.cardField);

    cardField[name] = value;
    this.setState({
      cardField,
    });
  };
  handleTreatmentDone = () => {
    let { selectedCards, DateofPay } = this.state;
    selectedCards.push({
      pay_typeid: 2,
      pay_amt: 0,
      credit_debit: false,
      pay_premise: true,
      prepaid: false,
      pay_rem4: this.state.pay_rem4,
    });
    let data = selectedCards;

    let { id, cartId } = this.props;
    this.props
      .createPayment(
        `?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${id}&cart_id=${cartId}&pay_date=${dateFormat(
          new Date(DateofPay),
          "yyyy-mm-dd"
        )}`,
        data
      )
      .then((res) => {
        history.push(`/admin/billing/print/bill/${res.data.sa_transacno}`);
      });
  };
  // create payment detail
  handleSubmit = () => {
    let { selectedCards, DateofPay } = this.state;

    let data = selectedCards;
    console.log("SubmitDatapayment", data);
    let { id, cartId } = this.props;
    this.props
      .createPayment(
        `?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${id}&cart_id=${cartId}&pay_date=${dateFormat(
          new Date(DateofPay),
          "yyyy-mm-dd"
        )}`,
        data
      )
      .then((res) => {
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
    return this.state.selectedCards.some((item) => val === item.pay_typeid);
  }
  addCreditCard = (async) => {
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
      });
    }

    balance = parseFloat(balance - userPayAmount).toFixed(2);
    this.setState({ isOpenSubPayment: false });
    this.setBalanceToAllTextBoxes(balance);
  };
  addPoint = (selectedPoint) => {
    let {
      balance,
      txtUserPayAmount,
      isOpenSubPayment,
      selectedCards,
      pay_rem4,
    } = this.state;
    if (txtUserPayAmount == 0) {
      Toast({
        type: "error",
        message: "Point is not allowed",
      });
      return;
    }
    const selectedPointAmount = parseFloat(selectedPoint.useamt);
    let pay_amt_setup = 0;
    if (selectedPointAmount <= parseFloat(txtUserPayAmount)) {
      pay_amt_setup = selectedPointAmount;
    } else {
      pay_amt_setup = txtUserPayAmount;
    }
    // if (selectedPointAmount <= parseFloat(txtUserPayAmount)) {
    //   pay_amt_setup = selectedPointAmount;
    // } else {
    //   Toast({
    //     type: "error",
    //     message: "Partial Amount is not applicable in Point",
    //   });
    //   return;
    // }
    const payTypeId = 25;
    //const payTypeId = 23; //normal twoherbs
    //const payTypeId = 19; //healspa sensuous beauty21 appleskin jybeauty
    //const payTypeId = 7; //skinsoul
    //const payTypeId = 8; //glamour koiskin quantum
    //const payTypeId = 9; //beskin citibella tnc ingenious
    //const payTypeId = 35; //marma

    selectedCards.push({
      pay_typeid: payTypeId,
      pay_amt: parseFloat(pay_amt_setup),
      pay_premise: false,
      prepaid: false,
      credit_debit: false,
      points: true,
      cur_value: selectedPoint.cur_value,
      pay_rem4: pay_rem4,
      pay_rem2: selectedPoint.id,
    });

    console.log("BeforeAdd-displayTableVoucher", this.state.displayTablePoint);
    let setdisplayTablePoint = this.state.displayTablePoint;
    setdisplayTablePoint.push(selectedPoint.id);
    this.setState({ displayTablePoint: setdisplayTablePoint });
    console.log("AfterAdd-displayTablePoint", this.state.displayTablePoint);
    this.HidePointTableData();

    balance = parseFloat(balance - pay_amt_setup).toFixed(2);
    this.setState({ isOpenSubPayment: false });
    this.setBalanceToAllTextBoxes(balance);
  };

  addPrepaid = (selectedPrepaid) => {
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
      // alert("hi");
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
    /*
    if (!this.validator.fieldValid("PrepaidBalanceAmount")) {
      this.validator.showMessageFor("PrepaidBalanceAmount");
      return;
    }
    if (!this.validator.fieldValid("PrepaidBalanceAmount")) {
      this.validator.showMessageFor("PrepaidBalanceAmount");
      return;
    }
*/
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

    //const payTypeId = 23; //normal twoherbs
    //const payTypeId = 19; //healspa sensuous beauty21 appleskin jybeauty
    //const payTypeId = 7; //skinsoul
    //const payTypeId = 8; //glamour koiskin quantum
    const payTypeId = 9; //beskin citibella tnc ingenious
    //const payTypeId = 35; //marma

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
    displayTablePrepaid.map((item) => {
      var selectedPrepaid = prepaidCustomerData.filter(
        (prepaid) => prepaid.id != item
      );
      this.setState({ prepaidCustomerData: selectedPrepaid });
    });
  }
  HideCreditNoteTableData() {
    let { creditNoteCustomerData, displayTableCreditNote } = this.state;

    displayTableCreditNote.map((item) => {
      let selectedCreditNote = creditNoteCustomerData.filter(
        (creditNote) => creditNote.credit_code != item
      );

      console.log(selectedCreditNote, "selectedCreditnote");
      this.setState({ creditNoteCustomerData: selectedCreditNote });
    });
  }
  HideVoucherTableData() {
    let { voucherCustomerData, displayTableVoucher } = this.state;
    displayTableVoucher.map((item) => {
      var selectedVoucher = voucherCustomerData.filter(
        (voucher) => voucher.voucher_no != item
      );
      this.setState({ voucherCustomerData: selectedVoucher });
    });
  }
  addVoucher = (selectedVoucher) => {
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
    //const payTypeId = 9; //normal
    //const payTypeId = 8; //healspa sens beauty21 appleskin marmaclinic jybeauty
    //const payTypeId = 25; //twoherbs koiskin ingenious
    //const payTypeId = 3; //urbanspa
    //const payTypeId = 4; //glamour citibella skinsoul quantum
    const payTypeId = 5; //beskin tnc

    selectedCards.push({
      pay_typeid: payTypeId,
      prepaid: false,
      pay_amt: parseFloat(pay_amt_setup),
      credit_debit: false,
      pay_premise: false,
      pay_rem1: selectedVoucher.voucher_no,
      pay_rem2: selectedVoucher.voucher_no,
      pay_rem4: this.state.pay_rem4,
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
  addCreditNote = (selectedCreditNote) => {
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
    //const payTypeId = 17; //normal
    //const payTypeId = 24; //twoherbs
    //const payTypeId = 12; //healspa sens beauty21 appleskin citibella marma jybeauty
    //const payTypeId = 5; //glamour skinsoul koiskin quantum
    const payTypeId = 6; //beskin tnc ingenious

    selectedCards.push({
      pay_typeid: payTypeId,
      prepaid: false,
      pay_amt: parseFloat(pay_amt_setup),
      credit_debit: false,
      pay_premise: false,
      pay_rem1: selectedCreditNote.credit_code,
      pay_rem2: selectedCreditNote.transaction,
      pay_rem4: this.state.pay_rem4,
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
  removeCards = (idx) => () => {
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
    //if (idx.pay_typeid == 23) { //normal twoherbs
    //if (idx.pay_typeid == 19) { //healspa sens beauty21 appleskin jybeauty
    // if (idx.pay_typeid == 35) { //marmaclinic
    //if (idx.pay_typeid == 7) { //skinsoul
    //if (idx.pay_typeid == 8) { //glamour koiskin quantum
    if (idx.pay_typeid == 9) {
      //beskin citibella tnc ingenious
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
    //if (removedTerm == "23") { //normal twoherbs
    //if (removedTerm == "19") { //healspa sens beauty21 appleskin jybeauty
    //if (removedTerm == "35") { //marma
    //if (removedTerm == "7") { //skinsoul
    //if (removedTerm == "8") { //glamour koiskin quantum
    if (removedTerm == "9") {
      //beskin citibella tnc ingenious
      const items = this.state.displayTablePrepaid;
      console.log("BeforeRemove-displayTablePrepaid", items);
      const valueToRemove = idx.pay_rem2; //For Prepaid Ony we have added unique id here
      console.log("BeforeRemove-valueToRemove", valueToRemove);
      const filteredItems = items.filter((item) => item !== valueToRemove);
      this.setState({ displayTablePrepaid: filteredItems }, () => {
        console.log(
          "AfterRemove-displayTablePrepaid",
          this.state.displayTablePrepaid
        );
      });
      this.getPrepaidAccountData("");
      // this.HidePrepaidTableData();
    }
    //if (removedTerm == "17") { //normal
    //if (removedTerm == "24") { //twoherbs
    //if (removedTerm == "12") { //healspa sens beauty21 appleskin citibella marma jybeauty
    //if (removedTerm == "5") { //glamour skinsoul koiskin quantum
    if (removedTerm == "6") {
      //beskin tnc ingenious
      const items = this.state.displayTableCreditNote;
      console.log("BeforeRemove-displayTableCreditNote", items);
      const valueToRemove = idx.pay_rem1; //For Credit Note Ony we have added unique id here
      console.log("BeforeRemove-valueToRemove", valueToRemove);
      const filteredItems = items.filter((item) => item !== valueToRemove);
      this.setState({ displayTableCreditNote: filteredItems }, () => {
        console.log(
          "AfterRemove-displayTableCreditNote",
          this.state.displayTableCreditNote
        );
      });
      this.getCreditNoteAccountData("");
      // this.HidePrepaidTableData();
    }

    //if (removedTerm == "9") { //normal
    //if (removedTerm == "25") { //twoherbs koiskin ingenious
    //if (removedTerm == "8") { //healspa sens beauty21 appleskin marma jybeauty
    //if (removedTerm == "4") { //glamour citibella skinsoul quantum
    if (removedTerm == "5") {
      //beskin tnc
      const items = this.state.displayTableVoucher;
      console.log("BeforeRemove-displayTableVoucher", items);
      const valueToRemove = idx.pay_rem1; //For Credit Note Ony we have added unique id here
      console.log("BeforeRemove-valueToRemove", valueToRemove);
      const filteredItems = items.filter((item) => item !== valueToRemove);
      this.setState({ displayTableVoucher: filteredItems }, () => {
        console.log(
          "AfterRemove-displayTableVoucher",
          this.state.displayTableVoucher
        );
      });
      this.getVoucherData("");
    }

    if (removedTerm == "25") {
      const items = this.state.displayTablePoint;
      console.log("BeforeRemove-displayTablePoint", items);
      const valueToRemove = idx.pay_rem2; //For Prepaid Ony we have added unique id here
      console.log("BeforeRemove-valueToRemove", valueToRemove);
      const filteredItems = items.filter((item) => item !== valueToRemove);
      this.setState({ displayTablePoint: filteredItems }, () => {
        console.log(
          "AfterRemove-displayTablePoint",
          this.state.displayTablePoint
        );
      });
      this.getPointData();
      // this.HidePrepaidTableData();
    }
    cardField["pay_amt"] = balance;
    ewalletField["pay_amt"] = balance;
    this.setBalanceToAllTextBoxes(balance);
  };
  checkTypeOfCartItemContainsDeposit(cartData) {
    let stringifiedCartData = cartData.data;
    if (stringifiedCartData) {
      stringifiedCartData.map((item) => {
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
    this.setState({
      isSelectedPaymentType: selPayTypeName.trim(),
    });
    this.setState({paygroupid:selPayTypeId})
    this.props
      .getCommonApi(`paytablenew/?paygroupid=${selPayTypeId}`)
      .then((res) => {
        this.setState({
          paytableData: [],
        });
        let { paytableData, isSelectedPaymentType, displayModelPaymentType } =
          this.state;
        isSelectedPaymentType = selPayTypeName.trim().toUpperCase();
        displayModelPaymentType = selPayTypeName.trim().toUpperCase();
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
            } else if (selPayTypeName.trim().toUpperCase() === "VOUCHER") {
              isOpenSubPayment = true;
            } else if (selPayTypeName.trim().toUpperCase() === "POINT") {
              isOpenSubPayment = true;
            } else if (selPayTypeName.trim().toUpperCase() === "PREPAID") {
              isOpenSubPayment = true;
            } else if (selPayTypeName.trim().toUpperCase() === "CREDIT") {
              isOpenSubPayment = true;
            } else if (selPayTypeName.trim().toUpperCase() === "CARD") {
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

                return;
              } else {
                selectedCards.push({
                  pay_typeid: payTypeId,
                  pay_amt: parseFloat(txtUserPayAmount),
                  credit_debit: false,
                  pay_premise: true,
                  prepaid: false,
                  pay_rem4: this.state.pay_rem4,
                });
                balance = parseFloat(balance - txtUserPayAmount).toFixed(2);
                txtUserPayAmount = balance;
                this.setState({ txtUserPayAmount, balance });
                return;
              }
            } else if (paytableData.length >= 1) {
              isOpenSubPayment = true;
              isSelectedPaymentType = "Multiple";
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

  handlepaymentgateway = async () => {
    let { paymentgateway, txtUserPayAmount } = this.state;
    if (txtUserPayAmount !== "0") {
      paymentgateway = !paymentgateway;
    } else {
      Toast({
        type: "error",
        message: "Amount must be greater than 0",
      });
    }
    await this.setState({
      paymentgateway,
    });
    console.log(paymentgateway, txtUserPayAmount);
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

  handleCallback = (childData) => {
    console.log(childData);
    this.setState({ paymentCompleted: childData });
  };

  successfullpayment = () => {
    return (
      <div className="success-msg">
        <svg
          width="4em"
          height="4em"
          viewBox="0 0 16 16"
          className="bi bi-check2 right"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
          />
        </svg>
        <div className="title">Payment Successful</div>
      </div>
    );
  };
  render() {
    let {
      responseData,
      balance,
      isTreatmentDoneButton,
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
      paymentgateway,
      paymentCompleted,
      pointHeader,
      cust_id,
      cust_stripeid,
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
    } else if (String(isSelectedPaymentType).toUpperCase() == "POINT") {
      console.log(this.state.pointHeader, "pointHeaderdata");
      insideRadioButtonData = (
        <div>
          <div className="d-flex flex-wrap py-1 mb-2">
            <div className="col-md-4 col-12">
              <label className="fw-600">{t("Customer Class")}</label>
              <div className="input-group">
                <label>{this.state.pointHeader.customer_class}</label>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <label className="fw-600">
                {t("Customer's Available Points")}
              </label>
              <div className="input-group">
                <label>{this.state.pointHeader.cust_point_value}</label>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <label className="fw-600">{t("Entered Points")}</label>
              <div className="input-group">
                <label>{this.state.pointHeader.enter_pointamt}</label>
              </div>
            </div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <td>{t("Currency Value")}</td>
                <td>{t("Point Value")}</td>
                {/* <td>{t("Use Amount")}</td> */}
                <td>{t("Division")}</td>
                <td>{t("Department")}</td>
                <td>{t("Brand")}</td>
              </tr>
            </thead>
            <tbody>
              {this.state.pointData.map((selectedPoint, index) => (
                <tr
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={this.addPoint.bind(this, selectedPoint)}
                >
                  {console.log(selectedPoint, "pointdatalog")}
                  <td>{selectedPoint.cur_value}</td>
                  <td>{selectedPoint.point_value}</td>
                  {/* <td>{selectedPoint.useamt}</td> */}
                  <td>{selectedPoint.item_divids_desc}</td>
                  <td>{selectedPoint.dept_ids_desc}</td>
                  <td>{selectedPoint.brand_ids_desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (isSelectedPaymentType.toUpperCase() == "CREDIT") {
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
            {/* <div className="col-2">
              <div className="input-group">
                <NormalButton
                  mainbg={true}
                  className="col-12 mt-4 ml-2"
                  label="CANCEL"
                  onClick={() => this.setState({ isOpenSubPayment: false })}
                />
              </div>
            </div> */}
          </div>
        </div>
      );
    } else if (isSelectedPaymentType == "Multiple") {
      insideRadioButtonData = (
        <div>
          <div className="row" style={{ height: "300px" }}>
            <div className="col-5">
              <div className="input-group">
                <Label className="col-12 fs-15">{t("Choose Option")}</Label>
                <NormalSelect
                  placeholder="Search type..."
                  options={paytableData}
                  value={payTableDropDownValue}
                  name="payTableDropDownValue"
                  onChange={this.handleChangePayTableDropDownValue}
                />
              </div>
            </div>
            <div className="col-7">
              {this.state.imageOnlineModePaymentL ? (
                <div
                  className="border w-50 h-50 d-flex justify-content-center align-items-center"
                  style={{ margin: "auto", marginTop: "10%" }}
                >
                  <img
                    src={this.state.imgUrl}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
              ) : (
                <div
                  className="border w-50 h-50 d-flex justify-content-center align-items-center"
                  style={{ margin: "auto", marginTop: "10%" }}
                >
                  <h3 className="text-center">QR Code </h3>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4 col-12 p-1 mx-auto">
            <NormalButton
              mainbg={false}
              className="col-12 submit-btn"
              label="Continue"
              // leftIcon={checkoutIcon}
              onClick={() =>
                this.handleContinueQr({
                  target: {
                    value: this.state.payTableValueAndName.target.value,
                    name: this.state.payTableValueAndName.target.name,
                  },
                })
              }
            />
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
    this.checkTypeOfCartItemContainsDeposit(cartData);

    let userAddedPayTableData = (
      <table className="table table-bordered">
        <tbody>
          {" "}
          {this.state.selectedCards.map((selectedCards, index) => (
            <tr key={index}>
              <td className="fs-18">
                {this.getPayTableNameBasedOnId(selectedCards.pay_typeid)}
              </td>
              <td className="fs-18" style={{ textAlign: "right" }}>
                {selectedCards.pay_amt.toFixed(2)}
              </td>
              <td>
                <div
                  className="col-4 p-0 fs-20 cursor-pointer"
                  onClick={this.removeCards(selectedCards)}
                >
                  <span className="icon-delete"></span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
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
              {isTreatmentDoneButton ? (
                <div className="make-payment mt-3 mr-2 text-center">
                  <NormalButton
                    mainbg={true}
                    className="col-12 fs-15"
                    label="TREATMENT DONE"
                    onClick={() => this.handleTreatmentDone()}
                  />
                </div>
              ) : null}
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

        <div className="d-flex ">
          <div className="col-3">
            <h5>{t("Select Payment Method")}</h5>
          </div>

          {this.props.tokenDetails.paymentgateway == true ? (
            <div className="col-3">
              <NormalButton
                mainbg={true}
                className="col-12"
                label="payment Gateway"
                onClick={this.handlepaymentgateway}
              />
            </div>
          ) : null}
        </div>

        <div className="row paymentGroup">
          <div className="col-md-6">
            <div className="d-flex flex-wrap">{payGroupDataContent}</div>
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
            {/* <div className="d-flex justify-content-around">
              {isTreatmentDoneButton ? (
                <div className="make-payment mt-3 text-center">
                  <NormalButton
                    mainbg={true}
                    className="col-12 fs-15 "
                    label="TREATMENT DONE"
                    onClick={() => this.handleTreatmentDone()}
                  />
                </div>
              ) : null}
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
            </div> */}
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

        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "30%" }}
          modal={paymentgateway}
          handleModal={this.handlepaymentgateway}
        >
          <img
            onClick={this.handlepaymentgateway}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          {paymentCompleted ? (
            this.successfullpayment()
          ) : (
            <React.Fragment>
              <div className="col-md-12 order-md-1">
                <Elements stripe={stripePromise}>
                  <Paymentcheckout
                    amount={balance}
                    parentCallback={this.handleCallback}
                    cartId={cartId}
                    cust_id={cust_id}
                    cust_stripeid={cust_stripeid}
                    //   token={this.props.tokenDetails}
                  />
                </Elements>
              </div>
            </React.Fragment>
          )}
        </NormalModal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  appointmentDetail: state.appointment.appointmentDetail,
  selected_cstomer: state.common.selected_cstomer,
  tokenDetails: state.authStore.tokenDetails,
  CartPaymentDate: state.appointment.CartPaymentDate,
});

const mapDispatchToProps = (dispatch) => {
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

export const Payment = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(MakePaymentClass)
);
