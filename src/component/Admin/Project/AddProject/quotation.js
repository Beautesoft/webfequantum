import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import { NormalButton, NormalDate, TableWrapper } from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom";

export class QuotationClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Date" },
      { label: "Quotation Number" },
      { label: "Total Amount" },
      { label: "Status" },
      { label: "Prepared By" },
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

    // formField: {
    //   date: "",
    //   quotation:"",
    //   user:"",
    // },

    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 2,
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

    this.getQuotation();
    // this.queryHandler({});
  }

  getQuotation = () => {
    let { quotationList, pageMeta, page, limit } = this.state;
    // let { fromDate, toDate, custName, quoNumber, projectName, status } = formField;

    this.props
      .getCommonApi(
        `quotationlist/?searchprojectid=${this.props.fk_id}&page=${page}&limit=${limit}`
      )
      .then(async res => {
        console.log(res, "dsfdfaafg");
        await this.setState({ quotationList: [] });
        quotationList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        this.setState({ quotationList, pageMeta });
        // this.setState({ quotationList });
        console.log("res.data", res.data);
        console.log("quotationList", quotationList);
        console.log("pageMeta", pageMeta);
      });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getQuotation();
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

  //   handleChange = async ({ target: { value, name } }) => {
  //     let { formField } = this.state;
  //     formField[name] = value;
  //     await this.setState({
  //       formField,
  //     });
  //   };

  //   handleDatePick = async (name, value) => {
  //     let { formField } = this.state;
  //     formField[name] = value;
  //     await this.setState({
  //       formField,
  //     });
  //   };

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
    let { headerDetails, pageMeta, quotationList } = this.state;

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

    // let { fromDate, toDate, custName, quoNumber, projectName, status } = formField;

    let { t } = this.props;

    return (
      <div className="py-4">
        <div className="table-container">
          <TableWrapper
            headerDetails={headerDetails}
            queryHandler={this.handlePagination}
            pageMeta={pageMeta}
          >
            {quotationList
              ? quotationList.map((item, index) => {
                  let {
                    created_at,
                    quotation_number,
                    total_amount,
                    status,
                    in_charge,
                    id,
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
                          {/* <Link to={`/admin/quotation/${id}/editQuotation`}>  */}
                          <Link
                            to={{
                              pathname: `/admin/quantum/quotation/${id}/edit`,
                              state: { projectFk: this.props.fk_id },
                            }}
                          >
                            {quotation_number}
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {total_amount}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {status}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          {in_charge}
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </TableWrapper>

          <div className="col-2 mt-5 float-right">
            <Link
              to={{
                pathname: "/admin/quantum/quotation/add",
                state: { projectFk: this.props.fk_id },
              }}
            >
              <NormalButton
                buttonClass={"mx-2 mb-3"}
                mainbg={true}
                className="confirm"
                label="Add"
                outline={false}
                // onClick={this.props.history.push({
                //   pathname: '/admin/quotation/add',
                //   state: { projectFk: this.props.fk_id }
                // })}
              />
            </Link>
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

export const Quotation = withTranslation()(
  connect(null, mapDispatchToProps)(QuotationClass)
);
