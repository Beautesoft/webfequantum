import React, { Component } from "react";
import { NormalButton, NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";
import { commonCreateApi, getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
export class StaffSortingClass extends Component {
  state = {
    selectedList: [],
    currentSelection: {},
    isSelected: {
      selectedItem: false,
      selectedId: 0,
    },
    index: 0,
    SortedEmployee: [],
    filterDate: new Date(),
    staffSortlist: [],
  };
  componentWillMount() {
    this.setState({ filterDate: this.props.filterDate });
    this.getStaffForSorting();
  }
  getStaffForSorting = () => {
    this.setState({ staffSortlist: [] });
    let { filterDate, staffSortlist } = this.state;
    this.props
      .getCommonApi(
        `appointmentsort/?date=${dateFormat(filterDate, "yyyy-mm-dd")}`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          for (let value of data) {
            staffSortlist.push({ value: value.id, label: value.display_name });
          }
          this.setState({ staffSortlist });
        }
      });
  };
  currentselection = async item => {
    let { currentSelection, isSelected } = this.state;
    currentSelection["value"] = item.value;
    currentSelection["label"] = item.label;
    await this.setState({
      currentSelection,
    });
    isSelected["selectedId"] = item.value;
    isSelected["selectedItem"] = true;
    await this.setState({ isSelected });
  };
  removefromsort = async (item, index) => {
    var array = [...this.state.selectedList]; // make a separate copy of the array
    let filterList = array.find(account => account.value === item.value);
    if (filterList) {
      array.splice(index, 1);
      await this.setState({ selectedList: array });
    }
  };
  addSingleSelect = async () => {
    let { selectedList, currentSelection } = this.state;

    if (currentSelection && currentSelection.value) {
      let filterList = selectedList.find(
        account => account.value === currentSelection.value
      );
      if (filterList) {
        filterList["value"] = currentSelection.value;
        filterList["label"] = currentSelection.label;
        this.setState({ ...this.state.selectedList, filterList });
        this.setState({ currentSelection: {} });
      } else {
        let data = {};
        data["value"] = currentSelection.value;
        data["label"] = currentSelection.label;
        selectedList.push(data);
        this.setState({ ...selectedList, selectedList });
        this.setState({ currentSelection: {} });
      }
    } else {
      Toast({ type: "error", message: "Please select Staff" });
      return false;
    }
  };
  addAllSelect = async () => {
    await this.setState({ currentSelection: {}, isSelected: {} });
    let { staffSortlist } = this.state;
    await this.setState({ selectedList: staffSortlist });
  };
  handleDialog = () => {
    this.setState({
      selectedList: [],
      currentSelection: {},
      isSelected: {},
      SortedEmployee: [],
    });
    this.props.handleDialog();
  };

  sendEmployeeSortList = async () => {
    let { selectedList, SortedEmployee } = this.state;
    for (let item of selectedList) {
      let value = item.value;
      SortedEmployee.push(value);
    }
    await this.setState({ SortedEmployee });
    if (SortedEmployee.length > 0) {
      let data = { emp_ids: SortedEmployee };
      this.props.commonCreateApi(`appointmentsort/`, data).then(async res => {
        if (res.status === 201) {
          this.props.handleChange();
          this.handleDialog();
        }
      });
    } else {
      Toast({ type: "error", message: "Please select employee order list" });
    }
  };
  render() {
    let { isOpenModal, t } = this.props;
    let { selectedList, isSelected, staffSortlist } = this.state;

    return (
      <NormalModal
        className={"multiple-appointment select-category"}
        style={{ minWidth: "55%" }}
        modal={isOpenModal}
        handleModal={this.handleDialog}
      >
        <img
          onClick={this.handleDialog}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="row pl-2">
          <h4 className="text-left">{t("Staff Sorting")}</h4>
        </div>
        <div className="d-flex justify-content-center p-3">
          <div className="col-md-5 col-11 mt-2 mb-5 mx-3">
            <div className="row mt-4 table-header w-100 m-0">
              <div className="col-12 text-center">{t("Employee List")}</div>
            </div>
            <div className="response-table w-100">
              {staffSortlist && staffSortlist.length > 0 ? (
                staffSortlist.map((item, index) => {
                  return (
                    <div
                      className={`d-flex justify-content-start m-0 table-body w-100 p-1 border border-secondary staff-sort-list ${
                        isSelected.selectedItem &&
                        isSelected.selectedId == item.value
                          ? "active"
                          : ""
                      } `}
                      onClick={() => this.currentselection(item)}
                      key={item.value}
                    >
                      <div className="col-12">{item.label}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100"></div>
              )}
            </div>
          </div>
          <div className="col-md-2 col-3 mt-3 mb-3 mx-3">
            <div className="row mt-4 w-100 m-0">
              <NormalButton
                buttonClass={"mx-2 w-100 p-0"}
                mainbg={true}
                className="confirm"
                label={`>`}
                outline={false}
                onClick={() => this.addSingleSelect()}
              />
            </div>
            <div className="row mt-4 w-100 m-0">
              <NormalButton
                buttonClass={"mx-2 w-100  p-0"}
                mainbg={true}
                className="confirm"
                label={`>>`}
                outline={false}
                onClick={() => this.addAllSelect()}
              />
            </div>
            <div className="row mt-4 w-100 m-0">
              <NormalButton
                buttonClass={"mx-2 w-100  p-0"}
                mainbg={true}
                className="confirm"
                label={`Clear`}
                outline={false}
                onClick={() => {
                  this.setState({
                    selectedList: [],
                    currentSelection: {},
                    isSelected: {},
                  });
                }}
              />
            </div>
          </div>
          <div className="col-md-5 col-11 mt-2 mb-5 mx-3">
            <div className="col-12 mt-4 table-header w-100 m-0">
              <div className="col-9 text-center">{t("Employee Order")}</div>
              <div className="col-3"></div>
            </div>
            <div className="response-table w-100">
              {selectedList.length > 0 ? (
                selectedList.map((item, index) => {
                  return (
                    <div
                      className="d-flex justify-content-start m-0 table-body w-100 p-1 border border-secondary"
                      key={item.value}
                    >
                      <div className="col-10">{item.label}</div>
                      <div
                        className="col-2 remove-icon"
                        onClick={() => this.removefromsort(item, index)}
                      >
                        <i className="icon-close"></i>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100">{t("No Data")}</div>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <div className="col-md-2 col-6">
            <NormalButton
              buttonClass={"w-100  p-0"}
              mainbg={true}
              className="confirm"
              label={`Save`}
              outline={false}
              onClick={() => this.sendEmployeeSortList()}
            />
          </div>
          <div className="col-md-2 col-6">
            <NormalButton
              buttonClass={"w-100 p-0"}
              mainbg={true}
              className="confirm"
              label={`Cancel`}
              outline={false}
              onClick={this.handleDialog}
            />
          </div>
        </div>
      </NormalModal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      commonCreateApi,
      getCommonApi,
    },
    dispatch
  );
};

export const StaffSorting = withTranslation()(
  connect(null, mapDispatchToProps)(StaffSortingClass)
);
