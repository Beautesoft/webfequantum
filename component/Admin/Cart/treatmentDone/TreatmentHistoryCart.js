import React, { Component } from "react";
import { TableWrapper, NormalSelect } from "component/common";
import { updateForm, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { TreatmentUsagePopup } from "./TreatmentUsagePopup";
import { withTranslation } from "react-i18next";
import { Toast } from "service/toast";

export class ListTreatmentHistoryCartClass extends Component {
  state = {
    headerDetails: [
      { label: "Branch" },
      { label: "Trans Date", divClass: "justify-content-end text-right" },
      { label: "Purc Date", divClass: "justify-content-end text-right" },
      { label: "Transac #" },
      { label: "Treatment ID" },
      { label: "Link Code" },
      { label: "Treatment" },
      { label: "Status" },
      { label: "Record Status" },
      { label: "Remarks" },
      { label: "Customer Remarks" },
      { label: "Type" },
    ],
    TreatmentHistory: [],
    treatmentList: [],
    meta: {},
    customerNumber: 0,
    yearList: [],
    selectedYear: new Date().getFullYear(),
    isTreatmentUsagePopup: false,
    TreatmentHistoryId: 0,
    cust_data: {},
  };

  componentDidMount = async () => {
    await this.setState({
      customerNumber: this.props.customerNumber,
    });
    this.props.getCommonApi("treatmentdone/Year/").then(key => {
      let { status, data } = key;
      let { yearList } = this.state;
      for (let value of data) {
        yearList.push({ value: value, label: value });
      }
      this.setState({ yearList });
    });

    this.getTreatmentHistoryList({});
  };

  getTreatmentHistoryList = data => {
    let { customerNumber, selectedYear, TreatmentHistory } = this.state;
    if (customerNumber > 0) {
      let { page = 1, limit = 12, search = "" } = data;
      this.props
        .getCommonApi(
          `treatmenthistory/?year=${selectedYear}&cust_id=${customerNumber}&page=${page}&limit=${limit}`
        )
        .then(async res => {
          await this.setState({ treatmentList: [], meta: {} });
          let { data, status, cust_name, cust_refer } = res;
          console.log(res, "treatmenthistorycart");
          if (status === 200) {
            let cust = {
              cust_name: cust_name,
              cust_refer: cust_refer,
            };
            if (data.dataList) {
              this.setState({
                treatmentList: data.dataList,
                meta: data.meta.pagination,
                cust_data: cust,
              });
            }
          }
        });
    }
  };

  handlehistoryYearChange = async ({ target: { value, name } }) => {
    let { selectedYear } = this.state;
    selectedYear = value;
    await this.setState({
      selectedYear,
    });
    this.getTreatmentHistoryList({});
  };

  handlePagination = page => {
    this.getTreatmentHistoryList(page);
  };

  treatmentUsagePopupclose = () => {
    this.setState(prevState => ({
      isTreatmentUsagePopup: !prevState.isTreatmentUsagePopup,
    }));
  };
  treatmentUsagePopup = data => {
    if (data.is_allow) {
      if (data.status == "Done") {
        this.setState(prevState => ({
          TreatmentHistoryId: data.id,
          isTreatmentUsagePopup: !prevState.isTreatmentUsagePopup,
        }));
      }
    } else {
      Toast({
        type: "error",
        message: "Treatment usage is not allowed in other outlets",
      });
    }
  };

  render() {
    let {
      headerDetails,
      treatmentList,
      meta,
      yearList,
      selectedYear,
      isTreatmentUsagePopup,
      TreatmentHistoryId,
      cust_data,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="d-flex treatment-done-new p-3">
          <div className="col-md-12 col-12 header">
            <div className="d-flex flex-wrap select-year">
              <div className="col-12 col-md-3 pl-0 mb-2 name py-2">
                <div className="col-md-5">
                  <label>{t("Select Year")}</label>
                </div>

                <div className="col-md-6">
                  <NormalSelect
                    // placeholder="Enter here"
                    options={yearList}
                    value={selectedYear}
                    name="selectedYear"
                    onChange={this.handlehistoryYearChange}
                    className="selected-year mb-2 py-0"
                  />
                </div>
              </div>

              <div className="col-md-4 col-12">
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
        <div className="table-container">
          <TableWrapper
            headerDetails={headerDetails}
            queryHandler={this.handlePagination}
            pageMeta={meta}
          >
            {treatmentList && treatmentList.length > 0 ? (
              treatmentList.map((item, index) => {
                let {
                  trasac_date,
                  purchase_date,
                  transac,
                  treatment_code,
                  link_code,
                  course,
                  status,
                  record_status,
                  remarks,
                  cust_remark,
                  type,
                  site_code,
                  is_current,
                } = item;
                return (
                  <tr
                    key={index}
                    onClick={() => this.treatmentUsagePopup(item)}
                  >
                    <td>
                      <div
                        className={`text-left ${
                          !is_current ? "other-branch" : ""
                        }`}
                      >
                        {site_code}
                      </div>
                    </td>
                    <td>
                      <div className={`text-right`}>{trasac_date}</div>
                    </td>
                    <td>
                      <div className={`text-right`}>{purchase_date}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{transac}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{treatment_code}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{link_code}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{course}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{status}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{record_status}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{remarks}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{cust_remark}</div>
                    </td>
                    <td>
                      <div className={`"text-left`}>{type}</div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12">
                  <div className="d-flex align-items-center justify-content-center">
                    {t("No Data Available")}
                  </div>
                </td>
              </tr>
            )}
          </TableWrapper>
        </div>
        {isTreatmentUsagePopup ? (
          <TreatmentUsagePopup
            isTreatmentUsagePopup={isTreatmentUsagePopup}
            treatmentUsagePopup={this.treatmentUsagePopup}
            treatmentUsagePopupclose={this.treatmentUsagePopupclose}
            TreatmentHistoryId={TreatmentHistoryId}
          />
        ) : null}
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

export const TreatmentHistoryCart = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListTreatmentHistoryCartClass)
);
