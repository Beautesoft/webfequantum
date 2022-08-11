import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { NormalButton, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import { Cart } from "../Cart";
import "./style.scss";
import { SalonProduct } from "./salonProduct";
import { Favorite } from "./favorite";
import { Services } from "./services";
import { Retail } from "./retail";
import { Package } from "./package";
import { Voucher } from "./voucher";
import { Prepaid } from "./prepaid";
import { All } from "./all";
import { Courses } from "./courses";
import { CatalogCart } from "./catalogCart";
import { RetailProduct } from "./retailProduct";
import _ from "lodash";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
// import { history } from 'helpers';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

export class CatalogClass extends Component {
  state = {
    active: false,
    currentValue: 0,
    navLinks: [
      { to: "/admin/catalog", label: "Favorites", id: "Favorites" },
      { to: "/admin/catalog", label: "SERVICE", id: "SERVICE" },
      { to: "/admin/catalog", label: "Package", id: "PACKAGE" },
      { to: "/admin/catalog", label: "Prepaid", id: "PREPAID" },
      { to: "/admin/catalog", label: "Voucher", id: "VOUCHER" },
      { to: "/admin/catalog", label: "Retail", id: "RETAIL" },
    ],
    selectedMenu: "Favorites",
    rangeId: "",
    rangeName: "",
    rangeOption: [],
    formFields: {
      search: "",
    },
  };

  componentDidMount() {
    let { navLinks } = this.state;
  }

  handleClick = async key => {
    let { active, currentValue } = this.state;
    await this.setState({
      selectedMenu: key.id,
    });
    this.setState({
      active: true,
      currentValue: key.key,
      selected: key.id,
    });
  };

  handleSearch = async event => {
    event.persist();
    let { formFields, selectedMenu } = this.state;
    formFields["search"] = event.target.value;
    await this.setState({ formFields });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        selectedMenu = 8;
        this.handleClick({ key: 8, id: selectedMenu });
      }, 500);
    }
    this.debouncedFn();
  };

  handleFilter = () => {
    this.child.handleFilterSearch({});
  };

  render() {
    let { navLinks, currentValue, formFields } = this.state;
    let {t} = this.props;
    return (
      <>
        <div className="catalog-section">
          <div className="col-md-12 catalog-content">
            <div className="input-group">
              <div className="mb-3">
                <InputSearch
                  className=""
                  value={formFields.search}
                  name={`search`}
                  placeholder="Search here.."
                  onChange={this.handleSearch}
                />
              </div>
            </div>
            <div className="tab-menus">
              <ul>
                {navLinks.map(({ to, label, id }, index) => (
                  <li key={index}>
                    <NavLink to={to} className="nav-link">
                      <div
                        className={`sidebar-menu ${
                          currentValue === index ? "active" : ""
                        }`}
                        onClick={() => this.handleClick({ key: index, id: id })}
                      >
                        <span className="sidebar-menu-desc">{t(label)}</span>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            {this.state.selectedMenu === "Favorites" && (
              <Favorite
                id={this.state.selectedMenu}
                search={formFields.search}
                api={"catalogfavorites"}
              />
            )}
            {this.state.selectedMenu === "SERVICE" && (
              <Services
                id={this.state.selectedMenu}
                search={formFields.search}
                api={"servicestock"}
              />
            )}
            {this.state.selectedMenu === "RETAIL" && (
              <Retail
                id={this.state.selectedMenu}
                search={formFields.search}
                api={"retailstock"}
              />
            )}
            {this.state.selectedMenu === "PACKAGE" && (
              <Package
                id={this.state.selectedMenu}
                search={formFields.search}
                api={"packagestock"}
              />
            )}
            {this.state.selectedMenu === "VOUCHER" && (
              <Voucher
                id={this.state.selectedMenu}
                search={formFields.search}
                api={"voucherstock"}
              />
            )}
            {this.state.selectedMenu === "PREPAID" && (
              <Prepaid
                id={this.state.selectedMenu}
                search={formFields.search}
                api={"prepaidstock"}
              />
            )}

            {this.state.selectedMenu === 8 && (
              <All
                id={this.state.selectedMenu}
                search={formFields.search}
                api={"catalogsearch"}
                onRef={ref => (this.child = ref)}
              />
            )}
          </div>

          {/* <div className=" col-4 ">
                            <div className="ml-2 cart-bar">
                                <CatalogCart id={selectedMenu} ></CatalogCart>
                            </div>
                        </div> */}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  // selected_cstomer: state.common.selected_cstomer,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const Catalog = withTranslation ()(connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogClass));
