import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { history } from "helpers";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
import { withTranslation } from "react-i18next";
import { NormalButton, NormalDate } from "component/common";
import { dateFormat } from "service/helperFunctions";

export class ChangeDateClass extends Component {
  state = { newDate: new Date(), TransactionId: "" };

  componentDidMount() {
    let TransactionId = this.props.TransactionId;
    let newDate = new Date(this.props.TransactionDate);
    this.setState({
      TransactionId,
      newDate,
    });
  }

  handleSubmit = () => {
    let payload = {
      sa_transacno: this.state.TransactionId,
      pay_date: dateFormat(this.state.newDate, "dd-mm-yyy"),
    };
    this.props.commonCreateApi(`changedate/`, payload).then(res => {
      this.props.handleModal();
    });
  };
  handleChange = async e => {
    await this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    let { newDate } = this.state;
    let { t } = this.props;
    return (
      <div className="container-fluid mb-4 mt-2">
        <div className="row pb-3">
          <div className="col-md-8 col-12">
            <h5>{t("Change Date")}</h5>
          </div>
          <div className="col-md-4 col-12"></div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-wrap py-2 justify-content-around">
              <div className="col-md-8 col-12">
                <div className="d-flex justify-content-center align-items-center">
                  <NormalDate
                    value={new Date(newDate)}
                    name="newDate"
                    type="date"
                    onChange={this.handleChange}
                    showDisabledMonthNavigation
                  />
                </div>
              </div>
              <div className="col-md-4 col-12">
                <NormalButton
                  mainbg={false}
                  className="col-12 fs-15 submit-btn"
                  label="Done"
                  onClick={() => this.handleSubmit()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const ChangeDate = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ChangeDateClass)
);
