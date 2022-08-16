import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalInput,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import { EmpLevels, NewEmpLevels, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export class EmployeemasterClass extends Component {
  state = {
    EmployeeDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Sequence", divClass: "justify-content-end" },
      { label: "Active" },
    ],
    sequence: null,
    isoption: false,
    iscreation: false,
    issite: false,
    islist: false,
    staffList: [],
    code: null,
    desc: null,
    checked: true,
    spa: true,
    edit: false,
    sequenceedit: null,
    codeedit: null,
    descedit: null,
    checkededit: true,
    spaedit: true,
  };

  employeecontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  employeelistcontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  componentDidMount = () => {
    this.Listofemployees({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofemployees = async () => {
    this.updateState({ is_loading: true });
    await this.props.EmpLevels().then(res => {
      console.log(res);
      let { staffList, code } = this.state;

      staffList = res;
      console.log(staffList);
      code = res[res.length - 1].levelCode;
      code = Number(code) + 1;
      this.setState({
        staffList,
        is_loading: false,
        code,
      });
      console.log(staffList.length);
    });
  };

  handleedit = async itemcode => {
    let { edit, codeedit, descedit, sequenceedit, spaedit, checkededit, temp } =
      this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.EmpLevels().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.levelCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      codeedit = temp.levelCode;
      descedit = temp.levelDesc;
      sequenceedit = temp.levelSequence;
      spaedit = temp.levelSpa;
      checkededit = temp.levelIsActive;
      this.setState({
        codeedit,
        descedit,
        sequenceedit,
        spaedit,
        checkededit,
      });
    });
    this.employeecontent();
  };
  handleupdates = async () => {
    let { edit, desc, checked, spa, sequence } = this.state;
    let descJson = {
      levelSequence: this.state.sequenceedit,
      minTarget: 0,
      fromSalary: 0,
      toSalary: 0,
      levelCode: this.state.codeedit,
      levelDesc: this.state.descedit,
      groupCode: "",
      levelSpa: this.state.spaedit,
      getGroupComm: true,
      levelIsActive: this.state.checkededit,
    };
    await this.props
      .updateCommon(
        `EmpLevels/update?where=%7B%22levelCode%22%20%3A${this.state.codeedit}%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofemployees({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edit = false;
    desc = "";
    sequence = "";
    spa = true;
    checked = true;

    this.setState({ edit, desc, sequence, spa, checked });
    this.employeecontent();
  };

  Addnew = async () => {
    let { code, desc, sequence, spa, checked } = this.state;
    if (code == null || desc == null) {
      Toast({
        type: "error",
        message: "Please check required fields",
      });
    } else {
      let newemp = {
        levelSequence: sequence,
        minTarget: 0,
        fromSalary: 0,
        toSalary: 0,
        levelCode: code,
        levelDesc: desc,
        groupCode: "",
        levelSpa: spa,
        getGroupComm: true,
        levelIsActive: checked,
      };
      await this.props
        .NewEmpLevels(newemp)
        .then(data => {
          this.Listofemployees();

          code = "";
          sequence = "";
          desc = "";
          checked = true;
          spa = true;
          this.setState({ code, desc, sequence, spa, checked });
        })
        .catch(e => console.log(e));
    }
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      code,
      desc,
      sequence,
      spa,
      checked,
      codeedit,
      descedit,
      sequenceedit,
      spaedit,
      checkededit,
    } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "sequence") {
      sequence = value;
      this.setState({ sequence });
    }
    if (name == "spa") {
      spa = value;
      this.setState({ spa });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
    if (name == "codeedit") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "descedit") {
      descedit = value;
      this.setState({ descedit });
    }
    if (name == "sequenceedit") {
      sequenceedit = value;
      this.setState({ sequenceedit });
    }
    if (name == "spaedit") {
      spaedit = value;
      this.setState({ spaedit });
    }
    if (name == "checkededit") {
      checkededit = value;
      this.setState({ checkededit });
    }
  };
  render() {
    let {
      EmployeeDetails,
      pageMeta,
      staffList,
      is_loading,
      code,
      desc,
      iscreation,
      islist,
      sequence,
      spa,
      checked,
      edit,
      codeedit,
      descedit,
      sequenceedit,
      checkededit,
      spaedit,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid focreason">
          <h4>{t("Employee Master")}</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 foc"
                onClick={() => this.employeecontent()}
              >
                <p>{t("Employee Level Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={code}
                            name="code"
                            onChange={this.temp}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Description")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={desc}
                            name="desc"
                            onChange={this.temp}
                          />
                        </div>
                      </div>

                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.Addnew()}
                        />
                      </div>
                    </div>

                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("Sequence")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={sequence}
                            name="sequence"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={spa}
                            name="spa"
                            onChange={this.temp}
                          />
                          <p>{t("Allow to view all SPA")}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checked}
                            name="checked"
                            onChange={this.temp}
                          />
                          <p>{t("Active")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <div
                className="d-flex  justify-content-between p-3 foc"
                onClick={() => this.employeecontent()}
              >
                <p>{t("Employee Level Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={codeedit}
                            name="codeedit"
                            onChange={this.temp}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Description")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={descedit}
                            name="descedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>

                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Update"}
                          onClick={() => this.handleupdates()}
                        />
                      </div>
                    </div>

                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("Sequence")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={sequenceedit}
                            name="sequenceedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={spaedit}
                            name="spaedit"
                            onChange={this.temp}
                          />
                          <p>{t("Allow to view all SPA")}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checkededit}
                            name="checkededit"
                            onChange={this.temp}
                          />
                          <p>{t("Active")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}

          <div
            className="d-flex  justify-content-between p-3 mt-5 foc"
            onClick={() => this.employeelistcontent()}
          >
            <p>{t("Employee Level List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Employee Level")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={EmployeeDetails}
                        queryHandler={this.handlePagination}
                        pageMeta={pageMeta}
                      >
                        {is_loading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : staffList.length > 0 ? (
                          staffList.map(
                            (
                              {
                                levelCode,
                                levelDesc,
                                levelSequence,
                                levelIsActive,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-right text-success cursor-pointer"
                                      onClick={() => this.handleedit(levelCode)}
                                    >
                                      {levelCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{levelDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {levelSequence}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {levelIsActive == true ? "Yes" : "No"}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : null}
                      </TableWrapper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      EmpLevels,
      NewEmpLevels,
      updateCommon,
    },
    dispatch
  );
};

export const Employeemaster = withTranslation()(
  connect(null, mapDispatchToProps)(EmployeemasterClass)
);
