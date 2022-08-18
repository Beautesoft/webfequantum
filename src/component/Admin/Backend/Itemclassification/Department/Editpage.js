import React, { Component } from "react";
import {
  NormalButton,
  NormalDate,
  NormalSelect,
  NormalCheckbox,
  NormalInput,
} from "component/common";
import { withTranslation } from "react-i18next";
import { NewItemDepts, ItemDepts, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import moment from "moment";

export default class EditdepartmentCLass extends Component {
  state = {
    itemId: null,
    desc: null,
    validityperiod: null,
    fesequence: null,
    option: [
      { label: " 1 Year", value: 1 },
      { label: " 2 Year", value: 2 },
      { label: " 3 Year", value: 3 },
      { label: "Unlimited", value: 100 },
    ],
    code: null,
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
    let { itemId } = this.state;
    itemId = window.location.pathname.split("/")[4];
    this.setState({ itemId });
    console.log(itemId);
    this.listofdept(itemId);
  };

  listofdept = async code => {
    let {
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
      temp,
    } = this.state;
    await this.props.ItemDepts().then(res => {
      let objIndex = res.findIndex(obj => obj.itmCode == code);
      console.log(objIndex);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      console.log(temp);
      desc = temp.itmDesc;
      count = temp.validityPeriod;
      fesequence = temp.itmSeq;
      fdate = moment(temp.vilidityFromDate)._d;
      tdate = moment(temp.vilidityToDate)._d;
      dept = temp.itmStatus;
      cash = temp.allowcashsales;
      sales = temp.itmShowonsales;
      retail = temp.isRetailproduct;
      salon = temp.isSalonproduct;
      service = temp.isService;
      voucher = temp.isVoucher;
      prepaid = temp.isPrepaid;
      ftrial = temp.isfirsttrial;
      this.setState({
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
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { deptcode, desc, count, fesequence, fdate, tdate } = this.state;
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
        tdate = new Date();
        tdate.setFullYear(tdate.getFullYear() + 1);
        console.log(tdate);
        this.setState({ tdate });
      } else if (count == 2) {
        tdate = new Date();
        tdate.setFullYear(tdate.getFullYear() + 2);
        this.setState({ tdate });
      } else if (count == 3) {
        tdate = new Date();
        tdate.setFullYear(tdate.getFullYear() + 3);
        this.setState({ tdate });
      } else {
        tdate = new Date();
        tdate.setFullYear(tdate.getFullYear() + 978);
        this.setState({ tdate });
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
        .updateCommon(
          `ItemDepts/update?where=%7B%22itmCode%22%3A%20%22${this.state.itemId}%22%7D

    `,
          newdept
        )
        .then(data => {
          this.handleimput();
        })
        .catch(e => console.log(e));
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
  };

  handleDatePick = (name, value) => {
    console.log(name, value);
    let { fdate, tdate } = this.state;
    if ((name = "fdate")) {
      fdate = value;
    }
    if ((name = "tdate")) {
      tdate = value;
    }
    this.setState({
      fdate,
      tdate,
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
      itemId,
    } = this.state;
    return (
      <>
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
                  value={itemId}
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
                  value={tdate}
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
              label={"Update"}
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
      updateCommon,
    },
    dispatch
  );
};

export const Editdepartment = withTranslation()(
  connect(null, mapDispatchToProps)(EditdepartmentCLass)
);
