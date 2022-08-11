import React, { Component } from "react";
import { NormalButton, NormalCheckbox, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import { updateCommon, ApptBookingStatuses } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class Editbookingstatusclass extends Component {
  state = {
    itemId: null,
    desc: null,
    colorcode: null,
    checked: true,
  };

  componentDidMount = () => {
    let { itemId } = this.state;
    itemId = window.location.pathname.split("/")[4];
    this.setState({ itemId });
    console.log(itemId);
    this.Listofbooking(itemId);
  };

  Listofbooking = async code => {
    let { temp, desc, colorcode, checked } = this.state;
    await this.props.ApptBookingStatuses().then(res => {
      let objIndex = res.findIndex(obj => obj.bsCode == code);
      console.log(objIndex);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      desc = temp.bsDesc;
      colorcode = temp.bsColorCode;
      checked = temp.active;
      this.setState({
        desc,
        colorcode,
        checked,
      });
    });
  };

  handleinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, colorcode, checked } = this.state;
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

  Addnewbooking = async () => {
    let { desc, colorcode, checked, itemId } = this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let editdata = {
        bsCode: itemId,
        bsDesc: desc,
        bsColorCode: colorcode,
        active: checked,
      };
      await this.props
        .updateCommon(
          `ApptBookingStatuses/update?where=%7B%22bsCode%22%3A%20%22${this.state.itemId}%22%7D

    `,
          editdata
        )
        .then(data => {})
        .catch(e => console.log(e));
    }
  };
  render() {
    let { t } = this.props;
    let { itemId, desc, colorcode, checked } = this.state;
    return (
      <>
        <div className="container-fluid">
          <h5 className="mt-5">Appointment Booking Status</h5>
          <div className="row">
            <div className="col-6 ">
              <div className="mt-3">
                <span>{t("Code")}</span>
                <span style={{ color: "red" }}>*</span>
                <div className="input-group">
                  <NormalInput
                    value={itemId}
                    name="code"
                    onChange={this.handleinput}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="mt-3">
                <p>{t("Color Code")}</p>
                <div className="input-group">
                  <NormalInput
                    value={colorcode}
                    onChange={this.handleinput}
                    name="colorcode"
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
                  <p>{t("is Currently Active")}</p>
                </div>
              </div>
              <div className="mt-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Update"}
                  onClick={() => this.Addnewbooking()}
                />
              </div>
            </div>

            <div className="col-6 ">
              <div className="mt-3">
                <span>{t("Description")}</span>
                <span className="star">*</span>
                <div className="input-group">
                  <NormalInput
                    value={desc}
                    name="desc"
                    onChange={this.handleinput}
                  />
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="color"
                  className="mt-4"
                  style={{ width: 70 }}
                  onChange={this.handleinput}
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
      updateCommon,
      ApptBookingStatuses,
    },
    dispatch
  );
};

export const Editbookingstatus = withTranslation()(
  connect(null, mapDispatchToProps)(Editbookingstatusclass)
);
