import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  NormalSelect,
  NormalCheckbox,
  NormalInput,
  NormalModal,
  NormalTextarea,
  InputSearch,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  SiteGroups,
  NewSiteGroups,
  ItemSitelists,
  NewItemSitelists,
  Cities,
  States,
  Countries,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";

export class OutletmasterClass extends Component {
  state = {
    SiteDetails: [
      {
        label: "Code",
        sortKey: "itemsiteCode",
        enabled: true,
        id: "itemsiteCode",
        singleClickFunc: () => this.handleSortsecond("itemsiteCode"),
      },
      {
        label: "Name",
        sortKey: "itemsiteDesc",
        enabled: true,
        id: "itemsiteDesc",
        singleClickFunc: () => this.handleSortsecond("itemsiteDesc"),
      },
    ],
    SitegroupDetails: [
      {
        label: "Code",
        divClass: "justify-content-end",
        sortKey: "code",
        enabled: true,
        id: "code",
        singleClickFunc: () => this.handleSort("code"),
      },
      {
        label: "Name",
        sortKey: "description",
        enabled: true,
        id: "description",
        singleClickFunc: () => this.handleSort("description"),
      },
      {
        label: "Active",
        sortKey: "isActive",
        enabled: true,
        id: "isActive",
        singleClickFunc: () => this.handleSort("isActive"),
      },
      { label: "Action", divClass: "justify-content-center" },
    ],
    isoption: false,
    iscreation: false,
    islist: false,
    islisttwo: false,
    staffList: [],
    Site_list: [],
    code: null,
    desc: null,
    option: [
      { label: 10, value: 10 },
      { label: 25, value: 25 },
      { label: 50, value: 50 },
      { label: 100, value: 100 },
    ],
    city: [],
    country: [],
    state: [],
    site_group: [],
    address: "",
    email: "",
    fax: "",
    phoneone: "",
    phonetwo: "",
    ac_code: "",
    checked: true,
    gst: true,
    post_code: "",
    cityval: "",
    stateval: "",
    countryval: "",
    cityid: "",
    stateid: "",
    countryid: "",
    site_groupval: "",
    isAboutPopModal: false,
    isNewdescPopModal: false,
    newid: "",
    newval: "",
    editid: "",
    editval: "",
    search: "",
    filterdata: [],
    searchone: "",
    filterdataone: [],
    addressedit: "",
    emailedit: "",
    faxedit: "",
    phoneoneedit: "",
    phonetwoedit: "",
    ac_codeedit: "",
    checkededit: true,
    gstedit: true,
    post_codeedit: "",
    cityvaledit: "",
    statevaledit: "",
    countryvaledit: "",
    codeedit: "",
    descedit: "",
    site_groupvaledit: "",
    edit: false,
  };

  sitecontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  listcontent() {
    this.setState({
      islist: !this.state.islist,
    });
  }

  groupcontent() {
    this.setState({
      islisttwo: !this.state.islisttwo,
    });
  }

  //Sorting

