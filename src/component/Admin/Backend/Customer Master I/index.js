import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  TableWrapper,
  NormalInput,
  NormalModal,
} from "component/common";
import "./style.scss";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import {
  CustomerClasses,
  NewCustomerClasses,
  CustomerTypes,
  NewCustomerTypes,
  CustomerGroups,
  NewCustomerGroups,
  CustomerGroup2s,
  NewCustomerGroup2s,
  CustomerGroup3s,
  NewCustomerGroup3s,
  ProductGroups,
  NewProductGroups,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BsPencilSquare } from "react-icons/bs";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";

export class CustomermasteroneClass extends Component {
  state = {
    customerDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Auto Update Amount", divClass: "justify-content-end" },
      { label: "Active" },
    ],
    customertypeDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Description" },
      { label: "Active" },
      { label: "Action", divClass: "justify-content-center" },
    ],

    isoption: false,
    iscreation: false,
    iscustomer1: false,
    iscustomer2: false,
    iscustomer3: false,
    isproductgroup: false,
    iscustomertype: false,
    staffList: [],
    customerclass: [],
    customertype: [],
    customergroup_one: [],
    customergroup_two: [],
    customergroup_three: [],
    productgroup: [],
    newid: null,
    newval: null,
    editid: null,
    editval: null,
    isAboutPopModal: false,
    isNewdescPopModal: false,
    group1id: null,
    group1val: null,
    editgroup1id: null,
    editgroup1val: null,
    isAboutPopModalgroup1: false,
    isNewdescPopModalgroup1: false,
    group2id: null,
    group2val: null,
    editgroup2id: null,
    editgroup2val: null,
    isAboutPopModalgroup2: false,
    isNewdescPopModalgroup2: false,
    group3id: null,
    group3val: null,
    editgroup3id: null,
    editgroup3val: null,
    isAboutPopModalgroup3: false,
    isNewdescPopModalgroup3: false,
    productid: null,
    productval: null,
    editproductid: null,
    editproductval: null,
    isAboutPopModalproduct: false,
    isNewdescPopModalproduct: false,
    activeitem: true,
  };

  componentDidMount = () => {
    this.Listofcustomerclass({});
    this.Listofcustomertytpe({});
    this.Listofcustomergroupone({});
    this.Listofcustomergrouptwo({});
    this.Listofcustomergrouothree({});
    this.Listofproductgruop({});
  };

  Listofcustomerclass = async () => {
    this.updateState({ is_loading: true });
    await this.props.CustomerClasses().then(res => {
      console.log(res);
      let { customerclass } = this.state;

      customerclass = res;
      console.log(customerclass);
      this.setState({
        customerclass,
        is_loading: false,
      });
      console.log(customerclass.length);
    });
  };

  Listofcustomertytpe = async () => {
    this.updateState({ is_loading: true });
    await this.props.CustomerTypes().then(res => {
      console.log(res);
      let { customertype } = this.state;

      customertype = res;
      console.log(customertype);
      this.setState({
        customertype,
        is_loading: false,
      });
      console.log(customertype.length);
    });
  };

  Listofcustomergroupone = async () => {
    this.updateState({ is_loading: true });
    await this.props.CustomerGroups().then(res => {
      console.log(res);
      let { customergroup_one } = this.state;

      customergroup_one = res;
      console.log(customergroup_one);
      this.setState({
        customergroup_one,
        is_loading: false,
      });
      console.log(customergroup_one.length);
    });
  };

  Listofcustomergrouptwo = async () => {
    this.updateState({ is_loading: true });
    await this.props.CustomerGroup2s().then(res => {
      console.log(res);
      let { customergroup_two } = this.state;

      customergroup_two = res;
      console.log(customergroup_two);
      this.setState({
        customergroup_two,
        is_loading: false,
      });
      console.log(customergroup_two.length);
    });
  };

  Listofcustomergrouothree = async () => {
    this.updateState({ is_loading: true });
    await this.props.CustomerGroup3s().then(res => {
      console.log(res);
      let { customergroup_three } = this.state;

      customergroup_three = res;
      console.log(customergroup_three);
      this.setState({
        customergroup_three,
        is_loading: false,
      });
      console.log(customergroup_three.length);
    });
  };

  Listofproductgruop = async () => {
    this.updateState({ is_loading: true });
    await this.props.ProductGroups().then(res => {
      console.log(res);
      let { productgroup } = this.state;

      productgroup = res;
      console.log(productgroup);
      this.setState({
        productgroup,
        is_loading: false,
      });
      console.log(productgroup.length);
    });
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  customercontent() {
    this.setState({
      iscreation: !this.state.iscreation,
    });
  }

  customertypecontent() {
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

  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }

  finaldesc = async (id, desc) => {
    let { editval, newval, activeitem } = this.state;
    let descJson = {
      typeCode: id,
      typeDesc: desc,
      typeIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `CustomerTypes/update?where=%7B%22typeCode%22%3A%20${id}%7D
   `,
        descJson
      )
      .then(data => {
        this.Listofcustomertytpe({});
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
        typeCode: id,
        typeDesc: val,
        typeIsactive: true,
      };
      await this.props
        .NewCustomerTypes(newreason)
        .then(data => {
          this.Listofcustomertytpe({});
        })
        .catch(e => console.log(e));
      this.newdescpopup();
      newval = "";
      this.setState({ newval });
    }
  };

  newdescpopup() {
    let { customertype, newid, te } = this.state;
    if (customertype.length > 0) {
      te = customertype[customertype.length - 1].typeCode;
      newid = Number(te) + 1;
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

  handleEditgroup1(id, desc, active) {
    let { editgroup1id, editgroup1val, activeitem } = this.state;
    editgroup1id = id;
    editgroup1val = desc;
    activeitem = active;
    console.log(editgroup1id, editgroup1val);
    this.setState({
      editgroup1id,
      editgroup1val,
      activeitem,
    });
    this.aboutpopupgroup1();
  }

  aboutpopupgroup1() {
    this.setState({
      isAboutPopModalgroup1: !this.state.isAboutPopModalgroup1,
    });
  }

  finaldescgroup1 = async (id, desc) => {
    let { editgroup1val, group1val, activeitem } = this.state;
    let descJson = {
      groupCode: id,
      groupDesc: desc,
      seq: 0,
      groupIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `CustomerGroups/update?where=%7B%22groupCode%22%3A%20%22${id}%22%7D
 `,
        descJson
      )
      .then(data => {
        this.Listofcustomergroupone({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupgroup1();
    editgroup1val = "";
    group1val = "";
    this.setState({ editgroup1val, group1val });
  };

  createdescgroup1 = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { group1val } = this.state;
      console.log(id, val);
      let newreason = {
        groupCode: id,
        groupDesc: val,
        seq: 0,
        groupIsactive: true,
      };
      await this.props
        .NewCustomerGroups(newreason)
        .then(data => {
          this.Listofcustomergroupone({});
        })
        .catch(e => console.log(e));
      this.newdescpopupgroup1();
      group1val = "";
      this.setState({ group1val });
    }
  };

  newdescpopupgroup1() {
    let { customergroup_one, group1id, te } = this.state;
    if (customergroup_one.length > 0) {
      te = customergroup_one[customergroup_one.length - 1].groupCode;
      te = te.slice(te.length - 4);
      group1id = Number(te) + 1;
      group1id = "G" + group1id;
    } else {
      group1id = "G" + 1001;
    }

    this.setState({
      isNewdescPopModalgroup1: !this.state.isNewdescPopModalgroup1,
      group1id,
    });
  }

  handledescgroup1 = ({ target: { value, name } }) => {
    console.log(name);
    let { editgroup1val } = this.state;

    if ((name = "desc")) {
      editgroup1val = value;
      this.setState({ editgroup1val });
    }
  };

  newdescriptionvalgroup1 = ({ target: { value, name } }) => {
    let { group1id } = this.state;

    if ((name = "newid")) {
      group1id = value;
      this.setState({ group1id });
    }
  };

  newdescriptiongroup1 = ({ target: { value, name } }) => {
    let { group1val } = this.state;

    if ((name = "newdesval")) {
      group1val = value;
      this.setState({ group1val });
    }
  };

  handleEditgroup2(id, desc, active) {
    let { editgroup2id, editgroup2val, activeitem } = this.state;
    editgroup2id = id;
    editgroup2val = desc;
    activeitem = active;
    console.log(editgroup2id, editgroup2val);
    this.setState({
      editgroup2id,
      editgroup2val,
      activeitem,
    });
    this.aboutpopupgroup2();
  }

  aboutpopupgroup2() {
    this.setState({
      isAboutPopModalgroup2: !this.state.isAboutPopModalgroup2,
    });
  }

  finaldescgroup2 = async (id, desc) => {
    let { editgroup2val, group2val, activeitem } = this.state;
    let descJson = {
      groupCode: id,
      groupDesc: desc,
      seq: 0,
      groupIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `CustomerGroup2s/update?where=%7B%22groupCode%22%3A%20${id}%7D
 `,
        descJson
      )
      .then(data => {
        this.Listofcustomergrouptwo({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupgroup2();
    editgroup2val = "";
    group2val = "";
    this.setState({ editgroup2val, group2val });
  };

  createdescgroup2 = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { group2val } = this.state;
      console.log(id, val);
      let newreason = {
        groupCode: id,
        groupDesc: val,
        seq: 0,
        groupIsactive: true,
      };
      await this.props
        .NewCustomerGroup2s(newreason)
        .then(data => {
          this.Listofcustomergrouptwo({});
        })
        .catch(e => console.log(e));
      this.newdescpopupgroup2();
      group2val = "";
      this.setState({ group2val });
    }
  };

  newdescpopupgroup2() {
    let { customergroup_two, group2id, te } = this.state;
    if (customergroup_two.length > 0) {
      te = customergroup_two[customergroup_two.length - 1].groupCode;
      te = te.slice(te.length - 4);
      group2id = Number(te) + 1;
      group2id = "G" + group2id;
    } else {
      group2id = "G" + 1001;
    }

    this.setState({
      isNewdescPopModalgroup2: !this.state.isNewdescPopModalgroup2,
      group2id,
    });
  }

  handledescgroup2 = ({ target: { value, name } }) => {
    console.log(name);
    let { editgroup2val } = this.state;

    if ((name = "desc")) {
      editgroup2val = value;
      this.setState({ editgroup2val });
    }
  };

  newdescriptionvalgroup2 = ({ target: { value, name } }) => {
    let { group2id } = this.state;

    if ((name = "newid")) {
      group2id = value;
      this.setState({ group2id });
    }
  };

  newdescriptiongroup2 = ({ target: { value, name } }) => {
    let { group2val } = this.state;

    if ((name = "newdesval")) {
      group2val = value;
      this.setState({ group2val });
    }
  };

  handleEditgroup3(id, desc, active) {
    let { editgroup3id, editgroup3val, activeitem } = this.state;
    editgroup3id = id;
    editgroup3val = desc;
    activeitem = active;
    console.log(editgroup3id, editgroup3val);
    this.setState({
      editgroup3id,
      editgroup3val,
      activeitem,
    });
    this.aboutpopupgroup3();
  }

  aboutpopupgroup3() {
    this.setState({
      isAboutPopModalgroup3: !this.state.isAboutPopModalgroup3,
    });
  }

  finaldescgroup3 = async (id, desc) => {
    let { editgroup3val, group3val, activeitem } = this.state;
    let descJson = {
      groupCode: id,
      groupDesc: desc,
      seq: 0,
      groupIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `CustomerGroup3s/update?where=%7B%22groupCode%22%3A%20%22${id}%22%7D
`,
        descJson
      )
      .then(data => {
        this.Listofcustomergrouothree({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupgroup3();
    editgroup3val = "";
    group3val = "";
    this.setState({ editgroup3val, group3val });
  };

  createdescgroup3 = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { group3val } = this.state;
      console.log(id, val);
      let newreason = {
        groupCode: id,
        groupDesc: val,
        seq: 0,
        groupIsactive: true,
      };
      await this.props
        .NewCustomerGroup3s(newreason)
        .then(data => {
          this.Listofcustomergrouothree({});
        })
        .catch(e => console.log(e));
      this.newdescpopupgroup3();
      group3val = "";
      this.setState({ group3val });
    }
  };

  newdescpopupgroup3() {
    let { customergroup_three, group3id, te } = this.state;
    if (customergroup_three.length > 0) {
      te = customergroup_three[customergroup_three.length - 1].groupCode;
      te = te.slice(te.length - 4);
      group3id = Number(te) + 1;
      group3id = "G" + group3id;
      console.log(group3id);
    } else {
      group3id = "G" + 1001;
    }

    this.setState({
      isNewdescPopModalgroup3: !this.state.isNewdescPopModalgroup3,
      group3id,
    });
  }

  handledescgroup3 = ({ target: { value, name } }) => {
    console.log(name);
    let { editgroup3val } = this.state;

    if ((name = "desc")) {
      editgroup3val = value;
      this.setState({ editgroup3val });
    }
  };

  newdescriptionvalgroup3 = ({ target: { value, name } }) => {
    let { group3id } = this.state;

    if ((name = "newid")) {
      group3id = value;
      this.setState({ group3id });
    }
  };

  newdescriptiongroup3 = ({ target: { value, name } }) => {
    let { group3val } = this.state;

    if ((name = "newdesval")) {
      group3val = value;
      this.setState({ group3val });
    }
  };

  handleEditgroup2(id, desc, active) {
    let { editgroup2id, editgroup2val, activeitem } = this.state;
    editgroup2id = id;
    editgroup2val = desc;
    activeitem = active;
    console.log(editgroup2id, editgroup2val);
    this.setState({
      editgroup2id,
      editgroup2val,
      activeitem,
    });
    this.aboutpopupgroup2();
  }

  aboutpopupgroup2() {
    this.setState({
      isAboutPopModalgroup2: !this.state.isAboutPopModalgroup2,
    });
  }

  finaldescgroup2 = async (id, desc) => {
    let { editgroup2val, group2val, activeitem } = this.state;
    let descJson = {
      groupCode: id,
      groupDesc: desc,
      seq: 0,
      groupIsactive: activeitem,
    };
    await this.props
      .updateCommon(
        `CustomerGroup2s/update?where=%7B%22groupCode%22%3A%20%22${id}%22%7D
`,
        descJson
      )
      .then(data => {
        this.Listofcustomergrouptwo({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupgroup2();
    editgroup2val = "";
    group2val = "";
    this.setState({ editgroup2val, group2val });
  };

  createdescgroup2 = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { group2val } = this.state;
      console.log(id, val);
      let newreason = {
        groupCode: id,
        groupDesc: val,
        seq: 0,
        groupIsactive: true,
      };
      await this.props
        .NewCustomerGroup2s(newreason)
        .then(data => {
          this.Listofcustomergrouptwo({});
        })
        .catch(e => console.log(e));
      this.newdescpopupgroup2();
      group2val = "";
      this.setState({ group2val });
    }
  };

  newdescpopupgroup2() {
    let { customergroup_two, group2id, te } = this.state;
    if (customergroup_two.length > 0) {
      te = customergroup_two[customergroup_two.length - 1].groupCode;
      te = te.slice(te.length - 4);
      group2id = Number(te) + 1;
      group2id = "G" + group2id;
    } else {
      group2id = "G" + 1001;
    }

    this.setState({
      isNewdescPopModalgroup2: !this.state.isNewdescPopModalgroup2,
      group2id,
    });
  }

  handledescgroup2 = ({ target: { value, name } }) => {
    console.log(name);
    let { editgroup2val } = this.state;

    if ((name = "desc")) {
      editgroup2val = value;
      this.setState({ editgroup2val });
    }
  };

  newdescriptionvalgroup2 = ({ target: { value, name } }) => {
    let { group2id } = this.state;

    if ((name = "newid")) {
      group2id = value;
      this.setState({ group2id });
    }
  };

  newdescriptiongroup2 = ({ target: { value, name } }) => {
    let { group2val } = this.state;

    if ((name = "newdesval")) {
      group2val = value;
      this.setState({ group2val });
    }
  };

  handleEditproduct(id, desc, active) {
    let { editproductid, editproductval, activeitem } = this.state;
    editproductid = id;
    editproductval = desc;
    activeitem = active;
    console.log(editproductid, editproductval);
    this.setState({
      editproductid,
      editproductval,
      activeitem,
    });
    this.aboutpopupproduct();
  }

  aboutpopupproduct() {
    this.setState({
      isAboutPopModalproduct: !this.state.isAboutPopModalproduct,
    });
  }

  finaldescproduct = async (id, desc) => {
    let { editproductval, productval, activeitem } = this.state;
    let descJson = {
      code: id,
      description: desc,
      isActive: activeitem,
    };
    await this.props
      .updateCommon(
        `ProductGroups/update?where=%7B%22code%22%3A%20%22${id}%22%7D
 `,
        descJson
      )
      .then(data => {
        this.Listofproductgruop({});
        Toast({
          type: "success",
          message: "Updated Successfully",
        });
      });
    this.aboutpopupproduct();
    editproductval = "";
    productval = "";
    this.setState({ editproductval, productval });
  };

  createdescproduct = async (id, val) => {
    if (val == null) {
      Toast({
        type: "error",
        message: "Description required",
      });
    } else {
      let { productval } = this.state;
      console.log(id, val);
      let newreason = {
        code: id,
        description: val,
        isActive: true,
      };
      await this.props
        .NewProductGroups(newreason)
        .then(data => {
          this.Listofproductgruop({});
        })
        .catch(e => console.log(e));
      this.newdescpopupproduct();
      productval = "";
      this.setState({ productval });
    }
  };

  newdescpopupproduct() {
    let { productgroup, productid, te } = this.state;
    if (productgroup.length > 0) {
      te = productgroup[productgroup.length - 1].code;
      te = te.slice(te.length - 4);
      productid = Number(te) + 1;
      productid = "G" + productid;
    } else {
      productid = "G" + 1001;
    }

    this.setState({
      isNewdescPopModalproduct: !this.state.isNewdescPopModalproduct,
      productid,
    });
  }

  handledescproduct = ({ target: { value, name } }) => {
    console.log(name);
    let { editproductval } = this.state;

    if ((name = "desc")) {
      editproductval = value;
      this.setState({ editproductval });
    }
  };

  newdescriptionvalproduct = ({ target: { value, name } }) => {
    let { productid } = this.state;

    if ((name = "newid")) {
      productid = value;
      this.setState({ productid });
    }
  };

  newdescriptionproduct = ({ target: { value, name } }) => {
    let { productval } = this.state;

    if ((name = "newdesval")) {
      productval = value;
      this.setState({ productval });
    }
  };

  handlecheckbox = async item => {
    let { customertype } = this.state;
    for (let i = 0; i <= customertype.length - 1; i++) {
      if (customertype[i].typeCode == item) {
        customertype[i].typeIsactive = !customertype[i].typeIsactive;
        let descJson = {
          typeCode: customertype[i].typeCode,
          typeDesc: customertype[i].typeDesc,
          typeIsactive: customertype[i].typeIsactive,
        };
        await this.props
          .updateCommon(
            `CustomerTypes/update?where=%7B%22typeCode%22%3A%20${item}%7D
   `,
            descJson
          )
          .then(data => {
            this.Listofcustomertytpe({});
          });
      }
    }
  };

  handlecheckboxone = async item => {
    let { customergroup_one } = this.state;
    for (let i = 0; i <= customergroup_one.length - 1; i++) {
      if (customergroup_one[i].groupCode == item) {
        customergroup_one[i].groupIsactive =
          !customergroup_one[i].groupIsactive;
        let descJson = {
          groupCode: customergroup_one[i].groupCode,
          groupDesc: customergroup_one[i].groupDesc,
          seq: 0,
          groupIsactive: customergroup_one[i].groupIsactive,
        };
        await this.props
          .updateCommon(
            `CustomerGroups/update?where=%7B%22groupCode%22%3A%20%22${item}%22%7D
`,
            descJson
          )
          .then(data => {
            this.Listofcustomergroupone({});
          });
      }
    }
  };

  handlecheckboxtwo = async item => {
    let { customergroup_two } = this.state;
    for (let i = 0; i <= customergroup_two.length - 1; i++) {
      if (customergroup_two[i].groupCode == item) {
        customergroup_two[i].groupIsactive =
          !customergroup_two[i].groupIsactive;
        let descJson = {
          groupCode: customergroup_two[i].groupCode,
          groupDesc: customergroup_two[i].groupDesc,
          seq: 0,
          groupIsactive: customergroup_two[i].groupIsactive,
        };
        await this.props
          .updateCommon(
            `CustomerGroup2s/update?where=%7B%22groupCode%22%3A%20%22${item}%22%7D
`,
            descJson
          )
          .then(data => {
            this.Listofcustomergrouptwo({});
          });
      }
    }
  };

  handlecheckboxthree = async item => {
    let { customergroup_three } = this.state;
    for (let i = 0; i <= customergroup_three.length - 1; i++) {
      if (customergroup_three[i].groupCode == item) {
        customergroup_three[i].groupIsactive =
          !customergroup_three[i].groupIsactive;
        let descJson = {
          groupCode: customergroup_three[i].groupCode,
          groupDesc: customergroup_three[i].groupDesc,
          seq: 0,
          groupIsactive: customergroup_three[i].groupIsactive,
        };
        await this.props
          .updateCommon(
            `CustomerGroup3s/update?where=%7B%22groupCode%22%3A%20%22${item}%22%7D
`,
            descJson
          )
          .then(data => {
            this.Listofcustomergrouothree({});
          });
      }
    }
  };

  handlecheckboxfour = async item => {
    let { productgroup } = this.state;
    for (let i = 0; i <= productgroup.length - 1; i++) {
      if (productgroup[i].code == item) {
        productgroup[i].isActive = !productgroup[i].isActive;
        let descJson = {
          code: productgroup[i].code,
          description: productgroup[i].description,
          isActive: productgroup[i].isActive,
        };
        await this.props
          .updateCommon(
            `ProductGroups/update?where=%7B%22code%22%3A%20%22${item}%22%7D
`,
            descJson
          )
          .then(data => {
            this.Listofproductgruop({});
           
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
      iscustomer3,
      isproductgroup,
      iscustomertype,
      customertypeDetails,
      customerclass,
      customertype,
      customergroup_one,
      customergroup_two,
      customergroup_three,
      productgroup,
      newid,
      newval,
      editid,
      editval,
      isAboutPopModal,
      isNewdescPopModal,
      group1id,
      group1val,
      editgroup1id,
      editgroup1val,
      isAboutPopModalgroup1,
      isNewdescPopModalgroup1,
      group2id,
      group2val,
      editgroup2id,
      editgroup2val,
      isAboutPopModalgroup2,
      isNewdescPopModalgroup2,
      group3id,
      group3val,
      editgroup3id,
      editgroup3val,
      isAboutPopModalgroup3,
      isNewdescPopModalgroup3,
      productid,
      productval,
      editproductid,
      editproductval,
      isAboutPopModalproduct,
      isNewdescPopModalproduct,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid tax">
          <h4>{t("Customer Master")}</h4>
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup"
            onClick={() => this.customercontent()}
          >
            <p>{t("Customer Class")}</p>
            <div className="icons">
              {iscreation == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscreation == true ? (
            <div>
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Customer Class")}</p>
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
                        ) : customerclass.length > 0 ? (
                          customerclass.map(
                            (
                              { classCode, classDesc, classIsactive },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div
                                      className="text-right text-success"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/backend/CustomerclassId/${classCode}`
                                        )
                                      }
                                    >
                                      {classCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{classDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {classDesc}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {classIsactive == true ? "Yes" : "No"}
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
                    `/admin/backend/customermaster/CustomerClass`
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
            onClick={() => this.customertypecontent()}
          >
            <p>{t("Customer Type")}</p>
            <div className="icons">
              {iscustomertype == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomertype == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Customer Types")}</p>
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
                        ) : customertype.length > 0 ? (
                          customertype.map(
                            ({ typeCode, typeDesc, typeIsactive }, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">{typeCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">{typeDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={typeIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckbox(typeCode)
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
                                            typeCode,
                                            typeDesc,
                                            typeIsactive
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
                  onClick={() => this.newdescpopup()}
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
            <p>{t("Customer Group-1")}</p>
            <div className="icons">
              {iscustomer1 == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomer1 == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Customer Group-1")}</p>
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
                        ) : customergroup_one.length > 0 ? (
                          customergroup_one.map(
                            (
                              { groupCode, groupDesc, groupIsactive },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">
                                      {groupCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{groupDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={groupIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxone(groupCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditgroup1(
                                            groupCode,
                                            groupDesc,
                                            groupIsactive
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
                  onClick={() => this.newdescpopupgroup1()}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.custwocontenttwo()}
          >
            <p>{t("Customer Group-2")}</p>
            <div className="icons">
              {iscustomer2 == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomer2 == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Customer Group-2")}</p>
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
                        ) : customergroup_two.length > 0 ? (
                          customergroup_two.map(
                            (
                              { groupCode, groupDesc, groupIsactive },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">
                                      {groupCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{groupDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={groupIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxtwo(groupCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditgroup2(
                                            groupCode,
                                            groupDesc,
                                            groupIsactive
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
                  onClick={() => this.newdescpopupgroup2()}
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
            <p>{t("Customer Group-3")}</p>
            <div className="icons">
              {iscustomer3 == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {iscustomer3 == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Customer Group-3")}</p>
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
                        ) : customergroup_three.length > 0 ? (
                          customergroup_three.map(
                            (
                              { groupCode, groupDesc, groupIsactive },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="text-right">
                                      {groupCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">{groupDesc}</div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      <NormalCheckbox
                                        checked={groupIsactive}
                                        name="checked"
                                        onChange={() =>
                                          this.handlecheckboxthree(groupCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditgroup3(
                                            groupCode,
                                            groupDesc,
                                            groupIsactive
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
                  onClick={() => this.newdescpopupgroup3()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex  justify-content-between p-3 itemstatusgroup mt-5"
            onClick={() => this.productgroupcontenttwo()}
          >
            <p>{t("Customer Product Group")}</p>
            <div className="icons">
              {isproductgroup == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {isproductgroup == true ? (
            <div className="container-fluid">
              <div className="col-12 mt-1">
                <div className="tab-table-content">
                  <p className="mt-3">{t("List of Customer Product Groups")}</p>
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
                        ) : productgroup.length > 0 ? (
                          productgroup.map(
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
                                          this.handlecheckboxfour(code)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <BsPencilSquare
                                        size={20}
                                        onClick={() =>
                                          this.handleEditproduct(
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
                  onClick={() => this.newdescpopupproduct()}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Customer Type*/}
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

        {/* Customer group1*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModalgroup1}
          handleModal={() => this.aboutpopupgroup1()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT Customer Group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupgroup1()}
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
                <NormalInput value={editgroup1id} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editgroup1val}
                  name="desc"
                  onChange={this.handledescgroup1}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupgroup1()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldescgroup1(editgroup1id, editgroup1val)
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
          modal={isNewdescPopModalgroup1}
          handleModal={() => this.newdescpopupgroup1()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD Customer group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupgroup1()}
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
                  value={group1id}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvalgroup1}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={group1val}
                  name="newdesval"
                  onChange={this.newdescriptiongroup1}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupgroup1()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdescgroup1(group1id, group1val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        {/* Customer group2*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModalgroup2}
          handleModal={() => this.aboutpopupgroup2()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT Customer Group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupgroup2()}
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
                <NormalInput value={editgroup2id} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editgroup2val}
                  name="desc"
                  onChange={this.handledescgroup2}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupgroup2()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldescgroup2(editgroup2id, editgroup2val)
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
          modal={isNewdescPopModalgroup2}
          handleModal={() => this.newdescpopupgroup2()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD Customer group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupgroup2()}
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
                  value={group2id}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvalgroup2}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={group2val}
                  name="newdesval"
                  onChange={this.newdescriptiongroup2}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupgroup2()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdescgroup2(group2id, group2val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        {/* Customer group3*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModalgroup3}
          handleModal={() => this.aboutpopupgroup3()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT Customer Group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupgroup3()}
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
                <NormalInput value={editgroup3id} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editgroup3val}
                  name="desc"
                  onChange={this.handledescgroup3}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupgroup3()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldescgroup3(editgroup3id, editgroup3val)
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
          modal={isNewdescPopModalgroup3}
          handleModal={() => this.newdescpopupgroup3()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD Customer group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupgroup3()}
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
                  value={group3id}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvalgroup3}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={group3val}
                  name="newdesval"
                  onChange={this.newdescriptiongroup3}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupgroup3()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() => this.createdescgroup3(group3id, group3val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </NormalModal>

        {/*ProductGroup*/}
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "500px" }}
          modal={isAboutPopModalproduct}
          handleModal={() => this.aboutpopupproduct()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> EDIT Customer Group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.aboutpopupproduct()}
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
                <NormalInput value={editproductid} disabled={true} />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={editproductval}
                  name="desc"
                  onChange={this.handledescproduct}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.aboutpopupproduct()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.finaldescproduct(editproductid, editproductval)
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
          modal={isNewdescPopModalproduct}
          handleModal={() => this.newdescpopupproduct()}
        >
          <div className="d-flex justify-content-between">
            <div className="heading">
              <h5> ADD Customer group1 </h5>
            </div>

            <div>
              <img
                onClick={() => this.newdescpopupproduct()}
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
                  value={productid}
                  name="newid"
                  disabled={true}
                  onChange={this.newdescriptionvalproduct}
                />
              </div>
              <div className="mt-2">
                <p>Description</p>
                <NormalInput
                  value={productval}
                  name="newdesval"
                  onChange={this.newdescriptionproduct}
                />
              </div>
              <div className="d-flex mt-4">
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Cancel"
                    onClick={() => this.newdescpopupproduct()}
                  />
                </div>
                <div className="col-6">
                  <NormalButton
                    normal={true}
                    label="Done"
                    onClick={() =>
                      this.createdescproduct(productid, productval)
                    }
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
      CustomerClasses,
      NewCustomerClasses,
      CustomerTypes,
      NewCustomerTypes,
      CustomerGroups,
      NewCustomerGroups,
      CustomerGroup2s,
      NewCustomerGroup2s,
      CustomerGroup3s,
      NewCustomerGroup3s,
      ProductGroups,
      NewProductGroups,
      updateCommon,
    },
    dispatch
  );
};

export const Customermasterone = withTranslation()(
  connect(null, mapDispatchToProps)(CustomermasteroneClass)
);
