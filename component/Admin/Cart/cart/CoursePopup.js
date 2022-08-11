import React, { Component } from "react";
import {
  NormalInput,
  NormalButton,
  TableWrapper,
  NormalTextarea,
  NormalSelect,
  NormalCheckbox,
  NormalModal,
} from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonPatchApi,
  commonCreateApi,
  commonUpdateApi,
} from "redux/actions/common";
import "./style.scss";
import { Toast } from "service/toast";
import closeIcon from "assets/images/close.png";
import { CourseTreatmentDone } from "./coursetreatmentDone";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import { StaffSelectionPopup } from "./staffSelectionPopup";
import { CredentialConfirmation } from "../credentialConfirmation";

export class CoursePopupClass extends Component {
  state = {
    headerDetails: [
      { label: "No.", divClass: "justify-content-end text-right" },
      { label: "Program" },
      { label: "Next appt", divClass: "justify-content-end text-right" },
      { label: "Amount", divClass: "justify-content-end text-right" },
    ],
    data_list: {
      deposit: "",
      discount: "",
      discount_amt: "",
      discount_price: "",
      free_sessions: null,
      id: null,
      itemdesc: "",
      price: "",
      quantity: null,
      tmp_treatment: [],
      total_price: "",
      trans_amt: "",
      treatment_no: null,
      outstanding: null,
      disc_reason: "182",
      discreason_txt: "",
      autoProportion: false,
      Sessions: "",
    },
    discount_reason_options: [],
    is_percentage: "1",
    discount_reasons: [],
    is_total: false,
    discount_price_txt: "",
    discType: [
      { value: 1, label: "%" },
      { value: 2, label: "$" },
    ],
    TD_List: [],
    isOpenTreatmentDone: false,
    cartId: null,
    item: {},
    summaryFlag: false,
    sessionStaff: [],
    TempSave: false,
    isOpenStaffSelectionDetail: false,
    settingData: {},
    isHandleConfirmationDialog: false,
    isLoginConfirmation: false,
    user: "",
    pass: "",
  };

  componentDidMount = () => {
    this.getDiscountReasons();
    this.setState({
      item: this.props.itemData,
    });
    this.getCourseList();
    this.handleItemSettings();
  };

  handleItemSettings = () => {
    let { settingData } = this.state;
    this.props.getCommonApi(`userlist/`).then(key => {
      let { status, data } = key;
      console.log(key, "settingsData salesstaff");
      if (status === 200) {
        settingData = data;
        this.setState({ settingData });
      }
    });
  };

  getCourseList = () => {
    let { data_list, discount_reasons, is_total, sessionStaff, TempSave } =
      this.state;
    this.props
      .getCommonApi(`cartservicecourse/${this.props.cartId}/`)
      .then(async key => {
        let { status, data } = key;
        console.log(data, "cartcoursepopup");
        if (status == "200") {
          if (data) {
            data_list["deposit"] = data.deposit ? data.deposit : 0;
            data_list["discount"] = 0;
            data_list["discount_amt"] = 0;
            data_list["discount_price"] = data.discount_price;
            data_list["free_sessions"] = data.free_sessions;
            data_list["id"] = data.id;
            data_list["itemdesc"] = data.itemdesc;
            data_list["price"] = data.price;
            data_list["quantity"] = data.quantity;
            data_list["tmp_treatment"] = data.tmp_treatment;
            data_list["autoProportion"] = false;
            data_list["total_price"] = data.total_price;
            data_list["trans_amt"] = data.trans_amt;
            data_list["treatment_no"] =
              Number(data.quantity) == 1
                ? 1
                : data.free_sessions == 0
                ? data.quantity
                : data.treatment_no;
            data_list["outstanding"] = Number(
              data.trans_amt - data.deposit
            ).toFixed(2);
            data_list["is_done"] = data.is_done;
            if (
              data.sessiondone == "" ||
              Number(data.sessiondone) == 0 ||
              data.sessiondone == null ||
              data.sessiondone == undefined
            ) {
              data_list["Sessions"] = 0;
            } else {
              data_list["Sessions"] = data.sessiondone;
            }
            is_total = data.is_total;
            discount_reasons = data.disc_lst;
            sessionStaff = [];
            if (data.tstaff) {
              sessionStaff = data.tstaff;
            }
            //TempSave = data.is_treat;
            await this.setState({
              data_list,
              discount_reasons,
              is_total,
              sessionStaff,
              //TempSave,
            });
            // if (TempSave) {
            //   this.handleReset();
            // }
            // if (
            //   data_list.treatment_no == 1 &&
            //   data_list["tmp_treatment"].length <= 0
            // ) {
            //   this.handleTreatmentCountUpdate();
            // } else
            debugger;
            if (
              data_list.treatment_no == null &&
              data_list["tmp_treatment"].length == 0
            ) {
              this.handleTreatmentnewCountUpdate();
            } else if (
              data_list.treatment_no == 1 &&
              data_list["tmp_treatment"].length == 0
            ) {
              let dataFirstCall = true;
              this.handleTreatmentCountUpdate(dataFirstCall);
            }
          }
        }
      });
  };

