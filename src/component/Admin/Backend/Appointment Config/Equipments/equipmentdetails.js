import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  NormalInput,
  NormalTextarea,
} from "component/common";
import { withTranslation } from "react-i18next";
import { NewMyequipments, Myequipments } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class EquipmentdetailsClass extends Component {
  state = {
    code: null,
    desc: null,
    epuidesc: null,
    checked: true,
    List: [],
  };

  componentDidMount = () => {
    this.Listofequiments({});
  };

  Listofequiments = async () => {
    let { List, code } = this.state;
    await this.props.Myequipments().then(res => {
      List = res;
      this.setState({
        List,
      });
      console.log(List.length);
    });
    if (List.length > 0) {
      code = List[List.length - 1].equipmentCode;
      console.log(code);
      code = code.slice(code.length - 5);
      code = Number(code) + 1;
      code = "EQU" + code;
    } else {
      code = "EQU" + 10001;
    }
    this.setState({
      code,
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, epuidesc, checked } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "epuidesc") {
      epuidesc = value;
      this.setState({ epuidesc });
    }
    if (name == "check") {
      checked = value;
      this.setState({ checked });
    }
  };

  Addnewequiment = async () => {
    let { code, desc, epuidesc, checked } = this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let newequiment = {
        equipmentName: epuidesc,
        equipmentDescription: desc,
        equipmentIsactive: checked,
        equipmentCode: code,
      };
      await this.props
        .NewMyequipments(newequiment)
        .then(data => {
          this.handleimput();
        })
        .catch(e => console.log(e));
    }
  };
  handleimput = () => {
    let { code, desc, epuidesc, checked } = this.state;
    desc = "";
    epuidesc = "";
    checked = false;
    this.setState({ checked, desc, epuidesc });
    this.Listofequiments();
  };
  render() {
    let { t } = this.props;
    let { code, desc, epuidesc, checked } = this.state;
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
              {t("Equipment")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Add")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            Equipment
          </h5>
          <div className="col-6 mt-5">
            <span>Equiptment ID</span>
            <span style={{ color: "red" }}>*</span>
            <NormalInput
              value={code}
              name="code"
              onChange={this.temp}
              disabled={true}
            />
          </div>
          <div className="col-6 mt-3">
            <span>Equipment Name</span>
            <span style={{ color: "red" }}>*</span>
            <NormalInput value={desc} name="desc" onChange={this.temp} />
          </div>
          <div className="col-6 mt-3">
            <span>Description</span>
            <NormalTextarea
              placeholder="Enter Equipment Description"
              value={epuidesc}
              name="epuidesc"
              onChange={this.temp}
            />
          </div>
          <div className="col-6">
            <div className="d-flex mt-3">
              <NormalCheckbox
                checked={checked}
                name="check"
                onChange={this.temp}
              />
              <p>{t("Active")}</p>
            </div>
          </div>

          <div className="mt-3 col-1">
            <NormalButton
              mainbg={true}
              label={"Add"}
              onClick={() => this.Addnewequiment()}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      NewMyequipments,
      Myequipments,
    },
    dispatch
  );
};

export const Equipmentdetails = withTranslation()(
  connect(null, mapDispatchToProps)(EquipmentdetailsClass)
);
