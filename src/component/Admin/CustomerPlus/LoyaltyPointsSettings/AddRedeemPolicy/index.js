import React from "react";
import { Link } from "react-router-dom";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalMultiSelect,
} from "component/common";
import { bindActionCreators } from "redux";
import {
  addRedeemPlolicySettings,
  updateRedeemPlolicySettings,
  getRedeemPlolicySettings,
} from "redux/actions/customerPlus";
import { getCommonApi } from "redux/actions/common";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import SimpleReactValidator from "simple-react-validator";

class AddRedeemPolicyClass extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator();
    this.state = {
      customerClassOptions: [],
      cust_type: "",
      cur_value: 0,
      point_value: 0,
      isactive: true,
      isMounted: true,
      itemDivOptions: [],
      item_divids: "",
      Item_Divid: [],
      dept_ids: "",
      dept_id: [],
      brand_ids: "",
      brand_id: [],
      departmentOptions: [],
      brandOptions: [],
    };
  }
  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount = async () => {
    let { Item_Divid, dept_id, brand_id } = this.state;
    this.props.getCommonApi("CustomerClassList/").then(e => {
      this.updateState({
        customerClassOptions: e.CustomerClasses.map(e => {
          return { label: e.class_desc, value: e.class_code };
        }),
      });
    });

    if (this.props.match.params.id) {
      await this.props
        .getRedeemPlolicySettings(`/${this.props.match.params.id}`)
        .then(async e => {
          console.log(e, "redeemPolicy");
          let { data } = e;
          await this.updateState({ ...data });
          if (data.Item_Divid) {
            for (let key of data.Item_Divid) {
              Item_Divid.push({
                label: key.label,
                value: String(key.value),
              });
            }
            await this.setState({
              Item_Divid,
            });
          }
          if (data.dept_id) {
            for (let key of data.dept_id) {
              dept_id.push({
                label: key.label,
                value: String(key.value),
              });
            }
            await this.setState({
              dept_id,
            });
          }

          if (data.brand_id) {
            for (let key of data.brand_id) {
              brand_id.push({
                label: key.label,
                value: String(key.value),
              });
            }
            await this.setState({
              brand_id,
            });
          }
        });
      //await this.getdefaultStaffList();
    }
    this.Selected_data();
  };

  Selected_data = async () => {
    let { Item_Divid, dept_id, brand_id } = this.state;
    this.props.getCommonApi(`catalogitemdiv/?salon=0`).then(async res => {
      console.log(res, "itemDivOptions");
      let itemDivOptions = [];
      Item_Divid = [];
      let { data, status } = res;
      if (status == 200) {
        if (data) {
          for (let key of data) {
            itemDivOptions.push({ label: key.desc, value: String(key.id) });
          }
          //Item_Divid = multidata;
          await this.setState({ itemDivOptions });
        }
      }
    });
    this.props.getCommonApi(`department/`).then(async res => {
      console.log(res, "departmentOptions");
      let departmentOptions = [];
      dept_id = [];
      let { data, status } = res;
      if (status == 200) {
        if (data) {
          for (let key of data) {
            departmentOptions.push({
              label: key.itm_desc,
              value: String(key.pk),
            });
          }
          //Item_Divid = multidata;
          await this.setState({ departmentOptions });
        }
      }
    });
    this.props.getCommonApi(`brand/`).then(async res => {
      console.log(res, "brandOptions");
      let brandOptions = [];
      brand_id = [];
      let { data, status } = res;
      if (status == 200) {
        if (data) {
          for (let key of data) {
            brandOptions.push({ label: key.itm_desc, value: String(key.pk) });
          }
          //Item_Divid = multidata;
          await this.setState({ brandOptions });
        }
      }
    });
  };
  onChange = e => {
    this.updateState({ [e.target.name]: e.target.value });
  };

  onSubmit = async () => {
    if (this.validator.allValid()) {
      let {
        cur_value,
        cust_type,
        isactive,
        point_value,
        Item_Divid,
        brand_id,
        dept_id,
      } = this.state;

      let data = {
        cur_value,
        cust_type,
        isactive,
        item_divids: Item_Divid.map(e => e.value).reduce(
          (a, e) => (a === "" ? e : a + "," + e),
          ""
        ),
        dept_ids: dept_id
          .map(e => e.value)
          .reduce((a, e) => (a === "" ? e : a + "," + e), ""),
        brand_ids: brand_id
          .map(e => e.value)
          .reduce((a, e) => (a === "" ? e : a + "," + e), ""),
        point_value,
      };
      if (this.props.match.params.id) {
        await this.props.updateRedeemPlolicySettings(
          this.props.match.params.id + "/",
          data
        );
      } else {
        await this.props.addRedeemPlolicySettings(data);
      }
      this.props.history.goBack();
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };

  handleMultiSelectDefaultDiv = async (data = []) => {
    let { Item_Divid } = this.state;
    console.log(Item_Divid);
    Item_Divid = data;
    await this.setState({ Item_Divid });
  };
  handleMultiSelectDefaultDept = async (data = []) => {
    let { dept_id } = this.state;
    console.log(dept_id);
    dept_id = data;
    await this.setState({ dept_id });
  };
  handleMultiSelectDefaultBrand = async (data = []) => {
    let { brand_id } = this.state;
    console.log(brand_id);
    brand_id = data;
    await this.setState({ brand_id });
  };
  render() {
    let { t } = this.props;
    let { cur_value, cust_type, isactive, point_value, customerClassOptions } =
      this.state;
    return (
      <div className="container-fuild">
        <div className="head-label-nav">
          <p
            className="category"
            onClick={() => this.props.history.push("/admin/customerplus")}
          >
            {t("CustomerPlus")}
          </p>
          <i className="icon-right mx-md-3"></i>
          <p
            className="sub-category"
            onClick={() => this.props.history.goBack()}
          >
            {t("Loyalty Points Management")}
          </p>

          <i className="icon-right mx-md-3"></i>
          <p className="sub-category">
            {t(
              (this.props.match.params.id ? "Edit" : "New") + " Redeem Policy"
            )}
          </p>
        </div>
        <div className="container-lg mt-5">
          <div className="row align-items-center">
            <div className="col-md-12 mb-4">
              <h3>
                {t(
                  (this.props.match.params.id ? "Edit" : "New") +
                    " Redeem Policy"
                )}
              </h3>
            </div>
          </div>
          <div className="form-group pb-2 mb-4">
            <div className="row">
              <div className="col-md-2 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Currency Value")}
                </label>
                <NormalInput
                  name="cur_value"
                  value={cur_value}
                  type="number"
                  onChange={this.onChange}
                />
              </div>
              <div className="col-md-2 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Point Value")}
                </label>
                <NormalInput
                  name="point_value"
                  value={point_value}
                  type="number"
                  onChange={this.onChange}
                />
              </div>
              <div className="col-md-4 mb-4">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Customer Class")}
                </label>
                <NormalSelect
                  name="cust_type"
                  options={customerClassOptions}
                  value={cust_type}
                  onChange={this.onChange}
                />
                {this.validator.message(
                  "customer class",
                  this.state.cust_type,
                  "required"
                )}
              </div>

              <div className="col-md-4 mb-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Item Div")}
                </label>
                <NormalMultiSelect
                  name="Item_Divid"
                  options={this.state.itemDivOptions}
                  value={this.state.Item_Divid ? this.state.Item_Divid : []}
                  handleMultiSelect={this.handleMultiSelectDefaultDiv}
                />
                {this.validator.message(
                  "item division",
                  this.state.Item_Divid,
                  "required"
                )}
              </div>
              <div className="col-md-4 mb-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Brand")}
                </label>
                <NormalMultiSelect
                  name="brand_id"
                  options={this.state.brandOptions}
                  value={this.state.brand_id ? this.state.brand_id : []}
                  handleMultiSelect={this.handleMultiSelectDefaultBrand}
                />
                {/* {this.validator.message(
                  "brand",
                  this.state.brand_id,
                  "required"
                )} */}
              </div>
              <div className="col-md-4 mb-4 col-12">
                <label className="text-left text-black common-label-text fs-17 pb-3">
                  {t("Department")}
                </label>
                <NormalMultiSelect
                  name="dept_id"
                  options={this.state.departmentOptions}
                  value={this.state.dept_id ? this.state.dept_id : []}
                  handleMultiSelect={this.handleMultiSelectDefaultDept}
                />
                {/* {this.validator.message(
                  "Department",
                  this.state.brand_id,
                  "required"
                )} */}
              </div>

              <div className="col-md-4 pt-md-5 mb-4">
                <input
                  type="checkbox"
                  name="isactive"
                  checked={isactive}
                  onClick={() => this.updateState({ isactive: !isactive })}
                />
                <label
                  for="name"
                  className="text-left text-black common-label-text fs-17 pb-3 ml-2"
                >
                  {t("Is Currently Active")}
                </label>
              </div>
            </div>
            <div className="row pt-5 d-flex justify-content-center">
              <div className="col-md-3 mb-4">
                <Link to="/admin/customerplus/lpmanagement">
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

const mapStateToProps = state => ({
  redeemPolicyList: state.customerPlus.redeemPolicyList,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addRedeemPlolicySettings,
      updateRedeemPlolicySettings,
      getCommonApi,
      getRedeemPlolicySettings,
    },
    dispatch
  );
};

export const AddRedeemPolicy = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddRedeemPolicyClass)
);
