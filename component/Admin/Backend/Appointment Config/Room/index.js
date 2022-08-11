import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalInput,
  NormalSelect,
  InputSearch,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  Rooms,
  NewRooms,
  Myequipments,
  ItemSitelists,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export class AppointmentRoomClass extends Component {
  state = {
    RoomDetails: [
      {
        label: "Code",
        divClass: "justify-content-end",
        sortKey: "roomCode",
        enabled: true,
        id: "roomCode",
        singleClickFunc: () => this.handleSort("roomCode"),
      },
      {
        label: "Site Code",
        sortKey: "siteCode",
        enabled: true,
        id: "siteCode",
        singleClickFunc: () => this.handleSort("siteCode"),
      },
      {
        label: "Room Number",
        sortKey: "displayname",
        enabled: true,
        id: "displayname",
        singleClickFunc: () => this.handleSort("displayname"),
      },
      {
        label: "Room Description",
        sortKey: "description",
        enabled: true,
        id: "description",
        singleClickFunc: () => this.handleSort("description"),
      },
      {
        label: "Equipment",
        sortKey: "equipment",
        enabled: true,
        id: "equipment",
        singleClickFunc: () => this.handleSort("equipment"),
      },
      {
        label: "Room Type",
        sortKey: "roomtype",
        enabled: true,
        id: "roomtype",
        singleClickFunc: () => this.handleSort("roomtype"),
      },
      {
        label: "Room is Active",
        sortKey: "isactive",
        enabled: true,
        id: "isactive",
        singleClickFunc: () => this.handleSort("isactive"),
      },
    ],
    equi: null,
    isoption: false,
    isgeneral: false,
    issite: false,
    iscommission: false,
    List: [],
    code: null,
    desc: null,
    room_no: null,
    site_code: null,
    checked: true,
    sitecodeoption: [],
    equimentoption: [],
    search: "",
    filterdata: [],
    edit: false,
    codeedit: null,
    descedit: null,
    room_noedit: null,
    site_codeedit: null,
    checkededit: true,
    equiedit: null,
  };

  componentDidMount = () => {
    this.Listofrooms({});
    this.Listofequiments({});
    this.listofsitegropus({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

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

  Listofequiments = async () => {
    await this.props.Myequipments().then(res => {
      let { equimentoption } = this.state;
      for (let key of res) {
        equimentoption.push({
          value: key.equipmentDescription,
          label: key.equipmentDescription,
        });
      }
      this.setState({
        equimentoption,
      });
      console.log(equimentoption.length);
    });
  };

  listofsitegropus = async () => {
    let { sitecodeoption } = this.state;
    sitecodeoption = [];
    await this.props.ItemSitelists().then(res => {
      for (let key of res) {
        sitecodeoption.push({
          value: key.itemsiteCode,
          label: key.itemsiteDesc,
        });
      }
      console.log(sitecodeoption);
      this.setState({
        sitecodeoption,
      });
      console.log(sitecodeoption.length);
    });
  };

  Listofrooms = async () => {
    this.updateState({ is_loading: true });
    let { List, code } = this.state;
    await this.props.Rooms().then(res => {
      console.log(res);
      List = res;
      console.log(List);
      this.setState({
        List,
        is_loading: false,
      });
      console.log(List.length);
    });
    if (List.length > 0) {
      code = List[List.length - 1].equipmentCode;
      code = Number(code) + 1;
    } else {
      code = "EQU" + 100001;
    }
    this.setState({
      code,
    });
  };

  roomcontent() {
    this.setState({
      isgeneral: !this.state.isgeneral,
    });
  }

  listcontent() {
    this.setState({
      iscommission: !this.state.iscommission,
    });
  }

  handleinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      code,
      desc,
      site_code,
      room_no,
      equi,
      checked,
      codeedit,
      descedit,
      site_codeedit,
      room_noedit,
      equiedit,
      checkededit,
    } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "equi") {
      equi = value;
      this.setState({ equi });
    }
    if (name == "room_no") {
      room_no = value;
      this.setState({ room_no });
    }
    if (name == "site_code") {
      site_code = value;
      this.setState({ site_code });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
    if (name == "codeedit") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "descedit") {
      descedit = value;
      this.setState({ descedit });
    }
    if (name == "equiedit") {
      equiedit = value;
      this.setState({ equiedit });
    }
    if (name == "room_noedit") {
      room_noedit = value;
      this.setState({ room_noedit });
    }
    if (name == "site_codeedit") {
      site_codeedit = value;
      this.setState({ site_codeedit });
    }
    if (name == "checkededit") {
      checkededit = value;
      this.setState({ checkededit });
    }
  };

  Addnewroom = async () => {
    let { code, desc, site_code, room_no, equi, checked, objIndex } =
      this.state;
    if (code == null || room_no == null || site_code == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      await this.props.Rooms().then(res => {
        objIndex = res.findIndex(obj => obj.roomCode == code);
      });
      if (objIndex == -1) {
        let newroom = {
          displayname: room_no,
          description: desc,
          isactive: checked,
          equipment: equi,
          roomtype: "",
          equipmentPictureLocation: "",
          siteCode: site_code,
          roomCode: code,
        };
        await this.props
          .NewRooms(newroom)
          .then(data => {
            this.Listofrooms({});

            code = "";
            desc = "";
            site_code = "";
            room_no = "";
            equi = "";
            checked = false;
            this.setState({ checked, code, desc, site_code, room_no, equi });
            this.Listofrooms();
          })
          .catch(e => console.log(e));
      } else {
        Toast({
          type: "error",
          message: "Please check code is already present",
        });
      }
    }
  };

  //************Searching option **********//
  filterByName = ({ target: { value, name } }) => {
    console.log(value, name);
    let { List, filterdata, search, seachdata } = this.state;
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

  handleedit = async itemcode => {
    let {
      edit,
      codeedit,
      descedit,
      room_noedit,
      site_codeedit,
      checkededit,
      temp,
      equiedit,
    } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.Rooms().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.roomCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      codeedit = temp.roomCode;
      descedit = temp.description;
      room_noedit = temp.displayname;
      site_codeedit = temp.siteCode;
      checkededit = temp.isactive;
      equiedit = temp.equipment;
      this.setState({
        codeedit,
        descedit,
        room_noedit,
        site_codeedit,
        checkededit,
        equiedit,
      });
    });
    this.roomcontent();
  };

  handleupdates = async () => {
    let {
      edit,
      codeedit,
      descedit,
      room_noedit,
      site_codeedit,
      checkededit,
      equiedit,
    } = this.state;
    let descJson = {
      displayname: descedit,
      description: descedit,
      isactive: checkededit,
      equipment: equiedit,
      roomtype: room_noedit,
      equipmentPictureLocation: null,
      siteCode: site_codeedit,
      roomCode: codeedit,
    };
    await this.props
      .updateCommon(
        `Rooms/update?where=%7B%22roomCode%22%3A%20%22${this.state.codeedit}%20%22%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofrooms({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    edit = false;
    room_noedit = "";
    site_codeedit = "";
    equiedit = "";
    descedit = "";
    checkededit = true;

    this.setState({
      codeedit,
      descedit,
      room_noedit,
      site_codeedit,
      checkededit,
      equiedit,
    });
    this.roomcontent();
  };
  render() {
    let {
      RoomDetails,
      pageMeta,
      List,
      is_loading,
      code,
      desc,
      room_no,
      isgeneral,
      site_code,
      iscommission,
      equi,
      sitecodeoption,
      equimentoption,
      checked,
      search,
      filterdata,
      codeedit,
      descedit,
      room_noedit,
      site_codeedit,
      checkededit,
      edit,
      equiedit,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid room">
          <h4>{t("Room")}</h4>
          {edit == false ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 roomcreation"
                onClick={() => this.roomcontent()}
              >
                <p>{t("Room Creation")}</p>
                <div className="icons">
                  {isgeneral == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {isgeneral == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={code}
                            name="code"
                            onChange={this.handleinput}
                            //disabled = {true}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Room No")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={room_no}
                            name="room_no"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Equipment")}</p>
                        <div className="input-group">
                          <NormalSelect
                            value={equi}
                            options={equimentoption}
                            name="equi"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checked}
                            name="checked"
                            onChange={this.handleinput}
                          />
                          <p>{t("Room is Currently Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.Addnewroom()}
                        />
                      </div>
                    </div>

                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Site Code")}</span>
                        <span className="star">*</span>
                        <div className="input-group">
                          <NormalSelect
                            value={site_code}
                            options={sitecodeoption}
                            name="site_code"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Room Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={desc}
                            name="desc"
                            onChange={this.handleinput}
                          />
                        </div>
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
                className="d-flex  justify-content-between p-3 roomcreation"
                onClick={() => this.roomcontent()}
              >
                <p>{t("Room Creation")}</p>
                <div className="icons">
                  {isgeneral == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {isgeneral == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={codeedit}
                            name="codeedit"
                            onChange={this.handleinput}
                            //disabled = {true}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Room No")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={room_noedit}
                            name="room_noedit"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Equipment")}</p>
                        <div className="input-group">
                          <NormalSelect
                            value={equiedit}
                            options={equimentoption}
                            name="equiedit"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            checked={checkededit}
                            name="checkededit"
                            onChange={this.handleinput}
                          />
                          <p>{t("Room is Currently Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Update"}
                          onClick={() => this.handleupdates()}
                        />
                      </div>
                    </div>

                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Site Code")}</span>
                        <span className="star">*</span>
                        <div className="input-group">
                          <NormalSelect
                            value={site_codeedit}
                            options={sitecodeoption}
                            name="site_codeedit"
                            onChange={this.handleinput}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Room Description")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={descedit}
                            name="descedit"
                            onChange={this.handleinput}
                          />
                        </div>
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
            className="d-flex  justify-content-between p-3 roomcreation mt-5"
            onClick={() => this.listcontent()}
          >
            <p>{t("Room List")}</p>
            <div className="icons">
              {iscommission == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscommission == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <div className="d-flex">
                    <p className="mt-3 col-5">{t("List of Rooms")}</p>
                    <div className="w-100 col-7 mt-3">
                      <InputSearch
                        onChange={this.filterByName}
                        placeholder="Search by  Code / Description"
                      />
                    </div>
                  </div>
                  {search.length > 0 ? (
                    <div className="tab-table-content">
                      <div className="py-4">
                        <div className="table-container">
                          <TableWrapper
                            headerDetails={RoomDetails}
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
                            ) : filterdata.length > 0 ? (
                              filterdata.map(
                                (
                                  {
                                    description,
                                    displayname,
                                    equipment,
                                    isactive,
                                    roomCode,
                                    roomtype,
                                    siteCode,
                                  },
                                  index
                                ) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div
                                          className="text-right text-success cursor-pointer"
                                          onClick={() =>
                                            this.handleedit(roomCode)
                                          }
                                        >
                                          {roomCode}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-left">
                                          {siteCode}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-left">
                                          {displayname}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-left">
                                          {description}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-left">
                                          {equipment}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-left">
                                          {roomtype}
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
                  ) : (
                    <div className="py-4">
                      <div className="table-container">
                        <TableWrapper
                          headerDetails={RoomDetails}
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
                                  description,
                                  displayname,
                                  equipment,
                                  isactive,
                                  roomCode,
                                  roomtype,
                                  siteCode,
                                },
                                index
                              ) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div
                                        className="text-right text-success cursor-pointer"
                                        onClick={() =>
                                          this.handleedit(roomCode)
                                        }
                                      >
                                        {roomCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {siteCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {displayname}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {description}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {equipment}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {roomtype}
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
                  )}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      Rooms,
      NewRooms,
      Myequipments,
      ItemSitelists,
      updateCommon,
    },
    dispatch
  );
};
export const AppointmentRoom = withTranslation()(
  connect(null, mapDispatchToProps)(AppointmentRoomClass)
);
