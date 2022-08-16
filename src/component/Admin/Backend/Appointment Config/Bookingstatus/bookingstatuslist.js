import React, { Component } from "react";
import { NormalButton, NormalCheckbox, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import {
  NewApptBookingStatuses,
  ApptBookingStatuses,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class BookingstatuslistClass extends Component {
  state = {
    code: null,
    desc: null,
    colorcode: null,
    checked: true,
    List: [],
  };

  componentDidMount = () => {
    this.Listofbooking({});
  };

  Listofbooking = async () => {
    let { List, code } = this.state;
    await this.props.ApptBookingStatuses().then(res => {
      console.log(res);
      List = res;
      console.log(List);
      this.setState({
        List,
      });
      console.log(List.length);
    });
    if (List.length > 0) {
      code = List[List.length - 1].bsCode;
      code = Number(code) + 1;
    } else {
      code = 10001;
    }
    this.setState({
      code,
    });
  };

  handleinput = ({ target: { value, name } }) => {
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

  Addnewbooking = async () => {
    let { code, desc, colorcode, checked } = this.state;
    if (code == null || desc == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let newbooking = {
        bsCode: code,
        bsDesc: desc,
        bsColorCode: colorcode,
        active: true,
      };
      await this.props
        .NewApptBookingStatuses(newbooking)
        .then(data => {
          code = "";
          desc = "";
          colorcode = "";
          checked = false;
          this.setState({ checked, code, desc, colorcode });
          this.Listofbooking();
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
              {t("Booking Status List")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Operation")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5">Appointment Booking Status</h5>
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
                    disabled={true}
                  />
                </div>
              </div>
              <div className="mt-3">
                <p>{t("Color Code")}</p>
                <div className="input-group">
                  <NormalInput value={colorcode} onChange={this.handleinput} />
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
                  label={"Add"}
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
      NewApptBookingStatuses,
      ApptBookingStatuses,
    },
    dispatch
  );
};

export const Bookingstatuslist = withTranslation()(
  connect(null, mapDispatchToProps)(BookingstatuslistClass)
);