  getCourseAfterTreatmentDoneConfirm = () => {
    let { sessionStaff, data_list } = this.state;
    this.props
      .getCommonApi(`cartservicecourse/${this.props.cartId}/`)
      .then(key => {
        let { status, data } = key;
        console.log(data, "cartcoursepopup");
        if (status == "200") {
          if (data) {
            data_list["is_done"] = data.is_done;
            sessionStaff = [];
            sessionStaff = data.tstaff;
            this.setState({
              sessionStaff,
              data_list,
            });
          }
        }
      });
  };

  getCourseAfterTreatmentDoneAction = () => {
    let { sessionStaff, data_list } = this.state;
    this.props
      .getCommonApi(`cartservicecourse/${this.props.cartId}/`)
      .then(key => {
        let { status, data } = key;
        console.log(data, "cartcoursepopup");
        if (status == "200") {
          if (data) {
            data_list["is_done"] = data.is_done;
            if (
              data.sessiondone == "" ||
              Number(data.sessiondone) == 0 ||
              data.sessiondone == null ||
              data.sessiondone == undefined
            ) {
              data_list["Sessions"] = 0;
            } else {
              data_list["Sessions"] = data.sessiondone;
            }
            sessionStaff = [];
            sessionStaff = data.tstaff;
            this.setState({
              sessionStaff,
              data_list,
            });
          }
        }
      });
  };

  getCourseTableList = async () => {
    let { data_list, discount_reasons, discount_price_txt, is_percentage } =
      this.state;
    this.props
      .getCommonApi(`cartservicecourse/${this.props.cartId}/`)
      .then(async key => {
        let { status, data } = key;
        console.log(key, "cartcoursepopupafterdiscount");
        if (status == "200") {
          if (data) {
            data_list["tmp_treatment"] = data.tmp_treatment;
            discount_reasons = data.disc_lst;
            this.setState({ data_list, discount_reasons });
            data_list["discount_price"] = data.discount_price;
            let Total = 0;
            if (
              Number(data_list.treatment_no) === 0 &&
              Number(data_list.free_sessions) === 0
            ) {
              Total = Number(data.discount_price) * Number(data_list.quantity);
            } else {
              Total =
                Number(data.discount_price) * Number(data_list.treatment_no);
            }

            data_list["total_price"] = Number(Total).toFixed(2);
            data_list["trans_amt"] = Number(Total).toFixed(2);
            data_list["deposit"] = Number(Total).toFixed(2);
            data_list["disc_reason"] = "182";
            data_list["discreason_txt"] = "";
            data_list["discount"] = "";
            data_list["discount_amt"] = "";
            data_list["outstanding"] = Number(
              Total - data_list.deposit
            ).toFixed(2);
            discount_price_txt = "";
            is_percentage = "1";
            await this.setState({
              data_list,
              discount_reasons,
              discount_price_txt,
              is_percentage,
            });
          }
        }
      });
  };

