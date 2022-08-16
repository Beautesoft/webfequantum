import React, { Component } from "react";
import { NormalButton, NormalCheckbox, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import { Corporatecustomers, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class EditCorporateClass extends Component {
  state = {
    itemId: null,
    desc: null,
    checkd: true,
    address1: null,
    address2: null,
    address3: null,
    address4: null,
    address5: null,
  };

  componentDidMount = () => {
    let { itemId } = this.state;
    itemId = window.location.pathname.split("/")[4];
    this.setState({ itemId });
    console.log(itemId);
    this.Listofcustomer(itemId);
  };

  Listofcustomer = async codeid => {
    let {
      desc,
      checkd,
      address1,
      address2,
      address3,
      address4,
      address5,
      temp,
    } = this.state;
    await this.props.Corporatecustomers().then(res => {
      console.log(res);
      let objIndex = res.findIndex(obj => obj.code == codeid);
      console.log(objIndex);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      desc = temp.name;
      checkd = temp.isactive;
      address1 = temp.add1;
      address2 = temp.add2;
      address3 = temp.add3;
      address4 = temp.add4;
      address5 = temp.add5;
      console.log(temp);
      this.setState({
        desc,
        checkd,
        address1,
        address2,
        address3,
        address4,
        address5,
        temp,
      });
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      code,
      desc,
      checkd,
      address1,
      address2,
      address3,
      address4,
      address5,
    } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "checked") {
      checkd = value;
      this.setState({ checkd });
    }
    if (name == "address5") {
      address5 = value;
      this.setState({ address5 });
    }
    if (name == "address1") {
      address1 = value;
      this.setState({ address1 });
    }
    if (name == "address2") {
      address2 = value;
      this.setState({ address2 });
    }
    if (name == "address3") {
      address3 = value;
      this.setState({ address3 });
    }
    if (name == "address4") {
      address4 = value;
      this.setState({ address4 });
    }
  };

  finalcorporate = async () => {
    let { desc, checkd, address1, address2, address3, address4, address5 } =
      this.state;
    if (
      desc == null ||
      address4 == null ||
      address5 == null ||
      address1 == null ||
      address2 == null ||
      address3 == null
    ) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newreason = {
        code: this.state.itemId,
        name: desc,
        add1: address1,
        add2: address2,
        add3: address3,
        add4: address4,
        add5: address5,
        isactive: checkd,
      };
      await this.props
        .updateCommon(
          `Corporatecustomers/update?where=%7B%22code%22%3A%20%22${this.state.itemId}%22%7D

            `,
          newreason
        )
        .then(data => {})
        .catch(e => console.log(e));
    }
  };
  render() {
    let { t } = this.props;
    let {
      code,
      desc,
      checkd,
      address1,
      address2,
      address3,
      address4,
      address5,
    } = this.state;
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
              {t("Customer Master ")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Corporate Customer ")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5">{t("Corporate Customer ")}</h5>
          <div className="col-4">
            <div className="mt-3">
              <span>{t("Code")}</span>
              <span style={{ color: "red" }}>*</span>
              <div className="input-group">
                <NormalInput
                  value={this.state.itemId}
                  name="code"
                  onChange={this.temp}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 col-6">
            <span>{t("Description")}</span>
            <span style={{ color: "red" }}>*</span>
            <div className="input-group d-flex">
              <div>
                <NormalInput
                  value={desc}
                  name="desc"
                  onChange={this.temp}
                  placeholder="Enter Description"
                />
              </div>
              <div className="ml-5">
                <div className="d-flex input-group">
                  <NormalCheckbox
                    checked={checkd}
                    onChange={this.temp}
                    name="checked"
                  />
                  <p>{t("Active")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="mt-3">
              <span>{t("Address")}</span>
              <span style={{ color: "red" }}>*</span>
              <div className="input-group">
                <NormalInput
                  value={address1}
                  name="address1"
                  onChange={this.temp}
                  placeholder="Enter Address1"
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="mt-3">
              <div className="input-group">
                <NormalInput
                  value={address2}
                  name="address2"
                  onChange={this.temp}
                  placeholder="Enter Address2"
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="mt-3">
              <div className="input-group">
                <NormalInput
                  value={address3}
                  name="address3"
                  onChange={this.temp}
                  placeholder="Enter Address3"
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="mt-3">
              <div className="input-group">
                <NormalInput
                  value={address4}
                  name="address4"
                  onChange={this.temp}
                  placeholder="Enter Address4"
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="mt-3">
              <div className="input-group">
                <NormalInput
                  value={address5}
                  name="address5"
                  onChange={this.temp}
                  placeholder="Enter Address5"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 ml-4" style={{ width: 100 }}>
          <NormalButton
            mainbg={true}
            label={"Update"}
            onClick={() => this.finalcorporate()}
          />
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Corporatecustomers,
      updateCommon,
    },
    dispatch
  );
};

export const EditCorporate = withTranslation()(
  connect(null, mapDispatchToProps)(EditCorporateClass)
);
