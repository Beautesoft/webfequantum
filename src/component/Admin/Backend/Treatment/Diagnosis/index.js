import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalInput,
  NormalModal,
} from "component/common";
import {
  Diagnosissetups,
  NewDiagosissetup,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";

export class DiagnosisClass extends Component {
  state = {
    DiagnosisDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],
    pageMeta: {},
    staffList: [],
    is_loading: false,
    isAboutPopModal: false,
    editid: null,
    editval: null,
    isNewdescPopModal: false,
    newid: null,
    newval: null,
    activeitem: true,
  };

  componentDidMount = () => {
    this.Listofdiagnosis({});
  };
  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofdiagnosis = async () => {
    this.updateState({ is_loading: true });
    await this.props.Diagnosissetups().then(res => {
      console.log(res);
      let { staffList } = this.state;
      staffList = res;
      console.log(staffList);
      this.setState({
        staffList,
        is_loading: false,
      });
      console.log(staffList.length);
    });
  };
  handleEdit(id, desc, check) {
    let { editid, editval, activeitem } = this.state;
    editid = id;
    editval = desc;
    activeitem = check;
    console.log(editid, editval);
    this.setState({
      editid,
      editval,
      activeitem,
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

  createdesc = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { newval } = this.state;
      console.log(id, val);
      let newreason = {
        diagCode: id,
        diagDesc: val,
        diagIsactive: true,
      };
      await this.props
        .NewDiagosissetup(newreason)
        .then(data => {
          this.Listofdiagnosis({});
        })
        .catch(e => console.log(e));

      this.newdescpopup();
      newval = "";
      this.setState({ newval });
    }
  };

  finaldesc = async (id, desc) => {
    let { editval, newval, newid, activeitem } = this.state;
    let descJson = {
      diagCode: id,
      diagDesc: desc,
      diagIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `Diagnosissetups/update?where=%7B%22diagCode%22%3A%20%22${id}%22%7D
  `,
        descJson
      )
      .then(data => {
        this.Listofdiagnosis({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      })
      .catch(e => console.log(e));

    editval = "";
    newval = "";
    newid = "";
    this.setState({ editval, newval, newid });
    this.aboutpopup();
  };

  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }

  newdescpopup() {
    let { staffList, newid, te } = this.state;
    if (staffList.length > 0) {
      te = staffList[staffList.length - 1].diagCode;
      newid = Number(te) + 1;
    } else {
      newid = 1001;
    }
    console.log(newid);
    this.setState({
      isNewdescPopModal: !this.state.isNewdescPopModal,
      newid,
    });
  }

  handlecheckbox = async item => {
    let { staffList } = this.state;
    for (let i = 0; i <= staffList.length - 1; i++) {
      if (staffList[i].diagCode == item) {
        staffList[i].diagIsactive = !staffList[i].diagIsactive;
        let descJson = {
          diagCode: staffList[i].diagCode,
          diagDesc: staffList[i].diagDesc,
          diagIsactive: staffList[i].diagIsactive,
        };
        await this.props
          .updateCommon(
            `Diagnosissetups/update?where=%7B%22diagCode%22%3A%20%22${item}%22%7D
    `,
            descJson
          )
          .then(data => {
            this.Listofdiagnosis({});
          });
      }
    }
  };

  render() {
    let {
      staffList,
      DiagnosisDetails,
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
                  <h4 className="head-label">{t("Diagnosis")}</h4>
                </div>
              </div>
              <div className="tab-table-content">
                <p className="mt-3">{t("List of Diagnosis")}</p>
                <div className="py-4">
                  <div className="table-container">
                    <TableWrapper headerDetails={DiagnosisDetails}>
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
                          ({ diagCode, diagDesc, diagIsactive }, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div className="text-right">{diagCode}</div>
                                </td>
                                <td>
                                  <div className="text-left">{diagDesc}</div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    <NormalCheckbox
                                      checked={diagIsactive}
                                      name="checked"
                                      onChange={() =>
                                        this.handlecheckbox(diagCode)
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
                                          diagCode,
                                          diagDesc,
                                          diagIsactive
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
            <div className="heading">EDIT DESCRIPTION</div>

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
              <div>
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
              <h5> ADD Adjustment Reason </h5>
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
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Diagnosissetups,
      NewDiagosissetup,
      updateCommon,
    },
    dispatch
  );
};

export const Diagnosis = withTranslation()(
  connect(null, mapDispatchToProps)(DiagnosisClass)
);