  handleProportionChange = async ({ target: { value, name } }) => {
    let { data_list, deposit } = this.state;
    data_list[name] = value;
    let proportion = "";
    if (value) {
      proportion = "True";
    } else {
      proportion = "False";
    }
    let body = {
      cart_id: data_list.id,
      treatment_no: null,
      free_sessions: null,
      total_price: null,
      unit_price: null,
      disc_amount: null,
      disc_percent: null,
      auto_propation: proportion,
    };
    this.props.commonCreateApi(`coursetmp/`, body).then(key => {
      let { status, data } = key;
      console.log(key, "Coursecountupdateresponse");
      if (status == "201" || status == "200") {
        if (data) {
          data_list["tmp_treatment"] = data;
          data_list["outstanding"] = Number(
            data_list.trans_amt - data_list.deposit
          ).toFixed(2);
          this.setState({ data_list });
          this.getCourseAfterTreatmentDoneConfirm();
          return true;
        }
      }
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    let {
      data_list,
      deposit,
      is_percentage,
      discount_price_txt,
      total_price,
      outstanding,
    } = this.state;

    if (name === "discount_price_txt") {
      discount_price_txt = value;
      this.setState({
        discount_price_txt,
      });
    } else if (name == "is_percentage") {
      is_percentage = value;
      this.setState({
        is_percentage,
      });
    } else if (name === "disc_reason") {
      data_list["discreason_txt"] = "";
      data_list["disc_reason"] = value;
      this.setState({
        data_list,
      });
    } else {
      data_list[name] = value;
      await this.setState({
        data_list,
      });
    }
  };
  handleTreatmentnewCountUpdate = () => {
    debugger;
    let { data_list } = this.state;
    let body = {
      cart_id: data_list.id,
      treatment_no: data_list.quantity,
      free_sessions: Number(data_list.free_sessions),
    };
    this.apiCallforNewTreatmentCount(body);
    this.handleNewQuantityCount();
  };

  handleNewQuantityCount = async () => {
    let { data_list } = this.state;
    let count = 0;

    count = Number(data_list.quantity) + Number(data_list.free_sessions);
    if (count > 0) {
      data_list["quantity"] = count;
    } else {
      data_list["quantity"] = 1;
    }
    await this.setState({
      data_list,
    });
  };

  handleTreatmentCountUpdate = async dataFirstCall => {
    let { data_list } = this.state;
    if (data_list.treatment_no && Number(data_list.treatment_no) > 0) {
      let body = {
        cart_id: data_list.id,
        treatment_no: Number(data_list.treatment_no),
        free_sessions: Number(data_list.free_sessions),
      };

      //this.handleTextChangeAPI(body);

      this.apiCallforTreatmentCount(body, dataFirstCall);

      this.handleQuantityCount();
    } else {
      Toast({
        type: "error",
        message: "No.of treatment should not be empty",
      });
    }
  };

  apiCallforNewTreatmentCount = body => {
    let { data_list } = this.state;
    this.props.commonCreateApi(`coursetmp/`, body).then(async key => {
      let { status, data } = key;
      console.log(key, "Coursecountupdateresponse");
      if (status == "201" || status == "200") {
        if (data) {
          data_list["tmp_treatment"] = data;
          this.setState({ data_list });
          this.getCourseAfterTreatmentDoneAction();
          let Amount = Number(
            data_list.discount_price * data_list.quantity
          ).toFixed(2);
          data_list["deposit"] = Amount;
          data_list["trans_amt"] = Amount;
          data_list["total_price"] = Amount;
          data_list["outstanding"] = Number(
            data_list.trans_amt - Amount
          ).toFixed(2);
          await this.setState({
            data_list,
          });
          //this.getCourseAfterTreatmentDoneAction();
          return true;
        }
      }
    });
  };

  apiCallforTreatmentCount = (body, dataFirstCall) => {
    let { data_list } = this.state;
    this.props.commonCreateApi(`coursetmp/`, body).then(async key => {
      let { status, data } = key;
      console.log(key, "Coursecountupdateresponse");
      if (status == "201" || status == "200") {
        if (data) {
          debugger;
          data_list["tmp_treatment"] = data;
          this.setState({ data_list });
          this.getCourseAfterTreatmentDoneAction();
          let Amount = Number(
            data_list.discount_price * data_list.treatment_no
          ).toFixed(2);
          if (!dataFirstCall) {
            data_list["deposit"] = Amount;
          }
          data_list["trans_amt"] = Amount;
          data_list["total_price"] = Amount;

          await this.setState({
            data_list,
          });
          //this.getCourseAfterTreatmentDoneAction();
          this.handleOutstanding();
          return true;
        }
      }
    });
  };

  handleOutstanding = async () => {
    let { data_list } = this.state;
    data_list["outstanding"] = Number(
      data_list.trans_amt - data_list.deposit
    ).toFixed(2);
    await this.setState({
      data_list,
    });
  };

  handleTotalPriceChange = () => {
    let { data_list, is_total } = this.state;
    if (data_list.treatment_no !== "" || Number(data_list.treatment_no) > 0) {
      if (data_list.trans_amt && Number(data_list.trans_amt) > 0) {
        let body = {
          cart_id: data_list.id,
          treatment_no: null,
          free_sessions: null,
          total_price: data_list.trans_amt,
          unit_price: null,
          disc_amount: null,
          disc_percent: null,
          auto_propation: null,
          auto: data_list.autoProportion,
        };
        // this.handleTextChangeAPI(body);

        this.props.commonCreateApi(`coursetmp/`, body).then(async key => {
          let { status, data } = key;
          console.log(key, "Coursecountupdateresponse");
          if (status == "201" || status == "200") {
            if (data) {
              data_list["tmp_treatment"] = data;
              this.setState({ data_list });
              this.getCourseAfterTreatmentDoneAction();
              let Amount = Number(
                data_list.trans_amt / data_list.treatment_no
              ).toFixed(2);
              data_list["price"] = Amount;
              data_list["total_price"] = data_list.trans_amt;
              data_list["trans_amt"] = data_list.trans_amt;
              data_list["deposit"] = data_list.trans_amt;
              data_list["discount_price"] = data_list.price;
              data_list["discount"] = "";
              data_list["discount_amt"] = "";
              data_list["outstanding"] = Number(
                data_list.trans_amt - data_list.deposit
              ).toFixed(2);
              is_total = true;
              await this.setState({ data_list, is_total });
            }
          }
        });
      }
    } else {
      Toast({
        type: "error",
        message: "Quantity should not be empty",
      });
    }
  };

  // handleTextChangeAPI = body => {
  //   let { data_list } = this.state;
  //   this.props.commonCreateApi(`coursetmp/`, body).then(key => {
  //     let { status, data } = key;
  //     console.log(key, "Coursecountupdateresponse");
  //     if (status == "201" || status == "200") {
  //       if (data) {
  //         data_list["tmp_treatment"] = data;
  //         this.setState({ data_list });
  //         this.getCourseAfterTreatmentDoneAction();
  //         return true;
  //       }
  //     }
  //   });
  // };
  handleReset = () => {
    let { data_list, is_total, discount_reasons, discount_price_txt } =
      this.state;
    let body = {
      cart_id: data_list.id,
    };
    this.props
      .commonCreateApi(`cartservicecourse/reset/`, body)
      .then(async key => {
        let { status, data } = key;
        console.log(key, "resetresponse");
        if (status == "200") {
          data_list.tmp_treatment = [];
          discount_reasons = [];
          data_list["treatment_no"] = "";
          data_list["free_sessions"] = "";
          // data_list["quantity"] = 1;
          // data_list["price"] = Number(data_list["price"])
          // data_list["discount_price"] = Number(data_list["price"]);
          // data_list["trans_amt"] = Number(data_list["price"]);
          // data_list["deposit"] = Number(data_list["price"]);
          // data_list["outstanding"] = Number(
          //   data_list.trans_amt - data_list.deposit
          // ).toFixed(2);
          data_list["autoProportion"] = false;
          discount_price_txt = "";
          is_total = false;
          this.setState({
            data_list,
            is_total,
            discount_reasons,
            discount_price_txt,
          });
          this.getCourseAfterReset();
        }
      });
  };

  getCourseAfterReset = () => {
    let { sessionStaff, data_list } = this.state;
    this.props
      .getCommonApi(`cartservicecourse/${this.props.cartId}/`)
      .then(key => {
        let { status, data } = key;
        console.log(data, "cartcoursepopup");
        if (status == "200") {
          if (data) {
            data_list["price"] = Number(data.price).toFixed(2);
            data_list["discount_price"] = Number(data.price).toFixed(2);
            data_list["quantity"] = Number(data.quantity);
            data_list["total_price"] = Number(data.total_price).toFixed(2);
            data_list["trans_amt"] = Number(data.trans_amt);
            data_list["outstanding"] = Number(
              data.trans_amt - data.deposit
            ).toFixed(2);
            data_list["deposit"] = Number(data.deposit).toFixed(2);
            data_list["is_done"] = data.is_done;
            if (
              data.sessiondone == "" ||
              Number(data.sessiondone) == 0 ||
              data.sessiondone == null ||
              data.sessiondone == undefined
            ) {
              data_list["Sessions"] = 0;
            } else {
              data_list["Sessions"] = data.sessiondone;
            }
            sessionStaff = [];
            sessionStaff = data.tstaff;
            this.setState({
              sessionStaff,
              data_list,
            });
          }
        }
      });
  };

  handleQuantityCount = async () => {
    let { data_list } = this.state;
    let count = 0;

    count = Number(data_list.treatment_no) + Number(data_list.free_sessions);
    if (count > 0) {
      data_list["quantity"] = count;
    } else {
      data_list["quantity"] = 1;
    }
    await this.setState({
      data_list,
    });
  };
  handleSubmit = () => {
    let { data_list } = this.state;
    let discountAmt = null;
    let discount = null;
    if (data_list.discount && Number(data_list.discount) <= 0) {
      discount = 0;
      let discountCal = Number(
        data_list.discount_amt / data_list.treatment_no
      ).toFixed(2);
      discountAmt = discountCal;
    } else {
      let trans = Number(data_list.treatment_no) * Number(data_list.price);
      let discPercnt = Number(
        (trans * Number(data_list.discount)) / 100
      ).toFixed(2);

      let disccalcStage = Number(trans - discPercnt).toFixed(2);
      let disccalStage2 = Number(
        disccalcStage / data_list.treatment_no
      ).toFixed(2);
      let disccalcfinal = Number(data_list.price - disccalStage2);
      discountAmt = disccalcfinal;
      let Singledisc_percnt = Number(discountAmt / 100).toFixed(2);
      discount = Number(Singledisc_percnt * 100).toFixed(2);
    }
    let treatment_no = 0;
    if (data_list.treatment_no > 0) {
      treatment_no = data_list.treatment_no;
    } else {
      treatment_no = 1;
    }

    if (Number(data_list["deposit"]) > Number(data_list["trans_amt"])) {
      Toast({
        type: "error",
        message: "Deposit should be less than or equal to Total price",
      });
      return false;
    } else if (discountAmt > 0 && data_list.disc_reason == "") {
      Toast({
        type: "error",
        message: "discount reason is mandatory for discount apply",
      });
      return false;
    } else {
      let body = {
        cart_id: data_list.id,
        quantity: Number(data_list.quantity),
        price: Number(data_list.price),
        discount_price: Number(data_list.discount_price),
        trans_amt: Number(data_list.trans_amt),
        deposit: Number(data_list.deposit),
        treatment_no: Number(data_list.treatment_no),
        free_sessions: Number(data_list.free_sessions),
        total_price: Number(
          Number(treatment_no) * Number(data_list.price)
        ).toFixed(2),
        sessiondone: data_list.is_done == true ? 0 : Number(data_list.Sessions),
      };
      console.log(body, "Confirm button action input");
      this.props
        .commonPatchApi(`cartservicecourse/${this.props.cartId}/`, body)
        .then(key => {
          let { status, data } = key;
          if (status == "200") {
            this.props.handleModal();
          }
        });
    }
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
  handleApplyDiscount = async () => {
    let { data_list, discount_price_txt, is_percentage } = this.state;

    if (Number(discount_price_txt) > 0) {
      if (Number(is_percentage) == 1) {
        if (data_list.disc_reason && data_list.disc_reason != "") {
          data_list["discount_amt"] = Number(
            (Number(data_list["discount_price"]) / 100) *
              Number(discount_price_txt)
          );

          data_list["discount"] = Number(discount_price_txt);
          await this.setState({ data_list });
        } else {
          Toast({
            type: "error",
            message: "Please select Discount Reason",
          });
          return false;
        }
      } else if (Number(is_percentage) == 2) {
        if (data_list.disc_reason && data_list.disc_reason != "") {
          data_list["discount_amt"] = Number(discount_price_txt);
          data_list["discount"] = null;
          await this.setState({ data_list });
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
      if (Number(data_list.disc_reason) == 182) {
        discreason_text = "others";
      } else {
        discreason_text = "";
      }
      let body = {
        discount: Number(data_list.discount),
        discount_amt: Number(data_list.discount_amt),
        disc_reason: Number(data_list.disc_reason),
        discreason_txt: discreason_text,
      };
      this.props
        .commonUpdateApi(
          `itemcart/${this.props.cartId}/?disc_add=1&disc_reset=0&auto=${
            data_list.autoProportion ? 1 : 0
          }`,
          body
        )
        .then(key => {
          let { status, data } = key;
          console.log(key, "apply discount response");
          if (status == "200" || status == "201") {
            this.getCourseTableList();
            // if (data_list["autoProportion"]) {
            //   this.handleProportiononDiscountChange()
            // }
          }
        });
    } else {
      Toast({
        type: "error",
        message: "Discount should be greater than zero",
      });
      return false;
    }
  };

  handleResetDiscount = async () => {
    let { data_list } = this.state;
    let body = {
      discount: Number(data_list.discount),
      discount_amt: Number(data_list.discount_amt),
      disc_reason: Number(data_list.disc_reason),
      discreason_txt: data_list.discreason_txt,
    };

    this.props
      .commonUpdateApi(
        `itemcart/${this.props.cartId}/?disc_add=0&disc_reset=1&auto=${
          data_list.autoProportion ? 1 : 0
        }`,
        body
      )
      .then(key => {
        console.log(key, "handleresetDiscount");
        this.getCourseTableList();
      });
  };
  handleDepositAmount = () => {
    let { data_list } = this.state;
    let { trans_amt, deposit, outstanding } = data_list;
    data_list["outstanding"] = Number(trans_amt - deposit).toFixed(2);
    this.setState({
      data_list,
    });
  };
  handleDialog = async () => {
    let { isOpenTreatmentDone } = this.state;

    isOpenTreatmentDone = false;

    await this.setState({
      isOpenTreatmentDone,
      editCart: {},
    });
    this.getCourseAfterTreatmentDoneConfirm();
  };

  handleTreatmentDone = async () => {
    let { item, data_list } = this.state;
    let { editCart } = this.state;
    editCart = item;
    if (data_list["Sessions"] == 0 || data_list["Sessions"] == "") {
      data_list["Sessions"] = 1;
    }
    await this.setState({ editCart, data_list });
    this.setState({ isOpenTreatmentDone: true });
  };
  handleSummaryFlag = () => {
    this.setState(prevState => ({
      summaryFlag: !prevState.summaryFlag,
    }));
  };

  handleSessionChange = async event => {
    //event.persist();
    let { data_list } = this.state;
    data_list.treatment_no = event.target.value;
    await this.setState({ data_list });

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.handleSoftReset();
      }, 500);
    }
    this.debouncedFn();
  };
  handleFocChange = async event => {
    //event.persist();
    let { data_list } = this.state;
    data_list.free_sessions = event.target.value;
    await this.setState({ data_list });
    if (!this.debouncedFnFoc) {
      this.debouncedFnFoc = _.debounce(async () => {
        await this.handleSoftReset();
      }, 500);
    }
    this.debouncedFnFoc();
  };
  handleDepositOnChange = async event => {
    //event.persist();
    let { data_list } = this.state;
    data_list.deposit = event.target.value;
    await this.setState({ data_list });
    if (!this.debouncedFnDeposit) {
      this.debouncedFnDeposit = _.debounce(async () => {
        this.handleDepositAmount();
      }, 500);
    }
    this.debouncedFnDeposit();
  };
  handleSoftReset = () => {
    let { data_list, is_total, discount_reasons, discount_price_txt } =
      this.state;
    let body = {
      cart_id: data_list.id,
    };
    this.props
      .commonCreateApi(`cartservicecourse/reset/`, body)
      .then(async key => {
        let { status, data } = key;
        console.log(key, "resetresponse");
        if (status == "200") {
          data_list.tmp_treatment = [];
          discount_reasons = [];
          //data_list["treatment_no"] = "";
          //data_list["free_sessions"] = "";
          // data_list["quantity"] = 1;
          data_list["price"] = Number(data_list["price"]);
          data_list["discount_price"] = Number(data_list["price"]).toFixed(2);
          data_list["trans_amt"] = Number(data_list["price"]);
          data_list["deposit"] = Number(data_list["price"]);
          data_list["outstanding"] = Number(
            data_list.trans_amt - data_list.deposit
          ).toFixed(2);
          data_list["autoProportion"] = false;
          discount_price_txt = "";
          is_total = false;
          this.setState({
            data_list,
            is_total,
            discount_reasons,
            discount_price_txt,
          });
          //this.getCourseAfterReset();
          if (data_list.treatment_no == null) {
            this.handleTreatmentnewCountUpdate();
          } else {
            let dataFirstCall = false;
            this.handleTreatmentCountUpdate(dataFirstCall);
          }
        }
      });
  };

  handleDialogSalesStaff = () => {
    let { isOpenStaffSelectionDetail } = this.state;
    isOpenStaffSelectionDetail = !isOpenStaffSelectionDetail;
    this.setState({
      isOpenStaffSelectionDetail,
    });
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
          this.handleApplyDiscount();
        }
      });
  };

  render() {
    let {
      data_list,
      headerDetails,
      is_percentage,
      discount_reason_options,
      discount_reasons,
      is_total,
      discount_price_txt,
      discType,
      TD_List,
      isOpenTreatmentDone,
      cartId,
      summaryFlag,
      sessionStaff,
      isOpenStaffSelectionDetail,
      editCart,
      settingData,
      isHandleConfirmationDialog,
      isLoginConfirmation,
      user,
      pass,
    } = this.state;
    let {
      deposit,
      discount,
      discount_amt,
      discount_price,
      free_sessions,
      id,
      itemdesc,
      price,
      quantity,
      tmp_treatment,
      total_price,
      trans_amt,
      treatment_no,
      outstanding,
      disc_reason,
      discreason_txt,
      autoProportion,
      Sessions,
      is_done,
    } = data_list;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid mb-4">
          <div className="row pl-3 mb-2">
            <div className="col-md-10 col-12">
              <h4>{t("Course Page")}</h4>
            </div>

            <div className="col-md-2 col-12">
              <NormalButton
                mainbg={false}
                className="col-12 submit-btn"
                label="Done"
                onClick={this.handleSubmit}
              />
            </div>
          </div>

          <div className="row">
            <div className="d-flex flex-wrap w-100 mb-3 p-2">
              <div className="col-md-5 col-12 mb-3 border">
                <div className="row p-0 m-0">
                  <div className="col-md-12 col-12 mb-2">
                    <label className="text-left text-black common-label-text pb-2">
                      {t("Service")} {t("Course")}
                    </label>
                    <div className="input-group">
                      <NormalInput placeholder="" value={itemdesc} disabled />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <label className="text-left text-black common-label-text  pb-2">
                      {t("QTY")}
                    </label>
                    <div className="input-group">
                      <NormalInput
                        placeholder=""
                        value={
                          treatment_no === null
                            ? quantity
                            : treatment_no
                            ? treatment_no
                            : "1"
                        }
                        type="number"
                        name="treatment_no"
                        onChange={e => this.handleSessionChange(e)}
                        // onBlur={this.handleQuantityCount}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <label className="text-left text-black common-label-text  pb-2">
                      {t("FOC")}
                    </label>
                    <div className="input-group">
                      <NormalInput
                        placeholder=""
                        value={free_sessions ? free_sessions : ""}
                        type="number"
                        name="free_sessions"
                        onChange={e => this.handleFocChange(e)}
                        //onChange={this.handleChange}
                        // onBlur={this.handleQuantityCount}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-12 align-self-end">
                    <div className="d-flex flex-row justify-content-around">
                      <div className="mr-1">
                        <NormalButton
                          className={"col-12 btn-outline-success applybtn"}
                          applybg={true}
                          label="Apply"
                          onClick={() => this.handleTreatmentCountUpdate(false)}
                        />
                      </div>

                      <div className="">
                        <NormalButton
                          resetbg={true}
                          className={"col-12 btn-outline-danger resetbtn"}
                          label="Reset"
                          onClick={this.handleReset}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row p-0 m-0">
                  <div className="row p-3">
                    <div className="col-md-4 col-12">
                      <label className="text-left text-black common-label-text pb-2">
                        {t("Total")} {t("QTY")}
                      </label>
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={quantity ? quantity : ""}
                          type="number"
                          name="quantity"
                          onChange={() => {}}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12 mb-2">
                      <label className="text-left text-black common-label-text pb-2">
                        {t("Unit Price")}
                      </label>
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={price}
                          type="number"
                          name="price"
                          onChange={this.handleChange}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                    <div className="col-md-4 col-12 mb-2 text-right workstaff-background">
                      <label className="text-black common-label-text pb-1">
                        {t("Disc.")} {t("Price")}
                      </label>
                    </div>
                    <div className="col-md-4 col-12 mb-2 workstaff-background">
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={discount_price}
                          name="discount_price"
                          onChange={() => {}}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-2 workstaff-background"></div>
                    <div className="col-md-4 col-12 mb-2 text-right">
                      <label className="text-right text-black common-label-text pb-1">
                        {t("Total")} {t("Price")}
                      </label>
                    </div>
                    <div className="col-md-4 col-12  mb-2">
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={trans_amt}
                          name="trans_amt"
                          type="number"
                          onChange={this.handleChange}
                          disabled={
                            discount_reasons.length > 0 || !is_done
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      {(discount_reasons && discount_reasons.length > 0) ||
                      !is_done ? null : (
                        <div className="d-flex">
                          <NormalButton
                            buttonClass={"col-12"}
                            styleTwo={true}
                            label="Change"
                            onClick={this.handleTotalPriceChange}
                            disabled={
                              tmp_treatment && tmp_treatment.length > 0
                                ? false
                                : true
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-md-4  mb-2"></div>
                    <div className="col-md-4 d-flex justify-content-center align-self-end  mb-2">
                      <NormalCheckbox
                        name="autoProportion"
                        label="Auto Proportion"
                        checked={autoProportion}
                        value={autoProportion}
                        onChange={e => this.handleProportionChange(e)}
                        disabled={
                          tmp_treatment && tmp_treatment.length > 0
                            ? false
                            : true
                        }
                      />
                    </div>
                    <div className="col-md-4 mb-2"></div>
                    <div className="col-md-4 col-12 mb-2 text-right">
                      <label className="text-black common-label-text">
                        {t("Deposit")}
                      </label>
                    </div>
                    <div className="col-md-4 col-12 pb-1 pt-1 mb-2">
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={deposit}
                          type="number"
                          name="deposit"
                          onChange={e => this.handleDepositOnChange(e)}
                          //onBlur={this.handleDepositAmount}
                          // disabled={
                          //   tmp_treatment.length < 1 || !is_done ? true : false
                          // }
                          disabled={!is_done ? true : false}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-2"></div>
                    <div className="col-md-4 col-12 mb-2 text-right">
                      <label className=" text-black common-label-text">
                        {t("Outstanding")}
                      </label>
                    </div>
                    <div className="col-md-4 col-12 pb-1 pt-1 mb-2">
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={outstanding ? outstanding : ""}
                          type="number"
                          name="outstanding"
                          onChange={() => {}}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-2"></div>
                  </div>
                </div>
              </div>
              <div className="col-md-7 col-12 mb-3 ">
                <div className="p-2 border">
                  <div className="d-flex flex-wrap mb-2">
                    <div className="col-md-2 col-12">
                      <label className="text-left text-black common-label-text pb-2">
                        {t("Session")}
                      </label>
                    </div>
                    <div className="col-md-2 col-12">
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={Sessions}
                          type="number"
                          name="Sessions"
                          onChange={this.handleChange}
                          disabled={is_done ? false : true}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-12">
                      <NormalButton
                        mainbgrev={true}
                        label="TD"
                        onClick={this.handleTreatmentDone}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-wrap mb-2 mt-2">
                    <div className="col-md-8 justify-content-start col-12 mt-2">
                      <label className="fw-500">{t("TD Staff List")}</label>
                    </div>

                    <div className="col-md-4 col-12 justify-content-end">
                      {(Number(this.props.tokenDetails.role_code) == 1 ||
                        Number(this.props.tokenDetails.role_code) == 2) &&
                      settingData.showCourseChangeStaff ? (
                        <NormalButton
                          label="Sales Staff"
                          mainbgrev={true}
                          onClick={this.handleDialogSalesStaff}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="col-6">
                      <label className="text-left text-black common-label-text pb-2 fw-500">
                        {t("Staff")}
                      </label>
                    </div>
                    <div className="col-2 text-center">
                      <label className="text-black common-label-text pb-2 fw-500">
                        {t("Session")}
                      </label>
                    </div>
                    <div className="col-2 text-center">
                      <label className="text-black common-label-text pb-2 fw-500">
                        {t(`WP`)}
                      </label>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap">
                    <div className="col-md-12 w-100 bg-light p-3 border">
                      {sessionStaff &&
                        sessionStaff.length > 0 &&
                        sessionStaff.map((item, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="col-6 text-left ">
                                <label className="text-black common-label-text pb-2">
                                  {item.name}
                                </label>
                              </div>
                              <div className="col-2 text-right">
                                <label className="text-black common-label-text pb-2">
                                  {Number(item.session).toFixed(2)}
                                </label>
                              </div>
                              <div className="col-2 text-right">
                                <label className="align-self-end text-right text-black common-label-text pb-2">
                                  {Number(item.wp1).toFixed(2)}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      {!sessionStaff || sessionStaff.length <= 0 ? (
                        <div className="col-12">{t("No record found")}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="p-2 mt-3 border workstaff-background">
                  <div className="d-flex flex-wrap mb-2">
                    <div className="col-md-2 col-12">
                      <label className="text-left text-black common-label-text pb-1">
                        {t("Discount")}
                      </label>
                      <div className="input-group">
                        <NormalInput
                          placeholder=""
                          value={discount_price_txt}
                          type="number"
                          name="discount_price_txt"
                          onChange={this.handleChange}
                          disabled={
                            (tmp_treatment && tmp_treatment.length < 1) ||
                            is_done
                              ? false
                              : true
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-12">
                      <div className="row">
                        <label className="text-left text-black common-label-text pb-1">
                          {t("Type")}
                        </label>
                        <div className="input-group">
                          <NormalSelect
                            className={`col`}
                            options={discType}
                            value={is_percentage}
                            name="is_percentage"
                            onChange={this.handleChange}
                            disabled={is_total ? true : false}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <label className="text-left text-black common-label-text pb-1">
                        {t("Discount Reason")}
                      </label>
                      <div className="input-group">
                        <NormalSelect
                          options={discount_reason_options}
                          value={disc_reason}
                          name="disc_reason"
                          onChange={this.handleChange}
                          disabled={is_total ? true : false}
                        />
                      </div>
                    </div>
                    {/* {disc_reason == "182" ? (
                      <div className="col-md-4 col-12">
                        <label className="text-left text-black common-label-text ">
                          {t("Discount reason")}
                        </label>
                        <div className="input-group mb-2">
                          <NormalTextarea
                            value={discreason_txt}
                            name="discreason_txt"
                            onChange={this.handleChange}
                            className="w-100"
                            disabled={is_total ? true : false}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )} */}
                    <div className="col-md-4 mt-4 pt-2 col-12">
                      <NormalButton
                        applybg={true}
                        className="col"
                        label="Apply Disc."
                        onClick={() => {
                          this.props.tokenDetails.cartdisc_setup
                            ? this.setState({ isLoginConfirmation: true })
                            : this.handleVoidCreate();
                        }}
                        disabled={
                          is_total ||
                          (tmp_treatment && tmp_treatment.length < 0)
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-wrap mb-2 mt-2">
                    <div className="col-md-8 justify-content-start col-12 mt-2">
                      <label className="fw-500">{t("Discount List")}</label>
                    </div>
                    {discount_reasons && discount_reasons.length > 0 ? (
                      <div className="col-md-4 pt-2 col-12 justify-content-end">
                        <NormalButton
                          resetbg={true}
                          className="col"
                          label="Reset Disc."
                          onClick={this.handleResetDiscount}
                          disabled={is_total ? true : false}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="d-flex">
                    <div className="col-4">
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
                  </div>
                  <div className="d-flex flex-wrap">
                    <div className="col-md-12 w-100 bg-light p-3 border overflow-auto">
                      {discount_reasons &&
                        discount_reasons.length > 0 &&
                        discount_reasons.map((item, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="col-4">
                                <label className="text-left text-black common-label-text pb-2">
                                  {item.remark && item.remark !== ""
                                    ? item.remark
                                    : "OTHERS"}
                                </label>
                              </div>
                              <div className="col-2 text-right">
                                <label className=" text-black common-label-text pb-2">
                                  $ {item.amount}
                                </label>
                              </div>
                              <div className="col-2 text-right">
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
                                <label className="text-black common-label-text pb-2">
                                  $ {item.after_disc}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      {!discount_reasons || discount_reasons.length <= 0 ? (
                        <div className="row">{t("No record found")}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-wrap w-100 mb-3 p-2 border">
              <div
                className="col-md-12 col-12"
                onClick={this.handleSummaryFlag}
              >
                <div className="d-flex">
                  <div className="h6 col-6 col-md-9 text-left">
                    {t("Summary List")}
                  </div>
                  <div className="h6 col-6 col-md-3 text-right fs-18">
                    {summaryFlag ? <>&#8593;</> : <>&#8595;</>}
                  </div>
                </div>
              </div>
              <div className={`table mb-2" + ${summaryFlag ? "" : "d-none"}`}>
                <TableWrapper headerDetails={headerDetails}>
                  {tmp_treatment && tmp_treatment.length > 0 ? (
                    tmp_treatment.map((item, index) => {
                      let { slno, program, next_appt, unit_amount } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="text-right">{slno}</div>
                          </td>

                          <td>
                            <div className="text-left">{program}</div>
                          </td>
                          <td>
                            <div className="text-right">{next_appt}</div>
                          </td>
                          <td>
                            <div className="text-right">{unit_amount}</div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12">
                        <div className="d-flex align-items-center justify-content-center">
                          {`No record found`}
                        </div>
                      </td>
                    </tr>
                  )}
                </TableWrapper>
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
              <CourseTreatmentDone
                id={cartId}
                cartId={this.props.cartId}
                sessionCount={data_list.Sessions}
                depositAmt={data_list.deposit}
                handleModal={this.handleDialog}
              ></CourseTreatmentDone>
            </NormalModal>
          </div>
        </div>
        {isOpenStaffSelectionDetail || !isOpenStaffSelectionDetail ? (
          <NormalModal
            className={"transaction-done-modal top-up-modal"}
            style={{ minWidth: "75%" }}
            modal={isOpenStaffSelectionDetail}
            handleModal={() => {}}
          >
            <img
              onClick={this.handleDialogSalesStaff}
              className="close cursor-pointer"
              src={closeIcon}
              alt=""
            />

            <StaffSelectionPopup
              id={this.props.id}
              cartId={this.props.cartId}
              LinelevelCartId={this.props.cartId}
              handleModal={this.handleDialogSalesStaff}
            ></StaffSelectionPopup>
          </NormalModal>
        ) : null}
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
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonPatchApi,
      commonCreateApi,
      commonUpdateApi,
    },
    dispatch
  );
};
export const CoursePopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CoursePopupClass)
);
