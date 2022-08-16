import React from "react";
import { NormalButton, NormalSelect, TableWrapper } from "component/common";
import { getCommonApi, commonDeleteApi } from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { history } from "helpers";

export class SmtpListClass extends React.Component {
  state = {
    headerDetails: [
      { label: "Sender Name" },
      { label: "Sender Address" },
      { label: "Site Code" },
      { label: "Port" },
      { label: "SMTP Server Host" },
      { label: "User Email" },
      { label: "" },
    ],
    SMTPList: [],
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

  // api call for staff
  queryHandler = data => {
    let { page = 1, limit = 10, search = "" } = data;
    this.props
      .getCommonApi(`smtpsettings/?page=${page}&limit=${limit}`)
      .then(res => {
        console.log(res, "dsfdfaafg", res.data.dataList);
        let { SMTPList, pageMeta } = this.state;
        SMTPList = res.data.dataList;
        pageMeta = res.data.meta.pagination;
        this.setState({
          SMTPList,
          pageMeta,
        });
      });
  };

  // pagination
  handlePagination = page => {
    this.queryHandler(page);
  };

  // delete api call for staff
  handleDeleteSMTPSetting = id => {
    this.props.commonDeleteApi(`smtpsettings/${id}/`).then(res => {
      this.queryHandler({});
      this.handleClick();
    });
  };

  render() {
    let { headerDetails, SMTPList, pageMeta, currentIndex } = this.state;
    return (
      <>
        <div className="row mb-3 mt-2">
          <div className="col-md-6">
            <div className="d-flex justify-content-start align-items-center pt-3">
              List of SMTP Settings
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
                    history.push(`/admin/settings/smtpsettings/add`)
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
            {SMTPList.length > 0
              ? SMTPList.map(
                  (
                    {
                      id,
                      sender_address,
                      sender_name,
                      site_codeid,
                      sitecode,
                      port,
                      smtp_serverhost,
                      user_email,
                      email_content,
                      email_subject,
                      email_use_ssl,
                      sms_content,
                      user_password,
                    },
                    index
                  ) => {
                    return (
                      <tr key={index}>
                        <td className="position-relative status-type">
                          <div className="text-left">{sender_name}</div>
                        </td>
                        <td>
                          <div className="text-left">{sender_address}</div>
                        </td>
                        <td>
                          <div className="text-left">{sitecode}</div>
                        </td>
                        <td>
                          <div className="text-left">{port}</div>
                        </td>
                        <td>
                          <div className="text-left">{smtp_serverhost}</div>
                        </td>
                        <td>
                          <div className="text-left">{user_email}</div>
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
                                      `/admin/settings/smtpsettings/${id}/details`
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
                                      `/admin/settings/smtpsettings/${id}/edit`
                                    )
                                  }
                                >
                                  <span className="icon-edit px-3"></span> Edit
                                </div>
                                <div
                                  className="d-flex align-items-center fs-14 pb-3"
                                  onClick={() =>
                                    this.handleDeleteSMTPSetting(id)
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

export const SmtpList = connect(
  mapStateToProps,
  mapDispatchToProps
)(SmtpListClass);
