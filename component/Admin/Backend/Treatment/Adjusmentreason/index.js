import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  TableWrapper,
  NormalModal,
  NormalInput,
} from "component/common";
import { withTranslation } from "react-i18next";
import {
  ReverseTrmtReason,
  updateCommon,
  Newappointreason,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";

export class AdjustmentreasonClass extends Component {
  state = {
    AdjusmentDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Is Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],
    List: [],
    is_loading: null,
    isAboutPopModal: false,
    isNewdescPopModal: false,
    newid: null,
    newval: null,
    editid: null,
    editval: null,
    activeitem: true,
  };

  componentDidMount = () => {
    this.ListofReason({});
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
    let { List, newid, te } = this.state;
    if (List.length > 0) {
      te = List[List.length - 1].revNo;
      newid = Number(te) + 1;
    } else {
      newid = 100001;
    }

    this.setState({
      isNewdescPopModal: !this.state.isNewdescPopModal,
      newid,
    });
  }

  ListofReason = async () => {
    this.updateState({ is_loading: true });
    await this.props.ReverseTrmtReason().then(res => {
      console.log(res);
      let { List } = this.state;

      List = res;
      console.log(List);
      this.setState({
        List,
        is_loading: false,
      });
      console.log(List.length);
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
    let { editval } = this.state;

    if ((name = "desc")) {
      editval = value;
      this.setState({ editval });
    }
  };

  newdescriptionval = ({ target: { value, name } }) => {
    let { newid } = this.state;

    if ((name = "newid")) {
      newid = value;
      this.setState({ newid });
    }
  };

  newdescription = ({ target: { value, name } }) => {
    let { newval } = this.state;

    if ((name = "newdesval")) {
      newval = value;
      this.setState({ newval });
    }
  };

  finaldesc = async (id, desc) => {
    let { editval, newval, activeitem } = this.state;
    let descJson = {
      revNo: id,
      revDesc: desc,
      revRemark: "",
      isActive: activeitem,
    };
    await this.props
      .updateCommon(
        `ReverseTrmtReasons/update?where=%7B%22revNo%22%3A%20%22${id}%22%7D
     `,
        descJson
      )
      .then(data => {
        this.ListofReason({});
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
        revNo: id,
        revDesc: val,
        revRemark: "",
        isActive: true,
      };
      await this.props
        .Newappointreason(newreason)
        .then(data => {
          this.ListofReason({});
        })
        .catch(e => console.log(e));
      this.newdescpopup();
      newval = "";
      this.setState({ newval });
    }
  };

  handlecheckbox = async item => {
    let { List } = this.state;
    for (let i = 0; i <= List.length - 1; i++) {
      if (List[i].revNo == item) {
        List[i].isActive = !List[i].isActive;
        let descJson = {
          revNo: List[i].revNo,
          revDesc: List[i].revDesc,
          revRemark: "",
          isActive: List[i].isActive,
        };
        await this.props
          .updateCommon(
            `ReverseTrmtReasons/update?where=%7B%22revNo%22%3A%20%22${item}%22%7D
`,
            descJson
          )
          .then(data => {
            this.ListofReason({});
          });
      }
    }
  };

  render() {
    let {
      AdjusmentDetails,
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
                  <h4 className="head-label">{t("Adjustment Reason")}</h4>
                </div>
              </div>
              <div className="tab-table-content">
                <p className="mt-3">{t("List of Adjustment Reason")}</p>
                <div className="py-4">
                  <div className="table-container">
                    <TableWrapper headerDetails={AdjusmentDetails}>
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
                        List.map(({ revNo, revDesc, isActive }, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="text-right">{revNo}</div>
                              </td>
                              <td>
                                <div className="text-left">{revDesc}</div>
                              </td>
                              <td>
                                <div className="text-left">
                                  <NormalCheckbox
                                    checked={isActive}
                                    name="checked"
                                    onChange={() => this.handlecheckbox(revNo)}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center cursor-pointer">
                                  <BsPencilSquare
                                    size={20}
                                    onClick={() =>
                                      this.handleEdit(revNo, revDesc, isActive)
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
                  disabled={true}
                  onChange={this.newdescriptionval}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={newval}
                  name="newdesval"
                  onChange={this.newdescription}
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
      ReverseTrmtReason,
      updateCommon,
      Newappointreason,
    },
    dispatch
  );
};

export const Adjustmentreason = withTranslation()(
  connect(null, mapDispatchToProps)(AdjustmentreasonClass)
);