  handleSort = (sortkey, order) => {
    let { staffList, headerDetails, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });
    console.log("che");
    if (orderBy === "asc") {
      staffList.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      staffList.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      staffList,
    });
  };

  //Sorting

  handleSortsecond = (sortkey, order) => {
    let { Site_list, headerDetails, orderBy } = this.state;
    this.setState({
      orderBy: this.state.orderBy == "asc" ? "desc" : "asc",
    });
    console.log("che");
    if (orderBy === "asc") {
      Site_list.sort((a, b) =>
        a[sortkey] > b[sortkey] ? 1 : b[sortkey] > a[sortkey] ? -1 : 0
      );
    } else {
      Site_list.sort((a, b) =>
        a[sortkey] < b[sortkey] ? 1 : b[sortkey] < a[sortkey] ? -1 : 0
      );
    }
    this.setState({
      Site_list,
    });
  };
  componentDidMount = () => {
    this.Listofsitegroup({});
    this.Listofsitelist({});
    this.Listofcities({});
    this.Listofstates({});
    this.Listofcountry({});
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

  Listofcities = async () => {
    let { city } = this.state;
    city = [];
    await this.props.Cities().then(res => {
      for (let key of res) {
        city.push({ value: key.itmCode, label: key.itmDesc, id: key.itmId });
      }
      console.log(city);
      this.setState({
        city,
      });
      console.log(city.length);
    });
  };

  Listofstates = async () => {
    let { state } = this.state;
    state = [];
    await this.props.States().then(res => {
      for (let key of res) {
        state.push({ value: key.itmCode, label: key.itmDesc, id: key.itmId });
      }
      console.log(state);
      this.setState({
        state,
      });
      console.log(state.length);
    });
  };

  Listofcountry = async () => {
    let { country } = this.state;
    country = [];
    await this.props.Countries().then(res => {
      for (let key of res) {
        country.push({ value: key.itmCode, label: key.itmDesc, id: key.itmId });
      }
      console.log(country);
      this.setState({
        country,
      });
      console.log(country.length);
    });
  };

  Listofsitelist = async () => {
    this.updateState({ is_loading: true });
    await this.props.ItemSitelists().then(res => {
      console.log(res);
      let { Site_list } = this.state;

      Site_list = res;
      console.log(Site_list);
      this.setState({
        Site_list,
        is_loading: false,
      });
      console.log(Site_list.length);
    });
  };

  Listofsitegroup = async () => {
    this.updateState({ is_loading: true });
    await this.props.SiteGroups().then(res => {
      console.log(res);
      let { staffList, site_group, newid } = this.state;
      for (let key of res) {
        site_group.push({ value: key.code, label: key.description });
      }

      staffList = res;
      if (res.length > 0) {
        newid = res[res.length - 1].code;
        newid = Number(newid) + 1;
      } else {
        newid = 100001;
      }
      console.log(staffList);
      this.setState({
        staffList,
        site_group,
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
    let { editval, newval, newid } = this.state;
    let descJson = {
      code: id,
      description: desc,
      isActive: true,
      isDelete: true,
    };
    await this.props
      .updateCommon(
        `SiteGroups/update?where=%7B%22code%22%3A${id}%7D
    `,
        descJson
      )
      .then(data => {
        this.Listofsitegroup({});
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
    console.log(id, val);
    if (val == "") {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newreason = {
        code: id,
        description: val,
        isActive: true,
        isDelete: true,
      };
      await this.props
        .NewSiteGroups(newreason)
        .then(data => {
          this.Listofsitegroup({});
        })
        .catch(e => console.log(e));
      this.newdescpopup();
    }
  };

  createsitelist = async () => {
    let {
      code,
      desc,
      count,
      post_code,
      address,
      email,
      fax,
      phoneone,
      phonetwo,
      ac_code,
      checked,
      gst,
      cityval,
      stateval,
      countryval,
      site_groupval,
    } = this.state;
    if (code == null || desc == null) {
      Toast({
        type: "error",
        message: "Please check rquired field",
      });
    } else {
      let newreason = {
        siteGroupIdId: 1,
        itemSiteCityIdId: this.state.cityid,
        itemSiteCountryIdId: this.state.countryid,
        itemSiteStateIdId: this.state.stateid,
        itemSiteUserIdId: 253,
        itemsiteCode: code,
        itemsiteDesc: desc,
        itemsiteType: "",
        itemPurchasedept: "",
        itemsiteAddress: address,
        itemsitePostcode: post_code,
        itemsiteCity: cityval,
        itemsiteState: stateval,
        itemsiteCountry: countryval,
        itemsitePhone1: phoneone,
        itemsitePhone2: phonetwo,
        itemsiteFax: fax,
        itemsiteEmail: email,
        itemsiteUser: "sys",
        itemsiteDate: new Date(),
        itemsiteTime: new Date(),
        itemsiteIsactive: checked,
        itemsiteRefcode: "",
        siteGroup: site_groupval,
        siteIsGst: gst,
        accountCode: ac_code,
        ratings: "",
        picPath: "",
        qrcode: "",
        systemlogMdplUpdate: false,
        sitedbconnectionurl: "",
      };
      await this.props
        .NewItemSitelists(newreason)
        .then(data => {
          this.Listofsitelist({});
        })
        .catch(e => console.log(e));
      //  this.newdescpopup();
    }
  };

  updatesitelist = async () => {
    let {
      codeedit,
      descedit,
      count,
      post_codeedit,
      addressedit,
      emailedit,
      faxedit,
      phoneoneedit,
      phonetwoedit,
      ac_codeedit,
      checkededit,
      gstedit,
      cityvaledit,
      statevaledit,
      countryvaledit,
      site_groupvaledit,
    } = this.state;
    if (codeedit == null || descedit == null) {
      Toast({
        type: "error",
        message: "Please check rquired field",
      });
    } else {
      let newreason = {
        siteGroupIdId: 1,
        itemSiteCityIdId: this.state.cityid,
        itemSiteCountryIdId: this.state.countryid,
        itemSiteStateIdId: this.state.stateid,
        itemSiteUserIdId: 253,
        itemsiteCode: codeedit,
        itemsiteDesc: descedit,
        itemsiteType: "",
        itemPurchasedept: "",
        itemsiteAddress: addressedit,
        itemsitePostcode: post_codeedit,
        itemsiteCity: cityvaledit,
        itemsiteState: statevaledit,
        itemsiteCountry: countryvaledit,
        itemsitePhone1: phoneoneedit,
        itemsitePhone2: phonetwoedit,
        itemsiteFax: faxedit,
        itemsiteEmail: emailedit,
        itemsiteUser: "sys",
        itemsiteDate: new Date(),
        itemsiteTime: new Date(),
        itemsiteIsactive: checkededit,
        itemsiteRefcode: "",
        siteGroup: site_groupvaledit,
        siteIsGst: gstedit,
        accountCode: ac_codeedit,
        ratings: "",
        picPath: "",
        qrcode: "",
        systemlogMdplUpdate: false,
        sitedbconnectionurl: "",
      };
      await this.props;
      updateCommon(
        `ItemSitelists/update?where=%7B%22itemsiteCode%22%3A${codeedit}%7D
  `,
        newreason
      )
        .then(data => {
          this.Listofsitelist({});
        })
        .catch(e => console.log(e));
      //  this.newdescpopup();
    }
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      code,
      desc,
      count,
      post_code,
      stateid,
      state,
      country,
      countryid,
      address,
      email,
      fax,
      phoneone,
      phonetwo,
      ac_code,
      checked,
      gst,
      cityval,
      stateval,
      countryval,
      site_groupval,
      city,
      cityid,
      codeedit,
      descedit,
      post_codeedit,
      statevaledit,
      countryvaledit,
      addressedit,
      emailedit,
      faxedit,
      phoneoneedit,
      phonetwoedit,
      ac_codeedit,
      checkededit,
      gstedit,
      cityvaledit,
      site_groupvaledit,
      countedit,
    } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "count") {
      count = value;
      this.setState({ count });
    }
    if (name == "post_code") {
      post_code = value;
      this.setState({ post_code });
    }
    if (name == "address") {
      address = value;
      this.setState({ address });
    }
    if (name == "email") {
      email = value;
      this.setState({ email });
    }
    if (name == "fax") {
      fax = value;
      this.setState({ fax });
    }
    if (name == "phoneone") {
      phoneone = value;
      this.setState({ phoneone });
    }
    if (name == "phonetwo") {
      phonetwo = value;
      this.setState({ phonetwo });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
    if (name == "ac_code") {
      ac_code = value;
      this.setState({ ac_code });
    }
    if (name == "gst") {
      gst = value;
      this.setState({ gst });
    }
    if (name == "city") {
      cityval = value;
      this.setState({ cityval });
      for (let key of city) {
        if (key.value == cityval) {
          cityid = key.id;
        }
      }
      this.setState({ cityid });
    }
    if (name == "state") {
      stateval = value;
      this.setState({ stateval });
      console.log(stateval);
      for (let key of state) {
        if (key.value == stateval) {
          stateid = key.id;
        }
      }
      this.setState({ stateid });
      console.log(stateid);
    }
    if (name == "country") {
      countryval = value;
      this.setState({ countryval });
      console.log(countryval);
      for (let key of country) {
        if (key.value == countryval) {
          countryid = key.id;
        }
      }
      this.setState({ countryid });
      console.log(countryid);
    }
    if (name == "site_group") {
      site_groupval = value;
      this.setState({ site_groupval });
    }

    if (name == "codeedit") {
      codeedit = value;
      this.setState({ codeedit });
    }
    if (name == "descedit") {
      descedit = value;
      this.setState({ descedit });
    }
    if (name == "countedit") {
      countedit = value;
      this.setState({ countedit });
    }
    if (name == "post_codeedit") {
      post_codeedit = value;
      this.setState({ post_codeedit });
    }
    if (name == "addressedit") {
      addressedit = value;
      this.setState({ addressedit });
    }
    if (name == "emailedit") {
      emailedit = value;
      this.setState({ emailedit });
    }
    if (name == "faxedit") {
      faxedit = value;
      this.setState({ faxedit });
    }
    if (name == "phoneoneedit") {
      phoneoneedit = value;
      this.setState({ phoneoneedit });
    }
    if (name == "phonetwoedit") {
      phonetwoedit = value;
      this.setState({ phonetwoedit });
    }
    if (name == "checkededit") {
      checkededit = value;
      this.setState({ checkededit });
    }
    if (name == "ac_codeedit") {
      ac_codeedit = value;
      this.setState({ ac_codeedit });
    }
    if (name == "gstedit") {
      gstedit = value;
      this.setState({ gstedit });
    }
    if (name == "cityvaledit") {
      cityvaledit = value;
      this.setState({ cityvaledit });
      for (let key of city) {
        if (key.value == cityvaledit) {
          cityid = key.id;
        }
      }
      this.setState({ cityid });
    }
    if (name == "statevaledit") {
      statevaledit = value;
      this.setState({ statevaledit });
      console.log(statevaledit);
      for (let key of state) {
        if (key.value == statevaledit) {
          stateid = key.id;
        }
      }
      this.setState({ stateid });
      console.log(stateid);
    }
    if (name == "countryvaledit") {
      countryvaledit = value;
      this.setState({ countryvaledit });
      console.log(countryvaledit);
      for (let key of country) {
        if (key.value == countryvaledit) {
          countryid = key.id;
        }
      }
      this.setState({ countryid });
      console.log(countryid);
    }
    if (name == "site_groupvaledit") {
      site_groupvaledit = value;
      this.setState({ site_groupvaledit });
    }
  };

  handlecheckbox = async item => {
    let { staffList } = this.state;
    for (let i = 0; i <= staffList.length - 1; i++) {
      if (staffList[i].code == item) {
        staffList[i].isActive = !staffList[i].isActive;
        let descJson = {
          code: staffList[i].code,
          description: staffList[i].description,
          isActive: staffList[i].isActive,
          isDelete: true,
        };
        await this.props
          .updateCommon(
            `SiteGroups/update?where=%7B%22code%22%3A${item}%7D
    `,
            descJson
          )
          .then(data => {
            this.Listofsitegroup({});
          });
      }
    }
  };

  //************Searching option **********//
  filterByName = ({ target: { value, name } }) => {
    console.log(value, name);
    let { staffList, filterdata, search } = this.state;
    if (name == "search") {
      search = value;
      this.setState({ search });
      console.log(search);
    }
    if (search !== "") {
      filterdata = staffList.filter(item => {
        console.log(
          Object.values(item)
            .join("")
            .toLowerCase()
            .includes(search.toLowerCase())
        );
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      this.setState({ filterdata });
    }

    console.log(filterdata);
  };

  //************Searching option **********//
  filterBysite = ({ target: { value, name } }) => {
    console.log(value, name);
    let { Site_list, filterdataone, searchone } = this.state;
    if (name == "search") {
      searchone = value;
      this.setState({ searchone });
    }
    if (searchone !== "") {
      filterdataone = Site_list.filter(item => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchone.toLowerCase());
      });
    }
    this.setState({ filterdataone });
    console.log(filterdataone);
  };

  handleedit = async itemcode => {
    let {
      edit,
      addressedit,
      emailedit,
      faxedit,
      phoneoneedit,
      phonetwoedit,
      ac_codeedit,
      checkededit,
      gstedit,
      post_codeedit,
      cityvaledit,
      statevaledit,
      countryvaledit,
      codeedit,
      descedit,
      site_groupvaledit,
      temp,
    } = this.state;
    edit = true;
    this.setState({ edit });
    console.log(edit);
    await this.props.ItemSitelists().then(res => {
      console.log(res);

      let objIndex = res.findIndex(obj => obj.itemsiteCode == itemcode);
      temp = res[objIndex];
      this.setState({
        temp,
      });
      addressedit = temp.itemsiteAddress;
      emailedit = temp.itemsiteEmail;
      faxedit = temp.itemsiteFax;
      phoneoneedit = temp.itemsitePhone1;
      phonetwoedit = temp.itemsitePhone2;
      ac_codeedit = temp.accountCode;
      checkededit = temp.itemsiteIsactive;
      gstedit = temp.siteIsGst;
      post_codeedit = temp.itemsitePostcode;
      cityvaledit = temp.itemsiteCity;
      statevaledit = temp.itemsiteState;
      countryvaledit = temp.itemsiteCountry;
      codeedit = temp.itemsiteCode;
      descedit = temp.itemsiteDesc;
      site_groupvaledit = temp.siteGroup;
      this.setState({
        addressedit,
        emailedit,
        faxedit,
        phoneoneedit,
        phonetwoedit,
        ac_codeedit,
        checkededit,
        gstedit,
        post_codeedit,
        cityvaledit,
        statevaledit,
        countryvaledit,
        codeedit,
        descedit,
        site_groupvaledit,
      });
    });
    this.sitecontent();
  };
  handleupdates = async () => {
    let {
      edit,
      addressedit,
      emailedit,
      faxedit,
      phoneoneedit,
      phonetwoedit,
      ac_codeedit,
      checkededit,
      gstedit,
      post_codeedit,
      cityvaledit,
      statevaledit,
      countryvaledit,
      codeedit,
      descedit,
      site_groupvaledit,
    } = this.state;
    let descJson = {
      siteGroupIdId: 0,
      itemSiteCityIdId: this.state.cityid,
      itemSiteCountryIdId: this.state.countryid,
      itemSiteStateIdId: this.state.stateid,
      itemSiteUserIdId: 253,
      itemsiteCode: codeedit,
      itemsiteDesc: descedit,
      itemsiteType: "",
      itemPurchasedept: "",
      itemsiteAddress: addressedit,
      itemsitePostcode: post_codeedit,
      itemsiteCity: cityvaledit,
      itemsiteState: statevaledit,
      itemsiteCountry: countryvaledit,
      itemsitePhone1: phoneoneedit,
      itemsitePhone2: phonetwoedit,
      itemsiteFax: faxedit,
      itemsiteEmail: emailedit,
      itemsiteUser: "sys",
      itemsiteDate: new Date(),
      itemsiteTime: new Date(),
      itemsiteIsactive: checkededit,
      itemsiteRefcode: "",
      siteGroup: site_groupvaledit,
      siteIsGst: gstedit,
      accountCode: ac_codeedit,
      ratings: "",
      picPath: "",
      qrcode: "",
      systemlogMdplUpdate: false,
      sitedbconnectionurl: "",
    };
    await this.props
      .updateCommon(
        `ItemSitelists/update?where=%7B%22itemsiteCode%22%3A%20%22${this.state.codeedit}%22%7D
          `,
        descJson
      )
      .then(data => {
        this.Listofsitelist({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.sitecontent();
  };

  render() {
    let {
      SiteDetails,
      pageMeta,
      staffList,
      is_loading,
      code,
      desc,
      iscreation,
      islist,
      islisttwo,
      SitegroupDetails,
      Site_list,
      post_code,
      address,
      email,
      fax,
      phoneone,
      phonetwo,
      ac_code,
      checked,
      gst,
      city,
      country,
      state,
      cityval,
      stateval,
      countryval,
      site_groupval,
      site_group,
      isAboutPopModal,
      isNewdescPopModal,
      newid,
      newval,
      editid,
      editval,
      search,
      filterdata,
      searchone,
      filterdataone,
      addressedit,
      emailedit,
      faxedit,
      phoneoneedit,
      phonetwoedit,
      ac_codeedit,
      checkededit,
      gstedit,
      post_codeedit,
      cityvaledit,
      statevaledit,
      countryvaledit,
      codeedit,
      descedit,
      edit,
      site_groupvaledit,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid tax">
          <h4>{t("Outlet Master")}</h4>
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup"
            onClick={() => this.sitecontent()}
          >
            <p>{t("Site Creation")}</p>
            <div className="icons">
              {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {edit == false ? (
            <>
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Site Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={code}
                            name="code"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Site Desc")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={desc}
                            name="desc"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("City")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={city}
                            value={cityval}
                            onChange={this.temp}
                            name="city"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("State")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={state}
                            value={stateval}
                            onChange={this.temp}
                            name="state"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Country")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={country}
                            value={countryval}
                            onChange={this.temp}
                            name="country"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("PostCode")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={post_code}
                            name="post_code"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Address")}</p>
                        <div className="input-group">
                          <NormalTextarea
                            onChange={this.temp}
                            value={address}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("E-Mail")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={email}
                            name="email"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Fax")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={fax}
                            name="fax"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Phone 1")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={phoneone}
                            type="tel"
                            name="phoneone"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Phone 2")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={phonetwo}
                            type="tel"
                            name="phonetwo"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Site Group")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={site_group}
                            value={site_groupval}
                            onChange={this.temp}
                            name="site_group"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Account Code")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={ac_code}
                            name="ac_code"
                            onChange={this.temp}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            name="gst"
                            checked={gst}
                            onChange={this.temp}
                          />
                          <p>{t("GST Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            name="checked"
                            checked={checked}
                            onChange={this.temp}
                          />
                          <p>{t(" Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Add"}
                          onClick={() => this.createsitelist()}
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
              {iscreation == true ? (
                <div className="container-fluid roomcontent">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Site Code")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={codeedit}
                            name="codeedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Site Desc")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalInput
                            value={descedit}
                            name="descedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("City")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={city}
                            value={cityvaledit}
                            onChange={this.temp}
                            name="cityedit"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("State")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={state}
                            value={statevaledit}
                            onChange={this.temp}
                            name="stateedit"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Country")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={country}
                            value={countryvaledit}
                            onChange={this.temp}
                            name="countryedit"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("PostCode")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={post_codeedit}
                            name="post_codeedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Address")}</p>
                        <div className="input-group">
                          <NormalTextarea
                            onChange={this.temp}
                            value={addressedit}
                            name="addressedit"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-6 ">
                      <div className="mt-3">
                        <p>{t("E-Mail")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={emailedit}
                            name="emailedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Fax")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={faxedit}
                            name="faxedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Phone 1")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={phoneoneedit}
                            type="tel"
                            name="phoneoneedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Phone 2")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={phonetwoedit}
                            type="tel"
                            name="phonetwordit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Site Group")}</p>
                        <div className="input-group">
                          <NormalSelect
                            options={site_group}
                            value={site_groupvaledit}
                            onChange={this.temp}
                            name="site_groupedit"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p>{t("Account Code")}</p>
                        <div className="input-group">
                          <NormalInput
                            value={ac_codeedit}
                            name="ac_codeedit"
                            onChange={this.temp}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            name="gstedit"
                            checked={gstedit}
                            onChange={this.temp}
                          />
                          <p>{t("GST Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex input-group">
                          <NormalCheckbox
                            name="checkededit"
                            checked={checkededit}
                            onChange={this.temp}
                          />
                          <p>{t(" Active")}</p>
                        </div>
                      </div>
                      <div className="mt-3" style={{ width: 100 }}>
                        <NormalButton
                          mainbg={true}
                          label={"Update"}
                          onClick={() => this.updatesitelist()}
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
            onClick={() => this.listcontent()}
          >
            <p>{t("Site List")}</p>
            <div className="icons">
              {islist == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islist == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <div className="d-flex">
                    <p className="mt-3 col-5">{t("List of Sites")}</p>
                    <div className="w-100 col-7 mt-3">
                      <InputSearch
                        onChange={this.filterBysite}
                        placeholder="Search by  Code / Description"
                      />
                    </div>
                  </div>
                  {searchone.length > 0 ? (
                    <div className="tab-table-content">
                      <div className="py-4">
                        <div className="table-container">
                          <TableWrapper
                            headerDetails={SiteDetails}
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
                            ) : filterdataone.length > 0 ? (
                              filterdataone.map(
                                ({ itemsiteCode, itemsiteDesc }, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div
                                          className="text-left text-success cursor-pointer"
                                          onClick={() =>
                                            this.handleedit(itemsiteCode)
                                          }
                                        >
                                          {itemsiteCode}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-left">
                                          {itemsiteDesc}
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
                          headerDetails={SiteDetails}
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
                          ) : Site_list.length > 0 ? (
                            Site_list.map(
                              ({ itemsiteCode, itemsiteDesc }, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div
                                        className="text-left text-success cursor-pointer"
                                        onClick={() =>
                                          this.handleedit(itemsiteCode)
                                        }
                                      >
                                        {itemsiteCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {itemsiteDesc}
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

          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.groupcontent()}
          >
            <p>{t("Site Group")}</p>
            <div className="icons">
              {islisttwo == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {islisttwo == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <div className="d-flex">
                    <p className="mt-3 col-5">{t("List of Site Groups")}</p>
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
                          <TableWrapper headerDetails={SitegroupDetails}>
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
                                        <div className="text-center">
                                          <NormalCheckbox
                                            checked={isActive}
                                            name="checked"
                                            onChange={() =>
                                              this.handlecheckbox(code)
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          <BsPencilSquare
                                            size={20}
                                            onClick={() =>
                                              this.handleEdit(code, description)
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
                        <TableWrapper headerDetails={SitegroupDetails}>
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
                                      <div className="text-center">
                                        <NormalCheckbox
                                          checked={isActive}
                                          name="checked"
                                          onChange={() =>
                                            this.handlecheckbox(code)
                                          }
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-center">
                                        <BsPencilSquare
                                          size={20}
                                          onClick={() =>
                                            this.handleEdit(code, description)
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
                <div className="mt-3" style={{ width: 100 }}>
                  <NormalButton
                    mainbg={true}
                    label={"Add Row"}
                    onClick={() => this.newdescpopup()}
                  />
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
              <h5> EDIT NAME</h5>
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
                <p>Name</p>
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
              <h5> ADD SITE GROUP</h5>
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
                <p>NAME</p>
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
      SiteGroups,
      NewSiteGroups,
      ItemSitelists,
      NewItemSitelists,
      Cities,
      States,
      Countries,
      updateCommon,
    },
    dispatch
  );
};

export const Outletmaster = withTranslation()(
  connect(null, mapDispatchToProps)(OutletmasterClass)
);
