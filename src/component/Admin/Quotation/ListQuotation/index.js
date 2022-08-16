import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import { NormalButton, NormalDate, TableWrapper, NormalMultiSelect } from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom"; 
import updateBtn from  "../../../../assets/images/edit1.png"
import deleteBtn from  "../../../../assets/images/delete1.png"
import { getProject, deleteProject } from "redux/actions/project";

export class ListQuotationClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Date" },
      { label: "Quotation Number" },
      { label: "Customer Name" },
      { label: "Project Name" },
      { label: "Total Amount" },
      { label: "Status" },
    ],
    
    quotationList: [],
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
      custName: "",
      quoNumber:"",
      projectName:"",
      status:""
    },
    
    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 5,
    isLoading: true,
    isOpenvoidCheckout: false,
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

  // componentWillUnmount() {
  //   this.state.isMounted = false;
  // }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    let From = new Date();
    let { formField } = this.state;
    let firstdayMonth = new Date(From.getFullYear(), From.getMonth(), 1);
    formField["fromDate"] = firstdayMonth;
    this.setState({
      formField,
    });

    this.getQuotations();
    // this.queryHandler({});
  }

  

  getQuotations = () => {
    this.updateState({ isLoading: true });
    let { quotationList, pageMeta, formField, page, limit } = this.state;
    let { fromDate, toDate, custName, quoNumber, projectName, status } = formField;

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
      `quotationlist/?searchfrom=${dateFormat(
        From,
        "yyyy-mm-dd"
      )}&searchto=${dateFormat(
        To,
        "yyyy-mm-dd"
      )}&searchtitle=${projectName}&searchstatus=${status}&searchname=${custName}&searchnumber=${quoNumber}&page=${page}&limit=${limit}`
    )
      .then(async res => {
        console.log(res, "dsfdfaafg");
        await this.setState({ quotationList: [] });
        quotationList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        this.setState({ quotationList, pageMeta });
        this.updateState({
          isLoading: false,
        });
        // this.setState({ quotationList });
        console.log('res.data',res.data)
        console.log('quotationList',quotationList)
        console.log('pageMeta',pageMeta)
      });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getQuotations();
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
    this.getQuotations();
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
  //   let { quotationList, pageMeta } = this.state;
  //   quotationList = projectDetails.data;
  //   pageMeta = projectDetails.meta?.pagination;
  //   this.updateState({
  //     quotationList,
  //     pageMeta,
  //     is_loading: false,
  //   });
  // };

  // // delete api call for staff
  // handleDeleteProject = id => {
  //   this.props.deleteProject(`${id}/`).then(res => this.queryHandler({}));
  // };
  
  

  render() {
    let { headerDetails, pageMeta, quotationList, formField, isLoading} = 
      this.state;

    

    // quotationList = [{"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},   
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"},
    // {"projectTitle":"project1", "custName":"cust1", "status":"Pending"}]
    // console.log(quotationList)

    let { fromDate, toDate, custName, quoNumber, projectName, status } = formField;
    
    let {t} =this.props;
    
    return (
      <div className="project-section col-md-10 align-items-center">
        <div className="col-md-12 d-flex">
            <p className="label-head mb-4">{t("Quotation Listing")}</p>
        </div>

        <div className="row m-0 filter">
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
                {t("Customer Name")}
              </label>
              <div className="input-group">
                <NormalInput
                  value={custName}
                  name="custName"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Quotation Number")}
              </label>
              <div className="input-group">
                <NormalInput
                  value={quoNumber}
                  name="quoNumber"
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
                {t("Project Name")}
              </label>
              <div className="input-group">
                <NormalInput
                  value={projectName}
                  name="projectName"
                  onChange={this.handleChange}
                />
              </div>             
            </div>

            <div className="d-flex mb-2">
              <label className="text-left w-100 text-black common-label-text mr-2">
                {t("Status")}
              </label>
              <div className="input-group">
                <NormalInput
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
              label="Add Quotation"
              outline={false}
              onClick={() =>
                this.props.history.push("quotation/add")
              }               
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
                {isLoading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">{t("Loading...")}</span>
                            </div>
                          </div>
                        </td>
                      </tr>

                ) : quotationList
                  ? quotationList.map((item, index) => {
                      let {
                        id,
                        status,
                        title,
                        quotation_number,
                        created_at,
                        in_charge,
                        total_amount
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {created_at}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <Link to={`quotation/${id}/editQuotation`}>
                                {quotation_number }
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {in_charge}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {title}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {total_amount }
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {status}
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

// const mapStateToProps = state => ({
//   projectDetail: state.project.projectDetail,
// });

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      // deleteProject,
      // getProject
    },
    dispatch
  );
};



export const ListQuotation =withTranslation()( connect(
  null,
  mapDispatchToProps
)(ListQuotationClass));
