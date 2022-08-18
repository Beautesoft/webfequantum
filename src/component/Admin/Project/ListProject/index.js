import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  getProjectStatus,
  getJobtitle,
} from "redux/actions/common";
import {
  NormalButton,
  NormalDate,
  TableWrapper,
  NormalMultiSelect,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput } from "component/common";
import { Link } from "react-router-dom";
import updateBtn from "../../../../assets/images/edit1.png";
import deleteBtn from "../../../../assets/images/delete1.png";
import { getProject, deleteProject } from "redux/actions/project";
import { getTokenDetails } from "redux/actions/auth";
import _ from "lodash";
import CustomerSearch from "component/Admin/Quantum/CustomerSearch";

export class ListProjectClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Project Title" },
      { label: "Customer Name" },
      { label: "Status" },
      // { label: "Action" },
      { label: "Edit" },
      { label: "Delete" },
    ],

    projectList: [],
    pageMeta: {
      // per_page: 8,
      // current_page: 1,
      // total: 7,
      // total_pages: 1
      // chunk: 10,
      // page: 1,
      // total: 10,
      // totalPages: 2,
    },

    formField: {
      projectTitle: "",
      status: "",
      custName: "",
    },
    statusOption: [],

    selectedStatus: [],
    statusArr: [],
    statusStr: "",

    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 5,
    isOpenvoidCheckout: false,
    // is_loading: false,
    // isMounted: true,

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

  // componentWillUnmount() {
  //   this.state.isMounted = false;
  // }

  // updateState = data => {
  //   if (this.state.isMounted) this.setState(data);
  // };

  componentDidMount() {
    // let From = new Date();
    // let { formField } = this.state;
    // let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    // formField["fromDate"] = firstdayMonth;
    // this.setState({
    //   formField,
    // });

    this.getProjects();
    // this.queryHandler({});
  }

  componentWillMount = () => {
    console.log("this.props in list project", this.props);
    console.log("this.props.tokenDetail", this.props.tokenDetail);
    console.log(
      "this.props.tokenDetail.username",
      this.props.tokenDetail.username
    );
    this.getStatus();
  };

  // componentWillUnmount = () => {
  //   this.handleMultiSelect()
  // }

  // updateState = data => {
  //   if (this.state.isMounted) this.setState(data);
  // };

  handleMultiSelect = e => {
    let { selectedStatus, statusArr, statusStr } = this.state;
    selectedStatus = e;
    console.log("selectedStatus", selectedStatus);

    this.setState({
      statusStr: "",
      statusArr: [],
    });

    for (let key of selectedStatus) {
      statusArr.push(key.label);
    }
    statusStr = statusArr.toString();
    console.log("statusArr", statusArr);
    console.log("statusStr", statusStr);

    // this.updateState({});
    this.setState({
      statusStr,
    });
  };
  // handleMultiSelect = () => {
  //   // let { projectList, pageMeta, formField, page, limit } = this.state;
  //   // let { projectTitle, status, custName } = formField;

  //   // this.formField.status = e;
  //   // console.log("this.formField.status",this.formField.status)
  //   // this.setState({ this.formField.status });

  //   let { formField } = this.state;
  //   formField[status] = value;
  //   await this.setState({
  //     formField,
  //   });
  // };

  // handleChange = async ({ target: { value, name } }) => {
  //   let { formField } = this.state;
  //   formField[name] = value;
  //   await this.setState({
  //     formField,
  //   });
  // };

  getProjects = () => {
    let {
      projectList,
      pageMeta,
      formField,
      page,
      limit,
      statusStr,
      statusArr,
    } = this.state;
    let { projectTitle, status, custName } = formField;

    // let From = new Date();
    // if (fromDate && fromDate !== "") {
    //   From = fromDate;
    // } else {
    //   this.setState({ fromDate: From });
    // }
    // let To = new Date();
    // if (toDate && toDate !== "") {
    //   To = toDate;
    // } else {
    //   this.setState({ toDate: To });
    // }
    console.log("statusStr in getprojects:", statusStr);
    console.log("statusArr in getprojects:", statusArr);
    console.log(
      "this.props.tokenDetail.username",
      this.props.tokenDetail.username
    );

    this.props
      .getCommonApi(
        `projectlist/?searchtitle=${projectTitle}&searchstatus=${statusStr}&searchname=${custName}&page=${page}&limit=${limit}`
      )
      .then(async res => {
        console.log(res, "dsfdfaafg");
        await this.setState({ projectList: [] });
        projectList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.pagination;
        // pageMeta = {per_page:2, current_page:1, total:2, total_pages:4}
        this.setState({ projectList, pageMeta });
        // this.setState({ projectList });
        console.log("projectList", projectList);
        console.log("pageMeta", pageMeta);
        console.log("statusStr after clear", statusStr);
        console.log("statusArr after clear", statusArr);
      });
  };

  getStatus = () => {
    let { statusOption } = this.state;
    statusOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props.getCommonApi(`dropdownproject`).then(res => {
      // activeMenu = []
      console.log("res.data", res);
      for (let key of res.data) {
        statusOption.push({
          value: key.id,
          label: key.dropdown_item,
          code: key.dropdown_desc,
          active: key.active,
        });
      }
      console.log("statusOption", statusOption);
      this.setState({ statusOption });
    });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getProjects();
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

  handleSearch = () => {
    this.getProjects();
    console.log("projectStatusList", this.props.projectStatusList);
  };

  // seach change with api call
  // handlesearch = event => {
  //   event.persist();

  //   if (!this.debouncedFn) {
  //     this.debouncedFn = _.debounce(() => {
  //       let searchString = event.target.value;
  //       let data = { search: searchString };
  //       this.queryHandler(data);
  //     }, 500);
  //   }
  //   this.debouncedFn();
  // };

  // getProject = async data => {
  //   this.updateState({ isLoading: true });
  //   let { search } = this.state;
  //   let { page = 1, limit = 10 } = data;
  //   await this.props
  //     .getProject(`?page=${page}&limit=${limit}&search=${search}`)
  //     .then(res => {
  //       let { data } = res;
  //       console.log(data);
  //       //  let { customerDetails } = this.props;
  //       this.updateState({
  //         customerList: data.dataList,
  //         meta: data.meta?.pagination,
  //         isLoading: false,
  //       });
  //     });
  // };

  // api call for staff
  // queryHandler = async data => {
  //   this.updateState({ is_loading: true });
  //   let { page = 1, limit = 10 } = data;
  //   await this.props.getProject(
  //     `?page=${page}&limit=${limit}`
  //   );
  //   let { projectDetails } = this.props;
  //   let { projectList, pageMeta } = this.state;
  //   projectList = projectDetails.data;
  //   pageMeta = projectDetails.meta?.pagination;
  //   this.updateState({
  //     projectList,
  //     pageMeta,
  //     is_loading: false,
  //   });
  // };

  // delete api call for staff
  handleDeleteProject = id => {
    this.props.deleteProject(`${id}/`).then(res => this.getProjects({}));
  };
  handleClick = key => {
    if (!this.state.visible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  };
  handleCustomerSearch = async event => {
    // event.persist();
    let { formField, visible } = this.state;
    formField.custName = event.target.value;
    await this.setState({ formField, visible: true });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.search();
      }, 500);
    }
    this.debouncedFn();
  };
  search = searchString => {
    let { formField } = this.state;
    this.props
      .getCommonApi(`custappt/?search=${formField.custName}`)
      .then(key => {
        let { status, data } = key;

        if (status === 200) {
          this.setState({ customerOption: data });
        }
      });
  };

  handleSelectCustomer = async data => {
    let { formField } = this.state;
    formField["custName"] = data.cust_name;
    await this.setState({
      formField,
      customerOption: [],
    });
    this.handleClick();
  };

  render() {
    let {
      headerDetails,
      pageMeta,
      projectList,
      formField,
      statusOption,
      customerOption,
      visible,
    } = this.state;
    let { tokenDetail } = this.props;

    let { projectTitle, status, custName } = formField;

    let { t } = this.props;

    return (
      <div className="project-section col-md-10 align-items-center">
        <div className="col-md-12 d-flex">
          {/* <p className="label-head mb-4">{t("Project Listing")}</p> */}
          <p className="label-head mb-4">{t("Project")}</p>
        </div>

        <div className="row m-0 filter">
          <div className="col-md-4 col-12">
            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Project Title")}
              </label>
              <div className="input-group">
                <NormalInput
                  value={projectTitle}
                  name="projectTitle"
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-md-5 col-12">
            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Customer Name")}
              </label>
              <div className="input-group">
                <NormalInput
                  placeholder="Search Customer.."
                  value={custName}
                  name="custName"
                  onChange={this.handleCustomerSearch}
                  onClick={this.handleClick}
                />
              </div>
            </div>
          </div>

          <div className="col-md-3 col-12">
            <NormalButton
              buttonClass={"mx-2 mb-3"}
              mainbg={true}
              className="confirm"
              label="Search"
              outline={false}
              onClick={this.handleSearch}
            />
          </div>
        </div>

        <div className="row m-0 filter">
          <div className="col-md-9 col-12">
            <div className="d-flex mb-2">
              <label className="text-black common-label-text mr-2">
                {t("Status")}
              </label>
              <div className="input-group">
                {/* <NormalInput
                  value={status}
                  name="status"
                  onChange={this.handleChange}
                /> */}
                <NormalMultiSelect
                  options={statusOption}
                  // value={status}
                  // name="status"
                  handleMultiSelect={this.handleMultiSelect}
                />
              </div>
            </div>
          </div>

          {/* <div className="col-md-2 col-12"></div> */}

          <div className="col-md-3 col-12">
            <NormalButton
              buttonClass={"mx-2"}
              mainbg={true}
              className="confirm"
              label="Add project"
              onClick={() => this.props.history.push("project/add")}
            />
          </div>
        </div>
        {visible ? (
          <CustomerSearch
            t={t}
            customerOption={customerOption}
            handleSelectCustomer={item => this.handleSelectCustomer(item)}
          />
        ) : null}
        <div className="project-table">
          <div className="py-4">
            <div className="table-container">
              <TableWrapper
                headerDetails={headerDetails}
                queryHandler={this.handlePagination}
                pageMeta={pageMeta}
              >
                {projectList
                  ? projectList.map((item, index) => {
                      let { title, customer_name, status, id } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {title}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {customer_name}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {status}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <img
                                src={updateBtn}
                                width="35"
                                height="35"
                                alt=""
                                className="action-img bg-transparent"
                                onClick={() =>
                                  this.props.history.push(
                                    `/admin/project/${id}/editProject`
                                  )
                                }
                              />
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <img
                                src={deleteBtn}
                                width="35"
                                height="35"
                                alt=""
                                className="action-img bg-transparent"
                                onClick={() => this.handleDeleteProject(id)}
                              />
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
  // projectStatusList: state.common.projectStatusList,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      deleteProject,
      getTokenDetails,
      // getProjectStatus,
      // getJobtitle,
    },
    dispatch
  );
};

export const ListProject = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListProjectClass)
);
