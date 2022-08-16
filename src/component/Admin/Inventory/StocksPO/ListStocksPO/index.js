import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import {
  NormalButton,
  NormalDate,
  TableWrapper,
  NormalSelect,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom";
import printBtn from "assets/images/print.png";
import deleteBtn from "assets/images/delete1.png";
import { getProject, deleteProject } from "redux/actions/project";
import { getTokenDetails } from "redux/actions/auth";
import { history } from "helpers";
import Blur from "react-css-blur";

export class ListStocksPOClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Date" },
      { label: "PO Number" },
      { label: "Supplier" },
      { label: "Contact Person" },
      { label: "Total Qty" },
      { label: "Total Amount" },
      { label: "Status" },
    ],

    POList: [],
    contactOption: [],
    statusOption: [],
    supOption: [],
    pageMeta: {
      // chunk: 10,
      // page: 1,
      // total: 10,
      // totalPages: 2,
      // chunk: 2,
      // page: 1,
      // total: 8,
      // totalPages: 4,
    },

    formField: {
      fromDate: new Date(),
      toDate: new Date(),
      supplier: "",
      contactPerson: "",
      PONumber: "",
      status: "",
    },

    blur: false,

    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 5,
    isOpenvoidCheckout: false,
    // is_loading: false,
    // isMounted: true,
  };

  componentDidMount() {
    let From = new Date();
    let { formField } = this.state;
    let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    formField["fromDate"] = firstdayMonth;
    this.setState({
      formField,
    });

    this.getContact();
    // this.queryHandler({});
  }

  getStatus = () => {
    let { statusOption, blur } = this.state;
    statusOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`dropdown`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        statusOption.push({
          value: key.id,
          label: key.AllDropdown_Item,
          code: key.AllDropdown_Desc,
          active: key.Active,
        });
      }

      console.log("statusOption", statusOption);
      this.setState({ statusOption }, () => {
        this.getPO();
      });
      if (
        this.props.tokenDetail.role_code !== "1" &&
        this.props.tokenDetail.role_code !== "2"
      ) {
        console.log(
          "this.props.tokenDetail.role_code",
          this.props.tokenDetail.role_code
        );
        blur = true;
        this.setState({ blur });
        console.log("blur", blur);
      }
    });
  };

  getSup = () => {
    let { supOption } = this.state;
    supOption = [];
    this.props.getCommonApi(`itemsupply`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        supOption.push({
          value: key.SPLY_CODE,
          label: key.SUPPLYDESC,
          // code: key.itm_code,
          // active: key.itm_isactive,
        });
      }
      console.log("supOption", supOption);
      this.setState({ supOption }, () => {
        this.getStatus();
      });
    });
  };

  getContact = () => {
    let { contactOption } = this.state;
    contactOption = [];
    this.props.getCommonApi(`supplycontactinfo`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        contactOption.push({
          value: key.ContactInfo_ID,
          label: key.ContactInfo_Name,
          suppCode: key.Supplier_Code,
          active: key.Active,
        });
      }
      console.log("contactOption", contactOption);
      this.setState({ contactOption }, () => {
        this.getSup();
      });
    });
  };

  getPO = () => {
    let {
      POList,
      pageMeta,
      formField,
      page,
      limit,
      statusOption,
      contactOption,
    } = this.state;
    let { fromDate, toDate, supplier, contactPerson, PONumber, status } =
      formField;

    let From = new Date();
    if (fromDate && fromDate !== "") {
      From = fromDate;
    } else {
      this.setState({ fromDate: From });
    }
    let To = new Date();
    if (toDate && toDate !== "") {
      To = toDate;
    } else {
      this.setState({ toDate: To });
    }

    // console.log("this.props.tokenDetail.site_code",this.props.tokenDetail.site_code)
    console.log("supplier", supplier);
    console.log("statusOption in getpo", statusOption);
    console.log("status in getpo", status);
    // console.log("status",statusOption.find(option => option.value === parseInt(status)).label)
    this.props
      .getCommonApi(
        // `polist/?page=${page}&limit=${limit}`
        `polist/?searchfrom=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&searchto=${dateFormat(To, "yyyy-mm-dd")}&searchsitecode=${
          this.props.tokenDetail.site_code
        }&searchsupply=${supplier}&searchcontactperson=${
          contactPerson && contactOption
            ? contactOption.find(
                option => option.value === parseInt(contactPerson)
              ).label
            : ""
        }&searchpono=${PONumber}&searchstatus=${
          status && statusOption
            ? statusOption.find(option => option.value === parseInt(status))
                .label
            : ""
        }&page=${page}&limit=${limit}`
      )
      .then(async res => {
        console.log(res, "dsfdfaafg");
        await this.setState({ POList: [] });
        POList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        this.setState({ POList, pageMeta });
        // this.setState({ POList });
        console.log("res.data", res.data);
        console.log("POList", POList);
        console.log("pageMeta", pageMeta);
      });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getPO();
  };
  // pagination
  // handlePagination = page => {
  //   this.queryHandler(page);
  // };

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

  handleChange = async ({ target: { value, name } }) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
  };

  handleDatePick = async (name, value) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
  };

  handleSearch = () => {
    this.getPO();
  };

  render() {
    let {
      headerDetails,
      pageMeta,
      POList,
      formField,
      statusOption,
      supOption,
      contactOption,
      blur,
    } = this.state;

    let { fromDate, toDate, supplier, contactPerson, PONumber, status } =
      formField;

    let { t } = this.props;

    return (
      <div className="PO-section col-md-11 align-items-center">
        <div className="col-md-12 d-flex">
          <p className="label-head mb-4">{t("Stocks PO Listing")}</p>
        </div>

        <div className="d-flex flex-wrap m-0 filter">
          <div className="col-md-5 col-12">
            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("From Date")}
              </label>
              <div className="input-group">
                <NormalDateTime
                  onChange={this.handleDatePick}
                  inputcol="p-0 inTime"
                  value={fromDate ? new Date(fromDate) : new Date()}
                  name="fromDate"
                  //className="dob-pick"
                  showYearDropdown={true}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date(toDate)}
                  showDisabledMonthNavigation
                />
              </div>
            </div>

            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Supplier")}
              </label>
              <div className="input-group">
                <NormalSelect
                  options={supOption}
                  value={supplier}
                  name="supplier"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("PO Number")}
              </label>
              <div className="input-group">
                <NormalInput
                  value={PONumber}
                  name="PONumber"
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-md-5 col-12">
            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("To Date")}
              </label>
              <div className="input-group">
                <NormalDateTime
                  onChange={this.handleDatePick}
                  inputcol="p-0 inTime"
                  value={toDate ? new Date(toDate) : new Date()}
                  name="toDate"
                  // className="dob-pick"
                  showYearDropdown={true}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date(fromDate)}
                  showDisabledMonthNavigation
                />
              </div>
            </div>

            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Contact Person")}
              </label>
              <div className="input-group">
                <NormalSelect
                  options={contactOption}
                  value={contactPerson}
                  name="contactPerson"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Status")}
              </label>
              <div className="input-group">
                <NormalSelect
                  options={statusOption}
                  value={status}
                  name="status"
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-md-2 col-12">
            <NormalButton
              buttonClass={"py-3"}
              mainbg={true}
              className="confirm"
              label="Search"
              outline={false}
              onClick={this.handleSearch}
            />

            <NormalButton
              buttonClass={"pb-3"}
              mainbg={true}
              className="confirm"
              label="Add Stocks PO"
              outline={false}
              onClick={() => history.push("inventory/stockspo/add")}
            />
          </div>
        </div>

        <div className="project-table">
          <div className="py-4">
            <div className="table-container">
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
                pageMeta={pageMeta}
              >
                {POList
                  ? POList.map((item, index) => {
                      let {
                        PO_ID,
                        PO_NO,
                        PO_DATE,
                        SUPP_Code,
                        contactPerson,
                        PO_TTQTY,
                        PO_TTAMT,
                        PO_STATUS,
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {PO_DATE}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <Link to={`inventory/stockspo/${PO_ID}/edit`}>
                                {PO_NO}
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {SUPP_Code && supOption
                                ? supOption.find(
                                    option => option.value === SUPP_Code
                                  ).label
                                : ""}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {contactPerson}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {PO_TTQTY}
                            </div>
                          </td>
                          <Blur radius={blur ? "10px" : ""}>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {PO_TTAMT}
                              </div>
                            </td>
                          </Blur>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {PO_STATUS}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            </div>
          </div>
        </div>
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
      getTokenDetails,
      // deleteProject,
      // getProject
    },
    dispatch
  );
};

export const ListStocksPO = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListStocksPOClass)
);
