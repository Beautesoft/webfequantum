import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalInput,
  NormalSelect,
  InputSearch,
  NormalModal,
  TableWrapper,
  NormalCheckbox,
  Pagination,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import _ from "lodash";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonCreateApi,
  commonDeleteApi,
  commonPatchApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";
import { SelectStaff } from "./treatmentDone";
import { Reversal } from "./reversal";
import service from "assets/images/make-up-brush.png";
// import Discount from './cart/discount';
import closeIcon from "assets/images/close.png";
import { FormGroup, Label, Input } from "reactstrap";
import { TreatmentHistoryCart } from "./TreatmentHistoryCart";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { Toast } from "service/toast";
import { withTranslation } from "react-i18next";
import { max } from "moment";
import { CredentialConfirmation } from "../credentialConfirmation";

export class TreatmentDoneClass extends Component {
  state = {
    tstaffList: [],
    headerDetails: [
      { label: "Branch" },
      {
        label: "Date",
        sortKey: false,
        width: "110px",
        divClass: "justify-content-end text-right",
      },
      { label: "Treatment", width: "120px" },
      { label: "Trans Ref", sortKey: false, width: "50px" },

      //{ label: 'Type', sortKey: false, width: "55px" },
      // { label: 'Exp-Date', sortKey: false, width: "80px" },
      {
        label: "Amount",
        sortKey: false,
        width: "50px",
        divClass: "justify-content-end text-right",
      },

      {
        label: "Treat-Code",
        sortKey: false,
        width: "105px",
      },
      {
        label: "TD",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Rev",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Open",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "AR",
        sortKey: false,
        width: "35px",
        divClass: "justify-content-end text-right",
      },
      {
        label: "Session",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-center",
      },
      {
        label: "Redeem",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-center",
      },
      {
        label: "Reversal",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-center",
      },
      {
        label: "Exchange",
        sortKey: false,
        width: "55px",
        divClass: "justify-content-end text-right",
      },
    ],
    // cartData: {},
    yearList: [
      {
        label: "All",
        value: "All",
      },
      {
        label: "Default",
        value: "Default",
      },
      {
        label: "Expiry",
        value: "Expiry",
      },
    ],
    selectedYear: "All",
    isOpenTreatmentDone: false,
    tsStaff: {},
    workPoint: 0,
    isOpenReversal: false,
    checkBoxConfirmReversal: [],
    selectedSession: "",
    selectedItemTreatmentIds: [],
    activeMenu: "treatmentdone",
    productCard: [],
    list: [],
    isOpenExchangeService: false,
    page: 1,
    rangeId: "",
    menuId: "",
    rangeName: "",
    rangeOption: [],
    ExchangeItem: {},
    SelectedExchangeItem: {},
    cust_data: {},
    mainMeta: {},
    isLoginConfirmation: false,
    selectedItem: {},
    selectedType: "",
  };

  componentDidMount = () => {
    this.getCart({});
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
    // this.props.getCommonApi("treatmentdone/Year/").then(key => {
    //   let { status, data } = key;
    //   let { yearList } = this.state;
    //   for (let value of data) {
    //     yearList.push({ value: value, label: value });
    //   }
    //   this.setState({ yearList });
    // });
  };
  handleCheckboxChangeWithNormalCheckBox = item => {
    let newArray = [...this.state.checkBoxConfirmReversal, item.target.name];
    if (this.state.checkBoxConfirmReversal.includes(item.target.name)) {
      newArray = newArray.filter(day => day !== item.target.name);
    }
    this.setState({
      checkBoxConfirmReversal: newArray,
    });
  };
  getCart = async data => {
    console.log(this.props, "sfgdfsgdfghgf");
    let {
      roomList,
      sourceList,
      staffList,
      cartData,
      duration,
      tstaffList,
      selectedYear,
      cust_data,
      mainMeta,
    } = this.state;
    let custId = "";

    if (this.props.match.params.id) {
      custId = this.props.match.params.id;
    } else {
      custId = this.props.basicApptDetail.custId;
    }
    let { page = 1, limit = 12, search = "" } = data;

    this.props
      .getCommonApi(
        `treatmentdone/?year=${selectedYear}&cust_id=${custId}&page=${page}&limit=${limit}`
      )
      .then(async key => {
        await this.setState({
          tstaffList: [],
          mainMeta: {},
        });
        cartData = key;
        let { status, data, cust_data } = key;
        console.log(key, "Service Redeem List data");

        if (data) {
          let { dataList, meta } = data;
          if (dataList && dataList.length > 0) {
            tstaffList = data.dataList;
          }
          if (meta && meta.pagination) {
            mainMeta = data.meta.pagination;
          }
          await this.setState({
            tstaffList,
            mainMeta,
          });
        }
        if (cust_data) {
          await this.setState({
            cust_data,
          });
        }

        if (cust_data) {
          let formFields = {};
          formFields["custId"] = this.props.match.params.id;
          formFields["custName"] = cust_data.cust_name;
          formFields["cust_refer"] = cust_data.cust_refer;
          await this.props.updateForm("basicApptDetail", formFields);
        }
      });
  };

