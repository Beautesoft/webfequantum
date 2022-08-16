import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class ScheduleTableClass extends Component {
  render() {
    let {
      onChange,
      onAltChange,
      data = {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      altws_data = {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      optionList = [],
      disabled = false,
      t,
    } = this.props;

    const handleOnClick = name => {
      debugger;
      let sections = document.querySelectorAll(".dropdown-content");
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("show");
        // querySelectorAll return an array of dom elements, u can access them directly.
      }

      if (this.props.disabled ?? false) return;
      else document.getElementById(name).classList.toggle("show");
    };

    const handOnOptionClick = (index, value) => {
      debugger;
      let sections = document.querySelectorAll(".dropdown-content");
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("show");
        // querySelectorAll return an array of dom elements, u can access them directly.
      }
      if (disabled) return;
      data[index] = value;
      onChange(data);
    };
    const handALTOnOptionClick = (index, value) => {
      let sections = document.querySelectorAll(".dropdown-content");
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("show");
        // querySelectorAll return an array of dom elements, u can access them directly.
      }
      if (disabled) return;
      altws_data[index] = value;
      onAltChange(altws_data);
    };
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr className="table-header-color">
              <th></th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
              <th>Sun</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table-header-color">WS</td>
              {Object.keys(data).map(function (keyName) {
                return (
                  <td
                    key={"ws" + keyName}
                    onClick={() => handleOnClick("ws" + keyName)}
                    style={{
                      backgroundColor:
                        optionList.find(val => val.value == data[keyName]) !=
                        null
                          ? optionList.find(val => val.value == data[keyName])
                              .color
                          : "white",
                      cursor: "pointer",
                    }}
                  >
                    {t(
                      optionList.find(val => val.value == data[keyName])
                        ?.shortDesc ?? "None"
                    )}
                    <div id={"ws" + keyName} class="dropdown-content">
                      {optionList.map(val => {
                        return (
                          <label
                            style={{ cursor: "pointer" }}
                            key={"ws" + val.id}
                            onDoubleClick={() =>
                              handOnOptionClick(keyName, val.value)
                            }
                          >
                            {t(val.label)}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="table-header-color">ALTWS</td>
              {Object.keys(altws_data).map(function (keyName) {
                return (
                  <td
                    key={"alt" + keyName}
                    onClick={() => handleOnClick("alt" + keyName)}
                    style={{
                      backgroundColor:
                        optionList.find(
                          val => val.value == altws_data[keyName]
                        ) != null
                          ? optionList.find(
                              val => val.value == altws_data[keyName]
                            ).color
                          : "white",
                      cursor: "pointer",
                    }}
                  >
                    {t(
                      optionList.find(val => val.value == altws_data[keyName])
                        ?.shortDesc ?? "None"
                    )}
                    <div id={"alt" + keyName} class="dropdown-content">
                      {optionList.map(val => {
                        return (
                          <label
                            key={"alt" + val.id}
                            onClick={() => {}}
                            onDoubleClick={() =>
                              handALTOnOptionClick(keyName, val.value)
                            }
                          >
                            {t(val.label)}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export const ScheduleTable = withTranslation()(ScheduleTableClass);
