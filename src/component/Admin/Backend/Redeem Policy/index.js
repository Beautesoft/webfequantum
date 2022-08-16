import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalSelect,
  NormalCheckbox,
  NormalInput,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  RedeemLists,
  NewRedeemLists,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export class RedeempolicyClass extends Component {
  state = {
    RedeemDetails: [
      { label: "Code" },
      { label: "Cust Type" },
      { label: "Currency value", divClass: "justify-content-end" },
      { label: "Point Value", divClass: "justify-content-end" },
      { label: "Is Active" },
    ],
    count: null,
    isoption: false,
    iscreation: false,
    issite: false,
    islist: false,
    staffList: [],
    code: null,
    current_value: null,
    Point_Value: null,
    checked: true,
    option: [
      { label: "NORMAL", value: "100001" },
      { label: "STAFF", value: "100002" },
    ],
    codeedit: null,
    current_valueedit: null,
    Point_Valueedit: null,
    checkededit: true,
    countedit: null,
  };

  componentDidMount = () => {
    this.Listofreward({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handleedit = async itemcode => {
    let {
      edit,
      codeedit,
      current_valueedit,
      Point_Valueedit,
      checkededit,
      countedit,
      temp,
    } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.RedeemLists().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.redeemCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      codeedit = temp.redeemCode;
      current_valueedit = temp.curValue;
      Point_Valueedit = temp.pointValue;
      checkededit = temp.isActive;
      countedit = temp.custTypeName;
      this.setState({
        codeedit,
        current_valueedit,
        Point_Valueedit,
        checkededit,
        countedit,
      });
    });
    this.generalcontent();
  };

  handleupdates = async () => {
    let { edit, code, current_value, Point_Value, checked, count } = this.state;
    let descJson = {
      redeemCode: this.state.codeedit,
      custType: this.state.countedit,
      curValue: this.state.current_valueedit,
      pointValue: this.state.Point_Valueedit,
      isActive: this.state.checkededit,
    };
    await this.props
      .updateCommon(
        `RedeemLists/update?where=%7B%22redeemCode%22%3A%20%22${this.state.codeedit}%22%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofreward({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    code = false;
    current_value = "";
    Point_Value = "";
    count = "";
    checked = true;

    this.setState({ edit, code, current_value, Point_Value, checked, count });
    this.generalcontent();
  };

  Listofreward = async () => {
    this.updateState({ is_loading: true });
    await this.props.RedeemLists().then(res => {
      console.log(res);
      let { staffList, code } = this.state;

      staffList = res;
      if (res.length > 0) {
        code = res[res.length - 1].redeemCode;
        code = Number(code) + 1;
      } else {
        code = 100001;
      }
      console.log(staffList);
      this.setState({
        staffList,
        is_loading: false,
        code,
      });
      console.log(staffList.length);
    });
  };

  generalcontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  Redeemlistcontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  handleinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, Point_Value, current_value, checked, count } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "Point_Value") {
      Point_Value = value;
      this.setState({ Point_Value });
    }
    if (name == "current_value") {
      current_value = value;
      this.setState({ current_value });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
    if (name == "count") {
      count = value;
      this.setState({ count });
    }
  };

  handleeditinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      codeedit,
      Point_Valueedit,
      current_valueedit,
      checkededit,
      countedit,
    } = this.state;
    if (name == "code") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "Point_Value") {
      Point_Valueedit = value;
      this.setState({ Point_Valueedit });
    }
    if (name == "current_value") {
      current_valueedit = value;
      this.setState({ current_valueedit });
    }
    if (name == "checked") {
      checkededit = value;
      this.setState({ checkededit });
    }
    if (name == "count") {
      countedit = value;
      this.setState({ countedit });
    }
  };

  Addnew = async () => {
    let { code, Point_Value, current_value, checked, count } = this.state;
    if (code == null || current_value == null || count == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newreward = {
        redeemCode: code,
        custType: count,
        curValue: current_value,
        pointValue: Point_Value,
        isActive: checked,
      };
      await this.props
        .NewRedeemLists(newreward)
        .then(data => {
          this.Listofitemgroup();

          code = "";
          current_value = "";
          Point_Value = "";
          checked = false;
          this.setState({ checked, code, current_value, Point_Value });
        })
        .catch(e => console.log(e));
    }
  };

  render() {
    let {
      RedeemDetails,
      pageMeta,
      staffList,
      is_loading,
      code,
      desc,
      iscreation,
      islist,
      count,
      option,
      checked,
      current_value,
      Point_Value,
      checkededit,
      current_valueedit,
      Point_Valueedit,
      countedit,
      codeedit,
      edit,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid focreason">
          <h4>{t("Redeem Policy")}</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 foc"
                onClick={() => this.generalcontent()}
              >
                <p>{t("Redeem Policy Creation")}</p>
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
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Customer Class")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalSelect
                            options={option}
                            value={count}
                            onChange={this.handleinput}
                            name="count"
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
                          <p>{t(" Is Currently Active")}</p>
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
                        <span>{t("Currency Value")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={current_value}
                            name="current_value"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Point Value")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={Point_Value}
                            name="Point_Value"
                            onChange={this.handleinput}
                          />
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
                onClick={() => this.generalcontent()}
              >
                <p>{t("Redeem Policy Creation")}</p>
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
                        <span>{t("Customer Class")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalSelect
                            options={option}
                            value={countedit}
                            onChange={this.handleeditinput}
                            name="count"
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
                          <p>{t(" Is Currently Active")}</p>
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
                        <span>{t("Currency Value")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={current_valueedit}
                            name="current_value"
                            onChange={this.handleeditinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Point Value")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={Point_Valueedit}
                            name="Point_Value"
                            onChange={this.handleeditinput}
                          />
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
            onClick={() => this.Redeemlistcontent()}
          >
            <p>{t("Redeem Policy List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Redeem Policy")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={RedeemDetails}
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
                                redeemCode,
                                custType,
                                custTypeName,
                                curValue,
                                pointValue,
                                isActive,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-right text-success"
                                      onClick={() =>
                                        this.handleedit(redeemCode)
                                      }
                                    >
                                      {redeemCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {custTypeName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">{curValue}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {pointValue}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {isActive == true ? "yes" : "No"}
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
      RedeemLists,
      NewRedeemLists,
      updateCommon,
    },
    dispatch
  );
};

export const Redeempolicy = withTranslation()(
  connect(null, mapDispatchToProps)(RedeempolicyClass)
);
