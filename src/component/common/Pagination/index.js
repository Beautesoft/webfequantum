import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class PaginationClass extends Component {
  render() {
    let {
      current_page = 1,
      per_page = 10,
      total_pages = 1,
      total = 1,
    } = this.props.pageMeta || {};
    let { t } = this.props;
    if (total_pages <= 1) {
      return "";
    }
    // console.log(this.props.pageMeta, "sdfsadfasdfasdf")
    return this.props.pageMeta ? (
      <div className="d-flex text-center w-100 justify-content-end table-pagination pr-4 py-3 ">
        <p className="m-0 d-flex align-items-center font-sm list-page">
          <button
            className={`btn-effect ${
              Number(current_page) === 1 ? "disable" : ""
            } table-left-arrow previous-button`}
            disabled={Number(current_page) === 1}
            onClick={(e) =>
              Number(current_page) !== 1 &&
              this.props.handlePagination(
                Number(current_page) !== 0 ? Number(current_page) - 1 : 0
              )
            }
          >
            {t("Previous")}
            <span className="icon-Group-4 font-md cursor-pointer" />
          </button>
          {(Number(current_page) === Number(total_pages) ||
            Number(total_pages) < 3) &&
          Number(current_page) !== 1 ? (
            <span
              onClick={(e) => this.props.handlePagination(1)}
              className="page-number cursor-pointer"
            >
              {1}
            </span>
          ) : (
            ""
          )}
          <span
            onClick={(e) =>
              Number(current_page) !== Number(total_pages) &&
              this.props.handlePagination(Number(current_page) + 1)
            }
            className="active page-number cursor-pointer"
          >
            {Number(current_page)}
          </span>
          {Number(current_page) + 1 > Number(total_pages) ? (
            ""
          ) : (
            <span
              onClick={(e) =>
                Number(current_page) !== Number(total_pages)
                  ? this.props.handlePagination(Number(current_page) + 1)
                  : ""
              }
              className="page-number cursor-pointer"
            >
              {Number(current_page) + 1}
            </span>
          )}
          {Number(current_page) + 2 > Number(total_pages) ? (
            ""
          ) : (
            <span
              onClick={(e) =>
                Number(current_page) !== Number(total_pages) &&
                this.props.handlePagination(Number(current_page) + 2)
              }
              className="page-number cursor-pointer"
            >
              {Number(current_page) + 2}
            </span>
          )}

          <button
            className={`btn-effect ${
              Number(current_page) === Number(total_pages) ? "disable" : ""
            } table-right-arrow next-button`}
            disabled={Number(current_page) === Number(total_pages)}
            onClick={(e) =>
              Number(current_page) !== Number(total_pages) &&
              this.props.handlePagination(
                Number(current_page) !== Number(total_pages)
                  ? Number(current_page) + 1
                  : Number(total_pages)
              )
            }
          >
            {t("Next")}
            <span className="font-md icon-Group-4 cursor-pointer" />
          </button>
        </p>
      </div>
    ) : (
      ""
    );
  }
}

export const Pagination = withTranslation()(PaginationClass);
