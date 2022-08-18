import React, { Component } from "react";
import { getStaff } from "redux/actions/staff";
import { commonUpdateApi, commonCreateApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NormalTime, NormalDateTime, NormalButton } from "component/common";
// import { dateFormat } from 'highcharts';
import { dateFormat } from "service/helperFunctions";
import { withTranslation } from "react-i18next";

export class DetailsClass extends Component {
  state = {
    inTime: null,
    outTime: null,
    date: null,
  };

  componentWillMount() {}

  handleDatePick = async (name, value) => {
    console.log(name, value, "sdfgdfhfshg", dateFormat(new Date()));
    // dateFormat(new Date())
    let { formFields } = this.state;
    formFields[name] = value;
    formFields[name] = value;
    await this.setState({
      formFields,
    });
  };

  //  create shift for staff
  handleSubmit = () => {
    let { inTime, outTime, date } = this.state;
    let data = {
      Attn_Emp_code: this.props.id,
      Attn_Date: date,
      Attn_Time: inTime,
    };
    this.props.commonCreateApi("shift/", data).then((res) => {
      console.log(res, "jkdfskjdfsdfl");
    });
  };

  // update shift for outtime
  handleUpdate = () => {
    let { inTime, outTime, date } = this.state;
    let data = {
      Attn_Date: date,
      Attn_Mov_In: outTime,
    };
    this.props.commonUpdateApi("shift/", data).then((res) => {
      console.log(res, "jkdfskjdfsdfl");
    });
  };

  render() {
    let { staffDetail = {}, t } = this.props;
    let { inTime, outTime } = this.state;
    let {
      emp_phone1,
      emp_email,
      emp_address,
      Emp_sexesid,
      emp_dob,
      emp_joindate,
      site_name,
      shift_name,
      skills_list,
    } = staffDetail;
    console.log("aksjhdkajdhs", staffDetail);
    return (
      <div className="staff-details row m-0">
        <div className="col-9">
          <div className="pt-5 row m-0">
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("Contact Number")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{emp_phone1}</p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("Email Address")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{emp_email}</p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("Address")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{emp_address}</p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("Gender")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">
                {Emp_sexesid === 2 ? "Female" : "Male"}
              </p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("DOB")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{emp_dob}</p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("Joining Date")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{emp_joindate}</p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("Branch")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{site_name}</p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-4">{t("Shift")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{shift_name}</p>
            </div>
            <div className="col-3">
              <p className="staff-detail-desc pb-2">{t("Skills")}</p>
            </div>
            <div className="col-9">
              <p className="staff-detail-text pb-4">{skills_list}</p>
            </div>
          </div>
        </div>
        <div className="col-3 p-0 pt-5">
          <p className="staff-detail-desc fs-20 pb-2">
            {t("Attendence Update")}
          </p>
          <p className="staff-detail-desc pb-2">{t("Intime")}</p>
          <div className="input-group">
            <NormalDateTime
              onChange={this.handleDatePick}
              inputcol="p-0 inTime"
              value={outTime}
              label="inTime"
              name="inTime"
              timeOnly={true}
              showTime={true}
              dateFormat="h:mm aa"
            />
          </div>
          <p className="staff-detail-desc pb-2">{t("Outtime")}</p>
          <div className="input-group">
            <NormalDateTime
              onChange={this.handleDatePick}
              inputcol="p-0 outTime"
              label="outTime"
              name="outTime"
              timeOnly={true}
              dateFormat="h:mm aa"
              showTime={true}
            />
          </div>
          <NormalButton
            buttonClass={"my-2 attendence-update"}
            mainbg={true}
            className="col-12 fs-15 confirm"
            label="Update"
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  staffDetail: state.staff.staffDetail,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getStaff,
      commonUpdateApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const Details = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsClass)
);
