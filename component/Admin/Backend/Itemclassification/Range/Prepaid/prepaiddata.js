import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  NormalInput,
  NormalSelect,
} from "component/common";
import { withTranslation } from "react-i18next";
import { NewItemRanges, ItemBrands, rangelists } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class ItemrangeprepaidClass extends Component {
  state = {
    code: null,
    desc: null,
    brandlist: [],
    brand: null,
    checked: true,
  };
  componentDidMount = () => {
    this.Listofbrans({});
    this.Listofrange({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofrange = async () => {
    let { code, te } = this.state;
    await this.props.rangelists().then((res) => {
      if (res.length > 0) {
        te = res[res.length - 1].itmCode;
        code = Number(te) + 1;
      } else {
        code = 100001;
      }
      this.setState({ code });
    });
  };
  Listofbrans = async () => {
    await this.props.ItemBrands().then((res) => {
      console.log(res);
      let { brandlist } = this.state;

      for (let key of res) {
        if (key.prepaidBrand == true) {
          brandlist.push({ value: key.itmCode, label: key.itmDesc });
        }
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
    let { code, desc, brand, checked } = this.state;
    let newbrand = {
      itmCode: code,
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
      isvoucher: false,
      isprepaid: true,
      iscompound: false,
    };
    await this.props
      .NewItemRanges(newbrand)
      .then((data) => {
        Toast({
          type: "success",
          message: "Successfully Added",
        });

        code = "";
        desc = "";
        checked = true;
        brand = "";
        this.setState({ code, desc, brand, checked });
        this.Listofrange();
      })
      .catch((e) => console.log(e));
  };

  render() {
    let { t } = this.props;
    let { code, desc, checked, brand, brandlist } = this.state;
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
              {t("Prepaid Range")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Prepaid range data")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            {t("Prepaid Range")}
          </h5>
          <div className="d-flex mt-5">
            <div className="col-6">
              <span>Code</span>
              <span style={{ color: "red" }}>*</span>
              <NormalInput
                value={code}
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
              label={"Add"}
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
      rangelists,
    },
    dispatch
  );
};

export const Itemrangeprepaid = withTranslation()(
  connect(null, mapDispatchToProps)(ItemrangeprepaidClass)
);
