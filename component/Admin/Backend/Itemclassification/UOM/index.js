import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalInput,
  NormalModal,
} from "component/common";
import { withTranslation } from "react-i18next";
import { ItemUom, NewItemUom, updateCommon } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";

export class ItemUOMClass extends Component {
  state = {
    headerDetails: [
      { label: "UOM" },
      { label: "Description" },
      { label: "Is active" },
      { label: "Action", divClass: "justify-content-center" },
    ],
    staffList: [],
    is_loading: false,
    isAboutPopModal: false,
    isNewdescPopModal: false,
    newid: "",
    newval: "",
    editid: null,
    editval: null,
  };

  componentDidMount = () => {
    this.Listofuoms({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofuoms = async () => {
    this.updateState({ is_loading: true });
    await this.props.ItemUom().then(res => {
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
  handleeditid = ({ target: { value, name } }) => {
    let { editid } = this.state;
    if ((name = "code")) {
      editid = value;
      this.setState({ editid });
      console.log(editid);
    }
  };

  handledescription = ({ target: { value, name } }) => {
    let { newval } = this.state;

    if ((name = "newdescval")) {
      newval = value;
      this.setState({ newval });
    }
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

  createdesc = async (id, val) => {
    console.log(id, val);
    let newuoms = {
      uomCode: id,
      uomDesc: val,
      uomIsactive: true,
    };
    await this.props
      .NewItemUom(newuoms)
      .then(data => {
        this.Listofuoms({});
        Toast({
          type: "success",
          message: "Successfully Added",
        });
      })
      .catch(e => console.log(e));
    this.newdescpopup();
  };

  finaldesc = async (id, desc) => {
    let { editval, newval, newid } = this.state;
    console.log(id, desc);
    let descJson = {
      uomCode: id,
      uomDesc: desc,
      uomIsactive: true,
      uomUser: null,
      uomDate: null,
      uomTime: null,
    };
    await this.props
      .updateCommon(
        `ItemUoms/update?where=%7B%22uomCode%22%3A%20%22${id}%22%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofuoms({});
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
    let { staffList } = this.state;
    for (let i = 0; i <= staffList.length - 1; i++) {
      if (staffList[i].uomCode == item) {
        staffList[i].uomIsactive = !staffList[i].uomIsactive;
        let descJson = {
          uomCode: staffList[i].uomCode,
          uomDesc: staffList[i].uomDesc,
          uomIsactive: staffList[i].uomIsactive,
          uomUser: null,
          uomDate: null,
          uomTime: null,
        };
        await this.props
          .updateCommon(
            `ItemUoms/update?where=%7B%22uomCode%22%3A%20%22${item}%22%7D
    `,
            descJson
          )
          .then(data => {
            this.Listofuoms({});
          });
      }
    }
  };

  render() {
    let {
      headerDetails,
      staffList,
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
                <div className="col-md-2">
                  <h4 className="head-label">{t("Classification List")}</h4>
                </div>
                <div className="col-md-10">
                  <div className="d-flex justify-content-end"></div>
                </div>
              </div>
              <div className="tab-table-content">
                <div className="py-4">
                  <div className="table-container">
                    <TableWrapper headerDetails={headerDetails}>
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
                          ({ uomCode, uomDesc, uomIsactive }, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div className="text-left">{uomCode}</div>
                                </td>
                                <td>
                                  <div className="text-left">{uomDesc}</div>
                                </td>
                                <td>
                                  <div className="text-leftr">
                                    <NormalCheckbox
                                      checked={uomIsactive}
                                      name="checked"
                                      onChange={() =>
                                        this.handlecheckbox(uomCode)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    <BsPencilSquare
                                      size={20}
                                      onClick={() =>
                                        this.handleEdit(uomCode, uomDesc)
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
                <NormalInput
                  value={editid}
                  name="code"
                  onChange={this.handleeditid}
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
      NewItemUom,
      ItemUom,
      updateCommon,
    },
    dispatch
  );
};

export const ItemUOM = withTranslation()(
  connect(null, mapDispatchToProps)(ItemUOMClass)
);
