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
import { BrManuals, NewBrManuals, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export class BonusRewardClass extends Component {
  state = {
    BounsDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Points", divClass: "justify-content-end" },
      { label: "Is Active" },
      { label: "Reward" },
      { label: "Redeem" },
    ],
    points: null,
    isoption: false,
    iscreation: false,
    issite: false,
    islist: false,
    List: [],
    code: null,
    desc: null,
    points: null,
    reward: false,
    redeem: false,
    active: false,
    codeedit: null,
    descedit: null,
    pointsedit: null,
    rewardedit: false,
    redeemedit: false,
    activeedit: false,
  };

  bonuscontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  bonuslistcontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  componentDidMount = () => {
    this.Listofbonus({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handleedit = async itemcode => {
    let {
      edit,
      codeedit,
      descedit,
      pointsedit,
      rewardedit,
      redeemedit,
      activeedit,
      temp,
    } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.BrManuals().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.brCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      codeedit = temp.brCode;
      descedit = temp.brDesc;
      pointsedit = temp.brPoint;
      redeemedit = temp.isRedeem;
      rewardedit = temp.isReward;
      activeedit = temp.isActive;
      this.setState({
        codeedit,
        descedit,
        pointsedit,
        rewardedit,
        redeemedit,
        activeedit,
      });
    });
    this.bonuscontent();
  };

  handleupdates = async () => {
    let { edit, code, desc, points, reward, redeem, active } = this.state;
    let descJson = {
      brCode: this.state.codeedit,
      brDesc: this.state.descedit,
      brPoint: this.state.pointsedit,
      isRedeem: this.state.redeemedit,
      isReward: this.state.rewardedit,
      isActive: this.state.activeedit,
    };
    await this.props
      .updateCommon(
        `BrManuals/update?where=%7B%22brCode%22%3A%20%22${this.state.codeedit}%22%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofbonus({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edit = false;
    code = "";
    desc = "";
    points = "";
    reward = true;
    redeem = true;
    active = true;
    this.setState({ edit, code, desc, points, reward, redeem, active });
    this.bonuscontent();
  };

  Listofbonus = async () => {
    this.updateState({ is_loading: true });
    let { code } = this.state;
    await this.props.BrManuals().then(res => {
      console.log(res);
      let { List } = this.state;

      List = res;
      if (res.length) {
        code = res[res.length - 1].brCode;
        code = Number(code) + 1;
      } else {
        code = 100001;
      }
      console.log(List);
      this.setState({
        List,
        is_loading: false,
        code,
      });
      console.log(List.length);
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, points, redeem, reward, active } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "points") {
      points = value;
      this.setState({ points });
    }
    if (name == "reward") {
      reward = value;
      this.setState({ reward });
    }
    if (name == "redeem") {
      redeem = value;
      this.setState({ redeem });
    }
    if (name == "active") {
      active = value;
      this.setState({ active });
    }
  };

  handleeditinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { codeedit, descedit, pointsedit, redeemedit, rewardedit, activeedit } =
      this.state;
    if (name == "code") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "desc") {
      descedit = value;
      this.setState({ descedit });
    }
    if (name == "points") {
      pointsedit = value;
      this.setState({ pointsedit });
    }
    if (name == "reward") {
      rewardedit = value;
      this.setState({ rewardedit });
    }
    if (name == "redeem") {
      redeemedit = value;
      this.setState({ redeemedit });
    }
    if (name == "active") {
      activeedit = value;
      this.setState({ activeedit });
    }
  };

  Addnew = async () => {
    let { code, desc, points, redeem, reward, active } = this.state;
    if (code == null || desc == null || points == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newroom = {
        brCode: code,
        brDesc: desc,
        brPoint: points,
        isRedeem: redeem,
        isReward: reward,
        isActive: active,
      };
      await this.props
        .NewBrManuals(newroom)
        .then(data => {
          this.Listofbonus();

          code = "";
          desc = "";
          points = "";
          redeem = "";
          reward = "";
          active = "";
          this.setState({ code, desc, points, redeem, reward, active });
        })
        .catch(e => console.log(e));
    }
  };

  render() {
    let {
      BounsDetails,
      List,
      is_loading,
      code,
      desc,
      iscreation,
      islist,
      points,
      reward,
      redeem,
      active,
      codeedit,
      descedit,
      pointsedit,
      redeemedit,
      rewardedit,
      activeedit,
      edit,
    } = this.state;
    let { t } = this.props;
    console.log(code);
    return (
      <>
        <div className="container-fluid focreason">
          <h4>{t("Bonus Reward ")}</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 foc"
                onClick={() => this.bonuscontent()}
              >
                <p>{t("Bonus Reward Creation")}</p>
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

                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={active}
                            name="active"
                            onChange={this.temp}
                          />
                          <p>{t("is Currently Active")}</p>
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
                        <span>{t("Points")}</span>
                        <span className="star">*</span>
                        <div className="input-group">
                          <NormalInput
                            value={points}
                            name="points"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={reward}
                            name="reward"
                            onChange={this.temp}
                          />
                          <p>{t("Reward")}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={redeem}
                            name="redeem"
                            onChange={this.temp}
                          />
                          <p>{t("Redeem")}</p>
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
                onClick={() => this.bonuscontent()}
              >
                <p>{t("Bonus Reward Creation")}</p>
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
                            name="code"
                            onChange={this.handleeditinput}
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
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={activeedit}
                            name="active"
                            onChange={this.handleeditinput}
                          />
                          <p>{t("is Currently Active")}</p>
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
                        <span>{t("Points")}</span>
                        <span className="star">*</span>
                        <div className="input-group">
                          <NormalInput
                            value={pointsedit}
                            name="points"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={rewardedit}
                            name="reward"
                            onChange={this.handleeditinput}
                          />
                          <p>{t("Reward")}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={redeemedit}
                            name="redeem"
                            onChange={this.handleeditinput}
                          />
                          <p>{t("Redeem")}</p>
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
            onClick={() => this.bonuslistcontent()}
          >
            <p>{t("Bonus Reward List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Bonus Reward")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={BounsDetails}>
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
                                brCode,
                                brDesc,
                                brPoint,
                                isActive,
                                isReward,
                                isRedeem,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-right text-success"
                                      onClick={() => this.handleedit(brCode)}
                                    >
                                      {brCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{brDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">{brPoint}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {isActive == true ? "Yes" : "No"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {isReward == true ? "Yes" : "No"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {isRedeem == true ? "Yes" : "No"}
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
      BrManuals,
      NewBrManuals,
      updateCommon,
    },
    dispatch
  );
};

export const BonusReward = withTranslation()(
  connect(null, mapDispatchToProps)(BonusRewardClass)
);
