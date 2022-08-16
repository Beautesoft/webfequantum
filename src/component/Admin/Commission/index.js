import React, { Component } from "react";
import {
  NormalButton,
  NormalSelect,
  NormalInput,
  NormalDate,
  NormalModal,
} from "component/common";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ItemDivs,
  ItemDepts,
  ItemBrands,
  ItemRanges,
} from "redux/actions/Backend";
import {
  Amountapplicable,
  getAmountapplicable,
} from "redux/actions/Commission";
import { CredentialConfirmation } from "./credentialConfirmation";
import closeIcon from "assets/images/close.png";
import { getCommonApi } from "redux/actions/common";

export default class CommissionClass extends Component {
  state = {
    option: [
      { label: "Choose option", value: 10 },
      { label: "Choose option", value: 25 },
      { label: "Choose option", value: 50 },
      { label: "Choose option", value: 100 },
    ],
    period_val: [
      { label: "One month", value: 1 },
      { label: "Two month", value: 2 },
      { label: "Five month", value: 5 },
      { label: "One year", value: 10 },
    ],
    commission_type: [
      { label: "commission", value: 1 },
      { label: "Incentive", value: 2 },
    ],
    com_type: 1,
    count: 10,
    pro_name: "",
    F_date: new Date(),
    T_date: new Date(),
    max_range: "",
    min_range: "",
    commission: "",
    incentive: "",
    division: "",
    dept: "",
    brand: "",
    range: "",
    period: "",
    item: "",
    level: "",
    Emplevels: [],
    Division: [],
    depts: [],
    deptsval: "",
    rangeoption: [],
    brandlist: [],
    sales_amt: "",
    service_amt: "",
    sales_point: "",
    service_point: "",
    fees: false,
    commissiondetails: [
      {
        range_max: "",
        range_min: "",
        commission: "",
        incentive: "",
      },
    ],
    isLoginConfirmation: false,
  };

  componentDidMount = () => {
    this.Listofcommission({});
    this.Listofmenu({});
    this.listofbrand({});
  };

  handleChange = ({ target: { value, name } }) => {
    let { F_date, T_date } = this.state;
    console.log(value, name);
    if (name == "fromdate") {
      F_date = value;
    }
    if (name == "todate") {
      T_date = value;
    }
    this.setState({ F_date, T_date });
  };
  handletype = ({ target: { value, name } }) => {
    let {
      com_type,
      min_range,
      max_range,
      commission,
      incentive,
      Division,
      dept,
      brand,
      range,
      pro_name,
      period,
      item,
      divisionval,
      level,
      sales_amt,
      sales_point,
      service_amt,
      service_point,
    } = this.state;
    if (name == "com_type") {
      com_type = value;
    }
    if (name == "min_range") {
      min_range = value;
    }
    if (name == "max_range") {
      max_range = value;
    }
    if (name == "commission") {
      commission = value;
    }
    if (name == "incentive") {
      incentive = value;
    }
    if (name == "division") {
      divisionval = value;
      this.listofdept(divisionval);
      if (divisionval == "3") {
        this.Listofitemrange();
      }
    }
    if (name == "dept") {
      dept = value;
    }
    if (name == "brand") {
      brand = value;
      this.Listofitemrange();
    }
    if (name == "range") {
      range = value;
    }
    if (name == "pro_name") {
      pro_name = value;
    }
    if (name == "period") {
      period = value;
    }
    if (name == "item") {
      item = value;
    }
    if (name == "level") {
      level = value;
    }
    if (name == "sales_amt") {
      sales_amt = value;
    }
    if (name == "sales_point") {
      sales_point = value;
    }
    if (name == "service_amt") {
      service_amt = value;
    }
    if (name == "service_point") {
      service_point = value;
    }
    this.setState({
      com_type,
      min_range,
      max_range,
      commission,
      incentive,
      Division,
      dept,
      brand,
      range,
      item,
      period,
      pro_name,
      level,
      sales_amt,
      sales_point,
      service_amt,
      service_point,
    });
  };
  handleadditonal() {
    this.setState({
      fees: !this.state.fees,
    });
  }

