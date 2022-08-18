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
import {
  ItemStatusGroups,
  NewItemStatusGroups,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export class ItemstatusgroupClass extends Component {
  state = {
    CommissionDetails: [
      { label: "Code" },
      { label: "Description" },
      { label: "Short Desc" },
      { label: "Active" },
    ],
    isoption: false,
    iscreation: false,
    issite: false,
    islist: false,
    List: [],
    code: null,
    desc: null,
    sdesc: null,
    checked: true,
    codeedit: null,
    descedit: null,
    sdescedit: null,
    checkededit: true,
    edit: false,
  };

  generalcontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  commissioncontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  componentDidMount = () => {
    this.Listofitemgroup({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handleedit = async itemcode => {
    let { edit, codeedit, descedit, sdescedit, checkededit, temp } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.ItemStatusGroups().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.statusGroupCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      codeedit = temp.statusGroupCode;
      descedit = temp.statusGroupDesc;
      sdescedit = temp.statusGroupShortDesc;
      checkededit = temp.isactive;
      this.setState({
        codeedit,
        descedit,
        sdescedit,
        checkededit,
      });
    });
    this.generalcontent();
  };

  handleupdates = async () => {
    let { edit, desc, checked, sdesc } = this.state;
    let descJson = {
      statusGroupCode: this.state.codeedit,
      statusGroupDesc: this.state.descedit,
      isactive: this.state.checkededit,
      statusGroupShortDesc: this.state.sdescedit,
    };
    await this.props
      .updateCommon(
        `ItemStatusGroups/update?where=%7B%22statusGroupCode%22%3A%20%22${this.state.codeedit}%22%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofitemgroup({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edit = false;
    desc = "";
    sdesc = "";
    checked = true;

    this.setState({ edit, desc, sdesc, checked });
    this.generalcontent();
  };

  Listofitemgroup = async () => {
    this.updateState({ is_loading: true });
    let { List, code } = this.state;
    await this.props.ItemStatusGroups().then(res => {
      console.log(res);
      List = res;
      console.log(List);
      this.setState({
        List,
        is_loading: false,
      });
      console.log(List.length);
    });
    if (List.length > 0) {
      code = List[List.length - 1].statusGroupCode;
      console.log(code);
      code = code.slice(code.length - 5);
      code = Number(code) + 1;
      code = "SG" + code;
    } else {
      code = "SG" + 10001;
    }
    this.setState({
      code,
    });
  };

  roomcontent() {
    this.setState({
      isgeneral: !this.state.isgeneral,
    });
  }

  handleinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, sdesc, checked } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "sdesc") {
      sdesc = value;
      this.setState({ sdesc });
    }

    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
  };

  handleeditinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { codeedit, descedit, sdescedit, checkededit } = this.state;
    if (name == "code") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "desc") {
      descedit = value;
      this.setState({ descedit });
    }
    if (name == "sdesc") {
      sdescedit = value;
      this.setState({ sdescedit });
    }

    if (name == "checked") {
      checkededit = value;
      this.setState({ checkededit });
    }
  };

  Addnew = async () => {
    let { code, desc, sdesc, checked } = this.state;
    if (code == null || desc == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let newroom = {
        statusGroupCode: code,
        statusGroupDesc: desc,
        isactive: checked,
        statusGroupShortDesc: sdesc,
      };
      await this.props
        .NewItemStatusGroups(newroom)
        .then(data => {
          this.Listofitemgroup();

          code = "";
          desc = "";
          sdesc = "";
          checked = false;
          this.setState({ checked, code, desc, sdesc });
          this.Listofitemgroup();
        })
        .catch(e => console.log(e));
    }
  };

  render() {
    let {
      CommissionDetails,
      pageMeta,
      List,
      is_loading,
      code,
      desc,
      iscreation,
      islist,
      sdesc,
      checked,
      codeedit,
      descedit,
      sdescedit,
      checkededit,
      edit,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid item">
          <h4>Item Status Group</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 itemstatusgroup"
                onClick={() => this.generalcontent()}
              >
                <p>{t("Item Status Groups Creation")}</p>

                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Status Group Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={code}
                            name="code"
                            onChange={this.handleinput}
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
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Short Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={sdesc}
                            name="sdesc"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checked}
                            name="checked"
                            onChange={this.handleinput}
                          />
                          <p>{t("Active")}</p>
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
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <div
                className="d-flex  justify-content-between p-3 itemstatusgroup"
                onClick={() => this.generalcontent()}
              >
                <p>{t("Item Status Groups Creation")}</p>

                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Status Group Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={codeedit}
                            name="code"
                            onChange={this.handleeditinput}
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
                            name="desc"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Short Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={sdescedit}
                            name="sdesc"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checkededit}
                            name="checked"
                            onChange={this.handleeditinput}
                          />
                          <p>{t("Active")}</p>
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
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.commissioncontent()}
          >
            <p>{t("Item Status Groups List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <h5 className="mt-3">{t("List of Item Status Groups")}</h5>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={CommissionDetails}
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
                        ) : List.length > 0 ? (
                          List.map(
                            (
                              {
                                statusGroupCode,
                                statusGroupDesc,
                                statusGroupShortDesc,
                                isactive,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-left text-success"
                                      onClick={() =>
                                        this.handleedit(statusGroupCode)
                                      }
                                    >
                                      {statusGroupCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {statusGroupDesc}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {statusGroupShortDesc}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {isactive == true ? "YES" : "NO"}
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
      ItemStatusGroups,
      NewItemStatusGroups,
      updateCommon,
    },
    dispatch
  );
};

export const Itemstatusgroup = withTranslation()(
  connect(null, mapDispatchToProps)(ItemstatusgroupClass)
);
