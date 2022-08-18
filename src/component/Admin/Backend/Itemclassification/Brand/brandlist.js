import React, { Component } from "react";
import { NormalButton, NormalCheckbox, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import { NewItemBrands, ItemBrands } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class BranddataCLass extends Component {
  state = {
    code: null,
    desc: null,
    active: true,
    Show_retail: false,
    Show_voucher: false,
    Show_prepaid: false,
  };
  componentDidMount = () => {
    this.listofbrand({});
  };

  listofbrand = async () => {
    let { code, te } = this.state;
    await this.props.ItemBrands().then(res => {
      if (res.length > 0) {
        te = res[res.length - 1].itmCode;
        code = Number(te) + 1;
      } else {
        code = 100001;
      }
      this.setState({
        code,
      });
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, active, Show_retail, Show_voucher, Show_prepaid } =
      this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "active") {
      active = value;
      this.setState({ active });
    }
    if (name == "retails") {
      Show_retail = value;
      this.setState({ Show_retail });
    }
    if (name == "voucher") {
      Show_voucher = value;
      this.setState({ Show_voucher });
    }
    if (name == "prepaid") {
      Show_prepaid = value;
      this.setState({ Show_prepaid });
    }
  };

  Addnewbrand = async () => {
    let { code, desc, active, Show_retail, Show_voucher, Show_prepaid } =
      this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newbrand = {
        itmCode: code,
        itmDesc: desc,
        itmStatus: active,
        voucherBrand: Show_voucher,
        voucherForSales: Show_voucher,
        retailProductBrand: Show_retail,
        prepaidBrand: Show_prepaid,
      };
      await this.props
        .NewItemBrands(newbrand)
        .then(data => {
          this.listofbrand();
          desc = "";
          active = true;
          Show_prepaid = false;
          Show_retail = false;
          Show_voucher = false;
          this.setState({
            desc,
            active,
            Show_voucher,
            Show_retail,
            Show_prepaid,
          });
        })

        .catch(e => console.log(e));
    }
  };

  render() {
    let { t } = this.props;
    let { code, desc, active, Show_prepaid, Show_retail, Show_voucher } =
      this.state;
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
              {t("Brand List")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Brand")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            {t("Brand")}
          </h5>
          <div className="d-flex mt-5">
            <div className="col-6">
              <span>Code</span>
              <span style={{ color: "red" }}>*</span>
              <NormalInput
                value={code}
                name="code"
                type="number"
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
          <div className="d-flex mt-3">
            <div className="col-3">
              <div className="d-flex">
                <NormalCheckbox
                  checked={active}
                  name="active"
                  onChange={this.temp}
                />
                <p>{t("Brand is Currently Active")}</p>
              </div>
            </div>
            <div className="col-3">
              <div className="d-flex">
                <NormalCheckbox
                  name="retails"
                  checked={Show_retail}
                  onChange={this.temp}
                />
                <p>{t("Show on retail")}</p>
              </div>
            </div>
            <div className="col-3">
              <div className="d-flex">
                <NormalCheckbox
                  name="voucher"
                  checked={Show_voucher}
                  onChange={this.temp}
                />
                <p>{t("Show on voucher")}</p>
              </div>
            </div>
            <div className="col-3">
              <div className="d-flex">
                <NormalCheckbox
                  name="prepaid"
                  checked={Show_prepaid}
                  onChange={this.temp}
                />
                <p>{t("Show on prepaid")}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 col-1">
            <NormalButton
              mainbg={true}
              label={"ADD"}
              onClick={() => this.Addnewbrand()}
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
      NewItemBrands,
      ItemBrands,
    },
    dispatch
  );
};

export const Branddata = withTranslation()(
  connect(null, mapDispatchToProps)(BranddataCLass)
);
