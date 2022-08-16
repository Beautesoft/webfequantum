import React from "react";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Navigation } from "react-minimal-side-navigation";
import { getJobtitle, getCommonApi } from "redux/actions/common";
import {
  getStaffPlus,
  getStaffSchedule,
  getAllEmpSchedule,
  updateStaffPlusSchedule,
} from "redux/actions/staffPlus";
import {
  NormalSelect,
  NormalInput,
  Pagination,
  NormalButton,
} from "component/common";
import { ScheduleTable } from "./SheduleTable";
import { CalenderTable } from "./CalenderTable";
import { BigCalander } from "./BigCalander";
import { withTranslation } from "react-i18next";

class StaffScheduleClass extends React.Component {
  state = {
    currentMenu: "/indi",
    startMonth: new Date(),
    endMonth: new Date(),
    selectedMonth: new Date(),
    fullScheduleMonth: new Date(),
    formFields: {
      ws: [],
      ws_id: "",
      altws: [],
      altws_id: "",
      cal_data: [],
      status: "All",
      staff_data: [],
    },
    pageMeta: {},
    jobOption_selected: "",
    jobOption: [],
    staffList_selected: "",
    staffList: [],
    siteOptions: [],
    filteredSiteOptions: [],
    selected_site: "",
    fullSchedule_selected_site: "",
    isLoading: true,
    isMounted: true,
    scheduleOptions: [],
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentWillMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const menu = queryParams.get("menu");
    if (menu)
      if (menu == "full" || menu == "indi")
        this.updateState({ currentMenu: "/" + menu });
    const date = new Date();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    this.updateState({
      selectedMonth: `${year}-${month}`,
      startMonth: `${year}-${month}`,
      endMonth: `${year}-${month}`,
      fullScheduleMonth: `${year}-${month}`,
    });
    this.getDatafromStore();
  }

  getDatafromStore = async () => {
    await this.props.getJobtitle();
    let scheduleRes = await this.props.getCommonApi("WorkScheduleHours/");
    let siteRes = await this.props.getCommonApi("branchlist/");
    let { jobtitleList } = this.props;
    let {
      jobOption,
      jobOption_selected,
      siteOptions,
      filteredSiteOptions,
      scheduleOptions,
    } = this.state;
    for (let key of jobtitleList) {
      jobOption.push({ label: key.level_desc, value: key.id });
    }
    for (let key of siteRes.data) {
      siteOptions.push({ value: key.itemsite_code, label: key.itemsite_desc });
    }
    for (let key of scheduleRes.schedules) {
      scheduleOptions.push({
        id: key.id,
        value: key.itm_code,
        label: key.itm_desc,
        color: key.itm_color,
        shortDesc: key.shortDesc,
      });
    }

    this.updateState({
      jobOption,
      jobOption_selected,
      siteOptions,
      filteredSiteOptions,
      scheduleOptions,
      isLoading: false,
    });
  };

  updateStaffList = async () => {
    this.updateState({ isLoading: true });
    let { staffList, staffList_selected, formFields, selected_site } =
      this.state;
    formFields.ws = [];
    formFields.altws = [];
    formFields.cal_data = [];
    formFields.staff_data = [];
    staffList_selected = "";
    selected_site = "";
    staffList = [];
    if (this.state.jobOption_selected != "") {
      await this.props.getStaffPlus(
        `?limit=100&EMP_TYPEid=${this.state.jobOption_selected}`
      );

      let { staffPlusDetail } = this.props;

      staffPlusDetail.dataList.forEach(key => {
        staffList.push({
          label: key.emp_name,
          value: key.emp_code,
          sites: key.site_list.map(e => e.site_code),
        });
      });
    }
    this.updateState({
      staffList,
      formFields,
      staffList_selected,
      selected_site,
      isLoading: false,
    });
  };

  updateSiteList = () => {
    let {
      staffList_selected,
      staffList,
      filteredSiteOptions,
      siteOptions,
      selected_site,
      formFields,
    } = this.state;
    selected_site = "";
    formFields.ws = [];
    formFields.altws = [];
    formFields.cal_data = [];
    filteredSiteOptions = [];
    let selected = staffList.find(e => e.value == staffList_selected);
    filteredSiteOptions = siteOptions.filter(e =>
      selected.sites.some(val => val == e.value)
    );
    this.updateState({ filteredSiteOptions, formFields, selected_site });
  };

