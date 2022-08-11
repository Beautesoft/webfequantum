import React, { Component } from "react";
import {
  NormalButton,
  NormalInput,
  NormalTextarea,
  NormalCheckbox,
} from "component/common";
import { withTranslation } from "react-i18next";
import { Myequipments, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class EditequimentClass extends Component {
  state = {
    itemId: null,
    desc: null,
    epuidesc: null,
    checked: true,
  };

  componentDidMount = () => {
    let { itemId } = this.state;
    itemId = window.location.pathname.split("/")[4];
    this.setState({ itemId });
    console.log(itemId);
    this.Listofequiments(itemId);
  };

  Listofequiments = async code => {
    let { itemId, desc, epuidesc, checked, temp } = this.state;
    await this.props.Myequipments().then(res => {
      let objIndex = res.findIndex(obj => obj.equipmentCode == code);
      console.log(objIndex);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      console.log(temp);
      desc = temp.equipmentName;
      epuidesc = temp.equipmentDescription;
      checked = temp.equipmentIsactive;
      this.setState({
        desc,
        epuidesc,
        checked,
      });
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { itemId, desc, epuidesc, checked } = this.state;
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
    let { itemId, desc, epuidesc, checked } = this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let editdata = {
        equipmentName: epuidesc,
        equipmentDescription: desc,
        equipmentIsactive: checked,
        equipmentCode: itemId,
      };
      await this.props
        .updateCommon(
          `Myequipments/update?where=%7B%22equipmentCode%22%3A%20%22${this.state.itemId}%22%7D

      `,
          editdata
        )
        .then(data => {})
        .catch(e => console.log(e));
    }
  };

  render() {
    let { itemId, desc, epuidesc, checked } = this.state;
    let { t } = this.props;
    return (
      <div>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            Equipment
          </h5>
          <div className="col-6 mt-5">
            <span>Equiptment ID</span>
            <span style={{ color: "red" }}>*</span>
            <NormalInput
              value={itemId}
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
              label={"Update"}
              onClick={() => this.Addnewequiment()}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Myequipments,
      updateCommon,
    },
    dispatch
  );
};
export const Editequiment = withTranslation()(
  connect(null, mapDispatchToProps)(EditequimentClass)
);
