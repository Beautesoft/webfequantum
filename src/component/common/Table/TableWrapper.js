import React, { Component } from "react";
import { Pagination } from "../index";
import PropTypes from "prop-types";
import { scrollTop, appendQuery } from "service/helperFunctions";
import { withTranslation } from "react-i18next";
import "assets/scss/components/table.scss";
import { NormalCheckbox } from "../NormalCheckbox";

class TableWrapperClass extends Component {
  state = {
    currentSortKeyDetails: null,
  };

  componentDidMount() {
    let { field = "", orderBy = "" } = this.props;
    if (field && orderBy) {
      this.setState({
        currentSortKeyDetails: { sortKey: field, orderBy },
      });
    }
  }

  getPlaceHolder = () => {
    let { placeHolder = "No data found" } = this.props;
    if (typeof placeHolder === "function") {
      return placeHolder();
    }

    return <p className="text-center">{placeHolder}</p>;
  };

  handlePagination = page => {
    let { queryHandler, scrollProps = "" } = this.props;
    console.log(page, "dsfsdfsdfsdf");
    queryHandler({ page: page });
    // .then(() => {
    //   scrollTop(...scrollProps);
    // })
    // .catch(err => {
    //   console.log('Error:::' + err);
    // });
  };

  handleFilter = sortKey => {
    console.log("queryHandler ===", sortKey);
    let { queryAppend = true } = this.props;
    if (!sortKey) {
      return "";
    }
    let currentSortKeyDetails = Object.assign(
      {},
      this.state.currentSortKeyDetails
    );
    if (!currentSortKeyDetails || currentSortKeyDetails.sortKey !== sortKey) {
      currentSortKeyDetails = {
        sortKey,
        orderBy: "asc",
      };
    } else {
      if (currentSortKeyDetails.orderBy !== "desc") {
        currentSortKeyDetails.orderBy = "desc";
      } else {
        currentSortKeyDetails = null;
      }
    }

    let { sortKey: key = "", orderBy = "" } = currentSortKeyDetails || {};
    if (queryAppend) {
      appendQuery([
        { label: "field", value: key },
        { label: "orderBy", value: orderBy },
      ]);
    }
    console.log("queryHandler ===", currentSortKeyDetails, sortKey);
    this.setState(
      {
        currentSortKeyDetails,
      },
      () => !queryAppend && this.handleFilterAPI()
    );
  };

  handleFilterAPI = () => {
    let { sortKey = null, orderBy = null } =
      this.state.currentSortKeyDetails || {};
    let { queryHandler } = this.props;
    if (queryHandler) {
      let sort = {
        field: sortKey,
        orderBy,
      };
      console.log("queryHandler ===", sort);
      queryHandler({ sort });
    }
  };

  render() {
    let {
      headerDetails,
      children,
      pageMeta,
      isEmpty = false,
      className = "",
      overFlow = true,
      clickFunc,
      t,
    } = this.props;
    let { sortKey: currentSortKey, orderBy = "" } =
      this.state.currentSortKeyDetails || {};

    return (
      <div className="maintable table-container">
        <div
          className={`maintable-content ${
            overFlow ? "table-responsive" : ""
          } ${className}`}
        >
          <table className="table rounded">
            <thead>
              <tr>
                {headerDetails.map(
                  (
                    {
                      label,
                      className,
                      divClass = "",
                      sortKey = "",
                      element,
                      width = "",
                      singleClickFunc,
                      dblclickFunc,
                      checkboxChange,
                      selectAll,
                      selectAllCheck,
                    },
                    index
                  ) => {
                    return (
                      <th
                        className={className}
                        key={index}
                        style={{
                          minWidth: width
                            ? width
                            : label.length * 10 + 50 + "px",
                        }}
                      >
                        <div
                          className={`d-flex px-2 ${
                            sortKey && "cursor-pointer"
                          } ${divClass}`}
                          onClick={singleClickFunc}
                          onDoubleClick={dblclickFunc}
                        >
                          {selectAll ? (
                            <NormalCheckbox
                              name="selectAllCheck"
                              onChange={checkboxChange}
                              checked={selectAllCheck}
                              type="checkbox"
                              className={`cursor-pointer d-flex m-1`}
                              icon={false}
                            />
                          ) : null}
                          {t(label)}

                          {element && element()}
                          {sortKey ? (
                            <div
                              className={`d-flex table-filter ml-2 mb-1 ${
                                currentSortKey === sortKey && "active-filter"
                              }`}
                            >
                              <span
                                className={`icon-sort-up fs-14 ${
                                  currentSortKey === sortKey &&
                                  orderBy === "asc" &&
                                  "active"
                                }`}
                              />
                              <span
                                className={`icon-sort-down fs-14 ${
                                  currentSortKey === sortKey &&
                                  orderBy === "desc" &&
                                  "active"
                                }`}
                              />
                            </div>
                          ) : null}
                        </div>
                      </th>
                    );
                  }
                )}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
          {/* {!isEmpty ? <div className="no-data">{this.getPlaceHolder()}</div> : ''} */}
        </div>
        {pageMeta && (
          <Pagination
            handlePagination={this.handlePagination}
            pageMeta={pageMeta}
          />
        )}
      </div>
    );
  }
}

TableWrapperClass.propTypes = {
  placeHolder: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isEmpty: PropTypes.bool,
  headerDetails: PropTypes.array.isRequired,
  pageMeta: PropTypes.object,
};

export const TableWrapper = withTranslation()(TableWrapperClass);
