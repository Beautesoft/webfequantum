import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "./style.scss";

class IndividualAuthorizationTableClass extends Component {
  render() {
    let { onChange, data = [] } = this.props;

    // const handleOnChange = (index1) => {
    //   data[index1].controlstatus = !data[index1].controlstatus;
    //   if (onChange) onChange(data);
    // };

    let { t } = this.props;

    return (
      <div className="maintable table-container">
        <div className="maintable-content table-responsive">
          <table className="table table-bordered rounded">
            <thead>
              <tr>
                <th className="table-header-80">
                  <div className="d-flex ml-3">
                    {t("Individual Authorizaion")}
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center">
                    {t("Yes")}
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center">
                    {t("No")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((e, index) => (
                <tr>
                  <td>
                    <label>{t(e.controldesc)}</label>
                  </td>
                  <td>
                    <div className="d-flex align-items-start justify-content-center">
                      <input
                        className="w-100"
                        type="radio"
                        name={e.controldesc}
                        checked={e.controlstatus}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <input
                        className="w-100"
                        type="radio"
                        name={e.controldesc}
                        checked={!e.controlstatus}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export const IndividualAuthorizationTable = withTranslation()(
  IndividualAuthorizationTableClass
);
