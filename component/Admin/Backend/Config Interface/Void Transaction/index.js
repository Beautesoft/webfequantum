import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalInput,
  NormalModal,
} from "component/common";
import { withTranslation } from "react-i18next";
import {
  VoidReasons,
  NewVoidReasons,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";

export class TransactionvoidClass extends Component {
  state = {
    TransDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],
    List: [],
    is_loading: false,
    isAboutPopModal: false,
    isNewdescPopModal: false,
    newid: null,
    newval: null,
    editid: null,
    editval: null,
    activeitem: true,
  };

  componentDidMount = () => {
    this.Listofvoidtrans({});
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
      te = List[List.length - 1].reasonCode;
      console.log(te);
      newid = Number(te) + 1;
    } else {
      newid = 100001;
    }
    console.log(newid);

    this.setState({
      isNewdescPopModal: !this.state.isNewdescPopModal,
      newid,
    });
  }

  handledesc = ({ target: { value, name } }) => {
    console.log(name);
    let { editval, newid } = this.state;

    if ((name = "name")) {
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

  Listofvoidtrans = async () => {
    this.updateState({ is_loading: true });
    await this.props.VoidReasons().then(res => {
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

  createdesc = async (id, val) => {
    console.log(id, val);
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { newval } = this.state;
      let newreason = {
        reasonCode: id,
        reasonDesc: val,
        isactive: true,
      };
      await this.props
        .NewVoidReasons(newreason)
        .then(data => {
          this.Listofvoidtrans({});
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
      reasonCode: id,
      reasonDesc: desc,
      isactive: activeitem,
    };
    await this.props
      .updateCommon(
        `VoidReasons/update?where=%7B%22reasonCode%22%3A%20${id}%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofvoidtrans({});
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

  handlecheckbox = async item => {
    let { List } = this.state;
    for (let i = 0; i <= List.length - 1; i++) {
      if (List[i].reasonCode == item) {
        List[i].isactive = !List[i].isactive;
        let descJson = {
          reasonCode: List[i].reasonCode,
          reasonDesc: List[i].reasonDesc,
          isactive: List[i].isactive,
        };
        await this.props
          .updateCommon(
            `VoidReasons/update?where=%7B%22reasonCode%22%3A%20${item}%7D
    `,
            descJson
          )
          .then(data => {
            this.Listofvoidtrans({});
          });
      }
    }
  };
  render() {
    let {
      TransDetails,
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
                  <h4 className="head-label">{t("VOID Transaction Reason")}</h4>
                </div>
              </div>
              <div className="tab-table-content">
                <p className="mt-3">{t("List of VOID Transaction Reason")}</p>
                <div className="py-4">
                  <div className="table-container">
                    <TableWrapper
                      headerDetails={TransDetails}
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
                          ({ reasonCode, reasonDesc, isactive }, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div className="text-right">{reasonCode}</div>
                                </td>
                                <td>
                                  <div className="text-left">{reasonDesc}</div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    <NormalCheckbox
                                      checked={isactive}
                                      name="checked"
                                      onChange={() =>
                                        this.handlecheckbox(reasonCode)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center cursor-pointer">
                                    <BsPencilSquare
                                      size={20}
                                      onClick={() =>
                                        this.handleEdit(
                                          reasonCode,
                                          reasonDesc,
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
                  name="name"
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
      VoidReasons,
      NewVoidReasons,
      updateCommon,
    },
    dispatch
  );
};

export const Transactionvoid = withTranslation()(
  connect(null, mapDispatchToProps)(TransactionvoidClass)
);
