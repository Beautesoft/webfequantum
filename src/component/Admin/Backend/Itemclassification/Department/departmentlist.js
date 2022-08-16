import React, { Component } from "react";
import {
  NormalButton,
  NormalDate,
  NormalSelect,
  NormalCheckbox,
  NormalInput,
} from "component/common";
import { withTranslation } from "react-i18next";
import { NewItemDepts, ItemDepts } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class DepartmentdataCLass extends Component {
  state = {
    deptcode: null,
    desc: null,
    validityperiod: null,
    fesequence: null,
    option: [
      { label: " 1 Year", value: 1 },
      { label: " 2 Year", value: 2 },
      { label: " 3 Year", value: 3 },
      { label: "Unlimited", value: 100 },
    ],
    count: null,
    fdate: new Date(),
    tdate: new Date(),
    dept: true,
    cash: false,
    sales: false,
    retail: false,
    salon: false,
    service: false,
    voucher: false,
    prepaid: false,
    ftrial: false,
    max_Date: new Date(),
    depts: [],
  };

  componentDidMount = () => {
    this.listofdept({});
  };

  listofdept = async () => {
    let { deptcode, te } = this.state;

    await this.props.ItemDepts().then(res => {
      if (res.length > 0) {
        te = res[res.length - 1].itmCode;
        deptcode = Number(te) + 1;
      } else {
        deptcode = 1;
      }
      this.setState({
        deptcode,
      });
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { deptcode, desc, count, fesequence, fdate, tdate, max_Date } =
      this.state;
    if (name == "deptcode") {
      deptcode = value;
      this.setState({ deptcode });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "count") {
      count = value;
      this.setState({ count });
      console.log(count);
      if (count == 1) {
        max_Date = new Date();
        max_Date.setFullYear(max_Date.getFullYear() + 1);
        console.log(max_Date);
        this.setState({ max_Date });
      } else if (count == 2) {
        max_Date = new Date();
        max_Date.setFullYear(max_Date.getFullYear() + 2);
        this.setState({ max_Date });
      } else if (count == 3) {
        max_Date = new Date();
        max_Date.setFullYear(max_Date.getFullYear() + 3);
        this.setState({ max_Date });
      } else {
        max_Date = new Date();
        max_Date.setFullYear(max_Date.getFullYear() + 978);
        this.setState({ max_Date });
      }
    }
    if (name == "fe") {
      fesequence = value;
      this.setState({ fesequence });
    }
    if (name == "fdate") {
      fdate = value;
      this.setState({ fdate });
    }
    if (name == "tdate") {
      tdate = value;
      this.setState({ tdate });
    }
  };

  tempone = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      dept,
      cash,
      sales,
      retail,
      salon,
      service,
      voucher,
      prepaid,
      ftrial,
    } = this.state;
    if (name == "dept") {
      dept = value;
      this.setState({ dept });
    }
    if (name == "cash") {
      cash = value;
      this.setState({ cash });
    }
    if (name == "sales") {
      sales = value;
      this.setState({ sales });
    }
    if (name == "retail") {
      retail = value;
      this.setState({ retail });
    }
    if (name == "salon") {
      salon = value;
      this.setState({ salon });
    }
    if (name == "service") {
      service = value;
      this.setState({ service });
    }
    if (name == "voucher") {
      voucher = value;
      this.setState({ voucher });
    }
    if (name == "prepaid") {
      prepaid = value;
      this.setState({ prepaid });
    }
    if (name == "ftrial") {
      ftrial = value;
      this.setState({ ftrial });
    }
  };

  Addnewequiment = async () => {
    let {
      deptcode,
      desc,
      count,
      fesequence,
      fdate,
      tdate,
      dept,
      cash,
      sales,
      retail,
      salon,
      service,
      voucher,
      prepaid,
      ftrial,
      objIndex,
    } = this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      await this.props.ItemDepts().then(res => {
        objIndex = res.findIndex(obj => obj.itmCode == deptcode);
      });

      if (objIndex == -1) {
        let newdept = {
          itmCode: deptcode,
          itmDesc: desc,
          itmStatus: true,
          itmSeq: fesequence,
          allowcashsales: cash,
          itmShowonsales: sales,
          isfirsttrial: ftrial,
          isVoucher: voucher,
          isPrepaid: prepaid,
          isRetailproduct: retail,
          isSalonproduct: salon,
          isPackage: true,
          validityPeriod: count,
          isService: service,
          isCompound: true,
          deptPic: "string",
          vilidityFromDate: fdate,
          vilidityToDate: tdate,
          vilidityFromTime: fdate,
          vilidityToTime: tdate,
        };
        await this.props
          .NewItemDepts(newdept)
          .then(data => {
            this.handleimput();
          })
          .catch(e => console.log(e));
      } else {
        Toast({
          type: "error",
          message: "Please check code is already present",
        });
      }
    }
  };

  handleimput = () => {
    let {
      deptcode,
      desc,
      count,
      fesequence,
      fdate,
      tdate,
      dept,
      cash,
      sales,
      retail,
      salon,
      service,
      voucher,
      prepaid,
      ftrial,
    } = this.state;

    desc = "";
    count = "";
    fesequence = "";
    fdate = new Date();
    tdate = new Date();
    dept = false;
    cash = false;
    sales = false;
    retail = false;
    salon = false;
    service = false;
    voucher = false;
    prepaid = false;
    ftrial = false;
    this.setState({
      deptcode,
      desc,
      count,
      fesequence,
      fdate,
      tdate,
      dept,
      cash,
      sales,
      retail,
      salon,
      service,
      voucher,
      prepaid,
      ftrial,
    });
    this.listofdept();
  };

  handleDatePick = (name, value) => {
    console.log(name, value);
    let { fdate, max_Date } = this.state;
    if ((name = "fdate")) {
      fdate = value;
    }
    if ((name = "tdate")) {
      max_Date = value;
    }
    this.setState({
      fdate,
      max_Date,
    });
  };

  render() {
    let { t } = this.props;
    let {
      deptcode,
      desc,
      fesequence,
      option,
      count,
      fdate,
      tdate,
      dept,
      cash,
      sales,
      retail,
      salon,
      service,
      voucher,
      prepaid,
      ftrial,
      max_Date,
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
              {t("Item Classification")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p
              className="sub-category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Department List ")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Department Data Entry ")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5" style={{ marginLeft: 15 }}>
            {t("Department Data Entry")}
          </h5>
          <div className="col-6">
            <div className="mt-5">
              <span>{t("Department Code")}</span>
              <span style={{ color: "red" }}>*</span>
              <div className="input-group">
                <NormalInput
                  onChange={this.temp}
                  value={deptcode}
                  type="number"
                  name="deptcode"
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className=" col-6 mt-2">
            <span>{t("Description")}</span>
            <span style={{ color: "red" }}>*</span>
            <div className="input-group">
              <NormalInput onChange={this.temp} value={desc} name="desc" />
            </div>
          </div>
          <div className=" col-6 mt-2">
            <p>{t("Validity Period")}</p>
            <div className="input-group">
              <NormalSelect
                options={option}
                value={count}
                onChange={this.temp}
                name="count"
              />
            </div>
          </div>
          <div className="d-flex mt-3 col-6">
            <div className="input-group">
              <p>{t("Validity From")}</p>
              <div className="input-group">
                <NormalDate
                  onChange={this.handleDatePick}
                  value={fdate}
                  name="fdate"
                  showYearDropdown={true}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
            </div>
            <div className="col-2"></div>
            <div className="input-group">
              <p>{t("Validity To")}</p>
              <div className="input-group">
                <NormalDate
                  onChange={this.handleDatePick}
                  value={max_Date}
                  name="tdate"
                  showYearDropdown={true}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="mt-2">
              <span>{t("FE Sequence No")}</span>
              <span style={{ color: "red" }}>*</span>
              <div className="input-group">
                <NormalInput
                  onChange={this.temp}
                  type="number"
                  value={fesequence}
                  name="fe"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={dept}
                name="dept"
                onChange={this.tempone}
              />
              <p>{t("Department is currently active")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={cash}
                name="cash"
                onChange={this.tempone}
              />
              <p>{t("Allow Cash Sales")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={sales}
                name="sales"
                onChange={this.tempone}
              />
              <p>{t("Show on Sales")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={ftrial}
                name="ftrial"
                onChange={this.tempone}
              />
              <p>{t("This is first trial")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={retail}
                name="retail"
                onChange={this.tempone}
              />
              <p>{t("This is retail product")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={salon}
                name="salon"
                onChange={this.tempone}
              />
              <p>{t("This is salon product")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={service}
                name="service"
                onChange={this.tempone}
              />
              <p>{t("This is service")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={voucher}
                name="voucher"
                onChange={this.tempone}
              />
              <p>{t("This is voucher")}</p>
            </div>
            <div className="d-flex mt-2 ml-3">
              <NormalCheckbox
                checked={prepaid}
                name="prepaid"
                onChange={this.tempone}
              />
              <p>{t("This is prepaid")}</p>
            </div>
          </div>

          <div className="mt-3 col-1">
            <NormalButton
              mainbg={true}
              label={"ADD"}
              onClick={() => this.Addnewequiment()}
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
      NewItemDepts,
      ItemDepts,
    },
    dispatch
  );
};

export const Departmentdata = withTranslation()(
  connect(null, mapDispatchToProps)(DepartmentdataCLass)
);
