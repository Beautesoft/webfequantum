import React from "react";
import { NormalButton, NormalModal, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";

export class SettingsClass extends React.Component {
  state = {
    dataList: [
      {
        field: "Name",
        mandatory: true,
        register: true,
        edit: true,
        listing: true,
      },
      {
        field: "DOB",
        mandatory: true,
        register: true,
        edit: true,
        listing: true,
      },
      {
        field: "Address",
        mandatory: true,
        register: true,
        edit: true,
        listing: true,
      },
      {
        field: "NRIC",
        mandatory: true,
        register: true,
        edit: false,
        listing: true,
      },
    ],
    meta: {},
    currentIndex: -1,
    tableHeader: [
      { label: "Field Name", sortKey: "field" },
      {
        label: "Mandatory",
        sortKey: "mandatory",
        divClass: "justify-content-center",
      },
      {
        label: "Show in Register",
        sortKey: "register",
        divClass: "justify-content-center",
      },
      {
        label: "Show in Edit",
        sortKey: "edit",
        divClass: "justify-content-center",
      },
      {
        label: "Show in Listing",
        sortKey: "listing",
        divClass: "justify-content-center",
      },
    ],
  };

  handleSearch = event => {};

  handlePagination = page => {
    console.log(page, "dsfsdfsdfsdf");
  };

  render() {
    let { dataList, meta, tableHeader } = this.state;
    return (
      <>
        <div className="col">
          <div className="row align-items-center mb-4">
            <div className="col">
              <div className="d-flex">
                <div className="w-100 mr-5">
                  <InputSearch
                    className=""
                    placeholder="Search Field"
                    onChange={this.handlesearch}
                  />
                </div>

                <div className="w-100 col-4 p-0">
                  <NormalButton
                    mainbg={true}
                    className="col-12 fs-15 float-right"
                    label="Save"
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <div className="table-container">
              <TableWrapper
                headerDetails={tableHeader}
                queryHandler={this.handlePagination}
                pageMeta={meta}
                parentHeaderChange={value =>
                  this.setState(() => (tableHeader = value))
                }
              >
                {dataList
                  ? dataList.map((item, index) => {
                      let { field, edit, listing, mandatory, register } = item;
                      console.log(tableHeader[0]);
                      return (
                        <tr key={index}>
                          <td
                            className={
                              tableHeader[0].enabled ?? true ? "" : "d-none"
                            }
                          >
                            <div className="text-left">{field}</div>
                          </td>
                          <td
                            className={
                              tableHeader[3].enabled ?? true ? "" : "d-none"
                            }
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <input
                                type="checkbox"
                                checked={mandatory}
                                onClick={() => {
                                  dataList[index].mandatory = !mandatory;
                                  this.setState({ dataList });
                                }}
                              />
                            </div>
                          </td>
                          <td
                            className={
                              tableHeader[3].enabled ?? true ? "" : "d-none"
                            }
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <input
                                type="checkbox"
                                checked={register}
                                onClick={() => {
                                  dataList[index].register = !register;
                                  this.setState({ dataList });
                                }}
                              />
                            </div>
                          </td>
                          <td
                            className={
                              tableHeader[3].enabled ?? true ? "" : "d-none"
                            }
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <input
                                type="checkbox"
                                checked={edit}
                                onClick={() => {
                                  dataList[index].edit = !edit;
                                  this.setState({ dataList });
                                }}
                              />
                            </div>
                          </td>
                          <td
                            className={
                              tableHeader[3].enabled ?? true ? "" : "d-none"
                            }
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <input
                                type="checkbox"
                                checked={listing}
                                onClick={() => {
                                  dataList[index].listing = !listing;
                                  this.setState({ dataList });
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </TableWrapper>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export const Settings = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SettingsClass)
);
