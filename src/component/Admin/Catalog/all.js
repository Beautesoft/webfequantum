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

export class AllClass extends Component {
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
    selectedDeptId: 3,
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
    rangeId: "",
    rangeName: "",
    rangeOption: [],
  };

  componentDidMount = () => {
    this.props.onRef(this);
  };

  getRange = () => {
    let { rangeOption } = this.state;
    rangeOption = [];
    this.props
      .getCommonApi(`catalogitemrange?Item_Deptid=${this.props.id}`)
      .then(res => {
        // activeMenu = []
        for (let key of res.data) {
          rangeOption.push({ value: key.id, label: key.itm_desc });
        }
        this.setState({ rangeOption });
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
    // this.getServices({});
  };

  render() {
    let { activeTab, selectedServicesId } = this.state;
    return (
      <>
        <ServicesItem
          id={this.props.id}
          handleSelectServices={this.handleSelectServices}
          search={this.props.search}
          api={this.props.api}
        ></ServicesItem>
        {activeTab === "ItemDetail" ? (
          <ItemDetail id={selectedServicesId}></ItemDetail>
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

export const All = connect(mapStateToProps, mapDispatchToProps)(AllClass);