  handleYearChange = async ({ target: { value, name } }) => {
    let { selectedYear, records } = this.state;
    selectedYear = value;
    records = [];
    await this.setState({
      selectedYear,
      records,
    });
    this.getCart({});
  };

  getDataFromRes = data => {
    let { formFields, cartData, updateFields, postFields } = this.state;
    formFields["Item"] = data.value.Item;
    formFields["Price"] = data.value.Price;
    formFields["Room"] = data.value.Room;
    updateFields["Room"] = data.value.Room;
    formFields["Source"] = data.value.Source;
    updateFields["Source"] = data.value.Source;
    formFields["add_duration"] = data.value.add_duration;
    formFields["new_remark"] = data.value.new_remark;
    updateFields["new_remark"] = data.value.new_remark;
    postFields["times"] = data.value.times;
    postFields["work_point"] = data.value.work_point;
    this.setState({
      formFields,
      updateFields,
      postFields,
    });
  };

  // getYearList = (data) => {
  //     let date = new Date().getFullYear();

  //     let { yearList } = this.state;
  //     for (let i = date; i > 1970; i--) {
  //         yearList.push({ label: i, value: i });
  //     }
  //     this.setState({
  //         yearList
  //     })
  // }

  handleSubmit = id => {};

  handleDialog = () => {
    this.setState({
      isOpenTreatmentDone: false,
      isOpenReversal: false,
      checkBoxConfirmReversal: [],
      isOpenExchangeService: false,
      isHandleExchangeConfirmation: false,
      records: [],
    });
    this.getCart({});
  };

