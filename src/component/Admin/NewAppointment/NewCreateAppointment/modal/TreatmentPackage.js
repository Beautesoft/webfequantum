import React from "react";
import { InputSearch, TableWrapper } from "component/common";
import { updateForm, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
import _ from "lodash";
import { Toast } from "service/toast";
import { withTranslation } from "react-i18next";

export class ListTreatmentPackageClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Course" },
      { label: "Tr. #", divClass: "justify-content-end text-right" },
      { label: "Total", divClass: "justify-content-end text-right" },
      { label: "Price", divClass: "justify-content-end text-right" },
      { label: "Expiry Date", divClass: "justify-content-end text-right" },
      { label: "Balance", divClass: "justify-content-end text-right" },
      { label: "Outstanding", divClass: "justify-content-end text-right" },
    ],
    treatmentPackageList: [],
    meta: {},
    active: false,
    currentIndex: -1,
    isTreatementModal: false,
    formFields: {},
    cust_data: {},
    isLoading: false,
  };

  componentDidMount = () => {
    this.setState({
      isLoading: true,
    });
    this.getPackageList({});
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

  getPackageList = data => {
    this.setState({
      isLoading: true,
    });
    let { page = 1, limit = 10, search = "" } = data;
    this.props
      .getCommonApi(
        `treatmentpackages/?cust_id=${this.props.customerNumber}&page=${page}&limit=${limit}`
      )
      .then(res => {
        console.log(res, "treatmentpackagelistresponse");
        let { status, data, cust_data } = res;
        if (status === 200) {
          if (data) {
            let cust = {};
            cust["cust_name"] = cust_data.cust_name;
            cust["cust_refer"] = cust_data.cust_refer;
            this.setState({
              treatmentPackageList: res.data.dataList,
              meta: res.data.meta.pagination,
              cust_data: cust,
            });
          }
        }
        this.setState({
          isLoading: false,
        });
      });
  };

  handlePagination = page => {
    console.log(page, "dsfsdfsdfsdf");
    this.getPackageList(page);
  };

  // handlesearch = (event) => {
  //     console.log("sadfasdfasdf", event.target.value)
  //     event.persist();

  //     if (!this.debouncedFn) {
  //         this.debouncedFn = _.debounce(() => {
  //             let searchString = event.target.value;
  //             let data = { search: searchString }
  //             this.getPackageList(data)
  //         }, 500);
  //     }
  //     this.debouncedFn();
  // }

  handleDialog = () => {
    let { isTreatementModal } = this.state;
    isTreatementModal = !isTreatementModal;
    this.setState({
      isTreatementModal,
    });
  };

  handleSelectTreatmentPackage = item => {
    if (String(item.type).toUpperCase() == "TD") {
      let { formFields } = this.state;
      formFields["id"] = item.stock_id;
      formFields["item_desc"] = item.item_name;
      formFields["add_duration"] = item.add_duration;
      formFields["Item_CodeName"] = item.item_name;
      formFields["treatment_parentcode"] = item.treatment_parentcode;

      this.setState({
        formFields,
      });
      console.log(formFields);
      this.props.handleSelectPackage(formFields);
      this.props.handleTreatementmodal();
    } else {
      Toast({
        type: "error",
        message: "This Package is not allowed",
      });
    }
  };

  render() {
    let {
      headerDetails,
      treatmentPackageList,
      meta,
      currentIndex,
      active,
      isTreatementModal,
      formFields,
      cust_data,
      isLoading,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <NormalModal
          className={"multiple-appointment select-category"}
          style={{ minWidth: "70%" }}
          modal={this.props.isTreatementModal}
          handleModal={this.props.handleTreatementmodal}
        >
          <img
            onClick={this.props.handleTreatementmodal}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="customer-list container">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="col-12 p-2">
                  <h5 className="fw-500">{t("Treatment")}</h5>
                </div>
                <div className="d-flex flex-noWrap mb-2">
                  <div className="col-3">
                    <div className="col-12">
                      {t("Name")} :{" "}
                      <span className="fw-500 h6">{cust_data.cust_name}</span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="col-12">
                      {t("Reference")} :{" "}
                      <span className="fw-500 h6">{cust_data.cust_refer}</span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="col-12">
                      {t("Phone")} :{" "}
                      <span className="fw-500 h6">{this.props.custPhone}</span>
                    </div>
                  </div>
                  {this.props.CustomerRemarkFlag ? (
                    <div className="col-3">
                      <div className="col-12">
                        {t("Permanent Remark")} :{" "}
                        <span className="fw-500 h6">
                          {this.props.CustomerRemark}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="table-container">
                  <TableWrapper
                    headerDetails={headerDetails}
                    queryHandler={this.handlePagination}
                    pageMeta={meta}
                  >
                    {isLoading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : treatmentPackageList &&
                      treatmentPackageList.length > 0 ? (
                      treatmentPackageList.map((item, index) => {
                        let {
                          item_name,
                          tr_open,
                          tr_done,
                          stock_id,
                          price,
                          expiry,
                          add_duration,
                          treatment_parentcode,
                          balance,
                          outstanding,
                        } = item;
                        return (
                          <tr
                            onClick={() =>
                              this.handleSelectTreatmentPackage(item, index)
                            }
                            key={index}
                          >
                            <td>
                              <div className="text-left">{item_name}</div>
                            </td>
                            <td>
                              <div className="text-right">{tr_open}</div>
                            </td>
                            <td>
                              <div className="text-right">{tr_done}</div>
                            </td>
                            <td>
                              <div className="text-right">{price}</div>
                            </td>
                            <td>
                              <div className="text-right">{expiry}</div>
                            </td>
                            <td>
                              <div className="text-right">{balance}</div>
                            </td>
                            <td>
                              <div className="text-right">{outstanding}</div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12">
                          <div className="d-flex align-items-center justify-content-center">
                            {t("No data available")}
                          </div>
                        </td>
                      </tr>
                    )}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </NormalModal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateForm,
      getCommonApi,
    },
    dispatch
  );
};

export const TreatmentPackage = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListTreatmentPackageClass)
);
