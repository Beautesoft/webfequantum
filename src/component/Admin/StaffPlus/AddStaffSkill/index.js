import React from "react";
import { Link } from "react-router-dom";
import { getJobtitle, getCommonApi } from "redux/actions/common";
import {
  getStaffPlus,
  updateEmpSkillList,
  getEmpSkillList,
} from "redux/actions/staffPlus";
import {
  NormalSelect,
  NormalButton,
  NormalMultiSelect,
} from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

class AddStaffSkillClass extends React.Component {
  state = {
    staffOptions: [],
    selectedStaff: "",
    jobOptions: [],
    selectedJobOption: "",
    skillList: [],
    skillCategories: [],
    selectedSkillCategory: "",
    skills: [],
    selectedSkills: [],
    isLoading: true,
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    await this.props.getJobtitle();
    var skillCatRes = await this.props.getCommonApi("SkillsItemTypeList/");
    let { jobtitleList } = this.props;
    let { jobOptions, skillCategories } = this.state;
    for (let key of skillCatRes.skillsTypes) {
      skillCategories.push({ value: key.itm_id, label: key.itm_name });
    }
    for (let key of jobtitleList) {
      jobOptions.push({ value: key.id, label: key.level_desc });
    }
    this.updateState({ jobOptions, skillCategories });
  };
  getStaff = async () => {
    let { selectedJobOption, staffOptions } = this.state;
    await this.props.getStaffPlus(`?limit=100&EMP_TYPEid=${selectedJobOption}`);
    let { staffDetails } = this.props;
    for (let key of staffDetails.dataList) {
      staffOptions.push({ value: key.id, label: key.display_name });
    }
    this.updateState({ staffOptions });
  };
  getStaffDetails = async () => {
    await this.props.getEmpSkillList(this.state.selectedStaff);
    let { empSkillList } = this.props;
    let skills = empSkillList.skills;
    this.updateState({ skills, isLoading: false });
  };
  getSkills = async () => {
    let skillSetRes = await this.props.getCommonApi(
      `SkillsView?item_type=${this.state.selectedSkillCategory}`
    );
    let skillList = [];
    for (let e of skillSetRes.data) {
      skillList.push({
        label: e.item_desc,
        value: e.item_code,
        item_code: e.item_code,
        item_name: e.item_name,
      });
    }
    this.updateState({ skillList });
  };
  handleJobChange = e => {
    if (e.target.value == this.state.selectedJobOption) return;
    this.state.selectedJobOption = e.target.value;
    this.updateState({
      isLoading: true,
      selectedStaff: "",
      staffOptions: [],
    });
    if (e.target.value != "") this.getStaff();
  };
  handleStaffChange = e => {
    if (e.target.value == this.state.selectedStaff) return;
    this.state.selectedStaff = e.target.value;
    this.updateState({
      skills: [],
      isLoading: true,
    });
    if (e.target.value != "") this.getStaffDetails();
  };
  handleSkillCategoryChange = e => {
    if (e.target.value == this.state.selectedSkillCategory) return;
    this.state.selectedSkillCategory = e.target.value;
    this.updateState({});
    if (e.target.value != "") this.getSkills();
  };
  handleSubmit = async () => {
    this.updateState({ isLoading: true });
    let data = {};
    data.skillsCodeList = this.state.skills.map(e => e.item_code);
    await this.props.updateEmpSkillList(
      this.state.selectedStaff,
      JSON.stringify(data)
    );
    this.updateState({ isLoading: false });
  };
  handleDeleteSkill = id => {
    this.state.skills = this.state.skills.filter(e => e.item_code != id);
    this.updateState({});
  };
  handleAddSkills = () => {
    for (let e of this.state.selectedSkills) {
      if (
        this.state.skills.filter(element => element.item_code == e.item_code)
          .length == 0
      )
        this.state.skills.push(e);
    }
    this.state.selectedSkills = [];
    this.updateState({});
  };
  handleMultiSelect = e => {
    this.state.selectedSkills = e;
    this.updateState({});
  };
  render() {
    let {
      isLoading,
      jobOptions,
      selectedJobOption,
      staffOptions,
      selectedStaff,
      skillCategories,
      selectedSkillCategory,
      skills,
      skillList,
    } = this.state;
    let { t } = this.props;
    return (
      <div className="container-fuild">
        <div className="head-label-nav">
          <p
            className="category fw-500"
            onClick={() => this.props.history.push("/admin/staffplus")}
          >
            {t("Staff")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p
            className="sub-category"
            onClick={() => this.props.history.push("/admin/staffplus/skills")}
          >
            {t("Staff Skill")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t("Add")}/{t("Edit")} {t("Skill")}
          </p>
        </div>
        <div className="container-lg mt-5">
          <div className="row align-items-center">
            <div className="col-md-12 mb-4">
              <h3>
                {t("Add")}/{t("Edit")} {t("Skill")}
              </h3>
            </div>
          </div>
          <div className="form-group pb-2 mb-4">
            <div className="row">
              <div className="col-md-12 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Select Skill Category")}
                </label>
                <NormalSelect
                  options={skillCategories}
                  value={selectedSkillCategory}
                  onChange={this.handleSkillCategoryChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group pb-2 mb-4">
            <div className="row">
              <div className="col-md-12 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Select Employee Type")}
                </label>
                <NormalSelect
                  options={jobOptions}
                  value={selectedJobOption}
                  onChange={this.handleJobChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group pb-2 mb-4">
            <div className="row">
              <div className="col-md-12 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Select Staff")}
                </label>
                <NormalSelect
                  options={staffOptions}
                  value={selectedStaff}
                  onChange={this.handleStaffChange}
                />
              </div>
            </div>
          </div>

          {isLoading ? null : (
            <>
              <div className="form-group pb-2 mb-4">
                <div className="row">
                  <div className="col-md-8 ">
                    <label className="text-left text-black common-label-text fs-17 pb-3">
                      {t("Add Skills")}
                    </label>
                    <NormalMultiSelect
                      options={skillList}
                      handleMultiSelect={this.handleMultiSelect}
                    />
                  </div>
                  <div className="col-md-4 mb-4 pt-5">
                    <NormalButton
                      mainbg={true}
                      label="Add Selected Skills"
                      onClick={this.handleAddSkills}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group pb-2 mb-4">
                <div className="row">
                  <div className="col-md-8 ">
                    <label className="text-left text-black common-label-text fs-17 pb-3">
                      {t("Skills Assigned")}
                    </label>
                    {skills.map((item, index) => (
                      <div className="row w-100">
                        <div className="col-10">
                          <label className="text-left text-black common-label-text fs-17 pb-3">
                            {index + 1}. {item.item_name}
                          </label>
                        </div>
                        <div className="col-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-trash-fill cursor-pointer"
                            onClick={e =>
                              this.handleDeleteSkill(item.item_code)
                            }
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group mb-4 pb-2">
                <div className="pt-5 d-flex justify-content-center">
                  <div className="col-2">
                    <Link to="/admin/staffplus/skills">
                      <NormalButton
                        label="Cancel"
                        resetbg={true}
                        className="mr-2 bg-danger text-light col-12"
                      />
                    </Link>
                  </div>
                  <div className="col-2">
                    <NormalButton
                      label="Save"
                      success={true}
                      className="mr-2 col-12"
                      onClick={this.handleSubmit}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  jobtitleList: state.common.jobtitleList,
  staffDetails: state.staffPlus.staffPlusDetail,
  empSkillList: state.staffPlus.staffPlustEmpSkillList,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getJobtitle,
      getStaffPlus,
      getCommonApi,
      updateEmpSkillList,
      getEmpSkillList,
    },
    dispatch
  );
};

export const AddStaffSkill = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddStaffSkillClass)
);
