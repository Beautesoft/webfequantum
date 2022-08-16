import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonUpdateApi } from "redux/actions/common";
import {
  NormalButton,
  NormalDate,
  TableWrapper,
  InputSearch,
  NormalMultiSelect,
  NormalCheckbox,
  NormalSelect,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom";
import _ from "lodash";
import updateBtn from "assets/images/edit1.png";
import deleteBtn from "assets/images/delete1.png";
import closeBtn from "assets/images/close.png";
import saveBtn from "assets/images/save.png";
import { history } from "helpers";

import { getTokenDetails } from "redux/actions/auth";

export class StockSettingsClass extends React.Component {
  state = {
    headerDetails: [
      // { label: "Code" },
      { label: "Name" },
      { label: "Authorization" },
    ],
    formFields: {
      user: "",
    },

    authList: [],
    authUserList: [],
    userOption: [],
    storedItemList: [],
    pageMeta: {},

    siteList: [],
    hqonly: false,

    search: "",
    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 4,
    isOpenvoidCheckout: false,
    // isLoading: false,
    // is_loading: false,
    isMounted: true,

    // salesCollectionHeader: [
    //   { label: "Sales Collection" },
    //   { label: "Before Tax" },
    //   { label: "Amount" },
    //   { label: "Qty" },
    // ],
    // nonSalesCollectionHeader: [
    //   { label: "Non Sales Collection" },
    //   { label: "Amount" },
    //   { label: "Qty" },
    // ],
    // deptSalesHeader: [{ label: "Dept Sales" }, { label: "Amount" }],
    // salesTransactionHeader: [
    //   { label: "Sales Transaction" },
    //   { label: "Amount" },
    //   { label: "Paid" },
    //   { label: "Outstanding" },
    // ],
    // ARTransactionHeader: [{ label: "AR Transaction" }, { label: "Amount" }],
    // TreatmentDoneHeader: [
    //   { label: "Customer" },
    //   { label: "Customer Reference" },
    //   { label: "Treatment Done" },
    //   { label: "Description" },
    //   { label: "Staff" },
    //   { label: "Amount" },
    // DayDate: new Date(),
    // runDayEnd: false,
    // reportDate: "",
    // sales_collec: null,
    // sales_trasac: null,
    // ar_trasac: null,
    // treatment_done: null,
    // dept_sales: null,
  };

  componentWillMount() {
    // this.autofillSaved();
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    // let From = new Date();
    // let { formField } = this.state;
    // let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    // formField["fromDate"] = firstdayMonth;
    // this.setState({
    //   formField,
    // });

    this.getDetails();
    this.getSite();
  }

  getSite = () => {
    // this.updateState({ isLoading: true });
    let { siteList, hqonly, page, limit, search } = this.state;
    // let { item_desc } = formField;

    this.props.getCommonApi(`sitecode`).then(async res => {
      console.log(res, "dsfdfaafg");
      for (let item of res.data) {
        if (item.ItemSite_Code == this.props.tokenDetail.site_code) {
          siteList = item;
        }
      }

      this.setState({ siteList });
      console.log("siteList", siteList);

      if (siteList.hq_only == 1) {
        hqonly = true;
      }

      this.setState({ hqonly });
    });
  };

  getDetails = () => {
    // this.updateState({ isLoading: true });
    let { authList, userOption, page, limit, search } = this.state;
    // let { item_desc } = formField;

    this.props.getCommonApi(`authorise`).then(async res => {
      console.log(res, "dsfdfaafg");
      await this.setState({ authList: [] });
      for (let key of res.data) {
        userOption.push({
          value: key.PW_ID,
          label: key.PW_UserLogin,
          code: key.AllDropdown_Desc,
          active: key.Active,
        });
      }
      console.log("userOption", userOption);
      this.setState({ userOption });
      authList = res.data;
      // pageMeta = res.data.meta.pagination;
      // pageMeta = res.data.pagination;
      // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
      // this.setState({ authList, pageMeta });
      // this.setState({ authList });

      console.log("res.data", res.data);
      console.log("authList", authList);
      // console.log('pageMeta',pageMeta)
      this.updateState({
        authList,
        // pageMeta,
        // isLoading: false,
      });
    });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getDetails();
  };
  // pagination
  // handlePagination = page => {
  //   this.queryHandler(page);
  // };

  handlesearch = event => {
    // event.persist();
    console.log(event.target.value);
    let { search } = this.state;
    search = event.target.value;
    this.setState({ search });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.getDetails({});
      }, 500);
    }
    this.debouncedFn();
  };

  handleClick = key => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      active: !prevState.active,
      currentIndex: key,
    }));
  };

  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  handleChange = ({ target: { value, name } }) => {
    let formFields = Object.assign({}, this.state.formFields);
    let { authUserList, authList } = this.state;

    formFields[name] = value;
    console.log("value", value);
    console.log("name", name);

    for (let userList of authList) {
      if (userList.PW_ID == value) {
        authUserList = userList;
      }
    }

    authUserList = [
      {
        id: authUserList.PW_ID,
        name: "Purchase Order(PO)",
        auth: authUserList.POaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Approved PO",
        auth: authUserList.POapprovalaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Delivery Order(DO)",
        auth: authUserList.DOaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Goods Receive Note",
        auth: authUserList.GRNaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Goods Return Note",
        auth: authUserList.VGRNaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Stocks Adjustment",
        auth: authUserList.ADJaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Transfer In",
        auth: authUserList.TFRFaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Transfer Out",
        auth: authUserList.TFRTaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "StockTake",
        auth: authUserList.PHYaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Stock Usage Memo",
        auth: authUserList.SUMaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "Stock Report",
        auth: authUserList.Sheetaccess == 1 ? true : false,
      },
      {
        id: authUserList.PW_ID,
        name: "PO HQ",
        auth: authUserList.POhqaccess == 1 ? true : false,
      },
    ];

    this.updateState({
      formFields,
      authUserList,
    });
    this.getDetails();
    // this.props.storeItemDetails(storedItemList, formFields)
  };

  handleSubmit = async () => {
    let { authUserList } = this.state;

    const formData = new FormData();

    let formList = [
      "POaccess",
      "POapprovalaccess",
      "DOaccess",
      "GRNaccess",
      "VGRNaccess",
      "ADJaccess",
      "TFRFaccess",
      "TFRTaccess",
      "PHYaccess",
      "SUMaccess",
      "Sheetaccess",
      "POhqaccess",
    ];

    for (let i = 0; i < authUserList.length; i++) {
      formData.append(formList[i], authUserList[i].auth == true ? 1 : 0);
      console.log("formList[i]", formList[i]);
      console.log("authUserList[i].auth", authUserList[i].auth);
    }

    console.log("formData", formData);
    var resAuth = await this.props.commonUpdateApi(
      `authorise/${authUserList[0].id}/`,
      formData
    );

    console.log(resAuth);
    // // this.handleAddressSubmit(resADJ);
    // this.handleItemDetailsSubmit(resADJ);
    // // if(statusValue == "Void"){
    // //   console.log("in void loop")
    // //   await this.props.deletePO(`${this.props.match.params.id}/`)
    // // }

    history.push(`/admin/inventory`);
  };

  handleChangeCheckbox = name => {
    let { authUserList } = this.state;
    for (let list of authUserList) {
      if (list.name == name) {
        list.auth = !list.auth;
      }
    }

    this.setState(authUserList);
    console.log("authUserList in handlechangecheckbox", authUserList);
  };

  handleSubmitSite = async () => {
    let { hqonly, siteList } = this.state;

    const formData = new FormData();

    formData.append("hq_only", hqonly == true ? 1 : 0);

    console.log("formData", formData);
    var resSite = await this.props.commonUpdateApi(
      `sitecode/${siteList.ItemSite_ID}/`,
      formData
    );

    console.log(resSite);
    history.push(`/admin/inventory`);
  };

  handleChangeCheckboxSite = () => {
    let { hqonly } = this.state;

    hqonly = !hqonly;

    this.setState({ hqonly });
    console.log("hqonly handlechangecheckbox", hqonly);
  };

  render() {
    let {
      headerDetails,
      hqonly,
      pageMeta,
      authUserList,
      userOption,
      formFields,
    } = this.state;

    let { user } = formFields;

    let { t } = this.props;

    return (
      <div className=" stockSettings col-md-10 align-items-center">
        <div className="col-md-12 mb-5">
          <p className="label-head mt-4">{t("Site Mode")}</p>
        </div>

        <div className="row mb-5">
          <div className="col-md-2 col-12 "></div>

          <div className="col-md-6 col-12 pt-2 mb-5">
            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Simplified HQ Only Mode")}
              </label>
              <div className="input-group">
                <NormalCheckbox
                  type="checkbox"
                  checked={hqonly}
                  name="site"
                  onChange={() => this.handleChangeCheckboxSite()}
                />
              </div>
            </div>
          </div>

          <div className="col-md-2 col-12 mb-5">
            <NormalButton
              buttonClass={"mx-2"}
              mainbg={true}
              className="confirm"
              label="save"
              onClick={() => this.handleSubmitSite()}
            />
          </div>
        </div>

        {/* <div className="col-md-12 d-flex mb-5">
              <p className="label-head mt-4">{t("User Authorization ")}</p>
        </div>

        <div className="row mb-2">
            <div className="col-md-2 col-12"></div>

            <div className="col-md-8 col-12">
              <div className="d-flex mb-2">
                <label className="text-left w-30 text-black common-label-text mr-2  pt-2">
                  {t("User")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={userOption}
                    value={user}
                    name="user"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>       

          </div>



        <div className="py-4">
            <div className="table-container">

              <TableWrapper
                headerDetails={headerDetails}
              >
                {


                authUserList
                  ? authUserList.map((item, index) => {
                      let {
                        name,
                        auth
                        
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              { name }
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                            <NormalCheckbox
                                type="checkbox"
                                checked={auth}
                                name="auth"
                                onChange={()=>this.handleChangeCheckbox(name)}
                            />
                            </div>
                          </td>
                          
                                   
                        </tr>
                      );
                    })
                  : null}
                
              
              </TableWrapper >

        

                

                
                
              
            </div>
          </div>

          <div className="row justify-content-end">

          <div className="col-md-4 col-12 my-3 ">
                  <NormalButton
                    buttonClass={"mx-2"}
                    mainbg={true}
                    className="confirm"
                    label="save"
                    onClick={() => this.handleSubmit()}
                  />
            </div> */}

        {/* </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetail: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonUpdateApi,
      getTokenDetails,
      // getProject
    },
    dispatch
  );
};

export const StockSettings = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(StockSettingsClass)
);
