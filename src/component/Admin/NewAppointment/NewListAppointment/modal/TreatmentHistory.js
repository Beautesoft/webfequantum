import React, { Component } from "react";
import { InputSearch, TableWrapper } from "component/common";
import { updateForm, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
import _ from "lodash";
import { withTranslation } from "react-i18next";

export class ListTreatmentHistoryClass extends Component {
  state = {
    headerDetails: [
      { label: "Date", divClass: "justify-content-end text-right" },
      { label: "Description", width: "200px" },
      { label: "Staff" },
      { label: "Location", width: "100px" },
      { label: "Course", width: "200px" },
      { label: "Service Staff" },
      { label: "Txn No." },
      { label: "Remark", width: "150px" },
    ],
    treatmentPackageList: [],
    meta: {},
    customerNumber: 0,
    CustomerName: "",
    customerPhone: "",
    CustomerRemark: "",
    cust_data: {},
  };

  componentWillMount = async () => {
    await this.setState({
      customerNumber: this.props.customerNumber,
      CustomerName: this.props.custName,
      customerPhone: this.props.custPhone,
      CustomerRemark: this.props.CustomerRemark,
    });
    this.getPackageList({});
  };

  getPackageList = data => {
    let { customerNumber } = this.state;
    let { page = 1, limit = 10, search = "" } = data;
    this.props
      .getCommonApi(
        `appttreatmentdonehistory/?cust_id=${customerNumber}&page=${page}&limit=${limit}`
      )
      .then(res => {
        let { status, data, cust } = res;
        console.log(res, "trtmnthistoryrespone");
        if (status === 200) {
          if (data) {
            this.setState({
              treatmentPackageList: res.data.dataList,
              meta: res.data.meta.pagination,
              cust_data: cust,
            });
          }
        }
      });
  };

  handlePagination = page => {
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

  render() {
    let {
      headerDetails,
      treatmentPackageList,
      meta,
      CustomerName,
      customerPhone,
      CustomerRemark,
      cust_data,
    } = this.state;
    let { customerId, t } = this.props;
    return (
      <>
        <NormalModal
          className={"multiple-appointment select-category"}
          modal={this.props.isTreatmentHistoryModal}
          style={{ minWidth: "80%", minHeight: "90%" }}
          handleModal={() => {}}
        >
          <img
            onClick={this.props.handleTreatmentHistory}
            className="close"
            src={closeIcon}
            alt=""
          />
          <div className="customer-list p-3">
            <div className="tab-table-content">
              <div className="py-2">
                <div className="col-12 p-2 text-center">
                  <h5 className="fw-500">{t("Treatment History")}</h5>
                </div>
                <div className="d-flex flex-wrap mb-2">
                  <div className="col-12 col-md-3">
                    <div className="col-12">
                      {t("Name")} :{" "}
                      <span className="fw-500 h6">{cust_data.cust_name}</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="col-12">
                      {t("Reference")} :{" "}
                      <span className="fw-500 h6">{cust_data.cust_refer}</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-12">
                    <div className="col-12">
                      {t("Phone")} :{" "}
                      <span className="fw-500 h6">{customerPhone}</span>
                    </div>
                  </div>
                  {this.props.CustomerRemarkFlag ? (
                    <div className="col-md-3 col-12">
                      <div className="col-12">
                        {t("Permanent Remark")} :{" "}
                        <span className="fw-500 h6">{CustomerRemark}</span>
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
                    {treatmentPackageList && treatmentPackageList.length > 0 ? (
                      treatmentPackageList.map((item, index) => {
                        let {
                          date,
                          appt_fr_time,
                          description,
                          staff,
                          itemsite_code,
                          course,
                          service_staff,
                          helper_transacno,
                          new_remark,
                        } = item;
                        return (
                          <tr key={index}>
                            <td>
                              <div className="text-right">
                                {date} {appt_fr_time}
                              </div>
                            </td>
                            <td>
                              <div className="text-left">{description}</div>
                            </td>
                            <td>
                              <div className="text-left">{staff}</div>
                            </td>
                            <td>
                              <div className="text-left">{itemsite_code}</div>
                            </td>
                            <td>
                              <div className="text-left">{course}</div>
                            </td>
                            <td>
                              <div className="text-left">{service_staff}</div>
                            </td>
                            <td>
                              <div className="text-left">
                                {helper_transacno}
                              </div>
                            </td>
                            <td>
                              <div className="text-left">{new_remark}</div>
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

export const TreatmentHistory = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListTreatmentHistoryClass)
);
