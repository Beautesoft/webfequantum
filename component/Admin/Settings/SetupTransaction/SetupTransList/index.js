import React from "react";
import { NormalButton, NormalSelect, TableWrapper } from "component/common";
import { getCommonApi, commonDeleteApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { history } from "helpers";

export class SetupTransListClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Logo", divClass: "justify-content-center" },
      { label: "Title" },
      { label: "Site" },
      { label: "GST No." },
      { label: "Header 1" },
      { label: "Header 2" },
      { label: "" },
    ],
    setupTransList: [],
    pageMeta: {},
    active: false,
    currentIndex: -1,
  };

  componentDidMount() {
    this.queryHandler({});
  }

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

  // while clicking popup close at outside click
  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  // api call for list
  queryHandler = data => {
    let { page = 1, limit = 10, search = "" } = data;
    this.props.getCommonApi(`title/?page=${page}&limit=${limit}`).then(res => {
      console.log(res, "dsfdfaafg", res.data.dataList);
      let { setupTransList, pageMeta } = this.state;
      setupTransList = res.data.dataList;
      pageMeta = res.data.meta.pagination;
      this.setState({
        setupTransList,
        pageMeta,
      });
    });
  };

  // pagination
  handlePagination = page => {
    this.queryHandler(page);
  };

  // delete api call for staff
  handleDeleteSetupTransaction = id => {
    this.props.commonDeleteApi(`title/${id}/`).then(res => {
      this.queryHandler({});
      this.handleClick();
    });
  };

  render() {
    let { headerDetails, setupTransList, pageMeta, currentIndex } = this.state;
    return (
      <>
        <div className="row mb-3 mt-2">
          <div className="col-md-6">
            <div className="d-flex justify-content-start align-items-center pt-3">
              List of Setup Transaction
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-end">
              <div className="w-100 col-3 p-0">
                <NormalButton
                  mainbg={true}
                  className="col-12 fs-15 float-right"
                  label="Add New"
                  onClick={() =>
                    history.push(`/admin/settings/setuptransaction/add`)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="table-container table-responsive">
          <TableWrapper
            headerDetails={headerDetails}
            queryHandler={this.handlePagination}
            pageMeta={pageMeta}
          >
            {setupTransList.length > 0
              ? setupTransList.map(
                  (
                    {
                      id,
                      title,
                      logo_pic,
                      site_id,
                      product_license,
                      gst_reg_no,
                      trans_h1,
                      trans_h2,
                      trans_footer1,
                      trans_footer2,
                      trans_footer3,
                      trans_footer4,
                    },
                    index
                  ) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center justify-content-center">
                            <img
                              src={logo_pic ? logo_pic : null}
                              width="45px"
                              height="30px"
                              alt=""
                            />
                          </div>
                        </td>
                        <td>
                          <div className="text-left">{title}</div>
                        </td>
                        <td>
                          <div className="text-left">{product_license}</div>
                        </td>
                        <td>
                          <div className="text-left">{gst_reg_no}</div>
                        </td>
                        <td>
                          <div className="text-left">{trans_h1}</div>
                        </td>
                        <td>
                          <div className="text-left">{trans_h2}</div>
                        </td>
                        <td
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
                                    history.push(
                                      `/admin/settings/setuptransaction/${id}/details`
                                    )
                                  }
                                >
                                  <span className="icon-eye-grey px-3"></span>
                                  View
                                </div>
                                <div
                                  className="d-flex align-items-center fs-14"
                                  onClick={() =>
                                    history.push(
                                      `/admin/settings/setuptransaction/${id}/edit`
                                    )
                                  }
                                >
                                  <span className="icon-edit px-3"></span> Edit
                                </div>
                                <div
                                  className="d-flex align-items-center fs-14 pb-3"
                                  onClick={() =>
                                    this.handleDeleteSetupTransaction(id)
                                  }
                                >
                                  <span className="icon-delete px-3"></span>
                                  Delete
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="d-flex align-items-center justify-content-center horizontal-more">
                              <i className="icon-more text-grey" />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )
              : null}
          </TableWrapper>
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
      getCommonApi,
      commonDeleteApi,
    },
    dispatch
  );
};

export const SetupTransList = connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupTransListClass);