  Listofcommission = async () => {
    let { Emplevels } = this.state;
    Emplevels = [];
    let emp_lvls = await this.props.getCommonApi("EmployeeLevels");
    console.log(emp_lvls.language);
    for (let key of emp_lvls.language) {
      Emplevels.push({
        value: key.level_code,
        label: key.level_name,
        id: key.level_itmid,
      });
    }
    console.log(Emplevels);
    this.setState({
      Emplevels,
    });
    let newreason = {
      employe_level_id: 22,
      profile_name: "Saravana",
      period: 1,
    };
    await this.props.Amountapplicable(newreason).then((data) => {
      console.log("Commsiis");
    });
  };

  Listofmenu = async () => {
    let { Division } = this.state;
    Division = [];
    await this.props.ItemDivs().then((res) => {
      for (let key of res) {
        Division.push({
          value: key.itmCode,
          label: key.itmDesc,
          id: key.itmId,
        });
      }
      console.log(Division);
      this.setState({
        Division,
      });
      console.log(Division.length);
    });
  };

  listofdept = async (div) => {
    let { depts } = this.state;
    depts = [];
    console.log(this.state.stockdivision);
    await this.props.ItemDepts().then((res) => {
      if (div == "1") {
        for (let key of res) {
          if (key.isRetailproduct == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (div == 2) {
        for (let key of res) {
          if (key.isSalonproduct == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (div == 3) {
        for (let key of res) {
          if (key.isService == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (div == 4) {
        for (let key of res) {
          if (key.isVoucher == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (div == 5) {
        for (let key of res) {
          if (key.isPrepaid == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }

      console.log(depts);
      this.setState({
        depts,
      });
      console.log(depts.length);
    });
  };

  Listofitemrange = async () => {
    let { rangeoption } = this.state;
    rangeoption = [];
    await this.props.ItemRanges().then((res) => {
      if (this.state.stockdivision == "3") {
        for (let key of res) {
          console.log(this.state.dept);
          console.log(key.itmDept);
          if (this.state.deptsval == key.itmDept) {
            rangeoption.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
      } else {
        for (let key of res) {
          if (this.state.brand == key.itmBrand) {
            rangeoption.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
      }

      console.log(rangeoption);
      this.setState({
        rangeoption,
      });
      console.log(rangeoption.length);
    });
  };

  listofbrand = async () => {
    let { brandlist } = this.state;
    brandlist = [];
    await this.props.ItemBrands().then((res) => {
      for (let key of res) {
        brandlist.push({
          value: key.itmCode,
          label: key.itmDesc,
          id: key.itmId,
        });
      }
      console.log(brandlist);
      this.setState({
        brandlist,
      });
      console.log(brandlist.length);
    });
  };

  handlecommissionarray = () => {
    let { commissiondetails } = this.state;
    commissiondetails.push({
      range_max: "",
      range_min: "",
      commission: "",
      incentive: "",
    });
    this.setState({
      commissiondetails,
    });
  };

  handledelete = (index) => {
    let { commissiondetails } = this.state;
    if (index > 0) {
      delete commissiondetails[index];
    }

    this.setState({
      commissiondetails,
    });
  };

  handleincentivetextbox = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      let { commissiondetails } = this.state;
      commissiondetails[index]["incentive"] = event.target.value;
      this.setState({ commissiondetails });
      console.log(commissiondetails);
    }
  };
  handlecommissiontextbox = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      let { commissiondetails } = this.state;
      commissiondetails[index]["commission"] = event.target.value;
      this.setState({ commissiondetails });
      console.log(commissiondetails);
    }
  };
  handlerangemaxtextbox = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      let { commissiondetails } = this.state;
      commissiondetails[index]["range_max"] = event.target.value;
      this.setState({ commissiondetails });
      console.log(commissiondetails);
    }
  };
  handlerangemintextbox = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      let { commissiondetails } = this.state;
      commissiondetails[index]["range_min"] = event.target.value;
      this.setState({ commissiondetails });
      console.log(commissiondetails);
    }
  };

  handleLoginConfirmationDialog = () => {
    let { isLoginConfirmation } = this.state;
    this.setState((prevState) => ({
      isLoginConfirmation: !prevState.isLoginConfirmation,
    }));
  };

  handleauthentication = (user, pass) => {
    console.log(user, pass);
  };
  render() {
    let { t } = this.props;
    let {
      option,
      com_type,
      commission_type,
      count,
      level,
      F_date,
      T_date,
      max_range,
      min_range,
      commission,
      incentive,
      Division,
      dept,
      range,
      brand,
      pro_name,
      period,
      item,
      divisionval,
      deptsval,
      depts,
      brandlist,
      rangeoption,
      sales_amt,
      sales_point,
      service_amt,
      commissiondetails,
      service_point,
      isLoginConfirmation,
      Emplevels,
      period_val,
    } = this.state;
    return (
      <div className="container-fluid commission">
        <div className="d-flex justify-content-between">
          <div className="col-md-5 col-9 h4">{t("Commission Profile")}</div>
          <div className="col-1">
            <NormalButton
              mainbg={true}
              label={"Status"}
              onClick={this.handleLoginConfirmationDialog}
            />
          </div>
        </div>

        <hr></hr>
        <div className="d-flex">
          <div className="col-3">{t("employee level")}</div>
          <div className="col-3">
            <NormalSelect
              options={Emplevels}
              value={level}
              onChange={this.handletype}
              name="level"
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="mt-5 col-3">
            <span>{t("Profile Name")}</span>
            <span className="star">*</span>
            <div className="d-flex">
              <div className="input-group">
                <NormalInput
                  onChange={this.handletype}
                  value={pro_name}
                  name="pro_name"
                  placeholder="Enter  name"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 col-3">
            <span>{t("Choose Period")}</span>
            <span className="star">*</span>
            <div className="d-flex">
              <div className="input-group">
                <NormalSelect
                  options={period_val}
                  value={period}
                  onChange={this.handletype}
                  name="period"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 col-3">
            <span>{t("Item")}</span>
            <span className="star">*</span>
            <div className="d-flex">
              <div className="input-group">
                <NormalSelect
                  options={option}
                  value={item}
                  onChange={this.handletype}
                  name="item"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mt-5">
          <div className="col-3">{t("Type")}</div>
          <div className="col-3">
            <NormalSelect
              options={commission_type}
              value={com_type}
              onChange={this.handletype}
              name="com_type"
            />
          </div>
        </div>
        <hr className="mt-5"></hr>
        {com_type == 1 ? (
          <>
            <div className="col-md-5 col-12 h5 mt-5">{t("Commission")}</div>
            <div className="d-flex mt-5">
              <div className="col-2">
                <span>{t("From")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalDate
                      value={F_date}
                      name="fromdate"
                      type="date"
                      onChange={this.handleChange}
                      showDisabledMonthNavigation
                    />
                  </div>
                </div>
              </div>
              <div className="col-2">
                <span>{t("To")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalDate
                      value={T_date}
                      name="todate"
                      type="date"
                      onChange={this.handleChange}
                      showDisabledMonthNavigation
                    />
                  </div>
                </div>
              </div>
            </div>
            {commissiondetails.map((x, i) => {
              return (
                <div>
                  <div className="d-flex mt-3" key={i}>
                    <div className="col-2">
                      <span>{t("Target range min")}</span>
                      <span className="star">*</span>
                      <div className="d-flex">
                        <div className="input-group">
                          <NormalInput
                            onChange={(event) =>
                              this.handlerangemintextbox(event, x, i)
                            }
                            value={x.range_min}
                            name="min_range"
                            placeholder="Min Range"
                            type="number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                      <span>{t("Target range max")}</span>
                      <span className="star">*</span>
                      <div className="d-flex">
                        <div className="input-group">
                          <NormalInput
                            onChange={(event) =>
                              this.handlerangemaxtextbox(event, x, i)
                            }
                            value={x.range_max}
                            name="max_range"
                            placeholder="Max range"
                            type="number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                      <span>{t("Commission")}</span>
                      <span className="star">*</span>
                      <div className="d-flex">
                        <div className="input-group">
                          <NormalInput
                            onChange={(event) =>
                              this.handlecommissiontextbox(event, x, i)
                            }
                            value={x.commission}
                            name="commission"
                            placeholder="commission"
                            type="number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                      <span>{t("Incentive")}</span>
                      <span className="star">*</span>
                      <div className="d-flex">
                        <div className="input-group">
                          <NormalInput
                            onChange={(event) =>
                              this.handleincentivetextbox(event, x, i)
                            }
                            value={x.incentive}
                            name="incentive"
                            placeholder="incentive"
                            type="number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-1 mt-3">
                      <NormalButton
                        mainbg={true}
                        label={"Add"}
                        onClick={() => this.handlecommissionarray()}
                      />
                    </div>
                    {i > 0 ? (
                      <div className="col-1 mt-3">
                        <NormalButton
                          mainbg={true}
                          label={"Cancel"}
                          onClick={() => this.handledelete(i)}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="d-flex mt-3">
              <div className="col-2">
                <span>{t("Division")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalSelect
                      options={Division}
                      value={divisionval}
                      onChange={this.handletype}
                      name="division"
                    />
                  </div>
                </div>
              </div>
              <div className="col-2">
                <span>{t("Department")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalSelect
                      options={depts}
                      value={deptsval}
                      onChange={this.handletype}
                      name="dept"
                    />
                  </div>
                </div>
              </div>
              <div className="col-2">
                <span>{t("Brand")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalSelect
                      options={brandlist}
                      value={brand}
                      onChange={this.handletype}
                      name="brand"
                    />
                  </div>
                </div>
              </div>
              <div className="col-2">
                <span>{t("Range")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalSelect
                      options={rangeoption}
                      value={range}
                      onChange={this.handletype}
                      name="range"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between">
              <div className="h5 mt-5">{t("Incentive")}</div>
              <div
                className="h1 mt-5 cursor-pointer"
                onClick={() => this.handleadditonal()}
              >
                {t("+")}
              </div>
            </div>
            <div className="d-flex mt-5">
              <div className="col-3">
                <span>{t("From")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalDate
                      value={F_date}
                      name="fromdate"
                      type="date"
                      onChange={this.handleChange}
                      showDisabledMonthNavigation
                    />
                  </div>
                </div>
              </div>
              <div className="col-3">
                <span>{t("To")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalDate
                      value={T_date}
                      name="todate"
                      type="date"
                      onChange={this.handleChange}
                      showDisabledMonthNavigation
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex mt-5">
              <div className="col-5 d-flex">
                <span className="col-3">
                  {t("For Sales Staff (cash bouns)")}
                </span>
                <div className="d-flex">
                  <div className="input-group col-4">
                    <NormalInput
                      onChange={this.handletype}
                      value={sales_amt}
                      name="sales_amt"
                      type="number"
                    />
                  </div>
                  <span>{t("* Total sales Amount")}</span>
                </div>
              </div>
              <div className="col-2"></div>
              <div className="col-5 d-flex">
                <span className="col-3">
                  {t("For serive Staff (cash bouns)")}
                </span>
                <div className="d-flex">
                  <div className="input-group col-4">
                    <NormalInput
                      onChange={this.handletype}
                      value={service_amt}
                      name="service_amt"
                      type="number"
                    />
                  </div>
                  <span>{t("* Total sales Amount")}</span>
                </div>
              </div>
            </div>
            <div className="d-flex mt-5">
              <div className="col-5 d-flex">
                <span className="col-3">{t("Points")}</span>
                <div className="d-flex">
                  <div className="input-group col-4">
                    <NormalInput
                      onChange={this.handletype}
                      value={sales_point}
                      name="sales_point"
                      type="number"
                    />
                  </div>
                  <span>{t("% Total sales Amount of course")}</span>
                </div>
              </div>
              <div className="col-2"></div>
              <div className="col-5 d-flex">
                <span className="col-3">{t("Points")}</span>
                <div className="d-flex">
                  <div className="input-group col-4">
                    <NormalInput
                      onChange={this.handletype}
                      value={service_point}
                      name="service_point"
                      type="number"
                    />
                  </div>
                  <span>{t("% Total sales Amount of course")}</span>
                </div>
              </div>
            </div>
            <div className=" mt-3 col-12 ">
              {commissiondetails.map((x, i) => {
                return (
                  <div>
                    <div className="d-flex mt-3" key={i}>
                      <div className="col-2">
                        <span>{t("Target range min")}</span>
                        <span className="star">*</span>
                        <div className="d-flex">
                          <div className="input-group">
                            <NormalInput
                              onChange={(event) =>
                                this.handlerangemintextbox(event, x, i)
                              }
                              value={x.range_min}
                              name="min_range"
                              placeholder="Min Range"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-2">
                        <span>{t("Target max")}</span>
                        <span className="star">*</span>
                        <div className="d-flex">
                          <div className="input-group">
                            <NormalInput
                              onChange={(event) =>
                                this.handlerangemaxtextbox(event, x, i)
                              }
                              value={x.range_max}
                              name="max_range"
                              placeholder="Max range"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-2">
                        <span>{t("Commission")}</span>
                        <span className="star">*</span>
                        <div className="d-flex">
                          <div className="input-group">
                            <NormalInput
                              onChange={(event) =>
                                this.handlecommissiontextbox(event, x, i)
                              }
                              value={x.commission}
                              name="commission"
                              placeholder="commission"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-2">
                        <span>{t("Incentive")}</span>
                        <span className="star">*</span>
                        <div className="d-flex">
                          <div className="input-group">
                            <NormalInput
                              onChange={(event) =>
                                this.handleincentivetextbox(event, x, i)
                              }
                              value={x.incentive}
                              name="incentive"
                              placeholder="incentive"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-1 mt-3">
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.handlecommissionarray()}
                        />
                      </div>
                      {i > 0 ? (
                        <div className="col-1 mt-3">
                          <NormalButton
                            mainbg={true}
                            label={"Cancel"}
                            onClick={() => this.handledelete(i)}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {this.state.fees == true ? (
          <>
            <div className="d-flex justify-content-between">
              <div className="h5 mt-5">{t("Mangement Fees")}</div>
              <div
                className="h1 mt-5 cursor-pointer"
                onClick={() => this.handleadditonal()}
              >
                {t("-")}
              </div>
            </div>
            <div className="d-flex mt-3">
              <div className="col-3">
                <span>{t("Sales")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalInput
                      onChange={this.handletype}
                      value={min_range}
                      name="min_range"
                      ///  placeholder="Enter  name"
                    />
                  </div>
                </div>
              </div>
              <div className="col-3">
                <span>{t("Fees")}</span>
                <span className="star">*</span>
                <div className="d-flex">
                  <div className="input-group">
                    <NormalInput
                      onChange={this.handletype}
                      value={max_range}
                      name="max_range"
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        {com_type == 1 ? (
          <>
            <table className="table" style={{ marginRight: 10, marginTop: 30 }}>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-top-0 border-bottom-0 salesstaff-background"
                    colSpan="2"
                  >
                    <div className="row">
                      <div className="col text-center">
                        {t("Commission Valid")}
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="border-top-0 border-bottom-0 salesstaff-background"
                    colSpan="2"
                  >
                    <div className="row">
                      <div className="col text-center">{t("Target Range")}</div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="border-top-0 border-bottom-0 salesstaff-background text-center"
                    colSpan="1"
                  >
                    <div className="row">
                      <div className="col  pt-4 ">{t("Commission")}</div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="border-top-0 border-bottom-0 salesstaff-background text-center"
                    colSpan="1"
                  >
                    <div className="row">
                      <div className="col ">{t("Commission ")}</div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="border-top-0 border-bottom-0 salesstaff-background text-center"
                    colSpan="1"
                  >
                    <div className="row">
                      <div className="col ">{t(" Commission")}</div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="border-top-0 border-bottom-0 salesstaff-background text-center"
                    colSpan="1"
                  >
                    <div className="row">
                      <div className="col ">{t("Commission ")}</div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="border-top-0 border-bottom-0 salesstaff-background text-center"
                    colSpan="1"
                  >
                    <div className="row">
                      <div className="col ">{t(" Commission")}</div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("From")}
                  </th>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("To")}
                  </th>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("Min")}
                  </th>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("Max")}
                  </th>

                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("$ / %")}
                  </th>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("Incentive")}
                  </th>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("Incentive")}
                  </th>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("Incentive")}
                  </th>
                  <th
                    scope="col"
                    className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                  >
                    {t("Incentive")}
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </>
        ) : (
          ""
        )}

        <div className="d-flex justify-content-end mt-5">
          <div className="col-1">
            <NormalButton
              mainbg={true}
              label={"Save"}
              // onClick={() => this.handlebrandDialog()}
            />
          </div>
          <div className="col-1">
            <NormalButton
              mainbg={true}
              label={"Continue"}
              onClick={() =>
                this.props.history.push(`/admin/commission/Amountsetting`)
              }
            />
          </div>
        </div>
        {/* <hr></hr> */}

        <NormalModal
          className={"d-flex justify-content-center"}
          style={{ minWidth: "30%" }}
          modal={isLoginConfirmation}
          handleModal={() => {}}
        >
          <img
            onClick={this.handleLoginConfirmationDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <CredentialConfirmation
            handleLoginSubmit={(user, pass) =>
              this.handleauthentication(user, pass)
            }
          />
        </NormalModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      ItemBrands,
      ItemRanges,
      ItemDivs,
      ItemDepts,
      getAmountapplicable,
      Amountapplicable,
      getCommonApi,
    },
    dispatch
  );
};

export const Commission = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CommissionClass)
);
