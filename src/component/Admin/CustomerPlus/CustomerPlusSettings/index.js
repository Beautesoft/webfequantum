import React from "react";
import { NormalButton, NormalInput, NormalSelect } from "component/common";
import {
  getCustomerPlusSettings,
  updateCustomerPlusSettings,
} from "redux/actions/customerPlus";
import { InputSearch, TableWrapper } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export class SettingsClass extends React.Component {
  state = {
    dataList: [],
    originalData: [],
    tableHeader: [
      { label: "Field Name", sortKey: "display_field_name", width: 220 },
      {
        label: "Mandatory",
        sortKey: "mandatory",
        divClass: "justify-content-center",
      },
      {
        label: "Show in Register",
        sortKey: "visible_in_registration",
        divClass: "justify-content-center",
      },
      {
        label: "Show in Profile",
        sortKey: "visible_in_profile",
        divClass: "justify-content-center",
      },
      {
        label: "Show in Listing",
        sortKey: "visible_in_listing",
        divClass: "justify-content-center",
      },
      {
        label: "Show Label",
        sortKey: "showLabel",
        divClass: "justify-content-center",
      },
    ],
    isLoading: true,
    isMounted: true,
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  componentDidMount() {
    this.loadData();
  }

  handleSearch = event => {
    let { originalData, dataList } = this.state;
    dataList = originalData.filter(
      e =>
        e.display_field_name
          .toLocaleLowerCase()
          .includes(event.target.value.toLocaleLowerCase()) ||
        e.field_name
          .toLocaleLowerCase()
          .includes(event.target.value.toLocaleLowerCase())
    );
    this.updateState({ dataList });
  };

  loadData = async () => {
    this.updateState({ isLoading: true });
    await this.props.getCustomerPlusSettings();
    let { dataList } = this.props;
    this.updateState({ dataList, originalData: dataList, isLoading: false });
  };

  handleSubmit = async () => {
    this.updateState({ isLoading: true });
    let { dataList } = this.state;
    if (dataList.length == 0) return;
    let reqData = { customerControlList: dataList };
    await this.props.updateCustomerPlusSettings(JSON.stringify(reqData));
    this.loadData();
  };

  render() {
    let { dataList, tableHeader, isLoading } = this.state;
    let { t } = this.props;
    return (
      <div className="container-fluid">
        <div className="col-md-12 mb-4 p-0">
          <h3 className="head-label">{t("Customer Plus Settings")}</h3>
        </div>
        <div className="row align-items-center mb-4">
          <div className="col">
            <div className="d-flex">
              <div className="w-100 mr-5">
                <InputSearch
                  className=""
                  placeholder="Search Field"
                  onChange={this.handleSearch}
                />
              </div>
              <div className="w-100 col-3 p-0 mr-2">
                <Link to="/admin/customerplus/settings/layout">
                  <NormalButton
                    mainbg={true}
                    className="col-12 fs-15 float-right"
                    label="Edit Layout"
                  />
                </Link>
              </div>
              <div className="w-100 col-3 p-0">
                <NormalButton
                  mainbg={true}
                  className="col-12 fs-15 float-right"
                  label="Save"
                  onClick={this.handleSubmit}
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
              parentHeaderChange={value =>
                this.updateState(() => (tableHeader = value))
              }
              sortData={this.state.originalData}
              onSort={list => this.updateState({ dataList: list })}
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
              ) : dataList ? (
                dataList.map((item, index) => {
                  let {
                    display_field_name,
                    visible_in_profile,
                    visible_in_listing,
                    mandatory,
                    visible_in_registration,
                    showLabel,
                  } = item;
                  return (
                    <tr key={index}>
                      <td
                        className={
                          tableHeader[0].enabled ?? true ? "" : "d-none"
                        }
                      >
                        <div className="text-left">{display_field_name}</div>
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
                              this.updateState({ dataList });
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
                            checked={visible_in_registration}
                            onClick={() => {
                              dataList[index].visible_in_registration =
                                !visible_in_registration;
                              this.updateState({ dataList });
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
                            checked={visible_in_profile}
                            onClick={() => {
                              dataList[index].visible_in_profile =
                                !visible_in_profile;
                              this.updateState({ dataList });
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
                            checked={visible_in_listing}
                            onClick={() => {
                              dataList[index].visible_in_listing =
                                !visible_in_listing;
                              this.updateState({ dataList });
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
                            checked={showLabel}
                            onClick={() => {
                              dataList[index].showLabel = !showLabel;
                              this.updateState({ dataList });
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : null}
            </TableWrapper>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dataList: state.customerPlus.customerPlusSettings,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCustomerPlusSettings,
      updateCustomerPlusSettings,
    },
    dispatch
  );
};

export const Settings = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SettingsClass)
);
