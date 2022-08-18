import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  NormalInput,
  NormalSelect,
} from "component/common";
import { withTranslation } from "react-i18next";
import {
  NewItemRanges,
  ItemBrands,
  rangelists,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class EditvoucherClass extends Component {
  state = {
    itemId: null,
    desc: null,
    brandlist: [],
    brand: null,
    checked: true,
  };

  componentDidMount = () => {
    let { itemId } = this.state;
    itemId = window.location.pathname.split("/")[4];
    this.setState({ itemId });
    console.log(itemId);
    this.Listofbrans({});
    this.Listofrange(itemId);
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofrange = async (code) => {
    let { desc, brand, checked, temp } = this.state;
    await this.props.rangelists().then((res) => {
      let objIndex = res.findIndex((obj) => obj.itmCode == code);
      console.log(objIndex);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      console.log(temp);
      desc = temp.itmDesc;
      brand = temp.itmBrand;
      checked = temp.itmStatus;
      console.log(brand);
      this.setState({
        desc,
        brand,
        checked,
      });
    });
  };
  Listofbrans = async () => {
    await this.props.ItemBrands().then((res) => {
      console.log(res);
      let { brandlist } = this.state;

      for (let key of res) {
        brandlist.push({ value: key.itmCode, label: key.itmDesc });
      }
      console.log(brandlist);
      this.setState({
        brandlist,
        is_loading: false,
      });
      console.log(brandlist.length);
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, brand, checked } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "brand") {
      brand = value;
      this.setState({ brand });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
  };

  Addnewbrand = async () => {
    let { itemId, desc, brand, checked } = this.state;
    let editbrand = {
      itmCode: itemId,
      itmDesc: desc,
      itmStatus: checked,
      itmSeq: null,
      itmBrand: brand,
      itmDept: null,
      isproduct: false,
      picPath: null,
      prepaidForProduct: false,
      prepaidForService: false,
      prepaidForAll: false,
      isservice: false,
      isvoucher: true,
      isprepaid: false,
      iscompound: false,
    };
    await this.props
      .updateCommon(
        `ItemRanges/update?where=%7B%22itmCode%22%3A%20%22${this.state.itemId}%22%7D

    `,
        editbrand
      )
      .then((data) => {
        Toast({
          type: "success",
          message: "Successfully updated",
        });
      })
      .catch((e) => console.log(e));
  };

  render() {
    let { t } = this.props;
    let { itemId, desc, checked, brand, brandlist } = this.state;
    return (
      <>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            {t("Product Range")}
          </h5>
          <div className="d-flex mt-5">
            <div className="col-6">
              <span>Code</span>
              <span style={{ color: "red" }}>*</span>
              <NormalInput
                value={itemId}
                name="code"
                onChange={this.temp}
                disabled={true}
              />
            </div>
            <div className="col-6">
              <span>Description</span>
              <span style={{ color: "red" }}>*</span>
              <NormalInput value={desc} name="desc" onChange={this.temp} />
            </div>
          </div>
          <div className="d-flex mt-5">
            <div className="col-6">
              <span>Brand</span>
              <span style={{ color: "red" }}>*</span>
              <NormalSelect
                options={brandlist}
                value={brand}
                onChange={this.temp}
                name="brand"
              />
            </div>
            <div className="col-6">
              <div className="d-flex mt-4 ml-3">
                <NormalCheckbox
                  checked={checked}
                  name="checked"
                  onChange={this.temp}
                />
                <p>{t("Active")}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 col-1">
            <NormalButton
              mainbg={true}
              label={"Update"}
              onClick={() => this.Addnewbrand()}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      NewItemRanges,
      ItemBrands,
      updateCommon,
      rangelists,
    },
    dispatch
  );
};

export const Editvoucher = withTranslation()(
  connect(null, mapDispatchToProps)(EditvoucherClass)
);
