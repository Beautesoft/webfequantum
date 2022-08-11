import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalInput,
  NormalSelect,
  InputSearch,
  NormalModal,
  TableWrapper,
  NormalTextarea,
  NormalCheckbox,
  NormalRadio,
  NormalMultiSelect,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonDeleteApi,
  commonPatchApi,
  commonCreateApi,
  commonUpdateApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import {
  Treatment,
  Payment,
  EditCart,
  TreatmentDone,
  PackageCart,
} from "./cart/index";
import closeIcon from "assets/images/close.png";

import add from "assets/images/add.png";
import minus from "assets/images/minus.png";
// import Discount from './cart/discount';
import { EditDiscount } from "./cart/editDiscount";
import { Topup } from "./topup/topup";
import { Toast } from "service/toast";
import { ProductDetailsPopup } from "./cart/productDetailsPopup";
import { ItemDiscountPopup } from "./cart/ItemDiscountPopup";
import { ItemStatusPopup } from "./cart/itemStatusPopup";
import { StaffSelectionPopup } from "./cart/staffSelectionPopup";
import { CoursePopup } from "./cart/CoursePopup";
import { PrepaidPopup } from "./cart/PrepaidPopup";
import packageIcon from "assets/images/packing-icon.png";
import { withTranslation } from "react-i18next";

import tdIcon from "assets/images/tdIcon.png";
import topupIcon from "assets/images/topupIcon.png";
import billOpsIcon from "assets/images/billOpsIcon.png";
import profileIcon from "assets/images/profileIcon.png";
import exchangeIcon from "assets/images/exchangeIcon.png";
import clearAllIcon from "assets/images/clearAllIcon.png";
import checkoutIcon from "assets/images/checkoutIcon.png";
import TransactionIcon from "assets/images/TransactionIcon.png";
import { StaffList } from "../Cart/cart/StaffList";
import { CombineTopup } from "./CombineTopup/index.js";
import { CredentialConfirmation } from "./credentialConfirmation";

