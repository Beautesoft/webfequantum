import React, { Component } from "react";
import { NormalButton, NormalCheckbox, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import {
  NewApptSecondaryStatuses,
  ApptSecondaryStatuses,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class SecondarystatuslistClass extends Component {
  state = {
    code: null,
    desc: null,
    colorcode: null,
    staffList: [],
    checked: true,
  };

  componentDidMount = () => {
    this.Listofsstate({});
  };

  Listofsstate = async () => {
    let { List, code } = this.state;
    await this.props.ApptSecondaryStatuses().then(res => {
      console.log(res);
      List = res;
      console.log(List);
      this.setState({
        List,
      });
    });
    if (List.length > 0) {
      code = List[List.length - 1].ssCode;
      code = Number(code) + 1;
    } else {
      code = 10001;
    }
    this.setState({
      code,
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, colorcode, checked } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "colorcode") {
      colorcode = value;
      this.setState({ colorcode });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
  };

  Addnewstate = async () => {
    let { code, desc, colorcode, checked } = this.state;
    if (code == null || desc == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let newbooking = {
        ssCode: code,
        ssDesc: desc,
        ssColorCode: colorcode,
        active: true,
      };
      await this.props
        .NewApptSecondaryStatuses(newbooking)
        .then(data => {
          code = "";
          desc = "";
          colorcode = "";
          checked = false;
          this.setState({ checked, code, desc, colorcode });
          this.Listofsstate();
        })
        .catch(e => console.log(e));
    }
  };

  render() {
    let { t } = this.props;
    let { code, desc, colorcode, checked } = this.state;
    return (
      <>
        <div className="col-md-12 d-flex align-items-center">
          <div className="detail d-flex">
            <p
              className="category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Master Data")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p
              className="sub-category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Appointment config")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p
              className="sub-category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Secondary Status List ")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Operation")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5">Appointment Secondary Status </h5>
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
                <p>{t("Color Code")}</p>
                <div className="input-group">
                  <NormalInput value={colorcode} onChange={this.temp} />
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex input-group">
                  <NormalCheckbox
                    checked={checked}
                    name="checked"
                    onChange={this.temp}
                  />
                  <p>{t("is Currently Active")}</p>
                </div>
              </div>
              <div className="mt-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add"}
                  onClick={() => this.Addnewstate()}
                />
              </div>
            </div>

            <div className="col-6 ">
              <div className="mt-3">
                <span>{t("Description")}</span>
                <span className="star">*</span>
                <div className="input-group">
                  <NormalInput value={desc} name="desc" onChange={this.temp} />
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="color"
                  className="mt-4"
                  style={{ width: 70 }}
                  onChange={this.temp}
                  name="colorcode"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      NewApptSecondaryStatuses,
      ApptSecondaryStatuses,
    },
    dispatch
  );
};

export const Secondarystatuslist = withTranslation()(
  connect(null, mapDispatchToProps)(SecondarystatuslistClass)
);
