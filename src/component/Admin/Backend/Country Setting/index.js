import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  TableWrapper,
  NormalModal,
  NormalInput,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  Cities,
  NewCities,
  States,
  NewStates,
  Countries,
  NewCountries,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";

export class CountrysettingClass extends Component {
  state = {
    CountryDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Name" },
      { label: "Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],

    count: 10,
    iscountry: false,
    isstate: false,
    iscity: false,
    staffList: [],
    states: [],
    country: [],
    isAboutPopModal: false,
    isNewdescPopModal: false,
    newid: "",
    newval: "",
    editid: null,
    editval: null,
    isAboutPopModalone: false,
    isNewdescPopModalone: false,
    newidone: "",
    newvalone: "",
    editidone: null,
    editvalone: null,
    isAboutPopModaltwo: false,
    isNewdescPopModaltwo: false,
    newidtwo: "",
    newvaltwo: "",
    editidtwo: null,
    editvaltwo: null,
  };

  componentDidMount = () => {
    this.Listofcities({});
    this.Listofstates({});
    this.Listofcountry({});
  };
  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  generalcontent() {
    this.setState({
      iscity: !this.state.iscity,
    });
  }

  commissioncontent() {
    this.setState({
      isstate: !this.state.isstate,
    });
  }

  countrycontent() {
    this.setState({
      iscountry: !this.state.iscountry,
    });
  }

  Listofcities = async () => {
    this.updateState({ is_loading: true });
    await this.props.Cities().then(res => {
      console.log(res);
      let { staffList, newid } = this.state;

      staffList = res;
      console.log(staffList);
      newid = res[res.length - 1].itmCode;
      newid = Number(newid) + 1;
      this.setState({
        staffList,
        is_loading: false,
        newid,
      });
      console.log(staffList.length);
    });
  };

  handleEdit(id, desc) {
    let { editid, editval } = this.state;
    editid = id;
    editval = desc;
    console.log(editid, editval);
    this.setState({
      editid,
      editval,
    });
    this.aboutpopup();
  }

  handledesc = ({ target: { value, name } }) => {
    console.log(name);
    let { editval, newid } = this.state;

    if ((name = "desc")) {
      editval = value;
      this.setState({ editval });
    }
    if ((name = "newid")) {
      newid = value;
      this.setState({ newid });
    }
  };

  handledescription = ({ target: { value, name } }) => {
    let { newval } = this.state;

    if ((name = "newdescval")) {
      newval = value;
      this.setState({ newval });
    }
  };

  finaldesc = async (id, desc) => {
    let { editval, newval } = this.state;
    let descJson = {
      itmDesc: id,
      itmCode: desc,
      itmIsactive: true,
    };
    await this.props
      .updateCommon(
        `Cities/update?where=%7B%22itmCode%22%3A%20${id}%7D
     `,
        descJson
      )
      .then(data => {
        this.Listofstates({});
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

  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }

  createdesc = async (id, val) => {
    console.log(id, val);
    let newreason = {
      itmDesc: val,
      itmCode: id,
      itmIsactive: true,
    };
    await this.props
      .NewCities(newreason)
      .then(data => {
        this.Listofcities({});
        Toast({
          type: "success",
          message: "Successfully Added",
        });
      })
      .catch(e => console.log(e));
    this.newdescpopup();
    this.Listofcities();
  };

  newdescpopup() {
    this.setState({
      isNewdescPopModal: !this.state.isNewdescPopModal,
    });
  }

  /*state*/
  Listofstates = async () => {
    this.updateState({ is_loading: true });
    await this.props.States().then(res => {
      console.log(res);
      let { states, newidone } = this.state;

      states = res;
      console.log(states);
      newidone = res[res.length - 1].itmCode;
      console.log(newidone);
      newidone = Number(newidone) + 1;
      console.log(newidone);
      this.setState({
        states,
        is_loading: false,
        newidone,
      });
      console.log(states.length, newidone);
    });
  };

  handleEditone(id, desc) {
    let { editidone, editvalone } = this.state;
    editidone = id;
    editvalone = desc;
    // console.log(editidone,editvalone);
    this.setState({
      editidone,
      editvalone,
    });
    console.log(editidone, editvalone);
    this.aboutpopupone();
  }

  handledescone = ({ target: { value, name } }) => {
    console.log(name);
    let { editvalone, newidone } = this.state;

    if ((name = "desc")) {
      editvalone = value;
      this.setState({ editvalone });
    }
    if ((name = "newid")) {
      newidone = value;
      this.setState({ newidone });
    }
  };

  handledescriptionone = ({ target: { value, name } }) => {
    let { newvalone } = this.state;

    if ((name = "newdescval")) {
      newvalone = value;
      this.setState({ newvalone });
    }
  };

  finaldescone = async (id, desc) => {
    let { editvalone, newvalone } = this.state;
    let descJson = {
      itmDesc: id,
      itmCode: desc,
      itmIsactive: true,
    };
    await this.props
      .updateCommon(
        `States/update?where=%7B%22itmDesc%22%20%3${id}%7D
     `,
        descJson
      )
      .then(data => {
        this.Listofstates({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopup();
    editvalone = " ";
    newvalone = " ";
    this.setState({ editvalone, newvalone });
  };

  aboutpopupone() {
    this.setState({
      isAboutPopModalone: !this.state.isAboutPopModalone,
    });
  }

  createdescone = async (id, val) => {
    console.log(id, val);
    if (val == "") {
      Toast({
        type: "error",
        message: "Name required",
      });
    } else {
      let newreason = {
        itmDesc: val,
        itmCode: id,
        itmIsactive: true,
      };
      await this.props
        .NewStates(newreason)
        .then(data => {
          this.Listofstates({});
        })
        .catch(e => console.log(e));
      this.newdescpopupone();
      this.Listofstates();
    }
  };

  newdescpopupone() {
    console.log("dd");
    this.setState({
      isNewdescPopModalone: !this.state.isNewdescPopModalone,
    });
  }

  /****Country *****/

  Listofcountry = async () => {
    this.updateState({ is_loading: true });
    await this.props.Countries().then(res => {
      console.log(res);
      let { country, newidtwo } = this.state;

      country = res;
      console.log(country);
      newidtwo = res[res.length - 1].itmCode;
      newidtwo = Number(newidtwo) + 1;
      this.setState({
        country,
        is_loading: false,
        newidtwo,
      });
      console.log(country.length);
    });
  };

  handleEdittwo(id, desc) {
    let { editidtwo, editvaltwo } = this.state;
    editidtwo = id;
    editvaltwo = desc;
    console.log(editidtwo, editvaltwo);
    this.setState({
      editidtwo,
      editvaltwo,
    });
    this.aboutpopuptwo();
  }

  handledesctwo = ({ target: { value, name } }) => {
    console.log(name);
    let { editvaltwo, newidtwo } = this.state;

    if ((name = "desc")) {
      editvaltwo = value;
      this.setState({ editvaltwo });
    }
    if ((name = "newid")) {
      newidtwo = value;
      this.setState({ newidtwo });
    }
  };

  handledescriptiontwo = ({ target: { value, name } }) => {
    let { newvaltwo } = this.state;

    if ((name = "newdescval")) {
      newvaltwo = value;
      this.setState({ newvaltwo });
    }
  };

  finaldesctwo = async (id, desc) => {
    let { editvaltwo, newvaltwo } = this.state;
    let descJson = {
      itmDesc: desc,
      itmCode: id,
      itmIsactive: true,
      phonecode: null,
    };
    await this.props
      .updateCommon(
        `Countries/update?where=%7B%22itmCode%22%3A${id}%7D
     `,
        descJson
      )
      .then(data => {
        this.Listofstates({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopuptwo();
    editvaltwo = "";
    newvaltwo = "";
    this.setState({ editvaltwo, newvaltwo });
  };

  aboutpopuptwo() {
    this.setState({
      isAboutPopModaltwo: !this.state.isAboutPopModaltwo,
    });
  }

  createdesctwo = async (id, val) => {
    console.log(id, val);
    if (val == "") {
      Toast({
        type: "error",
        message: "Name required",
      });
    } else {
      let newreason = {
        itmDesc: val,
        itmCode: id,
        itmIsactive: true,
      };
      await this.props
        .NewCountries(newreason)
        .then(data => {
          this.Listofcountry({});
        })
        .catch(e => console.log(e));
      this.newdescpopuptwo();
      this.Listofcountry();
    }
  };

  newdescpopuptwo() {
    this.setState({
      isNewdescPopModaltwo: !this.state.isNewdescPopModaltwo,
    });
  }

  handlecheckbox = async item => {
    let { staffList } = this.state;
    for (let i = 0; i <= staffList.length - 1; i++) {
      if (staffList[i].itmCode == item) {
        staffList[i].itmIsactive = !staffList[i].itmIsactive;
        let descJson = {
          itmDesc: staffList[i].itmDesc,
          itmCode: staffList[i].itmCode,
          itmIsactive: staffList[i].itmIsactive,
        };
        await this.props
          .updateCommon(
            `Cities/update?where=%7B%22itmCode%22%3A%20${item}%7D
   `,
            descJson
          )
          .then(data => {
            this.Listofstates({});
          });
      }
    }
  };

  handlecheckboxone = async item => {
    let { states } = this.state;
    for (let i = 0; i <= states.length - 1; i++) {
      if (states[i].itmCode == item) {
        states[i].itmIsactive = !states[i].itmIsactive;
        let descJson = {
          itmDesc: states[i].itmDesc,
          itmCode: states[i].itmCode,
          itmIsactive: states[i].itmIsactive,
        };
        await this.props
          .updateCommon(
            `States/update?where=%7B%22itmDesc%22%20%3${item}%7D
     `,
            descJson
          )
          .then(data => {
            this.Listofstates({});
          });
      }
    }
  };

  handlecheckboxtwo = async item => {
    let { country } = this.state;
    for (let i = 0; i <= country.length - 1; i++) {
      if (country[i].itmCode == item) {
        country[i].itmIsactive = !country[i].itmIsactive;
        let descJson = {
          itmDesc: country[i].itmDesc,
          itmCode: country[i].itmCode,
          itmIsactive: country[i].itmIsactive,
          phonecode: null,
        };
        await this.props
          .updateCommon(
            `Countries/update?where=%7B%22itmCode%22%3A${item}%7D
     `,
            descJson
          )
          .then(data => {
            this.Listofstates({});
          });
      }
    }
  };

  render() {
    let {
      pageMeta,
      staffList,
      is_loading,
      iscity,
      isstate,
      states,
      country,
      iscountry,
      CountryDetails,
      isAboutPopModal,
      editid,
      editval,
      newid,
      newval,
      isNewdescPopModal,
      isAboutPopModalone,
      editidone,
      editvalone,
      newidone,
      newvalone,
      isNewdescPopModalone,
      isAboutPopModaltwo,
      editidtwo,
      editvaltwo,
      newidtwo,
      newvaltwo,
      isNewdescPopModaltwo,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid tax">
          <h4>{t("Country Settings")}</h4>
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup"
            onClick={() => this.generalcontent()}
          >
            <p>{t("City")}</p>
            <div className="icons">
              {iscity == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscity == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Cities")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={CountryDetails}>
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
                            ({ itmCode, itmDesc, itmIsactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itmDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={itmIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckbox(itmCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEdit(itmCode, itmDesc)
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
              <div className="mt-3 ml-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopup()}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.commissioncontent()}
          >
            <p>{t("State")}</p>
            <div className="icons">
              {isstate == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {isstate == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of States")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={CountryDetails}>
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
                        ) : states.length > 0 ? (
                          states.map(
                            ({ itmCode, itmDesc, itmIsactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itmDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={itmIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxone(itmCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditone(itmCode, itmDesc)
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
              <div className="mt-3 ml-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopupone()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.countrycontent()}
          >
            <p>{t("Country")}</p>
            <div className="icons">
              {iscountry == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscountry == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Countries")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={CountryDetails}>
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
                        ) : country.length > 0 ? (
                          country.map(
                            ({ itmCode, itmDesc, itmIsactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itmDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={itmIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxtwo(itmCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEdittwo(itmCode, itmDesc)
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
              <div className="mt-3 ml-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopuptwo()}
                />
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
              <h5> Edit City </h5>
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
                    onClick={() => this.finaldesc(editid, editval)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModal}
          handleModal={() => this.newdescpopup()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD City</h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopup()}
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
                <NormalInput
                  value={newid}
                  name="newid"
                  onChange={this.handledesc}
                  disabled={true}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={newval}
                  name="newdescval"
                  onChange={this.handledescription}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopup()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdesc(newid, newval)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModalone}
          handleModal={() => this.aboutpopupone()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT STATE </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupone()}
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
                <NormalInput value={editidone} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editvalone}
                  name="desc"
                  onChange={this.handledescone}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupone()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.finaldescone(editidone, editvalone)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModalone}
          handleModal={() => this.newdescpopupone()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD STATES </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupone()}
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
                <NormalInput
                  value={newidone}
                  name="newid"
                  onChange={this.handledescone}
                  disabled={true}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={newvalone}
                  name="newdescval"
                  onChange={this.handledescriptionone}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupone()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdescone(newidone, newvalone)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModaltwo}
          handleModal={() => this.aboutpopuptwo()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT COUNTRY </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopuptwo()}
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
                <NormalInput value={editidtwo} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editvaltwo}
                  name="desc"
                  onChange={this.handledesctwo}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopuptwo()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.finaldesctwo(editidtwo, editvaltwo)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModaltwo}
          handleModal={() => this.newdescpopuptwo()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD Country </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopuptwo()}
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
                <NormalInput
                  value={newidtwo}
                  name="newid"
                  onChange={this.handledesctwo}
                  disabled={true}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={newvaltwo}
                  name="newdescval"
                  onChange={this.handledescriptiontwo}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopuptwo()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdesctwo(newidtwo, newvaltwo)}
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
      Cities,
      NewCities,
      States,
      NewStates,
      Countries,
      NewCountries,
      updateCommon,
    },
    dispatch
  );
};

export const Countrysetting = withTranslation()(
  connect(null, mapDispatchToProps)(CountrysettingClass)
);
