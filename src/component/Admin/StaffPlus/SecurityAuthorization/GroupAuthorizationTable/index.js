import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "./style.scss";

class GroupAuthorizationTableClass extends Component {
  render() {
    let {
      onChange,
      disabled = false,
      data = [],
      columns = [],
      rowHead = [],
    } = this.props;

    const handleOnChange = (code, controlname) => {
      if (disabled) return;
      let index1 = data.indexOf(data.find((element) => element.code == code));
      let index2 = data[index1].levels.indexOf(
        data[index1].levels.find(
          (element) => element.controlname == controlname
        )
      );
      data[index1].levels[index2].controlstatus = !data
        .find((element) => element.code == code)
        .levels.find((element) => element.controlname == controlname)
        .controlstatus;
      if (onChange) onChange(data);
    };

    if (data.length != 0) {
      columns = data.map(({ securieties, code }) => {
        return { securieties, code };
      });

      data.forEach((element) => {
        element.levels.forEach(({ controlname, controldesc }) => {
          if (!rowHead.find((e) => e.controlname == controlname))
            rowHead.push({ controlname, controldesc });
        });
      });

      rowHead.sort((a, b) => {
        if (a.controldesc > b.controldesc) return 1;
        if (a.controldesc < b.controldesc) return -1;
        return 0;
      });
    }

    let { t } = this.props;

    return (
      <div className="maintable table-container">
        <div className="maintable-content table-responsive">
          <table className="table table-bordered rounded">
            <thead>
              <tr>
                <th className="table-header-200">
                  <div className="d-flex ml-3">{t("Security Groups")}</div>
                </th>
                {columns.map((e) => (
                  <th className="table-header-150">
                    <div className="d-flex align-items-center justify-content-center">
                      {t(e.securieties)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {data.length != 0 ? (
              <tbody>
                {rowHead.map((e, index1) => (
                  <tr key={e.controlname}>
                    <td className={e.className}>{t(e.controldesc)}</td>
                    {columns.map((e2, index2) => (
                      <td>
                        {data
                          .find((element) => element.code == e2.code)
                          .levels.find(
                            (element) => element.controlname == e.controlname
                          ) ? (
                          <div className="d-flex align-items-center justify-content-center">
                            <input
                              type="checkbox"
                              checked={
                                data
                                  .find((element) => element.code == e2.code)
                                  .levels.find(
                                    (element) =>
                                      element.controlname == e.controlname
                                  ).controlstatus
                              }
                              onChange={() =>
                                handleOnChange(e2.code, e.controlname)
                              }
                            />
                          </div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
        </div>
      </div>
    );
  }
}

export const GroupAuthorizationTable = withTranslation()(
  GroupAuthorizationTableClass
);