  getScheduleData = async () => {
    let {
      startMonth,
      endMonth,
      jobOption_selected,
      selected_site,
      staffList_selected,
      formFields,
    } = this.state;
    if (
      selected_site == "" ||
      staffList_selected == "" ||
      jobOption_selected == ""
    )
      return;
    let startDate = new Date(startMonth);
    let d = startDate.getDate();
    let day = d < 10 ? "0" + d : d;
    let a = startDate.getMonth() + 1;
    let month = a < 10 ? "0" + a : a;
    let year = startDate.getFullYear();
    startDate = `${year}-${month}-${1}`;

    let endDate = new Date(endMonth);
    endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    d = endDate.getDate();
    day = d < 10 ? "0" + d : d;
    a = endDate.getMonth() + 1;
    month = a < 10 ? "0" + a : a;
    year = endDate.getFullYear();
    endDate = `${year}-${month}-${day}`;
    this.updateState({ isLoading: true });
    await this.props.getStaffSchedule(
      `?emp_code=${staffList_selected}&site_code=${selected_site}&start=${startDate}&end=${endDate}`
    );
    let { weekSchedule, altWeekSchedule, monthlySchedule } =
      this.props.staffSchedule;
    formFields.ws_id = weekSchedule.id;
    formFields.ws.monday = weekSchedule.monday;
    formFields.ws.tuesday = weekSchedule.tuesday;
    formFields.ws.wednesday = weekSchedule.wednesday;
    formFields.ws.thursday = weekSchedule.thursday;
    formFields.ws.friday = weekSchedule.friday;
    formFields.ws.saturday = weekSchedule.saturday;
    formFields.ws.sunday = weekSchedule.sunday;
    formFields.altws_id = altWeekSchedule.id;
    formFields.altws.monday = altWeekSchedule.monday;
    formFields.altws.tuesday = altWeekSchedule.tuesday;
    formFields.altws.wednesday = altWeekSchedule.wednesday;
    formFields.altws.thursday = altWeekSchedule.thursday;
    formFields.altws.friday = altWeekSchedule.friday;
    formFields.altws.saturday = altWeekSchedule.saturday;
    formFields.altws.sunday = altWeekSchedule.sunday;
    formFields.cal_data = monthlySchedule;
    this.updateState({ formFields, isLoading: false });
  };

  getFullScheduleData = async (page = 1) => {
    let {
      fullSchedule_selected_site,
      fullScheduleMonth,
      formFields,
      pageMeta,
    } = this.state;
    formFields.staff_data = [];
    if (fullSchedule_selected_site == "") {
      return this.updateState({ formFields });
    }
    this.updateState({ isLoading: true });
    let date = new Date(fullScheduleMonth);
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    await this.props.getAllEmpSchedule(
      `?siteCode=${fullSchedule_selected_site}&limit=10&year=${year}&month=${month}&page=${page}`
    );
    let { staffAllEmpSchedule } = this.props;
    pageMeta = staffAllEmpSchedule.pagination;
    formFields.staff_data = staffAllEmpSchedule.fullSchedule;
    this.updateState({ formFields, pageMeta, isLoading: false });
  };

  onJobChanged = e => {
    this.state.jobOption_selected = e.target.value;
    this.updateState({});
    this.updateStaffList();
  };

  onStaffChanged = e => {
    this.state.staffList_selected = e.target.value;
    this.updateState({});
    this.updateSiteList();
  };

  onSiteChange = e => {
    this.state.selected_site = e.target.value;
    this.updateState({});
    this.getScheduleData();
  };

  onSiteOptionChange = e => {
    this.state.selected_site = e.target.value;
    this.updateState({});
    this.getFullScheduleData({});
  };

  onFullScheduleMonthChange = () => {
    this.getFullScheduleData({});
  };

  onFullScheduleSiteChange = e => {
    this.state.fullSchedule_selected_site = e.target.value;
    this.updateState({});
    this.getFullScheduleData({});
  };

  onApplyWSToMonthlySchedule = () => {
    debugger;

    let { ws, cal_data } = this.state.formFields;
    for (let key of cal_data) {
      var date = new Date(key.itm_date);
      var day = date.getDay();
      switch (day) {
        case 0:
          key.itm_type = ws.sunday;
          break;
        case 1:
          key.itm_type = ws.monday;
          break;
        case 2:
          key.itm_type = ws.tuesday;
          break;
        case 3:
          key.itm_type = ws.wednesday;
          break;
        case 4:
          key.itm_type = ws.thursday;
          break;
        case 5:
          key.itm_type = ws.friday;
          break;
        case 6:
          key.itm_type = ws.saturday;
          break;
        default:
          break;
      }
    }
    this.updateState({ cal_data });
  };

