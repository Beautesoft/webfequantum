import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { NormalButton, NormalDate, TableWrapper } from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom"; 
import {
  createActivity,
  
} from "redux/actions/project";
import { getTokenDetails } from "redux/actions/auth";

export class ActivitiesClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Date" },
      { label: "Activity" },
      { label: "User" },
    ],

    formFields: {
      dateCreated: new Date(),
      activity: ""
    },
    
    activityList: [],
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

    // formFields: {
    //   date: "",
    //   activity:"",
    //   user:"",
    // },
    
    active: false,
    currentIndex: -1,
    page: 1,
    // limit: 10,
    limit: 3,
    isOpenvoidCheckout: false,
    isLoading: true,
    // is_loading: false,
    isMounted: true,
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };
  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      validators: {},
      element: (message) => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
  };

  componentDidMount() {
    
    this.getActivities();
  }

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  getActivities = () => {
    this.updateState({isLoading: true});
    // console.log("isLoading", isLoading)
    
    let { activityList, pageMeta, page, limit } = this.state;
    console.log("this.prop.fk_id activity page", this.props.fk_id)

    this.props
    .getCommonApi(
      `activitylist/?searchprojectid=${this.props.fk_id}&page=${page}&limit=${limit}`
    )
      .then( res => {
        console.log("this.props.tokenDetail.username",this.props.tokenDetail.username)
        console.log(res, "dsfdfaafg");
        this.setState({ activityList: [] });
        activityList = res.data.dataList;
        // pageMeta = res.data.meta.pagination;
        pageMeta = res.data.pagination;
        // pageMeta = {per_page:5, current_page:1, total:2, total_pages:4}
        this.setState({ activityList, pageMeta });
        // this.setState({ activityList });
        console.log('res.data',res.data)
        console.log('activityList',activityList)
        console.log('pageMeta',pageMeta)
        this.updateState({isLoading: false});
        
      });
    
  };

  // getProjects = () => {
  //   this.props
  //     .getCommonApi(
  //       `projectlist/?searchid=${this.props.fk_id}`
  //     )
  //     .then(async res => {
  //       console.log("project dataList", res.data.dataList);
  //       console.log("project dataList cust name", res.data.dataList[0].customer_name);
  //     });
  // };

  addActivity = () => {
    try {
      if (this.validator.allValid()) {
        // this.updateState({ is_loading: true });
      //   let { formFields } = this.state;
      //   Object.keys(formFields).forEach((e) => {
      //     if (typeof formFields[e] === "boolean")
      //       formFields[e] = formFields[e] ? "True" : "False";
      //   });
      
      // this.updateState({isLoading: true});
        let { formFields } = this.state;

      

        const formData = new FormData();
        formData.append("title", formFields.activity);
        formData.append("fk_project", this.props.fk_id);

        console.log("formFields.dateCreated dateFormat",dateFormat(formFields.dateCreated)+" 00:00:00")
        // console.log("dateFormat(new Date())",dateFormat(new Date()))
        // let date1 = new Date(dateFormat(new Date()));

        // var today = new Date();
        // console.log("today",today)
        // console.log("formFields.dateCreated",formFields.dateCreated)
        // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // var dateTime = date+' '+time;
        // console.log("dateTime",dateTime)
        // console.log("date1.getTime()",date1.getTime())
        // console.log("123123",formFields.dateCreated.getHours() + ":" + formFields.dateCreated.getMinutes() + ":" + formFields.dateCreated.getSeconds())
        formData.append("created_at", dateFormat(formFields.dateCreated) + " "+formFields.dateCreated.getHours() + ":" + formFields.dateCreated.getMinutes() + ":" + formFields.dateCreated.getSeconds());

        formData.append("name", this.props.tokenDetail.username);
        
        console.log("this.props.tokenDetail.username",this.props.tokenDetail.username)
        console.log("formData", formData)
        // if (this.props.match.params.id) {
          console.log("in if loop")
          // var res = 
          this.props.createActivity(
            formData
          ).then(async res => {
            console.log("res",res)
            await this.getActivities()
          })
          // this.props
          //     .commonCreateApi(
          //       `activitylist/`,
          //       formData
          //     )
          //     .then(async res => {
          //       console.log("res",res)
          //       await this.getActivities()
          //     })
          // console.log(res);
        // this.updateState({isLoading: false});
        
        
      } else {
        this.validator.showMessages();
      }
      // this.updateState({ is_loading: false });
    } catch (e) {
      this.updateState({ is_loading: false });
    }
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.getActivities();
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
    let { formFields } = this.state;
    formFields[name] = value;
    await this.setState({
      formFields,
    });
  };

//   handleDatePick = async (name, value) => {
//     let { formFields } = this.state;
//     formFields[name] = value;
//     await this.setState({
//       formFields,
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
  //   let { activityList, pageMeta } = this.state;
  //   activityList = projectDetails.data;
  //   pageMeta = projectDetails.meta?.pagination;
  //   this.updateState({
  //     activityList,
  //     pageMeta,
  //     is_loading: false,
  //   });
  // };

  // // delete api call for staff
  // handleDeleteProject = id => {
  //   this.props.deleteProject(`${id}/`).then(res => this.queryHandler({}));
  // };
  
  

  render() {
    let { headerDetails, pageMeta, activityList, formFields, isLoading} = 
      this.state;

    let { dateCreated, activity } = formFields
    
    let {t} =this.props;
    
    return (
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
                
                ) : activityList
                  ? activityList.map((item, index) => {
                      let {
                        created_at,
                        title,
                        name
                        
                      } = item;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              { created_at }
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              { title }
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              { name }
                            </div>
                          </td>
                          
                                   
                        </tr>
                      );
                    })
                  : null}
                
              
              </TableWrapper>

              <div className="row mt-5">

                <div className="col-1"></div>
                
                <label className="text-left text-black common-label-text fs-17 pt-1 ml-2">
                  {t("Date")}
                </label>
                <div className="col-3">
                  <NormalDate
                    // value={new Date()}
                    showYearDropdown={true}
                    value={dateCreated}
                    name="dateCreated"
                    // type="date"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                    {this.validator.message(
                      t("Date"),
                      dateCreated,
                      t("required")
                    )}
                </div>

                <label className="text-left text-black common-label-text fs-17 pt-1 ">
                    {t("Activity")}
                </label>
                <div className="col-4">
                  <NormalInput
                    placeholder="Enter here"
                    value={activity}
                    name="activity"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                    {this.validator.message(
                      t("Activity"),
                      activity,
                      t("required")
                    )}
                </div>

                <div className="col-2">
                <NormalButton
                  buttonClass={"mx-2 mb-3"}
                  mainbg={true}
                  className="confirm"
                  label="Add"
                  outline={false}
                  onClick={this.addActivity}               
                />
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
      createActivity,
      getTokenDetails,
      commonCreateApi,
      // getProject
    },
    dispatch
  );
};



export const Activities =withTranslation()( connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivitiesClass));




