import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalSelect,
  NormalCheckbox,
  NormalInput,
  NormalModal,
} from "component/common";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  NewCommGroupHdrs,
  CommGroupHdrs,
  SiteGroups,
  EmpLevels,
  CommissionSiteGroups,
  CommGroupDtls,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";
import { BsPencilSquare } from "react-icons/bs";

export class CommissionDataClass extends Component {
  state = {
    SitegroupDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Action" },
    ],

    CommissionDetails: [
      { label: "Level" },
      { label: "From Range", divClass: "justify-content-end" },
      { label: "To Range", divClass: "justify-content-end" },
      { label: "Rate", divClass: "justify-content-end" },
      { label: "Is Percent" },
      { label: "Calc.Method" },
      { label: "Type" },
      { label: "Is Active" },
      { label: "Acion" },
    ],
    count: "Sales",
    isoption: false,
    isopendetails: false,
    isgeneral: false,
    issite: false,
    iscommission: false,
    staffList: [],
    sitelist: [],
    code: null,
    desc: null,
    option: [
      { label: "Sales", value: "Sales" },
      { label: "Work", value: "Work" },
      { label: "Prepaid", value: "Prepaid" },
    ],
    checked: true,
    ispresent: true,
    commissionrate: null,
    frange: null,
    trange: null,
    commissiontype: null,
    calmethod: null,
    activedetails: true,
    description: null,
    description_option: [],
    commission_option: [
      { label: "Single Transaction", value: "Single Transaction" },
      { label: "Period Transaction", value: "Period Transaction" },
    ],
    cal_option: [
      { label: "Normal", value: "Normal" },
      { label: "Floor Price", value: "Floor Price" },
    ],
    ispresentedit: true,
    commissionrateedit: null,
    frangeedit: null,
    trangeedit: null,
    commissiontypeedit: null,
    calmethodedit: null,
    activedetailsedit: true,
    descriptionedit: null,
    iseditdetail: false,
    deindex: null,
  };

  componentDidMount = () => {
    this.listofcommission();
    this.listofsitelist();
    this.listofdescription();
  };

  listofcommission = async () => {
    let { code, te } = this.state;

    await this.props.CommGroupHdrs().then(res => {
      if (res.length > 0) {
        te = res[res.length - 1].code;
        code = Number(te) + 1;
      } else {
        code = 1;
      }
      this.setState({
        code,
      });
    });
  };

  listofsitelist = async () => {
    let { sitelist } = this.state;
    sitelist = [];
    await this.props.SiteGroups().then(res => {
      for (let key of res) {
        if (key.isActive == true) {
          sitelist.push({
            code: key.code,
            description: key.description,
            isActive: key.isActive,
          });
        }
      }
      console.log(sitelist);
      this.setState({
        sitelist,
      });
      console.log(sitelist.length);
    });
  };

  listofdescription = async () => {
    let { description_option } = this.state;
    description_option = [];
    await this.props.EmpLevels().then(res => {
      for (let key of res) {
        description_option.push({
          label: key.levelDesc,
          value: key.levelDesc,
          id: key.levelCode,
        });
      }
      console.log(description_option);
      this.setState({
        description_option,
      });
      console.log(description_option.length);
    });
  };

  aboutpopup() {
    this.setState({
      isoption: !this.state.isoption,
    });
  }
  generalcontent() {
    this.setState({
      isgeneral: !this.state.isgeneral,
    });
  }
  sitecontent() {
    this.setState({
      issite: !this.state.issite,
    });
  }
  commissioncontent() {
    this.setState({
      iscommission: !this.state.iscommission,
    });
  }

  handledetailsDialog = () => {
    let { isopendetails } = this.state;
    this.setState({
      isopendetails: !isopendetails,
    });
  };

  handleeditDialog = () => {
    let { iseditdetails } = this.state;
    this.setState({
      iseditdetails: !iseditdetails,
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, count, checked } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "count") {
      count = value;
      this.setState({ count });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
  };

  handlepopup = ({ target: { value, name } }) => {
    let {
      ispresent,
      commissionrate,
      frange,
      trange,
      commissiontype,
      calmethod,
      activedetails,
      description,
    } = this.state;
    if (name == "commissionrate") {
      commissionrate = value;
      this.setState({ commissionrate });
    }
    if (name == "trange") {
      trange = value;
      this.setState({ trange });
    }
    if (name == "frange") {
      frange = value;
      this.setState({ frange });
    }
    if (name == "calmethod") {
      calmethod = value;
      this.setState({ calmethod });
    }
    if (name == "commissiontype") {
      commissiontype = value;
      this.setState({ commissiontype });
    }
    if (name == "ispresent") {
      ispresent = value;
      this.setState({ ispresent });
    }
    if (name == "description") {
      description = value;
      this.setState({ description });
    }
    if (name == "activedetails") {
      activedetails = value;
      this.setState({ activedetails });
    }
  };

  handleeditpopup = ({ target: { value, name } }) => {
    let {
      ispresentedit,
      commissionrateedit,
      frangeedit,
      trangeedit,
      commissiontypeedit,
      calmethodedit,
      activedetailsedit,
      descriptionedit,
    } = this.state;
    if (name == "commissionrate") {
      commissionrateedit = value;
      this.setState({ commissionrateedit });
    }
    if (name == "trange") {
      trangeedit = value;
      this.setState({ trangeedit });
    }
    if (name == "frange") {
      frangeedit = value;
      this.setState({ frangeedit });
    }
    if (name == "calmethod") {
      calmethodedit = value;
      this.setState({ calmethodedit });
    }
    if (name == "commissiontype") {
      commissiontypeedit = value;
      this.setState({ commissiontypeedit });
    }
    if (name == "ispresent") {
      ispresentedit = value;
      this.setState({ ispresentedit });
    }
    if (name == "description") {
      descriptionedit = value;
      this.setState({ descriptionedit });
    }
    if (name == "activedetails") {
      activedetailsedit = value;
      this.setState({ activedetailsedit });
    }
  };
  Addnewcommission = async () => {
    let { code, desc, count, objIndex, checked } = this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      await this.props.CommGroupHdrs().then(res => {
        objIndex = res.findIndex(obj => obj.code == code);
      });

      if (objIndex == -1) {
        let newdept = {
          code: code,
          description: desc,
          isactive: checked,
          isservice: true,
          type: count,
          type2: "",
        };
        await this.props
          .NewCommGroupHdrs(newdept)
          .then(data => {
            this.listofcommission();
          })

          .catch(e => console.log(e));
      } else {
        Toast({
          type: "error",
          message: "Please check code is already present",
        });
      }
    }

    this.addcommissiondetails();
    this.addsitelist();
  };

  addsitelist = async () => {
    let { sitelist, code, newadd } = this.state;
    if (sitelist.length > 0) {
      sitelist.map((x, index) => {
        newadd = {
          commCode: code,
          siteGroup: x.code,
          isactive: true,
        };
        this.finallist(newadd);
      });
    }
  };

  finallist = async newitem => {
    await this.props
      .CommissionSiteGroups(newitem)
      .then(data => {
        console.log("list");
      })
      .catch(e => console.log(e));
  };

  addcommissiondetails = async () => {
    let { staffList, code, newadd, desc } = this.state;
    if (staffList.length > 0) {
      staffList.map((x, index) => {
        newadd = {
          code: desc,
          commLevel: x.Description,
          commValue: x.Commissionrate,
          ispercent: x.Ispresent,
          isactive: x.Isactive,
          isdiscaffect: false,
          fscale: x.Fromrange,
          tscale: x.Torange,
          level: x.CommissionType == "Single Transaction" ? 1 : 2,
          commDtlCode: code,
          commBalValue: 0,
          commBalIspercent: false,
          calmethod: x.Calmethod == "Normal" ? 1 : 2,
        };
        this.finaldetaillist(newadd);
      });
    }
  };

  finaldetaillist = async newitem => {
    await this.props
      .CommGroupDtls(newitem)
      .then(data => {
        console.log("list");
      })
      .catch(e => console.log(e));
  };

  Adddetails = (desc, active, cal, type, frange, trange, rate, ispresent) => {
    let { staffList } = this.state;
    let temp_content = {
      Description: desc,
      Isactive: active,
      Calmethod: cal,
      CommissionType: type,
      Fromrange: frange,
      Torange: trange,
      Commissionrate: rate,
      Ispresent: ispresent,
    };
    staffList.push(temp_content);
    this.setState({
      staffList,
    });
    this.handleinput();
  };

  handleinput = () => {
    let {
      ispresent,
      commissionrate,
      frange,
      trange,
      commissiontype,
      calmethod,
      activedetails,
      description,
    } = this.state;

    ispresent = true;
    commissionrate = "";
    frange = "";
    trange = "";
    commissiontype = "";
    calmethod = "";
    activedetails = true;
    description = "";

    this.setState({
      ispresent,
      commissionrate,
      frange,
      trange,
      commissiontype,
      calmethod,
      activedetails,
      description,
    });
    this.handledetailsDialog();
  };

  Addeditdetails = (
    desc,
    active,
    cal,
    type,
    frange,
    trange,
    rate,
    ispresent
  ) => {
    let { deindex, staffList } = this.state;
    staffList[deindex].Description = desc;
    staffList[deindex].Isactive = active;
    staffList[deindex].Calmethod = cal;
    staffList[deindex].CommissionType = type;
    staffList[deindex].Fromrange = frange;
    staffList[deindex].Torange = trange;
    staffList[deindex].Commissionrate = rate;
    staffList[deindex].Ispresent = ispresent;
    this.setState({ staffList });
    console.log(staffList);
    this.handleeditDialog();
  };

  Editdetails = (
    index,
    level,
    fromrange,
    torange,
    active,
    present,
    calvalue,
    commtype,
    commrate
  ) => {
    console.log(
      index,
      level,
      fromrange,
      torange,
      active,
      present,
      calvalue,
      commtype,
      commrate
    );
    let {
      ispresentedit,
      commissionrateedit,
      frangeedit,
      trangeedit,
      commissiontypeedit,
      calmethodedit,
      activedetailsedit,
      descriptionedit,
      deindex,
    } = this.state;

    deindex = index;
    ispresentedit = present;
    commissionrateedit = active;
    frangeedit = fromrange;
    trangeedit = torange;
    commissiontypeedit = commtype;
    activedetailsedit = commrate;
    descriptionedit = level;
    calmethodedit = calvalue;
    this.setState({
      ispresentedit,
      commissionrateedit,
      frangeedit,
      trangeedit,
      commissiontypeedit,
      calmethodedit,
      activedetailsedit,
      descriptionedit,
      deindex,
    });
    console.log(
      ispresentedit,
      commissionrateedit,
      frangeedit,
      trangeedit,
      commissiontypeedit,
      calmethodedit,
      activedetailsedit,
      descriptionedit,
      deindex
    );
    this.handleeditDialog();
  };

  handleCheckbox = Code => {
    let { sitelist } = this.state;
    for (let i = 0; i <= sitelist.length - 1; i++) {
      if (sitelist[i].code == Code) {
        sitelist[i].isActive = !sitelist[i].isActive;
      }
      this.setState({ sitelist });
    }
  };
  render() {
    let {
      SitegroupDetails,
      CommissionDetails,
      pageMeta,
      staffList,
      is_loading,
      code,
      desc,
      isgeneral,
      issite,
      iscommission,
      option,
      count,
      checked,
      sitelist,
      isopendetails,
      ispresent,
      commissionrate,
      frange,
      trange,
      commissiontype,
      calmethod,
      activedetails,
      description,
      description_option,
      commission_option,
      cal_option,
      iseditdetails,
      ispresentedit,
      commissionrateedit,
      frangeedit,
      trangeedit,
      commissiontypeedit,
      calmethodedit,
      activedetailsedit,
      descriptionedit,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="col-md-4 d-flex align-items-center">
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
              {t("Item Master")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Stock Item Data Entry")}</p>
          </div>
        </div>
        <div className="container-fluid dataentry">
          <h5 className="mt-5">{t("Commission Group Entry")}</h5>
          <div
            className="d-flex  justify-content-between p-3 General mt-3"
            onClick={() => this.generalcontent()}
          >
            <p>{t("General")}</p>
            <div className="icon">
              {isgeneral == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {isgeneral == true ? (
            <div className="container-fluid generalcontent">
              <div className="row">
                <div className="col-6 ">
                  <div className="mt-3">
                    <span>{t("Code")}</span>
                    <span style={{ color: "red" }}>*</span>
                    <div className="input-group">
                      <NormalInput
                        value={code}
                        name="code"
                        onChange={this.temp}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Commission Group Type")}</span>
                    <div className="input-group">
                      <NormalSelect
                        options={option}
                        value={count}
                        onChange={this.temp}
                        name="count"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="col-4 d-flex input-group">
                      <NormalCheckbox
                        checked={checked}
                        name="checked"
                        onChange={this.temp}
                      />
                      <p>{t("Currently Active")}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6 ">
                  <div className="mt-3">
                    <span>{t("Description")}</span>
                    <span className="star">*</span>
                    <div className="input-group">
                      <NormalInput
                        value={desc}
                        name="desc"
                        onChange={this.temp}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className="d-flex  justify-content-between p-3 General mt-5"
            onClick={() => this.commissioncontent()}
          >
            <p>{t("Commission Detail")}</p>
            <div className="icon">
              {iscommission == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscommission == true ? (
            <div>
              <div className="col-12 mt-3">
                <div className="tab-table-content">
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={CommissionDetails}
                        queryHandler={this.handlePagination}
                        pageMeta={pageMeta}
                      >
                        {is_loading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : staffList.length > 0 ? (
                          staffList.map(
                            (
                              {
                                Description,
                                Isactive,
                                Calmethod,
                                CommissionType,
                                Fromrange,
                                Torange,
                                Commissionrate,
                                Ispresent,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-left">
                                      {Description}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {Fromrange}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">{Torange}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {Commissionrate}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {Ispresent == true ? "Yes" : "No"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{Calmethod}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {CommissionType}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {Isactive == true ? "Yes" : "No"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.Editdetails(
                                            index,
                                            Description,
                                            Fromrange,
                                            Torange,
                                            Commissionrate,
                                            Ispresent,
                                            Calmethod,
                                            CommissionType,
                                            Isactive
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : null}
                      </TableWrapper>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.handledetailsDialog()}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className="d-flex  justify-content-between p-3 General mt-5"
            onClick={() => this.sitecontent()}
          >
            <p>{t("Site Group Listing")}</p>
            <div className="icon">
              {issite == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {issite == true ? (
            <div>
              <div className="col-12 mt-3">
                <div className="tab-table-content">
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={SitegroupDetails}
                        queryHandler={this.handlePagination}
                        pageMeta={pageMeta}
                      >
                        {is_loading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : sitelist.length > 0 ? (
                          sitelist.map(
                            ({ code, description, isActive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{code}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {description}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <NormalCheckbox
                                        checked={isActive}
                                        onChange={e =>
                                          this.handleCheckbox(code)
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : null}
                      </TableWrapper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="mt-5 col-1">
          <NormalButton
            mainbg={true}
            label={"Add"}
            onClick={() => this.Addnewcommission()}
          />
        </div>

        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "50%" }}
          modal={isopendetails}
          handleModal={this.handledetailsDialog}
        >
          <img
            onClick={this.handledetailsDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <div>
            <h6>Commission Detail</h6>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>Description</p>
                <NormalSelect
                  options={description_option}
                  value={description}
                  onChange={this.handlepopup}
                  name="description"
                />
              </div>
              <div className="col-6">
                <div className="d-flex mt-3">
                  <div className="mt-0 mt-3">
                    <NormalCheckbox
                      checked={activedetails}
                      onChange={this.handlepopup}
                      name="activedetails"
                    />
                  </div>
                  <p className="mt-3 text-black common-label-text ">
                    {t("Active")}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>Calculation Method</p>
                <NormalSelect
                  options={cal_option}
                  value={calmethod}
                  onChange={this.handlepopup}
                  name="calmethod"
                />
              </div>
              <div className="col-6">
                <span>Commission Type</span>
                <NormalSelect
                  options={commission_option}
                  value={commissiontype}
                  onChange={this.handlepopup}
                  name="commissiontype"
                />
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>From Range</p>
                <div className="input-group">
                  <NormalInput
                    onChange={this.handlepopup}
                    value={frange}
                    name="frange"
                    type="number"
                  />
                </div>
              </div>
              <div className="col-6">
                <span>To Range</span>
                <div className="input-group">
                  <NormalInput
                    onChange={this.handlepopup}
                    value={trange}
                    name="trange"
                    type="number"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>Commission Rate</p>
                <div className="input-group">
                  <NormalInput
                    onChange={this.handlepopup}
                    value={commissionrate}
                    name="commissionrate"
                    type="number"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex mt-3">
                  <div className="mt-0 mt-3">
                    <NormalCheckbox
                      checked={ispresent}
                      onChange={this.handlepopup}
                      name="ispresent"
                    />
                  </div>
                  <p className="mt-3 text-black common-label-text ">
                    {t("Is Percent")}
                  </p>
                </div>
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-between">
              <div className="pl-2">
                <NormalButton
                  mainbg={true}
                  label={"Cancel"}
                  onClick={this.handledetailsDialog}
                />
              </div>
              <div className="pr-2">
                <NormalButton
                  mainbg={true}
                  label={"Submit"}
                  onClick={() =>
                    this.Adddetails(
                      description,
                      activedetails,
                      calmethod,
                      commissiontype,
                      frange,
                      trange,
                      commissionrate,
                      ispresent
                    )
                  }
                />
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "50%" }}
          modal={iseditdetails}
          handleModal={this.handleeditDialog}
        >
          <img
            onClick={this.handleeditDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <div>
            <h6> Edit Commission Detail</h6>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>Description</p>
                <NormalSelect
                  options={description_option}
                  value={descriptionedit}
                  onChange={this.handleeditpopup}
                  name="description"
                />
              </div>
              <div className="col-6">
                <div className="d-flex mt-3">
                  <div className="mt-0 mt-3">
                    <NormalCheckbox
                      checked={activedetailsedit}
                      onChange={this.handleeditpopup}
                      name="activedetails"
                    />
                  </div>
                  <p className="mt-3 text-black common-label-text ">
                    {t("Active")}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>Calculation Method</p>
                <NormalSelect
                  options={cal_option}
                  value={calmethodedit}
                  onChange={this.handleeditpopup}
                  name="calmethod"
                />
              </div>
              <div className="col-6">
                <span>Commission Type</span>
                <NormalSelect
                  options={commission_option}
                  value={commissiontypeedit}
                  onChange={this.handleeditpopup}
                  name="commissiontype"
                />
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>From Range</p>
                <div className="input-group">
                  <NormalInput
                    onChange={this.handleeditpopup}
                    value={frangeedit}
                    name="frange"
                    type="number"
                  />
                </div>
              </div>
              <div className="col-6">
                <span>To Range</span>
                <div className="input-group">
                  <NormalInput
                    onChange={this.handleeditpopup}
                    value={trangeedit}
                    name="trange"
                    type="number"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>Commission Rate</p>
                <div className="input-group">
                  <NormalInput
                    onChange={this.handleeditpopup}
                    value={commissionrateedit}
                    name="commissionrate"
                    type="number"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex mt-3">
                  <div className="mt-0 mt-3">
                    <NormalCheckbox
                      checked={ispresentedit}
                      onChange={this.handleeditpopup}
                      name="ispresent"
                    />
                  </div>
                  <p className="mt-3 text-black common-label-text ">
                    {t("Is Percent")}
                  </p>
                </div>
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-between">
              <div className="pl-2">
                <NormalButton
                  mainbg={true}
                  label={"Cancel"}
                  onClick={this.handleeditDialog}
                />
              </div>
              <div className="pr-2">
                <NormalButton
                  mainbg={true}
                  label={"Submit"}
                  onClick={() =>
                    this.Addeditdetails(
                      descriptionedit,
                      activedetailsedit,
                      calmethodedit,
                      commissiontypeedit,
                      frangeedit,
                      trangeedit,
                      commissionrateedit,
                      ispresentedit
                    )
                  }
                />
              </div>
            </div>
          </div>
        </NormalModal>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      NewCommGroupHdrs,
      CommGroupHdrs,
      SiteGroups,
      EmpLevels,
      CommissionSiteGroups,
      CommGroupDtls,
    },
    dispatch
  );
};

export const CommissionData = withTranslation()(
  connect(null, mapDispatchToProps)(CommissionDataClass)
);
