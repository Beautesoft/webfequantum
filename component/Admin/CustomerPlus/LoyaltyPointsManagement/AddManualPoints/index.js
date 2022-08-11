import React from "react";
import { Link } from "react-router-dom";
import { NormalInput, NormalSelect, NormalButton } from "component/common";
import { bindActionCreators } from "redux";
import { AddManualLoyaltyPoints } from "redux/actions/customerPlus";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Toast } from "service/toast";

class AddManualPointsClass extends React.Component {
  state = {
    policyOptions: [],
    description: "",
    points: 0,
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    let type = this.props.match.params.type;
    if (type !== "reward" && type !== "redeem") this.props.history.push("./");
  }

  onChange = e => {
    this.updateState({ [e.target.name]: e.target.value });
  };

  onSubmit = async () => {
    let { description, points } = this.state;
    if (!description || !points || points == 0)
      return Toast({ type: "error", message: "Errors in Fields" });
    let data = {};
    data.total_point = points;
    data.remarks = description;
    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);
    data.date = localISOTime;
    await this.props.AddManualLoyaltyPoints(
      this.props.match.params.id,
      `?type=${this.props.match.params.type}`,
      data
    );
    this.props.history.goBack();
  };
  render() {
    let { t } = this.props;
    let { description, points } = this.state;
    let type =
      this.props.match.params.type.charAt(0).toUpperCase() +
      this.props.match.params.type.slice(1);
    return (
      <div className="container-fuild">
        <div className="head-label-nav">
          <p className="category">{t("CustomerPlus")}</p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">{this.props.match.params.id}</p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">{t("LP Management")}</p>
          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">{t("Add Manual " + type)}</p>
        </div>
        <div className="container-lg mt-5">
          <div className="row align-items-center">
            <div className="col-md-12 mb-4">
              <h3>{t(" Add Manual " + type)}</h3>
            </div>
          </div>
          <div className="form-group pb-2 mb-4">
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Description")}
                </label>
                <NormalInput
                  name="description"
                  value={description}
                  onChange={this.onChange}
                />
              </div>
              <div className="col-md-6 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Points")}
                </label>
                <NormalInput
                  name="points"
                  value={points}
                  type="number"
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div className="row pt-5 d-flex justify-content-center">
              <div className="col-md-3 mb-4">
                <Link
                  to={`/admin/customerplus/${this.props.match.params.id}/lpmanagement`}
                >
                  <NormalButton
                    label="Cancel"
                    resetbg={true}
                    className="mr-2 bg-danger text-light col-12"
                  />
                </Link>
              </div>
              <div className="col-md-3">
                <NormalButton
                  label="Save"
                  success={true}
                  className="mr-2 col-12"
                  onClick={this.onSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ AddManualLoyaltyPoints }, dispatch);
};

export const AddManualPoints = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddManualPointsClass)
);
