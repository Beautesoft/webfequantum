import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalInput,
  NormalModal,
  InputSearch,
} from "component/common";
import { withTranslation } from "react-i18next";
import {
  AppointmentGroups,
  NewAppointmentGroups,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";

export class AppointmentgroupClass extends Component {
  state = {
    AppointDetails: [
      {
        label: "Code",
        sortKey: "apptGroupCode",
        enabled: true,
        id: "apptGroupCode",
        singleClickFunc: () => this.handleSort("apptGroupCode"),
      },
      {
        label: "Description",
        sortKey: "apptGroupDesc",
        enabled: true,
        id: "apptGroupDesc",
        singleClickFunc: () => this.handleSort("apptGroupDesc"),
      },
      {
        label: "Active",
        sortKey: "apptGroupIsactive",
        enabled: true,
        id: "apptGroupIsactive",
        singleClickFunc: () => this.handleSort("apptGroupIsactive"),
      },
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
    search: "",
    filterdata: [],
    activeitem: true,
  };

  componentDidMount = () => {
    this.Listofappointgroup({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }

  //Sorting

  handleSort = (sortkey, order) => {
    let { List, headerDetails, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });
    console.log("che");
    if (orderBy === "asc") {
      List.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      List.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      List,
    });
  };

  newdescpopup() {
    let { List, newid, te } = this.state;
    if (List.length > 0) {
      te = List[List.length - 1].apptGroupCode;
      te = te.slice(te.length - 6);
      newid = Number(te) + 1;
      newid = "AG" + newid;
    } else {
      newid = 100001;
    }

    this.setState({
      isNewdescPopModal: !this.state.isNewdescPopModal,
      newid,
    });
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

  Listofappointgroup = async () => {
    this.updateState({ is_loading: true });
    await this.props.AppointmentGroups().then(res => {
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
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { newval } = this.state;
      let newreason = {
        apptGroupCode: id,
        apptGroupDesc: val,
        apptGroupIsactive: true,
      };
      await this.props
        .NewAppointmentGroups(newreason)
        .then(data => {
          this.Listofappointgroup({});
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
      apptGroupCode: id,
      apptGroupDesc: desc,
      apptGroupSequence: 0,
      apptGroupIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `AppointmentGroups/update?where=%7B%22apptGroupCode%22%3A%20%22${id}%22%7D

    `,
        descJson
      )
      .then(data => {
        this.Listofappointgroup({});
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
      if (List[i].apptGroupCode == item) {
        List[i].apptGroupIsactive = !List[i].apptGroupIsactive;
        let descJson = {
          apptGroupCode: List[i].apptGroupCode,
          apptGroupDesc: List[i].apptGroupDesc,
          apptGroupSequence: 0,
          apptGroupIsactive: List[i].apptGroupIsactive,
        };
        await this.props
          .updateCommon(
            `AppointmentGroups/update?where=%7B%22apptGroupCode%22%3A%20%22${item}%22%7D

    `,
            descJson
          )
          .then(data => {
            this.Listofappointgroup({});
          });
      }
    }
  };

  //************Searching option **********//
  filterByName = ({ target: { value, name } }) => {
    console.log(value, name);
    let { List, filterdata, search } = this.state;
    if (name == "search") {
      search = value;
      this.setState({ search });
    }
    if (search !== "") {
      filterdata = List.filter(item => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    }
    this.setState({ filterdata });
    console.log(filterdata);
  };

  render() {
    let {
      AppointDetails,
      List,
      is_loading,
      isAboutPopModal,
      editid,
      editval,
      newid,
      newval,
      isNewdescPopModal,
      search,
      filterdata,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid department-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md">
                  <h4 className="head-label">{t("Appointment Group")}</h4>
                </div>
              </div>
              <div className="tab-table-content">
                <div className="d-flex">
                  <p className="mt-3">{t("List of Appointment Group")}</p>
                  <div className="w-100 col-7 mt-3">
                    <InputSearch
                      onChange={this.filterByName}
                      placeholder={t(`Search by  Code / Description`)}
                    />
                  </div>
                </div>
                {search.length > 0 ? (
                  <div className="tab-table-content">
                    <div className="py-4">
                      <div className="table-container">
                        <TableWrapper headerDetails={AppointDetails}>
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
                          ) : filterdata.length > 0 ? (
                            filterdata.map(
                              (
                                {
                                  apptGroupCode,
                                  apptGroupDesc,
                                  apptGroupIsactive,
                                },
                                index
                              ) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div className="text-left">
                                        {apptGroupCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {apptGroupDesc}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        <NormalCheckbox
                                          checked={apptGroupIsactive}
                                          name="checked"
                                          onChange={() =>
                                            this.handlecheckbox(apptGroupCode)
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
                                              apptGroupCode,
                                              apptGroupDesc,
                                              apptGroupIsactive
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
                ) : (
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={AppointDetails}>
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
                                apptGroupCode,
                                apptGroupDesc,
                                apptGroupIsactive,
                              },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-left">
                                      {apptGroupCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {apptGroupDesc}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={apptGroupIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckbox(apptGroupCode)
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
                                            apptGroupCode,
                                            apptGroupDesc,
                                            apptGroupIsactive
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
                )}
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
              <h5> ADD Appointment Group </h5>
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
      AppointmentGroups,
      NewAppointmentGroups,
      updateCommon,
    },
    dispatch
  );
};

export const Appointmentgroup = withTranslation()(
  connect(null, mapDispatchToProps)(AppointmentgroupClass)
);
