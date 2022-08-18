import React from "react";
import {
  NormalButton,
  NormalSelect,
  InputSearch,
  TableWrapper,
} from "component/common";
import { getCommonApi, getJobtitle } from "redux/actions/common";
import { getSkillList } from "redux/actions/staffPlus";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import "./styles.scss";

export class StaffSkillListClass extends React.Component {
  state = {
    data: [],
    header: [],
    skillList: [],
    jobOptions: [],
    selectedJobOption: "",
    skillSOptions: [],
    selectedSkillOption: "",
    isLoading: true,
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentWillMount() {
    this.getDatafromStore();
  }

  getDatafromStore = async () => {
    await this.props.getJobtitle();
    var skillListRes = await this.props.getCommonApi("SkillsItemTypeList");
    let { jobtitleList } = this.props;
    let { jobOptions, skillSOptions, selectedJobOption, selectedSkillOption } =
      this.state;
    for (let key of jobtitleList) {
      jobOptions.push({ value: key.id, label: key.level_desc });
    }
    for (let key of skillListRes.skillsTypes) {
      skillSOptions.push({ value: key.itm_id, label: key.itm_name });
    }
    selectedJobOption = jobOptions[0].value;
    selectedSkillOption = skillSOptions[0].value;
    this.updateState({
      jobOptions,
      skillSOptions,
      selectedJobOption,
      selectedSkillOption,
    });

    this.loadData();
  };

  loadData = async () => {
    this.updateState({ isLoading: true });
    let { data, selectedJobOption, selectedSkillOption, skillList } =
      this.state;
    if (selectedJobOption == "" || selectedSkillOption == "")
      return this.updateState({ data: [], skillListRes: [], isLoading: false });
    let skillSetRes = await this.props.getCommonApi(
      `SkillsView?item_type=${selectedSkillOption}`
    );
    await this.props.getSkillList(
      `?emp_type=${selectedJobOption}&item_type=${selectedSkillOption}`
    );
    skillList = skillSetRes.data;
    data = this.props.empSkillList.data;
    let header = [{ label: "" }];
    for (let key of this.props.empSkillList?.data) {
      header.push({ label: key.staffname });
    }
    this.updateState({ header, skillList, data, isLoading: false });
  };

  handleChange = e => {
    this.state[e.target.name] = e.target.value;
    this.updateState();
    this.loadData();
  };

  render() {
    let {
      data,
      header,
      jobOptions,
      selectedJobOption,
      skillSOptions,
      selectedSkillOption,
      skillList,
      isLoading,
    } = this.state;
    let { t } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="staffList-container col-xl">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h3>{t("Staff Skill Listing")}</h3>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-6 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Employee Type")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={jobOptions}
                    value={selectedJobOption}
                    name="selectedJobOption"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-6 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Skill Type")}
                </label>
                <div className="input-group">
                  <NormalSelect
                    options={skillSOptions}
                    value={selectedSkillOption}
                    name="selectedSkillOption"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-8 mb-4">
                <InputSearch
                  className=""
                  placeholder="Search Skill"
                  onChange={this.handleChange}
                />
              </div>
              <div className="col-md-4 col-sm-12">
                <NormalButton
                  mainbg={true}
                  className="col-12 fs-15 float-right"
                  label="Add Staff Skill"
                  onClick={() =>
                    this.props.history.push("/admin/staffplus/skills/add")
                  }
                />
              </div>
            </div>
            <div className="tab-table-content">
              <div className="py-4">
                {isLoading ? (
                  <div class="d-flex mt-5 align-items-center justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : data.length == 0 ? (
                  <div class="d-flex mt-5 align-items-center justify-content-center">
                    {t("No Data")}
                  </div>
                ) : (
                  <div className="table-container">
                    <TableWrapper
                      className="tableFixHeads"
                      headerDetails={header}
                    >
                      {skillList
                        ? skillList.map(({ item_no, item_desc }) => {
                            return (
                              <tr key={item_no}>
                                <td>
                                  <div className="text-left">{item_desc}</div>
                                </td>
                                {data.map(key => {
                                  return (
                                    <td>
                                      <div className="d-flex align-items-center justify-content-center">
                                        <div className="d-flex align-items-center justify-content-center checkbox-container">
                                          <input
                                            type="checkbox"
                                            disabled
                                            checked={
                                              key.skills.filter(
                                                e => e.item_no == item_no
                                              ).length > 0
                                                ? true
                                                : false
                                            }
                                          />
                                          <span class="checkmark"></span>
                                        </div>
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })
                        : null}
                    </TableWrapper>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jobtitleList: state.common.jobtitleList,
  empSkillList: state.staffPlus.staffPlusSkillList,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      getJobtitle,
      getSkillList,
    },
    dispatch
  );
};

export const StaffSkillList = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(StaffSkillListClass)
);
