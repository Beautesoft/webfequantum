import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalCheckbox,
  NormalModal,
  NormalInput,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import {
  Races,
  NewRaces,
  updateCommon,
  Agegroups,
  NewAgegroups,
  Corporatecustomers,
  NewCorporatecustomers,
  SkinTypes,
  NewSkinTypes,
  Languages,
  NewLanguages,
  Locations,
  NewLocations,
  NewGenders,
  Genders,
} from "redux/actions/Backend";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";

export class CustomermastertwoClass extends Component {
  state = {
    customerDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Age Group", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],
    customertypeDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Active" },
    ],
    commontable: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Active" },
      { label: "Active", divClass: "justify-content-center" },
    ],

    isoption: false,
    iscreation: false,
    iscustomer1: false,
    iscustomer2: false,
    iscustomer3: false,
    isproductgroup: false,
    iscustomertype: false,
    isgender: false,
    islocation: false,
    staffList: [],
    racelist: [],
    newid: null,
    newval: null,
    editid: null,
    editval: null,
    isAboutPopModal: false,
    isNewdescPopModal: false,
    agelist: [],
    agecode: null,
    newidtwo: null,
    newvaltwo: null,
    newvaldesc: null,
    editidtwo: null,
    editvaltwo: null,
    isAboutPopModaltwo: false,
    isNewdescPopModalage: false,
    customerlist: [],
    skintype: [],
    languagelist: [],
    locationlist: [],
    genderlist: [],
    skinid: null,
    skinval: null,
    editskinid: null,
    editskinval: null,
    isAboutPopModalskin: false,
    isNewdescPopModalskin: false,
    locationid: null,
    locationval: null,
    editlocationid: null,
    editlocationval: null,
    isAboutPopModallocation: false,
    isNewdescPopModallocation: false,
    languageid: null,
    languageval: null,
    editlanguageid: null,
    editlanguageval: null,
    isAboutPopModallanguage: false,
    isNewdescPopModallanguage: false,
    genderid: null,
    genderval: null,
    editgenderid: null,
    editgenderval: null,
    isAboutPopModalgender: false,
    isNewdescPopModalgender: false,
    activeitem: true,
  };

  componentDidMount = () => {
    this.ListofRaces({});
    this.Listofages({});
    this.Listofcustomer({});
    this.Listofskintype({});
    this.Listoflanguage({});
    this.Listoflocation({});
    this.Listofgender({});
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  ListofRaces = async () => {
    this.updateState({ is_loading: true });
    await this.props.Races().then(res => {
      console.log(res);
      let { racelist } = this.state;

      racelist = res;
      console.log(racelist);
      this.setState({
        racelist,
        is_loading: false,
      });
      console.log(racelist.length);
    });
  };

  Listofages = async () => {
    this.updateState({ is_loading: true });
    await this.props.Agegroups().then(res => {
      console.log(res);
      let { agelist } = this.state;

      agelist = res;
      console.log(agelist);
      this.setState({
        agelist,
        is_loading: false,
      });
      console.log(agelist.length);
    });
  };

  Listofcustomer = async () => {
    this.updateState({ is_loading: true });
    await this.props.Corporatecustomers().then(res => {
      console.log(res);
      let { customerlist } = this.state;

      customerlist = res;
      console.log(customerlist);
      this.setState({
        customerlist,
        is_loading: false,
      });
      console.log(customerlist.length);
    });
  };

  Listofskintype = async () => {
    this.updateState({ is_loading: true });
    await this.props.SkinTypes().then(res => {
      console.log(res);
      let { skintype } = this.state;

      skintype = res;
      console.log(skintype);
      this.setState({
        skintype,
        is_loading: false,
      });
      console.log(skintype.length);
    });
  };

  Listoflanguage = async () => {
    this.updateState({ is_loading: true });
    await this.props.Languages().then(res => {
      console.log(res);
      let { languagelist } = this.state;

      languagelist = res;
      console.log(languagelist);
      this.setState({
        languagelist,
        is_loading: false,
      });
      console.log(languagelist.length);
    });
  };

  Listoflocation = async () => {
    this.updateState({ is_loading: true });
    await this.props.Locations().then(res => {
      console.log(res);
      let { locationlist } = this.state;

      locationlist = res;
      console.log(locationlist);
      this.setState({
        locationlist,
        is_loading: false,
      });
      console.log(locationlist.length);
    });
  };

  Listofgender = async () => {
    this.updateState({ is_loading: true });
    await this.props.Genders().then(res => {
      console.log(res);
      let { genderlist } = this.state;

      genderlist = res;
      console.log(genderlist);
      this.setState({
        genderlist,
        is_loading: false,
      });
      console.log(genderlist.length);
    });
  };

  racecontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  agecontent() {
    this.setState({
      iscustomertype: !this.state.iscustomertype,
    });
  }

  cusonecontenttwo() {
    this.setState({
      iscustomer1: !this.state.iscustomer1,
    });
  }

  custwocontenttwo() {
    this.setState({
      iscustomer2: !this.state.iscustomer2,
    });
  }

  custhreecontenttwo() {
    this.setState({
      iscustomer3: !this.state.iscustomer3,
    });
  }

  productgroupcontenttwo() {
    this.setState({
      isproductgroup: !this.state.isproductgroup,
    });
  }

  locationcontenttwo() {
    this.setState({
      islocation: !this.state.islocation,
    });
  }

  gendercontenttwo() {
    this.setState({
      isgender: !this.state.isgender,
    });
  }
  handleEdit(id, desc, active) {
    let { editid, editval, activeitem } = this.state;
    editid = id;
    editval = desc;
    activeitem = active;
    console.log(editid, editval);
    this.setState({
      editid,
      editval,
      activeitem,
    });
    this.aboutpopup();
  }

  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }

  finaldesc = async (id, desc) => {
    let { editval, newval, activeitem } = this.state;
    let descJson = {
      itmName: desc,
      itmIsactive: activeitem,
      itmCode: id,
    };
    await this.props
      .updateCommon(
        `Races/update?where=%7B%22itmCode%22%3A%20%22${id}%22%7D
   `,
        descJson
      )
      .then(data => {
        this.ListofRaces({});
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
        itmName: val,
        itmIsactive: true,
        itmCode: id,
      };
      await this.props
        .NewRaces(newreason)
        .then(data => {
          this.ListofRaces({});
        })
        .catch(e => console.log(e));
      this.newdescpopup();
      newval = "";
      this.setState({ newval });
    }
  };

  newdescpopup() {
    let { racelist, newid, te } = this.state;
    if (racelist.length > 0) {
      te = racelist[racelist.length - 1].itmCode;
      newid = Number(te) + 1;
    } else {
      newid = 1;
    }

    this.setState({
      isNewdescPopModal: !this.state.isNewdescPopModal,
      newid,
    });
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

  handleEditage(id, desc, code, active) {
    let { editidtwo, editvaltwo, agecode, activeitem } = this.state;
    editidtwo = id;
    editvaltwo = desc;
    agecode = code;
    activeitem = active;
    this.setState({
      editidtwo,
      editvaltwo,
      agecode,
      activeitem,
    });
    this.aboutpopupage();
  }

  aboutpopupage() {
    this.setState({
      isAboutPopModaltwo: !this.state.isAboutPopModaltwo,
    });
  }

  finalage = async (id, desc) => {
    let { editvaltwo, newvaltwo, agecode, activeitem } = this.state;
    let descJson = {
      itmDesc: desc,
      itmCode: agecode,
      ageCode: id,
      itmIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `Agegroups/update?where=%7B%22itmCode%22%3A%20%22${agecode}%22%7D
 `,
        descJson
      )
      .then(data => {
        this.Listofages({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupage();
    editvaltwo = "";
    newvaltwo = "";
    this.setState({ editvaltwo, newvaltwo });
  };

  createage = async (id, val, desc) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { newvaltwo } = this.state;
      console.log(id, val);
      let newreason = {
        itmDesc: desc,
        itmCode: id,
        ageCode: val,
        fage: 0,
        tage: 0,
        itmIsactive: true,
      };
      await this.props
        .NewAgegroups(newreason)
        .then(data => {
          this.Listofages({});
        })
        .catch(e => console.log(e));
      this.newdescpopupage();
      newvaltwo = "";
      this.setState({ newvaltwo });
    }
  };

  newdescpopupage() {
    let { agelist, newidtwo, te } = this.state;
    if (agelist.length > 0) {
      te = agelist[agelist.length - 1].itmCode;
      newidtwo = Number(te) + 1;
    } else {
      newidtwo = 1;
    }

    this.setState({
      isNewdescPopModalage: !this.state.isNewdescPopModalage,
      newidtwo,
    });
  }

  handleage = ({ target: { value, name } }) => {
    console.log(name);
    let { editvaltwo } = this.state;

    if ((name = "desc")) {
      editvaltwo = value;
      this.setState({ editvaltwo });
    }
  };

  newdescriptionvalage = ({ target: { value, name } }) => {
    let { newidtwo } = this.state;

    if ((name = "newid")) {
      newidtwo = value;
      this.setState({ newidtwo });
    }
  };

  newdescriptionage = ({ target: { value, name } }) => {
    let { newvaltwo, newvaldesc } = this.state;

    if ((name = "newdesval")) {
      newvaltwo = value;
      this.setState({ newvaltwo });
    }
    if ((name = "newvaldesc")) {
      newvaldesc = value;
      this.setState({ newvaldesc });
    }
  };

  handleEditskin(id, desc, active) {
    let { editskinid, editskinval, activeitem } = this.state;
    editskinid = id;
    editskinval = desc;
    activeitem = active;
    console.log(editskinid, editskinval);
    this.setState({
      editskinid,
      editskinval,
      activeitem,
    });
    this.aboutpopupskin();
  }

  aboutpopupskin() {
    this.setState({
      isAboutPopModalskin: !this.state.isAboutPopModalskin,
    });
  }

  finaldescskin = async (id, desc) => {
    let { editskinval, skinval, activeitem } = this.state;
    let descJson = {
      code: id,
      description: desc,
      isActive: activeitem,
    };
    await this.props
      .updateCommon(
        `SkinTypes/update?where=%7B%22code%22%3A${id}%7D
 `,
        descJson
      )
      .then(data => {
        this.Listofskintype({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupskin();
    editskinval = "";
    skinval = "";
    this.setState({ editskinval, skinval });
  };

  createdescskin = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { skinval } = this.state;
      console.log(id, val);
      let newreason = {
        code: id,
        description: val,
        isActive: true,
      };
      await this.props
        .NewSkinTypes(newreason)
        .then(data => {
          this.Listofskintype({});
        })
        .catch(e => console.log(e));
      this.newdescpopupskin();
      skinval = "";
      this.setState({ skinval });
    }
  };

  newdescpopupskin() {
    let { skintype, skinid, te } = this.state;
    if (skintype.length > 0) {
      te = skintype[skintype.length - 1].code;
      skinid = Number(te) + 1;
    } else {
      skinid = 1;
    }

    this.setState({
      isNewdescPopModalskin: !this.state.isNewdescPopModalskin,
      skinid,
    });
  }

  handledescskin = ({ target: { value, name } }) => {
    console.log(name);
    let { editskinval } = this.state;

    if ((name = "desc")) {
      editskinval = value;
      this.setState({ editskinval });
    }
  };

  newdescriptionvalskin = ({ target: { value, name } }) => {
    let { skinid } = this.state;

    if ((name = "newid")) {
      skinid = value;
      this.setState({ skinid });
    }
  };

  newdescriptionskin = ({ target: { value, name } }) => {
    let { skinval } = this.state;

    if ((name = "newdesval")) {
      skinval = value;
      this.setState({ skinval });
    }
  };

  handleEditlocation(id, desc, active) {
    let { editlocationid, editlocationval, activeitem } = this.state;
    editlocationid = id;
    editlocationval = desc;
    activeitem = active;
    console.log(editlocationid, editlocationval);
    this.setState({
      editlocationid,
      editlocationval,
      activeitem,
    });
    this.aboutpopuplocation();
  }

  aboutpopuplocation() {
    this.setState({
      isAboutPopModallocation: !this.state.isAboutPopModallocation,
    });
  }

  finaldesclocation = async (id, desc) => {
    let { editlocationval, locationval, activeitem } = this.state;
    let descJson = {
      locId: null,
      locName: desc,
      locAddress: null,
      locTel: null,
      locFax: null,
      locIsactive: activeitem,
      locCode: id,
      itmId: null,
    };
    await this.props
      .updateCommon(
        `Locations/update?where=%7B%22locCode%22%3A%20%22${id}%22%7D
 `,
        descJson
      )
      .then(data => {
        this.Listoflocation({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopuplocation();
    editlocationval = "";
    locationval = "";
    this.setState({ editlocationval, locationval });
  };

  createdesclocation = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { locationval } = this.state;
      console.log(id, val);
      let newreason = {
        locId: null,
        locName: val,
        locAddress: null,
        locTel: null,
        locFax: null,
        locIsactive: true,
        locCode: id,
        itmId: null,
      };
      await this.props
        .NewLocations(newreason)
        .then(data => {
          this.Listoflocation({});
        })
        .catch(e => console.log(e));
      this.newdescpopuplocation();
      locationval = "";
      this.setState({ locationval });
    }
  };

  newdescpopuplocation() {
    let { locationlist, locationid, te } = this.state;
    if (locationlist.length > 0) {
      te = locationlist[locationlist.length - 1].locCode;
      locationid = Number(te) + 1;
    } else {
      locationid = 1;
    }

    this.setState({
      isNewdescPopModallocation: !this.state.isNewdescPopModallocation,
      locationid,
    });
  }

  handledesclocation = ({ target: { value, name } }) => {
    console.log(name);
    let { editlocationval } = this.state;

    if ((name = "desc")) {
      editlocationval = value;
      this.setState({ editlocationval });
    }
  };

  newdescriptionvallocation = ({ target: { value, name } }) => {
    let { locationid } = this.state;

    if ((name = "newid")) {
      locationid = value;
      this.setState({ locationid });
    }
  };

  newdescriptionlocation = ({ target: { value, name } }) => {
    let { locationval } = this.state;

    if ((name = "newdesval")) {
      locationval = value;
      this.setState({ locationval });
    }
  };

  handleEditlanguage(id, desc, active) {
    let { editlanguageid, editlanguageval, activeitem } = this.state;
    editlanguageid = id;
    editlanguageval = desc;
    activeitem = active;
    console.log(editlanguageid, editlanguageval);
    this.setState({
      editlanguageid,
      editlanguageval,
      activeitem,
    });
    this.aboutpopuplanguage();
  }

  aboutpopuplanguage() {
    this.setState({
      isAboutPopModallanguage: !this.state.isAboutPopModallanguage,
    });
  }

  finaldesclanguage = async (id, desc) => {
    let { editlanguageval, languageval, activeitem } = this.state;
    let descJson = {
      itmCode: id,
      itmDesc: desc,
      itmIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `Languages/update?where=%7B%22itmCode%22%3A%20%22${id}%22%7D
 `,
        descJson
      )
      .then(data => {
        this.Listoflanguage({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopuplanguage();
    editlanguageval = "";
    languageval = "";
    this.setState({ editlanguageval, languageval });
  };

  createdesclanguage = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { languageval } = this.state;
      console.log(id, val);
      let newreason = {
        itmCode: id,
        itmDesc: val,
        itmIsactive: true,
      };
      await this.props
        .NewLanguages(newreason)
        .then(data => {
          this.Listoflanguage({});
        })
        .catch(e => console.log(e));
      this.newdescpopuplanguage();
      languageval = "";
      this.setState({ languageval });
    }
  };

  newdescpopuplanguage() {
    let { languagelist, languageid, te } = this.state;
    if (languagelist.length > 0) {
      te = languagelist[languagelist.length - 1].itmCode;
      languageid = Number(te) + 1;
    } else {
      languageid = 1;
    }

    this.setState({
      isNewdescPopModallanguage: !this.state.isNewdescPopModallanguage,
      languageid,
    });
  }

  handledesclanguage = ({ target: { value, name } }) => {
    console.log(name);
    let { editlanguageval } = this.state;

    if ((name = "desc")) {
      editlanguageval = value;
      this.setState({ editlanguageval });
    }
  };

  newdescriptionvallanguage = ({ target: { value, name } }) => {
    let { languageid } = this.state;

    if ((name = "newid")) {
      languageid = value;
      this.setState({ languageid });
    }
  };

  newdescriptionlanguage = ({ target: { value, name } }) => {
    let { languageval } = this.state;

    if ((name = "newdesval")) {
      languageval = value;
      this.setState({ languageval });
    }
  };

  handleEditgender(id, desc, active) {
    let { editgenderid, editgenderval, activeitem } = this.state;
    editgenderid = id;
    editgenderval = desc;
    activeitem = active;
    console.log(editgenderid, editgenderval);
    this.setState({
      editgenderid,
      editgenderval,
      activeitem,
    });
    this.aboutpopupgender();
  }

  aboutpopupgender() {
    this.setState({
      isAboutPopModalgender: !this.state.isAboutPopModalgender,
    });
  }

  finaldescgender = async (id, desc) => {
    let { editgenderval, genderval, activeitem } = this.state;
    let descJson = {
      itmName: desc,
      itmIsactive: activeitem,
      itmCode: id,
    };
    await this.props
      .updateCommon(
        `Genders/update?where=%7B%22itmCode%22%3A%20${id}%7D
 `,
        descJson
      )
      .then(data => {
        this.Listofgender({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupgender();
    editgenderval = "";
    genderval = "";
    this.setState({ editgenderval, genderval });
  };

  createdescgender = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { genderval } = this.state;
      console.log(id, val);
      let newreason = {
        itmCode: id,
        itmName: val,
        itmIsactive: true,
      };
      await this.props
        .NewGenders(newreason)
        .then(data => {
          this.Listofgender({});
        })
        .catch(e => console.log(e));
      this.newdescpopupgender();
      genderval = "";
      this.setState({ genderval });
    }
  };

  newdescpopupgender() {
    let { genderlist, genderid, te } = this.state;
    if (genderlist.length > 0) {
      te = genderlist[genderlist.length - 1].itmCode;
      genderid = Number(te) + 1;
    } else {
      genderid = 1;
    }

    this.setState({
      isNewdescPopModalgender: !this.state.isNewdescPopModalgender,
      genderid,
    });
  }

  handledescgender = ({ target: { value, name } }) => {
    console.log(name);
    let { editgenderval } = this.state;

    if ((name = "desc")) {
      editgenderval = value;
      this.setState({ editgenderval });
    }
  };

  newdescriptionvalgender = ({ target: { value, name } }) => {
    let { genderid } = this.state;

    if ((name = "newid")) {
      genderid = value;
      this.setState({ genderid });
    }
  };

  newdescriptiongender = ({ target: { value, name } }) => {
    let { genderval } = this.state;

    if ((name = "newdesval")) {
      genderval = value;
      this.setState({ genderval });
    }
  };

  handlecheckbox = async item => {
    let { racelist } = this.state;
    for (let i = 0; i <= racelist.length - 1; i++) {
      if (racelist[i].itmCode == item) {
        racelist[i].itmIsactive = !racelist[i].itmIsactive;
        let descJson = {
          itmName: racelist[i].itmName,
          itmIsactive: racelist[i].itmIsactive,
          itmCode: racelist[i].itmCode,
        };
        await this.props
          .updateCommon(
            `Races/update?where=%7B%22itmCode%22%3A%20%22${item}%22%7D
   `,
            descJson
          )
          .then(data => {
            this.ListofRaces({});
          });
      }
    }
  };

  handlecheckboxone = async item => {
    let { agelist } = this.state;
    for (let i = 0; i <= agelist.length - 1; i++) {
      if (agelist[i].itmCode == item) {
        agelist[i].itmIsactive = !agelist[i].itmIsactive;
        let descJson = {
          itmDesc: agelist[i].itmDesc,
          itmCode: agelist[i].itmCode,
          ageCode: agelist[i].ageCode,
          itmIsactive: agelist[i].itmIsactive,
        };
        await this.props
          .updateCommon(
            `Agegroups/update?where=%7B%22itmCode%22%3A%20%22${item}%22%7D
 `,
            descJson
          )
          .then(data => {
            this.Listofages({});
          });
      }
    }
  };

  handlecheckboxtwo = async item => {
    let { skintype } = this.state;
    for (let i = 0; i <= skintype.length - 1; i++) {
      if (skintype[i].code == item) {
        skintype[i].isActive = !skintype[i].isActive;
        let descJson = {
          code: skintype[i].code,
          description: skintype[i].description,
          isActive: skintype[i].isActive,
        };
        await this.props
          .updateCommon(
            `SkinTypes/update?where=%7B%22code%22%3A%20%22${item}%22%7D
 `,
            descJson
          )
          .then(data => {
            this.Listofskintype({});
          });
      }
    }
  };

  handlecheckboxthree = async item => {
    let { languagelist } = this.state;
    for (let i = 0; i <= languagelist.length - 1; i++) {
      if (languagelist[i].itmCode == item) {
        languagelist[i].itmIsactive = !languagelist[i].itmIsactive;
        let descJson = {
          itmCode: languagelist[i].itmCode,
          itmDesc: languagelist[i].itmDesc,
          itmIsactive: languagelist[i].itmIsactive,
        };
        await this.props
          .updateCommon(
            `Languages/update?where=%7B%22itmCode%22%3A%20%22${item}%22%7D
 `,
            descJson
          )
          .then(data => {
            this.Listoflanguage({});
          });
      }
    }
    this.setState({ languagelist });
  };

  handlecheckboxfour = async item => {
    let { locationlist } = this.state;
    for (let i = 0; i <= locationlist.length - 1; i++) {
      if (locationlist[i].locCode == item) {
        locationlist[i].locIsactive = !locationlist[i].locIsactive;
        let descJson = {
          locId: locationlist[i].locId,
          locName: locationlist[i].locName,
          locAddress: locationlist[i].locAddress,
          locTel: locationlist[i].locTel,
          locFax: locationlist[i].locFax,
          locIsactive: locationlist[i].locIsactive,
          locCode: locationlist[i].locCode,
          itmId: locationlist[i].itmId,
        };
        await this.props
          .updateCommon(
            `Locations/update?where=%7B%22locCode%22%3A%20%22${item}%22%7D
 `,
            descJson
          )
          .then(data => {
            this.Listoflocation({});
          });
      }
    }
  };

  handlecheckboxfive = async item => {
    let { genderlist } = this.state;
    for (let i = 0; i <= genderlist.length - 1; i++) {
      if (genderlist[i].itmCode == item) {
        genderlist[i].itmIsactive = !genderlist[i].itmIsactive;
        let descJson = {
          itmName: genderlist[i].itmName,
          itmIsactive: genderlist[i].itmIsactive,
          itmCode: genderlist[i].itmCode,
        };
        await this.props
          .updateCommon(
            `Genders/update?where=%7B%22itmCode%22%3A%20%22${item}%22%7D
 `,
            descJson
          )
          .then(data => {
            this.Listofgender({});
          });
      }
    }
  };
  render() {
    let {
      customerDetails,
      pageMeta,
      staffList,
      is_loading,
      iscreation,
      iscustomer1,
      iscustomer2,
      isAboutPopModal,
      isNewdescPopModal,
      iscustomer3,
      isproductgroup,
      newvaldesc,
      iscustomertype,
      customertypeDetails,
      isgender,
      islocation,
      racelist,
      newid,
      newval,
      editid,
      editval,
      agelist,
      newidtwo,
      newvaltwo,
      editidtwo,
      editvaltwo,
      isAboutPopModaltwo,
      isNewdescPopModalage,
      customerlist,
      skintype,
      languagelist,
      commontable,
      locationlist,
      genderlist,
      skinid,
      skinval,
      editskinid,
      editskinval,
      isAboutPopModalskin,
      isNewdescPopModalskin,
      locationid,
      locationval,
      editlocationid,
      editlocationval,
      isAboutPopModallocation,
      isNewdescPopModallocation,
      languageid,
      languageval,
      editlanguageid,
      editlanguageval,
      isAboutPopModallanguage,
      isNewdescPopModallanguage,
      genderid,
      genderval,
      editgenderid,
      editgenderval,
      isAboutPopModalgender,
      isNewdescPopModalgender,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid tax">
          <h4>{t("Customer Master")}</h4>
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup"
            onClick={() => this.racecontent()}
          >
            <p>{t("Race")}</p>
            <div className="icons">
              {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscreation == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Race")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={commontable}>
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
                        ) : racelist.length > 0 ? (
                          racelist.map(
                            ({ itmCode, itmName, itmIsactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itmName}</div>
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
                                          this.handleEdit(
                                            itmCode,
                                            itmName,
                                            itmIsactive
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
              <div className="mt-3" style={{ width: 100 }}>
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
            onClick={() => this.agecontent()}
          >
            <p>{t("Age Group")}</p>
            <div className="icons">
              {iscustomertype == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomertype == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Age Group")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={customerDetails}>
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
                        ) : agelist.length > 0 ? (
                          agelist.map(
                            (
                              { itmCode, ageCode, itmDesc, itmIsactive },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">{ageCode}</div>
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
                                          this.handleEditage(
                                            ageCode,
                                            itmDesc,
                                            itmCode,
                                            itmIsactive
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
              <div className="mt-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopupage()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.cusonecontenttwo()}
          >
            <p>{t("Corporate Customer")}</p>
            <div className="icons">
              {iscustomer1 == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomer1 == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Corporate Customer")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={customertypeDetails}>
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
                        ) : customerlist.length > 0 ? (
                          customerlist.map(
                            ({ code, name, isactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-right text-success"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/Corporate_Customerid/${code}`
                                        )
                                      }
                                    >
                                      {code}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{name}</div>
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
              <div
                className="icon"
                onClick={() =>
                  this.props.history.push(
                    `/admin/backend/customermaster/Corporatedetails`
                  )
                }
              >
                +
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.custwocontenttwo()}
          >
            <p>{t("Skin Type")}</p>
            <div className="icons">
              {iscustomer2 == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomer2 == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Skin Type")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={commontable}>
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
                        ) : skintype.length > 0 ? (
                          skintype.map(
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
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={isActive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxtwo(code)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditskin(
                                            code,
                                            description,
                                            isActive
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
              <div className="mt-3 ml-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopupskin()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.custhreecontenttwo()}
          >
            <p>{t("Language")}</p>
            <div className="icons">
              {iscustomer3 == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomer3 == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Language")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={commontable}>
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
                        ) : languagelist.length > 0 ? (
                          languagelist.map(
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
                                          this.handlecheckboxthree(itmCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditlanguage(
                                            itmCode,
                                            itmDesc,
                                            itmIsactive
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
              <div className="mt-3 ml-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopuplanguage()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.locationcontenttwo()}
          >
            <p>{t("Location")}</p>
            <div className="icons">
              {islocation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islocation == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Location")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={commontable}>
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
                        ) : locationlist.length > 0 ? (
                          locationlist.map(
                            ({ locCode, locName, locIsactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{locCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{locName}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={locIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxfour(locCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditlocation(
                                            locCode,
                                            locName,
                                            locIsactive
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
              <div className="mt-3 ml-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopuplocation()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.gendercontenttwo()}
          >
            <p>{t("Gender")}</p>
            <div className="icons">
              {isgender == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {isgender == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Gender")}</p>
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper headerDetails={commontable}>
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
                        ) : genderlist.length > 0 ? (
                          genderlist.map(
                            ({ itmCode, itmName, itmIsactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{itmCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{itmName}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={itmIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxfive(itmCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditgender(
                                            itmCode,
                                            itmName,
                                            itmIsactive
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
              <div className="mt-3 ml-3" style={{ width: 100 }}>
                <NormalButton
                  mainbg={true}
                  label={"Add Row"}
                  onClick={() => this.newdescpopupgender()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        {/*RACESSSSSS*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModal}
          handleModal={() => this.aboutpopup()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT RACES </h5>
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
              <h5> ADD Races </h5>
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

        {/*AGESSSS*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModaltwo}
          handleModal={() => this.aboutpopupage()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT RACES </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupage()}
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
                <NormalInput value={editidtwo} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editvaltwo}
                  name="desc"
                  onChange={this.handleage}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupage()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.finalage(editidtwo, editvaltwo)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModalage}
          handleModal={() => this.newdescpopupage()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD Ages </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupage()}
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
                  disabled={true}
                  onChange={this.newdescriptionvalage}
                />
              </div>
              <div className="mt-2">
                <p>Age code</p>
                <NormalInput
                  value={newvaltwo}
                  name="newdesval"
                  onChange={this.newdescriptionage}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={newvaldesc}
                  name="newvaldesc"
                  onChange={this.newdescriptionage}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupage()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.createage(newidtwo, newvaltwo, newvaldesc)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        {/*SKINNNNN*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModalskin}
          handleModal={() => this.aboutpopupskin()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT SKINTYPE </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupskin()}
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
                <NormalInput value={editskinid} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editskinval}
                  name="desc"
                  onChange={this.handledescskin}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupskin()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.finaldescskin(editskinid, editskinval)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModalskin}
          handleModal={() => this.newdescpopupskin()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD SKINTYPE </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupskin()}
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
                  value={skinid}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvalskin}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={skinval}
                  name="newdesval"
                  onChange={this.newdescriptionskin}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupskin()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdescskin(skinid, skinval)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        {/*LOcation*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModallocation}
          handleModal={() => this.aboutpopuplocation()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT LOCATION </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopuplocation()}
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
                <NormalInput value={editlocationid} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editlocationval}
                  name="desc"
                  onChange={this.handledesclocation}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopuplocation()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldesclocation(editlocationid, editlocationval)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModallocation}
          handleModal={() => this.newdescpopuplocation()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD LOCATION </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopuplocation()}
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
                  value={locationid}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvallocation}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={locationval}
                  name="newdesval"
                  onChange={this.newdescriptionlocation}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopuplocation()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.createdesclocation(locationid, locationval)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        {/*Language*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModallanguage}
          handleModal={() => this.aboutpopuplanguage()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT LANGUAGE </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopuplanguage()}
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
                <NormalInput value={editlanguageid} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editlanguageval}
                  name="desc"
                  onChange={this.handledesclanguage}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopuplanguage()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldesclanguage(editlanguageid, editlanguageval)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModallanguage}
          handleModal={() => this.newdescpopuplanguage()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD LANGUAGE </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopuplanguage()}
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
                  value={languageid}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvallanguage}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={languageval}
                  name="newdesval"
                  onChange={this.newdescriptionlanguage}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopuplanguage()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.createdesclanguage(languageid, languageval)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        {/*Gender*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModalgender}
          handleModal={() => this.aboutpopupgender()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT Gender </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupgender()}
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
                <NormalInput value={editgenderid} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editgenderval}
                  name="desc"
                  onChange={this.handledescgender}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupgender()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldescgender(editgenderid, editgenderval)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isNewdescPopModalgender}
          handleModal={() => this.newdescpopupgender()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD Gender</h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupgender()}
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
                  value={genderid}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvalgender}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={genderval}
                  name="newdesval"
                  onChange={this.newdescriptiongender}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupgender()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdescgender(genderid, genderval)}
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
      Races,
      NewRaces,
      updateCommon,
      Agegroups,
      NewAgegroups,
      Corporatecustomers,
      NewCorporatecustomers,
      SkinTypes,
      NewSkinTypes,
      Languages,
      NewLanguages,
      Locations,
      NewLocations,
      NewGenders,
      Genders,
    },
    dispatch
  );
};

export const Customermastertwo = withTranslation()(
  connect(null, mapDispatchToProps)(CustomermastertwoClass)
);
