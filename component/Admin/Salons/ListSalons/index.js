import React from "react";
import { NormalButton } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
// import More from '../../../../assets/images/H-more.svg'
// import MoreActive from '../../../../assets/images/H-more-blue.svg'
import "./style.scss";
import { getSaloon, deleteSaloon } from "redux/actions/saloon";
import { getBranch } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";

export class ListSalonsClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Salons Name", sortKey: true },
      { label: "Branch/Location", sortKey: true },
      { label: "Service Details", sortKey: true },
      { label: "Contact Number" },
      { label: "Opening date", sortKey: true },
      { label: "" },
    ],
    saloonList: [],
    meta: {},
    active: false,
    currentIndex: -1,
  };

  componentDidMount = () => {
    this.queryHandler({});
  };

  // popup open/close
  handleClick = key => {
    if (!this.state.active) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      active: !prevState.active,
      currentIndex: key,
    }));
  };

  // popup outside click
  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  // api call for salon
  queryHandler = data => {
    let { page = 1, limit = 10, search = "" } = data;
    this.props.getBranch(`?page=${page}&limit=${limit}`).then(res => {
      // this.props.getSaloon(`?page=${page}&limit=${limit}&search=${search}`).then((res) => {
      console.log(res, "dsfdfaafg");
      this.setState({
        saloonList: res.data.dataList,
        meta: res.data.meta.pagination,
      });
    });
  };

  // pagination
  handlePagination = page => {
    console.log(page, "dsfsdfsdfsdf");
    this.queryHandler(page);
  };

  // search input changes and api call here
  handlesearch = event => {
    console.log("sadfasdfasdf", event.target.value);
    event.persist();

    if (!this.debouncedFn) {
      this.debouncedFn = _.debounce(() => {
        let searchString = event.target.value;
        let data = { search: searchString };
        this.queryHandler(data);
      }, 500);
    }
    this.debouncedFn();
  };

  // delete api call for salon
  handleDeleteSaloon = id => {
    this.props.deleteSaloon(`${id}/`).then(res => {});
  };

  render() {
    let { headerDetails, saloonList, meta, currentIndex } = this.state;
    return (
      <>
        <div className="list-salon">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h3>List of Salons</h3>
            </div>
            <div className="col-md-5">
              <div className="d-flex">
                <div className="w-100 ml-5 mr-3">
                  <InputSearch
                    className=""
                    placeholder="Search Salons"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="w-100 col-4 p-0">
                  <NormalButton
                    mainbg={true}
                    className="col-12 fs-15 float-right add-saloon"
                    label="Add Salon"
                    onClick={() => this.props.history.push("/admin/salons/add")}
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
                  pageMeta={meta}
                >
                  {saloonList.length > 0
                    ? saloonList.map((item, index) => {
                        let {
                          ItemSite_Date,
                          itemsite_desc,
                          salon_name,
                          itemsite_phone1,
                          site_name,
                          created_at,
                          itemsite_date,
                          id,
                          images,
                          services,
                          skills,
                        } = item;
                        return (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {salon_name}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {itemsite_desc}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {skills}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {itemsite_phone1}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {itemsite_date}
                              </div>
                            </td>

                            <td
                              className="position-relative"
                              ref={node => {
                                this.node = node;
                              }}
                              onClick={() => this.handleClick(index)}
                            >
                              {this.state.active && currentIndex === index ? (
                                <>
                                  <div className="d-flex align-items-center justify-content-center horizontal-more-active">
                                    <svg
                                      width="42"
                                      height="42"
                                      viewBox="0 0 42 42"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        opacity="0.2"
                                        cx="21"
                                        cy="21"
                                        r="21"
                                        fill="#023F88"
                                      />
                                      <path
                                        d="M25.5 20.5C25.5 19.125 26.5125 18 27.75 18C28.9875 18 30 19.125 30 20.5C30 21.875 28.9875 23 27.75 23C26.5125 23 25.5 21.875 25.5 20.5ZM23.25 20.5C23.25 21.875 22.2375 23 21 23C19.7625 23 18.75 21.875 18.75 20.5C18.75 19.125 19.7625 18 21 18C22.2375 18 23.25 19.125 23.25 20.5ZM16.5 20.5C16.5 21.875 15.4875 23 14.25 23C13.0125 23 12 21.875 12 20.5C12 19.125 13.0125 18 14.25 18C15.4875 18 16.5 19.125 16.5 20.5Z"
                                        fill="#023F88"
                                      />
                                    </svg>
                                  </div>
                                  <div className="option card">
                                    <div
                                      className="d-flex align-items-center fs-16 pt-3"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/salons/${id}/salonDetails`
                                        )
                                      }
                                    >
                                      <span className="icon-eye-grey px-3"></span>{" "}
                                      View{" "}
                                    </div>
                                    <div
                                      className="d-flex align-items-center fs-16"
                                      onClick={() =>
                                        this.props.history.push(
                                          `/admin/salons/${id}/editSaloon`
                                        )
                                      }
                                    >
                                      <span className="icon-edit px-3"></span>{" "}
                                      Edit{" "}
                                    </div>
                                    <div
                                      className="d-flex align-items-center fs-16 pb-3"
                                      onClick={() =>
                                        this.handleDeleteSaloon(id)
                                      }
                                    >
                                      <span className="icon-delete px-3"></span>{" "}
                                      Delete{" "}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="d-flex align-items-center justify-content-center horizontal-more horizontal-more-befor">
                                  <svg
                                    width="18"
                                    height="42"
                                    viewBox="0 0 18 5"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M13.5 2.5C13.5 1.125 14.5125 -8.01231e-07 15.75 -8.55324e-07C16.9875 -9.09417e-07 18 1.125 18 2.5C18 3.875 16.9875 5 15.75 5C14.5125 5 13.5 3.875 13.5 2.5ZM11.25 2.5C11.25 3.875 10.2375 5 9 5C7.7625 5 6.75 3.875 6.75 2.5C6.75 1.125 7.7625 -5.06179e-07 9 -5.60272e-07C10.2375 -6.14365e-07 11.25 1.125 11.25 2.5ZM4.5 2.5C4.5 3.875 3.4875 5 2.25 5C1.0125 5 -4.91753e-08 3.875 -1.09278e-07 2.5C-1.69382e-07 1.125 1.0125 -2.11127e-07 2.25 -2.6522e-07C3.4875 -3.19313e-07 4.5 1.125 4.5 2.5Z"
                                      fill="#C4C4C4"
                                    />
                                  </svg>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    : ""}
                </TableWrapper>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getSaloon,
      deleteSaloon,
      getBranch,
    },
    dispatch
  );
};

export const ListSalons = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListSalonsClass);