  onApplyALTWSToMonthlySchedule = () => {
    debugger;
    let { altws, cal_data } = this.state.formFields;
    for (let key of cal_data) {
      var date = new Date(key.itm_date);
      var day = date.getDay();
      switch (day) {
        case 0:
          key.itm_type = altws.sunday;
          break;
        case 1:
          key.itm_type = altws.monday;
          break;
        case 2:
          key.itm_type = altws.tuesday;
          break;
        case 3:
          key.itm_type = altws.wednesday;
          break;
        case 4:
          key.itm_type = altws.thursday;
          break;
        case 5:
          key.itm_type = altws.friday;
          break;
        case 6:
          key.itm_type = altws.saturday;
          break;
        default:
          break;
      }
    }
    this.updateState({ cal_data });
  };

  onSubmit = async () => {
    let { formFields } = this.state;
    if (formFields.cal_data.length == 0) return;
    this.updateState({ isLoading: true });
    var data = { monthlySchedule: {}, weekSchedule: {}, altWeekSchedule: {} };
    data.monthlySchedule = formFields.cal_data;
    data.weekSchedule.id = formFields.ws_id;
    data.weekSchedule.monday = formFields.ws.monday;
    data.weekSchedule.tuesday = formFields.ws.tuesday;
    data.weekSchedule.wednesday = formFields.ws.wednesday;
    data.weekSchedule.thursday = formFields.ws.thursday;
    data.weekSchedule.friday = formFields.ws.friday;
    data.weekSchedule.saturday = formFields.ws.saturday;
    data.weekSchedule.sunday = formFields.ws.sunday;
    data.altWeekSchedule.id = formFields.altws_id;
    data.altWeekSchedule.monday = formFields.altws.monday;
    data.altWeekSchedule.tuesday = formFields.altws.tuesday;
    data.altWeekSchedule.wednesday = formFields.altws.wednesday;
    data.altWeekSchedule.thursday = formFields.altws.thursday;
    data.altWeekSchedule.friday = formFields.altws.friday;
    data.altWeekSchedule.saturday = formFields.altws.saturday;
    data.altWeekSchedule.sunday = formFields.altws.sunday;
    try {
      await this.props.updateStaffPlusSchedule(JSON.stringify(data));
    } catch (error) {
      console.log(error);
      this.updateState({ isLoading: false });
    }
    this.updateState({ isLoading: false });
  };

