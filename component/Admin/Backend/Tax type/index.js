import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalInput,
  NormalModal,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  TaxType1TaxCodes,
  NewTaxType1TaxCodes,
  TaxType2TaxCodes,
  NewTaxType2TaxCodes,
  GstSettings,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";

export class TaxtypeClass extends Component {
  state = {
    TaxDetails: [
      { label: "Item Code" },
      { label: "Tax Code" },
      { label: "Tax Description" },
      { label: "Tax %", divClass: "justify-content-end" },
      { label: "Active" },
    ],
    taxsettingDetails: [
      { label: "Item Code", divClass: "justify-content-end" },
      { label: "Tax Description" },
      { label: "Tax %", divClass: "justify-content-end" },
      { label: "Tax Sequence", divClass: "justify-content-end" },
      { label: "Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],
    tax_per: null,
    isoption: false,
    iscreation: false,
    islist: false,
    iscreationtwo: false,
    islisttwo: false,
    istax: false,
    staffList: [],
    taxcodetwo: [],
    Taxsetting: [],
    code: null,
    desc: null,
    tax_code: null,
    checked: false,
    code2: null,
    desc2: null,
    tax_code2: null,
    checked2: false,
    tax_per2: null,
    editid: null,
    editval: null,
    edittax: null,
    editseq: null,
    codeedit: null,
    descedit: null,
    tax_peredit: null,
    tax_codeedit: null,
    checkededit: false,
    code2edit: null,
    desc2edit: null,
    tax_code2edit: null,
    checked2edit: false,
    tax_per2edit: null,
    edit: false,
    edittwo: false,
    activeitem: true,
  };

  generalcontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  commissioncontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  generalcontenttwo() {
    this.setState({
      iscreationtwo: !this.state.iscreationtwo,
    });
  }

  commissioncontenttwo() {
    this.setState({
      islisttwo: !this.state.islisttwo,
    });
  }

  taxsettingcontenttwo() {
    this.setState({
      istax: !this.state.istax,
    });
  }

  componentDidMount = () => {
    this.Listoftaxone({});
    this.Listoftaxtwo({});
    this.Listoftax({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handleedit = async itemcode => {
    let {
      edit,
      codeedit,
      descedit,
      tax_peredit,
      tax_codeedit,
      checkededit,
      temp,
    } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.TaxType1TaxCodes().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.itemCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      codeedit = temp.itemCode;
      descedit = temp.taxDesc;
      tax_peredit = temp.taxRatePercent;
      tax_codeedit = temp.taxCode;
      checkededit = temp.isactive;
      this.setState({
        codeedit,
        descedit,
        tax_peredit,
        tax_codeedit,
        checkededit,
      });
    });
    this.generalcontent();
  };
  handleupdates = async () => {
    let { edit, desc, tax_per, tax_code, checked } = this.state;
    let descJson = {
      itemCode: this.state.codeedit,
      taxCode: this.state.tax_codeedit,
      taxDesc: this.state.descedit,
      taxRatePercent: this.state.tax_peredit,
      isactive: this.state.checkededit,
      itemSeq: null,
    };
    await this.props
      .updateCommon(
        `TaxType1TaxCodes/update?where=%7B%22itemCode%22%3A%20%22${this.state.codeedit}%22%7D

    `,
        descJson
      )
      .then(data => {
        this.Listoftaxone({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edit = false;
    desc = "";
    tax_code = "";
    tax_per = "";
    checked = true;

    this.setState({ edit, desc, tax_code, tax_per, checked });
    this.generalcontent();
  };

  handleedittwo = async itemcode => {
    let {
      edittwo,
      code2edit,
      desc2edit,
      tax_per2edit,
      tax_code2edit,
      checked2edit,
      temp,
    } = this.state;
    edittwo = true;
    this.setState({ edittwo });
    await this.props.TaxType2TaxCodes().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.itemCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      code2edit = temp.itemCode;
      desc2edit = temp.taxDesc;
      tax_per2edit = temp.taxRatePercent;
      tax_code2edit = temp.taxCode;
      checked2edit = temp.isactive;
      this.setState({
        code2edit,
        desc2edit,
        tax_per2edit,
        tax_code2edit,
        checked2edit,
      });
    });
    this.generalcontenttwo();
  };
  handleupdatesttwo = async () => {
    let { edittwo, desc2, tax_per2, tax_code2, checked2 } = this.state;
    let descJson = {
      itemCode: this.state.code2edit,
      taxCode: this.state.tax_code2edit,
      taxDesc: this.state.desc2edit,
      taxRatePercent: this.state.tax_per2edit,
      isactive: this.state.checked2edit,
      itemSeq: null,
    };
    await this.props
      .updateCommon(
        `TaxType2TaxCodes/update?where=%7B%22itemCode%22%3A%20%22${this.state.code2edit}%22%7D

  `,
        descJson
      )
      .then(data => {
        this.Listoftaxtwo({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edittwo = false;
    desc2 = "";
    tax_code2 = "";
    tax_per2 = "";
    checked2 = true;

    this.setState({ edittwo, desc2, tax_code2, tax_per2, checked2 });
    this.generalcontenttwo();
  };

  handlecheckbox = async item => {
    let { Taxsetting } = this.state;
    for (let i = 0; i <= Taxsetting.length - 1; i++) {
      if (Taxsetting[i].itemCode == item) {
        Taxsetting[i].isactive = !Taxsetting[i].isactive;
        let descJson = {
          itemCode: Taxsetting[i].itemCode,
          itemDesc: Taxsetting[i].itemDesc,
          itemValue: Taxsetting[i].itemValue,
          isactive: Taxsetting[i].isactive,
          itemSeq: Taxsetting[i].itemSeq,
        };
        await this.props
          .updateCommon(
            `GstSettings/update?where=%7B%22itemCode%22%3A%20%22${item}%22%7D

`,
            descJson
          )
          .then(data => {
            this.Listoftax({});
          });
      }
    }
  };

  Listoftaxone = async () => {
    this.updateState({ is_loading: true });
    await this.props.TaxType1TaxCodes().then(res => {
      console.log(res);
      let { staffList, code } = this.state;

      staffList = res;
      if (res.length > 0) {
        code = res[res.length - 1].itemCode;
        code = code.slice(code.length - 6);
        code = Number(code) + 1;
        code = "TC" + code;
      } else {
        code = "TC" + 100001;
      }
      console.log(staffList);
      this.setState({
        staffList,
        is_loading: false,
        code,
      });
      console.log(staffList.length);
    });
  };

  Listoftaxtwo = async () => {
    this.updateState({ is_loading: true });
    await this.props.TaxType2TaxCodes().then(res => {
      console.log(res);
      let { taxcodetwo, code2 } = this.state;

      taxcodetwo = res;
      if (res.length > 0) {
        code2 = res[res.length - 1].itemCode;
        code2 = code2.slice(code2.length - 6);
        code2 = Number(code2) + 1;
        code2 = "TC" + code2;
      } else {
        code2 = "TC" + 100001;
      }
      console.log(taxcodetwo);
      this.setState({
        taxcodetwo,
        is_loading: false,
        code2,
      });
      console.log(taxcodetwo.length);
    });
  };

  Listoftax = async () => {
    this.updateState({ is_loading: true });
    await this.props.GstSettings().then(res => {
      console.log(res);
      let { Taxsetting } = this.state;

      Taxsetting = res;
      console.log(Taxsetting);
      this.setState({
        Taxsetting,
        is_loading: false,
      });
      console.log(Taxsetting.length);
    });
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      code,
      desc,
      tax_per,
      tax_code,
      checked,
      code2,
      desc2,
      tax_per2,
      tax_code2,
      checked2,
    } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "tax_per") {
      tax_per = value;
      this.setState({ tax_per });
    }
    if (name == "tax_code") {
      tax_code = value;
      this.setState({ tax_code });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }

    if (name == "code2") {
      code2 = value;
      this.setState({ code2 });
    }
    if (name == "desc2") {
      desc2 = value;
      this.setState({ desc2 });
    }
    if (name == "tax_per2") {
      tax_per2 = value;
      this.setState({ tax_per2 });
    }
    if (name == "tax_code2") {
      tax_code2 = value;
      this.setState({ tax_code2 });
    }
    if (name == "checked2") {
      checked2 = value;
      this.setState({ checked2 });
    }
  };

  handleinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      codeedit,
      descedit,
      tax_peredit,
      tax_codeedit,
      checkededit,
      code2edit,
      desc2edit,
      tax_per2edit,
      tax_code2edit,
      checked2edit,
    } = this.state;
    if (name == "code") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "desc") {
      descedit = value;
      this.setState({ descedit });
    }
    if (name == "tax_per") {
      tax_peredit = value;
      this.setState({ tax_peredit });
    }
    if (name == "tax_code") {
      tax_codeedit = value;
      this.setState({ tax_codeedit });
    }
    if (name == "checked") {
      checkededit = value;
      this.setState({ checkededit });
    }

    if (name == "code2") {
      code2edit = value;
      this.setState({ code2edit });
    }
    if (name == "desc2") {
      desc2edit = value;
      this.setState({ desc2edit });
    }
    if (name == "tax_per2") {
      tax_per2edit = value;
      this.setState({ tax_per2edit });
    }
    if (name == "tax_code2") {
      tax_code2edit = value;
      this.setState({ tax_code2edit });
    }
    if (name == "checked2") {
      checked2edit = value;
      this.setState({ checked2edit });
    }
  };

  Addnew = async () => {
    let { code, desc, tax_per, tax_code, checked } = this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let newroom = {
        itemCode: code,
        taxCode: tax_code,
        taxDesc: desc,
        taxRatePercent: tax_per,
        isactive: checked,
      };
      await this.props
        .NewTaxType1TaxCodes(newroom)
        .then(data => {
          this.Listoftaxone();

          code = "";
          desc = "";
          tax_per = "";
          tax_code = "";
          checked = false;
          this.setState({ checked, code, desc, tax_code, tax_per });
        })
        .catch(e => console.log(e));
    }
  };

  Addnewone = async () => {
    let { code2, desc2, tax_per2, tax_code2, checked2 } = this.state;
    if (desc2 == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let newroom = {
        itemCode: code2,
        taxCode: tax_code2,
        taxDesc: desc2,
        taxRatePercent: tax_per2,
        isactive: checked2,
      };
      await this.props
        .NewTaxType2TaxCodes(newroom)
        .then(data => {
          this.Listoftaxtwo();

          code2 = "";
          desc2 = "";
          tax_per2 = "";
          tax_code2 = "";
          checked2 = false;
          this.setState({ checked2, code2, desc2, tax_code2, tax_per2 });
        })
        .catch(e => console.log(e));
    }
  };

  handleEdit(id, desc, taxp, taxseq, active) {
    let { editid, editval, edittax, editseq, activeitem } = this.state;
    editid = id;
    editval = desc;
    edittax = taxp;
    editseq = taxseq;
    activeitem = active;
    console.log(editid, editval);
    this.setState({
      editid,
      editval,
      editseq,
      edittax,
      activeitem,
    });
    this.aboutpopup();
  }

  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }

  finaldesc = async (id, desc, tax, seq) => {
    let { editval, newval, activeitem } = this.state;
    let descJson = {
      itemCode: id,
      itemDesc: desc,
      itemValue: tax,
      isactive: activeitem,
      itemSeq: seq,
    };
    await this.props
      .updateCommon(
        `GstSettings/update?where=%7B%22itemCode%22%3A%20%22${id}%22%7D
   `,
        descJson
      )
      .then(data => {
        this.Listoftax({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopup();
    editval = "";
    newval = "";
    this.setState({ editval, newval });
  };

  handledesc = ({ target: { value, name } }) => {
    console.log(name, value);
    let { editval, edittax, editseq } = this.state;

    if (name == "desc") {
      editval = value;
      this.setState({ editval });
    }
    if (name == "edittax") {
      edittax = value;
      this.setState({ edittax });
    }
    if (name == "editseq") {
      editseq = value;
      this.setState({ editseq });
    }
  };

  render() {
    let {
      TaxDetails,
      pageMeta,
      staffList,
      is_loading,
      isAboutPopModal,
      editid,
      editseq,
      edittax,
      editval,
      code,
      desc,
      iscreation,
      islist,
      iscreationtwo,
      islisttwo,
      tax_per,
      taxsettingDetails,
      istax,
      tax_code,
      checked,
      code2,
      desc2,
      tax_code2,
      tax_per2,
      Taxsetting,
      checked2,
      taxcodetwo,
      code2edit,
      desc2edit,
      tax_code2edit,
      tax_per2edit,
      checked2edit,
      codeedit,
      descedit,
      tax_codeedit,
      tax_peredit,
      checkededit,
      edit,
      edittwo,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid tax">
          <h4>{t("Tax Type")}</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 itemstatusgroup"
                onClick={() => this.generalcontent()}
              >
                <p>{t("1st Tax Code Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("Item Code")}</p>
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
                        <span>{t("Tax Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={tax_code}
                            name="tax_code"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={desc}
                            name="desc"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax %")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={tax_per}
                            name="tax_per"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checked}
                            name="checked"
                            onChange={this.temp}
                          />
                          <p>{t("Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.Addnew()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <div
                className="d-flex  justify-content-between p-3 itemstatusgroup"
                onClick={() => this.generalcontent()}
              >
                <p>{t("1st Tax Code Creation")}</p>
                <div className="icons">
                  {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("Item Code")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={codeedit}
                            name="code"
                            onChange={this.handleinput}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Tax Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={tax_codeedit}
                            name="tax_code"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={descedit}
                            name="desc"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax %")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={tax_peredit}
                            name="tax_per"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checkededit}
                            name="checked"
                            onChange={this.handleinput}
                          />
                          <p>{t("Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"update"}
                          onClick={() => this.handleupdates()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.commissioncontent()}
          >
            <p>{t("1st Tax Code List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of 1st Tax Code")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={TaxDetails}
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
                                itemCode,
                                taxCode,
                                taxDesc,
                                taxRatePercent,
                                isactive,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-left text-success cursor-pointer"
                                      onClick={() => this.handleedit(itemCode)}
                                    >
                                      {itemCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{taxCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{taxDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {taxRatePercent}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {isactive == true ? "Yes" : "No"}
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
          {edittwo == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
                onClick={() => this.generalcontenttwo()}
              >
                <p>{t("2nd Tax Code Creation")}</p>
                <div className="icons">
                  {iscreationtwo == false ? (
                    <AiOutlinePlus />
                  ) : (
                    <AiOutlineMinus />
                  )}
                </div>
              </div>
              {iscreationtwo == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("Item Code")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={code2}
                            name="code2"
                            onChange={this.temp}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Tax Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={tax_code2}
                            name="tax_code2"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={desc2}
                            name="desc2"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax %")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={tax_per2}
                            name="tax_per2"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            name="checked2"
                            checked={checked2}
                            onChange={this.temp}
                          />
                          <p>{t("Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.Addnewone()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <div
                className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
                onClick={() => this.generalcontenttwo()}
              >
                <p>{t("2nd Tax Code Creation")}</p>
                <div className="icons">
                  {iscreationtwo == false ? (
                    <AiOutlinePlus />
                  ) : (
                    <AiOutlineMinus />
                  )}
                </div>
              </div>
              {iscreationtwo == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("Item Code")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={code2edit}
                            name="code2"
                            onChange={this.handleinput}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Tax Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={tax_code2edit}
                            name="tax_code2"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={desc2edit}
                            name="desc2"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Tax %")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={tax_per2edit}
                            name="tax_per2"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            name="checked2"
                            checked={checked2edit}
                            onChange={this.handleinput}
                          />
                          <p>{t("Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Update"}
                          onClick={() => this.handleupdatesttwo()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.commissioncontenttwo()}
          >
            <p>{t("2nd Tax Code List")}</p>
            <div className="icons">
              {islisttwo == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islisttwo == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of 2nd Tax Code")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={TaxDetails}
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
                        ) : taxcodetwo.length > 0 ? (
                          taxcodetwo.map(
                            (
                              {
                                itemCode,
                                taxCode,
                                taxDesc,
                                taxRatePercent,
                                isactive,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-left text-success cursor-pointer"
                                      onClick={() =>
                                        this.handleedittwo(itemCode)
                                      }
                                    >
                                      {itemCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{taxCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{taxDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {taxRatePercent}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {isactive == true ? "Yes" : "No"}
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
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.taxsettingcontenttwo()}
          >
            <p>{t("Tax Setting")}</p>
            <div className="icons">
              {istax == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {istax == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Tax Setting")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={taxsettingDetails}>
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
                        ) : Taxsetting.length > 0 ? (
                          Taxsetting.map(
                            (
                              {
                                itemCode,
                                itemDesc,
                                itemValue,
                                isactive,
                                itemSeq,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{itemCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itemDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {itemValue}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">{itemSeq}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={isactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckbox(itemCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEdit(
                                            itemCode,
                                            itemDesc,
                                            itemValue,
                                            itemSeq,
                                            isactive
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
            </div>
          ) : (
            ""
          )}
        </div>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModal}
          handleModal={() => this.aboutpopup()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT DESCRIPTION </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopup()}
                className="close"
                src={closeIcon}
                alt=""
              />
            </div>
          </div>
          <div>
            <div className="content">
              <div>
                <p>Code</p>
                <NormalInput value={editid} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editval}
                  name="desc"
                  onChange={this.handledesc}
                />
              </div>
              <div className="mt-2">
                <p>Tax %</p>
                <NormalInput
                  value={edittax}
                  name="edittax"
                  onChange={this.handledesc}
                />
              </div>
              <div className="mt-2">
                <p> Tax Sequence</p>
                <NormalInput
                  value={editseq}
                  name="editseq"
                  onChange={this.handledesc}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopup()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldesc(editid, editval, edittax, editseq)
                    }
                  />
                </div>
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
      TaxType1TaxCodes,
      NewTaxType1TaxCodes,
      TaxType2TaxCodes,
      NewTaxType2TaxCodes,
      GstSettings,
      updateCommon,
    },
    dispatch
  );
};

export const Taxtype = withTranslation()(
  connect(null, mapDispatchToProps)(TaxtypeClass)
);
