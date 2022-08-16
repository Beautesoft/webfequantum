import React from "react";
import { Toast } from "service/toast";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import { NormalButton, NormalDate, NormalSelect, TableWrapper } from "component/common";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import { NormalInput, NormalDateTime } from "component/common";
import { Link } from "react-router-dom"; 

export class AddressClass extends React.Component {
  state = {
    // headerDetails: [
    //     { label: "Date" },
    //     { label: "Quotation Number" },
    //     { label: "Total Amount" },
    //     { label: "Status" },
    //     { label: "Prepared By" },
    // ],
    
    // addressList: [],
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

    formFieldsBilling: {
      to: "",
      address1:"",
      address2:"",
      address3:"",
      postalCode:"",
      city:"",
      state:"",
      country:"",
      
    },

    formFieldsShipping: {
      to: "",
      address1:"",
      address2:"",
      address3:"",
      postalCode:"",
      city:"",
      state:"",
      country:"",
      
    },

    countryOption:[],
    stateOption:[],
    cityOption:[],
    
    active: false,
    // currentIndex: -1,
    // page: 1,
    // // limit: 10,
    // limit: 2,
    // isOpenvoidCheckout: false,
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

    // this.getAddress();
    // this.queryHandler({});
  };

  componentWillMount() {
    this.getCountry();
    this.getState();
    this.getCity();

    console.log("this.props.formFieldsBillingStored.to",this.props.formFieldsBillingStored.to);
    this.autofillSaved();
  };

  autofillSaved = () => {
    let { formFieldsBilling, formFieldsShipping } = this.state;

    formFieldsBilling.to = this.props.formFieldsBillingStored.to
    formFieldsBilling.address1 = this.props.formFieldsBillingStored.address1
    formFieldsBilling.address2 = this.props.formFieldsBillingStored.address2
    formFieldsBilling.address3 = this.props.formFieldsBillingStored.address3
    formFieldsBilling.postalCode = this.props.formFieldsBillingStored.postalCode
    formFieldsBilling.city = this.props.formFieldsBillingStored.city
    formFieldsBilling.state = this.props.formFieldsBillingStored.state
    formFieldsBilling.country = this.props.formFieldsBillingStored.country
    
    formFieldsShipping.to = this.props.formFieldsShippingStored.to
    formFieldsShipping.address1 = this.props.formFieldsShippingStored.address1
    formFieldsShipping.address2 = this.props.formFieldsShippingStored.address2
    formFieldsShipping.address3 = this.props.formFieldsShippingStored.address3
    formFieldsShipping.postalCode = this.props.formFieldsShippingStored.postalCode
    formFieldsShipping.city = this.props.formFieldsShippingStored.city
    formFieldsShipping.state = this.props.formFieldsShippingStored.state
    formFieldsShipping.country = this.props.formFieldsShippingStored.country
    this.setState({formFieldsBilling, formFieldsShipping})
    console.log("formFieldsBilling in autofillSaved", formFieldsBilling)
    console.log("formFieldsShipping in autofillSaved", formFieldsShipping)
  }

  getCountry = () => {
    let { countryOption } = this.state;
    countryOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props
      .getCommonApi(`country`)
      .then(res => {
        console.log("res.data", res);
        for (let key of res.data) {
          countryOption.push({
            value: key.itm_id,
            label: key.itm_desc,
            code: key.itm_code,
            active: key.itm_isactive,
          });
        }
        console.log("countryOption", countryOption)
        this.setState({ countryOption });
      });
  };

  getState = () => {
    let { stateOption } = this.state;
    stateOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props
      .getCommonApi(`state`)
      .then(res => {
        console.log("res.data", res);
        for (let key of res.data) {
          stateOption.push({
            value: key.itm_id,
            label: key.itm_desc,
            code: key.itm_code,
            active: key.itm_isactive,
          });
        }
        console.log("stateOption", stateOption)
        this.setState({ stateOption });
      });
  };

