import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  TableWrapper,
  NormalModal,
  NormalInput,
} from "component/common";
import { withTranslation } from "react-i18next";
import { Securities, NewSecurities, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";

export class SecuritymasterClass extends Component {
  state = {
    headerDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Name" },
      { label: "Security Role" },
      { label: "Description" },
      { label: "Is Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],
    pageMeta: {},
    List: [],
    is_loading: false,
    isAboutPopModal: false,
    isNewdescPopModal: false,
    newid: null,
    newval: null,
    editid: null,
    editval: null,
    levelCode: null,
    activeitem: true,
  };

  componentDidMount = () => {
    this.Listofsecuritylevels({});
  };
  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }

  newdescpopup() {
    this.setState({
      isNewdescPopModal: !this.state.isNewdescPopModal,
    });
  }

  Listofsecuritylevels = async () => {
    this.updateState({ is_loading: true });
    await this.props.Securities().then(res => {
      console.log(res);
      let { List, levelCode, newid } = this.state;

      List = res;
      if (res.length > 0) {
        newid = res[res.length - 1].levelItemId;
        newid = Number(newid) + 1;
      } else {
        newid = 1;
      }
      console.log(List);
      //   levelCode = res[res.length-1].levelItemId;
      this.setState({
        List,
        is_loading: false,
        levelCode,
        newid,
      });
      console.log(List.length, levelCode);
    });
  };

  handleEdit(id, desc, Code, check) {
    let { editid, editval, levelCode, activeitem } = this.state;
    editid = id;
    editval = desc;
    levelCode = Code;
    activeitem = check;
    console.log(editid, editval);
    this.setState({
      editid,
      editval,
      levelCode,
      activeitem,
    });
    this.aboutpopup();
  }

  handledesc = ({ target: { value, name } }) => {
    console.log(name);
    let { editval, newid, editid } = this.state;

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
    let { newval, editid } = this.state;

    if ((name = "newdescval")) {
      newval = value;
      this.setState({ newval });
    }
    if ((name = "name")) {
      editid = value;
      this.setState({ editid });
    }
  };

  finaldesc = async (id, desc) => {
    let { editval, newval, newid, levelCode, activeitem } = this.state;
    console.log(levelCode);
    let descJson = {
      levelName: id,
      levelDescription: desc,
      levelCode: levelCode,
      levelPermitAppointment: true,
      levelPermitCrm: true,
      levelPermitCreditor: true,
      levelPermitStaff: true,
      levelPermitUserLogin: true,
      levelPermitStockItem: true,
      levelPermitSecurity: true,
      levelPermitSendmail: true,
      levelPermitInventory: true,
      levelPermitAnalysis: true,
      levelPermitMaintain: true,
      levelPermitPos: true,
      levelIsActive: activeitem,
      levelPermitPayTable: true,
      levelPermitForex: true,
      levelPermitDiv: true,
      levelPermitDiscount: true,
      levelPermitDept: true,
      levelPermitClass: true,
      levelPermitPromo: true,
      levelPermitAttendance: true,
      levelPermitStkReceive: true,
      levelPermitStkAdj: true,
      levelPermitStkTrans: true,
      levelPermitStkWriteOff: true,
      levelPermitStkQuery: true,
      levelPermitStkTk: true,
      levelPermitStkVar: true,
    };
    await this.props
      .updateCommon(
        `Securities/update?where=%7B%22levelCode%22%3A%20${levelCode}%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofsecuritylevels({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopup();
    editval = "";
    newval = "";
    newid = "";
    this.setState({ editval, newval, newid });
  };

  createdesc = async (id, val) => {
    let { levelCode } = this.state;
    console.log(id, val);
    if (id == null || val == null) {
      Toast({
        type: "error",
        message: "Please check  required  field",
      });
    } else {
      let newreason = {
        levelName: id,
        levelDescription: val,
        levelCode: levelCode + 1,
        levelPermitAppointment: true,
        levelPermitCrm: true,
        levelPermitCreditor: true,
        levelPermitStaff: true,
        levelPermitUserLogin: true,
        levelPermitStockItem: true,
        levelPermitSecurity: true,
        levelPermitSendmail: true,
        levelPermitInventory: true,
        levelPermitAnalysis: true,
        levelPermitMaintain: true,
        levelPermitPos: true,
        levelIsActive: true,
        levelPermitPayTable: true,
        levelPermitForex: true,
        levelPermitDiv: true,
        levelPermitDiscount: true,
        levelPermitDept: true,
        levelPermitClass: true,
        levelPermitPromo: true,
        levelPermitAttendance: true,
        levelPermitStkReceive: true,
        levelPermitStkAdj: true,
        levelPermitStkTrans: true,
        levelPermitStkWriteOff: true,
        levelPermitStkQuery: true,
        levelPermitStkTk: true,
        levelPermitStkVar: true,
      };
      await this.props
        .NewSecurities(newreason)
        .then(data => {
          this.Listofsecuritylevels({});
        })
        .catch(e => console.log(e));
      this.newdescpopup();
    }
  };

  handlecheckbox = async item => {
    let { List } = this.state;
    for (let i = 0; i <= List.length - 1; i++) {
      if (List[i].levelCode == item) {
        List[i].levelIsActive = !List[i].levelIsActive;
        let descJson = {
          levelName: List[i].levelName,
          levelDescription: List[i].levelDescription,
          levelCode: List[i].levelCode,
          levelPermitAppointment: true,
          levelPermitCrm: true,
          levelPermitCreditor: true,
          levelPermitStaff: true,
          levelPermitUserLogin: true,
          levelPermitStockItem: true,
          levelPermitSecurity: true,
          levelPermitSendmail: true,
          levelPermitInventory: true,
          levelPermitAnalysis: true,
          levelPermitMaintain: true,
          levelPermitPos: true,
          levelIsActive: List[i].levelIsActive,
          levelPermitPayTable: true,
          levelPermitForex: true,
          levelPermitDiv: true,
          levelPermitDiscount: true,
          levelPermitDept: true,
          levelPermitClass: true,
          levelPermitPromo: true,
          levelPermitAttendance: true,
          levelPermitStkReceive: true,
          levelPermitStkAdj: true,
          levelPermitStkTrans: true,
          levelPermitStkWriteOff: true,
          levelPermitStkQuery: true,
          levelPermitStkTk: true,
          levelPermitStkVar: true,
        };
        await this.props
          .updateCommon(
            `Securities/update?where=%7B%22levelCode%22%3A%20${item}%7D
  `,
            descJson
          )
          .then(data => {
            this.Listofsecuritylevels({});
          });
      }
    }
  };
  render() {
    let {
      headerDetails,
      pageMeta,
      List,
      is_loading,
      isAboutPopModal,
      editid,
      editval,
      newid,
      newval,
      isNewdescPopModal,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md">
                  <h4 className="head-label">{t("Security Master")}</h4>
                </div>
              </div>
              <div className="tab-table-content">
                <p className="mt-3">{t("List of Security Level")}</p>
                <div className="py-4">
                  <div className="table-container">
                    <TableWrapper
                      headerDetails={headerDetails}
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
                      ) : List.length > 0 ? (
                        List.map(
                          (
                            {
                              levelCode,
                              levelName,
                              roleCode,
                              levelDescription,
                              levelIsActive,
                            },
                            index
                          ) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div className="text-right">{levelCode}</div>
                                </td>
                                <td>
                                  <div className="text-left">{levelName}</div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {roleCode == "1"
                                      ? "Admin"
                                      : roleCode == "2"
                                      ? "Manager"
                                      : roleCode == "3"
                                      ? " Normal Staff"
                                      : "Super Admin (support)"}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {levelDescription}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    <NormalCheckbox
                                      checked={levelIsActive}
                                      name="checked"
                                      onChange={() =>
                                        this.handlecheckbox(levelCode)
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
                                          levelName,
                                          levelDescription,
                                          levelCode,
                                          levelIsActive
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
          <div className="mt-3" style={{ width: 100 }}>
            <NormalButton
              mainbg={true}
              label={"Add Row"}
              onClick={() => this.newdescpopup()}
            />
          </div>
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
                <p>Name</p>
                <NormalInput
                  value={editid}
                  name="name"
                  onChange={this.handledescription}
                />
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
              <h5> ADD Security Level</h5>
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
                <p>Name</p>
                <NormalInput
                  value={newid}
                  name="newid"
                  onChange={this.handledesc}
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
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Securities,
      NewSecurities,
      updateCommon,
    },
    dispatch
  );
};

export const Securitymaster = withTranslation()(
  connect(null, mapDispatchToProps)(SecuritymasterClass)
);
