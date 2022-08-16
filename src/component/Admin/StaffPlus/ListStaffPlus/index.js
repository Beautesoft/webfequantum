import React from "react";
import { NormalButton } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import "./style.scss";
import { getJobtitle, getCommonApi } from "redux/actions/common";
import { getStaffPlus, deleteStaffPlus } from "redux/actions/staffPlus";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { Link } from "react-router-dom";
import { Navigation } from "react-minimal-side-navigation";
import { withTranslation } from "react-i18next";

export class ListStaffPlusClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Status" },
      { label: "Staff Name" },
      { label: "Phone" },
      { label: "Staff ID" },
      { label: "Specialist" },
      { label: "Home site" },
      { label: "Current site" },
      // { label: "" },
    ],
    originalStaffList: [],
    staffList: [],
    filter: "all",
    locationOption: [],
    levelList: [],
    jobOption: [],
    pageMeta: {},
    selectedMenu: "/active",
    active: false,
    currentIndex: -1,
    isLoading: false,
    isMounted: true,
    search: "",
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const filter = queryParams.get("filter");
    if (filter) {
      this.state.selectedMenu = "/" + filter;
      this.handleFilterChange(this.state.selectedMenu);
      this.updateState({});
    } else this.queryHandler({});
  }

  componentWillMount() {
    this.props.getCommonApi("branchlist/").then((res) => {
      let { locationOption } = this.state;
      for (let key of res.data) {
        locationOption.push({
          title: key.itemsite_desc,
          itemId: "/sitelist/" + key.id,
        });
      }
      this.updateState({ locationOption });
    });

    // level option api
    this.props.getCommonApi("securities/").then((res) => {
      let { levelList } = this.state;
      for (let key of res.data) {
        levelList.push({ itemId: "/emp_lvl/" + key.id, title: key.level_name });
      }
      this.updateState({ levelList });
    });

    // jobtitle option api
    this.props.getJobtitle().then(() => {
      this.getDatafromStore("jobtitle");
    });
  }

  // popup open/close
  handleClick = (key) => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.updateState((prevState) => ({
      active: !prevState.active,
      currentIndex: key,
    }));
  };

  handleFilterChange = (filterOption = "") => {
    this.state.selectedMenu = filterOption;
    var splitted = filterOption.split("/");
    var filter = this.state.filter;
    console.log(filterOption);
    if (splitted.length == 2) {
      switch (splitted[1]) {
        case "all":
          filter = "all";
          break;
        case "withSecurityAccount":
          filter = "is_login=True";
          break;
        case "withoutSecurityAccount":
          filter = "is_login=False";
          break;
        case "active":
          filter = "emp_isactive=True";
          break;
        case "inactive":
          filter = "emp_isactive=False";
          break;
        default:
          filter = "";
      }
    } else if (splitted.length == 3) {
      switch (splitted[1]) {
        case "emp_lvl":
          filter = `LEVEL_ItmIDid=${splitted[2]}`;
          break;
        case "sitelist":
          filter = `Site_Codeid=${splitted[2]}`;
          break;
        case "operation":
          filter = `EMP_TYPEid=${splitted[2]}`;
          break;
        default:
          filter = "";
      }
    }
    if (this.state.filter != filter && filter !== "") {
      this.state.filter = filter;
      this.queryHandler({});
    }
  };

  // while clicking popup close at outside click
  handleOutsideClick = (e) => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  // api call for staff
  queryHandler = async (data) => {
    this.updateState({ isLoading: true });
    let { search } = this.state;
    let { page = 1, limit = 10 } = data;
    await this.props.getStaffPlus(
      `?page=${page}&limit=${limit}${
        this.state.filter === "all"
          ? "&emp_isactive=True"
          : `&${this.state.filter}`
      }&search=${search}`
    );
    let { staffDetails } = this.props;
    let { staffList, pageMeta } = this.state;
    staffList = staffDetails.dataList;
    pageMeta = staffDetails.meta?.pagination;
    this.updateState({
      staffList,
      originalStaffList: staffList,
      pageMeta,
      isLoading: false,
    });
  };

  // pagination
  handlePagination = async (page) => {
    this.queryHandler(page);
  };

  // seach change with api call
  handleSearch = async (event) => {
    // event.persist();
    let searchString = event.target.value;
    await this.setState({ search: searchString, visible: true, page: 1 });
    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(async () => {
        this.queryHandler({});
      }, 500);
    }
    this.debouncedFn();
  };

  getDatafromStore = async (type) => {
    let { jobtitleList } = this.props;
    let { jobOption } = this.state;
    if (type === "jobtitle") {
      for (let key of jobtitleList) {
        jobOption.push({
          title: key.level_desc,
          itemId: "/operation/" + key.id,
        });
      }
    }
    await this.updateState({
      jobOption,
    });
  };

  // delete api call for staff
  handleDeleteStaff = (id) => {
    this.props.deleteStaffPlus(`${id}/`).then((res) => this.queryHandler({}));
  };

  render() {
    let {
      headerDetails,
      pageMeta,
      currentIndex,
      locationOption,
      levelList,
      jobOption,
      staffList,
      originalStaffList,
      isLoading,
      selectedMenu,
    } = this.state;
    let { t } = this.props;

    return (
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-4 col-lg-2 mb-2">
            <Link to="/admin/staffplus/schedule">
              <NormalButton
                normal={true}
                className="col-12 fs-15 float-right"
                label="Schedule"
              />
            </Link>
          </div>
          <div className="col-md-4 col-lg-2 mb-2">
            <Link to="/admin/staffplus/authorization">
              <NormalButton
                normal={true}
                className="col-12 fs-15 float-right"
                label="Authorization"
              />
            </Link>
          </div>
          <div className="col-md-4 col-lg-2 mb-2">
            <Link to="/admin/staffplus/skills">
              <NormalButton
                normal={true}
                className="col-12 fs-15 float-right"
                label="Skill Listing"
              />
            </Link>
          </div>
        </div>
        <div className="row">
          <div
            className="col-sm-12 col-lg-3 mb-4"
            style={
              this.state.isLoading
                ? { pointerEvents: "none", opacity: 0.2 }
                : {}
            }
          >
            <div className="col-md-4 p-0">
              <h4>{t("Filters")}</h4>
            </div>
            <Navigation
              activeItemId={selectedMenu}
              onSelect={({ itemId }) => this.handleFilterChange(itemId)}
              items={[
                {
                  title: t("Show Active"),
                  itemId: "/active",
                },
                {
                  title: t("Show Inactive"),
                  itemId: "/inactive",
                },
                {
                  title: t("By Emp Level"),
                  itemId: "/emplvl",
                  subNav: levelList.map((e) => {
                    return { ...e, title: t(e.title) };
                  }),
                },
                {
                  title: t("With Security Account"),
                  itemId: "/withSecurityAccount",
                },
                {
                  title: t("Without Security Account"),
                  itemId: "/withoutSecurityAccount",
                },
                {
                  title: t("By Site List"),
                  itemId: "/sitelist",
                  subNav: locationOption.map((e) => {
                    return { ...e, title: t(e.title) };
                  }),
                },
                {
                  title: t("By Operation"),
                  itemId: "/operation",
                  subNav: jobOption.map((e) => {
                    return { ...e, title: t(e.title) };
                  }),
                },
                {
                  title: t("Show All"),
                  itemId: "/all",
                },
              ]}
            />
          </div>
          <div className="staffList-container col-xl">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h3>{t("List of Staffs")}</h3>
              </div>
              <div className="col-md-8">
                <div className="d-flex justify-content-between">
                  <div className="w-100 col-8">
                    <InputSearch
                      className=""
                      placeholder="Search Staff"
                      onChange={this.handleSearch}
                    />
                  </div>
                  <div className="w-100 col-4 ml-1 p-0">
                    <NormalButton
                      mainbg={true}
                      className="col-12 fs-15 float-right"
                      label="Add Staff"
                      onClick={() =>
                        this.props.history.push("/admin/staffplus/add")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper
                    headerDetails={headerDetails}
                    queryHandler={this.handlePagination}
                    pageMeta={pageMeta}
                    sortData={originalStaffList}
                    onSort={(staffList) => this.updateState({ staffList })}
                  >
                    {isLoading ? (
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
                        (
                          {
                            id,
                            emp_name,
                            emp_phone1,
                            emp_code,
                            services,
                            site_code,
                            defaultsitecode,
                            status,
                          },
                          index
                        ) => {
                          return (
                            <tr
                              key={index}
                              onClick={() =>
                                this.props.history.push(
                                  `/admin/staffPlus/${id}/staffDetails`
                                )
                              }
                            >
                              <td className="position-relative status-type">
                                <span
                                  className={`${
                                    status === "available"
                                      ? "available"
                                      : "not-available"
                                  }`}
                                ></span>
                              </td>
                              <td>
                                <div className="d-flex align-items-start justify-content-start">
                                  {emp_name}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-start justify-content-start">
                                  {emp_phone1}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-start justify-content-start">
                                  {emp_code}
                                </div>
                              </td>
                              {/* <td><div className="d-flex align-items-center justify-content-center"></div></td> */}
                              <td>
                                <div className="d-flex align-items-start justify-content-start">
                                  {services ? services[0] : ""}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-start justify-content-start">
                                  {defaultsitecode}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-start justify-content-start">
                                  {site_code}
                                </div>
                              </td>
                              {/* <td
                                className="position-relative"
                                ref={node => {
                                  this.node = node;
                                }}
                                onClick={() => this.handleClick(index)}
                              >
                                {currentIndex === index ? (
                                  <>
                                    <div className="d-flex align-items-center justify-content-center horizontal-more-active">
                                      <i className="icon-more"></i>
                                    </div>
                                    <div className="option card">
                                      <div
                                        className="d-flex align-items-center fs-14 pt-3"
                                        onClick={() =>
                                          this.props.history.push(
                                            `/admin/staffPlus/${id}/staffDetails`
                                          )
                                        }
                                      >
                                        <span className="icon-eye-grey px-3"></span>
                                        {t("View")}
                                      </div>
                                      <div
                                        className="d-flex align-items-center fs-14"
                                        onClick={() =>
                                          this.props.history.push(
                                            `/admin/staffPlus/${id}/editStaff`
                                          )
                                        }
                                      >
                                        <span className="icon-edit px-3"></span>
                                        {t("Edit")}
                                      </div>
                                      <div
                                        className="d-flex align-items-center fs-14 pb-3"
                                        onClick={() =>
                                          this.handleDeleteStaff(id)
                                        }
                                      >
                                        <span className="icon-delete px-3"></span>
                                        {t("Delete")}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="d-flex align-items-center justify-content-center horizontal-more">
                                    <i className="icon-more text-grey"></i>
                                  </div>
                                )}
                              </td> */}
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td colSpan={12} className={`text-center`}>
                          No data Found
                        </td>
                      </tr>
                    )}
                  </TableWrapper>
                  <div className="palette">
                    <div className="color-detail">
                      <div className="color"></div>
                      <div className="detail">{t("Available today")}</div>
                    </div>
                    <div className="color-detail">
                      <div className="color not-available"></div>
                      <div className="detail">{t("Unavailable today")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  jobtitleList: state.common.jobtitleList,
  staffDetails: state.staffPlus.staffPlusDetail,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getStaffPlus,
      deleteStaffPlus,
      getJobtitle,
      getCommonApi,
    },
    dispatch
  );
};

export const ListStaffPlus = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListStaffPlusClass)
);
