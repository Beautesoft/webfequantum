import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { NormalButton, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import Brush from "assets/images/make-up-brush.png";
import filter from "assets/images/filter.png";
import CartImg from "assets/images/shopping-cart.png";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi } from "redux/actions/common";
import { Category, Dept, ServicesItem, ItemDetail } from "./services/index";

export class ServicesClass extends Component {
  state = {
    productCard: [
      {
        stock: true,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: true,
      },
      {
        stock: true,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: true,
      },
      {
        stock: true,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: false,
      },
      {
        stock: false,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: true,
      },
      {
        stock: true,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: true,
      },
      {
        stock: true,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: true,
      },
      {
        stock: true,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: true,
      },
      {
        stock: true,
        label: "Makeup brush",
        img: Brush,
        cost: "$ 4",
        combo: true,
      },
    ],
    activeTab: "category",
    selectedCategoryId: "",
    selectedServicesId: "",
    selectedDeptId: 246,
    active: false,
    currentValue: 0,
    navLinks: [
      {
        to: "/admin/catalog",
        label: "Retails Products",
      },
      {
        to: "/admin/catalog",
        label: "Salon Products",
      },
      {
        to: "/admin/catalog",
        label: "Services",
      },
      {
        to: "/admin/catalog",
        label: "Courses",
      },
    ],
    page: 1,
    formFields: {
      search: "",
    },
    menuId: "",
    rangeId: "",
    rangeName: "",
    menuOption: [],
    rangeOption: [],
  };

  componentDidMount = () => {
    let { productCard } = this.state;
    //this.getMenus();

    // this.getServices({});
    // this.getRange();
  };

  getMenus = () => {
    let { menuOption } = this.state;
    menuOption = [];
    console.log("sdfsdhfghjghj", this.props);
    this.props
      .getCommonApi(`catalogitemdept/?Item_Dept=${this.props.id}`)
      .then(res => {
        // activeMenu = []
        console.log("sdfsdhfghjghj ress", res);
        for (let key of res.data) {
          menuOption.push({
            value: key.id,
            label: key.itm_desc,
            code: key.itm_code,
            seq: key.itm_seq,
          });
        }
        this.setState({ menuOption });
      });
  };

  getRange = () => {
    let { rangeOption } = this.state;
    rangeOption = [];
    this.props
      .getCommonApi(`catalogitemrange?Item_Deptid=${this.state.menuId}`)
      .then(res => {
        // activeMenu = []
        for (let key of res.data) {
          rangeOption.push({ value: key.id, label: key.itm_desc });
        }
        this.setState({ rangeOption });
      });
  };

  getServices = query => {
    let {
      page = this.state.page,
      search = this.state.formFields.search,
      rangeId = this.state.rangeId,
    } = query;
    this.props
      .getCommonApi(
        `servicestock/?Item_Deptid=${this.state.menuId}&page=${page}&Item_Rangeid=${rangeId}`
      )
      .then(key => {
        let { status, data } = key;
        if (status === 200) {
          this.setState({ productCard: data });
        }
      });
  };

  handleSelectCategory = id => {
    this.setState({ activeTab: "dept", selectedCategoryId: id });
  };

  handleSelectDept = id => {
    this.setState({ activeTab: "ServicesItem", selectedDeptId: id });
  };

  handleSelectServices = id => {
    this.setState({ activeTab: "ItemDetail", selectedServicesId: id });
  };

  handleClick = key => {
    let { active, currentValue } = this.state;
    this.setState({
      active: true,
      currentValue: key,
    });
  };

  handleMenuChange = async ({ target: { value, name } }) => {
    let menuId = Object.assign({}, this.state.menuId);
    menuId = value;
    await this.setState({ menuId });
    this.getRange();
  };

  handleRangeChange = async ({ target: { value, name } }) => {
    let rangeId = Object.assign({}, this.state.rangeId);
    let rangeName = Object.assign({}, this.state.rangeName);
    let { rangeOption } = this.state;
    rangeId = value;
    // rangeName = name;

    for (let key of rangeOption) {
      if (key.value == value) {
        rangeName = key.label;
      }
    }

    await this.setState({
      rangeId,
      rangeName,
    });
    this.setState({ productCard: [] });
    this.getServices({});
  };

  render() {
    let {
      productCard,
      activeTab,
      rangeOption,
      rangeId,
      navLinks,
      menuOption,
      menuId,
      selectedCategoryId,
      currentValue,
      active,
      selectedDeptId,
      selectedServicesId,
    } = this.state;
    return (
      <>
        <ServicesItem
          id={this.props.id}
          menuId={menuId}
          rangeId={rangeId}
          handleSelectServices={this.handleSelectServices}
          api={this.props.api}
          search={this.props.search}
        ></ServicesItem>

        {/* } */}
        {activeTab === "ItemDetail" ? (
          <ItemDetail id={menuId} rangeId={rangeId}></ItemDetail>
        ) : (
          ""
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  customerDetail: state.appointment.customerDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
    },
    dispatch
  );
};

export const Services = connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicesClass);