  getCity = () => {
    let { cityOption } = this.state;
    cityOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props
      .getCommonApi(`city`)
      .then(res => {
        console.log("res.data", res);
        for (let key of res.data) {
          cityOption.push({
            value: key.itm_id,
            label: key.itm_desc,
            code: key.itm_code,
            active: key.itm_isactive,
          });
        }
        console.log("cityOption", cityOption)
        this.setState({ cityOption });
      });
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

  handleChangeBilling = async ({ target: { value, name } }) => {
    let { formFieldsBilling, formFieldsShipping } = this.state;
    formFieldsBilling[name] = value;
    this.setState({
      formFieldsBilling,
    });
    console.log("formFieldsBilling",formFieldsBilling)
    console.log("this.props", this.props)
    this.props.storeAddressFields(formFieldsBilling, formFieldsShipping)
  };

  handleChangeShipping = async ({ target: { value, name } }) => {
    let { formFieldsBilling, formFieldsShipping } = this.state;
    formFieldsShipping[name] = value;
    this.setState({
      formFieldsShipping,
    });
    console.log("formFieldsShipping",formFieldsShipping)
    this.props.storeAddressFields(formFieldsBilling, formFieldsShipping)
  };

  handleCopy = () => {
    let { formFieldsBilling, formFieldsShipping } = this.state;

    formFieldsShipping.to = formFieldsBilling.to
    formFieldsShipping.address1 = formFieldsBilling.address1
    formFieldsShipping.address2 = formFieldsBilling.address2
    formFieldsShipping.address3 = formFieldsBilling.address3
    formFieldsShipping.postalCode = formFieldsBilling.postalCode
    formFieldsShipping.city = formFieldsBilling.city
    formFieldsShipping.state = formFieldsBilling.state
    formFieldsShipping.country = formFieldsBilling.country

    this.setState(formFieldsShipping)
    this.props.storeAddressFields(formFieldsBilling, formFieldsShipping)
    console.log("formFieldsShipping after copy", formFieldsShipping)
  }

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
  //   let { addressList, pageMeta } = this.state;
  //   addressList = projectDetails.data;
  //   pageMeta = projectDetails.meta?.pagination;
  //   this.updateState({
  //     addressList,
  //     pageMeta,
  //     is_loading: false,
  //   });
  // };

  // // delete api call for staff
  // handleDeleteProject = id => {
  //   this.props.deleteProject(`${id}/`).then(res => this.queryHandler({}));
  // };
  
  

  render() {
    let { formFieldsBilling, formFieldsShipping, countryOption, stateOption, cityOption } = 
      this.state;

    // let {
    //   to,
    //   address1,
    //   address2,
    //   address3,
    //   postalCode,
    //   city,
    //   state,
    //   country,
    // } = formFields
    
    let {t} =this.props;
    
    return (
      <div className="row">
      <div className="col-5">

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black font-weight-bold fs-17 pl-5 pt-2">
            {t("Billing Address")}
          </label>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("To")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsBilling.to}
              name="to"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("Address 1")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsBilling.address1}
              name="address1"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("Address 2")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsBilling.address2}
              name="address2"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("Address 3")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsBilling.address3}
              name="address3"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("Postal Code")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsBilling.postalCode}
              name="postalCode"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("City")}
          </label>
          <div className="input-group-address w-100">
            <NormalSelect
              options={cityOption}
              disabled={this.props.disableEdit}
              value={formFieldsBilling.city}
              name="city"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("State")}
          </label>
          <div className="input-group-address w-100">
            <NormalSelect
              options={stateOption}
              disabled={this.props.disableEdit}
              value={formFieldsBilling.state}
              name="state"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17 pl-5 pt-2">
            {t("Country")}
          </label>
          <div className="input-group-address w-100">
            <NormalSelect
              options={countryOption}
              disabled={this.props.disableEdit}
              value={formFieldsBilling.country}
              name="country"
              onChange={this.handleChangeBilling}
            />
          </div>
        </div>
        

      </div>

      <div className="col-2">
        <NormalButton
          buttonClass={"copy-btn"}
          mainbg={true}
          className="confirm"
          label="Copy >>"
          outline={false}
          onClick={this.handleCopy}              
        />
      </div>

      <div className="col-5 pr-5">

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black font-weight-bold fs-17 pt-2">
            {t("Shipping Address")}
          </label>
        </div>
         
        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("To")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsShipping.to}
              name="to"
              onChange={this.handleChangeShipping}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("Address 1")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsShipping.address1}
              name="address1"
              onChange={this.handleChangeShipping}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("Address 2")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsShipping.address2}
              name="address2"
              onChange={this.handleChangeShipping}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("Address 3")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsShipping.address3}
              name="address3"
              onChange={this.handleChangeShipping}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("Postal Code")}
          </label>
          <div className="input-group-address w-100">
            <NormalInput
              placeholder="Enter here"
              disabled={this.props.disableEdit}
              value={formFieldsShipping.postalCode}
              name="postalCode"
              onChange={this.handleChangeShipping}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("City")}
          </label>
          <div className="input-group-address w-100">
            <NormalSelect
              options={cityOption}
              disabled={this.props.disableEdit}
              value={formFieldsShipping.city}
              name="city"
              onChange={this.handleChangeShipping}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("State")}
          </label>
          <div className="input-group-address w-100">
            <NormalSelect
              options={stateOption}
              disabled={this.props.disableEdit}
              value={formFieldsShipping.state}
              name="state"
              onChange={this.handleChangeShipping}
            />
          </div>
        </div>

        <div className="d-flex mb-3"> 
          <label className="text-left w-100 text-black common-label-text fs-17  pt-2">
            {t("Country")}
          </label>
          <div className="input-group-address w-100">
            <NormalSelect
              options={countryOption}
              disabled={this.props.disableEdit}
              value={formFieldsShipping.country}
              name="country"
              onChange={this.handleChangeShipping}
            />
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



export const Address =withTranslation()( connect(
  null,
  mapDispatchToProps
)(AddressClass));