  render() {
    let {
      currentMenu,
      formFields,
      startMonth,
      endMonth,
      jobOption,
      jobOption_selected,
      staffList_selected,
      staffList,
      filteredSiteOptions,
      isLoading,
      selected_site,
      fullSchedule_selected_site,
      siteOptions,
      selectedMonth,
      scheduleOptions,
      fullScheduleMonth,
      pageMeta,
    } = this.state;
    let { t } = this.props;
    let { ws, altws, cal_data, staff_data } = formFields;

    const handleMenuSelection = value => {
      if (value === "/full") this.getFullScheduleData();
      this.updateState({ currentMenu: value });
    };

    const handleMonthChange = e => {
      this.state[e.target.name] = e.target.value;
      if (e.target.name == "startMonth") {
        this.state.endMonth = this.state.startMonth;
        this.state.selectedMonth = this.state.startMonth;
      } else if (e.target.name == "endMonth")
        this.state.selectedMonth = this.state.startMonth;
      if (e.target.name != "selectedMonth") this.getScheduleData();
      this.updateState({});
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-lg-2 mb-4">
            <Navigation
              activeItemId={currentMenu}
              onSelect={({ itemId }) => handleMenuSelection(itemId)}
              items={[
                {
                  title: t("Individual Schedule"),
                  itemId: "/indi",
                },
                {
                  title: t("Full Schedule"),
                  itemId: "/full",
                },
              ]}
            />
          </div>
          {isLoading ? (
            <div className="col">
              <div class="d-flex mt-5 align-items-center justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-lg-10 col-md-12">
              <div className="row align-items-center">
                <div className="col-md-8 mb-4">
                  <h3>
                    {t(
                      (currentMenu == "/indi" ? "Individual" : "Full") +
                        " Schedule"
                    )}
                  </h3>
                </div>
              </div>
              {currentMenu == "/indi" ? (
                <>
                  <div className="form-group mb-4 pb-2">
                    <div className="d-flex flex-wrap">
                      <div className="col-12 col-md-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Employee Type")}
                        </label>
                        <div className="input-group">
                          <NormalSelect
                            options={jobOption}
                            value={jobOption_selected}
                            onChange={this.onJobChanged}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Staff")}
                        </label>
                        <div className="input-group">
                          <NormalSelect
                            options={staffList}
                            value={staffList_selected}
                            onChange={this.onStaffChanged}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Site List")}
                        </label>
                        <div className="input-group">
                          <NormalSelect
                            options={filteredSiteOptions}
                            value={selected_site}
                            onChange={this.onSiteChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-4 pb-2">
                    <div className="row">
                      <div className="col-12">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Work Schedule")}
                        </label>
                        <ScheduleTable
                          data={ws}
                          altws_data={altws}
                          optionList={scheduleOptions}
                          onChange={data => {
                            let { formFields } = this.state;
                            formFields["ws"] = data;
                            this.updateState({
                              formFields,
                            });
                          }}
                          onAltChange={data => {
                            let { formFields } = this.state;
                            formFields["altws"] = data;
                            this.updateState({
                              formFields,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {cal_data.length == 0 ? null : (
                    <div className="form-group mb-4 pb-2">
                      <div className="row">
                        <div className="col-md-6 col-sm-12 mb-2">
                          <NormalButton
                            label="Apply WS to Monthly Schedule"
                            mainbg={true}
                            onClick={this.onApplyWSToMonthlySchedule}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <NormalButton
                            label="Apply ALTWS to Monthly Schedule"
                            mainbg={true}
                            onClick={this.onApplyALTWSToMonthlySchedule}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group mb-4 pb-2">
                    <div className="row">
                      <div className="col-md-4 mb-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Start Year and Month")}
                        </label>
                        <div className="input-group">
                          <NormalInput
                            type="month"
                            value={startMonth}
                            name="startMonth"
                            onChange={handleMonthChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mb-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("End Year and Month")}
                        </label>
                        <div className="input-group">
                          <NormalInput
                            type="month"
                            value={endMonth}
                            min={startMonth}
                            name="endMonth"
                            onChange={handleMonthChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mb-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Selected Year and Month")}
                        </label>
                        <div className="input-group">
                          <NormalInput
                            type="month"
                            value={selectedMonth}
                            min={startMonth}
                            max={endMonth}
                            name="selectedMonth"
                            onChange={handleMonthChange}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="input-group">
                          <CalenderTable
                            data={cal_data}
                            date={selectedMonth}
                            optionList={scheduleOptions}
                            onChange={data => {
                              let { formFields } = this.state;
                              formFields["cal_data"] = data;
                              this.updateState({
                                formFields,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {cal_data.length == 0 ? null : (
                    <div className="form-group mb-4 pb-2">
                      <div className="d-flex justify-content-center">
                        <div className="col-md-3 col-sm-12 p-0">
                          <NormalButton
                            label="Save"
                            success={true}
                            onClick={this.onSubmit}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="form-group mb-4 pb-2">
                    <div className="row">
                      <div className="col-12 mb-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Site")}
                        </label>
                        <div className="input-group">
                          <NormalSelect
                            options={siteOptions}
                            value={fullSchedule_selected_site}
                            name="fullSchedule_selected_site"
                            onChange={this.onFullScheduleSiteChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-4 pb-2">
                    <div className="row">
                      <div className="col-8 col-md-4 col-xm-8 mb-4">
                        <label className="text-left text-black common-label-text fs-17 pb-3">
                          {t("Year and Month")}
                        </label>
                        <div className="input-group">
                          <NormalInput
                            type="month"
                            value={fullScheduleMonth}
                            onChange={e => {
                              this.state.fullScheduleMonth = e.target.value;
                              this.updateState({});
                            }}
                          />
                        </div>
                      </div>
                      <div className="col pt-4 mt-4 mb-4">
                        <div className="input-group">
                          <NormalButton
                            label="Load"
                            mainbg={true}
                            onClick={this.onFullScheduleMonthChange}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="input-group">
                          <BigCalander
                            date={fullScheduleMonth}
                            data={staff_data}
                            options={scheduleOptions}
                            disabled={true}
                          />
                        </div>
                        {pageMeta && (
                          <Pagination
                            handlePagination={this.getFullScheduleData}
                            pageMeta={pageMeta}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="d-flex flex-wrap ">
                {scheduleOptions.map(e => {
                  return (
                    <div className="col-md-2 col-6">
                      <div className="d-flex w-100">
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "2px",
                            backgroundColor: `${e.color}`,
                          }}
                        />
                        {t(e.shortDesc)} - {t(e.label)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jobtitleList: state.common.jobtitleList,
  staffPlusDetail: state.staffPlus.staffPlusDetail,
  staffSchedule: state.staffPlus.staffPlusSchedule,
  staffAllEmpSchedule: state.staffPlus.staffPlusAllEmpSchedule,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getJobtitle,
      getStaffPlus,
      getCommonApi,
      getStaffSchedule,
      getAllEmpSchedule,
      updateStaffPlusSchedule,
    },
    dispatch
  );
};

export const StaffSchedule = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(StaffScheduleClass)
);
