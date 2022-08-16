import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  InputSearch,
  NormalSelect,
} from "component/common";
import "./style.scss";
import { withTranslation } from "react-i18next";
import { ItemDivs } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class DivisionClass extends Component {
  state = {
    headerDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Name" },
      { label: "Division is currently active" },
    ],
    List: [],
    option: [
      { label: 10, value: 10 },
      { label: 25, value: 25 },
      { label: 50, value: 50 },
      { label: 100, value: 100 },
    ],
    count: 10,
    isoption: false,
    is_loading: false,
  };

  componentDidMount = () => {
    this.Listofdivision({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofdivision = async () => {
    this.updateState({ is_loading: true });
    await this.props.ItemDivs().then((res) => {
      console.log(res);
      let { List } = this.state;

      List = res;
      console.log(List);
      this.setState({
        List,
        is_loading: false,
      });
      console.log(List.length);
    });
  };

  render() {
    let { headerDetails, List, is_loading, option, count } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid division-container">
          <div className="row">
            <div className={"itemmaster-container col-12"}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <h4 className="head-label">{t("Division List")}</h4>
                </div>
                <div className="col-md-8">
                  <div className="d-flex justify-content-between">
                    <div className="w-100 col-8">
                      <InputSearch
                        className=""
                        placeholder={t("Search")}
                        onEnter={this.handlesearch}
                      />
                    </div>
                    <div className="d-flex w-100 col-3 entries">
                      <p className="mt-2">{t("Show")}</p>
                      <div className="p-1">
                        <NormalSelect
                          options={option}
                          value={count}
                          onChange={this.temp}
                        />
                      </div>
                      <p className="mt-2">{t("Entries")}</p>
                    </div>
                    <div className=" d-flex w-100 col-4 ml-3">
                      <div className="p-1">
                        <NormalButton mainbg={true} label={"All"} />
                      </div>
                      <div className="p-1">
                        <NormalButton mainbg={true} label={"Active"} />
                      </div>
                      <div className="p-1">
                        <NormalButton mainbg={true} label={"Inactive"} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-table-content">
                <div className="py-4">
                  <div className="table-container">
                    <TableWrapper headerDetails={headerDetails}>
                      {is_loading ? (
                        <tr>
                          <td colSpan="7">
                            <div class="d-flex mt-5 align-items-center justify-content-center">
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : List.length > 0 ? (
                        List.map(({ itmCode, itmDesc, itmIsactive }, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="text-right">{itmCode}</div>
                              </td>
                              <td>
                                <div className="text-left">{itmDesc}</div>
                              </td>
                              <td>
                                <div className="text-left">
                                  {itmIsactive == true ? "yes" : "No"}
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
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      ItemDivs,
    },
    dispatch
  );
};

export const Division = withTranslation()(
  connect(null, mapDispatchToProps)(DivisionClass)
);
