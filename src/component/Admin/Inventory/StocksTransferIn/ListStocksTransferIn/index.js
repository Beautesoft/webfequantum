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

export class ListStocksTransferInClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Date" },
      { label: "DOC Number" },
      { label: "Ref Num 1" },
      { label: "Created By" },
      { label: "Total Qty" },
      { label: "Total Amount" },
      { label: "Status" },
    ],

    stockinList: [],
    empOption: [],
    statusOption: [],
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
      createdBy: "",
      DOCNumber: "",
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

  // componentWillUnmount() {
  //   this.state.isMounted = false;
  // }

  // updateState = data => {
  //   if (this.state.isMounted) this.setState(data);
  // };

  componentDidMount() {
    let From = new Date();
    let { formField } = this.state;
    let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    formField["fromDate"] = firstdayMonth;
    this.setState({
      formField,
    });

    this.getEmp();
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
      for (var i = 0; i < statusOption.length; i++) {
        if (statusOption[i].label == "Approved") {
          statusOption.splice(i, 1);
        }
        if (statusOption[i].label == "Not Approved") {
          statusOption.splice(i, 1);
        }
      }
      console.log("statusOption", statusOption);
      this.setState({ statusOption }, () => {
        this.getIN();
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

  getEmp = () => {
    let { empOption } = this.state;
    empOption = [];
    this.props.getCommonApi(`employeelist`).then(res => {
      console.log("res.data", res);
      for (let key of res.data) {
        empOption.push({
          value: key.Emp_no,
          label: key.Emp_name,
          code: key.Emp_code,
          // active: key.itm_isactive,
        });
      }
      console.log("empOption", empOption);
      this.setState({ empOption }, () => {
        this.getStatus();
      });
    });
  };

  getIN = () => {
    let {
      stockinList,
      pageMeta,
      formField,
      page,
      limit,
      statusOption,
      empOption,
    } = this.state;
    let { fromDate, toDate, createdBy, DOCNumber, status } = formField;

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
    this.props
      .getCommonApi(
        `stockinlist/?searchfrom=${dateFormat(
          From,
          "yyyy-mm-dd"
        )}&searchto=${dateFormat(To, "yyyy-mm-dd")}&searchsitecode=${
          this.props.tokenDetail.site_code
        }&searchcreatedby=${
          createdBy && empOption
            ? empOption.find(option => option.value === parseInt(createdBy))
                .label
            : ""
        }&searchdocno=${DOCNumber}&searchstatus=${
          status && statusOption
            ? statusOption.find(option => option.value === parseInt(status))
                .label
            : ""
        }&page=${page}&limit=${limit}`
      )
      .then(async res => {
        console.log(res, "dsfdfaafg");
        await this.setState({ stockinList: [] });
        stockinList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        this.setState({ stockinList, pageMeta });
        // this.setState({ stockinList });
        console.log("res.data", res.data);
        console.log("stockinList", stockinList);
        console.log("pageMeta", pageMeta);
      });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getIN();
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
    this.getIN();
  };

  render() {
    let {
      headerDetails,
      pageMeta,
      stockinList,
      formField,
      statusOption,
      empOption,
      blur,
    } = this.state;

    let { fromDate, toDate, createdBy, DOCNumber, status } = formField;

    let { t } = this.props;

    return (
      <div className="transferIn-section col-md-11 align-items-center">
        <div className="col-md-12 d-flex">
          <p className="label-head mb-4">{t("Stocks Transfer In Listing")}</p>
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
                {t("Created By")}
              </label>
              <div className="input-group">
                <NormalSelect
                  options={empOption}
                  value={createdBy}
                  name="createdBy"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Doc Number")}
              </label>
              <div className="input-group">
                <NormalInput
                  value={DOCNumber}
                  name="DOCNumber"
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
              label="Add Trasnfer In"
              outline={false}
              onClick={() => history.push("inventory/stockstransferin/add")}
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
                {stockinList
                  ? stockinList.map((item, index) => {
                      let {
                        PO_ID,
                        DOC_NO,
                        DOC_DATE,
                        DOC_REF1,
                        CREATE_USER,
                        DOC_QTY,
                        DOC_AMT,
                        DOC_STATUS,
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {DOC_DATE}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <Link
                                to={`inventory/stockstransferin/${PO_ID}/editstockstransferin`}
                              >
                                {DOC_NO}
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {DOC_REF1}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {CREATE_USER}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {DOC_QTY}
                            </div>
                          </td>
                          <Blur radius={blur ? "10px" : ""}>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {DOC_AMT}
                              </div>
                            </td>
                          </Blur>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {DOC_STATUS}
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

export const ListStocksTransferIn = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListStocksTransferInClass)
);