export class CartNewClass extends Component {
  state = {
    isOpen: false,
    currentIndex: -1,
    cartList: [],
    cartData: {},
    formFields: {
      custId: "",
      custName: "",
    },

    outletList: [{ label: "name", value: "id" }],
    isOpenPayment: false,
    isOpenEditcart: false,
    isOpenPackage: false,
    isOpenCustomer: false,
    isOpenEditDisc: false,
    isOpenTreatmentDone: false,
    headerDetails: [
      {
        label: "",
        width: "20px",
        selectAll: true,
        selectAllCheck: false,
        checkboxChange: (e) => this.handleSelectAllCheckbox(e),
      },
      { label: "", width: "30px" },
      {
        label: "Item",
        sortKey: false,
        width: "135px",
        className: "cursor-pointer border border-white text-warning ",
        dblclickFunc: () => this.handleItemHeaderDblClick(true),
      },
      {
        label: "Qty",
        width: "80px",
        divClass: "justify-content-center text-center",
      },
      {
        label: "Unit Price",
        sortKey: false,
        width: "80px",
        divClass: "justify-content-center text-center",
      },
      {
        label: "Disc $",
        sortKey: false,
        width: "58px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "D/Price",
        sortKey: false,
        width: "70px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Amt",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Deposit",
        sortKey: false,
        width: "72px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Item Status",
        sortKey: false,
        width: "90px",
        className: "cursor-pointer border border-white text-warning",
        dblclickFunc: () => this.handleItemStatusHeaderDblClick(true),
      },
      {
        label: "S.Staff",
        sortKey: false,
        width: "90px",
        className: "cursor-pointer border border-white text-warning",
        dblclickFunc: () => this.handleStaffSelectionHeaderClick(true),
      },
      {
        label: "T.Staff",
        sortKey: false,
        width: "90px",
        dblclickFunc: () => {},
      },
    ],
    customerOption: [],
    discountFields: {
      discount_per: "",
      discount_amt: "",
      reason: "",
    },
    editCart: {},
    search: "",
    cartId: "",
    isOpenTopup: false,
    exchangeBalance: 0,
    isOpenExchangePayment: false,
    exchangeRemark: "",
    exchangeBalanceAmount: 0,
    exchangeType: false,
    isOpenProductDetail: false,
    isOpenCourseDetail: false,
    isOpenPrepaidDetail: false,
    isOpenDiscountDetail: false,
    isOpenItemStatusDetail: false,
    isOpenStaffSelectionDetail: false,
    visible: false,
    settingData: [],
    defaultStaff: [],
    isOpenCombinedTopup: false,
    staffCommonListPopup: false,
    staffList: [],
    meta: {},
    limit: 6,
    selectAll: false,
    staffDeleteCommonListPopup: false,
    availableStaffList: [],
    availstaffmeta: {},
    availstaffpage: "",
    page: "",
    changedItem: "",
    treatmentCheck: false,
    salesCheck: false,
    commonDeposit: "",
    toptoBottom: false,
    is_selectDeposit: "",
    isHandleConfirmationDialog: false,
    isLoginConfirmation: false,
    user: "",
    pass: "",
  };
  componentWillMount = () => {
    // this.getCart();
    this.validator = new SimpleReactValidator({
      element: (message) => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };
  componentDidMount() {
    this.handleItemSettings();
    this.getdefaultStaffList();
    let { basicApptDetail, selectedCart } = this.props;
    console.log(basicApptDetail, "basicApptDetail");

    if (this.props.location.state?.customer_id) {
      this.props
        .getCommonApi(`customer/${this.props.location.state.customer_id}`)
        .then((data) => {
          if (data.status == 200) {
            let { formFields } = this.state;
            formFields["custId"] = this.props.location.state.customer_id;

            formFields["custName"] = data.data.cust_name;
            formFields["cust_refer"] = data.data.cust_refer;
            console.log(formFields, "FORMFIELD CARTJS");
            this.setState({ formFields });
            this.getCart();
          }
        });
    }

    if (basicApptDetail.custId) {
      let { formFields } = this.state;
      formFields["custId"] = basicApptDetail.custId;
      formFields["custName"] = basicApptDetail.custName;
      formFields["cust_refer"] = basicApptDetail.cust_refer;
      console.log(formFields, "FORMFIELD CARTJS");
      this.setState({ formFields });
      this.getCart();
    }
    if (selectedCart) {
    }
  }

  handleItemSettings = () => {
    let { settingData } = this.state;
    this.props.getCommonApi(`userlist/`).then(async (key) => {
      let { status, data } = key;
      console.log(key, "settingsData cartCreate");
      if (status === 200) {
        settingData = data;
        await this.setState({
          settingData,
        }); //settingData.default_loginid
      }
    });
  };

  getdefaultStaffList = async () => {
    let { defaultStaff } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=1&page=1&limit=1000`)
      .then(async (res) => {
        console.log(res, "salesdefaultstaff");
        let salesdefaultStaff = [];
        // salesdefaultStaff.push({ value: "All", label: "All" });
        // this.setState({ salesdefaultStaff });
        let { data, status } = res;
        if (status == 200) {
          if (data.dataList)
            for (let key of data.dataList) {
              salesdefaultStaff.push({ value: key.id, label: key.emp_name });
              if (key.id == Number(this.props.tokenDetails.default_loginid)) {
                defaultStaff.push({
                  value: key.id,
                  label: key.emp_name,
                });
                await this.setState({
                  defaultStaff,
                });
              }
            }
          await this.setState({ salesdefaultStaff });
        }
      });
  };

  getCart = () => {
    let { productCard, cartId, cartData, headerDetails, formFields } =
      this.state;
    let { basicApptDetail } = this.props;
    // this.props.getCommonApi(`itemcart/Check/?sitecodeid=${selected_cstomer.branchId}&cart_date=${"2020-12-11"}&cust_noid=${selected_cstomer.cust_noid}`).then((key) => {
    console.log(formFields, "FORMFIELD CARTJS");

    this.props
      .getCommonApi(
        `itemcart/Check/?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${formFields.custId}`
      )
      .then((key) => {
        let { status, data, cart_id, commonDeposit } = key;
        cartId = cart_id;
        this.setState({ cartId, cartData, commonDeposit });
        commonDeposit = "";
        if (status === 200 || status === 204) {
          if (data) {
            this.props
              .getCommonApi(
                `itemcart/?cart_date=${dateFormat(
                  new Date(),
                  "yyyy-mm-dd"
                )}&cust_noid=${formFields.custId}&cart_id=${cart_id}`
              )
              .then(async (res) => {
                cartData = [];

                let { status, data } = res;

                console.log(res, "returndatacartitemlist");
                if (status === 200) {
                  let cartList = Object.assign({}, this.state.cartList);
                  if (data.length > 0) {
                    data.forEach((element) => {
                      let itemData = element;
                      itemData["selected"] = false;
                      cartData.push({
                        itemData,
                      });
                    });
                  }

                  cartList = data;
                  headerDetails[0]["selectAllCheck"] = false;
                  this.setState({
                    cartList,
                    cartData: res,
                    cartId,
                    exchangeBalanceAmount: res.balance.slice(1),
                    exchangeType: res.exchange,
                    selectAll: false,
                    headerDetails,
                    commonDeposit: res.deposit_amt,
                    treatmentCheck: false,
                    salesCheck: false,
                  });
                } else if (status === 204) {
                  let cartList = Object.assign({}, this.state.cartList);
                  cartList = [];
                  cartData = {};
                  commonDeposit = "";
                  this.setState({ cartData, cartList, commonDeposit });
                }
              });
          }
        }
      });
  };

  handleClick = (key) => {
    if (!this.state.visible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    if (this.state.visible) {
      let { basicApptDetail } = this.props;
      this.search(basicApptDetail);
    }
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  };

  handleOutsideClick = (e) => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  getDateTime = (data) => {
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

  handleSubmit = (id) => {
    history.push(`/admin/payment/${id}`);
  };

  handleDialog = async () => {
    let {
      isOpenPayment,
      isOpenEditcart,
      isOpenPackage,
      isOpenCustomer,
      isOpenEditDisc,
      isOpenTreatmentDone,
      isOpenTopup,
      isOpenExchangePayment,
      isOpenProductDetail,
      isOpenCourseDetail,
      isOpenPrepaidDetail,
      isOpenDiscountDetail,
      isOpenItemStatusDetail,
      isOpenStaffSelectionDetail,
      isOpenCombinedTopup,
    } = this.state;
    isOpenPayment = false;
    isOpenEditcart = false;
    isOpenPackage = false;
    isOpenCustomer = false;
    isOpenEditDisc = false;
    isOpenTreatmentDone = false;
    isOpenTopup = false;
    isOpenExchangePayment = false;
    isOpenProductDetail = false;
    isOpenCourseDetail = false;
    isOpenPrepaidDetail = false;
    isOpenDiscountDetail = false;
    isOpenItemStatusDetail = false;
    isOpenStaffSelectionDetail = false;
    isOpenCombinedTopup = false;
    await this.setState({
      isOpenPayment,
      isOpenEditcart,
      isOpenPackage,
      isOpenCustomer,
      isOpenEditDisc,
      isOpenTreatmentDone,
      editCart: {},
      isOpenTopup,
      isOpenExchangePayment,
      isOpenProductDetail,
      isOpenCourseDetail,
      isOpenPrepaidDetail,
      isOpenDiscountDetail,
      isOpenItemStatusDetail,
      isOpenStaffSelectionDetail,
      isOpenCombinedTopup,
    });
    this.getCart();
  };

  handleSearch = async (event) => {
    // event.persist();
    let { formFields, visible } = this.state;
    formFields.custName = event.target.value;
    await this.setState({ formFields, visible: true });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.search();
      }, 500);
    }
    this.debouncedFn();
  };

  search = (searchString) => {
    let { formFields } = this.state;
    this.props
      .getCommonApi(`custappt/?search=${formFields.custName}`)
      .then((key) => {
        let { status, data } = key;

        if (status === 200) {
          // for (let value of data) {
          //     customerList.push({ value: value.id, label: value.emp_name })
          // }
          this.setState({ customerOption: data });
        }
      });
  };

  handleSelectCustomer = async (data) => {
    let { formFields } = this.state;
    formFields["custId"] = data.id;
    formFields["custName"] = data.cust_name;
    formFields["cust_refer"] = data.cust_refer;
    await this.setState({
      formFields,
      // isOpenCustomer: false,
      search: "",
      customerOption: [],
    });
    await this.props.updateForm("basicApptDetail", formFields);
    console.log(this.props.basicApptDetail, "sdfsadfasdf");
    this.handleClick();
    this.getCart();
  };

  handleCartCreated = () => {
    this.getCart();
  };

  // handleCheckout = () => {
  //   let { isOpenPayment, cartData, cartList, cartId, exchangeType } =
  //     this.state;
  //   let { basicApptDetail } = this.props;
  //   if (exchangeType && cartData.balance == 0) {
  //     if (cartList && cartList.length > 1) {
  //       let body = {
  //         cust_id: basicApptDetail.custId,
  //         cart_id: cartId,
  //       };
  //       this.handleExchangePayment(body);
  //     } else {
  //       Toast({
  //         type: "error",
  //         message: "Please Add Product for Exchange!",
  //       });
  //     }
  //   } else if (exchangeType && cartData.balance < 0) {
  //     if (cartList && cartList.length > 1) {
  //       this.handleExchangePay();
  //     } else {
  //       Toast({
  //         type: "error",
  //         message: "Please Add Product for Exchange!",
  //       });
  //     }
  //   } else {
  //     isOpenPayment = true;
  //     this.setState({ isOpenPayment });
  //   }
  // };
  handleCheckout = () => {
    let { isOpenPayment, cartData, cartList, cartId, exchangeType } =
      this.state;
    let { basicApptDetail } = this.props;

    if (cartList.length > 0) {
      if (exchangeType && cartData.balance == 0) {
        if (cartList && cartList.length > 1) {
          let body = {
            cust_id: basicApptDetail.custId,
            cart_id: cartId,
          };
          this.handleExchangePayment(body);
        } else {
          Toast({
            type: "error",
            message: "Please Add Product for Exchange!",
          });
        }
      } else if (exchangeType && cartData.balance < 0) {
        if (cartList && cartList.length > 1) {
          this.handleExchangePay();
        } else {
          Toast({
            type: "error",
            message: "Please Add Product for Exchange!",
          });
        }
      } else {
        isOpenPayment = true;
        this.setState({ isOpenPayment });
      }
    }
  };
  handleExchangePayment = (body) => {
    this.props.commonCreateApi(`exchangeproductconfirm/`, body).then((key) => {
      let { status, data } = key;
      if (status == 201) {
        this.getCart();
        history.push(`/admin/billing/print/bill/${data.sa_transacno}`);
      }
    });
  };

  handleDeleteCart = async (data) => {
    this.props.commonDeleteApi(`itemcart/${data.id}/`).then((res) => {
      let { status } = res;
      if (status == 200) {
        this.getCart();
      }
    });
  };

  handleEditCart = async (data) => {
    let { isOpenEditcart, editCart } = this.state;
    isOpenEditcart = true;
    editCart = data;
    this.setState({
      isOpenEditcart,
      editCart,
    });
  };

  handleTreatmentDone = async (item) => {
    if (item.is_tstaff && Number(item.quantity) == 1) {
      let { isOpenTreatmentDone, editCart } = this.state;
      editCart = item;
      await this.setState({ editCart });
      this.setState({ isOpenTreatmentDone: true });
    }
  };

  handleReduceQuantity = (data) => {
    let body = { quantity: 1 };
    this.props
      .commonPatchApi(`itemcart/${data.id}/qtyupdate/?check=0`, body)
      .then(() => {
        this.getCart();
      });
  };

  handleAddQuantity = (data) => {
    let body = { quantity: 1 };
    this.props
      .commonPatchApi(`itemcart/${data.id}/qtyupdate/?check=1`, body)
      .then(() => {
        this.getCart();
      });
  };

  // topup flow
  handleTopup = () => {
    let { isOpenTopup } = this.state;
    isOpenTopup = true;
    this.setState({
      isOpenTopup,
    });
  };
  handleCombinedTopup = () => {
    let isOpenCombinedTopup = true;
    this.setState({
      isOpenCombinedTopup,
    });
  };

  handleExchangeClick = () => {
    let { cartList, cartId } = this.state;
    let { basicApptDetail } = this.props;
    if (cartList && cartList.length > 0 && basicApptDetail.custId) {
      let body = {
        cust_id: basicApptDetail.custId,
        cart_id: cartId,
      };
      this.props.commonCreateApi(`exchangeproduct/`, body).then((key) => {
        let { status } = key;
        if (status == 200) {
          this.getCart();
        }
      });
    }
  };

  handleExchangePay = () => {
    let { isOpenExchangePayment } = this.state;
    isOpenExchangePayment = true;
    this.setState({ isOpenExchangePayment });
  };
  exchangeRemarkChange = async (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleExchangeLessthanZero = async (data) => {
    let { cartId, exchangeRemark } = this.state;
    let { basicApptDetail } = this.props;
    let body = {
      cust_id: basicApptDetail.custId,
      cart_id: cartId,
      remarks: exchangeRemark,
      return_type: data,
    };
    this.handleExchangePayment(body);
  };

  handleItemHeaderDblClick = (data) => {
    let { isOpenProductDetail } = this.state;
    isOpenProductDetail = data;
    this.setState({
      isOpenProductDetail,
    });
  };
  handleItemCourseClick = (data) => {
    if (data.is_course) {
      let { isOpenCourseDetail, editCart } = this.state;
      isOpenCourseDetail = true;
      editCart = data;
      this.setState({
        isOpenCourseDetail,
        editCart,
      });
    }
    if (data.is_prepaid) {
      let { isOpenPrepaidDetail, editCart } = this.state;
      isOpenPrepaidDetail = true;
      editCart = data;
      this.setState({
        isOpenPrepaidDetail,
        editCart,
      });
    }
  };

  handleCardPrepaidClick = (data) => {
    let { isOpenPrepaidDetail, editCart } = this.state;
    isOpenPrepaidDetail = true;
    editCart = data;
    this.setState({
      isOpenPrepaidDetail,
      editCart,
    });
  };
  handleCardItemCourseClick = (data) => {
    let { isOpenCourseDetail, editCart } = this.state;
    isOpenCourseDetail = true;
    editCart = data;
    this.setState({
      isOpenCourseDetail,
      editCart,
    });
  };
  handleItemStatusHeaderDblClick = (data) => {
    let { isOpenItemStatusDetail } = this.state;
    isOpenItemStatusDetail = data;
    this.setState({
      isOpenItemStatusDetail,
    });
  };

  handleDiscountDetailClick = (data) => {
    if (data.is_disc) {
      if (data.treatment_no == null || Number(data.treatment_no) <= 0) {
        let { isOpenDiscountDetail, editCart } = this.state;
        isOpenDiscountDetail = true;
        editCart = data;
        this.setState({
          isOpenDiscountDetail,
          editCart,
        });
      }
    }
  };
  handleStaffSelectionHeaderClick = (data) => {
    let { isOpenStaffSelectionDetail } = this.state;
    isOpenStaffSelectionDetail = data;
    this.setState({
      isOpenStaffSelectionDetail,
    });
  };
  handleOpenPackage = async (data) => {
    let { isOpenPackage, editCart } = this.state;
    isOpenPackage = true;
    editCart = data;
    this.setState({
      isOpenPackage,
      editCart,
    });
  };
  handleClearAllCart = async () => {
    let { cartList, cartData } = this.state;
    if (cartList.length > 0) {
      const cartId = this.state.cartList[0].cart_id;

      this.props
        .commonCreateApi(`cartitemdelete/?cart_id=${cartId}`)
        .then((res) => {
          this.setState({
            cartList: [],
            cartData: {},
            commonDeposit: "",
          });
          this.getCart();
          this.handleClearAllConfirmation();
        });
    }
  };
  handleDialogCoursepopup = () => {
    this.getCourseListCheckForReset();
    this.handleDialog();
  };

  getCourseListCheckForReset = () => {
    let { editCart } = this.state;
    this.props
      .getCommonApi(`cartservicecourse/${editCart.id}/`)
      .then(async (key) => {
        let { status, data } = key;
        console.log(data, "cartcoursepopupforreset");
        if (status == "200") {
          if (data) {
            if (
              !data.is_service &&
              (Number(data.treatment_no) == 0 || data.treatment_no == null)
            ) {
              let body = {
                cart_id: editCart.id,
              };
              this.props
                .commonCreateApi(`cartservicecourse/reset/`, body)
                .then(async (key) => {
                  let { status, data } = key;
                  console.log(key, "resetresponse");
                });
            }
          }
        }
      });
  };

  // handleChangeDefaultstaff = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  //   let { cartList } = this.state;
  //   let cartListCheckbox = cartList.find(acc => acc.selected === true);
  //   if (cartListCheckbox) {
  //     let { cartList } = this.state;
  //     let cartIds = "";
  //     for (let item of cartList) {
  //       if (item.selected) {
  //         if (cartIds !== "") {
  //           cartIds += "," + item.id;
  //         } else {
  //           cartIds += item.id;
  //         }
  //       }
  //     }

  //     let body = {
  //       cart_id: cartIds,
  //       staff_id: e.target.value,
  //       is_sales: true,
  //       is_work: false,
  //     };
  //     try {
  //       this.props.commonCreateApi(`addremovestaff/`, body).then(key => {
  //         let { status, data } = key;
  //         if (status == 200) {
  //           this.getCart();
  //         }
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // };

  // handleCommonAddNewStaff = async () => {
  //   let { cartList, treatmentCheck, salesCheck } = this.state;
  //   if (salesCheck == true || treatmentCheck == true) {
  //     let cartListCheckbox = cartList.find(acc => acc.selected === true);
  //     if (cartListCheckbox) {
  //       await this.setState({
  //         staffList: [],
  //         meta: {},
  //         page: 1,
  //       });
  //       this.getStafflist();
  //       this.setState({
  //         staffCommonListPopup: true,
  //       });
  //     } else {
  //       Toast({
  //         type: "error",
  //         message: "Please Select Item for update!",
  //       });
  //     }
  //   } else {
  //     Toast({
  //       type: "error",
  //       message: "Please Select Sales or Work!",
  //     });
  //   }
  // };

  handleCommonCreateEmployeePopup = () => {
    this.setState((prevState) => ({
      staffCommonListPopup: !prevState.staffCommonListPopup,
    }));
  };

  getStafflist = (data) => {
    let { page, limit, selectedAddStaffType } = this.state;
    this.props
      .getCommonApi(`empcartlist/?sales_staff=1&page=${page}&limit=${limit}`)
      .then(async (key) => {
        let { status, data } = key;
        console.log(key, "sdfgsdfgsdfgdfg sdfgsdfgsdfg");
        let { staffList } = this.state;
        let { meta } = this.state;
        staffList = [];
        meta = {};
        staffList = data;
        meta = data.meta.pagination;
        console.log(meta, "metalist");
        this.setState({
          staffList,
          meta,
        });
      });
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  // handleCommonSelectedStaff = async selectedItem => {
  //   let { cartList, treatmentCheck, salesCheck } = this.state;
  //   let cartIds = "";
  //   for (let item of cartList) {
  //     if (item.selected) {
  //       if (cartIds !== "") {
  //         cartIds += "," + item.id;
  //       } else {
  //         cartIds += item.id;
  //       }
  //     }
  //   }

  //   let body = {
  //     cart_id: cartIds,
  //     staff_id: selectedItem.id,
  //     is_sales: salesCheck,
  //     is_work: treatmentCheck,
  //   };

  //   this.handleCommonAddNewStaffAPI(body);
  // };

  // handleCommonDeleteSelectedStaff = async selectedItem => {
  //   let { cartList, treatmentCheck, salesCheck } = this.state;
  //   let cartIds = "";
  //   for (let item of cartList) {
  //     if (item.selected) {
  //       if (cartIds !== "") {
  //         cartIds += "," + item.id;
  //       } else {
  //         cartIds += item.id;
  //       }
  //     }
  //   }

  //   let body = {
  //     cart_id: cartIds,
  //     staff_id: selectedItem.id,
  //     is_sales: salesCheck,
  //     is_work: treatmentCheck,
  //   };

  //   this.handleCommonDeleteNewStaffAPI(body);
  // };

  handleSelectAllCheckbox = async ({ target: { value, name } }) => {
    let { cartList, headerDetails } = this.state;
    headerDetails[0]["selectAllCheck"] = value;
    await this.setState({ selectAll: value, headerDetails });
    for (let item of cartList) {
      item["selected"] = value;
      await this.setState({ ...this.state.cartList, item });
    }
    await this.setState({ cartList });
  };
  handleCheckbox = async ({ target: { value, name } }, item) => {
    let { cartList } = this.state;
    let cartListCheckbox = cartList.find((acc) => acc.id === item.id);
    if (cartListCheckbox) {
      cartListCheckbox["selected"] = value;
      await this.setState({ ...this.state.cartList, cartListCheckbox });
    }
  };

  // handleCommonDeleteNewStaffAPI = body => {
  //   try {
  //     this.props.commonCreateApi(`addremovestaff/remove/`, body).then(key => {
  //       let { status, data } = key;
  //       if (status == 200) {
  //         this.getCart();
  //         this.handleCommonDeleteEmployeePopup();
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // handleCommonAddNewStaffAPI = body => {
  //   try {
  //     this.props.commonCreateApi(`addremovestaff/`, body).then(key => {
  //       let { status, data } = key;
  //       if (status == 200) {
  //         this.getCart();
  //         this.handleCommonCreateEmployeePopup();
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // handleCommonDeleteEmployeePopup = () => {
  //   this.setState(prevState => ({
  //     staffDeleteCommonListPopup: !prevState.staffDeleteCommonListPopup,
  //   }));
  // };

  // handleCommonDeleteStaffClick = async () => {
  //   let { cartList, treatmentCheck, salesCheck } = this.state;
  //   if (salesCheck == true || treatmentCheck == true) {
  //     let cartListCheckbox = cartList.find(acc => acc.selected === true);
  //     if (cartListCheckbox) {
  //       await this.setState({
  //         availableStaffList: [],
  //         availstaffmeta: {},
  //         availstaffpage: 1,
  //       });
  //       this.getStafflistforMatch();
  //       this.setState({
  //         staffDeleteCommonListPopup: true,
  //       });
  //     } else {
  //       Toast({
  //         type: "error",
  //         message: "Please Select Item for update!",
  //       });
  //     }
  //   } else {
  //     Toast({
  //       type: "error",
  //       message: "Please Select Sales or Work!",
  //     });
  //   }
  // };

  getStafflistforMatch = (data) => {
    let { availstaffpage, availstaffmeta, availableStaffList, limit, cartId } =
      this.state;
    let { basicApptDetail } = this.props;
    this.props
      .getCommonApi(
        `itemcart/salesstafflist/?cust_noid=${basicApptDetail.custId}&cart_id=${cartId}&page=${availstaffpage}&limit=${limit}`
      )
      .then(async (key) => {
        let { status, data } = key;
        console.log(key, "deletestafflist");
        availableStaffList = [];
        availstaffmeta = {};
        if (data) {
          availableStaffList = data;
          availstaffmeta = data.meta.pagination;
        }
        console.log(availstaffmeta, "metalist");
        this.setState({
          availableStaffList,
          availstaffmeta,
        });
      });
  };

  handleavailStaffNext = async () => {
    let { availstaffpage } = this.state;
    availstaffpage = availstaffpage + 1;
    await this.setState({
      availstaffpage,
    });
    if (availstaffpage > 0) {
      this.getStafflistforMatch();
    }
  };

  handleavailStaffBack = async () => {
    let { availstaffpage } = this.state;
    availstaffpage = availstaffpage - 1;
    await this.setState({
      availstaffpage,
    });
    if (availstaffpage > 0) {
      this.getStafflistforMatch();
    }
  };

  handleQtyChange = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      //event.persist();
      let { cartList } = this.state;
      cartList[index]["quantity"] = event.target.value;
      let changedItem = item.id;
      this.setState({ cartList, changedItem });
      if (!this.debouncedQtyFn) {
        this.debouncedQtyFn = _.debounce(() => {
          this.handleQtyApiUpdate();
        }, 1000);
      }
      this.debouncedQtyFn();
    } else {
      Toast({
        type: "error",
        message: "Please enter valid quantity!",
      });
    }
  };

  handleQtyApiUpdate = () => {
    let { cartList, changedItem } = this.state;
    if (changedItem) {
      let ChangedList = cartList.filter((item) => item.id == changedItem);
      let qty = ChangedList[0]["quantity"];
      let id = ChangedList[0]["id"];
      let body = { quantity: qty };

      this.props
        .commonPatchApi(`itemcart/${id}/qtyupdate/`, body)
        .then(async () => {
          await this.setState({
            changedItem: "",
          });
          this.getCart();
        });
    }
  };

  handleUnitPriceChange = (event, item, index) => {
    //event.persist();
    let selectedItemPrice = Number(item.price).toFixed(2);
    // let selectedItemData = item;
    // let selectedItemIndex = index;
    console.log(item, "unitpriceitemdata");
    if (Number(event.target.value) > 0) {
      let { cartList, changedItem, selectedItemPrice } = this.state;
      cartList[index]["price"] = Number(event.target.value);
      changedItem = item.id;
      this.setState({
        cartList,
        changedItem,
      });
      if (!this.debouncedPriceFn) {
        this.debouncedPriceFn = _.debounce(async () => {
          this.handleUnitPriceApiUpdate();
        }, 3000);
      }
      this.debouncedPriceFn();
    } else {
      Toast({
        type: "error",
        message: "Please enter valid amount!",
      });
    }
  };

  handleUnitPriceApiUpdate = async () => {
    let { cartList, changedItem } = this.state;
    if (changedItem) {
      let ChangedList = cartList.filter((item) => item.id == changedItem);
      if (
        Number(ChangedList[0].item_price_ceiling) > 0 &&
        Number(ChangedList[0].price) > Number(ChangedList[0].item_price_ceiling)
      ) {
        Toast({
          type: "error",
          message: `Please enter value between ${ChangedList[0].item_price_floor} (min) and ${ChangedList[0].item_price_ceiling} (max)`,
        });
        ChangedList[0]["price"] = ChangedList[0]["discount_price"];
        this.setState({
          ChangedList,
        });
        return false;
      } else if (
        Number(ChangedList[0].item_price_floor) > 0 &&
        Number(ChangedList[0].price) < Number(ChangedList[0].item_price_floor)
      ) {
        Toast({
          type: "error",
          message: `Please enter value between ${ChangedList[0].item_price_floor} (min) and ${ChangedList[0].item_price_ceiling} (max)`,
        });
        ChangedList[0]["price"] = ChangedList[0]["discount_price"];
        this.setState({
          ChangedList,
        });

        return false;
      } else {
        let qty = ChangedList[0]["quantity"];
        let id = ChangedList[0]["id"];
        let pricevalue = ChangedList[0]["price"];

        let body = {
          quantity: Number(qty),
          price: Number(pricevalue).toFixed(2),
          sales_staff: [],
          itemstatus: null,
          remark: null,
          focreason: null,
          holdreason: null,
          holditemqty: null,
          ratio: null,
        };
        try {
          this.props.commonUpdateApi(`itemcart/${id}/`, body).then(async () => {
            await this.setState({
              changedItem: "",
            });
          });
        } catch (e) {
          console.log(e);
        }
        this.getCart();
      }
    }
  };

  handlesingleCheckbox = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRadioCheckbox = async (type) => {
    let { is_selectDeposit } = this.state;
    if (type !== is_selectDeposit) {
      await this.setState({
        is_selectDeposit: type,
      });
      this.handleCommonDepositApiUpdate();
    }
  };

  handleDepositChange = async (event) => {
    let { cartList } = this.state;
    if (Number(event.target.value) > 0 && cartList.length > 0) {
      //event.persist();
      let { commonDeposit } = this.state;
      commonDeposit = event.target.value;
      await this.setState({ commonDeposit });
      if (!this.debouncedDepositAmountFn) {
        this.debouncedDepositAmountFn = _.debounce(() => {
          this.handleCommonDepositApiUpdate();
        }, 1000);
      }
      this.debouncedDepositAmountFn();
    }
  };

  handleCommonDepositApiUpdate = () => {
    let { cartList, is_selectDeposit, commonDeposit, cartId } = this.state;
    let { basicApptDetail } = this.props;
    if (is_selectDeposit) {
      let body = {
        cust_noid: basicApptDetail.custId,
        cart_id: cartId,
        is_select: is_selectDeposit,
        enter_deposit: Number(commonDeposit),
      };
      try {
        this.props
          .commonCreateApi(`itemcart/SetAutoDeposit/`, body)
          .then(async () => {
            this.getCart();
          });
      } catch (e) {
        console.log(e);
      }
    } else {
      Toast({
        type: "error",
        message: "Please select calculation type!",
      });
    }
  };

  handleMultiSelectDefaultStaff = (data = []) => {
    let { defaultStaff } = this.state;
    defaultStaff = data;
    this.setState({ defaultStaff });
  };
  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  handleCommonApplyStaff = async () => {
    let { cartList, treatmentCheck, salesCheck, defaultStaff } = this.state;
    if (defaultStaff.length > 0) {
      if (salesCheck == true || treatmentCheck == true) {
        let cartListCheckbox = cartList.find((acc) => acc.selected === true);
        if (cartListCheckbox) {
          let { cartList } = this.state;
          let cartIds = "";
          for (let item of cartList) {
            if (item.selected) {
              if (cartIds !== "") {
                cartIds += "," + item.id;
              } else {
                cartIds += item.id;
              }
            }
          }

          let body = {
            cart_id: cartIds,
            staff_id: defaultStaff
              .map((e) => e.value)
              .reduce((a, e) => (a === "" ? e : a + "," + e), ""),
            is_sales: salesCheck,
            is_work: treatmentCheck,
          };
          try {
            this.props.commonCreateApi(`addremovestaff/`, body).then((key) => {
              let { status, data } = key;
              if (status == 200) {
                while (defaultStaff.length > 0) {
                  document
                    .querySelector(".select__multi-value__remove")
                    .click();
                  defaultStaff.pop();
                }
                this.setState({ defaultStaff: [] });
                this.getCart();
              }
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          Toast({
            type: "error",
            message: "Please Select Item for update!",
          });
        }
      } else {
        Toast({
          type: "error",
          message: "Please Select Sales or Work!",
        });
      }
    } else {
      Toast({
        type: "error",
        message: "Please Select Staff!",
      });
    }
  };
  handleClearAllConfirmation = () => {
    this.setState((prevState) => ({
      isHandleConfirmationDialog: !prevState.isHandleConfirmationDialog,
    }));
  };

  handleLoginConfirmationDialog = async () => {
    let { cartList } = this.state;
    if (cartList.length > 0) {
      let { settingData } = this.state;
      if (settingData.transacdisc) {
        await this.setState((prevState) => ({
          isLoginConfirmation: !prevState.isLoginConfirmation,
        }));
      } else {
        this.handleOpenTrac();
      }
    }
  };

  handleauthentication = async (user, pass) => {
    let Body = {
      username: user,
      password: pass,
    };
    this.props
      .commonCreateApi(`itemcart/TransacDiscLogin/`, Body)
      .then(async (key) => {
        let { status, data } = key;
        if (status == 200) {
          await this.setState((prevState) => ({
            isLoginConfirmation: !prevState.isLoginConfirmation,
          }));
          this.handleOpenTrac();
        }
      });
  };

  handleOpenTrac = async () => {
    await this.setState((prevState) => ({
      isOpenEditDisc: !prevState.isOpenEditDisc,
    }));
  };

  render() {
    console.log(this.props.location.state, "props od cartjs");
    console.log(this.state.cartList, "props od cartjs");

    let {
      cartList,
      customerOption,
      cartData = {},
      editCart = {},
      isOpenTreatmentDone,
      formFields,
      isOpenPayment,
      isOpenEditDisc,
      isOpenEditcart,
      headerDetails,
      isOpenCustomer,
      cartId,
      isOpenTopup,
      search,
      exchangeBalance,
      isOpenExchangePayment,
      exchangeRemark,
      exchangeBalanceAmount,
      isOpenProductDetail,
      isOpenCourseDetail,
      isOpenPrepaidDetail,
      isOpenDiscountDetail,
      isOpenItemStatusDetail,
      isOpenStaffSelectionDetail,
      visible,
      isOpenPackage,
      defaultStaff,
      salesdefaultStaff,
      isOpenCombinedTopup,
      settingData,
      staffCommonListPopup,
      staffList,
      meta,
      selectAll,
      staffDeleteCommonListPopup,
      availableStaffList,
      availstaffmeta,
      salesCheck,
      treatmentCheck,
      commonDeposit,
      isHandleConfirmationDialog,
      isLoginConfirmation,
    } = this.state;
    let { basicApptDetail, t } = this.props;
    return (
      <div className="row new-cart">
        <div className={`col-md-7 col-sm-7 col-12 cart-item`}>
          <div className={`item-list`}>
            <div className="row">
              <div className="input-group col-md-3 col-12 my-2">
                {/* <NormalSelect
                  buttonClass={`mt-2`}
                  placeholder="Select Staff"
                  options={salesdefaultStaff}
                  value={defaultStaff} //
                  name="defaultStaff"
                  onChange={this.handleChangeDefaultstaff}
                  className="customer-name status"
                /> */}
                <NormalInput
                  placeholder="Search Customer.."
                  value={formFields.custName}
                  name="custName"
                  onChange={this.handleSearch}
                  onClick={this.handleClick}
                />
                {this.validator.message(
                  "customerName",
                  formFields.custName,
                  "required"
                )}

                <div className="d-flex">
                  <div className="col-md-6">
                    <div className="d-flex mt-2">
                      <NormalCheckbox
                        onChange={(e) => this.handlesingleCheckbox(e)}
                        name="salesCheck"
                        checked={salesCheck}
                        type="checkbox"
                        inputClass={`m-1 p-1 col-12`}
                      />
                      <span className="h6 mt-1">Sales</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex mt-2">
                      <NormalCheckbox
                        onChange={(e) => this.handlesingleCheckbox(e)}
                        name="treatmentCheck"
                        checked={treatmentCheck}
                        type="checkbox"
                        inputClass={`m-1 p-1 col-12`}
                      />
                      <span className="h6 mt-1">Work</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="d-flex flex-wrap justify-content-start">
                  <div className="input-group text-right col-md-2 col-12 my-2 p-0 mx-1">
                    <NormalButton
                      buttonClass={"share w-100"}
                      mainbgrev={true}
                      className="col-12"
                      label="TD"
                      onClick={() =>
                        history.push(
                          `/admin/cart/treatment-done/${basicApptDetail.custId}`
                        )
                      }
                      disabled={!basicApptDetail.custId}
                      leftIcon={tdIcon}
                    />
                  </div>
                  {settingData.topupScreenOption1or2 ? (
                    <div className="input-group text-right col-md-2 col-12 my-2 p-0 mx-1">
                      <NormalButton
                        buttonClass={"share w-100"}
                        styleTwo={true}
                        className="col-12"
                        label="AR"
                        onClick={() => this.handleTopup()}
                        disabled={!basicApptDetail.custId}
                        leftIcon={topupIcon}
                      />
                    </div>
                  ) : (
                    <div className="input-group text-right col-md-2 col-12 my-2 p-0 mx-1">
                      <NormalButton
                        buttonClass={"share w-100"}
                        styleTwo={true}
                        className="col-12"
                        label="AR"
                        onClick={() => this.handleCombinedTopup()}
                        disabled={!basicApptDetail.custId}
                        leftIcon={topupIcon}
                      />
                    </div>
                  )}
                  <div className="input-group text-right col-md-2 col-12 my-2 p-0 mx-1">
                    <NormalButton
                      buttonClass={"share w-100"}
                      styleThree={true}
                      className="col-12"
                      label="Void"
                      onClick={() => history.push("/admin/cart/bill-ops")}
                      disabled={!basicApptDetail.custId}
                      leftIcon={billOpsIcon}
                    />
                  </div>
                  <div className="input-group text-right col-md-2 col-12 my-2 p-0 mx-1">
                    <NormalButton
                      buttonClass={"share w-100"}
                      styleFour={true}
                      className="col-12"
                      label="Profile"
                      onClick={() =>
                        history.push(
                          "/admin/customerplus/" +
                            basicApptDetail.custId +
                            "/details"
                        )
                      }
                      disabled={!basicApptDetail.custId}
                      leftIcon={profileIcon}
                    />
                  </div>
                  {cartList && cartList.length > 0 ? (
                    <div className="input-group text-right col-md-3 col-12 my-2 p-0 mx-1">
                      <NormalButton
                        buttonClass={"share w-100"}
                        styleFive={true}
                        className="col-12"
                        label="Exchange"
                        onClick={this.handleExchangeClick}
                        disabled={!basicApptDetail.custId}
                        leftIcon={exchangeIcon}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="d-flex flex-wrap justify-content-start">
                  <div className="input-group text-left col-md-9 col-12 my-2 p-0">
                    <NormalMultiSelect
                      handleMultiSelect={this.handleMultiSelectDefaultStaff}
                      options={salesdefaultStaff}
                      value={this.state.defaultStaff}
                      name="defaultStaff"
                    />
                  </div>
                  {cartList && cartList.length > 0 ? (
                    <div className="input-group col-md-3 col-12 my-2">
                      <NormalButton
                        buttonClass={"share w-100"}
                        applybg={true}
                        className="col-12"
                        label="Apply"
                        onClick={this.handleCommonApplyStaff}
                      />
                    </div>
                  ) : null}
                  {/* {cartList && cartList.length > 0 ? (
                    <div className="input-group text-right col-md-3 col-12 my-2">
                      <NormalButton
                        buttonClass={"share w-100"}
                        applybg={true}
                        className="col-12"
                        label="Add Staff"
                        onClick={this.handleCommonAddNewStaff}
                      />
                    </div>
                  ) : null} 
                  {cartList && cartList.length > 0 ? (
                    <div className="input-group text-right col-md-3 col-12 my-2">
                      <NormalButton
                        buttonClass={"share w-100"}
                        resetbg={true}
                        className="col-12"
                        label="Delete Staff"
                        onClick={this.handleCommonDeleteStaffClick}
                      />
                    </div>
                  ) : null}
                  */}
                </div>
              </div>
            </div>
            <div className="row mb-5">
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
                          <td>
                            <div
                              className={`d-flex align-items-center justify-content-center`}
                            >
                              <NormalCheckbox
                                onChange={(e) => this.handleCheckbox(e, item)}
                                name="selected"
                                checked={item.selected}
                                type="checkbox"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className={`d-flex align-items-center justify-content-center ${
                                item.deposit < 0 ? "text-danger" : ""
                              } `}
                            >
                              {/* <div
                                className="col p-0 fs-19 cursor-pointer d-none"
                                onClick={() => this.handleEditCart(item)}
                              >
                                <span className="icon-edit"></span>
                              </div> */}
                              <div
                                className="col p-0 pr-1 fs-18 cursor-pointer"
                                onClick={() => this.handleDeleteCart(item)}
                              >
                                <span className="icon-delete"></span>
                              </div>
                              {item.itemtype == "PACKAGE" ? (
                                <div
                                  className="col p-0 fs-18 cursor-pointer"
                                  onClick={() => this.handleOpenPackage(item)}
                                >
                                  <img src={packageIcon} />
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td className="position-relative status-type">
                            <span className={``}></span>
                            <div
                              onClick={() => this.handleItemCourseClick(item)}
                              className={`d-flex cursor-pointer text-left ${
                                item.is_course || item.is_prepaid
                                  ? "text-primary"
                                  : ""
                              } ${item.deposit < 0 ? "text-danger" : ""}`}
                            >
                              {item.itemdesc}
                            </div>
                          </td>
                          <td>
                            <div className={`text-right`}>
                              {/* <div className="input-group"> */}
                              {/* <input
                                  style={{
                                    width: "45px",
                                    textAlign: "right",
                                  }}
                                  value={item.quantity}
                                  name="quantity"
                                  onChange={event =>
                                    this.handleQtyChange(event, item, index)
                                  }
                                  type={`number`}
                                  min={1}
                                  maxLength={5}
                                  className={`customer-name text-right`}
                                  disabled={
                                    item.is_tcm || item.is_td ? true : false
                                  }
                                /> */}
                              <NormalInput
                                type="number"
                                value={item.quantity}
                                name="quantity"
                                onChange={(event) =>
                                  this.handleQtyChange(event, item, index)
                                }
                                className="col-12 p-1 text-right "
                                min={1}
                                maxLength={5}
                                disabled={
                                  item.is_tcm || item.is_td ? true : false
                                }
                              />
                            </div>
                            {/* </div> */}
                          </td>
                          <td>
                            <div className={`text-right`}>
                              {item.is_unitprice ? (
                                <NormalInput
                                  type="number"
                                  value={item.price}
                                  name="price"
                                  onChange={(e) =>
                                    this.handleUnitPriceChange(e, item, index)
                                  }
                                  className="col-12 p-1 text-right"
                                  disabled={
                                    item.is_tcm || item.is_td ? true : false
                                  }
                                />
                              ) : (
                                <NormalInput
                                  type="number"
                                  value={item.price}
                                  name="price"
                                  onChange={(e) =>
                                    this.handleUnitPriceChange(e, item, index)
                                  }
                                  className="col-12 p-1 text-right"
                                  disabled={true}
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div
                              onClick={() =>
                                this.handleDiscountDetailClick(item)
                              }
                              className={`cursor-pointer text-right
                              ${
                                item.is_disc &&
                                (item.treatment_no === null ||
                                  Number(item.treatment_no) <= 0)
                                  ? "text-primary"
                                  : ""
                              }
                              ${item.deposit < 0 ? "text-danger" : ""} `}
                            >
                              {item.discount}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`text-right ${
                                item.deposit < 0 ? "text-danger" : ""
                              } `}
                            >
                              {item.discount_price}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`text-right ${
                                item.deposit < 0 ? "text-danger" : ""
                              } `}
                            >
                              {item.trans_amt}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`text-right ${
                                item.deposit < 0 ? "text-danger" : ""
                              } `}
                            >
                              {item.deposit}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`text-left ${
                                item.deposit < 0 ? "text-danger" : ""
                              } `}
                            >
                              {item.itemstatus_name ? item.itemstatus_name : ""}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`text-left ${
                                item.deposit < 0 ? "text-danger" : ""
                              } `}
                            >
                              {item.sales_staff}
                            </div>
                          </td>
                          <td
                          //className={`cursor-pointer`}
                          // onClick={() => this.handleTreatmentDone(item)}
                          >
                            <div
                              className={`text-left
                              ${
                                item.is_tstaff && Number(item.quantity) == 1
                                  ? ""
                                  : ""
                              } 
                              ${item.deposit < 0 ? "text-danger" : ""} `}
                            >
                              {item.service_staff}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            </div>
            <div className="row payment-section py-2 fs-12">
              <div className="col-md-4 col-12">
                <div className="d-flex flex-wrap">
                  <div className="col-6">{t("Subtotal")}</div>
                  <div className="col-6">
                    $ {cartData.subtotal ? cartData.subtotal : "0"}
                  </div>
                  <div className="col-6">{t("Discount ($)")}</div>
                  <div className="col-6">
                    $ {cartData.discount ? cartData.discount : "0"}
                  </div>
                  <div className="col-6">{t("Transac amount")}</div>
                  <div className="col-6">
                    $ {cartData.trans_amt ? cartData.trans_amt : "0"}
                  </div>
                  <div className="col-6">{t("Deposit")}</div>
                  <div className="col-6">
                    $ {cartData.deposit_amt ? cartData.deposit_amt : "0"}
                  </div>
                  <div className="col-6">{t("Balance")}</div>
                  <div className="col-6">
                    $ {cartData.balance ? cartData.balance : "0"}
                  </div>
                  <div className="col-6">{t("Outstanding")}</div>
                  <div className="col-6">
                    $ {cartData.outstanding ? cartData.outstanding : "0"}
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="d-flex flex-wrap mb-1">
                  <div className="col-md-5 col-12 text-right h6 fw-700">
                    {t("Total Billing Amount")}
                  </div>
                  <div className="col-md-7 col-12 text-left text-orenge h5 fw-600">
                    ${cartData.billable_amount ? cartData.billable_amount : "0"}
                  </div>
                </div>
                <div className="d-flex flex-wrap">
                  <div className="col-md-5 col-12 text-right h6 font-700">
                    {t("Deposit")}
                  </div>
                  <div className="col-md-3 col-12 text-left">
                    <NormalInput
                      type="number"
                      value={this.state.commonDeposit}
                      name="commonDeposit"
                      onChange={this.handleDepositChange}
                      className="col-12 p-1 text-right"
                    />
                  </div>
                  <div className="col-md-4 col-12 text-left p-0">
                    <div className="d-flex flex-wrap p-0 m-0">
                      <div className="">
                        <NormalCheckbox
                          checked={
                            this.state.is_selectDeposit == "amount"
                              ? true
                              : false
                          }
                          onChange={() => this.handleRadioCheckbox(`amount`)}
                          className="fs-12 m-1"
                          icon={false}
                          name={`toptoBottom`}
                        />
                        <span>{t("Top to bottom by Amount")}</span>
                      </div>
                      <div className="">
                        <NormalCheckbox
                          checked={
                            this.state.is_selectDeposit == "auto" ? true : false
                          }
                          onChange={() => this.handleRadioCheckbox(`auto`)}
                          className="fs-12 m-1"
                          name={`toptoBottom`}
                          icon={false}
                        />
                        <span>{t("Auto proportion for all lines")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row col-12 mt-2">
                <div className="col-md-2"></div>
                <div className="col-md-8 col-12">
                  <div className="d-flex flex-wrap justify-content-start">
                    <div className="col-md-4 col-12 p-1">
                      <NormalButton
                        resetbg={true}
                        className="col-12"
                        label="Clear All"
                        onClick={() => this.handleClearAllConfirmation()}
                        leftIcon={clearAllIcon}
                      />
                    </div>
                    <div className="col-md-4 col-12 p-1">
                      <NormalButton
                        mainbg={false}
                        className="col-12 submit-btn"
                        label="Checkout"
                        onClick={() => this.handleCheckout()}
                        leftIcon={checkoutIcon}
                      />
                    </div>
                    <div className="col-md-4 col-12 p-1">
                      <NormalButton
                        mainbgrev={true}
                        className="col-12"
                        label="Trac/Disc"
                        onClick={this.handleLoginConfirmationDialog}
                        leftIcon={TransactionIcon}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-2"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 col-sm-5 col-12 pl-2 pr-0">
          <Treatment
            handleCartCreated={this.handleCartCreated}
            handleCardItemCourseClick={(editCart) =>
              this.handleCardItemCourseClick(editCart)
            }
            handleCardPrepaidClick={(editCart) =>
              this.handleCardPrepaidClick(editCart)
            }
            custId={
              formFields && formFields.custId
                ? formFields.custId
                : basicApptDetail.custId
            }
            defaultStaffId={defaultStaff}
          ></Treatment>
        </div>
        {visible ? (
          <div className="customerSearch-block">
            <div className="d-flex mt-4 table table-header w-100 m-0">
              <div className="col-2">{t("Name")}</div>
              <div className="col-2">{t("Phone")}</div>
              <div className="col-2">{t("Cust Code")}</div>
              <div className="col-2">{t("Reference")}</div>
              <div className="col-3">{t("Email")}</div>
              <div className="col-1">{t("NRIC")}</div>
            </div>
            <div className="response-table w-100">
              {customerOption.length > 0 ? (
                customerOption.map((item, index) => {
                  return (
                    <div
                      className="row m-0 table-body w-100 border"
                      onClick={() => this.handleSelectCustomer(item)}
                      key={index}
                    >
                      <div className="col-2">{item.cust_name}</div>
                      <div className="col-2">{item.cust_phone1}</div>
                      <div className="col-2">{item.cust_code}</div>
                      <div className="col-2">{item.cust_refer}</div>
                      <div className="col-3">{item.cust_email}</div>
                      <div className="col-1">{item.cust_nric}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100">
                  {t("No Data are available")}
                </div>
              )}
            </div>
          </div>
        ) : null}
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenPayment}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          {console.log("sfgdfjhfghjfjgkjk", cartData)}
          <Payment
            cartData={cartData}
            id={basicApptDetail.custId}
            cartId={cartList.length > 0 ? cartList[0].cart_id : ""}
            handleModal={this.handleDialog}
          ></Payment>
        </NormalModal>

        <NormalModal
          className={"edit-cart-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenEditcart}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <EditCart id={editCart.id} handleModal={this.handleDialog}></EditCart>
        </NormalModal>
        <NormalModal
          className={"package-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenPackage}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <PackageCart
            id={editCart.id}
            handleModal={this.handleDialog}
          ></PackageCart>
        </NormalModal>
        <NormalModal
          className={"transaction-discount-update"}
          style={{ minWidth: "75%" }}
          modal={isOpenEditDisc}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          {/* <Discount discountFields={()=>{}} handleChange={()=>{}} handleSubmit={()=>{}}></Discount> */}
          {isOpenEditDisc ? (
            <EditDiscount
              id={cartId}
              handleModal={this.handleDialog}
            ></EditDiscount>
          ) : (
            ""
          )}
        </NormalModal>
        <NormalModal
          className={"transaction-done-modal"}
          style={{ minWidth: "55%" }}
          modal={isOpenTreatmentDone}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <TreatmentDone
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
          ></TreatmentDone>
        </NormalModal>
        {/* <NormalModal
          className={"select-category customer-select"}
          style={{ minWidth: "75%" }}
          modal={isOpenCustomer}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="row mt-2 mb-5 mx-3">
            <div className="col-12 pl-0 mb-3 fs-18 py-2">Select Customer</div>
            <div className="col-2 pl-0">Search</div>
            <div className="col-5">
              <input
                name="treatment"
                value={search}
                onChange={this.handleSearch}
                className="search m-0 p-0 px-3"
              />
            </div>
            <div className="col-3">
              <NormalButton
                buttonClass={"mx-2 p-0"}
                mainbg={true}
                className="confirm"
                label="Search"
                outline={false}
                onClick={() => this.search(this.state.search)}
              />
            </div>

            <div className="row mt-4 table-header w-100 m-0">
              <div className="col-3">Name</div>
              <div className="col-2">Phone</div>
              <div className="col-3">Cust Code</div>
              <div className="col-4">Email</div>
            </div>
            <div className="response-table w-100">
              {customerOption && customerOption.length > 0 ? (
                customerOption.map((item, index) => {
                  return (
                    <div
                      className="row m-0 table-body w-100"
                      onClick={() => this.handleSelectCustomer(item)}
                      key={index}
                    >
                      <div className="col-3">{item.cust_name}</div>
                      <div className="col-2">{item.cust_phone1}</div>
                      <div className="col-3">{item.cust_code}</div>
                      <div className="col-4">{item.cust_email}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100">No Data are available</div>
              )}
            </div>
          </div>
        </NormalModal> */}
        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenTopup}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <Topup
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
          ></Topup>
        </NormalModal>
        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "85%" }}
          modal={isOpenCombinedTopup}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <CombineTopup
            id={basicApptDetail.custId}
            handleModal={this.handleDialog}
          />
        </NormalModal>
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "40%" }}
          modal={isOpenExchangePayment}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <div className="fs-18 fw-700 mb-3 title">{t("Exchange Payment")}</div>
          <div className="col-12 pl-0 mb-2 fs-15 fw-500 py-1">
            {t("Extra Amount")} &nbsp;
            <span className="text-center text-orenge fs-18 font-500">
              $ {exchangeBalanceAmount}
            </span>
            &nbsp;{t("Need to Return to Customer")}
          </div>

          <div className="row">
            <div className="col-12">
              <label className="text-left text-black common-label-text ">
                {t("Remark")}
              </label>
              <div className="input-group myp-0">
                <NormalTextarea
                  value={exchangeRemark}
                  name="exchangeRemark"
                  onChange={this.exchangeRemarkChange}
                  className="custome-name px-3 p-0 col-12"
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around pt-3">
            <NormalButton
              mainbg={true}
              className="col-12 fs-13  "
              label="Return Cash"
              onClick={() => {
                this.handleExchangeLessthanZero("Cash");
              }}
            />

            <NormalButton
              mainbg={true}
              className="col-12 fs-13 "
              label="Issue Credit Notes"
              onClick={() => {
                this.handleExchangeLessthanZero("Credit");
              }}
            />

            <NormalButton
              mainbg={true}
              className="col-12 fs-13 "
              label="Forfeit [Cash = 0]"
              onClick={() => {
                this.handleExchangeLessthanZero("Forfeit");
              }}
            />
          </div>
        </NormalModal>
        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenProductDetail}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <ProductDetailsPopup
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
          ></ProductDetailsPopup>
        </NormalModal>
        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenCourseDetail}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleDialogCoursepopup}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <CoursePopup
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
            itemData={editCart}
          ></CoursePopup>
        </NormalModal>
        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "60%" }}
          modal={isOpenPrepaidDetail}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <PrepaidPopup
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
          ></PrepaidPopup>
        </NormalModal>

        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "50%" }}
          modal={isOpenDiscountDetail}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <ItemDiscountPopup
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
          ></ItemDiscountPopup>
        </NormalModal>
        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenItemStatusDetail}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <ItemStatusPopup
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
          ></ItemStatusPopup>
        </NormalModal>
        <NormalModal
          className={"transaction-done-modal top-up-modal"}
          style={{ minWidth: "75%" }}
          modal={isOpenStaffSelectionDetail}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <StaffSelectionPopup
            id={cartId}
            cartId={editCart.id}
            handleModal={this.handleDialog}
          ></StaffSelectionPopup>
        </NormalModal>
        <NormalModal
          className={"transaction-done-reversal"}
          style={{ minWidth: "30%" }}
          modal={isHandleConfirmationDialog}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleClearAllConfirmation}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <div className="row">
            <div className="d-flex flex-wrap">
              <div className="col-12">
                <h4>{t("Confirmation")}</h4>
              </div>
              <div className="col-12 mb-2">
                <p>{t("Are you sure want to continue")} ?</p>
              </div>
              <div className="row p-3">
                <div className="col-6">
                  <NormalButton
                    label="Confirm"
                    mainbg={true}
                    name="clearallconfirm"
                    className={`w-100 col-12`}
                    onClick={this.handleClearAllCart}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    label="Cancel"
                    resetbg={true}
                    name="clearallCancel"
                    className={`w-100 col-12`}
                    onClick={this.handleClearAllConfirmation}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>
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

        {/* <NormalModal
          className={"stock-memo-staff-listing"}
          style={{ minWidth: "60%" }}
          modal={staffCommonListPopup}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleCommonCreateEmployeePopup}
            className="close"
            src={closeIcon}
            alt=""
          />
          <StaffList
            staffList={staffList}
            meta={meta}
            handleNext={() => this.handleNext()}
            handleBack={() => this.handleBack()}
            handleSelectedStaff={item => this.handleCommonSelectedStaff(item)}
          />
        </NormalModal>

        <NormalModal
          className={"stock-memo-staff-listing"}
          style={{ minWidth: "60%" }}
          modal={staffDeleteCommonListPopup}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleCommonDeleteEmployeePopup}
            className="close"
            src={closeIcon}
            alt=""
          />
          <StaffList
            staffList={availableStaffList}
            meta={availstaffmeta}
            handleNext={() => this.handleavailStaffNext()}
            handleBack={() => this.handleavailStaffBack()}
            handleSelectedStaff={item =>
              this.handleCommonDeleteSelectedStaff(item)
            }
          />
        </NormalModal> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
  selectedCart: state.common.selectedCart,
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonDeleteApi,
      commonPatchApi,
      commonCreateApi,
      commonUpdateApi,
    },
    dispatch
  );
};

export const CartNew = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CartNewClass)
);
