import React, { Component } from "react";
import { NormalButton, NormalCheckbox, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import { NewItemClasses, ItemClasses } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class ItemclassdataCLass extends Component {
  state = {
    code: null,
    desc: null,
    checked: true,
  };

  componentDidMount = () => {
    this.listofclass({});
  };

  listofclass = async () => {
    let { code, te } = this.state;
    await this.props.ItemClasses().then(res => {
      if (res.length > 0) {
        te = res[res.length - 1].itmCode;
        code = Number(te) + 1;
      } else {
        code = 1;
      }
      this.setState({
        code,
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
        itmCode: code,
        itmDesc: desc,
        itmIsactive: checked,
        itmSeq: null,
      };
      await this.props
        .NewItemClasses(newclass)
        .then(data => {
          desc = "";
          this.listofclass();
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
    let { code, desc, checked } = this.state;
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
              {t("Item Classification")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p
              className="sub-category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Class List")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Class Data Entry ")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            {t("Class List")}
          </h5>
          <div className="d-flex mt-5">
            <div className="col-6">
              <span>Code</span>
              <span style={{ color: "red" }}>*</span>
              <NormalInput
                value={code}
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
              label={"ADD"}
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
    },
    dispatch
  );
};

export const Itemclassdata = withTranslation()(
  connect(null, mapDispatchToProps)(ItemclassdataCLass)
);
