import React, { Component } from "react";
import { NormalButton, NormalCheckbox, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import {
  NewItemClasses,
  ItemClasses,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class EditItemclassdataCLass extends Component {
  state = {
    itemId: null,
    desc: null,
    checked: true,
  };

  componentDidMount = () => {
    let { itemId } = this.state;
    itemId = window.location.pathname.split("/")[4];
    this.setState({ itemId });
    console.log(itemId);
    this.listofclass(itemId);
  };

  listofclass = async code => {
    let { desc, checked, temp } = this.state;
    await this.props.ItemClasses().then(res => {
      let objIndex = res.findIndex(obj => obj.itmCode == code);
      console.log(objIndex);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      console.log(temp);
      desc = temp.itmDesc;
      checked = temp.itmIsactive;
      this.setState({
        desc,
        checked,
      });
    });
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  Addnewclass = async () => {
    let { code, desc, checked } = this.state;

    if (desc == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newclass = {
        itmCode: this.state.itemId,
        itmDesc: desc,
        itmIsactive: checked,
        itmSeq: null,
      };
      await this.props
        .updateCommon(
          `ItemClasses/update?where=%7B%22itmCode%22%3A%20%22${this.state.itemId}%22%7D

    `,
          newclass
        )
        .then(data => {
          desc = "";
          this.setState({ code, desc });
        })
        .catch(e => console.log(e));
    }
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, checked } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
  };
  render() {
    let { t } = this.props;
    let { itemId, desc, checked } = this.state;
    return (
      <>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            {t("Class List")}
          </h5>
          <div className="d-flex mt-5">
            <div className="col-6">
              <span>Code</span>
              <span style={{ color: "red" }}>*</span>
              <NormalInput
                value={itemId}
                name="code"
                onChange={this.temp}
                type="number"
                disabled={true}
              />
            </div>
            <div className="col-6">
              <span>Description</span>
              <span style={{ color: "red" }}>*</span>
              <NormalInput value={desc} name="desc" onChange={this.temp} />
            </div>
          </div>
          <div className="d-flex mt-4 ml-3">
            <NormalCheckbox
              checked={checked}
              name="checked"
              onChange={this.temp}
            />
            <p>{t("Active")}</p>
          </div>
          <div className="mt-3 col-1">
            <NormalButton
              mainbg={true}
              label={"UPDTE"}
              onClick={() => this.Addnewclass()}
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
      NewItemClasses,
      ItemClasses,
      updateCommon,
    },
    dispatch
  );
};

export const EditItemclassdata = withTranslation()(
  connect(null, mapDispatchToProps)(EditItemclassdataCLass)
);