  handleSearch = event => {
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        this.props
          .getCommonApi(`custappt/?search=${searchString}`)
          .then(key => {
            let { status, data } = key;
            if (status === 200) {
              // for (let value of data) {
              //     customerList.push({ value: value.id, label: value.emp_name })
              // }
              this.setState({ customerOption: data });
            }
          });
      }, 500);
    }
    this.debouncedFn();
  };

  // handleSelectCustomer = async data => {
  //   let { formFields } = this.state;
  //   formFields["custId"] = data.id;
  //   formFields["custName"] = data.cust_name;
  //   this.setState({ formFields, isOpenCustomer: false, customerOption: [] });
  //   await this.props.updateForm("basicApptDetail", formFields);
  //   console.log(this.props.basicApptDetail, "sdfsadfasdf");
  // };

  handleCartCreated = (data, price, id) => {
    let { basicApptDetail } = this.props;
    let { tstaffList } = this.state;
    let payload = [];

    for (let key of tstaffList) {
      let reverseTreatmentIds = [];
      //reverseTreatmentIds = key.treatmentids.reverse();
      let ItemTreatmentIds = key.treatmentids;
      reverseTreatmentIds = ItemTreatmentIds.sort((a, b) => b - a);
      if (key.sel === true) {
        let obj = {
          cust_noid: this.props.match.params.id,
          cart_date: dateFormat(new Date(), "yyyy-mm-dd"),
          itemcodeid: key.stockid,
          price: key.unit_amount,
          item_uom: null,
          treatment_account: key.TreatmentAccountid,
          treatment: reverseTreatmentIds.slice(0, key.session),
          ori_stockid: null,
        };
        payload.push(obj);
      }
    }
    if (payload.length > 0) {
      let test = payload;
      console.log("payload-data", test);
      this.props
        .getCommonApi(
          `itemcart/Check/?cart_date=${dateFormat(
            new Date(),
            "yyyy-mm-dd"
          )}&cust_noid=${this.props.match.params.id}`
        )
        .then(res => {
          if (res.data.length === 0) {
            this.props
              .commonCreateApi("itemcart/TrmtDoneCartCreate/", payload)
              .then(res => {
                // this.props.handleCartCreated()
                this.setState({
                  activeTab: "treatment",
                  isOpenPriceModal: false,
                });
                history.push("/admin/cart");
              });
          } else {
            this.props
              .commonCreateApi(
                `itemcart/TrmtDoneCartCreate/?cart_id=${res.cart_id}`,
                payload
              )
              .then(res => {
                // this.props.handleCartCreated()
                this.setState({
                  activeTab: "treatment",
                  isOpenPriceModal: false,
                });
                history.push("/admin/cart");
              });
          }
        });
    }
  };

  handleCheckout = () => {
    let { isOpenPayment } = this.state;
    isOpenPayment = true;
    this.setState({ isOpenPayment });
  };

  handleChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;
    await this.setState({
      formFields,
    });
    // this.props.updateForm('customerDetail', formFields)
    // await this.props.updateForm('appointmentCustomerDetail', formFields)
  };

  handlePostChange = async ({ target: { value, name } }) => {
    let { postFields } = this.state;
    postFields[name] = value;
    await this.setState({
      postFields,
    });
  };

  handleUpdateChange = async ({ target: { value, name } }) => {
    let { updateFields } = this.state;
    updateFields[name] = value;
    await this.setState({
      updateFields,
    });
    let event = { target: { value: value, name: name } };
    // this.handleUpdatestaff(event);
  };

  handleAddstaff = async item => {
    if (item.is_allow) {
      let { tstaffList, selectedSession, selectedItemTreatmentIds } =
        this.state;
      selectedSession = item.session;
      // let reverseTreatmentIds = [];
      // reverseTreatmentIds = item.treatmentids.reverse();
      let ItemTreatmentIds = item.treatmentids;
      let reverseTreatmentIds = ItemTreatmentIds.sort((a, b) => b - a);
      if (selectedSession == 0) {
        selectedSession = 1;
      }
      selectedItemTreatmentIds = reverseTreatmentIds.slice(0, selectedSession);
      var unit_rate = item.unit_amount;
      var qualifiedAmount = selectedSession * unit_rate;
      this.setState({ selectedSession, selectedItemTreatmentIds });

      /* let test=0;
        const currentParentCodeBalance = tstaffList.filter(
            (res) => res.treatment_parentcode ===  item.treatment_parentcode
          ).reduce((sum, currentValue) => {
            return  currentValue.balance;
          }, 0);
        const currentParentCodeSelectedStaffValue = tstaffList.filter(
            (res) => res.treatment_parentcode ===  item.treatment_parentcode && res.staff!=null
            ).reduce((sum, currentValue) => {
                return parseFloat((eval(sum))) + parseFloat((eval(currentValue.unit_amount)));
              }, 0);
        
        if(item.staff==null)
        {
            test=parseFloat((eval(currentParentCodeSelectedStaffValue))) + parseFloat((eval(item.unit_amount))) ;
        }
        else{
            test=parseFloat((eval(currentParentCodeSelectedStaffValue))) - parseFloat((eval(item.unit_amount))) ;
        }
        */

      //if (currentParentCodeBalance >= test) {
      // if (item.balance >= qualifiedAmount) {
      //   let { tstaffList, formFields, cartData, postFields } = this.state;
      //   await this.setState({ tsStaff: item });
      //   this.setState({
      //     isOpenTreatmentDone: true,
      //   });
      // } else {
      //   this.handleDialog();
      //   Toast({
      //     type: "error",
      //     message: "Insufficient balance to redeem",
      //   });
      // }
      await this.setState({ tsStaff: item });
      this.setState({
        isOpenTreatmentDone: true,
      });
    } else {
      Toast({
        type: "error",
        message: "Treatment done is not allowed in other outlets",
      });
    }
  };

  handleUpdatestaff = async (event, item, index) => {
    let { tstaffList, formFields, cartData, updateFields } = this.state;
    tstaffList[index][event.target.name] = event.target.value;
    this.setState({
      tstaffList,
    });
    let data = {};
    if (event.target.name === "appt_fr_time") {
      data = {
        appt_fr_time: event.target.value,
        add_duration: formFields["add_duration"],
      };
    }
    if (event.target.name === "add_duration") {
      data = {
        appt_fr_time: item.appt_fr_time,
        add_duration: event.target.value,
      };
    }

    // if (updateFields.Source && updateFields.Room) {
    this.props
      .commonPatchApi(
        `tmpitemhelper/${item.id}/?Room_Codeid=${updateFields.Room}&Source_Codeid=${updateFields.Source}&new_remark=${updateFields.new_remark}`,
        data
      )
      .then(() => {
        this.getCart({});
      });
    // } else {
    //     this.setState({ showUpdateError: true })
    // }
  };

  handleClearLine = () => {
    this.props
      .commonDeleteApi(
        `tmpitemhelper/delete/?clear_all=0&cartid=${this.props.cartId}`
      )
      .then(() => {
        this.getCart({});
      });
  };

  handleClearAll = () => {
    this.props
      .commonDeleteApi(
        `tmpitemhelper/delete/?clear_all=1&cartid=${this.props.cartId}`
      )
      .then(() => {
        let { formFields, postFields } = this.state;
        formFields["work_point"] = "";
        postFields["times"] = "";
        this.setState({
          formFields,
          postFields,
        });
        this.getCart({});
      });
  };
  handleReversalTreatmentAll = async () => {
    let treatmentIds = this.state.checkBoxConfirmReversal;

    await this.setState({
      treatmentIds,
    });

    this.setState({
      isOpenReversal: true,
    });
  };
  handleReversalTreatment = async () => {
    debugger;
    let { selectedItem } = this.state;
    let item = selectedItem;
    if (item.is_allow) {
      let reverseTreatmentIds = [];
      let { selectedSession } = this.state;
      selectedSession = item.session;
      let ItemTreatmentIds = item.treatmentids;
      let TreatmentIds = ItemTreatmentIds.sort((a, b) => b - a);
      if (selectedSession == 0) {
        selectedSession = 1;
      }
      reverseTreatmentIds = TreatmentIds.slice(0, selectedSession);
      await this.setState({
        treatmentIds: reverseTreatmentIds,
        selectedSession,
      });

      this.setState({
        isOpenReversal: true,
      });
    } else {
      Toast({
        type: "error",
        message: "You are not allowed to do this transaction",
      });
    }
  };

  handleReverse = (item, index) => {
    let { tstaffList } = this.state;
    tstaffList[index]["rev"] = true;
    this.setState({
      tstaffList,
    });
    // onClick={this.handleReversalTreatment}
  };
  changeIndexSession = (index, value, item) => {
    if (item.is_allow) {
      if (Number(value) <= Number(item.open)) {
        let { tstaffList } = this.state;
        tstaffList[index]["session"] = value;
        this.setState({
          tstaffList,
        });
      } else {
        Toast({
          type: "error",
          message: "Please enter valid session",
        });
      }
    } else {
      Toast({
        type: "error",
        message: "You are not allowed to do this transaction",
      });
    }
  };

  toggle = tab => {
    if (this.state.activeMenu !== tab) {
      this.setState({
        activeMenu: tab,
      });
    }
  };
  getServices = query => {
    let {
      page = this.state.page,
      menuId = this.state.menuId,
      rangeId = this.state.rangeId,
    } = query;
    this.props
      .getCommonApi(
        `servicestock/?Item_Deptid=${menuId}&page=${page}&Item_Rangeid=${rangeId}`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          this.setState({ productCard: data, list: data.dataList });
        }
      });
  };
  getMenus = () => {
    let { menuOption } = this.state;
    menuOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props
      .getCommonApi(`catalogitemdept/?Item_Dept=${`SERVICE`}`)
      .then(res => {
        // activeMenu = []
        console.log("sdfsdhfghjghj ress", res);
        for (let key of res.data) {
          menuOption.push({
            value: key.id,
            label: key.itm_desc,
            code: key.itm_code,
            seq: key.itm_seq,
          });
        }
        this.setState({ menuOption });
      });
  };

  getRange = () => {
    let { rangeOption, menuId } = this.state;
    rangeOption = [];

    this.props
      .getCommonApi(`catalogitemrange?Item_Deptid=${menuId}`)
      .then(res => {
        // activeMenu = []
        for (let key of res.data) {
          rangeOption.push({ value: key.id, label: key.itm_desc });
        }
        this.setState({ rangeOption });
      });
  };

  handleauthentication = async (user, pass) => {
    let { selectedType } = this.state;
    let Body = {};
    if (selectedType == "reversal") {
      Body = {
        username: user,
        password: pass,
        type: "Reversal",
      };
    } else {
      Body = {
        username: user,
        password: pass,
        type: "Exchange",
      };
    }

    this.props
      .commonCreateApi(`userauthorizationpopup/`, Body)
      .then(async key => {
        let { status, data } = key;
        if (status == 200) {
          await this.setState(prevState => ({
            isLoginConfirmation: !prevState.isLoginConfirmation,
          }));
          if (selectedType == "reversal") {
            this.handleReversalTreatment();
          } else {
            this.handleExchangeClick();
          }
        }
      });
  };

  handleExchangeClick = async () => {
    let { selectedItem } = this.state;
    let item = selectedItem;
    if (item.is_allow) {
      if (item.sel) {
        await this.setState({
          ExchangeItem: [],
        });
        this.getMenus();
        this.getRange();
        this.getServices({});

        await this.setState({
          isOpenExchangeService: true,
          ExchangeItem: item,
        });
        console.log(
          this.state.ExchangeItem,
          "selected row of treatment done data - exchange item"
        );
      } else {
        Toast({
          type: "error",
          message: "Select Staff should not be empty",
        });
      }
    } else {
      Toast({
        type: "error",
        message: "You are not allowed to do this transaction",
      });
    }
  };

  handlePagination = async page => {
    await this.setState({ page: page });
    this.getServices({ page: page });
  };
  handlemainPagination = page => {
    this.getCart(page);
  };
  handleMenuChange = async ({ target: { value, name } }) => {
    let menuId = Object.assign({}, this.state.menuId);
    menuId = value;
    await this.setState({ menuId });

    this.getRange();

    this.getServices({});
  };

  handleRangeChange = async ({ target: { value, name } }) => {
    let rangeId = Object.assign({}, this.state.rangeId);
    let rangeName = Object.assign({}, this.state.rangeName);
    let { rangeOption } = this.state;
    rangeId = value;

    for (let key of rangeOption) {
      if (key.value == value) {
        rangeName = key.label;
      }
    }

    await this.setState({
      rangeId,
      rangeName,
    });
    this.getServices({});
  };

  handleSelectedService = async data => {
    let { ExchangeItem } = this.state;
    await this.setState({
      SelectedExchangeItem: data,
    });
    if (Number(data.item_price) > Number(ExchangeItem.unit_amount)) {
      this.setState({ isHandleExchangeConfirmation: true });
    } else {
      this.handleExchangePostAction();
    }
  };

  handleExchangePostAction = () => {
    let { basicApptDetail } = this.props;
    let { ExchangeItem, SelectedExchangeItem } = this.state;
    let payload = [];
    let obj = {
      cust_noid: this.props.match.params.id,
      cart_date: dateFormat(new Date(), "yyyy-mm-dd"),
      itemcodeid: SelectedExchangeItem.id,
      price: ExchangeItem.unit_amount,
      item_uom: null,
      treatment_account: ExchangeItem.TreatmentAccountid,
      treatment: ExchangeItem.id,
      ori_stockid: ExchangeItem.stockid,
    };
    payload.push(obj);
    console.log(payload, "exchange input");
    this.props
      .getCommonApi(
        `itemcart/Check/?cart_date=${dateFormat(
          new Date(),
          "yyyy-mm-dd"
        )}&cust_noid=${this.props.match.params.id}`
      )
      .then(res => {
        if (res.data.length === 0) {
          this.props
            .commonCreateApi("itemcart/TrmtDoneCartCreate/", payload)
            .then(res => {
              console.log(res, "result of exchnage final click");
              this.setState({
                activeTab: "treatment",
                isOpenExchangeService: false,
              });
              history.push("/admin/cart");
            });
        } else {
          this.props
            .commonCreateApi(
              `itemcart/TrmtDoneCartCreate/?cart_id=${res.cart_id}`,
              payload
            )
            .then(res => {
              // this.props.handleCartCreated()
              this.setState({
                activeTab: "treatment",
                isOpenExchangeService: false,
              });
              history.push("/admin/cart");
            });
        }
      });
  };
  handleDialogExchangeConfirm = () => {
    this.setState({
      isHandleExchangeConfirmation: false,
      SelectedExchangeItem: {},
    });
  };

  handleLoginConfirmationDialog = async (item, type) => {
    debugger;
    let { tokenDetails } = this.props;

    let selectedItem = {};
    let selectedType = "";
    selectedItem = item;
    selectedType = type;
    await this.setState({ selectedItem, selectedType });
    if (selectedType == "reversal") {
      if (tokenDetails.reversalusernamepopup) {
        //reversal flag update based on backend api response
        await this.setState(prevState => ({
          isLoginConfirmation: !prevState.isLoginConfirmation,
        }));
      } else {
        this.handleReversalTreatment();
      }
    } else {
      if (tokenDetails.exchangetdusernamepopup) {
        //exchange flag update based on backend api response
        await this.setState(prevState => ({
          isLoginConfirmation: !prevState.isLoginConfirmation,
        }));
      } else {
        this.handleExchangeClick();
      }
    }
  };
  render() {
    let {
      productCard = {},
      list,
      tstaffList = [],
      selectedYear,
      yearList,
      isOpenTreatmentDone,
      headerDetails,
      tsStaff,
      isOpenReversal,
      treatmentIds,
      activeMenu,
      isOpenExchangeService,
      menuOption,
      menuId,
      rangeOption,
      rangeId,
      isHandleExchangeConfirmation,
      ExchangeItem,
      SelectedExchangeItem,
      cust_data,
      mainMeta,
      isLoginConfirmation,
    } = this.state;
    let localtStaffList = [...tstaffList];
    let { basicApptDetail, t, tokenDetails } = this.props;
    let { dataList = [], meta = {} } = productCard;
    let { pagination } = meta;
    return (
      <div className="treatmentDone-menu">
        <div className="row">
          <div className="col-10">
            <div className="beautesoft-navlink customer-detail mt-3">
              <div className="filled-tabs">
                <div className="tabs-block">
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeMenu === "treatmentdone",
                        })}
                        onClick={() => {
                          this.toggle("treatmentdone");
                        }}
                      >
                        {t("Treatment Done")}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeMenu === "treatmenthistory",
                        })}
                        onClick={() => {
                          this.toggle("treatmenthistory");
                        }}
                      >
                        {t("Treatment History")}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </div>
            </div>
          </div>
          <div className="col-2">
            <NormalButton
              buttonClass={"mx-2"}
              mainbg={true}
              className="fs-15 clear-line"
              label="Back"
              outline={false}
              onClick={() => history.push(`/admin/cart`)}
            />
          </div>
        </div>
        <div className="treatment-section ml-1 p-2 pr-0">
          <TabContent activeTab={this.state.activeMenu}>
            <TabPane tabId="treatmentdone">
              {activeMenu === "treatmentdone" ? (
                <div className="row treatment-done-new p-3">
                  <div className="col-10 header">
                    <p className="fs-18 font-700 mb-3 title">
                      {t("Available Treatments")}
                    </p>
                    <div className="d-flex">
                      <div className="col-4">
                        <div className="d-flex">
                          <label className="col-4">{t("Select Year")}</label>

                          <div className="input-group">
                            <NormalSelect
                              // placeholder="Enter here"
                              options={yearList}
                              value={selectedYear}
                              name="selectedYear"
                              onChange={this.handleYearChange}
                              className="selected-year mb-2 py-0 w-75"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="d-flex justify-content-start align-self-center">
                          <div className="col-md-12">
                            <p>
                              {t("Customer Name")} : {cust_data.cust_name}
                            </p>
                            <p>
                              {t("Reference")} : {cust_data.cust_refer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`col-12 cart-item`}>
                    <div className={`item-list`}>
                      <div className="table">
                        <TableWrapper
                          headerDetails={headerDetails}
                          queryHandler={this.handlemainPagination}
                          pageMeta={mainMeta}
                          // isEmpty={tstaffList.length === 0 ? true:false}
                        >
                          {tstaffList.length > 0
                            ? tstaffList.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div
                                        className={`text-left ${
                                          !item.iscurrentloggedinsalon
                                            ? "text-danger"
                                            : ""
                                        }`}
                                      >
                                        {item.site_code}
                                      </div>
                                    </td>
                                    <td className="position-relative status-type">
                                      <div className={`text-right`}>
                                        {item.treatment_date}
                                      </div>
                                    </td>
                                    <td>
                                      <div className={`text-left`}>
                                        {item.course}
                                      </div>
                                    </td>
                                    <td>
                                      <div className={`text-left`}>
                                        {item.transacno_ref}
                                      </div>
                                    </td>

                                    <td>
                                      <div className={`text-right`}>
                                        {item.unit_amount}
                                      </div>
                                    </td>

                                    <td>
                                      <div className={`text-left`}>
                                        {item.treatment_code}
                                      </div>
                                    </td>
                                    <td>
                                      <div className={`text-right`}>
                                        {item.td}
                                      </div>
                                    </td>
                                    <td>
                                      <div className={`text-right`}>
                                        {item.rev}
                                      </div>
                                    </td>
                                    <td>
                                      <div className={`text-right`}>
                                        {item.open}
                                      </div>
                                    </td>
                                    <td>
                                      <div className={`text-right`}>
                                        {item.ar}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        style={{
                                          width: "50px",
                                          // textAlign: "right",
                                        }}
                                        value={item.session}
                                        onChange={e =>
                                          this.changeIndexSession(
                                            index,
                                            e.target.value,
                                            item
                                          )
                                        }
                                        className={`text-right`}
                                        min={`0`}
                                        max={item.open}
                                        disabled={
                                          item.session_flag &&
                                          item.session !== Number(0)
                                            ? true
                                            : false
                                        }
                                      />
                                    </td>
                                    <td style={{ width: "50px" }}>
                                      <button
                                        className="btnRedeem"
                                        onClick={() =>
                                          this.handleAddstaff(item)
                                        }
                                      >
                                        {t("Select")}
                                      </button>
                                    </td>
                                    <td style={{ width: "50px" }}>
                                      {item.iscurrentloggedinsalon ||
                                      (item.is_reversal && item.is_allow) ? (
                                        <button
                                          className="btnReversal"
                                          // onClick={() =>
                                          //   this.handleReversalTreatment(item)
                                          // }
                                          onClick={() =>
                                            this.handleLoginConfirmationDialog(
                                              item,
                                              "reversal"
                                            )
                                          }
                                        >
                                          {t("Select")}
                                        </button>
                                      ) : null}
                                    </td>
                                    <td style={{ width: "50px" }}>
                                      {item.exchange_flag && (
                                        <button
                                          className="btnExchange"
                                          label="Exchange"
                                          onClick={() =>
                                            this.handleLoginConfirmationDialog(
                                              item,
                                              "exchange"
                                            )
                                          }
                                        >
                                          {t("Select")}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            : null}
                        </TableWrapper>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 pt-4 action-bar">
                    <div className="row">
                      <div className="col-7 d-flex">
                        {/* <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="fs-15 clear-line"
                                label="Clear Line"
                                outline={false}
                                onClick={this.handleClearLine}
                            />
                            <NormalButton
                                buttonClass={"mx-2"}
                                mainbg={true}
                                className="fs-15 clear-all"
                                label="Clear All"
                                outline={false}
                                onClick={this.handleClearAll}
                            /> */}
                      </div>
                      <div className="col-5">
                        <div className="row">
                          <div className="col-6 text-right"></div>
                          <div className="col-6 text-right">
                            <NormalButton
                              buttonClass={"mx-2"}
                              mainbg={true}
                              className=" fs-15 confirm"
                              label="Confirm Treatment Done"
                              outline={false}
                              onClick={() => this.handleCartCreated()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <NormalModal
                    className={"transaction-done-exchange"}
                    style={{ minWidth: "70%" }}
                    modal={isOpenExchangeService}
                    handleModal={this.handleDialog}
                  >
                    <img
                      onClick={this.handleDialog}
                      className="close cursor-pointer"
                      src={closeIcon}
                      alt=""
                    />
                    <div className="d-flex mb-2">
                      <div className="col-md-3 input-group pl-2 range-filter">
                        <NormalSelect
                          // placeholder="Enter here"
                          options={menuOption}
                          value={menuId}
                          name={"menuId"}
                          onChange={this.handleMenuChange}
                          className="py-0"
                        />
                      </div>

                      <div className="col-md-4 input-group range-filter">
                        <NormalSelect
                          // placeholder="Enter here"
                          options={rangeOption}
                          value={rangeId}
                          name={"rangeId"}
                          onChange={this.handleRangeChange}
                          className="py-0"
                        />
                      </div>
                    </div>
                    <div className="">
                      {console.log(list, "card list")}
                      <div className="services m-0 row">
                        {list.length > 0
                          ? list.map((data, index) => {
                              return (
                                <div
                                  className="col-md-2 col-12 fs-12 p-2 cursor-pointer"
                                  key={data.id}
                                  onClick={() =>
                                    this.handleSelectedService(data)
                                  }
                                >
                                  <div className="service-tab p-0">
                                    <div className="service-ttl px-2 font-700 fs-11">
                                      {data.item_desc}
                                    </div>
                                    <div className="price px-2 py-1">
                                      <div className="non-retail">
                                        <span className="text-orenge font-700">
                                          $
                                        </span>
                                        <span className="text-orenge font-700">
                                          {data.item_price
                                            ? Number(data.item_price).toFixed(2)
                                            : ""}
                                        </span>

                                        <span className="foc-icon">
                                          <svg
                                            width="32"
                                            height="32"
                                            className="cursor-pointer"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <circle
                                              cx="16"
                                              cy="16"
                                              r="15.5"
                                              fill="rgba(60, 64, 135, 0.31)"
                                              stroke="#3C4087"
                                            />
                                            <path
                                              d="M3.996 11.456H9.42V12.476H5.22V15.152H9.18V16.172H5.22V20H3.996V11.456ZM14.3243 20.096C13.5163 20.096 12.8123 19.92 12.2123 19.568C11.6203 19.208 11.1603 18.7 10.8323 18.044C10.5123 17.388 10.3523 16.616 10.3523 15.728C10.3523 14.832 10.5123 14.056 10.8323 13.4C11.1523 12.744 11.6123 12.24 12.2123 11.888C12.8123 11.536 13.5163 11.36 14.3243 11.36C15.1403 11.36 15.8443 11.536 16.4362 11.888C17.0363 12.24 17.4963 12.744 17.8163 13.4C18.1363 14.056 18.2963 14.828 18.2963 15.716C18.2963 16.612 18.1363 17.388 17.8163 18.044C17.4963 18.7 17.0363 19.208 16.4362 19.568C15.8363 19.92 15.1323 20.096 14.3243 20.096ZM14.3243 19.088C15.1803 19.088 15.8443 18.796 16.3163 18.212C16.7963 17.628 17.0363 16.796 17.0363 15.716C17.0363 14.644 16.7963 13.82 16.3163 13.244C15.8443 12.66 15.1803 12.368 14.3243 12.368C13.4683 12.368 12.8043 12.66 12.3323 13.244C11.8603 13.82 11.6243 14.644 11.6243 15.716C11.6243 16.796 11.8603 17.628 12.3323 18.212C12.8123 18.796 13.4763 19.088 14.3243 19.088ZM23.7598 20.096C22.9358 20.096 22.2158 19.92 21.5998 19.568C20.9918 19.208 20.5238 18.7 20.1958 18.044C19.8678 17.388 19.7038 16.612 19.7038 15.716C19.7038 14.828 19.8678 14.056 20.1958 13.4C20.5238 12.744 20.9918 12.24 21.5998 11.888C22.2158 11.536 22.9358 11.36 23.7598 11.36C24.3438 11.36 24.8838 11.452 25.3798 11.636C25.8838 11.812 26.3078 12.072 26.6518 12.416L26.2198 13.328C25.8198 13 25.4238 12.764 25.0318 12.62C24.6478 12.468 24.2278 12.392 23.7718 12.392C22.8838 12.392 22.1958 12.68 21.7078 13.256C21.2278 13.832 20.9878 14.652 20.9878 15.716C20.9878 16.788 21.2278 17.616 21.7078 18.2C22.1958 18.776 22.8838 19.064 23.7718 19.064C24.2278 19.064 24.6478 18.992 25.0318 18.848C25.4238 18.696 25.8198 18.456 26.2198 18.128L26.6518 19.04C26.3078 19.384 25.8838 19.648 25.3798 19.832C24.8838 20.008 24.3438 20.096 23.7598 20.096Z"
                                              fill="#3C4087"
                                            />
                                          </svg>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="images">
                                      <img src={data.Stock_PIC} alt="" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          : ""}
                        {pagination && (
                          <Pagination
                            handlePagination={this.handlePagination}
                            pageMeta={pagination}
                          />
                        )}
                      </div>
                    </div>
                  </NormalModal>
                  <NormalModal
                    className={"transaction-done-reversal"}
                    style={{ minWidth: "75%" }}
                    modal={isOpenReversal}
                    handleModal={this.handleDialog}
                  >
                    <img
                      onClick={this.handleDialog}
                      className="close cursor-pointer"
                      src={closeIcon}
                      alt=""
                    />
                    <Reversal
                      id={this.props.match.params.id}
                      treatmentId={tsStaff.id}
                      reversalId={treatmentIds}
                      cartId={this.props.id}
                      handleModal={this.handleDialog}
                    ></Reversal>
                  </NormalModal>
                  <NormalModal
                    className={"transaction-done-modal"}
                    style={{ minWidth: "60%" }}
                    modal={isOpenTreatmentDone}
                    handleModal={this.handleDialog}
                  >
                    <img
                      onClick={this.handleDialog}
                      className="close cursor-pointer"
                      src={closeIcon}
                      alt=""
                    />
                    <SelectStaff
                      id={this.state.selectedItemTreatmentIds}
                      //id={tsStaff.id}
                      session={this.state.selectedSession}
                      cartId={basicApptDetail.cartId}
                      handleModal={this.handleDialog}
                    ></SelectStaff>
                  </NormalModal>
                  <NormalModal
                    className={"transaction-done-reversal"}
                    style={{ minWidth: "432px" }}
                    modal={isHandleExchangeConfirmation}
                    handleModal={this.handleDialogExchangeConfirm}
                  >
                    <img
                      onClick={this.handleDialogExchangeConfirm}
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
                          <p>
                            {t("Service Price")} : $
                            {SelectedExchangeItem.item_price}
                            &nbsp;{t("larger than")}
                          </p>
                          <p>
                            {t("Previous Service Price")} : $
                            {ExchangeItem.unit_amount}
                          </p>
                        </div>
                        <div className="col-12 mb-2">
                          <p>{t("Are you sure want to continue")} ?</p>
                        </div>
                        <div className="row p-3">
                          <div className="col-6">
                            <NormalButton
                              label="Confirm"
                              mainbg={true}
                              name="Exconfirm"
                              className={`w-100 col-12`}
                              onClick={this.handleExchangePostAction}
                            />
                          </div>
                          <div className="col-6">
                            <NormalButton
                              label="Cancel"
                              resetbg={true}
                              name="ExCancel"
                              className={`w-100 col-12`}
                              onClick={this.handleDialogExchangeConfirm}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </NormalModal>
                </div>
              ) : null}
            </TabPane>
            <TabPane tabId="treatmenthistory">
              {activeMenu === "treatmenthistory" ? (
                <div className="treatment-done-new p-3">
                  <TreatmentHistoryCart
                    customerNumber={this.props.match.params.id}
                  />
                </div>
              ) : null}
            </TabPane>
          </TabContent>
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
        </div>
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
      commonCreateApi,
      commonPatchApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const TreatmentDone = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(TreatmentDoneClass)
);
